/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */


// import { log, timeStamp } from 'console';
import { Checkbox, Popover, Select } from 'antd';
import { optionFType, optionOrigin, sendMessagetype } from 'assets/data';
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
import moment from 'moment';
import { AMOUNT_SMS } from 'pages/CustomerLeads';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
// import { RequestListAfterExams } from 'services/api/afterexams/types';
import { getCampaigns, getSMSTemplates, postSendCampaign } from 'services/api/point';
import { CustomerFTypeData, ResponseCustomerFType, TemplateSMSItem } from 'services/api/point/types';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getCustomerFTypeByOwner, getListCustomerPoint } from 'store/point';
const { Option } = Select;
const CustomerAllowFType: React.FC = () => {
  const dispatch = useAppDispatch();

  const responseCustomerFType = useAppSelector((state) => state.point.responseCustomerFType);
  const responseCustomerFTypeLoading = useAppSelector((state) => state.point.responseCustomerFTypeLoading);
   const storageEmployeeList = localStorage.getItem('listCSKH');
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);

  const [loadingFType, setLoadingFType] = useState(responseCustomerFTypeLoading);
  const [listCustomerFType, setListCustomerFType] = useState(responseCustomerFType?.data?.items ?? []);
   const [listEmployeeTeams, setListEmployeeTeams] = useState(storageEmployeeList ? JSON.parse(storageEmployeeList || '') : [] as any);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 1000 });
  const [totalItem, setTotalItem] = useState(responseCustomerFType?.data?.paging?.total_count);
  
  const employeeId = localStorage.getItem("employee_id");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<string[]>([]);
  const [states, setStates] = useState({
    launch_source_group: undefined as unknown as DropdownData,
    launch_source: undefined as unknown as DropdownData,
    f_type: optionFType[0] as DropdownData,
    dateFrom: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    dateTo: moment(new Date()).format('YYYY-MM-DDT23:59:59'),
    keyWord: '',
    page: 1,
    pageSize: 1000
  })

  const bodyRequestGetList = {
    owner_id: '',
    from_date: moment(states.dateFrom).format('YYYY-MM-DDT00:00:00'),
    to_date: moment(states.dateTo).format('YYYY-MM-DDT23:59:59'),
    launch_source_group_id: states.launch_source_group?.value ?? 0,
    launch_source_ids: states?.launch_source?.map((i: any) => i?.id).join(',') || 'all',
    employee_id: employeeId ?? 'Không tìm thấy nhân viên',
    f_type: states?.f_type?.value,
    keyword: states.keyWord,
    page: states.page,
    limit: pagination?.pageSize,
  }

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
      const [newData, setNewData] = useState([]);
   useEffect(() => {
    const updatedData = listEmployeeTeams.map((item: any) => {
      // Tách tên khỏi nhãn bằng cách loại bỏ "CS. "
      
      const name = item.label.replace("CS. ", "");
      return { text: name, value: name };
    });

    setNewData(updatedData);
  }, [listEmployeeTeams]);
  useEffect(() => {
    setLoadingFType(responseCustomerFTypeLoading);
    setListCustomerFType(responseCustomerFType?.data?.items ?? []);
    setTotalItem(responseCustomerFType?.data?.paging?.total_count);
  }, [responseCustomerFType, responseCustomerFTypeLoading]);

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
       document.title = 'Khách hàng F1,F2,F3 | CRM'
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


  const columnTable = [
    {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'RowNumber',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: number) => (
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
          <Typography content={`${index + 1}`} modifiers={['13x18', '600', 'main', 'justify']} />

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
      title: <Typography content="Tên Khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'customer_fullname',
      align: 'center',
      className: "ant-table-column_wrap",
       filters: newData.map((item: any) => ({
        text: item.text,
        value: item.value,
      })),
      onFilter: (value: any, record: any) => {
        return record.follower_employee_name?.includes(value);
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
        }}
          style={{ display:'flex', flexDirection:"column",alignItems:"start" }} 
        >
          <Typography content={record} modifiers={['14x20', '600', 'center', 'main']} />
           {data.follower_employee_id && (
            <Typography
              content={`Follow: ${data.follower_employee_name}`}
              modifiers={["12x18", "400", "left", "green"]}
            />
          )}
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
      title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_name',
      align: 'center',
     filters: stateLaunchSource?.map((item) => ({ text: item.label, value: item?.label })),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_name?.toLowerCase()?.search(value?.toLowerCase()) !== -1;
      },
    //  filterDropdown: ({ confirm }: any) => (
    //     <div style={{ padding: 8, display: 'flex', flexDirection: 'column',gap:"10px" }}>
    //        <div style={{maxHeight:"250px", overflowY:"scroll"}}>
    //          <Checkbox
    //         checked={pendingFilters.includes('ALL')}
    //          onChange={(e) => {
         
    //           if (e.target.checked) {
    //             const allFilterValues = stateLaunchSource.map(
    //               (item) => item.label
    //             );
    //             setPendingFilters(['ALL', ...allFilterValues]);
    //           } else {
    //             setPendingFilters([]);
    //           }
    //         }}
    //       >
    //         Tất cả
    //       </Checkbox>
    //       <Checkbox.Group
    //         options={stateLaunchSource.map((item) => ({
    //           label: item.label,
    //           value: item.label,
    //         }))}
    //         value={pendingFilters}
    //          onChange={(checkedValues) => {
             
    //           if (checkedValues.includes('ALL')) {
    //             const allFilterValues = stateLaunchSource.map(
    //               (item) => item.label
    //             );
    //             setPendingFilters(['ALL', ...allFilterValues]);
    //           } else {
    //             setPendingFilters(checkedValues);
    //           }
    //         }}
    //         style={{ display: 'flex', flexDirection: 'column',paddingBottom:"5px" }}
    //        />
    //       </div>
    //        <div style={{ display: "flex", alignItems: "center",justifyContent:"space-between", borderTop:"1px solid #f0f0f0" }}>
    //             <div
           
    //         onClick={() => {
    //           setPendingFilters([]);
    //           setSelectedFilters([]);
    //         }}
    //         style={{ marginTop: 8 ,fontSize:"14px", lineHeight:"1.5714285714285714", height:"24px",padding:"0px 7px",borderRadius:"4px"}}
    //       >
    //         Bỏ lọc
    //       </div>
    //           <div
             
    //         onClick={() => {
    //           setSelectedFilters(pendingFilters);
    //           confirm();
    //         }}
    //         style={{ marginTop: 8, background:"#1677ff",boxShadow:"0 2px 0 rgba(5, 145, 255, 0.1)", borderRadius:"4px", fontSize:"14px",color:"white",height:"24px",lineHeight:"1.5714285714285714",padding:"0px 7px" }}
    //       >
    //         Đồng ý
    //          </div>
           
    //        </div>
         
    //     </div>
    //   ),
    //   filteredValue: selectedFilters.length > 0 ? selectedFilters : null, // Áp dụng filter đã chọn
    //   onFilter: (value: any, record: any) => {
    //     if (selectedFilters.includes('ALL')) {
    //       return true; // Hiển thị tất cả các hàng khi chọn "Tất cả"
    //     }
    //     return record?.launch_source_name
    //       ?.toLowerCase()
    //       .includes(value?.toLowerCase());
    //   },
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
      title: <Typography content="Lần cuối khám" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'lastvisit',
      align: 'center',
      width: 160,
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
        </div>),
    },
    {
      title: <Typography content="Cách đây" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'ago_month',
      align: 'center',
      width: 160,
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
          <Typography content={record + ' tháng'} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>),
    },
    {
      title: <Typography content="Số lần khám" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'session_count',
      align: 'center',
      sorter: (a: any, b: any) => a?.session_count - b?.session_count,
      width: 160,
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
        </div>),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 80,
      render: (record: any, data: any) => (
        <CTooltip placements={'top'} title={'Gửi tin nhắn'}>  <div className="ant-table-column_item" style={{ display: "flex", justifyContent: "center",alignItems:"center"}}>
          <Icon iconName="sending" onClick={() => setSendSMS({
            ...sendSMS, openModal: true, type: 'one',
            listCS: [{
              customer_ref: data.customer_id,
              ago_month: data.ago_month,
              // current_point: 200
            }] as any
          })} />
        </div></CTooltip>
      ),
    },
  ];

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
          pageSizes={1000}
          isPagination
          isNormal
          totalItem={totalItem}
          rowkey={'customer_id'}
          rowClassNames={(record: any, index: any) => {
            return index % 2 === 0 ? 'bg-gay-blur' : ''
          }}
          handleChangePagination={(page: any, pageSize: any) => {
            handleChangePagination(page, pageSize);
          }}
          handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                  ago_month: item?.ago_month
              }))
            })
          }}
          handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                 ago_month: item?.ago_month
              }))
            })
          }}
          handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                 ago_month: item?.ago_month
              }))
            })
          }}
        />
        {/* {loadingFType ? (
          <div>Loading...</div>
        ) : (
          
        )} */}
      </div>
    )
  }, [listCustomerFType, loadingFType, totalItem, sendSMS])

  return (
    <div className='p-customer_f_type'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Khách hàng phân loại theo F'}
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
                 <Dropdown
                dropdownOption={[{ id: 99, label: 'Tất cả', value: '0' }, ...stateLaunchSourceGroups]}
                variant='simple'
                placeholder='Brand'
                values={states.launch_source_group}
                handleSelect={(item: any) => {
                  setStates({
                    ...states,
                    launch_source_group: item
                  });
                  setLoadingFType(true);
                  dispatch(getCustomerFTypeByOwner({
                    ...bodyRequestGetList,
                    launch_source_group_id: item?.value,
                  }))
                    .then(() => setLoadingFType(false))
                    .catch(() => setLoadingFType(false));
                }}
              />
             </div>
      
              {/* <Dropdown
                dropdownOption={[{ id: 99, label: 'Tất cả', value: '0' }, ...stateLaunchSource]}
                variant='simple'
                values={states.launch_source}
                placeholder='Nguồn'
                handleSelect={(item: any) => {
                  setStates({
                    ...states,
                    launch_source: item
                  });
                  setLoadingFType(true);
                  dispatch(getCustomerFTypeByOwner({
                    ...bodyRequestGetList,
                    launch_source_id: item?.value,
                  }))
                    .then(() => setLoadingFType(false))
                    .catch(() => setLoadingFType(false));
                }}
              /> */}
             
              <div style={{maxWidth:"320px", minWidth:"200px"}}>
                
                  <MultiSelect
  option={[
    { id: "all", label: 'Tất cả', value: null as any },
    ...stateLaunchSource.map((item: any) => ({
      ...item,
      // Sử dụng kiểm tra an toàn ?. để tránh lỗi
      disabled: states.launch_source?.some((source: any) => source.id === "all"), // Disable nếu "Tất cả" đang được chọn
    })),
  ]}
  variant="simple"
  value={states.launch_source?.map((item: any) => item?.value) || []}  // Đảm bảo value luôn là một mảng
  placeholder="-- Chọn nguồn --"
  handleChange={(item: any) => {
    const isAllSelected = item.some((i: any) => i?.id === "all");
    // Nếu "Tất cả" được chọn, xóa các lựa chọn khác
    const newSelection = isAllSelected
      ? [{ id: "all", label: 'Tất cả', value: null }]
      : item.filter((i: any) => i?.id !== "all");

    setStates({ ...states, launch_source: newSelection });
  }}
  handleBlur={() => {
    setLoadingFType(true);
    dispatch(
      getCustomerFTypeByOwner({
        ...bodyRequestGetList,
        launch_source_ids: bodyRequestGetList.launch_source_ids,
      })
    )
      .then(() => setLoadingFType(false))
      .catch(() => setLoadingFType(false));
  }}
/>
                </div>
                <div style={{maxWidth:"300px", minWidth:"200px"}}>

              <Dropdown
                dropdownOption={optionFType}
                variant='simple'
                values={states.f_type}
                placeholder='Chọn loại KH'
                handleSelect={(item: any) => {
                  setStates({
                    ...states,
                    f_type: item
                  });
                  setLoadingFType(true);
                  dispatch(getCustomerFTypeByOwner({
                    ...bodyRequestGetList,
                    f_type: item?.value,
                  }))
                    .then(() => setLoadingFType(false))
                    .catch(() => setLoadingFType(false));
                }}
              /></div>  
              <Input variant='simple'
                placeholder='Nhập thông tin KH cần tìm kiếm'
                onChange={(event) => {
                  setStates({
                    ...states,
                    keyWord: event?.target?.value
                  });
                }}
                handleEnter={() => {
                  setLoadingFType(true);
                  dispatch(getCustomerFTypeByOwner({
                    ...bodyRequestGetList,
                  }))
                    .then(() => setLoadingFType(false))
                    .catch(() => setLoadingFType(false));
                }}
              />
            </>
          }
        >
          <div className='p-customer_leads_header_total'>
            <span>Đã chọn: <strong style={{ color: '#f00' }}>{sendSMS.listCS?.length ?? 0} </strong>Khách hàng</span>
          </div>
          <div className='p-customer_leads_header_total'>
            <span>Có: <strong style={{ color: '#f00' }}>{totalItem ?? 0} </strong>Khách hàng</span>
          </div>
        </PublicHeaderStatistic>
        {memoryTable}
      </PublicLayout>
      {/* Layout gửi tin nhắn chiến dịch khi bấm vào nút gửi tin */}
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
  )
}

export default CustomerAllowFType;
