// Định nghĩa kiểu cho một dịch vụ (item)
export interface ServiceItem {
  service_id: string;
  service_name: string;
  service_group_name: string;
  unit_name: string;
  quantity: number;
  discount: number;
  prices: number;
  insurance_prices: number;
  insurance_object_ratio: number;
  total_services: number;
  total_insurances: number;
  total: number;
  is_insurance: boolean;
  sequence: number;
}

// Định nghĩa kiểu cho `data`
export interface QuoteData {
  fullname: string;
  yob: number;
  gender: "Nam" | "Nữ";
  is_insurance: boolean;
  insurance_object_ratio: number;
  discount: number;
  total_services: number;
  total_insurances: number;
  total: number;
  items: ServiceItem[];
}

// Định nghĩa kiểu cho toàn bộ JSON
export interface QuoteResponse {
  data: QuoteData;
  message: string;
  status: boolean;
  client_ip: string;
}
