/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-param-reassign */
"use client"

import type React from "react"
import { useState } from "react"

interface TogglePasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  placeholder?: string
  text: string
  onUpdatePin?: any
  setIsCKLoading?: any
  isCKLoading?: boolean
}

export default function TogglePasswordInput({
  placeholder = "Nhập mã PIN...",
  text,
  onUpdatePin,
  setIsCKLoading,
  isCKLoading,
  ...props
}: TogglePasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [pin, setPin] = useState(text ?? "")
  const [error, setError] = useState<string>("")

  /** ✅ Chỉ cho nhập số – tối đa 4 ký tự */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // chỉ số
    if (value.length > 4) value = value.slice(0, 4)
    setPin(value)

    // Validate realtime
    if (value.length === 4) {
      setError("")
    } else {
      setError("Mã PIN phải gồm đúng 4 chữ số")
    }
  }

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  const handleUpdatePin = () => {
    if (pin.length !== 4) {
      setError("Mã PIN phải gồm đúng 4 chữ số")
      return
    }

    setError("")
    setIsCKLoading?.(true)
    onUpdatePin?.({
      pin,
    })
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div>
           <div style={{display:"flex"}}> <input
          type={isVisible ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder={placeholder}
          style={styles.input}
          value={pin}
          onChange={handleChange}
          {...props}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          style={styles.eyeButton}
          aria-label={isVisible ? "Ẩn PIN" : "Hiện PIN"}
        >
          {isVisible ? "👁️‍🗨️" : "👁️"}
        </button></div>
          {error && <div style={styles.errorText}>{error}</div>}
       </div>
      </div>

      {isCKLoading === true ? (
        <button style={styles.updateButton}>
          <div className="loaderKey" />
        </button>
      ) : (
        <button style={styles.updateButton} onClick={handleUpdatePin}>
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M21.0667 5C21.6586 5.95805 22 7.08604 22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.272 15.465 11.8598 15.465 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876C6.22633 20.6364 5.952 20.9096 5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C16.4995 2 17.282 2.15509 18 2.43738"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.8851 8.29353C17.8851 9.50601 16.8982 10.4889 15.6807 10.4889C14.4633 10.4889 13.4763 9.50601 13.4763 8.29353C13.4763 7.08105 14.4633 6.09814 15.6807 6.09814C16.8982 6.09814 17.8851 7.08105 17.8851 8.29353Z"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          </svg>
          <span>Đổi</span>
        </button>
      )}

    
    </div>
  )
}

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    alignItems: "start",
    gap: "8px",
  },

  container: {
    position: "relative" as const,
    width: "100%",
    display: "flex",
    alignItems: "center",
    maxWidth: "200px",
  },

  input: {
    width: "100%",
    padding: "3px 16px",
    paddingRight: "48px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "18px",
    letterSpacing: "6px",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  eyeButton: {
    position: "absolute" as const,
    right: "12px",
    top: "45%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    fontSize: "20px",
  } as React.CSSProperties,

  updateButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    justifyContent: "center",
    width: "fit-content",
    padding: "5px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  } as React.CSSProperties,

  errorText: {
    color: "red",
    fontSize: "12px",
    marginLeft: "4px",
  } as React.CSSProperties,
}
