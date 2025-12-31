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
import { DatePicker, Empty, Radio, Spin } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown4 from 'components/atoms/Dropdown4';
import Input from 'components/atoms/Input';
import Loading from "components/atoms/Loading";
import RangeDate from 'components/atoms/RangeDate';
import MonthSelector from 'components/atoms/RangeMonth';
import WeekSelector from 'components/atoms/RangeWeek';
import RangeWeek from 'components/atoms/RangeWeek';
import YearSelector from 'components/atoms/RangeYear';
import CModal from 'components/organisms/CModal';
import { AntdMultiSelect } from 'components/organisms/CMultiSelectProps';
import HeaderNew from 'components/templates/HeaderNew/HeaderNew';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from "components/templates/PublicLayout";
import TagUpdateModal, { InitialSelectedCriteria } from 'components/templates/TagUpdateModal';
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit, User, Tag, Users, Calendar, Clock ,Phone, MapPin,IterationCcw} from "lucide-react"
import moment from "moment";
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postAddCampaignDashboardMarketingAPI, postHideShowCrtDashboardMarketingAPI } from 'services/api/dashboardnew';
import { AdsAccountResponse, DashboardMarketingResponse, DashboardResponse, DataReport, RevenueEntry, RevenueFromErp, TagStatisticsByPage } from 'services/api/dashboardnew/types';
import { postAdsAMarketingMasterMarketingMaster, postDashBoardMarketingMaster } from 'store/dashboard';
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListTask } from "store/tasks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, hanldeConvertListCustomer2, previewBlobPDFOpenLink } from "utils/functions";

import AdAccountSelector from './AdAccountSelector';

import logo from 'assets/images/short_logo.svg';
const { RangePicker } = DatePicker;



// Component hiển thị thẻ thống kê
interface SelectOption {
  value: string
  label: string
  is_use?: boolean
}

export interface Campaign {
  campaign_id: string
  campaign_name: string
  objective: string | null
  status: string
}

export interface AdsAccount {
  value: string // ads_account_id
  label: string // ads_account_name
  ads_account_id: string
  ads_account_name: string
  ads_account_type: string
  is_use: boolean
  order_numbers: number
  campaigns: Campaign[]
}
interface KPIConfig {
  key: keyof DataReport
  name: string
  unit: string
  isPercentage?: boolean
  isAverage?: boolean
}
function cleanLabel(str: string) {
  // Loại bỏ các ký tự không phải là chữ, số, dấu câu, khoảng trắng, và ký tự đặc biệt cơ bản
  return str.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
}
  const dataEx = [
    { category: "Inbox", subcategory: "Inbox", value: 265, percentage: "", highlight: false },
    { category: "", subcategory: "Inbox ấm", value: 262, percentage: "99% Dựa trên 262", highlight: false },
    { category: "", subcategory: "Fail đặt hẹn (biết lý do)", value: 100, percentage: "38%", highlight: true },
    { category: "", subcategory: "Chưa biết lý do", value: 100, percentage: "38%", highlight: false },
    { category: "", subcategory: "Ngưng chăm sóc", value: 25, percentage: "10%", highlight: false },
    { category: "Đặt hẹn", subcategory: "Thành công", value: 37, percentage: "14%", highlight: true },
    { category: "", subcategory: "Hủy lịch không có lý", value: 1, percentage: "2.7%", highlight: false },
    {
      category: "",
      subcategory: "Chưa tới (đã hẹn nhưng lịch khám rơi vào khác ngày đặt lịch)",
      value: 1,
      percentage: "2.7%",
      highlight: false,
    },
    { category: "Đến khám", subcategory: "Bận đột xuất", value: 1, percentage: "2.7%", highlight: false },
    { category: "", subcategory: "Đến mà không SD DV + Lý do", value: 1, percentage: "2.7%", highlight: false },
    { category: "", subcategory: "Khám rồi khác", value: 1, percentage: "2.7%", highlight: false },
    {
      category: "",
      subcategory: "Hoàn thành khám",
      value: 32,
      percentage: "86%",
      highlight: true,
      redPercentage: "12%",
    },
]
  interface TableRow {
  label: string
  value: number
  percentage?: string
  subRows?: TableRow[]
}
    const potentialCustomersData: TableRow[] = [
    { label: "Tổng inbox (ngày từ 1 - 14)", value: 100, percentage: "" },
    { label: "Inbox chất lượng (đm)", value: 70, percentage: "70.00%" },
    {
      label: "Đặt hẹn",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Biết lý do", value: 10, percentage: "14.29%" },
        { label: "Không biết lý do", value: 27, percentage: "38.57%" },
        { label: "Ngưng chăm sóc", value: 18, percentage: "25.71%" },
      ],
    },
    { label: "Thành công", value: 15, percentage: "21.43%" },
    {
      label: "Đến khám",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Đặt hẹn nhưng chưa đến", value: 5, percentage: "33.33%" },
        { label: "Đến mà không sử dụng dịch vụ", value: 3, percentage: "20.00%" },
        { label: "Hoàn thành khám", value: 7, percentage: "46.67%" },
      ],
    },
  ]

  const failedAppointmentsData: TableRow[] = [
    { label: "Tổng inbox", value: 100, percentage: "" },
    { label: "Inbox chất lượng (đm)", value: 70, percentage: "70.00%" },
    {
      label: "Đặt hẹn",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Biết lý do", value: 10, percentage: "14.29%" },
        { label: "Không biết lý do", value: 27, percentage: "38.57%" },
        { label: "Ngưng chăm sóc", value: 18, percentage: "25.71%" },
      ],
    },
  ]

  const successfulAppointmentsData: TableRow[] = [
    { label: "Tổng inbox (ngày cập nhật của bảng KHTN)", value: 100, percentage: "" },
    {
      label: "Inbox mới",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng inbox", value: 50, percentage: "" },
        { label: "Đặt hẹn", value: 10, percentage: "20.00%" },
      ],
    },
    {
      label: "Inbox cập nhật",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng inbox", value: 50, percentage: "" },
        { label: "Đặt hẹn", value: 30, percentage: "60.00%" },
      ],
    },
    { label: "Tổng số đặt hẹn", value: 40, percentage: "40.00%" },
  ]

  const triEffectivenessData: TableRow[] = [
    { label: "Tổng inbox (ngày cập nhật của bảng KHTN)", value: 100, percentage: "" },
    {
      label: "Inbox mới",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng inbox", value: 50, percentage: "" },
        { label: "Đặt hẹn", value: 10, percentage: "20.00%" },
      ],
    },
    {
      label: "Inbox cập nhật",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng inbox", value: 50, percentage: "" },
        { label: "Đặt hẹn", value: 30, percentage: "60.00%" },
      ],
    },
    { label: "Tổng số đặt hẹn", value: 40, percentage: "40.00%" },
  ]

  // Mock data for right column tables
  const barriersNotScheduledData: TableRow[] = [
    { label: "Tổng đặt hẹn thất bại (biết lý do)", value: 10, percentage: "" },
    { label: "Giá", value: 4, percentage: "40.00%" },
    { label: "Uy tín", value: 2, percentage: "20.00%" },
    { label: "Thời gian", value: 3, percentage: "30.00%" },
    { label: "Ơ xa", value: 1, percentage: "10.00%" },
  ]

  const barriersScheduledNotArrivedData: TableRow[] = [
    { label: "Tổng đặt hẹn nhưng chưa đến", value: 5, percentage: "" },
    { label: "Bận đột xuất", value: 1, percentage: "20.00%" },
    { label: "Khám nơi khác", value: 2, percentage: "40.00%" },
    { label: "Chưa tới lịch hẹn", value: 1, percentage: "20.00%" },
    { label: "Chưa biết lý do", value: 1, percentage: "20.00%" },
  ]

  const barriersFailedAfter14DaysData: TableRow[] = [
    { label: "Tổng đặt hẹn thất bại (biết lý do)", value: 10, percentage: "" },
    { label: "Giá", value: 4, percentage: "40.00%" },
    { label: "Uy tín", value: 2, percentage: "20.00%" },
    { label: "Thời gian", value: 3, percentage: "30.00%" },
    { label: "Ơ xa", value: 1, percentage: "10.00%" },
  ]

  const customersArrivedData: TableRow[] = [
    { label: "Tổng Đặt hẹn", value: 20, percentage: "" },
    {
      label: "KH đến",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng KH đến", value: 10, percentage: "50.00%" },
        { label: "Hoàn thành khám", value: 5, percentage: "50.00%" },
        { label: "Đến mà không sử dụng dịch vụ", value: 5, percentage: "50.00%" },
      ],
    },
    {
      label: "KH không đến",
      value: 0,
      percentage: "",
      subRows: [
        { label: "Tổng KH không đến", value: 10, percentage: "50.00%" },
        { label: "Bận đột xuất", value: 2, percentage: "20.00%" },
        { label: "Khám nơi khác", value: 2, percentage: "20.00%" },
        { label: "Không có lý do", value: 3, percentage: "30.00%" },
        { label: "Chưa tới ngày hẹn", value: 3, percentage: "30.00%" },
      ],
    },
]
     const renderTableV1 = (title: string, data: TableRow[], headerColor: string, textColor = "#ffffff") => {
    const renderRows = (data: TableRow[]) => {
      const rows: ReactNode[] = []

      data.forEach((row, rowIndex) => {
        const rowStyle: React.CSSProperties = {
          borderBottom: "1px solid #000",
        }

        const cellStyle: React.CSSProperties = {
          padding: "0px 8px",
          border: "1px solid #000",
          fontSize: "11px",
          textAlign: "left",
        }

        const numberCellStyle: React.CSSProperties = {
          ...cellStyle,
          textAlign: "center",
          fontWeight: "bold",
        }

        const isTotalRow = row.label.toLowerCase().includes("tổng")

        if (row.subRows && row.subRows.length > 0) {
          // Parent row with rowspan
          rows.push(
            <tr key={`parent-${rowIndex}`} style={rowStyle}>
              <td
                rowSpan={row.subRows.length}
                style={{
                  ...cellStyle,
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {row.label}
              </td>
              <td style={cellStyle}>{row.subRows[0].label}</td>
              <td style={numberCellStyle}>{row.subRows[0].value}</td>
              <td style={numberCellStyle}>{row.subRows[0].percentage}</td>
            </tr>,
          )

          // Child rows (starting from index 1)
          row.subRows.slice(1).forEach((subRow, subIndex) => {
            rows.push(
              <tr key={`child-${rowIndex}-${subIndex}`} style={rowStyle}>
                <td style={cellStyle}>{subRow.label}</td>
                <td style={numberCellStyle}>{subRow.value}</td>
                <td style={numberCellStyle}>{subRow.percentage}</td>
              </tr>,
            )
          })
        } else if (isTotalRow) {
          rows.push(
            <tr key={`row-${rowIndex}`} style={rowStyle}>
              <td colSpan={2} style={{ ...cellStyle, fontWeight: "bold" }}>
                {row.label}
              </td>
              <td style={numberCellStyle}>{row.percentage}</td>
            </tr>,
          )
        } else {
          // Regular row without children
          rows.push(
            <tr key={`row-${rowIndex}`} style={rowStyle}>
              <td style={cellStyle}>{row.label}</td>
              <td style={numberCellStyle}>{row.value}</td>
              <td style={numberCellStyle}>{row.percentage}</td>
            </tr>,
          )
        }
      })

      return rows
    }

    return (
      <div style={{ marginBottom: "0px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            fontSize: "11px",
          }}
        >
          <thead>
            <tr>
              <th
                colSpan={4}
                style={{
                  backgroundColor: headerColor,
                  color: textColor,
                  padding: "0px",
                  border: "1px solid #000",
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {title}
              </th>
            </tr>
          </thead>
          <tbody>{renderRows(data)}</tbody>
        </table>
      </div>
    )
  }
   const renderTableV2 = (title: string, data: TableRow[], headerColor: string, textColor = "#ffffff") => {
    const renderRows = (data: TableRow[]) => {
      const rows: ReactNode[] = [] // Use ReactNode for type safety

      data.forEach((row, rowIndex) => {
        const rowStyle: React.CSSProperties = {
          borderBottom: "1px solid #000",
        }

        const cellStyle: React.CSSProperties = {
          padding: "0px 8px",
          border: "1px solid #000",
          fontSize: "11px",
          textAlign: "left",
        }

        const numberCellStyle: React.CSSProperties = {
          ...cellStyle,
          textAlign: "center",
          fontWeight: "bold",
        }

        if (row.subRows && row.subRows.length > 0) {
          // Parent row with rowspan
          rows.push(
            <tr key={`parent-${rowIndex}`} style={rowStyle}>
              <td
                rowSpan={row.subRows.length}
                style={{
                  ...cellStyle,
                  verticalAlign: "middle",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {row.label}
              </td>
              <td style={cellStyle}>{row.subRows[0].label}</td>
              <td style={numberCellStyle}>{row.subRows[0].value}</td>
              <td style={numberCellStyle}>{row.subRows[0].percentage}</td>
            </tr>,
          )

          // Child rows (starting from index 1)
          row.subRows.slice(1).forEach((subRow, subIndex) => {
            rows.push(
              <tr key={`child-${rowIndex}-${subIndex}`} style={rowStyle}>
                <td style={cellStyle}>{subRow.label}</td>
                <td style={numberCellStyle}>{subRow.value}</td>
                <td style={numberCellStyle}>{subRow.percentage}</td>
              </tr>,
            )
          })
        } else {
          // Regular row without children
          rows.push(
            <tr key={`row-${rowIndex}`} style={rowStyle}>
              <td style={cellStyle}>{row.label}</td>
              <td style={numberCellStyle}>{row.value}</td>
              <td style={numberCellStyle}>{row.percentage}</td>
            </tr>,
          )
        }
      })

      return rows
    }

    return (
      <div style={{ marginBottom: "1px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            fontSize: "11px",
          }}
        >
          <thead>
            <tr>
              <th
                colSpan={4}
                style={{
                  backgroundColor: headerColor,
                  color: textColor,
                  padding: "0px",
                  border: "0px solid #000",
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {title}
              </th>
            </tr>
          </thead>
          <tbody>{renderRows(data)}</tbody>
        </table>
      </div>
    )
}
  
  const potentialCustomerData = [
    { label: "Tổng Inbox", count: 100, percentage: null, highlight: false },
    { label: "Inbox Ẩn (chất lượng)", count: 80, percentage: "80.00%", highlight: false },
    { label: "Chưa rõ trạng thái", count: 24, percentage: "30.00%", highlight: false },
    { label: "Đặt hẹn thất bại", count: 20, percentage: "25.00%", highlight: true },
    { label: "Đặt hẹn thành công", count: 36, percentage: "45.00%", highlight: true },
    { label: "Hủy đặt hẹn", count: 8, percentage: "22.22%", highlight: false },
    { label: "Đặt hẹn chưa đến", count: 6, percentage: "16.67%", highlight: false },
    { label: "Đến không sử dụng dịch vụ", count: 2, percentage: "5.56%", highlight: false },
    { label: "Hoàn thành khám", count: 20, percentage: "55.56%", highlight: false },
  ]

  const failedAppointmentData = [
    { label: "Tổng đặt hẹn thất bại", count: 20, percentage: null, highlight: true },
    { label: "Giá", count: 8, percentage: "40.00%", highlight: false },
    { label: "Uy tín", count: 4, percentage: "20.00%", highlight: false },
    { label: "Thời gian", count: 2, percentage: "10.00%", highlight: false },
    { label: "Ở xa", count: 2, percentage: "10.00%", highlight: false },
    { label: "Bận đột xuất", count: 1, percentage: "5.00%", highlight: false },
    { label: "Khám nơi khác", count: 1, percentage: "5.00%", highlight: false },
    { label: "Không rõ lý do", count: 2, percentage: "10.00%", highlight: false },
  ]

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #333333",
    marginBottom: "30px",
  }

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#0070c0",
    color: "white",
    padding: "3px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    border: "1px solid #333333",
  }

  const cellStyle: React.CSSProperties = {
    border: "1px solid #333333",
    padding: "2px 10px",
    fontSize: "13px",
  }

  const numberCellStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: "center",
    fontWeight: "500",
  }
   const numberCellStyle1: React.CSSProperties = {
    ...cellStyle,
    textAlign: "right",
    fontWeight: "500",
  }

  const highlightStyle: React.CSSProperties = {
    color: "#d32f2f",
    fontWeight: "500",
}
  const highlightBoldStyle: React.CSSProperties = {
   
    fontWeight: "600",
}
    const bgHighlightStyle: React.CSSProperties = {
    backgroundColor: "#e3f2fd",
  }
const DashboardSalesPage: React.FC = () => {
  const dispatch = useAppDispatch();

  
  const [loading, setLoading] = useState(true)
  const [isLead, setIsLead] = useState(true);
  const storeDashBoardMarketing = useAppSelector((state) => state.dashboard.dashboardMarketingMaster);
  const storeDashBoardMarketingLoading = useAppSelector((state) => state.dashboard.isLoadingDashboardMarketing);
  const storeADSMarketing = useAppSelector((state) => state.dashboard.AdsAMarketingMaster);
  const storeADSMarketingLoading = useAppSelector((state) => state.dashboard.isLoadingAdsAMarketing);
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");
   const [selectedPackage, setSelectedPackage] = useState("Gói A") // Khởi tạo Gói A là được chọn

  const getButtonStyle = (packageName: string) => ({
    backgroundColor: selectedPackage === packageName ? "#146eb4" : "#1890ff", // Màu đậm hơn khi được chọn
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    whiteSpace: "nowrap",
  })
  const storageCategories = localStorage.getItem("categories");
  const storageCSKH = localStorage.getItem("listCSKH");
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");
  const storestepsprocesslead = localStorage.getItem("stepsprocesslead");
  const storeListUser = localStorage.getItem("list_users");
  const storageEmployeeTeams = localStorage.getItem('employeeTeams');
  const storageCampaignCriteria = localStorage.getItem('campaign_criteria');
  const storageADSAccount = localStorage.getItem('ads_accounts');
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
      const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
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
  const [listADSAccount, setListADSAccount] = useState<DropdownData[]>(storageADSAccount ? JSON.parse(storageADSAccount  || '') : undefined as any);
   const [listCampaignCriteria, setListCampaignCriteria] = useState<[]>(storageCampaignCriteria ? JSON.parse(storageCampaignCriteria || '') : undefined as any);
  const [stepsprocesslead, setStepsprocesslead] = useState<any[]>(
    storestepsprocesslead ? JSON.parse(storestepsprocesslead) : []
  );
  const [listTouchPointLogType, setListTouchPointLogType] = useState<any[]>(
    storageTouchPointLogType ? JSON.parse(storageTouchPointLogType) : []
  );
  const [listCategories, setListCategories] = useState<any[]>(
    storageCategories ? JSON.parse(storageCategories) : []
  );

  const listNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteLog
  );
  const LoainglistNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.loadingNoteLog
  );
  const [listNode, setListNode] = useState(listNotesCustomer);
    const initialSelectedCriteriaIdsData: InitialSelectedCriteria = {
    criteria_ids: [
    
    ],
    type_campaign: "fb_ads_nsdd",
  }


  const params = new URLSearchParams(window.location.search);

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenADS, setIsOpenADS] = useState(true);
const [stateEmployeeId, setStateEmployeeId] = useState<any>(() => {
  try {
    return employeeId ? JSON.parse(employeeId) : "";
  } catch {
    return employeeId || "";
  }
});
   const shouldHighlightRed = (label: string) => {
    return label === "Đặt hẹn thất bại" || label === "Tổng đặt hẹn thất bại"
  }
  const shouldHighlightBold = (label: string) => {
    return label === "Tổng Inbox" || label === "Inbox Ẩn (chất lượng)" || label === "Đặt hẹn thành công"|| label === "Tổng đặt hẹn thất bại"
  }
  const shouldHighlightBackground = (label: string) => {
    return label === "Inbox Ẩn (chất lượng)" || label === "Đặt hẹn thành công"
  }
  const [data, setData] = useState<DashboardMarketingResponse>(storeDashBoardMarketing)
    const [dataADS, setDataADS] = useState<any>(storeADSMarketing)
   const [listCampaigns,setListCampaigns] = useState<any[]>([]);
const [filterData, setFilterData] = useState({
  from_date: moment().startOf('month').format('YYYY-MM-DDT00:00:00'),
  to_date: moment().endOf('day').format('YYYY-MM-DDT23:59:59'),
ads_account_id: "1397809990832418",
  campaign_ids:null as string[] | null, // 👈 cách ngắn gọn
  ad_ids: null as string[] | null, // 👈 cách ngắn gọn
});

const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [hiddenKpis, setHiddenKpis] = useState<Set<keyof DataReport>>(new Set())
 
  const [loadingPage, setLoadingPage] = useState(false)
 const statisticHeader = useMemo(
   () => (
    <HeaderNew title='Dashboard Sales'/>
   ),
   [stateBreakPoint, filterData]
   
  );
   const statisticBody = useMemo(
   () => (
   <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      {/* First Table - Potential Customer Statistics */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle} colSpan={3}>
              THỐNG KÊ KHÁCH HÀNG TIỀM NĂNG - TỪ {moment(filterData.from_date).format("DD-MM-YYYY")} ĐẾN {moment(filterData.to_date).format("DD-MM-YYYY")}
            </th>
          </tr>
        </thead>
        <tbody>
          {potentialCustomerData.map((row, index) => (
            <tr key={index}>
              <td
                style={{
                  width: 300,
                  ...cellStyle,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                    ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.label}
              </td>
              <td
                style={{
                    width: 80,
                  ...numberCellStyle,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                      ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.count}
              </td>
              <td
                style={{
                  ...numberCellStyle1,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                  ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.percentage || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Second Table - Failed Appointment Barriers */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle} colSpan={3}>
              THỐNG KÊ RÀO CẢN ĐẶT HẸN THẤT BẠI - TỪ {moment(filterData.from_date).format("DD-MM-YYYY")} ĐẾN {moment(filterData.to_date).format("DD-MM-YYYY")}
            </th>
          </tr>
        </thead>
        <tbody>
          {failedAppointmentData.map((row, index) => (
            <tr key={index}>
              <td
                style={{
                   width: 300,
                  ...cellStyle,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                      ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.label}
              </td>
              <td
                style={{
                    width: 80,
                  ...numberCellStyle,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                      ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.count}
              </td>
              <td
                style={{
                  ...numberCellStyle1,
                  ...(shouldHighlightRed(row.label) ? highlightStyle : {}),
                      ...(shouldHighlightBold(row.label) ? highlightBoldStyle : {}),
                  ...(shouldHighlightBackground(row.label) ? bgHighlightStyle : {}),
                }}
              >
                {row.percentage || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   ),
   [stateBreakPoint, filterData]
   
 );
  return (
    <div className="p-apointment_list">
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
      <PublicLayout widthScreen={stateBreakPoint}>
        <div className="p-apointment_list_schedule">
         
            <>
                                  {/* <div className="p-apointment_list_statistic">
                             {statisticHeader}
                             </div>  */}
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
                                       isClearFilter={storeDashBoardMarketingLoading}
                                       handleGetTypeSearch={() => { }}
                                       handleCleanFilter={() => {
                                       
                                        
                                         
                               }}
               
           
                                       tabBottom={(
                                         <div className='p-after_examination_filter' style={{gap: 30, alignItems:"center"}}>
                                           <div style={{ display: "flex", flexDirection: "row", justifyContent:"center",alignItems:"center",gap: 16 }}>
                                                                                     {/* Radio chọn kiểu filter */}
                                                                                     <div>Ngày thống kê: </div>
                                               {/* <Radio.Group
                                                  value={filterType}
                                                  onChange={(e) => setFilterType(e.target.value)}
                                                >
                                                  <Radio value="day">Theo ngày</Radio>
                                               <Radio value="week">Tuần</Radio> 
                                                  <Radio value="month">Theo tháng</Radio>
                                               
                                                </Radio.Group> */}
                                          
                                                {/* Render component filter theo radio */}
                                                {filterType === "day" && (
                                                  // <RangeDate
                                                  //   variant="simple"
                                                  //   value={{ from: filterData.date_from, to: filterData.date_to }}
                                                  //   defaultValue={{ from: filterData.date_from, to: filterData.date_to }}
                                                  //   handleOnChange={(from: any, to: any) => handleUpdate(from, to)}
                                                  // />
                                                  <div > <div style={{ display: 'flex', gap: '8px', alignItems: 'center',padding:5, borderRadius: 5 }}> 
                                           <RangeDate
                                   variant='simple'
                                   value={{
                                     from: filterData?.from_date,
                                     to: filterData?.to_date
                                   }}
                                   defaultValue={{
                                     from: filterData?.from_date,
                                     to: filterData?.to_date,
                                   }}
                                                 handleOnChange={(from: any, to: any) => {
                                     setFilterData({ ...filterData, from_date:  moment(from).format('YYYY-MM-DDT00:00:00'), to_date: moment(to).format('YYYY-MM-DDT23:59:59'), });
                                   }}
                       />
                                                    </div> </div>
                                                )}
                                          
                                                {filterType === "week" && (
                                                  <WeekSelector
                                               onChange={(from: any, to: any, weekNumber: any) => {
                              setFilterData({ ...filterData, from_date:  moment(from).format('YYYY-MM-DDT00:00:00'), to_date: moment(to).format('YYYY-MM-DDT23:59:59'), });
    // Ví dụ gửi API:
    // dispatch(fetchReport({ from_date: from, to_date: to }))
  }}
/>
                                                )}
                                          
                                                {filterType === "month" && (
                                                <MonthSelector
  onChange={(from, to, month, year) => { 
        setFilterData({ ...filterData, from_date:  moment(from).format('YYYY-MM-DDT00:00:00'), to_date: moment(to).format('YYYY-MM-DDT23:59:59'), });
    // Gọi API hoặc cập nhật dashboard
  }}
                                             />
                                                )}
                                          
                                                {/* {filterType === "year" && (
                                                  <YearSelector
                                                    onChange={(from, to) => handleUpdate(from, to)}
                                                  />
                                                )} */}
                                              </div>
                                          
                        
             
                                         </div>
                                       )}
                                    
                  tabBottomRight={
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      
                       
                                         </div>
                                       }
                                     />
                        
                                   
               {statisticBody}
    
            </>
        
        </div>
          
     
      </PublicLayout>
  
         
     
       </Spin>
    </div>
  );
};

export default DashboardSalesPage;