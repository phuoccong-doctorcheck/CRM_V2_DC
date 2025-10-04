/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { DatePicker, Radio, Spin } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Loading from "components/atoms/Loading";
import RangeDate from 'components/atoms/RangeDate';
import MonthSelector from 'components/atoms/RangeMonth';
import WeekSelector from 'components/atoms/RangeWeek';
import RangeWeek from 'components/atoms/RangeWeek';
import YearSelector from 'components/atoms/RangeYear';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from "components/templates/PublicLayout";
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit, User, Tag, Users, Calendar, Clock ,Phone, MapPin,IterationCcw} from "lucide-react"
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DashboardResponse, RevenueEntry } from 'services/api/dashboardnew/types';
import { postDashBoardMaster } from 'store/dashboard';
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListTask } from "store/tasks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, hanldeConvertListCustomer2, previewBlobPDFOpenLink } from "utils/functions";

import logo from 'assets/images/short_logo.svg';
const { RangePicker } = DatePicker;
type BrandGroup = {
  brand: string;
  brand_name: string;
  priceF: {
    source: string;
    chanel: string;
    expected_total: number;
    real_total: number;
    cost_total: number;
    commission_total: number;
    profix_total: number;
    customer_count: number;
  }[];
};
const formatChannel = (chanel: string, source: string,item:any) => {
if (
  item.source === "--" &&
!["F2", "F3","TK"].includes(item.chanel)
) {
    // Tách các từ trong tên
    const parts = chanel.split(" ").filter(Boolean);
    console.log(item)
    // Bỏ các tiền tố học vị thường gặp
    const filtered = parts.filter(
      (w) => !["ThS.", "TS.", "CK1.", "CK2.", "BS.", "PGS.", "GS."].includes(w)
    );

    // Lấy 2 từ cuối cùng sau khi bỏ tiền tố
    const lastTwo = filtered.slice(-2).join(" ");

    return `BS ${lastTwo}`;
  }

  // Mặc định giữ nguyên
  return chanel;
};

const groupRevenueByBrand = (data: DashboardResponse['data']): BrandGroup[] => {
  const map = new Map<string, BrandGroup>();

  data.map(item => {
    if (!map.has(item.brand)) {
      map.set(item.brand, {
        brand: item.brand,
        brand_name: item.brand_name,
        priceF: [],
      });
    }

    map.get(item.brand)?.priceF.push({
      chanel: item.chanel,
      expected_total: item.expected_total,
      real_total: item.real_total,
      cost_total: item.cost_total,
      commission_total: item.commission_total,
      profix_total: item.profix_total,
      customer_count: item.customer_count,
      source: item.source,
    });
  });

  return Array.from(map.values());
};

// Component hiển thị thẻ thống kê
const StatCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  color: string
}> = ({ title, value, subtitle, color }) => (
  <div
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: `2px solid ${color}`,
      minWidth: "300px",
    }}
  >
    <h3
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#6b7280",
        margin: "0 0 8px 0",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {title}
    </h3>
    <div
      style={{
        fontSize: "28px",
        fontWeight: "700",
        color: color,
        margin: "0 0 4px 0",
      }}
    >
      {value}
    </div>
    {subtitle && (
      <p
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          margin: "0",
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
  )
type SortMode = 'sourcePriority' | 'actualRevenueDesc'
// ---- helpers: chuẩn hoá và map về canonical source ----
const norm = (s?: string) =>
  (s || '')
    .normalize('NFD')                    // bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')                // gộp nhiều khoảng trắng
    .replace(/[()\-_.]/g, ' ')           // bỏ ký tự nhiễu phổ biến
    .trim()

const canonicalSource = (s?: string) => {
  const n = norm(s)
  if (n === 'TK' || /\bF\s*TAI\s*KHAM\b/.test(n)) return 'TK'
  if (/^F\s*1$/.test(n)) return 'F1'
  if (/^F\s*2$/.test(n)) return 'F2'
  if (/^F\s*3$/.test(n)) return 'F3'
  return n || '--'
}

// map thứ tự ưu tiên F1 → TK → F2 → F3
const sourcePriorityIndex = (s?: string) => {
  const c = canonicalSource(s)
  switch (c) {
    case 'F1': return 0
    case 'TK': return 1
    case 'F2': return 2
    case 'F3': return 3
    default:   return 999
  }
}
const ORDER: Record<string, number> = { F1: 0, TK: 1, F2: 2, F3: 3 }



// Trích “nhãn F” từ một chuỗi: F1/F2/F3/TK (F tái khám)
const getFLabel = (raw?: string): 'F1' | 'F2' | 'F3' | 'TK' | undefined => {
  const s = norm(raw)
  if (s === 'TK' || /\bF\s*TAI\s*KHAM\b/.test(s)) return 'TK'
  if (/^F\s*1$/.test(s)) return 'F1'
  if (/^F\s*2$/.test(s)) return 'F2'
  if (/^F\s*3$/.test(s)) return 'F3'
  return undefined
}

// Bucket ưu tiên: lấy từ source, nếu không có thì thử chanel
const getBucket = (item: RevenueEntry): 'F1' | 'F2' | 'F3' | 'TK' | undefined =>
  getFLabel(item.source) ?? getFLabel(item.chanel)
const DataTable: React.FC<{
  title: string
  data: RevenueEntry[]
  color: string
  sortMode?: SortMode
  priorityOrder?: string[]
}> = ({ title, data, color, sortMode = 'sourcePriority' }) => {
  const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

  // ===== SORT như bạn đang dùng =====
  const sortedData = React.useMemo(() => {
    const arr = [...data]

    if (sortMode === 'actualRevenueDesc') {
      // BSCD: lãi gộp (actual - cost) ↓, rồi thực thu ↓, rồi kênh A→Z
      return arr.sort((a, b) => {
        const pa = Number(a.actual_revenue || 0) - Number(a.cost_of_goods || 0)
        const pb = Number(b.actual_revenue || 0) - Number(b.cost_of_goods || 0)
        if (pb !== pa) return pb - pa
        const da = Number(a.actual_revenue || 0)
        const db = Number(b.actual_revenue || 0)
        if (db !== da) return db - da
        return (a.chanel || '').localeCompare(b.chanel || '', 'vi', { numeric: true, sensitivity: 'base' })
      })
    }

    // DC & TTNS: F1 → TK → F2 → F3, rồi kênh A→Z
    return arr.sort((a, b) => {
      const ba = getBucket(a)
      const bb = getBucket(b)
      const ia = ba !== undefined ? ORDER[ba] : Number.POSITIVE_INFINITY
      const ib = bb !== undefined ? ORDER[bb] : Number.POSITIVE_INFINITY
      if (ia !== ib) return ia - ib
      return (a.chanel || '').localeCompare(b.chanel || '', 'vi', { numeric: true, sensitivity: 'base' })
    })
  }, [data, sortMode])

  // ===== Sticky offsets =====
  const titleRef = React.useRef<HTMLDivElement>(null)
  const [stickyTop, setStickyTop] = React.useState(0)

  React.useLayoutEffect(() => {
    const calc = () => setStickyTop(titleRef.current?.offsetHeight ?? 0)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [title])

  // ===== Totals (sticky bottom) =====
  const totals = React.useMemo(() => {
    const totalCustomer = data.reduce((s, it) => s + it.customer_count, 0)
    const totalExpected = data.reduce((s, it) => s + it.expected_revenue, 0)
    const totalActual   = data.reduce((s, it) => s + it.actual_revenue, 0)
    const totalCost     = data.reduce((s, it) => s + it.cost_of_goods, 0)
    return { totalCustomer, totalExpected, totalActual, totalCost }
  }, [data])

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: '0 10px 12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: `2px solid ${color}`,
        marginBottom: 24,
        maxHeight: "61vh",
        minHeight:  "61vh",
        overflow: 'auto',
        paddingBottom: 0,
      }}
    >
      {/* ===== Sticky BIG TITLE ===== */}
      <div
        ref={titleRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: '#fff',
          padding: '10px 0 8px',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color }}>{title}</div>
        <div style={{ height: 2, background: color, marginTop: 6 }} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        {/* ===== Sticky COLUMN HEADER ===== */}
        <thead>
          <tr
            style={{
              backgroundColor: `${color}15`,
              position: 'sticky',
              top: stickyTop,          // đẩy xuống dưới title lớn
              zIndex: 4,
            }}
          >
            {[
              { label: 'Kênh', align: 'left', width: 250 },
              { label: 'KH', align: 'center', width: 20 },
              { label: 'Dự kiến (VNĐ)', align: 'right', width: 100 },
              { label: 'Thực tế (VNĐ)', align: 'right', width: 100 },
              { label: 'Giá vốn (VNĐ)', align: 'right', width: 100 },
              { label: 'Lãi gộp (VNĐ)', align: 'right', width: 100 },
            ].map((c, i) => (
              <th
                key={i}
                style={{
                  padding: '5px 4px',
                  textAlign: c.align as any,
                  fontWeight: 600,
                  color,
                  borderBottom: `2px solid ${color}`,
                  width: c.width,
                  fontSize: 12,
                  background: '#fff',
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '5px 8px', color: '#374151', fontSize: 12 }}>
                {item.chanel}
                {item.source !== '--' &&
                  (item.source === 'Khách Hàng Cũ Giới Thiệu (WoM)' ? ' (WOM)' : ` (${item.source})`)}
              </td>
              <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 600, color: '#1f2937', fontSize: 12 }}>
                {item.customer_count}
              </td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#059669', fontWeight: 500, fontSize: 12 }}>
                {formatCurrency(item.expected_revenue)}
              </td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#dc2626', fontWeight: 500, fontSize: 12 }}>
                {formatCurrency(item.actual_revenue)}
              </td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#333333', fontWeight: 500, fontSize: 12 }}>
                {formatCurrency(item.cost_of_goods)}
              </td>
              <td style={{ padding: '5px 8px', textAlign: 'right', color: '#333333', fontWeight: 500, fontSize: 12 }}>
                {formatCurrency(item.actual_revenue - item.cost_of_goods)}
              </td>
            </tr>
          ))}
        </tbody>

        {/* ===== Sticky BOTTOM TOTAL ===== */}
        <tfoot>
          <tr>
            {[
              { value: 'Tổng', align: 'left', colorText: '#111827' },
              { value: totals.totalCustomer, align: 'center', colorText: '#111827' },
              { value: formatCurrency(totals.totalExpected), align: 'right', colorText: '#059669' },
              { value: formatCurrency(totals.totalActual), align: 'right', colorText: '#dc2626' },
              { value: formatCurrency(totals.totalCost), align: 'right', colorText: '#333333' },
              { value: formatCurrency(totals.totalActual - totals.totalCost), align: 'right', colorText: '#333333' },
            ].map((c, i) => (
              <td
                key={i}
                style={{
                  position: 'sticky',
                  bottom: 0,
                  background: '#fff',
                  padding: '5px 8px',
                  textAlign: c.align as any,
                  color: c.colorText,
                  fontWeight: 700,
                  borderTop: `2px solid ${color}`,
                  fontSize: 12,
                }}
              >
                {c.value}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
// const DataTable: React.FC<{
//   title: string
//   data: RevenueEntry[]
//   color: string
// }> = ({ title, data, color }) => {
//   const formatCurrency = (amount: number) => {
//    return new Intl.NumberFormat("vi-VN").format(amount);
//   }

//   const priority = ['F1','F3', 'F Tái Khám', 'F2']
//   console.log(data)
//   const sortedData = [...data].sort((a, b) => {
//     const indexA = priority.indexOf(a.source)
//     const indexB = priority.indexOf(b.source)

//     const aInPriority = indexA !== -1
//     const bInPriority = indexB !== -1

//     if (aInPriority && bInPriority) return indexA - indexB
//     if (aInPriority) return -1
//     if (bInPriority) return 1
//     return a.source.localeCompare(b.source)
//   })
  
//   if (data.length === 0) {
//     return (
//       <div
//         style={{
//           backgroundColor: "#ffffff",
//           borderRadius: "12px",
//           padding: "12x",
//           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//           border: `3px solid ${color}`,
//           marginBottom: "24px",
//         }}
//       >
//         <h2
//           style={{
//             fontSize: "20px",
//             fontWeight: "700",
//             color: color,
//             margin: "0 0 16px 0",
//             borderBottom: `2px solid ${color}`,
//             paddingBottom: "8px",
//           }}
//         >
//           {title}
//         </h2>
//         <p
//           style={{
//             color: "#6b7280",
//             fontStyle: "italic",
//             textAlign: "center",
//             padding: "20px",
//           }}
//         >
//           Không có dữ liệu
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div
//       style={{
//         backgroundColor: "#ffffff",
//         borderRadius: "12px",
//         padding: "12px 10px",
//         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//         border: `3px solid ${color}`,
//         marginBottom: "24px",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "20px",
//           fontWeight: "700",
//           color: color,
//           margin: "0 0 16px 0",
//           borderBottom: `2px solid ${color}`,
//           paddingBottom: "8px",
//         }}
//       >
//         {title}
//       </h2>

//       <div style={{ overflowX: "auto",maxHeight: "530px", minHeight: "530px" }}>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             fontSize: "14px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: `${color}15` }}>
//               <th style={{ padding: "5px 4px", textAlign: "left", fontWeight: "600", color, borderBottom: `2px solid ${color}`, width: 250, fontSize: 12 }}>Kênh</th>
//                 {/* <th style={{ padding: "12px 4px", textAlign: "left", fontWeight: "600", color, borderBottom: `2px solid ${color}`, width: 150,fontSize:14 }}>Nguồn</th> */}
//               <th style={{ padding: "5px 4px", textAlign: "center", fontWeight: "600", color, borderBottom: `2px solid ${color}`, width: 20,fontSize:12 }}>KH</th>
//               <th style={{ padding: "5px 4px", textAlign: "right", fontWeight: "600", color, borderBottom: `2px solid ${color}`, width: 100,fontSize:12 }}>Dự kiến (VNĐ)</th>
//               <th style={{ padding: "5px 4px", textAlign: "right", fontWeight: "600", color, borderBottom: `2px solid ${color}`,fontSize:12,width: 100 }}>Thực tế (VNĐ)</th>
//               <th style={{ padding: "5px 4px", textAlign: "right", fontWeight: "600", color, borderBottom: `2px solid ${color}` ,fontSize:12,width: 100}}>Giá vốn (VNĐ)</th>
//               <th style={{ padding: "5px 4px", textAlign: "right", fontWeight: "600", color, borderBottom: `2px solid ${color}`,fontSize:12,width: 100 }}>Lãi gộp (VNĐ)</th>
//             </tr>
//           </thead>
//        <tbody
//   style={{
  
//     maxHeight: "450px",        // giới hạn chiều cao, có thể chỉnh
//     overflowY: "auto",
  
//   }}
// >
//             {sortedData.map((item, index) => (
//               <tr key={index} style={{ borderBottom: "1px solid #e5e7eb", transition: "background-color 0.2s" }}>
//                <td
//   style={{
//     padding: "5px 8px",
//     color: "#374151",
//     fontSize: 12,
//   }}
// >
//                   {formatChannel(item.chanel, item.source, item)}{item.source !== "--" &&
//   (item.source === "Khách Hàng Cũ Giới Thiệu (WoM)" ? " (WOM)" : ` (${item.source})`)} 

// </td>

//                 {/* <td style={{ padding: "12px 8px", textAlign: "center", fontWeight: "600", color: "#1f2937" }}>{item.customer_count}</td> */}
//                  <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: "600", color: "#1f2937", fontSize:12 }}>{item.customer_count}</td>
//                 <td style={{ padding: "5px 8px", textAlign: "right", color: "#059669", fontWeight: "500", fontSize:12 }}>{formatCurrency(item.expected_revenue)}</td>
//                 <td style={{ padding: "5px 8px", textAlign: "right", color: "#dc2626", fontWeight: "500", fontSize:12 }}>{formatCurrency(item.actual_revenue)}</td>
//                 <td style={{ padding: "5px 8px", textAlign: "right", color: "#333333", fontWeight: "500" , fontSize:12}}>{formatCurrency(item.cost_of_goods)}</td>
//                 <td style={{ padding: "5px 8px", textAlign: "right", color: "#333333", fontWeight: "500", fontSize:12 }}>{formatCurrency(item.actual_revenue - item.cost_of_goods)}</td>
//               </tr>
//             ))}

//             {/* Tổng */}
//             {(() => {
//               const totalCustomer = data.reduce((sum, item) => sum + item.customer_count, 0)
//               const totalExpected = data.reduce((sum, item) => sum + item.expected_revenue, 0)
//               const totalActual = data.reduce((sum, item) => sum + item.actual_revenue, 0)
//               const totalCost = data.reduce((sum, item) => sum + item.cost_of_goods, 0)

//               return (
//                 <tr style={{ backgroundColor: "#f9fafb", fontWeight: "bold", borderTop: `2px solid ${color}` }}>
//                   <td style={{ padding: "5px 8px", textAlign: "left", color: "#111827",fontSize:12 }}>Tổng</td>
//                   <td style={{ padding: "5px 8px", textAlign: "center", color: "#111827",fontSize:12 }}>{totalCustomer}</td>
//                   <td style={{ padding: "5px 8px", textAlign: "right", color: "#059669",fontSize:12 }}>{formatCurrency(totalExpected)}</td>
//                   <td style={{ padding: "5px 8px", textAlign: "right", color: "#dc2626",fontSize:12 }}>{formatCurrency(totalActual)}</td>
//                   <td style={{ padding: "5px 8px", textAlign: "right", color: "#333333",fontSize:12 }}>{formatCurrency(totalCost)}</td>
//                   <td style={{ padding: "5px 8px", textAlign: "right", color: "#333333", fontWeight: "600",fontSize:12 }}>{formatCurrency(totalActual - totalCost)}</td>
//                 </tr>
//               )
//             })()}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
const DataTableDC: React.FC<{
  title: string
  data: RevenueEntry[]
  color: string
}> = ({ title, data, color }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: `3px solid ${color}`,
          marginBottom: "24px",

        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: color,
            margin: "0 0 16px 0",
            borderBottom: `2px solid ${color}`,
            paddingBottom: "8px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontStyle: "italic",
            textAlign: "center",
            padding: "20px",
          }}
        >
          Không có dữ liệu
        </p>
      </div>
    )
  }
  
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: `3px solid ${color}`,
        marginBottom: "24px",
        width:"100%"
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: color,
          margin: "0 0 16px 0",
          borderBottom: `2px solid ${color}`,
          paddingBottom: "8px",
        }}
      >
        {title}
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: `${color}15` }}>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                  width:130
                }}
              >
               Nguồn
              </th>
             
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                    width:60
                }}
              >
                Số KH
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                    width:130
                }}
              >
                Doanh thu dự kiến
              </th>
              
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                }}
              >
                Doanh thu thực tế
              </th>
               <th
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                }}
              >
                Giá vốn
              </th>
              <th
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  fontWeight: "600",
                  color: color,
                  borderBottom: `2px solid ${color}`,
                }}
              >
                Lãi gộp
              </th>
            </tr>
          </thead>
        <tbody>
  {data.map((item, index) => {
    const achievementRate =
      item.expected_revenue > 0
        ? ((item.actual_revenue / item.expected_revenue) * 100).toFixed(1)
        : "0.0"

    return (
      <tr
        key={index}
        style={{
          borderBottom: "1px solid #e5e7eb",
          transition: "background-color 0.2s",
        }}
      > <td style={{ padding: "12px 8px", color: "#374151" }}>{item.source}</td>
       
       
        <td
          style={{
            padding: "12px 8px",
            textAlign: "center",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          {item.customer_count}
        </td>
        <td
          style={{
            padding: "12px 8px",
            textAlign: "right",
            color: "#059669",
            fontWeight: "500",
          }}
        >
          {formatCurrency(item.expected_revenue)}
        </td>
        <td
          style={{
            padding: "12px 8px",
            textAlign: "right",
            color: "#dc2626",
            fontWeight: "500",
          }}
        >
          {formatCurrency(item.actual_revenue)}
        </td>
           <td
          style={{
            padding: "12px 8px",
            textAlign: "right",
            color: "#333333",
            fontWeight: "500",
          }}
        >
          {formatCurrency(item.cost_of_goods)}
        </td>
        <td style={{ padding: "12px 8px", textAlign: "right",  color: "#333333",
            fontWeight: "500", }}>
       
           {formatCurrency(Number(item.actual_revenue) - Number(item.cost_of_goods))}
        
        </td>
      </tr>
    )
  })}

  {/* ✅ Dòng tổng cuối bảng */}
  {(() => {
    const totalCustomer = data.reduce((sum, item) => sum + item.customer_count, 0)
    const totalExpected = data.reduce((sum, item) => sum + item.expected_revenue, 0)
    const totalActual = data.reduce((sum, item) => sum + item.actual_revenue, 0)
    const totalCostGoods = data.reduce((sum, item) => sum + item.cost_of_goods, 0)
    const weightedRate = totalExpected > 0 ? (totalActual / totalExpected) * 100 : 0
    const roundedRate = weightedRate.toFixed(1)

    return (
      <tr
        style={{
          backgroundColor: "#f9fafb",
          fontWeight: "bold",
          borderTop: `2px solid ${color}`,
        }}
      >
        <td colSpan={0} style={{ padding: "12px 8px", textAlign: "left", color: "#111827" }}>
          Tổng
        </td>
      
        <td style={{ padding: "12px 8px", textAlign: "center", color: "#111827" }}>
          {totalCustomer}
        </td>
        <td style={{ padding: "12px 8px", textAlign: "right", color: "#059669" }}>
          {formatCurrency(totalExpected)}
        </td>
        <td style={{ padding: "12px 8px", textAlign: "right", color: "#dc2626" }}>
          {formatCurrency(totalActual)}
        </td>
         <td style={{ padding: "12px 8px", textAlign: "right", color: "#333333" }}>
          {formatCurrency(totalCostGoods)}
        </td>
        <td style={{ padding: "12px 8px", textAlign: "right" ,  color: "#333333",
            fontWeight: "600",}}>
       
           {formatCurrency(Number(totalActual) - Number(totalCostGoods))}
       
        </td>
      </tr>
    )
  })()}
</tbody>

        </table>
      </div>
    </div>
  )
}
const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
    const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
 
  const [loading, setLoading] = useState(true)
  const [isLead, setIsLead] = useState(true);
  const storeDashBoard = useAppSelector((state) => state.dashboard.dashboardMaster);
  const storeDashBoardLoading = useAppSelector((state) => state.dashboard.isLoadingDashboard);
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");

  const storageCategories = localStorage.getItem("categories");
  const storageCSKH = localStorage.getItem("listCSKH");
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");
  const storestepsprocesslead = localStorage.getItem("stepsprocesslead");
  const storeListUser = localStorage.getItem("list_users");
   const storageEmployeeTeams = localStorage.getItem('employeeTeams');
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [listPhares, setListPhares] = useState<DropdownData[]>(
    storagelistPhares ? JSON.parse(storagelistPhares) : ""
  );
  const [listUsers, setListUsers] = useState<DropdownData[]>(
    storeListUser ? JSON.parse(storeListUser) : ""
  );
  const [listCSKH, setListCSKH] = useState<any[]>(
    storageCSKH ? JSON.parse(storageCSKH) : []
  );
      const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);
  const [stepsprocesslead, setStepsprocesslead] = useState<any[]>(
    storestepsprocesslead ? JSON.parse(storestepsprocesslead) : []
  );
  const [listTouchPointLogType, setListTouchPointLogType] = useState<any[]>(
    storageTouchPointLogType ? JSON.parse(storageTouchPointLogType) : []
  );
  const [listCategories, setListCategories] = useState<any[]>(
    storageCategories ? JSON.parse(storageCategories) : []
  );
  console.log(listCategories)
  const listNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteLog
  );
  const LoainglistNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.loadingNoteLog
  );
  const [listNode, setListNode] = useState(listNotesCustomer);


  const params = new URLSearchParams(window.location.search);


  const [isLoading, setIsLoading] = useState(false);

const [stateEmployeeId, setStateEmployeeId] = useState<any>(() => {
  try {
    return employeeId ? JSON.parse(employeeId) : "";
  } catch {
    return employeeId || "";
  }
});

   const [data, setData] = useState<DashboardResponse>(storeDashBoard)
  const groupedData = useMemo(() => groupRevenueByBrand(data.data), [data]);
  console.log(groupedData)
const [filterData, setFilterData] = useState({
  date_from: moment().startOf('month').format('YYYY-MM-DDT00:00:00'),
  date_to:  moment().format('YYYY-MM-DDT23:59:59'),
});
  console.log(data.data)
 
    const [tableLoading, setTableLoading] = useState(false);



  const [isOpenModal, setIsOpenModal] = useState(false);
  const [conversation, setConversation] = useState<any>({
    category_id: undefined as unknown as DropdownData,
    guid_title: '',
    guid_content: '',
    guid_suggest: '',
    guid_status: '',
    guid_u_id: employeeId,
    tags: [],
  });

  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    document.title = "Dashboard | CRM";
  }, []);
  useEffect(() => {

    dispatch(
      postDashBoardMaster({
        date_from: moment(filterData.date_from).format("YYYY-MM-DD"),
        date_to: moment(filterData.date_to).format("YYYY-MM-DD"),
      })
    )
  }, []);
  useEffect(() => {
    setLoadingPage(false)
   setData(storeDashBoard)
  }, [storeDashBoard]);
  // const allData = [...data.data.doctor_check, ...data.data.bscd, ...data.data.ttns]
const brandGroups = groupedData.filter(item => item.hasOwnProperty("priceF"));

// Tính toán từ các priceF
const totalCustomers = brandGroups.reduce(
  (sum, brand) => sum + brand.priceF.reduce((s, p) => s + p.customer_count, 0),
  0
);

const totalExpectedRevenue = brandGroups.reduce(
  (sum, brand) => sum + brand.priceF.reduce((s, p) => s + p.expected_total, 0),
  0
);

const totalActualRevenue = brandGroups.reduce(
  (sum, brand) => sum + brand.priceF.reduce((s, p) => s + p.real_total, 0),
  0
);

const totalCostGoods = brandGroups.reduce(
  (sum, brand) => sum + brand.priceF.reduce((s, p) => s + p.cost_total, 0),
  0
);
   const overallAchievementRate =
     totalExpectedRevenue > 0 ? ((totalActualRevenue / totalExpectedRevenue) * 100).toFixed(1) : "0.0"

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }
  const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};
  console.log(data)

    const statisticHeader = useMemo(
      () => (
        <PublicHeaderStatistic handleClick={(data: any) => { }} title="Dashboard thống kê doanh thu" isStatistic={false} valueRangeDate={{ from: new Date(), to: new Date(), }} >
          {
            stateBreakPoint > 924 ?
              <div style={{paddingTop:"5px",paddingBottom:"5px"}}>
              
                
              </div>
            : (
                <>
                  
                </>
              )
          }
        </PublicHeaderStatistic>
      ),
      [  stateBreakPoint,filterData]
    );

  const handleUpdate = (from: any, to: any) => {
        
    setLoadingPage(true);
    setFilterData({ date_from: from, date_to: to });
    dispatch(
      postDashBoardMaster({
        date_from: moment(from).format("YYYY-MM-DD"),
        date_to: moment(to).format("YYYY-MM-DD"),
      }) as any
    );
  };

  const statisticContent = useMemo(
    () => (
        <div
      style={{
          minHeight: "100vh",
        
        backgroundColor: "#f8fafc",
        padding: "12px 24px 24px 24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#1f2937",
            margin: "0 0 8px 0",
          }}
        >
          Báo Cáo Doanh Thu Ngày {moment(filterData.date_from).format("DD/MM/YYYY")} - {moment(filterData.date_to).format("DD/MM/YYYY")}
        </h2>
       
      </div>

      {/* Thống kê tổng quan */}
        <div style={{maxHeight:"93vh", overflowY:"auto",}}>
           <div
        style={{
          display: "flex",
              gap: "25px",
          flexDirection:"row",
          marginBottom: "10px",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
      <StatCard title="Tổng khách hàng" value={formatNumber(totalCustomers)} subtitle="Tất cả nguồn" color="#3b82f6" />
        <StatCard
          title="Doanh thu dự kiến"
          value={formatCurrency(totalExpectedRevenue)}
          subtitle="Mục tiêu"
          color="#059669"
        />
        <StatCard
          title="Doanh thu thực tế"
          value={formatCurrency(totalActualRevenue)}
          subtitle="Đã đạt được"
          color="#dc2626"
          />
           <StatCard
          title="Giá vốn"
          value={formatCurrency(totalCostGoods)}
          subtitle=""
          color="#333333"
          
        />
        <StatCard title="Lãi gộp" value={formatCurrency(Number(totalActualRevenue) - Number(totalCostGoods))}
 subtitle="Tổng thể" color="#7c3aed" />
      </div>

      {/* Bảng dữ liệu */}
      <div
        style={{
           height:"80vh",
       
              margin: "0 auto",
              display: "flex",
              flexDirection:"row",
              alignItems: "start",
              gap:15,
          justifyContent:"center"
        }}
          >
        {groupedData.map((group, idx) => {
  const rows: RevenueEntry[] = group.priceF.map(item => ({
    source: item.source || '--',
    customer_count: item.customer_count,
    expected_revenue: item.expected_total,
    actual_revenue: item.real_total,
    cost_of_goods: item.cost_total,
    f_type: '',
    chanel: item.chanel || '--',
  }))

  const sortMode = group.brand === 'BSCD' ? 'actualRevenueDesc' : 'sourcePriority'
  const prio = (group.brand === 'DC' || group.brand === 'TTNS') ? ['F1','TK','F2','F3'] : undefined

  return (
    <DataTable
      key={group.brand}
      title={group.brand_name}
      data={rows}
      color={["#3b82f6","#059669","#dc2626","#7c3aed"][idx % 4]}
      sortMode={sortMode}
      priorityOrder={prio}
    />
  )
})}



        {/* <DataTableDC title="Doctor Check" data={data.data.doctor_check} color="#3b82f6" />

            <div style={{  display: "flex",gap:10, minWidth:300}}>
               <DataTable title="BSCD" data={data.data.bscd} color="#059669" />

        <DataTable title="TTNS" data={data.data.ttns} color="#dc2626" />
       </div> */}
      </div>
     </div>

 
    </div>
      ),[data,storeDashBoard])
  return (
    <div className="p-apointment_list">
      <PublicLayout widthScreen={stateBreakPoint}>
          <Spin
                      spinning={loadingPage}
                      size="large"
                      indicator={
                        <img
                          className="loader"
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: 'cover',
                            backgroundColor: 'transparent',
                          }}
                          src={logo}
                        />
                      } >
        <div className="p-apointment_list_schedule">
          {isLoading ? (
            <Loading variant="max_content" isShow size="medium" />
          ) : (
            <>
              
               <PublicHeader
                             isDial = {false}
                               isHideCleanFilter
                               isHideEmergency
                               
                               isHideService
                               isHideLibraly
                               
                               
                                       titlePage=""
                                       className="p-apointment_list_schedule_header_top_action"
                                       handleFilter={() => { }}
                                       isHideFilter
                                       isClearFilter={storeDashBoardLoading || tableLoading}
                                       handleGetTypeSearch={() => { }}
                                       handleCleanFilter={() => {
                                       
                                        
                                         
                               }}
               
           
                                       tabLeft={(
                                     <div style={{ display: "flex", flexDirection: "row", justifyContent:"center",alignItems:"center",gap: 16 }}>
                                           {/* Radio chọn kiểu filter */}
                                           <div>Chọn thống kê theo thời gian thanh toán: </div>
     <Radio.Group
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <Radio value="day">Theo ngày</Radio>
        {/* <Radio value="week">Tuần</Radio> */}
        <Radio value="month">Theo tháng</Radio>
        <Radio value="year">Theo năm</Radio>
      </Radio.Group>

      {/* Render component filter theo radio */}
      {filterType === "day" && (
        // <RangeDate
        //   variant="simple"
        //   value={{ from: filterData.date_from, to: filterData.date_to }}
        //   defaultValue={{ from: filterData.date_from, to: filterData.date_to }}
        //   handleOnChange={(from: any, to: any) => handleUpdate(from, to)}
        // />
        <div > <div style={{ display: 'flex', gap: '16px', alignItems: 'center',border: "1px solid #d9d9d9", padding:5, borderRadius: 5 }}> 
   <RangeDate
            variant="simple"
            value={{ from: filterData?.date_from, to: filterData?.date_to }}
            defaultValue={{
              from: filterData?.date_from,
              to: filterData?.date_to,
            }}
            handleOnChange={(from: any, to: any) => handleUpdate(from, to)}
          />
          </div> </div>
      )}

      {filterType === "week" && (
        <WeekSelector
          onChange={(from, to) => handleUpdate(from, to)}
        />
      )}

      {filterType === "month" && (
        <MonthSelector
          onChange={(from, to) => handleUpdate(from, to)}
        />
      )}

      {filterType === "year" && (
        <YearSelector
          onChange={(from, to) => handleUpdate(from, to)}
        />
      )}
    </div>
                                       )}
                                    
                                  
                                     />
                         <div className="p-apointment_list_statistic">
                             {statisticHeader}
                             </div> 
              
          {statisticContent}
            </>
          )}
        </div>
          
     </Spin>
      </PublicLayout>
  
 
    </div>
  );
};

export default DashboardPage;