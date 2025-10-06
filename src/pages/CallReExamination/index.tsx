/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { Popover, Radio, Spin } from "antd";
import {
  interactionHistoryType,
  OptionCustomerTask,
  OptionStatusAfterExams,
} from "assets/data";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown4 from "components/atoms/Dropdown4";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Input2 from "components/atoms/Input2";
import RangeDate from "components/atoms/RangeDate";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import FormAddCustomer from "components/molecules/FormAddCustomer";
import MultiSelect from "components/molecules/MultiSelect";
import PublicTable from "components/molecules/PublicTable";
import CModal from "components/organisms/CModal";
import InteractionHistory from "components/organisms/InteractionHistory";
import InteractionHistory2 from "components/organisms/InteractionHistory2";
import InteractionHistoryRC from "components/organisms/InteractionHistoryRC";
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import { useSip } from "components/templates/SipProvider";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  postStagesByIdAfterExams,
  SaveQuickNoteAfterExams,
} from "services/api/afterexams";
import {
  ItemListAfterExams,
  RequestListAfterExams,
} from "services/api/afterexams/types";
import {
  add_Note,
  AddTasks,
  assignt_Task,
  changeStatus,
  delay_dates,
  get_Note,
  save_schedule_dates,
} from "services/api/afterexams_task";
import {
  getCustomerById,
  postNoteByCID,
  postNoteByID, 
  postSaveCustomerBeforeExams,
} from "services/api/beforeExams";
import { postDelayDates, postUpdateStatusAPI } from "services/api/call_reexamming";
import {
  postCallOutCustomer,
  postCustomerTask,
} from "services/api/customerInfo";
import { getCustomerByKey } from "services/api/dashboard";
import { postAddTaskOfOneCustomer } from "services/api/tasks";
import {
  getListToStoreAfterExams,
  getStatisticAllowRangeDate,
} from "store/afterexams";
import { getListAfterExamTaskMaster } from "store/afterexams_task";
import { getListCallReExammingMaster } from "store/callreexamming";
import {
  getInfosCustomerById,
  getListNotesCR,
  getTaskByCustomerID,
} from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, {
  handleRenderGUID,
  hanldeConvertListCustomer,
} from "utils/functions";
import {
  optionStateTypeAfterTask,
  optionStateStatusAfterTask,
  optionStateStatusAfterTask2,
} from "utils/staticState";

import iconUTG from "assets/iconButton/icon-calendar-g.png";
import iconUT from "assets/iconButton/icon-calendar-gr.png";
import iconRSG from "assets/iconButton/icon-reschedule-gray.png";
import iconRSR from "assets/iconButton/icon-reschedule-red.png";
import iconAddNote from "assets/iconButton/icons-write-2.png";
import iconAddTask from "assets/iconButton/icons8-add-note-50.png";
import iconChangeU from "assets/icons/iconChangeUser.png";

export type StateCustomerType = "Lần đầu" | "Tái khám";
export type StateExaminationType = "Đã có toa thuốc" | "";

export interface AfterExaminationType {
  id: number;
  name: string;
  timeExamination: Date;
  stateExamination: string;
  follower: DropdownData;
  havePrescription: StateExaminationType;
  stateCustomer: StateCustomerType;
}
interface Note {
  note_datetime: string;
  employee_name: string;
  cs_notes: string;
}
const listF = [
  {
    id: 1,
    label: "F1",
    value: "F1",
  },  {
    id: 2,
    label: "TK",
    value: "TK",
  },
   {
    id: 3,
    label: "F2",
    value: "F2",
  },
    {
    id: 4,
    label: "F3",
    value: "F3",
  },
   
      {
    id: 5,
    label: "BSCD",
    value: "BSCD",
  },
]
const CallReExamination: React.FC = () => {
  const dispatch = useAppDispatch();
  /*  */
  const { makeCall } = useSip();
  const storageGroupTask = localStorage.getItem("groupTask");
  const storageEmployeeTeams = localStorage.getItem("employeeTeams");

  const [listTask, setListTask] = useState<DropdownData[]>(
    storageGroupTask ? JSON.parse(storageGroupTask || "") : (undefined as any)
  );
  const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(
    storageEmployeeTeams
      ? JSON.parse(storageEmployeeTeams || "")
      : (undefined as any)
  );
  const [listPerson, setListPerson] = useState<DropdownData[]>();
  const dataStatisticAfterExams = useAppSelector(
    (state) => state.afterExams.afterExamsStatistic
  );
  const dataStateAfterExams = useAppSelector(
    (state) => state.afterExams.stateAfterExams
  );
  const dataListAfterExams = useAppSelector(
    (state) => state.afterExams.dataList
  );
  const storeisLoadingAferExams = useAppSelector(
    (state) => state.afterExams.isLoadingAfterExam
  );

  const dataListCallReExamming = useAppSelector(
    (state) => state.callReExamming.callReExamming
  );
  const storeisLoadingCallReExamming = useAppSelector(
    (state) => state.callReExamming.isLoadingCallReExamming
  );
  const [listCallReExamming, setListCallReExamming] = useState(
    dataListCallReExamming.data.data
  );
  useEffect(() => {
    setListCallReExamming(dataListCallReExamming.data.data);
  }, [dataListCallReExamming]);
  /*  */
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const dataStages = localStorage.getItem("stages");
  const employeeId = Cookies.get("employee_id");
  const listStages = localStorage.getItem("stages");
  const storageEmployeeList = localStorage.getItem("listCSKH");
  const employee_Id = localStorage.getItem("employee_id");
  const schedule_types = localStorage.getItem("schedule_types");
  const nameCS = Cookies.get("signature_name");
  const position = Cookies.get("employee_team");
  const dc_dm_cschedules = localStorage.getItem("dc_dm_cschedules");
  const dm_year_doctor_schedules = localStorage.getItem("dm_year_doctor_schedules");
  const dm_time_doctor_schedules = localStorage.getItem(
    "dm_time_doctor_schedules"
  );
  const dc_dm_cschedules_status = localStorage.getItem(
    "dc_dm_cschedules_status"
  );
      const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
      const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
      const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateEmployeeList, setStateEmployeeList] = useState<DropdownData[]>(
    () => {
      const parsedList: DropdownData[] = storageEmployeeList
        ? JSON.parse(storageEmployeeList)
        : [];
      return parsedList.filter(
        (employee) => employee.employee_type === "SALES,CS"
      );
    }
  );
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
  const [stateScheduleTypes, setstateScheduleTypes] = useState<DropdownData[]>(
    schedule_types ? JSON.parse(schedule_types) : []
  );
  const [dcdmcschedules, setstateDcdmcschedules] = useState<DropdownData[]>(
    dc_dm_cschedules ? JSON.parse(dc_dm_cschedules) : []
  );
  const [dmtimedoctorschedules, setstateDmtimedoctorschedules] = useState<
    DropdownData[]
    >(dm_time_doctor_schedules ? JSON.parse(dm_time_doctor_schedules) : []);
    const [dmYearDoctorSchedules, setstateDmYearDoctorSchedules] = useState<
    DropdownData[]
  >(dm_year_doctor_schedules ? JSON.parse(dm_year_doctor_schedules) : []);
  const [dcdmcschedulesstatus, setStateDcdmcschedulesstatus] = useState<
    DropdownData[]
    >(dc_dm_cschedules_status ? JSON.parse(dc_dm_cschedules_status) : []);
  const [dcdmcschedulesstatus1, setStateDcdmcschedulesstatus1] = useState<DropdownData[]>(
  dc_dm_cschedules_status
    ? JSON.parse(dc_dm_cschedules_status).filter(
        (item: DropdownData) => item.value !== "all"
      )
    : []
);
  console.log(dmtimedoctorschedules)
  const [selectedStatus, setSelectedStatus] = useState<string>("new");
  const [selectedDays, setSelectedDays] = useState<number>(3);
  /*  */
  const [openNote, setOpenNote] = useState(false);
  const [saveItem, setSaveItem] = useState<ItemListAfterExams>();
  const [noteData, setNoteData] = useState(saveItem?.process_note.toString());
  const [valueKeySearch, setValueKeySearch] = useState("");
  const [pagination, setPagination] = useState({ page: 0, pageSize: 200 });
  const getFullName = Cookies.get("lastname");
  const [keySearch, setKeySearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [dataFilter, setDataFilter] = useState({
    date: moment(new Date()).format("YYYY-MM-DD"),
    type: undefined as unknown as DropdownData,
    employee_id: undefined as unknown as DropdownData,
    status: undefined as unknown as DropdownData,
    keyWord: "",
    c_schedule_type_id: undefined as unknown as DropdownData,
     from_date: moment().format("YYYY-MM-DD 00:00:00") as string | null,
    to_date: moment().format("YYYY-MM-DD 23:59:59") as string | null,
  from_date1: moment().format("YYYY-MM-DD 00:00:00") as string ,
  to_date1: moment().format("YYYY-MM-DD 23:59:59") as string,
    year: undefined as unknown as DropdownData,
    source: undefined as unknown as DropdownData,
    sourceGroup: undefined as unknown as DropdownData,
    stateF:  undefined as unknown as DropdownData,
  });
  const listNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteListCR
  );
   const LoainglistNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteListLoadingCR
  );
  const propsData = {
    keyWord: dataFilter?.keyWord,
    status: dataFilter?.status || "new",
    page_number: 1,
    page_size: 10000,
    c_schedule_type_id: dataFilter.c_schedule_type_id || "all",
    from_date: dataFilter.from_date,
    to_date: dataFilter.to_date,
    year: dataFilter.year || "all",
    launch_source_id: dataFilter?.source || 0,
    launch_source_group_id: dataFilter?.sourceGroup || 0,
     f_type: dataFilter?.stateF || "all",
  };
  const [assigntTasks, setAssigntTasks] = useState({
    openModal: false,
    listTask: [],
    cs_employee_id: undefined as unknown as DropdownData,
    content: "",
    nameC: "",
  });
  const [dataNote, setDataNote] = useState({
    openNote: false,
    id: 0,
    cs_employee_id: undefined as unknown as DropdownData,
    cs_notes: "",
  });
  const [dataTakeMe, setDataTakeMe] = useState({
    openTM: false,
    schedule_id: undefined as number | undefined,
    begin_drug_date: moment(new Date()).format("YYYY-MM-DD"),
    end_drug_date: moment(new Date()).format("YYYY-MM-DD"),
    reexamming_date: moment(new Date()).format("YYYY-MM-DD"),
  });
  const [errorNote, setErrorNote] = useState(false);
  const handleValidateForm = () => {
    if (!dataAddNote.cs_node_content.trim()) {
      setErrorNote(true);
      return false;
    }

    return true;
  };
  const [dataDelay, setDataDelay] = useState({
    openDelay: false,
    id: 0,
    c_schedule_datetime: moment(new Date()).format("YYYY-MM-DD"),
    cs_notes: "",
  });
  const [dataAddNote, setDataAddNote] = useState({
    openAddNote: false,
    id: 0,
    cs_notes: "",
    cs_node_type: "cs",
    customer_id: "",
    cs_node_content: "",
    c_schedule_id: 0,
  });
  const [dataUpdateStatus, setDataUpdateStatus] = useState({
    openUpdateStatus: false,
    id_pk_long: 0,
    value_text: undefined as unknown as DropdownData,
    action: "update_status",
  });
  const [dataUpdateStatus1, setDataUpdateStatus1] = useState({
    openUpdateStatus1: false,
    c_schedule_id: 0,
    customer_id: "",
    cs_node_type: "cs",
    cs_node_content: "",
    remind_datetime: "",
  });
  const [dataChangeStatus, setDataChangeStatus] = useState({
    openChangeStatus: false,
    id: 0,
    cs_status: undefined as unknown as DropdownData,
    cs_notes: "",
  });
  const [addTask, setAddTask] = useState({
    openAddTask: false,
    customer_id: "",
    cs_remind_date: moment(new Date()).format("YYYY-MM-DD"),
    cs_notes: "",
    cs_title: "",
  });

  const [loadingAddTask, setLoadingAddTask] = useState(false);
  const [fullNC, setFullNC] = useState("");
  const [isAddTask, setIsAddTask] = useState(false);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shortDesc: "",
    group: undefined as unknown as DropdownData,
    assign: undefined as unknown as DropdownData,
    personCharge: undefined as unknown as DropdownData,
    deadline: undefined as unknown as Date,
    type: OptionCustomerTask[0],
    desc: "",
    id: "",
  });
  const [formDataErr, setFormDataErr] = useState({
    name: "",
    group: "",
    deadline: "",
    desc: "",
  });
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  useEffect(() => {
        setDataFilter({
                      ...dataFilter,
                      from_date: null,
                      to_date: null,
                    });
    dispatch(
      getListCallReExammingMaster({
        c_schedule_type_id: dataFilter?.c_schedule_type_id || "all",
from_date: moment().add(1, "day").startOf("day").format("YYYY-MM-DDTHH:mm:ss"), // 00:00:00
    to_date: moment().add(1, "day").endOf("day").format("YYYY-MM-DDTHH:mm:ss"),     // 23:59:59
        status: dataFilter?.status || "new",
        page_number: 1,
        page_size: 10000,
        keyWord: dataFilter.keyWord,
        f_type: "all",
        launch_source_group_id: 0,
        launch_source_id:0
      } as any)
    );
    document.title = "Nhắc tầm soát lại - nội soi - tầm soát lại | CRM";
  }, []);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setListPerson(hanldeConvertListCustomer(formData.assign?.value));
  }, [formData.assign]);

  const [isLoading, setIsLoading] = useState(false);
  const [dataMerge, setDataMerge] = useState({
    from: "",
    to: "",
    note: "Trùng thông tin",
    fromErr: "",
    toErr: "",
    noteErr: "",
    search: "",
    resultSearch: [],
    isSearch: false,
    loading: false,
  });
  const [isOpenModalSearch, setIsOpenModalSearch] = useState(false);

  const [dataSearch, setDataSearch] = useState();
  const { mutate: postSaveCustomer } = useMutation(
    "post-footer-form",
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data.message);
          setIsClosePopup(true);
          setIsOpenPopup(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
        }
      },
      onError: (e) => {
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const handleUpdateCustomer = async (data: any) => {
    await postSaveCustomer(data);
  };
  const { mutate: postUpdateStatus } = useMutation(
    "post-footer-form",
    (data: any) => postUpdateStatusAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(
            getListCallReExammingMaster({
              ...propsData,
            } as any)
          );
          setDataUpdateStatus({
            ...dataUpdateStatus,
            openUpdateStatus: false,
            value_text: undefined as unknown as DropdownData,
            id_pk_long: 0,
          });
           setLoadingStatus(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
          setLoadingStatus(false);
        }
      },
      onError: (e) => {
        setLoadingStatus(false);
        toast.error("Đã có lỗi xảy ra ...!");
      },
    }
  );
  const [loadingStatus, setLoadingStatus] = useState(false);
  const handleUpdateStatus = async (data: any) => {
    setLoadingStatus(true);
    await postUpdateStatus(data);
  };
  const handleValidate = () => {
    if (!formData.name.trim() || !formData.group || !formData.deadline) {
      setFormDataErr({
        ...formDataErr,
        name: !formData.name.trim() ? "Tên công việc là trường bắt buộc" : "",
        group: !formData.group ? "Nhóm công việc là trường bắt buộc" : "",
        deadline: !formData.deadline
          ? "Hạn chót (deadline) là trường bắt buộc"
          : new Date().valueOf() < formData?.deadline?.valueOf()
          ? "Không thể sét hạn chót nhỏ hơn thời gian hiện tại"
          : "",
        desc: !formData.desc.trim() ? "Tên công việc là trường bắt buộc" : "",
      });
      return false;
    }
    return true;
  };

  const { mutate: postTask } = useMutation(
    "post-footer-form",
    (data: any) => postAddTaskOfOneCustomer(data),
    {
      onSuccess: (data: any) => {
        // dispatch(
        //   getTaskByCustomerID({
        //     id: stateCustomerId,
        //     task_status: "all",
        //   })
        // );
        setIsAddTask(false);
        setIsUpdateTask(false);
     
        setFormData({
            name: "",
            shortDesc: "",
            group: undefined as unknown as DropdownData,
            assign: undefined as unknown as DropdownData,
            personCharge: undefined as unknown as DropdownData,
            deadline: undefined as unknown as Date,
            type: OptionCustomerTask[0],
            desc: "",
          id: "",
          
        });
        setIsLoadingGetService(false);
      },
      onError: (err: any) => {
        console.error("🚀 ~ file: index.tsx:157 ~ err:", err);
      },
    }
  );
  const [customerUpdate, setCustomerUpdate] = useState<any>();
  const { mutate: postBooking } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data: any) => {
        setCustomerUpdate(data.data);
        setIsOpenPopup(true);
        setLoadingPage(false);
      },
      onError: (err: any) => {
        console.error("🚀 ~ file: index.tsx:157 ~ err:", err);
      },
    }
  );
  const [stateCID, setStateCID] = useState(0);
  const handlePostBooking = (id: any, idC: any) => {
    const body = {
      customer_id: id,
    };
    postBooking(body);
  };
  const handleAddTask = async () => {
    if (!handleValidate()) return;
    if (isUpdateTask) {
      setIsLoadingGetService(true);
      const body = {
       
        task_type_id: formData?.group?.value,
        assign_employee_id:formData?.personCharge?.value,
        exec_employee_id: formData?.personCharge?.value,
        customer_id: stateCustomerId,
        task_name: formData?.name,
        task_description: formData?.shortDesc,
        note: formData?.desc,
        employee_team_id: formData?.assign?.value,
        remind_datetime: moment(formData?.deadline).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        status: "inprogress",
        task_id: formData?.id || null,
      };
      await postTask(body);
    } else {
      setIsLoadingGetService(true);
      const body = {
          task_type_id: formData?.group?.value,
        assign_employee_id:formData?.personCharge?.value,
        exec_employee_id: formData?.personCharge?.value,
        customer_id: stateCustomerId,
        task_name: formData?.name,
        task_description: formData?.shortDesc,
        note: formData?.desc,
        employee_team_id: formData?.assign?.value,
        remind_datetime: moment(formData?.deadline).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        status: "inprogress",
        task_id: formData?.id || null,
      };
      console.log(body,formData)
       await postTask(body);
    }
  };
  // Bên trong component của bạn:
  /* Call APIs */
  const { mutate: getSearchByKey } = useMutation(
    "post-footer-form",
    (id: string) => getCustomerByKey(id),
    {
      onSuccess: async (data) => {
        if (!data.length) {
          setIsLoading(false);
          setKeySearch("");
          toast.error("Không tìm thấy thông tin khách hàng");
        } else {
          if (dataMerge.isSearch) {
            await setDataMerge({
              ...dataMerge,
              resultSearch: data,
              loading: false,
            });
          } else {
            setKeySearch("");
            setIsOpenModalSearch(true);
            setDataSearch(data);
            setIsLoading(false);
          }
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* API thay đổi trạng thái của khách hàng */

  const [typeNote, setTypeNote] = useState(interactionHistoryType[0]);
  const [listNodeLoading, setListNodeLoading] = useState(false);
  const [listNode, setListNode] = useState(listNotesCustomer);
  useEffect(() => {
    setListNode(listNotesCustomer);
  }, [listNotesCustomer]);

  const { mutate: TakeMeTask } = useMutation(
    "post-footer-form",
    (data: any) => save_schedule_dates(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataTakeMe({
            ...dataTakeMe,
            openTM: false,
            begin_drug_date: moment(new Date()).format("YYYY-MM-DD"),
            end_drug_date: moment(new Date()).format("YYYY-MM-DD"),
            reexamming_date: moment(new Date()).format("YYYY-MM-DD"),
          });
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: AddNoteC } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByCID(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);

          dispatch(
            getListNotesCR({
              c_schedule_id: stateCscheduleId,
            })
          );
          dispatch(
            getListCallReExammingMaster({
              ...propsData,
            } as any)
          );
          setDataUpdateStatus1({
            ...dataUpdateStatus1,
            openUpdateStatus1: false,
            remind_datetime: moment(new Date()).format("YYYY-MM-DD"),
            cs_node_content: "",
            customer_id: "",
            c_schedule_id: 0,
          });
          setListNodeLoading(false);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
   const { mutate: PostDelayDate } = useMutation(
    "post-footer-form",
    (data: any) => postDelayDates(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);

        
          dispatch(
            getListCallReExammingMaster({
              ...propsData,
            } as any)
          );
         setDataDelay({
            ...dataDelay,
            openDelay: false,
            c_schedule_datetime: moment(new Date()).format("YYYY-MM-DD"),
            cs_notes: "",
            id: 0,
          });
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: ChangeStatusTask } = useMutation(
    "post-footer-form",
    (data: any) => changeStatus(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataChangeStatus({
            id: 1,
            openChangeStatus: false,
            cs_notes: "",
            cs_status: undefined as unknown as DropdownData,
          });
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: GetNote } = useMutation(
    "post-footer-form",
    (data: any) => get_Note(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setNotes(data.data);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: AddTask } = useMutation(
    "post-footer-form",
    (data: any) => AddTasks(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setFullNC("");
          setAddTask({
            ...addTask,
            openAddTask: false,
            cs_remind_date: moment(new Date()).format("YYYY-MM-DD"),
            cs_title: "",
            cs_notes: "",
          });
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleGetNote = (id: number) => {
    const body = {
      id: id,
    };
    GetNote(body);
  };
  /* API Ghi chú  */
  const { mutate: postQuickNote } = useMutation(
    "post-footer-form",
    (data: any) => SaveQuickNoteAfterExams(data),
    {
      onSuccess: () => {
        setOpenNote(false);

        setNoteData("");
        toast.success("Cập nhật ghi chú thành công");
      },
      onError: () => {},
    }
  );
  /* API gọi điện ra cho khách hàng */
  const { mutate: postCallOut } = useMutation(
    "post-footer-form",
    (data: any) => postCallOutCustomer(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* End Call API */

  /* Chuyển trang nhưng vẫn giữ các filter */
  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    // dispatch(getListToStoreAfterExams({
    //   ...propsData,

    //     limits: 1000,
    // } as unknown as RequestListAfterExams));
  };
  /* 
  Gọi ra cho khách hàng
  Yêu cầu: Phải mở softphone của Doctorcheck.exe
  */
  const handleCallOutCustomer = (data: any) => {
    postCallOut({
      message: `${
        nameCS || Cookies.get("signature_name")
      } gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };
  const [stateCustomerId, setStateCustomerId] = useState("");
  const [stateCount, setStateCount] = useState("");
  const [stateCscheduleId, setStateCscheduleId] = useState("");
  /* Column */
  const ColumnTable = [
   {
        title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
        align: "center",
        dataIndex: "index",
        width: 40,
        className: "ant-table-column_wrap",
        render: (record: any, data: any, index: any) => (
          <div className="ant-table-column_item">
            < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
          </div>
        ),
      },
    {
      title: (
        <Typography
          content="Họ tên"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "left", marginLeft: "12px" }}
        />
      ),
      dataIndex: "customer_fullname",
      width: 180,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "start",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
            content={record}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "blueNavy" : "blueNavy"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    //    {
    //   title: (
    //     <Typography
    //       content="Ngày thực hiện CV"
    //       modifiers={["12x18", "500", "center", "uppercase"]}
    //     />
    //   ),
    //   dataIndex: "remind_datetime",
    //   align: "center",
    //   width: 120,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div
    //       className="ant-table-column_item"
    //       onClick={() => {
    //         const { customer_id, customer_fullname, ...prevData } = data;
    //         if (customer_id) {
    //           Cookies.set("id_customer", customer_id);
    //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
    //           const newTab = window.open(
    //             `/customer-info/id/${customer_id}/history-interaction`,
    //             "_blank"
    //           );
    //           if (newTab) {
    //             newTab.focus();
    //           }
    //         } else {
    //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //         }
    //       }}
    //     >
    //       <Typography
    //         content={moment(record).format("DD/MM/YYYY")}
    //         modifiers={[
    //           "13x18",
    //           "500",
    //           "center",
    //          "main"
    //         ]}
    //       />
    //     </div>
    //   ),
    // },
  //   {
  //     title: (
  //       <Typography
  //         content="Giới tính"
  //         modifiers={["12x18", "500", "center", "uppercase"]}
  //         styles={{ textAlign: "center" }}
  //       />
  //     ),
  //     dataIndex: "customer_gender",
  //     width: 70,
  //     className: "ant-table-column_wrap",
  //     render: (record: any, data: any) => (
  //       <div
  //         className="ant-table-column_item"
  //         onClick={() => {
  //           const {
  //             customer_id,
  //             customer_fullname,
  //             year_of_birth,
  //             ...prevData
  //           } = data;
  //           if (customer_id) {
  //             Cookies.set("id_customer", customer_id);
  //             dispatch(getInfosCustomerById({ customer_id: customer_id }));
  //             const newTab = window.open(
  //               `/customer-info/id/${customer_id}/history-interaction`,
  //               "_blank"
  //             );
  //             if (newTab) {
  //               newTab.focus();
  //             }
  //           } else {
  //             toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
  //           }
  //         }}
  //         style={{
  //           justifyContent: "center",
  //           wordWrap: "break-word", // Cho phép xuống dòng
  //           whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
  //           overflow: "hidden", // Xử lý tràn nếu cần
  //           maxWidth: "250px",
  //         }}
  //       >
  //         <Typography
  //           content={record}
  //           modifiers={[
  //             "13x18",
  //             "500",
  //             "center",
  //             `${data.is_high_light === true ? "main" : "main"}`,
  //           ]}
  //           styles={{
  //             display: "block", // Đảm bảo hiển thị như block
  //             wordWrap: "break-word", // Xuống dòng khi quá dài
  //             whiteSpace: "normal", // Nội dung nhiều dòng
  //             textAlign: "left",
  //           }}
  //         />
  //       </div>
  //     ),
  //   },
  //     {
  //     title: (
  //       <Typography
  //         content="Năm sinh"
  //         modifiers={["12x18", "500", "center", "uppercase"]}
  //         styles={{ textAlign: "center" }}
  //       />
  //     ),
  //     dataIndex: "year_of_birth",
  //     width: 70,
  //     className: "ant-table-column_wrap",
  //     render: (record: any, data: any) => (
  //       <div
  //         className="ant-table-column_item"
  //         onClick={() => {
  //           const {
  //             customer_id,
  //             customer_fullname,
  //             year_of_birth,
  //             ...prevData
  //           } = data;
  //           if (customer_id) {
  //             Cookies.set("id_customer", customer_id);
  //             dispatch(getInfosCustomerById({ customer_id: customer_id }));
  //             const newTab = window.open(
  //               `/customer-info/id/${customer_id}/history-interaction`,
  //               "_blank"
  //             );
  //             if (newTab) {
  //               newTab.focus();
  //             }
  //           } else {
  //             toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
  //           }
  //         }}
  //         style={{
  //           justifyContent: "center",
  //           wordWrap: "break-word", // Cho phép xuống dòng
  //           whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
  //           overflow: "hidden", // Xử lý tràn nếu cần
  //           maxWidth: "250px",
  //         }}
  //       >
  //         <Typography
  //           content={record.toString()}
  //           modifiers={[
  //             "13x18",
  //             "500",
  //             "center",
  //             `${data.is_high_light === true ? "main" : "main"}`,
  //           ]}
  //           styles={{
  //             display: "block", // Đảm bảo hiển thị như block
  //             wordWrap: "break-word", // Xuống dòng khi quá dài
  //             whiteSpace: "normal", // Nội dung nhiều dòng
  //             textAlign: "left",
  //           }}
  //         />
  //       </div>
  //     ),
  //   },
  //  {
  //     title: (
  //       <Typography
  //         content="Số ĐT"
  //         modifiers={["12x18", "500", "center", "uppercase"]}
  //         styles={{ textAlign: "center" }}
  //       />
  //     ),
  //     dataIndex: "customer_phone",
  //     width: 80,
  //     className: "ant-table-column_wrap",
  //     render: (record: any, data: any) => (
  //       <div
  //         className="ant-table-column_item"
  //        onClick={() => {
  //             handleCallOutCustomer(data?.customer_phone);
  //             handleUpdateStatus({
  //               action: "update_info_communicate",
  //               id_pk_long: data.c_schedule_id,
  //               value_text: "",
  //             });
  //           }}
  //         style={{
  //           justifyContent: "center",
  //           wordWrap: "break-word", // Cho phép xuống dòng
  //           whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
  //           overflow: "hidden", // Xử lý tràn nếu cần
  //           maxWidth: "250px",
  //         }}
  //       >
  //         <Typography
  //           content={record.replace("+84", "0").replace(/-/g, "")}
  //           modifiers={[
  //             "13x18",
  //             "500",
  //             "center",
  //             `${data.is_high_light === true ? "main" : "main"}`,
  //           ]}
  //           styles={{
  //             display: "block", // Đảm bảo hiển thị như block
  //             wordWrap: "break-word", // Xuống dòng khi quá dài
  //             whiteSpace: "normal", // Nội dung nhiều dòng
  //             textAlign: "left",
  //           }}
  //         />
  //       </div>
  //     ),
  //   },
    {
      title: (
        <Typography
          content="Brand"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "launch_source_group_name",
      width: 200,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
         onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
           content={record}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Nguồn"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "launch_source_name",
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
        onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
         content={record === "KH Cũ Giới Thiệu (WoM)" ? "WOM" : record === "Bác Sĩ Chỉ Định" ? "BSCĐ" : record}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Phân loại"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "f_type",
      width: 60,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
         onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
          content={record}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Nội dung công việc"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "c_schedule_title",
      width: 190,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
            content={record}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    //  {
    //   title: (
    //     <Typography
    //       content="Ngày checkin"
    //       modifiers={["12x18", "500", "center", "uppercase"]}
    //     />
    //   ),
    //   dataIndex: "create_datetime",
    //   align: "center",
    //   width: 100,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div
    //       className="ant-table-column_item"
    //       onClick={() => {
    //         const { customer_id, customer_fullname, ...prevData } = data;
    //         if (customer_id) {
    //           Cookies.set("id_customer", customer_id);
    //           dispatch(getInfosCustomerById({ customer_id: customer_id }));
    //           const newTab = window.open(
    //             `/customer-info/id/${customer_id}/history-interaction`,
    //             "_blank"
    //           );
    //           if (newTab) {
    //             newTab.focus();
    //           }
    //         } else {
    //           toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //         }
    //       }}
    //     >
    //       <Typography
    //         content={moment(record).format("DD/MM/YYYY")}
    //         modifiers={[
    //           "13x18",
    //           "500",
    //           "center",
    //          "main"
    //         ]}
    //       />
    //     </div>
    //   ),
    // },
    {
      title: (
        <Typography
          content="Ngày BS đề xuất"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "c_schedule_datetime",
      align: "center",
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
              setDataDelay({
                ...dataDelay,
                openDelay: true,
                id: data.c_schedule_id,
                c_schedule_datetime: moment(data.c_schedule_datetime).format(
                  "YYYY-MM-DD 00:00:00"
                ),
              });
            }}
        >
          <Typography
            content={moment(record).format("DD/MM/YYYY")}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "cg-red" : "main"}`,
            ]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ngày thực hiện"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "remind_datetime",
      align: "center",
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
              setDataDelay({
                ...dataDelay,
                openDelay: true,
                id: data.c_schedule_id,
                c_schedule_datetime: moment(data.c_schedule_datetime).format(
                  "YYYY-MM-DD 00:00:00"
                ),
              });
            }}
        >
          <Typography
            content={moment(record).format("DD/MM/YYYY")}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "cg-red" : "main"}`,
            ]}
          />
        </div>
      ),
    },
     {
      title: (
        <Typography
          content="Đề xuất bởi"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "left", marginLeft: "15px" }}
        />
      ),
      dataIndex: "employee_signature_name",
      width: 230,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "start",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
            content={record}
            modifiers={[
              "13x18",
              "500",
              "center",
             `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ghi chú"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "left", marginLeft: "12px" }}
        />
      ),
      dataIndex: "c_schedule_note",
      width: 370,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
          }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "500", "center", "main"]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
          {data.cs_notes !== null && (
            <Typography
              content={`(${data.cs_notes.employee_name}: ${data.cs_notes.cs_notes})`}
              modifiers={["13x18", "500", "center", "green"]}
              styles={{
                display: "block", // Đảm bảo hiển thị như block
                wordWrap: "break-word", // Xuống dòng khi quá dài
                whiteSpace: "normal", // Nội dung nhiều dòng
                textAlign: "left",
              }}
            />
          )}
        </div>
      ),
    },
     {
      title: (
        <Typography
          content="Lần liên hệ"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "cs_count_communicate",
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const {
              customer_id,
              customer_fullname,
              year_of_birth,
              ...prevData
            } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              const newTab = window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
              if (newTab) {
                newTab.focus();
              }
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "250px",
          }}
        >
          <Typography
            content={record.toString()}
            modifiers={[
              "13x18",
              "500",
              "center",
              `${data.is_high_light === true ? "main" : "main"}`,
            ]}
            styles={{
              display: "block", // Đảm bảo hiển thị như block
              wordWrap: "break-word", // Xuống dòng khi quá dài
              whiteSpace: "normal", // Nội dung nhiều dòng
              textAlign: "left",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Trạng thái"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "status",
      align: "center",
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          style={{
            justifyContent: "center",
            wordWrap: "break-word", // Cho phép xuống dòng
            whiteSpace: "normal", // Đảm bảo nội dung hiển thị nhiều dòng
            overflow: "hidden", // Xử lý tràn nếu cần
            maxWidth: "300px",
          }}
          className="ant-table-column_item"
           onClick={() => {
             setDataUpdateStatus({
               ...dataUpdateStatus,
               openUpdateStatus: true,
               id_pk_long: data.c_schedule_id,
               value_text: {
                 id: 0,
                 value: data.status,
                 label:
                   data.status === "new"
                     ? "Chưa liên hệ"
                     : data.status === "contact"
                     ? "Đã liên hệ"
                     : data.status === "appointment"
                     ? "Đã đặt lịch"
                     : data.status === "checkin"
                     ? "Đã đến"
                     : "Đã hủy",
               },
             });
           }}
        >
          <Typography
            content={
              record === "new"
                ? "Chưa liên hệ"
                : record === "contact"
                ? "Đã liên hệ"
                : record === "appointment"
                ? "Đã đặt lịch"
                : record === "checkin"
                ? "Đã đến"
                : record === "canceled"
                ? "Đã hủy"
                : "Đã đến"
            }
            modifiers={["13x18", "500", "left", "main"]}
            styles={{
              display: "block",
              wordWrap: "break-word",
              whiteSpace: "normal",
              textAlign: "left",
              color:
                record === "new"
                  ? "#B21016"
                  : record === "contact"
                  ? "#007AAE"
                  : record === "appointment"
                  ? "#138535"
                  : record === "checkin"
                  ? "#085820"
                  : "#085820",
            }}
          />
        </div>
      ),
    },

    {
      title: "",
      dataIndex: "",
      align: "center",
      width: 40,

      className: "p-after_examination_column_center",
      render: (data: any, record: any) => (
        <CTooltip placements="top" title="Gọi điện ngay">
          {" "}
          <p
            onClick={() => {
              handleCallOutCustomer(data?.customer_phone);
              handleUpdateStatus({
                action: "update_info_communicate",
                id_pk_long: data.c_schedule_id,
                value_text: "",
              });
            }}
            className="click_event"
          >
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#04566e"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.3545 22.2323C15.3344 21.7262 11.1989 20.2993 7.44976 16.5502C3.70065 12.8011 2.2738 8.66559 1.76767 6.6455C1.47681 5.48459 2.00058 4.36434 2.88869 3.72997L5.21694 2.06693C6.57922 1.09388 8.47432 1.42407 9.42724 2.80051L10.893 4.91776C11.5152 5.8165 11.3006 7.0483 10.4111 7.68365L9.24234 8.51849C9.41923 9.1951 9.96939 10.5846 11.6924 12.3076C13.4154 14.0306 14.8049 14.5807 15.4815 14.7576L16.3163 13.5888C16.9517 12.6994 18.1835 12.4847 19.0822 13.1069L21.1995 14.5727C22.5759 15.5257 22.9061 17.4207 21.933 18.783L20.27 21.1113C19.6356 21.9994 18.5154 22.5232 17.3545 22.2323ZM8.86397 15.136C12.2734 18.5454 16.0358 19.8401 17.8405 20.2923C18.1043 20.3583 18.4232 20.2558 18.6425 19.9488L20.3056 17.6205C20.6299 17.1665 20.5199 16.5348 20.061 16.2171L17.9438 14.7513L17.0479 16.0056C16.6818 16.5182 16.0047 16.9202 15.2163 16.7501C14.2323 16.5378 12.4133 15.8569 10.2782 13.7218C8.1431 11.5867 7.46219 9.7677 7.24987 8.7837C7.07977 7.9953 7.48181 7.31821 7.99439 6.95208L9.24864 6.05618L7.78285 3.93893C7.46521 3.48011 6.83351 3.37005 6.37942 3.6944L4.05117 5.35744C3.74413 5.57675 3.64162 5.89565 3.70771 6.15943C4.15989 7.96418 5.45459 11.7266 8.86397 15.136Z"
                  fill="#04566e"
                ></path>{" "}
              </g>
            </svg>
          </p>{" "}
        </CTooltip>
      ),
    },

    {
      title: "",
      dataIndex: "status",
      align: "center",
      className: "p-after_examination_column_center",
    width: 40,

      render: (record: any, data: any) => {
        return (
          <>
            {
              <CTooltip placements="top" title="Ghi chú">
                {" "}
                <p
                  onClick={() => {
                    setDataUpdateStatus({
                      ...dataUpdateStatus,
                      openUpdateStatus: false,
                      id_pk_long: data.c_schedule_id,
                      value_text: {
                        id: 0,
                        value: data.status,
                        label:
                          data.status === "new"
                            ? "Chưa liên hệ"
                            : data.status === "contact"
                            ? "Đã liên hệ"
                            : data.status === "appointment"
                            ? "Đã đặt lịch"
                            : data.status === "checkin"
                            ? "Đã đến"
                            : "Đã hủy",
                      },
                    });
                    setStateCscheduleId(data.c_schedule_id)
                    dispatch(
                      getListNotesCR({
                        c_schedule_id: data.c_schedule_id,
                      })
                    );
                    setSelectedStatus(record);
                    setStateCount(data?.cs_count_communicate);
                    setDataAddNote({
                      ...dataAddNote,
                      customer_id: data.customer_id,
                      c_schedule_id: data.c_schedule_id,
                      openAddNote: true,
                      cs_node_content:
                        record === "new"
                          ? ""
                          : record === "contact"
                          ? `Đã liên hệ ${data?.cs_count_communicate + 1} lần`
                          : record === "appointment"
                          ? "Đã đặt lịch"
                          : record === "checkin"
                          ? "Khách hàng đã đến"
                          : "",
                    });
                  }}
                  className="click_event"
                >
                  <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M20 8.25V18C20 21 18.21 22 16 22H8C5.79 22 4 21 4 18V8.25C4 5 5.79 4.25 8 4.25C8 4.87 8.24997 5.43 8.65997 5.84C9.06997 6.25 9.63 6.5 10.25 6.5H13.75C14.99 6.5 16 5.49 16 4.25C18.21 4.25 20 5 20 8.25Z"
                        stroke="#04566e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M16 4.25C16 5.49 14.99 6.5 13.75 6.5H10.25C9.63 6.5 9.06997 6.25 8.65997 5.84C8.24997 5.43 8 4.87 8 4.25C8 3.01 9.01 2 10.25 2H13.75C14.37 2 14.93 2.25 15.34 2.66C15.75 3.07 16 3.63 16 4.25Z"
                        stroke="#04566e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M8 13H12"
                        stroke="#04566e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M8 17H16"
                        stroke="#04566e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </p>{" "}
              </CTooltip>
            }
          </>
        );
      },
    },

    {
      title: "",
      dataIndex: "",
      align: "center",
      width: 40,

      className: "p-after_examination_column_center",
      render: (data: any, record: any) => (
        <CTooltip placements="top" title="Đặt lịch">
          {loadingPage === true && stateCID === data?.c_schedule_id ? (
            <div className="loaderCR"></div>
          ) : (
            <p
              onClick={() => {
                setLoadingPage(true);
                setStateCID(data?.c_schedule_id);
                handlePostBooking(data?.customer_id, data?.c_schedule_id);
              }}
              className="click_event"
            >
              {" "}
              <svg
                fill="#04566e"
                width="22px"
                height="22px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z"></path>
                </g>
              </svg>{" "}
            </p>
          )}
        </CTooltip>
      ),
    },
    {
      title: "",
      dataIndex: "",
      align: "center",
      width: 40,

      className: "p-after_examination_column_center",
      render: (data: any, record: any) => (
        <CTooltip placements="top" title="Thêm mới Task">
          {" "}
          <p
            onClick={() => {
              setStateCustomerId(data?.customer_id);
              setIsAddTask(true);
              setFormData({
                ...formData,
                name: data.c_schedule_title,
                group:
                  data.c_schedule_type_id === "HTK"
                    ? {
                        id: 4,
                        label: "Tái khám",
                        value: "TK",
                      }
                    : {
                        id: 5,
                        label: "Tầm soát",
                        value: "TS",
                      },
                assign: {
                  id: 7,
                  label: "Chăm sóc Khách hàng",
                  value: "CSKH",
                },
              });
            }}
            className="click_event"
          >
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M12.37 8.87988H17.62"
                  stroke="#04566e"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M6.38 8.87988L7.13 9.62988L9.38 7.37988"
                  stroke="#04566e"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M12.37 15.8799H17.62"
                  stroke="#04566e"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M6.38 15.8799L7.13 16.6299L9.38 14.3799"
                  stroke="#04566e"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#04566e"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </p>{" "}
        </CTooltip>
      ),
    },
  /*  {
      title: "",
      dataIndex: "",
      align: "center",
      width: 50,

      className: "p-after_examination_column_center",
      render: (data: any, record: any) => (
        <CTooltip placements="top" title="Dời ngày">
          {" "}
          <p
            onClick={() => {
              setDataUpdateStatus1({
                ...dataUpdateStatus1,
                openUpdateStatus1: true,
                c_schedule_id: data.c_schedule_id,
                customer_id: data.customer_id,
                remind_datetime: moment(data.cs_remind_date).format(
                  "YYYY-MM-DD 00:00:00"
                ),
              });
            }}
            className="click_event"
          >
            <svg
              width="22px"
              height="22px"
              fill="#04566e"
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#04566e"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M984 612L789 414q-4-4-8.5-2t-4.5 7v95q-90 15-163 53-82 42-142.5 111T384 829q-13 40-16 82-1 23 0 46 1 4 5.5 4.5t5.5-3.5q16-58 52-106 43-59 106-95 60-34 128-43 56-8 111 0v103q0 4 4.5 6t8.5-1l195-199q2-2 2-5t-2-6zM70 252v447q0 14 9.5 23.5T103 732h246q7 0 12-4.5t5-11.5v-22q0-7-5-12t-12-5H125V296h568v87q0 7 4.5 12t11.5 5h21q7 0 12-5t5-12V252H70zm677-32v-55q0-13-9.5-23T714 132H613v-13q0-12-6-23t-16.5-17-22.5-6-22.5 6T529 96t-6 23v13H293v-13q0-19-13-32t-31.5-13T217 87t-13 32v13H103q-14 0-23.5 10T70 165v55h677z"></path>
              </g>
            </svg>
          </p>{" "}
        </CTooltip>
      ),
    },*/
  ];
  const columnTableNote = [
    {
      title: (
        <Typography
          content="STT"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "suggestion_count",
      align: "center",
      width: 0,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: number) => (
        <div
          className="ant-table-column_item"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Typography
            content={`${index + 1}`}
            modifiers={["13x18", "600", "main", "justify"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ngày note"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "note_datetime",
      align: "center",
      width: 0,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Typography
            content={record ? moment(record).format("hh:mm DD-MM-YYYY") : ""}
            modifiers={["13x18", "600", "main", "justify"]}
          />
        </div>
      ),
    },

    {
      title: (
        <Typography
          content="Nội dung Note"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "left", marginLeft: "9px" }}
        />
      ),
      dataIndex: "cs_notes",
      align: "center",
      width: 240,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ display: "flex", justifyContent: "start" }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "main", "justify"]}
          />
        </div>
      ),
    },
  ];
  /* Sử dụng Hook useMemo 
  => Cache component chỉ re-render khi Dependency thay đổi giá trị
  */

const statisticHeader = useMemo(() => {
  const total = dataListCallReExamming?.data?.paging?.total_count || 0;
  const currentPage = pagination.page; // Ant Design: 1-based
  const pageSize = pagination.pageSize;
  // Trường hợp không có dữ liệu

  // ✅ Fix ở đây: trừ 1 vì page AntD là 1-based
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  return (
    <PublicHeaderStatistic
      handleClick={() => {}}
      title="DANH SÁCH NHẮC TẦM SOÁT LẠI - NỘI SOI"
      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}
    >
      <div style={{ fontWeight: 600 }}>{`${from === -199 ? 1 : from}–${to === 0 ? (dataListCallReExamming?.data?.paging?.total_count  >= 201 ? 200 : dataListCallReExamming?.data?.paging?.total_count )  : to} / ${total}`}</div>
    </PublicHeaderStatistic>
  );
}, [
  pagination.page,
  pagination.pageSize,
  dataListCallReExamming?.data?.paging?.total_count,
]);



  const tableCallReExam = useMemo(
    () => (
      <PublicTable
        listData={listCallReExamming || []}
        loading={storeisLoadingCallReExamming}
        column={ColumnTable}
        rowkey="c_schedule_id"
        size="small"
        pageSizes={200}
        isPagination
        isHideRowSelect={true}
        isNormal
        scroll={{ x: "max-content", y: "100vh - 80px" }}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        //   handleChangePagination={(page: any, pageSize: any) => { }}
        // totalItem={listAfterExams?.status ? listAfterExams?.data?.paging?.total_count : 0}
        totalItem={
          (dataListCallReExamming?.status &&
            dataListCallReExamming?.data?.paging?.total_count) ||
          0
        }
      />
    ),
    [
      listCallReExamming,
      storeisLoadingCallReExamming,
      dataListCallReExamming,
      loadingPage,
    ]
  );

  return (
    <PublicLayout>
      <div className="p-after_examination">
        <PublicHeader
          isHideService
          isHideEmergency
          isDial={false}
          // isHideFilterMobile
          isHideCleanFilter
          titlePage=""
          className="p-after_examination_header"
          handleFilter={() => {}}
          isClearFilter={storeisLoadingCallReExamming}
          handleGetTypeSearch={() => {}}
          // isHideSearch={false}
          isHideFilter
          handleCleanFilter={() => {
            //   setDataFilter({
            //      date: new Date(),
            //     type: 0,
            //     origin: undefined as unknown as DropdownData,
            //     originGroup: undefined as unknown as DropdownData,
            //     originType: undefined as unknown as DropdownData,
            //     state: undefined as unknown as DropdownData,
            //     status: undefined as unknown as DropdownData,
            //     key: ''
            //   })
            //   dispatch(getListToStoreAfterExams({
            //     processKeyId: '',
            //     dateFilterType: 0,
            //     fromDay: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DDT00:00:00'),
            //     toDay: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
            //     keyWord: '',
            //     launchSourceID: 'all',
            //     launchSourceGroupID: 0,
            //     launchSourceTypeID: 0,
            //     statusRes: 'all',
            //     limits: 1000,
            //     pages: 1,
            //     isDefault: false
            //   } as unknown as RequestListAfterExams));
            //   handleGetStatistic();
          }}
          tabBottomRight={
            <div style={{ width: "180px", marginTop:"5px" }}>
              <Input2
                id="customer_id"
                type="text"
                variant="simple"
                value={dataFilter.keyWord}
                placeholder="Nhập tên, địa chỉ, số điện thoại,.."
                onChange={(event: any) => {
                  setDataFilter({
                    ...dataFilter,

                    keyWord: event?.target?.value,
                  });
                }}
                handleEnter={() => {
                  setListCallReExamming([]);
                  dispatch(
                    getListCallReExammingMaster({
                      ...propsData,

                      keyWord: dataFilter.keyWord,
                    } as any)
                  );
                }}
                handleClickIcon={() => {
                  setListCallReExamming([]);
                  dispatch(
                    getListCallReExammingMaster({
                      ...propsData,

                      keyWord: dataFilter.keyWord,
                    } as any)
                  );
                }}
                iconName="search"
              />{" "}
            </div>
          }
          tabBottom={
            <div
              className="p-after_examination_filter_bottom p-after_examination_filter p-appointment_view_filter"
              style={{ gap: "5px" }}
            >
              <div style={{ width: "200px" }}>
                <Dropdown4
                  dropdownOption={dcdmcschedules}
                  values={dataFilter.c_schedule_type_id}
                  // defaultValue={propsData.c_schedule_type_id}
                  handleSelect={(item: any) => {
                    setDataFilter({
                      ...dataFilter,
                      c_schedule_type_id: item?.value,
                    });
                    setListCallReExamming([]);

                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        c_schedule_type_id: item?.value,
                      } as any)
                    );
                    // dispatch(getStatisticAllowRangeDate({
                    //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                    //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                    // }));
                  }}
                  variant="simple"
                  placeholder="-- Lý do quay lại --"
                />
              </div>

              <div style={{ width: "130px" }}>
                <Dropdown4
                  dropdownOption={dcdmcschedulesstatus}
                  values={dataFilter.status}
                  defaultValue={propsData.status}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, status: item?.value });
                    setListCallReExamming([]);
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        status: item?.value,
                      } as any)
                    );
                  }}
                  variant="simple"
                  placeholder="-- Trạng thái --"
                />
              </div>
               <div style={{ width: "200px" }}>
                <Dropdown4
                  dropdownOption={[
                    {
                    id:1,
                    label: "Tất cả",
                    value: 0
                  }, ...stateLaunchSourceGroups
                  ]}
                  values={dataFilter.sourceGroup}
                  // defaultValue={{
                  //   id:1,
                  //   label: "Tất cả",
                  //   value: 0
                  // }}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, sourceGroup: item?.value });
                    setListCallReExamming([]);
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        launch_source_group_id: item?.value,
                      } as any)
                    );
                  }}
                  variant="simple"
                  placeholder="-- Brand --"
                />
              </div>
                <div style={{ width: "120px" }}>
                <Dropdown4
                  dropdownOption={[
                    {
                    id:1,
                    label: "Tất cả",
                    value: 0
                  }, ...stateLaunchSource
                  ]}
                  values={dataFilter.source}
                  // defaultValue={{
                  //   id:1,
                  //   label: "Tất cả",
                  //   value: 0
                  // }}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, source: item?.value });
                    setListCallReExamming([]);
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        launch_source_id: item?.value,
                      } as any)
                    );
                  }}
                  variant="simple"
                  placeholder="-- Nguồn --"
                />
              </div>
               <div style={{ width: "100px" }}>
                <Dropdown4
                   dropdownOption={[
                    {
                    id:1,
                    label: "Tất cả",
                    value: "all"
                  }, ...listF
                  ]}
                  values={dataFilter.stateF}
                //  defaultValue={{
                //     id:1,
                //     label: "Tất cả",
                //     value: "all"
                //   }}
                  handleSelect={(item: any) => {
                    setDataFilter({ ...dataFilter, stateF: item?.value });
                    setListCallReExamming([]);
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        f_type: item?.value,
                      } as any)
                    );
                  }}
                  variant="simple"
                  placeholder="Phân loại"
                />
              </div>
 <div style={{ width: "80px" }}>
                <Dropdown4
                  dropdownOption={dmYearDoctorSchedules}
                  values={dataFilter.year}
                  handleSelect={(item: any) => {
                    const year = item?.value;
                    const from_date =  `${year}-01-01 00:00:00` ;
                    const to_date =  `${year}-12-31 23:59:59`;

                    setDataFilter({
                      ...dataFilter, from_date: from_date, to_date: to_date,
                        from_date1: from_date,
                      to_date1: to_date,

                     });
                     setSelectedDays(-2);
                    setListCallReExamming([]);
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date,
                        to_date,
                      } as any)
                    );
                  }}

                  variant="simple"
                  placeholder="Năm"
                />
              </div>
              <Radio.Group
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedDays(selectedValue);

                  const today = moment().format("YYYY-MM-DD");
                  const yesterday = moment()
                    .subtract(1, "days")
                    .format("YYYY-MM-DD");
                  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
                  const next7To = moment().add(7, "days").format("YYYY-MM-DD");
                  const next14To = moment().add(14, "days").format("YYYY-MM-DD");
                  const next1MTo = moment().add(14, "days").format("YYYY-MM-DD");
                  if (selectedValue === 9999) {
                    // Tất cả
                    setListCallReExamming([]);
                   setDataFilter({
                      ...dataFilter,
                      from_date: null,
                      to_date: null,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: null,
                        to_date: null,
                          from_date1:  moment().format("YYYY-MM-DD 00:00:00"),
                      to_date1:  moment().format("YYYY-MM-DD 00:00:00"),
                      } as any)
                    );
                  } else if (selectedValue === -9999) {
                    // Quá khứ
                    const to = `${yesterday} 23:59:59`;
                    setListCallReExamming([]);
                   setDataFilter({
                      ...dataFilter,
                      from_date: null,
                     to_date: to,
                      from_date1: to,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: null,
                        to_date: to,
                      } as any)
                    );
                  } else if (selectedValue === -1) {
                    // Hôm qua
                    const from = `${yesterday} 00:00:00`;
                    const to = `${yesterday} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                      } as any)
                    );
                  } else if (selectedValue === 0) {
                    // Hôm nay
                    const from = `${today} 00:00:00`;
                    const to = `${today} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                      } as any)
                    );
                  } else if (selectedValue === 3) {
                    // Ngày mai
                    const from = `${tomorrow} 00:00:00`;
                    const to = `${tomorrow} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                        
                      } as any)
                    );
                  } else if (selectedValue === 4) {
                    // 7 ngày tới
                    const from = `${tomorrow} 00:00:00`;
                    const to = `${next7To} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                      } as any)
                    );
                  }
                   else if (selectedValue === 5) {
                    // 7 ngày tới
                    const from = `${tomorrow} 00:00:00`;
                    const to = `${next14To} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                      } as any)
                    );
                  }
                     else if (selectedValue === 6) {
                    // 7 ngày tới
                    const from = `${tomorrow} 00:00:00`;
                    const to = `${next1MTo} 23:59:59`;
                    setListCallReExamming([]);
                    setDataFilter({
                      ...dataFilter,
                      from_date: from,
                      to_date: to,
                      from_date1: from,
                      to_date1: to,
                    });
                    dispatch(
                      getListCallReExammingMaster({
                        ...propsData,
                        from_date: from,
                        to_date: to,
                      } as any)
                    );
                  }
                  else if (selectedValue === -2) {
                    // Tùy chọn
                    setDataFilter({ ...dataFilter });
                  }
                }}
                value={selectedDays}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "10px",
                  gap: "5px",
                }}
              >
               {[
  // Lọc bỏ các value không muốn hiển thị
  ...dmtimedoctorschedules.filter(
    (option: any) => ![7, 1, 0, -1, -9999,9999,-2].includes(option.value)
  ),
  // Thêm 4 option mới
  {
    label: 'Trước 1 ngày',
    value: 3,
  },
  {
    label: 'Trước 1 tuần',
    value: 4,
  },
  {
    label: 'Trước 2 tuần',
    value: 5,
  },
  {
    label: 'Trước 1 tháng',
    value: 6,
  },
  ...dmtimedoctorschedules.filter((option: any) => option.value === -2),

]
                .map(option => (
                  <Radio key={option.value} value={option.value} style={{fontSize:12}}>
                    {option.label}
                  </Radio>
              ))}

              </Radio.Group>
              {
                selectedDays === -2 && (<div style={{ marginTop: "10px" }}>
                <RangeDate
                  variant="simple"
                  value={{
                    from: dataFilter?.from_date1,
                    to: dataFilter?.to_date1,
                  }}
                  defaultValue={{
                       from: dataFilter?.from_date1,
                    to: dataFilter?.to_date1,
                  }}
                  handleOnChange={(from: any, to: any) => {
                    const yesterday = moment()
                      .subtract(1, "days")
                      .format("YYYY-MM-DD");
                    const today = moment().format("YYYY-MM-DD");
                    const tomorrow = moment()
                      .add(1, "days")
                      .format("YYYY-MM-DD");
                    const fromDate = moment(from).format("YYYY-MM-DD 00:00:00");
                    const toDate = moment(to).format("YYYY-MM-DD 23:59:59");

                    // Nếu from và to không khớp hôm qua, hôm nay, mai => set về tùy chọn
                    if (
                      !(fromDate === yesterday && toDate === yesterday) &&
                      !(fromDate === today && toDate === today) &&
                      !(fromDate === tomorrow && toDate === tomorrow)
                    ) {
                      console.log(234)
                      setSelectedDays(-2); // chuyển về "Tùy chọn"
                      setListCallReExamming([]);
                      
                      dispatch(
                        getListCallReExammingMaster({
                          ...propsData,
                          from_date: fromDate,
                          to_date: toDate,
                        } as any)
                      );
                    }

                    setDataFilter({
                      ...dataFilter,
                      from_date: fromDate,
                      to_date: toDate,
                      from_date1: from,
                      to_date1: to,
                    });

                    if (selectedDays === -2) {
                      setListCallReExamming([]);
                      dispatch(
                        getListCallReExammingMaster({
                          ...propsData,
                          from_date: fromDate,
                          to_date: toDate,
                        } as any)
                      );
                    }
                  }}
                />
              </div>)
              }
              
            </div>
          }
        />
        <div className="p-after_examination_statistic">{statisticHeader}</div>
        <div className="p-after_examination_content">{tableCallReExam}</div>
      </div>
      {/* Update note */}
      <CModal
        isOpen={openNote}
        widths={540}
        title="Cập nhật ghi chú"
        onCancel={() => {
          setOpenNote(false);
        }}
        onOk={async () => {
          const body = {
            customerId: (saveItem as ItemListAfterExams).customer_id,
            content: noteData,
          };
          await postQuickNote(body);
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <TextArea
          id=""
          readOnly={false}
          value={noteData}
          isResize
          defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setNoteData(e.target.value)}
        />
      </CModal>

      <CModal
        isOpen={dataTakeMe.openTM}
        widths={400}
        title="Cập nhật uống thuốc, tái khám"
        onCancel={() => {
          setDataTakeMe({
            ...dataTakeMe,
            openTM: false,
            begin_drug_date: moment(new Date()).format("YYYY-MM-DD"),
            end_drug_date: moment(new Date()).format("YYYY-MM-DD"),
            reexamming_date: moment(new Date()).format("YYYY-MM-DD"),
          });
        }}
        onOk={async () => {
          const body = {
            schedule_id: dataTakeMe.schedule_id,
            begin_drug_date: dataTakeMe.begin_drug_date,
            end_drug_date: dataTakeMe.end_drug_date,
            reexamming_date: dataTakeMe.reexamming_date,
          };

          await TakeMeTask(body);
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "8px", minWidth: "40%" }}>
            Ngày bắt đầu uống thuốc:
          </p>
          <CDatePickers
            fomat="YYYY-MM-DD"
            variant="simple"
            ValDefault={dataTakeMe.begin_drug_date}
            value={new Date(dataTakeMe?.begin_drug_date)}
            handleOnChange={(date: any) => {
              setDataTakeMe({
                ...dataTakeMe,
                begin_drug_date: moment(date?.$d).format("YYYY-MM-DD"),
              });
            }}
            disabledDate={(currentDate: any) => {
              // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
              return currentDate && currentDate < moment().startOf("day");
            }}
          />
        </div>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "8px", minWidth: "40%" }}>
            Ngày kết thúc uống thuốc:
          </p>
          <CDatePickers
            fomat="YYYY-MM-DD"
            variant="simple"
            ValDefault={dataTakeMe.end_drug_date}
            value={new Date(dataTakeMe?.end_drug_date)}
            disabledDate={(currentDate: any) => {
              // Ngày bắt đầu (begin_drug_date) để so sánh
              const beginDate = moment(dataTakeMe.begin_drug_date);
              // Không cho phép chọn ngày nhỏ hơn hôm nay hoặc nhỏ hơn begin_drug_date
              return (
                currentDate &&
                (currentDate < moment().startOf("day") ||
                  currentDate < beginDate.startOf("day"))
              );
            }}
            handleOnChange={(date: any) => {
              setDataTakeMe({
                ...dataTakeMe,
                end_drug_date: moment(date?.$d).format("YYYY-MM-DD"),
              });
            }}
          />
        </div>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "8x", minWidth: "40%" }}>Ngày tái khám:</p>
          <CDatePickers
            fomat="YYYY-MM-DD"
            variant="simple"
            ValDefault={dataTakeMe.reexamming_date}
            value={new Date(dataTakeMe?.reexamming_date)}
            handleOnChange={(date: any) => {
              setDataTakeMe({
                ...dataTakeMe,
                reexamming_date: moment(date?.$d).format("YYYY-MM-DD"),
              });
            }}
            disabledDate={(currentDate: any) => {
              // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
              return currentDate && currentDate < moment().startOf("day");
            }}
          />
        </div>
      </CModal>
      <CModal
        isOpen={dataDelay.openDelay}
        widths={400}
        title="Dời ngày hẹn dự kiến"
        onCancel={() => {
          setDataDelay({
            ...dataDelay,
            openDelay: false,
            c_schedule_datetime: moment(new Date()).format("YYYY-MM-DD"),
            cs_notes: "",
            id: 0,
          });
        }}
        onOk={async () => {
          const body = {
            c_schedule_id: dataDelay.id,
            c_schedule_note: dataDelay.cs_notes,
            c_schedule_datetime: dataDelay.c_schedule_datetime,
          };

          await PostDelayDate(body);
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
          }}
        >
          <p style={{ marginTop: "8px", minWidth: "40%" }}>
            Dời ngày hẹn dự kiến :
          </p>
          <CDatePickers
            fomat="YYYY-MM-DD"
            variant="simple"
            ValDefault={dataDelay.c_schedule_datetime}
            value={new Date(dataDelay.c_schedule_datetime)}
           
            handleOnChange={(date: any) => {
              setDataDelay({
                ...dataDelay,
                c_schedule_datetime: moment(date?.$d).format("YYYY-MM-DD 00:00:00"),
              });
            }}
            disabledDate={(currentDate: any) => {
              // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
              return currentDate && currentDate < moment().startOf("day");
            }}
          />
        </div>
        <TextArea
          id=""
          readOnly={false}
          value={dataDelay.cs_notes}
          isResize
          placeholder="Ghi chú"
          required
          error=""
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) =>
            setDataDelay({
              ...dataDelay,
              cs_notes: e.target.value,
            })
          }
        />
      </CModal>
      <CModal
        isOpen={dataAddNote.openAddNote}
        widths={940}
        title="Ghi chú công việc"
        onCancel={() => {
          setDataAddNote({
            ...dataAddNote,
            openAddNote: false,
            cs_node_content: "",
            customer_id: "",
          });
        }}
        onOk={async () => {
          setDataAddNote({
            ...dataAddNote,
            openAddNote: false,
            cs_node_content: "",
            customer_id: "",
          });
        }}
        textCancel="Hủy"
        textOK="Đóng"
        isHideCancel
        isHideOk
      >
        <>
          <div style={{ width: "100%", gap: 12 }}>
            <div className="t-header_wrapper-merge_customer_wrapper">
              {/* {formMergeCustomer} */}
              <div className="p-customer_leads_form_sms">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    width: "100%",
                    gap: "8px",
                  }}
                >
                  <div style={{ flex: 9 }}>
                    <TextArea
                      label=""
                      id=""
                      readOnly={false}
                      isResize
                      placeholder="Nhập ghi chú mới"
                      value={dataAddNote.cs_node_content}
                      handleOnchange={(event) => {
                        setDataAddNote({
                          ...dataAddNote,
                          cs_node_content: event.target.value,
                        });
                      }}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0489dc",
                      cursor: "pointer",
                      height: "45px", // để full chiều cao TextArea nếu cần
                      padding: "10px",
                      borderRadius: "6px",
                    }}
                    className={mapModifiers("p-after_examination_total_header")}
                    onClick={() => {
                      if (!handleValidateForm()) return;
                      setListNodeLoading(true);
                      const body = {
                        customer_id: dataAddNote.customer_id,
                        cs_node_content: dataAddNote.cs_node_content,
                        cs_node_type: dataAddNote.cs_node_type,
                        c_schedule_id: dataAddNote.c_schedule_id,
                      };
                      AddNoteC(body);
                      handleUpdateStatus({
                        action: "update_status",
                        id_pk_long: dataUpdateStatus.id_pk_long,
                        value_text: selectedStatus,
                      });
                    }}
                  >
                    <img
                      src={iconAddNote}
                      alt=""
                      style={{ width: "20px", height: "23px" }}
                    />
                    <div style={{ color: "white", marginLeft: "5px" }}>
                      Thêm ghi chú
                    </div>
                  </div>
                </div>

              <Radio.Group
  onChange={(e) => {
    setSelectedStatus(e.target.value);
    setDataAddNote({
      ...dataAddNote,
      cs_node_content:
        e.target.value === "new"
          ? ""
          : e.target.value === "contact"
          ? `Đã liên hệ ${stateCount + 1} lần`
          : e.target.value === "appointment"
          ? "Đã đặt lịch"
          : e.target.value === "checkin"
          ? "Khách hàng đã đến"
          : "",
    });
  }}
  value={selectedStatus}
  style={{
    display: "flex",
    justifyContent: "start",
    marginTop: "10px",
    gap: "16px",
  }}
>
  {dcdmcschedulesstatus.map((option) => {
    if (option.value === "all") return null; // 👈 Bỏ qua 'all'

    let color = "#000"; // default
    switch (option.value) {
      case "new":
        color = "#B21016";
        break;
      case "contact":
        color = "#007AAE";
        break;
      case "appointment":
        color = "#138535";
        break;
      case "checkin":
        color = "#085820";
        break;
      case "canceled":
        color = "#FF0000";
        break;
    }

    return (
      <Radio key={option.value} value={option.value} style={{ color }}>
        {option.label}
      </Radio>
    );
  })}
</Radio.Group>

              </div>
              <div
                className="t-header_wrapper-merge_customer_button"
                style={{
                  marginBottom: "15px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    color: "#33333",
                    textTransform: "uppercase",
                  }}
                >
                  Lịch sử ghi chú:
                </div>

                {/* <Button modifiers={['foreign']} onClick={
                  () => { 
                    const body = {s
                      id: dataAddNote.id,
                      cs_notes: dataAddNote.cs_notes
                    }
                    AddNote(body)
                  }  

                
         }>
           <img src={iconAddNote} alt="" style={{width:"20px",height:"23px", marginRight:"3px"}}/>     <Typography>Thêm ghi chú</Typography>
                    </Button> */}
              </div>
            </div>
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {LoainglistNotesCustomer !== true  ? (
                <div
                  style={{
                    height: "200px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <div className="loaderCR"></div>
                </div>
              ) : (
            <>     {
                    listNode.data.length !== 0 &&                 <InteractionHistoryRC
                  options={listNode?.data as any}
                  id={dataAddNote.c_schedule_id.toString()}
                  loadingNote={listNodeLoading}
                />
                  }</> 

              )}
            </div>
          </div>
        </>
      </CModal>

      <CModal
        isOpen={addTask.openAddTask}
        widths={540}
        title="Thêm công việc "
        onCancel={() => {
          setFullNC("");
          setAddTask({
            ...addTask,
            openAddTask: false,
            cs_notes: "",
            cs_title: "",
            cs_remind_date: moment(new Date()).format("YYYY-MM-DD"),
          });
        }}
        onOk={async () => {
          const body = {
            customer_id: addTask.customer_id,
            cs_notes: addTask.cs_notes,
            cs_title: addTask.cs_title,
            cs_remind_date: addTask.cs_remind_date,
          };
          if (
            body.cs_title === "" ||
            body.cs_notes === "" ||
            body.customer_id === ""
          ) {
            if (body.cs_title === "") {
              toast.error("Bạn vui lòng nhập tên công việc!");
            } else if (body.cs_notes === "") {
              toast.error("Bạn vui lòng nhập nội dung công");
            } else {
              if (body.customer_id === "") {
                toast.error("Bạn vui lòng chọn 1 khách hàng");
              }
            }
          } else {
            await AddTask(body);
          }
        }}
        textCancel="Hủy"
        textOK="Thêm mới"
      >
        <div style={{marginTop:"5px"}} >
         <Input
          variant="borderRadius"
          type="text"
          id=""
          isSearch
          value={keySearch}
          placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng"
          onChange={(e) => {
            setKeySearch(e.target.value);
          }}
          handleEnter={async () => {
            if (keySearch.trim()) {
              await getSearchByKey(keySearch);
              setIsLoading(true);
            } else {
              toast.error("Không thể tìm kiếm với một giá trị rỗng");
            }
          }}
          iconName="search"
          isLoading={isLoading}
        /></div>
        {fullNC === "" ? (
          <></>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <p>
              Tên khách hàng: <strong>{fullNC}</strong> -
            </p>
            <p>
              Mã khách hàng: <strong>{addTask.customer_id}</strong>{" "}
            </p>
          </div>
        )}

        <div>
          <p>Tên công việc:</p>
          <Input
            variant="borderRadius"
            type="text"
            id=""
            value={addTask.cs_title}
            placeholder="Nhập tên công việc"
            onChange={(e) => {
              setAddTask({
                ...addTask,
                cs_title: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <p>Ngày thực hiện:</p>
          <CDatePickers
            fomat="YYYY-MM-DD"
            variant="simple"
            ValDefault={addTask.cs_remind_date}
            value={new Date(addTask?.cs_remind_date)}
            handleOnChange={(date: any) => {
              setAddTask({
                ...addTask,
                cs_remind_date: moment(date?.$d).format("YYYY-MM-DD"),
              });
            }}
            disabledDate={(currentDate: any) => {
              // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
              return currentDate && currentDate < moment().startOf("day");
            }}
          />
        </div>
        <div>
          <p>Nội dung công việc:</p>
          <TextArea
            id=""
            placeholder="Nhập nội dung công việc"
            readOnly={false}
            value={addTask.cs_notes}
            isResize
            // defaultValue={saveItem?.process_note}
            handleOnchange={(e) =>
              setAddTask({ ...addTask, cs_notes: e.target.value })
            }
          />
        </div>
      </CModal>
      <CModal
        isOpen={isAddTask}
        widths={800}
        onCancel={() => {
          setIsAddTask(false);
          setIsUpdateTask(false);
          setFormData({
            name: "",
            shortDesc: "",
            group: undefined as unknown as DropdownData,
            assign: undefined as unknown as DropdownData,
            personCharge: undefined as unknown as DropdownData,
            deadline: undefined as unknown as Date,
            type: undefined as unknown as GroupRadioType,
            desc: "",
            id: "",
          });
        }}
        isHideFooter
        zIndex={10}
      >
        <div className="t-list_job_form">
          <div className="t-list_job_form_content">
            <Input
              label="Tên công việc"
              isRequired
              value={formData.name}
              variant="border8"
              placeholder="Nhập tên công việc"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={formDataErr.name}
            />
            <Input
              label="Mô tả ngắn"
              value={formData.shortDesc}
              variant="border8"
              placeholder="Nhập mô tả"
              onChange={(e) =>
                setFormData({ ...formData, shortDesc: e.target.value })
              }
            />
            <div className="t-list_job_form_content_flex">
              <Dropdown
                dropdownOption={listTask}
                isRequired
                values={formData.group}
                placeholder="Nhóm việc"
                label="Nhóm việc"
                handleSelect={(item) => {
                  setFormData({ ...formData, group: item });
                }}
                variant="style"
                className="form_origin"
                error={formDataErr.group}
              />
              <Dropdown
                dropdownOption={listEmployeeTeams}
                isRequired
                placeholder=""
                label="Phân công cho"
                handleSelect={(item) => {
                  setFormData({ ...formData, assign: item });
                  setListPerson(hanldeConvertListCustomer(item?.value));
                }}
                variant="style"
                className="form_origin"
                values={formData.assign}
              />
              <Dropdown
                dropdownOption={listPerson || []}
                isRequired
                placeholder="Chọn người đảm nhiệm"
                label="Người đảm nhiệm"
                handleSelect={(item) => {
                  setFormData({ ...formData, personCharge: item });
                }}
                variant="style"
                className="form_origin"
                values={formData.personCharge}
              />
            </div>
            <div className="t-list_job_form_content_flex2" style={{display:"grid", gridTemplateColumns:"1fr"}}>
              <CDatePickers
                isRequired
                label="Hạn chót (deadline)"
                handleOnChange={(date: any) => {
                  setFormData({ ...formData, deadline: date?.$d });
                }}
                variant="style"
                fomat="YYYY-MM-DD HH:mm"
                isShowTime
                placeholder="1990-01-01"
                value={formData.deadline}
                error={formDataErr.deadline}
              />
              {/* <div style={{ marginBottom: "10px" }}>
                <GroupRadio
                  options={OptionCustomerTask}
                  value={formData.type}
                  handleOnchangeRadio={(data: any) =>
                    setFormData({ ...formData, type: data })
                  }
                />
              </div> */}
            </div>
            <TextArea
              label="Ghi chú"
              placeholder="Mô tả công việc"
              required
              id=""
              readOnly={false}
              value={formData.desc}
              handleOnchange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
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
        isOpen={dataUpdateStatus.openUpdateStatus}
        widths={340}
        title="Cập nhật trạng thái"
        onCancel={() => {
          setDataUpdateStatus({
            ...dataUpdateStatus,
            openUpdateStatus: false,
            value_text: undefined as unknown as DropdownData,
            id_pk_long: 0,
          });
        }}
        onOk={async () => {
          handleUpdateStatus({
            action: "update_status",
            id_pk_long: dataUpdateStatus.id_pk_long,
            value_text: dataUpdateStatus.value_text,
          });
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
        confirmLoading={loadingStatus}
      >
        <>
          <div style={{ width: "100%", gap: 12 }}>
            <div className="t-header_wrapper-merge_customer_wrapper">
              {/* {formMergeCustomer} */}
              <div className="p-customer_leads_form_sms">
                <Dropdown
                  dropdownOption={dcdmcschedulesstatus1}
                  values={dataUpdateStatus.value_text}
                  defaultValue={dataUpdateStatus.value_text}
                  handleSelect={(item: any) => {
                    setDataUpdateStatus({
                      ...dataUpdateStatus,
                      value_text: item?.value,
                    });
                  }}
                  variant="simple"
                  placeholder="-- Trạng thái --"
                />
              </div>
            </div>
          </div>
        </>
      </CModal>
      <CModal
        isOpen={errorNote}
        widths={340}
        title=""
        onCancel={() => {
          setErrorNote(false);
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
        isHideCancel
        isHideOk
      >
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              height: "100%",
            }}
          >
            <svg
              width="120px"
              height="120px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#CCCCCC"
                stroke-width="0.096"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ff0000"
                  stroke-width="1.5"
                ></circle>{" "}
                <path
                  d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                  stroke="#ff0000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                ></path>{" "}
              </g>
            </svg>
            <div>
              <p style={{ color: "#545454", fontSize: "18px" }}>
                Vui lòng nhập ghi chú!
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0489dc",
                cursor: "pointer",
                height: "54px", // để full chiều cao TextArea nếu cần
                width: "54px",
                padding: "10px",
                borderRadius: "6px",
              }}
              className={mapModifiers("p-after_examination_total_header")}
              onClick={() => {
                setErrorNote(false);
              }}
            >
              <div style={{ color: "white" }}>OK</div>
            </div>
          </div>
        </>
      </CModal>

      {isOpenPopup && (
        <FormAddCustomer
          isOpenPopup={isOpenPopup}
          positionDrawer="right"
          handleClosePopup={() => {
            setIsOpenPopup(false);
            setIsClosePopup(false);
          }}
          valUpdate={customerUpdate}
          isUpdate
          dataCustomerPortrait={undefined}
          isClose={isClosePopup}
          handleClose={() => {
            setIsOpenPopup(false);
            setIsClosePopup(false);
          }}
          handleAddCustomer={(data: any) => handleUpdateCustomer(data)}
          isHigh
          isUsedDrawer={false}
          idC_Schedule={stateCID}
        />
      )}
    </PublicLayout>
  );
};

export default CallReExamination;
