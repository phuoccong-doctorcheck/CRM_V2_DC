

export interface ResponseBeforeExams {
    lead_id: string;
    lead_type: string;
    process_key_id: string;
    customer_id: string;
    master_id: string;
    process_kanban_color: string;
    process_kanban_name: string;
    bg_color: string;
    customer_fullname: string;
    year_of_birth: number;
    gender_name: string;
    customer_phone: string;
    lead_source_display: string;
    lead_note: string;
    conversation_page_id: string;
    conversation_user_id: string;
    conversation_sender_id: string;
    conversation_type: string;
    lead_picture_avatar: null;
    follow_staff: FollowStaff;
    is_customer_converted: boolean;
    is_lead: boolean;
    is_re_exams: boolean;
    is_has_tag: boolean;
    lead_message_seen: boolean;
    create_date: Date;
    update_date: Date;
    lead_conversion_date: Date;
    lead_convert_customer_date: Date;
    tags: TagCustomer[];
    status: string;
}

export interface FollowStaff {
    id: string;
    name: string;
}

export type PayloadGetBeforeExams = {
  processKeyId: string;
  launchSourceID: string;
  launchSourceGroup: any;
  launchSourceType: any;
  followStaffId: string;
  fromDay: Date;
  toDay: Date;
  keyWord: string;
  pages: number;
  limits: number;
};

export type ListBeforeExams = {
  data: {
    count: Count,
    data: ResponseBeforeExams[],
    paging: Paging,
  }
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
};
//
export interface BeforeExamsSaveCustomer {
    customer: CustomerSaveCustomer;
    master: MasterSaveCustomer;
    is_appointment: boolean;
    appointment: AppointmentSaveCustomer;
    tags: any;
    lead_note: string;
    process_key_id: string;
    current_affiliate_id: null;
    new_affiliate_id: null;
    customer_type: null;
}

export interface AppointmentSaveCustomer {
    master_id: string;
    appointment_type: string;
    package_id: null;
    doctor_employee_id: null;
    appointment_date: Date;
    appointment_note: string;
}

export interface CustomerSaveCustomer {
    customer_id: string;
    customer_fullname: string;
    customer_identity_card: string;
    customer_phone: string;
    customer_email: string;
    customer_address: string;
    day_of_birth: null;
    month_of_birth: number;
    year_of_birth: number;
    gender_id: string;
    career_id: string;
    nation_id: string;
    country_id: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    launch_source_id: number;
    conversation_type: string;
    conversation_page_id: string;
    conversation_user_id: string;
    conversation_sender_id: string;
}

export interface MasterSaveCustomer {
    master_id: string;
    c_object_id: string;
    launch_source_id: number;
    appointment_note: string;
    master_note: string;
    package_id: null;
    appointment_date: null;
    is_register_subclinical: boolean;
    is_register_package: boolean;
    is_exams: boolean;
    is_appointment: boolean;
}

export interface DataCustomer {
  touchpointlogs: any[];
    data: DataCustomerInfo;
    message: string;
    status: boolean;
    total_items: number;
    client_ip: string;
}
export interface SaleOrder {
  draft: string;
  saleorder_id: number;
  saleorder_name: string;
  saleorder_ref: string;
  total: number;
  total_discount: number;
  total_invoice: number;
  create_datetime: string; // ISO Date string
  lead_id: string | null;
  customer_id: string;
  master_id: string | null;
  status: string;
}
export interface DataCustomerInfo {
  source_first: any;
  touchpointlogs: any;
  customer_id: string;
  process_key_id: null;
  customer_fullname: string;
  portrait_survey_type: string;
  customer_phone: string;
  customer_identity_card: string;
  customer_email: string;
  day_of_birth: null;
  month_of_birth: null;
  year_of_birth: number;
  birthday: string;
  customer_address: string;
  customer_full_address: string;
  country_id: string;
  province_id: string;
  district_id: string;
  ward_id: string;
  nation_id: string;
career_id: string;
  career: Career;
  launch_source_id: number;
  launch_source_group_id: number;
  launch_source: LaunchSource;
  launch_source_group: LaunchSource;
  launch_source_type: LaunchSource;
  gender_id: string;
  gender: Career;
  picture_avatar: null;
  lead_type: null;
  lead_last_message: null;
  lead_note: null;
  conversation_page_id: null;
  conversation_user_id: null;
  conversation_sender_id: null;
  conversation_type: null;
  follow_staff: null;
  lead_convert_customer_date: null;
  is_customer_converted: boolean;
  is_lead: boolean;
  create_date: Date;
  is_actived: boolean;
  is_portrait: boolean;
  is_affiliate_doctor: boolean;
  status: null;
  customer_type: string;
    customer: Customer;
    master: Master;
    master_id: string;
    appointment_type: string;
    package_id: null;
    doctor_employee_id: null;
    appointment_date: Date;
    appointment_note: string;
    specialist_id: null;
    ids?: any;
    affiliate_id: number;
    affiliate_name: string;
    affiliate_code: string;
    phone: string;
    display_name: string;
    affiliate_type: string;
    lastest_result_master_id: null;
    list_same_phones: ListSamePhone[];
    tags: TagCustomer[];
    notes: Note[];
  is_has_booking: boolean;
  sales_employee: {
    id: string;
    name: string;
  },
  allow_update_profile: boolean
  visits: visitItems[]
  sale_orders: SaleOrder[];
}

export interface visitItems {
  session_count: number;
  customer_id: string;
  datetime: any;
  is_affiliate_doctor: boolean;
  is_re_exams: boolean;
  master_id: string;
  status: any[];
  time_ago_text: string;
  title: string;
}
export interface Affiliate {
    affiliate_id: number;
    affiliate_name: string;
    affiliate_code: string;
    phone: string;
    display_name: string;
    affiliate_type: string;
}
export interface ListSamePhone {
    customer_id: string;
    customer_fullname: string;
    customer_phone: string;
    customer_list_phones: null;
    gender_name: string;
    year_of_birth: number;
    is_phone_owner: null;
    is_actived: boolean;
    update_date: Date;
}

export interface Appointment {
    master_id: string;
    appointment_type: string;
    package_id: null;
    doctor_employee_id: null;
    appointment_date: Date;
    appointment_note: string;
    specialist_id: null;
    ids?: any;
}

export interface TagCustomer {
    tag_id: number;
    tag_name: string;
    tag_group: string;
    tag_group_name: string;
    tag_color: string;
    order_number: number;
}

export interface Customer {
    customer_id: string;
    process_key_id: null;
    customer_fullname: string;
    portrait_survey_type: string;
    customer_phone: string;
    customer_identity_card: string;
    customer_email: string;
    day_of_birth: null;
    month_of_birth: null;
    year_of_birth: number;
    birthday: string;
    customer_address: string;
    customer_full_address: string;
    country_id: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    nation_id: string;
  career_id: string;
    career: Career;
    launch_source_id: number;
    launch_source_group_id: number;
    launch_source: LaunchSource;
    launch_source_group: LaunchSource;
    launch_source_type: LaunchSource;
    gender_id: string;
    gender: Career;
    picture_avatar: null;
    lead_type: null;
    lead_last_message: null;
    lead_note: null;
    conversation_page_id: null;
    conversation_user_id: null;
    conversation_sender_id: null;
    conversation_type: null;
    follow_staff: null;
    lead_convert_customer_date: null;
    is_customer_converted: boolean;
    is_lead: boolean;
    create_date: Date;
    is_actived: boolean;
    is_portrait: boolean;
    is_affiliate_doctor: boolean;
  status: null;
  customer_type: string;
  is_has_booking: boolean;
}

export interface Career {
    id: string;
    name: string;
}

export interface LaunchSource {
    id: number;
    name: string;
}

export interface Master {
    [x: string]: any;
    master_id: string;
    customer_id: string;
    clinic_id: number;
    launch_source: LaunchSource;
    appointment_note: string;
    exams_reason: null;
    master_note: string;
    canceled_reason: null;
    diagnose_note: null;
    create_employee: null;
    update_employee: null;
    appointment_date: Date;
    register_date: null;
    create_date: Date;
    update_date: Date;
    is_register_package: boolean;
    is_register_subclinical: boolean;
    is_exams: boolean;
    is_appointment: boolean;
    is_re_exams: boolean;
    is_send_messages: null;
    status: string;
    register_type_id: string;
}

export interface Note {
    cs_node_id: string;
    lead_id: null;
    customer_id: string;
    cs_user_id: string;
    cs_user_displayname: string;
    cs_node_type: string;
    cs_node_content: string;
    ticket_id: null;
    file_attach_url: null;
    cs_node_datetime: Date;
    is_show: boolean;
}

export interface GetListNotes {
    data: NotesItem[];
    message: string;
    status: boolean;
    total_items: number;
    client_ip: string;
}

export interface NotesItem {
    cs_node_id: string;
    lead_id: null;
    customer_id: string;
    cs_user_id: string;
    cs_user_displayname: string;
    cs_node_type: string;
    cs_node_content: string;
    ticket_id: null;
    file_attach_url: null;
    cs_node_datetime: Date;
    is_show: boolean;
}
export interface Count {
    total_count:    number;
    contact_count:  number;
    lead_count:     number;
    customer_count: number;
    qt_count:       number;
    cn_count:       number;
    csdt_count:     number;
    dh_count:       number;
    hl_count:       number;
}


export interface Lead {
  lead_id: number;
  lead_name: string | null;
  lead_phone: string | null;
  lead_email: string | null;
  lead_gender_id: number | null;
  lead_dob: string | null;
  lead_mob: string | null;
  lead_yob: string | null;
  lead_address: string | null;
  lead_full_address: string | null;
  lead_country_id: number | null;
  lead_province_id: number | null;
  lead_district_id: number | null;
  lead_ward_id: number | null;
  lead_pancake_id: string;
  lead_facebook_id: string | null;
  lead_google_id: string | null;
  lead_zalo_id: string | null;
  lead_pancake_link: string | null;
  lead_note: string | null;
  lead_first_datetime: string | null;
  lead_last_datetime: string | null;
  lead_convert_datetime: string | null;
  lead_appointment_datetime: string | null;
  source_group_id: number | null;
  source_id: number | null;
  source_type_id: number | null;
  own_employee_id: string | null;
  follow_employee_id: string | null;
  is_converted: boolean | null;
  step_id: number;
  customer_id: number | null;
  visit_id: number | null;
  saleorder_id: number | null;
  create_date: string;
  update_date: string;
  bg_color: string | null;
  attribute_jsons: string | null;
  status: string | null;
  step_name: string;
  step_index: number;
}

interface Paging {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface LeadResponseData {
  data: Lead[];
  paging: Paging;
}

export interface LeadResponse {
  data: LeadResponseData;
  total_items: number;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface InteractionNode {
  cs_node_content: string | undefined;
  cs_notes: string | undefined;
  employee_name: string | undefined;
  id: number;
  node_type: "note" | "customer" | "lead";
  note_node_content: string;
  note_attach_url: string;
  node_datetime: string;
  user_displayname: string;
  u_id: string;
  lead_id: number;
  customer_id: string | null;
  visit_id: number | null;
  object_id: number | null;
  is_show: boolean;
}

export interface InteractionHistoryResponse {
  data: InteractionNode[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface TagItem {
  tag_id: number;
  object_id: string;
  object_type: string;
  tag_name: string;
  tag_color: string;
  sequence: number;
}

export interface TagApiResponse {
  data: TagItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface GetListNotesCR {
    data: NotesItemCR[];
    message: string;
    status: boolean;
    total_items: number;
    client_ip: string;
}


export interface NotesItemCR {
    employee_name: string;
    note_datetime: Date;
    cs_notes: string;
}


export interface Employee {
  username: string;
  password: string | null;
  fullname: string;
  lastname: string;
  employee_certificate_code: string;
  employee_signature_name: string;
  avatar: string | null;
  mainscreen: string;
  token: string | null;
  pancakeToken: string | null;
  department_id: string | null;
  employee_id: string;
  employee_group: string | null;
  employee_team_id: string | null;
  user_country_id: string | null;
  user_country_phone_prefix: string | null;
  user_call_agent: string | null;
  erp_code: string | null;
  erp_type: string | null;
  is_view_result: boolean;
  prompt_changepwd: string | null;
  roles: string | null;
}

export interface SaleOrderItem {
  id: number;
  saleorder_id: number;
  saleorder_ref: string;
  master_id: string;
  service_id: string;
  service_name: string;
  service_group_type: string;
  package_id: string | null;
  unit_name: string;
  quantity: number;
  service_prices: number;
  total: number;
  total_discount: number;
  total_invoice: number;
  comparison_type: string;
  create_datetime: string;
  update_datetime: string;
  payment_datetime: string | null;
  own_employee: Employee | null;
  create_employee: Employee | null;
  f_type: string | null;
  s_group: string | null;
  is_insurance: boolean;
  insurance_price: number | null;
  insurance_object_ratio: number | null;
  flatform: string;
  status: string;
}

export interface SaleOrderData {
  saleorder_id: number;
  saleorder_name: string;
  saleorder_ref: string;
  source: string | null;
  own_employee: Employee | null;
  lead_id: string | null;
  customer_id: string;
  master_id: string | null;
  total: number;
  total_discount: number;
  total_invoice: number;
  create_datetime: string;
  update_datetime: string;
  payment_datetime: string | null;
  f_type: string | null;
  ads_id: string | null;
  s_group: string | null;
  is_insurance: boolean;
  insurance_card_refcode: string | null;
  insurance_object_text: string | null;
  insurance_hospital_text: string | null;
  insurance_from_date: string | null;
  insurance_to_date: string | null;
  insurance_object_ratio: number | null;
  package_id: string | null;
  status: string;
  items: SaleOrderItem[];
}

export interface SaleOrderResponse {
  data: SaleOrderData;
  message: string;
  status: boolean;
  client_ip: string;
}