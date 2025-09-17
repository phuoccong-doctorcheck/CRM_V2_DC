export interface ResponseHistoriesCall {
  result: string;
  message: string;
  total: number;
  data: CallItem[];
}

export interface CallItem {
  stt: number;
  key: string;
  ngayGoi: Date;
  soGoiDen: string;
  dauSo: string;
  soNhan: string;
  trangThai: CallState;
  tongThoiGianGoi: string;
  thoiGianThucGoi: string;
  linkFile: string;
  gsmPort: string;
  typecall: Typecall;
}

export enum CallState {
  Answered = "ANSWERED",
  Busy = "BUSY",
  Failed = "FAILED",
  NoAnswer = "NO ANSWER",
}

export enum Typecall {
  Inbound = "Inbound",
  Outbound = "Outbound",
}
