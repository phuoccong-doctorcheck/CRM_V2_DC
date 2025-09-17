export interface SurveyAnswer {
  code: string
  label: string
  type: "text" | "textarea" | "number" | "choice" | "multi_choice" | "boolean" | "date" | "checkbox" | "datetime"
  required: boolean
  answer: string | string[] | boolean | null
  completed: boolean
  options?: string[] // chỉ có khi type là choice hoặc multi_choice
  note?: string | null
  validation?: string | null
}



export interface SurveyItem {
  card_survey_id: string;
  survey_id: string;
  survey_answer: SurveyAnswer[];
  survey_type: string;
  review_employee_id: string;
  is_local: boolean;
  is_review: boolean;
  review_date: string; // ISO string
  step_id: number;
  step_index: number;
  step_name: string;
}

export interface SurveyResponse {
  data: {
    items: SurveyItem[];
  };
  message: string;
  status: boolean;
  client_ip: string;
}
