/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox } from 'antd';
import { sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getCampaigns, getCustomerLeads, getSMSTemplates, postSendCampaign } from 'services/api/point';
import { CustomerLeadItem, TemplateSMSItem } from 'services/api/point/types';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getCustomerLeadsData } from 'store/point';
import { exportDatatoExcel } from 'utils/functions';

export const AMOUNT_SMS = 390;

const CustomerLeads: React.FC = () => {
  const dispatch = useAppDispatch();

  const storeLoadingLeads = useAppSelector((state) => state.point.loadingCustomerLeads);
  const storeResponseLeads = useAppSelector((state) => state.point.responseCustomerLeads);

  const [loadingLeads, setLoadingLeads] = useState(storeLoadingLeads);
  const [listCustomerLeads, setListCustomerLeads] = useState(storeResponseLeads?.data?.items || []);
  const [customerCount, setCustomerCount] = useState<any[]>([]);
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
  const [states, setStates] = useState({
    launchSourceGroupID: undefined as unknown as DropdownData,
    launchSourceID: undefined as unknown as DropdownData,
    dateFrom: new Date(moment(new Date()).format('YYYY-MM-01')),
    dateTo: new Date(moment(new Date()).format('YYYY-MM-DD')),
    keyword: '',
    status: undefined as unknown as DropdownData,
    page: 1,
    size: 5000,
  })
  const [filterColumn, setFilterColumn] = useState({
    launch_source_group: [],
    launch_source: [],
    status: [],
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

  const [dataFinish, setDataFinish] = useState<CustomerLeadItem[]>(storeResponseLeads?.data?.items || [])
  useLayoutEffect(() => {
    dispatch(getCustomerLeadsData({
      launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
      launch_source_id: Number(states.launchSourceID?.value ?? 0),
      from_date: moment(states.dateFrom).format('YYYY-MM-DDT00:00:00'),
      to_date: moment(states.dateTo).format('YYYY-MM-DDT23:59:59'),
      keyword: states.keyword,
      page: states.page,
      limit: states.size,
    }));
    getTemplateSMSOfCampaign();
    getCampaign();
     document.title = 'Khách hàng tiềm năng | CRM'
  }, [])
  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case 'launch_source_group_name':
        uniqueValues = Array.from(new Set((listCustomerLeads || [])?.map((item: any) => item?.launch_source_group_name).filter(Boolean)));
        break;
      case 'launch_source_name':
        uniqueValues = Array.from( new Set(
            (listCustomerLeads || [])
              ?.map((item) => item?.launch_source_name)
              .filter(Boolean)
          ));
        break;
      case 'master_count':
        uniqueValues = Array.from(new Set((listCustomerLeads || [])?.map((item: any) => Number(item?.master_count) === 0 ? 'Chưa đặt lịch' : 'Đã đặt lịch nhưng hủy').filter(Boolean)));
        break;
      default: break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  }
  const [ex, setEx] = useState("")
  
  useEffect(() => {
    setFilterColumn({
      ...filterColumn,
      launch_source_group: handleGetOptionFilterColumn('launch_source_group_name') as any,
      launch_source: handleGetOptionFilterColumn('launch_source_name'),
      status: handleGetOptionFilterColumn('master_count'),
    });
      setDataFinish(storeResponseLeads?.data?.items)
  }, [storeResponseLeads?.data?.items]);

  
  useEffect(() => {
    setListCustomerLeads(storeResponseLeads?.data?.items);
    setLoadingLeads(storeLoadingLeads);
    setDataFinish(storeResponseLeads?.data?.items)
  }, [storeResponseLeads?.data?.items, storeLoadingLeads])

  /* API */

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

  /* API */

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

  const handleChangePagination = (pages: number, size: number) => {
    // setStates({
    //   ...states, page: pages, size: size
    // });
    // dispatch(getCustomerLeadsData({
    //   launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
    //   launch_source_id: Number(states.launchSourceID?.value ?? 0),
    //   from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
    //   to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
    //   keyword: states.keyword,
    //   page: pages, limit: size
    // }));
  };
  const getDayago = (data: any) => {
    const currentDate = dayjs(); // Lấy thời gian hiện tại

  // Chuyển đổi chuỗi thời gian thành đối tượng dayjs
    const parsedGivenDate = dayjs(data);
    return currentDate.diff(parsedGivenDate, 'month');
  }
  /* Column */
  const columnTable = [
    {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'RowNumber',
      align: 'center',
      width: 50,
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
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày tạo" modifiers={['12x18', '500', 'center', 'uppercase']} />,
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
      title: <Typography content="Mã Khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_id',
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
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên Khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'customer_fullname',
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
        }}
        style={{ justifyContent:"start" }} 
        >
          <Typography content={record} modifiers={['14x20', '600', 'center', 'main']} />
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
      //    filters: filterColumn.launch_source_group.map((group: any) => ({ text: group.text, value: group.value })),
      filters:  [
        { text: 'endoclinic.vn', value: 'endoclinic.vn' },
        { text: 'doctorcheck.vn', value: 'doctorcheck.vn' },
        // { text: 'F3', value: 'F3' },
      
        // { text: 'Khách hàng tái khám', value: 'Khách hàng tái khám' },
      ],
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_name == value
      },
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
          <Typography content={record} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_name',
      align: 'center',
         filters: stateLaunchSource?.map((item) => ({ text: item.label, value: item?.label })),
      onFilter: (value: any, record: any) => {
        if (value.includes("(WoM)")) {
          return record.launch_source_name?.includes("(WoM)");
        } else {
          return (
            record.launch_source_name
              ?.toLocaleLowerCase()
              .search(value?.toLocaleLowerCase()) !== -1
          );
        }
      },
      //  filterDropdown: ({ confirm }: any) => (
      //   <div style={{ padding: 8, display: 'flex', flexDirection: 'column',gap:"10px" }}>
      //      <div style={{maxHeight:"250px", overflowY:"scroll"}}>
      //        <Checkbox
      //       checked={pendingFilters.includes('ALL')}
      //        onChange={(e) => {
         
      //         if (e.target.checked) {
      //           const allFilterValues = stateLaunchSource.map(
      //             (item) => item.label
      //           );
      //           setPendingFilters(['ALL', ...allFilterValues]);
      //         } else {
      //           setPendingFilters([]);
      //         }
      //       }}
      //     >
      //       Tất cả
      //     </Checkbox>
      //     <Checkbox.Group
      //       options={stateLaunchSource.map((item) => ({
      //         label: item.label,
      //         value: item.label,
      //       }))}
      //       value={pendingFilters}
      //        onChange={(checkedValues) => {
             
      //         if (checkedValues.includes('ALL')) {
      //           const allFilterValues = stateLaunchSource.map(
      //             (item) => item.label
      //           );
      //           setPendingFilters(['ALL', ...allFilterValues]);
      //         } else {
      //           setPendingFilters(checkedValues);
      //         }
      //       }}
      //       style={{ display: 'flex', flexDirection: 'column',paddingBottom:"5px" }}
      //      />
      //     </div>
      //      <div style={{ display: "flex", alignItems: "center",justifyContent:"space-between", borderTop:"1px solid #f0f0f0" }}>
      //           <div
           
      //       onClick={() => {
      //         setPendingFilters([]);
      //         setSelectedFilters([]);
      //       }}
      //       style={{ marginTop: 8 ,fontSize:"14px", lineHeight:"1.5714285714285714", height:"24px",padding:"0px 7px",borderRadius:"4px"}}
      //     >
      //       Bỏ lọc
      //     </div>
      //         <div
             
      //       onClick={() => {
      //         setSelectedFilters(pendingFilters);
      //         confirm();
      //       }}
      //       style={{ marginTop: 8, background:"#1677ff",boxShadow:"0 2px 0 rgba(5, 145, 255, 0.1)", borderRadius:"4px", fontSize:"14px",color:"white",height:"24px",lineHeight:"1.5714285714285714",padding:"0px 7px" }}
      //     >
      //       Đồng ý
      //        </div>
           
      //      </div>
         
      //   </div>
      // ),
      // filteredValue: selectedFilters.length > 0 ? selectedFilters : null, // Áp dụng filter đã chọn
      // onFilter: (value: any, record: any) => {
      //   if (selectedFilters.includes('ALL')) {
      //     return true; // Hiển thị tất cả các hàng khi chọn "Tất cả"
      //   }
      //   return record?.launch_source_name
      //     ?.toLowerCase()
      //     .includes(value?.toLowerCase());
      // },
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
          <Typography content={record} modifiers={['14x20', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'master_count',
      align: 'center',
       filters:  [
        { text: 'Chưa đặt lịch', value: 'Chưa đặt lịch' },
        { text: 'Đã đặt lịch nhưng hủy', value: 'Đã đặt lịch nhưng hủy' },
        // { text: 'F3', value: 'F3' },
      
        // { text: 'Khách hàng tái khám', value: 'Khách hàng tái khám' },
      ],
    //  filters: filterColumn.status.map((group: any) => ({ text: group.text, value: group.value })),
      onFilter: (value: any, record: any) => {
      
        return (record?.master_count === 0 ? 'Chưa đặt lịch' : 'Đã đặt lịch nhưng hủy') === value
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={Number(record) === 0 ? 'Chưa đặt lịch': Number(record) === -1 ? 'Đã hủy lịch' : 'Đã đặt lịch'} modifiers={['14x20', '600', 'justify', Number(record) === 0 ? 'orange':Number(record) === -1 ? 'cg-red' : 'blueNavy']} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 80,
      render: (record: any, data: any) => (
       
        <div className="ant-table-column_item" style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
          <CTooltip placements="top" title="Gửi tin nhắn">    <Icon iconName="sending" onClick={() =>
          {
           
            setSendSMS({
              ...sendSMS, openModal: true, type: 'one',
        
              listCS: [{
                customer_ref: data.customer_id,
                ago_month: getDayago(data.create_date) || 0,
              }] as any
            })
          }} /></CTooltip>
        </div>
      ),
    },
  ];

  /* Column */
  const memoryTableCampaign = useMemo(() => {
    return (
      <PublicTable
        listData={listCustomerLeads}
        column={columnTable}
        rowkey={'customer_id'}
        isPagination
        loading={loadingLeads}
        pageSizes={150}
      //  totalItem={storeResponseLeads?.total_items ?? 0}
         totalItem={
          (storeResponseLeads?.status &&
           listCustomerLeads?.length) ||
          0
        }
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
        handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
          setSendSMS({
            ...sendSMS,
            openModal: false,
            listCS: selectedRows.map((item: any) => ({
              customer_ref: item.customer_id,
              ago_month: getDayago(item.create_date) || 0
            }))
          })
        }}
        handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
          setSendSMS({
            ...sendSMS,
            openModal: false,
            listCS: selectedRows.map((item: any) => ({
              customer_ref: item.customer_id,
               ago_month:  getDayago(item.create_date) || 0
            }))
          })

        }}
        handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
          setSendSMS({
            ...sendSMS,
            openModal: false,
            listCS: selectedRows.map((item: any) => ({
              customer_ref: item.customer_id,
               ago_month:  getDayago(item.create_date) || 0
            }))
          })
        }}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        handleOnchange={(pagination: any, filters: any, sorter: any, extra: any) => {
          if (Object.values(filters).every(value => value === null)) {
            setDataFinish(storeResponseLeads?.data?.items);
            setCustomerCount([]);
          } else {
            setDataFinish(extra.currentDataSource);
            setCustomerCount(extra.currentDataSource);
          }
        }}
      />
    )
  }, [storeResponseLeads?.data?.items, storeResponseLeads, storeLoadingLeads, loadingLeads, listCustomerLeads])

  return (
    <div className='p-customer_leads'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Khách hàng tiềm năng'}
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          isHideFilter
          isHideService
          className='p-customer_leads_header'
          isDial={false}
          isHideEmergency
          isHideCleanFilter
          listBtn={(
            <><Button
              modifiers={["primary"]}
              onClick={() => {
                exportDatatoExcel(dataFinish.map((item: CustomerLeadItem) => ({
                  RowNumber: item.RowNumber,
                  create_date: moment(item?.create_date).format('HH:mm DD-MM-YYYY'),
                  customer_id: item?.customer_id,
                  customer_fullname: item?.customer_fullname,
                  customer_phone: item?.customer_phone?.replace('+84-', '0'),
                  launch_source_group_name: item?.launch_source_group_name,
                  launch_source_name: item?.launch_source_name,
                  total_services: item?.master_count === 0 ? 'Chưa đặt lịch' : 'Đã đặt lịch nhưng hủy',
                })),
                  ["STT", "Ngày tạo", "Mã khách hàng", "Tên Khách Hàng", "Số Điện Thoại", "Công Ty", "Nguồn", "Trạng thái"],//Header mapping index
                  `Danh sách KH tiềm năng từ ${moment(states.dateFrom).format('DD-MM-YYYY')} đến ${moment(states.dateTo).format('DD-MM-YYYY')}`,
                  "report"
                );
              }}
            >
              <Icon iconName="excel" size="20x20" />
            </Button>
              {
                sendSMS.listCS.length > 0 ?
                  <CTooltip placements={'top'} title={'Gửi tin nhắn hàng loạt'}>
                    <div>
                    <Button modifiers={['foreign']} onClick={() => setSendSMS({
                      ...sendSMS, openModal: true, type: 'all'
                    })}>
                      <Icon iconName={'send-message'} />
                      </Button>
                    </div>
                  </CTooltip>
                  : null
              }
            </>
          )}
        />
        <PublicHeaderStatistic isStatistic={false}
          leftNode={
            <>
              <RangeDate variant='simple'
                fomat='DD-MM-YYYY'
                value={{ from: states.dateFrom, to: states.dateTo }}
                defaultValue={{ from: states.dateFrom, to: states.dateTo }}
                handleOnChange={(from: any, to: any) => {
                  setStates({
                    ...states, dateFrom: from, dateTo: to,
                  });
                  const body = {
                    launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
                    launch_source_id: Number(states.launchSourceID?.value ?? 0),
                    from_date: moment(from).format('YYYY-MM-DD 00:00:00'),
                    to_date: moment(to).format('YYYY-MM-DD 23:59:59'),
                    keyword: states.keyword,
                    page: states.page,
                    limit: states.size,
                  }
                  dispatch(getCustomerLeadsData(body));
                }} />
              <Dropdown
                dropdownOption={[{ id: 99, label: 'Tất cả', value: '0' }, ...stateLaunchSourceGroups]}
                variant='simple'
                placeholder='Brand'
                handleSelect={(item: any) => {
                  setStates({
                    ...states, launchSourceGroupID: item
                  });
                  dispatch(getCustomerLeadsData({
                    launch_source_id: Number(states.launchSourceID?.value ?? 0),
                    from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
                    to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
                    keyword: states.keyword,
                    page: states.page,
                    limit: states.size,
                    launch_source_group_id: Number(item?.value),
                  }));
                }}
              />
              <Dropdown
                dropdownOption={[{ id: 99, label: 'Tất cả', value: '0' }, ...stateLaunchSource]}
                variant='simple'
                placeholder='Nguồn'
                handleSelect={(item: any) => {
                  setStates({
                    ...states, launchSourceID: item
                  });
                  dispatch(getCustomerLeadsData({
                    launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
                    from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
                    to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
                    keyword: states.keyword,
                    page: states.page,
                    limit: states.size,
                    launch_source_id: Number(item?.value),
                  }));
                }}
              />
              < Input
                variant='simple'
                placeholder='Tìm kiếm khách hàng'
                type='text'
                iconName='search'
                value={states.keyword}
                onChange={(event) => {
                  setStates({
                    ...states, keyword: event?.target?.value
                  });
                }}
                handleClickIcon={() => {
                  dispatch(getCustomerLeadsData({
                    launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
                    launch_source_id: Number(states.launchSourceID?.value ?? 0),
                    from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
                    to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
                    page: states.page,
                    limit: states.size,
                    keyword: states.keyword
                  }));
                }}
                handleEnter={() => {
                  dispatch(getCustomerLeadsData({
                    launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
                    launch_source_id: Number(states.launchSourceID?.value ?? 0),
                    from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
                    to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
                    page: states.page,
                    limit: states.size,
                    keyword: states.keyword
                  }));
                }}
              />
              <Dropdown
                dropdownOption={[
                  { id: 99, label: 'Tất cả', value: 'all' },
                  { id: 98, label: 'Đã đặt lịch', value: '1' },
                  { id: 97, label: 'Chưa đặt lịch', value: '0' },
                   { id: 96, label: 'Đã hủy lịch', value: '-1' },
                ]}
                variant='simple'
                placeholder='Trạng thái'
                handleSelect={(item: any) => {
                  setStates({
                    ...states, status: item
                  });
                  if (item.value === 'all') {
                    setListCustomerLeads(storeResponseLeads?.data?.items);
                  } else {
                    const newList = storeResponseLeads?.data?.items?.filter((record) => record.master_count === Number(item.value));
                    setListCustomerLeads(newList);
                  }
                }}
              />
            </>
          }>
          <div className='p-customer_leads_header_total'>
            <span>Tổng KH đã chọn: <strong style={{ color: '#f00' }}>{sendSMS.listCS?.length || 0} </strong>Khách hàng</span>
          </div>
          <div className='p-customer_leads_header_total'>
            <span>Có: <strong style={{ color: '#f00' }}>{customerCount?.length || listCustomerLeads?.length || 0} </strong>Khách hàng</span>
          </div>
        </PublicHeaderStatistic>
        <div className='p-customer_leads_table'>
          {memoryTableCampaign}
        </div>
      </PublicLayout>
      <CModal
        isOpen={sendSMS.openModal}
        title="Gửi tin nhắn"
        widths={600}
        textCancel='Thoát'
        textOK='Tiến hành gửi tin nhắn'
        onCancel={() => setSendSMS({
          ...sendSMS, openModal: false,
          listCS: [],
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
        <div className='p-customer_leads_form_sms'>
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
            <Dropdown label='Kịch bản' dropdownOption={templateSMS || []} variant='simple' isRequired error={sendSMSEror.template} values={sendSMS.template} handleSelect={(item) => {
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
    </div>
  );
}

export default CustomerLeads;
