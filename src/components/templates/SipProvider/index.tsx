/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import moment from "moment";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as sdpTransform from "sdp-transform";
import {
  UserAgent,
  URI,
  UserAgentOptions,
  Registerer,
  Inviter,
  Invitation,
  SessionState,
  Session,
  InviterOptions,
  InvitationAcceptOptions,
} from "sip.js";
import { callAudioConstraints, iceServers, validAudioCodecs } from "utils/constants";
import { isArray, pushNotifications } from "utils/functions";

type TypeTranfer = "BLIND" | "ATTENDED";

export type CallConnect = "connecting" | "connected" | "accept" | "dial";
type CallState = "callout" | "callin" | "none";

interface SipCredentials {
  authorizationUsername: string;
  authorizationPassword: string;
  displayName: string;
  domain: string;
  serverUrl: string;
  protocolSip: string;
  sipPort: string;
}

interface SipContextData {
  connect: (credentials: SipCredentials) => void;
  unregister: () => void;
  makeCall: (destination: string) => void;
  register: () => void;
  AcceptCall: () => void;
  hangupCall: () => void;
  sendDTMF: (signalNumber: string, duration: number) => void;
  setExternalNumber: (number: string) => void;
  handleSetStateCall: (any: CallState) => void;
  handleSetStateConnect: (any: CallConnect) => void;
  handleSetCustomerName: (any: string) => void;
  transfer: (destination: string, typeTranfer: TypeTranfer) => void;
  stateCall: CallState;
  stateConnect: CallConnect;
  externalNumber: string;
  isReceivedCall: boolean;
  currentCall: boolean;
}

interface SipProviderProps {
  children?: React.ReactNode;
}

export const callEventDefaultOptions = {
  sessionDescriptionHandlerModifiers: [
    function (description: any) {
      try {
        let sdpObj = sdpTransform.parse(description.sdp);
        sdpObj.media.forEach((media: any) => {
          let validCodecs: any = [];

          const groupBy = (items: any[], key: string) =>
            items.reduce(
              (result, item) => ({
                ...result,
                [item[key]]: [...(result[item[key]] || []), item],
              }),
              {}
            );
          media.rtp = Object.values(groupBy(media.rtp, "codec"))
            .map((value: any) =>
              value.sort((a: any, b: any) => a.rate - b.rate)
            )
            .flat();

          validAudioCodecs.default.forEach((validCodec) => {
            media.rtp
              .filter((i: any) => i.codec.toLowerCase() === validCodec)
              .forEach((codec: { rate: number }) => {
                if (codec.rate <= 8000) validCodecs.push(codec);
              });
          });
          media.protocol = "RTP/SAVPF";
          media.rtp = validCodecs;
          if (isArray(media.fmtp, true) && media.fmtp[0]) {
            let { config } = media.fmtp[0];
            media.fmtp = [
              {
                config: /[;=\/]/.test(config) ? "" : config,
                payload: validCodecs[0].payload,
              },
            ];
          }
          if (isArray(media.rtcpFb, true) && media.rtcpFb[0]) {
            media.rtcpFb = [
              {
                ...media.rtcpFb[0],
                payload: validCodecs[0].payload,
              },
            ];
          }
          media.payloads = validCodecs.map((i: any) => i.payload).join(" ");
        });
        let sdtStr = sdpTransform.write(sdpObj);
        description.sdp = sdtStr;
      } catch (error) {
        console.log("[DEBUG] sdpModifiers -> error", error);
      }
      return Promise.resolve(description);
    },
  ],
};

const SipContext = createContext<SipContextData>({} as SipContextData);

const SipProvider: React.FC<SipProviderProps> = ({ children }) => {
  const [agent, setAgent] = useState<UserAgent>({} as UserAgent);
  const [stateExtension, setStateExtension] = useState("DISCONNECTED");
  const [stateConnect, setstateConnect] = useState<CallConnect>("connecting");
  const [stateCall, setstateCall] = useState<CallState>("none");
  const [server, setServer] = useState("");
  const [domainClone, setDomain] = useState("");
  const [externalNumber, setExternalNumber] = useState("");
  const [isReceivedCall, setIsReceivedCall] = useState(false);
  const [session, setSession] = useState<Session>({} as Session);
  const [currentCall, setCurrentCall] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const remoteStream = new MediaStream();
  const remoteHTMLMediaElement = document.getElementById('audio_remote') as HTMLAudioElement;
  const remoteHTMLMediaElementIncoming = document.getElementById('incoming') as HTMLAudioElement;
  const remoteHTMLMediaElementOutgoing = document.getElementById('outgoing') as HTMLAudioElement;
  const reconnectionAttempts = 1;
  const reconnectionDelay = 1;
  let attemptingReconnection = false;
  let shouldBeConnected = true;

  let constrainsDefault: MediaStreamConstraints = {
    audio: true,
    video: false,
  };

  const optionAccept: InvitationAcceptOptions = {
    sessionDescriptionHandlerOptions: {
      constraints: constrainsDefault,
    },
  };

  const onConnect = useCallback(() => {
    setStateExtension("CONNECTED");
  }, []);

  const onDisconnect = useCallback((error?: Error) => {
    setStateExtension("DISCONNECTED");
    const registerAgent = new Registerer(agent);
    registerAgent.unregister()
      .catch((e: Error) => {
        console.error("🚀 ~ file: index.tsx:185 ~ onDisconnect ~ e:", e)
      });
    // Only attempt to reconnect if network/server dropped the connection (if there is an error)
    if (error) {
      attemptReconnection();
    }
  }, []);

  const onRegister = useCallback(() => {
    setStateExtension("REGISTERED");
  }, []);

  const onInvite = useCallback(
    (invitation: Invitation) => {
      if (currentCall) {
        invitation.reject();
        return;
      }
      console.log("🚀 ~ invitation.request.from:", invitation.request.from)
      pushNotifications("Coming Call", `KH: ${invitation.request.from.displayName}`, () => { });
      setExternalNumber(invitation.request.from.displayName);
      setSession(invitation);
      setIsReceivedCall(true);
      setCurrentCall(true);
      setstateCall("callin");
      setstateConnect("connected");
    },
    [currentCall]
  );

  const setupRemoteMedia = useCallback((sessionCurrent: Session) => {
    let pc = (sessionCurrent as any).sessionDescriptionHandler.peerConnection.getReceivers();
    if (!pc) return;
    pc?.forEach((receiver: any) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track);
      }
    });
    remoteHTMLMediaElement.srcObject = remoteStream;
    remoteHTMLMediaElement.play();
  }, [])

  const cleanRemoteMedia = useCallback(() => {
    remoteHTMLMediaElement?.pause();
    (remoteHTMLMediaElement as any).srcObject = null;
  }, [])

  useEffect(() => {
    try {
      if (Object?.values(session)?.length > 0) {
        session.stateChange.addListener((newState: SessionState) => {
          switch (newState) {
            case SessionState.Initial:
              console.log(`🚀 Cuộc gọi đã bắt đầu. ${moment(new Date()).format("HH:mm:ss -DD/MM")}`);
              setstateConnect("connecting");
              break;
            case SessionState.Establishing:
              console.log(`🚀 Cuộc gọi đang được thiết lập. - ${moment(new Date()).format("HH:mm:ss -DD/MM")}`);
              setstateConnect("connected");
              if (stateCall === 'callout') {
                remoteHTMLMediaElementOutgoing?.play();
              }
              if (stateCall === 'callin') {
                remoteHTMLMediaElementIncoming?.play();
              }
              break;
            case SessionState.Established:
              console.log(`🚀 Chấp nhận cuộc gọi. - ${moment(new Date()).format("HH:mm:ss -DD/MM")}`);
              setupRemoteMedia(session);
              setstateConnect("accept");
              if (customerName === 'unkown' && currentCall) {
                window.history.pushState(null, '', `/customer-not-found/${externalNumber}`);
              } else if (customerName !== 'unkown' && currentCall) {
                window.history.pushState(null, '', `/customer-info/phone/${externalNumber}/history-interaction`);
              }
              if (stateCall === 'callout') {
                remoteHTMLMediaElementOutgoing?.pause();
              }
              if (stateCall === 'callin') {
                remoteHTMLMediaElementIncoming?.pause();
              }
              break;
            case SessionState.Terminated:
              console.log(`🚀 Kết thúc cuộc gọi. - ${moment(new Date()).format("HH:mm:ss -DD/MM")}`);
              cleanRemoteMedia();
              setstateConnect("connecting");
              setstateCall("none");
              setExternalNumber("");
              setIsReceivedCall(false);
              setCurrentCall(false);
              cleanRemoteMedia();
              if (stateCall === 'callout') {
                remoteHTMLMediaElementOutgoing?.pause();
              }
              if (stateCall === 'callin') {
                remoteHTMLMediaElementIncoming?.pause();
              }
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error)
    }
  }, [session]);

  const register = useCallback(() => {
    try {
      const registerAgent = new Registerer(agent);
      registerAgent.register().then(() => setStateExtension("CONNECTED"));
    } catch (e) {
      setStateExtension("DISCONNECTED");
    }
  }, [agent]);

  const unregister = useCallback(() => {
    const registerAgent = new Registerer(agent);
    registerAgent.unregister().then(() => {
      setCurrentCall(false);
      setStateExtension("DISCONNECTED");
    });
  }, [agent]);

  const connect = useCallback(
    async ({
      authorizationPassword,
      authorizationUsername,
      domain,
      displayName,
      serverUrl,
    }: SipCredentials) => {
      const uri = UserAgent.makeURI(`sip:${authorizationUsername}@${domain}`) || ({} as URI);
      const userAgentOptions: UserAgentOptions = {
        logBuiltinEnabled: false,
        displayName,
        authorizationPassword,
        authorizationUsername,
        uri,
        userAgentString: `${authorizationUsername} of ${displayName}`,
        transportOptions: { server: serverUrl, },
        contactParams: { transport: "wss" },
        sessionDescriptionHandlerFactoryOptions: {
          constraints: callAudioConstraints,
          peerConnectionConfiguration: {
            iceServers,
          },
        },
        reconnectionAttempts: 5,
        delegate: {
          onConnect,
          onDisconnect,
          onRegister,
          onInvite,
        },
      };
      const userAgent = new UserAgent(userAgentOptions);
      const registerer = new Registerer(userAgent);
      await userAgent.start().then(() => {
        registerer.register();
      });
      setServer(serverUrl);
      setDomain(domain);
      setAgent(userAgent);
    }, []);

  const attemptReconnection = (reconnectionAttempt = 1): void => {
    // If not intentionally connected, don't reconnect.
    if (!shouldBeConnected) {
      return;
    }

    // Reconnection attempt already in progress
    if (attemptingReconnection) {
      return;
    }

    // Reconnection maximum attempts reached
    if (reconnectionAttempt > reconnectionAttempts) {
      return;
    }

    // We're attempting a reconnection
    attemptingReconnection = true;

    setTimeout(() => {
      // If not intentionally connected, don't reconnect.
      if (!shouldBeConnected) {
        attemptingReconnection = false;
        return;
      }
      // Attempt reconnect
      agent.reconnect()
        .then(() => {
          // Reconnect attempt succeeded
          attemptingReconnection = false;
        })
        .catch((error: Error) => {
          // Reconnect attempt failed
          attemptingReconnection = false;
          attemptReconnection(++reconnectionAttempt);
        });
    }, reconnectionAttempt === 1 ? 0 : reconnectionDelay * 1000);
  };

  const makeCall = useCallback(
    async (destination: string) => {
      try {
        const inviterOptions: InviterOptions = { earlyMedia: true, inviteWithoutSdp: false, };
        const targetURI = UserAgent.makeURI(`sip:${destination}@${domainClone}`) || ({} as URI);
        const inviter = new Inviter(agent, targetURI, inviterOptions);
        await inviter.invite()
          .then(() => {
            setExternalNumber(destination);
            setSession(inviter);
            setstateCall("callout");
            setCurrentCall(true);
          })
          .catch((error: Error) => {
            console.log("🚀 ~ makeCall -> error:", error)
          });
      } catch (error) {
        console.log("🚀 ~ file: index.tsx:244 ~ error:", error);
      }
    },
    [agent, domainClone]
  );

  const AcceptCall = useCallback(() => {
    try {
      let constrainsDefault: MediaStreamConstraints = {
        audio: true,
        video: false,
      }

      const options: InvitationAcceptOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: constrainsDefault,
        },
      };
      (session as Invitation).accept(options);
      if (customerName === 'unkown' && currentCall) {
        window.history.pushState(null, '', `/customer-not-found/${externalNumber}`);
      } else if (customerName !== 'unkown' && currentCall) {
        window.history.pushState(null, '', `/customer-info/phone/${externalNumber}/history-interaction`);
      }
      setSession(session);
      setstateConnect("accept");
    } catch (error) {
      console.log(`🚀 : acceptCall -> error`, error);
    }
  }, [optionAccept, session]);

  const transfer = useCallback(
    (destination: string, typeTranfer: TypeTranfer) => {
      const target =
        UserAgent.makeURI(`sip:${destination}@${domainClone}`) || ({} as URI);
      if (typeTranfer === "BLIND") {
        session.refer(target);
      } else {
        const replacementSession = new Inviter(agent, target);
        session.refer(replacementSession);
      }
    },
    [session, server, agent]
  );

  const sendDTMF = useCallback(
    async (signalNumber: string, duration: number) => {
      const options = {
        requestOptions: {
          body: {
            contentDisposition: "render",
            contentType: "application/dtmf-relay",
            content: `Signal = ${signalNumber}\r\nDuration = ${duration}`,
          },
        },
      };

      session.info(options);
    },
    [session]
  );

  const hangupCall = useCallback(async () => {
    try {
      switch (session.state) {
        case SessionState.Initial:
        case SessionState.Establishing:
          if (session instanceof Inviter) {
            (session as any).cancel();
          } else {
            (session as any).reject();
          }
          break;
        case SessionState.Established:
          session.bye();
          break;
        case SessionState.Terminating:
        case SessionState.Terminated:
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(`🚀 : endCall -> error`, error);
    }
  }, [session]);

  const handleSetStateCall = (value: any) => setstateCall(value);
  const handleSetStateConnect = (value: any) => setstateConnect(value);
  const handleSetCustomerName = (value: any) => setCustomerName(value);

  const sipProviderMemory = useMemo(
    () => ({ connect, register, makeCall, sendDTMF, unregister, transfer, hangupCall, AcceptCall, setExternalNumber, handleSetStateConnect, handleSetStateCall, handleSetCustomerName, stateCall, externalNumber, isReceivedCall, currentCall, stateConnect, }),
    [connect, register, makeCall, sendDTMF, unregister, transfer, hangupCall, AcceptCall, setExternalNumber, handleSetStateConnect, handleSetStateCall, handleSetCustomerName, stateCall, externalNumber, isReceivedCall, currentCall, stateConnect,]
  );

  return (
    <SipContext.Provider value={sipProviderMemory}>
      {children}
    </SipContext.Provider>
  );
};

function useSip(): SipContextData {
  const context = useContext(SipContext);
  if (!context) {
    throw new Error("useSip must be used within an SipProvider");
  }
  return context;
}

export { SipProvider, useSip };
