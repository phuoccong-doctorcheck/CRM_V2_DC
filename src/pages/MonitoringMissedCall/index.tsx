/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import useWebSocket from 'hooks/useSocket';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleGetListAnswerCall, handleGetListMissedCall } from 'store/misscall';
import { SOCKET_URL } from 'utils/constants';
import mapModifiers from 'utils/functions';
import W3CWebSocket from 'websocket';

type TypeConnectSK = 'connected' | 'disconnect';
type TypePlay = 'play' | 'skip' | 'none';

const MonitoringMissedCall: React.FC = () => {
  const wsUrl = SOCKET_URL;
  const dispatch = useAppDispatch();

  const storeAnswer = useAppSelector((state) => state.misscall.answerCall);
  const isLoadingMissedCall = useAppSelector((state) => state.misscall.answerCallLoading);
  const storeMissedCall = useAppSelector((state) => state.misscall.missCall);
  const isLoadingAnswer = useAppSelector((state) => state.misscall.missCallLoading);

  const [stateMissCall, setStateMissCall] = useState(storeMissedCall.data)
  const [stateAnswer, setStateAnswer] = useState(storeAnswer.data)
  const [stateConnect, setStateConnect] = useState<TypeConnectSK>('disconnect')
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(4);
  const [play, setPlay] = useState<TypePlay>('none')


  const formatTime = (time: number): string => time.toString().padStart(2, '0');
  const formattedTime = `${formatTime(minutes)}:${formatTime(seconds)}`;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    interval = setInterval(() => {
      if (!_.isEmpty(stateMissCall) || play !== 'play' || (minutes !== 0 && seconds !== 0)) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);
    return () => { if (interval) { clearInterval(interval); } };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      setSeconds(59);
      if (minutes !== 0) {
        setMinutes((prevMinutes) => prevMinutes - 1);
      }
    }
  }, [seconds]);

  useEffect(() => {
    switch (play) {
      case 'play':
        const intervalId = setTimeout(() => {
          setSeconds(59);
          setMinutes(4);
          setPlay('none');
        }, 10000);
        return () => clearInterval(intervalId);
      case 'skip':
        setSeconds(59);
        setMinutes(4);
        setPlay('none');
        break;
      default:
        break;
    }
  }, [play]);

  useEffect(() => {
    if (_.isEmpty(stateMissCall)) return;
    const intervalId = setInterval(() => {
      (document.getElementById('audio_misscal') as HTMLAudioElement)?.play();
      setPlay('play');
      console.log("🚀 -> play");
    }, 300000);
    return () => clearInterval(intervalId);
  }, [stateMissCall]);

  useEffect(() => {
    setStateAnswer(storeAnswer.data)
  }, [storeAnswer]);

  useEffect(() => {
    setStateMissCall(storeMissedCall.data)
  }, [storeMissedCall]);

  useEffect(() => {
    const socket = new W3CWebSocket.w3cwebsocket(wsUrl, 'echo-protocol');
    socket.onopen = () => {
      setStateConnect('connected');
    };
    socket.onclose = () => {
      setStateConnect('disconnect');
    };
    socket.onmessage = (message: any) => {
      console.log(message)
      const dataSK = JSON.parse(message.data);
      if (`${dataSK?.data?.monitor_status}`.toLowerCase().search('MISSCALL'.toLowerCase()) !== -1) {
        if (_.isEmpty(stateMissCall) && !dataSK?.data?.is_solved) {
          (document.getElementById('audio_misscal') as HTMLAudioElement)?.play();
          setPlay('play');
        } else {
          (document.getElementById('notify_sound') as HTMLAudioElement)?.play();
        }
        dispatch(handleGetListMissedCall(moment(new Date()).format('DD-MM-YYYY')));
      }
      if (`${dataSK?.data?.monitor_status}`.toLowerCase() === 'ANSWERED'.toLowerCase()) {
        dispatch(handleGetListMissedCall(moment(new Date()).format('DD-MM-YYYY')));
        dispatch(handleGetListAnswerCall(moment(new Date()).format('DD-MM-YYYY')));
      }
    };
    socket.onerror = (error: any) => {
      setStateConnect('disconnect');
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [wsUrl]);


  useEffect(() => {
    dispatch(handleGetListAnswerCall(moment(new Date()).format('DD-MM-YYYY')));
    dispatch(handleGetListMissedCall(moment(new Date()).format('DD-MM-YYYY')));
    window.addEventListener('online', function () {
      setStateConnect('connected');
    });
  }, []);

  const tableColumns = [
    {
      title: (<Typography content="" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "index",
      align: "center",
      showSorterTooltip: false,
      width: 40,
      className: 'p-monitor_content_left_cell',
      render: (record: any, data: any) => (
        <Typography
          content={record}
          modifiers={["28x40", "500", "center", 'italic', 'blueNavy']}
        />
      ),
    },
    {
      title: (<Typography content="Thời gian" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "time_started",
      align: "center",
      showSorterTooltip: false,
      width: 140,
      className: 'p-monitor_content_left_cell',
      render: (record: any, data: any) => (
        <Typography
          content={moment(record).format("HH:mm")}
          modifiers={["28x40", "500", "center", 'italic', 'blueNavy']}
        />
      ),
    },
    {
      title: (<Typography content="Thông tin cuộc gọi" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "",
      align: "center",
      showSorterTooltip: false,
      className: 'p-monitor_content_left_cell',
      render: (record: any, data: any) => (
        <div
          className='p-monitor_content_left_cell_item'
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Typography
            content={data.from_number.replace('+84-', '0')}
            modifiers={["24x36", "600", "center"]}
          />
          <Typography
            content={`Hotline: ${data?.hotline}`}
            modifiers={["24x36", "600", "center"]}
          />
        </div>
      ),
    },
  ];
  const tableColumnsAnswer = [
    {
      title: (<Typography content="" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "index",
      align: "center",
      showSorterTooltip: false,
      width: 40,
      className: 'p-monitor_content_left_cell',
      render: (record: any, data: any) => (
        <div>

          <Typography
            content={record}
            modifiers={["28x40", "600", "center", 'italic', 'blueNavy']}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Thời gian" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "time_started",
      align: "center",
      showSorterTooltip: false,
      width: 120,
      className: 'p-monitor_content_left_cell',
      render: (record: any, data: any) => (
        <div>

          <Typography
            content={moment(record).format("HH:mm")}
            modifiers={["28x40", "600", "center", 'italic', 'blueNavy']}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Thông tin cuộc gọi" modifiers={["24x29", "500", "center", "capitalize"]} />),
      dataIndex: "",
      align: "center",
      showSorterTooltip: false,
      className: 'p-monitor_content_right_cell',
      render: (record: any, data: any) => (

        <div
          className='p-monitor_content_right_cell_item'
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Typography
            content={data.from_number.replace('+84-', '0')}
            modifiers={["24x36", "600", "center"]}
          />
          <Typography
            content={`Hotline: ${data?.hotline}`}
            modifiers={["18x32", "600", "center"]}
          />
        </div>
      ),
    },
  ];
  
  // useWebSocket("wss://sockets.doctorcheck.online:3333/send?app_key=cs")
  const memoryMissCall = useMemo(() => {
    return (
      <div className='p-monitor_content_left'>
        <PublicTable
          listData={stateMissCall}
          loading={isLoadingMissedCall}
          column={tableColumns}
          isHideRowSelect
        />
        <div className='p-monitor_content_left_title'>
          <Typography content='Cuộc gọi nhỡ' modifiers={['uppercase']} />
        </div>
        <div className='p-monitor_content_left_summary'>
          <div className='p-monitor_content_left_summary_item'>
            <span>Có:</span>
            <Typography content={(!_.isEmpty(stateMissCall) ? stateMissCall.length : 0)?.toString()} />
            <p>cuộc gọi nhỡ</p>
          </div>
        </div>
      </div>
    )
  }, [isLoadingMissedCall, stateMissCall, tableColumns])

  const memoryAnswerCall = useMemo(() => (
    <div className='p-monitor_content_right'>
      <PublicTable
        listData={stateAnswer}
        loading={isLoadingAnswer}
        column={tableColumnsAnswer}
        isHideRowSelect
      />
      <div className='p-monitor_content_right_title'>
        <Typography content='Đã trả lời' modifiers={['uppercase']} />
      </div>
    </div>
  ), [isLoadingAnswer, stateAnswer, tableColumnsAnswer])

  const countDown = useMemo(() => (
    <div className={mapModifiers("p-monitor_count_down", stateConnect)}>
      <Typography content={formattedTime} />
    </div>
  ), [formattedTime, stateConnect])

  return (
    <div className='p-monitor'>
      <div className='p-monitor_header'>
        <div className='p-monitor_header_wrapper'>
          <Typography content='Danh sách cuộc gọi:' modifiers={['uppercase']} />
          <span>{moment(new Date()).format('DD/MM/YYYY')}</span>
        </div>
      </div>
      <div className='p-monitor_content'>
        <div className='p-monitor_content_wrapper'>
          {memoryMissCall}
          {memoryAnswerCall}
        </div>
      </div>
      <div className={mapModifiers("p-monitor_state", stateConnect)}>
        <span></span>
        <Typography content={stateConnect === 'connected' ? 'Đã kết nối' : 'Mất kết nối'} />
      </div>
      {!_.isEmpty(stateMissCall) && countDown}
    </div>
  );
}

export default MonitoringMissedCall;