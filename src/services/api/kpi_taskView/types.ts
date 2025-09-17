

export interface loadKPIDaysView {
  data: {
    [x: string]: any;
    data: loadKPIDaysViewItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}

export interface loadKPIDaysViewItem {
  employee_id: string;
  date: Date;
  details?: {
    type_statistic_id: number;
    type_statistic_name: string;
    statistic_by_page?: Array<{
      launch_source_group_id: number;
      launch_source_group_name: string;
      new_inbox_count: number;
      old_inbox_count: number;
      phone_number_count: number;
    }>;
    customer_appointments_count?: number | null;
    customer_checkin_count?: number;
    revenue?: number;
    customer_contacts_count?: number | null;
    customer_add_service_retail_count?: number | null;
    customer_rescreening_appointments_count?: number | null;
    customer_refered_count?: number | null;
  }
}
///////////////

export interface loadKPIDaysView1 {
  data: {
    employee_id: string;
    from_date: Date;
    to_date: Date;
    statistics_by_date: Array<loadKPIDaysViewItem12>; // Đã bỏ generic types
  };
  message: string;
  status: boolean;
  client_ip: string;
}

export interface loadKPIDaysViewItem12 {
  employee_id: string;
  date: Date;
  details?: {
    type_statistic_id: number;
    type_statistic_name: string;
    statistic_by_page?: Array<{
      launch_source_group_id: number;
      launch_source_group_name: string;
      new_inbox_count: number;
      old_inbox_count: number;
      phone_number_count: number;
    }>;
    customer_appointments_count?: number | null;
    customer_checkin_count?: number;
    revenue?: number;
    customer_contacts_count?: number | null;
    customer_add_service_retail_count?: number | null;
    customer_rescreening_appointments_count?: number | null;
    customer_refered_count?: number | null;
  };
}



////

export interface loadKPIDaysType {
  employee_id: string
  employee_name: string
  data: {
    [x: string]: any;
    list_kpis: loadKPIDaysItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}

export interface loadKPIDaysItem {
  kpi_assign_id: number;
  kpi_id: number
  kpi_code: string;
  title: string;
  kpi_name: string;
  number_chats?: number;
  number_appointments?: any;
  number_inbox?: any;
  number_hot_customers?: any;
  number_warm_customers?: any;
  number_cold_customers?: any;
}
