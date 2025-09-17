export interface TaskItem {
  id: number;
  category_id: number;
  own_team_id: string;
  own_team_name: string;
  own_u_id: string;
  own_u_name: string;
  exec_u_id: string;
  exec_u_name: string | null;
  lead_id: number;
  customer_id: number | null;
  visit_id: number | null;
  task_name: string;
  task_description: string;
  task_last_note: string;
  create_datetime: string;
  assign_datetime: string;
  remind_datetime: string;
  update_datetime: string;
  task_his_id: number | null;
  userflow_id: number | null;
  status: string;
}

export interface TaskResponse {
  data: TaskItem[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface TaskItemE {
  id: number;
  category_id: number;
  own_team_id: string;
  own_team_name: string;
  own_u_id: string;
  own_u_name: string;
  exec_u_id: string;
  exec_u_name: string | null;
  lead_id: number;
  customer_id: number | null;
  visit_id: number | null;
  task_name: string;
  task_description: string;
  task_last_note: string;
  create_datetime: string;
  assign_datetime: string;
  remind_datetime: string;
  update_datetime: string;
  task_his_id: number | null;
  userflow_id: number | null;
  status: string;
}

export interface TaskResponseE {
  data: TaskItemE[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface TaskSummaryItem {
  category: string;
  total: number;
  completed: number;
  pending: number;
  completed_percent: number;
}

export interface TaskSummaryResponse {
  data: TaskSummaryItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

/////
// Lead item
export interface Lead {
  lead_id: number;
  lead_nickname: string;
  lead_name: string;
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
  lead_pancake_id: string | null;
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
  step_id: number | null;
  customer_id: number | null;
  master_id: number | null;
  saleorder_id: number | null;
  create_date: string | null;
  update_date: string | null;
  bg_color: string | null;
  attribute_jsons: any; // có thể khai báo chi tiết hơn nếu biết rõ cấu trúc
  status: string;
  ad_id: string | null;
  task_name: string | null;
  task_status: string | null;
  tag_id: number | null;
  tag_name: string | null;
  name_field_code: string | null;
  tags: any[]; // nếu tag có schema riêng thì nên định nghĩa interface
}

// Data object chứa các nhóm follow
export interface FollowData {
  follow_7: Lead[];
  follow_14: Lead[];
  follow_23: Lead[];
}
export interface TaskFollowBuckets {
  follow_7?: Lead[];
  follow_14?: Lead[];
  follow_23?: Lead[];
}
// Response chung
export interface FollowResponse {
  data: {
     my_task?: Lead[];                 // có nhưng không dùng cho 7/14/23
    task_follow?: TaskFollowBuckets;  // nguồn chính cho 7/14/23
  };
  message: string;
  status: boolean;
  client_ip: string;
}
