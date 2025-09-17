/* eslint-disable @typescript-eslint/no-unused-vars */

import { optionDate } from 'assets/data';
import CDatePickers from 'components/atoms/CDatePickers';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Switchs from 'components/atoms/Switchs';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { postResolveMissedCall } from 'services/api/missCall';
import { CallItem } from 'services/api/missCall/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleGetListMissedCall } from 'store/misscall';

export interface MissCallType {
  id: number;
  timeCalled: Date;
  phoneNumber: string;
  qualityCalled: number;
  contentCalled: string;
  origin: DropdownData;
}

const MissCall: React.FC = () => {
  const dispatch = useAppDispatch();

  const isLoadingMissedCall = useAppSelector((state) => state.misscall.answerCallLoading);
  const storeMissedCall = useAppSelector((state) => state.misscall.missCall);
  const userAgent = Cookies.get('user_call_agent');

  const [stateMissCall, setStateMissCall] = useState(storeMissedCall.data)
  const [isEditMisscall, setIsEditMisscall] = useState(false)
  const [dataEditMissCall, setDataEditMissCall] = useState<CallItem>()
  const [dataChange, setDataChange] = useState({
    agentNote: '',
    isReslove: false,
  })

  useEffect(() => {
    setStateMissCall(storeMissedCall.data)
  }, [storeMissedCall]);

  useEffect(() => {
    dispatch(handleGetListMissedCall(moment(new Date()).format('DD-MM-YYYY')))
  }, []);

  useLayoutEffect(() => {
    document.title = "Cuộc gọi nhỡ | CRM";
  }, [])


  const { mutate: handleResloveMissedCall } = useMutation(
    'post-footer-form',
    (body: any) => postResolveMissedCall(body),
    {
      onSuccess: (data) => {
        setIsEditMisscall(false)
        setDataChange({
          isReslove: false,
          agentNote: '',
        })
        dispatch(handleGetListMissedCall(moment(new Date()).format('DD-MM-YYYY')));
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const handleResolveMissCall = () => {
    const body = {
      id: dataEditMissCall?.id, // id log cuộc gọi missedcall
      agent_id: userAgent, // agent gọi ra để giải quyết misscall
      agent_note: dataChange.agentNote, // Nội dung note
      is_solved: dataChange.isReslove
    }

    handleResloveMissedCall(body)
  }


  const tableColumns = [
    {
      title: (<Typography content="STT" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "index",
      align: "center",
      showSorterTooltip: false,
      width: 60,
      render: (record: any) => (
        <Typography
          content={record}
          modifiers={["16x24", "400", "center", 'main']}
        />
      ),
    },
    {
      title: (<Typography content="Ngày gọi" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "time_started",
      align: "center",
      showSorterTooltip: false,
      width: 160,
      render: (record: any) => (
        <Typography
          content={moment(record).format("HH:mm - DD/MM/YYYY")}
          modifiers={["16x24", "400", "center", 'main']}
        />
      ),
    },
    {
      title: (<Typography content="Số điện thoại gọi vào" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "from_number",
      align: "center",
      render: (record: any) => (
        <Typography
          content={record ? record.replace(/^.{4}/, "0") : "---"}
          modifiers={["16x24", "600", "center", 'cg-red']}
        />
      ),
    },
    {
      title: (<Typography content="Hotline" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "hotline",
      align: "center",
      render: (record: any) => (
        <Typography
          content={record.replace('+84-', "0")}
          modifiers={["16x24", "600", "center", 'green']}
        />
      ),
    },
    {
      title: (<Typography content="Trạng thái" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "monitor_status",
      align: "center",
      render: (record: any) => (
        <Typography
          content={record.replace('+84-', "0")}
          modifiers={["16x24", "400", "center", 'main']}
        />
      ),
    },
    {
      title: (<Typography content="Ghi chú" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "agent_note",
      align: "center",
      render: (record: any) => (
        <Typography
          content={record}
          modifiers={["16x24", "400", "left", 'main']}
        />
      ),
    },
    {
      title: (<Typography content="" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "",
      align: "center",
      width: 60,
      className: 'p-miss_call_cell',
      render: (record: any, data: any) => (
        <Icon iconName="edit_crm" size="26x26" onClick={() => {
          setDataEditMissCall(data);
          setIsEditMisscall(true)
        }} />
      ),
    },
  ];

  const gridMisCall = useMemo(() => {
    return (
      <PublicTable
        listData={stateMissCall}
        loading={isLoadingMissedCall}
        column={tableColumns}
        rowkey="id"
        isExpandable={false}
        isHideRowSelect
        pageSizes={15}
        isPagination
        size="middle"
        scroll={{
          x: stateMissCall.length ? 'max-content' : '100%',
          y: '300px',
        }}
      />
    )
  }, [isLoadingMissedCall, stateMissCall])

  return (
    <PublicLayout>
      <div className="p-miss_call">
        <PublicHeader
          titlePage='Danh sách gọi nhỡ'
          className="p-apointment_list_schedule_header_top_action"
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={() => { }}
          isHideFilter
          isHideCleanFilter
          isHideService
          isDial={false}
          tabLeft={(
            <div className='p-booking_schedule_form_filter'>
              <CDatePickers
                handleOnChange={(date: any) => {
                  dispatch(handleGetListMissedCall(moment(date?.$d).format('DD-MM-YYYY')))
                }}
                variant="simple"
                fomat="YYYY-MM-DD"
                isShowTime={false}
                placeholder="Chọn ngày muốn xem"
              />
            </div>
          )}
        />
        <div className="p-miss_call_table">
          {gridMisCall}
        </div>
      </div>
      <CModal
        isOpen={isEditMisscall}
        widths={400}
        textCancel='Hủy'
        textOK='Xử lí'
        title="Giải quyết cuộc gọi"
        onCancel={() => {
          setIsEditMisscall(false)
          setDataChange({
            isReslove: false,
            agentNote: '',
          })
        }}
        onOk={handleResolveMissCall}
      >
        <div className="p-miss_call_resolve">
          <Input variant="simple" label='Người gọi ra' disabled value={userAgent} />
          <TextArea id={''} readOnly={false} variant="simple" label='Ghi chú'
            handleOnchange={(event) => setDataChange({
              ...dataChange, agentNote: event.target.value
            })}
            value={dataChange.agentNote}
          />
          <Switchs label='Đã giải quyết?' checked={dataChange.isReslove} variant="style" onChange={(check) => setDataChange({
            ...dataChange, isReslove: check
          })} />
        </div>
      </CModal>
    </PublicLayout>
  );
};

export default MissCall;
