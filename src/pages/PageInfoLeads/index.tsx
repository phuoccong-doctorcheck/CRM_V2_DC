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
import { DatePicker, Empty, Spin } from 'antd';
import { optionDate, optionDate2 } from "assets/data";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CTooltip from "components/atoms/CTooltip";
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown4 from 'components/atoms/Dropdown4';
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import InputA from 'components/atoms/Input';
import Loading from "components/atoms/Loading";
import RangeDate from "components/atoms/RangeDate";
import Switchs from 'components/atoms/Switchs';
import TextArea from "components/atoms/TextArea";
import Transfer, {
  TransferItemType,
  TransferType,
} from "components/atoms/Transfer";
import Typography from "components/atoms/Typography";
import FloatFilter from "components/molecules/FloatFilter";
import FormAddCustomer from "components/molecules/FormAddCustomer";
import FormAddLead from 'components/molecules/FormAddLead';
import FormAddPriceCustomer from 'components/molecules/FormAddPriceCustomer';
import FormAddContact from "components/molecules/FormBooking";
import FormConvertCustomer from 'components/molecules/FormConvertCustomer';
import FormUpdateLead from 'components/molecules/FormUpdateLead';
import LeadQualificationForm from 'components/molecules/LeadQualificationForm';
import MultiSelect from "components/molecules/MultiSelect";
import PublicTable from "components/molecules/PublicTable";
import RichTextEditor from "components/molecules/RichTextEditor";
import CModal from "components/organisms/CModal";
import CSteps from 'components/organisms/CSteps';
import InteractionHistory from 'components/organisms/InteractionHistory';
import InteractionHistory2 from 'components/organisms/InteractionHistory2';
import ListBooking from 'components/templates/ListBooking';
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  NodeMouseHandler,
} from 'reactflow';

// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import { Edit, User, Tag, Users, IterationCcw} from "lucide-react"
// eslint-disable-next-line import/order
import moment from "moment";
// eslint-disable-next-line import/order
import React, { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line import/order
import { useMutation } from "react-query";
// eslint-disable-next-line import/order
import { toast } from "react-toastify";
import { ServiceItem } from 'services/api/Example/types';
import { getDataGPT, getInfoDetailGuid, postChangeStep, postNoteLog, postUserGuids } from 'services/api/afterexams';
import { postPrintAppointmentServicepoint } from "services/api/appointmentView";
import {
  getCustomerById,
  postAssignedToID,
  postNoteByID,
  postNotifyCustomer,
  postObjectTag,
  postSaveCustomerBeforeExams,
  getInfoDetailCustomer,
  getListBeforeExamsFromPC,
  postUpdateCustomerBeforeExams,
  postConvertCustomerBeforeExams,
  postAssignAPI,
  getInfoOfLeadFromPC,
  postBookCustomerAPI,
  postSavePriceQuoteL,
  postRemovePriceQuote
} from "services/api/beforeExams";
import { PayloadGetBeforeExams ,LeadResponse, TagCustomer} from "services/api/beforeExams/types";
import {postAddTaskOfOneCustomer, postAssignTaskAPI, postChangeStatusTaskAPI} from "services/api/tasks";
import { getListUserGuidsCRM } from 'store/afterexams';
import { getListTags, getListToStoreBeforeExams } from "store/beforeExams";
import { getInfosCustomerById, getListNotesLog } from "store/customerInfo";
import { postAdsAMarketingMasterMarketingMaster } from 'store/dashboard';
import { setShowNoteComponent } from "store/example";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListAnswerMaster } from 'store/survey_lead';
import { getListTask, getListTaskE } from "store/tasks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, hanldeConvertListCustomer, hanldeConvertListCustomer2, hanldeConvertListTask, previewBlobPDFOpenLink } from "utils/functions";
import { localeVN } from 'utils/staticState';
// eslint-disable-next-line import/order
import LeadNoBookingForm from 'components/molecules/LeadNoBookingForm';
// eslint-disable-next-line import/order
import LeadBookingForm from 'components/molecules/LeadBookingForm';
// eslint-disable-next-line import/order
import LeadCancelForm from 'components/molecules/LeadCancelForm';
// eslint-disable-next-line import/order
import CustomerProfile from 'components/templates/ProfileCustomer/ProfileCustomer';
// eslint-disable-next-line import/order
import OrderListLead from 'components/templates/OrderListLead';
// eslint-disable-next-line import/order
import PublicTableListPrice from 'components/molecules/PublicTableListPrice';
import { border8 } from '../../components/atoms/Input2/index.stories';

import iconPen from "assets/iconButton/iconPen.png"
import iconAddTask from "assets/iconButton/icons8-add-note-50.png"
import imgClose from "assets/iconButton/iconsclose.png";
import imgDelete from "assets/iconButton/iconsdelete.png";
import imgSave from "assets/iconButton/iconssave.png";
import logo from 'assets/images/short_logo.svg';

// eslint-disable-next-line import/order
import Dropdown3 from 'components/atoms/Dropdown3';
// eslint-disable-next-line import/order
import CCollapse from 'components/organisms/CCollapse';
// eslint-disable-next-line import/order
import FormConvertCustomerSaleOrder from 'components/molecules/FormConvertCustomerSaleOrder';
const { RangePicker } = DatePicker;

export type TicketType = {
  id?: number;
  ticket_name?: string;
  desc?: string;
  start?: Date;
  end?: Date;
  level?: string;
  type?: string;
  isDone?: boolean;
};
type Order = {
  id: string;
  customer: string;
  createdAt: string;
  medicalCode: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentStatus: string;
  owner: string;
  group: string;
  registerSource: string;
  sourceType: string;
  orderDate: string;
  creator: string;
  note?: string;
};
const cardStyle = {
  borderRadius: "16px",
  padding: "0px 28px",
  margin: "10px auto",
  fontFamily: "Segoe UI, Arial, sans-serif",
  color: "#222",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: "12px",
};

const labelStyle = {
  color: "#888",
  fontWeight: 500,
  fontSize: "1rem",
  marginRight: "6px",
};

const valueStyle = {
  color: "#333",
  fontWeight: 500,
  fontSize: "1rem",
};

const contentStyle = {
  margin: "18px 0",
  fontSize: "1.1rem",
};

const timeStyle = {
  color: "#666",
  fontSize: "0.95rem",
  marginTop: "18px",
};

const buttonStyle = {
  marginTop: "24px",
  padding: "10px 22px",
  background: "#4285F4",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(66,133,244,0.08)",
  transition: "background 0.2s",
};
const statusGuid = [ 
  {
    id:1,
    label: "Chưa giải quyết",
    value: "pending",
  },
  {
    id:2,
    label: "Mới",
    value: "new",
  },
  {
    id:3,
    label: "Phân ra",
    value: "draff ",
  },

]
const orders: Order[] = [
  {
    id: 'S1212121212-05',
    customer: 'NGUYỄN TIẾN THÀNH',
    createdAt: '19/06/2025 10:25:21',
    medicalCode: '1212121212',
    productCode: 'NS24122802',
    productName: 'Nội Soi Đại Trực Tràng',
    quantity: 1,
    unitPrice: 1400000,
    total: 1400000,
    paymentStatus: 'Chưa thanh toán',
    owner: 'BooKingCare',
    group: 'Doctor Check - Tầm Soát Bệnh',
    registerSource: 'Vãng Lai',
    sourceType: 'Chat Messenger',
    orderDate: '19/06/2025 10:25:21',
    creator: 'Nguyễn Đình Tùng',
    note: 'Chị An đặt lịch cho khách hàng',
  },
];
//

interface DataForm {
  lead_id: string;
  name: string;
  dayOfBirth: string; // Năm sinh (không bắt buộc)
  saleorder_ref: string;
  gender: {
  label: string;
    value: string;
  
     // Mã đơn hàng (không bắt buộc)
} // Giới tính (bắt buộc)
  isCheckInsurance: boolean;
  insuranceObjectRatio: string;
  discount: number;
  services: ServiceItem[]; // Mảng chứa danh sách dịch vụ
  typeBooking: GroupRadioType
}
const rawNodes = [
  { id: '1', label: 'Tiếp nhận', x: -1700, y: 100 },
  { id: '2', label: 'Khai thác nhu cầu', x: -1100, y: 100 },
  { id: '3', label: 'Chưa đặt hẹn', x: -600, y: 100 },
  { id: '4a', label: 'Đặt hẹn', x: -100, y: 50 },
  { id: '4aa', label: 'Hoàn thành', x: 200, y: 50 },
  { id: '4b', label: 'Thất bại', x: -100, y: 150 },
  { id: '5a', label: 'Hủy hẹn', x: 200, y: 130 },
  { id: '5b', label: 'Chưa chốt ', x: 200, y: 200 },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'straight' },
  { id: 'e2-3', source: '2', target: '3', type: 'straight' },
  { id: 'e3-4a', source: '3', target: '4a', type: 'straight' },
  { id: 'e3-4b', source: '3', target: '4b', type: 'straight' },
  { id: 'e4b-5a', source: '4b', target: '5a', type: 'straight' },
  { id: 'e4b-5b', source: '4b', target: '5b', type: 'straight' },
   { id: 'e4a-4aa', source: '4a', target: '4aa', type: 'straight' },
];

// Tạo bản đồ cha -> con
const buildParentMap = (edges: any[]) => {
  const map: Record<string, string[]> = {};
  for (const edge of edges) {
    if (!map[edge.target]) map[edge.target] = [];
    map[edge.target].push(edge.source);
  }
  return map;
};

export const getLastTwoNames = (fullString: string): string[] => {
  const names = fullString.split(" và ");
  return names.map(name => {
    const parts = name.trim().split(/\s+/);
    const lastTwo = parts.slice(-2);
    return lastTwo.join(" ");
  });
};

// Đệ quy tìm toàn bộ cha của node hiện tại
const getAllAncestors = (
  nodeId: string,
  parentMap: Record<string, string[]>,
  visited = new Set<string>()
): string[] => {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);

  const parents = parentMap[nodeId] || [];
  let ancestors = [...parents];
  for (const parent of parents) {
    ancestors = ancestors.concat(getAllAncestors(parent, parentMap, visited));
  }
  return ancestors;
};

//
const Step1 = () => <div>Bước 1: Nhập thông tin cá nhân</div>;
const Step2 = () => <div>Bước 2: Xác thực email</div>;
const Step3 = () => <div>Bước 3: Hoàn tất</div>;
const tabs = [
  { id: "lstt", label: "Lịch sử tương tác" ,stepId :0},
  { id: "congviec", label: "Công việc",stepId:1 },
  { id: "huongdan", label: "Hướng dẫn", stepId: 2 },
    { id: "donhang", label: "Đơn hàng",stepId:3 },
  { id: "datlich", label: "Đặt lịch" ,stepId:4},
]
const PageInfoLeads: React.FC = () => {
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [activeTab, setActiveTab] = useState("lstt")
  const [currentStepIdS, setCurrentStepIdS] = useState('1');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, , onEdgesChange] = useEdgesState(edges);
  const [openProfile, setOpenProfile] = useState(false);
  console.log(currentStep)
  const parentMap = buildParentMap(edges);

  // Xử lý tô màu node và cha
  const updateHighlightedNodes = useCallback(
    (stepId: string) => {
      const ancestors = getAllAncestors(stepId, parentMap);
      const activeIds = new Set([...ancestors, stepId]);

      const updatedNodes: Node[] = rawNodes.map((n) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: n.x, y: n.y },
        style: {
           width: 230,
          // height:80,  paddingTop:20,
          fontSize: 20,
          background: activeIds.has(n.id) ? '#4f46e5' : '#fff',
          color: activeIds.has(n.id) ? '#fff' : '#000',
          border: '2px solid #ccc',
          borderRadius: 10,
          fontWeight: 600,
          textAlign: 'center',
        
          cursor: 'pointer',
        },
      }));

      setNodes(updatedNodes);
    },
    [setNodes]
  );

  // Khi node được click
  const onNodeClick: NodeMouseHandler = (_, node) => {
    setCurrentStepIdS(node.id);
    updateHighlightedNodes(node.id);
  };
  const [nameStep,setNameStep] = useState("?")
  // Tô màu ban đầu
  useEffect(() => {
    updateHighlightedNodes(currentStepIdS);
  }, [currentStepIdS, updateHighlightedNodes]);
  const stepsData = [
    { name: 'Tiếp nhận', component: <div>Step 1</div>, icon: <UserOutlined /> },
    // eslint-disable-next-line react/jsx-no-undef
    { name: 'Khai thác nhu cầu', component: <div>Step 2</div>, icon: <SolutionOutlined /> },
    { name: 'Follow', component: <div>Step 3</div>, icon: <LoadingOutlined /> },
   {
  name:currentStep === 5
    ? 'Đặt hẹn'
    : currentStep === 4
    ? 'Hủy hẹn'
    : '?',
  component: <div>Step 4</div>,
  icon: <SmileOutlined />
}

    // { name: 'Hủy hẹn', component: <div>Step 4</div>, icon: <SmileOutlined /> },
    // { name: 'Hoàn thành', component: <div>Step 4</div>, icon: <SmileOutlined /> },
  ];
  const handleStepChange = (step: number) => {

    
    // handlePostChangeStep(step + 1)
     
    setCurrentStep(step); // cập nhật step nếu bạn điều khiển từ ngoài
  };
  const [isLead, setIsLead] = useState(true);
  const listBeforeExams = useAppSelector((state) => state.beforeExams.beforeExamsList);
  const loadingBefore = useAppSelector((state) => state.beforeExams.loadingBefore);
  const listTag = useAppSelector((state) => state.beforeExams.listTagCustomer);
  const loadingTag = useAppSelector((state) => state.beforeExams.loadingListTag);
  const listTask = useAppSelector((state) => state.listTaskReducer.taskList);
  const loadingListTask = useAppSelector((state) => state.listTaskReducer.loadingTaskList);
  const listGuid = useAppSelector((state) => state.afterExams.listUserGuids2);
  const loadingListGuid = useAppSelector((state) => state.afterExams.loadingListUserGuids);
  const listAnswer = useAppSelector((state) => state.listSurvey.listAnswerMaster);
  const loadingListAnswer = useAppSelector((state) => state.listSurvey.isLoadingAnswerMaster);
  const storageTags = localStorage.getItem("tagsCustomer");
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const storageTagsCustomer = localStorage.getItem("tagsCustomer");
  const storageUserguidTypes1 = localStorage.getItem("userguid_types");
  const storageUserguidTypes = localStorage.getItem("groupTask");
  const storageCSKH = localStorage.getItem("listCSKH");
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");
  const storestepsprocesslead = localStorage.getItem("stepsprocesslead");
  const storeListUser = localStorage.getItem("list_users");
   const storageEmployeeTeams = localStorage.getItem('employeeTeams');
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateTagsCustomer, setstateTagsCustomer] = useState<DropdownData[]>(storageTagsCustomer ? JSON.parse(storageTagsCustomer) : []);
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [listPhares, setListPhares] = useState<DropdownData[]>(
    storagelistPhares ? JSON.parse(storagelistPhares) : ""
  );
  const [listUsers, setListUsers] = useState<DropdownData[]>(
    storeListUser ? JSON.parse(storeListUser) : ""
  );
  const [listeTags, setListeTags] = useState<TransferType[]>(
    storageTags ? JSON.parse(storageTags) : ""
  );
  console.log(listeTags)
  //const [listTag, setListTag] = useState<TagCustomer[]>(dataCustomerInfos?.tags as any);
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
 const [userguidType, setListUserguidType] = useState<any[]>(
    storageUserguidTypes ? JSON.parse(storageUserguidTypes) : []
  );
  const listNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteLog
  );
  const LoainglistNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.loadingNoteLog
  );
  const [listNode, setListNode] = useState(listNotesCustomer);

  const [listNodeLoading, setListNodeLoading] = useState(false);
    const [stateAssignTask, setStateAssignTask] = useState({
      openModal: false,
      id:  0,
      note: "",
      exec_u_id: undefined as unknown as DropdownData,
    });
  useEffect(() => {
    setListNode(listNotesCustomer);
  }, [listNotesCustomer]);
  const [dataBeforeExam, setDataBeforeExam] = useState(listBeforeExams || []);
  const [dataListTag, setDataListTag] = useState(listTag.data || []);
  const [dataListTask, setDataListTask] = useState(listTask || []);
  const [dataListGuid, setDataListGuid] = useState(listGuid || []);
  const [dataListAnswer, setDataListAnswer] = useState(listAnswer || []);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
  const [isOpenPopupP, setIsOpenPopupP] = useState(false);
  const [isClosePopupP, setIsClosePopupP] = useState(false);
  const [isOpenPopupC, setIsOpenPopupC] = useState(false);
  const [isClosePopupC, setIsClosePopupC] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const lead_id = parseInt(params.get("id") || "0", 10);
  const [isOpenPopupU, setIsOpenPopupU] = useState(false);
  const [isClosePopupU, setIsClosePopupU] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 0 });

  const [customerUpdate, setCustomerUpdate] = useState<any>();
  const [isUpdateCustomer, setIsUpdateCustomer] = useState(false);
  const [isStatisticMobile, setIsStatisticMobile] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddNote, setIsAddNote] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [isOpenFormContact, setIsOpenFormContact] = useState(false);
  const [stateDataAssign, setStateDataAssign] = useState({
    openModal: false,
    lead_id: lead_id,
    follow_employee_id:  listUsers[0]
  })
const [stateEmployeeId, setStateEmployeeId] = useState<any>(() => {
  try {
    return employeeId ? JSON.parse(employeeId) : "";
  } catch {
    return employeeId || "";
  }
});

  const [isAddTag, setIsAddTag] = useState(false);
  const [dataUpdateTag, setDataUpdateTag] = useState<TransferItemType[]>();
  const [customerInfoAddTag, setCustomerInfoAddTag] = useState();
  const [isAddTask, setIsAddTask] = useState(false);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [dataAddNote, setDataAddNote] = useState({
    openAddNote: false,
    id:  0,
    node_type: "all",
  });
  const [isAddTask1, setIsAddTask1] = useState(false);
   const [stateChangeStatusTask, setStateChangeStatusTask] = useState({
      openModal: false,
      id:  0,
      note: "",
      status: OptionCustomerTask[1],
   });
     const storageGenders = localStorage.getItem("genders");
       const [listGenders, setListGenders] = useState<DropdownData[]>(
          storageGenders ? JSON.parse(storageGenders || "") : []
  );
      const [listTasks, setListTasks] = useState<DropdownData[]>();
    const [formData, setFormData] = useState({
      task_his_id: null,
      remind_datetime: undefined as unknown as Date,
      task_description: undefined as unknown as string,
      task_name: undefined as unknown as DropdownData,
      note: undefined as unknown as string,
      lead_id: 0,
      exec_u_id: stateEmployeeId,
      category_id: undefined as unknown as DropdownData,
      id: null,
       assign: undefined as unknown as DropdownData,
      personCharge: undefined as unknown as DropdownData,
            type: OptionCustomerTask[1],
    });
  const [formDataGuid, setFormDataGuid] = useState({
    limit: 50,
    page: 1,
    keyword:  "",
    guid_status: statusGuid[0]?.value || "pending",
    category_id: userguidType[0]?.id || 0,
  });
  const [formDataErr, setFormDataErr] = useState({
    name: "",
    group: "",
    deadline: "",
    desc: "",
  });
  const [contentNote, setContentNote] = useState("");
  const [isUpdateBeforeExams, setIsUpdateBeforeExams] = useState(false);
  const [valueNote, setValueNote] = useState('');
  const [typeNote, setTypeNote] = useState<DropdownData>();
  const [dataLog, setDataLog] = useState({
    node_type: listTouchPointLogType[0],
    note_node_content: "",
    note_attach_url: "",
    lead_id: undefined as unknown as  number,
  })
  const [filterData, setFilterData] = useState({
    from_date: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    to_date: moment(new Date()).format('YYYY-MM-DDT23:59:59'),
    origin: undefined as unknown as DropdownData[],
    originGroup: undefined as unknown as DropdownData,
    originType: undefined as unknown as DropdownData,
    state: undefined as unknown as DropdownData,
    tag: undefined as unknown as DropdownData,
    keyword: "",
    yourCustomer: false,
    own_employee_id: "",
    follow_employee_id: "",
    source_id: null,
    status: undefined as unknown as DropdownData,
    step_index:  stepsprocesslead[0]
  });
  console.log(dataListAnswer)
  const payloadBeforeExam = {
    source_id: filterData.source_id,
    status: "",
    own_employee_id: filterData.own_employee_id,
    follow_employee_id: filterData.follow_employee_id,
    from_date: moment(new Date()).format("YYYY-MM-DDT00:00:00") as any,
    to_date: moment(new Date()).format("YYYY-MM-DDT23:59:59") as any,
    keyword: "",
    page: 1,
    page_size: 500,
  };
   const [isLoadingB,setIsLoadingB] = useState(false)
  const bodyGetList = {
    source_id: filterData?.source_id || "",
    step_index: filterData?.step_index || "",
    status: filterData.status,
    own_employee_id: filterData.own_employee_id,
    follow_employee_id: filterData.follow_employee_id,
    keyWord: filterData?.keyword,
    page: 1,
    page_size: 1000,
    from_date: moment(filterData?.from_date).format("YYYY-MM-DDT00:00:00"),
    to_date: moment(filterData?.to_date).format("YYYY-MM-DDT23:59:59"),
  };
   const [listPersonA, setListPersonA] = useState<DropdownData[]>(hanldeConvertListCustomer("CSKH"));
  const [filterColumn, setFilterColumn] = useState({
    employeeFollow: [],
  });
   const [listPerson, setListPerson] = useState<DropdownData[]>();
  useEffect(() => {
    setDataListTag(listTag.data)
  },[listTag.data])
  useEffect(() => {
    setDataListAnswer(listAnswer)
  },[listAnswer])
  const [filterTask, setFilterTask] = useState({
   task_type_id: userguidType[0]?.value || "all",
    status:OptionCustomerTask[0]?.value || "all",
    id: "",
  });
   const [filterTaskAll, setFilterTaskAll] = useState({
    own_u_id: stateEmployeeId,
    status:OptionCustomerTask[0].value || "all",
  });
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
    const formUserGuid = useMemo(() => (
      <div className="t-support_libraries_form">
        <Input
          variant="simple"
          label={'Tiêu đề'}
          value={conversation?.guid_title}
          onChange={(e) => {
            setConversation({
              ...conversation,
              guid_title: e?.target?.value
            })
          }}
        />
          <Dropdown
                  dropdownOption={statusGuid}
          variant="simple"
          label={'Trạng thái'}
      isColor
      placeholder="-- Chọn trạng thái --"
      values={conversation.guid_status}
      handleSelect={(item: any) => {
        setConversation({ ...conversation, guid_status: item.value });
      
      }}
    />
        <div className="t-support_libraries_form_input">
          <Typography content="Nội dung" />
          <RichTextEditor
            data={conversation?.guid_content}
            handleOnChange={(data: any) => {
              setConversation({
                ...conversation,
                guid_content: data,
              })
            }}
          />
        </div>
        <Dropdown
                 dropdownOption={userguidType.filter(item => item.category_type === "guid")}
      variant="simple"
          isColor
          label='Danh mục'
      placeholder="-- Chọn danh mục --"
      values={conversation.category_id}
      handleSelect={(item: any) => {
        setConversation({ ...conversation, category_id: item.value });
      
      }}
        />
        
        <MultiSelect
          lable='Tags'
          mode="tags"
          option={stateTagsCustomer}
          value={conversation?.tags}
          handleChange={(data: any) => {
            setConversation({
              ...conversation,
              tags: data,
            })
          }}
        />
       
      </div>
    ), [conversation, isOpenModal])
   const { mutate: postUpdateUserGuid } = useMutation(
      'post-footer-form',
      (data: any) => postUserGuids(data),
      {
        onSuccess: (data) => {
            dispatch(getListUserGuidsCRM({
              ...formDataGuid,
          
            }));
          setConversation({
            ...conversation,
            category_id: undefined as unknown as DropdownData,
            guid_title: '',
            guid_suggest: '',
            guid_content: '',
            guid_status: '',
            tags: [],
            
          })
          setIsOpenModal(false);
        },
        onError: (error) => {
          console.error('🚀: error --> getCustomerByCustomerId:', error);
        },
      },
    );
     const handleSubmit = () => {
        const body = {
          category_id: conversation.category_id,
          guid_title: conversation.guid_title,
          guid_content: conversation.guid_content,
          guid_suggest: conversation.guid_suggest,
          tag_ids: conversation.tags,
          guid_status: conversation.guid_status,
          guid_u_id: conversation.guid_u_id,
       }
       postUpdateUserGuid(body);
  }
     //
     const { mutate: postChangeStatusTask } = useMutation(
      "post-footer-form",
      (data: any) => postChangeStatusTaskAPI(data),
      {
        onSuccess: (data) => {
          if (data.status) {
            setStateChangeStatusTask({
              ...stateChangeStatusTask,
              openModal: false,
              id: 0,
              note:""
            })
            dispatch(getListTask({ ...filterTask } as unknown as any));
            dispatch(getListTaskE({ ...filterTaskAll } as unknown as any));
          } 
        },
        onError: (error) => {
          console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
        },
      }
    );
    const handleChangeStatusTask = () => {
      const body = {
        task_id: stateChangeStatusTask.id,
        note: stateChangeStatusTask.note,
        status: stateChangeStatusTask.status.value
      }
      postChangeStatusTask(body);
  }
  
    const { mutate: postAssignTask } = useMutation(
      "post-footer-form",
      (data: any) => postAssignTaskAPI(data),
      {
        onSuccess: (data) => {
          if (data.status) {
            setStateAssignTask({
              ...stateAssignTask,
              openModal: false,
              id: 0,
              note: "",
              exec_u_id: undefined as unknown as DropdownData,
            })
            dispatch(getListTask({ ...filterTask } as unknown as any));
            dispatch(getListTaskE({ ...filterTaskAll } as unknown as any));
          } 
        },
        onError: (error) => {
          console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
        },
      }
    );
    const handleAssignTask = () => {
      const body = {
        task_id: stateAssignTask.id,
        note: stateAssignTask.note,
        exec_u_id: stateAssignTask.exec_u_id.u_id
      }
      postAssignTask(body);
    }
  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isUpdateInfoLead,setIsUpdateInfoLead] = useState(false);
   const [isUpdateInfo,setIsUpdateInfo] = useState(false);
  useEffect(() => {
    handlePostpostInfoDetailCustomer(lead_id);
    dispatch(getListNotesLog({
      node_type: dataAddNote.node_type,
      id:lead_id
    }));
     dispatch(getListAnswerMaster({
      lead_id: lead_id
    }));
    dispatch(getListTags({
      object_id: lead_id,
      object_type:"lead"
    }));
  
    setFilterTask({
      ...filterTask,
      id: lead_id.toString(),
    })
    setStateLeadId(lead_id)
    setFormData({
      ...formData,
      lead_id: lead_id
    })
    setDataLog({ ...dataLog, lead_id: lead_id, })
    setDataAddNote({
      ...dataAddNote,
      id: lead_id,
    })
    dispatch(getListNotesLog({
      node_type: dataAddNote.node_type,
      id: lead_id
    }));
     dispatch(postAdsAMarketingMasterMarketingMaster())
  }, [isUpdateInfo]);
  useEffect(() => {
    setDataListTask(listTask);
  }, [listTask]);
  useEffect(() => {
    setDataListGuid(listGuid);
  }, [listGuid]);
  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case 'follow_staff':
        uniqueValues = Array.from(new Set((listCSKH || [])?.map((item: any) => item?.label).filter(Boolean)));
        break;
      default: break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  }

  useEffect(() => {
    setFilterColumn({
      ...filterColumn,
      employeeFollow: handleGetOptionFilterColumn('follow_staff'),
    });

  }, [dataBeforeExam, listBeforeExams]);

  useEffect(() => {
    setDataBeforeExam(listBeforeExams);
    // setCurrentItemOfTable(listBeforeExams?.data?.data);
    // setCountCustomer(listBeforeExams?.data?.count);
    document.title = "Thông tin lead | CRM";
  }, [listBeforeExams]);

  /* CALL API */
  const [stateInfoDetailCustomer, setStateInfoDetailCustomer] = useState<any>([])
  
  const { mutate: postInfoDetailCustomer } = useMutation(
    "post-footer-form",
    (data: any) => getInfoDetailCustomer(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setStateInfoDetailCustomer(data?.data);
          console.log(data?.data?.lead?.step_id - 1)
          setCurrentStep(data?.data?.lead?.step_id - 1);
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlePostpostInfoDetailCustomer = (data: any) => {
    const body = {
      lead_id: data,
    }
    postInfoDetailCustomer(body);
  }
  //
  const { mutate: postInfoLeadFPC } = useMutation(
    "post-footer-form",
    (data: any) => getInfoOfLeadFromPC(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          handlePostpostInfoDetailCustomer(lead_id);
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlePostInfoLeadFPC = () => {
    const body = {
      lead_id: lead_id,
    }
    postInfoLeadFPC(body);
  }
  // call API lấy thông tin chi tiết 1 bài hướng dẫn
  const [openModalGuidDetail, setOpenModalGuidDetail] = useState(false);
  const [guidDetail, setGuidDetail] = useState<any>([]);
  const { mutate: postInfoGuid } = useMutation(
    "post-footer-form",
    (data: any) => getInfoDetailGuid(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setGuidDetail(data?.data);
          setOpenModalGuidDetail(true);
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postChageS } = useMutation(
    "post-footer-form",
    (data: any) => postChangeStep(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          handlePostpostInfoDetailCustomer(stateLeadId);
          dispatch(getListTask({ ...filterTask } as unknown as any));
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlePostChangeStep = (id:any) => {
    const body = {
      lead_id: stateLeadId,
      step_id: id,
    }
    postChageS(body)
  }
  const { mutate: handlePostLog } = useMutation(
    "post-footer-form",
    (data: any) => postNoteLog(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setDataLog({  node_type: listTouchPointLogType[0],
            note_node_content: "",
            note_attach_url: "",
            lead_id: undefined as unknown as number,
          })
          dispatch(getListNotesLog({
            node_type: dataAddNote.node_type,
            id: dataAddNote?.id
          }));
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleGetInfoDG = (data: string) => {
   
    postInfoGuid(data);
  }

  //
  // call API lấy thông tin chi tiết 1 bài hướng dẫn
  const [dataFilterGPT, setDataFilterGPT] = useState({
    opemnModal: false,
    prompt: '',
  });
  const [dataGPT, setDataGPT] = useState<any>([]);
  const [isLoadingGPT, setLoadingGPT] = useState(false);
  const { mutate: postDataGPT } = useMutation(
    "post-footer-form",
    (data: any) => getDataGPT(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setLoadingGPT(false);
          setDataGPT(data?.data);
         
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlePostAssign = () => {
    const body = {
      lead_id: stateDataAssign.lead_id,
      follow_employee_id: stateDataAssign.follow_employee_id.value
    }
    postAssignE(body);
  }
  const { mutate: postAssignE } = useMutation(
    "post-footer-form",
    (data: any) => postAssignAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          handlePostpostInfoDetailCustomer(lead_id);
          setStateDataAssign({
            openModal: false,
            follow_employee_id: listUsers[0],
            lead_id:lead_id
          })
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleGetDataGPT = () => {
    const body = {
      prompt: dataFilterGPT.prompt,
    }
    setLoadingGPT(true);
    postDataGPT(body);
  }
  //
  const { mutate: getDataPancake } = useMutation(
    "post-footer-form",
    (data: any) => getListBeforeExamsFromPC(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListToStoreBeforeExams({
        ...bodyGetList,
          
           } as unknown as any)
           );
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlegetDataPancake = () => {
    const body = {
      system: "pancake",
    }
    getDataPancake(body);
  }
  const { mutate: printAppointmentServicepoint } = useMutation(
    "post-footer-form",
    (data: string) => postPrintAppointmentServicepoint(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          previewBlobPDFOpenLink(data?.data, data?.message);
        } else {
          toast.info(data?.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: getCustomerIdToGetCurrentAppointment } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {

        if (data?.data?.master?.master_id) {
          printAppointmentServicepoint(data?.data?.master?.master_id);
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: postSaveCustomerAdd } = useMutation(
    "post-footer-form",
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setIsOpenFormContact(false);
          setTableLoading(false);
        
         dispatch(
           getListToStoreBeforeExams({
       ...bodyGetList,
         
          } as unknown as any)
          );
          toast.success(
            isUpdateCustomer
              ? "Cập nhật thông tin khách hàng thành công"
              : "Thêm khách hàng thành công"
          );

          setIsClosePopup(true);
          setIsOpenPopup(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
          setIsOpenPopup(false);
        }
      },
      onError: (e) => {
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const { mutate: postConvertCustomer } = useMutation(
    "post-footer-form",
    (data: any) => postConvertCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setDataBeforeExam(undefined as any);
          setTableLoading(true);
          setIsClosePopupC(true);
          setIsOpenPopupC(false);
          setIsOpenFormContact(false);
          handlePostpostInfoDetailCustomer(lead_id);
          setIsLoadingB(false)
          window.open(
            `/customer-info/id/${data.data.customer.customer_id}/history-interaction`,
            "_blank"
          );
          toast.success(
            "Chuyển đổi thành công"
          );

        } else {
          toast.error(data.message);
          setIsClosePopupC(true);
          setIsOpenPopupC(false);
        }
      },
      onError: (e) => {
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const { mutate: postSaveCustomerUpdate } = useMutation(
    "post-footer-form",
    (data: any) => postUpdateCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
       
          
          toast.success(
          "Cập nhật thông tin thành công"
          );
          handlePostpostInfoDetailCustomer(stateLeadId);
          setIsClosePopupU(true);
          setIsOpenPopupU(false);
        } else {
          toast.error(data.message);
          setIsClosePopupU(true);
          setIsOpenPopupU(false);
        }
      },
      onError: (e) => {
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const { mutate: getCustomerByCustomerId } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {
        setCustomerUpdate(data.data);
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: assignedToMe } = useMutation(
    "post-footer-form",
    (id: string) => postAssignedToID(id),
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postTagCustomer } = useMutation(
    "post-footer-form",
    (data: any) => postObjectTag(data),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsAddTag(false);
        setTableLoading(false);
        dispatch(getListTags({
          object_id: lead_id,
          object_type:"lead"
        }));
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        setIsAddNote(false);
      
        setContentNote("");
        toast.success(data?.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* END CALL API */
  
  const handleAddCustomer = async (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        setDataBeforeExam(undefined as any);
        setTableLoading(true);
        setIsClosePopup(true);
        postSaveCustomerAdd(data);
        setIsOpenPopup(false);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const handleConvertCustomer = async (data: any) => {
    return new Promise((resolve, reject) => {
      try {
       
        postConvertCustomer(data);
        
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const handleUpdateCustomer = (data: any) => {
    return new Promise((resolve, reject) => {
      try {
        setTableLoading(true);
        postSaveCustomerUpdate(data);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
  const { mutate: postAddTask } = useMutation(
    "post-footer-form",
    (data: any) => postAddTaskOfOneCustomer(data),
    {
      onSuccess: (data) => {
        setIsAddNote(false);
        setFormData({
          ...formData,
          task_his_id: null,
          remind_datetime: undefined as unknown as Date,
          task_description: undefined as unknown as string,
          task_name: undefined as unknown as DropdownData,
          note: undefined as unknown as string,
          exec_u_id: employeeId,
          category_id: undefined as unknown as DropdownData,
          id: null,
        });
        setIsAddTask(false);setIsLoadingGetService(false);
        dispatch(getListTask({ ...filterTask } as unknown as any));
        toast.success(data?.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleAddTask = async () => {
    
   
      setIsLoadingGetService(true);
     const body = {
             task_type_id: formData?.category_id,
             assign_employee_id:stateEmployeeId,
             exec_employee_id: stateEmployeeId,
             lead_id: formData?.lead_id,
             task_name: formData?.task_name,
             task_description: formData?.task_description,
             note: formData?.note,
             employee_team_id: "CSKH",
             status: "inprogress",
             remind_datetime: moment(formData?.remind_datetime).format(
               "YYYY-MM-DDTHH:mm:ss"
             ),
     
             task_id: formData?.id || null,
         };
      await postAddTask(body);
  
  };
  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    // dispatch(
    //   getListToStoreBeforeExams({
    //     processKeyId: "all",
    //     launchSourceID: isUpdateBeforeExams
    //       ? filterData?.origin?.map((i: any) => i?.id).join(",")
    //       : "all",
    //     launchSourceType: filterData.originType?.value,
    //     launchSourceGroup: filterData.originGroup?.value,
    //     followStaffId: "all",
    //     fromDay: moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00"),
    //     toDay: moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59"),
    //     keyWord: isUpdateBeforeExams ? filterData?.key : "",
    //     pages,
    //     limits: size || 30,
    //   } as unknown as PayloadGetBeforeExams)
    // );
  };


  const handleUpdateTag = async (data: TransferItemType[]) => {
    return new Promise((resolve, reject) => {
      try {
        const tagIds = data.map(item => item.tag_id); // 👉 [5, 3, 4]
        const body = {
          object_id: lead_id,
          object_type: "lead",
          tag_ids: tagIds
        }
        setTableLoading(true);
        postTagCustomer(body);
        resolve(true);
      } catch (error) {
        console.error("🚀 ~ file: index.tsx:374:", error);
        reject(error);
      }
    });
  };

  const handleAddNoteCustomer = async () => {
    const { customer_id } = customerUpdate;
    const body = {
      customer_id,
      cs_node_type: "cs",
      cs_node_content: contentNote,
    };
    await postNoteCustomerById(body);
  };

  const handleFilterAllowStatistic = (type: string) => {
    // dispatch(
    //   getListToStoreBeforeExams({
    //     processKeyId: type,
    //     launchSourceID:
    //       filterData?.origin?.map((i: any) => i?.id).join(",") || "all",
    //     launchSourceType: filterData.originType?.value,
    //     launchSourceGroup: filterData.originGroup?.value,
    //     followStaffId: "all",
    //     keyWord: filterData?.key || "",
    //     pages: 1,
    //     limits: 30,
    //     fromDay: isUpdateBeforeExams
    //       ? moment(filterData?.fromDay).format("YYYY-MM-DDT00:00:00")
    //       : moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    //     toDay: isUpdateBeforeExams
    //       ? moment(filterData?.toDay).format("YYYY-MM-DDT23:59:59")
    //       : moment(new Date()).format("YYYY-MM-DDT23:59:59"),
    //     stausRes: "all",
    //   } as unknown as PayloadGetBeforeExams)
    // );
  };
  const [stateLeadId,setStateLeadId] = useState(0)
  const tableColumns = [
    // {
    //   title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
    //   align: "center",
    //   dataIndex: "index",
    //   width: 40,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any, index: any) => (
    //     <div className="ant-table-column_item">
    //       < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
    //     </div>
    //   ),
    // },
      {
      title: (<Typography content="Họ tên" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "lead_name",
      align: "center",
      // filters: [
      //   { text: 'Customer (Đã đặt lịch)', value: 'customer' },
      //   { text: 'Lead (Để lại thông tin nhưng chưa đặt lịch)', value: 'lead' },
      //   { text: 'Contact (Chưa có thông tin)', value: 'contact' },
      //   ],
      width: 200,
      // onFilter: (value: any, record: any) => {
      //   if (value === 'customer' && record.is_customer_converted) {
      //     return record;
      //   }
      //   if (value === 'lead' && !record.is_customer_converted && record.customer_phone) {
      //     return record;
      //   }
      //   if (value === 'contact' && !record.is_customer_converted && !record.customer_phone) {
      //     return record;
      //   }
      // },

      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          if (data.customer_id !== null) {
            window.open(
              `/customer-info/id/${data.customer_id}/history-interaction`,
              "_blank"
            );

          } else {
            handlePostpostInfoDetailCustomer(data?.lead_id);
            setFilterTask({
              ...filterTask,
              id: data?.lead_id,
            })
            setStateLeadId(data?.lead_id)
            setFormData({
              ...formData,
              lead_id: data?.lead_id,
            })
            setDataLog({ ...dataLog, lead_id: data?.lead_id, })
            setDataAddNote({
              ...dataAddNote,
              id: data?.lead_id,
            })
            dispatch(getListNotesLog({
              node_type: dataAddNote.node_type,
              id: data?.lead_id
            }));
          }
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "justify", "uppercase"]}
          />
        
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "lead_first_datetime",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          if (data.customer_id !== null) {
            window.open(
              `/customer-info/id/${data.customer_id}/history-interaction`,
              "_blank"
            );

          } else {
            handlePostpostInfoDetailCustomer(data?.lead_id);
            setFilterTask({
              ...filterTask,
              id: data?.lead_id,
            })
            setStateLeadId(data?.lead_id)
            setFormData({
              ...formData,
              lead_id: data?.lead_id,
            })
            setDataLog({ ...dataLog, lead_id: data?.lead_id, })
            setDataAddNote({
              ...dataAddNote,
              id: data?.lead_id,
            })
            dispatch(getListNotesLog({
              node_type: dataAddNote.node_type,
              id: data?.lead_id
            }));
          }
        }}>
          <Typography
            content={record ? moment(record).format("HH:mm - DD/MM/YYYY") : ''}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
 
    {
      title: (<Typography content="Trạng thái chuyển đổi" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "status",
      align: "center",
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          if (data.customer_id !== null) {
            window.open(
              `/customer-info/id/${data.customer_id}/history-interaction`,
              "_blank"
            );

          } else {
            handlePostpostInfoDetailCustomer(data?.lead_id);
            setFilterTask({
              ...filterTask,
              id: data?.lead_id,
            })
            setStateLeadId(data?.lead_id)
            setFormData({
              ...formData,
              lead_id: data?.lead_id,
            })
            setDataLog({ ...dataLog, lead_id: data?.lead_id, })
            setDataAddNote({
              ...dataAddNote,
              id: data?.lead_id,
            })
            dispatch(getListNotesLog({
              node_type: dataAddNote.node_type,
              id: data?.lead_id
            }));
          }
        }}>
          <Typography content={record} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
  ];
  const tableListTask = [
    // {
    //   title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
    //   align: "center",
    //   dataIndex: "index",
    //   width: 40,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any, index: any) => (
    //     <div className="ant-table-column_item">
    //       < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
    //     </div>
    //   ),
    // },
      {
      title: (<Typography content="Người thực hiện" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "exec_employee_name",
      align: "center",
      // filters: [
      //   { text: 'Customer (Đã đặt lịch)', value: 'customer' },
      //   { text: 'Lead (Để lại thông tin nhưng chưa đặt lịch)', value: 'lead' },
      //   { text: 'Contact (Chưa có thông tin)', value: 'contact' },
      //   ],
      width: 150,
      // onFilter: (value: any, record: any) => {
      //   if (value === 'customer' && record.is_customer_converted) {
      //     return record;
      //   }
      //   if (value === 'lead' && !record.is_customer_converted && record.customer_phone) {
      //     return record;
      //   }
      //   if (value === 'contact' && !record.is_customer_converted && !record.customer_phone) {
      //     return record;
      //   }
      // },

      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          setFormData({
                       ...formData,
                       task_his_id: null,
                       remind_datetime: data.remind_datetime,
                       task_description: data.task_description,
                       task_name: data.task_name,
                       note: undefined as unknown as string,
                       exec_u_id: data.own_u_id,
                       category_id:data.category_id,
                       id: data.task_id,
                       assign: undefined as unknown as DropdownData,
                       personCharge: data.own_u_id,
                       type: data.status,
                     
                     });
                     setIsAddTask(true)
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "justify", "uppercase"]}
          />
        
        </div>
      ),
    },
    {
      title: (<Typography content="Chúc vụ" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "own_team_name",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
           setFormData({
                       ...formData,
                       task_his_id: null,
                       remind_datetime: data.remind_datetime,
                       task_description: data.task_description,
                       task_name: data.task_name,
                       note: undefined as unknown as string,
                       exec_u_id: data.own_u_id,
                       category_id:data.category_id,
                       id: data.task_id,
                       assign: undefined as unknown as DropdownData,
                       personCharge: data.own_u_id,
                       type: data.status,
                     
                     });
                     setIsAddTask(true)
        }}>
          <Typography
            content={record}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Tên công việc" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "task_name",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
           setFormData({
                       ...formData,
                       task_his_id: null,
                       remind_datetime: data.remind_datetime,
                       task_description: data.task_description,
                       task_name: data.task_name,
                       note: undefined as unknown as string,
                       exec_u_id: data.own_u_id,
                       category_id:data.category_id,
                       id: data.task_id,
                       assign: undefined as unknown as DropdownData,
                       personCharge: data.own_u_id,
                       type: data.status,
                     
                     });
                     setIsAddTask(true)
        }}>
          <Typography
            content={record}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Mô tả công việc" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "task_description",
      align: "center",
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
           setFormData({
                       ...formData,
                       task_his_id: null,
                       remind_datetime: data.remind_datetime,
                       task_description: data.task_description,
                       task_name: data.task_name,
                       note: undefined as unknown as string,
                       exec_u_id: data.own_u_id,
                       category_id:data.category_id,
                       id: data.task_id,
                       assign: undefined as unknown as DropdownData,
                       personCharge: data.own_u_id,
                       type: data.status,
                     
                     });
                     setIsAddTask(true)
        }}>
          <Typography content={record} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Ghi chú" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:5}} />),
      dataIndex: "task_last_note",
      align: "center",
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
        style={{justifyContent:"flex-start", paddingLeft:10}}
          onClick={() => {
           setFormData({
                       ...formData,
                       task_his_id: null,
                       remind_datetime: data.remind_datetime,
                       task_description: data.task_description,
                       task_name: data.task_name,
                       note: undefined as unknown as string,
                       exec_u_id: data.own_u_id,
                       category_id:data.category_id,
                       id: data.task_id,
                       assign: undefined as unknown as DropdownData,
                       personCharge: data.own_u_id,
                       type: data.status,
                     
                     });
                     setIsAddTask(true)
        }}>
          <Typography content={record} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
        {
          title: (
            <Typography content="Trạng thái" modifiers={["14x20", "500", "center", "main"]} />
          ),
          dataIndex: "status",
          align: "center",
          width:100,
          className: "ant-table-column_wrap",
      
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              onClick={() => {
                setFormData({
                  ...formData,
                  task_his_id: null,
                  remind_datetime: data.remind_datetime,
                  task_description: data.task_description,
                  task_name: data.task_name,
                  note: undefined as unknown as string,
                  exec_u_id: data.own_u_id,
                  category_id:data.category_id,
                  id: data.id,
                  assign: undefined as unknown as DropdownData,
                  personCharge: data.own_u_id,
                  type: data.status,
                
                });
                setIsAddTask1(true)
              }}
            >
            <Typography
      content={
        record === "inprogress"
          ? "Đang thực hiện"
          : record === "done"
          ? "Đã hoàn thành"
          : record === "delay"
          ? "Dời ngày"
          : record === "canceled"
          ? "Đã hủy"
          : "---"
      }
      modifiers={["14x20", "400", "center"]}  styles={{fontSize:13}}
    />
            </div>
          ),
        },
        {
          title: (
            <Typography content="" modifiers={["14x20", "500", "center", "main"]} />
          ),
          dataIndex: "status",
          align: "center",
          width:50,
          className: "ant-table-column_wrap",
      
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              onClick={() => {
                setStateChangeStatusTask({
                  ...stateChangeStatusTask,
                 id: data.task_id,
                  openModal: true
                })
            }}
            >
                <CTooltip
                    placements="top"
                    title="Đổi trạng thái"
                    colorCustom="#04566e"
                  >
      <svg
        fill="#00556e"
        width="25px"
        height="25px"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24,24v2h2.4592A5.94,5.94,0,0,1,22,28a6.0066,6.0066,0,0,1-6-6H14a7.9841,7.9841,0,0,0,14,5.2651V30h2V24Z" />
        <path d="M22,14a8.04,8.04,0,0,0-6,2.7349V14H14v6h6V18H17.5408A5.94,5.94,0,0,1,22,16a6.0066,6.0066,0,0,1,6,6h2A8.0092,8.0092,0,0,0,22,14Z" />
        <path d="M12,28H6V24H8V22H6V17H8V15H6V10H8V8H6V4H24v8h2V4a2,2,0,0,0-2-2H6A2,2,0,0,0,4,4V8H2v2H4v5H2v2H4v5H2v2H4v4a2,2,0,0,0,2,2h6Z" />
        <rect
          width="32"
          height="32"
          fill="none"
        />
      </svg>    </CTooltip>    </div>
          ),
        },
        {
          title: (
            <Typography content="" modifiers={["14x20", "500", "center", "main"]} />
          ),
          dataIndex: "status",
          align: "center",
          width:50,
          className: "ant-table-column_wrap",
      
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              onClick={() => {
                setStateAssignTask({
                  ...stateAssignTask,
                  openModal: true,
                  id: data.task_id,
                })
              }}
            >
                 <CTooltip
                    placements="top"
                    title="Chuyển nhân viên"
                    colorCustom="#04566e"
                  >
              <svg
        height="25px"
        width="25px"
        viewBox="0 0 489.8 489.8"
        xmlns="http://www.w3.org/2000/svg"
        fill="#00556e"
        stroke="#00556e"
      >
        <g>
          <path d="M480.7,454.75v-24.7c0-5.2-2.3-10.2-6.3-13.5c-22.3-18.3-46.3-30.5-51.2-32.9c-0.6-0.3-0.9-0.8-0.9-1.4v-34.7
            c4.4-2.9,7.2-7.9,7.2-13.5v-36c0-17.9-14.5-32.4-32.4-32.4h-7.8c-17.9,0-32.4,14.5-32.4,32.4v36c0,5.6,2.9,10.6,7.2,13.5v34.7
            c0,0.6-0.3,1.2-0.9,1.4c-4.9,2.4-28.9,14.5-51.2,32.9c-4,3.3-6.3,8.3-6.3,13.5v24.7" />
          <path d="M96.8,234.35c-5,0-9.1,4.1-9.1,9.1v36c0,42.9,34.9,77.8,77.8,77.8h114.4l-15,15c-3.5,3.5-3.5,9.3,0,12.8
            c1.8,1.8,4.1,2.7,6.4,2.7s4.6-0.9,6.4-2.7l30.4-30.4c1.7-1.7,2.7-4,2.7-6.4s-1-4.7-2.7-6.4l-30.4-30.4c-3.5-3.5-9.3-3.5-12.8,0
            s-3.5,9.3,0,12.8l15,15H165.5c-32.9,0-59.7-26.8-59.7-59.7v-36C105.8,238.35,101.8,234.35,96.8,234.35z" />
          <path d="M211.7,147.05c1.8,1.8,4.1,2.7,6.4,2.7c2.3,0,4.6-0.9,6.4-2.7c3.5-3.5,3.5-9.3,0-12.8l-15-15h114.9
            c32.9,0,59.7,26.8,59.7,59.7v36c0,5,4.1,9.1,9.1,9.1s9.1-4.1,9.1-9.1v-36c0-42.9-34.9-77.8-77.8-77.8H209.6l15-15
            c3.5-3.5,3.5-9.3,0-12.8s-9.3-3.5-12.8,0l-30.4,30.4c-1.7,1.7-2.7,4-2.7,6.4s1,4.7,2.7,6.4L211.7,147.05z" />
          <path d="M9.3,233.25c5,0,9.1-4.1,9.1-9.1v-24.7c0-2.5,1.1-4.9,3-6.5c21.6-17.7,45-29.5,49.4-31.7
            c3.6-1.8,6-5.5,6-9.6v-34.7c0-3-1.5-5.9-4-7.5c-2-1.3-3.2-3.6-3.2-6v-36c0-12.9,10.5-23.4,23.3-23.4h7.7c12.9,0,23.3,10.5,23.3,23.4v36
            c0,2.4-1.2,4.6-3.2,6c-2.5,1.7-4,4.5-4,7.5v34.7c0,4,2.3,7.8,6,9.6c4.5,2.2,27.9,14,49.4,31.7c1.9,1.6,3,3.9,3,6.5v24.7
            c0,5,4.1,9.1,9.1,9.1s9.1-4.1,9.1-9.1v-24.7c0-8-3.5-15.4-9.7-20.5c-19.1-15.7-39.6-27.1-48.8-31.9v-25.9
            c4.6-4.7,7.2-11,7.2-17.7v-36c0-22.9-18.6-41.5-41.5-41.5h-7.7c-22.9,0-41.5,18.6-41.5,41.5v36c0,6.7,2.6,13,7.2,17.7v25.9
            c-9.2,4.8-29.7,16.2-48.8,31.9c-6.1,5-9.7,12.5-9.7,20.5v24.7C0.2,229.25,4.3,233.25,9.3,233.25z" />
          <path d="M306.3,409.55c-6.1,5-9.7,12.5-9.7,20.5v24.7c0,5,4.1,9.1,9.1,9.1s9.1-4.1,9.1-9.1v-24.7c0-2.5,1.1-4.9,3-6.5
            c21.6-17.7,45-29.5,49.4-31.7c3.6-1.8,6-5.5,6-9.6v-34.7c0-3-1.5-5.9-4-7.5c-2-1.3-3.2-3.6-3.2-6v-36c0-12.9,10.5-23.4,23.3-23.4h7.7
            c12.9,0,23.4,10.5,23.4,23.4v36c0,2.4-1.2,4.6-3.2,6c-2.5,1.7-4,4.5-4,7.5v34.7c0,4,2.3,7.8,6,9.6c4.5,2.2,27.9,14,49.4,31.7
            c1.9,1.6,3,3.9,3,6.5v24.7c0,5,4.1,9.1,9.1,9.1s9.1-4.1,9.1-9.1v-24.7c0-8-3.5-15.4-9.7-20.5c-19.1-15.7-39.6-27.1-48.8-31.9v-25.9
            c4.6-4.7,7.2-11,7.2-17.7v-36c0-22.9-18.6-41.5-41.5-41.5h-7.7c-22.9,0-41.5,18.6-41.5,41.5v36c0,6.7,2.6,13,7.2,17.7v25.9
            C345.9,382.45,325.5,393.85,306.3,409.55z" />
        </g>
      </svg></CTooltip>
            </div>
          ),
        }
  ];
  const tableListGuid = [
   
      {
      title: (<Typography content="Tiêu đề hướng dẫn" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "guid_title",
      align: "center",
   
      width: 200,


      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          handleGetInfoDG(data?.guid_id);
        
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "justify", "uppercase"]}
          />
        
        </div>
      ),
    },
    {
      title: (<Typography content="Tên danh mục" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "category_name",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          handleGetInfoDG(data?.guid_id);
        }}>
          <Typography
            content={record}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Người đăng" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "guid_u_name",
      align: "center",
      sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(),
      showSorterTooltip: false,
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          handleGetInfoDG(data?.guid_id);
        }}>
          <Typography
            content={record}
            modifiers={["13x18", "400", "center"]}
          />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày đăng" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "guid_update_datetime",
      align: "center",
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          handleGetInfoDG(data?.guid_id);
        }}>
          <Typography content={moment(record).format("DD-MM-YYYY")} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Trạng thái" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "guid_status",
      align: "center",
      width: 150,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
        
          onClick={() => {
            handleGetInfoDG(data?.guid_id);
        }}>
          <Typography content={record === "pending" ? "Chưa giải quyết" : record === "new" ? "Mới" : "Phân ra"} modifiers={["14x20", "400", "center"]} />
        </div>
      ),
    },
  ];

  ///
  const [isSelectService, setIsSelectService] = useState(false);
     const storageServicesAllowGroup = localStorage.getItem(
      "listServicesAllowGroup"
    );
     const [listServicesAllowGroup, setListServicesAllowGroup] = useState<any[]>(
        storageServicesAllowGroup ? JSON.parse(storageServicesAllowGroup || "") : []
  );
   const storagePackageWithItems = localStorage.getItem("packagesItems");
     const [statePackagesWithItem, setstatePackagesWithItem] = useState<any[]>(
        storagePackageWithItems ? JSON.parse(storagePackageWithItems) : []
    );
     const [dataForm, setDataForm] = useState<DataForm>({
       lead_id: stateInfoDetailCustomer?.lead?.lead_id,
       saleorder_ref:"",
        name: stateInfoDetailCustomer?.lead?.lead_name,
        isCheckInsurance: false,
        gender: undefined as unknown as DropdownData,
        dayOfBirth:stateInfoDetailCustomer?.lead?.lead_yob?.toString(),
        insuranceObjectRatio: "80",
        discount: 0,
        typeBooking:  {
          color: '#dc3545',
          department_id: 'PK01',
          id: 'KHAMDV122301',
          index: 3,
          is_exams: false,
          is_register_package: false,
          is_register_subclinical: true,
          label: 'Không gói dịch vụ',
          register_type_id: 'KTQ',
          value: 'services',
       } as GroupRadioType,
       services: [] // Mảng rỗng ban đầu
  
    
     });
   const [serviceSelected, setServiceSelected] = useState<ServiceItem[]>([]);
    useEffect(() => { 
      setDataForm({
        ...dataForm,
        lead_id:stateInfoDetailCustomer?.lead?.lead_id,
        name: stateInfoDetailCustomer?.lead?.lead_name,
         dayOfBirth:stateInfoDetailCustomer?.lead?.lead_yob?.toString()
         
      })
    },[stateInfoDetailCustomer?.lead])
      const [errorForm, setErrorForm] = useState({
        name: "",
        isCheckInsurance: "",
        gender: "",
        dayOfBirth: "",
        insuranceObjectRatio: "",
        discount: "",
        service: ""
      });
     const clearStateErrorFormAll = () => {
      setErrorForm({
        ...errorForm,
        name: "",
      
        dayOfBirth: "",
     
    
      });
   
    
    };
  const [isSeenPrice, setIsSeenPrice] = useState(false)
   const [loadingP, setLoadingP] = useState(false)
      const clearStateErrorForm = (title: string) => {
      setErrorForm({ ...errorForm, [title]: "" });
  };
  const [selectedService, setSelectedService] = useState<DropdownData | undefined>(undefined);
  const [openSelect, setOpenSelect] = useState(true);
  const [packageSelected, setPackageSelected] = useState<DropdownData>();
    const storagePackages = localStorage.getItem("packages");
    const [listPackages, setListPackages] = useState<DropdownData[]>(
        storagePackages ? JSON.parse(storagePackages || "") : []
    );
       const handleConvertServiceSelected = (
          service: ServiceItem,
          checked: boolean
        ) => {
          // khi bấm checkbox của từng dịch vụ, nếu mà dịch vụ đó chưa được chọn thì checked == true và tiến hành thêm vào mảng serviceSelected
          //  - còn nếu nó đã được chọn và khi bấm vào nó đồng nghĩa dịch vụ đó khi đó có checked == false và thực hiện câu lệnh else và tiên hành tạo 1 mảng mới lọc ra dịch vụ có id = với id truyền vào
          //      + thì lúc này mảng mới sẽ không còn dịch vụ đó và kế tiếp là thêm mảng mới được tạo vào mảng serviceSelected
         
          if (checked) {
            setServiceSelected([service, ...serviceSelected]);
          } else {
            const newList = serviceSelected.filter(
              (i) => i.service_id !== service.service_id
            );
            
            setServiceSelected(newList);
          }
    };
     const handleValidateForm = () => {
    try {
      if (
        !dataForm.name.trim() ||
        !dataForm.discount.toString().trim() ||
        !dataForm.gender || // Kiểm tra nếu gender là undefined
        !dataForm.gender.value.trim() // Kiểm tra giá trị của gender
      ) {
        setErrorForm({
          ...errorForm,
         
        });
  
        return false;
      }
      return true;
    } catch (err) {
      console.error(" 🚀- DaiNQ - 🚀: -> handleValidateForm -> err:", err);
    }
    };
     const onSubmit = () => {
          if(serviceSelected.length === 0) {
            toast.error("Vui lòng chọn dịch vụ");
            return;
          }
        //  if (!handleValidateForm()) return;
         setLoadingP(true)
          const request = {
            fullname: dataForm.name,
            lead_id: dataForm.lead_id,
            saleorder_ref: dataForm.saleorder_ref,
            yob: dataForm.dayOfBirth,
            gender: dataForm?.gender?.label || "",
            is_insurance: dataForm.isCheckInsurance,
            insurance_object_ratio:  dataForm.isCheckInsurance === true ? parseInt(dataForm.insuranceObjectRatio.toString(), 10) : 0,
            discount:  parseInt(dataForm.discount.toString(), 10) ,
            services: serviceSelected.map((item) => {
              return { service_id: item.service_id,quantity:1,discount:item.discount }
          })
         };
         postCreateQuoteCustomer(request)
        //  dispatch(getAddPriceQuote(request as any))
        //  clearStateForm();
        //  setServiceSelected([]);
        //   if (handleAddCustomer) {
        //   
        //   clearGastrointestinal();
        //   setCustomerPortrait(false);
        //   
        //   handleAddCustomer(request);
        // }
    };
       const { mutate: postCreateQuoteCustomer } = useMutation(
      'post-footer-form',
      (data: any) => postSavePriceQuoteL(data),
      {
        onSuccess: (data) => {
         setLoadingP(false);
          setIsSelectService(false);
     handlePostpostInfoDetailCustomer(lead_id);
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
    );
    const [dataRemove, setDataRemove] = useState({
      isOpenR: false,
      saleorder_ref: dataForm.saleorder_ref,
    })
    const handleRemoveQuoteCustomer = () => { 
      const request = {
        saleorder_ref: dataRemove.saleorder_ref,
      }
      postRemoveQuoteCustomer(request)
    }
    const { mutate: postRemoveQuoteCustomer } = useMutation(
      'post-footer-form',
      (data: any) => postRemovePriceQuote(data),
      {
        onSuccess: (data) => {
           setDataRemove({
              ...dataRemove,
              isOpenR: false,
              saleorder_ref:"",
  
                      })
           handlePostpostInfoDetailCustomer(lead_id);
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
    );
      const convertServiceSelected: any[] = [];
    const convertServiceSelected2: any[] = [];
    const [totalService, setTotalService] = useState("Chưa chọn dịch vụ");
    const columnTableServicesSelectIS = [
        // Đây là button xóa
        {
          title: (
            <Typography
              content="Dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          width: 50,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
             
               
                  <Icon
                iconName="delete_item"
                onClick={
                  () => {
                  const newList = serviceSelected.filter(
                    (i) => i.service_id !== data.service_id
                  );
                  setServiceSelected(newList);
                 
                  }
                }
                  />
             
              
            </div>
          ),
        },
        // đây là tên dịch vụ đã chọn
        {
          title: (
            <Typography
              content="Dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          showSorterTooltip: false,
          className: "ant-table-column_wrap",
          width:300,
          render: (record: any, data: any) => (
            <div
          style={{
            justifyContent: "start",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden",    // Xử lý tràn nếu cần
            maxWidth:"300px"
          }}
          className="ant-table-column_item"
        
        >
          <Typography
            content={record} // Hiển thị nội dung đầy đủ
            modifiers={['13x18', '500', 'left', 'main']}
            styles={{
              display: 'block',     // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
               marginLeft:"15px"
            }}
          />
        </div>
          ),
          },
           {
          title: (
            <Typography
              content="ĐVT"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
           align: "left",
          width:80,
          showSorterTooltip: false,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                content="Lần"
                modifiers={["14x20", "400", "center", "main"]}
              />
            </div>
          ),
        },
           {
          title: (
            <Typography
              content="Số lượng"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          showSorterTooltip: false,
            width:60,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                content="1"
                modifiers={["14x20", "400", "center", "main"]}
              />
            </div>
          ),
        },
      
         {
          title: (
            <Typography
              content="Giá dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_prices",
          align: "center",
          width: 100,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div className="ant-table-column_item" style={{justifyContent:"end"}}>
              <Typography
                content={record?.toLocaleString("vi-VN")}
                modifiers={["14x20", "400", "center"]}
              />
            </div>
          ),
        },
             {
          title: (
            <Typography
              content="Giá BHYT"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "insurance_service_prices",
          align: "center",
          width: 100,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div className="ant-table-column_item" style={{justifyContent:"end"}}>
              <Typography
                content={record?.toLocaleString("vi-VN")}
                modifiers={["14x20", "400", "center"]}
              />
            </div>
          ),
        },
          
         {
          title: (
            <Typography
              content="Mức hưởng BHYT"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_prices",
          align: "center",
          width: 100,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
          <div className="ant-table-column_item" style={{justifyContent:"center",}}>
              <Typography
                content={(dataForm.insuranceObjectRatio) + "%"}
                modifiers={["14x20", "400", "center"]}
                styles={{paddingLeft:"10px"}}
    
              />
            </div>
          ),
        },
         
        // đây là giá tiền tưng ứng dịch vụ đó
       
    ];
    const [isUpdateInfo2, setIsUpdateInfo2] = useState(false);
    const [listDataServices, setListDataServices] = useState("");
  const [dataSaleOrderRef, setDataSaleOrderRef] = useState("");
  console.log(dataSaleOrderRef)
  
    const [isClosePopup1, setIsClosePopup1] = useState(false);
     const [isUpdateInfo1,setIsUpdateInfo1] = useState(false);
    const [isLoadingB1, setIsLoadingB1] = useState(false)
      const { mutate: postBookCustomer } = useMutation(
      'post-footer-form',
      (data: any) => postBookCustomerAPI(data),
      {
        onSuccess: (data) => {
          if (data.status) {
             handlePostpostInfoDetailCustomer(lead_id);
            toast.success(data.message);
            setIsClosePopup(true);
            setIsUpdateInfo(false);
            setIsUpdateInfo1(false);
            setIsLoadingB(false)
          } else {
            toast.error(data.message);
            setIsClosePopup(true);
               setIsUpdateInfo(false);
            setIsUpdateInfo1(false);
          }
        },
        onError: (e) => {
          toast.error('Đã có lỗi xảy ra ...!');
        }
      }
    );
     const handleBookingCustomer = async (data: any) => {
      await postBookCustomer(data);
    };
     const memoriesTableSelectedIS = useMemo(() => {
        // giải thích logic thuật toán:
        // - VD có 3 object
        //   + Vòng lặp đẩu tiên, kiểm tra xem trong checkGroupIsExit có service_group_id này chưa, nếu chưa thì newGroup được tạo và convertServiceSelected sẽ có nhóm mới đó
        //   + Vòng lặp 2, nếu checkGroupIsExit vẫn service_group_id k có thì newGroup tiếp tục được thêm vào convertServiceSelected, lúc này convertServiceSelected có 2 object là 2 dịch vụ có service_group khác nhau
        //   + Vòng lặp 3, giả sử object thứ 3 có service_group_id đã có trong checkGroupIsExit thì item hiện tại được thêm vào mảng service_group_item của nhóm hiện có
    
         let total = 0;
        serviceSelected?.map((item, index) => {
          const checkGroupIsExit = convertServiceSelected2.find(
            (i) => i.service_group_id === item.service_group_id
          );
          total += serviceSelected[index]?.service_prices;
          setTotalService(total.toLocaleString("vn-VN"));
          const newGroup = {
            service_group_id: item.service_group_id,
            service_group_name: item.service_group_name,
            service_group_item: [item],
          };
          if (checkGroupIsExit) {
            checkGroupIsExit.service_group_item.push(item);
          } else {
            convertServiceSelected2.push(newGroup);
          }
        });
        return (
          <div className="m-form_add_customer-booking_box_table">
            <div>
                  <div style={{ display: "flex", gap: "10px", padding: "10px", overflowX: "auto" , width:"100%", borderBottom: "1px solid #dcdcdc"}}>
    
                
                    <div
              style={{
                width: `50px`,
                height: "20px",
              
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
                >  </div>
                     <div
              style={{
                width: `480px`,
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                fontSize: "14px",
                    fontWeight: "bold",
                    paddingLeft:"20px"  
               
              }}
                ><span style={{ marginLeft: "10px"}}>Tên dịch vụ</span> </div>
                     <div
              style={{
                width: `60px`,
                height: "20px",
              color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
               paddingLeft:"15px"
              }}
                > Số lượng </div>
                 <div
              style={{
                width: `150px`,
                height: "20px",
              color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                  paddingLeft:"10px"
              }}
                >ĐVT </div>
                 <div
              style={{
                width: `150px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                  
                paddingLeft:"15px"
              }}
                > Giá dịch vụ  </div>
                
                     <div
              style={{
                width: `110px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                 paddingLeft:"50px"
              }}
                > Giá BHYT  </div>
                  <div
              style={{
                width: `160px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                paddingLeft:"10px"
              }}
                > Mức hưởng BHYT  </div>
                  {/* <div
              style={{
                width: `110px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
               justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
              }}
                > Thành tiền</div>
                 <div
              style={{
                width: `100px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
               justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                 paddingLeft:"5px"
              }}
                > BHYT trả </div>
                 <div
              style={{
                width: `100px`,
                height: "20px",
               color: "black",
                display: "flex",
                alignItems: "center",
               justifyContent: "center",
                fontSize: "14px",
                    fontWeight: "bold",
                 paddingLeft:"15px"
              }}
            > KH trả </div> */}
               </div>
            <div style={{height:"550px",maxHeight:"550px",overflowY:"auto"}}>
                 <PublicTable
              className="table_parent"
              // column ở đây là name của service_group_name
              column={[
                {
                  title: "",
                  align: "left",
                  dataIndex: "service_group_name",
                  render: (record: any, data: any) => (
                    <div
                      className="p-booking_schedule_heading"
                      style={{
                        padding: 0,
                      }}
                    >
                      <Typography
                        content={record}
                        modifiers={["16x24", "600", "justify", "blueNavy"]}
                        styles={{
                          paddingLeft: "10px",
                        }}
                      />
                    
                    </div>
                    
                  ),
                },
             
              ]}
              listData={convertServiceSelected2}
              isHideRowSelect
              isHideHeader
              isExpandable={true}
              defaultExpandAllRow={true}
              isPagination={false}
              rowkey="service_group_id"
              expandedRowKeys={
                convertServiceSelected2?.map((i) => i?.service_group_id) ?? []
              }
              // expandedRender là các service_name của các service_group_name được phân định qua 2 dòng code trên
              expandedRender={(
                record: any,
                index: any,
                indent: any,
                expanded: any
              ) => {
                return (
                  <div
                    key={record?.service_group_id}
                    className="m-form_add_customer-booking_box_table_children"
                  >
                    <PublicTableListPrice
                      isSimpleHeader
                      className="table_children"
                      column={columnTableServicesSelectIS}
                      listData={record?.service_group_item ?? []}
                      size="small"
                      scroll={{ x: "max-content", scrollToFirstRowOnChange: false }}
                      isPagination={false}
                      isHideRowSelect
                      isHideHeader
                    />
                    
                  </div>
                );
              }}
              />
              </div>
                <div style={{ display: "flex", gap: "10px", padding: "10px", overflowX: "auto" , width:"100%",borderTop: "1px solid #dcdcdc", justifyContent:"end"}}>
    
                
                     <div
              style={{
                width:"20%",
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "end",
                fontSize: "14px",
                    fontWeight: "bold",
              }}
                ></div>
                     {/* <div
              style={{
                width:"20%",
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
                 justifyContent: "end",
                fontSize: "14px",
                    fontWeight: "bold",
              }}
                >Tổng tiền dịch vụ: {serviceSelected.reduce((sum, service) => sum + service.service_prices, 0).toLocaleString("vn-VN")} </div>
                     <div
              style={{
              width:"20%",
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
               justifyContent: "end",
                fontSize: "14px",
                    fontWeight: "bold",
              }}
                >Tổng tiền chiết khấu: {Number(dataForm.discount).toLocaleString("vn-VN")} </div> */}
                {
                  dataForm.isCheckInsurance && (
                      <div
              style={{
               width:"20%",
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
               justifyContent: "end",
                fontSize: "14px",
                    fontWeight: "bold",
              }}
                >Tổng tiền BHYT trả: {(serviceSelected.reduce((sum, service) => sum + service.insurance_service_prices, 0) * (parseFloat(dataForm.insuranceObjectRatio) / 100)).toLocaleString("vn-VN")} </div>
                  )
                  
                }
               
                 <div
              style={{
                width:"12%",
                height: "20px",
               
                color: "black",
                display: "flex",
                alignItems: "center",
              justifyContent: "end",
                fontSize: "14px",
                    fontWeight: "bold",
                    marginRight: "15px",
              }}
                >
                  Tổng tiền: {serviceSelected.reduce((sum, service) => sum + service.service_prices, 0).toLocaleString("vn-VN")} 
                  {/* Tổng tiền:  {dataForm.isCheckInsurance ? (serviceSelected.reduce((sum, service) => sum + service.service_prices, 0) - (serviceSelected.reduce((sum, service) => sum + service.insurance_service_prices, 0) * (parseFloat(dataForm.insuranceObjectRatio) / 100))).toLocaleString("vn-VN") : (serviceSelected.reduce((sum, service) => sum + service.service_prices, 0)).toLocaleString("vn-VN")}  */}
                  </div> 
                </div>
           </div>
          </div>
        );
     }, [serviceSelected, dataForm]);
    const columnTableServicesSelect = [
        // Đây là button xóa
        {
          title: (
            <Typography
              content="Dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          width: 50,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
            
                  <Icon
                iconName="delete_item"
                onClick={
                  () => {
                  const newList = serviceSelected.filter(
                    (i) => i.service_id !== data.service_id
                  );
                  setServiceSelected(newList);
                 
                  }
                }
                  />
            
              
            </div>
          ),
        },
        // đây là tên dịch vụ đã chọn
        {
          title: (
            <Typography
              content="Dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          showSorterTooltip: false,
          className: "ant-table-column_wrap",
          width:480,
          render: (record: any, data: any) => (
            <div
          style={{
            justifyContent: "start",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden",    // Xử lý tràn nếu cần
            maxWidth:"400px"
          }}
          className="ant-table-column_item"
        
        >
          <Typography
            content={record} // Hiển thị nội dung đầy đủ
            modifiers={['13x18', '500', 'left', 'main']}
            styles={{
              display: 'block',     // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
               marginLeft:"15px"
            }}
          />
        </div>
          ),
        },
        
         {
          title: (
            <Typography
              content="ĐVT"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
           align: "left",
          width:80,
          showSorterTooltip: false,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                content="Lần"
                modifiers={["14x20", "400", "center", "main"]}
              />
            </div>
          ),
        },
           {
          title: (
            <Typography
              content="Số lượng"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_name",
          align: "left",
          showSorterTooltip: false,
            width:80,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                content="1"
                modifiers={["14x20", "400", "center", "main"]}
              />
            </div>
          ),
        },
         {
          title: (
            <Typography
              content="Tiền dịch vụ"
              modifiers={["14x20", "500", "center", "capitalize"]}
            />
          ),
          dataIndex: "service_prices",
          align: "center",
          width: 100,
          className: "ant-table-column_wrap",
          render: (record: any, data: any) => (
            <div className="ant-table-column_item" style={{justifyContent:"end"}}>
              <Typography
                content={record?.toLocaleString("vi-VN")}
                modifiers={["14x20", "400", "center"]}
              />
            </div>
          ),
        },
           
         
    
         
        // đây là giá tiền tưng ứng dịch vụ đó
       
      ];
        const memoriesTableSelected = useMemo(() => {
      // giải thích logic thuật toán:
      // - VD có 3 object
      //   + Vòng lặp đẩu tiên, kiểm tra xem trong checkGroupIsExit có service_group_id này chưa, nếu chưa thì newGroup được tạo và convertServiceSelected sẽ có nhóm mới đó
      //   + Vòng lặp 2, nếu checkGroupIsExit vẫn service_group_id k có thì newGroup tiếp tục được thêm vào convertServiceSelected, lúc này convertServiceSelected có 2 object là 2 dịch vụ có service_group khác nhau
      //   + Vòng lặp 3, giả sử object thứ 3 có service_group_id đã có trong checkGroupIsExit thì item hiện tại được thêm vào mảng service_group_item của nhóm hiện có
  
        let total = 0;
      serviceSelected?.map((item, index) => {
        const checkGroupIsExit = convertServiceSelected.find(
          (i) => i.service_group_id === item.service_group_id
        );
        total += serviceSelected[index]?.service_prices;
        setTotalService(total.toLocaleString("vn-VN"));
        const newGroup = {
          service_group_id: item.service_group_id,
          service_group_name: item.service_group_name,
          service_group_item: [item],
        };
        
        if (checkGroupIsExit) {
          checkGroupIsExit.service_group_item.push(item);
        } else {
          convertServiceSelected.push(newGroup);
        }
      });
      return (
        <div className="m-form_add_customer-booking_box_table">
          <div>
                 <div style={{
        display: "flex", 
        gap: "8px", 
        padding: "8px", 
        overflowX: "auto", 
        width: "100%", 
        borderBottom: "1px solid #dcdcdc"
      }}>
        <div style={{
          width: "8%", 
          height: "20px", 
          color: "white", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          borderRadius: "5px", 
          fontSize: "14px", 
          fontWeight: "bold"
        }}></div>
        <div style={{
         width: "70%", 
          minWidth: "150px", 
          height: "20px", 
          color: "black", 
          display: "flex", 
          alignItems: "center", 
          fontSize: "14px", 
          fontWeight: "bold", 
          paddingLeft: "10px"
        }}>Tên dịch vụ</div>
        <div style={{
          width: "10%", 
          height: "20px", 
          color: "black", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "14px", 
          fontWeight: "bold",paddingLeft: "110px"
        }}>ĐVT</div>
        <div style={{
          width: "18%", 
          height: "20px", 
          color: "black", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "14px", 
                fontWeight: "bold",
                paddingLeft: "35px",
        }}>SL</div>
        <div style={{
         width: "15%", 
          height: "20px", 
          color: "black", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "end", 
          fontSize: "14px", 
          fontWeight: "bold", 
          paddingRight: "20px"
        }}>Giá dịch vụ</div>
       
      </div>
            <div style={{height:"550px",maxHeight:"550px",overflowY:"auto"}}>
               <PublicTable
            className="table_parent"
            // column ở đây là name của service_group_name
            column={[
              {
                title: "",
                align: "left",
                dataIndex: "service_group_name",
                render: (record: any, data: any) => (
                  <div
                    className="p-booking_schedule_heading"
                    style={{
                      padding: 0,
                    }}
                  >
                    <Typography
                      content={record}
                      modifiers={["16x24", "600", "justify", "blueNavy"]}
                      styles={{
                        paddingLeft: "10px",
                      }}
                    />
                  
                  </div>
                  
                ),
              },
           
            ]}
            listData={convertServiceSelected}
            isHideRowSelect
            isHideHeader
            isExpandable={true}
            defaultExpandAllRow={true}
            isPagination={false}
            rowkey="service_group_id"
            expandedRowKeys={
              convertServiceSelected?.map((i) => i?.service_group_id) ?? []
            }
            // expandedRender là các service_name của các service_group_name được phân định qua 2 dòng code trên
            expandedRender={(
              record: any,
              index: any,
              indent: any,
              expanded: any
            ) => {
              return (
                <div
                  key={record?.service_group_id}
                  className="m-form_add_customer-booking_box_table_children"
                >
                  <PublicTableListPrice
                    isSimpleHeader
                    className="table_children"
                    column={columnTableServicesSelect}
                    listData={record?.service_group_item ?? []}
                    size="small"
                    scroll={{ x: "max-content", scrollToFirstRowOnChange: false }}
                    isPagination={false}
                    isHideRowSelect
                    isHideHeader
                  />
                  
                </div>
              );
            }}
            />
            </div>
              <div style={{ display: "flex", gap: "10px", padding: "10px", overflowX: "auto" , width:"100%", justifyContent:"end",borderTop: "1px solid #dcdcdc"}}>
  
                  <div
            style={{
              width: "40%",
              height: "20px",
             
              color: "black",
              display: "flex",
              alignItems: "center",
                justifyContent: "end",
                  marginRight: "10px",
              fontSize: "14px",
                  fontWeight: "bold",
            }}
              ></div>
                 
                   {/* <div
            style={{
              width: "20%",
              height: "20px",
             
              color: "black",
              display: "flex",
              alignItems: "center",
                justifyContent: "end",
                  marginRight: "10px",
              fontSize: "14px",
                  fontWeight: "bold",
            }}
              >Tổng tiền dịch vụ: {serviceSelected.reduce((sum, service) => sum + service.service_prices, 0).toLocaleString("vn-VN")} </div>
                   <div
            style={{
               width: "20%",
              height: "20px",
             
              color: "black",
              display: "flex",
              alignItems: "center",
                 justifyContent: "end",
                  marginRight: "10px",
              fontSize: "14px",
                  fontWeight: "bold",
            }}
              >Tổng tiền chiết khấu: {Number(dataForm.discount).toLocaleString("vn-VN")} </div> */}
            
             
               <div
            style={{
             width: "20%",
              height: "20px",
             
              color: "black",
              display: "flex",
              alignItems: "center",
                  justifyContent: "end",
                  marginRight: "15px",
              fontSize: "14px",
                  fontWeight: "bold",
            }}
              >Tổng tiền:  {dataForm.isCheckInsurance ?  (serviceSelected.reduce((sum, service) => sum + service.service_prices, 0) - dataForm.discount - (serviceSelected.reduce((sum, service) => sum + service.service_prices, 0) * (parseFloat(dataForm.insuranceObjectRatio) / 100)) ).toLocaleString("vn-VN") : (serviceSelected.reduce((sum, service) => sum + service.service_prices, 0) - dataForm.discount  ).toLocaleString("vn-VN")}  </div>
             </div>
         </div>
        </div>
      );
      }, [serviceSelected, dataForm]);

  ///
  const contentTabStep = useMemo(() => {
      console.log(typeof currentStep,dataListAnswer?.data?.items?.some((item) => item.step_id === 2),dataListAnswer )
    switch (currentStep) {
      case 1:
        return (
          <> {dataListAnswer?.data?.items?.some((item) => item.step_id === 2) ? (
  <LeadQualificationForm
              data={dataListAnswer.data.items.find((item) => item.step_id === 2)!}
              lead_id={lead_id}
              isUpdateInfo={isUpdateInfo}
              setIsUpdateInfo={setIsUpdateInfo}
              dataLead={stateInfoDetailCustomer?.lead}
  />
          ) 
            : (
              <div >

              </div>
          )
        }
</>
        );
         case 2:
        return (
          <> {dataListAnswer?.data?.items?.some((item) => item.step_id === 3) && (
  <LeadNoBookingForm  data={dataListAnswer.data.items.find((item) => item.step_id === 3)!}  lead_id={lead_id}/>
)}</>
        );
       case 6:
        return (
          <> {dataListAnswer?.data?.items?.some((item) => item.step_id === 5) && (
  <LeadCancelForm  data={dataListAnswer.data.items.find((item) => item.step_id === 5)!}  lead_id={lead_id}/>
)}</>
        );
       case 5:
        return (
          <> {dataListAnswer?.data?.items?.some((item) => item.step_id === 5) ? (
  <LeadBookingForm  data={dataListAnswer.data.items.find((item) => item.step_id === 5)!}  lead_id={lead_id}/>
          )
            : (
              <div></div>
          )
        }</>
        );
      default:
        return (
          <div>
             <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                description={
                  <span style={{ fontSize: "20px" }}>
                Bước tiếp nhận không có danh sách câu hỏi!
                </span>
                }
              >
               
              </Empty>
          </div>
        );
    }
  }, [currentStep]);
  const contentTab = useMemo(() => {
    switch (currentStepId) {
      case 0:
        return (
          <>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr",margin:"10px",height:"67vh"}}>
              <div style={{ padding: "10px", background:"white",height:"98%"}}>
                 <div style={{width:"100%",margin:"0px" }}>
              <div className="m-customer_infos_input_enter">
              <div style={{ display: 'flex', flexDirection: 'row', padding: '0px 0px' }}>
               
                  <div style={{width:"100%"}}>
                  <TextArea
              id=""
              readOnly={false}
              value={dataLog.note_node_content}
              placeholder="Nhập các ghi chú cần thiết"
                      handleOnchange={(e) => setDataLog({ ...dataLog, note_node_content: e.target.value })}
             
            />
                </div>
          
            <div className="m-customer_infos_input_btn" style={{flex:3, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  {/* <div style={{width:"70%"}}>
                  <Dropdown
                dropdownOption={listTouchPointLogType}
                defaultValue={listTouchPointLogType[0]}
                placeholder="Nam"
                handleSelect={(item: any) => {
                  setDataLog({ ...dataLog, node_type: item })
                }}
                variant="simple"
              />
             </div> */}
             
                  <div style={{marginLeft:3}}>
                  <Button modifiers={['foreign']} onClick={() => {
                      const body = {
                        cs_node_type: "lead",
                        cs_node_content: dataLog.note_node_content,
                        object_id: dataLog.note_attach_url,
                        lead_id: lead_id
                    }
                    handlePostLog(body)
              }}
                        style={{
                          gap: 4,
                          height: "35px",
              }}
                      >
                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#ffffff"></path> </g></svg>
                        <Typography content="Lưu note" modifiers={['400']}  styles={{textAlign:"left",minWidth:"50px"}}/>
              </Button>
              </div>
                </div></div>
              {
                  listNode.data.length !== 0 &&                 <InteractionHistory2
                  options={listNode?.data as any}
                  id={dataAddNote.id.toString()}
                  loadingNote={listNodeLoading}
                />
              }
          </div>
              </div>
              </div>
               <div style={{ padding: "10px", background:"white",marginLeft:5,marginRight:5 ,height:"98%"}}>
                    {
                contentTabStep
               }
              </div>
              <div style={{ padding: "10px", background:"white",height:"98%"}}>
                <div style={{width:"100%",margin:"0px",  }}>
               <CustomerProfile data={stateInfoDetailCustomer} setOpenProfile={setOpenProfile} dataStep={dataListAnswer?.data?.items?.find((item) => item.step_id === 2)! } />
              </div>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: 6,
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
            style={{
              padding: '12px 16px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <strong>{order.id}</strong>
            <span>{order.customer}</span>
          </div>

          {expandedId === order.id && (
            <div style={{ padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p><b>Khách hàng:</b> {order.customer}</p>
                  <p><b>Ngày tạo:</b> {order.createdAt}</p>
                  <p><b>Mã y tế:</b> {order.medicalCode}</p>
                  <p><b>Ngày đặt hàng:</b> {order.orderDate}</p>
                </div>
                <div>
                  <p><b>Sở hữu:</b> {order.owner}</p>
                  <p><b>Nhóm nguồn:</b> {order.group}</p>
                  <p><b>Nguồn đăng ký:</b> {order.registerSource}</p>
                  <p><b>Loại nguồn:</b> {order.sourceType}</p>
                </div>
              </div>

              <hr style={{ margin: '16px 0' }} />

              <table width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>[{order.productCode}] {order.productName}</td>
                    <td>{order.quantity.toFixed(2)}</td>
                    <td>{order.unitPrice.toLocaleString()} ₫</td>
                    <td>{order.total.toLocaleString()} ₫</td>
                    <td>{order.paymentStatus}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <b>Tổng tiền hóa đơn: {order.total.toLocaleString()} ₫</b>
              </div>

              {order.note && (
                <div style={{ marginTop: 10, fontStyle: 'italic' }}>
                  {order.note}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
        )
      case 4:
        return (
          <div style={{ width: "100%" }}>
            {
               stateInfoDetailCustomer?.visits === null ? "Hiện tại chưa có lịch hẹn nào" : <ListBooking data={ stateInfoDetailCustomer?.visits}/>
            }
           
          </div>
        )
      case 3: 
        return (
          <div style={{padding:"10px 10px"}}>
             <OrderListLead setDataSaleOrderRef={setDataSaleOrderRef} setIsSelectService={setIsSelectService} ordersList={stateInfoDetailCustomer?.sale_orders} setDataRemove={setDataRemove} setIsUpdateInfo={setIsUpdateInfoLead}
                      setListDataServices={setListDataServices} setServiceSelected={setServiceSelected} setIsSeenPrice={setIsSeenPrice} />
          </div>
        )
        case 2: 
        return (
          <div style={{width:"100%",padding:"10px 10px"}}>
            <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            justifyContent: "space-between",
            }}> <div style={{width:"35%",display:"flex", justifyContent:"flex-end",gap:5}}>
                <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#fd7e14",cursor:"pointer"}}   onClick={async () => {
                        setDataFilterGPT({
                        opemnModal: true,
                        prompt: '',
                      });
                    }}
                
                >
                  <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 17V16.9929M12 14.8571C12 11.6429 15 12.3571 15 9.85714C15 8.27919 13.6568 7 12 7C10.6567 7 9.51961 7.84083 9.13733 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  <div style={{color:"white", marginLeft:"5px"}}>Hỏi AI</div>
            
          </div>
                <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}}   onClick={async () => {
                      setIsOpenModal(true);
                    }}
                
                >
                   <img src={iconAddTask} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/> 
                  <div style={{color:"white", marginLeft:"5px"}}>Thêm hướng dẫn</div>
            
          </div>
          </div>
              <div style={{marginBottom:3, display:"flex", gap:5}}>
              <div style={{minWidth:150}}>
              <Dropdown4
              dropdownOption={[
                { label: "Tất cả", value: 0 },
                ...userguidType.filter(item => item.category_type === "guid")
              ]}
      variant="simple"
      isColor
      placeholder="-- Chọn danh mục --"
      values={formDataGuid.category_id}
      handleSelect={(item: any) => {
        setFormDataGuid({ ...formDataGuid, category_id: item.value });
        dispatch(getListUserGuidsCRM({ ...formDataGuid,category_id:item.value } as unknown as any));
      }}
                  /> </div>
                  <div style={{minWidth:150}}> <Dropdown4
                  dropdownOption={statusGuid}
      variant="simple"
      isColor
      placeholder="-- Chọn trạng thái --"
      values={statusGuid.find(item => item.value === formDataGuid.guid_status)}
      handleSelect={(item: any) => {
        setFormDataGuid({ ...formDataGuid, guid_status: item.value });
        dispatch(getListUserGuidsCRM({
          ...formDataGuid,
          guid_status: item.value
        }));
      }}
    /></div>
                
            </div>
            </div> 
            <PublicTable
          loading={loadingListGuid}
          column={tableListGuid}
          listData={dataListGuid?.data}
          isHideRowSelect
          scroll={{
            x: dataListGuid?.data?.length ? 'max-content' : '100%',
            y: '68vh',
          }}
          size="middle"
          rowkey="lead_id"
          isPagination={false}
          pageSizes={200}
        
         
         
        />
          </div>
        )
        case 1: 
        return (
          <div style={{width:"100%",padding:"10px 10px"}}>
            <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            justifyContent: "space-between",
          }}> <div style={{width:"15%"}}>
            <Button
              style={{padding: "10px 0px" }}
                        modifiers={["foreign"]}
                        onClick={async () => {
                          setIsAddTask(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Thêm công việc"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
            </div>
                <div style={{marginBottom:3, display:"flex", gap:5,alignItems:"center"}}>
                              <div style={{minWidth:350}}>
                                                       <Dropdown4
                                                         dropdownOption={[ {
                                                       label:"Tất cả" ,   value: "all",}
                                                           ,...userguidType.filter(
                            (item) => item.task_type_group?.toUpperCase() === "LEAD"
                          )
                                             ]}
                                             variant="simple"
                                            isColor
                                             defaultValue={{id:1, label: "Tất cả", value: "all" }}
                          
                                             placeholder="-- Chọn nhóm việc  --"
                                             values={filterTask.task_type_id}
                                             handleSelect={(item: any) => {
                                               setFilterTask({ ...filterTask, task_type_id: item.value });
                                               dispatch(getListTask({ ...filterTask,task_type_id:item.value } as unknown as any));
                                             }}
                                                       />
                                                       </div>
                                          <div style={{minWidth:120}}>  <Dropdown4
                                           dropdownOption={[
                                          
                                            ...OptionCustomerTask,
                                          ]}
                                variant="simple"
                                isColor
                                placeholder="-- Chọn trạng thái --"
                                values={filterTask.status}
                                handleSelect={(item: any) => {
                                  setFilterTask({ ...filterTask, status: item.value });
                                  dispatch(getListTask({ ...filterTask,status:item.value } as unknown as any));
                                }}
                              /></div>
                         </div>
            </div> 
            <PublicTable
          loading={loadingListTask}
          column={tableListTask}
          listData={dataListTask?.data}
          isHideRowSelect
          scroll={{
            x: dataListTask?.data?.length ? 'max-content' : '100%',
            y: '68vh',
          }}
          size="middle"
          rowkey="lead_id"
          isPagination={false}
          pageSizes={200}
        
         
         
        />
          </div>
        )

        
      default:
        return null;
    }
  }, [currentStepId ,openProfile,dataBeforeExam?.data, loadingBefore, loadingListTask,dataListTask,dataListGuid,dataLog,listNotesCustomer,listNodeLoading,listNotesCustomer, listNode.data.length,stateInfoDetailCustomer,currentStepIdS,currentStep,stateInfoDetailCustomer]);

  const tableLeads = useMemo(() => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" , gap:5, padding: "0 10px"}}>
          <div style={{marginTop:3}}>
          <RangeDate
                      variant='simple'
                      value={{
                        from: filterData?.from_date,
                        to: filterData?.to_date,
                      }}
                      defaultValue={{
                        from: filterData?.from_date,
                        to: filterData?.to_date,
                      }}
                      handleOnChange={(from: any, to: any) => {
                        setFilterData({ ...filterData, from_date: from, to_date: to, });
                        dispatch(getListToStoreBeforeExams({ ...bodyGetList, from_date: moment(from).format("YYYY-MM-DDT00:00:00"), to_date: moment(to).format("YYYY-MM-DDT23:59:59"), } as unknown as any));
                      }}
          />
            </div>
          <div style={{flex:1, display: "flex", justifyContent: "space-between", alignItems: "start"}}>
          <Dropdown
                      dropdownOption={[
                      
                        ...stepsprocesslead,
                      ]}
                      variant="simple"
                      isColor
                      placeholder="-- Chọn giai đoạn --"
                      values={filterData.step_index}
                      handleSelect={(item: any) => {
                        setFilterData({ ...filterData, step_index: item });
                         dispatch(
                           getListToStoreBeforeExams({
                             ...bodyGetList,
                             step_index: item?.value,
                           } as unknown as any)
                         );
                      }}
                    />
         </div>
        </div>
        <div style={{ padding: "0 10px" }}>
  <div style={{ display: "flex", gap: "10px" }}>
    <div style={{ flex: 7 }}>
      <Input
        id="search-booking"
        type="text"
        variant="simple"
        value={filterData.keyword}
        placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng"
        onChange={(event: any) => {
          setFilterData({
            ...filterData,
            keyword: event?.target?.value,
          });
        }}
        handleEnter={() => {
          dispatch(
            getListToStoreBeforeExams({
              ...bodyGetList,
              keyword: filterData.keyword,
            } as any)
          );
        }}
        handleClickIcon={() => {
          dispatch(
            getListToStoreBeforeExams({
              ...bodyGetList,
              keyword: filterData.keyword,
            } as any)
          );
        }}
        iconName="search"
      />
    </div>

    <div style={{ flex: 3 }}>
      <Button
        style={{ width: "100%", padding: "10px 0px" }}
        modifiers={["foreign"]}
        onClick={async () => {
          handlegetDataPancake()
        }}
      >
        {stateBreakPoint < 1440 ? (
          <Icon iconName="add" size="20x20" />
        ) : (
          <Typography content="Lấy dữ liệu từ PC" modifiers={["400"]} />
        )}
      </Button>
    </div>
  </div>
</div>

       <PublicTable
            loading={loadingBefore || tableLoading}
            column={tableColumns}
            listData={dataBeforeExam?.data?.data}
            isHideRowSelect
            scroll={{
              x: dataBeforeExam?.data?.data?.length ? 'max-content' : '100%',
              y: '400px',
            }}
            size="middle"
            rowkey="lead_id"
            isPagination
            pageSizes={200}
            rowClassNames={(record, index) => {
              if (
                _.isNull(record?.lead_convert_customer_date) &&
                _.isNull(record?.customer_phone)
              ) {
                return `p-apointment_list_row_item_contact ${
                  index % 2 === 0 ? 'bg-gay-blur' : ''
                }`;
              }
              if (
                _.isNull(record?.lead_convert_customer_date) &&
                !_.isNull(record?.customer_phone)
              ) {
                return `p-apointment_list_row_item_lead ${
                  index % 2 === 0 ? 'bg-gay-blur' : ''
                }`;
              }
              return `p-apointment_list_row_item_customer ${
                index % 2 === 0 ? 'bg-gay-blur' : ''
              }`;
            }}
            handleChangePagination={(page: any, pageSize: any) => {
              handleChangePagination(page, pageSize);
            }}
            // totalItem={
            //   (listBeforeExams?.status &&
            //     listBeforeExams?.data?.paging?.total_count) ||
            //   0
            // }
           
          />
      </>
      )
  }, [currentStep, dataBeforeExam?.data, loadingBefore, filterData]);
  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic handleClick={(data: any) => { }} title="Chuyển đổi" isStatistic={false} valueRangeDate={{ from: new Date(), to: new Date(), }} >
        {
          stateBreakPoint > 924 ?
            <div style={{padding: "10px 0px", }}>
               <Button
              style={{padding: "10px 0px", }}
                        modifiers={["foreign"]}
                        onClick={async () => {
                          await setIsClosePopup(false);
                          setIsOpenPopup(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Thêm khách hàng"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
           </div>
          : (
              <>
               
              </>
            )
        }
      </PublicHeaderStatistic>
    ),
    [ isStatisticMobile, stateBreakPoint]
  );

  function tagStyle(tag_color: any): React.CSSProperties | undefined {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-apointment_list">
      <PublicLayout widthScreen={stateBreakPoint}>
        <div className="p-apointment_list_schedule">
          {isLoading ? (
            <Loading variant="max_content" isShow size="medium" />
          ) : (
            <>
              
             
                <div style={{  width: '100%' }}>
  

                    <div>
                      {
                        filterTask.id !== "" ? <div style={{width: '100%'}}>
                          <div style={{paddingRight: '10px', paddingLeft: '10px', paddingTop: '10px'}}>
                         <CSteps
          active={currentStep}
          options={stepsData}
          onStepChange={handleStepChange}
                            /> 
                              {/*   <div style={{ width: '100%', height: '100px' }}>
                         <ReactFlow
        nodes={nodes}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        nodesDraggable={false} 
                              panOnDrag={false} 
                                      zoomOnScroll={false}

      ></ReactFlow>
                            </div> */}
                          </div>
                          
                        <div style={{width:"100%"}}>
                        <div style={{ margin: "0 auto", padding: "10px" ,width:"100%"}}>
      <div style={{
        boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
        borderRadius: 8,
        background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
        padding: "0.4rem 0.75rem"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* <div style={{ padding: "0.5rem", backgroundColor: "#DBEAFE", borderRadius: 8 }}>
              <User size={18} color="#2563EB" />
            </div>
                                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#111827" }}>Thông tin lead</p> */}
                                
                                 
          </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                  {/* {
                                    stateInfoDetailCustomer?.lead?.lead_pancake_id && (
                                      <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                      border: "1px solid #BFDBFE",
                                      borderRadius: 6,
                                      backgroundColor: "transparent",
                                      cursor: "pointer"
                                                          }}
                                                          onClick={() => {
                                                            handlePostInfoLeadFPC()
                                                          }}
                                                          >
                                      <Edit size={16} />
                                      <span>Cập nhật thông tin từ Pancake</span>
                                                          </button>
                                    )
                                  } */}
                                
                                  {/* {
                                    stateInfoDetailCustomer?.lead?.customer_id === null ?    <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                      border: "1px solid #BFDBFE",
                                      borderRadius: 6,
                                      backgroundColor: "transparent",
                                      cursor: "pointer"
                                                          }}
                                                          onClick={() => {
                                                            setIsOpenPopupU(true)
                                                          }}
                                                          >
                                      <Edit size={16} />
                                      <span>Chỉnh sửa</span>
                                                          </button> : <></>
                                  }
                              */}
                                {/* {
                                    (stateInfoDetailCustomer?.lead?.customer_id === null  ) ?     <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                      border: "1px solid #BFDBFE",
                                      borderRadius: 6,
                                      backgroundColor: "transparent",
                                      cursor: "pointer"
                                                          }}
                                                          onClick={() => {
                                                            setIsOpenPopupC(true)
                                                          }}
                                                          >
                                      <IterationCcw size={16} />
                                      <span>Đặt lịch</span>
                                                          </button>:  <></>
                                  } */}
                                
         </div>
        </div>

        {/* Name */}
                              <div style={{ display: "grid",  gridTemplateColumns: "1.3fr 1fr",  gap: "1.5rem" }}>
                                <div>
                                          <div >
                              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.3fr 0.9fr 1.1fr",justifyContent: "start", alignItems: "start", gap: "10px", height: "fit-content",fontSize:"14px"}}>
                                      <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px", }}>    <Typography content={`Tên lead:`} styles={{ fontWeight: 500 }} />
                                        <Typography content={stateInfoDetailCustomer?.lead?.lead_nickname === null ? stateInfoDetailCustomer?.lead?.lead_name : stateInfoDetailCustomer?.lead?.lead_nickname} styles={{ fontWeight: 600, textTransform: "uppercase" }} />
                                    <div style={{ maxWidth: "300px", flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"11px",backgroundColor: stateInfoDetailCustomer?.lead?.is_converted === true ? "#ffffff" : "#ffffff", padding:"0px 3px", borderRadius:"4px" , border:stateInfoDetailCustomer?.lead?.is_converted === true ? "1px solid #25733a" : "1px solid #fe0000",textAlign:"center",color: stateInfoDetailCustomer?.lead?.is_converted === true ? "#25733a" : "#fe0000"  }}>
                                         
                                          {
                                             stateInfoDetailCustomer?.lead?.is_converted === true ? "Đã chuyển đổi" : "Chưa chuyển đổi"
                                          }
         </div>
        
                                        </div>
                                        {
                                               stateInfoDetailCustomer?.lead?.customer_id !== null &&  <CTooltip
                                                                         placements="top"
                                                                         title="Xem thông tin khách hàng"
                                          colorCustom="#25733a"
                                                    
                                        >
                                            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}  onClick={() => {
                                                            window.open(
                                                              `/customer-info/id/${stateInfoDetailCustomer.lead?.customer_id}/history-interaction`,
                                                              "_blank"
                                                            );
                                                          }}>
                                          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="#333333" stroke-width="1.5"></path> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#333333" stroke-width="1.5"></path> </g></svg>
                                    </div>    </CTooltip>
                                }
                                       
                                      {/* {
                                           stateInfoDetailCustomer?.lead?.customer_id === null ?  <CTooltip
                                                                       placements="top"
                                                                       title="Cập nhật thông tin lead"
                                                  colorCustom="#04566e"
                                                  
                                                                     >
                                                    <img src={iconPen} width="26" style={{ marginLeft: "13x", cursor: "pointer" }} onClick={() => {
                                                  setIsOpenPopupU(true)
                                                                     }} />
                                                </CTooltip> : <></>
                                  } */}
                                      </div>
                                         <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px", }}>    <Typography content={`Họ và tên:`} styles={{ fontWeight: 500 }} /><Typography content={stateInfoDetailCustomer?.lead?.lead_name} styles={{ fontWeight: 600, textTransform: "uppercase" }} />
                                     
                                      </div>
                                         <div style={{ maxWidth: "200px", flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                <Typography content={`Giới tính:`} styles={{ fontWeight: 500 }} /><Typography content={stateInfoDetailCustomer?.lead?.lead_gender_id === null ? "N/A" : stateInfoDetailCustomer?.lead?.lead_gender_id === "M" ? "Nam" : "Nữ"} styles={{   }} />
         </div>
        
                                      </div>
                                        <div style={{ maxWidth: "300px", flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                                          <Typography content={`Sinh nhật:`} styles={{ fontWeight: 500 }} />
<Typography content={Number(stateInfoDetailCustomer?.lead?.lead_dob)&&Number(stateInfoDetailCustomer?.lead?.lead_mob)&&Number(stateInfoDetailCustomer?.lead?.lead_yob)?`${String(Number(stateInfoDetailCustomer?.lead?.lead_dob)).padStart(2,'0')}/${String(Number(stateInfoDetailCustomer?.lead?.lead_mob)).padStart(2,'0')}/${stateInfoDetailCustomer?.lead?.lead_yob}`:Number(stateInfoDetailCustomer?.lead?.lead_mob)&&Number(stateInfoDetailCustomer?.lead?.lead_yob)?`${String(Number(stateInfoDetailCustomer?.lead?.lead_mob)).padStart(2,'0')}/${stateInfoDetailCustomer?.lead?.lead_yob}`:Number(stateInfoDetailCustomer?.lead?.lead_yob)?`${stateInfoDetailCustomer?.lead?.lead_yob}`:'N/A'} />
         </div>
        
                                </div>
                                       
                                     
                                    </div>
                                    
                                  
                                       <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.3fr 0.9fr 1.1fr",justifyContent: "start", alignItems: "start", gap: "10px", height: "fit-content",fontSize:"14px",}}>
                                      <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px", }}>    <Typography content={`Nhóm nguồn:`} styles={{ fontWeight: 500 }} />
                                        <Typography content={stateInfoDetailCustomer?.lead?.source_group_id !== null ? stateLaunchSourceGroups.find(item => item.id === stateInfoDetailCustomer?.lead?.source_group_id)?.label : "N/A"} styles={{ fontWeight: 500,  }} />
                                     
                                      </div>
                                      <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px", }}>
                                        <Typography content={`Nguồn:`} styles={{ fontWeight: 500 }} />
                                        <Typography content={stateInfoDetailCustomer?.lead?.source_id !== null ? stateLaunchSource.find(item => item.id === stateInfoDetailCustomer?.lead?.source_id)?.label : "N/A"} styles={{ fontWeight: 500, }} />
                                     
                                      </div>
                                         <div style={{ maxWidth: "200px", flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                                          <Typography content={`Chuyển đổi:`} styles={{ fontWeight: 500 }} />
                                        <Typography content={stateInfoDetailCustomer?.lead?.source_type_id !== null ? stateLaunchSourceTypes.find(item => item.id === stateInfoDetailCustomer?.lead?.source_type_id)?.label : "N/A"} styles={{ fontWeight: 500, }} />
         </div>
        
                                      </div>
                                        <div style={{ maxWidth: "300px", flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                                          <Typography content={`Số điện thoại:`} styles={{ fontWeight: 500 }} />
                                          <Typography content={stateInfoDetailCustomer?.lead?.lead_phone ? stateInfoDetailCustomer?.lead?.lead_phone : "N/A"} styles={{ textTransform: "uppercase" }} />
         </div>
        
                                </div>
                                       
                                     
                                    </div>
                                    
                                     <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.3fr 0.9fr 1.1fr",justifyContent: "start", alignItems: "start", gap: "10px", height: "fit-content",fontSize:"14px",paddingTop:"5px"}}>
                                     <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
             
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#000000", }}>Phụ trách:   {
    (() => {
     
      const matched = listUsers.find(
        emp => emp.u_id === stateInfoDetailCustomer.lead?.own_employee_id
      );

      return matched ? getLastTwoNames(matched.label)  : "N/A";
    })()
  } </label>
                                      </div>
                                           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
             
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#000000", }}>Tương tác cuối:   {
    (() => {
     
      const matched = listUsers.find(
        emp => emp.u_id === stateInfoDetailCustomer.lead?.last_contact_employee_id
      );

      return matched ? getLastTwoNames(matched.label)  : "N/A";
    })()
  } </label>
            </div>
                                      <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px", }}>
                                        <Typography content={`Ngày tạo:`} styles={{ fontWeight: 500 }} />
                                          <Typography content={stateInfoDetailCustomer.lead?.create_date !== null ? moment(stateInfoDetailCustomer.lead?.create_date).format("DD/MM/YYYY") : "N/A"} styles={{}} />
                                     
                                      </div>
                                         <div style={{  flexShrink: 1 }}>
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                                          <Typography content={`Ngày tương tác cuối:`} styles={{ fontWeight: 500 }} />
                                          <Typography content={stateInfoDetailCustomer.lead?.update_date !== null ? moment(stateInfoDetailCustomer.lead?.update_date).format("DD/MM/YYYY") : "N/A"} styles={{}} />
         </div>
        
                                      </div>
                                       
                                       
                                     
                                    </div>
          <div >
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                <Typography content={`Ghi chú:`} styles={{ fontWeight: 500 }} /><Typography content={(stateInfoDetailCustomer?.lead?.lead_note === null || stateInfoDetailCustomer?.lead?.lead_note === "") ? "N/A" : stateInfoDetailCustomer?.lead?.lead_note} styles={{   }} />
         </div>
        
                                    </div>
                                </div>
                               
      
                               
                             
                              
                                <div>
    
      
        </div>
                      </div>
                                <div>
                                  
                  <div >
                              <div style={{ display: "flex", justifyContent: "end", alignItems: "start", gap: "10px", height: "fit-content",fontSize:"14px"}}>
                               {      <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                      border: "1px solid #BFDBFE",
                                      borderRadius: 6,
                                      backgroundColor: "rgb(40 151 10)",
                                        cursor: "pointer",
                                        color: "#ffffff",
                                                          }}
                                                          onClick={() => {
                                                            setIsOpenPopupC(true)
                                                          }}
                                                          >
                                    <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                      <span>Đặt lịch</span>
                                                          </button>
                                  }
                                         {         stateInfoDetailCustomer?.lead?.customer_id === null ?  <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                        border: "1px solid #BFDBFE",
                                        color: "#ffffff",
                                      borderRadius: 6,
                                        backgroundColor: "#185906",
                                      cursor: "pointer"
                                                          }}
                                                          onClick={() => {
                                                            setIsOpenPopupU(true)
                                                          }}
                                                          >
                                   <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#ffffff"></path> </g></svg>
                                      <span>Chỉnh sửa thông tin lead</span>
                                                          </button> : <></>
                                      }
                                      {
                                        stateInfoDetailCustomer?.lead?.lead_pancake_link === null ? <></> : <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                        border: "1px solid #BFDBFE",
                                        color: "#ffffff",
                                      borderRadius: 6,
                                        backgroundColor: "#d92d20",
                                      cursor: "pointer"
                                                          }}
                                                           onClick={() => {
                                                                    if (stateInfoDetailCustomer?.lead?.lead_pancake_link === null) {
                                                                      toast.error("Chưa có link Pancake");
                                                                      return;
                                                                    } else {
                                                                      window.open(stateInfoDetailCustomer?.lead?.lead_pancake_link, '_blank', 'noopener,noreferrer');
                                                                  }
                                                                 
                                                                }}
                                                          >
                                                            <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L12.5 6.06212" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                                        <span>Đi đến Pancake</span>
                                        <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.2328 16.4569C12.9328 16.7426 12.9212 17.2173 13.2069 17.5172C13.4926 17.8172 13.9673 17.8288 14.2672 17.5431L13.2328 16.4569ZM19.5172 12.5431C19.8172 12.2574 19.8288 11.7827 19.5431 11.4828C19.2574 11.1828 18.7827 11.1712 18.4828 11.4569L19.5172 12.5431ZM18.4828 12.5431C18.7827 12.8288 19.2574 12.8172 19.5431 12.5172C19.8288 12.2173 19.8172 11.7426 19.5172 11.4569L18.4828 12.5431ZM14.2672 6.4569C13.9673 6.17123 13.4926 6.18281 13.2069 6.48276C12.9212 6.78271 12.9328 7.25744 13.2328 7.5431L14.2672 6.4569ZM19 12.75C19.4142 12.75 19.75 12.4142 19.75 12C19.75 11.5858 19.4142 11.25 19 11.25V12.75ZM5 11.25C4.58579 11.25 4.25 11.5858 4.25 12C4.25 12.4142 4.58579 12.75 5 12.75V11.25ZM14.2672 17.5431L19.5172 12.5431L18.4828 11.4569L13.2328 16.4569L14.2672 17.5431ZM19.5172 11.4569L14.2672 6.4569L13.2328 7.5431L18.4828 12.5431L19.5172 11.4569ZM19 11.25L5 11.25V12.75L19 12.75V11.25Z" fill="#ffffff"></path> </g></svg>
                                                          </button>
                                      }
                                   
                                       {
                                    stateInfoDetailCustomer?.lead?.customer_id !== null &&  <button style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      padding: "0.25rem 0.75rem",
                                        border: "1px solid #BFDBFE",
                                        color: "#ffffff",
                                      borderRadius: 6,
                                        backgroundColor: "#3498db",
                                      cursor: "pointer"
                                                          }}
                                                          onClick={() => {
                                                            window.open(
                                                              `/customer-info/id/${stateInfoDetailCustomer.lead?.customer_id}/history-interaction`,
                                                              "_blank"
                                                            );
                                                          }}
                                                          >
                                     <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z" stroke="#ffffff" stroke-width="1.5"></path> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>
                                      <span>Xem thông tin khách hàng</span>
                                                          </button>
                                  }
                                    </div>
                                    
                                  
                                    
                                     
                                          <div style={{ display: "flex", position:"relative",alignItems: "start", gap: "0.5rem" ,border: "1px solid rgb(226 226 226)", borderRadius: 6, minHeight:40, marginTop:5,paddingTop:5,paddingBottom:3}}>
                                      <div style={{ position: "absolute", top: "-15px", left: "20px", zIndex: 1000, background: "#ffffff", minWidth: 60, textAlign: "center", display: "flex", justifyContent:"center" }}><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.0498 7.0498H7.0598M10.5118 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10.5118C3 11.2455 3 11.6124 3.08289 11.9577C3.15638 12.2638 3.27759 12.5564 3.44208 12.8249C3.6276 13.1276 3.88703 13.387 4.40589 13.9059L9.10589 18.6059C10.2939 19.7939 10.888 20.388 11.5729 20.6105C12.1755 20.8063 12.8245 20.8063 13.4271 20.6105C14.112 20.388 14.7061 19.7939 15.8941 18.6059L18.6059 15.8941C19.7939 14.7061 20.388 14.112 20.6105 13.4271C20.8063 12.8245 20.8063 12.1755 20.6105 11.5729C20.388 10.888 19.7939 10.2939 18.6059 9.10589L13.9059 4.40589C13.387 3.88703 13.1276 3.6276 12.8249 3.44208C12.5564 3.27759 12.2638 3.15638 11.9577 3.08289C11.6124 3 11.2455 3 10.5118 3ZM7.5498 7.0498C7.5498 7.32595 7.32595 7.5498 7.0498 7.5498C6.77366 7.5498 6.5498 7.32595 6.5498 7.0498C6.5498 6.77366 6.77366 6.5498 7.0498 6.5498C7.32595 6.5498 7.5498 6.77366 7.5498 7.0498Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                       <span style={{fontWeight:700}}> Tags:</span></div>
              <div style={{ paddingLeft: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem", }}>
          
            
                                  {dataListTag.length  !== 0 && dataListTag?.map((tag:any) => (
            <span key={tag.tag_id} style={{
                                      backgroundColor: `${tag.tag_color}`,
               color:"#ffffff",
              fontWeight: 500,
                                      borderRadius: 3,
             fontSize:10,
                    padding: "1px 5px",
            }} >
              {tag.tag_name}
            </span>
          ))}
            <button style={{
              background: "transparent",
              color: "#2563EB",
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              border: "none",
              cursor: "pointer"
                                    }}
                                      onClick={() => {
                                        setIsAddTag(true)
                                    }}
                                    >+/- Tag</button>
          </div>
          </div>
                                </div>
           
                                  
                                </div>
          {/* Monitoring Staff */}
         
      </div>
    

        
     

    

      </div>

     
    </div>
                        </div>
                          <div>
                          <div
  style={{
    borderBottom: '1px solid #e5e7eb', // border-border
  }}
>
  <nav
    style={{
      display: 'flex',
      gap: '2rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    }}
    aria-label="Tabs"
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => {
          setActiveTab(tab.id)
          setCurrentStepId(tab.stepId);
          if(tab.stepId === 1) {
            dispatch(getListTask({ ...filterTask } as unknown as any));
          }
          if(tab.stepId === 2) {
            dispatch(getListUserGuidsCRM({
              ...formDataGuid
            }));
          }
          if(tab.stepId === 0) {
            dispatch(getListNotesLog({
              node_type: dataAddNote.node_type,
              id: dataAddNote.id
            }));
          }
         }}
        style={{
          whiteSpace: 'nowrap',
          paddingTop: '1rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
          borderBottom:  activeTab === tab.id ? '2px solid #0489dc' : '2px solid transparent',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
         
          fontSize: '0.875rem',
          color: activeTab === tab.id ? '#0489dc' : '#333333', // text-primary vs muted
          transition: 'color 0.2s, border-color 0.2s',
           fontWeight:700, // text-primary vs muted
          cursor: 'pointer',
          backgroundColor: 'transparent', // không có nền
        }}
      
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
      {tab.id !== "datlich" || stateInfoDetailCustomer?.data?.visits?.length !== 0 ? tab.label : ""}

      </button>
    ))}
  </nav>
                            </div>
                            <div>
                              {contentTab}
                            </div>

                          </div>

                        </div> :  <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '400px',
                          padding: '2rem',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '4rem',
                            height: '4rem',
                            marginBottom: '0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: '#f5f5f5', // tương ứng với 'bg-muted'
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                        <svg width="113px" height="113px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 19.5L20 21M4 21C4 17.134 7.13401 14 11 14M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </div>
                        <h3
                          style={{
                            fontSize: '1.125rem',
                            fontWeight: 500,
                            color: '#111827', // tương ứng với 'text-foreground'
                            marginBottom: '0.5rem',
                          }}
                        >
                          Mời chọn lead để xem chi tiết
                        </h3>
                       
                      </div>
                      }
                   

   
  </div>
</div>

             
            </>
          )}
        </div>
          
        <CModal
          isOpen={isAddNote}
          widths={540}
          title="Cập nhật ghi chú về khách hàng"
          onCancel={() => {
            setIsAddNote(false);
          }}
          onOk={() => {
            if (contentNote.trim()) {
              handleAddNoteCustomer();
            } else {
              toast.error("Bạn không thể ghi chú mà không có nội dung");
            }
          }}
          textCancel="Hủy"
          textOK="Cập nhật"
        >
          <TextArea
            id="note_for_before_exams"
            readOnly={false}
            value={undefined}
            isResize
            defaultValue={undefined}
            handleOnchange={(e) => {
              setContentNote(e.target.value);
            }}
          />
        </CModal>
        <CModal
  isOpen={false}
  widths={540}
  title="Thông tin của lead Nguyễn Phước Công"
  onCancel={() => setIsAddNote(false)}
  onOk={() => {
    if (contentNote.trim()) {
      handleAddNoteCustomer();
    } else {
      toast.error("Bạn không thể ghi chú mà không có nội dung");
    }
          }}
          isHideCancel
  textCancel="Close"
  textOK="Đóng" // Ẩn nút OK nếu không cần, hoặc bỏ nếu component cho phép
>
  <div style={{ textAlign: 'left', paddingBottom: '20px' }}>
    
    <h2 style={{ margin: 0 }}>Nguyễn Phước Công</h2>

    <div style={{ textAlign: 'left', margin: ''}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
    }}> <p><strong>Năm sinh:</strong> 27/04/2002</p>  <p><strong>Giới tính:</strong> Nam</p></div> 
      <div style={{
                display: 'flex',
                justifyContent: 'space-between',
    }}> <p><strong>Email:</strong> sarah.johnson@techcorp.com</p>  <p><strong>SĐT:</strong> +1 (555) 123-4567</p></div> 
    </div>
  </div>
</CModal>

        <CModal
          isOpen={isOpenFormContact}
          widths={500}
          title="Thêm Khách Hàng Tiềm Năng"
          onCancel={() => {
            setIsOpenFormContact(false);
          }}
          zIndex={1}
          isHideFooter
        >
          <FormAddContact
            handleSubmitForm={(data) => handleUpdateCustomer(data)}
            handleClose={() => {
              setIsOpenFormContact(false);
            }}
            isCloseForm={!isOpenFormContact}
          />
        </CModal>
        {/* Update tag for customer */}
        <Transfer
          dataSource={listeTags.filter(tag => tag.tag_type === "lead")}
          dataUpdate={dataListTag as any}
          isOpen={isAddTag}
          widths={900}
          title="Cập nhật Tag"
          handleClose={() => setIsAddTag(false)}
          handleSubmit={(data) => {
            handleUpdateTag(data);
          }}
        />
      </PublicLayout>
      {isOpenPopupU &&
        <FormUpdateLead
          isOpenPopup={isOpenPopupU}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsUpdateCustomer(false);
            setIsClosePopupU(true);
            setIsOpenPopupU(false);
          }}
          valUpdate={stateInfoDetailCustomer.lead}
          isUpdate
          isClose={isClosePopupU}
          handleClose={() => {
            setIsUpdateCustomer(false);
            setIsClosePopupU(true);
            setIsOpenPopupU(false);
          }}
          handleAddCustomer={(data: any) =>
             handleUpdateCustomer(data)
           
          }
          isHigh
        />
      }
      {isOpenPopup &&
        <FormAddLead
          isOpenPopup={isOpenPopup}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
          }}
          valUpdate={customerUpdate}
          isUpdate={isUpdateCustomer}
          isClose={isClosePopup}
          handleClose={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
          }}
          handleAddCustomer={(data: any) =>
            isUpdateCustomer
              ? handleUpdateCustomer(data)
              : handleAddCustomer(data)
          }
          isHigh
        />
      }
       {isOpenPopup &&
        <FormAddLead
          isOpenPopup={isOpenPopup}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
          }}
          valUpdate={customerUpdate}
          isUpdate={true}
          isClose={isClosePopup}
          handleClose={() => {
            setIsUpdateCustomer(false);
            setIsClosePopup(true);
            setIsOpenPopup(false);
        }}
        
          handleAddCustomer={(data: any) =>
            isUpdateCustomer
              ? handleUpdateCustomer(data)
              : handleAddCustomer(data)
          }
          isHigh
        />
      }
        {isOpenPopupP &&
        <FormAddPriceCustomer
          isOpenPopup={isOpenPopupP}
          positionDrawer="left"
          handleClosePopup={() => {
         
            setIsClosePopupP(true);
            setIsOpenPopupP(false);
          }}
          valUpdate={customerUpdate}
          isUpdate={isUpdateCustomer}
          isClose={isClosePopupP}
          handleClose={() => {
           
            setIsClosePopupP(true);
            setIsOpenPopupP(false);
          }}
          handleAddCustomer={(data: any) =>
            isUpdateCustomer
              ? handleUpdateCustomer(data)
              : handleAddCustomer(data)
          }
          isHigh
        />
      }
        {isUpdateInfoLead &&
        <FormConvertCustomerSaleOrder
        isOpenPopup={isUpdateInfoLead}
          listDataServices={listDataServices}
        dataSaleOrderRef={dataSaleOrderRef}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsClosePopupC(true);
            setIsOpenPopupC(false);
            setIsUpdateInfoLead(false)
          }}
          valUpdate={stateInfoDetailCustomer.lead}
          isUpdate
          isClose={isClosePopupC}
          handleClose={() => {
            setIsUpdateInfoLead(false)
            setIsClosePopupC(true); 
            setIsOpenPopupC(false);
          }}
          handleAddCustomer={(data: any) =>
            handleConvertCustomer(data)
          }
        isHigh
        isLoadingB={isLoadingB}
        handleLoading={setIsLoadingB}
        />
      }
       {isOpenPopupC &&
        <FormConvertCustomer
          isOpenPopup={isOpenPopupC}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsClosePopupC(true);
            setIsOpenPopupC(false);
          }}
          valUpdate={stateInfoDetailCustomer.lead}
          isUpdate
          isClose={isClosePopupC}
          handleClose={() => {
           
            setIsClosePopupC(true);
            setIsOpenPopupC(false);
          }}
          handleAddCustomer={(data: any) =>
            handleConvertCustomer(data)
          }
        isHigh
        isLoadingB={isLoadingB}
        handleLoading={setIsLoadingB}
        />
      }
       <CModal
              isOpen={isAddTask}
              widths={800}
              onCancel={() => {
                setIsAddTask(false);
                setIsUpdateTask(false);
                setFormData({
                  ...formData,
                  task_his_id: null,
          remind_datetime: undefined as unknown as Date,
          task_description: undefined as unknown as string,
          task_name: undefined as unknown as DropdownData,
          note: undefined as unknown as string,
         
          exec_u_id: null as unknown as string,
          category_id: undefined as unknown as DropdownData,
                  id: null,
           assign: undefined as unknown as DropdownData,
                  personCharge: undefined as unknown as DropdownData,
                type: OptionCustomerTask[1],
                });
              }}
              isHideFooter
              zIndex={9999}
            >
              <div className="t-list_job_form">
               <div className="t-list_job_form_content">
                         <div style={{ flex: 7 , marginBottom:10}}>
                             <Dropdown
                               label='Chọn nhóm việc'
                   dropdownOption={userguidType.filter(
               (item) => item.task_type_group?.toUpperCase() === "LEAD"
             )}
                   variant="simple"
                   isColor
                   placeholder="-- Chọn nhóm việc --"
                   values={formData.category_id}
                               handleSelect={(item: any) => {
                   
                                 setFormData({ ...formData, category_id: item.value });
                                 setListTasks(hanldeConvertListTask(item?.task_type_id));
                   }}
                 />
                         </div>
                         <div style={{ flex: 7 , marginBottom:10}}>
                             <Dropdown
                               label='Chọn công việc'
                   dropdownOption={listTasks || []}
                   variant="simple"
                   isColor
                   placeholder="-- Chọn công việc --"
                   values={formData.task_name}
                               handleSelect={(item: any) => {
                   
                                 setFormData({ ...formData, task_name: item.value });
                               
                   }}
                 /> 
               </div>
                         {/* <Input
                           label="Tên công việc"
                           isRequired
                           value={formData.task_name}
                           variant="border8"
                           placeholder="Nhập tên công việc"
                           onChange={(e) =>
                             setFormData({ ...formData, task_name: e.target.value })
                           }
                           error={formDataErr.name}
                         /> */}
                         <Input
                           label="Mô tả ngắn"
                           value={formData.task_description}
                           variant="border8"
                           placeholder="Nhập mô tả"
                           onChange={(e) =>
                             setFormData({ ...formData, task_description: e.target.value })
                           }
                         />
                          {/* <div style={{ display: "flex", gap: "10px", marginBottom: "10px",alignItems:"center" }}>
               <div style={{ flex: 5 }}>
                   <Dropdown
                                 dropdownOption={listEmployeeTeams}
                                 isRequired
                                 placeholder=""
                                 label="Phân công cho"
                                 handleSelect={(item) => {
                                   setFormData({ ...formData, assign: item });
             
                                   console.log(item.value)
                                   setListPerson(hanldeConvertListCustomer(item?.value));
                                 }}
                                 variant="style"
                                 className="form_origin"
                                 values={formData.assign}
                               />
               </div>
             
               <div style={{ flex: 5 }}>
                 <Dropdown
                                dropdownOption={listPerson || []}
                                isRequired
                                placeholder="Chọn người đảm nhiệm"
                                label="Người đảm nhiệm"
                                handleSelect={(item) => { setFormData({ ...formData, personCharge: item }); }}
                                variant="style"
                                className="form_origin"
                                values={formData.personCharge}
                              />
               </div>
             </div> */}
                         <div style={{ display: "flex", gap: "10px", marginBottom: "10px",alignItems:"center" }}>
               <div style={{ flex: 3 }}>
                 <CDatePickers
                   isRequired
                   label="Hạn chót (deadline)"
                   handleOnChange={(date: any) => {
                     setFormData({ ...formData, remind_datetime: date?.$d });
                   }}
                   variant="style"
                   fomat="YYYY-MM-DD HH:mm"
                   isShowTime
                   placeholder="1990-01-01"
                   value={formData.remind_datetime}
                   error={formDataErr.deadline}
                 />
               </div>
             
               
             </div>
                         {/* <GroupRadio  options={OptionCustomerTask.filter(opt => opt.id !== 0)} value={formData.type} handleOnchangeRadio={(data: any) => setFormData({ ...formData, type: data })} /> */}
                         <TextArea
                           label="Ghi chú"
                           placeholder="Mô tả công việc"
                           required
                           id=""
                           readOnly={false}
                           handleOnchange={(e) =>
                             setFormData({ ...formData, note: e.target.value })
                           }
                         />
                       </div>
                <div className="t-list_job_form_content_btn">
                  <div
                    className="blue-hover-effect"
                    style={{
                      display: "flex",
                      textAlign: "center",
                      minWidth: "100px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      fontWeight: "600",
                      border: "1px solid #e3e1e1",
                      padding: "5px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setIsAddTask(false);
                      setIsUpdateTask(false);
                      setFormData({
                        ...formData,
                        task_his_id: null,
                        remind_datetime: undefined as unknown as Date,
                        task_description: undefined as unknown as string,
                        task_name:undefined as unknown as DropdownData,
                        note: undefined as unknown as string,
                        exec_u_id: stateEmployeeId,
                        category_id: undefined as unknown as DropdownData,
                        id: null,
                      });
                    }}
                  >
                    <Typography
                      type="span"
                      modifiers={["400", "16x24"]}
                      content="Đóng"
                    />
                  </div>
                  <div
                    onClick={handleAddTask}
                    //   className='orange-hover-effect'
                    className={mapModifiers(
                      "green-hover-effect",
                      isLoadingGetService && "pendding"
                    )}
                    style={{
                      display: "flex",
                      minWidth: "100px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      border: "1px solid #e3e1e1",
                      padding: "5px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {isLoadingGetService ? (
                      <Icon iconName={"loading_crm"} isPointer />
                    ) : (
                      <Typography
                        type="span"
                        modifiers={["400", "16x24"]}
                        content="Lưu công việc"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CModal>
      <CModal
              isOpen={isOpenModal}
              onCancel={() => { setIsOpenModal(false); }}
              title={'Thêm mới hướng dẫn'}
              widths={600}
              zIndex={100}
              onOk={handleSubmit}
              textCancel='Hủy'
              textOK='Lưu'
              className='t-support_libraries_modal'
            >
              {formUserGuid}
      </CModal >
      <CModal
              isOpen={openModalGuidDetail}
              onCancel={() => { setIsOpenModal(false); }}
              title={'Hướng dẫn chi tiết'}
              widths={600}
              zIndex={100}
        onOk={() => { 
          setOpenModalGuidDetail(false);
        }}
        textCancel='Hủy'
        isHideCancel
              textOK='Đóng!'
              className='t-support_libraries_modal'
            >
      <div style={cardStyle}>
      <div style={titleStyle}>{guidDetail.guid_title}</div>

      <div>
        <span style={labelStyle}>Danh mục:</span>
        <span style={valueStyle}>{guidDetail.category?.name}</span>
      </div>

      <div
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: guidDetail.guid_content }}
      />

      {guidDetail.guid_suggest && (
        <div
          style={{
            backgroundColor: "#eaf4ff",
            padding: "12px",
            marginTop: "16px",
            borderLeft: "4px solid #4285f4",
            fontSize: "1rem",
          }}
        >
          <strong>Gợi ý:</strong> {guidDetail.guid_suggest}
        </div>
      )}

      <div style={timeStyle}>
        <span style={labelStyle}>Cập nhật lúc:</span>
        <span>
          {new Date(guidDetail.guid_update_datetime).toLocaleString("vi-VN")}
        </span>
      </div>

   {guidDetail.tags?.length > 0 && (
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "row", gap:5 }}>
              Tags:   <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {guidDetail.tags?.map((tag:any) => (
            <span key={tag.tag_id} style={{border: "1px solid #f3f3f3", padding:3,borderRadius:3}} >
              {tag.tag_name}
            </span>
          ))}
         </div>
        </div>
      )}
    </div>
      </CModal >
      <CModal
        isOpen={dataFilterGPT.opemnModal}
        confirmLoading={isLoadingGPT}
        onCancel={() => {
        
          setDataFilterGPT({
            ...dataFilterGPT,
            opemnModal: false,
            prompt: '',
          });
        }}
              title={'Hỏi AI'}
              widths={600}
              zIndex={100}
              onOk={handleGetDataGPT}
        textCancel='Đóng'
              textOK='Hỏi'
              className='t-support_libraries_modal'
            >
              <Input
              label="Câu hỏi:"
              
              value={dataFilterGPT.prompt}
              variant="border8"
              placeholder="Nhập câu hỏi"
              onChange={(e) =>
                setDataFilterGPT({ ...dataFilterGPT, prompt: e.target.value })
              }
              error={formDataErr.name}
        />
        <div>
          <strong>Gợi ý từ AI:</strong> <br></br> {dataGPT}
          <br></br>
          {
            dataGPT !== '' ? (
              <strong style={{textDecoration:"underline"}} onClick={() => {
                setConversation({
                  ...conversation,
                  guid_content: dataGPT,
                })
                setIsOpenModal(true);
              }}>Thêm vào hướng dẫn!</strong>
            ) : null
          }
          <br></br>
        </div>
      </CModal >
      <CModal
              isOpen={ stateDataAssign.openModal }
        onCancel={() => {
        
          setStateDataAssign({
            ...stateDataAssign,
            openModal: false,
            follow_employee_id: listUsers[0],
          });
        }}
              title={'Chọn nhân viên theo dõi'}
              widths={600}
              zIndex={100}
              onOk={handlePostAssign}
        textCancel='Đóng'
              textOK='Chọn'
              className='t-support_libraries_modal'
            >
                <Dropdown4
                                   dropdownOption={[
                                   
                                     ...listUsers,
                                   ]}
                                   variant="simple"
                                   isColor
                                   placeholder="-- Chọn nhân viên --"
                                   values={stateDataAssign.follow_employee_id}
                                   handleSelect={(item: any) => {
                                     setStateDataAssign({ ...stateDataAssign, follow_employee_id: item });
                                     
                                   }}
                                 />
      </CModal >
  <CModal
               isOpen={stateChangeStatusTask.openModal}
         onCancel={() => {
         
           setStateChangeStatusTask({
             ...stateChangeStatusTask,
             openModal:false
           })
         }}
               title={'Thay đổi trạng thái công việc'}
               widths={600}
               zIndex={100}
               onOk={handleChangeStatusTask}
         textCancel='Đóng'
               textOK='Thay đổi'
               className='t-support_libraries_modal'
       >
         <div style={{ width: "100%", padding: "10px 0px" }}>
         <GroupRadio  options={OptionCustomerTask.filter(opt => opt.id !== 0)} value={stateChangeStatusTask.status} handleOnchangeRadio={(data: any) => setStateChangeStatusTask({ ...stateChangeStatusTask, status: data })} />
           <div style={{marginTop:10}}>
           <Input
            
            value={stateChangeStatusTask.note}
            variant="border8"
            placeholder="Nhập ghi chú"
            onChange={(e) =>
              setStateChangeStatusTask({ ...stateChangeStatusTask, note: e.target.value })
            }
          />
          </div>
           </div>
       </CModal>
         <CModal
               isOpen={stateAssignTask.openModal}
         onCancel={() => {
         
           setStateAssignTask({
             ...stateAssignTask,
             openModal:false
           })
         }}
               title={'Chuyển công việc cho nhân viên khác'}
               widths={600}
               zIndex={100}
               onOk={handleAssignTask}
         textCancel='Đóng'
               textOK='Chuyển'
               className='t-support_libraries_modal'
       >
         <div style={{ width: "100%", padding: "10px 0px" }}>
         <Dropdown
                    dropdownOption={listPersonA || []}
                    isRequired
                    placeholder="Chọn người đảm nhiệm"
                    label="Người đảm nhiệm"
                    handleSelect={(item) => { setStateAssignTask({ ...stateAssignTask, exec_u_id: item }); }}
                    variant="style"
                    className="form_origin"
                    values={stateAssignTask.exec_u_id}
                  />
           <div style={{ marginTop: 10 }}>
           <Input
               isRequired
               label='Ghi chú'
            value={stateAssignTask.note}
            variant="border8"
            placeholder="Nhập ghi chú"
            onChange={(e) =>
             setStateAssignTask({ ...stateAssignTask, note: e.target.value })
            }
          />
          </div>
           </div>
      </CModal>
        <CModal
                    isOpen={isSelectService}
                    onCancel={() => {
                      setIsSelectService(false);
                    }}
                    widths={"100vw"}
                    isHideFooter
                    isHeight
                  >
                     <Spin
                          spinning={loadingP}
                      size="large"
                      style={{maxHeight:"auto"}}
                          indicator={
                            <img
                              className="loader"
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: 'cover',
                                backgroundColor: 'transparent',top:"100%"
                              }}
                              src={logo}
                            />
                          } > 
                    <div className="m-form_add_customer-booking_box">
                       <div
                      //    className="m-form_add_customer-booking_box_header"
                          style={{ alignItems: "end", justifyContent: "space-between" }}
                        >
                          <div
                            style={{ display: "flex", gap: "15px", alignItems: "center" }}
                          >
                          
            
                          <div style={{width:"250px", marginTop:"15px"}}>
                             <InputA
                                                autoFocus
                                                id="customerFullName"
                                                label="Họ tên:"
                                                placeholder="Nhập họ tên của khách hàng"
                                                variant="simple"
                                                isRequired
                                                error={errorForm?.name}
                                                value={dataForm.name}
                                               onChange={(e) => {
                                                 setDataForm({
                                                    ...dataForm,
                                                    name: e.target.value.toUpperCase(),
                                                   });
                                                 clearStateErrorForm("name");
                                                }}
                                              />
                          </div>
                          <div style={{maxWidth:"110px",marginTop:"15px"}}>
                              <InputA
                                                autoFocus
                                                id="customerFullName"
                                                label="Năm sinh:"
                                                placeholder="Nhập năm sinh"
                                                variant="simple"
                                                  type='number'
                                              
                                                value={dataForm.dayOfBirth}
                                                onChange={(e) => {
                                                setDataForm({
                                                    ...dataForm,
                                               dayOfBirth: e.target.value,
                                                  });
                                                  clearStateErrorForm("dayOfBirth");
                                               }}
                          />
                             </div >
                          <div style={{maxWidth:"110px", paddingBottom:"5px", minWidth:"90px"}}>
                              <Dropdown
                                                dropdownOption={listGenders}
                                                placeholder="Nam"
                            label="giới tính:"
                            isRequired
                                                handleSelect={(item) => {
                                                  setDataForm({ ...dataForm, gender: item });
                                                }}
                                                variant="simple"
                              values={(dataForm.gender as any) || undefined}
                              
                                              />
                           </div>
                           
                          <div style={{ maxWidth: "110px", marginTop: "15px" }}>
                          <InputA
                                                autoFocus
                                                id="customerFullName"
                                                label="Chiết khấu (VNĐ)"
                                                placeholder="Nhập chiết khấu"
                                                variant="simple"
                                                type='number'
                                               // error={errorForm?.name}
                                                value={dataForm.discount.toString()}
                                                 onChange={(e) => {
                                                   setDataForm({
                                                     ...dataForm,
                                                     discount: e.target.value.toUpperCase(),
                                                   });
                                                   clearStateErrorForm("discount");
                                                 }}
                          /></div>
                          <div style={{paddingTop:"20px"}}>
                                                  <Checkbox
                                                    label="BHYT?"
                                                    isChecked={dataForm.isCheckInsurance}
                                                    onChange={(check: any) => {
                                                      setDataForm({
                                                        ...dataForm,
                                                        isCheckInsurance: !dataForm.isCheckInsurance
                                                      });
                                                    }}
                                                  />
                          </div>
                          {
                            dataForm.isCheckInsurance === true && (
                               <div style={{ maxWidth: "140px", marginTop: "15px" }}>    <InputA
                                                autoFocus
                                                id="customerFullName"
                                                label="Mức hưởng BHYT:"
                                                placeholder="Nhập mức hưởng BHYT (%)"
                                                variant="simple"
                                                  type='number'
                                                error={errorForm?.insuranceObjectRatio}
                                                value={dataForm.insuranceObjectRatio}
                                                isRequired
                                                 onChange={(e) => {
                                                   setDataForm({
                                                     ...dataForm,
                                                     insuranceObjectRatio: e.target.value.toUpperCase(),
                                                   });
                                                   clearStateErrorForm("insuranceObjectRatio");
                                                 }}
                          /> </div>
                            )
                          }
                           <div style={{ display: "flex", gap: "5px" , marginTop:"20px"}}>
                                    <div
                             
                              style={{
                                width: "150px",
                                background: "#28a745",
                                height: "30px",
                                borderRadius: "4px",
                                color: "white",
                                padding: "0.5rem 1.25rem",
                                textTransform: "capitalize",
                                boxShadow:
                                  "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
                                fontSize: "0.9375rem",
                                fontWeight: "400",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                 cursor:"pointer"
                              }}
                              onClick={() => {
                                onSubmit();
                              }}
                            >
                              <img
                                src={imgSave}
                                alt=""
                                sizes="20"
                                style={{
                                  height: "19px",
                                  width: "19px",
                                  marginRight: "3px",
                                }}
                              />{" "}
                              <Typography content="Lưu báo giá" modifiers={["400"]} />
                            </div>
                            <div
                              onClick={() => {
                                setServiceSelected([]);
                              }}
                              style={{
                                width: "150px",
                                background: "#dc3545",         
                                height: "30px",
                                borderRadius: "4px",
                                color: "white",
                                padding: "0.5rem 1.25rem",
                                textTransform: "capitalize",
                                boxShadow:
                                  "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
                                fontSize: "0.9375rem",
                                fontWeight: "400",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                 cursor:"pointer"
                              }}
                            >
                              <img
                                src={imgDelete}
                                alt=""
                                sizes="20"
                                style={{
                                  height: "23px",
                                  width: "23px",
                                  marginRight: "3px",
                                }}
                              />{" "}
                              <Typography
                                content="Xóa tất cả"
                                modifiers={["400"]}
                                styles={{ marginTop: "3px" }}
                              />
                            </div>
                               <div                 
                              onClick={() => {
                                //setServicePackageId("");
                                //setNotePackage("");
                                // clearStateForm()
                                // setServiceSelected([]);
                              
                                setIsSelectService(false);
                              }}
                              style={{
                                width: "90px",
                                background: "#858585",
                                height: "30px",
                                borderRadius: "4px",
                                color: "white",
                                padding: "0.5rem 1.25rem",
                                textTransform: "capitalize",
                                boxShadow:
                                  "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
                                fontSize: "0.9375rem",
                                fontWeight: "400",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                 cursor:"pointer"
                              }}
                            >
                              <img
                                src={imgClose}
                                alt=""
                                   sizes="20"
                                style={{
                                  height: "23px",
                                  width: "23px",
                                  marginRight: "3px",
                                }}
                              />{" "}
                              <Typography
                                content="Đóng"
                                modifiers={["400"]}
                                styles={{ marginTop: "3px" }}
                              />
                            </div>
                    
                          </div>
                          </div>
                          
                        
                        </div>
                        <div
                          className="m-form_add_customer-booking_box_header"
                          style={{ alignItems: "end", justifyContent: "space-between" }}
                        >
                          <div
                            style={{ display: "flex", gap: "5px", alignItems: "center" }}
                          >
                          
            
                            <Dropdown3
                            dropdownOption={listServicesAllowGroup?.flatMap((item) =>
              item.service_group_item.map((serviceItem: any) => ({
                label: (
                  <span>
                    {serviceItem.service_name} ({serviceItem.service_prices.toLocaleString()} VND) {""}
                    <span
                      style={{
                        backgroundColor: serviceItem.product_status === "NEW" ? "red" : "transparent",
                        color: serviceItem.product_status === "NEW" ? "white" : "transparent",
                        padding: "4px 6px",
                        borderRadius: "6px",
                      }}
                    >
                      {serviceItem.product_status === "NEW" ? "Mới" : "Cũ"}
                    </span>
                  </span>
                ),
                value: serviceItem.service_id,
                value2: serviceItem,
                searchText: `${serviceItem.service_name} - ${serviceItem.service_prices}`, // Chuỗi để tìm kiếm
              }))
            )}
                              label="Tìm kiếm dịch vụ"
                              placeholder="Nhập tên dịch vụ cần tìm..."
                              handleSelect={(item) => {
                                setSelectedService({
                                  label: item.label,
                                  value: item.value,
                                  id:1
                                })
                                handleConvertServiceSelected(item.value2 as any, true);
                                setTimeout(() => setSelectedService(undefined), 1000);
                              }}
                              variant="simple"
                              values={selectedService}
                              defaultValue={undefined}
                            />
            
                            <Dropdown
                              dropdownOption={[
                                // {
                                //   id: 99,
                                //   label: "Dịch vụ lẻ (không dùng gói)",
                                //   value: "no-package",
                                // },
                                ...listPackages,
                              ]}
                              // defaultValue={valUpdate?.origin as DropdownData}
                              isOpen={true}
                              openSelect={openSelect}
                              setOpenSelect={setOpenSelect}
                              label="Gói dịch vụ"
                              placeholder="Chọn gói dịch vụ để đặt lịch khám theo gói"
                              positions={120}
                             
                              handleSelect={(item) => {
                                setOpenSelect(false);
                                if (item.value === "no-package") {
                                  const e = {
                                    color: "#dc3545",
                                    department_id: "PK01",
                                    id: "KHAMDV122301",
                                    index: 3,
                                    is_exams: false,
                                    is_register_package: false,
                                    is_register_subclinical: true,
                                    label: "Không gói dịch vụ",
                                    register_type_id: "KTQ",
                                    value: "services",
                                  };
                                  setDataForm({
                                    ...dataForm,
                                  
                                    typeBooking: e,
                                  });
                                   setServiceSelected([]);
                                //  setServicePackageId("");
                       
                                  // setServiceSelected([]);
                                } else {
                                 
                                  
                                  const e = {
                                    color: "#28a745",
                                    department_id: "PK01",
                                    id: "KHAMDV122301",
                                    index: 1,
                                    is_exams: true,
                                    is_register_package: true,
                                    is_register_subclinical: false,
                                    label: "Gói",
                                    register_type_id: "KTQ",
                                    value: "package",
                                  };
                                  const getPackageById = statePackagesWithItem.find(
                                    (i) => i.package_id === item.id
                                  );
                                  setServiceSelected(getPackageById?.items);
                                  setPackageSelected(item);
                                  console.log(getPackageById?.items, item,getPackageById)
                                  setDataForm({
                                    ...dataForm,
                                    
                                    typeBooking: e,
                                  });
                                 
                              //    setServicePackageId(item.value);
                              
                                }
                              }}
                              variant="simple"
                              values={
                                packageSelected
                              }
                            />
            
                         
                          </div>
                          
                         
                        </div>
                        <div
                          className="m-form_add_customer-booking_box_body"
                          style={{ height: "calc(80vh - 120px)" }}
                        >
                          <div className="m-form_add_customer-booking_box_service" style={{height:"99%"}}>
                           {listServicesAllowGroup.length &&
                                           listServicesAllowGroup.map((parent: any) => {
                                             return (
                                               <div
                                                 key={parent.service_group_id}
                                                 className="m-form_add_customer-booking_box_service_item"
                                               >
                                                 {/* Đoạn code  CCollapse là hiện danh sách dịch vụ theo service_group_name */}
                                                 <CCollapse
                                                   key_default="1"
                                                   title={`${parent.service_group_name} (${parent?.service_group_item.length})`}
                                                 >
                                                   <div className="m-form_add_customer-booking_box_service_item_wrapper">
                                                     {parent?.service_group_item?.map((item: any) => (
                                                       <div
                                                         key={item.service_id}
                                                         className="m-form_add_customer-booking_box_service_item_children"
                                                       >
                                                         <Checkbox
                                                           label={item.service_name}
                                                           checked={serviceSelected.some(
                                                             (i) => i.service_id === item.service_id
                                                           )}
                                                           onChange={(data: any) => {
                                                             handleConvertServiceSelected(
                                                               item,
                                                               data?.target?.checked
                                                             );
                                                           }}
                                                         />
                                                       </div>
                                                     ))}
                                                   </div>
                                                 </CCollapse>
                                               </div>
                                             );
                                           })}
                        </div>
                        <div style={{height:"100%"}}>
                         
                           {dataForm.isCheckInsurance ? memoriesTableSelectedIS : memoriesTableSelected}
                        </div>
                        
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          {/* {dataForm?.typeBooking?.value === "package" &&
                          notePackage !== "" ? (
                            <p
                              style={{
                                marginRight: "4px",
                                color: "#ff0000",
                              }}
                            >
                                Bạn đã chọn: <span style={{ fontWeight: "600" }}>  {removeParenthesesContent(notePackage)}
                             
                                </span> -  Tổng số dịch vụ đã chọn:  <span style={{ fontWeight: "600" }}> {serviceSelected.length}</span> - Tổng số tiền:<span style={{ fontWeight: "600" }}>  {totalService} </span>
                            </p>
                          ) : (
                            <p
                              style={{
                                marginRight: "4px",
                                color: "#ff0000",
                              }}
                            >
                              Hiện tại bạn chưa chọn gói tầm soát nào!
                            </p>
                          )} */}
                        </div>
                      </div>
                      </Spin>
      </CModal>
         <CModal
                          isOpen={dataRemove.isOpenR}
              onCancel={() => {
                setDataRemove({
                  ...dataRemove,
                  isOpenR: false,
                  saleorder_ref:"",
      
                          }); }}
                          title={''}
                          widths={600}
                          zIndex={100}
                          onOk={handleRemoveQuoteCustomer}
                          textCancel='Hủy'
                          textOK='Xác nhận'
                          className='t-support_libraries_modal'
                        >
                        Bạn có chắc chắn muốn xóa báo giá này không?
            </CModal >
    </div>
  );
};

export default PageInfoLeads;