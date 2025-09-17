import { Paging } from "../afterexams/types";

export interface ResponseCustomerPoints {
  data: CustomerPointItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface CustomerPointItem {
  create_date: Date;
  customer_code: string;
  customer_name: string;
  current_point: number;
  pending_point: number;
  equivalent_amount: number;
  latest_point_add_date: Date;
  latest_sms_send_date: Date;
  sms_send_count: number;
  is_gift_exchange: boolean;
}

export interface ResponsePastService {
  data: PastServiceDayItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface PastServiceDayItem {
  payment_day: Date;
  details: PastServiceDetail[];
}

export interface PastServiceDetail {
  service_code: string;
  service_name: string;
  quantity: number;
  unit_price: number;
}

export interface ReponseServiceByUsage {
  data: ServiceByUsageItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface ServiceByUsageItem {
  no: number;
  service_code: string;
  service_name: string;
  service_price: number;
  usage_count: number;
}

export interface ReponseGiftExchanges {
  data: GiftExchangesItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface GiftExchangesItem {
  exchange_day: Date;
  exchange_points: number;
  equivalent_amount: number;
  gift_value: number;
  remaining_points: number;
  executor: boolean | string;
  received_gift: boolean;
  note: string;
  gift_details: GiftDetail[];
}

export interface GiftDetail {
  gift_code: string;
  gift_name: string;
  quantity: number;
}

export interface TemplateSMSItem {
  id: number;
  name: string;
  content: string;
  order_number: number;
  is_marked: boolean;
  is_used: boolean;
  sms_count: number;
}

export interface ResponseCustomerLeads {
  data: {
    items: CustomerLeadItem[];
    paging: Paging;
  };
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerLeadItem {
  RowNumber: number;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  launch_source_group_name: string | null;
  launch_source_name: string | null;
  master_count: number;
  create_date: Date;
}

/* ------------- */

export interface ResponseCustomerFType {
  data: CustomerFTypeData;
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerFTypeData {
  items: CustomerFTypeItem[];
  paging: Paging;
}

export interface CustomerFTypeItem {
  RowNumber: number;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  launch_source_group_name: string;
  launch_source_name: string;
  create_date: Date;
  master_count: number;
}


/*----------*/
export interface ResponseCustomerRemind {
  data: {
    items: CustomerRemindItem[];
    paging: Paging;
  };
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerRemindItem {
  RowNumber: number;
  customer_id: string;
  customer_fullname: string;
  customer_phone: string;
  launch_source_group_name: string | null;
  launch_source_name: string | null;
  master_count: number;
  create_date: Date;
}
/*----------*/
export interface ResponseCustomerRemindNote {
  data: CustomerRemindNoteItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CustomerRemindNoteItem {
  status: string;
  fullname: string | null;
  suggestion_note: string | null;
  suggestion_count: number;
  last_suggestion: Date;
}
/*----------*/
export interface ResponseListPointOfCustomer {
  data: ResponseListPointOfCustomerItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface ResponseListPointOfCustomerItem {
  note: string;
  type_display: string | null;
  type: string | null;
  points: number;
  date: Date;
}