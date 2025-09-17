/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */


// import { log, timeStamp } from 'console';
import { Checkbox, Popover } from 'antd';
import { OptionChooseMonth, optionFType, optionOrigin, sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import MultiSelect from 'components/molecules/MultiSelect';
import PublicTable from 'components/molecules/PublicTable';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import { divide } from 'lodash';
import moment from 'moment';
import { AMOUNT_SMS } from 'pages/CustomerLeads';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
// import { RequestListAfterExams } from 'services/api/afterexams/types';
import { getCampaigns, getSMSTemplates, postSendCampaign, postSendNoteRemind } from 'services/api/point';
import { CustomerFTypeData, ResponseCustomerFType, TemplateSMSItem } from 'services/api/point/types';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getCustomerFTypeByOwner, getCustomerRemindNoteData } from 'store/point';
interface DropdownData1 {
  id: number;
  value: string;
  label: string;
}
const dataStatus: DropdownData1[] = [
  {
    id: 1,
    value: "new",
    label: "Chưa liên hệ được",
  },
    {
    id: 2,
    value: "inprogress",
    label: "Chưa chốt được",
  },
     {
    id: 3,
    value: "done",
    label: "Đã đến",
  },
]
const ReportCustomerReExamination: React.FC = () => {
  const dispatch = useAppDispatch();
   const storeLoadingRemind= useAppSelector((state) => state.point.loadingCustomerRemind);
  const storeResponseRemind = useAppSelector((state) => state.point.responseCustomerRemind);

  const [loadingRemind, setLoadingRemind] = useState(storeLoadingRemind);
  const [listCustomerRemind, setListCustomerRemind] = useState(storeResponseRemind?.data?.items || []);
  const storeLoadingRemindNote = useAppSelector((state) => state.point.loadingCustomerRemindNote);
  const storeResponseRemindNote = useAppSelector((state) => state.point.responseCustomerRemindNote);

  const [loadingRemindNote, setLoadingRemindNote] = useState(storeLoadingRemindNote);
  const [listCustomerRemindNote, setListCustomerRemindNote] = useState(storeResponseRemindNote?.data);
  const responseCustomerFType = useAppSelector((state) => state.point.responseCustomerFType);
  const responseCustomerFTypeLoading = useAppSelector((state) => state.point.responseCustomerFTypeLoading);
   const storageEmployeeList = localStorage.getItem('listCSKH');
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
   const [listEmployeeTeams, setListEmployeeTeams] = useState(storageEmployeeList ? JSON.parse(storageEmployeeList || '') : [] as any);
  const [loadingFType, setLoadingFType] = useState(responseCustomerFTypeLoading);
  const [listCustomerFType, setListCustomerFType] = useState(responseCustomerFType?.data?.items ?? []);

  const [pagination, setPagination] = useState({ page: 0, pageSize: 1000 });
  const [totalItem, setTotalItem] = useState(responseCustomerFType?.data?.paging?.total_count);

  const employeeId = localStorage.getItem("employee_id");
  const [note,setNote] = useState("")
  const [states, setStates] = useState({
    launch_source_group: undefined as unknown as DropdownData,
    launch_source: undefined as unknown as DropdownData,
    f_type: optionFType[0] as DropdownData,
    dateFrom: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
    dateTo: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
    keyWord: '',
    page: 1,
    pageSize: 1000
  })


  const bodyRequestGetList = {
    owner_id: '',
    from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
    to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
    launch_source_group_id: states.launch_source_group?.value ?? 0,
      launch_source_ids: states?.launch_source?.map((i: any) => i?.id).join(',') || 'all',
    employee_id: employeeId ?? 'Không tìm thấy nhân viên',
    f_type: states?.f_type?.value,
    keyword: states.keyWord,
    page: states.page,
    limit: pagination?.pageSize,
  }
 const [seenListReminder, setSeenListReminder] = useState({

     chooseMonth: OptionChooseMonth[1] as unknown as GroupRadioType,

  })
  const [filterColumn, setFilterColumn] = useState({
    launch_source_group: [],
    launch_source: [],
    status: [],
  });

  const [sendNote, setSendNote] = useState({
    openModal: false,
    customer_id: '',
    note: '',
    status: '',
  })
   

  const [sendNoteEror, setSendNoteError] = useState({
    customer_id: '',
    note: '',
    status: '',
    
  });
  const [sendSMS, setSendSMS] = useState({
    openModal: false,
    type: '',
    listCS: [],
    campaignType: sendMessagetype[0] as unknown as GroupRadioType,
    template: undefined as unknown as DropdownData,
    campaign: undefined as unknown as DropdownData,
    content: '',
    subject: '',
  })

  const [sendSMSEror, setSendSMSError] = useState({
    subject: '',
    template: '',
    content: '',
    campaign: ''
  });
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [listCampaign, setListCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<string[]>([]);
  useEffect(() => {
    setLoadingFType(responseCustomerFTypeLoading);
    setListCustomerFType(responseCustomerFType?.data?.items ?? []);
    // console.log(123)
     setTotalItem(responseCustomerFType?.data?.paging?.total_count);
  }, [responseCustomerFType, responseCustomerFTypeLoading]);
  //   useEffect(() => {

  //   setTotalItem(responseCustomerFType?.data?.paging?.total_count);
  // }, [responseCustomerFType]);
  useLayoutEffect(() => {
    setLoadingFType(true);
    const fetchData = async () => {
      try {
        await dispatch(getCustomerFTypeByOwner(bodyRequestGetList));
        await getTemplateSMSOfCampaign();
        await getCampaign();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingFType(false);
      }
    };
    fetchData();
  }, []);

  const { mutate: getTemplateSMSOfCampaign } = useMutation(
    'post-footer-form',
    () => getSMSTemplates(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setTemplateSMS(data?.data?.map((item: TemplateSMSItem) => {
            if (!item.is_used) return;
            return {
              id: item.id,
              label: item.name,
              value: item.content,
              sms_count: item.sms_count,
            }
          }))
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCampaign } = useMutation(
    'post-footer-form',
    () => getCampaigns(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          const newCampaign = await data?.data?.map((item: any) => {
            return {
              id: item.campaign_id,
              label: item.campaign_name,
              value: item.campaign_id,
              active: item.is_active,
            }
          }).filter(Boolean);
          setListCampaign({
            data: newCampaign,
            dropdown: data?.data?.map((item: any) => {
              if (!item.is_active) return;
              return {
                id: item.campaign_id,
                label: item.campaign_name,
                value: item.campaign_id,
                active: item.is_active,
              }
            }).filter(Boolean)
          });
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );


  const handleChangePagination = (page: number, size: number) => {
    setLoadingFType(true); // Cập nhật trạng thái loading ngay lập tức
    setPagination({ page: page, pageSize: size });

    dispatch(getCustomerFTypeByOwner({
      ...bodyRequestGetList,
      page,
      limit: size
    }))
      .then(() => setLoadingFType(false))
      .catch(() => setLoadingFType(false));
  };
        const [newData, setNewData] = useState([]);
   useEffect(() => {
    const updatedData = listEmployeeTeams.map((item: any) => {
      // Tách tên khỏi nhãn bằng cách loại bỏ "CS. "
      const name = item.label.replace("CS. ", "");
      return { text: name, value: name };
    });

    setNewData(updatedData);
  }, [listEmployeeTeams]);

  const columnTable = [
    // {
    //   title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
    //   dataIndex: 'RowNumber',
    //   align: 'center',
    //   width: 50,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any, index: number) => (
    //     <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
    //       const { customer_id, customer_fullname, ...prevData } = data;
    //       if (customer_id) {
    //         Cookies.set("id_customer", customer_id);
    //         dispatch(getInfosCustomerById({ customer_id: customer_id }));
    //         window.open(
    //           `/customer-info/id/${customer_id}/history-interaction`,
    //           "_blank"
    //         );
    //       } else {
    //         toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //       }
    //     }}>
    //       <Typography content={`${index + 1}`} modifiers={['13x18', '600', 'main', 'justify']} />

    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Ngày" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'create_date',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
 
    {
      title: <Typography content="Số điện thoại" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_phone',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? record.replace('+84-', '0') : '---'} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Brand" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_group_name',
      align: 'center',
      className: "ant-table-column_wrap",
      filters: optionOrigin?.map((item) => ({ text: item.label, value: item?.value })),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_name?.toLowerCase()?.search(value?.toLowerCase()) !== -1;
      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },
       {
      title: <Typography content="Brand" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_group_name',
      align: 'center',
      className: "ant-table-column_wrap",
      filters: optionOrigin?.map((item) => ({ text: item.label, value: item?.value })),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_name?.toLowerCase()?.search(value?.toLowerCase()) !== -1;
      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },
          {
      title: <Typography content="Brand" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_group_name',
      align: 'center',
      className: "ant-table-column_wrap",
      filters: optionOrigin?.map((item) => ({ text: item.label, value: item?.value })),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_name?.toLowerCase()?.search(value?.toLowerCase()) !== -1;
      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set("id_customer", customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(
              `/customer-info/id/${customer_id}/history-interaction`,
              "_blank"
            );
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },

  
   
   
  ];

  const handleValidateSendNote = () => {
 
      if (!note || !sendNote.status) {
        setSendNoteError({
          ...sendNoteEror,
           note: !note.trim() ? 'Vui lòng ghi chú!' : '',
          status: !sendNote.status ? 'Vui lòng chọn trạng thái' : ''
        })
        return false;
      }
      return true;
   
  }

   const { mutate: sendNoteAPI } = useMutation(
    'post-footer-form',
    (body: any) => postSendNoteRemind(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendNote({
            ...sendNote,
            openModal: false,
            note: '',
            customer_id: '',
            status:''
          })
          setNote("")
        } else {
          toast.error(data?.message);
           setSendNote({
            ...sendNote,
            openModal: false,
            note: '',
            customer_id: '',
            status:''
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );


  const handleExcuteSendNote = () => {
    if (!handleValidateSendNote()) return;
    const body = {
      customer_id: sendNote.customer_id,
      note: note,
      status: sendNote.status
    }
    sendNoteAPI(body);
  }
  const handleValidateSendMessage = () => {
    if (sendSMS.campaignType?.value === 'SMS') {
      if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
        setSendSMSError({
          ...sendSMSEror,
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          template: !sendSMS.template ? 'Cần chọn template để gửi tin nhắn' : '',
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : ''
        })
        return false;
      }
      return true;
    } else {
      if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
        setSendSMSError({
          ...sendSMSEror,
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : '',
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          content: !sendSMS.content?.trim() ? 'Cần nhập nội dung tin nhắn để gửi tin nhắn' : ''
        })
        return false;
      }
      return true;
    }
  }

  const { mutate: sendCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postSendCampaign(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        } else {
          toast.error(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  const handleExcuteSendMessage = () => {
    if (!handleValidateSendMessage()) return;
     const formattedTemplateValue = sendSMS.template.value && sendSMS.template.value.endsWith('02856789999')
  ? sendSMS.template.value.replace('02856789999', '028 56789999') // Thay thế số điện thoại
  : sendSMS.template.value; // Giữ nguyên nếu không khớp
    const body = {
      send_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      campaign_id: sendSMS.campaign?.value,
      method: sendSMS.campaignType.value,
      template_id: sendSMS.template.id || '',
      content: sendSMS.campaignType.value === "SMS" ? formattedTemplateValue?.replace('&', 'va') : sendSMS.content?.replace('&', 'va'),
      to: sendSMS.listCS,
    }
    
    sendCampaign(body);
  }
  const memoryTable = useMemo(() => {

    return (
      <div className='p-customer_f_type_table'>
        <PublicTable
          listData={listCustomerFType}
          loading={loadingFType}
          column={columnTable}
          pageSizes={500}
          isPagination={false}
          isNormal
          totalItem={totalItem}
          isbordered
          rowkey={'customer_id'}
          rowClassNames={(record: any, index: any) => {
            return index % 2 === 0 ? 'bg-gay-blur' : ''
          }}
          handleChangePagination={(page: any, pageSize: any) => {
            handleChangePagination(page, pageSize);
          }}
        
          isHideRowSelect
          
        />
        {/* {loadingFType ? (
          <div>Loading...</div>
        ) : (
          
        )} */}
      </div>
    )
  }, [listCustomerFType, loadingFType, totalItem, sendNote])
    const columnTableNote = [
    // {
    //   title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
    //   dataIndex: 'suggestion_count',
    //   align: 'center',
    //   width: 50,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any,index: number) => (
    //     <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}
    //       >
    //        <Typography content={`${index + 1}`} modifiers={['13x18', '600', 'main', 'justify']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Ngày" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'last_suggestion',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung Note" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'suggestion_note',
      align: 'center',
      width: 240,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"center"}}/>,
      dataIndex: 'status',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
        
        >
          <Typography content={record === "new" ? "Chưa liên hệ được" : record === "inprogress" ? "Chưa chốt được" : "Đã đến"} modifiers={['14x20', '600', 'center', 'main','capitalize']} />
        </div>
      ),
    },
   
  ];
    /* API */
    const tableMergeCustomer = useMemo(() => (
    <div className="t-header_wrapper_table" style={{maxHeight:"90%"}}>
      <PublicTable
        column={columnTableNote}
        listData={storeResponseRemindNote?.data}
        loading={loadingRemindNote}
        size="small"
        rowkey="customer_id"
        isbordered
        isPagination={false}
        scroll={{ x: 'max-conent', y: '100%' }}
        isHideRowSelect
        pageSizes={15}
        handleChangePagination={(page: any, pageSize: any) => {
        }}
      />
    </div>
    ), [storeResponseRemindNote?.data, columnTableNote])

  return (
    <div className='p-customer_f_type'>
      <PublicLayout>
        <PublicHeader
          titlePage={'BẢNG THỐNG KÊ KHÁCH HÀNG TÁI KHÁM'}
          handleGetTypeSearch={function (type: DropdownData): void { }}
          handleFilter={function (): void { }}
          handleCleanFilter={function (): void { }}
          isClearFilter
          isDial={false}
          isHideEmergency
          isHideFilter
          isHideService
          isHideCleanFilter
          className='p-customer_f_type_header'
           listBtn={
            sendSMS.listCS.length > 0 ?
              // Button gửi tin nhắn tất cả khách
             <Popover
                      
                 
                content={(<Typography content="Gửi chiến dịch" modifiers={['16x28', 'blueNavy']} />)}
                placement="topRight"
                overlayStyle={{ width: '120px',textAlign:"left"}}
                    >  <CTooltip placements={'bottom'} title={'Gửi tin nhắn hàng loạt'}>
              
                <Button modifiers={['foreign']} onClick={() => setSendSMS({
                  ...sendSMS, openModal: true, type: 'all'
                })}>
                  <Icon iconName={'send-message'} />
                </Button>
              </CTooltip></Popover>
              : null
          }
        ></PublicHeader>
        <PublicHeaderStatistic
          isStatistic={false}
          leftNode={
            <>
              <RangeDate variant='simple'
                fomat='DD-MM-YYYY'
                value={{ from: states.dateFrom, to: states.dateTo }}
                defaultValue={{ from: states.dateFrom, to: states.dateTo }}
                isFlex
                handleOnChange={(from: any, to: any) => {
                  setStates({
                    ...states, dateFrom: from, dateTo: to,
                  });
                  setLoadingFType(true);
                  dispatch(getCustomerFTypeByOwner({
                    ...bodyRequestGetList,
                    from_date: moment(from).format('YYYY-MM-DDT00:00:00'),
                    to_date: moment(to).format('YYYY-MM-DDT23:59:59'),
                  }))
                    .then(() => setLoadingFType(false))
                    .catch(() => setLoadingFType(false));
                }} />
              <div style={{maxWidth:"400px", minWidth:"200px"}}>
                
             </div>
      
             
             
             
             
            </>
          }
        >
       
        </PublicHeaderStatistic>
        {memoryTable}
      </PublicLayout>
    
    </div>
  )
}

export default ReportCustomerReExamination;
