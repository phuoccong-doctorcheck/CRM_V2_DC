

export interface loadKPIAgencyView {
  data: {
    from_date: Date;
    to_date: Date;
    [x: string]: any;
    details: loadKPIAgencyViewItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIAgencyViewItem {


    team_id: string,
    target_customer: any,
    target_revenue: any,
    target_commision: any,
    real_customer: any,
    real_revenue: any,
    real_commision: any,
 
}


export interface loadKPIEmployeeView {
  
  data: {
    employee_id: string
    from_date: Date
    to_date: Date
    [x: string]: any;
    details: loadKPIEmployeeViewItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIEmployeeViewItem {
  kpi_id: number
  kpi_name: string;
  target_customer: number;
  target_revenue: number;
  target_commision: number;
  real_customer: number;
  real_revenue: number;
  real_commision: number;
   [x: number]: any;
   statistic_by_page: Array<{
    new_inbox_count: number;
    old_inbox_count: number;
    phone_number_count: number;
  }>;
}

export interface loadKPIEmployeeViewMonth {
  
  data: {
    employee_id: string
    from_date: Date
    to_date: Date
    [x: string]: any;
    details: loadKPIEmployeeViewMonthItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIEmployeeViewMonthItem {
  kpi_id: number
  kpi_name: string;
  target_customer: number;
  target_revenue: number;
  target_commision: number;
  real_customer: number;
  real_revenue: number;
  real_commision: number;
  loadKPIEmployeeViewMonth: number
  customer_appointments_count: number
  customer_checkin_count: number
  customer_contacts_count: number
  customer_refered_count: number
  customer_rescreening_appointments_count: number
  customer_add_service_retail_count: number
  revenue: number
   [x: number]: any;
   statistic_by_page: Array<{
    new_inbox_count: number;
    old_inbox_count: number;
    phone_number_count: number;
  }>;
}

export interface loadKPIEmployeeChartView {
  data: {
    from_date: Date
    to_date: Date
    [x: string]: any;
    employees: loadKPIEmployeeChartViewItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
export interface loadKPIEmployeeChartViewItem {
  employee_id: string;
  employee_fullname: string;
  [x: string]: any;
  details: {
     kpi_assign_id: number
  kpi_id: number
  kpi_name: string;
  kpi_code: string;
  target_customer: number;
  target_revenue: number;
  target_commision: number;
  real_customer: number;
  real_revenue: number;
  real_commision: number;
  status: string
  }[]
}

export interface loadKPIEmployeeChartViewItem1 {
  kpi_assign_id: number
  kpi_id: number
  kpi_name: string;
  kpi_code: string;
  target_customer: number;
  target_revenue: number;
  target_commision: number;
  real_customer: number;
  real_revenue: number;
  real_commision: number;
  status: string
}