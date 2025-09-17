// /* eslint-disable no-prototype-builtins */
// /* eslint-disable no-case-declarations */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable eqeqeq */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable max-len */
// /* eslint-disable import/order */
// import {
//   OptionTypeCustomer,
//   exampleDataItemAppointmentView,
//   optionCancelBooking,
//   optionDate,
//   optionDate3,
//   optionNoteAppointmentView,
// } from "assets/data";
// import { MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
// import CDatePickers from "components/atoms/CDatePickers";
// import Button from "components/atoms/Button";
// import CEmpty from "components/atoms/CEmpty";
// import CTooltip from "components/atoms/CTooltip";
// import Dropdown, { DropdownData } from "components/atoms/Dropdown";
// import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
// import Icon from "components/atoms/Icon";
// import Input from "components/atoms/Input";
// import Loading from "components/atoms/Loading";
// import TextArea from "components/atoms/TextArea";
// import Typography from "components/atoms/Typography";
// import PublicTable from "components/molecules/PublicTable";
// import CCollapse from "components/organisms/CCollapse";
// import CModal from "components/organisms/CModal";
// import PublicHeader from "components/templates/PublicHeader";
// import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
// import PublicLayout from "components/templates/PublicLayout";
// import { useSip } from "components/templates/SipProvider";
// import Cookies from "js-cookie";
// import _, { divide } from "lodash";
// import moment from "moment";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useMutation } from "react-query";
// import { toast } from "react-toastify";
// import {
//   postChangeMasterCare,
//   postPrintAppointmentServicepoint,
// } from "services/api/appointmentView";
// import { AppointmentViewItem } from "services/api/appointmentView/types";
// import { postNoteByID } from "services/api/beforeExams";
// import { postCallOutCustomer } from "services/api/customerInfo";
// import {
//   getListAppointmentMaster,
//   getStatisticAppointment,
// } from "store/appointment_view";
// import { getInfosCustomerById } from "store/customerInfo";
// import { useAppDispatch, useAppSelector } from "store/hooks";
// import mapModifiers, { downloadBlobPDF, exportDatatoExcel, handleRenderGUID, previewBlobPDFOpenLink } from "utils/functions";
// import { stateAppointView } from "utils/staticState";
// import { Col, DatePicker, MenuProps, Radio, RadioChangeEvent, Row, Select, Table, Button as ButtonANTD } from 'antd';
// import { RangePickerProps } from "antd/es/date-picker";
// import  dayjs, { Dayjs } from "dayjs";
// import { dataS, growthPercent, months } from "./dataS";
// import PublicTableTotal from "components/molecules/PublicTableTotal";
// import PublicTableBusiness from "components/molecules/PublicTableBusiness";
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { ExpandableConfig } from "antd/es/table/interface";
// dayjs.extend(customParseFormat);
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// interface ExpandableTitleProps {
//   title: any;
//   expanded: boolean;
//   onToggle: () => void;
//   hasChildren:boolean
// }
// const ExpandableTitle: React.FC<ExpandableTitleProps> = ({ title, expanded, onToggle ,hasChildren}) => {
//   return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       {hasChildren === true ? (<div
      
//         onClick={onToggle}
//         style={{ marginRight: 8 }}
//       ><span
//             style={{ padding: "8px" }}
//             className={`custom-expand-icon icon-transition hoverButton ${expanded ? 'icon-expanded' : ''
//               }`}
//           >
//             {expanded ? <MinusOutlined /> : <PlusOutlined />}
//           </span></div>) : <div
        
       
//         onClick={onToggle}
//         style={{ marginRight: 8 }}
//       > <span
//             style={{ padding: "8px",background:"transparent", }}
//             className={`custom-expand-icon icon-transition ${expanded ? 'icon-expanded' : ''
//               }`}
//           >
           
//           </span></div>}
//       {title}
//     </div>
//   );
// };
// const BusinessPlan: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { makeCall } = useSip();

//   const ThisYear = dayjs().year();
// const LastYear = dayjs().year() - 1;

//   const defaultValues = [dayjs(`${LastYear}`, 'YYYY'), dayjs(`${ThisYear}`, 'YYYY')];
//   const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
//   const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
//   const storeisLoadingAppointmentMaster = useAppSelector((state) => state.appointmentMaster.isLoadingAppointmentMaster);
//   const storeAppointmentMaster = useAppSelector((state) => state.appointmentMaster.listAppointmentMaster);

//   const storageLaunchSources = localStorage.getItem("launchSources");
//   const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
//   const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");

//   const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
//     DropdownData[]
//   >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
//   const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
//     DropdownData[]
//   >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
//   const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(
//     storageLaunchSources ? JSON.parse(storageLaunchSources) : ""
//   );

//   const [appointmentStatistic, setAppointmentStatistic] = useState(storeStatistic.data);
//   const [listAppointmentMaster, setListAppointmentMaster] = useState(storeAppointmentMaster);
//   const [dataFinish, setDataFinish] = useState<AppointmentViewItem[]>(storeAppointmentMaster?.data?.data || [])
//   const [isOpenDetailService, setIsOpenDetailService] = useState(false);
//   const [listDetailService, setListDetailService] = useState();
//   const [payment, setPayment] = useState(0);
//   const nameCS = Cookies.get("signature_name");
//   const [contentNote, setContentNote] = useState("");
//   const [csId, setCsId] = useState("");
//   const [isAddNote, setIsAddNote] = useState(false);
//   const employeeId = localStorage.getItem("employee_id");
//   const [pagination, setPagination] = useState({ page: 1, pageSize: 500 });
//   const [selectedMonth, setSelectedMonth] = useState<string>("");
//   const [isOpenGrowth, setIsOpenGrowth] = useState(false)

//   const tableRefAppointment = useRef<HTMLDivElement>(null);
//   const [dataFilter, setDataFilter] = useState({
//     date: new Date(),
//     launchSourceId: undefined as unknown as DropdownData,
//     launchSourceGroup: undefined as unknown as DropdownData,
//     keyWord: "",
//   });
//   const [startMonth, setStartMonth] = useState<string>('01');
//   const [endMonth, setEndMonth] = useState<string>('12');
//     const [endMonth2, setEndMonth2] = useState<string>('Tháng 12');
//    const [missingData, setMissingData] = useState<
//     Array<{ month: string; growth_rate: string }>
//     >([]);
//    const [dataMonth, setDataMonth] = useState<
//     Array<{ month: string}>
//     >([]);
//   const [yearChoose, setYearChoose] = useState("2024")
//   const currentMonth = new Date().getMonth() + 1;
//   const currentYear = moment().year();
//   const [mode, setMode] = useState<'date' | 'month' | 'year'>('date');
//   const [columnsDate, setColumns] = useState<any[]>([]);
//     const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(
//     null
//   );
//   const [infoCustomer, setInfoCustomer] = useState({
//     name: "",
//     date: "",
//     masterId: '',
//   });
//   const [canceledReason, setCanceledReason] = useState({
//     type: '',
//     reason: '',
//     item: undefined as unknown as GroupRadioType,
//   });
//   const initial = {
//     fromDate: dataFilter?.date
//       ?? moment(new Date()).format("YYYY-MM-DDT00:00:00"),
//     toDate: dataFilter?.date
//       ?? moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
//   };

//   const propsData = {
//     date: moment(dataFilter?.date).format("YYYY-MM-DDTHH:mm:ss"),
//     launchSourceId: dataFilter?.launchSourceId?.value || 0,
//     launchSourceGroupID: dataFilter?.launchSourceGroup?.value || 0,
//     keyWord: dataFilter?.keyWord || "",
//     pages: pagination?.page || 1,
//     limits: pagination?.pageSize || 500,
//   };

//   const [filterColumn, setFilterColumn] = useState({
//     company: [],
//     launch_source: [],
//     launch_source_type: [],
//     partner: [],
//     package: [],
//     typeCustomer: [],
//   });

//   const [dataStatistic, setDataStatistic] = useState({
//     pagination: undefined as any,
//     filters: undefined as any,
//     sorter: undefined as any,
//     extra: undefined as any,
//   });
//   const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);

//   useEffect(() => {
//     function handleResize() {
//       setstateBreakPoint(window.innerWidth);
//     }
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     dispatch(getListAppointmentMaster(propsData as any));
//     dispatch(getStatisticAppointment(initial as any));
//     document.title = "Kế hoạch kinh doanh | CRM";
//   }, []);
  
//   // const handleGetOptionFilterColumn = (key: string) => {
//   //   let uniqueValues: any = [];
//   //   switch (key) {
//   //     case "affiliate_name":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item) => item?.affiliate_name)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     case "launch_source_name":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item) => item?.launch_source_name)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     case "launch_source_type_name":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item: any) => item?.launch_source_type_name)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     case "launch_source_group_name":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item: any) => item?.launch_source_group_name)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     case "package_name":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item: any) => item?.package_name)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     case "f_type":
//   //       uniqueValues = Array.from(
//   //         new Set(
//   //           (storeAppointmentMaster?.data?.data || [])
//   //             ?.map((item: any) => stateAppointView.find((i) => i.value === item?.f_type)?.label)
//   //             .filter(Boolean)
//   //         )
//   //       );
//   //       break;
//   //     default:
//   //       break;
//   //   }

//   //   return uniqueValues.map((value: any) => ({ text: value, value: value }));
//   // };
  
//   // useEffect(() => {
//   //   setListAppointmentMaster(storeAppointmentMaster);
//   //   setFilterColumn({
//   //     ...filterColumn,
//   //     company: handleGetOptionFilterColumn("launch_source_group_name") as any,
//   //     launch_source: handleGetOptionFilterColumn("launch_source_name") as any,
//   //     launch_source_type: handleGetOptionFilterColumn(
//   //       "launch_source_type_name"
//   //     ) as any,
//   //     partner: handleGetOptionFilterColumn("affiliate_name") as any,
//   //     package: handleGetOptionFilterColumn("package_name") as any,
//   //     typeCustomer: handleGetOptionFilterColumn("f_type") as any,
//   //   });
//   //   setDataFinish(storeAppointmentMaster?.data?.data);
//   // }, [storeAppointmentMaster]);

//   // useEffect(() => {
//   //   setAppointmentStatistic(storeStatistic.data);
//   // }, [storeStatistic]);

//   // const handleConvertInfoTolistService = (data: any) => {
//   //   const groupedData: any[] = [];
//   //   setPayment(_.sum(data.map((i: any) => i?.service_prices)));

//   //   data?.forEach((item: any, index: any) => {
//   //     const groupOrderNumber = item.service_group_order_number;
//   //     const existingGroup = groupedData.find(
//   //       (group) => group.service_group_order_number === groupOrderNumber
//   //     );

//   //     if (existingGroup) {
//   //       existingGroup.child.push(item);
//   //     } else {
//   //       groupedData.push({
//   //         id_group: index,
//   //         name: item.service_group_name,
//   //         service_group_order_number: groupOrderNumber,
//   //         child: [item],
//   //       });
//   //     }
//   //   });
//   //   return groupedData;
//   // };
//   const { mutate: postChangeStatusCustomer } = useMutation(
//     "post-footer-form",
//     (master_id: string) => postChangeMasterCare(master_id),
//     {
//       onSuccess: (data) => {
//         dispatch(
//           getListAppointmentMaster({
//             ...propsData,
//           } as any)
//         );
//         dispatch(getStatisticAppointment(initial as any));
//       },
//       onError: (error) => {
//         console.log("🚀: error --> getCustomerByCustomerId:", error);
//       },
//     }
//   );

//   const { mutate: postNoteCustomerById } = useMutation(
//     "post-footer-form",
//     (data: any) => postNoteByID(data),
//     {
//       onSuccess: (data) => {
//         toast.success(data?.message);
//         setIsAddNote(false);
//         setContentNote("");
//       },
//       onError: (error) => {
//         console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

//   const { mutate: printAppointmentServicepoint } = useMutation(
//     "post-footer-form",
//     (data: string) => postPrintAppointmentServicepoint(data),
//     {
//       onSuccess: (data) => {
//         if (data.status) {
//           previewBlobPDFOpenLink(data?.data, data?.message);
//         } else {
//           toast.info(data?.message);
//         }
//       },
//       onError: (error) => {
//         console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

//   // const handleCallOutCustomer = (data: any) => {
//   //   postCallOut({
//   //     message: `${nameCS || Cookies.get("signature_name")
//   //       } gọi ra cho khách hàng`,
//   //     is_portal_redirect: false,
//   //     customer_phone: data,
//   //   });
//   // };
//   // const handleAddNoteCustomer = () => {
//   //   const body = {
//   //     customer_id: csId,
//   //     cs_node_type: "cs",
//   //     cs_node_content: canceledReason.reason,
//   //   };
//   //   postNoteCustomerById(body);
//   // };

//   // const handlePrintAllServices = (masterID: string) => {
//   //   printAppointmentServicepoint(masterID);
//   // };

//   // const handleChangePagination = (pages: number, size: number) => {
//   //   setPagination({ page: pages, pageSize: size });
//   //   dispatch(
//   //     getListAppointmentMaster({
//   //       ...propsData,
//   //       pages: pages,
//   //       limits: size || 30,
//   //     } as any)
//   //   );
//   //   dispatch(getStatisticAppointment(initial as any));
//   // };
//   const descriptionGrid = [
//     { id: 0, color: '#fbf7aadb', title: 'Chưa đến', type: 'new' },
//     { id: 1, color: '#c8ebfa', title: 'Đang phục vụ', type: 'inprogress' },
//     { id: 2, color: '#98e0ad', title: 'Đã xong', type: 'done' },
//   ];

//   // const ColumnTable = [
//   //   {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p></p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 420,
//   //     fixed:"left",
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //   {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //    {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //     {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //      {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //       {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //        {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
//   //         {
//   //      title: (
//   //     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//   //       <div className="p-appointment_view_date_list" style={{display:"block", paddingBottom:"5px"}}>
//   //         <div className="p-appointment_view_date_list_item" style={{height:"30px",width:"fit-content", paddingLeft:"5px", paddingRight:"5px",borderRadius:"5px"}}>
      
//   //           <p>Ngày 01-01-2024</p>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   ) ,
//   //     align: "center",
//   //     dataIndex: "appointment_date",
//   //     width: 160,
//   //     showSorterTooltip: false,
//   //     // sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
//   //     className: "ant-table-column_wrap",
//   //     render: (record: any, data: any) => (
//   //       <div className="ant-table-column_item" onClick={() => {
//   //         const { customer_id, customer_fullname, ...prevData } = data;
//   //         if (customer_id) {
//   //           Cookies.set("id_customer", customer_id);
//   //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
//   //           window.open(
//   //             `/customer-info/id/${customer_id}/history-interaction`,
//   //             "_blank"
//   //           );
//   //         } else {
//   //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
//   //         }
//   //       }}>
//   //         <Typography content="100.000.000" modifiers={["14x20", "jetSub", "600", "center"]} />
//   //       </div>
//   //     ),
//   //   },
             
//   // ];
//   // const ColumnTableDetailService = [
//   //   {
//   //     title: (
//   //       <Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />
//   //     ),
//   //     align: "center",
//   //     dataIndex: "service_name",
//   //     render: (record: any) => (
//   //       <Typography content={record} modifiers={["12x18", "600", "justify", "main"]} />
//   //     ),
//   //   },
//   //   {
//   //     title: (
//   //       <Typography content="DVT" modifiers={["12x18", "500", "center"]} />
//   //     ),
//   //     align: "center",
//   //     dataIndex: "unit_name",
//   //     width: 60,
//   //     render: (record: any) => (
//   //       <Typography content={record} modifiers={["12x18", "400", "center"]} />
//   //     ),
//   //   },
//   //   {
//   //     title: <Typography content="SL" modifiers={["12x18", "500", "center"]} />,
//   //     align: "center",
//   //     dataIndex: "quantity",
//   //     width: 50,
//   //     render: (record: any) => (
//   //       <Typography content={record} modifiers={["12x18", "400", "center"]} />
//   //     ),
//   //   },
//   //   {
//   //     title: (
//   //       <Typography content="Đơn giá" modifiers={["12x18", "500", "center"]} />
//   //     ),
//   //     align: "center",
//   //     width: 160,
//   //     dataIndex: "service_prices",
//   //     render: (record: any) => (
//   //       <Typography
//   //         content={record ? record?.toLocaleString("vi-VN") : "0.00"}
//   //         modifiers={[
//   //           "12x18",
//   //           "400",
//   //           "center",
//   //           record === "Khách hàng mới" ? "blueNavy" : "jet",
//   //         ]}
//   //       />
//   //     ),
//   //   },
//   //   {
//   //     title: (
//   //       <Typography
//   //         content="Thành tiền"
//   //         modifiers={["12x18", "500", "center"]}
//   //       />
//   //     ),
//   //     align: "center",
//   //     dataIndex: "service_prices",
//   //     width: 130,
//   //     render: (record: any) => (
//   //       <Typography
//   //         content={record ? record?.toLocaleString("vi-VN") : "0.00"}
//   //         modifiers={["12x18", "400", "center"]}
//   //       />
//   //     ),
//   //   },
//   // ];
//   // const SevenDays = [
//   //   {
//   //     id: 3,
//   //     days: moment(new Date()).subtract(4, "days").format("dd"),
//   //     date: moment(new Date()).subtract(4, "days").format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 4,
//   //     days: moment(new Date()).subtract(3, "days").format("dd"),
//   //     date: moment(new Date()).subtract(3, "days").format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 5,
//   //     days: moment(new Date()).subtract(2, "days").format("dd"),
//   //     date: moment(new Date()).subtract(2, "days").format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 6,
//   //     days: moment(new Date()).subtract(1, "days").format("dd"),
//   //     date: moment(new Date()).subtract(1, "days").format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 7,
//   //     days: moment(new Date()).format("dd"),
//   //     date: moment(new Date()).format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 1,
//   //     days: moment(new Date()).add({ days: 1 }).format("dd"),
//   //     date: moment(new Date()).add({ days: 1 }).format('YYYY-MM-DD'),
//   //   },
//   //   {
//   //     id: 2,
//   //     days: moment(new Date()).add({ days: 2 }).format("dd"),
//   //     date: moment(new Date()).add({ days: 2 }).format('YYYY-MM-DD'),
//   //   },
//   // ];
//   // const renderItemCollapse = (data: any) => {
//   //   const titleRender: any = {
//   //     appointment_date: (<Typography content="Ngày đặt lịch:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     customer_fullname: (<Typography content="Họ Và Tên:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     register_date: (<Typography content="Ngày Đến:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     gender_name: (<Typography content="Giới tính:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     launch_source_group_name: (<Typography content="Công Ty:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     customer_phone: (<Typography content="Điện thoại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     launch_source_name: (<Typography content="Nguồn:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     affiliate_name: (<Typography content="Đối Tác:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     status_display: (<Typography content="Trạng Thái:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     f_type: (<Typography content="Phân Loại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     note: (<Typography content="Dịch vụ:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //     package_name: (<Typography content="Gói khám:" modifiers={["14x20", "500", "center", "capitalize"]} />),
//   //   };

//   //   const keysInTitleRender = Object.keys(titleRender);

//   //   const sortedFields = keysInTitleRender
//   //     .filter((key) => data.hasOwnProperty(key))
//   //     .map((key) => {
//   //       if (["appointment_date", "register_date"].includes(key)) {
//   //         return {
//   //           key,
//   //           value: data[key]
//   //             ? moment(data[key]).format("HH:mm - DD/MM/YYYY")
//   //             : "",
//   //         };
//   //       } else if (["customer_phone"].includes(key)) {
//   //         return { key, value: data[key]?.replace("+84-", "0") };
//   //       } else if (["affiliate_name"].includes(key)) {
//   //         return { key, value: data[key] ? `${data[key]}` : "--" };
//   //       } else {
//   //         return { key, value: data[key] };
//   //       }
//   //     });

//   //   return (
//   //     <>
//   //       {sortedFields.map(({ key, value }) => {
//   //         return (
//   //           <div
//   //             className="p-appointment_view_collapse_item_content_field"
//   //             key={key}
//   //           >
//   //             {titleRender[key]}
//   //             <span>{value}</span>
//   //           </div>
//   //         );
//   //       })}
//   //     </>
//   //   );
//   // };
//    const formMergeCustomer = useMemo(() => (
//     <div className="t-header_wrapper-merge_customer" style={{border:"none"}}>
//        {missingData?.map((item: any, index: any) => (
//           <div className="t-header_wrapper-merge_customer_flex" style={{marginBottom:"10px"}}>
//          <div style={{minWidth:"180px"}}> <Typography>{item?.month} dự đoán tăng trưởng</Typography></div>
//         <Select
//       defaultValue="Mức tăng trưởng"
//       style={{ width: 100 }}
//      // onChange={handleChange}
//       options={growthPercent}
//              allowClear={false}
//     />
//            <Typography>so với tháng {selectedMonth}</Typography>
//       </div>
//       ))}
        
        
//     </div>
//   ), [missingData,selectedMonth])
//   // const collapseBeforeExams = useMemo(
//   //   () => (
//   //     <div className="p-appointment_view_collapse">
//   //       {listAppointmentMaster?.data?.data?.length ? listAppointmentMaster?.data?.data?.map((itemBeforeExams: any) => (
//   //         <div
//   //           className={mapModifiers(
//   //             "p-appointment_view_collapse_item",
//   //             itemBeforeExams.is_care ? "care" : "",
//   //             itemBeforeExams?.status
//   //           )}
//   //           key={itemBeforeExams.index}
//   //         >
//   //           <CCollapse
//   //             title={
//   //               <div
//   //                 className="p-appointment_view_collapse_item_header"
//   //                 key={itemBeforeExams.index}
//   //               >
//   //                 <div className="p-appointment_view_collapse_item_title">
//   //                   {itemBeforeExams.is_care ? (
//   //                     <div className="p-appointment_view_collapse_item_title_care">
//   //                       <Typography
//   //                         content={itemBeforeExams?.customer_fullname}
//   //                         modifiers={["blueNavy"]}
//   //                       />
//   //                     </div>
//   //                   ) : (
//   //                     <Typography
//   //                       content={itemBeforeExams?.customer_fullname}
//   //                       modifiers={["blueNavy"]}
//   //                     />
//   //                   )}
//   //                   {itemBeforeExams?.customer_phone?.trim() ? (
//   //                     <>
//   //                       <Typography
//   //                         content={itemBeforeExams?.customer_phone.replace(
//   //                           "+84-",
//   //                           "0"
//   //                         )}
//   //                         modifiers={["green"]}
//   //                       />
//   //                     </>
//   //                   ) : stateBreakPoint < 600 ? null : (
//   //                     <span>---</span>
//   //                   )}
//   //                   {itemBeforeExams?.launch_source_group_name?.trim() ? (
//   //                     <>
//   //                       <Typography
//   //                         content={
//   //                           itemBeforeExams?.launch_source_group_name
//   //                         }
//   //                         modifiers={["green"]}
//   //                       />
//   //                     </>
//   //                   ) : stateBreakPoint < 600 ? null : (
//   //                     <span>---</span>
//   //                   )}
//   //                   {itemBeforeExams?.launch_source_name?.trim() ? (
//   //                     <>
//   //                       <Typography
//   //                         content={itemBeforeExams?.launch_source_name}
//   //                         modifiers={["green"]}
//   //                       />
//   //                     </>
//   //                   ) : stateBreakPoint < 600 ? null : (
//   //                     <span>---</span>
//   //                   )}
//   //                   {itemBeforeExams?.launch_source_type_name?.trim() ? (
//   //                     <>
//   //                       <Typography
//   //                         content={itemBeforeExams?.launch_source_type_name}
//   //                         modifiers={["green"]}
//   //                       />
//   //                     </>
//   //                   ) : stateBreakPoint < 600 ? null : (
//   //                     <span>---</span>
//   //                   )}
//   //                 </div>
//   //               </div>
//   //             }
//   //             key_default="0"
//   //           >
//   //             <div className="p-appointment_view_collapse_item_content">
//   //               {/* {renderItemCollapse(itemBeforeExams)} */}
//   //             </div>
//   //             <div className="p-appointment_view_collapse_item_wrap">
//   //               <div className="p-appointment_view_collapse_item_action">
//   //                 {[
//   //                   {
//   //                     titleAction: "Thêm ghi chú",
//   //                     titlePlacement: "top",
//   //                     icon: "note_crm",
//   //                     iconSizes: "24x24",
//   //                     handleClick: () => { },
//   //                   },
//   //                   {
//   //                     titleAction: "Tiếp nhận",
//   //                     titlePlacement: "top",
//   //                     icon: "accept_crm_feild",
//   //                     iconSizes: "24x24",
//   //                     handleClick: async () => { },
//   //                   },
//   //                   {
//   //                     titleAction: "Gắn Tag",
//   //                     titlePlacement: "bottom",
//   //                     icon: "hook_tag",
//   //                     iconSizes: "24x24",
//   //                     handleClick: () => { },
//   //                   },
//   //                   {
//   //                     titleAction: "Trò chuyện",
//   //                     titlePlacement: "bottom",
//   //                     icon: "messager_crm",
//   //                     iconSizes: "24x24",
//   //                     handleClick: () => {
//   //                       toast.info("Tính năng này đang được phát triển");
//   //                     },
//   //                   },
//   //                 ].map((item: any, idx: any) => (
//   //                   <CTooltip
//   //                     title={item.titleAction}
//   //                     placements="top"
//   //                     key={idx}
//   //                     colorCustom="#3e79f7"
//   //                   >
//   //                     <div
//   //                       className="m-list_btn-open_option_item"
//   //                       onClick={item?.handleClick}
//   //                     >
//   //                       <Icon
//   //                         iconName={item.icon}
//   //                         size={item.iconSizes}
//   //                         isPointer
//   //                       />
//   //                     </div>
//   //                   </CTooltip>
//   //                 ))}
//   //               </div>

//   //               <div className="p-appointment_view_collapse_item_enter">
//   //                 <CTooltip
//   //                   title={"Chi tiết khách hàng"}
//   //                   placements="top"
//   //                   colorCustom="#3e79f7"
//   //                 >
//   //                   <div className="m-list_btn-open_option_item">
//   //                     <Icon
//   //                       iconName="exits"
//   //                       isPointer
//   //                       onClick={() => {
//   //                         const {
//   //                           customer_id,
//   //                           customer_fullname,
//   //                           ...prevData
//   //                         } = itemBeforeExams;
//   //                         if (customer_id) {
//   //                           sessionStorage.setItem("indexMenu", "101");
//   //                           Cookies.set("id_customer", customer_id);
//   //                           dispatch(
//   //                             getInfosCustomerById({
//   //                               customer_id: customer_id,
//   //                             })
//   //                           );
//   //                           const newTab = window.open(
//   //                             `/customer-info/id/${customer_id}/history-interaction`,
//   //                             "_blank"
//   //                           );
//   //                           if (newTab) {
//   //                             newTab.focus();
//   //                           }
//   //                         } else {
//   //                           toast.error(
//   //                             `Không tìm thấy khách hàng: ${customer_fullname}`
//   //                           );
//   //                         }
//   //                       }}
//   //                     />
//   //                   </div>
//   //                 </CTooltip>
//   //               </div>
//   //             </div>
//   //           </CCollapse>
//   //         </div>
//   //       ))
//   //         : (
//   //           storeisLoadingAppointmentMaster ? <div className="p-appointment_view_collapse_loading">
//   //             <Loading variant="fullScreen" />
//   //           </div> : <CEmpty description="Không có dữ liệu ...!" />
//   //         )
//   //       }
//   //     </div>
//   //   ),
//   //   [listAppointmentMaster?.data?.data, storeisLoadingAppointmentMaster]);

  
//   const columns = [
//   {
//     title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{background:"white"}}/>,
//     dataIndex: 'name',
//     width: 600,
//       key: 'name',
//      rowScope: 'row',
//       fixed: "left",
//     //  render: (record: any, data: any) => (
//     //     <div className="ant-table-column_item ss ss1" >
//     //       <Typography  content={record} modifiers={[ 'right']} />
//     //     </div>
//       //   ),
//        render: (text:any, record:any) => (
//         <ExpandableTitle
//           title={
//               <div className="ant-table-column_item ss ss1">
//                 <Typography content={text} modifiers={['right']} />
//               </div>
//           }
//           expanded={expandedKeys.includes(record.key)}
//           onToggle={() =>
//             handleExpand(!expandedKeys.includes(record.key), record)
//           }
//            hasChildren={record.children && record.children.length > 0}
//         />
//       ),
//     },
    
//   ...columnsDate
//   ];
//     const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
//    const handleExpand = (expanded: boolean, record: any) => {
//     const currentKey = record.key;

//     if (expanded) {
//       // Xử lý khi mở rộng
//       const parentKey = getParentKey(currentKey);
     
//       // Nếu là thẻ cha, đóng tất cả các thẻ cha khác cùng cấp
//       if (parentKey === "") {
       
//         const siblingKeys = dataS.map((item: any) => item.key);
       
//         setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
//       } else {
//         // Nếu là thẻ con, đóng tất cả các thẻ con khác cùng cấp
//         const siblingKeys = findSiblingKeys(dataS, parentKey);
//         setExpandedKeys([...expandedKeys.filter(key => !siblingKeys.includes(key)), currentKey]);
//       }
//     } else {
//       // Khi thu gọn một dòng, loại bỏ key của dòng đó khỏi expandedKeys
//       setExpandedKeys((prev) => prev.filter((key) => key !== currentKey));
//     }
//   };

//   // Hàm để lấy key của phần tử cha
//   const getParentKey = (key: string): string => {
//     return key.split('-').slice(0, -1).join('-');
//   };

//   // Tìm tất cả các khóa (keys) của các dòng cùng cấp
//   const findSiblingKeys = (items: any[], parentKey: string): string[] => {
//     for (const item of items) {
//       if (item.key === parentKey) {
//         return item.children?.map((child: any) => child.key) || [];
//       }
//       if (item.children) {
//         const result = findSiblingKeys(item.children, parentKey);
//         if (result.length > 0) return result;
//       }
//     }
//     return [];
//   };
//   const [example, setExample] = useState(0)
//   const expandIcon: ExpandableConfig<any>['expandIcon'] = ({ expanded, onExpand, record }) => (
//   <span
//     onClick={(e) => onExpand && onExpand(record, e)}
//     className={`icon-transition custom-expand-icon ${expanded ? 'icon-expanded' : ''}`}
//   >
//     {expanded ? <MinusOutlined /> : <PlusOutlined />}
//   </span>
// );
//   const TableMemory = useMemo(() => {
//     return (
//       <PublicTableBusiness
//         column={columns}
//         isHideRowSelect
//         listData={dataS}
//         rowkey="key"
//         isPagination={false}
//         isExpandable
//         showExpandColumn
//          expandedRender={(data) => {
//               return (
//               // <div  className="m-form_add_customer-booking_box_table_children">
//                <div></div>
//               // </div>
//             )
//           }}
//         expandedRowKeys= {expandedKeys}
//         onExpand={handleExpand}
//         // expandIcon={expandIcon}
//       //  isbordered
//         scroll={{ x: 'max-content', y: 400 }}
//         tableRef={tableRefAppointment}
//         rowClassNames={(record: any, index: any) => {
//           return index % 2 === 0 ? 'bg-gay-blur' : ''
//         }}
//     />
//     );
//   }, [storeisLoadingAppointmentMaster, listAppointmentMaster?.data?.data, expandedKeys, example]);
//     const [fromDates, setFromDate] = useState("2024")
//   const [toDates, setToDate] = useState("")
//   const statisticHeader = useMemo(
//     () => (
//       <PublicHeaderStatistic
//         title={`Báo cáo kế hoạch kinh doanh Doctor Check ${fromDates !== "" ? ` ${fromDates}` : ""}`}
//        //   title={`Kế hoạch kinh doanh Doctor Check <span style="color:#00556E;">${fromDates} - </span><span style="color:#00556E;">${toDates}</span>`}
//         isSendRequest={isLoadingStatistic}
//         handleClick={(data: any) => {
//           dispatch(
//             getStatisticAppointment({
//               fromDate: moment(data.from).format("YYYY-MM-DD"),
//               toDate: moment(data.to).format("YYYY-MM-DD"),
//             } as any)
//           );
//         }}
//         isStatistic={false}
//         valueRangeDate={{
//           from: new Date(),
//           to: new Date(),
//         }}
//       >
//         {
//           stateBreakPoint < 980 ?
//             <ul className="p-appointment_view_description">
//               {
//                 descriptionGrid.map((item) => (
//                   <li key={item.id}>
//                     <p style={{ backgroundColor: item.color }} />
//                     <Typography content={item.title} />
//                   </li>
//                 ))
//               }
//             </ul> : null
//         }
//       </PublicHeaderStatistic>
//     ),
//     [appointmentStatistic, storeStatistic.data, listAppointmentMaster?.data, toDates,fromDates]
//   );

//   //   dates,
//   //   dateStrings
//   // ) => {
//   //   if (dates && dates[0] && dates[1]) {
//   //     setSelectedDates(dates as [Dayjs, Dayjs]);

//   //     if (mode === 'date') {
//   //       const diffInDays = dates[1].diff(dates[0], 'day');
//   //       if (diffInDays > 6) {
//   //         toast.warning('Khoảng thời gian không được quá 7 ngày.');
//   //       } else {
//   //         setFromDate(dateStrings[0])
//   //         setToDate(dateStrings[1])
//   //         generateColumns(dates as [Dayjs, Dayjs]);
//   //       }
//   //     } else if (mode === 'month') {
//   //       const diffInMonths = dates[1].diff(dates[0], 'month');
//   //       if (diffInMonths > 11) {
//   //         toast.warning('Khoảng thời gian không được quá 12 tháng.');
//   //       } else {
//   //         setFromDate(dateStrings[0])
//   //         setToDate(dateStrings[1])
//   //         generateColumns(dates as [Dayjs, Dayjs]);
//   //       }
//   //     } else if (mode === 'year') {
//   //       setFromDate(dateStrings[0])
//   //       setToDate(dateStrings[1])
//   //       generateColumns(dates as [Dayjs, Dayjs]);
//   //     }
//   //   }
//   // };
//    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
//   const currentYear = dayjs().year();
//   const lastYear = currentYear - 1;
//   const year = current.year();
//   return year !== currentYear && year !== lastYear;
//   };
//     const generateMissingData = (
//     selectedStartMonth: number,
//     selectedEndMonth: number
//   ) => {
//     const data = [];
//     for (let i = selectedStartMonth; i <= selectedEndMonth; i++) {
//       if (i > currentMonth) {
//         data.push({ month: months[i - 1].label, growth_rate: '' });
//       }
//     }
//     return data;
//   };
//      const generateDataMonth = (
//     selectedStartMonth: number,
//     selectedEndMonth: number
//   ) => {
//     const data = [];
//     for (let i = selectedStartMonth; i <= selectedEndMonth; i++) {
     
//         data.push({ month: months[i - 1].label});
     
//     }
//     return data;
//   };
//      const handleGetMonthMiss = () => {
//     if (startMonth && endMonth) {
//       const selectedStartMonth = parseInt(startMonth);
//       const selectedEndMonth = parseInt(endMonth);
//       if (selectedStartMonth <= selectedEndMonth) {
//         const data = generateMissingData(selectedStartMonth, selectedEndMonth);
//         const dataM = generateDataMonth(selectedStartMonth, selectedEndMonth)
//         setMissingData(data);
//         setDataMonth(dataM)
//         if (data.length !== 0 && currentYear <= parseInt(yearChoose)) {
         
//           setIsOpenGrowth(true)
//         }
//         else {
//             setExample(example - 1)
//             generateColumnsMonth(dataM)
//             // setIsOpenGrowth(true)
//         }
//       }
//     }
//   };
//   const handleReportClick = () => {
//     generateColumns(dataFilter.date);
//      setExample(example + 1)
//    }
//   //  const handleRangeChange: RangePickerProps['onChange'] = (
//   //   dates,
//   //   dateStrings
//   //  ) => {
//   //   // console.log(dates,dateStrings)
//   //   if (dates && dates[0] && dates[1]) {
//   //     setSelectedDates(dates as [Dayjs, Dayjs]);
//   //     console.log(12)
//   //     if (mode === 'date') {
//   //         console.log(123)
//   //         generateColumns(dates as [Dayjs, Dayjs]);
      
//   //     } else if (mode === 'month') {
//   //       const diffInMonths = dates[1].diff(dates[0], 'month');
//   //       if (diffInMonths > 7) {
//   //         toast.warning('Khoảng thời gian không được quá 7 tháng.');
//   //       } else {
//   //         generateColumns(dates as [Dayjs, Dayjs]);
//   //       }
//   //     } else if (mode === 'year') {
//   //       generateColumns(dates as [Dayjs, Dayjs]);
//   //     }
//   //   }
//   // };
//   const handleStartMonthChange = (value: string) => {
//     setStartMonth(value);
//     if (endMonth && value > endMonth) {
//       setEndMonth(value); // Reset end month nếu start month lớn hơn end month
//     }

//   };

//   const handleEndMonthChange = (value: string) => {
//     setEndMonth(value);
   
//   };
//   // useEffect(() => {
//   //   handleRangeChange();
//   // }, [startMonth, endMonth]);
//   const renderRangePicker = () => {
//        const disabledDate = (current: dayjs.Dayjs): boolean => {
//     // Can not select days after today
//     return current && current > dayjs().endOf('day');
//   };
//     switch (mode) {
//       case 'date':
//       // return <RangePicker onChange={handleRangeChange} disabledDate={disabledDay} style={{width:"250px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>;
//           return  <CDatePickers
//                //   onChange={handleRangeChange}
//             variant="simple"
//            // onChange={handleRangeChange}
//                   ValDefault={dataFilter.date}
//                   value={new Date(dataFilter?.date)}
//                   fomat="DD-MM-YYYY"
//                   isShowTime={false}
//                   placeholder="Chọn ngày muốn xem"
//                   disabledDate={disabledDate}
//                   handleOnChange={(date: any) => {
//                   setDataFilter({
//                     ...dataFilter,
//                     date: date?.$d,
//                   });
                  
//                   // dispatch(
//                   //   getListAppointmentMaster({
//                   //     ...propsData,
//                   //     date: moment(date?.$d).format("YYYY-MM-DDT00:00:00"),
//                   //   } as any)
//                   // );
//                   }}
//                 />
//       case 'month':
//         return  <CDatePickers
//                 fomat="YYYY"
//                 variant="simple"
//                 picker="year"
//                 ValDefault={dataFilter.date}
//                 value={new Date(dataFilter?.date)}
//                 handleOnChange={(date: any) => {
//                   const selectedYear = moment(date?.$d).format("YYYY");
//                   setFromDate(selectedYear)
//                   setYearChoose(selectedYear)
//                   setDataFilter({
//                     ...dataFilter,
//                     date: date?.$d,
//                   });
//                   dispatch(
//                     getListAppointmentMaster({
//                       ...propsData,
//                       date: moment(date?.$d).format("YYYY-MM-DDT00:00:00"),
//                     } as any)
//                   );
//                 }}
//               />
//       // case 'year':
//       //   return <RangePicker picker="month"  disabledDate={disabledDate} onChange={handleRangeChange} style={{width:"150px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>
//       default:
//         return <RangePicker style={{width:"250px", boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff"}}/>;
//     }
//   };
//   const renderRangePickerMonth = () => {
//     return (
//         <Row gutter={8} align="middle" style={{flexFlow:"row", marginLeft:"10px"}}>
//       <Col >
//         <Select
//           placeholder="Start Month"
//           style={{ width: 100 }}
//           onChange={handleStartMonthChange}
//           value={startMonth === "01" ? "Tháng 1" : startMonth}
//         >
//           {months.map((month) => (
//             <Option key={month.value} value={month.value} >
//               {month.label}
//             </Option>
//           ))}
//         </Select>
//       </Col>
//       <Col>
//         <RightOutlined style={{ fontSize: '16px', color: '#dce0e6' }} />
//       </Col>
//       <Col>
//         <Select
//           placeholder="End Month"
//           style={{ width: 100 }}
//           onChange={handleEndMonthChange}
//           value={endMonth === "12" ? "Tháng 12" : endMonth}
//           disabled={!startMonth}
//         >
//           {months
//             .filter((month) => !startMonth || month.value >= parseInt(startMonth)) // Chỉ hiển thị tháng >= start month
//             .map((month) => (
//               <Option key={month.value} value={month.value}>
//                 {month.label}
//               </Option>
//             ))}
//         </Select>
//       </Col>
//     </Row>
//     )
//   }
//   const handleModeChange = (e: RadioChangeEvent) => {
//     setMode(e.target.value);
//   };
//   const handlePrice = (data: any,i:any) => {
//       return  data.price[i]?.toLocaleString('vi-VN') || "0"
//   };
//   const generateColumns = (dates: any) => {
//   let newColumns = [];
//    if (mode === 'date') {
//      for (let i = 0; i < 1; i++) {
//        const currentDate = dates; // Only one date is provided
//        const date = new Date(currentDate);

//        const day = date.getDate();
//        const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1

//        const formattedDate = `Ngày ${day} tháng ${month}`;
//        newColumns.push({
//          title: (
//            <Typography
//              content={formattedDate}
//              modifiers={['14x20', '800', 'center', 'uppercase']}
//              styles={{ textAlign: 'right', marginRight: '6px' }}
//            />
//          ),
//          dataIndex: 'price',
//          key: formattedDate,
//          width: 200,
//          className: 'ant-table-column_wrap',
//          render: (record: any, data: any, index: any) => (
//            <div
//              className="ant-table-column_item"
//              style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
//            >
//              <Typography content={handlePrice(data,i)} modifiers={['13x18', '600', 'right']} />
//            </div>
//          ),
//        });
//      }
// } else  {
//     const totalMonths = dates[1].diff(dates[0], 'month') + 1;

//     for (let i = 0; i < totalMonths; i++) {
     
//       const currentMonth = dates[0].add(i, 'month');
//       newColumns.push({
//         title: (
//           <Typography
//             content={currentMonth.format('MM-YYYY')}
//             modifiers={['14x20', '800', 'center', 'uppercase']}
//             styles={{ textAlign: 'right', marginRight: '6px' }}
//           />
//         ),
//         dataIndex: 'price',
//         key: currentMonth.format('MM-YYYY'),
//         //   width: totalMonths > 5 ? 200 : 0,
//         width:200,
//         className: 'ant-table-column_wrap',
//         render: (record: any, data: any) => (
//           <div
//             className="ant-table-column_item"
//             style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
//           >
//             <Typography content={handlePrice(data,i)} modifiers={['13x18', '600', 'right']} />
//           </div>
//         ),
//       });
//     }
//   }
//   setColumns(newColumns);
// };
//  const generateColumnsMonth = (dataM:any) => {
//   let newColumns = [];
//   if (mode === 'month') {
//     // Lặp qua mỗi tháng trong dataMonth
//     for (let i = 0; i < dataM.length; i++) {

//       const currentMonth = `${dataM[i].month}`
//       newColumns.push({
//         title: (
//           <Typography
//             content={currentMonth}
//             modifiers={['14x20', '800', 'center', 'uppercase']}
//             styles={{ textAlign: 'right', marginRight: '6px' }}
//           />
//         ),
//         dataIndex: 'price',
//         key: currentMonth,
//         width: 200,
//         className: 'ant-table-column_wrap',
//         render: (record: any, data: any) => (
//           <div
//             className="ant-table-column_item"
//             style={{ display: 'flex', justifyContent: 'right', color: '#2c7287' }}
//           >
//             <Typography content={handlePrice(data,i)} modifiers={['13x18', '600', 'right']} />
//           </div>
//         ),
//       });
//     }
//   }

//   setColumns(newColumns);
// };

//   // const memoryListRecentDay = useMemo(() => (
//   //   <ul className="p-appointment_view_date_list">
//   //     {
//   //       SevenDays.map((item) => {
//   //         return (
//   //           <li
//   //             key={item.id}
//   //             className={mapModifiers("p-appointment_view_date_list_item", item.date === moment(dataFilter.date).format('YYYY-MM-DD') && 'active')}
//   //             onClick={() => {
//   //               if (!storeisLoadingAppointmentMaster) {
//   //                 setDataFilter({
//   //                   ...dataFilter,
//   //                   date: new Date(moment(item.date).format("YYYY-MM-DDT00:00:01")),
//   //                 });
//   //                 dispatch(
//   //                   getListAppointmentMaster({
//   //                     ...propsData,
//   //                     date: moment(item.date).format("YYYY-MM-DDTHH:mm:ss"),
//   //                   } as any)
//   //                 );
//   //                 dispatch(
//   //                   getStatisticAppointment({
//   //                     fromDate: moment(item.date).format("YYYY-MM-DD"),
//   //                     toDate: moment(item.date).format("YYYY-MM-DD"),
//   //                   } as any)
//   //                 );
//   //               }
//   //             }}
//   //           >
//   //             <span>{item.days}</span>
//   //             <p>{moment(item.date).format('DD/MM/YYYY')}</p>
//   //           </li>
//   //         )
//   //       })
//   //     }

//   //   </ul>
//   // ), [dataFilter, storeisLoadingAppointmentMaster])

//   return (
//     <div className="p-business">
//       <PublicLayout>
//     <div className='p-business_header'>
//          {statisticHeader}
//         <PublicHeader
//           titlePage=""
//           className="p-appointment_view_header_public"
//           handleFilter={() => { }}
//           isHideFilter
//           isHideService
//           isDial={false}
//           isHideEmergency
//           isClearFilter={storeisLoadingAppointmentMaster}
//           handleCleanFilter={() => {
//             setDataFilter({
//               date: new Date(),
//               launchSourceId: undefined as unknown as DropdownData,
//               launchSourceGroup: undefined as unknown as DropdownData,
//               keyWord: "",
//             });
//             dispatch(getListAppointmentMaster({} as any));
//             dispatch(getStatisticAppointment(initial as any));
//           }}
//           handleGetTypeSearch={() => { }}
//           handleOnClickSearch={(data) => {
           
//           }}
//           isUseSearch
//           isHideFilterMobile={false}
//           handleClickFilterMobile={() => { }}
//           tabLeft={
//             <div className="p-appointment_view_filter">
             
//               {stateBreakPoint > 600 &&
//                 <div className="a-group_radio"  style={{marginLeft:"0px", marginRight:"10px", height:"30px"}} >
//                     <Radio.Group
//                       onChange={handleModeChange}
//                       // defaultValue={defaultVal?.value}
//                       //disabled={isDisable}
//                       value={mode}
//                     >
//                       <Radio key={`${handleRenderGUID()}`} value="date">
//                         <Typography content="Theo ngày" styles={{ color: "#f00" }} />
//                       </Radio>
//                       <Radio key={`${handleRenderGUID()}`} value="month">
//                         <Typography content="Theo tháng" styles={{ color: "#3471e4" }} />
//                       </Radio>
//                       {/* <Radio key={`${handleRenderGUID()}`} value="year">
//                         <Typography content="Theo năm" styles={{ color: "#ffb301" }} />
//                       </Radio> */}
//                     </Radio.Group>
//               </div>
//               }
//               <div >{renderRangePicker()}</div>
//               <div>
//                 {
//                   mode === 'month' ?   renderRangePickerMonth() : <></>
//                 }
//               </div>
             
              
//             </div>
//           }
         
//           listBtn={
//             <div style={{ display: "flex", justifyContent: "center", alignItems:"center"}}>
//               <div className="p-booking_schedule_heading_button" onClick={mode === "date" ? handleReportClick : handleGetMonthMiss} style={{display:"flex",justifyContent:"center", alignItems:"center" ,cursor:"pointer",marginRight:"7px",background:"#1976D2",boxShadow:"0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)"}}>
//               <Icon iconName="price-list" size="20x20" style={{marginRight:"5px",color:"white"}}/>  <div> Báo cáo</div>
//               </div>
//               <Button
//                     modifiers={["primary"]}
//                     onClick={() => {
//                       exportDatatoExcel(dataFinish.map((item: any) => ({
//                         appointment_date: item?.appointment_date ? moment(item?.appointment_date).format('HH:mm - DD/MM/YYYY') : '',
//                         register_date: item?.register_date ? moment(item?.register_date).format('HH:mm - DD/MM/YYYY') : '',
//                         customer_fullname: item?.customer_fullname,
//                         birthday: item?.year_of_birth,
//                         old: Number(new Date().getFullYear()) - Number(item?.year_of_birth),
//                         f_type: item?.f_type,
//                         status_display: item?.status_display,
//                         launch_source_group_name: item?.launch_source_group_name,
//                         launch_source_name: item?.launch_source_name,
//                         launch_source_type_name: item?.launch_source_type_name,
//                         affiliate_name: item?.affiliate_name,
//                         package_name: item?.package_name.trim() ? item?.package_name : 'Sử dụng dịch vụ lẻ',
//                         total_services: item?.total_services,
//                       })),
//                         ["Ngày Đặt Lịch", "Ngày Đến Khám", "Tên Khách Hàng", "Năm sinh", "Tuổi", "Loại Khách Hàng", "Trạng Thái", "Công Ty", "Nguồn", "Hình thức chuyển đổi", "Đối Tác", "Gói dịch vụ", "Doanh Thu"],//Header mapping index
//                         `thong-ke_${moment(new Date()).format("DD-MM-YYYY")}`,
//                         "statistic"
//                       );
//                     }}
//                   >
//                     <Icon iconName="excel" size="20x20" />
//                   </Button>
//             </div>
//           }
//           isHideCleanFilter
//         />
//          <div className='p-business_body'>
         
//             <div className='p-business_body_content' style={{width:"calc(100vw - 60px)", maxHeight:"100%"}}>
//            {columnsDate.length === 0 ? <CEmpty description="Không có dữ liệu ...!" /> : TableMemory}
//             </div>
//         </div>
//         </div>
//       </PublicLayout>
//     <CModal
//         isOpen={isOpenGrowth}
//         textOK="Tiếp tục"
//         textCancel='Thoát'
//         onOk={() => {
//           // handleCheckInsurance();
//           setIsOpenGrowth(false)
//         }}
//         onCancel={() => {
//           setIsOpenGrowth(false)
//         }}
//         widths={430}
//         title={
//         <div>
//           <span style={{color:"#27ACFD", fontSize:"14px", fontWeight:500, textTransform:"uppercase"}}>Dự đoán so với:</span>
//           <Select
//             defaultValue="Chọn tháng"
//               style={{ width: 100, marginLeft: "10px" }}
//                onChange={(value) => setSelectedMonth(value)}
//             // onChange={handleChange}
//             options={months
//         .filter((month) => month.value <= currentMonth) // Chỉ hiển thị các tháng <= tháng hiện tại
//         .map((month) => ({
//           value: month.value,
//           label: month.label,
//         }))}
//             allowClear={false}
//           />
//         </div>
//       }
//       >
//         {formMergeCustomer}
//       </CModal>
//     </div>
//   );
// };

// export default BusinessPlan;


import React from 'react'

const BusinessPlan = () => {
  return (
    <div>index</div>
  )
}

export default BusinessPlan