export interface CustomerStatisticResponse {
  data: CustomerStatisticData;
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerStatisticData {
  data: CustomerStatisticItem[];
  paging: Paging;
}

export interface Paging {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface CustomerStatisticItem {
  RowNumber: number;
  master_id: string;
  customer_id: string;
  f_type: string;
  launch_source_group_name: string;
  launch_source_name: string;
  session_count: number | null;

  appointment_note: string | null;
  note: string | null;

  affiliate_display_name: string | null;
  is_doctor_affiliate: boolean;

  customer_fullname: string;
  year_of_birth: number;
  customer_full_address: string;
  customer_phone: string;
  gender: string;

  create_date: string;
  appointment_date: string | null;
  register_date: string | null;
  register_delay_date: string | null;

  is_insurance: boolean | null;
  is_register_delay: boolean | null;
  is_care: boolean;
  is_re_exams: boolean;
  is_checkedin: boolean;

  care_employee_id: string;
  care_employee_name: string | null;

  next_reexamming_date: string | null;
  next_endoscopic_date: string | null;
  next_health_date: string | null;
  next_service_date: string | null;

  m_servicetype_name: string;
  m_exammingtype_name: string;
  m_endoscopictype_name: string;
  m_reexammingtype_name: string;

  status: string;
  status_display: string;

  is_register_package: boolean;
  package_id: string | null;
  package_name: string;

  affiliate_type: string;
  affiliate_name: string;
}
