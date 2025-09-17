export interface RangeTime {
  id: number;
  time_range: string;
  date: Date;
  appointment_count: number;
  appointment_slot_limit: number;
  appointment_slot_left: number;
  order_number: number;
  is_show: boolean;
  items: Item[];
}

export type Address = {
  stress: string;
  ward: string;
  dist: string;
  city: string;
};

export interface CustomerItem {
  master_id?: string;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  customer_full_address: Address;
  customer_email?: string;
  gender_name?: string;
  date_of_birth: Date;
  is_re_exams?: boolean;
  launch_source_id?: number;
  launch_source_name: string;
  affiliate_name?: null;
  affiliate_type?: null;
  appointment_note?: string;
  register_delay_note?: null;
  appointment_date?: Date;
  register_date?: null;
  register_delay_date?: null;
  is_register_delay?: null;
  status?: string;
  status_display?: string;
  alt_status_display?: string;
  status_color?: string;
  status_fontcolor?: string;
}

export type EmployeeRankType = {
  id_em: number;
  name: string;
  postion: string;
  qualityCustomer: number;
  qualityCustomerBooking: number;
  qualityWeek: number;
  transferPersent: number;
};

export interface DataLoginSuccess {
  data: InfoUserType;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface InfoUserType {
  username: string;
  fullname: string;
  lastname: string;
  employee_signature_name: string;
  token: string;
  clinic_id: number;
  department_id: string;
  employee_id: string;
  employee_group: string;
  employee_team_id: string;
  user_country_id: string;
  user_country_phone_prefix: string;
  user_call_agent: string;
  roles: Role[];
}

export interface Role {
  role_name: string;
  role_display_name: string;
  menu_display_name: string;
  menu_display_icon: string;
  menu_type: string;
  menu_order_number: number;
  module: string;
  is_default: boolean;
}

export interface UserCallAgent {
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
  sip_realm: string;
  sip_ws_url: string;
}


export type Messagetype = 'success' | 'error' |'info'|'warning'|'loading'