export interface RespStatistic {
  data: StatisticCustomerItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface StatisticCustomerItem {
  master_id: string;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  customer_full_address: string;
  gender_id: string;
  year_of_birth: number;
  is_re_exams: boolean;
  launch_source_group_id: number;
  launch_source_group_name: string;
  launch_source_id: number;
  launch_source_name: string;
  launch_source_type_id: number;
  launch_source_type_name: string;
  appointment_note: string;
  register_delay_note: string;
  jsonitems: string;
  register_date: Date;
  register_delay_date: Date;
  is_register_delay: boolean;
  status: string;
  total_drugs: number;
  total_services: number;
  is_register_package: boolean;
  package_name: string;
  affiliate_type: string;
  affiliate_name: string;
  appointment_date: Date;
  master_type: string;
  status_display: string;
}

export interface ResponseAppointmentByEmployee {
  data: AppointmentByEmployeeItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface AppointmentByEmployeeItem {
  create_date: Date;
  employee_name: string;
  appointment_datetime: Date;
  payment_date: Date;
  register_type_id: string;
  master_ref: string;
  customer_ref_code: string;
  customer_fullname: string;
  customer_phone: string;
  total_commission: number;
  note: string;
  f_type: string;
  internal_note: string;
  status: string;
  approval: string;
  approval_display: string;
  details: AppointmentByEmployeeDetail[];
}

export interface AppointmentByEmployeeDetail {
  appointment_datetime: Date;
  service_ref: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  commission_value: number;
}
/* report */

export interface responseReport {
  data: ReportData;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface ReportData {
  success: boolean;
  message: string;
  data: ReportDataItem[];
  launch_source?: ReportlaunchSource[];
}

export interface ReportlaunchSource {
  launch_source_group_id: number;
  launch_source_group_name: string;
  launch_source_id: string;
  launch_source_name: string;
}

export interface ReportDataItem {
  week: string | number;
  day: string | number;
  investment_amount: number;
  customer_number: number;
  service_revenue: number;
  medical_revenue: number;
  total_revenue: number;
  cost_price: number;
  gross_profit: number;
  debt_balance: number;
  fixed_assets: number;
  daily_expenses: number;
  dc_report: brandReport;
  endo_report: brandReport;
  details: DetailItem[];
}

export interface brandReport {
  cost_price: number;
  customer_number: number;
  gross_profit: number;
  investment_amount: number;
  launch_source_group_id: number;
  launch_source_group_name: string;
  revenue: number;
}
export interface DetailItem {
  report_date: Date;
  launch_source_group_id: number;
  launch_source_group_name: string;
  launch_source_id: string;
  launch_source_name: string;
  investment_amount: number;
  customer_number: number;
  revenue: number;
  cost_price: number;
  gross_profit: number;
}

export interface ResponseGrowthReport {
  data: GrowthReportDateData;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface GrowthReportDateData {
  success: boolean;
  message: string;
  data: GroupLaunchSource[];
}

export interface GroupLaunchSource {
  multi: boolean;
  launch_source_group_id: number;
  launch_source_group_name: string;
  details: GrowthReportDateItem[];
}

export interface GrowthReportDateItem {
  report_date: Date;
  week: number;
  launch_source_group_name: string;
  launch_source_name: string;
  investment_amount: number;
  services: Growth[];
  growths: Growth[];
}

export interface Growth {
  name: string;
  customer_number: number;
}


// ---------------------------------- Thống kê khảo sát -----------------------
export interface ResponseSurveyStatistics {
  data: SurveyStatisticsItem;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface SurveyStatisticsItem {
  survey_title: string;
  fromdate: Date;
  todate: Date;
  items: SurveyStatisticsItemChild[];
}

export interface SurveyStatisticsItemChild {
  q_id: number;
  q_title: string;
  q_type: string;
  s_total: number;
  statistics: SurveyStatisticsItem[]
}

export interface SurveyStatisticsItem {
  scores: number;
  score_total: number;
  comment_total: number;
  comments: SurveyStatisticsItemComment[];
}
export interface SurveyStatisticsItemComment {
  datetime: Date;
  owner: string;
  content: string;
}