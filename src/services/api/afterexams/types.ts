type CsGuidType = "guid" | "conversation";

type UpdateEmployee = {
  id: string;
  name: string;
};

type StagesAfterExamsType = {
  stages: StagesAfterExamsItemType[];
  userguids: UserguidsAfterExamsItemType[];
};

type StagesAfterExamsItemType = {
  id: string;
  name: string;
  position: number;
};

export interface UserguidsAfterExamsItemType {
  cs_guid_id: string;
  cs_guid_type: CsGuidType;
  update_employee: UpdateEmployee;
  cs_guid_title: string;
  cs_guid_tags: string;
  cs_guid_content: string;
  tags: string[];
  update_datetime: Date;
  is_public: boolean;
}

export type RespInitAfterExams = {
  data: StagesAfterExamsType;
  message: string;
  status: boolean;
  client_ip: string;
};

export type ItemListAfterExams = {
  RowNumber: number;
  customer_id: string;
  process_key_id: string;
  process_kanban_color: string;
  process_kanban_name: string;
  master_id: string;
  process_note: string;
  process_note_datetime: Date;
  process_datetime: Date;
  update_date: Date;
  bg_color: string;
  customer_fullname: string;
  year_of_birth: number;
  gender_id: string;
  gender_name: string;
  customer_phone: string;
  launch_source_id: number;
  launch_source_name: string;
  custome_attribute: string;
  is_has_prescriptions: boolean;
  is_re_exams: boolean;
  is_show: boolean;
};

export type Paging = {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
};

export type ListAfterExams = {
  data: {
    data: ItemListAfterExams[];
    paging: Paging;
  };
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
};

export type RequestListAfterExams = {
  processKeyId: string;
  launchSourceID: number;
  launchSourceGroupID: number;
  launchSourceTypeID: number;
  dateFilterType: number;
  fromDay: Date;
  toDay: Date;
  keyWord: string;
  pages: number;
  limits: number;
  isDefault?: boolean;
  statusRes: string;
};

export interface StatisticAfterExams {
  data: StatisticAfterExamsItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface StatisticAfterExamsItem {
  process_id: string;
  process_name: string;
  sequence: number;
  total: number;
}

export interface detailUserGuid {
  data: detailUserGuidItem;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface detailUserGuidItem {
  cs_guid_id: string;
  cs_guid_type: string;
  update_employee_id: string;
  update_employee_name: string;
  cs_guid_title: string;
  cs_guid_tags: string;
  cs_guid_content: string;
  tags: string[];
  update_datetime: Date | string;
  is_public: boolean;
}
export interface tagItems {
  tag_id: number;
  tag_name: string;
  tag_type: any;
  tag_color: string;
  pancake_tag_id: string;
  is_show: boolean;

}
export type UserGuidListResp = {
  data: detailUserGuidItem[];
  message: string;
  status: boolean;
  client_ip: string;
};
export interface detailUserGuidItem2 {
  RowNumber: number;
  guid_id: number;
  category_id: number;
  category_name: string;
  guid_title: string;
  guid_content: string;
  guid_suggest: string;
  guid_update_datetime: string;
  guid_u_id: string;
  guid_u_name: string | null;
  guid_status: string;

}

export type UserGuidListResp2 = {
  data: detailUserGuidItem2[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
};
