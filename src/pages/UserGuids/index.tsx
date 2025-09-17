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
import RichTextEditor from 'components/molecules/RichTextEditor';
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
import { getDataGPT, getInfoDetailGuid, postStagesByIdAfterExams, postUserGuids, SaveQuickNoteAfterExams } from 'services/api/afterexams';
import { ItemListAfterExams, RequestListAfterExams } from 'services/api/afterexams/types';
import { add_Note, AddTasks, assignt_Task, changeStatus, delay_dates, get_Note, save_schedule_dates } from 'services/api/afterexams_task';
import { postCallOutCustomer } from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import { getListToStoreAfterExams, getListUserGuidsCRM, getStatisticAllowRangeDate } from 'store/afterexams';
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
const statusGuid = [ 
 
  {
    id:2,
    label: "Mới",
    value: "publish",
  },
  {
    id:3,
    label: "Phân ra",
    value: "",
  },

]
const timeStyle = {
  color: "#666",
  fontSize: "0.95rem",
  marginTop: "18px",
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
const UserGuids: React.FC = () => {
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
  const storageLaunchSourcesGroup = localStorage.getItem('launchSourcesGroups');
  const dataLaunchSource = localStorage.getItem('launchSources');
  const storageLaunchSourcesType = localStorage.getItem('launchSourcesTypes');
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
    const storageUserguidTypes1 = localStorage.getItem("userguid_types");
   const [userguidType1, setListUserguidType1] = useState<any[]>(
      storageUserguidTypes1 ? JSON.parse(storageUserguidTypes1) : []
  );
  const storageUserguidTypes = localStorage.getItem("groupTask");
    const [userguidType, setListUserguidType] = useState<any[]>(
      storageUserguidTypes ? JSON.parse(storageUserguidTypes) : []
    );
    const [formDataGuid, setFormDataGuid] = useState({
        limit: 50,
        page: 1,
        keyword:  "",
        guid_status: statusGuid[0].value || "pending",
        category_id: userguidType[0].id || 0,
      });
    const [dataFilterGPT, setDataFilterGPT] = useState({
        opemnModal: false,
        prompt: '',
    });
  const storageTagsCustomer = localStorage.getItem("tagsCustomer");
    const [stateTagsCustomer, setstateTagsCustomer] = useState<DropdownData[]>(storageTagsCustomer ? JSON.parse(storageTagsCustomer) : []);
      const [conversation, setConversation] = useState<any>({
        category_id: undefined as unknown as DropdownData,
        guid_title: '',
        guid_content: '',
        guid_suggest: '',
        guid_status: '',
        guid_u_id: employeeId,
        tags: [],
      });
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
    const handleGetDataGPT = () => {
      const body = {
        prompt: dataFilterGPT.prompt,
      }
      setLoadingGPT(true);
      postDataGPT(body);
    }
  const [dataGPT, setDataGPT] = useState<any>([]);
    const [isLoadingGPT, setLoadingGPT] = useState(false);
   const listGuid = useAppSelector((state) => state.afterExams.listUserGuids2);
    const loadingListGuid = useAppSelector((state) => state.afterExams.loadingListUserGuids);
  const [dataListGuid, setDataListGuid] = useState(listGuid || []);
    useEffect(() => {
    
      dispatch(getListUserGuidsCRM({
        ...formDataGuid,
    
      }));
    }, []);
   useEffect(() => {
      setDataListGuid(listGuid);
    }, [listGuid]);
    const [isOpenModal, setIsOpenModal] = useState(false);
  const [stateScheduleTypes, setstateScheduleTypes] = useState<DropdownData[]>(schedule_types ? JSON.parse(schedule_types) : []);
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [launchSourcesAfterExams, setLaunchSourcesAfterExams] = useState([{ id: 'all', label: 'Tất cả', value: 'all' }, ...(dataLaunchSource ? JSON.parse(dataLaunchSource || '') : [])]);
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
    key: ''
  });

  const propsData = {
    type: dataFilter?.type || "all",
    employee_id: position === "BOD" ? "all" : employee_Id, // Sửa logic điều kiện ở đây
    status: dataFilter?.status || "new",
    date: dataFilter?.date,
    keyWord: dataFilter.key,
    page: 1,
    limit: 200,
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
                  ...userguidType1
                ]}
  variant="simple"
  isColor
  placeholder="-- Chọn danh mục --"
                    values={formDataGuid.category_id}
                    defaultValue={formDataGuid.category_id} 
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
      title: <Typography content="Ngày thực hiện" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'examming_date',
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
          <Typography content={moment(record).format('DD/MM/YYYY')} modifiers={['13x18', '500', 'center', 'main']} />
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
      isHideRowSelect={false}
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
    const handleGetInfoDG = (data: string) => {
     
      postInfoGuid(data);
    }
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
              )

           }
          tabBottom={(
            <div className='p-after_examination_filter_bottom p-after_examination_filter p-appointment_view_filter' style={{ gap: "10px" }}>
           
               <div style={{minWidth:150}}>
                <Dropdown4
                dropdownOption={[
                  { label: "Tất cả", value: 0 },
                  ...userguidType1
                ]}
  variant="simple"
  isColor
  placeholder="-- Chọn danh mục --"
                    values={formDataGuid.category_id}
                    defaultValue={formDataGuid.category_id} 
  handleSelect={(item: any) => {
    setFormDataGuid({ ...formDataGuid, category_id: item.value });
    dispatch(getListUserGuidsCRM({ ...formDataGuid,category_id:item.value } as unknown as any));
  }}
            />
         </div>
                <div style={{minWidth:150}}>
                <Dropdown4
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
          )}
        />
        <div style={{ width: "100%", padding: "10px 10px" }}>
    
        <PublicTable
      loading={loadingListGuid}
      column={tableListGuid}
      listData={dataListGuid?.data}
      isHideRowSelect
      scroll={{
        x: dataListGuid?.data?.length ? 'max-content' : '100%',
        y: '75vh',
      }}
      size="middle"
      rowkey="lead_id"
      isPagination={false}
      pageSizes={200}
    
     
     
    />
      </div>
      </div>
      {/* Update note */}
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
                                isOpen={openModalGuidDetail}
                                onCancel={() => { setOpenModalGuidDetail(false); }}
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
    </PublicLayout>
  );
};

export default UserGuids;
