/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { DropdownData } from "components/atoms/Dropdown";
import { GroupCheckBoxItem } from "components/atoms/GroupCheckBox";
import { GroupRadioType, GroupRadioType1 } from "components/atoms/GroupRadio";
import { AdministrativeItem } from "components/molecules/RenderMedicalRecord";
import {
  EmailInfos,
  SMSInfos,
} from "components/templates/LinkedAccountSetting";
import {
  InfosNotify,
  InfosSocialAccount,
} from "components/templates/SettingMultiChannel";
import moment from "moment";
import { AfterExaminationType } from "pages/AfterMedicalExamination";
import { BookingScheduleType } from "pages/BookingSchedule";
import { FormAddTodoStep } from "pages/Dashboard";
import { MissCallType } from "pages/MissCall";
import { EmployeeRankType } from "services/types";
import { handleRenderGUID } from "utils/functions";

export const menuAffiliate = [
  { id: 0, title: 'Hoa hồng CSKH', role: ["beforeExams", "normal"], },
  { id: 1, title: 'Hoa hồng Bác sĩ', role: ["beforeExams"], },
]

export const optionOrigin: DropdownData[] = [
  { id: 1, label: "Doctor Check", value: "doctorcheck.vn" },
  { id: 2, label: "Endo Clinic", value: "endoclinic.vn" },
];

export const optionLaunchSourceChannel: DropdownData[] = [
  { id: 6, label: "Facbook", value: "6" },
  { id: 8, label: "Google", value: "8" },
];
export const optionFType: DropdownData[] = [
  { id: 1, label: "Tất cả", value: "all" },
  { id: 2, label: "F1", value: "F1" },
  { id: 3, label: "F2", value: "F2" },
  { id: 4, label: "F3", value: "F3" },
];

export const historiesCallType: DropdownData[] = [
  { id: 0, label: "Tất cả", value: "0" },
  { id: 1, label: "Gọi đến", value: "1" },
  { id: 2, label: "Gọi đi", value: "2" },
  // { id: 3, label: "Số nội bộ", value: "3" },
  { id: 4, label: "Gọi nhỡ", value: "4" },
  { id: 5, label: "Cuộc gọi vào nhóm trả lời", value: "5" },
  { id: 6, label: "Cuộc gọi vào nhóm nhỡ", value: "6" },
  { id: 7, label: "tất cả cuộc gọi nhỡ", value: "7" },
];

export const historiesCallSort: DropdownData[] = [
  { id: 0, label: "sắp xếp thời gian giảm dần", value: "0" },
  { id: 1, label: "sắp xếp thời gian tăng dần", value: "1" },
];

export const dataReportGrowthExample: any[] = [
  {
    stt: 1,
    date: new Date(),
    investment_money: 10000000,
    customer: 49,
    revenue: 323600000,
    cost: 500000,
    gross_profit: 5600000,
  },
];
export const dataReportGrowthDetailExample: any[] = [
  { date: new Date(), company: 'Doctor Check - Tầm Soát Bệnh', lauch_source: 'Facebook', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Doctor Check - Tầm Soát Bệnh', lauch_source: 'Google', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Doctor Check - Tầm Soát Bệnh', lauch_source: 'Tiktok', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Endo Clinic', lauch_source: 'Facebook', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Endo Clinic', lauch_source: 'Google', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Endo Clinic', lauch_source: 'Tiktok', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
  { date: new Date(), company: 'Doctor Check - Tầm Soát Bệnh', lauch_source: 'Bác sĩ chỉ định', investment_money: 10000000, customer: 49, revenue: 323600000, cost: 500000, gross_profit: 5600000, },
];

export const optionReportGrowth: GroupRadioType[] = [
  { id: 1, label: "Doctor Check", value: "doctorcheck", color: "#007bff", level: "1" },
  { id: 2, label: "Endo Clinic", value: "endo", color: "#28a745", level: "1", },
  { id: 3, label: "BSCĐ", value: "bscd", color: "orange", level: "1", },
  { id: 4, label: "Tổng kết", value: "summary", color: "#f00", level: "1" },
];

export const sendMessagetype: GroupRadioType[] = [
  { id: 1, label: "SMS", value: "SMS", color: "#007bff", level: "1" },
  { id: 2, label: "ZNS", value: "ZNS", color: "#007bff", level: "1" },
  { id: 3, label: "Facebook Chat", value: "fbchat", color: "#007bff", level: "1" },
  { id: 4, label: "Zalo Chat", value: "zalochat", color: "#007bff", level: "1" },
  { id: 5, label: "Email", value: "email", color: "#007bff", level: "1" },
];

export const interactionHistoryType: GroupRadioType[] = [
  { id: 1, label: "Ghi chú", value: "cs", color: "#007bff", level: "1" },
  { id: 3, label: "Đối tác", value: "affiliate", color: "#dc3545", level: "1" },
];

export const optionCancelBooking: GroupRadioType[] = [
  {
    id: 1,
    label: "Khách hàng không nghe máy",
    value: "1",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Khách hàng bận việc đột xuất",
    value: "2",
    color: "#333",
    level: "1",
  },
  { id: 3, label: "Khách hàng bị bệnh", value: "3", color: "#333", level: "1" },
  { id: 4, label: "Khách đã đi khám nơi khác", value: "4", color: "#333", level: "1", },
  { id: 5, label: "Do thời tiết (mưa bão)", value: "5", color: "#333", level: "1", },
  { id: 7, label: "KH hết bệnh", value: "7", color: "#333", level: "1", },
  { id: 8, label: "KH chưa hết thuốc", value: "8", color: "#333", level: "1", },
  { id: 6, label: "Khác", value: "6", color: "#333", level: "1" },
];

export const optionNoteAppointmentView: GroupRadioType[] = [
  { id: 1, label: "Gọi xác nhận -> KH ok", value: "1", color: "#333", level: "1", },
  { id: 2, label: "Gọi xác nhận -> KH ok, muốn làm thêm dịch vụ", value: "2", color: "#333", level: "1", },
  { id: 3, label: "Gọi xác nhận -> KH ok, xổ tại PK", value: "3", color: "#333", level: "1" },
  { id: 4, label: "Gọi xác nhận -> KH không nghe máy", value: "4", color: "#333", level: "1", },
  { id: 5, label: "Hủy lịch", value: "5", color: "#333", level: "1", },
  { id: 6, label: "Khác", value: "6", color: "#333", level: "1" },
];

export const ExampleDataCustomersss = {
  data: {
    card_survey_id: "aa750e7a-3e4a-4e71-8313-adb1044e9840",
    survey_id: "c715788f-1a15-4419-aa7d-189eedae2666",
    customer_id: "DC23081615280005",
    master_id: null,
    survey_type: "CSKTQ",
    survey_version: "v1",
    survey_title: "KỊCH BẢN CSKH - KHÁM TỔNG QUÁT",
    card: {
      q1: "Xác nhận thông tin hành chính:",
      q1_fullname_text: "CSKTQ",
      q1_gender_text: null,
      q1_yob_text: "1996",
      q1_phone_text: "0283048230",
      q9: `{{PREFIX_NAME}} có sử dụng BHYT hay BHTN không?`,
      q9_bhyt: false,
      q9_bhtn: false,
      q10: "{{PREFIX_NAME}} đăng kí ở đâu",
      q10_text: "",
      q2: "Chị Csktq đã từng trải nghiệm dịch vụ khám tổng quát ở cơ sở y tế nào chưa?",
      q2_tn_yes: true,
      q2_tn_no: false,
      q3: "Chị Csktq có hay đi khám định kỳ không?",
      q3_kdk_yes: true,
      q3_kdk_no: false,
      q4: "Lần khám trước cách đây bao lâu?",
      q4_tsb_text: "1 NĂM",
      q5: "Tiền sử bệnh của Chị Csktq?",
      q5_time_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q6: "Bệnh sử của Chị Csktq?",
      q6_time_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q7: "Chị Csktq có triệu chứng bất thường gần đây không?",
      q7_time_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q8: "Thông tin khác",
      q8_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  },
  message: "Danh sách câu hỏi CSKH trước khi đến khám!",
  status: true,
  client_ip: "192.168.11.30",
};
export const ExampleDataCustomerssss = {
  data: {
    card_survey_id: "2acbd041-ce9f-42b2-a4a6-28fcc6101af3",
    survey_id: "4fc8ca35-ae12-433e-b554-32fa8815ddc8",
    customer_id: "DC23081613200004",
    master_id: null,
    survey_type: "CSTH",
    survey_version: "v1",
    survey_title: "KỊCH BẢN CSKH - KHÁM TIÊU HOÁ",
    card: {
      q1: "Xác nhận thông tin hành chính:",
      q1_fullname_text: "Nguyen CSTH",
      q1_gender_text: null,
      q1_yob_text: "1993",
      q1_phone_text: "09898989800",
      q11: `{{PREFIX_NAME}} có sử dụng BHYT hay BHTN không?`,
      q11_no: false,
      q11_bhyt: false,
      q11_bhtn: false,
      q12: `{{PREFIX_NAME}} đăng kí {{BHYT || BHTN}} ở đâu`,
      q12_text: "",
      q2: "Bệnh lý của Anh Csth?",
      q2_dd: true,
      q2_dt: true,
      q2_dtt: false,
      q3: "Triệu chứng của Anh Csth?",
      q3_tc_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q4: "Tiền sử bệnh của Anh Csth?",
      q4_tsb_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q5: "Bệnh sử của Anh Csth?",
      q5_bs_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      q6: "Anh Csth đã bị bao lâu rồi",
      q6_time_text: "2 tháng",
      q7: "Anh Csth đã từng điều trị ở đâu chưa?",
      q7_time_text: "chưa",
      q8: "Anh Csth đã từng nội soi chưa?",
      q8_ns_no: false,
      q8_ns_yes: true,
      q8_1: "Loại nội soi Anh Csth đã thực hiện:",
      q3_nsddt: false,
      q3_nsddm: true,
      q3_nsdtt: true,
      q3_nsdtm: false,
      q3_nsct: false,
      q3_nscm: false,
      q8_2: "Lần nội soi gần nhất",
      q8_2_time_text: "2 năm",
      q8_3: "Kết quả của Anh Csth:",
      q8_3_khb_yes: false,
      q8_3_khb_no: true,
      q8_4_tp_yes: false,
      q8_4_tp_no: false,
      q8_4_tp_: false,
      q9: "Mong muốn của Anh Csth:",
      q9_time_text: "Hết bệnh",
      q10: "Thông tin khác",
      q10_text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  },
  message: "Danh sách câu hỏi CSKH trước khi đến khám!",
  status: true,
  client_ip: "192.168.11.30",
};

export const ExampleXNData = [
  {
    id: "4cdfbda0-5093-4616-b1f5-6552ff3a7955",
    servicespoint_detail_id: "2e66ae3d-708c-4518-8ede-16941e544470",
    servicepoint_create_date: "2023-08-13T07:28:49.71+07:00",
    labtests_id: "XNHH0101",
    labtests_sid: "130823-1002",
    labtests_tube_id: "WB3",
    labtests_tube_name: "ống WB3 (xanh dương)",
    labtests_name: "WBC",
    labtests_result: "7.8",
    is_normal: true,
    is_higher: false,
    is_lower: false,
    is_abnormal_result: true,
    labtests_group_id: "XNHH",
    labtests_group_name: "Xét nghiệm huyết học",
    result_group_header: null,
    service_id: "XNHH01",
    service_name: "Tổng Phân Tích Tế Bào Máu (Công Thức Máu)",
    normal_index: "4 - 10",
    higher_index: 10.0,
    lower_index: 4.0,
    min_abnormal_index: 2.0,
    max_abnormal_index: 50.0,
    unit_id: "K/uL",
    description: null,
    machine_id: "XN-M-001",
    machine_name: "Máy huyết học Cell Dyn Rubby",
    create_date: "2023-08-13T08:07:47.317+07:00",
    labtests_result_time: "2023-08-13T08:28:15.697+07:00",
    technician_employee_id: "NV00069",
    approved_employee_id: "NV00069",
    group_order_number: 30,
    order_number: 1,
    is_has_result: true,
    is_sent_to_out: null,
    is_approved: true,
    is_excuted: null,
    is_show_after_approved: null,
    is_machine_auto: true,
  },
];

export const optionTyeAddCustomer = [
  {
    label: "Nội Soi",
    value: "NS",
  },
  {
    label: "Khám Tổng Quát",
    value: "KTQ",
  },
];

export const OptionStatusAfterExams: DropdownData[] = [
  { id: 1, label: "Tất cả", value: "all" },
  { id: 2, label: "Dời ngày thực hiện", value: "delay" },
  { id: 3, label: "Tái khám", value: "reexam" },
  { id: 4, label: "Chưa thực hiện", value: "checkin" },
  { id: 5, label: "Đang phục vụ", value: "inprogress" },
  { id: 6, label: "Đã xong", value: "done" },
];
export const optionStateJobs: DropdownData[] = [
  { id: 1, label: "Mới", value: "new" },
  { id: 2, label: "Dời ngày thực hiện", value: "inprogress" },
  { id: 3, label: "Tái khám", value: "done" },
  { id: 4, label: "Chưa thực hiện", value: "cancel" },
  { id: 5, label: "Đang phục vụ", value: "delay" },
];

export const OptionBH: DropdownData[] = [
  {
    id: 1,
    label: "Không dùng",
    value: "1",
  },
  {
    id: 2,
    label: "BHYT",
    value: "2",
  },
  {
    id: 3,
    label: "BHTN",
    value: "3",
  },
];
export const OptionTypeCustomer: DropdownData[] = [
  {
    id: 1,
    label: "KH mới",
    value: "1",
  },
  {
    id: 2,
    label: "KH cũ - DV mới",
    value: "2",
  },
  {
    id: 3,
    label: "KH cũ",
    value: "3",
  },
  {
    id: 4,
    label: "Tái khám",
    value: "4",
  },
  {
    id: 5,
    label: "Chưa chăm sóc",
    value: "5",
  },
  {
    id: 6,
    label: "Đã chăm sóc",
    value: "6",
  },
];

export const OptionTypeCustomerBooking: DropdownData[] = [
  {
    id: 1,
    label: "KH mới",
    value: "1",
  },
  {
    id: 2,
    label: "KH cũ - DV mới",
    value: "2",
  },
  {
    id: 3,
    label: "KH cũ",
    value: "3",
  },
  {
    id: 4,
    label: "Tái khám",
    value: "4",
  },
];


export const OptionPhare: DropdownData[] = [
  {
    id: 1,
    label: "Quan Tâm",
    value: "30",
  },
  {
    id: 2,
    label: "Cân nhắc",
    value: "31",
  },
  {
    id: 3,
    label: "Cho Số Điện Thoại",
    value: "32",
  },
  {
    id: 4,
    label: "Đặt Hẹn",
    value: "33",
  },
  {
    id: 5,
    label: "Huỷ Lịch",
    value: "34",
  },
  {
    id: 6,
    label: "Dời Lịch",
    value: "35",
  },
];

export const exampleDataItemAppointmentView = [
  {
    service_id: "XNHH01",
    service_name: "Tổng Phân Tích Tế Bào Máu (Công Thức Máu)",
    service_group_type: "XN",
    service_group_name: "",
    service_group_order_number: 20,
    quantity: 1.0,
    unit_name: "Lần",
    service_prices: 75000.0,
  },
];

export const dataExampleForBookingSchedule = [
  {
    id: 14,
    time_range: "06:30 - 07:00",
    date: "2023-08-08",
    master_count: 3,
    appointment_slot_limit: 5,
    appointment_slot_left: 0,
    appointment_command_datetime: "2023-08-08T06:35:01+07:00",
    order_number: 14,
    is_show: true,
    master_id: "23072709430014",
    customer_id: "DC23072709430008",
    customer_fullname: "LÊ VĂN TOÀN",
    customer_phone: "+84-792328631",
    customer_full_address:
      "1034/8 Đường Trường Sa, Phường 13, Quận Phú Nhuận, Thành Phố Hồ Chí Minh",
    gender_id: "M",
    gender_name: "Nam",
    year_of_birth: 1949,
    launch_source_id: 14,
    launch_source_name: "Facebook Tiêu Hoá - Chat Messenger",
    affiliate_name: null,
    affiliate_type: null,
    appointment_note: "KHám TQ-560k",
    appointment_date: "2023-08-08T07:00:00+07:00",
    register_date: null,
    register_delay_date: null,
    is_register_delay: null,
    status: "new",
    alt_status_display: "KH Mới",
    status_display: "Chưa đến",
    reexam_display: "",
    status_color: "#FFFCCC",
    status_fontcolor: "#FFFA99",
  },
];

export const administrative: AdministrativeItem[] = [
  {
    id: 0,
    name: "Họ tên",
    type: "name",
  },
  {
    id: 1,
    name: "Giới tính",
    type: "gender",
  },
  {
    id: 2,
    name: "Năm sinh",
    type: "yearOfBirth",
  },
  {
    id: 3,
    name: "Nghề nghiệp",
    type: "carrer",
  },
  {
    id: 4,
    name: "Điện thoại",
    type: "phone",
  },
  {
    id: 6,
    name: "Đối tượng",
    type: "object",
  },
  {
    id: 7,
    name: "Mã thẻ",
    type: "ticketId",
  },
  {
    id: 8,
    name: "Thời hạn thẻ",
    type: "timeTicket",
  },
  {
    id: 5,
    name: "Địa chỉ",
    type: "address",
  },
  {
    id: 9,
    name: "Nơi KCB ban đầu",
    type: "KCB",
  },
  {
    id: 10,
    name: "Ngày khám",
    type: "date_medical",
  },
  {
    id: 11,
    name: "BS khám bệnh",
    type: "doctor",
  },
  {
    id: 12,
    name: "BS kê toa",
    type: "doctorPrescribes",
  },
];

export const DemoTicket = [
  {
    id: 0,
    ticket_name: "Hỏi thăm tình trạng sức khỏe",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    start: new Date(2023, 4, 4, 9, 0, 0),
    end: new Date(2022, 4, 5, 9, 30, 0),
    level: "high",
    type: "note",
    isDone: false,
  },
  {
    id: 1,
    ticket_name: "Hỏi thăm tình trạng sức khỏe",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    start: new Date(2023, 4, 4, 9, 0, 0),
    end: new Date(2022, 4, 5, 9, 30, 0),
    level: "medium",
    type: "note",
    isDone: false,
  },
  {
    id: 2,
    ticket_name: "Hỏi thăm tình trạng sức khỏe",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    start: new Date(2023, 4, 4, 9, 0, 0),
    end: new Date(2022, 4, 5, 9, 30, 0),
    level: "high",
    type: "note",
    isDone: false,
  },
  {
    id: 3,
    ticket_name: "Hỏi thăm tình trạng sức khỏe",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    start: new Date(2023, 4, 4, 9, 0, 0),
    end: new Date(2022, 4, 5, 9, 30, 0),
    level: "low",
    type: "note",
    isDone: false,
  },
  {
    id: 4,
    ticket_name: "Hỏi thăm tình trạng sức khỏe",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    start: new Date(2023, 4, 4, 9, 0, 0),
    end: new Date(2022, 4, 5, 9, 30, 0),
    level: "medium",
    type: "note",
    isDone: false,
  },
];

export const TableDashboard = [
  {
    id: "0",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
  {
    id: "1",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
  {
    id: "2",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
  {
    id: "3",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
  {
    id: "4",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
  {
    id: "5",
    createdDate: new Date("2022-01-05T00:00:00Z"),
    chatDate: new Date("2022-01-05T00:00:00Z"),
    name: "Nguyen Văn A",
    customerType: "contact",
    dayOfBirth: new Date("2022-01-05T00:00:00Z"),
    gender: true,
    phoneNumber: "0986869466",
    state: "new",
    origin: "Facebook - Trung tâm nội soi",
    tag: "",
    follower: "",
  },
];

export const HeaderCell = [
  { id: -1, name: "", width: 50 },
  { id: 0, name: "Ngày tạo", width: 50 },
  { id: 1, name: "Ngày chat", width: 50 },
  { id: 2, name: "Họ tên", width: 100 },
  { id: 3, name: "Năm sinh", width: 50 },
  { id: 4, name: "Giới tính", width: 50 },
  { id: 5, name: "Điện thoại", width: 100 },
  { id: 6, name: "Trạng thái", width: 50 },
  { id: 7, name: "Nguồn", width: 100 },
  { id: 8, name: "Tag/ Ghi chú", width: 200 },
  { id: 9, name: "", width: 50 },
  { id: 10, name: "", width: 50 },
  { id: 11, name: "", width: 50 },
  { id: 12, name: "", width: 50 },
  { id: 12, name: "", width: 50 },
];

export const OptionType = [
  { id: 0, label: "Tất cả", value: "1" },
  { id: 1, label: "Tìm hiểu thông tin", value: "2" },
  { id: 2, label: "Khách hàng có nhu cầu", value: "3" },
  { id: 3, label: "Khách hàng tiềm năng", value: "4" },
  { id: 4, label: "Lịch đã hủy", value: "5" },
  { id: 5, label: "Lịch đã đặt", value: "6" },
  { id: 6, label: "Đã đến", value: "7" },
];
export const OptionCustomerCareStaff = [
  { id: 0, label: "Tất cả", value: "1" },
  { id: 1, label: "CS. Lê Thị Kim Giang", value: "2" },
  { id: 2, label: "CS. QUánh Thu Trang", value: "3" },
  { id: 3, label: "Lê Thị Yến Nhi", value: "4" },
  { id: 4, label: "Nguyễn Thị Tố Quyên", value: "5" },
];
export const OptionCustomerCareStaff1 = [
  { id: 1, label: "CS. Lê Thị Kim Giang", value: "2" },
  { id: 2, label: "CS. QUánh Thu Trang", value: "3" },
  { id: 3, label: "Lê Thị Yến Nhi", value: "4" },
  { id: 4, label: "Nguyễn Thị Tố Quyên", value: "5" },
];

export const OptionLevel = [
  { id: 1, label: "Cao", value: "2" },
  { id: 2, label: "Bình thường", value: "3" },
  { id: 3, label: "Không ưu tiên", value: "5" },
];

export const OptionGender = [
  { id: 1, label: "Nam", value: "Nam" },
  { id: 2, label: "Nữ", value: "Nữ" },
];
export const OptionPartnar = [
  { id: 1, label: "BS. Lê Thành Nhân", value: "BS. Lê Thành Nhân" },
  {
    id: 2,
    label: "BS QUãng Thành Vĩnh Niên",
    value: "BS QUãng Thành Vĩnh Niên",
  },
  { id: 3, label: "BS Sy Quốc Nhân", value: "BS Sy Quốc Nhân" },
];
export const OptionCategorySearch = [
  { id: 1, label: "Khách hàng", value: "1" },
  { id: 2, label: "Lịch trước khám", value: "2" },
];

export const OptionCountry = [{ key: "VN", label: "Việt Nam", value: "VN" }];
export const OptionNation = [
  { id: 1, label: "Kinh", value: "Kinh" },
  { id: 2, label: "Hoa", value: "Hoa" },
  { id: 3, label: "Tày", value: "Tày" },
  { id: 4, label: "Thái", value: "Thái" },
  { id: 5, label: "Mường", value: "Mường" },
  { id: 6, label: "Hmong", value: "Hmong" },
  { id: 7, label: "Khmer", value: "Khmer" },
  { id: 8, label: "Nùng", value: "Nùng" },
];
export const OptionGroupJob = [
  { id: 1, label: "Giải phẩu bệnh", value: "1" },
  { id: 2, label: "Xét nghiệm", value: "2" },
  { id: 3, label: "Liệu trình", value: "3" },
  { id: 4, label: "Tái khám", value: "4" },
  { id: 5, label: "Tầm soát", value: "5" },
  { id: 6, label: "Khác", value: "6" },
];
export const OptionResponsibleJob = [
  { id: 1, label: "Bác sĩ tiêu hóa", value: "1" },
  { id: 2, label: "Bác sĩ nội soi", value: "2" },
  { id: 3, label: "Bác sĩ gây mê hòi sức", value: "3" },
  { id: 4, label: "Bác sĩ chuẩn đoán hình ảnh", value: "4" },
  { id: 5, label: "Điều dưỡng", value: "5" },
  { id: 6, label: "Xét nghiệm và giải phẫu bệnh", value: "6" },
  { id: 7, label: "Chăm sóc khách hàng", value: "7" },
  { id: 8, label: "Dịch vụ", value: "8" },
];
export const methodFortemplate = [
  { id: 1, label: "{{name}}}", value: "{{name}}}" },
  { id: 1, label: "{{gender}}}", value: "{{gender}}}" },
  { id: 1, label: "{{position}}}", value: "{{position}}}" },
  { id: 1, label: "{{email}}}", value: "{{name}}}" },
];

export const OptionOriginPresenter = [
  { id: 0, label: "Tất cả", value: "Tất cả" },
  { id: 1, label: "Đến tại phòng khám", value: "Đến tại phòng khám" },
  { id: 2, label: "Bác sĩ chỉ định", value: "Bác sĩ chỉ định" },
  { id: 3, label: "ERP", value: "ERP" },
  {
    id: 4,
    label: "App Mobile - Doctor Check Member",
    value: "App Mobile - Doctor Check Member",
  },
  { id: 5, label: "Nội bộ", value: "Nội bộ" },
  { id: 6, label: "Đã đến", value: "Đã đến" },
  {
    id: 7,
    label: "Google Ads - Đặt lịch hẹn trên web",
    value: "Google Ads - Đặt lịch hẹn trên web",
  },
  {
    id: 8,
    label: "Google Ads - Hotline trên web",
    value: "Google Ads - Hotline trên web",
  },
  {
    id: 9,
    label: "Google Ads - Hotline quảng cao",
    value: "Google Ads - Hotline quảng cao",
  },
  { id: 10, label: "Google Ads - Zalo chat", value: "Google Ads - Zalo chat" },
  { id: 11, label: "Google - Search", value: "Google - Search" },
  {
    id: 12,
    label: "Facebook Ads - Đặt lịch hẹn trên web",
    value: "Facebook Ads - Đặt lịch hẹn trên web",
  },
  {
    id: 13,
    label: "Facebook Ads - Hotline trên web",
    value: "Facebook Ads - Hotline trên web",
  },
  {
    id: 14,
    label: "Facebook Ads - Hotline quảng cao",
    value: "Facebook Ads - Hotline quảng cao",
  },
  {
    id: 15,
    label: "Facebook Ads - Zalo chat",
    value: "Facebook Ads - Zalo chat",
  },
  {
    id: 16,
    label: "Facebook Ads - chat Messenger",
    value: "Facebook Ads - chat Messenger",
  },
  { id: 17, label: "Booking Care", value: "18" },
  { id: 18, label: "Người giới thiệu", value: "Người giới thiệu" },
  { id: 19, label: "Bến xe miền tây", value: "Bến xe miền tây" },
];
export const OptionOriginPresenter1 = [
  { id: 1, label: "Đến tại phòng khám", value: "Đến tại phòng khám" },
  { id: 2, label: "Bác sĩ chỉ định", value: "Bác sĩ chỉ định" },
  { id: 3, label: "ERP", value: "ERP" },
  {
    id: 4,
    label: "App Mobile - Doctor Check Member",
    value: "App Mobile - Doctor Check Member",
  },
  { id: 5, label: "Nội bộ", value: "Nội bộ" },
  { id: 6, label: "Đã đến", value: "Đã đến" },
  {
    id: 7,
    label: "Google Ads - Đặt lịch hẹn trên web",
    value: "Google Ads - Đặt lịch hẹn trên web",
  },
  {
    id: 8,
    label: "Google Ads - Hotline trên web",
    value: "Google Ads - Hotline trên web",
  },
  {
    id: 9,
    label: "Google Ads - Hotline quảng cao",
    value: "Google Ads - Hotline quảng cao",
  },
  { id: 10, label: "Google Ads - Zalo chat", value: "Google Ads - Zalo chat" },
  { id: 11, label: "Google - Search", value: "Google - Search" },
  {
    id: 12,
    label: "Facebook Ads - Đặt lịch hẹn trên web",
    value: "Facebook Ads - Đặt lịch hẹn trên web",
  },
  {
    id: 13,
    label: "Facebook Ads - Hotline trên web",
    value: "Facebook Ads - Hotline trên web",
  },
  {
    id: 14,
    label: "Facebook Ads - Hotline quảng cao",
    value: "Facebook Ads - Hotline quảng cao",
  },
  {
    id: 15,
    label: "Facebook Ads - Zalo chat",
    value: "Facebook Ads - Zalo chat",
  },
  {
    id: 16,
    label: "Facebook Ads - chat Messenger",
    value: "Facebook Ads - chat Messenger",
  },
  { id: 17, label: "Booking Care", value: "18" },
  { id: 18, label: "Người giới thiệu", value: "Người giới thiệu" },
  { id: 19, label: "Bến xe miền tây", value: "Bến xe miền tây" },
];

export const HeaderExcel = [
  { label: "Tên trên MXH", key: "name" },
  { label: "Họ tên", key: "name" },
  { label: "Số điện thoại", key: "phoneNumber" },
  { label: "Ngày sinh", key: "dayOfBirth" },
  { label: "Kênh", key: "chanel" },
  { label: "Nguồn", key: "origin" },
  { label: "Ngày đăng kí", key: "state" },
  { label: "Ngày đặt lịch", key: "partner" },
  { label: "Tên người phụ trách", key: "customerID" },
  { label: "SDDV", key: "sddv" },
  { label: "Địa chỉ", key: "customerAdress" },
  { label: "Ghi chú khách hàng", key: "note" },
  { label: "Số lượng đặt lịch", key: "assign" },
  { label: "Số lượng hủy lịch", key: "assign" },
];

export const OptionMediaType: GroupRadioType[] = [
  {
    id: 1,
    label: "Ảnh",
    value: "PHOTO",
    color: "#1976D2",
    level: "1",
    type: "image",
  },
  {
    id: 2,
    label: "Video",
    value: "VIDEO",
    color: "#1976D2",
    level: "1",
    type: "video/mp4",
  },
  {
    id: 3,
    label: "File",
    value: "DOCUMENT",
    color: "#1976D2",
    level: "1",
    type: "application/pdf",
  },
];
export const OptionCustomerTask: GroupRadioType[] = [
  {
    id: 0,
    label: "Tất cả",
    value: "all",
    color: "#333",
    level: "1",
  },
  {
    id: 1,
    label: "Đang thực hiện",
    value: "inprogress",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Đã hoàn thành",
    value: "done",
    color: "#1976D2",
    level: "1",
  },
  {
    id: 3,
    label: "Dời ngày",
    value: "delay",
    color: "#6ea5db",
    level: "1",
  },
  {
    id: 4,
    label: "Đã hủy",
    value: "canceled",
    color: "#f00",
    level: "1",
  },
  
];
export const OptionCustomerTask1: GroupRadioType[] = [
  {
    id: 0,
    label: "Tất cả",
    value: "all",
    color: "#333",
    level: "1",
  },
  {
    id: 1,
    label: "Chưa phân công",
    value: "new",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Đã phân công",
    value: "inprogress",
    color: "#1976D2",
    level: "1",
  },
  {
    id: 3,
    label: "Dời lại",
    value: "delay",
    color: "#6ea5db",
    level: "1",
  },
  {
    id: 4,
    label: "Huỷ",
    value: "cancel",
    color: "#f00",
    level: "1",
  },
  {
    id: 5,
    label: "Đã hoàn thành",
    value: "done",
    color: "#28a745",
    level: "1",
  },
];
export const OptionCustomerTaskDropdown: DropdownData[] = [
  { id: 99, label: "Tất cả", value: "all" },
  {
    id: 1,
    label: "Chưa phân công",
    value: "new",
  },
  {
    id: 2,
    label: "Đã phân công",
    value: "inprogress",
  },
  {
    id: 3,
    label: "Dời lại",
    value: "delay",
  },
  {
    id: 4,
    label: "Huỷ",
    value: "cancel",
  },
  {
    id: 5,
    label: "Đã hoàn thành",
    value: "done",
  },
];
export const OptionMyTaskDropdown: DropdownData[] = [
  { id: 99, label: "Tất cả", value: "all" },
  { id: 1, label: "Chưa phân công", value: "new" },
  { id: 2, label: "Đang thực hiện", value: "inprogress" },
  { id: 3, label: "Dời lại", value: "delay" },
  { id: 4, label: "Huỷ", value: "canceled" },
  { id: 5, label: "Đã hoàn thành", value: "done" },
];
export const optionStatusAffiliate: DropdownData[] = [
  { id: 1, label: "Chưa đến", value: "new", color: '#f00' },
  { id: 2, label: "Đã đến", value: "checkin", color: '#00b6ff' },
  { id: 2, label: "Đang thực hiện", value: "inprogress", color: '#007bff' },
  { id: 3, label: "Dời ngày", value: "delay", color: '#fd7e14' },
  { id: 4, label: "Đã hủy", value: "canceled", color: '#f00' },
  { id: 5, label: "Đã khám xong", value: "done", color: '#28a745' },
];

export const exampleStateCustomer: GroupRadioType[] = [
  {
    id: 0,
    label: "Bình Thường",
    value: "0",
    color: "#353b41",
    level: "1",
  },
  {
    id: 1,
    label: "Quan trọng",
    value: "1",
    color: "#DC3545",
    level: "2",
  },
  {
    id: 2,
    label: "Đặt lịch",
    value: "2",
    color: "#20C997",
    level: "3",
  },
  {
    id: 3,
    label: "Hủy lịch",
    value: "3",
    color: "#6f42c1",
    level: "4",
  },
  {
    id: 4,
    label: "Tái khám",
    value: "4",
    color: "#17a2b8",
    level: "5",
  },
];
export const exampleStateCustomers: GroupRadioType[] = [
  {
    id: 10,
    label: "Tất cả",
    value: "10",
    color: "#353b41",
    level: "5",
  },
  {
    id: 0,
    label: "HIS",
    value: "0",
    color: "#20C997",
    level: "1",
  },
  {
    id: 1,
    label: "Quan trọng",
    value: "1",
    color: "#DC3545",
    level: "2",
  },
  {
    id: 2,
    label: "Đặt lịch",
    value: "2",
    color: "#20C997",
    level: "3",
  },
  {
    id: 3,
    label: "Hủy lịch",
    value: "3",
    color: "#6f42c1",
    level: "4",
  },
  {
    id: 4,
    label: "Tái khám",
    value: "4",
    color: "#17a2b8",
    level: "5",
  },
];
export const optionStateJob: GroupRadioType[] = [
  {
    id: 0,
    label: "Chưa phân công",
    value: "0",
    color: "#353b41",
    level: "1",
  },
  {
    id: 1,
    label: "Đã phân công",
    value: "1",
    color: "#DC3545",
    level: "2",
  },
  {
    id: 2,
    label: "Dời lại",
    value: "2",
    color: "#20C997",
    level: "3",
  },
  {
    id: 3,
    label: "Hủy",
    value: "3",
    color: "#6f42c1",
    level: "4",
  },
  {
    id: 4,
    label: "Đã hoàn thành",
    value: "4",
    color: "#17a2b8",
    level: "5",
  },
];
export const optionDate: GroupRadioType[] = [
  {
    id: 0,
    label: "Hôm qua",
    value: moment(new Date()).subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#f00",
    level: "1",
  },
  {
    id: 1,
    label: "Hôm nay",
    value: moment(new Date()).subtract(0, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#3471e4",
    level: "2",
  },
  {
    id: 2,
    label: "Ngày mai",
    value: moment(new Date()).add(1, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#ffb301",
    level: "3",
  },
];
export const optionDate2: GroupRadioType[] = [
  {
    id: 0,
    label: "Hôm qua",
    value: moment(new Date()).subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#f00",
    level: "1",
  },
  {
    id: 1,
    label: "Hôm nay",
    value: moment(new Date()).subtract(0, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#3471e4",
    level: "2",
  },
];
export const optionDate3: GroupRadioType[] = [
  {
    id: 0,
    label: "Theo ngày",
    value: moment(new Date()).subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#f00",
    level: "1",
  },
  {
    id: 1,
    label: "Theo tháng",
    value: moment(new Date()).subtract(0, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#3471e4",
    level: "2",
  },
  {
    id: 2,
    label: "Theo năm",
    value: moment(new Date()).add(1, "days").format("YYYY-MM-DD 00:00:00"),
    color: "#ffb301",
    level: "3",
  },
];
export const optionTypeCompare: GroupRadioType[] = [
  {
    id: 0,
    label: "Ngày",
    value: 'days',
    color: "#f00",
    level: "1",
  },
  {
    id: 1,
    label: "Tuần",
    value: 'week',
    color: "#ffb301",
    level: "2",
  },
];


export const optionTypeReportChannel: GroupRadioType[] = [
  {
    id: 0,
    label: "Ngày",
    value: 'days',
    color: "#f00",
    level: "1",
  },
  {
    id: 1,
    label: "Tuần",
    value: 'week',
    color: "#ffb301",
    level: "2",
  },
  {
    id: 2,
    label: "Khoảng thời gian",
    value: 'range',
    color: "#0188ff",
    level: "3",
  },
];

export const optionBooking12: GroupRadioType[] = [
  {
    id: 0,
    label: "Lần đầu khám",
    value: "services",
    color: "#28a745",
    level: "1",
  },
  {
    id: 1,
    label: "Tái khám",
    value: "reexam",
    color: "#17a2b8",
    level: "2",
  },
  {
    id: 2,
    label: "Telemedicine",
    value: "telemedicine",
    color: "#dc3545",
    level: "3",
  },
  {
    id: 3,
    label: "Gói dịch vụ",
    value: "package",
    color: "#20c997",
    level: "3",
  },
  {
    id: 4,
    label: "Dịch vụ nội soi",
    value: "endoscopics",
    color: "#ff8111",
    level: "4",
  },
];

export const OptionCustomerPortraitAddNew: GroupRadioType[] = [
  {
    id: 2,
    label: "Tiêu hóa",
    value: "NS",
    color: "#28a745",
    level: "2",
  },
  {
    id: 1,
    label: "Khám tổng quát",
    value: "KTQ",
    color: "#dc3545",
    level: "1",
  },
];
export const OptionCustomerPortrait1: GroupRadioType[] = [
  {
    id: 2,
    label: "Tiêu hóa",
    value: "NS",
    color: "#28a745",
    level: "2",
  },
  {
    id: 1,
    label: "Khám tổng quát",
    value: "KTQ",
    color: "#dc3545",
    level: "1",
  },
  {
    id: 4,
    label: "Bác sĩ chỉ định",
    value: "BSCD",
    color: "#333",
    level: "1",
  },
  // {
  //   id: 3, label: 'Tầm soát ung thư', value: 'tamsoat', color: '#333', level: '1'
  // },
];

export const OptionCustomerPortraitDigestiveExamination2: GroupRadioType[] = [
  {
    id: 1,
    label: "Chưa",
    value: "chua",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Đã từng",
    value: "roi",
    color: "#333",
    level: "2",
  },
];
export const OptionPackage: GroupRadioType[] = [
  {
    id: 1,
    label: "Gói",
    value: "package",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Không gói",
    value: "services",
    color: "#333",
    level: "2",
  },
];
export const OptionCustomerPortraitDigestiveExamination3: GroupRadioType[] = [
  {
    id: 1,
    label: "Không hết",
    value: "chua",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Có hết nhưng sau đó tái lại",
    value: "roi",
    color: "#333",
    level: "2",
  },
];
export const OptionYesNo: GroupRadioType[] = [
  {
    id: 1,
    label: "Có",
    value: "yes",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "không",
    value: "no",
    color: "#333",
    level: "2",
  },
];
export const optionTyeAddCustomerRadio: GroupRadioType[] = [
  {
    id: 1,
    label: "Nội Soi",
    value: "NS",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Khám Tổng Quát",
    value: "KTQ",
    color: "#333",
    level: "2",
  },
];

export const OptionPostion: GroupRadioType[] = [
  {
    id: 1,
    label: "Tại nhà",
    value: "tainha",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Phòng khám",
    value: "taiphongkham",
    color: "#333",
    level: "2",
  },
  {
    id: 3,
    label: "Không biết",
    value: "khongbiet",
    color: "#333",
    level: "2",
  },
];

export const OptionCustomerPortraitDigestiveExamination_noisoi: GroupRadioType[] =
  [
    {
      id: 1,
      label: "Nội soi thường",
      value: "nst",
      color: "#333",
      level: "1",
    },
    {
      id: 2,
      label: "Nội Soi Tiền Mê",
      value: "nstm",
      color: "#333",
      level: "2",
    },
  ];

export const OptionCustomerPortraitDigestiveExamination_noisoi1: GroupRadioType[] =
  [
    {
      id: 1,
      label: "Không hết",
      value: "khonghet",
      color: "#333",
      level: "1",
    },
    {
      id: 2,
      label: "Tái lại",
      value: "taiphat",
      color: "#333",
      level: "2",
    },
    {
      id: 3,
      label: "Hết bệnh",
      value: "hetbenh",
      color: "#333",
      level: "2",
    },
  ];
export const OptionCustomerPortraitDigestiveExamination1: GroupRadioType[] = [
  {
    id: 1,
    label: "Dạ Dày",
    value: "daday",
    color: "#333",
    level: "1",
  },
  {
    id: 2,
    label: "Đại Tràng",
    value: "daitrang",
    color: "#333",
    level: "1",
  },
  {
    id: 3,
    label: "Đại trực tràng",
    value: "daitt",
    color: "#333",
    level: "1",
  },
];
export const OptionGroupCheckbox: GroupCheckBoxItem[] = [
  {
    label: "Dạ Dày",
    value: "daday",
  },
  {
    label: "Trực Tràng",
    value: "daitrang",
  },
  {
    label: "Đại trực tràng",
    value: "daitt",
  },
];
export const OptionGroupCheckboxTypedigestiveExamination: GroupCheckBoxItem[] =
  [
    { label: "Dạ Dày Thường", value: "ddt" },
    { label: "Đại Tràng Mê", value: "dtm" },
    { label: "Đại Tràng Thường", value: "dtt" },
    { label: "Nội Soi Cặp Mê", value: "nscm" },
    { label: "Dạ Dày Mê", value: "ddm" },
    { label: "Nội Soi Cặp Thường", value: "nsct" },
  ];

export const optionFilterAfterExams: GroupRadioType[] = [
  {
    id: 0,
    label: "Lọc theo ngày khám",
    value: "0",
    color: "#454545",
    level: "1",
  },
  {
    id: 1,
    label: "Lọc theo ngày cập nhật",
    value: "1",
    color: "#454545",
    level: "2",
  },
];
export const optionFilterAfterExamsTypeExport: GroupRadioType[] = [
  {
    id: 0,
    label: "Lọc theo tháng",
    value: "0",
    color: "#454545",
    level: "1",
  },
  {
    id: 1,
    label: "Lọc theo khoảng thời gian",
    value: "1",
    color: "#454545",
    level: "2",
  },
];

export const optionsLevelNote = [
  { id: 0, value: "cs", label: "Bình thường" },
  { id: 1, value: "importance", label: "Quan trọng" },
];

export const exampleDataSocial: InfosSocialAccount[] = [
  {
    id: 1,
    icon: "zalo_channel",
    name: "Nguyen Van A",
    usename: "dainq@doctorcheck.vn",
    type: "zalo",
  },
  {
    id: 2,
    icon: "facebook_channel",
    name: "Nguyen Van A",
    usename: "dainq@doctorcheck.vn",
    type: "facebook",
  },
];

export const listNotification: InfosNotify[] = [
  {
    id: 1,
    content: "Nhận thông báo tin nhắn mới",
    enable: false,
  },
  // {
  //   id: 2,
  //   content: 'Đẩy thông báo ra màng hình chính',
  //   enable: false,
  // },
  // {
  //   id: 3,
  //   content: 'Nhận thông báo về hoạt động khách hàng phụ trách',
  //   enable: false,
  // },
];


export const OptionYypeCampaign: DropdownData[] = [
  { id: 1, label: "SMS", value: "1" },
  { id: 2, label: "Email", value: "2" },
  { id: 3, label: "ZNS", value: "3" },
  { id: 4, label: "Messager", value: "4" },
];

export const OptionCampaign = [
  { id: 1, label: "SMS", value: "1" },
  { id: 2, label: "Email", value: "2" },
  { id: 3, label: "ZNS", value: "3" },
  { id: 4, label: "Tin nhắn cho Facebook", value: "4" },
];

export const OptionCustomerDestination = [
  { id: 4, label: "Tất cả", value: "4" },
  { id: 1, label: "Khách hàng tiềm năng", value: "1" },
  { id: 2, label: "Khách hàng khám lần đầu", value: "2" },
  { id: 3, label: "Khách hàng thường xuyên", value: "3" },
];

export const DataExampleForSMS: SMSInfos[] = [
  {
    id: 1,
    name: "Sip1",
    apiKey: "1223-2323-2332-5232",
    secretKey: "1223-2323-2332-5232",
    smsType: "sjs",
    branchName: "h",
    phone: "209823292387",
    isDisable: false,
  },
  {
    id: 2,
    name: "Sip2",
    apiKey: "1223-2323-2332-5232",
    secretKey: "1223-2323-2332-5232",
    smsType: "sjs",
    branchName: "h",
    phone: "0978129383",
    isDisable: true,
  },
];

export const ExampleDataForEmail: EmailInfos[] = [
  {
    id: 1,
    name: "Email cho Chăm sóc",
    apiKey: "2389-2343-2356-7657-4457",
    email: "chamsoc@doctorcheck.vn",
    senderName: "admin",
    isDisable: false,
  },
  {
    id: 2,
    name: "Email cho Chăm sóc 2",
    apiKey: "2389-2343-2356-7657-4457",
    email: "chamsoc@doctorcheck.vn",
    senderName: "admin",
    isDisable: true,
  },
];

export const templateExample =
  "<div> Khách đặt lịch từ website: www.doctorcheck.vn<br> Họ tên: <br> Điện thoại:<br> Ngày giờ đặt lịch:<br> Email: <br> Referer Page: <br> Ghi chú:</div>";

export const stateCustomerInList: DropdownData[] = [
  { id: 1, label: "Chờ khám", value: "new" },
  { id: 2, label: "Chờ khám - Đã gọi", value: "checkin" },
  { id: 3, label: "Đang khám", value: "inprogress" },
  { id: 4, label: "Đã khám xong", value: "done" },
  { id: 5, label: "Đã huỷ", value: "canceled" },
];

export const surveyExample = {
  q6: "Quý khách hàng có tiền sử bị bất kỳ bệnh lý nào dưới đây không?",
  q6_tmg_yes: "Bất thường xét nghiệm gan/ tăng men gan",
  q6_vg_yes: "Viêm gan",
  q6_bgm_yes: "Bệnh gan mật",
  q6_vlddtt_yes: "Viêm loét dạ dày tá tràng",
  q6_nhp_yes: "Nhiễm Hp",
  q6_vldt_yes: "Viêm loét đại tràng",
  q6_pldtt_yes: "Polyp đại trực tràng",
  q6_tri_yes: "Trĩ",
  q6_tm_yes: "Thiếu máu",
  q6_rldcm_yes: "Rối loạn đông cầm máu",
  q6_blhhk_yes: "Bệnh lý huyết học khác",
  q6_dkhdq_yes: "Động kinh hoặc đột quỵ/ tai biến mạch máu não",
  q6_tha_yes: "Tăng huyết áp",
  q6_btm_yes: "Bệnh tim mạch",
  q6_dtd_yes: "Đái tháo đường",
  q6_rlttk_yes: "Rối loạn tâm thần kinh",
  q6_lp_yes: "Lao phổi",
  q6_bphhs_yes: "Bệnh phổi hoặc hen suyễn",
  q6_btg_yes: "Bệnh tuyến giáp",
  q6_tk_yes: "Thấp khớp",
  q6_hiv_yes: "HIV/AIDS",
  q6_ut_yes: "Ung thư",
  q8: "Quý khách có cần sử dụng kháng sinh dự phòng trước khi chữa răng không?",
  q8_yes: false,
  q9: "Quý khách có van tim nhân tạo, từng thay khớp hoặc có mảnh ghép mạch máu nhân tạo không?",
  q9_yes: false,
  q12: "Thói quen:",
  q12_htl_hdch: "Hút thuốc lá",
  q12_htl_hdch_text: "",
  q12_urb_yes: "Uống rượu bia",
  q12_sdtgd_yes: "Sử dụng thuốc giảm đau",
  q17: "Quý khách có bất kỳ người thân hay họ hàng có quan hệ huyết thống trong gia đình có các bệnh lý liệt kê dưới đây không?",
  q17_utv_yes: "Ung thư vú",
  q17_onmt_yes: "Ợ nóng mạn tính",
  q17_utdt_yes: "Ung thư đại tràng",
  q17_pldt_yes: "Polyp đại tràng",
  q17_vldt_yes: "Bệnh Crohn/ Viêm loét đại tràng",
  q17_dtd_yes: "Đái tháo đường",
  q17_rltt_yes: "Rối loạn tâm thần",
  q17_uttq_yes: "Ung thư thực quản/ rối loạn thực quản",
  q17_btm_yes: "Bệnh túi mật",
  q17_btim_yes: "Bệnh tim mạch",
  q17_tha_yes: "Tăng huyết áp",
  q17_bt_yes: "Bệnh thận",
  q17_utbt_yes: "Ung thư buồng trứng",
  q17_utt_yes: "Ung thư tụy/bệnh lý tụy",
  q17_lddtt_yes: "Loét dạ dày – tá tràng",
  q17_pldd_yes: "Polyp dạ dày/ ung thư dạ dày",
  q17_dq_yes: "Đột quỵ/ tai biến mạch máu não/ động kinh",
  q17_utk_yes: "Các loại ung thư khác",
  q18: "Lược qua các cơ qua: Hiện tại hoặc gần đây Quý khách có bất kỳ triệu chứng nào sau đây không (hoặc liệu Quý khách có từng bị các triệu chứng này rõ và gây khó chịu trong quá khứ không)?",
  q18_mm_yes: "Mệt mỏi",
  q18_ca_yes: "Chán ăn",
  q18_sc_yes: "Sút cân",
  q18_s_yes: "Sốt",
  q18_lr_yes: "Lạnh run",
  q18_dmhtvd_yes: "Đổ mồ hôi trộm về đêm",
  q18_cvdvmmth_yes: "Các vấn đề về mắt, mũi, tai, họng",
  q18_cmm_yes: "Chảy máu mũi",
  q18_lm_yes: "Loét miệng",
  q18_dm_yes: "Đau mắt",
  q18_hk_yes: "Ho khan",
  q18_hd_yes: "Ho đàm",
  q18_kk_yes: "Ho đàm",
  q18_ktkgs_yes: "Khó thở khi gắng sức",
  q18_ktcknn_yes: "Khó thở khi gắng sức",
  q18_ktckn_yes: "Khó thở cả khi nằm",
  q18_dn_yes: "Đau ngực",
  q18_tdkd_yes: "Tim đập không đều",
  q18_pc_yes: "Tim đập không đều",
  q18_dnc_yes: "Đau nhức chân khi đi lại hoặc khi tập thể thao",
  q18_dnccknn_yes: "Đau nhức chân cả khi nghỉ ngơi",
  q18_dl_yes: "Đau lưng",
  q18_ktcdnhl_yes: "Không thể chịu được nóng hoặc lạnh",
  q18_rt_yes: "Run tay",
  q18_rlt_yes: "Rậm lông tóc",
  q18_ltt_yes: "Lông tóc thưa",
  q18_knn_yes: "Khát nước nhiều",
  q18_dtn_yes: "Đi tiểu nhiều",
  q18_nkn_yes: "Nuốt khó/ nghẹn",
  q18_nd_yes: "Nuốt đau",
  q18_onoc_yes: "Ợ nóng/ Ợ chua",
  q18_octa_yes: "Ợ trớ thức ăn/dịch dạ dày",
  q18_bn_yes: "Buồn nôn",
  q18_n_yes: "Nôn",
  q18_db_yes: "Đau bụng",
  q18_cb_yes: "Chướng bụng",
  q18_tc_yes: "Tiêu chảy",
  q18_tb_yes: "Táo bón",
  q18_dcrm_yes: "Đi cầu ra máu",
  q18_vd_yes: "Vàng da",
  q18_ndmdn_yes: "Ngứa da mức độ nhiều",
  q18_dck_yes: "Đi cầu khó (phải rặn nhiều)",
  q18_dtb_yes: "Đi tiểu buốt",
  q18_dk_yes: "Đau khớp",
  q18_la_yes: "Lo âu",
  q18_trc_yes: "Trầm cảm",
  q18_bingat_yes: "Bị ngất",
  q18_cm_yes: "Chóng mặt",
  q18_ndsn_yes: "Nhìn đôi/ song thị (nhìn thấy hai hình ảnh của một đối tượng)",
  q18_mtb_yes: "Mất thăng bằng hoặc khả năng phối hợp động tác",
  q18_rlnn_yes: "Rối loạn ngôn ngữ",
  q18_tth_yes: "Teo tinh hoàn",
  q18_rlkn_yes: "Rối loạn kinh nguyệt",
  q18_bcdmt_yes: "Bạn có đang mang thai?",
};

export const dataChartDoctorcheck = [
  {
    name: "Doctorcheck",
    hour: moment(new Date()).subtract(3, "days").format("DD/MM"),
    quality: 60,
  },
  {
    name: "Doctorcheck",
    hour: moment(new Date()).subtract(2, "days").format("DD/MM"),
    quality: 38,
  },
  {
    name: "Doctorcheck",
    hour: moment(new Date()).subtract(1, "days").format("DD/MM"),
    quality: 50,
  },
];

export const dataColumPartner = [
  {
    name: "Bác sĩ chỉ định",
    date: moment(new Date()).format("DD/MM/YYYY"),
    quality: 51,
  },
  {
    name: "Đối tác",
    date: moment(new Date()).format("DD/MM/YYYY"),
    quality: 82,
  },
  {
    name: "Khách hàng cũ giới thiệu",
    date: moment(new Date()).format("DD/MM/YYYY"),
    quality: 32,
  },
];

export const optionCompany: DropdownData[] = [
  { id: 99, label: "Doctor Check - Tầm Soát Bệnh", value: "doctorcheck.vn" },
  { id: 1, label: "noisoitieuhoa.com - Tiêu Hóa", value: "noisoitieuhoa.com" },
  {
    id: 2,
    label: "khamdoanhnghiep.vn - Khám Doanh Nghiệp",
    value: "khamdoanhnghiep.vn",
  },
];

export const optionStateStatistic: DropdownData[] = [
  { id: 0, label: "Theo doanh nghiệp", value: "enterprise" },
  { id: 1, label: "Theo khách hàng", value: "customer" },
  { id: 2, label: "Theo gói dịch vụ", value: "package" },
];

export const dataStatisticsCustomer = [
  {
    customer_id: 0,
    customer_type: `${moment(new Date()).format("01/MM/YYYY")}  ->  ${moment(
      new Date()
    ).format("DD/MM/YYYY")}`,
    customer_count: Math.floor(Math.random() * 99),
    revenue: Math.floor(Math.random() * 10000000),
  },
  {
    customer_id: 1,
    customer_type: "Thang 10",
    customer_count: Math.floor(Math.random() * 499),
    revenue: Math.floor(Math.random() * 100000000),
  },
  {
    customer_id: 2,
    customer_type: "Thang 09",
    customer_count: Math.floor(Math.random() * 199),
    revenue: Math.floor(Math.random() * 100000000),
  },
];

export const textStyle = {
  fontFamily: "Roboto",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "normal",
};

export const tooltipStyle = {
  shadowColor: "#333",
  borderRadius: 12,
  padding: 16,
};

export const dataExampleConversion = [
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(6, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(5, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(4, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(3, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(2, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(1, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).format("DD/MM/YYYY"),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
];

export const dataExampleConversionPharse = [
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Quan tâm",
    color: "#73c0de",
  },
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Cân nhắc",
    color: "#91cc75",
  },
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Cho số điện thoại",
    color: "#fac858",
  },
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Đặt hẹn",
    color: "#ee6666",
  },
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Hủy hẹn",
    color: "#73c0de",
  },
  {
    id: handleRenderGUID(),
    value: Math.floor(Math.random() * 200),
    title: "Đã đến",
    color: "#3ba272",
  },
];

export const configConversion = {
  textStyle: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
      },
    },
    tooltipStyle: {
      shadowColor: "#333",
      borderRadius: 12,
      padding: 16,
    },
  },
  calculable: true,
  legend: {
    data: ["Contact", "Total", "Lead", "Customer"],
    orient: "horizontal",
    left: "top",
    itemGap: 20,
  },
  grid: {
    top: "12%",
    left: "1%",
    right: "10%",
    containLabel: true,
  },
  xAxis: { type: "category" },
  yAxis: {},
  dataZoom: [
    { show: true, start: 0, end: 100 },
    { type: "inside", start: 0, end: 100 },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: "empty",
      width: 10,
      height: "90%",
      showDataShadow: false,
      left: "93%",
    },
  ],
  dataset: {
    source: [
      ["", "Contact", "Total", "Lead", "Customer"],
      ...[
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(6, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(5, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(4, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(3, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(2, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).subtract(1, "days").format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
        {
          id: handleRenderGUID(),
          value: [moment(new Date()).format("DD/MM/YYYY"), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200),],
        },
      ].map((date) => [
        ...date.value,
        Math.floor(Math.random() * 150),
      ]),
    ],
  },
  series: [
    { type: "bar", color: "#007bff", animationEasing: "bounceOut" },
    { type: "bar", color: "#00556E", animationEasing: "bounceOut" },
    { type: "bar", color: "#f99", animationEasing: "bounceOut" },
    {
      type: "line",
      smooth: true,
      color: "#28a745",
      animationEasing: "quarticIn",
    },
  ],
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  backgroundStyle: {
    borderRadius: 8,
  },
  color: "#00456e",
  itemStyle: {
    borderRadius: [2, 2, 0, 0],
  },
  barWidth: 20,
};

export const configConversion1 = {
  tooltip: {
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
      },
    },
    borderWidth: 0,
    trigger: "item",
    ...tooltipStyle,
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: "50%",
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      data: dataExampleConversionPharse.map((i) => {
        const data = { name: i.title, value: i.value };
        return data;
      }),
    },
  ],
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
};

export const dataStatisticAppointment = [
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(6, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(5, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(4, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(3, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(2, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(1, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
    ],
  },
];

export const configStatisticAppointment = {
  textStyle: textStyle,
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
      },
    },
    ...tooltipStyle,
  },
  calculable: true,
  legend: {
    data: [
      "Tổng đặt lịch",
      "Chưa đến, Đã hủy",
      "Đã khám xong, Đang phục vụ ",
      "Dời lịch",
    ],
    orient: "horizontal",
    left: "top",
    itemGap: 30,
  },
  grid: {
    top: "12%",
    left: "1%",
    right: "10%",
    containLabel: true,
  },
  xAxis: { type: "category" },
  yAxis: {},
  dataZoom: [
    { show: true, start: 0, end: 100 },
    { type: "inside", start: 0, end: 100 },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: "empty",
      width: 10,
      height: "90%",
      showDataShadow: false,
      left: "93%",
    },
  ],
  dataset: {
    source: [
      [
        "",
        "Tổng đặt lịch",
        "Chưa đến, Đã hủy",
        "Đã khám xong, Đang phục vụ ",
        "Dời lịch",
      ],
      ...dataStatisticAppointment.map((date) => [
        ...date.value,
        Math.floor(Math.random() * 100),
      ]),
    ],
  },
  series: [
    { type: "bar", color: "#28a745", animationEasing: "bounceOut" },
    {
      type: "line",
      smooth: true,
      color: "#007bff",
      animationEasing: "quarticIn",
    },
    { type: "line", smooth: true, color: "#f00", animationEasing: "quarticIn" },
    {
      type: "line",
      smooth: true,
      color: "#fd7e14",
      animationEasing: "quarticIn",
    },
  ],
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  backgroundStyle: {
    borderRadius: 8,
  },
  color: "#00456e",
  itemStyle: {
    borderRadius: [2, 2, 0, 0],
  },
  barWidth: 28,
};

export const configStatisticAppointmentAllowOrigin = {
  textStyle: textStyle,
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "10%",
    orient: "vertical",
    left: "top",
    itemGap: 20,
  },
  series: [
    {
      top: "0%",
      type: "pie",
      radius: ["20%", "60%"],
      center: ["50%", "40%"],
      height: 550,
      selectedMode: "single",
      itemStyle: {
        borderRadius: 8,
        borderColor: "#fff",
        borderWidth: 4,
      },
      label: {
        show: true,
        position: "outside",
        formatter: "{b}: {c} (khách) - {d}%",
        rotate: false,
        fontWeight: "normal",
        fontSize: 15,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: true,
        length2: 50,
        smooth: true,
      },
      data: [
        { value: 540, name: "Facebook" },
        { value: 320, name: "Google" },
        { value: 210, name: "Zalo" },
        { value: 672, name: "Bác sĩ chỉ định" },
        { value: 320, name: "Cộng tác viên" },
        { value: 200, name: "Tiktok" },
        { value: 289, name: "Youtube" },
        { value: 120, name: "WOM" },
        { value: 70, name: "Vãng lai" },
        { value: 100, name: "Nội bộ" },
      ],
    },
  ],
};

export const configStatisticAppointments = {
  textStyle: textStyle,
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "10%",
    orient: "vertical",
    left: "top",
    itemGap: 20,
  },
  series: [
    {
      top: "10%",
      type: "pie",
      radius: ["10%", "60%"],
      center: ["55%", "40%"],
      height: 600,
      selectedMode: "single",
      itemStyle: {
        borderRadius: 12,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: true,
        position: "outside",
        formatter: "{b}: {c} (khách) - {d}%",
        rotate: false,
        fontWeight: "normal",
        fontSize: 15,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: true,
        length2: 30,
        smooth: true,
      },
      data: [
        { value: Math.floor(Math.random() * 500), name: "Chat Messenger" },
        { value: Math.floor(Math.random() * 400), name: "Chat Zalo" },
        { value: Math.floor(Math.random() * 100), name: "Chat Tawto" },
        { value: Math.floor(Math.random() * 400), name: "Hotline" },
        { value: Math.floor(Math.random() * 500), name: "Form" },
        { value: Math.floor(Math.random() * 300), name: "Search" },
        { value: Math.floor(Math.random() * 200), name: "SMS" },
        { value: Math.floor(Math.random() * 200), name: "Nhân Sự Giới Thiệu" },
        {
          value: Math.floor(Math.random() * 200),
          name: "Người Thân Của Nhân Sự",
        },
        {
          value: Math.floor(Math.random() * 200),
          name: "Đối Tác Doanh Nghiệp",
        },
        { value: Math.floor(Math.random() * 200), name: "Đối Tác Cá Nhân" },
        { value: Math.floor(Math.random() * 200), name: "Tài xế" },
      ],
    },
  ],
};

export const dataExampleAppointmentss = [
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(6, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(5, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(4, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(3, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(2, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).subtract(1, "days").format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
  {
    id: handleRenderGUID(),
    value: [
      moment(new Date()).format("DD/MM/YYYY"),
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 100),
    ],
  },
];

export const configStatisticAppointmentCompany = {
  textStyle: textStyle,
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
      },
    },
    ...tooltipStyle,
  },
  calculable: true,
  legend: {
    data: ["doctorcheck.vn", "noisoitieuhoa.com", "khamdoanhnghiep.vn"],
    orient: "horizontal",
    left: "top",
    itemGap: 20,
  },
  grid: {
    top: "12%",
    left: "1%",
    right: "10%",
    containLabel: true,
  },
  xAxis: { type: "category" },
  yAxis: {},
  dataZoom: [
    { show: true, start: 0, end: 100 },
    { type: "inside", start: 0, end: 100 },
    {
      show: true,
      yAxisIndex: 0,
      filterMode: "empty",
      width: 10,
      height: "80%",
      showDataShadow: false,
      left: "93%",
    },
  ],
  dataset: {
    source: [
      ["", "doctorcheck.vn", "noisoitieuhoa.com", "khamdoanhnghiep.vn"],
      ...dataExampleConversion.map((date) => [
        ...date.value,
        Math.floor(Math.random() * 150),
      ]),
    ],
  },
  series: [
    {
      type: "bar",
      color: "#3ba272",
      animationEasing: "bounceOut",
      label: {
        show: true,
        position: "outside",
        formatter: "{@[1]}",
        rotate: false,
        fontWeight: "normal",
        fontSize: 15,
      },
    },
    {
      type: "bar",
      color: "#00556E",
      animationEasing: "bounceOut",
      label: {
        show: true,
        position: "outside",
        formatter: "{@[2]}",
        rotate: false,
        fontWeight: "normal",
        fontSize: 15,
      },
    },
    {
      type: "bar",
      color: "#fac858",
      animationEasing: "bounceOut",
      label: {
        show: true,
        position: "outside",
        formatter: "{@[3]}",
        rotate: false,
        fontWeight: "normal",
        fontSize: 15,
      },
    },
  ],
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  backgroundStyle: {
    borderRadius: 8,
  },
  color: "#00456e",
  itemStyle: {
    borderRadius: [2, 2, 0, 0],
  },
  barWidth: 30,
};


export const dataExamDiseaseReportTag = [
  { id: 1, tagColor: '#21ea9a', tagName: 'Chưa phát hiện bất thường', },
  { id: 2, tagColor: '#ffd646', tagName: 'Nguy cơ thấp', },
  { id: 3, tagColor: '#fd983c', tagName: 'Nguy cơ trung bình', },
  { id: 4, tagColor: '#f75d3b', tagName: 'Nguy cơ cao', },
]

export const dataExamplePointManagement = {
  data: [
    {
      create_date: '2023-01-15',
      customer_code: 'C001',
      customer_name: 'John Doe',
      current_point: 500,
      pending_point: 100,
      equivalent_amount: 50,
      latest_point_add_date: '2024-03-20',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 3,
      is_gift_exchange: false
    },
    {
      create_date: '2022-12-01',
      customer_code: 'C002',
      customer_name: 'Jane Smith',
      current_point: 300,
      pending_point: 50,
      equivalent_amount: 30,
      latest_point_add_date: '2024-04-05',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 2,
      is_gift_exchange: true
    },
    {
      create_date: '2023-02-20',
      customer_code: 'C003',
      customer_name: 'Michael Johnson',
      current_point: 800,
      pending_point: 200,
      equivalent_amount: 80,
      latest_point_add_date: '2024-04-08',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 4,
      is_gift_exchange: false
    },
    {
      create_date: '2023-04-10',
      customer_code: 'C010',
      customer_name: 'Sarah Brown',
      current_point: 400,
      pending_point: 150,
      equivalent_amount: 40,
      latest_point_add_date: '2024-04-10',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 1,
      is_gift_exchange: false
    },
    {
      create_date: '2023-01-15',
      customer_code: 'C001',
      customer_name: 'John Doe',
      current_point: 500,
      pending_point: 100,
      equivalent_amount: 50,
      latest_point_add_date: '2024-03-20',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 3,
      is_gift_exchange: false
    },
    {
      create_date: '2022-12-01',
      customer_code: 'C002',
      customer_name: 'Jane Smith',
      current_point: 300,
      pending_point: 50,
      equivalent_amount: 30,
      latest_point_add_date: '2024-04-05',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 2,
      is_gift_exchange: true
    },
    {
      create_date: '2023-02-20',
      customer_code: 'C003',
      customer_name: 'Michael Johnson',
      current_point: 800,
      pending_point: 200,
      equivalent_amount: 80,
      latest_point_add_date: '2024-04-08',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 4,
      is_gift_exchange: false
    },
    {
      create_date: '2023-04-10',
      customer_code: 'C010',
      customer_name: 'Sarah Brown',
      current_point: 400,
      pending_point: 150,
      equivalent_amount: 40,
      latest_point_add_date: '2024-04-10',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 1,
      is_gift_exchange: false
    },
    {
      create_date: '2023-01-15',
      customer_code: 'C001',
      customer_name: 'John Doe',
      current_point: 500,
      pending_point: 100,
      equivalent_amount: 50,
      latest_point_add_date: '2024-03-20',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 3,
      is_gift_exchange: false
    },
    {
      create_date: '2022-12-01',
      customer_code: 'C002',
      customer_name: 'Jane Smith',
      current_point: 300,
      pending_point: 50,
      equivalent_amount: 30,
      latest_point_add_date: '2024-04-05',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 2,
      is_gift_exchange: true
    },
    {
      create_date: '2023-02-20',
      customer_code: 'C003',
      customer_name: 'Michael Johnson',
      current_point: 800,
      pending_point: 200,
      equivalent_amount: 80,
      latest_point_add_date: '2024-04-08',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 4,
      is_gift_exchange: false
    },
    {
      create_date: '2023-04-10',
      customer_code: 'C010',
      customer_name: 'Sarah Brown',
      current_point: 400,
      pending_point: 150,
      equivalent_amount: 40,
      latest_point_add_date: '2024-04-10',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 1,
      is_gift_exchange: false
    },
    {
      create_date: '2023-01-15',
      customer_code: 'C001',
      customer_name: 'John Doe',
      current_point: 500,
      pending_point: 100,
      equivalent_amount: 50,
      latest_point_add_date: '2024-03-20',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 3,
      is_gift_exchange: false
    },
    {
      create_date: '2022-12-01',
      customer_code: 'C002',
      customer_name: 'Jane Smith',
      current_point: 300,
      pending_point: 50,
      equivalent_amount: 30,
      latest_point_add_date: '2024-04-05',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 2,
      is_gift_exchange: true
    },
    {
      create_date: '2023-02-20',
      customer_code: 'C003',
      customer_name: 'Michael Johnson',
      current_point: 800,
      pending_point: 200,
      equivalent_amount: 80,
      latest_point_add_date: '2024-04-08',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 4,
      is_gift_exchange: false
    },
    {
      create_date: '2023-04-10',
      customer_code: 'C010',
      customer_name: 'Sarah Brown',
      current_point: 400,
      pending_point: 150,
      equivalent_amount: 40,
      latest_point_add_date: '2024-04-10',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 1,
      is_gift_exchange: false
    },
    {
      create_date: '2023-01-15',
      customer_code: 'C001',
      customer_name: 'John Doe',
      current_point: 500,
      pending_point: 100,
      equivalent_amount: 50,
      latest_point_add_date: '2024-03-20',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 3,
      is_gift_exchange: false
    },
    {
      create_date: '2022-12-01',
      customer_code: 'C002',
      customer_name: 'Jane Smith',
      current_point: 300,
      pending_point: 50,
      equivalent_amount: 30,
      latest_point_add_date: '2024-04-05',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 2,
      is_gift_exchange: true
    },
    {
      create_date: '2023-02-20',
      customer_code: 'C003',
      customer_name: 'Michael Johnson',
      current_point: 800,
      pending_point: 200,
      equivalent_amount: 80,
      latest_point_add_date: '2024-04-08',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 4,
      is_gift_exchange: false
    },
    {
      create_date: '2023-04-10',
      customer_code: 'C010',
      customer_name: 'Sarah Brown',
      current_point: 400,
      pending_point: 150,
      equivalent_amount: 40,
      latest_point_add_date: '2024-04-10',
      latest_sms_send_date: '2024-04-10',
      sms_send_count: 1,
      is_gift_exchange: false
    }
  ],
  message: "Tổng kết hồ sơ sức khoẻ!",
  status: true,
  client_ip: "192.168.11.158",
}
export const OptionChooseMonth: GroupRadioType[] = [
  {
    id: 1,
    label: "Sau 1 tháng",
    value: 1,
    color: "#28a745",
    level: "1",
  },
  {
    id: 2,
    label: "Sau 5 tháng",
    value: 5,
    color: "#dc3545",
    level: "2",
  },
   {
    id: 3,
    label: "Sau 1 năm",
    value: 12,
    color: "#048ddd",
    level: "3",
  },
    {
    id: 4,
    label: "Sau 18 tháng",
    value: 18,
    color: "#28a745",
    level: "4",
  },
  {
    id: 5,
    label: "Sau 2 năm",
    value: 24,
    color: "#dc3545",
    level: "4",
  },
];