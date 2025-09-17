"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation } from "react-query"
import { postSaveAnswerAPI } from "services/api/survey_lead"
import { SurveyAnswer } from "services/api/survey_lead/types"
import { useAppDispatch } from "store/hooks"
import { getListAnswerMaster } from "store/survey_lead"
import "./index.scss"
// eslint-disable-next-line import/order
import { toast } from "react-toastify"


interface Props {
  data: {
    survey_answer: SurveyAnswer[],
    card_survey_id: string
  },
  lead_id: number
}

export default function LeadNoBookingForm({ data,lead_id }: Props) {
    const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Record<string, string>>({})
  console.log(data)
 useEffect(() => {
  const initialData: Record<string, string> = {}
  data.survey_answer.forEach((q) => {
    if (typeof q.answer === "boolean") {
      initialData[q.code] = String(q.answer) // <-- Lưu chuỗi "true"/"false"
    } else if (q.answer !== null) {
      initialData[q.code] = String(q.answer)
    }
    if (q.note !== null) {
      initialData[`${q.code}_note`] = String(q.note)
    }
  })
  setFormData(initialData)
}, [data])

const handleInputChange = (code: string, value: string) => {
  setFormData((prev) => {
    const newState = { ...prev, [code]: value }

    // Auto check nếu là note hoặc text của câu checkbox
    if (code.endsWith("_note")) {
      const mainCode = code.replace("_note", "")
      if (prev[mainCode] !== "true" && value.trim() !== "") {
        newState[mainCode] = "true"
      }
    }

    return newState
  })
}


  const containerStyle: React.CSSProperties = {
     maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    maxHeight: "67vh",
  }

  const contentStyle: React.CSSProperties = {
      backgroundColor: "white",
    padding: "5px",
    borderRadius: "0 0 8px 8px",
    paddingBottom: "30px",
    position: "relative",
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
    borderBottom: "2px solid #3498db",
    padding: "10px",
    marginTop: "0px",
  }

  const questionContainerStyle: React.CSSProperties = {
        marginBottom: "5px",
    padding: "8px",
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
 const questionStyle1: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#495057",
  }
  const inputStyle: React.CSSProperties = {
     width: "100%",
    padding: "5px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    marginTop: "8px",
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical" as const,
  }

  const buttonStyle: React.CSSProperties = {
   backgroundColor: "#3498db",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "10px",
    minWidth: "230px",
  }

    const [loading,setLoading] = useState(false)

    const { mutate: postSaveAnswer } = useMutation(
        'post-footer-form',
        (data: any) => postSaveAnswerAPI(data),
        {
          onSuccess: (data) => {
            setLoading(false)
             dispatch(getListAnswerMaster({
                  lead_id: lead_id
                }));
                toast.success("Lưu giai đoạn Follow thành công")
          },
          onError: (error) => {
            console.error('🚀: error --> getCustomerByCustomerId:', error);
          },
        },
      );
  const handleSave = async () => {
 const updatedSurveyAnswer = data.survey_answer.map((q) => {
  const rawValue = formData[q.code]
  const noteValue = formData[`${q.code}_note`] || null

  let answer: any = rawValue

  switch (q.type) {
    case "checkbox":
      answer = rawValue === "true"
      break
    case "multi_choice":
      answer = rawValue ? rawValue.split(",").map((s) => s.trim()) : []
      break
    case "number":
      answer = rawValue ? Number(rawValue) : null
      break
    case "datetime":
    case "date":
      answer = rawValue || null
      break
    case "boolean":
      answer = rawValue === "Có"
      break
    default:
      answer = rawValue || ""
      break
  }

  return {
    ...q,
    answer,
    note: noteValue,
  }
})
  

  const payload = {
    card_survey_id: data.card_survey_id,
    survey_answer: updatedSurveyAnswer,
  }

  console.log("Payload gửi đi:", payload)
  setLoading(true)
  postSaveAnswer(payload)
}

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
       

        <h2 style={sectionTitleStyle}>Giai đoạn follow:</h2>

         <div style={{ maxHeight: "57vh", minHeight:"57vh",overflowY: "auto",paddingBottom:"40px" }}>
    {data.survey_answer.map((question, index) => {
  const code = question.code;
  const value = formData[code] || "";
  const inputType = question.type;
  const options = question.options;
  const text = question.note;
  console.log("question", formData[code])
  // Điều kiện hiển thị phụ thuộc vào câu q1
  if (
    (code === "q2" && !formData["q1"]?.includes("Giá")) ||
    (code === "q3" && !formData["q1"]?.includes("Thời gian")) ||
    (code === "q4" && !formData["q1"]?.includes("Niềm tin"))
  ) {
    return null; // Không render
  }

  return (
    <div key={code} style={questionContainerStyle}>
      
      {
        inputType !== "multi_choice" && (
            <label style={questionStyle}>
        {index + 1}. {question.label}
      </label>
        )
      }
      

    
      {inputType === "multi_choice" && Array.isArray(options) ? (
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" ,alignItems:"start"}}>
          <label style={questionStyle1}>
        {index + 1}. {question.label}
      </label>
          {options.map((opt) => (
            <div key={opt} style={{marginTop:3}}  >
              <label>
                <input
                  type="checkbox"
                  checked={formData[code]?.includes(opt)}
                  onChange={(e) => {
                    const currentValues = formData[code]?.split(",") || [];
                    const updated = e.target.checked
                      ? [...currentValues, opt]
                      : currentValues.filter((v) => v !== opt);
                    handleInputChange(code, updated.join(","));
                  }}
                />{" "}
                {opt}
              </label>
            </div>
          ))}
        </div>
      ) : inputType === "checkbox" ? (
          
        <input
          type="checkbox"
          checked={
            formData[code] !== undefined
              ? formData[code] === "true"
              : question.answer === true
          }
          onChange={(e) => handleInputChange(code, String(e.target.checked))}
        />
      ) : inputType === "date" ? (
        <input
          type="datetime-local"
          style={inputStyle}
          value={value}
          onChange={(e) => handleInputChange(code, e.target.value)}
        />
      ) : inputType === "textarea" ? (
        <textarea
          style={textareaStyle}
          placeholder="Nhập thông tin..."
          value={value}
          onChange={(e) => handleInputChange(code, e.target.value)}
        />
      ) : (
        <input
          type="text"
          style={inputStyle}
          placeholder="Nhập câu trả lời..."
          value={text || value}
          onChange={(e) => handleInputChange(code, e.target.value)}
        />
      )}

      {/* Nếu có note thì hiển thị thêm trường note */}
      {question.note !== null && (
        <input
          type="text"
          style={{ ...inputStyle, marginTop: "10px" }}
          placeholder="Ghi chú"
    value={formData[`${code}_note`] || ""}
          onChange={(e) =>
            handleInputChange(`${code}_note`, e.target.value)
          }
        />
      )}
    </div>
  );
})}        
        </div>


   <div style={{ textAlign: "center", position: "absolute", bottom: "10px", left: 0, width: "100%", backgroundColor: "white", }}>
          <button style={buttonStyle} onClick={handleSave}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              {
                loading ? <span className="loaderB"></span> : <>
                  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"> <g id="System / Save"> <path id="Vector" d="M17 21.0002L7 21M17 21.0002L17.8031 21C18.921 21 19.48 21 19.9074 20.7822C20.2837 20.5905 20.5905 20.2843 20.7822 19.908C21 19.4806 21 18.921 21 17.8031V9.21955C21 8.77072 21 8.54521 20.9521 8.33105C20.9095 8.14 20.8393 7.95652 20.7432 7.78595C20.6366 7.59674 20.487 7.43055 20.1929 7.10378L17.4377 4.04241C17.0969 3.66374 16.9242 3.47181 16.7168 3.33398C16.5303 3.21 16.3242 3.11858 16.1073 3.06287C15.8625 3 15.5998 3 15.075 3H6.2002C5.08009 3 4.51962 3 4.0918 3.21799C3.71547 3.40973 3.40973 3.71547 3.21799 4.0918C3 4.51962 3 5.08009 3 6.2002V17.8002C3 18.9203 3 19.4796 3.21799 19.9074C3.40973 20.2837 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H7M17 21.0002V17.1969C17 16.079 17 15.5192 16.7822 15.0918C16.5905 14.7155 16.2837 14.4097 15.9074 14.218C15.4796 14 14.9203 14 13.8002 14H10.2002C9.08009 14 8.51962 14 8.0918 14.218C7.71547 14.4097 7.40973 14.7155 7.21799 15.0918C7 15.5196 7 16.0801 7 17.2002V21M15 7H9" stroke="#ffffff" stroke-width="1.272" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
<span>          Lưu giai đoạn Follow</span></>
              }
             
            </div> 
          </button>
        </div>
      </div>
    </div>
  )
}
