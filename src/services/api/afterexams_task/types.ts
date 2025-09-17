export type Paging = {
  page_number: number;
  page_size: number;
  total_count: number;
  total_page: number;
  has_previous_page: boolean;
  has_next_page: boolean;
};
export interface ApiAfterExamTaskResponse {
  data: {
    data: ScheduleTasksResult[]; // Mảng kiểu DcGetCsScheduleTasksResult
    paging: Paging; // Thông tin phân trang
  };
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}
export interface ScheduleTasksResult {
  rowNumber?: number | null; // Nullable<long>
  customerId?: string; // string
  masterId?: string; // string
  scheduleId: number; // long
  csType?: string; // string
  customerFullname?: string; // string
  yearOfBirth?: number | null; // Nullable<int>
  customerFullAddress?: string; // string
  customerPhone?: string; // string
  gender?: string; // string
  csTitle?: string; // string
  csNotes?: string; // string
  doctorEmployeeId?: string; // string
  doctorEmployeeName?: string; // string
  csEmployeeId?: string; // string
  csEmployeeName?: string; // string
  exammingDate?: Date | null; // Nullable<System.DateTime>
  beginDrugDate?: Date | null; // Nullable<System.DateTime>
  endDrugDate?: Date | null; // Nullable<System.DateTime>
  csLastestDatetime?: Date | null; // Nullable<System.DateTime>
  csRemindDate?: Date | null; // Nullable<System.DateTime>
  csCount?: number | null; // Nullable<int>
  isReschedule?: boolean | null; // Nullable<bool>
  hasReexamming?: boolean | null; // Nullable<bool>
  hasDrugs?: boolean | null; // Nullable<bool>
  cs_status?: string; // string
}
