import { Paging } from "../afterexams/types";

export interface DmsData {
  data: Data;
  message: string;
  status: boolean;
  client_ip: string;
}
export interface ScheduleTypeC {
  c_schedule_type_id: string;
  c_schedule_title: string;
  c_schedule_note: string;
  sequence: number;
}

export interface ScheduleStatusC {
  key: string;
  value: string;
  value_text: string;
  display_name: string;
  sequence: number;
}

export interface DoctorScheduleTimeC {
  key: string;
  value: string;
  value_int: number;
}
export interface DMYearDoctorSchedules {
  key: string;
  value_text: any;
  value_int: number;
}
export interface DCDMtaffs {
  staffcode: string;
  staffname: string;
  job_title: string;
  is_show: boolean;
}
export interface MTypes {
  m_type_id: string;
  m_type_name: string;
  m_type_group: string;
  sequence: number;
}
export interface TaskTexts {
  task_text_id: any;
  task_type_id: string;
  task_text_display: string;
 }
export interface Data {
  clinics: Clinic[];
  users: User[];
  steps_process_lead: StepProcessLead[];
  task_texts: TaskTexts[];
  phone_config: PhoneConfig;
  genders: Gender[];
  careers: Career[];
  nations: Nation[];
  maritalstatus: Maritalstatus[];
  relationtypes: Relationtype[];
  countries: Country[];
  source_groups: LaunchSourceGroups[];
  sources: LaunchSource[];
  userguid_types:UserguidTypes[];
  source_types: LaunchSourceTypes[];
  task_types: TaskType[];
  stages: Stage[];
  departments: Department[];
  teams: Teams[];
  packages: Package[];
  appointment_types: AppointmentType[];
  ads_accounts: AdsAccount[];
  evaluation_criterias: CampaignCriteria[];
  appointment_services: AppointmentServiceItem[];
  services: Service[];
  employees: Employee[];
  affiliates: Affiliate[];
  insurance_injuries: InsuranceInjury[];
  insurance_specialists: InsuranceSpecialist[];
  tags: Tag[];
  categories: Category[];
  vouchers: Voucher[];
  cs_schedule_type: ScheduleType[]
  touchpointlog_types : TouchPointLogType[]
  current_user: any;
  userflow_lead_steps: StepLead[]
  userflow_types:UserFlowLeadStep[]
   dc_dm_cschedules: ScheduleTypeC[]
  dc_dm_cschedules_status: ScheduleStatusC[]
  dm_time_doctor_schedules: DoctorScheduleTimeC[]
  dm_year_doctor_schedules: DMYearDoctorSchedules[]
  dc_dm_staffs: DCDMtaffs[]
  mtypes:MTypes[]
}
export interface StepProcessLead {
  key_int: number,
  key_text: any,
  value_text: string,
  value_int: any,
  is_show: boolean
}
export interface UserFlowLeadStep {
  id:string,
  name: string
}
export interface StepLead {
  id: number,
  step_index: number,
  type:string,
  step_name: string,
  step_note: string
}
export interface AppointmentServiceItem {
  policy_key: string;
  appointment_type: string;
  service_id: string;
  service_displayname: string;
  service_prices: number;
  order_number: number;
  is_used: boolean;
}

export interface AppointmentType {
  appointment_type: string;
  service_id: string;
  service_name: string;
  department_id: string;
  is_register_package: string;
  is_register_subclinical: string;
  is_exams: string;
  register_type_id: string;
  index: number;
}

export interface Employee {
  employee_id: string;
  employee_group: null | string;
  employee_team_id: null | string;
  employee_type: string;
  employee_signature_name: string;
  erp_code: string;
  erp_type: string;
  signatures: EmployeeSignature[] | null;
}
export interface CampaignCriteria {
  criteria_id: string;
  criteria_code: string;
  criteria_name: string;
  type_campaign: string;
  target_unit: string;
  result_unit: string;
  order_numbers: number;
  is_high_light: boolean;
  color_code: string;
  is_show: boolean;
}
export interface AdsAccount {
  campaigns: never[];
  ads_account_id: string;
  ads_account_name: string;
  ads_account_type: string; // Có thể chuyển thành union type nếu biết rõ các giá trị (e.g., "fb" | "gg" | "tiktok")
  is_use: boolean;
  order_numbers: number;
}

export interface EmployeeSignature {
  signature_id: string;
  employee_id: string;
  signature_certificate_code: null;
  fullname: null;
  signature_name: string;
  signature_image: null;
  order_number: null;
  is_show: null;
}

export interface Voucher {
  voucher_code: string;
  voucher_name: string;
  voucher_value: number;
}
export interface ScheduleType {
  id: string;
  name: string;
  task_title: string;
  task_content: string;
  task_execute_day: number;
  next_task_id: string;
  sequence: number;
}
export interface TouchPointLogType {
  id: string;
  name: string;
  is_show: boolean;

  sequence: number;
}
export interface Tag {
  tag_id: number;
  tag_name: string;
  tag_group: string;
  tag_group_name: string;
  tag_color: string;
  order_number: number;
}
export interface Category {
  id: number;
  category_type: string;
  category_name: string;
  category_note: string;
  is_show: boolean;
  sequence: number;
}
export interface Affiliate {
  affiliate_id: number;
  launch_source_id: number;
  display_name: string;
  affiliate_type: string;
  affiliate_code: string;
}

export interface Career {
  career_id: string;
  career_name: string;
}

export interface Clinic {
  clinic_id: number;
  clinic_ref_code: string;
  clinic_name: string;
  country_id: null | string;
  province_id: null | string;
  district_id: null | string;
  ward_id: null | string;
  structure_map: null;
  clinic_type: string;
}
export interface User {
  signatures: any;
  employee_signature_name: any;
  employee_type: any;
  employee_group: any;
  employee_team_id: any;
  employee_id: any;
  u_id: string;
  u_type: string;
  username: string;
  signature_name: string;
  team_ids: [];
  erp_code: null | string;
  erp_type: null | string;
  erp_id: null | string;
}

export interface Country {
  country_id: string;
  country_name: string;
}

export interface Department {
  department_id: string;
  department_name: string;
  description: string;
  order_number: null;
  is_exams: boolean;
}

export interface Teams {
  team_id: string;
  team_name: string;
  sequence: number;
}

export interface Gender {
  gender_id: string;
  gender_name: string;
}

export interface InsuranceInjury {
  injury_id: number;
  injury_name: string;
}

export interface InsuranceSpecialist {
  specialist_id: string;
  specialist_name: string;
  order_number: number;
  is_show: boolean;
}

export interface LaunchSource {
  source_id: number;
  source_name: string;
}
export interface UserguidTypes {
  guid_type_id: string;
  guid_type_name: string;
  is_show: boolean;
  sequence: number;
}
export interface LaunchSourceGroups {
  source_group_id: number;
  source_group_name: string;
  source_group_displayname: string;
}
export interface LaunchSourceTypes {
  launch_source_type_id: any;
  launch_source_type_name: any;
  source_type_id: number;
  source_type_name: string;
}

export interface Maritalstatus {
  marital_status_id: string;
  marital_status_name: string;
}

export interface Nation {
  nation_id: string;
  nation_name: string;
}

export interface Package {
  package_id: string;
  package_name: string;
  package_display: string;
  order_number: number | null;
}

export interface PhoneConfig {
  user_id: string;
  display_phone_agent: string;
  phone_agent: string;
  phone_agent_password: string;
  phone_queue: string;
  phone_browser_default: string;
  phone_server_domain: string;
  phone_server_port: number;
  phone_server_type: string;
  phone_cs_url: string;
}

export interface Relationtype {
  relation_type_id: number;
  relationship_type_name: string;
}

export interface Service {
  service_id: string;
  service_name: string;
  insurance_refcode: null | string;
  insurance_service_name: null | string;
  service_group_id: string;
  service_group_name: string;
  groupcost_id: number;
  bv01group_id: string;
  bv01group_name: string;
  bv01group_order_number: number;
  groupcost_name: string;
  service_group_subname: null | string;
  service_group_name_order: number;
  service_group_type: string;
  service_order_number: number;
  service_group_order_number: number;
  package_id: null;
  supplie_ids: null;
  parent_id: null | string;
  insurance_contractors: null;
  unit_id: string;
  unit_name: string;
  service_prices: number;
  insurance_service_prices: number;
  insurance_service_ratio: number;
  is_insurance: boolean;
  is_allow_quantity: boolean;
  is_supplies: boolean;
  is_exams: boolean;
  is_group: boolean;
  is_has_execution: boolean;
  is_show_on_insurance: boolean;
  is_show_on_service: boolean;
  is_show_on_servicepoint: boolean;
  is_show_on_affiliate: boolean;
  allow_pay_after: boolean;
}

export interface Stage {
  stage_id: string;
  stage_name: string;
  position: number;
  type: string;
}

export interface TaskType {
  task_type_group: any;
  task_type_id: string;
  task_type_name: string;
}

export interface ServiceGroup {
  service_group_id: string;
  service_group_name: string;
  service_group_type: string;
  children: Service[];
}

export interface CustomerSearchResponse {
  data: CustomerSearchResponseItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerSearchResponseItem {
  customer_id: string;
  customer_fullname: string;
  gender_id: string;
  year_of_birth: number;
  customer_phone: string;
  customer_full_address: string;
  update_date: Date;
}

type CallStatus = "NOANSWER" | "OK";
type CallType = "IN" | "OUT";

export interface ResponseRecentAgentPhone {
  data: ItemRecentPhone[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface ItemRecentPhone {
  log_call_id: string;
  call_type: CallType;
  call_id: string;
  phone_number: string;
  customer_id: null;
  user_id: string;
  phone_agent: string;
  display_phone_agent: string;
  call_datetime: Date;
  call_status: CallStatus;
}

export interface ResponseInsuranceHospitals {
  data: Data;
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface InsuranceHospitalsData {
  data: InsuranceHospitalsItem[];
  paging: Paging;
}

export interface InsuranceHospitalsItem {
  RowNumber: number;
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  register_type: string;
  hospital_level: number;
  province_id: string;
}
export interface ServiceItem {
  service_id: string;
  service_name: string;
  service_short_name: string;
  insurance_refcode: string | null;
  insurance_service_name: string | null;
  service_group_id: string;
  service_group_name: string;
  service_group_name_order: number;
  service_group_type: string;
  service_order_number: number;
  package_id: string;
  unit_id: string;
  service_ratio: number;
  quantity: number;
  service_prices: number;
  insurance_service_prices: number;
  insurance_service_ratio: number;
  is_insurance: boolean;
  is_supplies: boolean;
  is_exams: boolean;
  is_group: boolean;
  is_has_execution: boolean;
  is_show_on_insurance: boolean;
  is_show_on_service: boolean;
  is_show_on_servicepoint: boolean;
  is_show_on_affiliate: boolean;
  is_addons: boolean | null;
  product_status: string;
}

export interface PackageItem {
  package_id: string;
  package_name: string;
  package_image: string;
  package_summary: string | null;
  package_content: string | null;
  package_prices: number;
  package_group_id: string | null;
  register_type_id: string | null;
  update_date: string;
  items: ServiceItem[];
}

export interface PackageResponse {
  data: PackageItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}
