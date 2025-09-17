export interface ScheduleCall {
  c_schedule_id: number;
  c_schedule_type_id: string;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  c_schedule_employee_id: string;
  doctor_fullname: string;
  employee_signature_name: string;
  c_schedule_title: string;
  c_schedule_note: string;
  cs_notes_json: any; // có thể thay bằng kiểu cụ thể nếu biết rõ
  c_schedule_datetime: string; // ISO datetime string
  status: string;
}

export interface Paging  {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface ScheduleCallResponse  {
  data: {
    data: ScheduleCall[];
    paging: Paging;
  };
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}
