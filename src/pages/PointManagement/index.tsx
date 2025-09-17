/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import RangePoint from 'components/atoms/RangePoint';
import Switchs from 'components/atoms/Switchs';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import { set } from 'lodash';
import moment from 'moment';
import { AMOUNT_SMS } from 'pages/CustomerLeads';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCampaigns, getCustomerGiftExchanges, getCustomerPastServices, getCustomerServicesByUsage, getListPointsOfCustomer, getSMSTemplates, postMakeOrUpdateCampaigns, postSendCampaign } from 'services/api/point';
import { CustomerPointItem, GiftExchangesItem, PastServiceDayItem, ResponseListPointOfCustomer, ServiceByUsageItem, TemplateSMSItem } from 'services/api/point/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getListCustomerPoint, getListPointMinusOfCustom, getListPointOfCustom } from 'store/point';
import mapModifiers from 'utils/functions';
import { optionStateExchangeGift } from 'utils/staticState';

type ArrayNumber = [number, number];
const dataList = [
  {
    date: "27-04-2002",
    point: "10000",
    note: "Bạn là thành viên mới Bạn là thành viên mới Bạn là thành viên mớiBạn là thành viên mớiBạn là thành viên mớiBạn là thành viên mớiBạn là thành viên mớiBạn là thành viên mớiBạn là thành viên mới"
  },
   {
    date: "27-04-2002",
    point: "10000",
    note: "Bạn là thành viên mới"
  }
]
const PointManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigatorRoute = useNavigate();

  const getRoles = localStorage.getItem('roles');

  const loadingPoint = useAppSelector((state) => state.point.loadingPoint);
  const responsePoint = useAppSelector((state) => state.point.responsePoint);

  const responsePointOfCustomerLoading = useAppSelector((state) => state.point.responsePointOfCustomerLoading);
  const responsePointOfCustomer = useAppSelector((state) => state.point.responsePointOfCustomer);
  const responsePointMinusOfCustomerLoading = useAppSelector((state) => state.point.responsePointMinusOfCustomerLoading);
  const responsePointMinusOfCustomer = useAppSelector((state) => state.point.responsePointMinusOfCustomer);
  const [dataPoint,setDataPoint] = useState<any>([])
  // const [loadingPointOfCustomer, setLoadingPointOfCustomer] = useState(responsePointOfCustomerLoading);
  // const [listPointOfCustomer, setListPointOfCustomer] = useState(responsePointOfCustomer?.data);
// useEffect(() => {
//   if (responsePointOfCustomer !== undefined || responsePointMinusOfCustomer !== undefined) {
//     // Check if both response objects are defined before accessing their data properties
//     const combinedData = [
//       ...(responsePointOfCustomer.data || []), // Fallback to an empty array if data is undefined
//       // ...(responsePointMinusOfCustomer.data || [])
//     ];
//     console.log(responsePointOfCustomer.data)
//     setDataPoint(combinedData);
//   }
  
// }, [responsePointOfCustomer, responsePointMinusOfCustomer]);
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [listData, setListData] = useState(responsePoint?.data);
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [listCampaign, setListCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });
  const [loadingData, setLoadingData] = useState(loadingPoint);
 const [modeSeenRulePoint, setModeSeenRulePoint] = useState(false);

  const [states, setStates] = useState({
    pastService: undefined as any,
    servicesByUsage: undefined as any,
    customerGiftExchanges: undefined as any,
    isOpenModalDetail: false,
    type: '',
    fromDate: new Date(),
    toDate: new Date(),
  })

  const [filters, setFilters] = useState({
    fromDate: undefined as unknown as Date,
    toDate: undefined as unknown as Date,
    rangePoint: undefined as unknown as ArrayNumber,
    type: optionStateExchangeGift[0] as DropdownData,
    smsCount: '',
    search: '',
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
  const [getListPointOfCustomer, setGetListPointOfCustomer] = useState({
    openModal: false,
    customer_id: ""
  })
  const [getListPointMinusOfCustomer, setGetListPointMinusOfCustomer] = useState({
    openModal: false,
    customer_id: ""
  })
  const [sendSMSEror, setSendSMSError] = useState({
    subject: '',
    template: '',
    content: '',
    campaign: ''
  })

  const [campaign, setCampaign] = useState({
    isOpen: false,
    isOpenAddOrUpdate: false,
    isUpdate: false,
    nameCampaign: '',
    statusCampaign: false,
    id: 0,
  })

  useEffect(() => {
    if ((listRoles?.some((role: any) => ['campaign'].some((i => i === role?.role_name))))) {
      document.title = "Quản lí điểm thưởng | CRM";
      return;
    }
    return navigatorRoute('/not-have-permission', { replace: true, relative: 'route', unstable_viewTransition: false });
  }, []);

  useLayoutEffect(() => {
    // dispatch(getListCustomerPoint({
    //   displayname: "Lê Bá Quốc Thịnh",
    // }))
    getTemplateSMSOfCampaign();
    getCampaign();
  }, [])

  useEffect(() => {
    setListData(responsePoint?.data)
  }, [responsePoint?.data]);

  useEffect(() => {
    setLoadingData(loadingPoint)
  }, [loadingPoint]);

  useEffect(() => {
    const filtered = responsePoint?.data?.filter((item) => {
      if (!filters.rangePoint || !filters.rangePoint[0] || !filters.rangePoint[1]) return item;
      if (filters.rangePoint[0] <= item.current_point && filters.rangePoint[1] >= item.current_point) {
        return item;
      }
    }).filter((item) => {
      if (!filters.type || filters.type.value === 'all') return item;
      if (filters.type.value === 'exchange' && item.is_gift_exchange) {
        return item;
      }
      if (filters.type.value === 'unExchange' && !item.is_gift_exchange) {
        return item;
      }
    }).filter((item) => {
      if (!filters.smsCount) return item;
      if (Number(filters.smsCount) === item.sms_send_count) {
        return item;
      }
    });
    setListData(filtered);
  }, [filters.fromDate, filters.toDate, filters.rangePoint, filters.type, filters.smsCount]);

  /* API */
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

  const { mutate: sendCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postSendCampaign(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.mesage);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        } else {
          toast.error(data?.mesage);
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

  const { mutate: createOrUpdateCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postMakeOrUpdateCampaigns(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          getCampaign();
          setCampaign({
            ...campaign,
            isOpenAddOrUpdate: false,
          })
        }

      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCustomerPastServicesByCustomerId } = useMutation(
    'post-footer-form',
    (body: any) => getCustomerPastServices(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          console.log("🚀 ~ onSuccess: ~ data:", data)
          setStates({ ...states, isOpenModalDetail: true, type: '1', pastService: data?.data })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCustomerServicesByUsageByCustomerId } = useMutation(
    'post-footer-form',
    (body: any) => getCustomerServicesByUsage(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setStates({ ...states, isOpenModalDetail: true, type: '2', servicesByUsage: data?.data })
          console.log("🚀 ~ onSuccess: ~ data:", data)
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCustomerGiftExchangesByCustomerId } = useMutation(
    'post-footer-form',
    (body: any) => getCustomerGiftExchanges(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          if (!data?.data?.length) {
            return toast.info('Không tìm thấy thông tin đổi quà!');
          } else {
            return setStates({ ...states, isOpenModalDetail: true, type: '3', customerGiftExchanges: data?.data })
          }
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  /* End API */

  const handleGetPastServiceCustomer = (customerId: string) => {
    const body = { customer_ref: customerId };
    getCustomerPastServicesByCustomerId(body);
  }

  const handleGetServicesByUsageCustomer = (customerId: string) => {
    const body = { customer_ref: customerId };
    getCustomerServicesByUsageByCustomerId(body);
  }

  const handleGetGiftExchangesCustomer = (customerId: string) => {
    const body = { customer_ref: customerId };
    getCustomerGiftExchangesByCustomerId(body);
  }

  const handleValidateSendMessage = () => {
    if (sendSMS.campaignType?.value === 'SMS') {
      if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
        setSendSMSError({
          ...sendSMSEror,
          subject: 'Tiêu đề là bắt buộc để gửi tin nhắn',
          template: 'Cần chọn template để gửi tin nhắn',
          campaign: ''
        })
        return false;
      }
      return true;
    } else {
      if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
        setSendSMSError({
          ...sendSMSEror,
          subject: 'Tiêu đề là bắt buộc để gửi tin nhắn',
          content: 'Cần nhập nội dung tin nhắn để gửi tin nhắn'
        })
        return false;
      }
      return true;
    }
  }

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

  const handleAddOrUpdateCampaign = () => {
    if (!campaign.nameCampaign.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }
    const body = {
      campaign_id: campaign.id,
      campaign_name: campaign.nameCampaign,
      is_active: campaign.statusCampaign,
    }

    createOrUpdateCampaign(body)
  }
    const [dataRP,setDataRP] = useState([])
  const { mutate: getRevicePoint } = useMutation(
    'post-footer-form',
    (data:any) => getListPointsOfCustomer(data),
    {
      onSuccess: async (data:any) => {
        if (data?.status) {
           const filtered = data.data;
          setDataRP(filtered)
        }
      },
      onError: (error:any) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  const handleGetRevicePoint = (id:any) => {
    const body = {
      customer_ref: id
    }
    getRevicePoint(body)
  }
  const tablePointColumns = [
   
    {
      title: (<Typography content="Ngày tạo" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "create_date",
      align: "center",
      width: 130,
      sorter: (a: any, b: any) => new Date(a?.create_date).valueOf() - new Date(b?.create_date).valueOf(),
      showSorterTooltip: false,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography
            content={moment(record).format("DD/MM/YYYY")}
            modifiers={["13x18", "600", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Mã KH" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "customer_code",
      align: "center",
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"   onClick={() => {
          setGetListPointOfCustomer({ openModal: true, customer_id: data.customer_code })
            handleGetRevicePoint(data.customer_code)
         
        }}>
          <Typography content={record} modifiers={["13x18", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Họ tên khách hàng" modifiers={["14x20", "500", "center", "capitalize"]} styles={{textAlign:"left", marginLeft:"10px"}}/>),
      dataIndex: "customer_name",
      showSorterTooltip: false,
      align: "center",
      width:120,
      sorter: (a: any, b: any) => (a?.customer_name || "").localeCompare(b?.customer_name || ""),
      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ justifyContent:"start",width:"fit-content", marginLeft:"8px" }}   onClick={() => {
          setGetListPointOfCustomer({ openModal: true, customer_id: data.customer_code })
            handleGetRevicePoint(data.customer_code)
        }} >
          <Typography
            content={record}
            modifiers={["14x20", "600", "center", "uppercase", "blueNavy"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Điểm hiện tại" modifiers={["14x20", "500", "center", "capitalize"]}  styles={{textAlign:"right", marginRight:"0px"}}/>),
      dataIndex: "current_point",
      className: "ant-table-column_wrap",
      align: "center",
      sorter: (a: any, b: any) => a?.current_point - b?.current_point,
      showSorterTooltip: false,
      width:120,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
          style={{ justifyContent:"end"}} 
          onClick={() => {
          setGetListPointOfCustomer({ openModal: true, customer_id: data.customer_code })
            handleGetRevicePoint(data.customer_code)
        }}>
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} styles={{marginRight:"6px"}} />
        </div>
      ),
    },
    {
      title: (<Typography content="Điểm đang chờ" modifiers={["14x20", "500", "center", "capitalize"]}  styles={{textAlign:"right", marginRight:"6px"}}/>),
      dataIndex: "pending_point",
      align: "center",
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
        style={{ justifyContent:"end"}} 
          onClick={() => {
          setGetListPointOfCustomer({ openModal: true, customer_id: data.customer_code })
          handleGetRevicePoint(data.customer_code)
        }}>
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} styles={{marginRight:"0px"}} />
        </div>
      ),
    },
    {
      title: (<Typography content="Quy ra tiền" modifiers={["14x20", "500", "center", "capitalize"]}  styles={{textAlign:"right", marginRight:"0px"}}/>),
      dataIndex: "equivalent_amount",
      align: "center",
      width: 150,
      sorter: (a: any, b: any) => a?.equivalent_amount - b?.equivalent_amount,
      showSorterTooltip: false,
      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ justifyContent:"end" }}   onClick={() => {
          setGetListPointOfCustomer({ openModal: true, customer_id: data.customer_code })
          handleGetRevicePoint(data.customer_code)
          // dispatch(getListPointOfCustom({ customer_ref: data.customer_code }))
        }}>
          <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "green"]} styles={{ textAlign:"right", marginRight:"14px"}} />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày tích điểm gần nhất" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "latest_point_add_date",
      align: "center",
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography
            content={moment(record).format("DD/MM/YYYY")}
            modifiers={["13x18", "600", "center", "main"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày gửi SMS gần nhất" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "latest_sms_send_date",
      align: "center",
      width: 160,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography
            content={record ? moment(record).format("DD/MM/YYYY") : '---'}
            modifiers={["13x18", "600", "center", "main"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Số lần gửi SMS" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "sms_send_count",
      align: "center",
      width: 120,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={Number(record).toString()} modifiers={["14x20", "600", "center", "cg-red"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Đã đổi quà" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "is_gift_exchange",
      align: "center",
      width: 120,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record ? 'Đã Đổi' : "Chưa Đổi"} modifiers={["14x20", "600", "center", record ? 'green' : 'orange']} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 50,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
            <CTooltip placements="topLeft" title="Dịch vụ đã sử dụng"> <div className="ant-table-column_item">
          <Icon iconName="history2" onClick={() => handleGetPastServiceCustomer(data?.customer_code)} />
        </div> </CTooltip>
      ),
    },
    //  {
    //   title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
    //   align: "center",
    //   dataIndex: "",
    //   className: "",
    //   width: 50,
    //   ellipsis: true,
    //   fixed: 'right',
    //   render: (record: any, data: any) => (
    //         <CTooltip placements="topLeft" title="Xem lịch sử dùng điểm"> <div className="ant-table-column_item">
    //       <Icon iconName="history" onClick={() => { setGetListPointMinusOfCustomer({ openModal: true, customer_id: data.customer_code }); dispatch(getListPointMinusOfCustom({ customer_code: data.customer_code })) }} />
    //     </div> </CTooltip>
    //   ),
    // },
    // {
    //   title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
    //   align: "center",
    //   dataIndex: "",
    //   className: "",
    //   width: 50,
    //   ellipsis: true,
    //   fixed: 'right',
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item">
    //       <Icon iconName="fast_delivery" onClick={() => handleGetServicesByUsageCustomer(data?.customer_code)} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 50,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements="top" title="Thông tin đổi quà">
          <div className="ant-table-column_item">
            <Icon iconName="giftbox" onClick={() => handleGetGiftExchangesCustomer(data?.customer_code)} />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 50,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
      <CTooltip placements="topLeft" title="Gửi tin nhắn">
        <div className="ant-table-column_item">
          <Icon iconName="sending" onClick={() => setSendSMS({
            ...sendSMS, openModal: true, type: 'one',
            listCS: [{
              customer_ref: data.customer_code,
              ago_month: 0
            }] as any
          })} />
          </div>
        </CTooltip>  
      ),
    },
  ];

  const memoryTable = useMemo(() => (
    <div className='p-point_manager_table'>
      <PublicTable
        listData={listData}
        column={tablePointColumns}
        loading={loadingData}
        rowkey={"customer_code"}
        isPagination
        pageSizes={2000}
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
        handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
          setSendSMS({
            ...sendSMS,
            listCS: selectedRows.map((item: CustomerPointItem) => ({
              customer_ref: item.customer_code,
              ago_month: 0
            }))
          })
        }}
        handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
          setSendSMS({
            ...sendSMS,
            listCS: selectedRows.map((item: CustomerPointItem) => ({
              customer_ref: item.customer_code,
              ago_month: 0
            }))
          })
        }}
        handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
          setSendSMS({
            ...sendSMS,
            listCS: selectedRows.map((item: CustomerPointItem) => ({
              customer_ref: item.customer_code,
             ago_month: 0
            }))
          })
        }}
      />
    </div>
  ), [listData, loadingData])

  const memoryHeaderStatistic = useMemo(() => {
    return (
      <PublicHeaderStatistic isStatistic={false} >
        <div className='p-header-statistic_wrapper_left'>
          <div className='p-header-statistic_search'>
            <Input
              variant='simple'
              placeholder='Tìm kiếm khách hàng'
              type='text'
              iconName='search'
              value={filters.search}
              onChange={(event) => {
                setFilters({
                  ...filters, search: event.target?.value
                });
              }}
              handleClickIcon={() => {
                if (!filters.search) {
                  // setListData(responsePoint?.data)
                   dispatch(getListCustomerPoint({
      displayname: filters.search,
    }))
                } else {
                  // const newList = responsePoint?.data?.filter((item: CustomerPointItem) => item.customer_name.toLowerCase().search(filters.search.toLowerCase()) !== -1);
                  // setListData(newList);
                   dispatch(getListCustomerPoint({
      displayname: filters.search,
    }))
                }
              }}
              handleEnter={() => {
                 dispatch(getListCustomerPoint({
      displayname: filters.search,
    }))
                // if (!filters.search) {
                //   setListData(responsePoint?.data)
                // } else {
                //   const newList = responsePoint?.data?.filter((item: CustomerPointItem) => item.customer_name.toLowerCase().search(filters.search.toLowerCase()) !== -1);
                //   setListData(newList);
                // }
              }}
            />
          </div>
          <RangePoint
            value={filters.rangePoint as any}
            onChange={(value: [number, number]) => setFilters({
              ...filters, rangePoint: value
            })}
          />
          <div style={{marginBottom:"6px"}}> 
             <Dropdown
            dropdownOption={optionStateExchangeGift}
            variant='simple'
            placeholder='Trạng thái đổi quà'
            values={filters.type}
            handleSelect={(item) => setFilters({
              ...filters, type: item
            })}
          />
         </div>
          <div className='p-header-statistic_sms'>
            <Input
              variant='simple'
              placeholder='Số lần gửi tin nhắn'
              type='number'
              value={filters.smsCount}
              onChange={(event) => setFilters({
                ...filters, smsCount: event.target?.value.replace(/[^0-9.-]/g, '')
              })}
            />
          </div>
        </div>
        <div className='p-header-statistic_wrapper_right'>
          <span>Tổng lượt KH đã chọn:</span>
          <p>{sendSMS.listCS.length || 0}</p>
        </div>
      </PublicHeaderStatistic>
    )
  }, [filters, sendSMS, sendSMS.listCS])
     const columnTable = [
   
    {
      title: <Typography content="Thời gian" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'date',
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
      title: <Typography content="Hình thức" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'type_display',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
      },
     {
      title: <Typography content="Điểm" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"8px"}}/>,
      dataIndex: 'points',
       align: 'center',
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }} >
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung" modifiers={['12x18', '500', 'center', 'uppercase']}  styles={{textAlign:"left", marginLeft:"10px"}}/>,
      dataIndex: 'note',
      align: 'center',
      width: 340,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'left' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
   
   
  ];
   const columnTableMinus = [
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
      title: <Typography content="Ngày dùng điểm" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'date',
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
      title: <Typography content="Điểm sử dụng" modifiers={['12x18', '500', 'center', 'uppercase']}  styles={{textAlign:"right", marginRight:"8px"}}/>,
      dataIndex: 'points',
       align: 'center',
      width:170,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }} >
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung sử dụng điểm" modifiers={['12x18', '500', 'center', 'uppercase']}    styles={{textAlign:"left", marginLeft:"8px"}}/>,
      dataIndex: 'note',
      align: 'center',
      width: 340,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'left' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
   
   
  ];
      const tableMergeCustomer = useMemo(() => (
    <div className="t-header_wrapper_table" >
      <PublicTable
        column={columnTable}
        listData={dataRP}
        loading={responsePointOfCustomerLoading}
        size="middle"
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
  ), [dataRP])
      const tableMergeCustomerMinus = useMemo(() => (
    <div className="t-header_wrapper_table" >
      <PublicTable
        column={columnTableMinus}
        listData={responsePointMinusOfCustomer?.data}
        loading={responsePointMinusOfCustomerLoading}
        size="middle"
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
  ), [responsePointMinusOfCustomer])
  return (
    <div className='p-point_manager'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Quản lí điểm thưởng'}
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => {
            setFilters({
              fromDate: undefined as unknown as Date,
              toDate: undefined as unknown as Date,
              rangePoint: undefined as unknown as ArrayNumber,
              type: optionStateExchangeGift[0] as DropdownData,
              smsCount: '',
              search: '',
            })
          }}
    //       tabLeft={(
    //         <RangeDate variant='simple'
    //           value={{ from: states.fromDate, to: states.toDate }}
    //           defaultValue={{ from: states.fromDate, to: states.toDate }}
    //           handleOnChange={(from: any, to: any) => {
    //             setStates({
    //               ...states, fromDate: from, toDate: to,
    //             });
    //             dispatch(getListCustomerPoint({
    //   displayname: filters.search,
    // }))

    //           }} />
    //       )}
          isHideFilter
          isHideService
          isDial={false}
          isHideEmergency
          listBtn={(
            <>
              <div className='p-point_manager_header_total'>
                <span>Có: <strong style={{ color: '#f00' }}>{listData?.length || 0} </strong>Khách hàng</span>
              </div>
              <Button modifiers={['primary']} onClick={() => setCampaign({
                ...campaign,
                isOpen: true
              })}>
                <Typography content='Quản lí chiến dịch' modifiers={['400']} />
              </Button>
              {
                sendSMS.listCS.length > 0 ?
                
                    <Button modifiers={['foreign']} onClick={() => setSendSMS({
                      ...sendSMS, openModal: true, type: 'all'
                    })}>
                    <CTooltip placements="top" title="Gửi tin nhắn hàng loạt">    <Icon iconName={'send-message'} /> </CTooltip>
                    </Button>
                 
                  : null
              }
               <Button modifiers={['foreign']} onClick={() => setModeSeenRulePoint(true)}>
                    <CTooltip placements="top" title="Xem chính sách tích điểm">    <Icon iconName={'message'} /> </CTooltip>
                    </Button>
            </>
          )}
        />
        {memoryHeaderStatistic}
        {memoryTable}
      </PublicLayout>
      <CDrawer
        isOpen={states.isOpenModalDetail}
        titleHeader={states.type === '1' && "Dịch vụ khách hàng đã sử dụng" || states.type === '2' && 'Dịch vụ khách hàng đã sử dụng theo số lần sử dụng' || states.type === '3' && 'Lịch sử đổi quà'}
        handleOnClose={() => setStates({ ...states, isOpenModalDetail: false })}
        positon='left'
        widths={650}
        isHaveHeader
        isHaveHeader_custom
      >
        <div className={mapModifiers('p-point_manager_detail', states.type)}>
          {states.type === '1' && (
            <>
              {states.pastService?.length ? states?.pastService?.map((item: PastServiceDayItem, index: any) => (
                <div key={index} className={'p-point_manager_detail-1_item'}>
                  <div key={index} className={'p-point_manager_detail-1_date'}> {moment(item.payment_day).format('HH:mm - DD/MM/YYYY')} </div>
                  <div key={index} className={'p-point_manager_detail-1_service'}>
                    <table>
                      <thead>
                        <tr>
                          <th>Mã dịch vụ</th>
                          <th>Tên dịch vụ</th>
                          <th>SL</th>
                          <th>Giá tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.details?.map((child) => (
                          <tr key={child.service_code}>
                            <td>{child.service_code}</td>
                            <td>{child.service_name}</td>
                            <td>{child.quantity}</td>
                            <td>{child.unit_price.toLocaleString('vi-VN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )) : 'Không tìm thấy thông tin'}
            </>
          )}
          {states.type === '2' && (
            <>
              {states.servicesByUsage?.length ? (
                <div className={'p-point_manager_detail-2_item'}>
                  <table>
                    <thead>
                      <tr>
                        <th>Mã dịch vụ</th>
                        <th>Tên dịch vụ</th>
                        <th>Số lần dùng</th>
                        <th>Giá tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states?.servicesByUsage?.map((item: ServiceByUsageItem, index: any) => (
                        <tr key={item.no}>
                          <td>{item.service_code}</td>
                          <td>{item.service_name}</td>
                          <td>{item.usage_count}</td>
                          <td>{item.service_price.toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : 'Không tìm thấy thông tin'}
            </>
          )}
          {states.type === '3' && (
            <>
              {states.customerGiftExchanges?.length ? states.customerGiftExchanges.map((item: GiftExchangesItem, index: number) => (
                <div className={'p-point_manager_detail-3_item'} key={index}>
                  <div className={'p-point_manager_detail-3_label'}>
                    {moment(item.exchange_day).format('HH:mm - DD/MM/YYYY')}
                  </div>
                  <div className={'p-point_manager_detail-3_content'}>
                    <div className={'p-point_manager_detail-3_content_fields'}>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Điểm đổi quà:&nbsp;</p><span>{item.exchange_points}</span> </div>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Quy ra tiền:&nbsp;</p><span>{item.equivalent_amount.toLocaleString('vi-VN')}</span> </div>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Giá trị quà tặng:&nbsp;</p><span>{item.gift_value}</span> </div>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Điểm còn lại:&nbsp;</p><span>{item.remaining_points}</span> </div>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Người thực hiện:&nbsp;</p><span>{item.executor}</span> </div>
                      <div className={'p-point_manager_detail-3_content_field'}> <p>Nội dung:&nbsp;</p><span>{item.note}</span> </div>
                    </div>
                    <div className={'p-point_manager_detail-3_detail'}>
                      {item.gift_details?.length ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Mã quà tặng</th>
                              <th>Tên quà tặng</th>
                              <th>SL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.gift_details?.map((child) => (
                              <tr key={child.gift_code}>
                                <td>{child.gift_code}</td>
                                <td>{child.gift_name}</td>
                                <td>{child.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : <Typography content='Không tìm thấy thông tin chi tiết đổi quà' modifiers={['400', 'cg-red', 'italic']} />}
                    </div>
                  </div>
                </div>
              )) : ''}
            </>
          )}
        </div>
      </CDrawer>
      <CModal
        isOpen={sendSMS.openModal}
        title="Gửi tin nhắn"
        widths={600}
        textCancel='Thoát'
        textOK='Tiến hành gửi tin nhắn'
        onCancel={() => setSendSMS({
          ...sendSMS, openModal: false,
          
          campaignType: sendMessagetype[0] as unknown as GroupRadioType,
          template: undefined as unknown as DropdownData,
          campaign: undefined as unknown as DropdownData,
          content: '',
          subject: '',
        })}
        onOk={handleExcuteSendMessage}
      >
        {sendSMS.template && sendSMS.campaignType.value === "SMS" &&
          <div className='p-customer_leads_form_sms_header'>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Khách đã chọn:</span> <p>{sendSMS.listCS?.length}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Số tin nhắn (SMS) mỗi Khách:</span> <p>{sendSMS.template?.sms_count}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Tổng số tin nhắn (SMS) gởi đi:</span> <p>{sendSMS.listCS?.length * sendSMS.template?.sms_count}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Tổng tiền dự kiến:</span> <p>{Number(sendSMS.listCS?.length * sendSMS.template?.sms_count * AMOUNT_SMS)?.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </div>
        }
        <div className='p-point_manager_form_sms'>
          <div style={{ marginBottom: 8 }}>
            <Typography content='Kiểu tin nhắn:' modifiers={['400']} />
            <GroupRadio options={sendMessagetype} value={sendSMS.campaignType} handleOnchangeRadio={(item) => {
              setSendSMS({
                ...sendSMS, campaignType: item,
                template: undefined as any,
                content: '',
              })
              setSendSMSError({
                subject: '',
                template: '',
                content: '',
                campaign: ''
              });
            }} />
          </div>
          <Dropdown label='Chiến dịch' dropdownOption={listCampaign.dropdown || []} variant='simple' isRequired error={sendSMSEror.campaign} values={sendSMS.campaign} handleSelect={(item) => {
            setSendSMS({ ...sendSMS, campaign: item });
            setSendSMSError({ ...sendSMSEror, campaign: '', });
          }} />
          <Input label='Tiêu đề' variant='simple' isRequired error={sendSMSEror.subject} onChange={(event) => {
            setSendSMS({ ...sendSMS, subject: event?.target?.value });
            setSendSMSError({ ...sendSMSEror, subject: '', });
          }} />
          {sendSMS.campaignType?.value === 'SMS' &&
            <Dropdown label='Kịch bản' dropdownOption={templateSMS || []} variant='simple' isRequired error={sendSMSEror.template} handleSelect={(item) => {
              setSendSMS({ ...sendSMS, template: item });
              setSendSMSError({ ...sendSMSEror, template: '', });
            }} />
          }
          <TextArea error={sendSMSEror.content} label='Nội dung' id={''} readOnly={sendSMS?.campaignType?.value === 'SMS'} isResize value={sendSMS?.campaignType?.value === 'SMS' ? sendSMS.template?.value : sendSMS?.content}
            handleOnchange={(event) => {
              setSendSMS({ ...sendSMS, content: event?.target?.value });
              setSendSMSError({ ...sendSMSEror, content: '', });
            }}
          />
        </div>
      </CModal>
      <CDrawer
        isOpen={campaign.isOpen}
        handleOnClose={() => setCampaign({
          ...campaign,
          isOpen: false
        })}
        positon='left'
        widths={450}
        titleHeader="Quản lí chiến dịch"
        isHaveHeader
        isTransition
      >
        <div className='p-point_manager_campaign'>
          {listCampaign?.data?.length ? listCampaign?.data?.map((item) => (
            <div className='p-point_manager_campaign_item'>
              <div className='p-point_manager_campaign_item_left'>
                <div className='p-point_manager_campaign_item_left_field'>
                  <span>Tên chiến dịch:</span>
                  <p>{item?.label}</p>
                </div>
                <div className='p-point_manager_campaign_item_left_field'>
                  <span>Trạng thái:</span>
                  <Typography content={item?.active ? 'Hoạt động' : 'Đã tắt'} modifiers={['400', item?.active ? 'green' : 'cg-red', 'italic']} />
                </div>
              </div>
              <div className='p-point_manager_campaign_item_right'>
                <Icon iconName="edit_crm" onClick={() => setCampaign({
                  ...campaign,
                  isOpenAddOrUpdate: true,
                  isUpdate: true,
                  nameCampaign: item.label,
                  statusCampaign: item?.active,
                  id: Number(item.id),
                })} isPointer />
              </div>
            </div>
          )) : null}
        </div>
        <Button modifiers={['foreign']} style={{ marginTop: 12 }} onClick={() => setCampaign({
          ...campaign,
          isOpenAddOrUpdate: true,
          isUpdate: false,
          nameCampaign: '',
          statusCampaign: false,
          id: 0
        })}>
          <Typography content='Thêm chiến dịch' modifiers={['400']} />
        </Button>
      </CDrawer >
      <CModal
        isOpen={campaign.isOpenAddOrUpdate}
        title={campaign.isUpdate ? "Cập nhật thông tin chiến dịch" : "Thêm mới chiến dich"}
        onCancel={() => setCampaign({
          ...campaign,
          isOpenAddOrUpdate: false,
          id: 0,
        })}
        textCancel='Thoát'
        textOK={campaign.isUpdate ? 'Cập nhật' : 'Thêm mới'}
        onOk={handleAddOrUpdateCampaign}
      >
        <Input
          isRequired
          label='Tên chiến dịch'
          placeholder='Nhập tên chiến dịch'
          variant='simple'
          value={campaign.nameCampaign}
          onChange={(event) => setCampaign({
            ...campaign,
            nameCampaign: event.target.value
          })}
        />
        <Switchs
          label='Trạng thái'
          checked={campaign.statusCampaign}
          onChange={(check: boolean, event: any) => {
            setCampaign({
              ...campaign,
              statusCampaign: check,
            })
          }} />
      </CModal>
        <CModal
        isOpen={getListPointOfCustomer.openModal}
        widths={1000}
          title={"Lịch sử điểm"}
        onCancel={() => setGetListPointOfCustomer({
          openModal: false,
          customer_id: ""
        })}
        textCancel='Thoát'
        textOK={"Ok"}
        onOk={() => setGetListPointOfCustomer({
          openModal: false,
          customer_id: ""
        })}
      >
         {tableMergeCustomer}
      </CModal>
        <CModal
        isOpen={getListPointMinusOfCustomer.openModal}
        widths={1000}
          title={"Lịch sử sử dụng điểm"}
        onCancel={() => setGetListPointMinusOfCustomer({
          openModal: false,
          customer_id: ""
        })}
        textCancel='Thoát'
        textOK={"Ok"}
        onOk={() => setGetListPointMinusOfCustomer({
          openModal: false,
          customer_id: ""
        })}
      >
         {tableMergeCustomerMinus}
      </CModal>
        <CModal
        isOpen={modeSeenRulePoint}
        widths={650}
          title={""}
        onCancel={() => setModeSeenRulePoint(false)}
        textCancel='Thoát'
        textOK={"Ok"}
        onOk={() => setModeSeenRulePoint(false)}
      >
            <div
            style={{
                maxWidth: '800px',
              
              
             
            
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#4CAF50',
              marginBottom: '20px',
                    textTransform:"uppercase"
                }}
            >
                Chính sách Khách hàng giới thiệu Khách hàng
            </div>
            <div style={{ marginBottom: '20px', padding: '10px' }}>
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}
                >
                    Giới thiệu khách hàng thứ 1:
                </div>
                <div style={{ marginTop: '8px', lineHeight: '1.6', color: '#555' }}>
                    <strong>Người giới thiệu:</strong> Tặng 200.000 VNĐ tích vào ví.<br />
                    <strong>Người được giới thiệu:</strong> Giảm 200.000 VNĐ trực tiếp vào hóa đơn.
                </div>
            </div>
            <div style={{ marginBottom: '20px', padding: '10px' }}>
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}
                >
                    Giới thiệu khách hàng thứ 2, 3, 4:
                </div>
                <div style={{ marginTop: '8px', lineHeight: '1.6', color: '#555' }}>
                    <strong>Người giới thiệu:</strong> Nâng hạng thành viên VIP và tặng 300.000 VNĐ tích vào ví cho mỗi lần giới thiệu.<br />
                    <strong>Người được giới thiệu:</strong> Giảm 200.000 VNĐ trực tiếp vào hóa đơn.
                </div>
            </div>
            <div style={{ marginBottom: '20px', padding: '10px' }}>
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}
                >
                    Giới thiệu khách hàng thứ 5 trở đi:
                </div>
                <div style={{ marginTop: '8px', lineHeight: '1.6', color: '#555' }}>
                    <strong>Người giới thiệu:</strong> Nâng hạng thành viên V.VIP và tặng 500.000 VNĐ tích vào ví cho mỗi lần giới thiệu.<br />
                    <strong>Người được giới thiệu:</strong> Giảm 200.000 VNĐ trực tiếp vào hóa đơn.
                </div>
            </div>
            <div style={{ padding: '10px', fontStyle: 'italic', color: '#777' }}>
                Lưu ý: Các ưu đãi sẽ tự động được áp dụng sau khi khách hàng mới sử dụng dịch vụ.
            </div>
        </div>
      </CModal>
    </div >
  );
}

export default PointManagement;
