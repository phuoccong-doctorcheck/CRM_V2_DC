import { Paging } from "services/api/afterexams/types";

export interface AppointmentViewResp {
  data: {
    data: AppointmentViewItem[];
    paging: Paging;
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface AppointmentViewItem {
  index: number;
  master_id: string;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  customer_full_address: string;
  gender_name: string;
  year_of_birth: number;
  is_re_exams: boolean;
  launch_source_group_name: string;
  launch_source_name: string;
  launch_source_type_name: string;
  affiliate_name: string;
  affiliate_type: string;
  appointment_note: string;
  register_delay_note: null;
  care_employee_id: null;
  care_employee_name: null;
  appointment_date: Date;
  register_date: null;
  register_delay_date: null;
  care_datetime: null;
  is_register_delay: null;
  is_register_package: null;
  is_care: boolean;
  status: string;
  master_type: string;
  status_display: string;
  package_name: string;
  note: string;
  items: ServiceItem[];
}
interface ServiceItem {
  service_id: string;
  service_name: string;
  service_group_type: string;
  service_group_name: string;
  service_group_order_number: number;
  quantity: number;
  unit_name: string;
  service_prices: number;
}

export interface StatisticAppointmentCustomize {
  data: StatisticItemCustomize[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface StatisticAppointment {
  data: StatisticItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface StatisticItem {
  id: string;
  sequence: number;
  title: string;
  count: number;
}

export interface StatisticItemCustomize {
  id: string;
  title: string;
  child: StatisticItem[];
}
