"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation } from "react-query"
import { postSaveAnswerAPI } from "services/api/survey_lead"
import { SurveyAnswer } from "services/api/survey_lead/types"
import { useAppDispatch } from "store/hooks"
import { getListAnswerMaster } from "store/survey_lead"



interface Props {
  data: {
    survey_answer: SurveyAnswer[],
    card_survey_id: string
  },
  lead_id: number
}

export default function LeadCancelForm({ data ,lead_id}: Props) {
    const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    // Khởi tạo formData từ dữ liệu đầu vào
    const initialData: Record<string, string> = {}
    data.survey_answer.forEach((q) => {
      if (typeof q.answer === "boolean") {
        initialData[q.code] = q.answer ? "Có" : "Không"
      } else if (q.answer !== null) {
        initialData[q.code] = String(q.answer)
      }
    })
    setFormData(initialData)
  }, [data])

  const handleInputChange = (code: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [code]: value,
    }))
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    maxHeight: "70vh",
    overflowY: "scroll",
  }

  const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "0 0 8px 8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    paddingBottom: "380px",
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px",
  }

  const questionContainerStyle: React.CSSProperties = {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #e9ecef",
  }

  const questionStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "10px",
    color: "#495057",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical" as const,
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "30px",
  }

  const progressStyle: React.CSSProperties = {
    width: "100%",
    height: "8px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    marginBottom: "20px",
    overflow: "hidden",
  }

  const progressBarStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: "#3498db",
    width: `${(Object.keys(formData).length / data.survey_answer.length) * 100}%`,
    transition: "width 0.3s ease",
  }
    const { mutate: postSaveAnswer } = useMutation(
        'post-footer-form',
        (data: any) => postSaveAnswerAPI(data),
        {
          onSuccess: (data) => {
             dispatch(getListAnswerMaster({
                  lead_id: lead_id
                }));

          },
          onError: (error) => {
            console.error('🚀: error --> getCustomerByCustomerId:', error);
          },
        },
      );
  const handleSave = async () => {
  const updatedSurveyAnswer = data.survey_answer.map((q) => {
    const rawValue = formData[q.code]

    let answer: any = rawValue

    // Chuyển kiểu trả lời dựa vào type
    switch (q.type) {
      case "boolean":
        answer = rawValue === "Có"
        break
      case "multi_choice":
        answer = rawValue ? rawValue.split(",").map((s) => s.trim()) : []
        break
      case "number":
        answer = rawValue ? Number(rawValue) : null
        break
      case "date":
        answer = rawValue || null
        break
      default:
        answer = rawValue || ""
        break
    }

    return {
      ...q,
      answer,
    }
  })

  const payload = {
    card_survey_id: data.card_survey_id,
    survey_answer: updatedSurveyAnswer,
  }

  console.log("Payload gửi đi:", payload)

  postSaveAnswer(payload)
}

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={progressStyle}>
          <div style={progressBarStyle}></div>
        </div>

        <h2 style={sectionTitleStyle}>Giai đoạn hủy hẹn:</h2>

        {data.survey_answer.map((question, index) => {
          const code = question.code
          const value = formData[code] || ""
          const inputType = question.type
          const options = question.options

          return (
            <div key={code} style={questionContainerStyle}>
              <label style={questionStyle}>
                {index + 1}. {question.label}
              </label>

              {inputType === "textarea" ? (
                <textarea
                  style={textareaStyle}
                  placeholder="Nhập thông tin..."
                  value={value}
                  onChange={(e) => handleInputChange(code, e.target.value)}
                />
              ) : inputType === "choice" && options ? (
                <select
                  style={inputStyle}
                  value={value}
                  onChange={(e) => handleInputChange(code, e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : inputType === "boolean" ? (
                <select
                  style={inputStyle}
                  value={value}
                  onChange={(e) => handleInputChange(code, e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  <option value="Có">Có</option>
                  <option value="Không">Không</option>
                </select>
              ) : inputType === "date" ? (
                <input
                  type="date"
                  style={inputStyle}
                  value={value}
                  onChange={(e) => handleInputChange(code, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="Nhập câu trả lời..."
                  value={value}
                  onChange={(e) => handleInputChange(code, e.target.value)}
                />
              )}
            </div>
          )
        })}

        <div style={{ textAlign: "center" }}>
          <button style={buttonStyle} onClick={handleSave}>Lưu thông tin</button>
        </div>
      </div>
    </div>
  )
}
