export type OTPEmployeeType = {
  id: number;
  fullname: string;
  phone: string;
  active: boolean;
  update_date: string;
};
export type RespDataLogin = {
  employee: OTPEmployeeType;
  otp_value: string;
};

export type RespAllDataLogin = {
  data: RespDataLogin;
  message: string;
  staus: boolean;
  client_ip: string;
};

// export type ForgotServiceType = {
//   email: string
// };
// export type ChangePassServiceType = {
//   code_verify: string;
//   _password: string;
//   email: string;
// };

// export type OptionDept = {
//   id_derp?: number;
//   value: number;
//   label: string;
//   id_user?: number;
//   email_depart: string;
//   phoneNumber: string;
//   domain?: string;
//   addition?: string;
//   slug?: string;
//   sub_name?: string;
// };
export type AlertType = "success" | "info" | "warning" | "error";

export interface ServiceItem {
  service_id: string;
  service_name: string;
  insurance_refcode: string;
  insurance_service_name: string;
  service_group_id: string;
  service_group_name: string;
  groupcost_id: number;
  bv01group_id: string;
  bv01group_name: string;
  bv01group_order_number: number;
  groupcost_name: string;
  service_group_subname: string;
  service_group_name_order: number;
  service_group_type: string;
  service_order_number: number;
  service_group_order_number: number;
  package_id: null;
  supplie_ids: string;
  parent_id: string;
  insurance_contractors: string;
  unit_id: string;
  unit_name: string;
  service_prices: number;
  insurance_service_prices: number;
  insurance_service_ratio: number;
  is_insurance: boolean;
  is_allow_quantity: boolean;
  is_supplies: boolean;
  is_exams: boolean;
  is_group: boolean;
  is_has_execution: boolean;
  is_show_on_insurance: boolean;
  is_show_on_service: boolean;
  is_show_on_servicepoint: boolean;
  is_show_on_affiliate: boolean;
  allow_pay_after: boolean;
  product_status: string;
  [x: string]: any;
}
export interface ServiceItemBG {
  service_id: string;
  service_name: string;
  insurance_refcode: string;
  insurance_service_name: string;
  service_group_id: string;
  service_group_name: string;
  groupcost_id: number;
  bv01group_id: string;
  bv01group_name: string;
  bv01group_order_number: number;
  groupcost_name: string;
  service_group_subname: string;
  service_group_name_order: number;
  service_group_type: string;
  service_order_number: number;
  service_group_order_number: number;
  package_id: null;
  supplie_ids: string;
  parent_id: string;
  insurance_contractors: string;
  unit_id: string;
  unit_name: string;
  service_prices: number;
  insurance_service_prices: number;
  insurance_service_ratio: number;
  is_insurance: boolean;
  is_allow_quantity: boolean;
  is_supplies: boolean;
  is_exams: boolean;
  is_group: boolean;
  is_has_execution: boolean;
  is_show_on_insurance: boolean;
  is_show_on_service: boolean;
  is_show_on_servicepoint: boolean;
  is_show_on_affiliate: boolean;
  allow_pay_after: boolean;
  product_status: string;
  discount: number;
  [x: string]: any;
}
