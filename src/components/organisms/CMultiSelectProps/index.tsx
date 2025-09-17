"use client"
import { Select } from "antd" // Yêu cầu cài đặt antd: npm install antd

interface Option {
  value: string
  label: string
}

interface AntdMultiSelectProps {
  options: Option[]
  selectedValues: string[]
  onValueChange: (values: string[]) => void
  placeholder?: string
  // className?: string // Không còn sử dụng className cho div bao ngoài
}

export function AntdMultiSelect({
  options = [],
  selectedValues = [],
  onValueChange,
  placeholder = "Select options...",
  // className, // Không còn sử dụng className
}: AntdMultiSelectProps) {
  const handleChange = (values: string[]) => {
    onValueChange(values)
  }

  return (
    <div style={{ width: "100%" }}>
      {" "}
      {/* Thay thế className="w-full" bằng style inline */}
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }} // Đã có sẵn
        placeholder={placeholder}
        value={selectedValues}
        onChange={handleChange}
        options={options}
      />
    </div>
  )
}
