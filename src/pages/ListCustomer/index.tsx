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
import { DatePicker } from 'antd';
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
import MultiSelect from "components/molecules/MultiSelect";
import PublicTable from "components/molecules/PublicTable";
import PublicTableTask from 'components/molecules/PublicTableTask';
import RichTextEditor from "components/molecules/RichTextEditor";
import CModal from "components/organisms/CModal";
import CSteps from 'components/organisms/CSteps';
import InteractionHistory from 'components/organisms/InteractionHistory';
import InteractionHistory2 from 'components/organisms/InteractionHistory2';
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import dayjs from 'dayjs';
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
import { X } from 'lucide-react';
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
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
  postInteractAPI,
  postReallocateAPI
} from "services/api/beforeExams";
import { PayloadGetBeforeExams ,LeadResponse} from "services/api/beforeExams/types";
import {postAddTaskOfOneCustomer, postAssignTaskAPI, postChangeStatusTaskAPI, postNoteTask} from "services/api/tasks";
import { getListUserGuidsCRM } from 'store/afterexams';
import { getInfosCustomerById, getListNotesLog } from "store/customerInfo";
import { getListCustomerMaster } from 'store/customerList';
import { setShowNoteComponent } from "store/example";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListTask, getListTaskE } from "store/tasks";
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, hanldeConvertListCustomer2, previewBlobPDFOpenLink } from "utils/functions";
import { localeVN } from 'utils/staticState';

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
const Step1 = () => <div>Bước 1: Nhập thông tin cá nhân</div>;
const Step2 = () => <div>Bước 2: Xác thực email</div>;
const Step3 = () => <div>Bước 3: Hoàn tất</div>;
const ListGender = [
 
  { id: 2, label: "Nữ" ,value :"F"},
  { id: 3, label: "Nam" ,value :"M"},
]

const ListCustomer: React.FC = () => {
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepId, setCurrentStepId] = useState(0);
   const getFullName = Cookies.get("fullname");
  const [activeTab, setActiveTab] = useState("lstt")
  const stepsData = [
    { name: 'Tiếp nhận', component: <div>Step 1</div>, icon: <UserOutlined /> },
    // eslint-disable-next-line react/jsx-no-undef
    { name: 'Khai thác nhu cầu', component: <div>Step 2</div>, icon: <SolutionOutlined /> },
    { name: 'Theo dõi', component: <div>Step 3</div>, icon: <LoadingOutlined /> },
    { name: 'Đặt hẹn, xác nhận', component: <div>Step 4</div>, icon: <SmileOutlined /> },
    { name: 'Hủy hoặc dời hẹn', component: <div>Step 4</div>, icon: <SmileOutlined /> },
    { name: 'Khách hoàn thành', component: <div>Step 4</div>, icon: <SmileOutlined /> },
  ];
  const [isLead, setIsLead] = useState(true);
  const storeListCustomer = useAppSelector((state) => state.listCustomer.listCustomerMaster);
  const storeLoadingListCustomer = useAppSelector((state) => state.listCustomer.isLoadingResponCustomer);
  const listTask = useAppSelector((state) => state.listTaskReducer.taskList);
  const loadingListTask = useAppSelector((state) => state.listTaskReducer.loadingTaskList);
  const listTaskE = useAppSelector((state) => state.listTaskReducer.taskListE);
  const loadingListTaskE = useAppSelector((state) => state.listTaskReducer.loadingTaskListE);
  const listGuid = useAppSelector((state) => state.afterExams.listUserGuids2);
  const loadingListGuid = useAppSelector((state) => state.afterExams.loadingListUserGuids);
  const storageTags = localStorage.getItem("tagsCustomer");
  const storagelistPhares = localStorage.getItem("listPharesBeforeExams");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const storageTagsCustomer = localStorage.getItem("tagsCustomer");
  const storageUserguidTypes = localStorage.getItem("userguid_types");
  const storageCSKH = localStorage.getItem("listCSKH");
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const getRoles = localStorage.getItem('roles');
  const employeeId = localStorage.getItem("employee_id");
  const storestepsprocesslead = localStorage.getItem("stepsprocesslead");
  const storageEmployeeTeams = localStorage.getItem('employeeTeams');
  const storeListUser = localStorage.getItem("list_users");
  const storeTeamIDS = localStorage.getItem("team_ids");
      const storeFType = localStorage.getItem("newFType");
    const [listUsers, setListUsers] = useState<DropdownData[]>(
      storeListUser ? JSON.parse(storeListUser) : ""
  );
   const [fType, setFType] = useState<DropdownData[]>(
      storeFType ? JSON.parse(storeFType) : ""
    );
    const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateTagsCustomer, setStateTagsCustomer] = useState<DropdownData[]>(storageTagsCustomer ? JSON.parse(storageTagsCustomer) : []);
  // const [stateTeamIDS, setStateTeamIDS] = useState<string[]>(storeTeamIDS ? JSON.parse(storeTeamIDS) : []);
const [stateEmployeeId, setStateEmployeeId] = useState<any>(() => {
  try {
    return employeeId ? JSON.parse(employeeId) : "";
  } catch {
    return employeeId || "";
  }
});

  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [listPhares, setListPhares] = useState<DropdownData[]>(
    storagelistPhares ? JSON.parse(storagelistPhares) : ""
  );
  const [listeTags, setListeTags] = useState<TransferType[]>(
    storageTags ? JSON.parse(storageTags) : ""
  );
  const [listCSKH, setListCSKH] = useState<any[]>(
    storageCSKH ? JSON.parse(storageCSKH) : []
  );
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
    const [stateDataAssign, setStateDataAssign] = useState({
      openModal: false,
      lead_id: 0,
      follow_employee_id:  listUsers[0]
    })
  const [listNodeLoading, setListNodeLoading] = useState(false);
  useEffect(() => {
    setListNode(listNotesCustomer);
  }, [listNotesCustomer]);
  const [dataListCustomer, setDataListCustomer] = useState(storeListCustomer || []);
  const [dataListTask, setDataListTask] = useState(listTask || []);
  const [dataListTaskE, setDataListTaskE] = useState(listTaskE || []);
  const [dataListGuid, setDataListGuid] = useState(listGuid || []);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
  const [isOpenPopupP, setIsOpenPopupP] = useState(false);
  const [isClosePopupP, setIsClosePopupP] = useState(false);
  const [isOpenPopupC, setIsOpenPopupC] = useState(false);
  const [isClosePopupC, setIsClosePopupC] = useState(false);

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

  const [isAddTag, setIsAddTag] = useState(false);
  const [dataUpdateTag, setDataUpdateTag] = useState<TransferItemType[]>();
  const [customerInfoAddTag, setCustomerInfoAddTag] = useState();
  const [isAddTask, setIsAddTask] = useState(false);
  const [isAddTask1, setIsAddTask1] = useState(false);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [isopenModalTask, setIsOpenModalTask] = useState(false)
  const [dataAddNote, setDataAddNote] = useState({
    openAddNote: false,
    id:  0,
    node_type: "all",
  });
  const [stateChangeStatusTask, setStateChangeStatusTask] = useState({
    openModal: false,
    id:  0,
    note: "",
    status: OptionCustomerTask[1],
  });
  const [stateAssignTask, setStateAssignTask] = useState({
    openModal: false,
    id:  0,
    note: "",
    exec_u_id: undefined as unknown as DropdownData,
  });
  const [formData, setFormData] = useState({
    task_his_id: null,
    remind_datetime: undefined as unknown as Date,
    task_description: undefined as unknown as string,
    task_name: undefined as unknown as string,
    note: undefined as unknown as string,
    lead_id: 0,
    exec_u_id: stateEmployeeId,
    category_id: undefined as unknown as DropdownData,
    id: null,
     assign: undefined as unknown as DropdownData,
    personCharge: undefined as unknown as DropdownData,
          type: OptionCustomerTask[1],
  });
  const [listPerson, setListPerson] = useState<DropdownData[]>();
  const [formDataGuid, setFormDataGuid] = useState({
    limit: 50,
    page: 1,
    keyword:  "",
    guid_status: statusGuid[0].value || "pending",
    category_id: userguidType[0].id || 1,
  });
  const [formDataErr, setFormDataErr] = useState({
    name: "",
    group: "",
    deadline: "",
    desc: "",
  });

  const [stateNoteTask, setStateNoteTask] = useState({
    openModal: false,
    note: "",
    id:0
  })
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
  
    owner_id: "",
    gender_id:  { id: 1, label: "Tất cả" ,value :"all"},
    launch_source_group_id: {
      id: 0,
      label: "Tất cả",
      value: "0"
    },
    launch_source_ids: {
      id: 99,
      label: "Tất cả",
      value: "all"
    },
    follower_employee_id: {
      id: 99,
      label: "Tất cả",
      value: "all"
    },
    f_type:{
      id: 99,
      label: "Tất cả",
      value: "all"
    },
    from_date: moment().startOf('month').format('YYYY-MM-DDT00:00:00'),
    to_date: moment().format('YYYY-MM-DDT23:59:59'),
    search_text: "",
    page_index: 1,
    row_limit: 200
  });

  const payloadBeforeExam = {
    owner_id: filterData.owner_id,
    gender_id: "all",
    launch_source_group_id: 0,
    launch_source_ids:"all",
    f_type: "all",
    follower_employee_id: "all",
    from_date:filterData.from_date,
    to_date:filterData.to_date,
    search_text: "",
    page_index: 1,
    row_limit: 200,
  };
  const bodyGetList = {
     owner_id: filterData.owner_id,
    gender_id: filterData.gender_id.value || filterData.gender_id,
    launch_source_group_id: filterData.launch_source_group_id.id === 0 ? filterData.launch_source_group_id.id : filterData.launch_source_group_id,
    launch_source_ids: filterData.launch_source_ids.value || filterData.launch_source_ids,
    f_type: filterData.f_type.value || filterData.f_type,
    follower_employee_id: filterData.follower_employee_id.value,
    from_date:filterData.from_date,
    to_date:filterData.to_date,
    search_text: filterData.search_text,
    page_index: 1,
    row_limit: 200,
  };
  console.log(bodyGetList)
  const [filterColumn, setFilterColumn] = useState({
    employeeFollow: [],
  });


 const [filterTask, setFilterTask] = useState({
     category_id: userguidType[0].id || 0,
     status:OptionCustomerTask[0].value || "all",
     id: 0,
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
    guid_u_id: stateEmployeeId,
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
                  dropdownOption={[ 
                    ,...userguidType
      ]}
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
  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(
      getListCustomerMaster(
        payloadBeforeExam as unknown as any
      )
    );

    dispatch(getListTaskE({ ...filterTaskAll } as unknown as any));
    setIsUpdateBeforeExams(false);
  }, []);
  useEffect(() => {
    setDataListTask(listTask);
  }, [listTask]);
  useEffect(() => {
    setDataListTaskE(listTaskE);
  }, [listTaskE]);
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

  // useEffect(() => {
  //   setFilterColumn({
  //     ...filterColumn,
  //     employeeFollow: handleGetOptionFilterColumn('follow_staff'),
  //   });

  // }, [dataListCustomer, listBeforeExams]);

  useEffect(() => {
    setDataListCustomer(storeListCustomer);
    // setCurrentItemOfTable(listBeforeExams?.data?.data);
    // setCountCustomer(listBeforeExams?.data?.count);
    document.title = "Danh sách khách hàng | CRM";
  }, [storeListCustomer]);

  /* CALL API */
  const [stateInfoDetailCustomer, setStateInfoDetailCustomer] = useState<any>([])
  const { mutate: postInfoDetailCustomer } = useMutation(
    "post-footer-form",
    (data: any) => getInfoDetailCustomer(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setStateInfoDetailCustomer(data?.data);
          setCurrentStep(data?.data?.step_id - 1);
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
          setDataLog({  node_type: undefined as unknown as DropdownData,
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
  const { mutate: postDataGPT } = useMutation(
    "post-footer-form",
    (data: any) => getDataGPT(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setDataGPT(data?.data);
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
    postDataGPT(body);
  }
  //
  const { mutate: postDataNoteTask } = useMutation(
    "post-footer-form",
    (data: any) => postNoteTask(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setStateNoteTask({
            ...stateNoteTask,
            openModal: false,
            id: 0,
            note:""
          })
          dispatch(getListTask({ ...filterTask } as unknown as any));
        } 
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handlePostNoteTask = () => {
    const body = {
      id: stateNoteTask.id,
      note: stateNoteTask.note
    }
    postDataNoteTask(body);
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
      id: stateChangeStatusTask.id,
      note: stateChangeStatusTask.note,
      status: stateChangeStatusTask.status.value
    }
    postChangeStatusTask(body);
  }
  //
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
      id: stateAssignTask.id,
      note: stateAssignTask.note,
      exec_u_id: stateAssignTask.exec_u_id.value
    }
    postAssignTask(body);
  }
  //
  const { mutate: getDataPancake } = useMutation(
    "post-footer-form",
    (data: any) => getListBeforeExamsFromPC(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListCustomerMaster({
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
    //
  const { mutate: postInteract } = useMutation(
    "post-footer-form",
    (data: any) => postInteractAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListCustomerMaster({
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
  const handlePostInteract = (id:any) => {
    const body = {
      lead_id: id,
    }
    postInteract(body);
  }
    //
  const { mutate: PostReallocate } = useMutation(
    "post-footer-form",
    (data: any) => postReallocateAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListCustomerMaster({
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
  
  //
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
           getListCustomerMaster({
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
          setIsOpenFormContact(false);
          setTableLoading(false);
         dispatch(
           getListCustomerMaster({
       ...bodyGetList,
         
          } as unknown as any)
          );
          window.open(
            `/customer-info/id/${data.data.info_uf_customer.customer_id}/history-interaction`,
            "_blank"
          );
          toast.success(
            "Chuyển đổi thành công"
          );

          setIsClosePopupC(true);
          setIsOpenPopupC(false);
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
            isUpdateCustomer
              ? "Cập nhật thông tin khách hàng thành công"
              : "Thêm khách hàng thành công"
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
        setDataListCustomer(undefined as any);
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
        setDataListCustomer(undefined as any);
        setTableLoading(true);
        setIsClosePopupC(true);
        postConvertCustomer(data);
        setIsOpenPopupC(false);
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
          task_name: undefined as unknown as string,
          note: undefined as unknown as string,
          exec_u_id: stateEmployeeId,
          category_id: undefined as unknown as DropdownData,
          id: null,
          assign: undefined as unknown as DropdownData,
          personCharge: undefined as unknown as DropdownData,
          type: OptionCustomerTask[1],
        });
        setIsAddTask(false); setIsLoadingGetService(false);
        setIsAddTask1(false); setIsLoadingGetService(false);
        dispatch(getListTaskE({ ...filterTaskAll } as unknown as any));
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
        category_id: formData?.category_id,
        exec_u_id: formData?.personCharge?.value || formData?.personCharge,
        lead_id: formData?.lead_id,
        task_name: formData?.task_name,
        task_description: formData?.task_description,
        note: formData?.note,
        task_his_id: formData?.task_his_id || null,
        status: formData?.type?.value,
        remind_datetime: moment(formData?.remind_datetime).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),

        id: formData?.id || null,
    };
    await postAddTask(body);
  
  };
  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    // dispatch(
    //   getListCustomerMaster({
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
        const newTag = data
          .filter((y: any) => y?.tag_group !== "htkh")
          ?.map((i: any) => i.tag_id);
        const tagHTKH = (customerInfoAddTag as any)?.tags
          ?.filter((y: any) => y?.tag_group === "htkh")
          ?.map((i: any) => i.tag_id);
        const body = {
          object_id: (customerInfoAddTag as any)?.is_customer_converted
            ? (customerInfoAddTag as any)?.customer_id
            : (customerInfoAddTag as any)?.lead_id,
          object_type: (customerInfoAddTag as any)?.is_customer_converted
            ? "customer"
            : "lead",
          tag_ids: [...newTag, ...tagHTKH],
        };
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

  const handlePostAssign = (leadId:any) => {
    const body = {
      lead_id: leadId,
      follow_employee_id:stateEmployeeId
    }
    postAssignE(body);
  }
    const handlePostAssignAdMin = () => {
    const body = {
      lead_id: stateDataAssign.lead_id,
      follow_employee_id:stateDataAssign.follow_employee_id.value
    }
    postAssignE(body);
  }
  const { mutate: postAssignE } = useMutation(
    "post-footer-form",
    (data: any) => postAssignAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListCustomerMaster({
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
  const [stateLeadId, setStateLeadId] = useState(0)
  const tableColumns = [
    
    {
      title: (<Typography content="Ngày tạo" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "create_date",
      align: "center",
     
      width: 90,
     
      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}
      
        >
          <Typography
         content={record ? moment(record).format('DD/MM/YYYY') : "---"}
            modifiers={["14x20", "600", "center", "uppercase"]}
          />
        
        </div>
      ),
    },
   
      {
      title: (<Typography content="Họ tên" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "customer_fullname",
      align: "center",
     
      width: 170,
     
      className: "ant-table-column_wrap-colum",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "600", "justify", "uppercase"]}
          />
        
        </div>
      ),
    },
    
    {
      title: (
        <Typography content="Số điện thoại" modifiers={["14x20", "500", "center", "main"]} />
      ),
      dataIndex: "customer_phone",
      align: "center",
      width:100,
      className: "ant-table-column_wrap",
      sorter: (a:any, b:any) => {
        const hasPhoneA = a.lead_phone ? 1 : 0;
        const hasPhoneB = b.lead_phone ? 1 : 0;
        return hasPhoneB - hasPhoneA; // giá trị có sđt lên trước
      },
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
             window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
          }}
        >
          <Typography
            content={record ? record.replace(/^.{4}/, "0") : "---"}
            modifiers={["14x20", "400", "center"]}
          />
        </div>
      ),
    },
       {
      title: (<Typography content="Giới tính" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "gender",
      align: "center",
      width: 70,
         className: "ant-table-column_wrap",
      
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
          onClick={() => {
             window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}
        >
         <div
          >
              <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "500", "justify", "uppercase"]}
          />
          </div>
        </div>
      ),
    },
    {
      title: (<Typography content="Loại khách hàng" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "f_type",
      align: "center",
      width: 70,
      className: "ant-table-column_wrap",
       filters: fType.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => {
        console.log(value,record.f_type)
        return record.f_type === value
      },
      render: (record: any, data: any) => (
        <div className="ant-table-column_item"
          onClick={() => {
            window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}
        >
         <div
          >
              <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "500", "justify", "uppercase"]}
          />
          </div>
        </div>
      ),
    },
    {
      title: (<Typography content="Nhóm nguồn" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "launch_source_group_name",
      align: "center",
      width: 200,
      filters: stateLaunchSourceGroups.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => {
        return record?.launch_source_group_id === value
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
     window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}>
            <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "500", "justify", "uppercase"]}
          />
        </div>
      ),
    },
   
    {
      title: (<Typography content="Nguồn" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "launch_source_name",
      align: "center",
      width: 80,
      filters: stateLaunchSource.map((group) => {
        const obj = { text: group.label, value: group.value }
        return obj;
      }),
      onFilter: (value: any, record: any) => {
        return record?.source_id === value
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
         window.location.href =  `/customer-info/id/${data.customer_id}/history-interaction`;
        }}>
  <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "500", "justify", "uppercase"]}
          />        </div>
      ),
    },
    // {
    //   title: (<Typography content="Hình thức chuyển đổi" modifiers={["14x20", "500", "center", "main"]} />),
    //   dataIndex: "source_type_id",
    //   align: "center",
    //   width: 150,
    //   filters: stateLaunchSourceTypes.map((group) => {
    //     const obj = { text: group.label, value: group.value }
    //     return obj;
    //   }),
    //   onFilter: (value: any, record: any) => {
    //     return record?.source_type_id === value
    //   },
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //      window.location.href = `/lead-info?id=${data.lead_id}`;
    //     }}>
    //       <Typography content={stateLaunchSourceTypes.find(item => item.id === record)?.label} modifiers={["14x20", "400", "center"]} />
    //     </div>
    //   ),
    // },
   
  ];
  const tableColumnsE = [
    {
      title: (<Typography content="Deadline" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "remind_datetime",
      align: "center",
     
      width: 100,
     
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
            id: data.id,
            assign: undefined as unknown as DropdownData,
            personCharge: data.own_u_id,
            type: data.status,
          
          });
          setIsAddTask1(true)
        }}
      
        >
         <Typography
  content={record ? moment(record).format("DD-MM-YYYY") : "---"}
  modifiers={["14x20", "500", "center", "uppercase"]}
  styles={{
    fontSize: 13,
    color: record && moment(record).isBefore(moment(), "day") ? "red" : undefined
  }}/>
        
        </div>
      ),
    },
    {
      title: (<Typography content="Tên công việc" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "task_name",
      align: "center",
     
      width: 120,
     
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
            id: data.id,
            assign: undefined as unknown as DropdownData,
            personCharge: data.own_u_id,
            type: data.status,
          
          });
          setIsAddTask1(true)
        }}
      
        >
          <Typography
         content={record ?record : "---"}
            modifiers={["14x20", "600", "center", "uppercase"]}
            styles={{fontSize:13}}
          />
        
        </div>
      ),
    },
   
      {
      title: (<Typography content="Mô tả công việc" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
      dataIndex: "task_description",
      align: "center",
     
      width: 200,
     
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
            id: data.id,
            assign: undefined as unknown as DropdownData,
            personCharge: data.own_u_id,
            type: data.status,
          
          });
          setIsAddTask1(true)
        }}
        style={{marginLeft:"13px"}}
        >
          <Typography
         content={record ? record : "---"}
            modifiers={["14x20", "500", "justify", "uppercase"]}
            styles={{fontSize:12}}
          />
        
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
              id: data.id,
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
              id: data.id
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
  const contentTab = useMemo(() => {
    switch (currentStepId) {
      case 0:
        return (
          <div style={{ width:"100%", margin: '0 auto' }}>
            <div className="m-customer_infos_input_enter">
              <div style={{ display: 'flex', flexDirection: 'row', padding: '0px 12px' }}>
                <div style={{flex:7}}>
                  <div style={{width:"97%", marginTop:"10px"}}>
                  <TextArea
              id=""
              readOnly={false}
              value={dataLog.note_node_content}
              placeholder="Nhập các ghi chú cần thiết mô tả chân dung khách hàng"
                      handleOnchange={(e) => setDataLog({ ...dataLog, note_node_content: e.target.value })}
             
            />
                </div>
           </div>
            <div className="m-customer_infos_input_btn" style={{flex:3, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{width:"70%"}}>
                  <Dropdown
                dropdownOption={listTouchPointLogType}
                defaultValue={listTouchPointLogType[0]}
                placeholder="Nam"
                handleSelect={(item: any) => {
                  setDataLog({ ...dataLog, node_type: item })
                }}
                variant="simple"
              />
             </div>
             
                  <div style={{marginTop:5}}>
                  <Button modifiers={['foreign']} onClick={() => {
                      const body = {
                        node_type: dataLog.node_type.value,
                        note_node_content: dataLog.note_node_content,
                        note_attach_url: dataLog.note_attach_url,
                        lead_id: dataLog.lead_id
                    }
                    handlePostLog(body)
              }}
              style={{}}
              >
                <Typography content="Lưu note" modifiers={['400']} />
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
          <div style={{width:"100%"}}>
            <div style={{ display: "flex", justifyContent: "end", alignItems: "center", paddingTop: "10px", paddingRight: "10px" }}>
            <div style={{width:"15%"}}>
            <Button
              style={{padding: "10px 0px", width:"15%" }}
                        modifiers={["foreign"]}
                        onClick={async () => {
                          setIsOpenPopupP(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Đặt lịch"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
            </div>
            </div>
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
                <div style={{width:"50%"}}>
            <Button
              style={{padding: "10px 0px" }}
                        modifiers={["orange"]}
                        onClick={async () => {
                          setDataFilterGPT({
                            opemnModal: true,
                            prompt: '',
                          });
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Hỏi AI"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
                </div>
                <div style={{width:"50%"}}>
            <Button
              style={{padding: "10px 0px" }}
                        modifiers={["foreign"]}
                        onClick={async () => {
                          setIsOpenModal(true);
                        }}
                      >
                        {
                          stateBreakPoint < 1440 ?
                            <Icon iconName="add" size="20x20" />
                            :
                            <Typography
                              content="Thêm hướng dẫn"
                              modifiers={["400"]}
                            />
                        }
                      </Button>
            </div>
          </div>
              <div style={{marginBottom:3, display:"flex", gap:5}}>
              <Dropdown
                  dropdownOption={[ {
                label:"Tất cả" ,   value: 0,}
                    ,...userguidType
      ]}
      variant="simple"
      isColor
      placeholder="-- Chọn danh mục --"
      values={formDataGuid.category_id}
      handleSelect={(item: any) => {
        setFormDataGuid({ ...formDataGuid, category_id: item.value });
        dispatch(getListUserGuidsCRM({ ...formDataGuid,category_id:item.value } as unknown as any));
      }}
                />
                 <Dropdown
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
    />
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
                             label:"Tất cả" ,   value: 0,}
                                 ,...userguidType
                   ]}
                   variant="simple"
                   isColor
                   placeholder="-- Chọn danh mục --"
                   values={filterTask.category_id}
                   handleSelect={(item: any) => {
                     setFilterTask({ ...filterTask, category_id: item.value });
                     dispatch(getListTask({ ...filterTask,category_id:item.value } as unknown as any));
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
  }, [currentStepId, dataListCustomer?.data, storeLoadingListCustomer, loadingListTask,dataListTask,dataListGuid,dataLog,listNotesCustomer]);
  // 
  const tableLeads = useMemo(() => {
    return (
      <>
      
     

       <PublicTable
            loading={storeLoadingListCustomer}
            column={tableColumns}
            listData={dataListCustomer?.data?.items}
            isHideRowSelect
            scroll={{ x: 'max-content', y: '100vh - 80px' }}
          
            size="middle"
            rowkey="id"
            isPagination
            pageSizes={50}
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
            totalItem={
               (
                dataListCustomer?.data?.paging?.total_count) ||
               0
            }
           
          />
      </>
      )
  }, [currentStep, dataListCustomer?.data, storeLoadingListCustomer, filterData]);
  const tableTask = useMemo(() => {
    return (
      <>
      
     

       <PublicTableTask
            loading={loadingListTaskE}
            column={tableColumnsE}
            listData={[...(dataListTaskE?.data || [])].sort((a, b) => {
              const timeA = new Date(a.remind_datetime).getTime();
              const timeB = new Date(b.remind_datetime).getTime();
              return timeA - timeB; // Gần nhất lên trước
            })}
            isHideRowSelect
            scroll={{ x: 'max-content', y: '30vh - 80px' }}
          
            size="middle"
            rowkey=""
            isPagination
            pageSizes={50}
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
            totalItem={
               (
                dataListCustomer?.data?.paging?.total_count) ||
               0
            }
           
          />
      </>
      )
  }, [loadingListTaskE,dataListTaskE]);
  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic handleClick={(data: any) => { }} title="Danh sách khách hàng" isStatistic={false} valueRangeDate={{ from: new Date(), to: new Date(), }} >
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
    [ isStatisticMobile, stateBreakPoint,filterData]
  );

   const tableListTask = [
    {
      title: (<Typography content="Deadline" modifiers={["14x20", "500", "center", "main"]} />),
      dataIndex: "remind_datetime",
      align: "center",
     
      width: 100,
     
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
            id: data.id,
            assign: undefined as unknown as DropdownData,
            personCharge: data.own_u_id,
            type: data.status,
          
          });
          setIsAddTask1(true)
        }}
      
        >
          <Typography
         content={record ? moment(record).format("DD-MM-YYYY") : "---"}
            modifiers={["14x20", "500", "center", "uppercase"]} styles={{fontSize:13}}
          />
        
        </div>
      ),
    },
        {
        title: (<Typography content="Người thực hiện" modifiers={["14x20", "500", "center", "main"]} styles={{textAlign:"left", marginLeft:"12px"}}/>),
        dataIndex: "own_u_name",
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
            // handlePostpostInfoDetailCustomer(data?.lead_id);
            // setFilterTask({
            //   ...filterTask,
            //   id: data?.lead_id,
            // })
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
          style={{marginLeft:"13px"}}
          >
            <Typography
              content={record}
              modifiers={["14x20", "600", "justify", "uppercase"]}
            />
          
          </div>
        ),
      },
      // { title: (<Typography content="Chúc vụ" modifiers={["14x20", "500", "center", "main"]} />), dataIndex: "own_team_name", align: "center", sorter: (a: any, b: any) => new Date(a?.lead_conversion_date).valueOf() - new Date(b?.lead_conversion_date).valueOf(), showSorterTooltip: false, width: 100, className: "ant-table-column_wrap", render: (record: any, data: any) => ( <div className="ant-table-column_item" onClick={() => { handlePostpostInfoDetailCustomer(data?.lead_id); setFilterTask({ ...filterTask, id: data?.lead_id, }) }}> <Typography content={record} modifiers={["13x18", "400", "center"]} /> </div> ), },
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
              id: data.id,
              assign: undefined as unknown as DropdownData,
              personCharge: data.own_u_id,
              type: data.status,
            
            });
            setIsAddTask1(true)
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
              id: data.id,
              assign: undefined as unknown as DropdownData,
              personCharge: data.own_u_id,
              type: data.status,
            
            });
            setIsAddTask1(true)
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
                id: data.id,
                assign: undefined as unknown as DropdownData,
                personCharge: data.own_u_id,
                type: data.status,
              
              });
              setIsAddTask1(true)
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
              id: data.id,
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
  </svg>  </CTooltip>      </div>
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
              id: data.id
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
    <title>Flow Sync</title>
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
//      {
//       title: (<Typography content="" modifiers={["14x20", "500", "center", "main"]}  />),
//       dataIndex: "task_last_note",
//       align: "center",
//       width: 70,
//       className: "ant-table-column_wrap",
//       render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
     
//           onClick={() => {
        
//             setStateNoteTask({
//               ...stateNoteTask,
//               openModal: true,
//               id:data.id
//             })
//           }}>
//                                   <CTooltip
//                                     placements="top"
//                                     title="Thêm note"
//                                     colorCustom="#00556e"
//                                   >
// <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 14V7C20 5.34315 18.6569 4 17 4H12M20 14L13.5 20M20 14H15.5C14.3954 14 13.5 14.8954 13.5 16V20M13.5 20H7C5.34315 20 4 18.6569 4 17V12" stroke="#00556e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 4V7M7 10V7M7 7H4M7 7H10" stroke="#00556e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>          </CTooltip></div>
//       ),
//      },
//      {
//       title: (<Typography content="" modifiers={["14x20", "500", "center", "main"]}  />),
//       dataIndex: "task_last_note",
//       align: "center",
//       width: 70,
//       className: "ant-table-column_wrap",
//       render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
     
//           onClick={() => {
//           handlePostpostInfoDetailCustomer(data?.lead_id);
//           setFilterTask({
//             ...filterTask,
//             id: data?.lead_id,
//           })
//           }}>
//                                   <CTooltip
//                                     placements="top"
//                                     title="Chuyển task"
//                                     colorCustom="#00556e"
//                                   >
//                                     <svg fill="#00556e" width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M455.944 674.824c-27.871 11.202-50.273 33.602-61.471 61.471-42.927 106.818 56.983 206.722 163.803 163.794 27.867-11.2 50.262-33.597 61.462-61.471 42.928-106.819-56.974-206.721-163.794-163.794zm-15.274-38.006c140.293-56.38 273.453 76.78 217.074 217.071-15.362 38.232-45.967 68.84-84.194 84.205-140.293 56.38-273.463-76.781-217.084-217.072 15.36-38.229 45.974-68.839 84.203-84.204zm25.514-513.93c-27.871 11.202-50.273 33.602-61.471 61.471-42.927 106.818 56.983 206.722 163.803 163.794 27.867-11.2 50.262-33.597 61.462-61.471 42.928-106.819-56.974-206.721-163.794-163.794zM450.91 84.882c140.293-56.38 273.453 76.78 217.074 217.071-15.362 38.232-45.967 68.84-84.194 84.205-140.293 56.38-273.463-76.781-217.084-217.072 15.36-38.229 45.974-68.839 84.203-84.204zM146.929 189.583h92.805c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48h-92.805c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48z"></path><path d="M260.214 261.908v-92.805c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v92.805c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48z"></path><path d="M250.011 849.625c-87.4-87.4-137.372-205.543-137.372-331.641 0-119.519 44.857-231.97 124.29-318.029 7.672-8.312 7.153-21.268-1.159-28.94s-21.268-7.153-28.94 1.159c-86.349 93.552-135.151 215.893-135.151 345.81 0 137.072 54.364 265.599 149.369 360.604 7.998 7.998 20.965 7.998 28.963 0s7.998-20.965 0-28.963zm626.436-5.999h-92.805c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48h92.805c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48z"></path><path d="M763.162 771.301v92.805c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-92.805c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z"></path><path d="M773.365 183.585c87.4 87.4 137.372 205.543 137.372 331.641 0 119.519-44.857 231.97-124.29 318.029-7.672 8.312-7.153 21.268 1.159 28.94s21.268 7.153 28.94-1.159c86.349-93.552 135.151-215.893 135.151-345.81 0-137.072-54.364-265.599-149.369-360.604-7.998-7.998-20.965-7.998-28.963 0s-7.998 20.965 0 28.963z"></path></g></svg>
//           </CTooltip></div>
//       ),
//     },
//       {
//         title: (<Typography content="" modifiers={["14x20", "500", "center", "main"]}  />),
//         dataIndex: "task_last_note",
//         align: "center",
//         width: 70,
//         className: "ant-table-column_wrap",
//         render: (record: any, data: any) => (
//           <div className="ant-table-column_item"
       
//             onClick={() => {
//             handlePostpostInfoDetailCustomer(data?.lead_id);
//             setFilterTask({
//               ...filterTask,
//               id: data?.lead_id,
//             })
//             }}>
//                                     <CTooltip
//                                       placements="top"
//                                       title="Chuyển task"
//                                       colorCustom="#00556e"
//                                     >
//                                       <svg fill="#00556e" width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M455.944 674.824c-27.871 11.202-50.273 33.602-61.471 61.471-42.927 106.818 56.983 206.722 163.803 163.794 27.867-11.2 50.262-33.597 61.462-61.471 42.928-106.819-56.974-206.721-163.794-163.794zm-15.274-38.006c140.293-56.38 273.453 76.78 217.074 217.071-15.362 38.232-45.967 68.84-84.194 84.205-140.293 56.38-273.463-76.781-217.084-217.072 15.36-38.229 45.974-68.839 84.203-84.204zm25.514-513.93c-27.871 11.202-50.273 33.602-61.471 61.471-42.927 106.818 56.983 206.722 163.803 163.794 27.867-11.2 50.262-33.597 61.462-61.471 42.928-106.819-56.974-206.721-163.794-163.794zM450.91 84.882c140.293-56.38 273.453 76.78 217.074 217.071-15.362 38.232-45.967 68.84-84.194 84.205-140.293 56.38-273.463-76.781-217.084-217.072 15.36-38.229 45.974-68.839 84.203-84.204zM146.929 189.583h92.805c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48h-92.805c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48z"></path><path d="M260.214 261.908v-92.805c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v92.805c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48z"></path><path d="M250.011 849.625c-87.4-87.4-137.372-205.543-137.372-331.641 0-119.519 44.857-231.97 124.29-318.029 7.672-8.312 7.153-21.268-1.159-28.94s-21.268-7.153-28.94 1.159c-86.349 93.552-135.151 215.893-135.151 345.81 0 137.072 54.364 265.599 149.369 360.604 7.998 7.998 20.965 7.998 28.963 0s7.998-20.965 0-28.963zm626.436-5.999h-92.805c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48h92.805c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48z"></path><path d="M763.162 771.301v92.805c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-92.805c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z"></path><path d="M773.365 183.585c87.4 87.4 137.372 205.543 137.372 331.641 0 119.519-44.857 231.97-124.29 318.029-7.672 8.312-7.153 21.268 1.159 28.94s21.268 7.153 28.94-1.159c86.349-93.552 135.151-215.893 135.151-345.81 0-137.072-54.364-265.599-149.369-360.604-7.998-7.998-20.965-7.998-28.963 0s-7.998 20.965 0 28.963z"></path></g></svg>
//             </CTooltip></div>
//         ),
//       },
//      {
//       title: (<Typography content="" modifiers={["14x20", "500", "center", "main"]}  />),
//       dataIndex: "task_last_note",
//       align: "center",
//       width: 70,
//       className: "ant-table-column_wrap",
//       render: (record: any, data: any) => (
//         <div className="ant-table-column_item"
     
//           onClick={() => {
//           handlePostpostInfoDetailCustomer(data?.lead_id);
//           setFilterTask({
//             ...filterTask,
//             id: data?.lead_id,
//           })
//           }}>
//                                   <CTooltip
//                                     placements="top"
//                                     title="Dời công việc"
//                                     colorCustom="#00556e"
//                                   >
//          <svg fill="#00556e" width="25px" height="25px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#00556e"> <path d="M1.5 8a6.5 6.5 0 016.744-6.496.75.75 0 10.055-1.499 8 8 0 107.036 11.193.75.75 0 00-1.375-.6 6.722 6.722 0 01-.22.453A6.5 6.5 0 011.5 8zM10.726 1.238a.75.75 0 011.013-.312c.177.094.35.194.518.3a.75.75 0 01-.799 1.27 6.512 6.512 0 00-.42-.244.75.75 0 01-.312-1.014zM13.74 3.508a.75.75 0 011.034.235c.106.168.206.34.3.518a.75.75 0 11-1.326.702 6.452 6.452 0 00-.243-.421.75.75 0 01.235-1.034zM15.217 6.979a.75.75 0 01.777.722 8.034 8.034 0 01.002.552.75.75 0 01-1.5-.047 6.713 6.713 0 000-.45.75.75 0 01.721-.777z"></path> <path d="M7.75 3a.75.75 0 01.75.75v3.786l2.085 1.043a.75.75 0 11-.67 1.342l-2.5-1.25A.75.75 0 017 8V3.75A.75.75 0 017.75 3z"></path> </g> </g></svg>
//         </CTooltip></div>
//       ),
//     },
    ];
  return (
    <div className="p-apointment_list">
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
                          isClearFilter={storeLoadingListCustomer || tableLoading}
                          handleGetTypeSearch={() => { }}
                          handleCleanFilter={() => {
                            setIsUpdateBeforeExams(false);
                           
                            
                  }}
      //             listBtn={
      //               <>
      //                       <Button
      //   style={{ width: "100%", padding: "10px 0px" }}
      //   modifiers={["foreign"]}
      //   onClick={async () => {
      //     handlegetDataPancake()
      //   }}
      // >
      //   {stateBreakPoint < 1440 ? (
      //     <Icon iconName="add" size="20x20" />
      //   ) : (
      //     <Typography content="Lấy dữ liệu từ PC" modifiers={["400"]} />
      //   )}
      // </Button>
      // <Button
      //         style={{padding: "10px 0px", }}
      //                   modifiers={["foreign"]}
      //                   onClick={async () => {
      //                     await setIsClosePopup(false);
      //                     setIsOpenPopup(true);
      //                   }}
      //                 >
      //                   {
      //                     stateBreakPoint < 1440 ?
      //                       <Icon iconName="add" size="20x20" />
      //                       :
      //                       <Typography
      //                         content="Thêm khách hàng"
      //                         modifiers={["400"]}
      //                       />
      //                   }
      //                 </Button>
      //               </>
      //             }
                          tabLeft={(
                            <div className='p-after_examination_filter' style={{gap: 4}}>
                        
                              <div style={{marginTop:2}}>
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
                        dispatch(getListCustomerMaster({ ...bodyGetList, from_date: moment(from).format("YYYY-MM-DDT00:00:00"), to_date: moment(to).format("YYYY-MM-DDT23:59:59"), } as unknown as any));
                      }}
          />
         </div>
           
          
     <div style={{marginBottom:2}}> <Input
        id="search-booking"
        type="text"
        variant="simple"
        value={filterData.search_text}
        placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng"
        onChange={(event: any) => {
          setFilterData({
            ...filterData,
            search_text: event?.target?.value,
          });
        }}
        handleEnter={() => {
          dispatch(
            getListCustomerMaster({
              ...bodyGetList,
              
              search_text: filterData.search_text,
            } as any)
          );
        }}
        handleClickIcon={() => {
          dispatch(
            getListCustomerMaster({
              ...bodyGetList,
              search_text: filterData.search_text,
            } as any)
          );
        }}
        iconName="search"
                              /></div>
                             
           <div className='p-after_examination_filter_bottom' style={{paddingBottom:4, marginLeft:6}}>
                             
                              
                               <Dropdown
                                dropdownOption={[
                                  { id: 0, label: 'Tất cả', value: "0" },
                                  ...stateLaunchSourceGroups
                                                ]}
                                                variant="simple"
                                placeholder='Chọn nhóm nguồn'
                                defaultValue={stateLaunchSourceGroups.find((e) => e.id === filterData?.launch_source_group_id?.id)}
values={stateLaunchSourceGroups.find((e) => e.id === filterData?.launch_source_group_id?.id)}
                                                handleSelect={(item: any) => {
                                                  setFilterData({ ...filterData, launch_source_group_id: item?.value })
                                                  console.log(item)
                                                  dispatch(  getListCustomerMaster({
              ...bodyGetList,
              launch_source_group_id: item.id,
            } as any))
                                                
                                                }}
                                              />
                                              <Dropdown
                                                dropdownOption={[{ id: 99, label: 'Tất cả', value: "all" }, ...stateLaunchSource]}
                                                variant="simple"
                                                placeholder="Lọc theo nguồn"
                                                values={stateLaunchSource.find((e) => e.value === filterData?.launch_source_ids?.value)}
                                                handleSelect={(e: any) => {

                                                  console.log( e?.value )
                                                  setFilterData({ ...filterData, launch_source_ids: e?.value })
                                                 dispatch(   getListCustomerMaster({
              ...bodyGetList,
              launch_source_ids:  e?.value,
            } as any))
                                                }}
                                              />
                                    <Dropdown
                                                dropdownOption={[ { id: 1, label: "Tất cả" ,value :"all"}, ...ListGender]}
                                                variant="simple"
                                                placeholder="Giới tính"
                                                values={ListGender.find((e) => e.value === filterData?.gender_id?.value)}
                                                handleSelect={(e: any) => {
                                                  setFilterData({ ...filterData, gender_id: e?.value })
                                                dispatch(       getListCustomerMaster({
              ...bodyGetList,
              gender_id:  e?.value ,
            } as any))
                                                }}
                              />
                                <Dropdown
                                                  dropdownOption={[{ id: 99, label: 'Tất cả', value: "all" }, ...fType]}
                                                variant="simple"
                                                placeholder="Loại khách hàng"
                                                values={fType.find((e) => e.value === filterData?.f_type?.value)}
                                                handleSelect={(e: any) => {
                                                  setFilterData({ ...filterData, f_type: e?.value })
                                                dispatch(       getListCustomerMaster({
              ...bodyGetList,
              f_type:  e?.value ,
            } as any))
                                                }}
                                              />
                            </div>
                            </div>
                          )}
                       
                         
                        />
              <div className="p-apointment_list_statistic">
                {statisticHeader}
                </div>
             
  <div className="p-apointment_list_schedule_table" >
    {tableLeads}

 
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
          dataSource={listeTags}
          dataUpdate={dataUpdateTag}
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
          valUpdate={stateInfoDetailCustomer}
          isUpdate={false}
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
          isUpdate
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
        {isOpenPopupC &&
        <FormConvertCustomer
          isOpenPopup={isOpenPopupC}
          positionDrawer="left"
          handleClosePopup={() => {
            setIsClosePopupC(true);
            setIsOpenPopupC(false);
          }}
          valUpdate={stateInfoDetailCustomer}
          isUpdate={isUpdateCustomer}
          isClose={isClosePopupC}
          handleClose={() => {
           
            setIsClosePopupC(true);
            setIsOpenPopupC(false);
          }}
          handleAddCustomer={(data: any) =>
            handleConvertCustomer(data)
          }
          isHigh
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
    task_name: undefined as unknown as string,
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
            <Input
              label="Tên công việc"
              isRequired
              value={formData.task_name}
              variant="border8"
              placeholder="Nhập tên công việc"
              onChange={(e) =>
                setFormData({ ...formData, task_name: e.target.value })
              }
              error={formDataErr.name}
            />
            <Input
              label="Mô tả ngắn"
              value={formData.task_description}
              variant="border8"
              placeholder="Nhập mô tả"
              onChange={(e) =>
                setFormData({ ...formData, task_description: e.target.value })
              }
            />
             <div style={{ display: "flex", gap: "10px", marginBottom: "10px",alignItems:"center" }}>
  <div style={{ flex: 5 }}>
      <Dropdown
                    dropdownOption={listEmployeeTeams}
                    isRequired
                    placeholder=""
                    label="Phân công cho"
                    handleSelect={(item) => {
                      setFormData({ ...formData, assign: item });
                      setListPerson(hanldeConvertListCustomer2(item?.value));
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
</div>
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

  <div style={{ flex: 7 }}>
    <Dropdown
      dropdownOption={[...userguidType]}
      variant="simple"
      isColor
      placeholder="-- Chọn danh mục --"
      values={formData.category_id}
      handleSelect={(item: any) => {
        setFormData({ ...formData, category_id: item.value });
      
      }}
    />
  </div>
</div>
            <GroupRadio  options={OptionCustomerTask.filter(opt => opt.id !== 0)} value={formData.type} handleOnchangeRadio={(data: any) => setFormData({ ...formData, type: data })} />
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
                  task_name: undefined as unknown as string,
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
        isOpen={isAddTask1}
        widths={800}
        onCancel={() => {
          setIsAddTask1(false);
          setIsUpdateTask(false);
          setFormData({
            ...formData,
            task_his_id: null,
    remind_datetime: undefined as unknown as Date,
    task_description: undefined as unknown as string,
    task_name: undefined as unknown as string,
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
            <Input
              label="Tên công việc"
              isRequired
              value={formData.task_name}
              variant="border8"
              placeholder="Nhập tên công việc"
              onChange={(e) =>
                setFormData({ ...formData, task_name: e.target.value })
              }
              error={formDataErr.name}
            />
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
                      setListPerson(hanldeConvertListCustomer2(item?.value));
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

  <div style={{ flex: 7 }}>
    <Dropdown
      dropdownOption={[...userguidType]}
      variant="simple"
      isColor
      placeholder="-- Chọn danh mục --"
      values={formData.category_id}
      handleSelect={(item: any) => {
        setFormData({ ...formData, category_id: item.value });
      
      }}
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
                setIsAddTask1(false);
                setIsUpdateTask(false);
                setFormData({
                  ...formData,
                  task_his_id: null,
                  remind_datetime: undefined as unknown as Date,
                  task_description: undefined as unknown as string,
                  task_name: undefined as unknown as string,
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
              isOpen={isopenModalTask}
        onCancel={() => {
        
          setIsOpenModalTask(false)
        }}
              title={'Công việc'}
              widths={1200}
              zIndex={100}
              isHideCancel
        textCancel='Đóng'
              textOK='Đóng'
              className='t-support_libraries_modal'
      >
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
                             label:"Tất cả" ,   value: 0,}
                                 ,...userguidType
                   ]}
                   variant="simple"
                   isColor
                   placeholder="-- Chọn danh mục --"
                   values={filterTask.category_id}
                   handleSelect={(item: any) => {
                     setFilterTask({ ...filterTask, category_id: item.value });
                     dispatch(getListTask({ ...filterTask,category_id:item.value } as unknown as any));
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
      </CModal>
      <CModal
              isOpen={stateNoteTask.openModal}
        onCancel={() => {
        
          setStateNoteTask({
            ...stateNoteTask,
            openModal:false
          })
        }}
              title={'Ghi chú công việc'}
              widths={600}
              zIndex={100}
              onOk={handlePostNoteTask}
        textCancel='Đóng'
              textOK='Ghi chú'
              className='t-support_libraries_modal'
      >
          <div style={{width:"100%",padding:"10px 0px"}}>
          <Input
           
              value={stateNoteTask.note}
              variant="border8"
              placeholder="Nhập ghi chú"
              onChange={(e) =>
                setStateNoteTask({ ...stateNoteTask, note: e.target.value })
              }
            />
          </div>
      </CModal>
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
                   dropdownOption={listUsers || []}
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
      {/* {
        dataListTaskE?.data?.length !== 0 && ( */}
          
        {/* )
      } */}
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
                      onOk={handlePostAssignAdMin}
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
     
    </div>
  );
};
export default ListCustomer;