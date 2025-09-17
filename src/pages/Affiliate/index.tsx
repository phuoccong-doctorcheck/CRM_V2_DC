/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin, TableProps, message } from 'antd';
import { optionStatusAffiliate } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CPopupConfirm from 'components/atoms/CPopupConfirm';
import CTooltip from 'components/atoms/CTooltip';
import { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import PublicTableTotal from 'components/molecules/PublicTableTotal';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import { filter } from 'lodash';
import moment from 'moment';
import React, { CSSProperties, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ServiceItem } from 'services/api/Example/types';
import { postNoteByID } from 'services/api/beforeExams';
import { Appointment } from 'services/api/beforeExams/types';
import { postCallOutCustomer } from 'services/api/customerInfo';
import { approveEmployeeCommission } from 'services/api/point';
import { postTransferCommission } from 'services/api/statistics';
import { AppointmentByEmployeeItem } from 'services/api/statistics/types';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getAppointmentEmployee } from 'store/statistics';
import mapModifiers from 'utils/functions';

import { StylesContainer } from '../../components/organisms/Container/index';
const Affiliate: React.FC = () => {
  const dispatch = useAppDispatch();
  const storeAppointmentEmployee = useAppSelector((state) => state.statistic.responseAppointmentEmployee);
  const storeLoadingAppointmentEmployee = useAppSelector((state) => state.statistic.isLoadingAppointmentEmployee);

  const storageEmployeeList = localStorage.getItem('listCSKH');
  const employeeIdOfAccount = localStorage.getItem('employee_id');
  const StorageErpCode = localStorage.getItem('erp_code');
  const getRoles = localStorage.getItem('roles');
  const service = localStorage.getItem('services');
  
  const [stateErpCode, setStateErpCode] = useState(StorageErpCode ? StorageErpCode : '');
  const [listEmployeeTeams, setListEmployeeTeams] = useState(storageEmployeeList ? JSON.parse(storageEmployeeList || '') : [] as any);
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [listServices] = useState(service ? JSON.parse(service) : '');
  const [listService,setListService] = useState(false)
  const [states, setStates] = useState({
    loading: storeLoadingAppointmentEmployee,
    list: storeAppointmentEmployee.data,
    statistic: storeAppointmentEmployee.data,
    statisticCancel: storeAppointmentEmployee.data?.filter((i) => i?.status === 'canceled'),
    date: new Date(),
    valueSearch: ''
  });
  
  const nameCS = Cookies.get('signature_name');

  const [formTransfer, setFormTransfer] = useState({
    employee: undefined as unknown as any,
    note: '',
    commission: undefined as unknown as AppointmentByEmployeeItem,
  });

  const [isTransferBooking, setIsTransferBooking] = useState(false);

  const [isAddNote, setIsAddNote] = useState(false);
  const [contentNote, setContentNote] = useState("");

  const [filterColumn, setFilterColumn] = useState({
    employee_name: [],
    FType: [],
  });
  const [filterDetailTotal, setFilterDetailTotal] = useState({
    details: [],

  });
  const [listIdApprove, setListIdApprove] = useState<number[]>([])
  const [listChooseScheduler, setListChooseScheduler] = useState<string[]>([]);

  const [customerClass, setCustomerClass] = useState<string[]>([]);
  const [customerFullName, setCustomeFullName] = useState<string[]>([]);

  useEffect(() => {
    setStates({
      ...states,
      loading: storeLoadingAppointmentEmployee,
      list: storeAppointmentEmployee.data,
      statistic: storeAppointmentEmployee.data,
      statisticCancel: storeAppointmentEmployee.data?.filter((i) => i?.status === 'canceled'),
    })
  }, [storeAppointmentEmployee, storeLoadingAppointmentEmployee,listChooseScheduler])
  
  const handleGetAppointment = () => {
    const body = {
      employee_code: stateErpCode,
      month: Number(moment(states.date).format('MM')),
      year: moment(states.date).year(),
    }
    // API lấy data số tiền hoa hồng nhận được theo tháng
    dispatch(getAppointmentEmployee(body))
  }

  useLayoutEffect(() => {
    handleGetAppointment()
  }, [])

  useLayoutEffect(() => {
    document.title = "Hoa hồng | CRM";
  }, [])

  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case "employee_name":
        uniqueValues = Array.from(
          new Set(
            (states.list || [])
              ?.map((item) => item?.employee_name)
              .filter(Boolean)
          )
        );
        break;
      case "f_type":
        uniqueValues = Array.from(
          new Set(
            (states.list || [])
              ?.map((item) => item?.f_type)
              .filter(Boolean)
          )
        );
        break;
      default:
        break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  };

  useEffect(() => {
    setFilterColumn({
      ...filterColumn,
      employee_name: handleGetOptionFilterColumn("employee_name") as any,
      FType: handleGetOptionFilterColumn("f_type") as any,
    });
  }, [states.list]);


  const handleSearchCustomer = async () => {
    if (states.valueSearch.trim()) {
      const newData = await storeAppointmentEmployee.data.filter((item) => item.customer_fullname.toLowerCase().search((states.valueSearch.toLowerCase())) !== -1);
      setStates({
        ...states,
        list: newData,
      })
    } else {
      setStates({
        ...states,
        list: storeAppointmentEmployee.data,
      })
    }
  }

  const { mutate: transferCommissionByEmployeeId } = useMutation(
    "post-footer-form",
    (data: any) => postTransferCommission(data),
    {
      onSuccess: (data) => {
        if (data.status === true) {
         
       
          setIsTransferBooking(false);
     
          toast.success('Cập nhật thành công.');
          handleGetAppointment()
        } else {
           toast.error(data.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        setIsAddNote(false);
        setContentNote("");
        toast.success(data?.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

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

  const { mutate: handleApproveCommission } = useMutation(
    'post-footer-form',
    (data: any) => approveEmployeeCommission(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          const body = {
            employee_code: stateErpCode,
            month: Number(moment(states.date).format('MM')),
            year: moment(states.date).year(),
          }
          dispatch(getAppointmentEmployee(body))
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );

  const handleValidateCommission = () => {
    if (!formTransfer.note?.trim()) {
      toast.error('Vui lòng nhập nội dung chuyển');
      return false;
    }
    return true;
  }

  const handleTransferCommission = () => {
    if (!handleValidateCommission()) return;
    const body = {
      master_ref: formTransfer.commission?.master_ref,
      current_employee_code: employeeIdOfAccount,
      new_employee_code: formTransfer.employee?.erp_code,
      note: formTransfer.note,
    }
    transferCommissionByEmployeeId(body);
  }

  const handleAddNoteCustomer = async () => {
    const body = {
      customer_id: employeeIdOfAccount,
      cs_node_type: "cs",
      cs_node_content: contentNote,
    };
    await postNoteCustomerById(body);
  };

  const handleCallOutCustomer = (data: any) => {
    postCallOut({
      message: `${nameCS || Cookies.get('signature_name')} gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };

  const handleApproveCommissionForCustomerCare = (id?: number, type: 'approve' | 'reject' = 'approve') => {
    const body = {
      record_ids: id ? [id] : listIdApprove,
      approval_by: StorageErpCode,
      type: type
    }
    handleApproveCommission(body);
  }
   const ListServivce = (value:any) => {
    
    setDataInfoRetail(value)
     setDataListServiceRetail(value.details)
     setDataListServiceInvoice(value.invoice_items)
    setListService(true)
  }
  /* Column */
  const columnTable = [
    {
      title: <Typography content="Ngày đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'appointment_datetime',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => new Date(a?.appointment_datetime).valueOf() - new Date(b?.appointment_datetime).valueOf(),
      align: 'center',
      width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
        
        ListServivce(data)
        }}>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="ngày thanh toán" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'payment_date',
      align: 'center',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => new Date(a?.payment_date).valueOf() - new Date(b?.payment_date).valueOf(),
      width: 120,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
             ListServivce(data)
        }}>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Phân loại KH" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_fullname',
      className: "ant-table-column_wrap",
      width:120,
      //  filters: filterColumn.FType,
      filters:  [
        { text: 'F1', value: 'F1' },
        { text: 'F2', value: 'F2' },
        { text: 'F3', value: 'F3' },
      ],
      onFilter: (value: any, record: any) => { return record.f_type === value },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'block' }} onClick={() => {
             ListServivce(data)
        }}>
         
           <Typography 
  content={`${data?.f_type}${(data?.launch_source_id === 4 && data?.f_type === "F1" )? " (WOM)" : ""}`} 
  modifiers={["13x18", "600", "center", "orange"]}
/>

          
        </div>
      ),
    },
    {
      title: <Typography content="Họ và tên" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"13px"}}/>,
      dataIndex: 'customer_fullname',
      className: "ant-table-column_wrap",
      width: 180,
      // filters: filterColumn.FType,
      // onFilter: (value: any, record: any) => { return record.f_type === value },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ justifyContent:"start" }} onClick={() => {
       
             ListServivce(data)
        }}>
          <Typography content={record} modifiers={['14x20', '600', 'center', 'main']} />
         
        </div>
      ),
    },
    {
      title: <Typography content="Ghi chú khi đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'internal_note',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
        
             ListServivce(data)
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    
    {
      title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
      dataIndex: 'total_amount',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => a?.total_amount - b?.total_amount,
      width: 160,
      align: 'center',
      
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_ref_code, customer_fullname, ...prevData } = data;
        
             ListServivce(data)
        }}
        style={{ justifyContent:"end" }} 
        >
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
     {
      title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
      dataIndex: 'customer_revenue',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => a?.customer_revenue - b?.customer_revenue,
      width: 160,
      align: 'center',
      
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_ref_code, customer_fullname, ...prevData } = data;
        
             ListServivce(data)
        }}
        style={{ justifyContent:"end" }} 
        >
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    // {
    //   title: <Typography content="Chiết khấu" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
    //   dataIndex: 'total_discount_from_invoices',
    //   showSorterTooltip: false,
    //   sorter: (a: any, b: any) => a?.total_discount_from_invoices - b?.total_discount_from_invoices,
    //   width: 160,
    //   align: 'center',
      
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //       const { customer_ref_code, customer_fullname, ...prevData } = data;
        
    //          ListServivce(data)
    //     }}
    //     style={{ justifyContent:"end" }} 
    //     >
    //       <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Hoa hồng (VNĐ)" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
      dataIndex: 'total_commission',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => a?.total_commission - b?.total_commission,
      width: 160,
      align: 'center',
      
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_ref_code, customer_fullname, ...prevData } = data;
        
             ListServivce(data)
        }}
        style={{ justifyContent:"end" }} 
        >
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'status',
      align: 'center',
      width: 160,
      filters: optionStatusAffiliate.map((item) => ({ text: item.label, value: item.label })),
      onFilter: (value: any, record: any) => { return record.status === optionStatusAffiliate.find((i) => i.label === value)?.value },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
             ListServivce(data)
        }}>
          <Typography
            styles={{ color: optionStatusAffiliate?.find((i) => i.value === record)?.color }}
            content={optionStatusAffiliate?.find((i) => i.value === record)?.label}
            modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
          />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái duyệt" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'approval_display',
      sorter: (a: any, b: any) => (a?.approval_display || "").localeCompare(b?.approval_display || ""),
      showSorterTooltip: false,
      width: 160,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
             ListServivce(data)
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'approval_display',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <CTooltip title="Gọi điện cho khách hàng" placements="top" colorCustom='#007bff' >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => {
              if (!data?.customer_phone) {
                toast.error('Không tìm thấy số điện thoại!');
              } else {
                handleCallOutCustomer(data?.customer_phone);
              }
            }}>
            <Icon iconName="phone_icon-main" size="24x24" isPointer />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'approval_display',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <CTooltip title="Chuyển người nhận hoa hồng" placements="top" colorCustom='#007bff' >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => {
              setFormTransfer({
                ...formTransfer,
                commission: data,
              })
              setIsTransferBooking(true);
            }}>
            <Icon iconName="person_crm" size="20x20" isPointer />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'approval_display',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <CTooltip title="Ghi chú" placements="top" colorCustom='#007bff' >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => {
              setIsAddNote(true);
              setFormTransfer({
                ...formTransfer,
                commission: record,
              })
            }}>
            <Icon iconName="note_crm" size="24x24" isPointer />
          </div>
        </CTooltip>
      ),
    },
  ];

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
 

  setCustomerClass(filters.f_type || []);
  setListChooseScheduler(filters.employee_name || []);

  if (filters.customer_fullname) {
    const statusMapping: { [key: string]: string } = {
      'Chưa đến': 'new',
      'Đã đến': 'checkin',
      'Đang thực hiện': 'inprogress',
      'Dời ngày': 'delay',
      'Đã hủy': 'canceled',
      'Đã khám xong': 'done'
    };

    const mappedStatuses = filters.customer_fullname.map((status: string) => statusMapping[status] ?? status);
    setCustomeFullName(mappedStatuses);
  } else {
    setCustomeFullName([]);
  }
};
    const handleTableChange1 = (pagination: any, filters: any, sorter: any) => {
  
     setCustomerClass(filters.f_type || []);
  setListChooseScheduler(filters.employee_name || []);

  if (filters.customer_fullname) {
    const statusMapping: { [key: string]: string } = {
      'Chưa đến': 'new',
      'Đã đến': 'checkin',
      'Đang thực hiện': 'inprogress',
      'Dời ngày': 'delay',
      'Đã hủy': 'canceled',
      'Đã khám xong': 'done'
    };

    const mappedStatuses = filters.customer_fullname.map((status: string) => statusMapping[status] ?? status);
    setCustomeFullName(mappedStatuses);
  } else {
    setCustomeFullName([]);
  }
  };
 const TotalCost = (value: any) => {
  const total = value.details.reduce((sum: number, item: any) => sum + item.unit_price, 0);

  return total?.toLocaleString("vi-VN");
}
 
  const [dataListServiceRetail, setDataListServiceRetail] = useState<ServiceItem>()
    const [dataListServiceInvoice, setDataListServiceInvoice] = useState<ServiceItem>()
  const [dataInfoRetail, setDataInfoRetail] = useState<AppointmentByEmployeeItem>()
  const [newData, setNewData] = useState([]);
   useEffect(() => {
    const updatedData = listEmployeeTeams.map((item: any) => {
      // Tách tên khỏi nhãn bằng cách loại bỏ "CS. "
      const name = item.label.replace("CS. ", "");
      return { text: name, value: name };
    });

    setNewData(updatedData);
  }, [listEmployeeTeams]);

 


 // console.log(listEmployeeTeams,convertedArray)
  const columnTableApproveCommissions = [
    {
      title: (<Typography content="STT" modifiers={['11x18', "500", "center"]} />),
      align: "center",
      dataIndex: "index",
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          <Typography content={`${index + 1}`} modifiers={["14x20", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'appointment_datetime',
      align: 'center',
      width: 90,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => ListServivce(data)
         
        }>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['12x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="ngày thanh toán" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'payment_date',
      align: 'center',
      width: 90,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() =>  ListServivce(data)
      
        }>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['12x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Phân loại KH" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'f_type',
      width: 120,
      className: "ant-table-column_wrap",
      filters:  [
        { text: 'F1', value: 'F1' },
        { text: 'F2', value: 'F2' },
        { text: 'F3', value: 'F3' },
      
        // { text: 'Khách hàng tái khám', value: 'Khách hàng tái khám' },
      ],
      // onFilter: (value: any, record: any) => { return record.f_type === value },
        onFilter: (value: any, record: any) => {
        return record.f_type?.includes(value);
      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'block' }} onClick={() => {
           ListServivce(data)
        
        }}>
         <Typography 
  content={`${data?.f_type}${(data?.launch_source_id === 4 && data?.f_type === "F1" )? " (WOM)" : ""}`} 
  modifiers={["13x18", "600", "center", "orange"]}
/>

        </div>
      ),
    },
    {
      title: <Typography content="Họ và tên" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"13px"}}/>,
      dataIndex: 'customer_fullname',
      className: "ant-table-column_wrap",
      filters: optionStatusAffiliate.map((item) => ({ text: item.label, value: item.label })),
      onFilter: (value: any, record: any) => { return record.status === optionStatusAffiliate.find((i) => i.label === value)?.value },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', flexDirection:"column", justifyContent:"start", alignItems:"start" }} onClick={() => {
           ListServivce(data)
        }}>
          <Typography content={record} modifiers={['15x22', '600', 'center', 'blueNavy', 'uppercase']} />
          <Typography
            styles={{ color: optionStatusAffiliate?.find((i) => i.value === data?.status)?.color }}
            content={optionStatusAffiliate?.find((i) => i.value === data?.status)?.label}
            modifiers={['14x20', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
          />
        </div>
      ),
    },
    {
      title: <Typography content="Người đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'employee_name',
      align: 'center',
      width: 160,
      // filters: filterColumn.employee_name,
    //     filters: [
    //     { text: 'Nguyễn Tô Huỳnh Châu', value: 'Nguyễn Tô Huỳnh Châu' },
    //     { text: 'Quách Thu Trang', value: 'Quách Thu Trang' },
    //     { text: 'Nguyễn Thị Hồng Phúc', value: 'Nguyễn Thị Hồng Phúc' },
    //     { text: 'Lê Thị Kim Giang', value: 'Lê Thị Kim Giang' },
    // //    { text: 'Hoàng Nguyễn Thanh Huyền', value: 'Hoàng Nguyễn Thanh Huyền' },
    //     { text: 'Nguyễn Ái Trang', value: 'Nguyễn Ái Trang' },
    //  //   { text: 'Lê Thị Quỳnh Anh', value: 'Lê Thị Quỳnh Anh' },
    //   ],
      filters: newData.map((item: any) => ({
        text: item.text,
        value: item.value,
      })),
      onFilter: (value: any, record: any) => {
        return record.employee_name?.includes(value);
      },
      className: "ant-table-column_wrap",
      onclick: () => {

      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
          onClick={() => 
         
            ListServivce(data)
       
          }
           style={{justifyContent:"left"}}
        >
          <Typography
            content={record}
            modifiers={['13x18', '600', 'center', 'main']}
          />
        </div>
      ),
    },
    {
      title: <Typography content="Ghi chú khi đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'internal_note',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
           ListServivce(data)
        }}
         
        >
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
      dataIndex: 'total_amount',
      align: 'center',
      width: 170,
      className: "ant-table-column_wrap",
     
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
            ListServivce(data)
        }}
        style={{justifyContent:"right"}}
        >
          <Typography  content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    
      {
      title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"14px"}}/>,
      dataIndex: 'customer_revenue',
      align: 'center',
      width: 170,
      className: "ant-table-column_wrap",
     
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
            ListServivce(data)
        }}
        style={{justifyContent:"right"}}
        >
          <Typography  content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    // {
    //   title: <Typography content="Chiết khấu" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
    //   dataIndex: 'total_discount_from_invoices',
    //   showSorterTooltip: false,
    //   sorter: (a: any, b: any) => a?.total_discount_from_invoices - b?.total_discount_from_invoices,
    //   width: 160,
    //   align: 'center',
      
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //       const { customer_ref_code, customer_fullname, ...prevData } = data;
        
    //          ListServivce(data)
    //     }}
    //     style={{ justifyContent:"end" }} 
    //     >
    //       <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Hoa hồng (VNĐ)" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right"}}/>,
      dataIndex: 'total_commission',
      showSorterTooltip: false,
      sorter: (a: any, b: any) => a?.total_commission - b?.total_commission,
      width: 170,
      align: 'center',
      fixed: 'right',

      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         
           ListServivce(data)
        }}
          style={{justifyContent:"right"}}
        >
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái duyệt" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'approval_display',
      filters: [
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Chưa duyệt', value: 'Chưa duyệt' },
      ],
      onFilter: (value: any, record: any) => { return record.approval_display === value },
      width: 160,
      align: 'center',
      fixed: 'right',
      className: "ant-table-column_wrap2",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
       
             ListServivce(data)
        }}>
          <Typography content={record} modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: '',
      align: 'center',
      width: 100,
      fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item p-affiliate_body_content_button">
          <Button modifiers={[data.approval === 'approved' ? 'red' : 'foreign']} onClick={() => {
            handleApproveCommissionForCustomerCare(data?.record_id, data.approval === 'approved' ? 'reject' : 'approve');
          }} >
            <Typography content={data.approval === 'approved' ? 'Bỏ duyệt' : 'Duyệt hoa hồng'} modifiers={['400', '13x18']} />
          </Button>
        </div>
      ),
    },
  ];

  
  const columnTableDetailService = [
   {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_ref',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (text: any, record: any, index: number) => (
      <div className="ant-table-column_item">
        {index + 1}
      </div>
    ),
    },
    {
      title: <Typography content="Mã dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_ref',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginRight:"13px"}}/>,
      dataIndex: 'service_name',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"start"}}>
          <Typography content={record} modifiers={['14x20', '600', 'left', 'main']} styles={{maxWidth:"200px",minWidth:"200px"}}/>
        </div>
      ),
    },
    {
      title: <Typography content="Số lượng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'quantity',
      align: 'center',
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Đơn giá" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'unit_price',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
     {
      title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'total_amount',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    //  {
    //   title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} />,
    //   dataIndex: 'customer_revenue',
    //   width: 200,
    //   align: 'center',
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" style={{justifyContent:"end"}}>
    //       <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Hoa hồng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography
            content={record}
            modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
           
          />
        </div>
      ),
    },
     {
      title: <Typography content="Người đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"start"}}>
          <Typography
            content={getCSV(data)}
            modifiers={['13x18', '600', 'center', 'blueNavy']}
           
          />
        </div>
      ),
    },
    
  ];
  const columnTableDetailService3 = [
   {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_ref',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (text: any, record: any, index: number) => (
      <div className="ant-table-column_item">
        {index + 1}
      </div>
    ),
    },
    {
      title: <Typography content="Mã dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_ref',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'service_name',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"start"}}>
          <Typography content={record} modifiers={['14x20', '600', 'left', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Số lượng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'quantity',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Đơn giá" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'unit_price',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
     {
      title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'total_amount',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    //  {
    //   title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
    //   dataIndex: 'customer_revenue',
    //   width: 200,
    //   align: 'center',
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" style={{justifyContent:"end"}}>
    //       <Typography content={record?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'center', 'main']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Hoa hồng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography
            content={record}
            modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
           
          />
        </div>
      ),
    },
     {
      title: <Typography content="Người đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography
            content=""
            modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
           
          />
        </div>
      ),
    },
  ];
  const MDV = (a: any) => {
   
    return a.service_group_id
  }
  const TNDV = (a: any) => {
    
    return a.service_group_name
  }
  
   const TotalDV = (a: any) => {
    
    return a.service_group_item.length
  }
  const TotalAmoutDV = (a: any) => {
    
    return a.service_group_item.reduce((sum: number, item: any) => sum + item.unit_price, 0)
  }
  const TotalAmoutDV2 = (a: any) => {
    
    return a.service_group_item.reduce((sum: number, item: any) => sum + item.total_amount, 0)
  }
   const Customer_revenue = (a: any) => {
    
    return a.service_group_item.reduce((sum: number, item: any) => sum + item.customer_revenue, 0)
  }
   const TotalCommissionDV = (a: any) => {
    
    return a.service_group_item.reduce((sum: number, item: any) => sum + item.commission_value, 0)
  }
  const getCSV = (a: any) => {

    return ""
  }
  const styles: CSSProperties = {
    maxWidth: '250px' ,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  };
  const columnTableDetailService2 = [
    {
      title: <Typography content="Mã dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_ref',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={MDV(data)} modifiers={['13x18', '600', 'left', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"12px"}}/>,
      dataIndex: 'service_name',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item ant-max-width" style={{justifyContent:"start"}}>
          <Typography content={TNDV(data)} modifiers={['14x20', '600', 'left', 'main']} styles={{minWidth:"200px"}}/>
        </div>
      ),
    },
    {
      title: <Typography content="Số lượng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'quantity',
      align: 'center',
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <Typography content={TotalDV(data)} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Đơn giá" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'unit_price',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={TotalAmoutDV(data)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'right', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Doanh thu dự kiến" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'total_amount',
      width: 200,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography content={TotalAmoutDV2(data)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'right', 'main']} />
        </div>
      ),
    },
    //  {
    //   title: <Typography content="Doanh thu thực tế" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
    //   dataIndex: 'customer_revenue',
    //   width: 200,
    //   align: 'center',
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" style={{justifyContent:"end"}}>
    //       <Typography content={Customer_revenue(data)?.toLocaleString("vi-VN")} modifiers={['13x18', '600', 'right', 'main']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Hoa hồng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"13px"}}/>,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"end"}}>
          <Typography
            content={TotalCommissionDV(data)?.toLocaleString("vi-VN")}
            modifiers={['13x18', '600', 'center', data.approval !== 'wait_approval' ? 'green' : 'cg-red']}
          />
        </div>
      ),
    },
      {
      title: <Typography content="Người đặt lịch" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"left", marginLeft:"11px"}}/>,
      dataIndex: 'commission_value',
      align: 'center',
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{justifyContent:"start"}}>
          <Typography
            content=""
            modifiers={['13x18', '600', 'center', ]}
          />
        </div>
      ),
    },
  ];
  const memoryStatistic = useMemo(() => {
    const checkYouHavePermissionApproveCommissions = listRoles?.some((role: any) => ['approveCommission'].some((i => i === role?.role_name)));

    return (
      <div className='p-affiliate_body_statistic'>
        <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data,
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>Tổng lượt đặt lịch</p>
            <Typography
                  content={ checkYouHavePermissionApproveCommissions ? states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.length.toString() 
      : (listChooseScheduler.length !== 0 && customerClass.length === 0 
        ? states.list.filter(i => listChooseScheduler.includes(i.employee_name)).length.toString() 
        : (listChooseScheduler.length === 0 && customerClass.length !== 0 
        ? states.list.filter(i => customerClass.includes(i.f_type)).length.toString() 
        : states.list
  .filter(i => customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name))
  .length
  .toString()
))
    ) 
  : "0" : states.statistic 
  ? (
       customerClass.length === 0
      ? states.statistic.length.toString() 
      : states.list.filter(i => customerClass.includes(i.f_type)).length.toString() 
    )
    
  : "0"}
             
              modifiers={['green']}
              styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
                      />

          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i?.status === 'checkin' || i?.status === 'done'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>Khách hàng đã đến</p>
            <Typography
             // content={states.statistic ? states.statistic?.filter((i) => i?.status === 'checkin' || i?.status === 'done')?.length?.toString() : '0'}
              //  content={states.statistic ?
              //   (listChooseScheduler.length === 0 ?
              //     `${states.statistic?.filter((i) => i?.status === 'checkin' || i?.status === 'done')?.length?.toString()}` :
              //     `${states.statistic?.filter((i) => (i?.status === 'checkin' || i?.status === 'done') && listChooseScheduler.includes(i.employee_name))?.length?.toString()}`) : "0"
              //   }
              content={checkYouHavePermissionApproveCommissions ?  states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.filter(i => i?.status === 'checkin' || i?.status === 'done').length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0 
          ? states.statistic.filter(i => (i?.status === 'checkin' || i?.status === 'done') && listChooseScheduler.includes(i.employee_name)).length.toString() 
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0 
              ? states.statistic.filter(i => (i?.status === 'checkin' || i?.status === 'done') && customerClass.includes(i.f_type)).length.toString() 
              : states.statistic.filter(i => (i?.status === 'checkin' || i?.status === 'done') && customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    ) 
  : "0" :  states.statistic 
  ? (
      customerClass.length === 0
      ? states.statistic.filter(i => i?.status === 'checkin' || i?.status === 'done').length.toString() 
      : states.statistic.filter(i => (i?.status === 'checkin' || i?.status === 'done') && customerClass.includes(i.f_type)).length.toString() 
    ) 
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['blueNavy']} />
            
          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i?.status === 'new'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p style={{ color: '#04566e' }}>Khách hàng chưa đến</p>
            <Typography
              //  content={states.statistic ?
              //   (listChooseScheduler.length === 0 ?
              //     `${states.statistic?.filter((i) => i?.status === 'new')?.length?.toString()}` :
              //     `${states.statistic?.filter((i) => (i?.status === 'new') && listChooseScheduler.includes(i.employee_name))?.length?.toString()}`) : "0"
              //   }
               content={checkYouHavePermissionApproveCommissions ? states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.filter(i =>  i?.status === 'new').length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0 
          ? states.statistic.filter(i =>  i?.status === 'new' && listChooseScheduler.includes(i.employee_name)).length.toString() 
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0 
              ? states.statistic.filter(i =>  i?.status === 'new' && customerClass.includes(i.f_type)).length.toString() 
              : states.statistic.filter(i =>  i?.status === 'new' && customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    ) 
  : "0": states.statistic 
  ? (
      customerClass.length === 0
      ? states.statistic.filter(i =>  i?.status === 'new').length.toString() 
      : states.statistic.filter(i =>  i?.status === 'new' && customerClass.includes(i.f_type)).length.toString() 
    ) 
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['main']} />
          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i?.status === 'delay'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p style={{ color: '#fd7e14' }}>Khách hàng dời ngày</p>
            <Typography
             // content={states.statistic ? states.statistic?.filter((i) => i?.status === 'delay')?.length?.toString() : '0'}
              //  content={states.statistic ?
              //   (listChooseScheduler.length === 0 ?
              //     `${states.statistic?.filter((i) => i?.status === 'delay')?.length?.toString()}` :
              //     `${states.statistic?.filter((i) => (i?.status === 'delay') && listChooseScheduler.includes(i.employee_name))?.length?.toString()}`) : "0"
              //   }
                  content={checkYouHavePermissionApproveCommissions ?  states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.filter(i =>  i?.status === 'delay').length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0 
          ? states.statistic.filter(i =>  i?.status === 'delay' && listChooseScheduler.includes(i.employee_name)).length.toString() 
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0 
              ? states.statistic.filter(i =>  i?.status === 'delay' && customerClass.includes(i.f_type)).length.toString() 
              : states.statistic.filter(i =>  i?.status === 'delay' && customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    ) 
  : "0" :  states.statistic 
  ? (
      customerClass.length === 0
      ? states.statistic.filter(i =>  i?.status === 'delay').length.toString() 
      :states.statistic.filter(i =>  i?.status === 'delay' && customerClass.includes(i.f_type)).length.toString() 
    ) 
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['orange']} />
          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i?.status === 'canceled'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p style={{ color: '#f00' }}>Tổng lượt đặt lịch đã hủy</p>
            <Typography
           
              //  content={
              //           states.statisticCancel ? (
              //           listChooseScheduler.length === 0
              //           ? states.statisticCancel.length.toString()
              //         : states.statisticCancel.filter(i => listChooseScheduler.includes(i.employee_name)).length.toString()
              //           ) : "0"
              //           }    
              content={checkYouHavePermissionApproveCommissions ?    states.statisticCancel 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statisticCancel.length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? states.statisticCancel.filter(i => listChooseScheduler.includes(i.employee_name)).length.toString()
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? states.statisticCancel.filter(i => customerClass.includes(i.f_type)).length.toString()
              : states.statisticCancel.filter(i => customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    )
  : "0" :    states.statisticCancel 
  ? (
       customerClass.length === 0
      ? states.statisticCancel.length.toString() 
      : states.statisticCancel.filter(i => customerClass.includes(i.f_type)).length.toString()
    )
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['cg-red']} />
          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i.approval === 'approved'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p style={{ color: '#28a745' }}>Tổng lượt đặt lịch đã duyệt</p>
            <Typography
             // content={states.statistic ? states.statistic?.filter((i) => i.approval === 'approved')?.length?.toString() : '0'}
                // content={states.statistic ?
                // (listChooseScheduler.length === 0 ?
                //   `${states.statistic?.filter((i) => i.approval === 'approved')?.length?.toString()}` :
                //   `${states.statistic?.filter((i) => (i.approval === 'approved') && listChooseScheduler.includes(i.employee_name))?.length?.toString()}`) : "0"
              // }
               content={checkYouHavePermissionApproveCommissions ? states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.filter(i =>  i.approval === 'approved').length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0 
          ? states.statistic.filter((i) =>  i.approval === 'approved' && listChooseScheduler.includes(i.employee_name)).length.toString() 
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0 
              ? states.statistic.filter(i =>  i.approval === 'approved' && customerClass.includes(i.f_type)).length.toString() 
              : states.statistic.filter(i => i.approval === 'approved' && customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    ) 
  : "0" : states.statistic 
  ? (
       customerClass.length === 0
      ? states.statistic.filter(i =>  i.approval === 'approved').length.toString() 
      : states.statistic.filter(i =>  i.approval === 'approved' && customerClass.includes(i.f_type)).length.toString()
    ) 
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['green']} />
          </Spin>
        </div>
        <div
          className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}
          onClick={() => {
            setStates({
              ...states,
              list: storeAppointmentEmployee.data?.filter((i) => i.approval !== 'approved'),
            })
          }}
        >
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>Tổng lượt đặt lịch chưa duyệt</p>
            <Typography
           //   content={states.statistic ? states.statistic?.filter((i) => i.approval === 'wait_approval' && i?.status !== 'canceled')?.length?.toString() : '0'}
              //  content={states.statistic ?
              //   (listChooseScheduler.length === 0 ?
              //     `${states.statistic?.filter((i) => i.approval === 'wait_approval' && i?.status !== 'canceled')?.length?.toString()}` :
              //     `${states.statistic?.filter((i) => (i.approval === 'wait_approval' && i?.status !== 'canceled') && listChooseScheduler.includes(i.employee_name))?.length?.toString()}`) : "0"
              //   }
                  content={checkYouHavePermissionApproveCommissions ? states.statistic 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.statistic.filter(i =>  i.approval === 'wait_approval' && i?.status !== 'canceled').length.toString() 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0 
          ? states.statistic.filter((i) =>  (i.approval === 'wait_approval' && i?.status !== 'canceled') && listChooseScheduler.includes(i.employee_name)).length.toString() 
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0 
              ? states.statistic.filter(i =>  (i.approval === 'wait_approval' && i?.status !== 'canceled') && customerClass.includes(i.f_type)).length.toString() 
              : states.statistic.filter(i => (i.approval === 'wait_approval' && i?.status !== 'canceled') && customerClass.includes(i.f_type) && listChooseScheduler.includes(i.employee_name)).length.toString()
            )
        )
    ) 
  : "0": states.statistic 
  ? (
      customerClass.length === 0
      ? states.statistic.filter(i =>  i.approval === 'wait_approval' && i?.status !== 'canceled').length.toString() 
      : states.statistic.filter(i =>  (i.approval === 'wait_approval' && i?.status !== 'canceled') && customerClass.includes(i.f_type)).length.toString() 
    ) 
  : "0"}
               styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
              modifiers={['cg-red']} />
          </Spin>
        </div>
        <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}>
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>Doanh thu dự kiến</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8 }}>
              <Typography
                //   content={states.list ?
                // (listChooseScheduler.length === 0 ?
                //   `${states.list?.filter((i) =>i.approval === 'approved')?.reduce((init: any, item: any) => init + item.total_amount, 0)?.toLocaleString("vi-VN")}` :
                //   `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.total_amount, 0)?.toLocaleString("vi-VN")}`) : "0"
                // }
                content={checkYouHavePermissionApproveCommissions ?  states.list 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN") 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? states.list.filter(i => listChooseScheduler.includes(i.employee_name)).reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN")
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN")
              : states.list.filter(i => listChooseScheduler.includes(i.employee_name) && customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN")
            )
        )
    )
  : "0": states.list 
  ? (
      customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN") 
      : states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_amount, 0).toLocaleString("vi-VN")
    )
  : "0"}
               // content='1000000000'
                 styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
                modifiers={['green']} />
             
            </div>
          </Spin>
        </div>
         <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}>
  <Spin spinning={storeLoadingAppointmentEmployee} size="default">
    <p>Doanh thu thực tế</p>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, maxWidth: '100%', overflow: 'hidden' }}>
              <Typography
                     content={checkYouHavePermissionApproveCommissions ? states.list 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN") 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? states.list.filter(i => listChooseScheduler.includes(i.employee_name)).reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN")
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN")
              : states.list.filter(i => listChooseScheduler.includes(i.employee_name) && customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN")
            )
        )
    )
  : "0":states.list 
  ? (
     customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN") 
      :states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN")
    )
  : "0"}
        // content={states.list ?
        //   (listChooseScheduler.length === 0 ?
        //     `${states.list?.filter((i) => i.approval === 'approved')?.reduce((init: any, item: any) => init + item.customer_revenue, 0)?.toLocaleString("vi-VN")}` :
        //     `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.customer_revenue, 0)?.toLocaleString("vi-VN")}`) : "0"
        //         }
                styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
        modifiers={['green']}
      
      />
    </div>
  </Spin>
</div>
     {/* <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}>
  <Spin spinning={storeLoadingAppointmentEmployee} size="default">
    <p>Chiết khấu</p>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, maxWidth: '100%', overflow: 'hidden' }}>
              <Typography
                     content={checkYouHavePermissionApproveCommissions ? states.list 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.total_discount_from_invoices, 0).toLocaleString("vi-VN") 
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? states.list.filter(i => listChooseScheduler.includes(i.employee_name)).reduce((init:any, item:any) => init + item.total_discount_from_invoices, 0).toLocaleString("vi-VN")
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_discount_from_invoices, 0).toLocaleString("vi-VN")
              : states.list.filter(i => listChooseScheduler.includes(i.employee_name) && customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_discount_from_invoices, 0).toLocaleString("vi-VN")
            )
        )
    )
  : "0":states.list 
  ? (
     customerClass.length === 0
      ? states.list.reduce((init:any, item:any) => init + item.customer_revenue, 0).toLocaleString("vi-VN") 
      :states.list.filter(i => customerClass.includes(i.f_type)).reduce((init:any, item:any) => init + item.total_discount_from_invoices, 0).toLocaleString("vi-VN")
    )
  : "0"}
        // content={states.list ?
        //   (listChooseScheduler.length === 0 ?
        //     `${states.list?.filter((i) => i.approval === 'approved')?.reduce((init: any, item: any) => init + item.customer_revenue, 0)?.toLocaleString("vi-VN")}` :
        //     `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.customer_revenue, 0)?.toLocaleString("vi-VN")}`) : "0"
        //         }
                styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
        modifiers={['green']}
      
      />
    </div>
  </Spin>
</div> */}

        <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}>
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>Tổng hoa hồng {`(Dự kiến)`}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8 }}>
              <Typography
                // content={states.list ?
                // (listChooseScheduler.length === 0 ?
                //   `${states.list?.filter((i) => i.status !== 'canceled')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}` :
                //   `${states.list?.filter((i) => i.status !== 'canceled' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`) : "0"
                // }
                 content={checkYouHavePermissionApproveCommissions ? states.list 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ?  `${states.list?.filter((i) =>i.status !== 'canceled')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? `${states.list?.filter((i) => i.status !== 'canceled' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? `${states.list?.filter((i) => i.status !== 'canceled' && customerClass.includes(i.f_type))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
              : `${states.list?.filter((i) => i.status !== 'canceled' && listChooseScheduler.includes(i.employee_name) && customerClass.includes(i.f_type))?.reduce((init:any, item:any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}` 
            )
        )
    )
  : "0" : states.list 
  ? (
      customerClass.length === 0
      ?  `${states.list?.filter((i) =>i.status !== 'canceled')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
      : `${states.list?.filter((i) => i.status !== 'canceled' && customerClass.includes(i.f_type))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
    )
  : "0"}
                 styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
                modifiers={['green']} />
              
            </div>
          </Spin>
        </div>
        <div className={mapModifiers('p-affiliate_body_statistic_item', storeLoadingAppointmentEmployee && 'loading')}>
          <Spin spinning={storeLoadingAppointmentEmployee} size="default" >
            <p>{checkYouHavePermissionApproveCommissions ? 'Tổng hoa hồng đã duyệt' : 'Tổng tiền thực nhận'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8 }}>
              <Typography
                //   content={states.list ?
                // (listChooseScheduler.length === 0 ?
                //   `${states.list?.filter((i) =>i.approval === 'approved')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}` :
                //   `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`) : "0"
                // }
                 content={checkYouHavePermissionApproveCommissions ? states.list 
  ? (
      listChooseScheduler.length === 0 && customerClass.length === 0
      ?  `${states.list?.filter((i) =>i.approval === 'approved')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
      : (
          listChooseScheduler.length !== 0 && customerClass.length === 0
          ? `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
          : (
              listChooseScheduler.length === 0 && customerClass.length !== 0
              ? `${states.list?.filter((i) => i.approval === 'approved' && customerClass.includes(i.f_type))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
              : `${states.list?.filter((i) => i.approval === 'approved' && listChooseScheduler.includes(i.employee_name) && customerClass.includes(i.f_type))?.reduce((init:any, item:any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}` 
            )
        )
    )
  : "0": states.list 
  ? (
       customerClass.length === 0
      ?  `${states.list?.filter((i) =>i.approval === 'approved')?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
      :`${states.list?.filter((i) => i.approval === 'approved' && customerClass.includes(i.f_type))?.reduce((init: any, item: any) => init + item.total_commission, 0)?.toLocaleString("vi-VN")}`
    )
  : "0"}
                 styles={{fontSize:"clamp(12px, 2vw, 24px)"}}
                modifiers={['green']} />
             
            </div>
          </Spin>
        </div>
        
      </div>
    )
  }, [storeLoadingAppointmentEmployee, storeAppointmentEmployee.data, states])
  const handleCancel = () => {
    setExpandedRowKeys([]);
    setListService(false)
  }

  const memoryTableAffiliate = useMemo(() => {
    const checkYouHavePermissionApproveCommissions = listRoles?.some((role: any) => ['approveCommission'].some((i => i === role?.role_name)));
    return (
         <PublicTable
        listData={states.list}
        loading={states.loading}
        column={checkYouHavePermissionApproveCommissions ? columnTableApproveCommissions : columnTable}
        rowkey={'master_ref'}
        isHideRowSelect={!checkYouHavePermissionApproveCommissions}
        showExpandColumn
        isExpandable
        scroll={{ x: 'max-content', y: 'calc(100vh - 180px)' }}
        defaultExpandAllRow={false}
        handleOnchange={checkYouHavePermissionApproveCommissions ? handleTableChange : handleTableChange1}
        expandedRender={(data) => (
          data?.details ?
            <div className='p-affiliate_body_content_child'>
              <PublicTable
                isSimpleHeader
                column={columnTableDetailService3}
                listData={data?.details}
                size="small"
                rowkey="service_id"
                isbordered
                isPagination={false}
                isHideRowSelect
                // isHideHeader
                handleOnDoubleClick={(item: any) => { }}
                rowClassNames={(record, index) => ""}
                scroll={{
                  x: 'max-content',
                }}
              />
            </div>
            : null
        )}
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
        handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
          const listId = selectedRows.map((item: any) => item.record_id);
          setListIdApprove(listId);
        }}
        handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
          const listId = selectedRows.map((item: any) => item.record_id);
          setListIdApprove(listId);

        }}
        handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
          const listId = selectedRows.map((item: any) => item.record_id);
          setListIdApprove(listId);
        }}
      />
    )
  }, [storeLoadingAppointmentEmployee, storeAppointmentEmployee.data, states.list, states.loading])
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const handleExpand = (expanded: boolean, record: any) => {
  
    setExpandedRowKeys(expanded ? [record.service_group_id] : []);
  };
  const memoriesTableSelected = useMemo(() => {
    const convertServiceSelected: any[] = [];
    dataListServiceRetail?.map((item:any) => {
    
      const checkGroupIsExit = convertServiceSelected.find(
  (i) => i.service_ref && item.service_ref && i.service_ref.slice(0, 2) === item.service_ref.slice(0, 2)
);

    
      const newGroup = {
        service_group_id: item.service_ref,
        service_group_name: "Khám",
        service_group_item: [item],
      };
      
      if (checkGroupIsExit) {
        checkGroupIsExit.service_group_item.push(item);
      } else {
        convertServiceSelected.push(newGroup);
      }
    });
    
//     const groupedServices: { [key: string]: any } = {};



// const convertServiceSelected = Object.values(groupedServices);
    const result: Appointment[] = [];

// Step 1: Find matching service_id and service_ref
if (dataListServiceRetail) {
  listServices.forEach((group: any) => {
    group.children.forEach((service: any) => {
      dataListServiceRetail.forEach((item: any) => {
        if (service.service_id === item.service_ref) {
          const newItem: Appointment = {
            ...item,
            service_group_id: service.service_group_id,
            service_group_name: service.service_group_name,
          };
          result.push(newItem);
        }
      });
    });
  });
}


// Step 2: Group items by service_group_id
const groupedResult: { [key: string]: any } = {};

result.forEach((item: any) => {
  if (!groupedResult[item.service_group_id!]) {
    groupedResult[item.service_group_id!] = {
      service_group_id: item.service_group_id!,
      service_group_name: item.service_group_name!,
      service_group_item: [],
    };
  }
  groupedResult[item.service_group_id!].service_group_item.push(item);
});

// Convert groupedResult object to array
const finalResult: any[] = Object.values(groupedResult);

    const convertServiceSelected1: any[] = [];
    let newGroup = {};
    dataListServiceRetail?.map((item:any) => {
      const checkGroupIsExit = convertServiceSelected1.find(
        (i) => i.service_group_id === item.service_group_id
      );
    
      newGroup = {
        service_group_id: item.service_group_id,
        service_group_name: item.service_group_name,
        service_group_item: [item],
      };

      if (checkGroupIsExit) {
        checkGroupIsExit.service_group_item.push(item);
      } else {
        convertServiceSelected1.push(newGroup);
      }
    });
    // dataListServiceInvoice?.map((item: any) => {
    //   if (item.service_name !== false) {
    //      const checkGroupIsExit = convertServiceSelected1.find(
    //     (i) => i.service_group_id === item.service_group_id
    //   );
    
    //   newGroup = {
    //     service_group_id: item.service_group_id,
    //     service_group_name: item.service_group_name,
    //     service_group_item: [item],
    //   };

    //   if (checkGroupIsExit) {
    //     checkGroupIsExit.service_group_item.push(item);
    //   } else {
    //     convertServiceSelected1.push(newGroup);
    //   }
    //   } 
     
    // })
    return (
        <CModal
          isOpen={listService}
          widths={1640}
          title="Danh sách dịch vụ"
        onCancel={handleCancel}
          onOk={() => {
          
          if (dataInfoRetail && dataInfoRetail.customer_ref_code) {
            Cookies.set('id_customer', dataInfoRetail.customer_ref_code);
            dispatch(getInfosCustomerById({ customer_id: dataInfoRetail.customer_ref_code }));
            const newTab = window.open(`/customer-info/id/${dataInfoRetail.customer_ref_code}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else if (dataInfoRetail) {
            toast.error(`Không tìm thấy khách hàng: ${dataInfoRetail.customer_fullname}`);
          } else {
            toast.error('Thông tin khách hàng không tồn tại.');
          }
          }}
          textCancel="Hủy"
          textOK="Xem thông tin KH"
          zIndex={200}
          
        >
          <div className='p-affiliate_body_content_child'>
            {/* Uncomment and update the following code if you want to include a nested table */}
            <PublicTableTotal
              isSimpleHeader
              column={columnTableDetailService2}
              listData={finalResult}
              size="small"
              rowkey="service_group_id"
              isbordered
              isPagination={false}
              isHideRowSelect
              isExpandable
            showExpandColumn
            
            defaultExpandAllRow={false}
            scroll={{ x: 'max-content' }}
              expandedRowKeys= {expandedRowKeys}
            onExpand={handleExpand}
            
              //expandedRowKeys={convertServiceSelected?.map((i) => i?.service_group_id) ?? []}
              // expandedRender là các service_name của các service_group_name được phân định qua 2 dòng code trên
              expandedRender={(data) => {
              return (
              // <div  className="m-form_add_customer-booking_box_table_children">
                <PublicTable
                  isSimpleHeader
                  //className="table_children"
                  column={columnTableDetailService}
                   rowkey="service_ref"
                  listData={data.service_group_item ?? []}
                  size="small"
                  scroll={{ x: 'max-content' }}
                  isPagination={false}
                  isHideRowSelect
                  isHideHeader 
          
                />
              // </div>
            )
          }}
            /> 
          </div>
        </CModal>
      )
  }, [dataListServiceRetail, expandedRowKeys, listService])
  const checkYouHavePermissionApproveCommissions = listRoles?.some((role: any) => ['approveCommission'].some((i => i === role?.role_name)));

  return (
    <div className='p-affiliate'>
      <PublicLayout>
        <div className='p-affiliate_header'>
          <PublicHeader
            titlePage={'Ghi nhận đặt lịch'}
            handleGetTypeSearch={() => { }}
            handleFilter={() => { }}
            handleCleanFilter={() => { }}
            isDial={false}
            isHideFilter
            isHideService
            isHideCleanFilter
            isHideEmergency
            tabLeft={
              <>
                <div className="p-affiliate_header_item">
                  <CDatePickers
                    handleOnChange={(date: any) => {
                      setStates({ ...states, date: date?.$d })
                    }}
                    variant="simple"
                    value={states.date}
                    fomat="YYYY/MM"
                    isShowTime={false}
                    placeholder="Chọn tháng cần xem" picker="month"
                  />
                  <Button
                    onClick={handleGetAppointment}>
                    <Typography content='Lọc' />
                  </Button>
                </div>
                <div className="p-affiliate_header_item">
                  <Input
                    iconName="close"
                    variant="simple"
                    placeholder='Nhập tên khách hàng để tìm kiếm'
                    value={states.valueSearch}
                    handleClickIcon={() => {
                      setStates({
                        ...states,
                        list: storeAppointmentEmployee.data,
                        valueSearch: '',
                      })
                    }}
                    handleEnter={handleSearchCustomer}
                    onChange={(e: any) => setStates({ ...states, valueSearch: e.target.value })}
                  />
                  <Button
                    onClick={handleSearchCustomer}>
                    <Typography content='Tìm kiếm' />
                  </Button>
                </div>
              </>
            }
            listBtn={
            
              <>
               
                {
                  checkYouHavePermissionApproveCommissions ?   <div style={{display:"flex"}}>
                     <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F1: <strong style={{ color: '#f00' }}>
                      {
                        states.list
    ? listChooseScheduler.length === 0 && customerFullName.length === 0 && customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F1"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F1" &&
            (listChooseScheduler.length === 0 || listChooseScheduler.includes(i.employee_name)) &&
            (customerFullName.length === 0 || customerFullName.includes(i.status)) &&
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }
                      
                    </strong></span>
                  </div>
                </div>
                 <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F2: <strong style={{ color: '#f00' }}>    {
                        states.list
    ? listChooseScheduler.length === 0 && customerFullName.length === 0 && customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F2"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F2" &&
            (listChooseScheduler.length === 0 || listChooseScheduler.includes(i.employee_name)) &&
            (customerFullName.length === 0 || customerFullName.includes(i.status)) &&
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }</strong></span>
                  </div>
                </div>
                 <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F3: <strong style={{ color: '#f00' }}>  {
                        states.list
    ? listChooseScheduler.length === 0 && customerFullName.length === 0 && customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F3"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F3" &&
            (listChooseScheduler.length === 0 || listChooseScheduler.includes(i.employee_name)) &&
            (customerFullName.length === 0 || customerFullName.includes(i.status)) &&
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }</strong></span>
                  </div>
                </div>
                  </div> :   <div style={{display:"flex"}}>
                     <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F1: <strong style={{ color: '#f00' }}>
                      {
                        states.list
    ? customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F1"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F1" &&
           
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }
                      
                    </strong></span>
                  </div>
                </div>
                 <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F2: <strong style={{ color: '#f00' }}>    {
                        states.list
    ? customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F2"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F2" &&
           
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }</strong></span>
                  </div>
                </div>
                 <div className={mapModifiers('p-after_examination_total_header')} style={{marginRight:"5px"}}>
                  <div className='p-after_examination_total_item'>
                    <span>F3: <strong style={{ color: '#f00' }}>  {
                        states.list
    ? customerClass.length === 0
      ? `${states.list?.filter(
          (i) => i.f_type === "F3"
        )?.reduce((init, item) => init + 1, 0)}`
      : `${states.list?.filter(
          (i) =>
            i.f_type === "F3" &&
           
            (customerClass.length === 0 || customerClass.includes(i.f_type))
        )?.reduce((init, item) => init + 1, 0)}`
    : "0"
                }</strong></span>
                  </div>
                </div>
                  </div>
               }
                {
                    listIdApprove?.length >= 1 && <Button modifiers={['foreign']} onClick={() => handleApproveCommissionForCustomerCare()}>
                  <Typography content='Duyệt nhiều người' modifiers={['400']} />
                </Button>
                }
              </> 
            }
          />
          <div className='p-affiliate_body'>
            {memoryStatistic}
            <div className='p-affiliate_body_content'>
              {memoryTableAffiliate}
            </div>
          </div>
        </div>
      </PublicLayout>
      <CDrawer
        isOpen={isTransferBooking}
        positon='left'
        widths={320}
        height={300}
        titleHeader="Chuyển người hưởng hoa hồng"
        isHaveHeader
        className='form_transfer'
        handleOnClose={() => setIsTransferBooking(false)}
      >
        <div>
          <p style={{ marginTop: 8 }}><strong style={{ color: 'red' }}>Lưu ý:</strong> Khi bạn thực hiện chuyển hoa hồng thì sẽ không thể hoàn tác được.</p>
          <Typography content='Vui lòng chọn thành viên cần chuyển.' modifiers={['600', 'main', 'capitalize', '15x22']} />
        </div>
        <div className='p-affiliate_radio'>
          <GroupRadio
            options={listEmployeeTeams}
            value={formTransfer.employee}
            handleOnchangeRadio={(item) => {
              setFormTransfer({
                ...formTransfer,
                employee: item,
              })
            }}
          />
          <TextArea id={''} readOnly={false} label='Ghi chú' isResize value={formTransfer.note} handleOnchange={(event) => setFormTransfer({
            ...formTransfer,
            note: event.target?.value,
          })} />
        </div >
        <div className='p-affiliate_button'>
          <Button modifiers={['red']} onClick={() => setIsTransferBooking(false)} >
            <Typography content='Hủy' />
          </Button>
          <Button onClick={handleTransferCommission}>
            <Typography content='Lưu' />
          </Button>
        </div >
      </CDrawer>
       
         {listService &&   <>
      {memoriesTableSelected}
    </>}
   
      <CModal
        isOpen={isAddNote}
        widths={540}
        title="Cập nhật ghi chú về khách hàng"
        onCancel={() => {
          setIsAddNote(false);
        }}
        onOk={() => {
          if (contentNote.trim()) {
            handleAddNoteCustomer();
          } else {
            toast.error("Vui lòng nhập nội dung");
          }
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <TextArea
          id="note_for_before_exams"
          readOnly={false}
          value={undefined}
          isResize
          defaultValue={undefined}
          handleOnchange={(e) => {
            setContentNote(e.target.value);
          }}
        />
      </CModal>
    </div>
  );
}

export default Affiliate;
