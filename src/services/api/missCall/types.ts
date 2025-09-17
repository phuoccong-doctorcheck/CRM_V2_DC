type MonitorStatus = "MISSCALL" | "ANSWERED";
export interface ListCallResponse {
  data: CallItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface CallItem {
  id: string;
  call_id: string;
  sip_call_id: string;
  log_date: Date;
  from_number: string;
  to_number: string;
  receive_dest: string;
  hotline: string;
  direction: string;
  billsec: number;
  duration: number;
  recording_url: string;
  state: string;
  status: string;
  time_answered: null;
  time_started: Date;
  time_ended: Date;
  recall_agent_id: null;
  recall_datetime: null;
  is_recall: boolean;
  is_solved: boolean;
  is_endpoint: boolean;
  monitor_status: MonitorStatus;
}