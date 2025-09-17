
//

// Định nghĩa kiểu dữ liệu cho một khách hàng
export interface CustomerItem {
  RowNumber: number;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  gender: string;
  year_of_birth: number;
  age: number;
  launch_source_group_id: number;
  launch_source_id: number;
  launch_source_group_name: string;
  launch_source_name: string;
  session_count: number;
  ago_month: number;
  f_type: string;
  create_date: string; // ISO format
  lastvisit: string | null;
  pending_points: number | null;
  use_points: number | null;
  loyalty_points: number | null;
  members_id: string | null;
  member_display_text: string | null;
}

// Định nghĩa kiểu dữ liệu cho phân trang
export interface Paging {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

// Định nghĩa kiểu dữ liệu cho phần "data"
export interface CustomerData {
  items: CustomerItem[];
  paging: Paging;
}

// Kiểu dữ liệu tổng thể của response
export interface CustomerResponse {
  data: CustomerData;
  message: string;
  status: boolean;
  client_ip: string;
}
