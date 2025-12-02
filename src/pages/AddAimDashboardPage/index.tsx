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
import { Card, DatePicker, Empty, Radio, Spin, Tabs } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Button from 'components/atoms/Button';
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown4 from 'components/atoms/Dropdown4';
import Loading from "components/atoms/Loading";
import RangeDate from 'components/atoms/RangeDate';
import MonthSelector from 'components/atoms/RangeMonth';
import WeekSelector from 'components/atoms/RangeWeek';
import RangeWeek from 'components/atoms/RangeWeek';
import YearSelector from 'components/atoms/RangeYear';
import YearSelector2 from 'components/atoms/RangeYear2';
import Typography from 'components/atoms/Typography';
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
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postDataDBS } from 'services/api/dashboardSales';
import { TargetResponseDB } from 'services/api/dashboardSales/types';
import { DashboardResponse, RevenueEntry } from 'services/api/dashboardnew/types';
import { postDashBoardMaster } from 'store/dashboard';
import { postDashBoardSalesMaster } from 'store/dashboardSales';
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListTask } from "store/tasks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, hanldeConvertListCustomer2, previewBlobPDFOpenLink } from "utils/functions";

import logo from 'assets/images/short_logo.svg';
const { RangePicker } = DatePicker;


// Bucket ưu tiên: lấy từ source, nếu không có thì thử chanel

const month = [
  { id: 0, label: 'Tháng 1', value: '01' },
  { id: 1, label: 'Tháng 2', value: '02' },
  { id: 2, label: 'Tháng 3', value: '03' },
  { id: 3, label: 'Tháng 4', value: '04' }, 
  { id: 4, label: 'Tháng 5', value: '05' },
  { id: 5, label: 'Tháng 6', value: '06' },
  { id: 6, label: 'Tháng 7', value: '07' },
  { id: 7, label: 'Tháng 8', value: '08' },
  { id: 8, label: 'Tháng 9', value: '09' },
  { id: 9, label: 'Tháng 10', value: '10' },
  { id: 10, label: 'Tháng 11', value: '11' },
  { id: 11, label: 'Tháng 12', value: '12' },
]
const brand = [
  { id: 0, label: 'Doctor Check', value: '131869073337682' },
  { id: 1, label: 'Trung Tâm Nội Soi', value: '556113784260055' },
]
interface ApiTarget {
  id: number
  page_id: string
  target_key: string
  target_value: number
  target_description: string
  target_month: number
  target_year: number
  sequence: number
}

interface TableRow {
  keyMonthly: string;     // vd: "ibwpercent_month"
  keyDaily?: string;      // vd: "ibwpercent_day"
  label: string;
  valueMonthly?: number;  // giá trị tháng
  valueDaily?: number;    // giá trị ngày
  isEditable?: boolean;
}

interface TableSection {
  title: string
  rows: TableRow[]
}
const REPORT_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiNjUxYjg2YjUtODk1YS00MmMyLWI2MjgtN2Q3MTAwOGNlMDQ5IiwidCI6ImRiNzNmYWY2LTViYzMtNDkwZC1iMGQ4LTZlZWE1ZTU4YTQ0NiIsImMiOjEwfQ%3D%3D&pageName=e7454753d5ac9ac6daa9";
const AddAimDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
    const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
 
  const [loading, setLoading] = useState(true)
  const [isLead, setIsLead] = useState(true);
  const storeDashBoard = useAppSelector((state) => state.dashboardSales.dashboardSalesMaster);
  const storeDashBoardLoading = useAppSelector((state) => state.dashboardSales.isLoadingDashboardSales);
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
   const [data, setData] = useState<TargetResponseDB>(storeDashBoard)


  const [filterData, setFilterData] = useState({
  brand:  undefined as unknown as DropdownData,
  month:  undefined as unknown as DropdownData,
  year:  "2025",
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

    document.title = "Dashboard Sales | CRM";
  }, []);

  useEffect(() => {
    setLoadingPage(false)
   setData(storeDashBoard)
  }, [storeDashBoard]);


  console.log(data)
const inputRef = useRef<HTMLInputElement | null>(null);


    const [sections, setSections] = useState<TableSection[]>([])
  const [apiData, setApiData] = useState<ApiTarget[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{ key: string; col: "monthly" | "daily" } | null>(null);

  const [editValue, setEditValue] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    // Chỉ select 1 lần khi input xuất hiện
   
      inputRef.current?.select();
    
  }, [editingCell]); // <- không có editValue trong dependency để tránh re-select khi nhập
  const handleUpdate = () => {
  console.log("sections", sections)
   setLoadingPage(true);
    // setFilterData({ date_from: from, date_to: to });
    console.log(filterData)
    dispatch(
      postDashBoardSalesMaster({
        b:filterData.brand?.value,
        m: filterData.month?.value,
        y:filterData.year || "2025",
      }) as any
    );
  };
  useEffect(() => {
    if (data && data.data) {
      transformDataToSections(data.data);
    } 
  }, [data]);
  // cặp key: month ↔ day (nếu không có day, để undefined)
const KEY_PAIRS: Array<{ m: string; d?: string; label?: string }> = [
  { m: "investtotal_month", d: undefined, label: "Đầu tư" },
  { m: "ibprices_month", d: undefined, label: "Giá inbox (Đầu tư/inbox)" },
  { m: "ibwpercent_month", d: "ibwpercent_day", label: "%Inbox ấm / Inbox" },
  { m: "ibwbookpercent_month", d: "ibwbookpercent_day", label: "%Đặt hẹn / Inbox ấm" },
  { m: "checkinpercent_month", d: "checkinpercent_day", label: "%Đến khám / Đặt hẹn" },
  { m: "paymentpercent_month", d: "paymentpercent_day", label: "%Thực hiện DV / Đến khám" },
  { m: "revenueavg_month", d: "revenueavg_day", label: "Doanh thu trung bình" },
];
  // % helpers
const isPercentLabel = (label?: string) => !!label && label.includes("%");

// xác định 1 ô có phải tỷ lệ hay không theo vị trí trong bảng
const isPercentCell = (sectionIndex: number, row: TableRow) => {
  if (sectionIndex === 0) return isPercentLabel(row.label); // Bảng 1: chỉ khi label có '%'
  return true; // Bảng 2-6: luôn là tỷ lệ
};

const toDisplayValue = (val?: number | string, percent?: boolean) => {
  if (val === undefined || val === null || val === "") return "";
  const num = typeof val === "string" ? Number.parseFloat(val) : val;
  if (Number.isNaN(num)) return "";
  return percent ? num * 100 : num;
};

const fromInputValue = (val: string, percent?: boolean) => {
  const num = Number(val);
  if (Number.isNaN(num)) return undefined;
  return percent ? num / 100 : num;
};

// nhóm khác (không phải tổng quan): liệt kê theo sequence hoặc theo prefix
const SEQ_GROUP_2 = [8, 9, 10, 11]; // Inbox ấm → Đặt hẹn (day tỉ lệ)
const SEQ_GROUP_3 = [13, 14, 15];
const SEQ_GROUP_4 = [16, 17, 18, 19, 20, 21];
const SEQ_GROUP_5 = [22, 23, 25, 26, 27]; // dữ liệu bạn gửi có 25/26/27, không có 24
const SEQ_GROUP_6: string | any[] = []; // nếu có “Đến khám → Thực hiện DV (tổng)”, thêm vào đây

const toMapByKey = (arr: ApiTarget[]) =>
  arr.reduce<Record<string, ApiTarget>>((acc, it) => {
    // eslint-disable-next-line no-param-reassign
    acc[it.target_key] = it;
    return acc;
  }, {});

const toMapBySeq = (arr: ApiTarget[]) =>
  arr.reduce<Record<number, ApiTarget>>((acc, it) => {
    // eslint-disable-next-line no-param-reassign
    acc[it.sequence] = it;
    return acc;
  }, {});

// gọi trong useEffect khi `data.data` có
// const transformDataToSections = (raw: ApiTarget[]) => {
//   const byKey = toMapByKey(raw);
//   const bySeq = toMapBySeq(raw);

//   // Section 1: Tổng quan (ghép theo KEY_PAIRS)
//   const section1Rows: TableRow[] = KEY_PAIRS.map((pair) => {
//     const m = byKey[pair.m];
//     const d = pair.d ? byKey[pair.d] : undefined;

//     // label ưu tiên: cấu hình → mô tả tháng (fallback) → mô tả ngày (fallback) → key
//     const label =
//       pair.label ??
//       m?.target_description?.replace(/^Mục tiêu tháng -\s*/i, "") ??
//       d?.target_description?.replace(/^Mục tiêu\/ngày -\s*/i, "") ??
//       pair.m;

//     return {
//       keyMonthly: pair.m,
//       keyDaily: pair.d,
//       label,
//       valueMonthly: m?.target_value,
//       valueDaily: d?.target_value,
//       isEditable: true,
//     };
//   });

//   // Helper: build section rows từ danh sách sequence (không ghép cặp)
//   const buildRowsBySeq = (seqList: number[]): TableRow[] =>
//     seqList
//       .map((seq) => bySeq[seq])
//       .filter(Boolean)
//       .map((it) => ({
//         keyMonthly: it.target_key, // dùng key làm khóa ổn định
//         label: it.target_description,
//         valueMonthly: it.target_value,
//         isEditable: true,
//       }));

//   const newSections: TableSection[] = [
//     { title: "1. Tổng quan", rows: section1Rows },
//     { title: "2. Inbox ấm → Đặt hẹn", rows: buildRowsBySeq(SEQ_GROUP_2) },
//     { title: "3. Rào cản dài hạn", rows: buildRowsBySeq(SEQ_GROUP_3) },
//     { title: "4. Rào cản đặt hẹn thất bại", rows: buildRowsBySeq(SEQ_GROUP_4) },
//     { title: "5. Rào cản dài hạn khác", rows: buildRowsBySeq(SEQ_GROUP_5) },
//     ...(SEQ_GROUP_6.length
//       ? [{ title: "6. Đến khám → Thực hiện dịch vụ", rows: buildRowsBySeq(SEQ_GROUP_6) }]
//       : []),
//   ];

//   setSections(newSections);
// };

 
  const transformDataToSections = (data: ApiTarget[]) => {
   const stripPrefix = (desc: string) => {
    const patterns: RegExp[] = [
      /^Mục tiêu tháng\s*-\s*/i,
      /^Mục tiêu\/ngày\s*-\s*/i,
      /^Inbox ấm\s*(→|->)\s*Đặt hẹn\s*-\s*/i,
      /^Đặt hẹn\s*(→|->)\s*Đến khám\s*-\s*/i,
      /^Đến khám\s*(→|->)\s*Thực hiện dịch vụ\s*-\s*/i,
      /^Rào cản.*?-\s*/i,
    ];
    let out = desc?.trim() ?? "";
    for (const p of patterns) out = out.replace(p, "");
    return out;
  };

  // 👉 helper dùng cho các section 1 cột
  const toSingleColRows = (arr: ApiTarget[]): TableRow[] =>
    arr.map((i) => ({
      keyMonthly: i.target_key,
      label: stripPrefix(i.target_description), // ✅ bỏ prefix như "Rào cản... - ..."
      valueMonthly: i.target_value,
      isEditable: true,
    }));
  // Bảng 1: Mục tiêu tháng + ngày (sequence 1–12)
  const section1 = {
    title: "1. Tổng quan mục tiêu",
    rows: [] as TableRow[],
  };

  const monthlyTargets = data.filter((i) => i.target_description.startsWith("Mục tiêu tháng"));
  const dailyTargets = data.filter((i) => i.target_description.startsWith("Mục tiêu/ngày"));

  monthlyTargets.forEach((m) => {
    const metric = m.target_description.replace("Mục tiêu tháng - ", "").trim();
    const daily = dailyTargets.find((d) => d.target_description.includes(metric));
    section1.rows.push({
      keyMonthly: m.target_key,
      keyDaily: daily?.target_key,
      label: metric,
      valueMonthly: m.target_value,
      valueDaily: daily?.target_value,
      isEditable: true,
    });
  });

  // Bảng 2: Inbox ấm → Đặt hẹn (target_description chứa "Inbox ấm")
  const section2 = {
    title: "2. Inbox ấm → Đặt hẹn",
    rows:toSingleColRows(data.filter(i => i.target_description.includes("Inbox ấm"))),
  };

  // Bảng 3: Rào cản đặt hẹn thất bại (target_description chứa "Rào cản")
  const section3 = {
    title: "3. Rào cản đặt hẹn thất bại",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Rào cản"))),
  };
  const section4 = {
    title: "4. Đặt hẹn -> Đến khám",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Đặt hẹn -> Đến khám"))),
  };
  const section5 = {
    title: "5. Rào cản đặt hẹn mà không đến",
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Rào cản đặt hẹn mà không đến"))),
  };
  const section6 = {
    title: "6. Đến khám -> Thực hiện dịch vụ",  
    rows: toSingleColRows(data.filter(i => i.target_description.includes("Đến khám -> Thực hiện dịch vụ"))),
  };
  const allSections: TableSection[] = [section1, section2, section3, section4, section5, section6];

// Ẩn section rỗng
const visible = allSections.filter(sec => sec.rows && sec.rows.length > 0);

setSections(visible);
};


   const handleEditEnd = () => {
    setEditingId(null)
    setEditValue("")
  }

const formatNumber = React.useCallback((v?: number | string) => {
  if (v === undefined || v === "") return "";
  const num = typeof v === "string" ? Number.parseFloat(v) : v;
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}, []);

// Tìm hàng theo key (keyMonthly hoặc keyDaily)
const findRowByKey = (key: string) => {
  for (let si = 0; si < sections.length; si += 1) {
    const r = sections[si].rows.find(
      (x) => x.keyMonthly === key || x.keyDaily === key
    );
    if (r) return { sectionIndex: si, row: r };
  }
  return null;
};

const startEdit = (key: string, col: "monthly" | "daily", value?: number | string) => {
  const found = findRowByKey(key);
  const percent = found ? isPercentCell(found.sectionIndex, found.row) : false;

  setEditingCell({ key, col });
  // hiển thị edit theo đơn vị người dùng thấy (nếu % thì *100)
  setEditValue(
    value !== undefined && value !== null ? String(toDisplayValue(value, percent)) : ""
  );
};

const commitEdit = () => {
  if (!editingCell) return;

  const { key, col } = editingCell;
  const found = findRowByKey(key);
  const percent = found ? isPercentCell(found.sectionIndex, found.row) : false;

  const newNumber = editValue === "" ? undefined : fromInputValue(editValue, percent);

  setSections((prev) =>
    prev.map((sec) => ({
      ...sec,
      rows: sec.rows.map((r) => {
        if (r.keyMonthly === key || r.keyDaily === key) {
          if (col === "monthly") return { ...r, valueMonthly: newNumber };
          return { ...r, valueDaily: newNumber };
        }
        return r;
      }),
    }))
  );

  setEditingCell(null);
  setEditValue("");
};

  // map dữ liệu gốc theo target_key để giữ id/sequence...

   const { mutate: postHideShow } = useMutation(
          'post-footer-form',
          (data: any) => postDataDBS(data),
          {
            onSuccess: (data) => {
              if (data.status === true) {
                toast.success(data.message || "Lưu mục tiêu thành công");
                dispatch(
                  postDashBoardSalesMaster({
                    b: filterData.brand?.value,
                    m: filterData.month?.value,
                    y: filterData.year,
                  }) as any
                );
              } else {
                toast.error(data.message || "Lưu mục tiêu thất bại, vui lòng thử lại sau");
              }
          
            },
            onError: (error:any) => {
              console.error('🚀: error --> getCustomerByCustomerId:', error);
            },
          },
        );
const handleSave = React.useCallback(() => {
  if (!data?.data?.length) return;

  setIsSaving(true);

  const byKey = toMapByKey(data.data);
  const updatedTargets: ApiTarget[] = [];

  sections.forEach((sec, sectionIndex) => {
    const isSectionPercent = sectionIndex > 0; // bảng 2-6 luôn %
    sec.rows.forEach((row) => {
      const rowIsPercentMonthly = isSectionPercent || isPercentLabel(row.label);

      // --- CỘT THÁNG ---
      if (row.keyMonthly) {
        const base = byKey[row.keyMonthly];
        const rawVal = row.valueMonthly;
        const valueToSend =
          rawVal !== undefined && rawVal !== null
            ? (rowIsPercentMonthly ? Number(rawVal) : Number(rawVal)) // rawVal đã là dạng "backend" vì commitEdit đã /100 nếu là %
            : base?.target_value;

        updatedTargets.push({
          ...(base ?? {
            id: 0,
            page_id: "",
            target_key: row.keyMonthly,
            target_description: row.label,
            target_month: data.data[0]?.target_month ?? 1,
            target_year: data.data[0]?.target_year ?? new Date().getFullYear(),
            sequence: 0,
          }),
          target_value: valueToSend ?? 0,
        });
      }

      // --- CỘT NGÀY (chỉ bảng 1) ---
      if (sectionIndex === 0 && row.keyDaily) {
        const baseDay = byKey[row.keyDaily];
        const rawValDay = row.valueDaily;
        const rowIsPercentDaily = isPercentLabel(row.label); // bảng 1: chỉ hàng có %

        const valueToSendDay =
          rawValDay !== undefined && rawValDay !== null
            ? (rowIsPercentDaily ? Number(rawValDay) : Number(rawValDay))
            : baseDay?.target_value;

        updatedTargets.push({
          ...(baseDay ?? {
            id: 0,
            page_id: "",
            target_key: row.keyDaily,
            target_description: `${row.label} (ngày)`,
            target_month: data.data[0]?.target_month ?? 1,
            target_year: data.data[0]?.target_year ?? new Date().getFullYear(),
            sequence: 0,
          }),
          target_value: valueToSendDay ?? 0,
        });
      }
    });
  });

  // (Tuỳ backend cần payload nào)
  console.log("UPDATED_TARGETS_FULL:", updatedTargets);

  postHideShow({
    page_id: filterData.brand?.value,
    month: filterData.month?.value,
    year: filterData.year,
    items: updatedTargets,
  });

  setIsSaving(false);
}, [sections, data, filterData]);


const statisticContent = useMemo(
  () => (
    <div
      style={{
        margin: "0 auto",
        backgroundColor: "transparent",
        padding: "0px 60px",
        maxHeight: "83vh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div style={{display:"grid",gridTemplateColumns:"1fr 100px"}}>

      
      
       
</div>
      <div style={{ 
          display: "grid",
            gridTemplateColumns: "1fr 1fr", // 2 cột
            columnGap: 16, // khoảng cách giữa các ô
       }}>
        {sections.map((section, sectionIndex) => {
          const isFirstSection = sectionIndex === 0;

          return (
            <div key={section.title} style={{ marginBottom: 2 }}>
              <h2 style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3, borderBottom: "1px solid #000", paddingBottom: 2 ,marginTop:3}}>
                {section.title}
              </h2>

            <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 4,
    tableLayout: "fixed",
  }}
>
  <colgroup>
    <col style={{ width: "60%" }} />  {/* label */}
    <col style={{ width: "20%" }} />  {/* số 1 */}
    <col style={{ width: "20%" }} />  {/* số 2 */}
  </colgroup>

  <thead>
    <tr style={{ backgroundColor: "#f0f0f0" }}>
      <th style={tableHeaderStyle}>{isFirstSection ? "Hạng mục" : ""}</th>

      {isFirstSection ? (
        <>
          <th style={tableHeaderStyle2}>Mục tiêu tháng</th>
          <th style={tableHeaderStyle2}>Mục tiêu/ngày</th>
        </>
      ) : (
        // ✅ Gộp 2 cột số thành 1 header chiếm 40%
        <th style={tableHeaderStyle2} colSpan={2}>
          Tỉ lệ mục tiêu
        </th>
      )}
    </tr>
  </thead>

  <tbody>
    {section.rows.map((row, rowIndex) => {
      const rowKey = row.keyMonthly;

      const isEditingMonthly =
        editingCell?.key === row.keyMonthly && editingCell?.col === "monthly";
      const isEditingDaily =
        editingCell?.key === row.keyDaily && editingCell?.col === "daily";

      return (
        <tr
          key={rowKey}
          style={{ backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#f9f9f9" }}
        >
          {/* Label */}
          <td style={tableCellStyle}>{row.label}</td>

          {isFirstSection ? (
            <>
              {/* Cột số 1: Tháng */}
              <td
                style={{
                  ...tableCellStyle2,
                  backgroundColor: isEditingMonthly ? "#fff3cd" : undefined,
                  cursor: row.isEditable ? "pointer" : "default",
                }}
                onClick={() =>
                  row.isEditable &&
                  startEdit(row.keyMonthly, "monthly", row.valueMonthly)
                }
              >
                {isEditingMonthly ? (
                  <div style={{ width: 90, marginLeft: "auto" }}>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      autoFocus
                    ref={inputRef}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        textAlign: "right",
                        padding: 2,
                        border: "none",            // 👉 bỏ viền
                        outline: "none",           // 👉 bỏ viền focus xanh
                        borderRadius: 2,
                        fontSize: 11,
                        display: "block",
                        backgroundColor: "#f8f9fa" // tuỳ chọn, có thể bỏ
                      }}
                    />
                  </div>
                ) : (
               <div style={{ width: 90, marginLeft: "auto", textAlign: "right" }}>
  {(() => {
    const percent = isPercentCell(sectionIndex, row);
    const show = toDisplayValue(row.valueMonthly, percent);
    return show === "" ? "" : `${formatNumber(show)}${percent ? " %" : ""}`;
  })()}
</div>
                )}
              </td>

              {/* Cột số 2: Ngày */}
              <td
                style={{
                  ...tableCellStyle2,
                  backgroundColor: isEditingDaily ? "#fff3cd" : undefined,
                  cursor: row.keyDaily && row.isEditable ? "pointer" : "default",
                  opacity: row.keyDaily ? 1 : 0.5,
                }}
                onClick={() =>
                  row.keyDaily &&
                  row.isEditable &&
                  startEdit(row.keyDaily, "daily", row.valueDaily)
                }
              >
                {isEditingDaily ? (
                  <div style={{ width: 90, marginLeft: "auto" }}>
                    <input
                     type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      autoFocus
                   ref={inputRef}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        textAlign: "right",
                        padding: 2,
                        border: "none",            // 👉 bỏ viền
                        outline: "none",           // 👉 bỏ viền focus xanh
                        borderRadius: 2,
                        fontSize: 11,
                        display: "block",
                        backgroundColor: "#f8f9fa" // tuỳ chọn, có thể bỏ
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ width: 90, marginLeft: "auto", textAlign: "right" }}>
  {(() => {
    const percent = isPercentCell(sectionIndex, row);
    const show = toDisplayValue(row.valueDaily, percent);
    return show === "" ? "" : `${formatNumber(show)}${percent ? " %" : ""}`;
  })()}
</div>
                )}
              </td>
            </>
          ) : (
            // ✅ Section ≠ 1: gộp 2 cột số vào một ô chiếm 40% bề ngang
            <td
              colSpan={2}
              style={{
                ...tableCellStyle2,
                backgroundColor: isEditingMonthly ? "#fff3cd" : undefined,
                cursor: row.isEditable ? "pointer" : "default",
              }}
              onClick={() =>
                row.isEditable &&
                startEdit(row.keyMonthly, "monthly", row.valueMonthly)
              }
            >
              {isEditingMonthly ? (
                <div style={{ width: 90, marginLeft: "auto" }}>
                  <input
                  type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    autoFocus
              ref={inputRef}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      textAlign: "right",
                      padding: 2,
                      border: "none",            // 👉 bỏ viền
                      outline: "none",           // 👉 bỏ viền focus xanh
                      borderRadius: 2,
                      fontSize: 11,
                      display: "block",
                      backgroundColor: "#f8f9fa" // tuỳ chọn, có thể bỏ
                    }}
                  />
                </div>
              ) : (
               <div style={{ width: 90, marginLeft: "auto", textAlign: "right" }}>
  {(() => {
    const percent = isPercentCell(sectionIndex, row);
    const show = toDisplayValue(row.valueMonthly, percent);
    return show === "" ? "" : `${formatNumber(show)}${percent ? " %" : ""}`;
  })()}
</div>
              )}
            </td>
          )}
        </tr>
      );
    })}
  </tbody>
</table>

            </div>
          );
        })}
      </div>

       <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 5, paddingTop: 0, }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{ padding: "6px 15px",display:"flex",justifyContent:"end",alignItems:"center",gap:5, backgroundColor: "#27acfd", color: "white", border: "none", borderRadius: 3, fontSize: 14, fontWeight: "bold", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1 }}
          >
            <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#ffffff"></path> </g></svg>
         <span> {isSaving ? "Đang lưu..." : "Lưu"}</span>
        </button>
      
      </div>
    </div>
  ),
  [sections, editingCell, editValue, isSaving, formatNumber]
);
  


  return (
   <div className="p-apointment_list">
    <PublicLayout widthScreen={stateBreakPoint}>
      <Spin
        spinning={loadingPage}
        size="large"
        indicator={
          <img
            className="loader"
            style={{ width: 70, height: 70, objectFit: "cover", backgroundColor: "transparent" }}
            src={logo}
          />
        }
      >
        <div className="p-apointment_list_schedule">
          {/* Header filter của bạn vẫn giữ nguyên để dùng chung cả 2 tab (nếu muốn filter cho cả báo cáo) */}
         

          {/* ✅ Tabs chính */}
          <Tabs
            defaultActiveKey="report"
            items={[
              {
                key: "report",
                label: "Xem báo cáo",
                children: (
                  <Card bordered style={{ background: "transparent" }}>
                    {/* Nhúng Power BI */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "56.25%", // 16:9
                        borderRadius: 8,
                        overflow: "sroll",
                        background: "#fff",
                        maxHeight: "60vh",
                      }}
                    >
                      <iframe
                        title="Power BI Report"
                        src={REPORT_URL}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "75%", border: 0 }}
                        allowFullScreen
                      />
                    </div>
                  </Card>
                ),
              },
              {
                key: "targets",
                label: "Thêm mục tiêu",
                children: (
                  <>
                     <PublicHeader
            isDial={false}
            isHideCleanFilter
            isHideEmergency
            isHideService
            isHideLibraly
            titlePage=""
            className="p-apointment_list_schedule_header_top_action"
            handleFilter={() => {}}
            isHideFilter
            isClearFilter={storeDashBoardLoading || tableLoading}
            handleGetTypeSearch={() => {}}
                      handleCleanFilter={() => { }}
                      tabLeft={
                        <>
                        {
                            storeDashBoard.data.length !== 0 && <div style={{ textAlign: "center",fontSize: 15, fontWeight: "bold", textTransform: "uppercase" }}>
        ĐẶT MỤC TIÊU CHO {filterData.month?.label}/{filterData.year || "2025"}
        </div>
                        }
                        </>
                        
                      }
            listBtn={
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 16 }}>
                <div style={{ minWidth: "170px", maxWidth: "170px" }}>
                  <Dropdown
                    variant="simple"
                    placeholder="-- Brand --"
                    dropdownOption={brand}
                    handleSelect={(item) => {
                      setFilterData({ ...filterData, brand: item });
                    }}
                  />
                </div>
                <div style={{ minWidth: "120px", maxWidth: "120px" }}>
                  <Dropdown
                    variant="simple"
                    placeholder="-- Tháng --"
                    dropdownOption={month}
                    handleSelect={(item) => {
                      setFilterData({ ...filterData, month: item });
                    }}
                  />
                </div>
                <div style={{ minWidth: "100px" }}>
                  <YearSelector2
                    onChange={(_, __, year) => {
                      setFilterData({ ...filterData, year: year.toString() });
                    }}
                  />
                </div>
                <div style={{ minWidth: "50px" }}>
                  <Button
                    style={{ borderRadius: 5, width: "100%" }}
                    onClick={() => {
                      handleUpdate();
                    }}
                  >
                    <Typography content="Xem" />
                  </Button>
                </div>
              </div>
            }
          />
                    {/* Nếu chưa chọn filter thì vẫn hiển thị Empty như bạn đang làm */}
                    {storeDashBoard.data.length === 0 ? (
                      <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        style={{
                          height: "600px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        description={
                          <span style={{ color: "red", fontSize: "20px" }}>
                            Vui lòng sử dụng bộ lọc để xem số liệu!
                          </span>
                        }
                      />
                    ) : (
                      // ✅ Giữ nguyên nội dung bảng/sections của bạn
                      statisticContent
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>
      </Spin>
    </PublicLayout>
  </div>
  );
};
const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "0px 6px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "13px",
  backgroundColor: "#f0f0f0",
}
const tableHeaderStyle2: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "0px 6px",
  textAlign: "right",
  fontWeight: "bold",
  fontSize: "13px",
  backgroundColor: "#f0f0f0",
}

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "1px 6px",
  fontSize: "13px",
  textAlign: "left",
  minHeight: "20px",
}
const tableCellStyle2: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "1px 6px",
  fontSize: "13px",
  textAlign: "right",
  minHeight: "20px",
}
export default AddAimDashboardPage;