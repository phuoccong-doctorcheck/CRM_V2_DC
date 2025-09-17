export interface RevenueEntry {
  f_type: string;
  source: string;
  customer_count: number;
  expected_revenue: number;
  actual_revenue: number;
  cost_of_goods: number;
  chanel: string;
}

export interface DashboardData {
  source: string;
   chanel: string;
  brand: string;
  brand_name: string;
  expected_total: number;
  real_total: number;
  cost_total: number;
  commission_total: number;
  profix_total: number;
  customer_count: number;
}

export interface DashboardResponse {
  data: DashboardData[];
  message: string;
  status: boolean;
  client_ip: string;
}
export interface Target {
  kpi_key: any;
  is_show: boolean;
  criteria_id: string;
  criteria_code: string;
  criteria_name: string;
  target_id: number;
  target_value: number;
  target_unit: string;
  result_unit: string;
  from_date: string;  // ISO date string, e.g., "2025-07-01T00:00:00+07:00"
  to_date: string;
  ads_account_id: string;
  order_numbers: number;
}
export interface DataReport {
  cpm: number;
  tag_statistics_by_ad: any;
  ads_account_id: string;
  amount_spent: number;
  post_comments: number;
  new_messaging_contacts: number;
  tag_inbox_warm: number;
  tag_inbox_hot: number;
  tag_leave_phone_number: number;
  tag_appointment: number;
  erp_so_luong_khach_hang_den_kham: number;
  erp_doanh_thu_thuc_te_trong_ngay: number;
  erp_gia_tri_kham_trung_binh_thuc_te: number;
  pancake_crm_so_luong_dat_hen: number;
  pancake_crm_doanh_thu_du_kien: number;
  so_luot_hoan_thanh_kham: number;
  date: string;
  dau_tu: number;
  tong_tin_nhan: number;
  tin_nhan_chat_luong: number;
  gia_tren_tin_nhan: number;
  ti_le_tin_nhan_chat_luong: number;
  ti_le_dat_hen_tren_tin_nhan_chat_luong: number;
  ti_le_den_kham_tren_dat_hen: number;
  ti_le_hoan_thanh_kham_tren_tin_nhan_chat_luong: number;
  gia_tri_kham_trung_binh_thuc_te: number;
  dau_tu_tren_1_kh_thuc_te_den: number;
  ti_le_hoan_thanh_tren_so_luong_den: number;
  so_luong_dat_hen: any;
  ti_le_den_tren_sl_dat_hen: number;
  so_luong_khach_hang_den_kham: number;
  doanh_thu_du_kien: number;
  doanh_thu_thuc_te_trong_ngay: number;
  ti_le_hoan_thanh_kham_tren_sl_tin_nhan: number;
  inbox_nong: number;
  inbox_sdt: number;
  ti_le_inbox_nong_tren_lead: number;
  inbox_am: number;
}
export interface TagStatisticsByPage {
  date: any;
  fb_page_id: any;
  tag_appointment: any;
  tag_inbox_warm: any;
  tag_inbox_hot: any;
  tag_leave_phone_number: any;
  [key: string]: number | undefined;
}
export interface RevenueFromErp {
  day: any;
  expected_total: any;
  real_total: any;
  [key: string]: number | undefined;
}
export interface DashboardMarketingResponse {
  data: {
    targets: Target[];
    data_reports: DataReport[];
    tag_statistics_by_ad: TagStatisticsByPage[];
    revenue_from_erp: RevenueFromErp[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
// Loại chiến dịch quảng cáo (campaign)
export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  objective: string;
  status: string;
}

// Loại tài khoản quảng cáo
export interface AdsAccount {
  ads_account_id: string;
  ads_account_name: string;
  ads_account_type: string;
  is_use: boolean;
  order_numbers: number;
  campaigns: Campaign[];
}

// Dữ liệu chính trả về từ API
export interface AdsAccountResponse {
  data: AdsAccount[];
  message: string;
  status: boolean;
  client_ip: string;
}
