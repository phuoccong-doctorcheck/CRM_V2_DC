/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Checkbox, Popover, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
// import TextArea from "antd/es/input/TextArea";
import { exampleDataItemAppointmentView, sendMessagetype } from "assets/data";
import Button from "components/atoms/Button";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Loading from "components/atoms/Loading";
import RangeDate from "components/atoms/RangeDate";
import Switchs from "components/atoms/Switchs";
import TextAreaS from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicLayout from "components/templates/PublicLayout";
import StatisticOverview from "components/templates/StatisticOverview";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import { AMOUNT_SMS } from "pages/CustomerLeads";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCampaigns, getSMSTemplates, postSendCampaign } from "services/api/point";
import { TemplateSMSItem } from "services/api/point/types";
import { StatisticCustomerItem } from "services/api/statistics/types";
import { getInfosCustomerById } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getCustomerStatiscal } from "store/statistics";
import mapModifiers, { exportDatatoExcel } from "utils/functions";

const CReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigatorRoute = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isLoadingStatistic = useAppSelector((state) => state.statistic.isLoadingStatiscal);
  const storeStatistic = useAppSelector((state) => state.statistic.responseStatiscal);

  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const getRoles = localStorage.getItem('roles');
  const storageEmployeeList = localStorage.getItem('listCSKH');
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
    const [listEmployeeTeams, setListEmployeeTeams] = useState(storageEmployeeList ? JSON.parse(storageEmployeeList || '') : [] as any);
  const [stateStatistic, setStateStatistic] = useState(storeStatistic.data)
  const [stateStatisticLoading, setStateStatisticLoading] = useState(isLoadingStatistic)
  const [dataFinish, setDataFinish] = useState<StatisticCustomerItem[]>(storeStatistic.data || [])
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [payment, setPayment] = useState(0)
  const [isOpenDetailService, setIsOpenDetailService] = useState(false)
  const [listDetailService, setListDetailService] = useState()
  const [isOverview, setIsOverview] = useState(false)
  const [isLoadingSwitchScreen, setIsLoadingSwitchScreen] = useState(false)
  const [stateParams, setStateParams] = useState({
    type: '',
    f_type: '',
    status: '',
    launch_source_group_id: '',
    launch_source_id: '',
    launch_source_type_id: '',
    affiliate_name: '',
    package_name: '',
  })
  const [dataFilter, setDataFilter] = useState({
    fromDay: new Date(moment(new Date()).format('YYYY-MM-DDT00:00:00')) as Date,
    toDay: undefined as unknown as Date,
  });
  const [infoCustomer, setInfoCustomer] = useState({
    name: '',
    date: '',
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
    const [newData, setNewData] = useState([]);
   useEffect(() => {
    const updatedData = listEmployeeTeams.map((item: any) => {
      // Tách tên khỏi nhãn bằng cách loại bỏ "CS. "

      const name = item.label.replace("CS. ", "");
      return { text: name, value: name };
    });

    setNewData(updatedData);
  }, [listEmployeeTeams]);
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

  useLayoutEffect(() => {
    if (window.location.href.replace(window.location.origin, '') === '/reports?type=grid&role=cskh' || (listRoles?.some((role: any) => ['adDashBoard'].some((i => i === role?.role_name))))) {
      return;
    }
    return navigatorRoute('/not-have-permission');
  }, []);

  useLayoutEffect(() => {
    setStateStatistic(storeStatistic.data);
    setDataFinish(storeStatistic.data);
  }, [storeStatistic.data]);

  useEffect(() => {
    dispatch(getCustomerStatiscal({
      fromdate: moment(dataFilter.fromDay).format('YYYY-MM-DDT00:00:00'),
      todate: moment(dataFilter.toDay || new Date()).format('YYYY-MM-DDT23:59:59')
    }))
     getTemplateSMSOfCampaign();
     getCampaign();
  }, []);

  const [filterColumn, setFilterColumn] = useState({
    partner: [],
    package: [],
    status: [],
  });

  const optionStateCS = [
    { id: 2, label: "Chưa đến", value: "new" },
    { id: 3, label: "Đã xong", value: "done" },
    { id: 4, label: "Đã hủy", value: "canceled" },
    { id: 5, label: "Đang phục vụ", value: "inprogress" },
  ];

  useEffect(() => {
    setStateStatisticLoading(isLoadingStatistic);
  }, [isLoadingStatistic]);

  useLayoutEffect(() => {
    setStateStatistic(storeStatistic.data);
    setDataFinish(storeStatistic.data);
  }, [storeStatistic.data]);

  const handleConvertData = (data: StatisticCustomerItem[], value: string, key: string) => {
    try {
      let newData: any[] = [...data];
      if (value.trim() && value.includes(',')) {
        newData = newData.filter((record: any) => {
          if (['launch_source_group_id', 'launch_source_id', 'launch_source_type_id'].includes(key)) {
            return value.split(',').some((y: any) => Number(y) === record[key])
          } else {
            return value.split(',').some((y: string) => y?.search(record[key]) !== -1)
          }
        });
      } else if (value.trim()) {
        newData = newData.filter((record: any) => {
          if (['launch_source_group_id', 'launch_source_id', 'launch_source_type_id'].includes(key)) {
            return Number(value) === record[key]
          } else {
            return value.search(record[key]) !== -1
          }
        });
      }
      return newData;
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:137 ~ handleConverData ~ err:", err)
    }
  }

  useEffect(() => {
    if (!Object.values(stateParams).some((value) => value.trim())) {
      setDataFinish(storeStatistic.data);
    } else {
      for (const [key, value] of Object.entries(stateParams)) {
        if (!value.trim()) {
          continue;
        } else {
          setDataFinish((prev: any) => handleConvertData(prev, value, key) as any);
        }
      }
    }
  }, [storeStatistic.data, dataFilter.fromDay, dataFilter.toDay, window.location.pathname]);

  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case 'affiliate_name':
        uniqueValues = Array.from(new Set((stateStatistic || [])?.map((item: any) => item?.affiliate_name).filter(Boolean)));
        break;
      case 'package_name':
        uniqueValues = Array.from(new Set((stateStatistic || [])?.map((item: any) => item?.package_name).filter(Boolean)));
        break;
      case 'status_display':
        uniqueValues = Array.from(new Set((stateStatistic || [])?.map((item: any) => item?.status_display).filter(Boolean)));
        break;
      default: break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  }

  useLayoutEffect(() => {
    setFilterColumn({
      ...filterColumn,
      partner: handleGetOptionFilterColumn('affiliate_name'),
      package: handleGetOptionFilterColumn('package_name'),
      status: handleGetOptionFilterColumn('status'),
    });
  }, [storeStatistic.data, isLoadingStatistic]);

  const handleCountCustomerAllowPackage = (type: string) => {
    let count = 0;
    if (!dataFinish?.length) return count;

    switch (type) {
      case 'package_a_male':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Tiêu Chuẩn Dành Cho Nam'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_a_female':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Tiêu Chuẩn Dành Cho Nữ'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_b_male':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Chuyên Sâu Dành Cho Nam'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_b_female':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Chuyên Sâu Dành Cho Nữ'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_c_male':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('VIP Dành Cho Nam'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_c_female':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('VIP Dành Cho Nữ'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_d_male':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Tầm Soát Ung Thư Ống Tiêu Hoá Tiêu Chuẩn Dành Cho Nam'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'package_d_female':
        count = dataFinish.filter((data: any) => data.package_name?.toLocaleLowerCase().search('Tầm Soát Ung Thư Ống Tiêu Hoá Tiêu Chuẩn Dành Cho Nữ'.toLocaleLowerCase()) !== -1).length;
        break;
      case 'note_package':
        count = dataFinish.filter((data: any) => !data.package_name?.trim()).length;
        break;
    }

    return count;
  }

  const handleConvertInfoTolistService = (data: any) => {
    const groupedData: any[] = [];
    setPayment(_.sum(data.map((i: any) => i?.service_prices)))

    data?.forEach((item: any, index: any) => {
      const groupOrderNumber = item.service_group_order_number;
      const existingGroup = groupedData.find(group => group.service_group_order_number === groupOrderNumber);

      if (existingGroup) {
        existingGroup.child.push(item);
      } else {
        groupedData.push({
          id_group: index,
          name: item.service_group_name,
          service_group_order_number: groupOrderNumber,
          child: [item],
        });
      }
    });
    return groupedData;
  }
  const getNameFType = (data: any) => {

    if (data.launch_source_id === 4) {
      return (data.f_type === null ? "" : data.f_type) + " " + "(WOM)"
    }
    else {
      return (data.f_type === null ? "" : data.f_type)
    }
  }
  const ColumnTableCompany = [
    {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 40,
      className: "ant-table-column_wrap",
      render: (text: any, record: any, index: number) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = record;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          < Typography content={`${index + 1}`} modifiers={['12x18', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày đặt lịch" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'appointment_date',
      width: 135,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? moment(record).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['13x18', '600', 'main', 'center']} />
          {/* <Typography content={data.register_date ? moment(data.register_date).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['12x18', '400', 'center']} /> */}
        </div>
      ),
    },
    {
      title: <Typography content="Ngày đến khám" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'register_date',
      width: 135,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? moment(record).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['13x18', '600', 'main', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên khách hàng" modifiers={['12x18', '500', 'center']} styles={{textAlign:"left", marginLeft:"4px"}}/>,
      align: 'center',
      dataIndex: 'customer_fullname',
      width: 190,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}
          style={{ display: "flex",flexDirection:"column", alignItems:"start"}} 
        >
          <Typography content={record} modifiers={['14x20', '600', 'main', 'center']} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography content={data?.customer_phone.replace('+84-', '0')} modifiers={['12x18', '600', 'center', 'orange']} />
          </div>
        </div>
      ),
    },
    {
      title: <Typography content="Năm sinh" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'year_of_birth',
      width: 120,
      sorter: (a: any, b: any) => Number(new Date().getFullYear() - a?.year_of_birth) - Number(new Date().getFullYear() - b?.year_of_birth),
      showSorterTooltip: false,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography content={record} modifiers={['14x20', '600', 'center', 'green']} />&nbsp;-&nbsp;
            <Typography content={`${Number(new Date().getFullYear()) - Number(record)}`} modifiers={['14x20', '600', 'center', 'blueNavy']} />&nbsp;<span style={{ fontWeight: '500', fontSize: 13 }}>Tuổi</span>
          </div>
        </div>
      ),
    },
      {
      title: <Typography content="Loại khách hàng" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'f_type',
      width: 140,
      filters: [
        { text: 'F1', value: 'F1' },
        { text: 'F2', value: 'F2' },
        { text: 'F3', value: 'F3' },
        { text: 'WOM', value: 'WOM' },
        // { text: 'Khách hàng tái khám', value: 'Khách hàng tái khám' },
      ],
        onFilter: (value: any, record: any) => {
          if (value === "WOM") {
             return record?.launch_source_id === 4 && record?.f_type === "F1"
          }
          else {
            if (value === "F1")
            {
              return record?.launch_source_id !== 4 && record?.f_type === value
            }
            else {
              
               return record?.f_type === value
            }
            
          }
       
       // return record.f_type?.toLocaleLowerCase().search(value.toLocaleLowerCase()) !== -1
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={getNameFType(data)} modifiers={['12x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Người chăm sóc" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'follower_employee_name',
      width: 140,
      filters: newData.map((item: any) => ({
        text: item.text,
        value: item.value,
      })),
      onFilter: (value: any, record: any) => {
        return record.follower_employee_name?.includes(value);
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['12x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'status_display',
      width: 130,
      filters: [
        { text: 'Chưa đến', value: 'Chưa đến' },
        { text: 'Đang phục vụ', value: 'Đang phục vụ' },
        { text: "Đã xong", value: "Đã xong" },
        { text: 'Đã huỷ', value: 'Đã huỷ' },
      ],
      // sorter: (a: any, b: any) => a?.status_display?.localeCompare(b?.status_display || ''),
      onFilter: (value: any, record: any) => {
        return record.status_display?.toLocaleLowerCase().search(value.toLocaleLowerCase()) !== -1
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{
            color:
              data?.status === 'new' && '#ff7800'
              || data?.status === 'inprogress' && '#1976D2'
              || data?.status === 'checkin' && '#1976D2'
              || data?.status === 'done' && '#28a745'
              || data?.status === 'canceled' && '#f00'
              || '#333'
          }}>
            <Typography content={record} modifiers={['12x18', '600', 'center']} />
          </div>
        </div>
      ),
    },
    {
      title: <Typography content="Công ty" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'launch_source_group_name',
      width: 160,
      filters: stateLaunchSourceGroups.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_id === value
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', 'blueNavy']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'launch_source_name',
      width: 240,
        filters: stateLaunchSource.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_id === value
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
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', [2].includes(data?.launch_source_id) ? 'cg-red' : ([3, 4].includes(data?.launch_source_id) ? 'blueNavy' : 'main')]} />
        </div>
      ),
    },
    {
      title: <Typography content="Chuyển đổi" modifiers={['12x18', '500', 'center']} />,
      width: 180,
      align: 'center',
      dataIndex: 'launch_source_type_name',
      filters: stateLaunchSourceTypes.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => { return record?.launch_source_type_id === value },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Đối tác" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'affiliate_name',
      width: 220,
      filters: [...filterColumn.partner.filter((i: any) => !i?.value?.includes('[DC'))],
      onFilter: (value: any, record: any) => {
        return record.affiliate_name?.toLocaleLowerCase().search(value.toLocaleLowerCase()) !== -1
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', [2].includes(data?.launch_source_id) ? 'cg-red' : ([3, 4].includes(data?.launch_source_id) ? 'blueNavy' : 'jet')]} />
        </div>
      ),
    },
    {
      title: <Typography content="Sử dụng dịch vụ" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 280,
      dataIndex: 'package_name',
      filters: [{ text: 'Dịch vụ lẻ', value: 'dichvule' }, ...filterColumn.package],
      onFilter: (value: any, record: any) => {
        if (value === 'dichvule') {
          return !record.package_name.trim()
        } else {
          return record.package_name?.toLocaleLowerCase().search(value.toLocaleLowerCase()) !== -1
        }
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => {
        return (
          <div className="ant-table-column_item">
            <div
              onClick={async () => {
                setInfoCustomer({ name: data?.customer_fullname, date: data?.appointment_date })
                const list: any = await handleConvertInfoTolistService(JSON.parse(data.jsonitems));
                setListDetailService(list)
                setIsOpenDetailService(true);
              }}
              style={{ cursor: data?.package_name?.trim() ? 'auto' : 'pointer' }}
            >
              <Typography content={record?.trim() ? record : 'Sử dụng dịch vụ lẻ'} modifiers={['13x18', '600', 'center', record?.trim() ? 'blueNavy' : 'main']} />
            </div>
          </div>
        )
      }
    },
    {
      title: <Typography content="Nguồn quảng cáo" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'launch_source_group_name',
      width: 300,
      render: (record: any, data: any) => {
        return (
          <div className="ant-table-column_item" onClick={() => {
            // const { customer_id, customer_fullname, ...prevData } = data;
            // if (customer_id) {
            //   Cookies.set('id_customer', customer_id);
            //   dispatch(getInfosCustomerById({ customer_id: customer_id }));
            //   window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            // } else {
            //   toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            // }
          }}>
            <div
              className={mapModifiers("p-manager_customer_content_column_ads", _.isNull(data?.facebook_ads_image) && 'none_image')}
              onClick={() => { window.open(`https://www.facebook.com/${data.facebook_ads_id}`) }}
              style={{
                maxWidth: 300
              }}
            >
              {data?.facebook_ads_title &&
                <TextArea value={data?.facebook_ads_title} />
              }
            </div>
          </div>
        )
      },
    },
    {
      title: <Typography content="Tiền thuốc" modifiers={['12x18', '500', 'center']} styles={{textAlign:"right"}} />,
      align: 'center',
      dataIndex: 'total_drugs',
      sorter: (a: any, b: any) => a?.total_drugs - b?.total_drugs,
      showSorterTooltip: false,
      width: 150,
      // fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}
            style={{justifyContent:"end"}}
        >
          <Typography content={record ? `${record.toLocaleString('vi-VN')}` : ''} modifiers={['13x18', '600', 'center', 'cg-red']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tiền dịch vụ" modifiers={['12x18', '500', 'center']} styles={{textAlign:"right"}}/>,
      align: 'center',
      dataIndex: 'total_services',
      sorter: (a: any, b: any) => a?.total_services - b?.total_services,
      showSorterTooltip: false,
      width: 150,
      // fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}
        style={{justifyContent:"end"}}
        >
          <Typography content={record ? `${record.toLocaleString('vi-VN')}` : ''} modifiers={['13x18', '600', 'center', 'cg-red']} />
        </div>
      ),
    },
     {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
       width: 80,
       fixed: 'right',
      render: (record: any, data: any) => (
       <CTooltip placements={'top'} title={'Gửi tin nhắn'}>  <div className="ant-table-column_item" style={{ display: "flex", justifyContent: "center",alignItems:"center"}}>
          <Icon iconName="sending" onClick={() => setSendSMS({
            ...sendSMS, openModal: true, type: 'one',
            listCS: [{
              customer_ref: data.customer_id,
              ago_month:data.appointment_date !== null ? getDayago(data.appointment_date) : 0,
              // current_point: 200
            }] as any
          })} />
        </div></CTooltip>
      ),
    },
  ];

  const ColumnTableDetailService = [
    {
      title: <Typography content="Dịch vụ" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'service_name',
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="DVT" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'unit_name',
      width: 60,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="SL" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'quantity',
      width: 40,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Đơn giá" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 140,
      dataIndex: 'service_prices',
      render: (record: any, data: any) => (
        <Typography content={record ? record?.toLocaleString("vi-VN") : '0.00'} modifiers={['12x18', '400', 'center', record === "Khách hàng mới" ? 'blueNavy' : 'jet']} />
      ),
    },
    {
      title: <Typography content="Thành tiền" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'service_prices',
      width: 120,

      render: (record: any, data: any) => (
        <Typography content={record ? record?.toLocaleString("vi-VN") : '0.00'} modifiers={['12x18', '400', 'center']} />
      ),
    },
  ];

  const handleConvertStatus = (value: string[]) => {
    const newString = optionStateCS?.filter((item) => {
      if (value.length > 1) {
        return value.some((y: string) => y.search(item.label) !== -1);
      } else {
        return value.some((yy) => yy === item.label);
      }
    }).map((o) => o.value).join(',');
    return newString;
  }
    const getDayago = (data: any) => {
    const currentDate = dayjs(); // Lấy thời gian hiện tại

  // Chuyển đổi chuỗi thời gian thành đối tượng dayjs
    const parsedGivenDate = dayjs(data);
    return currentDate.diff(parsedGivenDate, 'month');
  }
  const memoTableStatisticEnterprise = useMemo(() => (
    <div className="t-statistic_manager_detail">
      <PublicTable
        listData={stateStatistic}
        isPagination={false}
        loading={isLoadingStatistic}
        column={ColumnTableCompany}
        expandedRowClassNames={(record: any, index: any, indent: any) => ''}
        rowkey="master_id"
        size="small"
        pageSizes={100}
        isHideRowSelect={false}
        isbordered={false}
        scroll={{
          x: 'max-content',
          y: 'calc(100vh - 180px)' ,
        }}
        handleOnchange={(pagination: any, filters: any, sorter: any, extra: any) => {
          setStateParams({
            ...stateParams,
            affiliate_name: _.isNull(filters.affiliate_name) ? "" : filters.affiliate_name.join(','),
            launch_source_group_id: _.isNull(filters.launch_source_group_name) ? "" : filters.launch_source_group_name.join(','),
            // launch_source_id: _.isNull(filters.launch_source_name) ? "" : filters.launch_source_name.join(','),
            launch_source_type_id: _.isNull(filters.launch_source_type_name) ? "" : filters.launch_source_type_name.join(','),
            f_type: _.isNull(filters.f_type) ? "" : filters.f_type.join(','),
            package_name: _.isNull(filters.package_name) ? "" : filters.package_name.join(','),
            status: _.isNull(filters.status_display) ? "" : handleConvertStatus(filters.status_display),
          });
          window.history.pushState(
            null,
            "",
            `?type=${isOverview ? 'overview' : 'grid'}${filters.affiliate_name ? `&affiliate_name=${filters.affiliate_name?.join(',')}` : ''}${filters.launch_source_group_name ? `&launch_source_group_name=${filters.launch_source_group_name?.join(',')}` : ''}${filters.launch_source_name ? `&launch_source_name=${filters.launch_source_name?.join(',')}` : ''}${filters.launch_source_type_name ? `&launch_source_type_name=${filters.launch_source_type_name?.join(',')}` : ''}${filters.f_type ? `&f_type=${filters.f_type?.join(',')}` : ''}${filters.package_name ? `&package_name=${filters.package_name?.join(',')}` : ''}${filters.status_display ? `&status_display=${filters.status_display?.join(',')}` : ''}`.replaceAll(' ', '-')
          )
          if (Object.values(filters).every(value => value === null)) {
            setDataFinish(storeStatistic.data);
          } else {

            setDataFinish(extra.currentDataSource);
          }
        }}
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
          handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                 ago_month:item.appointment_date  !== null ? getDayago(item.appointment_date) : 0,
              }))
            })
          }}
          handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                 ago_month:item.appointment_date  !== null ? getDayago(item.appointment_date) : 0,
              }))
            })
          }}
          handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
            setSendSMS({
              ...sendSMS,
              openModal: false,
              listCS: selectedRows.map((item: any) => ({
                customer_ref: item?.customer_id,
                 ago_month:item.appointment_date  !== null ? getDayago(item.appointment_date) : 0,
              }))
            })
          }}
      />
    </div>
  ), [storeStatistic.data, stateStatisticLoading, filterColumn, dataFilter.fromDay, dataFilter.toDay])

  const renderUI = useMemo(() => {
    return isLoadingSwitchScreen ? (
      <div className="p-manager_customer_loading_switch" />
    ) : (
      isOverview ? <StatisticOverview dataFilter={dataFilter} /> : memoTableStatisticEnterprise
    );
  }, [isOverview, isLoadingSwitchScreen, storeStatistic.data, stateStatisticLoading, dataFilter]);

  const handleChangeOverview = () => {
    const timeout = setTimeout(() => {
      setIsLoadingSwitchScreen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  };

  useLayoutEffect(() => {
    handleChangeOverview();
  }, [isOverview])

  useLayoutEffect(() => {
    document.title = "Thống kê | CRM";
  }, [])
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
  const statisticHeader = useMemo(() => (
    <>
      <div className="t-statistic_manager_total_item">
        <span>TSUT:</span>
        <p>{(dataFinish?.filter((item: any) => item?.package_name?.toLocaleLowerCase().search('Tầm Soát Ung Thư'.toLocaleLowerCase()) !== -1))?.length}</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>NSDD:</span>
        <p>{(dataFinish?.filter((item: any) => item?.jsonitems?.toLocaleLowerCase().search('chẩn đoán H. pylori'.toLocaleLowerCase()) !== -1 &&
          item?.jsonitems?.toLocaleLowerCase().search('Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo'.toLocaleLowerCase()) === -1))?.length}</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>NSĐT:</span>
        <p>{(dataFinish?.filter((item: any) => item?.jsonitems?.toLocaleLowerCase().search('chẩn đoán H. pylori'.toLocaleLowerCase()) === -1 &&
          item?.jsonitems?.toLocaleLowerCase().search('Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo'.toLocaleLowerCase()) !== -1))?.length}</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>NSC:</span>
        <p>{(dataFinish?.filter((item: any) => item?.jsonitems?.toLocaleLowerCase().search('chẩn đoán H. pylori'.toLocaleLowerCase()) !== -1 &&
          item?.jsonitems?.toLocaleLowerCase().search('Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo'.toLocaleLowerCase()) !== -1))?.length}</p>
      </div>
      <div className="t-statistic_manager_total_item" style={{
        borderLeft: '1px solid #dbdbdb',
        paddingLeft: 8,
      }}>
        <span>Dịch vụ lẻ:</span>
        <p>{handleCountCustomerAllowPackage('note_package')}</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Gói C:</span>
        <div className="t-statistic_manager_total_item_package">
          <span>
            Nam: {handleCountCustomerAllowPackage('package_c_male')}<a style={{ margin: '0 4px' }}>-</a>
            Nữ: {handleCountCustomerAllowPackage('package_c_female')}
          </span>
        </div>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Gói B:</span>
        <div className="t-statistic_manager_total_item_package">
          <span>
            Nam: {handleCountCustomerAllowPackage('package_b_male')}<a style={{ margin: '0 4px' }}>-</a>
            Nữ: {handleCountCustomerAllowPackage('package_b_female')}
          </span>
        </div>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Gói A:</span>
        <div className="t-statistic_manager_total_item_package">
          <span>
            Nam: {handleCountCustomerAllowPackage('package_a_male')}<a style={{ margin: '0 4px' }}>-</a>
            Nữ: {handleCountCustomerAllowPackage('package_a_female')}
          </span>
        </div>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Số KH:</span>
        <p>{dataFinish?.length || 0}</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Tiền thuốc</span>
        <p>{Math.floor(_.sum(dataFinish?.map((item: any) => item?.total_drugs)))?.toLocaleString("vi-VN")} VNĐ</p>
      </div>
      <div className="t-statistic_manager_total_item">
        <span>Tiền dịch vụ</span>
        <p>{Math.floor(_.sum(dataFinish?.map((item: any) => item?.total_services)))?.toLocaleString("vi-VN")} VNĐ</p>
      </div>
    </>
  ), [dataFinish])

  return (
    <PublicLayout isShowPopupChat={false} isShowPopupTelephone={false}>
      <div className="p-manager_customer">
        {stateStatisticLoading ?
          <div className="p-manager_customer_header_skeleton">
            <Skeleton.Input active={true} size={'default'} />
          </div> :
          <PublicHeader
            titlePage="Thống Kê"
            className="p-manager_customer_header"
            handleFilter={() => { }}
            handleCleanFilter={() => { }}
            handleGetTypeSearch={() => { }}
            handleOnClickSearch={(data: string) => { }}
            isHideLibraly
            isHideService
            isDial={false}
            isHideEmergency
            listBtn={(
              <>
                
                {!isOverview &&
                  <Button
                    modifiers={["primary"]}
                    onClick={() => {
                   
                      exportDatatoExcel(dataFinish.map((item: any) => ({
                        appointment_date: item?.appointment_date ? moment(item?.appointment_date).format('HH:mm - DD/MM/YYYY') : '',
                        register_date: item?.register_date ? moment(item?.register_date).format('HH:mm - DD/MM/YYYY') : '',
                        customer_fullname: item?.customer_fullname,
                        birthday: item?.year_of_birth,
                        old: Number(new Date().getFullYear()) - Number(item?.year_of_birth),
                        f_type: item?.f_type,
                        status_display: item?.status_display,
                        launch_source_group_name: item?.launch_source_group_name,
                        launch_source_name: item?.launch_source_name,
                        launch_source_type_name: item?.launch_source_type_name,
                        affiliate_name: item?.affiliate_name,
                        package_name: item?.package_name.trim() ? item?.package_name : 'Sử dụng dịch vụ lẻ',
                        total_services: item?.total_services,
                      })),
                        ["Ngày Đặt Lịch", "Ngày Đến Khám", "Tên Khách Hàng", "Năm sinh", "Tuổi", "Loại Khách Hàng", "Trạng Thái", "Công Ty", "Nguồn", "Hình thức chuyển đổi", "Đối Tác", "Gói dịch vụ", "Doanh Thu"],//Header mapping index
                        `thong-ke_${moment(new Date()).format("DD-MM-YYYY")}`,
                        "statistic"
                      );
                    }}
                  >
                    <Icon iconName="excel" size="20x20" />
                  </Button>}
                 {
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
              </>
            )}
            tabLeft={
              <div className="p-manager_customer_header_statistic">
                <RangeDate
                  variant="simple"
                  handleOnChange={(from: any, to: any) => {
                    setDataFilter({
                      ...dataFilter,
                      fromDay: new Date(moment(from).format('YYYY-MM-DDT00:00:00')),
                      toDay: new Date(moment(to).format('YYYY-MM-DDT23:59:59')),
                    });
                  }}
                  value={{
                    from: dataFilter?.fromDay,
                    to: dataFilter?.toDay,
                  }}
                  fomat="DD/MM/YYYY"
                />
                <Button
                  isLoading={isLoadingStatistic}
                  disabled={isLoadingStatistic}
                  onClick={() => {
                    const check = (dataFilter?.toDay.valueOf() - dataFilter?.fromDay?.valueOf()) / (1000 * 60 * 60 * 24);
                    // if (check < 30) {
                      dispatch(getCustomerStatiscal({
                        fromdate: moment(dataFilter.fromDay || new Date()).format('YYYY-MM-DDT00:00:00'),
                        todate: moment(dataFilter.toDay || new Date()).format((dataFilter.toDay || new Date()).getDate() === new Date().getDate() ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DDT23:59:59')
                      }))
                    // } else {
                    //   toast.info('Khoảng thời gian không thể quá 30 ngày!');
                    // }
                  }}>
                  <Typography content='Tìm kiếm' />
                </Button>
               
                {/* <div className="t-statistic_manager_switch">
                  <Switchs
                    variant={'simple'}
                    textOn="Chi tiết"
                    textOff="Tổng quan"
                    defaultChecked={isOverview}
                    onChange={(checked: boolean, event: any) => {
                      setIsOverview(checked);
                      setIsLoadingSwitchScreen(true);
                      window.history.pushState(
                        null,
                        "",
                        `?type=${checked ? 'overview' : 'grid'}`
                      )
                    }}
                    disabled={isLoadingSwitchScreen || isLoadingStatistic}
                  />
                </div> */}
              </div>
            }
            isHideCleanFilter
            isHideFilter
          />
        }
        <div className={mapModifiers("p-manager_customer_content")}>
          <div className="t-statistic_manager">
            {stateStatisticLoading ?
              <div className="t-statistic_manager_skeleton">
                <Skeleton.Input active={true} size={'default'} />
              </div> :
              <div className="t-statistic_manager_total">
                {!isOverview && (
                  statisticHeader
                )}
              </div>
            }
            {renderUI}
          </div>
        </div>
      </div>
      <CModal
        isOpen={isOpenDetailService}
        onCancel={() => setIsOpenDetailService(false)}
        onOk={() => setIsOpenDetailService(false)}
        widths={1000}
        isHideOk
        textCancel='Hủy'
        title={
          <p className="p-manager_customer-detail_header">
            <span>Chi tiết dịch vụ của KH:</span>&nbsp;<span style={{ color: '#1976D2' }}>{`${infoCustomer.name}`}</span>, Ngày:&nbsp;<span style={{ color: '#1976D2' }}>{moment(infoCustomer.date).format('HH:mm - DD/MM/YYYY')}</span>
          </p>}
      >
        <div className="p-manager_customer-detail_service">
          <div className="p-manager_customer-detail_service_heading">
            <PublicTable
              listData={exampleDataItemAppointmentView}
              isHideRowSelect
              column={ColumnTableDetailService}
              isbordered
            />
          </div>
          <div className="p-manager_customer-detail_service_content">
            <PublicTable
              listData={listDetailService}
              loading={_.isEmpty(listDetailService)}
              isHideRowSelect
              isHideHeader
              defaultExpandAllRow={false}
              rowkey="id_group"
              column={[
                {
                  title: '',
                  align: 'left',
                  dataIndex: 'name',
                  render: (record: any, data: any) => (
                    <div className="p-booking_schedule_heading">
                      <Typography
                        content={`${record}(${data?.child?.length})`}
                        modifiers={['16x24', '600', 'justify', 'blueNavy']}
                      />
                    </div>
                  ),
                }]}
              expandedRender={(data) => (
                <PublicTable
                  isSimpleHeader
                  column={ColumnTableDetailService}
                  listData={data?.child}
                  size="small"
                  rowkey="service_id"
                  isbordered
                  isPagination={false}
                  isHideRowSelect
                  isHideHeader
                  handleOnDoubleClick={(item: any) => {
                  }}
                  rowClassNames={(record, index) => ''}
                />
              )}
              isExpandable
            />
          </div>
          {/* {
            !_.isEmpty(listDetailService) && (
              <div className="p-manager_customer-detail_service_money">
                <span>Thành tiền:</span>
                <p>{payment?.toLocaleString("vi-VN")} VNĐ</p>
              </div>
            )
          } */}
        </div>
      </CModal>
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
          <TextAreaS error={sendSMSEror.content} label='Nội dung' id={''} readOnly={sendSMS?.campaignType?.value === 'SMS'} isResize value={sendSMS?.campaignType?.value === 'SMS' ? sendSMS.template?.value : sendSMS?.content}
            handleOnchange={(event) => {
              setSendSMS({ ...sendSMS, content: event?.target?.value });
              setSendSMSError({ ...sendSMSEror, content: '', });
            }}
          />
        </div>
      </CModal>
    </PublicLayout >
  );
};

export default CReport;
