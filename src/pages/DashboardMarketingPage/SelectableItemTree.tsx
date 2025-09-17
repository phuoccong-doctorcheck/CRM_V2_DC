"use client"

import { CaretRightOutlined } from '@ant-design/icons'
import { Checkbox, Collapse, Typography } from "antd"
import React from "react"

const { Panel } = Collapse
const { Text } = Typography

// Định nghĩa giao diện cho các mục có thể chọn
export interface SelectableItem {
  id: string
  name: string
  children?: SelectableItem[]
  originalData: any // Giữ dữ liệu gốc để hiển thị thông tin bổ sung nếu cần
  status?: string // Thêm trường status
}

interface SelectableItemTreeProps {
  item: SelectableItem
  level: number // Cấp độ lồng ghép (0 cho tài khoản, 1 cho chiến dịch, v.v.)
  selectedIds: { // Các Set chứa ID của các mục đã chọn ở mỗi cấp độ
    accounts: Set<string>
    campaigns: Set<string>
    adsets: Set<string>
    ads: Set<string>
  }
  onToggle: (id: string, checked: boolean, item: SelectableItem, level: number) => void // Hàm xử lý khi một mục được chọn/bỏ chọn
  disabled: boolean // Vô hiệu hóa các checkbox khi chọn "tất cả"
}

function cleanLabel(str: string) {
  // Loại bỏ các ký tự không phải là chữ, số, dấu câu, khoảng trắng, và ký tự đặc biệt cơ bản
  return str.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
}
export function SelectableItemTree({
  item,
  level,
  selectedIds,
  onToggle,
  disabled,
}: SelectableItemTreeProps) {
  // Xác định Set ID tương ứng với cấp độ hiện tại
  const currentLevelSelectedIds =
    level === 0
      ? selectedIds.accounts
      : level === 1
      ? selectedIds.campaigns
      : level === 2
      ? selectedIds.adsets
      : selectedIds.ads

  const isSelected = currentLevelSelectedIds.has(item.id)
  const hasChildren = item.children && item.children.length > 0

  // Xử lý thay đổi trạng thái checkbox
  const handleCheckedChange = (e: any) => {
    onToggle(item.id, e.target.checked, item, level)
  }

  // Nội dung hiển thị của một mục (checkbox, label, ID)
  const itemDisplay = (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: `${level * 16}px` }}>
      <Checkbox
        id={`item-${item.id}`}
        checked={isSelected}
        onChange={handleCheckedChange}
        disabled={disabled}
        style={{ marginRight: '8px' }}
          onClick={(e) => e.stopPropagation()}      
      />
      <label htmlFor={`item-${item.id}`}
          onClick={(e) => e.stopPropagation()}   
        style={{ flex: 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center',gap:5 }}>
           <Text strong>{cleanLabel(item.name)} </Text>
          <>
          {
       level === 0   && <span style={{color:"#10db09"}}> (Active)</span> 
            }</>
            <>
          {
              level !== 0 && (
                item.status === "ACTIVE" ? <span style={{color:"#10db09"}}> (Active)</span> : <span style={{color:"red"}}> (Paused)</span>
       )
          }</>
       </div>
        {/* Hiển thị ID tài khoản quảng cáo nếu ở cấp 0 */}
        {level === 0 && item.originalData.ads_account_id && (
         <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>ID: {item.originalData.ads_account_id}</div>
     
        )}
      </label>
    </div>
  )

  // Nếu mục có con, sử dụng Collapse để tạo hiệu ứng mở/đóng
  if (hasChildren) {
    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        style={{ background: 'transparent' }}
      >
        <Panel
          header={itemDisplay}
          key={item.id}
          className="site-collapse-custom-panel"
          style={{
            marginBottom: '4px',
            background: '#fff',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            overflow: 'hidden',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'default'
          }}
        >
          <div style={{ paddingLeft: `${(level + 1) * 4}px` }}>
            {/* Đệ quy hiển thị các mục con */}
            {item.children?.map((child) => (
              <SelectableItemTree
                key={child.id}
                item={child}
                level={level + 1}
                selectedIds={selectedIds}
                onToggle={onToggle}
                disabled={disabled}
              />
            ))}
          </div>
        </Panel>
      </Collapse>
    )
  } else {
    // Nếu không có con, chỉ hiển thị mục đơn giản
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #d9d9d9',
          marginBottom: '4px',
          background: '#fff',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'default',
       
        }}
      >
        {itemDisplay}
      </div>
    )
  }
}
