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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const DashboardMarketingPage: React.FC = () => {
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

  console.log(data?.data?.data_reports?.length === 0)
const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [hiddenKpis, setHiddenKpis] = useState<Set<keyof DataReport>>(new Set())
  useEffect(() => { 
    setDataADS(storeADSMarketing);
  //  setListCampaigns(storeADSMarketing.data[0]?.campaigns);
  }, [storeADSMarketing]);
const kpiConfigs: KPIConfig[] = [
  {
    key: "dau_tu",
    name: "Đầu tư",
    unit: "VND",
  },
  {
    key: "gia_tren_tin_nhan",
    name: "Giá / tin nhắn",
    unit: "VND",
  },
  {
    key: "tong_tin_nhan",
    name: "Tổng tin nhắn",
    unit: "SL",
  },
  {
    key: "ti_le_tin_nhan_chat_luong",
    name: "Tỉ lệ tin nhắn chất lượng",
    unit: "%",
    isPercentage: true,
  },
  {
    key: "tin_nhan_chat_luong",
    name: "Tin nhắn chất lượng",
    unit: "SL",
  },
  {
    key: "ti_le_dat_hen_tren_tin_nhan_chat_luong",
    name: "Tỉ lệ đặt hẹn / tin nhắn chất lượng",
    unit: "%",
    isPercentage: true,
  },
  {
    key: "so_luong_dat_hen",
    name: "Số lượng đặt hẹn",
    unit: "SL",
  },
  {
    key: "ti_le_den_tren_sl_dat_hen", // lưu ý key này phải khớp với backend mapping
    name: "Tỉ lệ đến / đặt hẹn",
    unit: "%",
    isPercentage: true,
  },
  {
    key: "so_luong_khach_hang_den_kham",
    name: "Số lượng khách hàng đến khám",
    unit: "SL",
  },
  {
    key: "ti_le_hoan_thanh_tren_so_luong_den",
    name: "Tỉ lệ hoàn thành / đến",
    unit: "%",
    isPercentage: true,
  },
  {
    key: "so_luot_hoan_thanh_kham",
    name: "Số hoàn thành khám",
    unit: "SL",
  },
  {
    key: "doanh_thu_du_kien",
    name: "Doanh thu dự kiến",
    unit: "VND",
  },
   {
    key: "cpm",
    name: "CPM",
    unit: "VND",
  },
  {
    key: "doanh_thu_thuc_te_trong_ngay",
    name: "Doanh thu thực tế trong ngày",
    unit: "VND",
  },
   {
    key: "inbox_am",
    name: "Ấm (inbox chất lượng)",
    unit: "SL",
  },
    {
    key: "inbox_sdt",
    name: "SĐT",
    unit: "SL",
  },
    {
    key: "inbox_nong",
    name: "Inbox nóng",
    unit: "SL",
  },
  {
    key: "ti_le_hoan_thanh_kham_tren_sl_tin_nhan",
    name: "Tỉ lệ hoàn thành khám / tin nhắn",
    unit: "%",
    isPercentage: true,
  },
  {
    key: "gia_tri_kham_trung_binh_thuc_te",
    name: "Giá trị khám trung bình thực tế",
    unit: "VND",
    isAverage: true,
  },
  {
    key: "dau_tu_tren_1_kh_thuc_te_den",
    name: "Đầu tư trên / 1 KH thực tế đến",
    unit: "VND",
    isAverage: true,
  },
   {
    key: "ti_le_inbox_nong_tren_lead",
    name: "Tỉ lệ inbox nóng/lead",
     unit: "%",
       isPercentage: true,
  },
];
  useEffect(() => {
    dispatch(postAdsAMarketingMasterMarketingMaster())
  },[])

  const filteredData = useMemo(() => {
    const startMoment = moment(filterData.from_date).startOf("day")
    const endMoment = moment(filterData.to_date).endOf("day") // Bao gồm toàn bộ ngày cuối cùng

    return data?.data?.data_reports?.filter((report) => {
      const reportMoment = moment(report.date)
      return reportMoment.isSameOrAfter(startMoment) && reportMoment.isSameOrBefore(endMoment)
    })
  }, [data, filterData.from_date, filterData.to_date,data?.data?.data_reports]) // Thêm fromDate và toDate vào dependency array
    // Nhóm dữ liệu theo tuần
   const weeklyData = useMemo(() => {
    const weeks: { [key: number]: DataReport[] } = {}
    const startDateMoment = moment(filterData.from_date).startOf("day") // Sử dụng fromDate để tính tuần

    filteredData?.forEach((report) => {
      const reportMoment = moment(report.date)
      // Tính số ngày chênh lệch từ ngày bắt đầu (fromDate)
      const daysDiff = reportMoment.diff(startDateMoment, "days")
      // Tính số tuần, ngày đầu tiên sẽ là tuần 1 (daysDiff = 0 -> weekNumber = 1)
      const weekNumber = Math.floor(daysDiff / 7) + 1

      if (!weeks[weekNumber]) {
        weeks[weekNumber] = []
      }
      weeks[weekNumber].push(report)
    })
    return weeks
   }, [filteredData, filterData.from_date]) // Thêm fromDate vào dependency array
  const tagStatisticsWeeklyMap = useMemo(() => {
  const map: { [key: number]: TagStatisticsByPage[] } = {};
  const startDateMoment = moment(filterData.from_date).startOf("day");

  data?.data?.tag_statistics_by_ad?.forEach((entry) => {
    const date = moment(entry.date);
    const daysDiff = date.diff(startDateMoment, "days");
    const weekNumber = Math.floor(daysDiff / 7) + 1;

    if (!map[weekNumber]) map[weekNumber] = [];
    map[weekNumber].push(entry);
  });

  return map;
  }, [data?.data?.tag_statistics_by_ad, filterData.from_date]);
    const RevenueEntryWeeklyMap = useMemo(() => {
  const map: { [key: number]: RevenueFromErp[] } = {};
  const startDateMoment = moment(filterData.from_date).startOf("day");

  data?.data?.revenue_from_erp?.forEach((entry) => {
    const date = moment(entry.day);
    const daysDiff = date.diff(startDateMoment, "days");
    const weekNumber = Math.floor(daysDiff / 7) + 1;

    if (!map[weekNumber]) map[weekNumber] = [];
    map[weekNumber].push(entry);
  });

  return map;
}, [data?.data?.revenue_from_erp, filterData.from_date]);

  useEffect(() => {
    setLoadingPage(false)
  setData(storeDashBoardMarketing);
  if (storeDashBoardMarketing?.data?.targets) {
    const initialHiddenKpis = new Set<keyof DataReport>();
    storeDashBoardMarketing.data.targets.forEach((target: any) => {
      // Giả định target có thuộc tính 'id' tương ứng với 'key' trong kpiConfigs
      if (!target.is_show) {
        initialHiddenKpis.add(target.id as keyof DataReport);
      }
    });
    setHiddenKpis(initialHiddenKpis);
  }
  }, [storeDashBoardMarketing]);
  const isSpecialKPI = (key: string) =>
  key === "inbox_am" || key === "inbox_sdt" || key === "inbox_nong";
    const isSpecialKPIReve = (key: string) =>
  key === "doanh_thu_thuc_te_trong_ngay" || key === "doanh_thu_du_kien";
    const { mutate: postHideShow } = useMutation(
        'post-footer-form',
        (data: any) => postHideShowCrtDashboardMarketingAPI(data),
        {
          onSuccess: (data) => {
          dispatch(postDashBoardMarketingMaster({ ads_account_id:filterData.ads_account_id,from_date: filterData.from_date, to_date:filterData.to_date, } as unknown as any));

           setIsModalOpen(false)
          },
          onError: (error:any) => {
            console.error('🚀: error --> getCustomerByCustomerId:', error);
          },
        },
      );
  const handleConfirmSelection = (selectedIds: string[]) => {
    const body = {
      criteria_ids: selectedIds,
      type_campaign: "fb_ads_nsdd"
    }
    postHideShow(body)
  }
  // Tính toán dữ liệu tổng hợp theo tuần
const aggregatedWeeklyData = useMemo(() => {
  const result: { [key: number]: { [key: string]: number } } = {};

  Object.keys(weeklyData).forEach((weekStr) => {
    const week = Number(weekStr);
    const weekReports = weeklyData[week];
    const tagStats = tagStatisticsWeeklyMap[week] || [];
    const reStats = RevenueEntryWeeklyMap[week] || [];
    result[week] = {};

    // Tính trước giá trị inbox_am để dùng cho ti_le_tin_nhan_chat_luong
    const inboxAmTotal = tagStats.reduce((sum, entry) => sum + (entry?.tag_inbox_warm || 0), 0);
    const inboxNongTotal = tagStats.reduce((sum, entry) => sum + (entry?.tag_inbox_hot || 0), 0);
    const tongTinNhanTotal = weekReports.reduce((sum, r) => sum + ((r as any)["tong_tin_nhan"] || 0), 0);

    kpiConfigs.forEach((config) => {
      const key = config.key as string;

      // ✅ KPI đặc biệt: inbox_am, inbox_nong, inbox_sdt
      if (isSpecialKPI(key)) {
        let statKey = '';
        if (key === 'inbox_am') statKey = 'tag_inbox_warm';
        if (key === 'inbox_nong') statKey = 'tag_inbox_hot';
        if (key === 'inbox_sdt') statKey = 'tag_leave_phone_number';

        const total = tagStats.reduce((sum, entry) => sum + (entry?.[statKey] || 0), 0);
        result[week][key] = total;
        return;
      }
       if (isSpecialKPIReve(key)) {
        let statKey = '';
        if (key === 'doanh_thu_thuc_te_trong_ngay') statKey = 'real_total';
        if (key === 'doanh_thu_du_kien') statKey = 'expected_total';

        const total = reStats.reduce((sum, entry) => sum + (entry?.[statKey] || 0), 0);
        result[week][key] = total;
        return;
      }
      // ✅ KPI: ti_le_tin_nhan_chat_luong = inbox_am / tong_tin_nhan
      if (key === "ti_le_tin_nhan_chat_luong") {
        result[week][key] = (inboxAmTotal / (tongTinNhanTotal || 1)) * 100;
        return;
      }
       // ✅ KPI: ti_le_inbox_nong_tren_lead = inbox_nong / tong_tin_nhan
      if (key === "ti_le_inbox_nong_tren_lead") {
        result[week][key] = (inboxNongTotal / (tongTinNhanTotal || 1)) * 100;
        return;
      }
      // ✅ KPI: gia_tren_tin_nhan = dau_tu / tong_tin_nhan
      if (key === "gia_tren_tin_nhan") {
        const dauTu = weekReports.reduce((sum, r) => sum + ((r as any)["dau_tu"] || 0), 0);
        result[week][key] = dauTu / (tongTinNhanTotal || 1);
        return;
      }

      // ✅ KPI trung bình
      if (config.isPercentage || config.isAverage) {
        const sum = weekReports.reduce((acc, report) => acc + ((report as any)[key] || 0), 0);
        result[week][key] = sum / weekReports.length;
        return;
      }

      // ✅ KPI cộng dồn
      result[week][key] = weekReports.reduce((acc, report) => acc + ((report as any)[key] || 0), 0);
    });
  });

  return result;
}, [weeklyData, tagStatisticsWeeklyMap, RevenueEntryWeeklyMap,kpiConfigs]);

   // Tính tổng 30 ngày và trung bình ngày
const monthlyTotals = useMemo(() => {
  const result: Record<string, number> = {};
  const dailyAverages: Record<string, number> = {};
  const totals: Record<string, number> = {};
  const totalDays = filteredData?.length || 1;

  // Cộng dồn từ filteredData (các KPI bình thường)
  filteredData?.forEach((report) => {
    Object.keys(report).forEach((key) => {
      const value = (report as any)[key] as number;
      totals[key] = (totals[key] || 0) + value;
    });
  });

  // Cộng dồn từ tag_statistics_by_ad cho các KPI đặc biệt
  const tagStatsTotals: Record<string, number> = {};
  data?.data?.tag_statistics_by_ad?.forEach((entry) => {
    tagStatsTotals["inbox_am"] = (tagStatsTotals["inbox_am"] || 0) + (entry.tag_inbox_warm || 0);
    tagStatsTotals["inbox_nong"] = (tagStatsTotals["inbox_nong"] || 0) + (entry.tag_inbox_hot || 0);
    tagStatsTotals["inbox_sdt"] = (tagStatsTotals["inbox_sdt"] || 0) + (entry.tag_leave_phone_number || 0);
  });
   const reStatsTotals: Record<string, number> = {};
  data?.data?.revenue_from_erp?.forEach((entry) => {
    reStatsTotals["doanh_thu_thuc_te_trong_ngay"] = (reStatsTotals["doanh_thu_thuc_te_trong_ngay"] || 0) + (entry.real_total || 0);
    reStatsTotals["doanh_thu_du_kien"] = (reStatsTotals["doanh_thu_du_kien"] || 0) + (entry.expected_total || 0);
  });
  // Xử lý từng KPI
  kpiConfigs.forEach((config: any) => {
    const key = config.key as string;

    if (isSpecialKPI(key)) {
      result[key] = tagStatsTotals[key] || 0;
      dailyAverages[key] = result[key] / totalDays;
      return;
    }
      if (isSpecialKPIReve(key)) {
      result[key] = reStatsTotals[key] || 0;
      dailyAverages[key] = result[key] / totalDays;
      return;
    }
    // KPI thường
    switch (key) {
      case "gia_tren_tin_nhan":
        result[key] = totals["dau_tu"] / (totals["tong_tin_nhan"] || 1);
        break;
     case "ti_le_tin_nhan_chat_luong":
  result[key] = ((tagStatsTotals["inbox_am"] || 0) / (totals["tong_tin_nhan"] || 1)) * 100;
  break;
 case "ti_le_inbox_nong_tren_lead":
  result[key] = ((tagStatsTotals["inbox_nong"] || 0) / (totals["tong_tin_nhan"] || 1)) * 100;
  break;
      case "ti_le_dat_hen_tren_tin_nhan_chat_luong":
        result[key] = (totals["so_luong_dat_hen"] / (totals["tin_nhan_chat_luong"] || 1)) * 100;
        break;
      case "ti_le_den_tren_sl_dat_hen":
        result[key] = (totals["so_luong_khach_hang_den_kham"] / (totals["so_luong_dat_hen"] || 1)) * 100;
        break;
      case "ti_le_hoan_thanh_tren_so_luong_den":
        result[key] = (totals["so_luot_hoan_thanh_kham"] / (totals["so_luong_khach_hang_den_kham"] || 1)) * 100;
        break;
      case "ti_le_hoan_thanh_kham_tren_sl_tin_nhan":
        result[key] = (totals["so_luot_hoan_thanh_kham"] / (totals["tong_tin_nhan"] || 1)) * 100;
        break;
      case "gia_tri_kham_trung_binh_thuc_te":
        result[key] = totals["doanh_thu_thuc_te_trong_ngay"] / (totals["so_luot_hoan_thanh_kham"] || 1);
        break;
      case "dau_tu_tren_1_kh_thuc_te_den":
        result[key] = totals["dau_tu"] / (totals["so_luong_khach_hang_den_kham"] || 1);
        break;
      default:
        if (!config.isPercentage && !config.isAverage) {
          result[key] = totals[key] || 0;
        } else {
          result[key] = (totals[key] || 0) / totalDays;
        }
        break;
    }

    dailyAverages[key] = result[key] / totalDays;
  });

  return { monthly: result, daily: dailyAverages };
}, [filteredData, kpiConfigs, data?.data?.tag_statistics_by_ad,data?.data?.revenue_from_erp]);
 
 
  
//   const monthlyTotals = useMemo(() => {
//   const result: { [key: string]: number } = {};
//   const dailyAverages: { [key: string]: number } = {};

//   const totals: { [key: string]: number } = {};
//   const totalDays = filteredData?.length || 1;

//   // Tính tổng từng trường trước
//   filteredData?.forEach((report) => {
//     Object.keys(report).forEach((key) => {
// const value = (report as any)[key] as number;
//       totals[key] = (totals[key] || 0) + value;
//     });
//   });

//   kpiConfigs.forEach((config) => {
//     const key = config.key;

//     // Các chỉ số tính từ công thức
//     switch (key) {
//       case "gia_tren_tin_nhan":
//         result[key] = totals["dau_tu"] / (totals["tong_tin_nhan"] || 1);
//         break;

//       case "ti_le_tin_nhan_chat_luong":
//         result[key] = (totals["tin_nhan_chat_luong"] / (totals["tong_tin_nhan"] || 1)) * 100;
//         break;

//       case "ti_le_dat_hen_tren_tin_nhan_chat_luong":
//         result[key] = (totals["so_luong_dat_hen"] / (totals["tin_nhan_chat_luong"] || 1)) * 100;
//         break;

//       case "ti_le_den_tren_sl_dat_hen":
//         result[key] = (totals["so_luong_khach_hang_den_kham"] / (totals["so_luong_dat_hen"] || 1)) * 100;
//         break;

//       case "ti_le_hoan_thanh_tren_so_luong_den":
//         result[key] = (totals["so_luot_hoan_thanh_kham"] / (totals["so_luong_khach_hang_den_kham"] || 1)) * 100;
//         break;

//       case "ti_le_hoan_thanh_kham_tren_sl_tin_nhan":
//         result[key] = (totals["so_luot_hoan_thanh_kham"] / (totals["tong_tin_nhan"] || 1)) * 100;
//         break;

//       case "gia_tri_kham_trung_binh_thuc_te":
//         result[key] = totals["doanh_thu_thuc_te_trong_ngay"] / (totals["so_luot_hoan_thanh_kham"] || 1);
//         break;

//       case "dau_tu_tren_1_kh_thuc_te_den":
//         result[key] = totals["dau_tu"] / (totals["so_luong_khach_hang_den_kham"] || 1);

//         break;

//       default:
//         // Nếu không phải % hoặc average thì cộng tổng
//         if (!config.isPercentage && !config.isAverage) {
//           result[key] = totals[key] || 0;
//         } else {
//           // Nếu là tỷ lệ hoặc giá trị trung bình không nằm trong switch đặc biệt thì chia trung bình theo ngày
//           result[key] = (totals[key] || 0) / totalDays;
//         }
//         break;
//     }

//     // Daily average (để hiển thị nếu cần)
//     dailyAverages[key] = result[key] / totalDays;
//   });
//   console.log(result)
//   return { monthly: result, daily: dailyAverages };
// }, [filteredData, kpiConfigs]);
      const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [dataAddC, setDataAddC] = useState({
    openModal: false,
    campaign_id: "",
    ads_account_id: dataADS.data[0]?.value,
    campaign_name: "",
    objective: "LEAD_GENERATION"
  });
  const [loadingAddC, setLoadingAddC] = useState(false);
  const formatValue = (value: number | undefined | null, unit: string, isPercentage?: boolean): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "-"; // hoặc "0", tuỳ nhu cầu hiển thị
  }

  if (isPercentage) {
    return `${value.toFixed(2)}%`;
  }

  if (unit === "VND") {
    return new Intl.NumberFormat("vi-VN").format(value);
  }

  return value.toFixed(0);
};


  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  const handleWeekClick = (weekNumber: number) => {
    setExpandedWeek(expandedWeek === weekNumber ? null : weekNumber)
  }

  // Hàm để ẩn/hiện KPI
  const toggleKpiVisibility = useCallback((kpiKey: keyof DataReport) => {
    setHiddenKpis((prevHiddenKpis) => {
      const newHiddenKpis = new Set(prevHiddenKpis)
      if (newHiddenKpis.has(kpiKey)) {
        newHiddenKpis.delete(kpiKey)
      } else {
        newHiddenKpis.add(kpiKey)
      }
      return newHiddenKpis
    })
  }, [])

  // Hàm để hiện tất cả KPI
 const showAllKpis = useCallback(() => {
  if (data?.data?.targets) {
    const initialHiddenKpis = new Set<keyof DataReport>();
    data.data.targets.forEach((target: any) => {
      if (!target.is_show) {
        initialHiddenKpis.add(target.id as keyof DataReport);
      }
    });
    setHiddenKpis(initialHiddenKpis);
  } else {
    setHiddenKpis(new Set()); // Nếu không có targets, hiện tất cả
  }
}, [data?.data?.targets])
    const [tableLoading, setTableLoading] = useState(false);



   const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
  }

  const headerStyle: React.CSSProperties = {
    // backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "right",
    fontWeight: "bold",
    position: "sticky",
    top: 0,
    zIndex: 10,
    minWidth: "120px",
     backgroundColor: "#e3f2fd",
    color: "#1976d2",
  }

  const cellStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "6px 8px",
    textAlign: "right",
  }
    const cellStyleD: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "6px 8px",
    textAlign: "right",
    backgroundColor: "#fff3e0",
  }
  const kpiNameStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: "left",
    backgroundColor: "#fafafa",
    fontWeight: "bold",
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const weekHeaderStyle: React.CSSProperties = {
    ...headerStyle,
    cursor: "pointer",
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    minWidth: "100px",
  }

  const dayHeaderStyle: React.CSSProperties = {
    ...headerStyle,
    backgroundColor: "rgb(249 228 195)",
    color: "#f57c00",
    minWidth: "100px",
  }

  const toggleIconStyle: React.CSSProperties = {
    cursor: "pointer",
    marginLeft: "8px",
    display: "flex",
    alignItems: "center",
  }

  const showAllButtonStyle: React.CSSProperties = {
    backgroundColor: "#4CAF50", // Green color
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "10px",
    display: hiddenKpis.size > 0 ? "inline-block" : "none", // Only show if there are hidden KPIs
  }
  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    document.title = "Dashboard Marketing | CRM";
  }, []);
  useEffect(() => {

    dispatch(
      postDashBoardMarketingMaster({
        from_date: moment(filterData.from_date).format("YYYY-MM-DD 00:00:00"),
        to_date: moment(filterData.to_date).format("YYYY-MM-DD 23:59:59"),
        ads_account_id: filterData.ads_account_id,
      })
    )
  }, []);
  useEffect(() => {

   setData(storeDashBoardMarketing)
  }, [storeDashBoardMarketing]);
  // const allData = [...data.data.doctor_check, ...data.data.bscd, ...data.data.ttns]


    const { mutate: postAddCamp } = useMutation(
        "post-footer-form",
        (data: any) => postAddCampaignDashboardMarketingAPI(data),
        {
          onSuccess: (data) => {
            if (data.status) {
              dispatch(postAdsAMarketingMasterMarketingMaster())
              setDataAddC({
                ...dataAddC, openModal: false, campaign_id: "", campaign_name: "", objective: "LEAD_GENERATION",
              })
              setLoadingAddC(false);
            } else {
              toast.error(data.message || "Thêm chiến dịch thất bại");
              setLoadingAddC(false);
            }
          },
          onError: (error) => {
            console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
          },
        }
      );
  const handlePostAddCamp = () => {
        setLoadingAddC(true);
        const body = {
          campaign_id: dataAddC.campaign_id,
          objective: dataAddC.objective,
          campaign_name: dataAddC.campaign_name
          , ads_account_id: dataAddC.ads_account_id,
        }
        postAddCamp(body);
      }
const statisticHeader = useMemo(
  () => (
   <HeaderNew title='Dashboard thống kê Marketing'/>
  ),
  [stateBreakPoint, filterData]
);

   const [selectedAdsAccounts, setSelectedAdsAccounts] = useState<string[]>([])
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])

  // Dropdown 1: Ads Accounts
  const adsAccountOptions: SelectOption[] = useMemo(() => {
    return dataADS.data.map((account:any) => ({
      value: account.ads_account_id,
      label: account.ads_account_name,
      is_use: account.is_use,
    }))
  }, [dataADS])
  // Dropdown 2: Campaigns (phụ thuộc vào Ads Accounts đã chọn)
 const campaignOptions: SelectOption[] = useMemo(() => {
  if (!selectedAdsAccounts.length || !dataADS?.data) return []

  const campaigns: Campaign[] = []
  selectedAdsAccounts.forEach((accountId) => {
    const account = dataADS.data.find((acc: any) => acc.ads_account_id === accountId && acc.is_use)
    
    if (account?.campaigns?.length) {
      campaigns.push(...account.campaigns)
    }
  })

  const uniqueCampaigns = Array.from(new Map(campaigns.map((c) => [c.campaign_id, c])).values())

  return uniqueCampaigns.map((campaign) => ({
    value: campaign.campaign_id,
    label: campaign.campaign_name,
  }))
}, [selectedAdsAccounts, dataADS])

  const cleanedCampaignOptions = campaignOptions.map(item => ({
  ...item,
  label: cleanLabel(item.label),
}));
  // Dropdown 3: Statuses (phụ thuộc vào Campaigns đã chọn)
const statusOptions = useMemo(() => {
  const adsetNames = new Set<string>();

  selectedCampaigns.forEach((campaignId) => {
    dataADS?.data?.forEach((account: any) => {
      const campaign = account.campaigns.find((c: any) => c.campaign_id === campaignId);

      campaign?.adsets?.forEach((adset: any) => {
        adsetNames.add(adset.adset_name); // hoặc adset.adset_id nếu dùng ID
      });
    });
  });

  return Array.from(adsetNames).map((name) => ({
    value: name,
    label: name,
  }));
}, [selectedCampaigns, dataADS]);



    const cleanedAssetOptions = statusOptions.map(item => ({
  ...item,
  label: cleanLabel(item.label),
}));
  // Dropdown 4: Objectives (phụ thuộc vào Statuses đã chọn VÀ Campaigns đã chọn)
const objectiveOptions: SelectOption[] = useMemo(() => {
  if (!selectedCampaigns.length || !selectedStatuses.length || !dataADS?.data) return [];

  // Bước 1: Extract value từ selectedStatuses (phòng trường hợp nó là object { value, label })
  const selectedStatusValues = selectedStatuses.map((s: any) =>
    typeof s === "string" ? s : s.value
  );

  // Bước 2: Duyệt campaigns và lấy ads
  const ads: { ad_id: string; ad_name: string }[] = [];

  selectedCampaigns.forEach((campaignId) => {
    dataADS.data.forEach((account: any) => {
      const campaign = account.campaigns.find((c: any) => {
        console.log("🚀 ~ file: index.tsx:1002 ~ campaign:", c)
        return (
          c.campaign_id === campaignId 
        );
      });

      if (campaign?.adsets?.length) {
        campaign.adsets.forEach((adset: any) => {
          adset.ads?.forEach((ad: any) => {
            if (ad?.ad_id && ad?.ad_name) {
              ads.push({
                ad_id: ad.ad_id,
                ad_name: ad.ad_name,
              });
            }
          });
        });
      }
    });
  });

  // Bước 3: Loại trùng ads theo ad_id
  const uniqueAds = Array.from(new Map(ads.map((ad) => [ad.ad_id, ad])).values());

  // Bước 4: Trả về dropdown format
  return uniqueAds.map((ad) => ({
    value: ad.ad_id,
    label: ad.ad_name,
  }));
}, [selectedCampaigns, selectedStatuses, dataADS]);




console.log("🚀 ~ file: index.tsx:1002 ~ objectiveOptions:", objectiveOptions)

  // Handlers để cập nhật lựa chọn và xóa các dropdown phụ thuộc
  const handleAdsAccountChange = (values: string[]) => {
    setSelectedAdsAccounts(values)
    setSelectedCampaigns([])
    setSelectedStatuses([])
    setSelectedObjectives([])
  }

  const handleCampaignChange = (values: string[]) => {
    setFilterData({
      ...filterData,
      campaign_ids: values.length > 0 ? values : null, // Cập nhật campaign_ids nếu có giá trị
    })
    setSelectedCampaigns(values)
    setSelectedStatuses([])
    setSelectedObjectives([])
  }

  const handleStatusChange = (values: string[]) => {
    setSelectedStatuses(values)
    setSelectedObjectives([])
  }

  const handleObjectiveChange = (values: string[]) => {
    setSelectedObjectives(values)
  }

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
                                       isClearFilter={storeDashBoardMarketingLoading || tableLoading}
                                       handleGetTypeSearch={() => { }}
                                       handleCleanFilter={() => {
                                       
                                        
                                         
                               }}
               
           
                                       tabBottom={(
                                         <div className='p-after_examination_filter' style={{gap: 30, alignItems:"center"}}>
                                           <div style={{ display: "flex", flexDirection: "row", justifyContent:"center",alignItems:"center",gap: 16 }}>
                                                                                     {/* Radio chọn kiểu filter */}
                                                                                     <div>Chọn thống kê theo thời gian: </div>
                                               <Radio.Group
                                                  value={filterType}
                                                  onChange={(e) => setFilterType(e.target.value)}
                                                >
                                                  <Radio value="day">Theo ngày</Radio>
                                               <Radio value="week">Tuần</Radio> 
                                                  <Radio value="month">Theo tháng</Radio>
                                                  {/* <Radio value="year">Theo năm</Radio> */}
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
    console.log(`Tuần ${weekNumber}:`, moment(from).format("YYYY-MM-DD"), '->', moment(to).format("YYYY-MM-DD"))
    // Ví dụ gửi API:
    // dispatch(fetchReport({ from_date: from, to_date: to }))
  }}
/>
                                                )}
                                          
                                                {filterType === "month" && (
                                                <MonthSelector
  onChange={(from, to, month, year) => { 
    console.log(`Từ ${ moment(from).format("YYYY-MM-DD")} đến ${to.toLocaleDateString()}`)
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
                                          
                        
             
                              
                                           <div style={{marginTop:2,display:"flex", alignItems:"end", gap:10}}>
                                           {/* <div style={{ marginBottom: "1.5rem", minWidth: "200px" }}>  
      <label
          htmlFor="adsAccountDropdown"
          style={{
            display: "block", // block
            fontSize: "0.875rem", // text-sm
            fontWeight: "500", // font-medium
            color: "#4a5568", // text-gray-700
            marginBottom: "0.5rem", // mb-2
          }}
        >
          Tài khoản quảng cáo
        </label>
        <AntdMultiSelect
        options={adsAccountOptions.filter(opt => opt.is_use)}
          selectedValues={selectedAdsAccounts}
          onValueChange={handleAdsAccountChange}
          placeholder="Select Ads Accounts..."
        
        />
      </div>

      <div style={{ marginBottom: "1.5rem", minWidth: "200px" }}>
    <label
          htmlFor="campaignDropdown"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#4a5568",
            marginBottom: "0.5rem",
          }}
        >
          Chiến dịch
        </label>
        <AntdMultiSelect
          options={cleanedCampaignOptions}
          selectedValues={selectedCampaigns}
          onValueChange={handleCampaignChange}
          placeholder="Select Campaigns..."
        />
      </div>
                                       
  <div style={{ marginBottom: "1.5rem", minWidth: "200px" ,maxWidth:"200px"}}>
      <label
          htmlFor="statusDropdown"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#4a5568",
            marginBottom: "0.5rem",
          }}
        >
         Nhóm quảng cáo
        </label> 
        <AntdMultiSelect
          options={cleanedAssetOptions}
          selectedValues={selectedStatuses}
          onValueChange={handleStatusChange}
          placeholder="Select Statuses..."
        />
      </div>

     <div style={{ marginBottom: "1.5rem", minWidth: "200px" }}>
     <label
          htmlFor="objectiveDropdown"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#4a5568",
            marginBottom: "0.5rem",
          }}
        >
      Quảng cáo
        </label> 
        <AntdMultiSelect
          options={objectiveOptions}
          selectedValues={selectedObjectives}
          onValueChange={handleObjectiveChange}
          placeholder="Select Objectives..."
        />
                                             </div> */}
                                                   <div style={{display:"flex",alignItems:"center", height:"100%",marginBottom: "0.5rem" ,gap:10}}>
                                               
                                                  <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px",display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}} onClick={() => {
                                               
                                                    setIsOpenADS(!isOpenADS)
                }}
                
                                               >
                                                 <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 256 256" id="Layer_1" version="1.1"  xmlns="http://www.w3.org/2000/svg"  stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M220.6,207.4l-31.6-38.7c14.8-24.3,18.4-53.8,9.8-81.4c-0.8-2.6-3.6-4-6.2-3.2c-2.6,0.8-4.1,3.6-3.2,6.2 c8.1,25.8,4.3,53.4-10.5,75.9l-0.3,0.4c-1,1.8-0.9,4,0.4,5.6l33.9,41.4c0,0,0.5,0.6,0.6,0.6c2.8,3.2,2.8,7.7,0.1,11 c-0.1,0.1-0.1,0.2-0.2,0.2l-0.7,0.7c-3.2,2.7-7.9,2.7-11.2-0.2c-0.2-0.2-0.3-0.3-0.5-0.5l-41.4-33.8c-1.7-1.4-4.1-1.5-5.9-0.3 l-0.4,0.3c-34.9,22.8-81.6,18.2-111.4-11c-0.2-0.3-0.3-0.6-0.5-0.8C6.6,145.2,6.6,88.7,41.3,54C76,19.3,132.5,19.3,167.2,54 c0.2,0.2,0.5,0.4,0.8,0.5c0.1,0.1,0.3,0.3,0.4,0.4c1.7,2.1,4.9,2.4,7,0.6c2.1-1.7,2.4-4.9,0.6-7c-0.4-0.5-1-1.1-1.6-1.7 C135.9,8.4,73.2,8.1,34.4,46.5c-0.1,0.1-0.3,0.2-0.4,0.4C18,62.9,8,84.2,5.7,106.7c-1,9.8-0.5,19.6,1.3,29.1 c3.8,19.5,13.2,37.2,27.3,51.3c32.3,32.2,83,38.1,121.8,14.5l38.4,31.4c0.2,0.2,0.5,0.5,0.7,0.7c3.5,3,7.7,4.4,11.9,4.4 c4.3,0,8.6-1.5,12.1-4.5l1.7-1.6c0.3-0.3,0.5-0.6,0.7-1c5.3-6.9,5.1-16.5-0.6-23.2C220.9,207.7,220.7,207.5,220.6,207.4z"></path> <path d="M249.8,20.9c-1-1.4-2.7-2.2-4.5-2l-32.1,3.4c-1.8,0.2-3.3,1.3-4,2.9c-0.7,1.6-0.5,3.5,0.5,4.9l7.1,9.7L104,121.1 c-1.2,0.8-1.9,2.2-2,3.6l-3,38.5l-48.8-47.7c-1-1-2.4-1.5-3.8-1.4l-14.3,1c-2.7,0.2-4.8,2.5-4.6,5.3c0.2,2.7,2.6,4.8,5.3,4.6 l12.1-0.8l54.8,53.5c0.9,0.9,2.2,1.4,3.5,1.4c0.6,0,1.2-0.1,1.7-0.3c1.8-0.7,3-2.3,3.2-4.2l3.7-46.7l111.1-79.9l6.1,8.4 c0.9,1.3,2.4,2,4,2c0.2,0,0.4,0,0.5,0c1.8-0.2,3.3-1.3,4-2.9l13-29.5C251.1,24.2,250.9,22.4,249.8,20.9z M231.8,43.5l-8.9-12.2 l15-1.6L231.8,43.5z"></path> </g> </g></svg>
                  <div style={{color:"white", marginLeft:5}}>TKQC</div>
            
                                               </div>
                                                 <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px",display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}} onClick={() => {
                                               setLoadingPage(true)
                                                                                      dispatch(postDashBoardMarketingMaster({ ads_account_id:filterData.ads_account_id,from_date: filterData.from_date, to_date: filterData.to_date,campaign_ids: filterData.campaign_ids ,ad_ids:filterData.ad_ids} as unknown as any));

                }}
                
                                               >
                                                 <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.95301 2.25C4.96862 2.25 4.98429 2.25 5.00001 2.25L19.047 2.25C19.7139 2.24997 20.2841 2.24994 20.7398 2.30742C21.2231 2.36839 21.6902 2.50529 22.0738 2.86524C22.4643 3.23154 22.6194 3.68856 22.6875 4.16405C22.7501 4.60084 22.7501 5.14397 22.75 5.76358L22.75 6.54012C22.75 7.02863 22.75 7.45095 22.7136 7.80311C22.6743 8.18206 22.5885 8.5376 22.3825 8.87893C22.1781 9.2177 21.9028 9.4636 21.5854 9.68404C21.2865 9.8917 20.9045 10.1067 20.4553 10.3596L17.5129 12.0159C16.8431 12.393 16.6099 12.5288 16.4542 12.6639C16.0966 12.9744 15.8918 13.3188 15.7956 13.7504C15.7545 13.9349 15.75 14.1672 15.75 14.8729L15.75 17.605C15.7501 18.5062 15.7501 19.2714 15.6574 19.8596C15.5587 20.4851 15.3298 21.0849 14.7298 21.4602C14.1434 21.827 13.4975 21.7933 12.8698 21.6442C12.2653 21.5007 11.5203 21.2094 10.6264 20.8599L10.5395 20.826C10.1208 20.6623 9.75411 20.519 9.46385 20.3691C9.1519 20.208 8.8622 20.0076 8.64055 19.6957C8.41641 19.3803 8.32655 19.042 8.28648 18.6963C8.24994 18.381 8.24997 18.0026 8.25 17.5806L8.25 14.8729C8.25 14.1672 8.24555 13.9349 8.20442 13.7504C8.1082 13.3188 7.90342 12.9744 7.54584 12.6639C7.39014 12.5288 7.15692 12.393 6.48714 12.0159L3.54471 10.3596C3.09549 10.1067 2.71353 9.8917 2.41458 9.68404C2.09724 9.4636 1.82191 9.2177 1.61747 8.87893C1.41148 8.5376 1.32571 8.18206 1.28645 7.80311C1.24996 7.45094 1.24998 7.02863 1.25 6.54012L1.25001 5.81466C1.25001 5.79757 1.25 5.78054 1.25 5.76357C1.24996 5.14396 1.24991 4.60084 1.31251 4.16405C1.38064 3.68856 1.53576 3.23154 1.92618 2.86524C2.30983 2.50529 2.77695 2.36839 3.26024 2.30742C3.71592 2.24994 4.28607 2.24997 4.95301 2.25ZM3.44796 3.79563C3.1143 3.83772 3.0082 3.90691 2.95251 3.95916C2.90359 4.00505 2.83904 4.08585 2.79734 4.37683C2.75181 4.69454 2.75001 5.12868 2.75001 5.81466V6.50448C2.75001 7.03869 2.75093 7.38278 2.77846 7.64854C2.8041 7.89605 2.84813 8.01507 2.90174 8.10391C2.9569 8.19532 3.0485 8.298 3.27034 8.45209C3.50406 8.61444 3.82336 8.79508 4.30993 9.06899L7.22296 10.7088C7.25024 10.7242 7.2771 10.7393 7.30357 10.7542C7.86227 11.0685 8.24278 11.2826 8.5292 11.5312C9.12056 12.0446 9.49997 12.6682 9.66847 13.424C9.75036 13.7913 9.75022 14.2031 9.75002 14.7845C9.75002 14.8135 9.75 14.843 9.75 14.8729V17.5424C9.75 18.0146 9.75117 18.305 9.77651 18.5236C9.79942 18.7213 9.83552 18.7878 9.8633 18.8269C9.89359 18.8695 9.95357 18.9338 10.152 19.0363C10.3644 19.146 10.6571 19.2614 11.1192 19.442C12.0802 19.8177 12.7266 20.0685 13.2164 20.1848C13.695 20.2985 13.8527 20.2396 13.9343 20.1885C14.0023 20.146 14.1073 20.0597 14.1757 19.626C14.2478 19.1686 14.25 18.5234 14.25 17.5424V14.8729C14.25 14.843 14.25 14.8135 14.25 14.7845C14.2498 14.2031 14.2496 13.7913 14.3315 13.424C14.5 12.6682 14.8794 12.0446 15.4708 11.5312C15.7572 11.2826 16.1377 11.0685 16.6964 10.7542C16.7229 10.7393 16.7498 10.7242 16.7771 10.7088L19.6901 9.06899C20.1767 8.79508 20.496 8.61444 20.7297 8.45209C20.9515 8.298 21.0431 8.19532 21.0983 8.10391C21.1519 8.01507 21.1959 7.89605 21.2215 7.64854C21.2491 7.38278 21.25 7.03869 21.25 6.50448V5.81466C21.25 5.12868 21.2482 4.69454 21.2027 4.37683C21.161 4.08585 21.0964 4.00505 21.0475 3.95916C20.9918 3.90691 20.8857 3.83772 20.5521 3.79563C20.2015 3.75141 19.727 3.75 19 3.75H5.00001C4.27297 3.75 3.79854 3.75141 3.44796 3.79563Z" fill="#ffffff"></path> </g></svg>
                  <div style={{color:"white", marginLeft:5 }}>Lọc</div>
            
                                               </div>
          </div>
{/* 
                                         <Dropdown4
                                            dropdownOption={[...dataADS.data]}
                                            variant="simple"
                                            isColor
                                            placeholder="-- Chọn ADS ID --"
                                            values={dataADS.data.find((item:any) => item.value === filterData.ads_account_id)} // chỉ truyền đúng object dropdown
                                               handleSelect={(item: any) => {
                                                 console.log(item.campaigns)
                                                 setDataAddC({
                                                   ...dataAddC,
                                                   ads_account_id: item.value,
                                                 });
                                              setListCampaigns(item.campaigns || []);
                                              setFilterData(prev => ({
                                                ...prev,
                                                ads_account_id: item.value
                                              }));
                                                                                   dispatch(postDashBoardMarketingMaster({...filterData ,ads_account_id:item.value } as unknown as any));

                                            }}
                                             /> */}
                                             {/* <div style={{ display: "flex", gap: "8px", }}>
                                                 {
                                               listCampaigns?.map((item) => {
                                                 return (
                                                      <div  style={getButtonStyle(item.campaign_name)} onClick={() => setSelectedPackage(item.campaign_name)}>
           {item.campaign_name}
          </div>
                                                 )
                                               })
                                             }
                                           </div> */}
                                             

                                           </div>
                
                                         </div>
                                       )}
                                    
                  tabBottomRight={
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                       {/* <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}} onClick={() => {
                        setDataAddC({
                 ...dataAddC,
                 openModal: true,
               })
                }}
                
                    >
                  <div style={{color:"white", marginLeft:"5px"}}>Thêm chiến dịch</div>
            
                      </div> */}
                       <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}} onClick={() => {
               setIsModalOpen(true)
                }}
                
                    >
                      <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Show"> <g id="Vector"> <path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g> </g></svg>
                   {/* <img src={iconAddTask} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/>  */}
                  <div style={{color:"white", marginLeft:"5px"}}>Ẩn hiện chỉ tiêu</div>
            
          </div>
           <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#0caa31",cursor:"pointer"}} onClick={() => {
               setIsModalOpen(true)
                }}
                
                    >
<svg width="25px" height="25px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195" stroke="#ffffff" stroke-width="1.9919999999999998" stroke-linecap="round"></path> <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="#ffffff" stroke-width="1.9919999999999998" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                        {/* <img src={iconAddTask} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/>  */}
                  <div style={{color:"white", marginLeft:"5px"}}>Load dữ liệu thực</div>
            
          </div>
                                         </div>
                                       }
                                     />
                         <div className="p-apointment_list_statistic">
                             {statisticHeader}
                             </div> 
                                      {

                    data?.data?.data_reports?.length === 0 ? (
                      <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    style={{ height: "600px", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }}
    description={
      <span style={{ color: "red", fontSize: "20px" }}>
    Vui lòng sử dụng bộ lọc để thống kê số liệu marketing!
    </span>
    }
  >
   
  </Empty>
                    ) : (
                           <div style={{ overflowX: "auto", maxWidth: "100%", width: "fit-content" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Chỉ Tiêu Đánh Giá</span>
             
            </th>
            {/* <th style={headerStyle}>Mục Tiêu 30 Ngày</th> */}
            <th style={headerStyle}>Trung Bình/Ngày</th>
            <th style={headerStyle}>Hiện Tại</th>

            {Object.keys(weeklyData).map((weekStr) => {
              const week = Number.parseInt(weekStr)
              const elements = []

              // Luôn hiển thị cột tuần
              elements.push(
                <th key={week} style={weekHeaderStyle} onClick={() => handleWeekClick(week)}>
                  Tuần {week}
                </th>,
              )

              // Nếu tuần được mở rộng, thêm các cột ngày
              if (expandedWeek === week) {
                weeklyData[week].forEach((report, index) => {
                  elements.push(
                    <th key={`${week}-day-${index}`} style={dayHeaderStyle}>
                      Ngày {formatDate(report.date)}
                    </th>,
                  )
                })
              }

              return elements
            })}
          </tr>
        </thead>
        <tbody>
          {/* Lọc các KPI không bị ẩn trước khi render */}
        {data?.data?.targets &&
 kpiConfigs
  .filter((config) => {
    const found = data.data.targets.find((t: any) => {
      const match = t.criteria_code === config.key && t.is_show;
    
     
     
      return match;
    });
    return !!found;
  })
  .map((config, index) => (

              <tr key={config.key} style={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                <td style={kpiNameStyle}>
                  <span>{config.name}</span>
                  <span
                    style={toggleIconStyle}
                    onClick={() => toggleKpiVisibility(config.key)}
                    title={hiddenKpis.has(config.key) ? "Hiện dòng" : "Ẩn dòng"}
                  >
                    {hiddenKpis.has(config.key)}
                  </span>
                </td>
                {/* <td style={cellStyle}>0</td> */}
                <td style={cellStyle}>
                  {formatValue(monthlyTotals.daily[config.key] || 0, config.unit, config.isPercentage)}
                </td>
                <td style={cellStyle}>
                  {formatValue(monthlyTotals.monthly[config.key] || 0, config.unit, config.isPercentage)}
                </td>

                {Object.keys(weeklyData).map((weekStr) => {
                  const week = Number.parseInt(weekStr)
                  const elements = []

                  // Luôn hiển thị cột tuần
                  elements.push(
                    <td key={week} style={cellStyle}>
                      {formatValue(aggregatedWeeklyData[week]?.[config.key] || 0, config.unit, config.isPercentage)}
                    </td>,
                  )

                  // Nếu tuần được mở rộng, thêm các cột ngày
                if (expandedWeek === week) {
  weeklyData[week].forEach((report, dayIndex) => {
    const reportDate = moment(report.date).format("YYYY-MM-DD");

const value = (() => {
  const match = data?.data?.tag_statistics_by_ad?.find(
    (entry) => moment(entry.date).format("YYYY-MM-DD") === reportDate
  );
  const matchRe = data?.data?.revenue_from_erp?.find(
    (entry) => moment(entry.day).format("YYYY-MM-DD") === reportDate
  );
  // ✅ KPI đặc biệt: inbox_am / tong_tin_nhan
  if (config.key === "ti_le_tin_nhan_chat_luong") {
    console.log("match", report["tong_tin_nhan"] ,(match?.tag_inbox_warm / report["tong_tin_nhan"]) * 100 ,);
    const inboxAm = match?.tag_inbox_warm || 0;
    const tongTinNhan = report["tong_tin_nhan"] || 0;
    return (inboxAm / (tongTinNhan || 1)) * 100;
  }
   if (config.key === "ti_le_inbox_nong_tren_lead") {
    const inboxHot = match?.tag_inbox_hot || 0;
    const tongTinNhan = report["tong_tin_nhan"] || 0;
    return (inboxHot / (tongTinNhan || 1)) * 100;
  }
  // ✅ KPI đặc biệt từ tag_statistics_by_ad
  if (isSpecialKPI(config.key)) {
    if (!match) return 0;
    if (config.key === "inbox_am") return match.tag_inbox_warm || 0;
    if (config.key === "inbox_nong") return match.tag_inbox_hot || 0;
    if (config.key === "inbox_sdt") return match.tag_leave_phone_number || 0;
    return 0;
  }
   if (isSpecialKPIReve(config.key)) {
    if (!matchRe) return 0;
    if (config.key === "doanh_thu_du_kien") return matchRe.expected_total || 0;
    if (config.key === "doanh_thu_thuc_te_trong_ngay") return matchRe.real_total || 0;
    return 0;
  }
  // ✅ KPI thông thường
  return (report[config.key] as number) || 0;
})();

    elements.push(
      <td key={`${week}-day-${dayIndex}`} style={cellStyleD}>
        {formatValue(value, config.unit, config.isPercentage)}
      </td>
    );
  });
}
                  return elements
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
                    )
                                      }
               
    
            </>
          )}
        </div>
          
     
      </PublicLayout>
  
           {isModalOpen && (
        <TagUpdateModal
          allCriteriaDefinitions={data?.data?.targets}
          criteriaStatusData={listCampaignCriteria}
       
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSelection}
        />
      )}
        <CModal
                     isOpen={dataAddC.openModal}
               onCancel={() => {
               
                 setDataAddC({
                   ...dataAddC,
                   openModal:false
                 })
               }}
                     title={'Thêm chiến dịch'}
                     widths={600}
        zIndex={100}
        confirmLoading={loadingAddC}
                     onOk={handlePostAddCamp}
               textCancel='Đóng'
                     textOK='Thêm'
                     className='t-support_libraries_modal'
             >
               <div style={{ width: "100%", padding: "10px 0px" }}>
             <Input
                     isRequired
                     label='ID chiến dịch'
                  value={dataAddC.campaign_id}
                  variant="border8"
                  placeholder="Nhập ID chiến dịch"
                  onChange={(e) =>
                   setDataAddC({ ...dataAddC, campaign_id: e.target.value })
                  }
                />
                 <div style={{ marginTop: 10 }}>
                 <Input
                     isRequired
                     label='Tên chiến dịch'
                  value={dataAddC.campaign_name}
                  variant="border8"
                  placeholder="Nhập tên chiến dịch"
                  onChange={(e) =>
                   setDataAddC({ ...dataAddC, campaign_name: e.target.value })
                  }
                />
                </div>
                 </div>
      </CModal>
      {
        isOpenADS && (
          <div style={{ position: "absolute", top: 130, left:900, right:400, bottom: 0, zIndex: 1000,width:"800px",height:"fit-content", }}>
            <AdAccountSelector filterData={filterData} setFilterData={setFilterData} setIsOpenADS={setIsOpenADS} dataS={ dataADS.data} />
          </div>
        )
      }
       </Spin>
    </div>
  );
};

export default DashboardMarketingPage;