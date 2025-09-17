/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable no-useless-return */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Icon, { } from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import CInfiniteScroll from 'components/molecules/CInfiniteScroll';
import CTabs from 'components/molecules/CTabs';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getAgentRecentlyHistoried } from 'services/api/dashboard';
import { ItemRecentPhone, ResponseRecentAgentPhone } from 'services/api/dashboard/types';
import mapModifiers from 'utils/functions';

export interface TelephoneConfig {
  userName: string;
  password: string;
  displayNames: string;
  authRealm: string;
  webSocketURL: string;
}

export type TypePhone = 'ringing' | 'outgoing' | 'default' | 'outGoingCS';

interface TelephoneProps {
  phone?: string;
  isOpen?: boolean;
  handleAccept?: () => void;
  handleHangUp?: () => void;
  handleShowNote?: () => void;
  handleShowPhone?: () => void;
  handleClosePhone?: () => void;
  handleCloseOutGoing?: () => void;
  handleClickToCall?: (val: string) => void;
  handleTranferToCall?: (val: string) => void;
  handleCallOutGoing?: (val: string) => void;
  customerNameRinging?: string;
  customerInfo?: string;
  stateCall?: string;
  stateConnect?: string;
  typeUi?: TypePhone;
  isCallOut?: boolean;
}

const numberKeyPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const Telephone: React.FC<TelephoneProps> = ({
  phone, handleHangUp, handleAccept, isOpen, handleShowNote, handleClosePhone, handleClickToCall, isCallOut, stateCall, stateConnect,
  customerNameRinging, customerInfo, handleTranferToCall, typeUi = "default", handleShowPhone, handleCloseOutGoing, handleCallOutGoing
}) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  // --  --//
  const [isAccept, setIsAccept] = useState(false);
  const [isShowKey, setIsShowKey] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isShowPhone, setIsShowPhone] = useState(false);
  const [indexActive, setIndexActive] = useState('2');
  const callAgent = Cookies.get('user_call_agent');
  const [listRecentAgent, setListRecentAgent] = useState<ItemRecentPhone[]>();
  const [listRecentAgentRender, setListRecentAgentRender] = useState<ItemRecentPhone[]>();
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    interval = setInterval(() => { setSeconds((prevSeconds) => prevSeconds + 1); }, 1000);
    return () => { if (interval) { clearInterval(interval); } };
  }, []);

  useEffect(() => {
    const container = historyContainerRef.current;
    const handleScroll = () => {
      const container = historyContainerRef.current;

      if (container) {
        const isAtBottom = container.scrollTop + container.clientHeight === container.scrollHeight;
        setIsScrolledToBottom(isAtBottom);
      }
    };
    if (container) {
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (isScrolledToBottom) {
      setListRecentAgentRender((listRecentAgent || []).slice(0, Number((listRecentAgentRender || []).length + 20)))
    }
  }, [isScrolledToBottom]);

  useEffect(() => {
    if (!isOpen) setIsAccept(false);
  }, [isOpen]);

  useEffect(() => {
    if (isCallOut && stateConnect === 'accept') {
      setIsAccept(true);
      setSeconds(0);
      setMinutes(0);
    }

    if (stateCall === 'end') {
      setIsAccept(false);
    }
  }, [isCallOut, stateConnect, stateCall]);

  useEffect(() => {
    if (seconds === 60) {
      setSeconds(0);
      setMinutes((prevMinutes) => prevMinutes + 1);
    }
  }, [seconds]);

  const { mutate: getRecentlyAgent } = useMutation(
    'post-footer-form',
    (data: any) => getAgentRecentlyHistoried(data),
    {
      onSuccess: (data) => {
        setListRecentAgent(data)
        setListRecentAgentRender(data.slice(0, 40))
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );

  const formatTime = (time: number): string => time.toString().padStart(2, '0');
  const formattedTime = `${formatTime(minutes)}:${formatTime(seconds)}`;


  const renderScreen = () => {
    switch (stateConnect) {
      case 'end':
      case 'connecting': return (<div></div>);
      case 'connected': return (
        <div className="t-coming_call">
          <div className="t-coming_call_info">
            <p className='t-coming_call_info_name'>KH: {customerNameRinging?.toLowerCase() !== 'unkown' && customerNameRinging || 'Mới'}</p>
            <div className='t-coming_call_info_phone'>
              {phone ?
                <Typography content={phone} />
                :
                <Typography content={''} />
              }
            </div>
            <p className='t-coming_call_info_type' style={{ color: customerNameRinging?.toLowerCase() !== 'unkown' && customerNameRinging ? '#333' : '#f00' }}>{customerInfo}</p>
          </div>
          <div className="t-coming_call_action">
            {stateCall !== 'callout' &&
              <p
                className="accept_call"
                onClick={() => {
                  if (handleAccept) {
                    handleAccept();
                    setSeconds(0);
                    setMinutes(0);
                    setIsAccept(true);
                  }
                }}
              >
                <Icon iconName="phone_accept" size="32x32" />
              </p>
            }
            <p className="hangup" onClick={() => {
              if (handleHangUp) { handleHangUp(); setIsShowPhone(false) }
            }}>
              <Icon iconName="phone_hangup" size="32x32" />
            </p>
          </div>
        </div>
      );
      case 'accept': return (<>
        <div className={mapModifiers("t-ringing_wrap-accept")}>
          <div className={mapModifiers('t-ringing_wrap_text', !isShowKey && 'u-mt-16', isShowKey && 'translateY')}>
            {isShowKey && (
              <div className={mapModifiers("t-ringing_wrap_text_input")}>
                <Input value={newPhoneNumber} variant="normal" />
              </div>
            )}
            {isAccept && (
              <p style={{ textAlign: 'center', width: '90%' }}>{formattedTime}</p>
            )}
            <p className='t-ringing_wrap_text_name'>KH: {customerNameRinging?.toLowerCase() !== 'unkown' && customerNameRinging || 'Mới'}</p>
            <Typography content={phone} />
            <p className='t-ringing_wrap_text_type'>{customerInfo}</p>
          </div>
          <div className={mapModifiers("t-ringing_wrap_actions", isShowKey && 'open')}>
            <div className={mapModifiers("t-ringing_wrap_actions_wrap", isShowKey ? 'three' : 'two')}>
              {
                isShowKey ? numberKeyPad.map((key) => (<p key={key} onClick={() => setNewPhoneNumber(`${newPhoneNumber}${key}`)}>{key}</p>)) : (
                  <>
                  </>
                )
              }
              {isShowKey && <p onClick={() => {
                if (isShowKey && handleTranferToCall) {
                  setNewPhoneNumber('');
                  handleTranferToCall(newPhoneNumber);
                }
                toast.info('Điều hướng đến số ' + handleTranferToCall)
              }}
              >
                <Icon iconName="transfer" />
              </p>}
              <p onClick={() => {
                if (isShowKey) {
                  setNewPhoneNumber('');
                }
                setIsShowKey(!isShowKey);
              }}
              >
                <Icon iconName="dialpad" />
              </p>
              {
                isShowKey && (
                  <p onClick={() => {
                    setNewPhoneNumber((prev) => prev.slice(0, -1));
                  }}
                  >
                    <Icon iconName="backspace" />
                  </p>
                )
              }
            </div>
          </div>
          <div className={mapModifiers('t-ringing_wrap_btn', isAccept && 'center')}>
            <Button className="hangup" onClick={() => {
              if (handleHangUp) { handleHangUp(); setIsShowPhone(false) }
            }}>
              <Icon iconName="hangup" size="24x24" />
            </Button>
          </div>
        </div >
      </>);
      case 'dial': return (<div className='t-dial-wrap'>
        <CTabs
          options={[
            {
              key: '1',
              short: 'recent-call',
              label: <Icon iconName="history" />,
              children: <CInfiniteScroll
                dataLength={Number(listRecentAgent?.length || 0)}
                next={() => { }}
                hasMore={false}
                loader={<></>}
              >
                <div className='t-dial-history' ref={historyContainerRef}>
                  {listRecentAgentRender?.length ? listRecentAgentRender.map((item, index) => (
                    <div
                      className={mapModifiers('t-dial-history_item', item.call_status === 'NOANSWER' && 'fail', item.call_type.toLowerCase())}
                      key={item.log_call_id}
                      onClick={() => {
                        if (handleClickToCall)
                          handleClickToCall(item.phone_number.replace('+84-', '0'))
                      }}
                    >
                      <Icon iconName={item.call_type === 'IN' ? (item.call_status === 'OK' ? 'call_in' : 'call_fail') : (item.call_status === 'OK' ? 'call_out' : 'call_fail')} size={'18x18'} />
                      <Typography content={item.phone_number.replace('+84-', '0')} />
                      <span>{moment(item.call_datetime).format('DD-MM-YYYY')}</span>
                    </div>
                  )) : <div>
                    <Typography content='Không tìm thấy cuộc gọi' modifiers={['400', 'italic', 'cg-red', 'center']} />
                  </div>
                  }
                </div>
              </CInfiniteScroll>
              ,
            },
            {
              key: '2',
              short: 'dial-pad',
              label: <Icon iconName="dial-pad" />,
              children:
                <div className="t-dial_pad" >
                  <div className="t-dial_input">
                    <Input
                      value={newPhoneNumber}
                      variant="normal"
                      autoFocus={true}
                      handleEnter={() => {
                        if (handleCallOutGoing) handleCallOutGoing(newPhoneNumber); setNewPhoneNumber('')
                      }} onChange={(e) => setNewPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="t-dial_wrapper">
                    {numberKeyPad.map((key) => (<p key={key} onClick={() => setNewPhoneNumber(`${newPhoneNumber}${key}`)}>{key}</p>))}
                    <span></span>
                    <span className="t-dial_wrapper_call" onClick={() => {
                      if (handleCallOutGoing) handleCallOutGoing(newPhoneNumber);
                    }}
                    >
                      <Icon iconName="phone_accept" size="40x40" isPointer />
                    </span>
                    <span className="t-dial_wrapper_close" onClick={() => {
                      setNewPhoneNumber((prev) => prev.slice(0, -1));
                    }}><Icon iconName="backspace" /></span>
                  </div>
                </div>
              ,
            },
            {
              key: '3',
              short: 'close',
              label: <CTooltip placements={'top'} title={''}> <Icon iconName="close" /> </CTooltip>,
              children: <div className='t-dial-history'>
                <Typography content='Tính năng đang được phát triên' modifiers={['400', 'cg-red']} />
              </div>,
            },
          ]}
          defaultActiveKey={indexActive}
          position={"top"}
          handleOnTabClick={(data: any) => {
            switch (data.short) {
              case 'close': if (handleClosePhone) handleClosePhone()
                break;
              case 'recent-call': getRecentlyAgent(callAgent);
                break;
              case 'dial-pad':
                break;
            }
          }}
        />

      </div >);
    }
  }

  return (
    <div className={mapModifiers('t-telephone',)} >
      <div className={mapModifiers("t-ringing", !phone?.trim() && stateConnect !== 'dial' ? 'hide' : '')} >
        {renderScreen()}
      </div>
    </div>
  );
};

// Telephone.defaultProps = {
//   typeUi: 'default',
// };

export default Telephone;
