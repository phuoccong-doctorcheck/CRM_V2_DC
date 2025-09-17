/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { OptionStatusAfterExams } from 'assets/data';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
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
import { useSip } from 'components/templates/SipProvider';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postStagesByIdAfterExams, SaveQuickNoteAfterExams } from 'services/api/afterexams';
import { ItemListAfterExams, RequestListAfterExams } from 'services/api/afterexams/types';
import { postCallOutCustomer } from 'services/api/customerInfo';
import { getListToStoreAfterExams, getStatisticAllowRangeDate } from 'store/afterexams';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

export type StateCustomerType = 'Lần đầu' | 'Tái khám';
export type StateExaminationType = 'Đã có toa thuốc' | '';

export interface AfterExaminationType {
  id: number;
  name: string;
  timeExamination: Date;
  stateExamination: string;
  follower: DropdownData;
  havePrescription: StateExaminationType;
  stateCustomer: StateCustomerType;
}

const AfterMedicalExamination: React.FC = () => {
  const dispatch = useAppDispatch();
  /*  */
  const { makeCall } = useSip();

  const dataStatisticAfterExams = useAppSelector((state) => state.afterExams.afterExamsStatistic);
  const dataStateAfterExams = useAppSelector((state) => state.afterExams.stateAfterExams);
  const dataListAfterExams = useAppSelector((state) => state.afterExams.dataList);
  const storeisLoadingAferExams = useAppSelector((state) => state.afterExams.isLoadingAfterExam);
  /*  */
  const storageLaunchSourcesGroup = localStorage.getItem('launchSourcesGroups');
  const dataLaunchSource = localStorage.getItem('launchSources');
  const storageLaunchSourcesType = localStorage.getItem('launchSourcesTypes');
  const dataStages = localStorage.getItem('stages');
  const employeeId = Cookies.get('employee_id');
  const listStages = localStorage.getItem('stages');
  const nameCS = Cookies.get('signature_name');
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [launchSourcesAfterExams, setLaunchSourcesAfterExams] = useState([{ id: 'all', label: 'Tất cả', value: 'all' }, ...(dataLaunchSource ? JSON.parse(dataLaunchSource || '') : [])]);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listStateInStorage, setListStateInStorage] = useState(listStages ? JSON.parse(listStages || '') : undefined);
  const [stateAfterExams2, setStateAfterExams2] = useState([{ id: '', label: 'Tất cả', value: 'all' }, ...dataStateAfterExams]);

  const [statisticAfterExams, setStatisticAfterExams] = useState(dataStatisticAfterExams);
  const [stateAfterExams, setStateAfterExams] = useState(dataStateAfterExams);
  const [listAfterExams, setListAfterExams] = useState(dataListAfterExams);
  const [stateAfterExamsCount, setStateAfterExamsCount] = useState(dataListAfterExams?.data?.paging?.total_count);
  /*  */
  const [openNote, setOpenNote] = useState(false);
  const [saveItem, setSaveItem] = useState<ItemListAfterExams>();
  const [noteData, setNoteData] = useState(saveItem?.process_note.toString());
  const [valueKeySearch, setValueKeySearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });


  const [dataFilter, setDataFilter] = useState({
    fromDays: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DDT00:00:00'),
    toDays: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    type: 0,
    origin: undefined as unknown as DropdownData,
    originGroup: undefined as unknown as DropdownData,
    originType: undefined as unknown as DropdownData,
    state: undefined as unknown as DropdownData,
    status: undefined as unknown as DropdownData,
    key: ''
  })

  const propsData = {
    processKeyId: Number(dataFilter?.state?.value) === 0 ? '' : dataFilter?.state?.value,
    launchSourceGroupID: dataFilter?.originGroup?.value || 0,
    launchSourceTypeID: dataFilter?.originType?.value || 0,
    launchSourceID: dataFilter?.origin?.map((i: any) => i?.id).join(',') || 'all',
    dateFilterType: 0,
    fromDay: dataFilter?.fromDays,
    toDay: dataFilter?.toDays,
    keyWord: dataFilter.key,
    pages: 1,
    limits: 1000,
    statusRes: dataFilter?.status?.value || 'all',
    isDefault: true
  }

  const handleGetStatistic = () => {
    dispatch(getStatisticAllowRangeDate({
      fromdate: moment(new Date()).subtract(1, 'days')?.format('YYYY-MM-DDT00:00:00'),
      todate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
    }));
  }

  useEffect(() => {
    dispatch(getListToStoreAfterExams({
      processKeyId: '',
      launchSourceID: 'all',
      launchSourceGroupID: 0,
      launchSourceTypeID: 0,
      fromDay: new Date(moment(new Date()).format('YYYY-MM-01')),
      toDay: new Date(moment(new Date()).format('YYYY-MM-DD')),
      dateFilterType: 0,
      keyWord: '',
      pages: 1,
      limits: 1000,
      isDefault: true
    } as unknown as RequestListAfterExams));
    handleGetStatistic()
    if (!listStateInStorage) {
      setStateAfterExams(dataStages ? JSON.parse(dataStages || '') : []);
      setStateAfterExams2([{ id: '', label: 'Tất cả', value: '0' }, ...(dataStages ? JSON.parse(dataStages || '') : [])]);
    } else {
      setStateAfterExams(listStateInStorage);
      const check = listStateInStorage.find((i: DropdownData) => i.value === '0');
      if (check) {
        setStateAfterExams2(listStateInStorage);
      } else {
        setStateAfterExams2([{ id: '', label: 'Tất cả', value: '0' }, ...listStateInStorage]);
      }
    }
    setLaunchSourcesAfterExams([{ id: 0, label: 'Tất cả', value: '0' }, ...(dataLaunchSource ? JSON.parse(dataLaunchSource || '') : [])]);
    document.title = 'Chăm sóc sau khám | CRM'
  }, []);

  useEffect(() => {
    setListAfterExams(dataListAfterExams);
    setStateAfterExamsCount(dataListAfterExams?.data?.paging?.total_count);
  }, [dataListAfterExams]);

  useEffect(() => {
    setStatisticAfterExams(dataStatisticAfterExams);
  }, [dataStatisticAfterExams]);

  /* Call APIs */
  /* API thay đổi trạng thái của khách hàng */
  const { mutate: postChangeState } = useMutation(
    'post-footer-form',
    (data: any) => postStagesByIdAfterExams(data),
    {
      onSuccess: () => {
        dispatch(getListToStoreAfterExams(propsData as unknown as RequestListAfterExams));
        dispatch(getStatisticAllowRangeDate({
          fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
          todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
        }));
        toast.success('Thay đổi trạng thái thành công');
      },
      onError: () => {
      },
    },
  );
  /* API Ghi chú  */
  const { mutate: postQuickNote } = useMutation(
    'post-footer-form',
    (data: any) => SaveQuickNoteAfterExams(data),
    {
      onSuccess: () => {
        setOpenNote(false);
        dispatch(getListToStoreAfterExams(propsData as unknown as RequestListAfterExams));
        dispatch(getStatisticAllowRangeDate({
          fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
          todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
        }));
        setNoteData('')
        toast.success('Cập nhật ghi chú thành công');
      },
      onError: () => {
      },
    },
  );
  /* API gọi điện ra cho khách hàng */
  const { mutate: postCallOut } = useMutation(
    'post-footer-form',
    (data: any) => postCallOutCustomer(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  /* End Call API */

  /* Cập nhật trạng thái của khách hàng 
    Các trạng thái của KH sau khám: Đã khám xong | Chưa liên hệ được | Chưa hết bệnh | Đã hết bệnh | Có tiến triển | Tầm soát
  */
  const handleFilterALlowState = async (item: any, data: any) => {
    const body = {
      customerId: data.customer_id,
      stageId: item.value,
      employeeId: employeeId,
    };
    await postChangeState(body);
  };

  /* Chuyển trang nhưng vẫn giữ các filter */
  const handleChangePagination = (pages: number, size: number) => {

    setPagination({ page: pages, pageSize: size });
    // dispatch(getListToStoreAfterExams({
    //   ...propsData,
     
    //     limits: 1000,
    // } as unknown as RequestListAfterExams));
  };
  /* 
  Gọi ra cho khách hàng
  Yêu cầu: Phải mở softphone của Doctorcheck.exe
  */
  const handleCallOutCustomer = (data: any) => {
    postCallOut({
      message: `${nameCS || Cookies.get('signature_name')} gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };
  
  /* Column */
  const ColumnTable = [
    {
      title: <Typography content="Thời gian khám" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'process_datetime',
      align: 'center',
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={moment(record).format('YYYY/MM/DD HH:mm')} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Họ và tên" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'customer_fullname',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}
          style={{ justifyContent: "start" }}
        >
          <Typography content={record} modifiers={['13x18', '600', 'center', 'blueNavy']} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày sinh" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'year_of_birth',
      align: 'center',
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ?? '---'} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Giới tính" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'gender_name',
      align: 'center',
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Điện thoại" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_phone',
      align: 'center',
      width: 120,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record.replace(/[^\d]/g, '').replace(/^84/, '0')} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_name',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={record} modifiers={['13x18', '600', 'center','orange']} />
            {/* <Typography content={record} modifiers={['13x18', '600', 'center', 'cg-red']} /><Typography content={data?.launch_source_type_name} modifiers={['13x18', '600', 'center']} /> */}
          </div>
        </div>
      ),
      //  filters: launchSourcesAfterExams,
      onFilter: (value: any, record: any) => { return record.launch_source_name?.includes(value); },
      filters: launchSourcesAfterExams.map((item) => {
        const obj = {
          text: item.label,
          value: item.label,
        }
        return obj;
      }),
      // onFilter: (value: any, record: any) => {
      //   return record.launch_source_name?.toLocaleLowerCase().search(value?.toLocaleLowerCase()) !== -1
      // },
    },
    {
      title: <Typography content="Công ty" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_name',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={data?.launch_source_group_name} modifiers={['13x18', '600', 'center', 'green']} />
          </div>
        </div>
      ),
      //    filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      // filters: launchSourcesAfterExams.map((item) => {
      //   const obj = {
      //     text: item.label,
      //     value: item.label,
      //   }
      //   return obj;
      // }),
      // onFilter: (value: any, record: any) => {
      //   return record.launch_source_name?.toLocaleLowerCase().search(value?.toLocaleLowerCase()) !== -1
      // },
      
    },
     {
      title: <Typography content="Chuyển đổi" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'launch_source_type_name',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={data?.launch_source_type_name} modifiers={['13x18', '600', 'center', 'main']} />
           
          </div>
        </div>
       ),
        onFilter: (value: any, record: any) => { return record.launch_source_type_name?.includes(value); },
      filters: stateLaunchSourceTypes.map((item) => {
        const obj = {
          text: item.label,
          value: item.label,
        }
        return obj;
      }),
      // filters: stateLaunchSourceTypes.map((item) => {
      //   const obj = {
      //     text: item.label,
      //     value: item.label,
      //   }
      //   return obj;
      // }),
      //  onFilter: (value: any, record: any) => {
      //   console.log(record)
      //   return record.launch_source_type_name?.toLocaleLowerCase().search(value?.toLocaleLowerCase()) !== -1
      // },
    },
    {
      title: <Typography content="Toa thuốc" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'is_has_prescriptions',
      align: 'center',
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record ? 'Có' : 'Không'} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),

    },
    {
      title: <Typography content="Ghi chú" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'process_note',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),

    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      width: 50,
      fixed: 'right',
      className: 'p-after_examination_column_center',
      render: (data: any, record: any) => (
        <CTooltip placements="topLeft" title="Gọi điện ngay"> <p onClick={() => { handleCallOutCustomer(data?.customer_phone) }} className="click_event" > <Icon iconName="phone_icon-main" isPointer /> </p> </CTooltip>
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      className: 'p-after_examination_column_center',
      width: 50,
      fixed: 'right',
      render: (data: any, record: any) => {
        return (
          <CTooltip placements="topLeft" title="Thêm ghi chú"> <p
            onClick={() => {
              setSaveItem(data); setOpenNote(true);
              setNoteData(data.process_note);
            }}
            className="click_event" > <Icon iconName="edit_info" isPointer /> </p> </CTooltip>
        )
      }
    },
    {
      title: <Typography content={""} modifiers={[]} />,
      dataIndex: '',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (data: any, record: any) => {
        const state = dataStateAfterExams.find((i) => i.id === data.process_key_id);
        const state2 = stateAfterExams.find((i) => i.id === data.process_key_id);
        return (
          <div className="flexbox_centers" > <Dropdown isFlex isState values={state || state2} dropdownOption={stateAfterExams || dataStateAfterExams} handleSelect={(item) => handleFilterALlowState(item, data)} /> </div>
        );
      },
    },
  ];

  /* Sử dụng Hook useMemo 
  => Cache component chỉ re-render khi Dependency thay đổi giá trị
  */
  const statisticHeader = useMemo(() => (
    <PublicHeaderStatistic
      handleClick={() => {

      }}
      title="Chăm sóc sau khám"
      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}>
      <div className={mapModifiers('p-after_examination_total')}>
        {statisticAfterExams?.data?.length ? statisticAfterExams?.data?.map((item) => (
          <div className='p-after_examination_total_item' key={item.process_id}>
            <span>{item?.process_name}: <strong style={{ color: '#f00' }}>{item?.total}</strong></span>
          </div>
        )) : null}
      </div>
    </PublicHeaderStatistic>
  ), [statisticAfterExams?.data, dataStatisticAfterExams.data])

  const tableAfterExams = useMemo(() => (
   
   
    <PublicTable
      listData={listAfterExams?.data?.data}
      loading={storeisLoadingAferExams}
      column={ColumnTable}
      rowkey="customer_id"
      size="small"
      pageSizes={50}
      isPagination
      isNormal
      scroll={{ x: 'max-content', y: '100vh - 80px' }}
      handleChangePagination={(page: any, pageSize: any) => {
        handleChangePagination(page, pageSize);
      }}
     //   handleChangePagination={(page: any, pageSize: any) => { }}
      // totalItem={listAfterExams?.status ? listAfterExams?.data?.paging?.total_count : 0}
      totalItem={
          (listAfterExams?.status &&
            listAfterExams?.data?.paging?.total_count) ||
          0
        }
    />
  ), [listAfterExams?.data?.data, storeisLoadingAferExams]);

  /* Sử dụng Hook useMemo */

  return (
    <PublicLayout>
      <div className="p-after_examination">
        <PublicHeader
          titlePage=""
          className="p-after_examination_header"
          handleFilter={() => {

          }}
          isClearFilter={storeisLoadingAferExams}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(val: string) => { setValueKeySearch(val); }}
          valueSearch={valueKeySearch}
          // isHideSearch={false}
          isHideFilter
          handleCleanFilter={() => {
            setDataFilter({
              fromDays: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DDT00:00:00'),
              toDays: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
              type: 0,
              origin: undefined as unknown as DropdownData,
              originGroup: undefined as unknown as DropdownData,
              originType: undefined as unknown as DropdownData,
              state: undefined as unknown as DropdownData,
              status: undefined as unknown as DropdownData,
              key: ''
            })
            dispatch(getListToStoreAfterExams({
              processKeyId: '',
              dateFilterType: 0,
              fromDay: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DDT00:00:00'),
              toDay: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
              keyWord: '',
              launchSourceID: 'all',
              launchSourceGroupID: 0,
              launchSourceTypeID: 0,
              statusRes: 'all',
              limits: 1000,
              pages: 1,
              isDefault: false
            } as unknown as RequestListAfterExams));
            handleGetStatistic();
          }}
          // listBtn={(<div className={mapModifiers('p-after_examination_total_header')}>
          //   <div className='p-after_examination_total_item'>
          //     <span>Có: <strong style={{ color: '#f00' }}>{stateAfterExamsCount}</strong>Khách hàng</span>
          //   </div>
          // </div>)}
          tabLeft={(
            <div className='p-after_examination_filter'>
              <RangeDate
                variant="simple"
                handleOnChange={(from: any, to: any) => {
                  setDataFilter({ ...dataFilter, fromDays: from, toDays: to });
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    fromDay: moment(from).format('YYYY-MM-DDT00:00:00'),
                    toDay: moment(to).format('YYYY-MM-DDTHH:mm:ss')
                  } as unknown as RequestListAfterExams));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(from).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(to).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                value={{ from: dataFilter.fromDays, to: dataFilter.toDays }}
                fomat='DD-MM-YYYY'
              />
              <Input
                id='search-booking'
                type="text"
                variant='simple'
                value={dataFilter.key}
                placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng'
                onChange={(event: any) => {
                  setDataFilter({
                    ...dataFilter,
                    key: event?.target?.value
                  })
                }}
                handleEnter={() => {
                  dispatch(getListToStoreAfterExams({ ...propsData, keyWord: dataFilter.key } as any));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                handleClickIcon={() => {
                  dispatch(getListToStoreAfterExams({ ...propsData, keyWord: dataFilter.key } as any));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                iconName='search'
              />
            </div>
          )}
          tabBottomRight={
              (<div className={mapModifiers('p-after_examination_total_header')}>
            <div className='p-after_examination_total_item'>
              <span>Có: <strong style={{ color: '#f00' }}>{stateAfterExamsCount}</strong>Khách hàng</span>
            </div>
          </div>)

           }
          tabBottom={(
            <div className='p-after_examination_filter_bottom'>
              <Dropdown
                dropdownOption={stateAfterExams2}
                values={dataFilter.state}
                handleSelect={(item: any) => {
                  setDataFilter({ ...dataFilter, state: item });
                 
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    processKeyId: item.value === "0" ? '' : item?.value,
                  } as unknown as RequestListAfterExams));

                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                variant="simple"
                placeholder='-- Chọn tình trạng --'
              />
              <Dropdown
                dropdownOption={stateLaunchSourceGroups}
                placeholder='-- Chọn nhóm nguồn --'
                handleSelect={(item) => {
                  setDataFilter({ ...dataFilter, originGroup: item });
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    launchSourceGroupID: item.value,
                  } as unknown as RequestListAfterExams));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                variant="simple"
                className="form_origin"
                values={(dataFilter.originGroup as any) || undefined}
              />
              <div style={{marginTop:"8px"}}>
                <MultiSelect
                option={[{ id: 99, label: 'Tất cả', value: null as any }, ...launchSourcesAfterExams]}
                variant="simple"
                value={dataFilter.origin?.map((item: any) => item?.value)}
                placeholder='-- Chọn nguồn --'
                handleChange={(item: any) => {
                  setDataFilter({ ...dataFilter, origin: item });
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    launchSourceID: item?.map((i: any) => i?.id).join(',') || 'all'
                  } as unknown as RequestListAfterExams));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
              />
              </div>
              <Dropdown
                placeholder='-- Chọn hình thức chuyển đổi --'
                dropdownOption={stateLaunchSourceTypes}
                handleSelect={(item) => {
                  setDataFilter({ ...dataFilter, originType: item });
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    launchSourceTypeID: item?.value
                  } as unknown as RequestListAfterExams));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                variant="simple"
                className="form_origin"
                values={(dataFilter.originType as any) || undefined}
              />
              <Dropdown
                placeholder='-- Chọn trạng thái --'
                dropdownOption={OptionStatusAfterExams}
                handleSelect={(item) => {
                  setDataFilter({ ...dataFilter, status: item });
                  dispatch(getListToStoreAfterExams({
                    ...propsData,
                    statusRes: item?.value
                  } as unknown as RequestListAfterExams));
                  dispatch(getStatisticAllowRangeDate({
                    fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  }));
                }}
                variant="simple"
                className="form_origin"
                values={(dataFilter.status as any) || undefined}
              />

            </div>
          )}
        />
        <div className="p-after_examination_statistic">
          {statisticHeader}
        </div>
        <div className="p-after_examination_content">
          {tableAfterExams}
        </div>
      </div>
      {/* Update note */}
      <CModal
        isOpen={openNote}
        widths={540}
        title="Cập nhật ghi chú"
        onCancel={() => { setOpenNote(false); }}
        onOk={async () => {
          const body = {
            customerId: (saveItem as ItemListAfterExams).customer_id,
            content: noteData,
          };
          await postQuickNote(body);
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <TextArea
          id=""
          readOnly={false}
          value={noteData}
          isResize
          defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setNoteData(e.target.value)}
        />
      </CModal>

    </PublicLayout>
  );
};

export default AfterMedicalExamination;
