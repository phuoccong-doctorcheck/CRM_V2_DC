/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { Popover } from 'antd';
import { OptionStatusAfterExams } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import Dropdown4 from 'components/atoms/Dropdown4';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import MultiSelect from 'components/molecules/MultiSelect';
import PublicTable from 'components/molecules/PublicTable';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import { useSip } from 'components/templates/SipProvider';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postStagesByIdAfterExams, SaveQuickNoteAfterExams } from 'services/api/afterexams';
import { ItemListAfterExams, RequestListAfterExams } from 'services/api/afterexams/types';
import { add_Note, AddTasks, assignt_Task, changeStatus, delay_dates, get_Note, save_schedule_dates } from 'services/api/afterexams_task';
import { postCallOutCustomer } from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import { getListToStoreAfterExams, getStatisticAllowRangeDate } from 'store/afterexams';
import { getListAfterExamTaskMaster } from 'store/afterexams_task';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';
import { optionStateTypeAfterTask, optionStateStatusAfterTask ,optionStateStatusAfterTask2} from 'utils/staticState';

import iconUTG from "assets/iconButton/icon-calendar-g.png"
import iconUT from "assets/iconButton/icon-calendar-gr.png"
import iconRSG from "assets/iconButton/icon-reschedule-gray.png"
import iconRSR from "assets/iconButton/icon-reschedule-red.png"
import iconAddNote from "assets/iconButton/icons-write-2.png"
import iconAddTask from "assets/iconButton/icons8-add-note-50.png"
import iconChangeU from "assets/icons/iconChangeUser.png"
export type StateCustomerType = 'Lần đầu' | 'Tái khám';
export type StateExaminationType = 'Đã có toa thuốc' | '';

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
const AfterMedicalExaminationTask: React.FC = () => {
  const dispatch = useAppDispatch();
  /*  */
  const { makeCall } = useSip();

  const dataStatisticAfterExams = useAppSelector((state) => state.afterExams.afterExamsStatistic);
  const dataStateAfterExams = useAppSelector((state) => state.afterExams.stateAfterExams);
  const dataListAfterExams = useAppSelector((state) => state.afterExams.dataList);
  const storeisLoadingAferExams = useAppSelector((state) => state.afterExams.isLoadingAfterExam);

  const dataListAfterExamTask = useAppSelector((state) => state.afterexamtask.afterExamsStatistic);
  const storeisLoadingAferExamsTask = useAppSelector((state) => state.afterexamtask.isLoadingAfterExamTask);
  const [listAfterExamsTask, setListAfterExamsTask] = useState(dataListAfterExamTask);
  /*  */
 const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const dataStages = localStorage.getItem('stages');
  const employeeId = Cookies.get('employee_id');
  const listStages = localStorage.getItem('stages');
  const storageEmployeeList = localStorage.getItem("listCSKH");
  const employee_Id = localStorage.getItem("employee_id");
  const schedule_types = localStorage.getItem("schedule_types");
  const nameCS = Cookies.get('signature_name');
  const position = Cookies.get("employee_team");
  const [stateEmployeeList, setStateEmployeeList] = useState<DropdownData[]>(() => {
    const parsedList: DropdownData[] = storageEmployeeList ? JSON.parse(storageEmployeeList) : [];
    return parsedList.filter((employee) => employee.employee_type === "SALES,CS");
  });
  const [stateScheduleTypes, setstateScheduleTypes] = useState<DropdownData[]>(schedule_types ? JSON.parse(schedule_types) : []);
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
    const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
  console.log("stateScheduleTypes",stateScheduleTypes)
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listStateInStorage, setListStateInStorage] = useState(listStages ? JSON.parse(listStages || '') : undefined);
  const [stateAfterExams2, setStateAfterExams2] = useState([{ id: '', label: 'Tất cả', value: 'all' }, ...dataStateAfterExams]);

  const [statisticAfterExams, setStatisticAfterExams] = useState(dataStatisticAfterExams);
  const [stateAfterExams, setStateAfterExams] = useState(dataStateAfterExams);
  const [listAfterExams, setListAfterExams] = useState(dataListAfterExams);
  const [stateAfterExamsCount, setStateAfterExamsCount] = useState(dataListAfterExams?.data?.paging?.total_count);
  /*  */
  const [openNote, setOpenNote] = useState(false);
  const [saveItem, setSaveItem] = useState<ItemListAfterExams>();
  const [noteData, setNoteData] = useState(saveItem?.process_note.toString());
  const [valueKeySearch, setValueKeySearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });
  const getFullName = Cookies.get("lastname");
    const [keySearch, setKeySearch] = useState('');
  const [notes, setNotes] = useState<Note[]>([])
  const [dataFilter, setDataFilter] = useState({
    date: moment(new Date()).format('YYYY-MM-DD'),
    type: undefined as unknown as DropdownData,
    employee_id: undefined as unknown as DropdownData,
    status: undefined as unknown as DropdownData,
    key: '',
      source: undefined as unknown as DropdownData,
        sourceGroup: undefined as unknown as DropdownData,
        stateF:  undefined as unknown as DropdownData,
  });

  const propsData = {
    type: dataFilter?.type || "all",
    employee_id: position === "BOD" ? "all" : employee_Id, // Sửa logic điều kiện ở đây
    status: dataFilter?.status || "new",
    date: dataFilter?.date,
    keyWord: dataFilter.key,
    page: 1,
    limit: 200,
     launch_source_id: dataFilter?.source || 0,
    launch_source_group_id: dataFilter?.sourceGroup || 0,
     f_type: dataFilter?.stateF || "all",
  };
    const [assigntTasks, setAssigntTasks] = useState({
      openModal: false,
      listTask: [],
      cs_employee_id: undefined as unknown as DropdownData,
      content: '',
      nameC:""
    })
  const [dataNote, setDataNote] = useState({
    openNote: false,
    id: 0,
    cs_employee_id: undefined as unknown as DropdownData,
    cs_notes: ""
  })
  const [dataTakeMe, setDataTakeMe] = useState({
    openTM: false,
    schedule_id: undefined as number | undefined,
    begin_drug_date: moment(new Date()).format('YYYY-MM-DD'),
    end_drug_date: moment(new Date()).format('YYYY-MM-DD'),
    reexamming_date: moment(new Date()).format('YYYY-MM-DD')
  })
  const [dataDelay, setDataDelay] = useState({
    openDelay: false,
    id: 0,
    cs_remind_date: moment(new Date()).format('YYYY-MM-DD'),
    cs_notes: ""
  })
  const [dataAddNote, setDataAddNote] = useState({
    openAddNote: false,
    id: 0,
    cs_notes: ""
  })
  const [dataChangeStatus, setDataChangeStatus] = useState({
    openChangeStatus: false,
    id: 0,
    cs_status: undefined as unknown as DropdownData,
    cs_notes: ""
  })
   const [addTask, setAddTask] = useState({
    openAddTask: false,
    customer_id: "",
    cs_remind_date: moment(new Date()).format('YYYY-MM-DD'),
     cs_notes: "",
    cs_title:""
   })
  const [loadingAddTask,setLoadingAddTask] = useState(false)
  const [fullNC,setFullNC] = useState("")
  useEffect(() => {
    
    dispatch(getListAfterExamTaskMaster({
      type: dataFilter?.type || "all",
      employee_id: position === "BOD" ? "all" : employee_Id, // Sửa logic điều kiện ở đây
      status: dataFilter?.status || "new",
      date: dataFilter?.date,
      keyWord: dataFilter.key,
      page: 1,
      limit: 200,
          f_type: "all",
        launch_source_group_id: 0,
        launch_source_id:0
    } as any));
    document.title = 'Chăm sóc sau khám | CRM'
  }, []);

  useEffect(() => {
    setListAfterExams(dataListAfterExams);
    setStateAfterExamsCount(dataListAfterExams?.data?.paging?.total_count);
  }, [dataListAfterExams]);

  useEffect(() => {
    setStatisticAfterExams(dataStatisticAfterExams);
  }, [dataStatisticAfterExams]);
  const [isLoading, setIsLoading] = useState(false);
    const [dataMerge, setDataMerge] = useState({
      from: '',
      to: '',
      note: 'Trùng thông tin',
      fromErr: '',
      toErr: '',
      noteErr: '',
      search: '',
      resultSearch: [],
      isSearch: false,
      loading: false,
    })
  const [isOpenModalSearch, setIsOpenModalSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState();
  /* Call APIs */
   const { mutate: getSearchByKey } = useMutation(
      'post-footer-form',
      (id: string) => getCustomerByKey(id),
      {
        onSuccess: async (data) => {
          if (!data.length) {
            setIsLoading(false);
            setKeySearch('')
            toast.error('Không tìm thấy thông tin khách hàng');
          } else {
            if (dataMerge.isSearch) {
            
              await setDataMerge({
                ...dataMerge,
                resultSearch: data,
                loading: false,
              });
            } else {
              setKeySearch('')
              setIsOpenModalSearch(true);
              setDataSearch(data);
              setIsLoading(false);
            }
          }
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
    );
  /* API thay đổi trạng thái của khách hàng */
  const { mutate: AssigntTask } = useMutation(
    'post-footer-form',
    (data: any) => assignt_Task(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataNote(
            {
              id: 1,
              openNote: false, cs_notes: "", cs_employee_id: undefined as unknown as DropdownData
              
            }
          )
        setAssigntTasks({...assigntTasks,openModal:false,content:"", cs_employee_id:undefined as unknown as DropdownData, listTask:[]
        })
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: DelayDate } = useMutation(
    'post-footer-form',
    (data: any) => delay_dates(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataDelay(
            {
              id: 0,
              openDelay: false, cs_notes: "",
              cs_remind_date: moment(new Date()).format('YYYY-MM-DD')
              
            }
          )
          setDataChangeStatus(
            {
              id: 1,
              openChangeStatus: false, cs_notes: "", cs_status: undefined as unknown as DropdownData
              
            }
          )
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: TakeMeTask } = useMutation(
    'post-footer-form',
    (data: any) => save_schedule_dates(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataTakeMe({
            ...dataTakeMe, openTM: false, begin_drug_date: moment(new Date()).format('YYYY-MM-DD'),
            end_drug_date: moment(new Date()).format('YYYY-MM-DD'),
            reexamming_date: moment(new Date()).format('YYYY-MM-DD')  
          })
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: AddNote } = useMutation(
    'post-footer-form',
    (data: any) => add_Note(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          handleGetNote(dataAddNote.id)
           setDataAddNote({...dataAddNote,cs_notes:""})
          
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: ChangeStatusTask } = useMutation(
    'post-footer-form',
    (data: any) => changeStatus(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
          setDataChangeStatus(
            {
              id: 1,
              openChangeStatus: false, cs_notes: "", cs_status: undefined as unknown as DropdownData
              
            }
          )
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: GetNote } = useMutation(
    'post-footer-form',
    (data: any) => get_Note(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setNotes(data.data)
         
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
    const { mutate: AddTask } = useMutation(
    'post-footer-form',
    (data: any) => AddTasks(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
          dispatch(getListAfterExamTaskMaster(propsData as any));
           setFullNC("")
          setAddTask({
            ...addTask, openAddTask: false,cs_remind_date : moment(new Date()).format('YYYY-MM-DD'),
           cs_title:"",
            cs_notes:""
          })
        
        } else {
          toast.error(data?.message);
         
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const handleGetNote = (id: number) => {
    const body = {
      id: id
    }
    GetNote(body)
  }
  /* API Ghi chú  */
  const { mutate: postQuickNote } = useMutation(
    'post-footer-form',
    (data: any) => SaveQuickNoteAfterExams(data),
    {
      onSuccess: () => {
        setOpenNote(false);
        dispatch(getListToStoreAfterExams(propsData as unknown as RequestListAfterExams));
        // dispatch(getStatisticAllowRangeDate({
        //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
        //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
        // }));
        setNoteData('')
        toast.success('Cập nhật ghi chú thành công');
      },
      onError: () => {
      },
    },
  );
  /* API gọi điện ra cho khách hàng */
  const { mutate: postCallOut } = useMutation(
    'post-footer-form',
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
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  /* End Call API */

  /* Cập nhật trạng thái của khách hàng 
    Các trạng thái của KH sau khám: Đã khám xong | Chưa liên hệ được | Chưa hết bệnh | Đã hết bệnh | Có tiến triển | Tầm soát
  */
  const handleAssignTask = async (item: any, data: any) => {
    const body = {
      customerId: data.customer_id,
      stageId: item.value,
      employeeId: employeeId,
    };
    await AssigntTask(body);
  };
  useEffect(() => {
    setListAfterExamsTask(dataListAfterExamTask)
  }, [dataListAfterExamTask])
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
      message: `${nameCS || Cookies.get('signature_name')} gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };
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
    // {
    //   title: <Typography content="Ngày thực hiện" modifiers={['12x18', '500', 'center', 'uppercase']} />,
    //   dataIndex: 'cs_remind_date',
    //   align: 'center',
    //   width: 70,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //       const { customer_id, customer_fullname, ...prevData } = data;
    //       if (customer_id) {
    //         Cookies.set('id_customer', customer_id);
    //         dispatch(getInfosCustomerById({ customer_id: customer_id }));
    //         const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
    //         if (newTab) {
    //           newTab.focus();
    //         }
    //       } else {
    //         toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //       }
    //     }}>
    //       <Typography content={moment(record).format('DD/MM/YYYY')} modifiers={['13x18', '500', 'center', 'main']} />
    //     </div>
    //   ),
    // },
  
 
    {
      title: <Typography content="Khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "left", marginLeft: "12px" }} />,
      dataIndex: 'customer_fullname',
    
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, year_of_birth, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
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
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record + ` (${data.year_of_birth}, ${data.gender})`} modifiers={['13x18', '500', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"left"
        }}/>
        </div>
      ),
    },
       {
      title: <Typography content="Lần" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'cs_count',
      align: 'center',
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record.toString()} modifiers={['13x18', '600', 'center', 'main']} />
        </div>
      ),
    },
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
        const { customer_id, customer_fullname, ...prevData } = data;
        if (customer_id) {
          Cookies.set('id_customer', customer_id);
          dispatch(getInfosCustomerById({ customer_id: customer_id }));
          const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
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
        const { customer_id, customer_fullname, ...prevData } = data;
        if (customer_id) {
          Cookies.set('id_customer', customer_id);
          dispatch(getInfosCustomerById({ customer_id: customer_id }));
          const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
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
        const { customer_id, customer_fullname, ...prevData } = data;
        if (customer_id) {
          Cookies.set('id_customer', customer_id);
          dispatch(getInfosCustomerById({ customer_id: customer_id }));
          const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
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
          content={record === "F0" ? "" : record}
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
      content="Công việc"
      modifiers={['12x18', '500', 'center', 'uppercase']}
      styles={{ textAlign: "left", marginLeft: "15px" }}
    />
  ),
  dataIndex: 'cs_title',
  align: 'center',
  className: "ant-table-column_wrap",
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
      onClick={() => {
        const { customer_id, customer_fullname, ...prevData } = data;
        if (customer_id) {
          Cookies.set('id_customer', customer_id);
          dispatch(getInfosCustomerById({ customer_id: customer_id }));
          const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
          if (newTab) {
            newTab.focus();
          }
        } else {
          toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
        }
      }}
    >
      <Typography
        content={record} // Hiển thị nội dung đầy đủ
        modifiers={['13x18', '500', 'left', 'main']}
        styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"left"
        }}
      />
    </div>
  ),
},


     
    {
      title: <Typography content="Bác sĩ khám" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "left", marginLeft: "15px" }} />,
      dataIndex: 'doctor_employee_name',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div style={{ justifyContent: "start" }} className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <Typography content={record} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
      ),
    },
    {
      title: <Typography content="Toa thuốc" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'has_drugs',
      align: 'center',
      width: 60,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          {
            record === true ? <Typography content="Có" modifiers={['13x18', '500', 'center', 'green']} /> : <Typography content="Không" modifiers={['13x18', '500', 'center', 'cg-red']} />
          }
          
        </div>
      ),
    },
    {
      title: <Typography content="Ngày uống" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'begin_drug_date',
      align: 'center',
      width: 70,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={data.has_drugs === true ? moment(record).format('DD/MM/YYYY') : "--"} modifiers={['13x18', '500', 'center', 'main']} />
            {/* <Typography content={record} modifiers={['13x18', '600', 'center', 'cg-red']} /><Typography content={data?.launch_source_type_name} modifiers={['13x18', '600', 'center']} /> */}
          </div>
        </div>
      ),
      //  filters: launchSourcesAfterExams,
      // onFilter: (value: any, record: any) => { return record.launch_source_name?.includes(value); },
      // filters: launchSourcesAfterExams.map((item) => {
      //   const obj = {
      //     text: item.label,
      //     value: item.label,
      //   }
      //   return obj;
      // }),
      // onFilter: (value: any, record: any) => {
      //   return record.launch_source_name?.toLocaleLowerCase().search(value?.toLocaleLowerCase()) !== -1
      // },
    },
    {
      title: <Typography content="Uống xong" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'end_drug_date',
      align: 'center',
      width: 75,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={data.has_drugs === true ? moment(record).format('DD/MM/YYYY') : "--"} modifiers={['13x18', '500', 'center', 'main']} />
          </div>
        </div>
      ),
      
    },
    {
      title: <Typography content="Tái khám" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'has_reexamming',
      align: 'center',
      width: 60,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          if (customer_id) {
            Cookies.set('id_customer', customer_id);
            dispatch(getInfosCustomerById({ customer_id: customer_id }));
            const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
            if (newTab) {
              newTab.focus();
            }
          } else {
            toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
          }
        }}>
          {
            record === true ? <Typography content="Có" modifiers={['13x18', '500', 'center', 'green']} /> : <Typography content="Không" modifiers={['13x18', '500', 'center', 'cg-red']} />
          }
          
        </div>
      ),
    },
    
      
    {
      title: <Typography content="Đảm nhiệm" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "left", marginLeft: "15px" }} />,
      dataIndex: 'cs_employee_name',
      align: 'center',
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <>
          
          
                <div
          style={{ justifyContent: "start" }}
          className="ant-table-column_item" onClick={() => {
            setDataNote({ ...dataNote, openNote: true, id: data.id })
          }}>
          <Typography content={record} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
        
        </>
      ),

    },
    {
      title: <Typography content={"Trạng thái"} modifiers={[]} />,
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (data: any, record: any) => {
        const state = optionStateStatusAfterTask.find((i) => i.value === data.cs_status);
        // const state2 = stateAfterExams.find((i) => i.id === data.process_key_id);
        return (
          <>
            {
              position === "BOD" ?
                <div className="flexbox_centers" onClick={() => {
            if (data.cs_status === "done") {
              toast.success("Task này đã hoàn thành")
            }
            else {
              setDataChangeStatus(
                {
                  ...dataChangeStatus,
                  openChangeStatus: true,
                  id: data.id,
                  cs_status: data.cs_status
                }
              )
            }
           
          }
          } >
            {
              state?.value === "delay" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'cg-red']} /> : state?.value === "inprogress" ?
                <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'orange']} /> : state?.value === "done" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'green']} />:state?.value === "canceled" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'cg-red']} />  : <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'main']} />
            }
           
          </div>:
                <div className="flexbox_centers" onClick={() => {
            if (data.cs_status === "done") {
              toast.success("Task này đã hoàn thành")
            }
            else {
              setDataChangeStatus(
                {
                  ...dataChangeStatus,
                  openChangeStatus: true,
                  id: data.id,
                  cs_status: data.cs_status
                }
              )
            }
           
          }
          } >
            {
              state?.value === "delay" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'cg-red']} /> : state?.value === "inprogress" ?
                <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'orange']} /> : state?.value === "done" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'green']} />:state?.value === "canceled" ? <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'cg-red']} />  : <Typography content={state?.label} modifiers={['13x18', '500', 'center', 'main']} />
            }
           
          </div>
          }
          </>
        );
      },
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'has_drugs',
      align: 'center',
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
       <>
       {
              <div className="ant-table-column_item" >
          <CTooltip placements="top" title="Cập nhật uống thuốc, tái khám">
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
              {(record === true) ? <img src={iconUTG} style={{ width: "28px", height: "28px" }} onClick={() => {
                setDataTakeMe({
                  ...dataTakeMe,
                  openTM: true,
                  schedule_id: data.schedule_id,
                  begin_drug_date: data.begin_drug_date,
                  end_drug_date: data.end_drug_date,
                  reexamming_date: data.end_drug_date

                })
              }} /> : <></>}
            
            </div>
          </CTooltip>
        </div>
       }
       </>
      
      ),
       
    
    },
    {
      title: <Typography content="" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'is_reschedule',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <>
          {
         
                <div className="ant-table-column_item" >
                {
                  data.cs_type === "n0" ? <></> :    <CTooltip placements="top" title="Dời ngày">
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
              {record === true ? <img src={iconRSR} style={{ width: "23px", height: "23px" }} onClick={() => {
                if (data.cs_status === "done") {
                  toast.success("Task này đã hoàn thành")
                }
                else {
                  setDataDelay({
                    ...dataDelay,
                    openDelay: true,
                    id: data.id
                  })
                }
              }
              } /> : <img src={iconRSG} style={{ width: "23px", height: "23px" }} onClick={() => {
                if (data.cs_status === "done") {
                  toast.success("Task này đã hoàn thành")
                }
                else {
                  setDataDelay({
                    ...dataDelay,
                    openDelay: true,
                    id: data.id
                  })
                }
              }
               
              } />}
            
            </div></CTooltip>
                    }
        </div>
          }
        </>
      
      ),
       
    
    },
  
   
    {
      title: '',
      dataIndex: '',
      align: 'center',
      className: 'p-after_examination_column_center',
      width: 50,
     
      render: (data: any, record: any) => {
        return (
          <>
          {/* {
              position === "BOD" ?  <CTooltip placements="topLeft" title="Thêm ghi chú"> <p
           
                className="click_event" > <Icon iconName="edit_info" isPointer /> </p> </CTooltip>
                :  <CTooltip placements="topLeft" title="Thêm ghi chú"> <p
            onClick={() => {
              handleGetNote(data.id)
              setDataAddNote({ ...dataAddNote, id: data.id, openAddNote: true })
            }}
            className="click_event" > <Icon iconName="edit_info" isPointer /> </p> </CTooltip>
          } */}
           {
               <CTooltip placements="topLeft" title="Thêm ghi chú"> <p
            onClick={() => {
              handleGetNote(data.id)
              setDataAddNote({ ...dataAddNote, id: data.id, openAddNote: true })
            }}
            className="click_event" > <Icon iconName="edit_info" isPointer /> </p> </CTooltip>
          }
          </>
         
        )
      }
    },
  
    {
      title: '',
      dataIndex: '',
      align: 'center',
      width: 50,
     
      className: 'p-after_examination_column_center',
      render: (data: any, record: any) => (
        <CTooltip placements="topLeft" title="Gọi điện ngay"> <p onClick={() => { handleCallOutCustomer(data?.customer_phone) }} className="click_event" > <Icon iconName="phone_icon-main" isPointer /> </p> </CTooltip>
      ),
    },
    
  
  ];
  const columnTableNote = [
    {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'suggestion_count',
      align: 'center',
      width: 0,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: number) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Typography content={`${index + 1}`} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày note" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'note_datetime',
      align: 'center',
      width:0,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record ? moment(record).format('hh:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    
    {
      title: <Typography content="Nội dung Note" modifiers={['12x18', '500', 'center', 'uppercase']}  styles={{ textAlign: "left", marginLeft: "9px" }} />,
      dataIndex: 'cs_notes',
      align: 'center',
      width: 240,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'start' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
   
   
  ];
  /* Sử dụng Hook useMemo 
  => Cache component chỉ re-render khi Dependency thay đổi giá trị
  */
  const tableMergeCustomer = useMemo(() => (
    <div className="t-header_wrapper_table" style={{ maxHeight: "90%", minHeight: "50vh", background: "white" }}>
      <PublicTable
        column={columnTableNote}
        listData={
    (notes || []).sort((a, b) => 
      new Date(b.note_datetime).getTime() - new Date(a.note_datetime).getTime()
    )
  }
         
        size="small"
        rowkey="customer_id"
        isbordered
        isPagination={false}
         
        scroll={{ x: 'max-conent', y: '45vh' }}
        isHideRowSelect
        pageSizes={15}
        handleChangePagination={(page: any, pageSize: any) => {
        }}
      />
    </div>
  ), [notes])
  const statisticHeader = useMemo(() => (
    <PublicHeaderStatistic
      handleClick={() => {

      }}
      
      title={position === "BOD" ? `Công việc chăm sóc sau khám` :  `Công việc chăm sóc sau khám của ${getFullName}`}
      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}>
      <div className={mapModifiers('p-after_examination_total')}>
      
            <div className='p-after_examination_total_item'>
              <span>Có: <strong style={{ color: '#f00' }}>{listAfterExamsTask?.data?.data?.length || 0} </strong> công việc hôm nay <div>(hoàn tất : <strong style={{ color: '#f00' }}>{dataListAfterExamTask?.data?.data.filter((item) => item.cs_status === "done").length|| 0}</strong>)</div></span>
            </div>
            
             
      
      </div>
    </PublicHeaderStatistic>
  ), [statisticAfterExams?.data, dataStatisticAfterExams.data,assigntTasks.listTask.length,listAfterExamsTask])
  const tableAfterExams = useMemo(() => (
   
   
    <PublicTable
      listData={listAfterExamsTask?.data?.data}
      loading={storeisLoadingAferExamsTask}
      column={ColumnTable}
      rowkey="customer_id"
      size="small"
       pageSizes={50}
      isPagination
      isHideRowSelect={true}
      isNormal
      scroll={{ x: 'max-content', y: '100vh - 80px' }}
      handleChangePagination={(page: any, pageSize: any) => {
        handleChangePagination(page, pageSize);
      }}
       handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
            setAssigntTasks({
              ...assigntTasks,
              openModal: false,
              listTask: selectedRows.map((item: any) => ({
                id: item?.id,

              }))
            })
          }}
          handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
            setAssigntTasks({
              ...assigntTasks,
              openModal: false,
              listTask: selectedRows.map((item: any) => ({
                id: item?.id,

              }))
            })
          }}
          handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
              setAssigntTasks({
              ...assigntTasks,
              openModal: false,
              listTask: selectedRows.map((item: any) => ({
                id: item?.id,

              }))
            })
          }}
     //   handleChangePagination={(page: any, pageSize: any) => { }}
      // totalItem={listAfterExams?.status ? listAfterExams?.data?.paging?.total_count : 0}
      totalItem={
          (listAfterExamsTask?.status &&
            listAfterExamsTask?.data?.paging?.total_count) ||
          0
        }
    />
  ), [listAfterExamsTask?.data?.data, storeisLoadingAferExamsTask,dataListAfterExamTask]);
  /* Sử dụng Hook useMemo */
   const tableColumnForSearch = [
    {
      title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'RowNumber',
      align: 'center',
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
          setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={index + 1} modifiers={['13x18', '400', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Họ tên" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'customer_fullname',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
              setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={record} modifiers={['12x18', '400', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Năm sinh" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'year_of_birth',
      width: 90,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
              setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={record || '---'} modifiers={['12x18', '400', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Giới tính" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'gender_id',
      width: 80,
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
              setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={record === 'M' ? 'Nam' : 'Nữ'} modifiers={['12x18', '400', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Số điện thoại" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'customer_phone',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
              setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={record ? record.replace(/^.{4}/, '0') : '---'} modifiers={['12x18', '400', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Địa chỉ" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'customer_full_address',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
          const { customer_id, customer_fullname, ...prevData } = data;
          setAddTask(
            {
              ...addTask,
              customer_id: data.customer_id,
              
            }
          )
              setFullNC(data.customer_fullname)
          setIsOpenModalSearch(false)
        }}>
          <Typography content={record} modifiers={['12x18', '400', 'center']} />
        </div>
      ),
    },
    // {
    //   title: <Typography content="Ngày đặt lịch" modifiers={['12x18', '500', 'center']} />,
    //   dataIndex: '',
    //   align: 'center',
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //       const { customer_id, customer_fullname, ...prevData } = data;
    //       if (customer_id) {
    //         const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
    //         if (newTab) {
    //           newTab.focus();
    //         }
    //       } else {
    //         toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //       }
    //     }}>
    //       <Typography content={record} modifiers={['12x18', '400', 'center']} />
    //     </div>
    //   ),
    // },
    // {
    //   title: <Typography content="Nguồn" modifiers={['12x18', '500', 'center']} />,
    //   dataIndex: '',
    //   align: 'center',
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any) => (
    //     <div className="ant-table-column_item" onClick={() => {
    //       const { customer_id, customer_fullname, ...prevData } = data;
    //       if (customer_id) {
    //         const newTab = window.open(`/customer-info/id/${customer_id}/history-interaction`, '_blank');
    //         if (newTab) {
    //           newTab.focus();
    //         }
    //       } else {
    //         toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
    //       }
    //     }}>
    //       <Typography content={record} modifiers={['12x18', '400', 'center']} />
    //     </div>
    //   ),
    // },
  ];
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
          handleFilter={() => {

          }}
          isClearFilter={storeisLoadingAferExams}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(val: string) => { setValueKeySearch(val); }}
          valueSearch={valueKeySearch}
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
          // listBtn={(<div className={mapModifiers('p-after_examination_total_header')}>
          //   <div className='p-after_examination_total_item'>
          //     <span>Có: <strong style={{ color: '#f00' }}>{stateAfterExamsCount}</strong>Khách hàng</span>
          //   </div>
          // </div>)}
          
          tabBottomRight={
            (
              <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
                <div style={{marginTop:"5px",}}>
                   {
            assigntTasks.listTask.length > 0 ?
              // Button gửi tin nhắn tất cả khách
                      <div className={mapModifiers('p-after_examination_total_header')} style={{  display: "flex", alignItems: "center", background: "#0489dc", cursor: "pointer" }} 
                         onClick={() => {
                       setAssigntTasks({
                ...assigntTasks, openModal: true
                   })

                   }}
                
                >
                   <img src={iconChangeU} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/> 
                  <div style={{color:"white", marginLeft:"5px"}}>Phân công</div>
            
          </div>
              : null
      }
                </div>
                <div className={mapModifiers('p-after_examination_total_header')} style={{marginTop:"5px", display:"flex", alignItems:"center", background:"#0489dc",cursor:"pointer"}} onClick={() => {
                  setAddTask({
                    ...addTask,
                    openAddTask: true,
                  })
                }}
                
                >
                   <img src={iconAddTask} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/> 
                  <div style={{color:"white", marginLeft:"5px"}}>Thêm công việc</div>
            
          </div>
              </div>
              )

           }
          tabBottom={(
            <div className='p-after_examination_filter_bottom p-after_examination_filter p-appointment_view_filter' style={{ gap: "10px" }}>
              <div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:5}}>
              <span>Ngày thực hiện:</span>
<CDatePickers
                              fomat="YYYY-MM-DD"
                              variant="simple"
                              ValDefault={dataFilter.date}
                              value={new Date(dataFilter?.date)}
                              handleOnChange={(date: any) => {
                                setDataFilter({
                                  ...dataFilter,
                                  date: moment(date?.$d).format('YYYY-MM-DD'),
                                });
                               dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                    date:  moment(date?.$d).format('YYYY-MM-DD'),
                  } as any));
                              }}
              />
              </div>
                 
              
              <Dropdown
                dropdownOption={stateScheduleTypes
  // chỉ lấy các id mong muốn
  .filter((item:any) => ['n0', 'n1', 'nreexam'].includes(item.id))
  // đổi label cho n0
  .map(item => ({
    ...item,
    label: item.id === 'n0' ? 'Trước khám 1 ngày' : item.label,
  }))
}
                values={dataFilter.type}
                defaultValue={dataFilter.type}
                handleSelect={(item: any) => {
                  setDataFilter({ ...dataFilter, type: item?.value });
                 
               
                     dispatch(getListAfterExamTaskMaster({
                       ...propsData,
                       
                    type:  item?.value,
                  } as any));
                  // dispatch(getStatisticAllowRangeDate({
                  //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                  //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  // }));
                }}
                variant="simple"
                placeholder='-- Loại công việc --'
              />
          
             
                <Dropdown
                dropdownOption={optionStateStatusAfterTask}
                values={dataFilter.status}
                defaultValue={propsData.status}
                handleSelect={(item: any) => {
                  setDataFilter({ ...dataFilter, status: item?.value });
                 
                  dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                    status:  item?.value,
                  } as any));

                  // dispatch(getStatisticAllowRangeDate({
                  //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                  //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  // }));
                }}
                variant="simple"
                placeholder='-- Chọn tình trạng --'
                
              />
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
                                  // setListCallReExamming([]);
                                  // dispatch(
                                  //   getListCallReExammingMaster({
                                  //     ...propsData,
                                  //     launch_source_group_id: item?.value,
                                  //   } as any)
                                  // );
                                    dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                  launch_source_group_id: item?.value,
                  } as any));
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
                                  // setListCallReExamming([]);
                                  // dispatch(
                                  //   getListCallReExammingMaster({
                                  //     ...propsData,
                                  //     launch_source_id: item?.value,
                                  //   } as any)
                                  // );
                                    dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                launch_source_id: item?.value,
                  } as any));
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
                                  // setListCallReExamming([]);
                                  // dispatch(
                                  //   getListCallReExammingMaster({
                                  //     ...propsData,
                                  //     f_type: item?.value,
                                  //   } as any)
                                  // );
                                   dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                   f_type: item?.value,
                  } as any));
                                }}
                                variant="simple"
                                placeholder="Phân loại"
                              />
                            </div>
                <div style={{marginTop:"8px"}}>
              <Input
                id='search-booking'
                type="text"
                variant='simple'
                value={dataFilter.key}
                placeholder='Nhập tên, địa chỉ, số điện thoại,..'
                onChange={(event: any) => {
                  
                  setDataFilter({
                    ...dataFilter,
                    key: event?.target?.value
                  })
                }}
                handleEnter={() => {
                     dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                    keyWord:  dataFilter.key ,
                  } as any));
                  // dispatch(getStatisticAllowRangeDate({
                  //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                  //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  // }));
                }}
                handleClickIcon={() => {
                    dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                    keyWord:  dataFilter.key ,
                  } as any));
                }}
                iconName='search'
                />  </div>
              {
                position === "BOD" && (
                    <Dropdown
                 
                dropdownOption={[{ id: 99, label: 'Tất cả', value: "all" as any }, ...stateEmployeeList]}
                values={dataFilter.employee_id}
                handleSelect={(item: any) => {
                  setDataFilter({ ...dataFilter, employee_id: item?.value });
                  dispatch(getListAfterExamTaskMaster({
                    ...propsData,
                    employee_id:  item?.value,
                  } as any));

                  // dispatch(getStatisticAllowRangeDate({
                  //   fromdate: moment(dataFilter?.fromDays).format('YYYY-MM-DDT00:00:00'),
                  //   todate: moment(dataFilter?.toDays).format('YYYY-MM-DDTHH:mm:ss'),
                  // }));
                }}
                variant="simple"
                placeholder='-- Chọn CSKH --'
                
              />
                )
               }
    
            </div>
          )}
        />
        <div className="p-after_examination_statistic">
          {statisticHeader}
        </div>
        <div className="p-after_examination_content">
          {tableAfterExams}
        </div>
      </div>
      {/* Update note */}
      <CModal
        isOpen={openNote}
        widths={540}
        title="Cập nhật ghi chú"
        onCancel={() => { setOpenNote(false); }}
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
        isOpen={dataNote.openNote}
        widths={540}
        title="Phân công cho CSKH khác"
        onCancel={() => { setDataNote({...dataNote,openNote:false,cs_notes:"", cs_employee_id:undefined as unknown as DropdownData
        }); }}
        onOk={async () => {
          const body = {

            id: dataNote.id,
            cs_employee_id: dataNote.cs_employee_id,
           cs_notes: dataNote.cs_notes,
          };
          if (body.cs_employee_id === undefined || body.cs_notes === "" || body.id === undefined)
          {
            if (body.cs_employee_id === undefined) {
                toast.error("Bạn vui lòng chọn 1 CSKH để chuyển task")
            }else
            {
                if (body.cs_notes === "") {
                toast.error("Bạn vui lòng nhập ghi chú")
              }
            }
          } else 
          {
              await AssigntTask(body);
          }
          
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div style={{marginBottom:"10px"}}>
           <Dropdown
                dropdownOption={stateEmployeeList}
                values={dataNote.cs_employee_id}
                handleSelect={(item: any) => {
                  setDataNote({ ...dataNote, cs_employee_id: item?.value });
                }}
                variant="simple"
                placeholder='-- Chọn CSKH --'
              />
         </div>
        <TextArea
          id=""
          readOnly={false}
          value={dataNote.cs_notes}
          isResize
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setDataNote({...dataNote, cs_notes:e.target.value})}
        />
      </CModal>
         <CModal
        isOpen={assigntTasks.openModal}
        widths={540}
        title="Phân công cho CSKH khác"
        onCancel={() => { setAssigntTasks({...assigntTasks,openModal:false,content:"", cs_employee_id:undefined as unknown as DropdownData,
        }); }}
        onOk={async () => {
          assigntTasks.listTask.map(async (item: any) => { 
            const body = {

            id: item.id,
            cs_employee_id: assigntTasks.cs_employee_id,
           cs_notes: `Phân công việc cho ${assigntTasks.nameC}`,
          };
          if (body.cs_employee_id === undefined || body.cs_notes === "" || body.id === undefined)
          {
            if (body.cs_employee_id === undefined) {
                toast.error("Bạn vui lòng chọn 1 CSKH để chuyển task")
            }else
            {
                if (body.cs_notes === "") {
                toast.error("Bạn vui lòng nhập ghi chú")
              }
            }
          } else 
          {
              await AssigntTask(body);
          }
          })
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div style={{marginBottom:"10px"}}>
           <Dropdown
                dropdownOption={stateEmployeeList}
                values={dataNote.cs_employee_id}
                handleSelect={(item: any) => {
                  setAssigntTasks({ ...assigntTasks, cs_employee_id: item?.value ,nameC:item?.label});
                }}
                variant="simple"
                placeholder='-- Chọn CSKH --'
              />
         </div>
        <TextArea
          id=""
          readOnly={true}
          value={`Phân công việc cho ${assigntTasks.nameC}`}
          isResize
          defaultValue={`Phân công việc cho ${assigntTasks.nameC}`}
          handleOnchange={(e) => setAssigntTasks({...assigntTasks, content:e.target.value})}
        />
      </CModal>
          <CModal
        isOpen={dataTakeMe.openTM}
        widths={400}
        title="Cập nhật uống thuốc, tái khám"
        onCancel={() => { setDataTakeMe({...dataTakeMe,openTM:false,begin_drug_date: moment(new Date()).format('YYYY-MM-DD'),
     end_drug_date:moment(new Date()).format('YYYY-MM-DD'),
      reexamming_date:moment(new Date()).format('YYYY-MM-DD')
        }); }}
        onOk={async () => {
          const body = {

            schedule_id: dataTakeMe.schedule_id,
            begin_drug_date: dataTakeMe.begin_drug_date,
            end_drug_date: dataTakeMe.end_drug_date,
           reexamming_date:dataTakeMe.reexamming_date
          };
        
              await TakeMeTask(body);
        
          
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div style={{ marginBottom: "10px", display:"flex", justifyContent:"space-around",alignItems:"center" }}>
          <p style={{marginBottom:"8px", minWidth:"40%"}}>Ngày bắt đầu uống thuốc:</p>
                        <CDatePickers
                              fomat="YYYY-MM-DD"
                              variant="simple"
                              ValDefault={dataTakeMe.begin_drug_date}
            value={new Date(dataTakeMe?.begin_drug_date)}
            
                              handleOnChange={(date: any) => {
                                setDataTakeMe({
                                  ...dataTakeMe,
                                  begin_drug_date: moment(date?.$d).format('YYYY-MM-DD'),
                                });
                               
            }}
             disabledDate={(currentDate: any) => {
    // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
    return currentDate && currentDate < moment().startOf("day");
  }}
                          />
         </div>
                               <div style={{ marginBottom: "10px", display:"flex", justifyContent:"space-around",alignItems:"center" }}>
       <p style={{marginBottom:"8px", minWidth:"40%"}}>Ngày kết thúc uống thuốc:</p>
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
      (currentDate < moment().startOf("day") || currentDate < beginDate.startOf("day"))
    );
  }}
                              handleOnChange={(date: any) => {
                                setDataTakeMe({
                                  ...dataTakeMe,
                                  end_drug_date: moment(date?.$d).format('YYYY-MM-DD'),
                                });
                               
                              }}
                          />
        </div>
         <div style={{ marginBottom: "10px", display:"flex", justifyContent:"space-around",alignItems:"center" }}>
         <p style={{marginBottom:"8x", minWidth:"40%"}}>Ngày tái khám:</p>
          <CDatePickers
                              fomat="YYYY-MM-DD"
                              variant="simple"
                              ValDefault={dataTakeMe.reexamming_date}
                              value={new Date(dataTakeMe?.reexamming_date)}
                              handleOnChange={(date: any) => {
                                setDataTakeMe({
                                  ...dataTakeMe,
                                  reexamming_date: moment(date?.$d).format('YYYY-MM-DD'),
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
        title="Dời ngày"
        onCancel={() => { setDataDelay({...dataDelay,openDelay:false,cs_remind_date: moment(new Date()).format('YYYY-MM-DD'),cs_notes:""
        }); }}
        onOk={async () => {
          const body = {

            id: dataDelay.id,
            cs_remind_date: dataDelay.cs_remind_date,
            cs_notes: dataDelay.cs_notes,
         
          };
        
              await DelayDate(body);
        
          
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div style={{ marginBottom: "10px", display:"flex", justifyContent:"space-around",alignItems:"start" }}>
          <p style={{marginTop:"8px", minWidth:"40%"}}>Dời công việc qua ngày :</p>
                        <CDatePickers
                              fomat="YYYY-MM-DD"
                              variant="simple"
                              ValDefault={dataDelay.cs_remind_date}
                              value={new Date(dataDelay?.cs_remind_date)}
                              handleOnChange={(date: any) => {
                                setDataDelay({
                                  ...dataDelay,
                                  cs_remind_date: moment(date?.$d).format('YYYY-MM-DD'),
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
          placeholder='Ghi chú'
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setDataDelay({...dataDelay, cs_notes:e.target.value})}
        />
      </CModal>
        <CModal
        isOpen={dataAddNote.openAddNote}
        widths={940}
        title="Ghi chú công việc"
        onCancel={() => { setDataAddNote({...dataAddNote,openAddNote:false,cs_notes:""}); }}
        onOk={async () => {
          setDataAddNote({...dataAddNote,openAddNote:false,cs_notes:""})
        
          
        }}
        textCancel="Hủy"
        textOK="Đóng"
        isHideCancel
      >
           <>
         
       
          <div style={{ width: '100%', gap: 12 }}>
           
            <div className="t-header_wrapper-merge_customer_wrapper">
              {/* {formMergeCustomer} */}
               <div className='p-customer_leads_form_sms'>
        
            
               
          
           
                <TextArea label='' id={''} readOnly={false} isResize
                  placeholder='Nhập ghi chú'
            value={dataAddNote.cs_notes}
                  handleOnchange={(event) => {
                    setDataAddNote({...dataAddNote,cs_notes: event.target.value})
            }}
          />
        </div>
              <div className="t-header_wrapper-merge_customer_button" style={{marginBottom:"15px"}}>
              
               
                 
                {/* <Button isLoading={isMergeSuccess} modifiers={['foreign']} onClick={handleMergeCustomer}> */}
                <div className={mapModifiers('p-after_examination_total_header')} style={{ display: "flex", alignItems: "center", background: "#0489dc", cursor: "pointer" }} onClick={
                   () => {
                    const body = {
                      id: dataAddNote.id,
                      cs_notes: dataAddNote.cs_notes
                    }
                    AddNote(body)
                  }  
                 }>
                   <img src={iconAddNote} alt="" style={{width:"20px",height:"23px",}}/> 
                  <div style={{color:"white", marginLeft:"5px"}}>Thêm ghi chú</div>
            
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
            {tableMergeCustomer}
          </div>
        </>
      </CModal>
        <CModal
        isOpen={dataChangeStatus.openChangeStatus}
        widths={540}
        title="Cập nhật trạng thái "
        onCancel={() => { setDataChangeStatus({...dataChangeStatus,openChangeStatus:false,cs_notes:"", cs_status:undefined as unknown as DropdownData
        }); }}
        onOk={async () => {
          if (dataChangeStatus?.cs_status?.toString() === "delay") {
             const body = {

            id: dataChangeStatus.id,
            cs_remind_date: dataDelay.cs_remind_date,
            cs_notes: dataDelay.cs_notes,
         
          };
        
              await DelayDate(body);
          } else {
            const body = {

            id: dataChangeStatus.id,
            cs_status: dataChangeStatus.cs_status,
           cs_notes: dataChangeStatus.cs_notes,
          };
          if (body.cs_status === undefined || body.cs_notes === "")
          {
            if (body.cs_status === undefined) {
                toast.error("Bạn vui lòng chọn 1 trạng thái")
            }else
            {
                if (body.cs_notes === "") {
                toast.error("Bạn vui lòng nhập ghi chú")
              }
            }
          } else 
          {
              await ChangeStatusTask(body);
          }
          }
          
          
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div style={{marginBottom:"10px"}}>
           <Dropdown
                dropdownOption={optionStateStatusAfterTask2}
            values={dataChangeStatus.cs_status}
            defaultValue={dataChangeStatus.cs_status}
                handleSelect={(item: any) => {
                  setDataChangeStatus({ ...dataChangeStatus, cs_status: item?.value });
                }}
                variant="simple"
                placeholder='-- Chọn trạng thái --'
              />
        </div>
        {
          dataChangeStatus?.cs_status?.toString() === "delay" ?
            <>
              <p>Dời công việc qua ngày:</p>
              <CDatePickers
                              fomat="YYYY-MM-DD"
                              variant="simple"
                              ValDefault={dataDelay.cs_remind_date}
                              value={new Date(dataDelay?.cs_remind_date)}
                              handleOnChange={(date: any) => {
                                setDataDelay({
                                  ...dataDelay,
                                  cs_remind_date: moment(date?.$d).format('YYYY-MM-DD'),
                                });
                               
            }}
              disabledDate={(currentDate: any) => {
    // Kiểm tra nếu ngày hiện tại nhỏ hơn ngày hôm nay thì vô hiệu hóa
    return currentDate && currentDate < moment().startOf("day");
  }}
            /></>
           
            :<></>
        }
        {
          dataChangeStatus?.cs_status?.toString() === "delay" ?
              <TextArea
          id=""
          readOnly={false}
          value={dataDelay.cs_notes}
          isResize
          placeholder='Ghi chú'
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setDataDelay({...dataDelay, cs_notes:e.target.value})}
        /> : <TextArea
          id=""
          readOnly={false}
          value={dataChangeStatus.cs_notes}
          isResize
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setDataChangeStatus({...dataChangeStatus, cs_notes:e.target.value})}
        />
        }
        
      </CModal>
       <CModal
        isOpen={addTask.openAddTask}
        widths={540}
        title="Thêm công việc "
        onCancel={() => {
          setFullNC("")
          setAddTask({ ...addTask, openAddTask: false, cs_notes: "", cs_title: "", cs_remind_date: moment(new Date()).format('YYYY-MM-DD'), });
        }}
        onOk={async () => {
          const body = {

            customer_id: addTask.customer_id,
            cs_notes: addTask.cs_notes,
            cs_title: addTask.cs_title,
           cs_remind_date: addTask.cs_remind_date
          };
          if (body.cs_title === "" || body.cs_notes === "" || body.customer_id === "")
          {
            if (body.cs_title === "") {
                toast.error("Bạn vui lòng nhập tên công việc!")
            }else if(body.cs_notes === "")
            {
             
                toast.error("Bạn vui lòng nhập nội dung công")
             
            }
            else {
              if (body.customer_id === "")
              {
                  toast.error("Bạn vui lòng chọn 1 khách hàng")
              }
            }
          } else 
          {
              await AddTask(body);
          }
          
        }}
        textCancel="Hủy"
        textOK="Thêm mới"
      >
          
                    <Input
                      variant="borderRadius"
                      type="text"
                      id=""
                      isSearch
                      value={keySearch}
                      placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng'
                      onChange={(e) => { setKeySearch(e.target.value); }}
                      handleEnter={async () => {
                        if (keySearch.trim()) {
                          await getSearchByKey(keySearch);
                          setIsLoading(true);
                        }
                        else {
                          toast.error('Không thể tìm kiếm với một giá trị rỗng');
                        }
                      }}
                      iconName='search'
            isLoading={isLoading}
        />
        {
          fullNC === "" ? <></> :
            <div style={{ display:"flex", alignItems:"center" ,gap:"5px"}} >
              <p>Tên khách hàng: <strong>{fullNC}</strong> -</p> 
              <p>Mã khách hàng: <strong>{addTask.customer_id}</strong> </p>
          
        </div>
        }
         
        <div>
          <p>Tên công việc:</p> 
           <Input
                      variant="borderRadius"
                      type="text"
                      id=""
                      value={addTask.cs_title}
                      placeholder='Nhập tên công việc'
            onChange={(e) => {
              setAddTask({
                ...addTask,
                cs_title:e.target.value
                      }); }}
                     
                     
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
                                  cs_remind_date: moment(date?.$d).format('YYYY-MM-DD'),
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
          placeholder='Nhập nội dung công việc'
          readOnly={false}
          value={addTask.cs_notes}
          isResize
          // defaultValue={saveItem?.process_note}
          handleOnchange={(e) => setAddTask({...addTask, cs_notes:e.target.value})}
        /></div>
      </CModal>
      <CModal
        isOpen={isOpenModalSearch}
        textOK="Thoát"
        onOk={() => setIsOpenModalSearch(false)}
        widths={1280}
        isHideCancel
        title={(
          <>
            <div className="t-header_modal_heading">
              <span>Danh sách khách hàng</span>
            </div>
          </>
        )}
      >
        <div className={mapModifiers('t-header_search')}>
          <PublicTable
            column={tableColumnForSearch}
            listData={dataSearch}
            size="small"
            rowkey="customer_id"
            pageSizes={20}
            isHideRowSelect
            isbordered
            isNormal
            isPagination
            handleChangePagination={(page: any, pageSize: any) => { }}
          />
        </div>
      </CModal>
    </PublicLayout>
  );
};

export default AfterMedicalExaminationTask;
