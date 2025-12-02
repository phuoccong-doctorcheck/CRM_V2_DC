/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import {
  OptionTypeCustomer,
  exampleDataItemAppointmentView,
  optionCancelBooking,
  optionDate,
  optionNoteAppointmentView,
} from "assets/data";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CEmpty from "components/atoms/CEmpty";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown4 from "components/atoms/Dropdown4";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Input2 from "components/atoms/Input2";
import Loading from "components/atoms/Loading";
import RangeDate from "components/atoms/RangeDate";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import PublicTableCR from "components/molecules/PublicTableCR";
import CCollapse from "components/organisms/CCollapse";
import CModal from "components/organisms/CModal";
import InteractionHistoryCV from "components/organisms/InteractionHistoryCV";
import InteractionHistoryRC from "components/organisms/InteractionHistoryRC";
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import { useSip } from "components/templates/SipProvider";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { postNoteLogC } from "services/api/afterexams";
import {
  postChangeMasterCare,
  postPrintAppointmentServicepoint,
} from "services/api/appointmentView";
import { AppointmentViewItem } from "services/api/appointmentView/types";
import { getNoteLog, postNoteByCID, postNoteByID } from "services/api/beforeExams";
import { postCallOutCustomer } from "services/api/customerInfo";
import { updateTypeStatisticAPI } from "services/api/customer_staticstic";
import { CustomerStatisticItem } from "services/api/customer_staticstic/types";
import { getLoadCustomerStatisticStateMaster } from "store/CustomerStaticstic";
import {
  getListAppointmentMaster,
  getStatisticAppointment,
} from "store/appointment_view";
import { getInfosCustomerById, getListNotesCR, getListNotesLog } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, { downloadBlobPDF, previewBlobPDFOpenLink } from "utils/functions";
import { stateAppointView } from "utils/staticState";

import iconAddNote from "assets/iconButton/icons-write-2.png";

const extractBracketValue = (input: string): string | null => {
  const match = input.match(/\[(.*?)\]/);
  return match ? match[1] : null;
};
const extractName = (input: string): string => {
  return input.replace(/\[.*?\]\s*/, "").trim();
};
const toTitleCase = (input: string): string => {
  return input
    .toLowerCase()
    .split(" ")
    .filter(word => word.trim() !== "")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
const groupFTpye = [
  {id:1, value: 'BSCD', label: 'BSCD - Khách hàng BS chỉ định' },
                        { id:2, value: 'F1', label: 'F1 - Khách hàng lần đầu đến' },
                        {id:3,  value: 'TK', label: 'TK - Tái khám' },
                        { id:4, value: 'F2', label: 'F2 - Thực hiện thêm dịch vụ' },
                        { id:5, value: 'F3', label: 'F3 - Tầm soát định kỳ' },
  { id: 6, value: 'F3TK', label: 'F3TK - Tầm soát do có bệnh' }
                        
]
const vStatus = [
  {id:1, value: 'present', label: 'Đã đến' },
                        { id:2, value: 'absent', label: 'Chưa đến' },
                    
]
const CustomerOnDayView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { makeCall } = useSip();

  const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
  const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
  const storeisLoadingCustomerStatisticMaster = useAppSelector((state) => state.LoadCustomerStatistic.isLoadCustomerStatistic);
  const storeLoadCustomerStatisticMaster = useAppSelector((state) => state.LoadCustomerStatistic.loadCustomerStatistic);

  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageMTypes = localStorage.getItem("m_types");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
    DropdownData[]
    >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateMTypes, setstateMTypes] = useState<
    DropdownData[]
  >(storageMTypes ? JSON.parse(storageMTypes) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
    DropdownData[]
  >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(
    storageLaunchSources ? JSON.parse(storageLaunchSources) : ""
  );

  const [appointmentStatistic, setAppointmentStatistic] = useState(storeStatistic.data);
  const [listAppointmentMaster, setListAppointmentMaster] = useState(storeLoadCustomerStatisticMaster);
  const [dataFinish, setDataFinish] = useState<CustomerStatisticItem[]>(storeLoadCustomerStatisticMaster?.data?.data || [])

  const [isOpenDetailService, setIsOpenDetailService] = useState(false);
  const [listDetailService, setListDetailService] = useState();
  const [payment, setPayment] = useState(0);
  const nameCS = Cookies.get("signature_name");
  const [contentNote, setContentNote] = useState("");
  const [csId, setCsId] = useState("");
  const [isAddNote, setIsAddNote] = useState(false);
  const employeeId = localStorage.getItem("employee_id");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 200 });
  const tableRefAppointment = useRef<HTMLDivElement>(null);
  
  const [infoCustomer, setInfoCustomer] = useState({
    name: "",
    date: "",
    masterId: '',
  });

  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
const [dataFilter, setDataFilter] = useState({
  fromDate: moment().startOf("day").toDate(),   // Từ ngày
  toDate: moment().endOf("day").toDate(),       // Đến ngày

  launchSourceGroup: undefined as unknown as DropdownData, // Brand
  launchSource: undefined as unknown as DropdownData,      // Nguồn

  fType:  undefined as unknown as DropdownData,              // F1, F2, F3, TK, F3TK, BSCD
  mServiceType: undefined as unknown as DropdownData,       // Nhóm dịch vụ
  mExammingType:  undefined as unknown as DropdownData,      // Nhóm khám tổng quát
  mEndoscopicType:  undefined as unknown as DropdownData,    // Lý do nội soi
  mReexammingType: undefined as unknown as DropdownData,    // Lý do tái khám
  visit_status:  undefined as unknown as DropdownData, 
  keyword: "",            // Tìm kiếm KH
});




  const propsData = {
  fromdate: moment(dataFilter.fromDate)
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),
  todate: moment(dataFilter.toDate)
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),

  launch_source_group_id: dataFilter.launchSourceGroup?.value || 0,
  launch_source_id: dataFilter.launchSource?.value || 0,

  ftype: dataFilter.fType?.value || "",
  m_service_type: dataFilter.mServiceType?.value || "",
  m_examming_type: dataFilter.mExammingType?.value || "",
  m_endoscopic_type: dataFilter.mEndoscopicType?.value || "",
  m_reexamming_type: dataFilter.mReexammingType?.value || "",

  keyword: (dataFilter.keyword || "").trim(),
    visit_status: dataFilter.visit_status?.value || "",
  page: pagination?.page || 1,
  limit: pagination?.pageSize || 200,
};

   const { mutate: AddNoteC } = useMutation(
      "post-footer-form",
      (data: any) => postNoteLogC(data),
      {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message);
  
            dispatch(
                                  getListNotesLog({
                                    id: dataAddNote.customer_id,
                                    node_type: "all"
                                  })
            );
            setDataAddNote({
              ...dataAddNote,
              cs_node_content:""
            })
            
            setListNodeLoading(false);
          } else {
            toast.error(data?.message);
          }
        },
        onError: (error) => {
          console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
        },
      }
    );
  const [filterColumn, setFilterColumn] = useState({
    company: [],
    launch_source: [],
    launch_source_type: [],
    partner: [],
    package: [],
    typeCustomer: [],
    next_appointment_id:[],
  });

  const [dataStatistic, setDataStatistic] = useState({
    pagination: undefined as any,
    filters: undefined as any,
    sorter: undefined as any,
    extra: undefined as any,
  });

   const [dataAddNote, setDataAddNote] = useState({
      openAddNote: false,
      id: 0,
      cs_notes: "",
      cs_node_type: "cs",
      customer_id: "",
      cs_node_content: "",
      c_schedule_id: 0,
   });
  const [FTpeS, setFTpyeS] = useState("");
  const [stateName, setStateName] = useState("");
  const [GS,setGS] = useState("");
  const [stateEditField, setStateEditField] = useState({
    isModalOpen: false,
    customerType: undefined as unknown as DropdownData,
    groupService: undefined as unknown as DropdownData,
    endoscopy: undefined as unknown as DropdownData,
    reExamination: undefined as unknown as DropdownData,
    examination: undefined as unknown as DropdownData,
    masterId:"",
  });
  const customerTypeValue = stateEditField.customerType?.value;
const groupServiceValue = stateEditField.groupService?.value;

// 1) Nhóm KH là TK hoặc F3TK → Lý do tái khám enable
const isReExamEnabled =
  customerTypeValue === "TK" || customerTypeValue === "F3TK";

// 2) Nhóm dịch vụ là KTQ → Nhóm khám tổng quát enable
const isExaminationEnabled = groupServiceValue === "KTQ";

// 3) Nhóm KH là BSCD → không cho chọn (disable dropdown Nhóm khách hàng)
const isCustomerTypeLocked = customerTypeValue === "BSCD";
   
    const listNotesCustomer = useAppSelector(
      (state) => state.infosCustomer.noteLog
    );
     const LoainglistNotesCustomer = useAppSelector(
      (state) => state.infosCustomer.loadingNoteLog
  );
    const [listNodeLoading, setListNodeLoading] = useState(false);
   const [listNode, setListNode] = useState(listNotesCustomer);
    useEffect(() => {
      setListNode(listNotesCustomer);
    }, [listNotesCustomer]);
    console.log(listNode)
   const [errorNote, setErrorNote] = useState(false);
    const handleValidateForm = () => {
    if (!dataAddNote.cs_node_content.trim()) {
      setErrorNote(true);
      return false;
    }

    return true;
  };
    const [stateCscheduleId, setStateCscheduleId] = useState("");
    const { mutate: updateType } = useMutation(
      "post-footer-form",
      (data: any) => updateTypeStatisticAPI(data),
      {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message);
            setStateEditField({
              ...stateEditField,
              isModalOpen: false,
              customerType: undefined as unknown as DropdownData,
              groupService: undefined as unknown as DropdownData,
              endoscopy: undefined as unknown as DropdownData,
              reExamination: undefined as unknown as DropdownData,
              examination: undefined as unknown as DropdownData,
              masterId: "",
            });
             setGS("")
                  setFTpyeS("")
              dispatch(getLoadCustomerStatisticStateMaster(propsData as any));
            setLoadingUpdate(false);
          
          } else {
             setLoadingUpdate(false);
          
            toast.error(data?.message);
          }
        },
        onError: (error) => {
          console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
        },
      }
    );
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
    const [loadingUpdate,setLoadingUpdate] = useState(false);
  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getLoadCustomerStatisticStateMaster(propsData as any));
 
    document.title = "Thống kê khách hàng | CRM";
  }, []);
  
  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case "affiliate_name":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item) => item?.affiliate_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_name":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item) => item?.launch_source_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_type_name":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item: any) => item?.launch_source_type_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_group_name":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item: any) => item?.launch_source_group_name)
              .filter(Boolean)
          )
        );
        break;
      case "package_name":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item: any) => item?.package_name)
              .filter(Boolean)
          )
        );
        break;
      case "f_type":
        uniqueValues = Array.from(
          new Set(
            (storeLoadCustomerStatisticMaster?.data?.data || [])
              ?.map((item: any) => stateAppointView.find((i) => i.value === item?.f_type)?.label)
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
    setListAppointmentMaster(storeLoadCustomerStatisticMaster);
    setFilterColumn({
      ...filterColumn,
      company: handleGetOptionFilterColumn("launch_source_group_name") as any,
      launch_source: handleGetOptionFilterColumn("launch_source_name") as any,
      launch_source_type: handleGetOptionFilterColumn(
        "launch_source_type_name"
      ) as any,
      partner: handleGetOptionFilterColumn("affiliate_name") as any,
      package: handleGetOptionFilterColumn("package_name") as any,
      typeCustomer: handleGetOptionFilterColumn("f_type") as any,
    });
    setDataFinish(storeLoadCustomerStatisticMaster?.data?.data);
  }, [storeLoadCustomerStatisticMaster]);

  useEffect(() => {
    setAppointmentStatistic(storeStatistic.data);
  }, [storeStatistic]);

  const handleConvertInfoTolistService = (data: any) => {
    const groupedData: any[] = [];
    setPayment(_.sum(data.map((i: any) => i?.service_prices)));

    data?.forEach((item: any, index: any) => {
      const groupOrderNumber = item.service_group_order_number;
      const existingGroup = groupedData.find(
        (group) => group.service_group_order_number === groupOrderNumber
      );

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
  };
  const { mutate: postChangeStatusCustomer } = useMutation(
    "post-footer-form",
    (master_id: string) => postChangeMasterCare(master_id),
    {
      onSuccess: (data) => {
        dispatch(
          getListAppointmentMaster({
            ...propsData,
          } as any)
        );
        // dispatch(getStatisticAppointment(initial as any));
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: postCallOut } = useMutation(
    "post-footer-form",
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
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsAddNote(false);
        setContentNote("");
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

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

  const handleCallOutCustomer = (data: any) => {
    postCallOut({
      message: `${nameCS || Cookies.get("signature_name")
        } gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };
  const handleAddNoteCustomer = () => {
    const body = {
      customer_id: csId,
      cs_node_type: "cs",
      cs_node_content: canceledReason.reason,
    };
    postNoteCustomerById(body);
  };

  const handlePrintAllServices = (masterID: string) => {
    printAppointmentServicepoint(masterID);
  };

 const handleChangePagination = (pages: number, size: number) => {
   console.log({ page: pages, pageSize: size })
     dispatch(
                                           getLoadCustomerStatisticStateMaster(
                                             {
                                              fromdate: moment(dataFilter.fromDate)
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),
  todate: moment(dataFilter.toDate)
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),

  launch_source_group_id: dataFilter.launchSourceGroup?.value || 0,
  launch_source_id: dataFilter.launchSource?.value || 0,

  ftype: dataFilter.fType?.value || "",
  m_service_type: dataFilter.mServiceType?.value || "",
  m_examming_type: dataFilter.mExammingType?.value || "",
  m_endoscopic_type: dataFilter.mEndoscopicType?.value || "",
  m_reexamming_type: dataFilter.mReexammingType?.value || "",

  keyword: (dataFilter.keyword || "").trim(),
    visit_status: dataFilter.visit_status?.value || "",
                                               limit: size,
                                               page:pages
                   } as any
                  ));
    setPagination({ page: pages, pageSize: size });
    // dispatch(getListToStoreAfterExams({
    //   ...propsData,
     
    //     limits: 1000,
    // } as unknown as RequestListAfterExams));
  };
  const descriptionGrid = [
    { id: 0, color: '#fbf7aadb', title: 'Chưa đến', type: 'new' },
    { id: 1, color: '#c8ebfa', title: 'Đang phục vụ', type: 'inprogress' },
    { id: 2, color: '#98e0ad', title: 'Đã xong', type: 'done' },
  ];
  
  const ColumnTable = [
    // {
    //   title: (<Typography content="STT" modifiers={["12x20", "500", "center"]} />),
    //   align: "center",
    //   dataIndex: "index",
    //   width: 30,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any, index: any) => (
    //     <div className="ant-table-column_item">
    //       <Typography content={`${index + 1}`} modifiers={["12x20", "500", "center"]} />
    //     </div>
    //   ),
    // },
    {
      title: (<Typography content="Ngày" modifiers={["12x20", "500", "center"]} />),
      align: "center",
      dataIndex: "master_date",
     
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
        style={{padding:"4px 0px"}}
        >
          <Typography content={record ? moment(record).format("DD-MM-YYYY") : ""} modifiers={["12x20", "jetSub", "500", "center"]} />
        </div>
      ),
    },
    
      {
      title: (<Typography content="Đã đến chưa?" modifiers={["12x20", "500", "center"]} />),
      align: "center",
      dataIndex: "is_checkedin",
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => (a?.status_display || "").localeCompare(b?.status_display || ""), width: 140,
      ellipsis: true,
      // fixed: 'right',
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
          <Typography content={record === true ? "Đã đến" : "Chưa đến"} modifiers={["12x20", "400", "center", record === true ? 'green' : 'cg-red', '500']} />
        </div>
      ),
    },
     
    {
      title: (<Typography content="Trạng thái" modifiers={["12x18", "500", "center"]} styles={{fontSize:"10px"}} />),
      align: "center",
      dataIndex: "status_display",
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => (a?.status_display || "").localeCompare(b?.status_display || ""), width: 140,
      ellipsis: true,
        width: 40, 
      // fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          <Typography content={record} modifiers={["12x20", "400", "center", data?.status === 'done' ? 'green'  : data?.status === 'inprogress' ? 'blueNavy' : 'cg-red', '500']} styles={{
            color:`${ data?.status === 'new' && "#d96d02"}`
          }}/>
        </div>
      ),
    },
    {
      title: (<Typography content="Họ và tên" modifiers={["12x20", "500", "center"]} styles={{textAlign:"left", marginLeft:"8px" ,fontSize:"12px"}}/>),
      align: "center",
      // sorter: (a: any, b: any) => (a?.customer_fullname || "").localeCompare(b?.customer_fullname || ""),
      // showSorterTooltip: false,
      dataIndex: "customer_fullname",
      width: 165,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => {
        const { year_of_birth, gender_name } = data;
        return (
          <div className="" onClick={() => {
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
            // style={{marginLeft:"12px"}}
            
          >
            <Typography
content={
  record 
}
              modifiers={["12x20", "jetSub", "500", "justify"]}
              
              styles={{textTransform:"capitalize"}}
            />
           
          </div>
        );
      },
    },
    
   

  
  
  {
      title: (<Typography content="Nhóm KH" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      width: 60,
      dataIndex: "f_type",
      // filters: filterColumn.typeCustomer,
      // onFilter: (value: any, record: any) => { return stateAppointView.find((i) => i.value === record.f_type)?.label?.includes(value); },
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
          <Typography content={record === "F0" ? "-" : record} modifiers={["12x20", "500", "center", record === "Khách hàng mới" ? "jetSub" : 'jetSub',]} />
        </div>
      ),
    },
  
      {
      title: (<Typography content="Nhóm dịch vụ" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "m_servicetype_name",
      showSorterTooltip: false,
      width: 100,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          <Typography content={record ? record : '-'} modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
     {
      title: (<Typography content="Nhóm khám tổng quát" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "m_exammingtype_name",
      showSorterTooltip: false,
      width: 135,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
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
          <Typography content={record ? record : '-'} modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
     {
      title: (<Typography content="Lý do nội soi" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "m_endoscopictype_name",
      showSorterTooltip: false,
      width: 80,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          <Typography content={record ? record : '-'} modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
     {
      title: (<Typography content="Lý do tái khám" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "m_reexammingtype_name",
      showSorterTooltip: false,
      width: 170,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          <Typography content={record ? record : '-'} modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
     {
      title: (<Typography content="Doanh thu thuốc" modifiers={["12x18", "500", "center"]} styles={{textAlign:"right", marginRight:"5px"}}/>),
      align: "center",
      dataIndex: "total_drugs",
      showSorterTooltip: false,
      width: 110,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          style={{justifyContent:"end",display:"flex", alignItems:"center"}}
        >
          <Typography content={record ? `${record.toLocaleString('vi-VN')}` : '-'}  modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
     {
      title: (<Typography content="Doanh thu dịch vụ" modifiers={["12x18", "500", "center"]} styles={{textAlign:"right", marginRight:"5px"}}/>),
      align: "center",
      dataIndex: "total_services",
      showSorterTooltip: false,
       width: 120,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
        style={{justifyContent:"end",display:"flex", alignItems:"center"}}
        >
          <Typography content={record ? `${record.toLocaleString('vi-VN')}` : (data?.status === 'done' && (record === null || record === 0) ) ? "(Chưa thanh toán)" :  '-'}  modifiers={["12x20", "500", "center",(data?.status === 'done' && record === null ) ? "cg-red" : "jetSub"]} />
        </div>
      ),
    },
    //  {
    //   title: (<Typography content="Doanh thu DV" modifiers={["12x18", "500", "center"]} />),
    //   align: "center",
    //   dataIndex: "launch_source_group_name",
    //   showSorterTooltip: false,
    //   width: 170,
    //   filters: filterColumn.company,
    //   onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
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
    //       <Typography content={record} modifiers={["13x18", "500", "center", "jetSub"]} />
    //     </div>
    //   ),
    // },
    //  {
    //   title: (<Typography content="Doanh thu thuốc" modifiers={["12x18", "500", "center"]} />),
    //   align: "center",
    //   dataIndex: "launch_source_group_name",
    //   showSorterTooltip: false,
    //   width: 170,
    //   filters: filterColumn.company,
    //   onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
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
    //       <Typography content={record} modifiers={["13x18", "500", "center", "jetSub"]} />
    //     </div>
    //   ),
    // },
   
      {
        title: (<Typography content="Brand" modifiers={["12x18", "500", "center"]} styles={{ textAlign: "left", marginLeft:7}}/>),
      align: "center",
      dataIndex: "launch_source_group_name",
      showSorterTooltip: false,
      width: 140,
      // filters: filterColumn.company,
      // onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          style={{
            justifyContent: "start",
            display:"flex"
        }}
        >
          <Typography content={record} modifiers={["12x20", "500", "center", "jetSub"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Nguồn" modifiers={["12x18", "500", "center"]} styles={{ textAlign: "left", marginLeft:7}}/>),
      align: "center",
      width: 110,
      dataIndex: "launch_source_name",
      showSorterTooltip: false,
      // filters: filterColumn.launch_source,
      // onFilter: (value: any, record: any) => {
      //   if (value.includes("(WoM)")) {
      //     return record.launch_source_name?.includes("(WoM)");
      //   } else {
      //     return (
      //       record.launch_source_name
      //         ?.toLocaleLowerCase()
      //         .search(value?.toLocaleLowerCase()) !== -1
      //     );
      //   }
      // },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="" onClick={() => {
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
          style={{ display: "flex", justifyContent: "start", alignItems:'start', flexDirection:"column" }}
        >
          <Typography content={record === "KH Cũ Giới Thiệu (WoM)" ? "WOM" :data?.affiliate_type && data?.affiliate_type === "BSCD" ? "" : record} modifiers={["12x20", "500", "center", data?.affiliate_type && data?.affiliate_type === "BSCD" ? "cg-red" : "jetSub"]} />
           {!_.isNull(data?.affiliate_name) && (
           <p
  style={{
    fontSize:data?.affiliate_type && data?.affiliate_type === "BSCD" ? 13: 12,
    color: data?.affiliate_type === "BSCD" ? "#f43434" : "jetSub",
  }}
>
 {data?.affiliate_name && data?.affiliate_name.trim() !== ""  ? (
  data?.launch_source_name === "KH Cũ Giới Thiệu (WoM)" ? (
    `(${toTitleCase(extractName(data?.affiliate_name))})`
  )  : data?.affiliate_type === "BSCD"   ? data?.affiliate_name:(
    `(${data?.affiliate_name})`
  )
) : (
  ""
)}

</p>

            )}
        </div>
      ),
    },
    {
      title: (<Typography content="Hẹn tái khám" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "next_reexamming_date",
      width: 70,
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => new Date(a?.register_date).valueOf() - new Date(b?.register_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
           if (record) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
               const fullName = customer_id.trim();
              const encoded = encodeURIComponent(fullName);
              window.open(`/call-re-examination?keyword=${encoded}`, "_blank");
            } 
        }}>
          <Typography content={record ? moment(record).format("DD-MM-YYYY") : "-"} modifiers={["12x20", "jetSub", "500", "center"]} styles={{
            color:"#0317fc"
          }}/>
        </div>
      ),
    },
     {
      title: (<Typography content="Hẹn NS định kỳ" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "next_endoscopic_date",
      width: 70,
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => new Date(a?.register_date).valueOf() - new Date(b?.register_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
           if (record) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
             const fullName = customer_id.trim();
              const encoded = encodeURIComponent(fullName);
              window.open(`/call-re-examination?keyword=${encoded}`, "_blank");
            } 
        }}>
          <Typography content={record ? moment(record).format("DD-MM-YYYY") : "-"} modifiers={["12x20", "jetSub", "500", "center"]} styles={{
            color:"#0317fc"
          }}/>
        </div>
      ),
    },
     {
      title: (<Typography content="Hẹn KSK định kỳ" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "next_health_date",
      width: 110,
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => new Date(a?.register_date).valueOf() - new Date(b?.register_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (record) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
               const fullName = customer_id.trim();
              const encoded = encodeURIComponent(fullName);
              window.open(`/call-re-examination?keyword=${encoded}`, "_blank");
            }
        }}>
           <Typography content={record ? moment(record).format("DD-MM-YYYY") : "-"} modifiers={["12x20", "jetSub", "500", "center"]} styles={{
            color:"#0317fc"
          }}/>
        </div>
      ),
    },
     {
      title: (<Typography content="Hẹn làm DV khác" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "next_service_date",
      width: 110,
      // showSorterTooltip: false,
      // sorter: (a: any, b: any) => new Date(a?.register_date).valueOf() - new Date(b?.register_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
            if (record) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const fullName = customer_id.trim();
              const encoded = encodeURIComponent(fullName);
              window.open(`/call-re-examination?keyword=${encoded}`, "_blank");
            }
        }}>
          <Typography content={record ? moment(record).format("DD-MM-YYYY") : "-"} modifiers={["12x20", "jetSub", "500", "center"]} styles={{
            color:"#0317fc"
          }}/>
        </div> 
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,

       fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements="top" title="Chỉnh sửa"><div className={mapModifiers("p-appointment_view_column_pdf")}
          onClick={() => {
            console.log("data master id",  stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_servicetype_name.trim().toLowerCase())?.value );
            setFTpyeS(data.f_type);
            setGS(stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_servicetype_name.trim().toLowerCase())?.value)
            setStateName(data?.customer_fullname)
            setStateEditField({
              ...stateEditField,
              isModalOpen: true,
                     customerType:data.f_type,
               
              groupService: stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_servicetype_name.trim().toLowerCase())?.value ,
              endoscopy:  stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_endoscopictype_name.trim().toLowerCase())?.value,
              reExamination:  stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_reexammingtype_name.trim().toLowerCase())?.value,
              examination: stateMTypes.find(x => x.label.trim().toLowerCase() === data.m_exammingtype_name.trim().toLowerCase())?.value,
              masterId: data.master_id,
          })
        }}
        >
        
           <svg width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#04566e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#04566e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div></CTooltip>
      ),
    },
    // {
    //   title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
    //   align: "center",
    //   dataIndex: "",
    //   className: "",
    //   width: 40,
    //   ellipsis: true,
    //   // fixed: 'right',
    //   render: (record: any, data: any) => (
    //     <CTooltip placements={"top"} title={'Thêm ghi chú'}>
    //       <div className={mapModifiers("p-appointment_view_column_pdf")}
    //         onClick={
    //           () => {
    //            setStateCscheduleId(data.customer_id)
    //          dispatch(
    //                               getListNotesLog({
    //                                 id: data.customer_id,
    //                                 node_type: "all"
    //                               })
    //           );
    //            setDataAddNote({
    //                   ...dataAddNote,
    //                   customer_id: data.customer_id,
    //                   cs_node_content:"",
    //                   openAddNote: true,
                    
    //                 });
    //         }
    //       }
    //       >
    //        <svg
    //                 width="23px"
    //                 height="23px"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //                 xmlns="http://www.w3.org/2000/svg"
    //               >
    //                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    //                 <g
    //                   id="SVGRepo_tracerCarrier"
    //                   stroke-linecap="round"
    //                   stroke-linejoin="round"
    //                 ></g>
    //                 <g id="SVGRepo_iconCarrier">
    //                   {" "}
    //                   <path
    //                     d="M20 8.25V18C20 21 18.21 22 16 22H8C5.79 22 4 21 4 18V8.25C4 5 5.79 4.25 8 4.25C8 4.87 8.24997 5.43 8.65997 5.84C9.06997 6.25 9.63 6.5 10.25 6.5H13.75C14.99 6.5 16 5.49 16 4.25C18.21 4.25 20 5 20 8.25Z"
    //                     stroke="#04566e"
    //                     stroke-width="1.5"
    //                     stroke-linecap="round"
    //                     stroke-linejoin="round"
    //                   ></path>{" "}
    //                   <path
    //                     d="M16 4.25C16 5.49 14.99 6.5 13.75 6.5H10.25C9.63 6.5 9.06997 6.25 8.65997 5.84C8.24997 5.43 8 4.87 8 4.25C8 3.01 9.01 2 10.25 2H13.75C14.37 2 14.93 2.25 15.34 2.66C15.75 3.07 16 3.63 16 4.25Z"
    //                     stroke="#04566e"
    //                     stroke-width="1.5"
    //                     stroke-linecap="round"
    //                     stroke-linejoin="round"
    //                   ></path>{" "}
    //                   <path
    //                     d="M8 13H12"
    //                     stroke="#04566e"
    //                     stroke-width="1.5"
    //                     stroke-linecap="round"
    //                     stroke-linejoin="round"
    //                   ></path>{" "}
    //                   <path
    //                     d="M8 17H16"
    //                     stroke="#04566e"
    //                     stroke-width="1.5"
    //                     stroke-linecap="round"
    //                     stroke-linejoin="round"
    //                   ></path>{" "}
    //                 </g>
    //               </svg>
    //       </div>
    //     </CTooltip>
    //   ),
    // },
 
  ];
  const ColumnTableDetailService = [
    {
      title: (
        <Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "service_name",
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "600", "justify", "main"]} />
      ),
    },
    {
      title: (
        <Typography content="DVT" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "unit_name",
      width: 60,
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: <Typography content="SL" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "quantity",
      width: 50,
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: (
        <Typography content="Đơn giá" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      width: 160,
      dataIndex: "service_prices",
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={[
            "12x18",
            "400",
            "center",
            record === "Khách hàng mới" ? "blueNavy" : "jet",
          ]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Thành tiền"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "service_prices",
      width: 130,
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
  ];
  const SevenDays = [
    {
      id: 3,
      days: moment(new Date()).subtract(4, "days").format("dd"),
      date: moment(new Date()).subtract(4, "days").format('YYYY-MM-DD'),
    },
    {
      id: 4,
      days: moment(new Date()).subtract(3, "days").format("dd"),
      date: moment(new Date()).subtract(3, "days").format('YYYY-MM-DD'),
    },
    {
      id: 5,
      days: moment(new Date()).subtract(2, "days").format("dd"),
      date: moment(new Date()).subtract(2, "days").format('YYYY-MM-DD'),
    },
    {
      id: 6,
      days: moment(new Date()).subtract(1, "days").format("dd"),
      date: moment(new Date()).subtract(1, "days").format('YYYY-MM-DD'),
    },
    {
      id: 7,
      days: moment(new Date()).format("dd"),
      date: moment(new Date()).format('YYYY-MM-DD'),
    },
    {
      id: 1,
      days: moment(new Date()).add({ days: 1 }).format("dd"),
      date: moment(new Date()).add({ days: 1 }).format('YYYY-MM-DD'),
    },
    {
      id: 2,
      days: moment(new Date()).add({ days: 2 }).format("dd"),
      date: moment(new Date()).add({ days: 2 }).format('YYYY-MM-DD'),
    },
  ];
  const renderItemCollapse = (data: any) => {
    const titleRender: any = {
      appointment_date: (<Typography content="Ngày đặt lịch:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      customer_fullname: (<Typography content="Họ Và Tên:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      register_date: (<Typography content="Ngày Đến:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      gender_name: (<Typography content="Giới tính:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      launch_source_group_name: (<Typography content="Công Ty:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      customer_phone: (<Typography content="Điện thoại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      launch_source_name: (<Typography content="Nguồn:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      affiliate_name: (<Typography content="Đối Tác:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      status_display: (<Typography content="Trạng Thái:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      f_type: (<Typography content="Phân Loại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      note: (<Typography content="Dịch vụ:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      package_name: (<Typography content="Gói khám:" modifiers={["14x20", "500", "center", "capitalize"]} />),
    };

    const keysInTitleRender = Object.keys(titleRender);

    const sortedFields = keysInTitleRender
      .filter((key) => data.hasOwnProperty(key))
      .map((key) => {
        if (["appointment_date", "register_date"].includes(key)) {
          return {
            key,
            value: data[key]
              ? moment(data[key]).format("HH:mm - DD/MM/YYYY")
              : "",
          };
        } else if (["customer_phone"].includes(key)) {
          return { key, value: data[key]?.replace("+84-", "0") };
        } else if (["affiliate_name"].includes(key)) {
          return { key, value: data[key] ? `${data[key]}` : "--" };
        } else {
          return { key, value: data[key] };
        }
      });

    return (
      <>
        {sortedFields.map(({ key, value }) => {
          return (
            <div
              className="p-appointment_view_collapse_item_content_field"
              key={key}
            >
              {titleRender[key]}
              <span>{value}</span>
            </div>
          );
        })}
      </>
    );
  };

  const collapseBeforeExams = useMemo(
    () => (
      <div className="p-appointment_view_collapse">
        {listAppointmentMaster?.data?.data?.length ? listAppointmentMaster?.data?.data?.map((itemBeforeExams: any) => (
          <div
            className={mapModifiers(
              "p-appointment_view_collapse_item",
              itemBeforeExams.is_care ? "care" : "",
              itemBeforeExams?.status
            )}
            key={itemBeforeExams.index}
          >
            <CCollapse
              title={
                <div
                  className="p-appointment_view_collapse_item_header"
                  key={itemBeforeExams.index}
                >
                  <div className="p-appointment_view_collapse_item_title">
                    {itemBeforeExams.is_care ? (
                      <div className="p-appointment_view_collapse_item_title_care">
                        <Typography
                          content={itemBeforeExams?.customer_fullname}
                          modifiers={["blueNavy"]}
                        />
                      </div>
                    ) : (
                      <Typography
                        content={itemBeforeExams?.customer_fullname}
                        modifiers={["blueNavy"]}
                      />
                    )}
                    {itemBeforeExams?.customer_phone?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.customer_phone.replace(
                            "+84-",
                            "0"
                          )}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_group_name?.trim() ? (
                      <>
                        <Typography
                          content={
                            itemBeforeExams?.launch_source_group_name
                          }
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_name?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.launch_source_name}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_type_name?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.launch_source_type_name}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                  </div>
                </div>
              }
              key_default="0"
            >
              <div className="p-appointment_view_collapse_item_content">
                {renderItemCollapse(itemBeforeExams)}
              </div>
              <div className="p-appointment_view_collapse_item_wrap">
                <div className="p-appointment_view_collapse_item_action">
                  {[
                    {
                      titleAction: "Thêm ghi chú",
                      titlePlacement: "top",
                      icon: "note_crm",
                      iconSizes: "24x24",
                      handleClick: () => { },
                    },
                    {
                      titleAction: "Tiếp nhận",
                      titlePlacement: "top",
                      icon: "accept_crm_feild",
                      iconSizes: "24x24",
                      handleClick: async () => { },
                    },
                    {
                      titleAction: "Gắn Tag",
                      titlePlacement: "bottom",
                      icon: "hook_tag",
                      iconSizes: "24x24",
                      handleClick: () => { },
                    },
                    {
                      titleAction: "Trò chuyện",
                      titlePlacement: "bottom",
                      icon: "messager_crm",
                      iconSizes: "24x24",
                      handleClick: () => {
                        toast.info("Tính năng này đang được phát triển");
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
                        <Icon
                          iconName={item.icon}
                          size={item.iconSizes}
                          isPointer
                        />
                      </div>
                    </CTooltip>
                  ))}
                </div>

                <div className="p-appointment_view_collapse_item_enter">
                  <CTooltip
                    title={"Chi tiết khách hàng"}
                    placements="top"
                    colorCustom="#3e79f7"
                  >
                    <div className="m-list_btn-open_option_item">
                      <Icon
                        iconName="exits"
                        isPointer
                        onClick={() => {
                          const {
                            customer_id,
                            customer_fullname,
                            ...prevData
                          } = itemBeforeExams;
                          if (customer_id) {
                            sessionStorage.setItem("indexMenu", "101");
                            Cookies.set("id_customer", customer_id);
                            dispatch(
                              getInfosCustomerById({
                                customer_id: customer_id,
                              })
                            );
                            const newTab = window.open(
                              `/customer-info/id/${customer_id}/history-interaction`,
                              "_blank"
                            );
                            if (newTab) {
                              newTab.focus();
                            }
                          } else {
                            toast.error(
                              `Không tìm thấy khách hàng: ${customer_fullname}`
                            );
                          }
                        }}
                      />
                    </div>
                  </CTooltip>
                </div>
              </div>
            </CCollapse>
          </div>
        ))
          : (
            storeisLoadingCustomerStatisticMaster ? <div className="p-appointment_view_collapse_loading">
              <Loading variant="fullScreen" />
            </div> : <CEmpty description="Không có dữ liệu ...!" />
          )
        }
      </div>
    ),
    [listAppointmentMaster?.data?.data, storeisLoadingCustomerStatisticMaster]);

  const TableMemory = useMemo(() => {
    return (
      <PublicTableCR
        loading={storeisLoadingCustomerStatisticMaster}
        listData={listAppointmentMaster?.data?.data}
        column={ColumnTable}
        rowkey="master_id"
     
          pageSizes={200}
      isPagination
      isHideRowSelect={true}
        scroll={{ x: 'max-content', y: '100vh - 80px' }}
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
        // totalItem={listAppointmentMaster?.data?.paging?.total_count}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
         totalItem={
          (listAppointmentMaster?.status &&
            listAppointmentMaster?.data?.paging?.total_count) ||
          0
        }
        handleOnchange={(pagination: any, filters: any, sorter: any, extra: any) => {
          setDataStatistic({
            ...dataStatistic,
            pagination: pagination,
            filters: filters,
            sorter: sorter,
            extra: extra,
          });
          if (Object.values(filters).every(value => value === null)) {
            setDataFinish(storeLoadCustomerStatisticMaster?.data?.data);
          } else {
            setDataFinish(extra.currentDataSource);
          }
        }}
        tableRef={tableRefAppointment}
      />
    );
  }, [storeisLoadingCustomerStatisticMaster, listAppointmentMaster?.data?.data]);

const statisticHeader = useMemo(() => {
  const total = listAppointmentMaster?.data?.paging?.total_count || 0;
  const currentPage = pagination.page; // Ant Design: 1-based

  // Page size dùng để hiển thị range (mỗi trang 200 item)
  const DISPLAY_PAGE_SIZE = 200;

  let from = 0;
  let to = 0;

  if (total > 0) {
    from = (currentPage - 1) * DISPLAY_PAGE_SIZE + 1;
    to = Math.min(currentPage * DISPLAY_PAGE_SIZE, total);
  }

  console.log({
    total,
    currentPage,
    DISPLAY_PAGE_SIZE,
    from,
    to,
  });

  return (
    <PublicHeaderStatistic
      handleClick={() => {}}
      title="Thống kê khách hàng"
      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {total === 0 ? "0 / 0" : `${from}–${to} / ${total}`}
      </div>
    </PublicHeaderStatistic>
  );
}, [
  pagination.page,
  listAppointmentMaster?.data?.paging?.total_count,
]);

 

  const memoryListRecentDay = useMemo(() => (
    <ul className="p-appointment_view_date_list">
      {
        SevenDays.map((item) => {
          return (
            <li
              key={item.id}
              // className={mapModifiers("p-appointment_view_date_list_item", item.date === moment(dataFilter.date).format('YYYY-MM-DD') && 'active')}
              // onClick={() => {
              //   if (!storeisLoadingCustomerStatisticMaster) {
              //     setDataFilter({
              //       ...dataFilter,
              //       date: new Date(moment(item.date).format("YYYY-MM-DDT00:00:01")),
              //     });
              //     dispatch(
              //       getListAppointmentMaster({
              //         ...propsData,
              //         date: moment(item.date).format("YYYY-MM-DDTHH:mm:ss"),
              //       } as any)
              //     );
                
              //   }
              // }}
            >
              <span>{item.days}</span>
              <p>{moment(item.date).format('DD/MM/YYYY')}</p>
            </li>
          )
        })
      }

    </ul>
  ), [dataFilter, storeisLoadingCustomerStatisticMaster])

  return (
    <div className="p-after_examination">
      <PublicLayout>

           
        <PublicHeader
          titlePage=""
          isDial={false}
          isHideService
          
            className="p-after_examination_header"
          handleFilter={() => { }}
          isHideFilter
          isClearFilter={storeisLoadingCustomerStatisticMaster}
          handleCleanFilter={() => {
            // setDataFilter({
            //   date: new Date(),
            //   launchSourceId: undefined as unknown as DropdownData,
            //   launchSourceGroup: undefined as unknown as DropdownData,
            //   keyWord: "",
            // });
            dispatch(getListAppointmentMaster({} as any));
            // dispatch(getStatisticAppointment(initial as any));
          }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data) => {
        
          }}
          isUseSearch
          isHideFilterMobile={false}
          isHideEmergency
          handleClickFilterMobile={() => { }}
          tabBottom={
            <> 
              <div className="p-appointment_view_filter_bottom" style={{alignItems:"end"}} >
                <div style={{marginTop:7}}>
                   <RangeDate
                  variant="simple"
                  value={{
                    from: dataFilter?.fromDate,
                    to: dataFilter?.toDate,
                  }}
                  defaultValue={{
                       from: dataFilter?.fromDate,
                    to: dataFilter?.toDate,
                }}
                
                  handleOnChange={(from: any, to: any) => {
                    const yesterday = moment()
                      .subtract(1, "days")
                      .format("YYYY-MM-DD");
                    const today = moment().format("YYYY-MM-DD");
                    const tomorrow = moment()
                      .add(1, "days")
                      .format("YYYY-MM-DD");
                    const fromDate = moment(from).format("YYYY-MM-DD 00:00:00");
                    const toDate = moment(to).format("YYYY-MM-DD 23:59:59");

                    // Nếu from và to không khớp hôm qua, hôm nay, mai => set về tùy chọn
                
                     setDataFilter(prev => ({
  ...prev,
  fromDate: new Date(fromDate), // hoặc moment(fromDate).toDate()
  toDate: new Date(toDate),
}));

                  

                   
                  }}
                />
                </div>
                   <div style={{ width: "200px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...stateLaunchSourceGroups,
                ]}
                variant="simple"
                placeholder="Chọn Brand"
                values={dataFilter.launchSourceGroup}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, launchSourceGroup: e });
                 
                }}
                  /></div>
                   <div style={{ width: "120px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
  ...listLaunchSources.map(item => ({
    ...item,
    label:
      item.label === "Bác Sĩ Chỉ Định"
        ? "BSCD"
        : item.label === "KH Cũ Giới Thiệu (WoM)"
        ? "WOM"
        : item.label,
  })),
                ]}
                variant="simple"
                placeholder="Chọn nguồn"
                values={dataFilter.launchSource}
                handleSelect={(e: any) => {
                  setDataFilter({
                    ...dataFilter, launchSource: e,
                     fType : e.value === 2 ?{
    "id": 1,
    "value": "BSCD",
    "label": "BSCD - Khách hàng BS chỉ định"
} :   { id: 99, label: "Tất cả", value: null as any },
                   });
                  console.log(e)
                }}
                  /></div>
                   <div style={{ width: "180px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...groupFTpye,
                ]}
                variant="simple"
                    placeholder="Nhóm khách hàng"
                  disabled={
                    ((dataFilter.launchSource?.value === 2) ) ? true : false
                  }
                values={dataFilter.fType}
                    handleSelect={(e: any) => {
                  console.log(e)
                  setDataFilter({
                    ...dataFilter, fType: e,
                    // mReexammingType: (e.value !== "TK" || e?.value !== "F3TK")  ?  { id: 99, label: "Tất cả", value: null as any }
                    
                  });
                  
                }}
                  /></div>
                   <div style={{ width: "140px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...stateMTypes.filter(item => item.m_type_group === "SERVICE"),
                ]}
                variant="simple"
                placeholder="Nhóm dịch vụ"
                values={dataFilter.mServiceType}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, mServiceType: e });
                
                }}
                  /></div>
                <div style={{ width: "140px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...stateMTypes.filter(item => item.m_type_group === "TS"),
                    ]}
                     disabled={
                    ((dataFilter.mServiceType?.value === "KTQ")  ) ? false : true
                  }
                variant="simple"
                placeholder="Nhóm khám tổng quát"
                values={(dataFilter.mServiceType?.value === "KTQ") ? dataFilter.mExammingType : undefined}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, mExammingType: e });
                  
                }}
                  /></div>
                   <div style={{ width: "150px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                   ...stateMTypes.filter(item => item.m_type_group === "NS"),
                ]}
                variant="simple"
                placeholder="Lý do nội soi"
                values={dataFilter.mEndoscopicType}
                handleSelect={(e: any) => {
                  setDataFilter({
                    ...dataFilter, mEndoscopicType: e,
                    

                  });
                 
                }}
                  /></div>
                   <div style={{ width: "220px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...stateMTypes.filter(item => item.m_type_group === "TK"),
                ]}
                    variant="simple"
                      disabled={
                    ((dataFilter.fType?.value === "F3TK" || dataFilter.fType?.value === "TK")  ) ? false : true
                  }
                placeholder="Lý do tái khám"
                values={(dataFilter.fType?.value === "F3TK" || dataFilter.fType?.value === "TK")  ? dataFilter.mReexammingType : undefined}
                handleSelect={(e: any) => {
                  setDataFilter({
                    ...dataFilter, mReexammingType: e,
                    
                  });
               
                }}
                  /></div>
                 <div style={{ width: "220px" }}>
              <Dropdown4
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...vStatus
                ]}
                    variant="simple"
                    
                placeholder="Đã đến chưa?"
                values={dataFilter.visit_status}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, visit_status: e });
               
                }}
                  /></div>
                <div style={{ minWidth: "50px",display:"flex",alignItems:"end",justifyContent:"center", }}>
                                  <div 
                                    style={{ borderRadius: 5, width: "100%" ,background:"#28a745", padding: "6px 12px", cursor: "pointer", textAlign: "center",color:"#fff" }}
                                     onClick={() => {
                                         dispatch(
                                           getLoadCustomerStatisticStateMaster(
                   propsData as any
                  ));
                                     }}
                                  >
                                    <Typography content="Xem" />
                                  </div>
                                </div>
              <div></div>
              </div>
              
            </>
           
          }
          tabBottomRight={
              <div style={{ width: "180px", marginTop:"5px" ,display:"none"}}>
                  <Input2
                id="user_name"
                variant="simple"
                onChange={(e) => {
                  setDataFilter({ ...dataFilter, keyword: e.target.value });
                }}
                value={dataFilter.keyword}
                placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm"
                handleClickIcon={() => {
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      keyWord: dataFilter.keyword || 0,
                    } as any)
                  );
                }}
                handleEnter={() => {
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      keyWord: dataFilter.keyword || 0,
                    } as any)
                  );
                }}
                iconName="search"
              />
              </div>
          }
          isHideCleanFilter
          
        />
        {statisticHeader}
        {stateBreakPoint < 980 && (
          <div className="p-appointment_view_date">
            {memoryListRecentDay}
          </div>
        )}
    <div className="p-after_examination_content" style={{height:"calc(100% - 110px)"}}>
          {stateBreakPoint < 980 ? collapseBeforeExams : TableMemory}
        </div>
      </PublicLayout>
      <CModal
        isOpen={isAddNote}
        widths={540}
        title="Cập nhật ghi chú về khách hàng"
        onCancel={() => {
          setIsAddNote(false);
        }}
        onOk={() => {
          if (canceledReason) {
            handleAddNoteCustomer();
          } else {
            toast.error("Bạn không thể ghi chú mà không có nội dung");
          }
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div className="m-customer_infos_canceled">
          <GroupRadio
            options={optionNoteAppointmentView}
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
      <div className="p-appointment_view_modal">
        <CModal
          isOpen={isOpenDetailService}
          onCancel={() => setIsOpenDetailService(false)}
          onOk={() => {
            handlePrintAllServices(infoCustomer?.masterId);
          }}
          widths={1024}
          className="detail_service"
          textCancel="Hủy"
          textOK="In phiếu chỉ định"
          title={
            <p className="p-appointment_view_detail_header">
              <span>Chi tiết dịch vụ của KH:</span>&nbsp;
              <span style={{ color: "#1976D2" }}>{`${infoCustomer.name}`}</span>
              {infoCustomer.date &&
                <>
                  , Thời gian:&nbsp;
                  <span style={{ color: "#1976D2" }}>
                    {moment(infoCustomer.date).format("HH:mm - DD/MM/YYYY")}
                  </span>
                </>
              }
            </p>
          }
        >
          <div className="p-appointment_view_detail_service">
            <div className="p-appointment_view_detail_service_heading">
              <PublicTable
                listData={exampleDataItemAppointmentView}
                isHideRowSelect
                column={ColumnTableDetailService}
                scroll={{
                  y: '100%'
                }}
                isSimpleHeader
                isNormal
                isbordered={false}
              />
            </div>
            <div className="p-appointment_view_detail_service_content">
              <PublicTable
                listData={listDetailService}
                loading={_.isEmpty(listDetailService)}
                isHideRowSelect
                isHideHeader
                defaultExpandAllRow
                rowkey="id_group"
                scroll={{ x: 'max-content' }}
                column={[
                  {
                    title: "",
                    align: "left",
                    dataIndex: "name",
                    render: (record: any, data: any) => (
                      <div className="p-booking_schedule_heading">
                        <Typography
                          content={`${record} (${data?.child?.length})`}
                          modifiers={["16x24", "600", "justify", "blueNavy"]}
                        />
                      </div>
                    ),
                  },
                ]}
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
                    handleOnDoubleClick={(item: any) => { }}
                    rowClassNames={(record, index) => ""}
                    scroll={{
                      x: 'max-content',
                      // y: '100%',
                    }}
                  />
                )}
                isExpandable
                expandedRowKeys={Array?.from({ length: 50 }, (_, index) => index)}
              />
            </div>
            {!_.isEmpty(listDetailService) && (
              <div className="p-appointment_view_detail_service_money">
                <span>Thành tiền:</span>
                <p>{payment?.toLocaleString("vi-VN")} VNĐ</p>
              </div>
            )}
          </div>
        </CModal>
          <CModal
                isOpen={stateEditField.isModalOpen}
                widths={400}
          title=<div>Chỉnh sửa: { stateName}</div>
          confirmLoading={loadingUpdate}
                onCancel={() => {
                  setStateEditField({
                    ...stateEditField,
                    isModalOpen: false,
                     customerType: undefined as unknown as DropdownData,
    groupService: undefined as unknown as DropdownData,
    endoscopy: undefined as unknown as DropdownData,
    reExamination: undefined as unknown as DropdownData,
                    examination: undefined as unknown as DropdownData,
    masterId:"",
                  });
                  setGS("")
                  setFTpyeS("")
                }}
          onOk={async () => {
            setLoadingUpdate(true);
            const body = {
              master_id: stateEditField.masterId,
              ftype: stateEditField?.customerType?.value || stateEditField?.customerType,
              m_service_type: stateEditField?.groupService?.value || stateEditField?.groupService,
              m_examming_type: stateEditField?.examination?.value || stateEditField?.examination,
              m_endoscopic_type: stateEditField?.endoscopy?.value || stateEditField?.endoscopy,
                 m_reexamming_type: stateEditField?.reExamination?.value || stateEditField?.reExamination,
            }
                  console.log("stateEditField",body ,groupFTpye,stateEditField );
                updateType(body)
                }}
                textCancel="Hủy"
                textOK="Chỉnh sửa"
             
              >
                <>
                  <div style={{ width: "100%", gap: 12 }}>
                      
                   <div style={{ width: "100%" }}>
              <Dropdown4
                 dropdownOption={[
               
                  ...groupFTpye,
                ]}
                variant="simple"
                placeholder="Nhóm khách hàng"
                  values={stateEditField.customerType}
                   disabled={
                    ((stateEditField.customerType?.value === "BSCD") || (FTpeS === "BSCD") ) ? true : false
                  }
                handleSelect={(e: any) => {
                  setStateEditField({ ...stateEditField, customerType: e });
                  setFTpyeS("")
                }}
                  /></div>
                   <div style={{ width: "100%" }}>
              <Dropdown4
                 dropdownOption={[
                
                  ...stateMTypes.filter(item => item.m_type_group === "SERVICE"),
                ]}
                variant="simple"
                placeholder="Nhóm dịch vụ"
                values={stateEditField.groupService}
                handleSelect={(e: any) => {
                  setStateEditField({ ...stateEditField, groupService: e });
                  // console.log(e?.value)
                  setGS(e?.value)
                }}
                  /></div>
                   <div style={{ width: "100%" }}>
              <Dropdown4
                 dropdownOption={[
               
                  ...stateMTypes.filter(item => item.m_type_group === "TS"),
                ]}
                variant="simple"
                placeholder="Nhóm khám tổng quát"
                  values={  ((stateEditField.groupService?.value === "KTQ" || GS === "KTQ")) ? stateEditField.examination : undefined}
                     disabled={
                    ((stateEditField.groupService?.value === "KTQ" || GS === "KTQ")) ? false : true
                  }

                handleSelect={(e: any) => {
                  setStateEditField({ ...stateEditField, examination: e });
                
                }}
                  /></div>
                   <div style={{ width: "100%" }}>
              <Dropdown4
                dropdownOption={[
                
                   ...stateMTypes.filter(item => item.m_type_group === "NS"),
                ]}
                variant="simple"
                placeholder="Lý nội soi"
                values={stateEditField.endoscopy}
                handleSelect={(e: any) => {
                  setStateEditField({ ...stateEditField, endoscopy: e });
                
                }}
                  /></div>
                   <div style={{ width: "100%" }}>
              <Dropdown4
                 dropdownOption={[
                
                  ...stateMTypes.filter(item => item.m_type_group === "TK"),
                ]}
                  variant="simple"
                  disabled={
                    ((stateEditField.customerType?.value === "TK" || stateEditField.customerType?.value === "F3TK") || (FTpeS === "TK" || FTpeS === "F3TK") ) ? false : true
                  }
                placeholder="Lý do tái khám"
                values={   ((stateEditField.customerType?.value === "TK" || stateEditField.customerType?.value === "F3TK") || (FTpeS === "TK" || FTpeS === "F3TK") )  ?  stateEditField.reExamination :undefined}
                handleSelect={(e: any) => {
                  setStateEditField({ ...stateEditField, reExamination: e });
                 
                }}
                  /></div>
                  </div>
                </>
        </CModal>
        
        <CModal
                isOpen={dataAddNote.openAddNote}
                widths={940}
                title="Ghi chú công việc"
                onCancel={() => {
                  setDataAddNote({
                    ...dataAddNote,
                    openAddNote: false,
                    cs_node_content: "",
                    customer_id: "",
                  });
                }}
                onOk={async () => {
                  setDataAddNote({
                    ...dataAddNote,
                    openAddNote: false,
                    cs_node_content: "",
                    customer_id: "",
                  });
                }}
                textCancel="Hủy"
                textOK="Đóng"
                isHideCancel
                isHideOk
              >
                <>
                  <div style={{ width: "100%", gap: 12 }}>
                    <div className="t-header_wrapper-merge_customer_wrapper">
                      {/* {formMergeCustomer} */}
                      <div className="p-customer_leads_form_sms">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "start",
                            width: "100%",
                            gap: "8px",
                          }}
                        >
                          <div style={{ flex: 9 }}>
                            <TextArea
                              label=""
                              id=""
                              readOnly={false}
                              isResize
                              placeholder="Nhập ghi chú mới"
                              value={dataAddNote.cs_node_content}
                              handleOnchange={(event) => {
                                setDataAddNote({
                                  ...dataAddNote,
                                  cs_node_content: event.target.value,
                                });
                              }}
                            />
                          </div>
        
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#0489dc",
                              cursor: "pointer",
                              height: "45px", // để full chiều cao TextArea nếu cần
                              padding: "10px",
                              borderRadius: "6px",
                            }}
                      className={mapModifiers("p-after_examination_total_header")}
                      
                            onClick={() => {
                              if (!handleValidateForm()) return;
                              setListNodeLoading(true);
                              const body = {
                                customer_id: dataAddNote.customer_id,
                                cs_node_content: dataAddNote.cs_node_content,
                                cs_node_type: dataAddNote.cs_node_type,
                                note_attach_url: "",
                                object_id:null
                              };
                               AddNoteC(body);
                              // handleUpdateStatus({
                              //   action: "update_status",
                              //   id_pk_long: dataUpdateStatus.id_pk_long,
                              //   value_text: selectedStatus,
                              // });
                            }}
                          >
                            <img
                              src={iconAddNote}
                              alt=""
                              style={{ width: "20px", height: "23px" }}
                            />
                            <div style={{ color: "white", marginLeft: "5px" }}>
                              Thêm ghi chú
                            </div>
                          </div>
                        </div>
        
                     
        
                      </div>
                      <div
                        className="t-header_wrapper-merge_customer_button"
                        style={{
                          marginBottom: "15px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#33333",
                            textTransform: "uppercase",
                          }}
                        >
                          Lịch sử ghi chú:
                        </div>
        
                        {/* <Button modifiers={['foreign']} onClick={
                          () => { 
                            const body = {s
                              id: dataAddNote.id,
                              cs_notes: dataAddNote.cs_notes
                            }
                            AddNote(body)
                          }  
        
                        
                 }>
                   <img src={iconAddNote} alt="" style={{width:"20px",height:"23px", marginRight:"3px"}}/>     <Typography>Thêm ghi chú</Typography>
                            </Button> */}
                      </div>
                    </div>
                    <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                     
                    <>     {
                            listNode.data.length !== 0 &&                 <InteractionHistoryCV
                          options={listNode?.data as any}
                          id={dataAddNote.c_schedule_id.toString()}
                          loadingNote={listNodeLoading}
                        />
                          }</> 
        
                      
                    </div>
                  </div>
                </>
              </CModal>
      </div>
    </div>
  );
};

export default CustomerOnDayView;
