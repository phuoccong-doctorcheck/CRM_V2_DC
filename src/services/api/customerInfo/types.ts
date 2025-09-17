import { Paging } from "services/api/afterexams/types";

export interface CategotiesCustomer {
  data: CategotiesItem[];
  message: string;
  status: boolean;
  client_ip: string;
}

export interface CategotiesItem {
  customer_id: string;
  master_id: string;
  status: string;
  is_re_exams: boolean;
  register_date: Date;
  items: GroupCategotiesItem[];
}

export interface GroupCategotiesItem {
  service_group_type: string;
  service_group_type_name: string;
  order_number: number;
  items: ItemItem[];
}

export interface ItemItem {
  id: string;
  name: string;
  title: string;
  order_number: number;
  status: Status;
}

export interface Status {
  status: string;
  displayname: string;
  color: string;
}

export interface ResponseGetTask {
  data: TaskItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface TaskItem {
  RowNumber: number;
  task_id: string;
  task_type_id: string;
  task_type_name: string;
  task_name: string;
  task_description: string;
  task_notes: string;
  task_last_note: string;
  customer_id: string;
  master_id: null;
  employee_team_id: string;
  create_employee_id: string;
  create_employee_name: string;
  assign_employee_id: string;
  assign_employee_name: string;
  update_employee_id: string;
  update_employee_name: string;
  assign_datetime: Date;
  remind_datetime: Date;
  create_datetime: Date;
  update_datetime: Date;
  customer_fullname: string;
  year_of_birth: null;
  gender_id: string;
  gender_name: null;
  customer_phone: string;
  task_status: string;
  task_status_text: string;
}

export interface ExternalFileResp {
  data: ExternalFileData;
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface ExternalFileData {
  data: ExternalFileDataItem[];
  paging: Paging;
}

export interface ExternalFileDataItem {
  id: string;
  customer_id: string;
  out_exams_title: string;
  out_exams_note: string;
  file: File;
  create_employee: AteEmployee;
  update_employee: AteEmployee;
  create_datetime: Date;
  update_datetime: Date;
  order_number: number;
  is_image: boolean;
  is_show: boolean;
}

export interface AteEmployee {
  id: string;
  name: string;
}

export interface File {
  path: string;
  name: string;
  extension: string;
}

export interface RespSurvey {
  data: DataSurvey;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface DataSurvey {
  survey: Survey;
  surveynotices: Surveynotices;
}

export interface Survey {
  card_survey_id: string;
  survey_id: string;
  customer_id: string;
  master_id: null;
  survey_type: string;
  survey_version: string;
  survey_title: string;
  card: SurveyCard;
  review_employee: ReviewEmployee;
  create_date: Date;
  update_date: Date;
  review_date: Date;
  is_review: boolean;
  status: string;
}

export interface SurveyCard {
  q1: string;
  q1_text: string;
  q2: string;
  q2_text: string;
  q3: string;
  q3_text: string;
  q4: string;
  q4_text: string;
  q5: string;
  q5_text: string;
  q6: string;
  q6_tmg_yes: boolean;
  q6_tmg_no: boolean;
  q6_tmg_unknown: boolean;
  q6_vg_yes: boolean;
  q6_vg_no: boolean;
  q6_vg_unknown: boolean;
  q6_bgm_yes: boolean;
  q6_bgm_no: boolean;
  q6_bgm_unknown: boolean;
  q6_vlddtt_yes: boolean;
  q6_vlddtt_no: boolean;
  q6_vlddtt_unknown: boolean;
  q6_nhp_yes: boolean;
  q6_nhp_no: boolean;
  q6_nhp_unknown: boolean;
  q6_vldt_yes: boolean;
  q6_vldt_no: boolean;
  q6_vldt_unknown: boolean;
  q6_pldtt_yes: boolean;
  q6_pldtt_no: boolean;
  q6_pldtt_unknown: boolean;
  q6_tri_yes: boolean;
  q6_tri_no: boolean;
  q6_tri_unknown: boolean;
  q6_tm_yes: boolean;
  q6_tm_no: boolean;
  q6_tm_unknown: boolean;
  q6_rldcm_yes: boolean;
  q6_rldcm_no: boolean;
  q6_rldcm_unknown: boolean;
  q6_blhhk_yes: boolean;
  q6_blhhk_no: boolean;
  q6_blhhk_unknown: boolean;
  q6_dkhdq_yes: boolean;
  q6_dkhdq_no: boolean;
  q6_dkhdq_unknown: boolean;
  q6_tha_yes: boolean;
  q6_tha_no: boolean;
  q6_tha_unknown: boolean;
  q6_btm_yes: boolean;
  q6_btm_no: boolean;
  q6_btm_unknown: boolean;
  q6_dtd_yes: boolean;
  q6_dtd_no: boolean;
  q6_dtd_unknown: boolean;
  q6_rlttk_yes: boolean;
  q6_rlttk_no: boolean;
  q6_rlttk_unknown: boolean;
  q6_lp_yes: boolean;
  q6_lp_no: boolean;
  q6_lp_unknown: boolean;
  q6_bphhs_yes: boolean;
  q6_bphhs_no: boolean;
  q6_bphhs_unknown: boolean;
  q6_btg_yes: boolean;
  q6_btg_no: boolean;
  q6_btg_unknown: boolean;
  q6_tk_yes: boolean;
  q6_tk_no: boolean;
  q6_tk_unknown: boolean;
  q6_hiv_yes: boolean;
  q6_hiv_no: boolean;
  q6_hiv_unknown: boolean;
  q6_ut_yes: boolean;
  q6_ut_no: boolean;
  q6_ut_unknown: boolean;
  q6_note_text: string;
  q7: string;
  q7_bl1_text: string;
  q7_n1_text: string;
  q7_bc1_text: string;
  q7_bl2_text: string;
  q7_n2_text: string;
  q7_bc2_text: string;
  q7_bl3_text: string;
  q7_n3_text: string;
  q7_bc3_text: string;
  q8: string;
  q8_yes: boolean;
  q8_no: boolean;
  q9: string;
  q9_yes: boolean;
  q9_no: boolean;
  q10: string;
  q10_text: string;
  q11: string;
  q11_pt1_text: string;
  q11_n1_text: string;
  q11_bc1_text: string;
  q11_pt2_text: string;
  q11_n2_text: string;
  q11_bc2_text: string;
  q11_pt3_text: string;
  q11_n3_text: string;
  q11_bc3_text: string;
  q12: string;
  q12_htl_cth: boolean;
  q12_htl_thvdb: boolean;
  q12_htl_hdch: boolean;
  q12_htl_hdch_text: string;
  q12_urb_yes: boolean;
  q12_urb_no: boolean;
  q12_sdtgd_yes: boolean;
  q12_sdtgd_no: boolean;
  q13: string;
  q13_text: string;
  q14: string;
  q14_t1_text: string;
  q14_l1_text: string;
  q14_ls1_text: string;
  q14_t2_text: string;
  q14_l2_text: string;
  q14_ls2_text: string;
  q14_t3_text: string;
  q14_l3_text: string;
  q14_ls3_text: string;
  q15: string;
  q15_text: string;
  q16: string;
  q16_br_text: string;
  q16_mr_text: string;
  q16_aer_text: string;
  q16_cer_text: string;
  q17: string;
  q17_utv_yes: boolean;
  q17_utv_no: boolean;
  q17_utv_unknown: boolean;
  q17_onmt_yes: boolean;
  q17_onmt_no: boolean;
  q17_onmt_unknown: boolean;
  q17_utdt_yes: boolean;
  q17_utdt_no: boolean;
  q17_utdt_unknown: boolean;
  q17_pldt_yes: boolean;
  q17_pldt_no: boolean;
  q17_pldt_unknown: boolean;
  q17_vldt_yes: boolean;
  q17_vldt_no: boolean;
  q17_vldt_unknown: boolean;
  q17_dtd_yes: boolean;
  q17_dtd_no: boolean;
  q17_dtd_unknown: boolean;
  q17_rltt_yes: boolean;
  q17_rltt_no: boolean;
  q17_rltt_unknown: boolean;
  q17_uttq_yes: boolean;
  q17_uttq_no: boolean;
  q17_uttq_unknown: boolean;
  q17_btm_yes: boolean;
  q17_btm_no: boolean;
  q17_btm_unknown: boolean;
  q17_btim_yes: boolean;
  q17_btim_no: boolean;
  q17_btim_unknown: boolean;
  q17_tha_yes: boolean;
  q17_tha_no: boolean;
  q17_tha_unknown: boolean;
  q17_bt_yes: boolean;
  q17_bt_no: boolean;
  q17_bt_unknown: boolean;
  q17_utbt_yes: boolean;
  q17_utbt_no: boolean;
  q17_utbt_unknown: boolean;
  q17_utt_yes: boolean;
  q17_utt_no: boolean;
  q17_utt_unknown: boolean;
  q17_lddtt_yes: boolean;
  q17_lddtt_no: boolean;
  q17_lddtt_unknown: boolean;
  q17_pldd_yes: boolean;
  q17_pldd_no: boolean;
  q17_pldd_unknown: boolean;
  q17_dq_yes: boolean;
  q17_dq_no: boolean;
  q17_dq_unknown: boolean;
  q17_utk_yes: boolean;
  q17_utk_no: boolean;
  q17_utk_unknown: boolean;
  q18: string;
  q18_mm_yes: boolean;
  q18_mm_no: boolean;
  q18_ca_yes: boolean;
  q18_ca_no: boolean;
  q18_sc_yes: boolean;
  q18_sc_no: boolean;
  q18_s_yes: boolean;
  q18_s_no: boolean;
  q18_lr_yes: boolean;
  q18_lr_no: boolean;
  q18_dmhtvd_yes: boolean;
  q18_dmhtvd_no: boolean;
  q18_cvdvmmth_yes: boolean;
  q18_cvdvmmth_no: boolean;
  q18_cmm_yes: boolean;
  q18_cmm_no: boolean;
  q18_lm_yes: boolean;
  q18_lm_no: boolean;
  q18_dm_yes: boolean;
  q18_dm_no: boolean;
  q18_hk_yes: boolean;
  q18_hk_no: boolean;
  q18_hd_yes: boolean;
  q18_hd_no: boolean;
  q18_kk_yes: boolean;
  q18_kk_no: boolean;
  q18_ktkgs_yes: boolean;
  q18_ktkgs_no: boolean;
  q18_ktcknn_yes: boolean;
  q18_ktcknn_no: boolean;
  q18_ktckn_yes: boolean;
  q18_ktckn_no: boolean;
  q18_dn_yes: boolean;
  q18_dn_no: boolean;
  q18_tdkd_yes: boolean;
  q18_tdkd_no: boolean;
  q18_pc_yes: boolean;
  q18_pc_no: boolean;
  q18_dnc_yes: boolean;
  q18_dnc_no: boolean;
  q18_dnccknn_yes: boolean;
  q18_dnccknn_no: boolean;
  q18_dl_yes: boolean;
  q18_dl_no: boolean;
  q18_ktcdnhl_yes: boolean;
  q18_ktcdnhl_no: boolean;
  q18_rt_yes: boolean;
  q18_rt_no: boolean;
  q18_rlt_yes: boolean;
  q18_rlt_no: boolean;
  q18_ltt_yes: boolean;
  q18_ltt_no: boolean;
  q18_knn_yes: boolean;
  q18_knn_no: boolean;
  q18_dtn_yes: boolean;
  q18_dtn_no: boolean;
  q18_nkn_yes: boolean;
  q18_nkn_no: boolean;
  q18_nd_yes: boolean;
  q18_nd_no: boolean;
  q18_onoc_yes: boolean;
  q18_onoc_no: boolean;
  q18_octa_yes: boolean;
  q18_octa_no: boolean;
  q18_bn_yes: boolean;
  q18_bn_no: boolean;
  q18_n_yes: boolean;
  q18_n_no: boolean;
  q18_db_yes: boolean;
  q18_db_no: boolean;
  q18_cb_yes: boolean;
  q18_cb_no: boolean;
  q18_tc_yes: boolean;
  q18_tc_no: boolean;
  q18_tb_yes: boolean;
  q18_tb_no: boolean;
  q18_dcrm_yes: boolean;
  q18_dcrm_no: boolean;
  q18_vd_yes: boolean;
  q18_vd_no: boolean;
  q18_ndmdn_yes: boolean;
  q18_ndmdn_no: boolean;
  q18_dck_yes: boolean;
  q18_dck_no: boolean;
  q18_dtb_yes: boolean;
  q18_dtb_no: boolean;
  q18_dk_yes: boolean;
  q18_dk_no: boolean;
  q18_la_yes: boolean;
  q18_la_no: boolean;
  q18_trc_yes: boolean;
  q18_trc_no: boolean;
  q18_bingat_yes: boolean;
  q18_bingat_no: boolean;
  q18_cm_yes: boolean;
  q18_cm_no: boolean;
  q18_ndsn_yes: boolean;
  q18_ndsn_no: boolean;
  q18_mtb_yes: boolean;
  q18_mtb_no: boolean;
  q18_rlnn_yes: boolean;
  q18_rlnn_no: boolean;
  q18_tth_yes: boolean;
  q18_tth_no: boolean;
  q18_rlkn_yes: boolean;
  q18_rlkn_no: boolean;
  q18_bcdmt_yes: boolean;
  q18_bcdmt_no: boolean;
}

export interface ReviewEmployee {
  id: string;
  name: string;
  employee_team_id: string;
  signature: Signature;
}

export interface Signature {
  signature_id: string;
  employee_id: string;
  fullname: null;
  signature_certificate_code: null;
  signature_name: string;
  signature_image: null;
  order_number: null;
  is_show: null;
}

export interface Surveynotices {
  visibility: Visibility;
  card: SurveynoticesCard;
}

export interface SurveynoticesCard {
  q6: string;
  q6_tmg_yes: boolean;
  q6_vg_yes: boolean;
  q6_bgm_yes: boolean;
  q6_vlddtt_yes: boolean;
  q6_nhp_yes: boolean;
  q6_vldt_yes: boolean;
  q6_pldtt_yes: boolean;
  q6_tri_yes: boolean;
  q6_tm_yes: boolean;
  q6_rldcm_yes: boolean;
  q6_blhhk_yes: boolean;
  q6_dkhdq_yes: boolean;
  q6_tha_yes: boolean;
  q6_btm_yes: boolean;
  q6_dtd_yes: boolean;
  q6_rlttk_yes: boolean;
  q6_lp_yes: boolean;
  q6_bphhs_yes: boolean;
  q6_btg_yes: boolean;
  q6_tk_yes: boolean;
  q6_hiv_yes: boolean;
  q6_ut_yes: boolean;
  q8: string;
  q8_yes: boolean;
  q9: string;
  q9_yes: boolean;
  q12: string;
  q12_htl_hdch: boolean;
  q12_htl_hdch_text: string;
  q12_urb_yes: boolean;
  q12_sdtgd_yes: boolean;
  q17: string;
  q17_utv_yes: boolean;
  q17_onmt_yes: boolean;
  q17_utdt_yes: boolean;
  q17_pldt_yes: boolean;
  q17_vldt_yes: boolean;
  q17_dtd_yes: boolean;
  q17_rltt_yes: boolean;
  q17_uttq_yes: boolean;
  q17_btm_yes: boolean;
  q17_btim_yes: boolean;
  q17_tha_yes: boolean;
  q17_bt_yes: boolean;
  q17_utbt_yes: boolean;
  q17_utt_yes: boolean;
  q17_lddtt_yes: boolean;
  q17_pldd_yes: boolean;
  q17_dq_yes: boolean;
  q17_utk_yes: boolean;
  q18: string;
  q18_mm_yes: boolean;
  q18_ca_yes: boolean;
  q18_sc_yes: boolean;
  q18_s_yes: boolean;
  q18_lr_yes: boolean;
  q18_dmhtvd_yes: boolean;
  q18_cvdvmmth_yes: boolean;
  q18_cmm_yes: boolean;
  q18_lm_yes: boolean;
  q18_dm_yes: boolean;
  q18_hk_yes: boolean;
  q18_hd_yes: boolean;
  q18_kk_yes: boolean;
  q18_ktkgs_yes: boolean;
  q18_ktcknn_yes: boolean;
  q18_ktckn_yes: boolean;
  q18_dn_yes: boolean;
  q18_tdkd_yes: boolean;
  q18_pc_yes: boolean;
  q18_dnc_yes: boolean;
  q18_dnccknn_yes: boolean;
  q18_dl_yes: boolean;
  q18_ktcdnhl_yes: boolean;
  q18_rt_yes: boolean;
  q18_rlt_yes: boolean;
  q18_ltt_yes: boolean;
  q18_knn_yes: boolean;
  q18_dtn_yes: boolean;
  q18_nkn_yes: boolean;
  q18_nd_yes: boolean;
  q18_onoc_yes: boolean;
  q18_octa_yes: boolean;
  q18_bn_yes: boolean;
  q18_n_yes: boolean;
  q18_db_yes: boolean;
  q18_cb_yes: boolean;
  q18_tc_yes: boolean;
  q18_tb_yes: boolean;
  q18_dcrm_yes: boolean;
  q18_vd_yes: boolean;
  q18_ndmdn_yes: boolean;
  q18_dck_yes: boolean;
  q18_dtb_yes: boolean;
  q18_dk_yes: boolean;
  q18_la_yes: boolean;
  q18_trc_yes: boolean;
  q18_bingat_yes: boolean;
  q18_cm_yes: boolean;
  q18_ndsn_yes: boolean;
  q18_mtb_yes: boolean;
  q18_rlnn_yes: boolean;
  q18_tth_yes: boolean;
  q18_rlkn_yes: boolean;
  q18_bcdmt_yes: boolean;
}

export interface Visibility {
  q6_visibility: boolean;
  q8_visibility: boolean;
  q9_visibility: boolean;
  q12_visibility: boolean;
  q17_visibility: boolean;
  q18_visibility: boolean;
  q_visibility: boolean;
}

export interface TaskResp {
  data: TaskRespItem[];
  message: string;
  status: boolean;
  total_items: number;
  client_ip: string;
}

export interface TaskRespItem {
  RowNumber: number;
  task_id: string;
  task_type_id: string;
  task_type_name: string;
  task_name: string;
  task_description: string;
  task_notes: string;
  task_last_note: string;
  customer_id: string;
  master_id: null;
  employee_team_id: string;
  create_employee_id: string;
  create_employee_name: string;
  assign_employee_id: string;
  assign_employee_name: string;
  update_employee_id: string;
  update_employee_name: string;
  assign_datetime: Date;
  remind_datetime: Date;
  create_datetime: Date;
  update_datetime: Date;
  customer_fullname: string;
  year_of_birth: number;
  gender_id: string;
  gender_name: string;
  customer_phone: string;
  task_status: string;
  task_status_text: string;
}

export interface InsuranceResp {
  data: InsuranceItem;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface InsuranceItem {
  maKetQua: string;
  ghiChu: string;
  maThe: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  maKV: string;
  maDKBD: string;
  cqBHXH: string;
  gtTheTu: string;
  gtTheDen: string;
  ngayDu5Nam: string;
  maSoBHXH: string;
  maTheCu: string;
  maTheMoi: null;
  gtTheTuMoi: null;
  gtTheDenMoi: null;
  maDKBDMoi: null;
  tenDKBDMoi: null;
  insurance_object_index: number;
  insurance_object_ratio: number;
}

/* Exam disease report */

export interface ResponseReportExamDesease {
  data: ReportExamDeseaseData;
  message: string;
  status: boolean;
  client_ip: string;
}

export interface ReportExamDeseaseData {
  master_id: string;
  customer: Customer;
  vitalsign: Vitalsign;
  card: ReportExamDeseaseCard;
  drug: Drug;
  header_notice: string;
  footer_notice: string;
  headerFooterPrint: null;
  items: null;
}

export interface ReportExamDeseaseCard {
  symptoms: Symptom[];
  exams_diseases: ExamsDisease[];
  exams_disease_timelines: ExamsDiseaseTimeline[];
  disease_advices: DiseaseAdvice[];
}

export interface DiseaseAdvice {
  disease_advice_id: number;
  master_id: string;
  customer_id: string;
  disease_advice_group_id: number;
  disease_advice_group_name: string;
  disease_advice_title: string;
  disease_advice_content: string;
  disease_advice_icon_path: string;
  disease_advice_order_number: number;
  disease_advice_group_order_number: number;
  doctor_employee_id: string;
  create_datetime: Date;
  update_datetime: Date;
}

export interface ExamsDiseaseTimeline {
  exam_timeline_id: string;
  master_id: string;
  customer_id: string;
  timeline_title: null | string;
  timeline_content: string;
  month: number;
  year: number;
  in_year: boolean;
  order_number: number;
  doctor_employee_id: string;
  create_datetime: Date;
  update_datetime: Date;
}

export interface ExamsDisease {
  disease_group_id: string;
  master_id: string;
  customer_id: string;
  disease_status_id: number;
  disease_status_name: string;
  disease_status_normal: null | string;
  disease_status_conclude: null | string;
  disease_status_recommend: null | string;
  disease_status_icon_path: string;
  disease_group_icon_path: string;
  disease_group_name: string;
  doctor_employee_id: null | string;
  create_datetime: Date;
  update_datetime: Date;
  order_number: number;
}

export interface Symptom {
  tag_id: number;
  tag_name: string;
  tag_group: string;
  tag_group_name: string;
  tag_color: string;
  order_number: number;
}

export interface Customer {
  customer_id: string;
  customer_type: string;
  owner_type: string;
  owner_id: string;
  parent_id: null;
  customer_fullname: string;
  customer_lastname: string;
  customer_prefix_gender: string;
  customer_phone: string;
  customer_identity_card: string;
  customer_email: string;
  birthday: Date;
  day_of_birth: number;
  month_of_birth: number;
  year_of_birth: number;
  customer_full_address: string;
  customer_address: string;
  gender: Country;
  country: Country;
  province: Country;
  district: Country;
  ward: Country;
  nation: null;
  career: null;
  launch_source_group_id: number;
  launch_source_group: LaunchSource;
  launch_source: LaunchSource;
  launch_source_type: LaunchSource;
  relation_type: null;
  portrait_survey_type: string;
  facebook_id: null;
  zalo_id: null;
  facebook_ads_id: null;
  create_date: Date;
  update_date: Date;
  is_parent_show: boolean;
  is_actived: boolean;
  is_affiliate_doctor: boolean;
  member: null;
}

export interface Country {
  id: string;
  name: string;
}

export interface LaunchSource {
  id: number;
  name: string;
}

export interface Drug {
  create_date: Date;
  appointment_date: Date;
  appointment_content: string;
  prescriber_employee: Country;
  prescriber_department: Country;
  diagnose_icd10s: DiagnoseIcd10[];
  drugitems: Drugitem[];
  drugguiditems: Drugguiditem[];
}

export interface DiagnoseIcd10 {
  id: string;
  disease_name_vi: string;
  disease_name_en: string;
  disease_group_name: null;
  is_icd10: boolean;
  order_number: number;
}

export interface Drugguiditem {
  drug_display_name: string;
  benefit: string;
  side_effects: null;
  contraindications: string;
  waste_line: string;
  drug_interactions: string;
}

export interface Drugitem {
  drug_display_name: string;
  drug_use_note: string;
  session: string;
  quantity_display: string;
  note_time_use: string;
}

export interface Vitalsign {
  id: string;
  servicespoint_detail_id: string;
  master_id: string;
  customer_id: string;
  service_id: string;
  height: string;
  weight: string;
  respiratory_rate: string;
  heart_rate: string;
  temperature: string;
  blood_pressure_min: string;
  blood_pressure_max: string;
  eyes_right: null;
  eyes_left: null;
  sp02: null;
  bmi: string;
  vitalsign_date: Date;
  employee: Employee;
  status: string;
  sessions: Session[];
}

export interface Employee {
  employee_id: string;
  fullname: string;
  signature_name: string;
}

export interface Session {
  id: string;
  vitalsign_card_id: string;
  session_index: number;
  heart_rate: string;
  blood_pressure_min: string;
  blood_pressure_max: string;
  create_employee: Country;
  update_employee: Country;
  create_date: Date;
  update_date: Date;
}

//

