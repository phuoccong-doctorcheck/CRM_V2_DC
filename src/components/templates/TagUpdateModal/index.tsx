"use client"

import { X, CheckCircle, PlusCircle, Trash2 } from "lucide-react"
import { useState, useMemo } from "react"

export interface TaskCategory {
  category: string
  total: number
  completed: number
  pending: number
  completed_percent: number
}

export interface TaskDataResponse {
  data: TaskCategory[]
  message: string
  status: boolean
  client_ip: string
}
export interface CriteriaDefinition {
  criteria_id: string
  criteria_code: string
  criteria_name: string
  type_campaign: string
  order_numbers: number
  target_unit: string
  result_unit: string
  is_high_light: boolean
  color_code: string
  is_show: boolean // This seems to be a default property, not necessarily current display status
  label: string
  value: string
}

export interface CriteriaStatus {
  criteria_id: string
  criteria_code: string
  criteria_name: string
  target_id: number
  target_value: number
  target_unit: string
  result_unit: string
  from_date: string
  to_date: string
  ads_account_id: string
  order_numbers: number
  is_show: boolean // This indicates if it's "shown" in some other context, not necessarily selected in this UI
}

export interface InitialSelectedCriteria {
  criteria_ids: string[]
  type_campaign: string
}

interface TagUpdateModalProps {
  allCriteriaDefinitions: any;
  criteriaStatusData: any 

  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
}
export default function TagUpdateModal({
  allCriteriaDefinitions,
  criteriaStatusData,
  onClose,
  onConfirm,
}: TagUpdateModalProps) {
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>()
    console.log("criteriaStatusData", criteriaStatusData,allCriteriaDefinitions)
    allCriteriaDefinitions.forEach((criteria:any) => {
      if (criteria.is_show) {
        initialSet.add(criteria.criteria_id.toUpperCase())
      }
    })
    return initialSet
  })

  // Thêm state để quản lý trạng thái loading của nút Đồng ý
  const [isLoading, setIsLoading] = useState(false)

  const displayCriteria = useMemo(() => {
    return [...allCriteriaDefinitions].sort((a, b) => a.order_numbers - b.order_numbers)
  }, [allCriteriaDefinitions])

  const handleToggleCriteria = (criteriaId: string) => {
    const normalizedId = criteriaId.toUpperCase()
    setSelectedCriteriaIds((prevIds) => {
      const newIds = new Set(prevIds)
      if (newIds.has(normalizedId)) {
        newIds.delete(normalizedId)
      } else {
        newIds.add(normalizedId)
      }
      return newIds
    })
  }

  const handleRemoveSelectedCriteria = (criteriaId: string) => {
    const normalizedId = criteriaId.toUpperCase()
    setSelectedCriteriaIds((prevIds) => {
      const newIds = new Set(prevIds)
      newIds.delete(normalizedId)
      return newIds
    })
  }

  const handleConfirm = async () => {
    setIsLoading(true) // Bắt đầu loading
    try {
      // Giả lập một hành động bất đồng bộ, ví dụ gửi dữ liệu lên server
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Chờ 1 giây
      onConfirm(Array.from(selectedCriteriaIds))
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error)
      // Xử lý lỗi nếu cần
    } finally {
      setIsLoading(false) // Kết thúc loading
    }
  }

  const selectedCriteriaDetails = useMemo(() => {
    return displayCriteria.filter((criteria) => selectedCriteriaIds.has(criteria.criteria_id.toUpperCase()))
  }, [displayCriteria, selectedCriteriaIds])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "0.5rem",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
              color: "#374151",
            }}
          >
            CẬP NHẬT TIÊU CHÍ
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
            }}
          >
            <X style={{ height: "1.25rem", width: "1.25rem" }} />
          </button>
        </div>

        {/* Main Content - Two Columns */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Left Column: All Criteria */}
          <div
            style={{
              flex: 1,
              padding: "1rem",
              borderRight: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "#2563EB",
                }}
              >
                Tiêu chí
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  border: "1px solid #D1D5DB",
                  color: "#6B7280",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {displayCriteria.length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: "0.9rem", textAlign: "center", marginTop: "2rem" }}>
                  Không có tiêu chí nào để hiển thị.
                </p>
              ) : (
                displayCriteria.map((criteria) => {
                  const isSelected = selectedCriteriaIds.has(criteria.criteria_id.toUpperCase())
                  return (
                    <div
                      key={criteria.criteria_id}
                      onClick={() => handleToggleCriteria(criteria.criteria_id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem 0",
                        borderBottom: "1px solid #F3F4F6",
                        cursor: "pointer",
                        color: "#374151",
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>{criteria.criteria_name}</span>
                      {isSelected ? (
                        <CheckCircle style={{ height: "1.25rem", width: "1.25rem", color: "#22C55E" }} />
                      ) : (
                        <PlusCircle style={{ height: "1.25rem", width: "1.25rem", color: "#EF4444" }} />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Tags */}
          <div
            style={{
              flex: 1,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "#374151",
                }}
              >
                Tiêu chí Đã Chọn
              </h3>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "#374151",
                }}
              >
                Bỏ chọn
              </h3>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {selectedCriteriaDetails.length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: "0.9rem", textAlign: "center", marginTop: "2rem" }}>
                  Chưa có tiêu chí nào được chọn.
                </p>
              ) : (
                selectedCriteriaDetails.map((criteria) => (
                  <div
                    key={criteria.criteria_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #F3F4F6",
                      color: "#374151",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input type="checkbox" style={{ margin: 0 }} checked readOnly />
                      <span>{criteria.criteria_name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSelectedCriteria(criteria.criteria_id)}
                      aria-label={`Xóa ${criteria.criteria_name}`}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#EF4444",
                      }}
                    >
                      <Trash2 style={{ height: "1.25rem", width: "1.25rem" }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#E5E7EB",
              color: "#374151",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
            }}
            disabled={isLoading} // Vô hiệu hóa nút Hủy khi đang loading
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: isLoading ? "#93C5FD" : "#2563EB", // Màu xanh nhạt hơn khi loading
              color: "#FFFFFF",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              display: "flex", // Để căn giữa spinner/text
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem", // Khoảng cách giữa text và spinner
            }}
            disabled={isLoading} // Vô hiệu hóa nút Đồng ý khi đang loading
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Đồng ý"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}