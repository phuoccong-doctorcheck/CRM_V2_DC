/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OptionTypeCustomerBooking, optionCancelBooking, optionDate } from 'assets/data';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import FloatFilter from 'components/molecules/FloatFilter';
import FormAddCustomer from 'components/molecules/FormAddCustomer';
import PublicTable from 'components/molecules/PublicTable';
import CCollapse from 'components/organisms/CCollapse';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postPrintAppointmentServicepoint } from 'services/api/appointmentView';
import { postNotifyCustomer, postSaveCustomerBeforeExams } from 'services/api/beforeExams';
import { BookingScheduleItem } from 'services/api/booking_schedule/types';
import { postCanceledAppointment, postDelayAppointment } from 'services/api/customerInfo';
import { getListBooking, postLoadingBooking } from 'store/booking_schedule';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from 'utils/functions';

export type StateActionType = 'Đã khám xong' | 'Đã hủy' | 'Chưa đến' | 'Đang phục vụ';
type StateType = 'KH mới' | 'KH cũ';
export interface BookingScheduleType {
  id: number;
  timeBooking: Date;
  name: string;
  yearOfBirh: Date;
  sex: DropdownData;
  phoneNumber: string;
  state: StateType;
  origin: DropdownData;
  stateAction: StateActionType;
}

const BookingSchedule: React.FC = () => {
  const dispatch = useAppDispatch();

  const storeBookingSchedule = useAppSelector((state) => state.bookingSchedule.listBooking);
  const storeBookingStatistic = useAppSelector((state) => state.bookingSchedule.statisticBooking);
  const storeLoadingBookingSchedule = useAppSelector((state) => state.bookingSchedule.loadingBooking);
  const storageemployeeID = localStorage.getItem("employee_id");
  const [employeeId, setEmployeeId] = useState(storageemployeeID);
  const storageLaunchSources = localStorage.getItem('launchSources');
  const storageLaunchSourcesGroup = localStorage.getItem('launchSourcesGroups');
  const storageLaunchSourcesType = localStorage.getItem('launchSourcesTypes');

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);

  const [stateBookingStatistic, setStateBookingStatistic] = useState(storeBookingStatistic);
  const [listSchedule, setListSchedule] = useState(storeBookingSchedule);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [masterID, setMasterID] = useState('');
  const [isSendQuestions, setSendQuestions] = useState(false);
  const [dataDelayBooking, setDataDelayBooking] = useState({ date: new Date(), value: '' });
  const [dateBooking, setDateBooking] = useState<Date>();
  const [dataFilter, setDataFilter] = useState({
    dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    altStatus: '',
    launchSourceId: '',
    launchSourceGroupId: '',
    launchSourceTypeId: '',
    keySearch: '',
    key: ''
  });
  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
  const [isStatisticMobile, setIsStatisticMobile] = useState(false);

  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(getListBooking({} as any));
    document.title = 'Đặt lịch | CRM'
  }, []);

  const propsData = {
    dateGetList: dataFilter?.dateGetList || moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    launchSourceId: dataFilter?.launchSourceId || null,
    launchSourceGroupId: dataFilter?.launchSourceGroupId || null,
    launchSourceTypeId: dataFilter?.launchSourceTypeId || null,
    altStatus: dataFilter?.altStatus || null,
    keySearch: dataFilter?.keySearch || '',
    key: dataFilter.key
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, [window.innerWidth]);

  useEffect(() => {
    setStateBookingStatistic(storeBookingStatistic);
  }, [storeBookingStatistic]);

  useEffect(() => {
    setListSchedule(storeBookingSchedule);
  }, [storeBookingSchedule]);
  // React Query dời lịch
  const { mutate: postDelayBooking } = useMutation(
    'post-footer-form',
    (data: any) => postDelayAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setDataDelayBooking({ date: undefined as unknown as Date, value: '' })
          dispatch(getListBooking(data));
          setSendQuestions(false);
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  // React Query hủy lịch
  const { mutate: postCanceledBooking } = useMutation(
    'post-footer-form',
    (data: any) => postCanceledAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setCanceledReason({
            ...canceledReason,
            type: '',
            reason: '',
            item: undefined as unknown as GroupRadioType,
          });
          dispatch(getListBooking(data));
          setIsCanceled(false);
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  // React Query lưu thông tin khách hàng
  const { mutate: postSaveCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setDateBooking(undefined as any)
          dispatch(getListBooking({} as any));
          
                              window.open(
                                `/customer-info/id/${data.data}/history-interaction`,
                                "_blank"
                              );
                    
           postNotifyCustomer({employee_id: employeeId,customer_id:data.data})
        } else {
          setDateBooking(undefined as any)
          toast.error(data.message);
        }
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      },
    },
  );
  // React Query về In chỉ in 
  const { mutate: printAppointmentServicepoint } = useMutation(
    "post-footer-form",
    (data: string) => postPrintAppointmentServicepoint(data),
    {
      onSuccess: (data) => {
        if (data.status) {
        
          previewBlobPDFOpenLink(data?.data, data?.message);
        } else {
          toast.info(data?.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const handleAddCustomer = async (data: any) => {
    setIsOpenPopup(false);
    dispatch(postLoadingBooking(true));
    await postSaveCustomer(data);
  };

  const handleDelayAppointment = async () => {
    if (!dataDelayBooking.value.trim()) {
      toast.error('Vui lòng nhập lí do khách hàng muốn dời lịch khám');
      return;
    }
    await postDelayBooking({
      master_id: masterID,
      master_note: dataDelayBooking.value,
      appointment_date: moment(dataDelayBooking.date).format('YYYY-MM-DDTHH:mm'),
    });
  };

  const handleCancelBooking = async () => {
    if (!canceledReason.reason.trim()) {
      toast.error('Vui lòng nhập lí do khách hàng hủy khám');
      return;
    }
    await postCanceledBooking({
      master_id: masterID,
      canceled_reason: canceledReason.reason,
    });
  };
  // Setup column, khi nhấn vào từng user sẽ call API getCustomerById sau đó sẽ chuyển tới trang user đó theo ID
  const ColumnTable = [
    {
      title: <Typography content="Họ và tên" modifiers={['12x18', '500', 'center']} styles={{textAlign:"left", marginLeft:"6px"}}/>,
      align: 'center',
      dataIndex: 'customer_fullname',
      width: 240,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'flex-start' }} onClick={() => {
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Năm sinh" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'year_of_birth',
      width: 90,
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Giới tính" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 80,
      className: "ant-table-column_wrap",
      dataIndex: 'gender_name',
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Điện thoại" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'customer_phone',
      width: 140,
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
          <Typography content={record ? record.replace(/^.{4}/, '0') : ''} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Phân loại " modifiers={['12x18', '500', 'center']} />,
      width: 120,
      align: 'center',
      className: "ant-table-column_wrap",
      dataIndex: 'f_type',
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tái khám" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'reexam_display',
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
          <Typography content={record || '--'} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nhóm Nguồn" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 220,
      className: "ant-table-column_wrap",
      dataIndex: 'launch_source_group_name',
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'launch_source_name',
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
          {
            (data?.launch_source_id === 2 || data?.launch_source_id === 3) && !!data?.affiliate_name &&
            <li style={{ fontWeight: 600, color: '#0489dc' }}>
              &nbsp;-&nbsp;{data?.affiliate_name}
            </li>
          }
        </div>
      ),
    },
    {
      title: <Typography content="Hình thức chuyển đổi" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      width: 220,
      dataIndex: 'launch_source_type_name',
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
          <div style={{ display: 'inline-flex' }}>
            <Typography content={record} modifiers={['14x20', '600', 'center']} />
          </div>
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center']} />,
      align: 'center',
      dataIndex: 'status_display',
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
          <Typography content={record} modifiers={['14x20', '600', 'center']} />
        </div>
      ),
    },
    {
      title: '',
      align: 'right',
      width: 40,
      render: (record: any, data: any) => {
        return (
          <CTooltip title="Xem chỉ định dịch vụ" placements="top" colorCustom='#333'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon iconName="criminal-record" size="20x20" isPointer
                onClick={() => {
                  printAppointmentServicepoint(data?.master_id);
                }} />
            </div>
          </CTooltip >
        );
      },
    },
    {
      title: '',
      align: 'right',
      width: 40,
      render: (record: any, data: any) => {
        return (
          <CTooltip title="Dời lịch" placements="top" colorCustom='#04566e'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon iconName="delay_crm" size="20x20" isPointer
                onClick={() => {
                  setMasterID(data?.master_id);
                  setSendQuestions(true);
                  setDataDelayBooking({
                    ...dataDelayBooking,
                    date: data?.appointment_command_datetime,
                    value: data?.appointment_note,
                  });
                }} />
            </div>
          </CTooltip >
        );
      },
    },
    {
      title: '',
      align: 'right',
      width: 40,
      // Đây là button hủy lịch, khi bấm vào thì popup hủy lịch hiện lên và set ID của khách để xử lý API 
      render: (record: any, data: any) => {
        return (
          <CTooltip title="Hủy lịch" placements="top" colorCustom='#f00'>
            <div
              onClick={() => {
                setIsCanceled(true)
                setMasterID(data?.master_id);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon iconName="canceled_crm" size="20x20" isPointer />
            </div>
          </CTooltip>
        );
      },
    },
  ];

  const renderItemCollapse = (data: any) => {
    const titleRender: any = {
      customer_fullname: <Typography content="Họ tên:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      customer_phone: <Typography content="Số điện thoại:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      gender_name: <Typography content="Giới tính:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      launch_source_group_name: <Typography content="Công ty:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      year_of_birth: <Typography content="Năm sinh:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      launch_source_name: <Typography content="Nguồn:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      f_type: <Typography content="Phân loại:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      launch_source_type_name: <Typography content="Chuyển đổi:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      status_display: <Typography content="Trạng thái:" modifiers={["14x20", "500", "center", "capitalize"]} />,
      affiliate_name: <Typography content="Đối tác:" modifiers={["14x20", "500", "center", "capitalize"]} />,
    };

    const keysInTitleRender = Object.keys(titleRender);

    const sortedFields = keysInTitleRender
      .filter(key => data.hasOwnProperty(key))
      .map(key => {
        if (['customer_phone'].includes(key)) {
          return ({ key, value: data[key]?.replace('+84-', '0') })
        } else {
          return ({ key, value: data[key], })

        }
      });

    return (
      <>
        {sortedFields.map(({ key, value }) => (
          <div className="p-booking_schedule_collapse_item_content_field" key={key}>
            {titleRender[key]}
            <Input value={value} variant='simple' disabled />
          </div>
        ))}
      </>
    );
  }
  // bảng thông tin danh sách các khách hàng book vào từng khung giờ
  const memoTableBooking = useMemo(() => (
    <main>
      <div className={mapModifiers("p-booking_schedule_header_customer", stateBreakPoint > 1280 ? 'enable' : 'disable')}>
        {/* Thanh header của bảng thông tin : Họ và tên, Năm sinh,... */}
        <PublicTable
          listData={listSchedule?.data}
          column={ColumnTable}
          isPagination={false}
          size="small"
          isHideRowSelect
          rowkey={"customer_id"}
        />
      </div>
      <div className="p-booking_schedule_content_customer">
        <PublicTable
          listData={listSchedule?.data}
          loading={storeLoadingBookingSchedule}
          isPagination={false}
          column={[
            {
              title: '',
              align: 'left',
              dataIndex: 'time_range',
              render: (record: any, data: any) => (
                <div className="p-booking_schedule_heading">
                  <Typography
                    content={record}
                    modifiers={['16x24', '600', 'justify', 'blueNavy']}
                  />

                  {/* isEmpty kiểm tra xem data?.child có undefined or null hay không ,nếu có undefined or null thì sẽ Chưa đăng ký lượt nào và ngươc lại */}
                  <Typography
                    content={_.isEmpty(data?.child) ? '( Chưa đăng ký lượt nào )' : `( Đã đăng ký ${Number(data?.child?.length)} lượt. )`}
                    modifiers={['14x20', '400', 'justify', _.isEmpty(data?.child) ? 'jet' : 'green']}
                  />

                  {new Date(data?.valueTime).valueOf() >= new Date().valueOf() ? (
                    <div className="p-booking_schedule_heading_button" onClick={() => {
                      setDateBooking(data?.valueTime)
                      setIsOpenPopup(true);
                    }}>
                      Đặt lịch ngay
                    </div>
                  ) : <Typography
                    content={new Date(data?.valueTime).valueOf() < new Date().valueOf() ? 'Hết lượt hoặc đã qua thời gian đặt lịch...' : ''}
                    modifiers={['14x20', '400', 'justify', new Date(data?.valueTime).valueOf() < new Date().valueOf() ? 'cg-red' : 'green']}
                  />}
                </div>
              ),
            }]}
          rowClassNames={(record, index) => 'p-booking_schedule_row_item'}
          expandedRowClassNames={(record: any, index: any, indent: any) => {
            const { valueTime, child } = record;
            if (new Date(valueTime).valueOf() < new Date().valueOf()) {
              return `p-booking_schedule_over_time ${_.isEmpty(child) && 'p-booking_schedule_empty_child'}`;
            }
            return `p-booking_schedule_normal_time ${_.isEmpty(child) && 'p-booking_schedule_empty_child'}`;
          }}
          rowkey="id"
          scroll={{ x: 'max-content' }}
          isHideHeader
          isHideRowSelect
          isExpandable={true}
          defaultExpandAllRow={true}
          expandedRowKeys={Array?.from({ length: 100 }, (_, index) => index)}
          expandedRender={(data) => {
            return (
              stateBreakPoint > 1280 ?
                <div key={data?.id} className='p-booking_schedule_content_customer_table_child'>
                  <PublicTable
                    isSimpleHeader
                    column={ColumnTable}
                    className={'table_child'}
                    listData={data?.child}
                    size="small"
                    rowkey="master_id"
                    scroll={{ x: 'max-content', scrollToFirstRowOnChange: false }}
                    isPagination={false}
                    isHideRowSelect
                    isHideHeader
                    rowClassNames={(record, index) => {
                      if (record?.status && record?.is_register_delay) {
                        return 'p-booking_schedule_item_delay';
                      }
                      switch (record?.status_display) {
                        case 'Đã khám xong':
                          return 'p-booking_schedule_item_done';
                        case 'Đang phục vụ':
                          return 'p-booking_schedule_item_inprogress';
                        case 'Đã huỷ':
                          return 'p-booking_schedule_item_cancel';
                        default:
                          return 'p-booking_schedule_item_unknow';
                      }
                    }}
                  />
                </div>
                :
                <div className="p-booking_schedule_collapse" key={data?.id} >
                  {
                    data.child?.length ? data?.child?.map((row: BookingScheduleItem) => (
                      <div
                        className={mapModifiers("p-booking_schedule_collapse_item", row.status !== 'inprogress' ? row.status : (row.is_register_delay ? 'delay' : 'inprogress'))}
                        key={row?.id}
                      >
                        <CCollapse
                          title={
                            <div className="p-booking_schedule_collapse_item_header" >
                              <div className="p-booking_schedule_collapse_item_title">
                                <Typography
                                  content={row?.customer_fullname}
                                  modifiers={["blueNavy"]}
                                />
                                {row?.year_of_birth?.toString()?.trim() ? (
                                  <>
                                    <Typography
                                      content={row?.year_of_birth?.toString()}
                                      modifiers={["green"]}
                                    />
                                  </>
                                ) : <span>---</span>}
                                {row?.f_type?.toString()?.trim() ? (
                                  <>
                                    <Typography
                                      content={row?.f_type?.toString()}
                                      modifiers={["green"]}
                                    />
                                  </>
                                ) : <span>---</span>}
                                {row?.launch_source_group_name?.trim() ? (
                                  <>
                                    <Typography
                                      content={row?.launch_source_group_name}
                                      modifiers={["green"]}
                                    />
                                  </>
                                ) : <span>---</span>}
                                {row?.launch_source_name?.trim() ? (
                                  <div>
                                    <Typography
                                      content={row?.launch_source_name}
                                      modifiers={["green"]}
                                    />{row.affiliate_name && stateBreakPoint >= 1040 ? '-' : ''}
                                    {
                                      (row?.launch_source_id === 2 || row?.launch_source_id === 3) && !!row?.affiliate_name &&
                                      <Typography
                                        content={row?.affiliate_name}
                                      />
                                    }
                                  </div>
                                ) : <span>---</span>}
                                {row?.launch_source_type_name?.trim() ? (
                                  <>
                                    <Typography
                                      content={row?.launch_source_type_name}
                                      modifiers={["green"]}
                                    />
                                  </>
                                ) : <span>---</span>}
                                {row?.status_display ? (
                                  <>
                                    <Typography
                                      content={row?.status_display}
                                      modifiers={["green"]}
                                    />
                                  </>
                                ) : <span>---</span>}
                              </div>
                            </div>
                          }
                          key_default="0"
                        >
                          <div className="p-booking_schedule_collapse_item_content" >
                            {renderItemCollapse(row)}
                          </div>
                          <div className="p-booking_schedule_collapse_item_action" >
                            <div className="p-booking_schedule_collapse_item_action_btn" >
                              {[
                                {
                                  titleAction: "Dời lịch",
                                  titlePlacement: "top",
                                  icon: "delay_crm",
                                  iconSizes: "24x24",
                                  handleClick: () => {
                                    setMasterID(row?.master_id);
                                    setSendQuestions(true); setDataDelayBooking({ ...dataDelayBooking, date: row?.appointment_command_datetime });

                                  },
                                },
                                {
                                  titleAction: "Hủy lịch",
                                  titlePlacement: "top",
                                  icon: "canceled_crm",
                                  iconSizes: "24x24",
                                  handleClick: async () => {
                                    setIsCanceled(true)
                                    setMasterID(row?.master_id);
                                  },
                                },
                              ].map((item: any, idx: any) => (
                                <CTooltip
                                  title={item.titleAction}
                                  placements="top"
                                  key={idx}
                                  colorCustom="#3e79f7"
                                >
                                  <div
                                    className="m-list_btn-open_option_item"
                                    onClick={item?.handleClick}
                                  >
                                    <Icon iconName={item.icon} size={item.iconSizes} isPointer />
                                  </div>
                                </CTooltip>
                              ))}
                            </div>
                            <div
                              className="p-booking_schedule_collapse_item_action_detail"
                            >
                              <CTooltip title="Chi tiết khách hàng" placements="top" >
                                <Icon
                                  iconName="exits"
                                  isPointer
                                  onClick={() => {
                                    const { customer_id, customer_fullname, ...prevData } = row;
                                    if (customer_id) {
                                      sessionStorage.setItem("indexMenu", "101");
                                      Cookies.set("id_customer", customer_id);
                                      dispatch(getInfosCustomerById({ customer_id: customer_id }));
                                      const newTab = window.open(
                                        `/customer-info/id/${customer_id}/history-interaction`,
                                        "_blank"
                                      );
                                      if (newTab) {
                                        newTab.focus();
                                      }
                                    } else {
                                      toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
                                    }
                                  }}
                                />
                              </CTooltip>
                            </div>
                          </div>
                        </CCollapse>
                      </div>
                    )) : null
                  }
                </div>
            )
          }}
        />
      </div >
    </main >
  ), [listSchedule?.data, storeLoadingBookingSchedule, stateBreakPoint])

  const statisticHeader = useMemo(() => (
    <PublicHeaderStatistic
      handleClick={(data: any) => {

      }}
      title='Danh sách đặt lịch'

      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}>
      {
        stateBreakPoint > 1000 ? (
          // stateBookingStatistic được API trả về với một mảng chứa số lượng khách hàng đăng ký khám với mỗi object làm đại diện, mỗi object là 30 phút đồng hồ
          //  ===> nến là lấy độ dài của mảng làm tổng
          <div className='p-booking_schedule_statistic'>
            <ul className='p-booking_schedule_statistic_wrap'>
              <li className="p-booking_schedule_statistic_item"><span>Tổng:</span>{stateBookingStatistic?.length}</li>
              <li className="p-booking_schedule_statistic_item"><span>Chưa đến:</span>{stateBookingStatistic?.filter((i) => i?.status === 'new')?.length}</li>
              <li className="p-booking_schedule_statistic_item"><span>Đang phục vụ:</span>{stateBookingStatistic?.filter((i) => i?.status === 'inprogress')?.length}</li>
              <li className="p-booking_schedule_statistic_item"><span>Đã khám xong:</span>{stateBookingStatistic?.filter((i) => i?.status === 'done')?.length}</li>
              <li className="p-booking_schedule_statistic_item"><span>Đã hủy:</span>{stateBookingStatistic?.filter((i) => i?.status === 'canceled')?.length}</li>
              <li className="p-booking_schedule_statistic_item"><span>Dời lịch:</span>{stateBookingStatistic?.filter((i) => i?.status === 'delay')?.length}</li>
            </ul>
          </div>
        )
          :
          (
            <>
              {/* đây là giao diện nếu màn hình có chiều dài nhỏ hơn 1000 */}
              <div onClick={() => {
                setIsStatisticMobile(true)
              }}>
                <Icon iconName="stats" isPointer />
              </div>
              <FloatFilter open={isStatisticMobile} headerTitle="Thống kê đặt lịch" handleClose={() => {
                setIsStatisticMobile(!isStatisticMobile)
              }} position='right'>
                <div className={mapModifiers('p-booking_schedule_statistic', stateBreakPoint < 1000 && 'mobile')}>
                  <ul className='p-booking_schedule_statistic_wrap'>
                    <li className="p-booking_schedule_statistic_item"><span>Tổng:</span>{stateBookingStatistic?.length}</li>
                    <li className="p-booking_schedule_statistic_item"><span>Chưa đến:</span>{stateBookingStatistic?.filter((i) => i?.status === 'new')?.length}</li>
                    <li className="p-booking_schedule_statistic_item"><span>Đang phục vụ:</span>{stateBookingStatistic?.filter((i) => i?.status === 'inprogress')?.length}</li>
                    <li className="p-booking_schedule_statistic_item"><span>Đã khám xong:</span>{stateBookingStatistic?.filter((i) => i?.status === 'done')?.length}</li>
                    <li className="p-booking_schedule_statistic_item"><span>Đã hủy:</span>{stateBookingStatistic?.filter((i) => i?.status === 'canceled')?.length}</li>
                    <li className="p-booking_schedule_statistic_item"><span>Dời lịch:</span>{stateBookingStatistic?.filter((i) => i?.status === 'delay')?.length}</li>
                  </ul>
                </div>
              </FloatFilter>
            </>
          )
      }
    </PublicHeaderStatistic>
  ), [stateBookingStatistic, stateBreakPoint, isStatisticMobile]);

  return (
    <>
      <PublicLayout  >
        <div className="p-booking_schedule">

          {/* Header lọc lịch khám */}
          <PublicHeader
            titlePage=""
            className="p-booking_schedule_header_public"
            handleFilter={() => { }}
            isHideFilter
            isClearFilter={storeLoadingBookingSchedule}
            handleCleanFilter={() => {
              setDataFilter({
                ...dataFilter,
                dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'), launchSourceId: '', altStatus: '', keySearch: '', launchSourceGroupId: '', launchSourceTypeId: ''
              })
              const body = {
                dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
                launchSourceId: '',
                altStatus: '',
                keySearch: '',
                launchSourceGroupId: '',
                launchSourceTypeId: ''
              }
              setListSchedule(undefined as any);
              dispatch(getListBooking(body as any));
            }}
            handleGetTypeSearch={() => { }}
            isHideFilterMobile={false}
            handleClickFilterMobile={() => { }}
            isUseSearch
            tabLeft={(
              <div className='p-booking_schedule_form_filter'>
                <div style={{marginBottom:"5px"}}>
                    <CDatePickers
                  handleOnChange={(date: any) => {
                    setDataFilter({ ...dataFilter, dateGetList: moment(date?.$d).format('YYYY-MM-DDT00:00:00') })
                    dispatch(getListBooking({ ...propsData, dateGetList: moment(date?.$d).format('YYYY-MM-DDT00:00:00') } as any));
                  }}
                  variant="simple"
                  value={dataFilter.dateGetList as any}
                  fomat="YYYY-MM-DD"
                  isShowTime={false}
                  placeholder="Chọn ngày muốn xem"
                />
              </div>
                {stateBreakPoint > 600 &&
                  <GroupRadio
                    options={optionDate}
                    defaultVal={optionDate.find((i) => new Date(i.value as any).valueOf() === new Date(dataFilter.dateGetList as any).valueOf())}
                    value={optionDate.find((i) => new Date(i.value as any).valueOf() === new Date(dataFilter.dateGetList as any).valueOf())}
                    handleOnchangeRadio={(e) => {
                      setDataFilter({ ...dataFilter, dateGetList: e.value })
                      const body = {
                        dateGetList: e.value || moment(new Date()).format('YYYY-MM-DDT00:00:00'),
                        launchSourceId: dataFilter?.launchSourceId || null,
                        altStatus: dataFilter?.altStatus || null,
                        keySearch: dataFilter.keySearch || '',

                      }
                      dispatch(getListBooking(body as any));
                    }}
                  />}
              </div>
            )}
            tabBottom={(
              <div className='p-booking_schedule_form_filter_bottom'>
                <Dropdown
                  dropdownOption={[{ id: 99, label: 'Tất cả', value: null as any }, ...OptionTypeCustomerBooking]}
                  placeholder="Lọc theo trạng thái"
                  variant="simple"
                  values={OptionTypeCustomerBooking.find((e) => e.value === dataFilter?.altStatus)}
                  handleSelect={(e: any) => {
                    setDataFilter({ ...dataFilter, altStatus: e?.value })
                    dispatch(getListBooking({ ...propsData, altStatus: e?.value } as any));
                  }}
                />
                <Dropdown
                  dropdownOption={stateLaunchSourceGroups}
                  variant="simple"
                  placeholder='-- Chọn nhóm nguồn --'
                  values={stateLaunchSourceGroups.find((e) => e.value === dataFilter?.launchSourceGroupId)}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, launchSourceGroupId: item?.value })
                    dispatch(getListBooking({ ...propsData, launchSourceGroupId: item?.value } as any));
                  }}
                />
                <Dropdown
                  dropdownOption={[{ id: 99, label: 'Tất cả', value: null as any }, ...listLaunchSources]}
                  variant="simple"
                  placeholder="Lọc theo nguồn"
                  values={listLaunchSources.find((e) => e.value === dataFilter?.launchSourceId)}
                  handleSelect={(e: any) => {
                    setDataFilter({ ...dataFilter, launchSourceId: e?.value })
                    dispatch(getListBooking({ ...propsData, launchSourceId: e?.value } as any));
                  }}
                />
                <Dropdown
                  dropdownOption={stateLaunchSourceTypes}
                  variant="simple"
                  placeholder='-- Chọn hình thức chuyển đổi --'
                  values={stateLaunchSourceTypes.find((e) => e.value === dataFilter?.launchSourceTypeId)}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, launchSourceTypeId: item?.value })
                    dispatch(getListBooking({ ...propsData, launchSourceTypeId: item?.value } as any));
                  }}
                />
                <div style={{marginTop:"6px"}}>
                  <Input
                  id='search-booking'
                  type="text"
                  variant='simple'
                  value={dataFilter.keySearch}
                  placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng'
                  onChange={(event: any) => {
                    setDataFilter({
                      ...dataFilter,
                      keySearch: event?.target?.value
                    })
                  }}
                  handleEnter={() => {
                    dispatch(getListBooking({ ...propsData, keySearch: dataFilter.keySearch } as any));
                  }}
                  handleClickIcon={() => {
                    dispatch(getListBooking({ ...propsData, keySearch: dataFilter.keySearch } as any));
                  }}
                  iconName='search'
                />
                </div>
              </div>
            )}
          />
          {/* End Header lọc lịch khám */}

          {/* Layout đếm số đặt lịch, phục vụ ( Danh sách đặt lịch) */}
          <div className={mapModifiers('p-booking_schedule_statistics', stateBreakPoint < 1000 && 'mobile')}>
            {statisticHeader}
          </div>
          {/* Bảng danh sách đặt lịch */}
          {memoTableBooking}
          {/* Layout hủy lịch */}
          {isCanceled &&
            <CModal
              isOpen={isCanceled}
              widths={540}
              title="Lí do khách hàng muốn hủy lịch hẹn"
              onCancel={() => setIsCanceled(false)}
              textCancel='Xem lại'
              textOK='Hủy'
              onOk={handleCancelBooking}
            >
              <div className="m-customer_infos_canceled">
                <GroupRadio
                  options={optionCancelBooking}
                  handleOnchangeRadio={(item: GroupRadioType) => {
                    setCanceledReason({
                      ...canceledReason,
                      type: item.value,
                      reason: item.id !== 6 ? item.label : '',
                      item: item,
                    })
                  }}
                  value={canceledReason.item}
                />
                {
                  canceledReason.type === '6' &&
                  <TextArea
                    id=""
                    readOnly={false}
                    value={canceledReason.reason}
                    handleOnchange={(e) => setCanceledReason({
                      ...canceledReason, reason: e.target.value
                    })}
                  />
                }
              </div>
            </CModal>
          }
             {/* Layout dời lịch */}
          {isSendQuestions &&
            <CModal
              isOpen={isSendQuestions}
              widths={540}
              title="Dời ngày hẹn khám"
              onCancel={() => { setSendQuestions(false); }}
              onOk={() => handleDelayAppointment()}
              textCancel="Hủy"
              textOK="Dời Lịch"
              zIndex={200}
            >
              <div className="m-customer_infos_reschedule">
                <CDatePickers
                  
                    label="Ngày đặt hẹn:"
                          handleOnChange={(date: any) => {
                            setDataDelayBooking({ ...dataDelayBooking, date: date?.$d });
                          }}
                          variant="simple"
                          format={"DD-MM-YYYY HH:mm"}
                          isShowTime
                          placeholder="08:00 - 12/01/2023"
                         
                          value={dataDelayBooking.date}
                      
                />
                <TextArea
                  id=""
                  readOnly={false}
                  value={dataDelayBooking.value}
                  isResize
                  defaultValue={undefined}
                  handleOnchange={(e) => { setDataDelayBooking({ ...dataDelayBooking, value: e.target.value }); }}
                />
              </div>
            </CModal>
          }
        </div >
      </PublicLayout >

      {/* Popup Add lịch khám bênh */}
      {isOpenPopup &&
        <FormAddCustomer
          isOpenPopup={isOpenPopup}
          handleClosePopup={() => { setIsOpenPopup(false); setDateBooking(undefined as any) }}
          positionDrawer="left"
          isClose={!isOpenPopup}
          valUpdate={undefined as any}
          isUpdate={false}
          dateBookingSchedule={dateBooking ? new Date(moment(new Date(dateBooking as any)).format('YYYY-MM-DD HH:mm:ss')) : undefined}
          handleClose={() => { setIsOpenPopup(false); }}
          handleAddCustomer={(data: any) => handleAddCustomer(data)}
          isHigh
        />
      }
    </>
  );
};
export default BookingSchedule;
