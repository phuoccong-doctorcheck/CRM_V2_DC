/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";

/* Hành trình sau khám: afterexams */
// 1. Khởi tạo trang:

export const getCategoriesByCustomer = async (id: string) => {
  const response = await axiosInstance.get(
    `/results/get-categories-by-customer?customer_id=${id}`
  );
  return response.data;
};
export const getCategoriesByMasterId = async (master_id: string) => {
  const response = await axiosInstance.get(
    `/results/get-histories-master-id/${master_id}`
  );
  return response.data;
};
export const getVisitResultCategory= async (body: any) => {
  const response = await axiosInstance.post(
    "/visit/get-visit-result-categories",
    body
  );
  return response.data;
};
export const getResultDetailCustomer = async (body: any) => {
  const response = await axiosInstance.post(
    "/results/get-result-details",
    body
  );
  return response.data;
};
export const getResultDetailCustomer2 = async (body: any) => {
  const response = await axiosInstance.post(
    "/visit/get-visit-result-detail",
    body
  );
  return response.data;
};

// API dời khám
export const postDelayAppointment = async (body: any) => {
  const response = await axiosInstance.post("/visit/delay-appointment", body);
  return response.data;
};
// API hủy lịch khám
export const postCanceledAppointment = async (body: any) => {
  const response = await axiosInstance.post("/visit/canceled-appointment", body);
  return response.data;
};

export const postRecoveryAppointment = async (body: any) => {
  //   body = {"master_id":"23071007130002"}
  const response = await axiosInstance.post("/visit/recovery-appointment", body);
  return response.data;
};

export const getSurveyUrl = async (body: any) => {
  //   body = {"survey_type ":"23071007130002", "customer_id": "DC23071007130002"}
  const response = await axiosInstance.post("/surveys/get-survey-url", body);
  return response.data;
};

export const postCallOutCustomer = async (body: any) => {
  const response = await axiosInstance.post("/customer/call-out-customer", body);
  return response.data;
};

export const getCustomerTask = async (data: any) => {
  const {
    task_type,
    task_status,
    employee_team,
    isAssignMe,
    from,
    to,
    keySearch,
    pages,
    limits,
  } = data;
  const body = {
    customer_id: "all",
    task_type_id: task_type || "all",
    task_status: task_status,
    employee_team_id: employee_team || "all",
    assign_for_me: isAssignMe,
    fromdate: from || null,
    todate: to || null,
    keyword: keySearch || "",
    page: pages || 1,
    limit: limits || 30,
  };
  const response = await axiosInstance.post("/tasks/get-customer-tasks", body);
  return response.data;
};

export const getCustomerTask1 = async (data: any) => {
  const {
    id,
    task_type,
    task_status,
    employee_team,
    isAssignMe,
    from,
    to,
    keysearch,
    pages,
    limits,
  } = data;
  const body = {
    customer_id: id || "all",
    task_type_id: task_type || "all",
    task_status: task_status || "inprogress",
    employee_team_id: employee_team || "all",
    assign_for_me: isAssignMe || false,
    fromdate: from || null,
    todate: to || null,
    keyword: keysearch || "",
    page: pages || 1,
    limit: limits || 30,
  };
  const response = await axiosInstance.post("/tasks/get-customer-tasks", body);
  return response.data;
};

export const postCustomerTask = async (body: any) => {
  const response = await axiosInstance.post("/tasks/save-task", body);
  return response.data;
};
export const postSurveyUrl = async (body: any) => {
  const response = await axiosInstance.post("/survey/get-survey-url", body);
  return response.data;
};
export const postGeneralUrlResult = async (body: any) => {
  const response = await axiosInstance.post("/customer/general-client-result-link", body);
  return response.data;
}; 
export const postGeneralUrlCustomerInfo = async (body: any) => {
  const response = await axiosInstance.post("/customer/general-client-link", body);
  return response.data;
}; 
export const postGeneralUrl = async (body: any) => {
  const response = await axiosInstance.post("/customer/general-client-result-link", body);
  return response.data;
}; 
export const postAPIConfirmBooking = async (body: any) => {
  const response = await axiosInstance.post("/customer/send-appointment-sms", body);
  return response.data;
}; 

export const postPrintAllreport = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-allreport-pdf",
    body
  );
  return response.data;
};

// In phieu ket qua Xet Nghiem
export const postPrintLabtest = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-labtest-result",
    body
  );
  return response.data;
};
// In phieu chi dinh
export const postPrintServicepoint = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-servicepoint",
    body
  );
  return response.data;
};
// In phieu kham tien me
export const postPrintAnesthesia = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-anesthesia-result",
    body
  );
  return response.data;
};
// In phieu ket qua Dien Tim
export const postPrintEcgs = async (body: any) => {
  const response = await axiosInstance.post("/reports/print-ecgs-result", body);
  return response.data;
};
// In phieu ket qua loãng xương
export const postPrintOsteoporosis = async (body: any) => {
  const response = await axiosInstance.post("/reports/print-osteoporosis-result", body);
  return response.data;
};
// In phieu ket qua XQuang
export const postPrintXrays = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-xrays-result",
    body
  );
  return response.data;
};
// In phieu ket qua Sieu Am
export const postPrintSupersonics = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-supersonics-result",
    body
  );
  return response.data;
};
export const postPrintGynecologies = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-gynecologies",
    body
  );
  return response.data;
};
export const postPrintVaccine = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-check-vaccine",
    body
  );
  return response.data;
};
// In phieu ket qua Noi Soi
export const postPrintEndoscopics = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-endoscopics-result",
    body
  );
  return response.data;
};
// In phieu ket qua XNHTPT
export const postPrintMolecule = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-molecule-result",
    body
  );
  return response.data;
};
// In phieu ket qua Xet nghiem Hoi tho
export const postPrintBreathtest = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-breathtest-result",
    body
  );
  return response.data;
};
// In toa thuoc
export const postPrintPrescriptions = async (body: any) => {
  const response = await axiosInstance.post(
    "/reports/print-prescriptions-result",
    body
  );
  return response.data;
};
// In benh an
export const postPrintErms = async (body: any) => {
  const response = await axiosInstance.post("/reports/print-erms", body);
  return response.data;
};

export const getCardSurvey = async (data: any) => {
  const response = await axiosInstance.get(
    `/surveys/get-card-survey?customer_id=${data?.customerId}&survey_type=${data?.type}`
  );
  return response.data;
};

export const getCardSurveyPortrait = async (data: any) => {
  const response = await axiosInstance.get(
    `/surveys/get-cs-card-survey?customer_id=${data?.customerId}&survey_type=${data?.servey_type}`
  );
  return response.data;
};

/* External File */
export const postSaveExternalFie = async (data: any) => {
  const response = await axiosInstance.post(
    `/out-examming-docs/save-item`,
    data
  );
  return response.data;
};
export const getListExternalFie = async (data: any) => {
  const response = await axiosInstance.post(`/out-examming-docs/list`, data);
  return response.data;
};
export const getExternalFieById = async (data: any) => {
  const response = await axiosInstance.post(
    `/out-examming-docs/get-item`,
    data
  );
  return response.data;
};
/* External File */

export const getOTPCustomerById = async (data: string) => {
  const response = await axiosInstance.post(`/customer/get-otp-customer`, {
    customer_id: data,
  });
  return response.data;
};

export const getSurveysResult = async (data: string) => {
  const body = {
    master_id: data,
  };
  const response = await axiosInstance.post(
    `/reports/print-surveys-result`,
    body
  );
  return response.data;
};
// API kiểm tra bảo hiểm Y tế
export const postCheckInsurance = async (body: any) => {
  const response = await axiosInstance.post(`/customer/check-insurance`, body);
  return response.data;
};
// API xem danh sách bệnh viện cho sử dụng BHYT
export const getInsuranceHospitals = async (body: any) => {
  const response = await axiosInstance.post(
    `/customer/get-insurance-hospitals`,
    body
  );
  return response.data;
};

export const getExamDiseaseReport = async (body: any) => {
  const response = await axiosInstance.post(
    `results/get-examming-disease-report`,
    body
  );
  return response.data;
};
