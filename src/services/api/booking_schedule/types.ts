export interface ResponseBooking {
  data: BookingScheduleItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface BookingScheduleItem {
  id: number;
  time_range: string;
  date: Date;
  master_count: number;
  appointment_slot_limit: number;
  appointment_slot_left: number;
  appointment_command_datetime: Date;
  order_number: number;
  is_show: boolean;
  master_id: string;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  customer_full_address: string;
  gender_id: string;
  gender_name: string;
  year_of_birth: number;
  launch_source_group_id: number;
  launch_source_group_name: string;
  launch_source_id: number;
  launch_source_name: string;
  launch_source_type_id: number;
  launch_source_type_name: string;
  affiliate_name: null;
  affiliate_type: null;
  appointment_note: string;
  appointment_date: Date;
  register_date: null;
  register_delay_date: null;
  is_register_delay: null;
  status: string;
  alt_status_display: string;
  status_display: string;
  reexam_display: string;
  status_color: string;
  status_fontcolor: string;
  f_type:string
}
