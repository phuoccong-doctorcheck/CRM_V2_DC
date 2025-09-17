"use client"

import {  UserOutlined,  } from "@ant-design/icons"
import { Avatar, Checkbox } from "antd"
import { X } from "lucide-react"
import moment from "moment"



interface Props {
  data: any
  setOpenProfile: (value: boolean) => void;
  dataStep:any
}

export default function CustomerProfile({ data ,setOpenProfile,dataStep}: Props) {
  

  console.log("dataStep", dataStep,data)
  const getAnswerByCode = (code: string): any => {
  return dataStep?.survey_answer?.find((item: any) => item.code === code)?.answer;
};
  const hasGeneralCheckup = getAnswerByCode("q6") === true;
const lastCheckupDate = getAnswerByCode("q7") ? new Date(getAnswerByCode("q7")) : undefined;
const hasEndoscopy = getAnswerByCode("q8") === true;
  const lastEndoscopyDate = getAnswerByCode("q9") ? new Date(getAnswerByCode("q9")) : undefined;
  const c10 = getAnswerByCode("q10") || "";
const previousEndoscopyPlace = getAnswerByCode("q14") || "";
const medicalHistoryNS = getAnswerByCode("q11") || "";
const endoscopyGoal = getAnswerByCode("q13") || "";
const c15 = getAnswerByCode("q15") || "";
const notesNS = getAnswerByCode("q16") || "";
  console.log("selectedNhuCau", getAnswerByCode("q7"))
    const sectionTitleStyle: React.CSSProperties = {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "10px",
      borderBottom: "2px solid #3498db",
      padding: "10px",
      marginTop: "0px",
  }
   const sectionTitleStyleCate: React.CSSProperties = {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000",
      marginBottom: "10px",
      borderBottom: "1px solid #f8f8f8",
      padding: "5px 10px",
      marginTop: "0px",
     display: "flex",
     alignItems: "center",
      gap:5
  }
  const isLocked = true;
  return (
    <div

      
      style={{ width: "100%", margin: "0 auto",position:"relative" ,background:"white" ,padding:5,height:"100%"}}
    ><h2 style={sectionTitleStyle}>Chân dung khách hàng:</h2>
      <div style={{
        position: "absolute",
        top: "1rem",
        display: "none",
        right: "0.5rem",
        cursor: "pointer",
      }} onClick={() => setOpenProfile(false)}>
        <X size={24} />
    </div>
      <div
        style={{ display: "none", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}
      >
        <Avatar size={96} icon={<UserOutlined />} src="/placeholder.svg?height=96&width=96" />
        <div style={{ textAlign: "center" }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem" }}
          >
            {data?.lead?.lead_name}
          </label>
         
        </div>
      </div>

      <div style={{maxHeight:"60vh", overflowY:"auto"}}>
        
        <h3 style={sectionTitleStyleCate}>
 <svg
      width="25px"
      height="25px"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
  
    >
      <g id="outline_color" data-name="outline color">
        <path d="M54,43a6,6,0,1,1,6-6A6,6,0,0,1,54,43Zm0-10a4,4,0,1,0,4,4A4,4,0,0,0,54,33Z" />
        <path d="M55.5,38h-3a1,1,0,0,1,0-2h3a1,1,0,0,1,0,2Z" />
        <path d="M54,39.5a1,1,0,0,1-1-1v-3a1,1,0,0,1,2,0v3A1,1,0,0,1,54,39.5Z" />
        <path d="M39.5,51A6.51,6.51,0,0,1,33,44.5V32a1,1,0,0,1,1-1h2a1,1,0,0,1,0,2H35V44.5a4.5,4.5,0,0,0,9,0V33H43a1,1,0,0,1,0-2h2a1,1,0,0,1,1,1V44.5A6.51,6.51,0,0,1,39.5,51Z" />
        <path d="M46.75,60a8.26,8.26,0,0,1-8.25-8.25V50a1,1,0,0,1,2,0v1.75a6.25,6.25,0,0,0,12.5,0V42a1,1,0,0,1,2,0v9.75A8.26,8.26,0,0,1,46.75,60Z" />
        <path d="M54,19.6a1.26,1.26,0,0,1-.27,0l-2.89-.79a1,1,0,0,1,.53-1.93l2.89.79a1,1,0,0,1-.26,2Z" />
        <path d="M52.1,20.65a.82.82,0,0,1-.26,0,1,1,0,0,1-.7-1.23l.79-2.89a1,1,0,0,1,1.93.53l-.79,2.89A1,1,0,0,1,52.1,20.65Z" />
        <path d="M21.78,55.09a5,5,0,0,1-4.58-3L4.56,23.83a5,5,0,0,1,2.52-6.6l20.17-9A1,1,0,0,1,28.07,10l-20.17,9a3,3,0,0,0-1.52,4L19,51.32a3,3,0,0,0,4,1.52l8.36-3.73a1,1,0,0,1,.82,1.82l-8.36,3.73A4.88,4.88,0,0,1,21.78,55.09Z" />
        <path d="M16.74,22.68a1,1,0,0,1-.92-.6,1,1,0,0,1,.51-1.32l8.21-3.67a1,1,0,1,1,.82,1.83l-8.22,3.67A1,1,0,0,1,16.74,22.68Z" />
        <path d="M16.44,29.38A1,1,0,0,1,16,27.47l6.78-3a1,1,0,0,1,.82,1.82l-6.78,3A1,1,0,0,1,16.44,29.38Z" />
        <path d="M18.89,34.85a1,1,0,0,1-.41-1.91l2.29-1a1,1,0,0,1,.82,1.82l-2.29,1A1,1,0,0,1,18.89,34.85Z" />
        <path d="M30,45.77a.75.75,0,0,1-.26,0l-7.4-2a5,5,0,0,1-3.51-6.13L27,7.67a5,5,0,0,1,6.14-3.51L56.31,10.5a4.9,4.9,0,0,1,3,2.33,5,5,0,0,1,.49,3.8L56.59,28.41a1,1,0,0,1-1.92-.52L57.9,16.11a3,3,0,0,0-.29-2.28,2.94,2.94,0,0,0-1.82-1.4L32.65,6.08A3,3,0,0,0,29,8.2L20.77,38.09a3,3,0,0,0,2.1,3.69l7.4,2A1,1,0,0,1,31,45,1,1,0,0,1,30,45.77Z" />
        <path d="M47.46,17.36a1.24,1.24,0,0,1-.27,0L38.51,15a1,1,0,0,1-.7-1.23A1,1,0,0,1,39,13l8.68,2.38a1,1,0,0,1-.26,2Z" />
        <path d="M48.77,23.94a1.24,1.24,0,0,1-.27,0L34,20A1,1,0,1,1,34.56,18L49,22a1,1,0,0,1-.26,2Z" />
        <path d="M44.51,29a.75.75,0,0,1-.26,0l-11.8-3.23A1,1,0,0,1,33,23.81L44.77,27a1,1,0,0,1,.7,1.22A1,1,0,0,1,44.51,29Z" />
      </g>
    </svg>         <span style={{fontSize:16}}> Nhu cầu</span></h3>
    
      
        <div style={{ marginBottom: "0.5rem", paddingLeft: 30 , display: "flex", flexDirection: "row", gap: "1rem" }}>
              <div >
                            <Checkbox checked={hasGeneralCheckup}    onChange={(vals) => {
              if (!isLocked) {
      console.log("vals", vals.target.checked)
    }
    // nếu isLocked thì không làm gì => không đổi check
  }}/> <span><strong>Khám tổng quát</strong>  {hasGeneralCheckup && <>  (Lần KTQ gần nhất: {lastCheckupDate ? moment(lastCheckupDate).format("HH:mm DD/MM/YYYY") : "Chưa rõ"})</>}</span>
          </div>
            <div >
                            <Checkbox checked={hasEndoscopy}    onChange={(vals) => {
              if (!isLocked) {
      console.log("vals", vals.target.checked)
    }
    // nếu isLocked thì không làm gì => không đổi check
  }}/> <span><strong>Nội soi</strong> {hasEndoscopy && <>  (Lần NS gần nhất: {lastEndoscopyDate ? moment(lastEndoscopyDate).format("HH:mm DD/MM/YYYY") : "Chưa rõ"})</>}</span>
                          </div>
      {/* <CheckboxGroup
  options={nhuCauOptions}
  value={selectedNhuCau}
  onChange={(vals) => {
    if (!isLocked) setSelectedNhuCau(vals as string[]);
    // nếu isLocked thì không làm gì => không đổi check
  }}
  style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
/> */}
        </div>
        {/* <div>
         
            <h3 style={sectionTitleStyleCate}>  {
              hasGeneralCheckup ? "Đã từng KTQ" : "Chưa từng KTQ" 
          }  {hasGeneralCheckup && <>  (Lần KTQ gần nhất: {lastCheckupDate ? moment(lastCheckupDate).format("HH:mm DD/MM/YYYY") : "Chưa rõ"})</>}</h3>
          <h3 style={sectionTitleStyleCate}>  {
              hasEndoscopy ? "Đã từng NS" : "Chưa từng NS" 
        }  {hasEndoscopy && <>  (Lần NS gần nhất: {lastEndoscopyDate ? moment(lastEndoscopyDate).format("HH:mm DD/MM/YYYY") : "Chưa rõ"})</>}</h3>
        </div> */}

        <>
          <h3 style={sectionTitleStyleCate}>
            <svg fill="#000000" width="25px" height="25px" viewBox="0 -8 72 72" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>file-text-o</title><path d="M47.76,36.76H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,0,0,0-2.16Z"></path><path d="M47.76,22.6H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,1,0,0-2.16Z"></path><path d="M46.92,0H18.74A3.44,3.44,0,0,0,15.3,3.43V52.57A3.44,3.44,0,0,0,18.74,56H53.26a3.44,3.44,0,0,0,3.44-3.43V10.62Zm.81,5.14L52,9.79H47.73Zm6.08,47.43a.55.55,0,0,1-.55.55H18.74a.55.55,0,0,1-.55-.55V3.43a.54.54,0,0,1,.55-.54H44.85v8.35a1.45,1.45,0,0,0,1.44,1.44h7.52Z"></path><path d="M47.76,29.62H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,1,0,0-2.16Z"></path></g></svg>
          <span style={{fontSize:16}}> Thông tin bổ sung</span></h3>
          <div style={{paddingLeft: 30 }}>
            <div style={{ marginBottom: "0.5rem" , display: "flex", flexDirection: "column", gap: "0.2rem"  }}>
      <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
     1.  Sau đợt khám TQ/nội soi trước có vấn đề gì cần theo dõi không?
      </p>
      <p style={{ margin: 0 }}>- {c10 || "Chưa điền"}</p>
    </div>

 <div style={{ marginBottom: "0.5rem" , display: "flex", flexDirection: "column", gap: "0.2rem"  }}>
      <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
      2. Có triệu chứng gì bất thường không?
      </p>
      <p style={{ margin: 0 }}>- {medicalHistoryNS || "Chưa điền"}</p>
    </div>
 <div style={{ marginBottom: "0.5rem" , display: "flex", flexDirection: "column", gap: "0.2rem"  }}>      <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
      3. Mục tiêu của đợt khám này là gì?
      </p>
      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
      -  {endoscopyGoal || "Chưa điền"}
      </p>
            </div>
 <div style={{ marginBottom: "0.5rem" , display: "flex", flexDirection: "column", gap: "0.2rem"  }}>      <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
      4. Đã từng khám ở đâu?
      </p>
      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
     -   {previousEndoscopyPlace || "Chưa điền"}
      </p>
    </div>

   

            <div style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
        5. Có điểm gì chưa hài lòng:
      </p>
      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
       - {c15 || "Chưa điền"}
      </p>
    </div>
     

            <div style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
       6. Khác:
      </p>
      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
       - {notesNS || "Chưa điền"}
      </p>
    </div>
          </div>
  </>


     </div>
    </div>
  )
}
