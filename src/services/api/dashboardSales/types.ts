export interface ApiTargetDB {
  id: number;
  page_id: string;
  target_key: string;
  target_value: number;
  target_description: string;
  target_month: number;
  target_year: number;
  sequence: number;
}

// Interface định nghĩa cho response tổng thể
export interface TargetResponseDB {
  data: ApiTargetDB[];
  message: string;
  status: boolean;
  client_ip: string;
}