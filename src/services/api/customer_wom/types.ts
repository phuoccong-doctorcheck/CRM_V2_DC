


export interface ResponCustomerWom {
  data: ResponCustomerWomData;
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

// Định nghĩa cho phần `data`
export interface ResponCustomerWomData {
  items: ResponCustomerWomItem[];
  paging: Paging;
}

// Định nghĩa cho mỗi mục trong `items`
export interface ResponCustomerWomItem {
  TotalRow: number;
  RowNum: number;
  Id_NguoiGioiThieu: string;
  Ten_NguoiGioiThieu: string;
  SL_NguoiDaGioiThieu: number;
  LanGioiThieuGanNhat: string; // ISO 8601 date string
}

// Định nghĩa cho phần `paging`
export interface Paging {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}


///

export interface ResponCustomerWomById {
  data: ResponCustomerWomByIdData[];
  message: string;
  status: boolean;
  client_ip: string;
}

// Định nghĩa cho phần `data`
export interface ResponCustomerWomByIdData {
customer_id: string;
  customer_fullname: string;
  username: string | null;
  members_id: string | null;
  member_display_text: string | null;
  status_account: string | null;
  pending_points: number | null;
  use_points: number | null;
  loyalty_points: number | null;
  Id_NguoiGioiThieu: string;
}