// /* eslint-disable array-callback-return */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { PlusOutlined , CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { Progress, List, Table, Tag } from "antd";
// import { sendMessagetype } from "assets/data";
// import Button from "components/atoms/Button";
// import CDatePickers from "components/atoms/CDatePickers";
// import CTooltip from "components/atoms/CTooltip";
// import Dropdown, { DropdownData } from "components/atoms/Dropdown";
// import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
// // import Icon  from "components/atoms/Icon";
// import Input from "components/atoms/Input";
// import Typography from "components/atoms/Typography";
// import FormAddMarketingCampaign, {
//   AMOUNT_SMS,
//   CampaignFormType,
// } from "components/molecules/FormAddMarketingCampaign";
// import PublicTable from "components/molecules/PublicTable";
// import CDrawer from "components/organisms/CDrawer";
// import CModal from "components/organisms/CModal";
// import PublicHeader from "components/templates/PublicHeader";
// import PublicLayout from "components/templates/PublicLayout";
// import dayjs from "dayjs";
// import moment from "moment";
// import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
// import { useMutation } from "react-query";
// import { toast } from "react-toastify";
// import {
//   getCampaignLogs,
//   getCampaigns,
//   getSMSTemplates,
//   postMakeOrUpdateCampaigns,
//   postSendCampaign,
// } from "services/api/point";
// import { TemplateSMSItem } from "services/api/point/types";
// import { useAppDispatch, useAppSelector } from "store/hooks";
// import {getKPIDays } from "store/kpi_taskview";
// import mapModifiers from "utils/functions";
// import "./index.scss";



// const dataList = [
//   {
//     key: "1",
//     day: "01-09-2024",
//     inboxNew: "10",
//     inboxOld: "20",
//     phone: "5",
//     appointment: "10.000.000",
//     visit: "Data5",
//     revenue: "10.000.000",
//   },
//   {
//     key: "2",
//     day: "02-09-2024",
//     inboxNew: "10",
//     inboxOld: "20",
//     phone: "5",
//     appointment: "10.000.000",
//     visit: "Data5",
//     revenue: "10.000.000",
//   },
//   {
//     key: "3",
//     day: "02-09-2024",
//     inboxNew: "10",
//     inboxOld: "20",
//     phone: "5",
//     appointment: "10.000.000",
//     visit: "Data5",
//     revenue: "10.000.000",
//   },
//   {
//     key: "4",
//     day: "02-09-2024",
//     inboxNew: "10",
//     inboxOld: "20",
//     phone: "5",
//     appointment: "10.000.000",
//     visit: "Data5",
//     revenue: "10.000.000",
//   },
//   {
//     key: "5",
//     day: "02-09-2024",
//     inboxNew: "10",
//     inboxOld: "20",
//     phone: "5",
//     appointment: "10.000.000",
//     visit: "Data5",
//     revenue: "10.000.000",
//   },
//   // Add more data as needed
// ];

// const data = [
//   "Doanh thu đạt 100.000.00",
//   "Có 300 khách hàng đặt lịch",
//   "Nhắn tin với 100 khách hành mới",
//   "Gọi 10 cuộc điện thoại thành công mỗi ngày",
//   "Chat lại 200 khách hàng cũ",
// ];
// const getStatusData = (kpi: any) => {
//   // Sử dụng biểu thức chính quy để tìm tất cả các số trong chuỗi
// const numbers = kpi?.kpi_name.match(/\d+/g);

// // Chuyển các phần tử trong mảng `numbers` từ chuỗi sang số
// if (numbers && numbers.length >= 2) {
//   const min = Number(numbers[0]);

//   const isSuccess = kpi?.number_chats >= min;
//   const color = isSuccess ? 'green' : 'red';
//   const IconC = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//   return { isSuccess, color, IconC };
// } else {
//   const isSuccess = kpi?.number_chats >= 10;
//   const color = isSuccess ? 'green' : 'red';
//   const IconC = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//   return { isSuccess, color, IconC };
// }

// };
// const getStatusData2 = (kpi: any) => {
//   const percentage = kpi?.kpi_name.match(/\d+/g);
//   if (percentage && percentage.length >= 1) {
//   const value = Number(percentage[0]);
//   const isSuccess = (kpi?.number_appointments / kpi?.number_inbox) > (value / 100);
//   const color1 = isSuccess ? 'green' : 'red';
//   const IconC1 = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//     const formattedPercentage = (value).toFixed(2);
//   return {formattedPercentage, percentage, color1, IconC1 };
// } else {
//     const value = 10;
//     const isSuccess = (kpi?.number_appointments / kpi?.number_inbox) / (value / 100);
//     const color1 = isSuccess ? 'green' : 'red';
//     const IconC1 = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//      return { percentage, color1, IconC1 };
// }

// };
// const getStatusData3 = (kpi: any) => {
//       // Sử dụng biểu thức chính quy để tìm tất cả các số trong chuỗi
// const numbers = kpi?.kpi_name.match(/\d+/g);

// // Chuyển các phần tử trong mảng `numbers` từ chuỗi sang số
// if (numbers && numbers.length >= 2) {
//   const warm = Number(numbers[0]);
//   const hot = Number(numbers[1]);
//   const isSuccess = kpi?.number_warm_customers >= warm && kpi?.number_hot_customers >= hot;
//   const color2 = isSuccess ? 'green' : 'red';
//   const IconC2 = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//   return {warm,hot, isSuccess, color2, IconC2 };
// } else {
//   const isSuccess = kpi?.number_chats >= 10;
//   const color2 = isSuccess ? 'green' : 'red';
//   const IconC2 = isSuccess ? CheckCircleOutlined : CloseCircleOutlined;
//   return { isSuccess, color2, IconC2 };
// }

// };
// const Manage_Task: React.FC = () => {
//   const storageDoctoronline = localStorage.getItem("doctorOnline");
//   const storageEmployeeList = localStorage.getItem('listCSKH');
//   const [listEmployeeTeams, setListEmployeeTeams] = useState(storageEmployeeList ? JSON.parse(storageEmployeeList || '') : [] as any);
//   const [listCampaign, setListCampaign] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [listCampaignDetail, setListCampaignDetail] = useState([]);
//   const [roles, setRoles] = useState("Employees");
//   const listKPIDay = useAppSelector((state) => state.kpiday.listKPIDay);

//   const [kpiDay, setKPIDay] = useState(listKPIDay.data);
//   const { color, IconC } = getStatusData(kpiDay?.list_kpis[0]);
//     const {formattedPercentage, percentage, color1, IconC1 } = getStatusData2(kpiDay?.list_kpis[1]);
//     const {warm,hot,  color2, IconC2 } = getStatusData3(kpiDay?.list_kpis[2]);
//   const [states, setStates] = useState({
//     employee_id: "",
//     from_date: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
//     to_date: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
//   });

//     const propsData = {
//     employee_id: states?.employee_id,
//     from_date: moment(states.from_date).format('YYYY-MM-DD 00:00:00'),
//     to_date: moment(states.to_date).format('YYYY-MM-DD 23:59:59'),
//   };
//   const [campaign, setCampaign] = useState({
//     isOpen: false,
//     isOpenAddOrUpdate: false,
//     isUpdate: false,
//     nameCampaign: "",
//     statusCampaign: false,
//     id: 0,
//   });
//   const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
//   const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);

//   const [sendSMS, setSendSMS] = useState({
//     openModal: false,
//     type: "",
//     listCS: [],
//     campaignType: sendMessagetype[0] as unknown as GroupRadioType,
//     template: undefined as unknown as DropdownData,
//     campaign: undefined as unknown as DropdownData,
//     content: "",
//     subject: "",
//   });
//   const dispatch = useAppDispatch()
//   const [sendSMSEror, setSendSMSError] = useState({
//     subject: "",
//     template: "",
//     content: "",
//     campaign: "",
//   });

//   const [dataCampaign, setDataCampaign] = useState({
//     data: undefined as unknown as DropdownData[],
//     dropdown: undefined as unknown as DropdownData[],
//   });
//    const disabledDate = (current:any) => {
//     // Chặn các ngày sau ngày hiện tại
//     return current && current > dayjs().endOf('day');
//   };

//   useLayoutEffect(() => {
//     getCampaign();
//     getTemplateSMSOfCampaign();
//   }, []);
//   useEffect(() => {

//     setKPIDay(listKPIDay)
//   },[listKPIDay])
//   /* API */
//   const { mutate: getCampaign } = useMutation(
//     "post-footer-form",
//     () => getCampaigns(),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           setListCampaign(data?.data);
//           const newCampaign = await data?.data
//             ?.map((item: any) => {
//               return {
//                 id: item.campaign_id,
//                 label: item.campaign_name,
//                 value: item.campaign_id,
//                 active: item.is_active,
//               };
//             })
//             .filter(Boolean);
//           setDataCampaign({
//             data: newCampaign,
//             dropdown: data?.data
//               ?.map((item: any) => {
//                 if (!item.is_active) return;
//                 return {
//                   id: item.campaign_id,
//                   label: item.campaign_name,
//                   value: item.campaign_id,
//                   active: item.is_active,
//                 };
//               })
//               .filter(Boolean),
//           });
//         }
//       },
//       onError: (error) => {
//         console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

 

//   const { mutate: createOrUpdateCampaign } = useMutation(
//     "post-footer-form",
//     (body: any) => postMakeOrUpdateCampaigns(body),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           getCampaign();
//           setCampaign({
//             ...campaign,
//             isOpenAddOrUpdate: false,
//           });
//         }
//       },
//       onError: (error) => {
//         console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

//   const { mutate: getTemplateSMSOfCampaign } = useMutation(
//     "post-footer-form",
//     () => getSMSTemplates(),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           setTemplateSMS(
//             data?.data?.map((item: TemplateSMSItem) => {
//               if (!item.is_used) return;
//               return {
//                 id: item.id,
//                 label: item.name,
//                 value: item.content,
//                 sms_count: item.sms_count,
//               };
//             })
//           );
//         }
//       },
//       onError: (error) => {
//         console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

//   const { mutate: sendCampaign } = useMutation(
//     "post-footer-form",
//     (body: any) => postSendCampaign(body),
//     {
//       onSuccess: async (data) => {
//         if (data?.status) {
//           toast.success(data?.message);
//           setSendSMS({
//             ...sendSMS,
//             openModal: false,
//             template: undefined as unknown as DropdownData,
//             campaign: undefined as unknown as DropdownData,
//             content: "",
//             subject: "",
//           });
//         } else {
//           toast.error(data?.message);
//           setSendSMS({
//             ...sendSMS,
//             openModal: false,
//             template: undefined as unknown as DropdownData,
//             campaign: undefined as unknown as DropdownData,
//             content: "",
//             subject: "",
//           });
//         }
//       },
//       onError: (error) => {
//         console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
//       },
//     }
//   );

//   const handleAddOrUpdateCampaign = () => {
//     if (!campaign.nameCampaign.trim()) {
//       toast.error("Vui lòng nhập tên chiến dịch");
//       return;
//     }
//     const body = {
//       campaign_id: campaign.id,
//       campaign_name: campaign.nameCampaign,
//       is_active: campaign.statusCampaign,
//     };

//     createOrUpdateCampaign(body);
//   };

//   const handleValidateSendMessage = () => {
//     if (sendSMS.campaignType?.value === "SMS") {
//       if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
//         setSendSMSError({
//           ...sendSMSEror,
//           subject: !sendSMS.subject.trim()
//             ? "Tiêu đề là bắt buộc để gửi tin nhắn"
//             : "",
//           template: !sendSMS.template
//             ? "Cần chọn template để gửi tin nhắn"
//             : "",
//           campaign: !sendSMS.campaign ? "Vui lòng chọn 1 chiến dịch" : "",
//         });
//         return false;
//       }
//       return true;
//     } else {
//       if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
//         setSendSMSError({
//           ...sendSMSEror,
//           campaign: !sendSMS.campaign ? "Vui lòng chọn 1 chiến dịch" : "",
//           subject: !sendSMS.subject.trim()
//             ? "Tiêu đề là bắt buộc để gửi tin nhắn"
//             : "",
//           content: !sendSMS.content?.trim()
//             ? "Cần nhập nội dung tin nhắn để gửi tin nhắn"
//             : "",
//         });
//         return false;
//       }
//       return true;
//     }
//   };

//   const handleExcuteSendMessage = () => {
//     if (!handleValidateSendMessage()) return;
//     const to = listCampaignDetail
//       .filter(
//         (i: any) =>
//           i?.status !== "OK" &&
//           !!i.customer_phone
//             ?.replace("+84-", "0")
//             ?.match(/^(03|05|07|08|09)\d{8}$/)
//       )
//       .map((i: any) => {
//         return { customer_ref: i?.customer_ref };
//       });

//     const body = {
//       send_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
//       campaign_id: sendSMS.campaign?.value,
//       method: sendSMS.campaignType.value,
//       template_id: sendSMS.template.id || "",
//       content:
//         sendSMS.campaignType.value === "SMS"
//           ? sendSMS.template.value?.replace("&", "va")
//           : sendSMS.content?.replace("&", "va"),
//       to: to,
//     };
//     sendCampaign(body);
//   };

//   /* Column */
//   const memoryTableKPI = useMemo(() => {
//     return (
//       <div
//         className={mapModifiers("p-managetask_table_item")}
//         style={{
//           width: "200px",
//           borderRadius: "12px",
//           border: "none",
//           boxShadow: "none",
//         }}
//       >
//         <>
//           <div
//             className="pmanagetask_table_item_paragraph"
//             style={{ marginTop: "0px", height: "fit-content" }}
//           >
//             <Typography
//               content="Doanh thu đạt"
//               modifiers={["12x18", "400", "center"]}
//               styles={{ color: "#7F7E7E", fontSize: "12px" }}
//             />
//           </div>
//         </>
//         <>
//           <div
//             className="p-managetask_table_item_paragraph"
//             style={{ marginTop: "7px", height: "fit-content" }}
//           >
//             <Typography
//               content="100.000.000"
//               modifiers={["12x18", "600", "center", "blueNavy"]}
//               styles={{ fontSize: "20px" }}
//             />
//           </div>
//         </>
//         <>
//           <div
//             className="p-managetask_table_item_paragraph"
//             style={{ marginTop: "12px", height: "fit-content" }}
//           >
//             <Typography
//               content={`${(
//                 (100000 / 500000) *
//                 100
//               ).toLocaleString()}% của KPI tháng`}
//               modifiers={["12x18", "400", "center"]}
//               styles={{ color: "#7F7E7E", fontSize: "10px", fontWeight: "300" }}
//             />
//           </div>
//         </>
//         <>
//           <div
//             className="p-managetask_table_item_paragraph"
//             style={{ marginTop: "0px", height: "fit-content" }}
//           >
//             <Progress
//               percent={(100000 / 500000) * 100}
//               format={(percent: any) => `${(500000000).toLocaleString()} đ`}
//             />
//           </div>
//         </>
//       </div>
//     );
//   }, [listCampaign, states]);
//   const memoryAddTableKPI = useMemo(() => {
//     return (
//       <div
//         className={mapModifiers("p-managetask_table_item2")}
//         style={{
//           width: "100%",
//           borderRadius: "12px",
//           border: "none",
//           boxShadow: "none",
//           height: "fit-content",
//           background: "transparent",
//         }}
//       >
//         <>
//           <div
//             className="p-managetask_table_item2_paragraph"
//             style={{ marginTop: "7px", height: "fit-content" }}
//           >
//             <Typography
//               content="08/2024"
//               modifiers={["12x18", "600", "center", "black"]}
//               styles={{ fontSize: "30px" }}
//             />
//           </div>
//         </>
//         <>
//           <div
//             className="p-managetask_table_item2_paragraph"
//             style={{ marginTop: "40px", height: "fit-content" }}
//           >
//             <div
//               className="p-managetask_table_item2_headerTitle"
//               style={{
//                 borderRadius: "10px",
//                 padding: "10px 10px",
//                 border: "1px solid #d9d9d9",
//                 background: "white",
//                 paddingLeft: "20px",
//                 paddingRight: "20px",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//               onClick={() => setOpenAdd(true)}
//             >
//               <PlusOutlined
//                 style={{
//                   fontSize: "10px",
//                   color: "black",
//                   border: "1px solid rgba(0, 0, 0, 0.88)",
//                   padding: "3px",
//                   borderRadius: "50%",
//                   marginRight: "20px",
//                 }}
//               />
//               <Typography
//                 content="Thêm KPI"
//                 modifiers={["12x18", "600", "center", "black"]}
//                 styles={{ fontSize: "15px" }}
//               />
//             </div>
//           </div>
//         </>
//         <>
//           <div
//             className="p-managetask_table_item2_paragraph"
//             style={{ marginTop: "40px", height: "fit-content" }}
//           >
//             <List
//               className="p-managetask_table_item2_custom-list"
//               size="small"
//               header={
//                 <div>
//                   {" "}
//                   <Typography
//                     content="Danh sách các KPI đã thêm trong tháng"
//                     modifiers={["12x18", "600", "center", "main"]}
//                     styles={{ fontWeight: 700, fontSize: "16px" }}
//                   />
//                 </div>
//               }
//               bordered
//               dataSource={data}
//               renderItem={(item, index) => (
//                 <List.Item
//                   style={{
//                     cursor: "pointer",
//                     transition: "background-color 0.3s ease",
//                   }}
//                   onMouseEnter={(e: any) => {
//                     const target = e.currentTarget as HTMLElement;
//                     target.style.backgroundColor = "#f0f0f0";
//                   }}
//                   onMouseLeave={(e: any) => {
//                     const target = e.currentTarget as HTMLElement;
//                     target.style.backgroundColor = "";
//                   }}
//                 >
//                   <Typography
//                     content={`${index + 1}. ${item}`}
//                     modifiers={["12x18", "600", "center", "blueNavy"]}
//                     styles={{ fontWeight: 600, fontSize: "14px" }}
//                   />
//                 </List.Item>
//               )}
//             />
//           </div>
//         </>
//       </div>
//     );
//   }, [listCampaign, states]);
//   const columnTable = [
//     {
//       title: (
//         <Typography
//           content="Họ và tên"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "left",  }}
//         />
//       ),
//       dataIndex: "name",
//       key: "name",
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "start",
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["14x20", "600", "center", "blueNavy", "uppercase"]}
//           />
//         </div>
//       ),
//     },
//     {
//       title: (
//         <Typography
//           content="Doanh thu"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "right", marginRight: "14px" }}
//         />
//       ),
//       dataIndex: "revenue",
//       key: "revenue",
//       width: 320,
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{ justifyContent: "start" }}
//         >
//           <Typography
//             content={record?.toLocaleString("vi-VN")}
//             modifiers={["13x18", "600", "center", "main"]}
//             styles={{ textAlign: "end" }}
//           />
//         </div>
//       ),
//     },
//     {
//       title: (
//         <Typography
//           content="Số lượng khách hàng"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "right", marginRight: "14px" }}
//         />
//       ),
//       dataIndex: "customers",
//       key: "customers",
//       width: 320,
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{ justifyContent: "start" }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//             styles={{ textAlign: "end" }}
//           />
//         </div>
//       ),
//     },
//     {
//       title: (
//         <Typography
//           content="Cuộc gọi đặt hẹn thành công"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "right", marginRight: "14px" }}
//         />
//       ),
//       dataIndex: "successful_calls",
//       key: "successful_calls",
//       width: 320,
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{ justifyContent: "start" }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//             styles={{ textAlign: "end" }}
//           />
//         </div>
//       ),
//     },
//     {
//       title: (
//         <Typography
//           content="Cuộc gọi đặt hẹn thành công"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "right", marginRight: "14px" }}
//         />
//       ),
//       dataIndex: "successful_calls",
//       key: "successful_calls",
//       width: 320,
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{ justifyContent: "start" }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//             styles={{ textAlign: "end" }}
//           />
//         </div>
//       ),
//     },
//     {
//       title: (
//         <Typography
//           content="Cuộc gọi đặt hẹn thành công"
//           modifiers={["12x18", "500", "center", "uppercase"]}
//           styles={{ textAlign: "right", marginRight: "14px" }}
//         />
//       ),
//       dataIndex: "successful_calls",
//       key: "successful_calls",
//       width: 320,
//       render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{ justifyContent: "start" }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//             styles={{ textAlign: "end" }}
//           />
//         </div>
//       ),
//     },
//   ];
//   const columns = [
//     {
//       title: (
//        <div style={{ display: "flex", justifyContent: "start", alignItems: "start", height: "189px",background:"#fce1d6", borderRight:"1px solid #f0f0f0" }}>
//         </div>
//       ),
     
//       children: [
//          {
//           title: (
//             <Typography
//               content="Ngày"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",}}
//             />
//           ),
//              dataIndex: "day",
//       key: "day",
//       rowSpan: 2,
//           width: 150,
//         render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//        ]
//     },
//     {
//       title: (
//         <div style={{ display: "flex", justifyContent: "start", alignItems: "start", height: "190px",background:"#fce1d6",borderLeft:"1px solid #f0f0f0", borderRight:"2px solid #f0f0f0" }}>
//          <div style={{ display: "flex", flexDirection: "column", paddingTop:"10px" }}>
//           <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "uppercase", color: "#00556e", fontWeight: "600" }}>Khách hàng F1</span>
//           <br></br>
//             <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "capitalize", color: "#333", fontWeight: "600" }}>KH Mới Hoàn Toàn Trong Ngày</span>
//               <span style={{ textAlign: "left", marginLeft: "20px", color: "#333", fontWeight: "600" }}>- Mỗi ngày chat chỉn chu 10 - 15 KH: <span style={{color:color}}>{kpiDay?.list_kpis[0]?.number_chats} KH  <IconC style={{ marginRight: 8 }} /></span>
//             </span>
//             <span style={{ textAlign: "left", marginLeft: "20px", color: "#333", fontWeight: "600" }}>- Tỉ lệ đặt hẹn lý thuyết/inbox trong ngày {percentage}%: <span style={{color:color1}}>{Number(((kpiDay?.list_kpis[1]?.number_appointments / kpiDay?.list_kpis[1]?.number_inbox) * 100)?.toFixed(2))}% <IconC1 style={{ marginRight: 8 }} /></span> </span>
//           <br></br>
//           <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "capitalize", color: "#333", fontWeight: "600" }}>Chat lại với KH nóng, ấm & lạnh trước đây</span>
//             <span style={{ textAlign: "left", marginLeft: "20px", color: "#333", fontWeight: "600" }}>- Mỗi ngày gửi tối thiểu {warm} KH Ấm & {hot} KH Nóng: <span style={{color:color2}}>{kpiDay?.list_kpis[2]?.number_hot_customers} KH Nóng, {kpiDay?.list_kpis[2]?.number_warm_customers} KH Ấm, {kpiDay?.list_kpis[2]?.number_cold_customers} KH Lạnh <IconC2 style={{ marginRight: 8 }} /></span> </span>
//           </div>
//         </div>
//       ),
//       children: [
//         {
//           title: (
//             <Typography
//               content="Inbox Mới"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center", paddingBottom:"10px", paddingTop:"10px" }}
//             />
//           ),
//           dataIndex: "inboxNew",
//           key: "inboxNew",
//           width: 160,
//                   render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Inbox Cũ"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "inboxOld",
//           key: "inboxOld",
//           width: 160,
//             render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="SĐT"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "phone",
//           key: "phone",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Đặt hẹn"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "appointment",
//           key: "appointment",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Tới Khám"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "visit",
//           key: "visit",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Doanh thu"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "right", marginRight:"5px" }}
//             />
//           ),
//           dataIndex: "visit",
//           key: "visit",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "end",
//             paddingBottom: "5px",
//             paddingTop:"5px",marginRight:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//       ],
//     },
//     {
//       title:   <div style={{ display: "flex", justifyContent: "start", alignItems: "start", height: "190px", background:"#c9edfb",borderRight:"2px solid #f0f0f0" }}>
//         <div style={{display:"flex", flexDirection:"column", maxWidth:"480px", paddingTop:"10px"}}>
//           <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "uppercase", color: "#00556e", fontWeight: "600" }}>Khách hàng F2</span>
//           <br></br>
//           <span style={{ textAlign: "left", marginLeft: "20px",  color: "#333", fontWeight: "600", whiteSpace: "normal",
//         wordWrap: "break-word",
//         overflowWrap: "break-word" }}>- Mỗi KH từng tầm soát gói A,B,C làm thêm trung bình &gt; 2 dịch vụ lẻ trong vòng 6 tháng (tiền đề để nâng cấp gói cao hơn sau 6 tháng tiếp theo)</span>
//           <span style={{ textAlign: "left", marginLeft: "20px",  color: "#333", fontWeight: "600" }}>- Trung bình 90% KH làm thêm 3 dịch vụ lẻ</span>
//         </div>
//       </div>,
//       children: [
//         {
//           title: (
//             <Typography
//               content="KH liên hệ hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "inboxNew",
//           key: "inboxNew",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH đặt thêm DV lẻ"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center" ,    whiteSpace: "normal", wordWrap:"break-word", overflowWrap:"break-word",}}
//             />
//           ),
//           dataIndex: "inboxOld",
//           key: "inboxOld",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH tới thực tế hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center", }}
//             />
//           ),
//           dataIndex: "phone",
//           key: "phone",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Doanh thu"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "right",marginRight:"5px" }}
//             />
//           ),
//           dataIndex: "appointment",
//           key: "appointment",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "end",
//             paddingBottom: "5px",
//             paddingTop:"5px",marginRight:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//       ],
//     },
//     {
//       title: (
//         <div style={{ display: "flex", justifyContent: "start", alignItems: "start", height: "190px",background:"#f2cef0",borderRight:"2px solid #f0f0f0" }}>
//         <div style={{ display: "flex", flexDirection: "column", paddingTop:"10px" }}>
//           <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "uppercase", color: "#00556e", fontWeight: "600" }}>Khách hàng F3</span>
//           <br></br>
         
//           <span style={{ textAlign: "left", marginLeft: "20px",color: "#333", fontWeight: "600" }}>&gt; 90% KH tầm soát lại sau 6-12 tháng với gói khám cao hơn</span>
        
//           </div>
//         </div>
//       ),
//       children: [
//         {
//           title: (
//             <Typography
//               content="KH liên hệ hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center", }}
//             />
//           ),
//           dataIndex: "inboxNew",
//           key: "inboxNew",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH đặt hẹn tầm soát lại"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "inboxOld",
//           key: "inboxOld",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH tới thực tế hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center", }}
//             />
//           ),
//           dataIndex: "phone",
//           key: "phone",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Doanh thu"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "right",marginRight:"5px" }}
//             />
//           ),
//           dataIndex: "appointment",
//           key: "appointment",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "end",
//             paddingBottom: "5px",
//             paddingTop:"5px",marginRight:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//       ],
//     },
//     {
//        title: (
//         <div style={{ display: "flex", justifyContent: "start", alignItems: "start", height: "190px",background:"#d9f2d2" }}>
//           <div style={{ display: "flex", flexDirection: "column", paddingTop:"10px" }}>
//           <span style={{ textAlign: "left", marginLeft: "20px", textTransform: "uppercase", color: "#00556e", fontWeight: "600" }}>Khách hàng WOM</span>
//           <br></br>
         
//           <span style={{ textAlign: "left", marginLeft: "20px",color: "#333", fontWeight: "600" }}>- Mỗi ngày liên hệ với 10KH</span>
//           <span style={{ textAlign: "left", marginLeft: "20px",color: "#333", fontWeight: "600" }}>- 1KH đã tầm soát sẽ giới thiệu &gt; 3 KH mới</span>
//           </div>
//         </div>
//       ),
//       children: [
//         {
//           title: (
//             <Typography
//               content="KH liên hệ hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center", }}
//             />
//           ),
//           dataIndex: "inboxNew",
//           key: "inboxNew",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH Giới thiệu"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "inboxOld",
//           key: "inboxOld",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="KH tới thực tế hôm nay"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "center",  }}
//             />
//           ),
//           dataIndex: "phone",
//           key: "phone",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             paddingBottom: "5px",
//             paddingTop:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//         {
//           title: (
//             <Typography
//               content="Doanh thu"
//               modifiers={["12x18", "500", "center", "uppercase"]}
//               styles={{ textAlign: "right", marginRight:"5px"}}
//             />
//           ),
//           dataIndex: "appointment",
//           key: "appointment",
//           width: 160,
//            render: (record: any, data: any) => (
//         <div
//           className="ant-table-column_item"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "end",
//             paddingBottom: "5px",
//             paddingTop:"5px",marginRight:"5px"
//           }}
//         >
//           <Typography
//             content={record}
//             modifiers={["13x18", "600", "center", "main"]}
//           />
//         </div>
//       ),
//         },
//       ],
//     },
//   ];
//   const memoryTableSeenKPI = useMemo(() => {
//     return (
//       <div
//         className={mapModifiers("p-managetask_table_item3")}
//         style={{
//           width: "100%",
//           borderRadius: "12px",
//           padding: "0px",
//           border: "none",
//           boxShadow: "none",
//           height: "fit-content",
//           background: "transparent",
//         }}
//       >
//         <Table
//           dataSource={dataList}
//           columns={columns}
//           pagination={false}
//           //bordered
//           // rowClassName={(record: any, index: any) => {
//           //   return index % 2 === 0 ? "bg-gay-blur" : "";
//           // }}
//           scroll={{ x: "max-content" }}
         
//         />
//         {/* <PublicTable
//         listData={dataList}
//        // loading={states.loading}
//         column={columnTable}
//         rowkey={'master_ref'}
//         isHideRowSelect={false}
//         showExpandColumn
//         isExpandable
//         scroll={{ x: 'max-content', y: 'calc(100vh - 210px)' }}
//         defaultExpandAllRow={false}
//       //  handleOnchange={checkYouHavePermissionApproveCommissions ? handleTableChange : handleTableChange1}
       
//         rowClassNames={(record: any, index: any) => {
//           return index % 2 === 0 ? 'bg-gay-blur' : ''
//         }}
      
//       /> */}
//       </div>
//     );
//   }, [listCampaign, states,kpiDay]);
  

//   return (
//     <div className="p-managekpi">
//       <PublicLayout>
//         <PublicHeader
//           titlePage={"Quản lý Task"}
//           handleGetTypeSearch={() => {}}
//           handleFilter={() => {}}
//           handleCleanFilter={() => {}}
//           isHideFilter
//           isHideService
//           className="p-managekpi_header"
//           isDial={false}
//           isHideEmergency
//           isHideCleanFilter
//           tabLeft={
//             <>
//               <div className="p-affiliate_header_item" style={{marginRight:"30px"}}>
//                 <CDatePickers
//                   handleOnChange={(date: any) => {
//                     setStates({ ...states, to_date: date?.$d, from_date: date?.$d, })
//                        dispatch(getKPIDays({
//                        ...propsData,
                       
//                         to_date: moment(date?.$d).format('YYYY-MM-DD 23:59:59'),
//                     from_date: moment(date?.$d).format('YYYY-MM-DD 00:00:00'),
                   
//                      } as any))
                 
//                   }}
//                  // ValDefault={moment(new Date()).format('YYYY-MM-DD 00:00:00')}
//                   variant="simple"
//                  // isBirthDate={true}
//                   disabledDate={disabledDate}
//                   //   value={states.date}
//                   fomat="DD/MM/YYYY"
//                   isShowTime={false}
//                   placeholder="Chọn tháng cần xem"
//                   picker="date"
//                 />
//                 {/* <Button
//                 // onClick={handleGetAppointment}
//                 >
//                   <Typography content="Lọc" />
//                 </Button> */}
                
//               </div>
//               <Dropdown
//             dropdownOption={listEmployeeTeams || []}
//             //   defaultValue={valUpdate?.origin as DropdownData}
//           //  label="Chọn KPI"
//             placeholder="Chọn 1 CSKH"
//                 handleSelect={(item) => {
                 
//                setStates({
//                     ...states,
//                     employee_id:String(item?.id || ""),
//                   //  employee_name: item?.label
//                });
//                    dispatch(getKPIDays({
//                     ...propsData,
//                     employee_id: item?.id,
                   
//                    } as any))
                
//               // setErrorForm({ ...errorForm, bookingService1: "" });
//             }}
//             variant="simple"
//             //  values={dataForm.serviceAllowTypeBooking1}
//             //  error={errorForm.bookingService1}
//                 // isRequired
//                 className="listFilter"
//               />
//                 {/* <Button
//                 onClick={handleGetKPIDay}
//                 >
//                   <Typography content="Lọc" />
//                 </Button> */}
//             </>
//           }
//           // listBtn={(
//           //   <>
//           //     <Button modifiers={['foreign']} onClick={() => {
//           //       setStates({
//           //         ...states, isOpenDrawer: true,
//           //       });
//           //     }}>
//           //       <Typography content='Gửi tin nhắn từ file' modifiers={['400']} />
//           //     </Button>
//           //     <Button onClick={() => {
//           //       setCampaign({
//           //         ...campaign,
//           //         isOpenAddOrUpdate: true,
//           //         isUpdate: false,
//           //         nameCampaign: '',
//           //         statusCampaign: false,
//           //       })
//           //     }}>
//           //       <Typography content='Thêm mới' modifiers={['400']} />
//           //     </Button>
//           //   </>
//           // )}
//         />
//         <div
//           className="p-managetask_table"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "start",
//             alignItems: "center",
//             height: "fit-content",
//           }}
//         >
//           {/* <div style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "rgb(245 245 245)",  borderRadius: '16px',height:"fit-content", padding:"30px 20px",   boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',}}> {memoryAddTableKPI}</div>  */}
//           {/* {memoryTableSeenKPI} */}

//           {memoryTableSeenKPI}
//           {roles === "Employeess" ? (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-around",
//                 width: "100%",
//                 background: "rgb(245 245 245)",
//                 borderRadius: "16px",
//                 height: "fit-content",
//                 padding: "30px 20px",
//                 boxShadow:
//                   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//               }}
//             >
//               {memoryTableKPI}
//               {memoryTableKPI}
//               {memoryTableKPI}
//               {memoryTableKPI}
//               {memoryTableKPI}
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>
//       </PublicLayout>

//       <CModal
//         isOpen={openAdd}
//         title={"Thêm mới KPI"}
//         onCancel={() => setOpenAdd(false)}
//         textCancel="Thoát"
//         textOK={campaign.isUpdate ? "Cập nhật" : "Thêm mới"}
//         onOk={handleAddOrUpdateCampaign}
//       >
//         <div style={{ marginBottom: "10px" }}>
//           <Dropdown
//             dropdownOption={listEmployeeTeams || []}
//             //   defaultValue={valUpdate?.origin as DropdownData}
//             label="Chọn KPI"
//             placeholder="Chọn 1 bác sĩ"
//             // handleSelect={(item) => {
//             //   setDataForm({
//             //     ...dataForm,
//             //     serviceAllowTypeBooking1: item,
//             //   });
//             //   setErrorForm({ ...errorForm, bookingService1: "" });
//             // }}
//             variant="simple"
//             //  values={dataForm.serviceAllowTypeBooking1}
//             //  error={errorForm.bookingService1}
//             isRequired
//           />
//         </div>
//         <Input
//           isRequired
//           type="number"
//           label="Số KPI đạt được"
//           placeholder="Nhập sô KPI"
//           variant="simple"
//           value={campaign.nameCampaign}
//           onChange={(event) =>
//             setCampaign({
//               ...campaign,
//               nameCampaign: event.target.value,
//             })
//           }
//         />
//       </CModal>
   
//     </div>
//   );
// };

// export default Manage_Task;


import React from 'react'

const Manage_Task = () => {
  return (
    <div>index</div>
  )
}

export default Manage_Task