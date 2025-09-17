/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import { Popover, Spin, message } from 'antd';
import { Input } from "antd";
import {Radio, Space } from "antd";
import { OptionStatusAfterExams } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import Dropdown3 from 'components/atoms/Dropdown3';
import { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import InputA from 'components/atoms/Input';
import InputHo from 'components/atoms/InputHo';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import MultiSelect from 'components/molecules/MultiSelect';
import PublicTable from 'components/molecules/PublicTable';
import PublicTableListPrice from 'components/molecules/PublicTableListPrice';
import PublicTablePriceQuote from 'components/molecules/PublicTablePriceQuote';
import CCollapse from 'components/organisms/CCollapse';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import { useSip } from 'components/templates/SipProvider';
import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ServiceItem } from 'services/api/Example/types';
import { postPrintQuote } from 'services/api/add_price_quote';
import { postStagesByIdAfterExams, SaveQuickNoteAfterExams } from 'services/api/afterexams';
import { ItemListAfterExams, RequestListAfterExams } from 'services/api/afterexams/types';
import { add_Note, AddTasks, assignt_Task, changeStatus, delay_dates, get_Note, save_schedule_dates } from 'services/api/afterexams_task';
import { postCallOutCustomer } from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import { getAddPriceQuote1 } from 'store/AddPriceQuote';
import { getListToStoreAfterExams, getStatisticAllowRangeDate } from 'store/afterexams';
import { getListAfterExamTaskMaster } from 'store/afterexams_task';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { downloadBlobPDF, getFormattedDate, removeVietnameseAccents } from 'utils/functions';
import { optionStateTypeAfterTask, optionStateStatusAfterTask ,optionStateStatusAfterTask2} from 'utils/staticState';

import iconUTG from "assets/iconButton/icon-calendar-g.png"
import iconUT from "assets/iconButton/icon-calendar-gr.png"
import iconRSG from "assets/iconButton/icon-reschedule-gray.png"
import iconRSR from "assets/iconButton/icon-reschedule-red.png"
import iconsExportFile from "assets/iconButton/icons-export-file.png"
import iconAddNote from "assets/iconButton/icons-write-2.png"
import iconAddTask from "assets/iconButton/icons8-add-note-50.png"
import imgClose from "assets/iconButton/iconsclose.png";
import imgDelete from "assets/iconButton/iconsdelete.png";
import imgSave from "assets/iconButton/iconssave.png";
import iconChangeU from "assets/icons/iconChangeUser.png"
import logo from 'assets/images/short_logo.svg';
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
// Định nghĩa kiểu dữ liệu cho dịch vụ

interface GroupRadioType1  {
  color: string,
        department_id: string,
        id: string,
        index: 3,
        is_exams: false,
        is_register_package: false,
        is_register_subclinical: true,
        label: string,
        register_type_id: string,
        value: string,
}
// Định nghĩa kiểu dữ liệu cho dataForm
interface DataForm {
  name: string;
  dayOfBirth: string; // Năm sinh (không bắt buộc)
  gender: {
  label: string;
  value: string;
} // Giới tính (bắt buộc)
  isCheckInsurance: boolean;
  insuranceObjectRatio: string;
  discount: number;
  services: ServiceItem[]; // Mảng chứa danh sách dịch vụ
  typeBooking: GroupRadioType
}
const downloadExcelFromBase64 = (base64Data:any, fileName:any) => {
    // Chuyển đổi base64 sang Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Tạo đường dẫn URL và kích hoạt tải xuống
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Dọn dẹp sau khi tải xong
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
const downloadWordFromBase64 = (base64Data:any, fileName:any) => {
    // Chuyển đổi base64 sang Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

    // Tạo URL và tải xuống
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Dọn dẹp
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const ListPrice: React.FC = () => {
  const dispatch = useAppDispatch();
  /*  */
  const { makeCall } = useSip();

  const dataStatisticAfterExams = useAppSelector((state) => state.afterExams.afterExamsStatistic);
  const dataStateAfterExams = useAppSelector((state) => state.afterExams.stateAfterExams);
  const dataListAfterExams = useAppSelector((state) => state.afterExams.dataList);
  const storeisLoadingAferExams = useAppSelector((state) => state.afterExams.isLoadingAfterExam);

  const dataListAfterExamTask = useAppSelector((state) => state.afterexamtask.afterExamsStatistic);
  const dataPriceQuote = useAppSelector((state) => state.addPriceQuote.AddPriceQuote);
  const dataPriceQuoteLoading = useAppSelector((state) => state.addPriceQuote.loadingAddPriceQuote);
  const storeisLoadingAferExamsTask = useAppSelector((state) => state.afterexamtask.isLoadingAfterExamTask);
  const [listAfterExamsTask, setListAfterExamsTask] = useState(dataListAfterExamTask);
  const [stateDataPriceQuote, setDataPriceQuote] = useState(dataPriceQuote);
  console.log(stateDataPriceQuote)
  const [stateDataPriceQuoteLoading, setDataPriceQuoteLoading] = useState(dataPriceQuoteLoading);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState("pdf");

  const fileFormats = ["pdf", "word", "excel"];

  const handleCheckboxChange = (checkedValues:any) => {
    setSelectedCheckboxes(checkedValues);
  };

  const handleRadioChange = (e:any) => {
    setSelectedRadio(e.target.value);
  };
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
  const [loadingP,setLoadingP] = useState(false)
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
    useEffect(() => {
    setDataPriceQuote(dataPriceQuote)
    }, [dataPriceQuote])
   useEffect(() => {
     if (dataPriceQuote.status) {
          // clearStateForm()
          //           setServiceSelected([]);
                  
       setIsSelectService(false);
       setLoadingP(false)
      }
  }, [dataPriceQuote])
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
  // State and function Add Service Quote
  const [isSelectService, setIsSelectService] = useState(false);
  const storageServicesAllowGroup = localStorage.getItem(
    "listServicesAllowGroup"
  );
   const storagePackages = localStorage.getItem("packages");
  const storagePackageItems = localStorage.getItem("packagesItems");
  const storageDoctoronline = localStorage.getItem("doctorOnline");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageAppointmentTypes = localStorage.getItem("appointment_types");
  const storageVoucherTypes = localStorage.getItem("voucher_types");
  const storagePackageWithItems = localStorage.getItem("packagesItems");
   const storageGenders = localStorage.getItem("genders");
   const [listGenders, setListGenders] = useState<DropdownData[]>(
      storageGenders ? JSON.parse(storageGenders || "") : []
    );
  useEffect(() => { 
    setTimeout(() => {setIsSelectService(true); }, 1000);
 
  },[])
    const [statePackagesWithItem, setstatePackagesWithItem] = useState<any[]>(
      storagePackageWithItems ? JSON.parse(storagePackageWithItems) : []
    );
    const [listServicesAllowGroup, setListServicesAllowGroup] = useState<any[]>(
      storageServicesAllowGroup ? JSON.parse(storageServicesAllowGroup || "") : []
  );
      const [openSelect, setOpenSelect] = useState(true);
   const [listPackages, setListPackages] = useState<DropdownData[]>(
      storagePackages ? JSON.parse(storagePackages || "") : []
    );
   const [dataForm, setDataForm] = useState<DataForm>({

      name: "",
      isCheckInsurance: false,
      gender: undefined as unknown as DropdownData,
      dayOfBirth: "",
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
    const clearStateErrorForm = (title: string) => {
    setErrorForm({ ...errorForm, [title]: "" });
  };
  const [serviceSelected, setServiceSelected] = useState<ServiceItem[]>([]);
  const [packageSelected, setPackageSelected] = useState<DropdownData>();
   const [editing, setEditing] = useState(false);
  const handleBlur = () => setEditing(false);
    const [isDelete,setIsDelete] = useState(false)
//   const handleConvertServiceSelected = (service: ServiceItemBG, checked: boolean) => {
//   // Thêm trường `discount: 0` vào `service`
//   const updatedService = { ...service, discount: 0 };

//     console.log(updatedService)

//   if (checked) {
//     setServiceSelected([updatedService, ...serviceSelected]);
//   } else {
//     const newList = serviceSelected.filter((i) => i.service_id !== updatedService.service_id);
//     setServiceSelected(newList);
//   }
// };
    const [selectedService, setSelectedService] = useState<DropdownData | undefined>(undefined);

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
    const [totalService, setTotalService] = useState("Chưa chọn dịch vụ");
  const convertServiceSelected: any[] = [];
    const convertServiceSelected2: any[] = [];
  const handleUpdateDiscount = (service: any) => {
  setServiceSelected((prev) => {
    return prev.map((item) =>
      item.service_id === service.service_id ? { ...item, discount: 10 } : item
    );
  });
};
    useLayoutEffect(() => {
         document.title = 'Báo giá dịch vụ | CRM'
    }, []);
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
  const[loading,setLoading] = useState(false)
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
    }, [serviceSelected,dataForm]);
    const { mutate: postPrintResult } = useMutation(
      'post-footer-form',
       (data: any) => postPrintQuote(data),
      {
        onSuccess: (data) => {
          if (data?.status) {
             setLoading(false)
            if (data?.message === "Xuất file báo giá dạng excel!") 
            {
              downloadExcelFromBase64(data.data, `BaogiaDV_${removeVietnameseAccents(stateDataPriceQuote.data.fullname)}_${getFormattedDate()}.xlsx`)
              
            } 
            if (data?.message === "Xuất file báo giá dạng pdf!") 
            {
              downloadBlobPDF(data?.data, `BaogiaDV_${removeVietnameseAccents(stateDataPriceQuote.data.fullname)}_${getFormattedDate()}.pdf`);
            }
            if (data?.message === "Xuất file báo giá dạng word!") 
            {
              downloadWordFromBase64(data?.data, `BaogiaDV_${removeVietnameseAccents(stateDataPriceQuote.data.fullname)}_${getFormattedDate()}.docs`);
            }
          } else {
            // setError(data?.message);
            // setIsPrintOption(false);
          }
        },
        onError: (error) => {
        //  setIsPrintOption(false);
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
    );
  
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
      title: <Typography content="Tên dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "left", marginLeft: "16px" }} />,
      dataIndex: 'service_name',
     width: 250,
      className: "ant-table-column_wrap",
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
        modifiers={['13x18', '600', 'left', 'main']}
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
      title: <Typography content="Nhóm dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_group_name',
      align: 'center',
      className: "ant-table-column_wrap",
      width: 150,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={record} modifiers={['13x18', '500', 'center', 'main']} />
          </div>
        </div>
      ),
      
    },
     {
      title: <Typography content="ĐVT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'unit_name',
      align: 'center',
      width: 90,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <Typography content={record.toString()} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
      ),
    },
     {
      title: <Typography content="Số lượng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'quantity',
      align: 'center',
      width: 90,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <Typography content={record.toString()} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
      ),
    },
   
    {
      title: <Typography content="Giá dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right", marginRight: "16px" }} />,
      dataIndex: 'prices',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record.toLocaleString("vn-VN") } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
    },
     
          {
      title: <Typography content="Thành tiền" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right",  marginRight: "16px" }} />,
      dataIndex: 'total',
      width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record.toLocaleString("vn-VN") } modifiers={['13x18', '600', 'center', 'green']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
    },
  


     
    
    
   
    
  
  ];
   const ColumnTableIS = [
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
      title: <Typography content="Tên dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "left", marginLeft: "16px" }} />,
       dataIndex: 'service_name',
      
     width: 250,
      className: "ant-table-column_wrap",
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
        modifiers={['13x18', '600', 'left', 'main']}
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
      title: <Typography content="Nhóm dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'service_group_name',
      align: 'center',
      className: "ant-table-column_wrap",
      width: 150,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            <Typography content={record} modifiers={['13x18', '500', 'center', 'main']} />
          </div>
        </div>
      ),
      
     },
     {
      title: <Typography content="BHYT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'is_insurance',
      align: 'center',
      className: "ant-table-column_wrap",
      width: 150,
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column', gap: 2 }}>
            {record === true ? <input type="checkbox" checked id="readonlyCheckbox"/> :<input type="checkbox" id="readonlyCheckbox"/>}
          </div>
        </div>
      ),
      
     },
       {
      title: <Typography content="ĐVT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'unit_name',
      align: 'center',
      width: 60,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <Typography content={record.toString()} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
      ),
    },
     {
      title: <Typography content="Số lượng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'quantity',
      align: 'center',
      width: 90,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" >
          <Typography content={record.toString()} modifiers={['13x18', '500', 'center', 'main']} />
        </div>
      ),
    },
 
    {
      title: <Typography content="Giá dịch vụ" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right", marginRight: "16px" }} />,
      dataIndex: 'prices',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record.toLocaleString("vn-VN") } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
     },
    
       {
      title: <Typography content="Giá BHYT" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right", marginRight: "16px" }} />,
      dataIndex: 'insurance_prices',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px",backgroundColor:"#f0f0f0"
      }}
        >
          <Typography content={record !== 0 ? record.toLocaleString("vn-VN") : "-"} modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
     },
      {
      title: <Typography content="Mức hưởng BHYT" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "center",  }} />,
      dataIndex: 'insurance_object_ratio',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "center",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px",backgroundColor:"#f0f0f0"
      }}
        >
          <Typography content={record !== 0 ? record.toLocaleString("vn-VN") + "%" : "-" } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
     },
      {
      title: <Typography content="Thành tiền DV" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right", marginRight: "16px" }} />,
      dataIndex: 'total_services',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record.toLocaleString("vn-VN") } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
     },
     {
      title: <Typography content="BHYT trả" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right", marginRight: "16px" }} />,
      dataIndex: 'total_insurances',
     width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px",backgroundColor:"#f0f0f0"
      }}
        >
          <Typography content={record !== 0 ?record.toLocaleString("vn-VN")  : "-"} modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
      ),
    },
    
          {
      title: <Typography content="Khách hàng trả" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{ textAlign: "right",  marginRight: "16px" }} />,
      dataIndex: 'total',
      width: 110,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" 
             style={{
        justifyContent: "end",
        wordWrap: "break-word", // Cho phép xuống dòng
        whiteSpace: "normal",  // Đảm bảo nội dung hiển thị nhiều dòng
        overflow: "hidden",    // Xử lý tràn nếu cần
        maxWidth:"250px"
      }}
        >
          <Typography content={record.toLocaleString("vn-VN") } modifiers={['13x18', '600', 'center', 'green']}   styles={{
          display: 'block',     // Đảm bảo hiển thị như block
          wordWrap: "break-word", // Xuống dòng khi quá dài
          whiteSpace: "normal", // Nội dung nhiều dòng
          textAlign:"right"
        }}/>
        </div>
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
      tabBottom={(
       <div className={mapModifiers('p-after_examination_total')} style={{gap:"30px"}}>
           <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px"
}}>
Họ tên KH:
  <span style={{
  fontWeight: 600}}>{stateDataPriceQuote.data.fullname}</span>
</p>
           
             <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px"
}}>
Giới tính:
  <span style={{
  fontWeight: 600}}>{stateDataPriceQuote.data.gender}</span>
</p> 
          {
            stateDataPriceQuote.data.yob !== null && (
               <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px"
}}>
Năm sinh:
  <span style={{
  fontWeight: 600}}>{stateDataPriceQuote.data.yob}</span>
</p>
            )
          }
        
        
          
      </div>
      )}
          tabBottomRight={
            (
                <div className={mapModifiers('p-after_examination_total')} style={{gap:"30px"}}>
          
           
        
         {
            stateDataPriceQuote.data.is_insurance !== false ? (   <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px",fontWeight: 600
}}>
Bảng báo giá dịch vụ có áp dụng BHYT

          </p>  ) : (   <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px",fontWeight: 600
}}>
Bảng báo giá dịch vụ
 
          </p>  )}
          
      </div>
              )

           }
        
        />
     
  ), [dataPriceQuote,stateDataPriceQuote])
  const tableAfterExams = useMemo(() => (
   
   
    <PublicTablePriceQuote
      listData={stateDataPriceQuote.data.items}
      loading={dataPriceQuoteLoading}
      column={stateDataPriceQuote.data.is_insurance === true ? ColumnTableIS : ColumnTable }
      rowkey="customer_id"
      size="small"
      isHideRowSelect={true}
      isNormal
      scroll={{ x: 'max-content', y: '510px' }}
      handleChangePagination={(page: any, pageSize: any) => {
        handleChangePagination(page, pageSize);
      }}
      listDataT={stateDataPriceQuote.data}
     //   handleChangePagination={(page: any, pageSize: any) => { }}
      // totalItem={listAfterExams?.status ? listAfterExams?.data?.paging?.total_count : 0}
      totalItem={
          (listAfterExamsTask?.status &&
            listAfterExamsTask?.data?.paging?.total_count) ||
          0
        }
    />
  ), [stateDataPriceQuote.data,dataPriceQuote,dataPriceQuoteLoading]);
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
        name: !dataForm.name.trim() ? "Tên khách hàng là bắt buộc" : "",
        gender: !dataForm.gender || !dataForm.gender.value.trim()
          ? "Giới tính khách hàng là bắt buộc"
          : "",
      });

      return false;
    }
    return true;
  } catch (err) {
    console.error(" 🚀- DaiNQ - 🚀: -> handleValidateForm -> err:", err);
  }
  };
  //  const { mutate: postChangePassword } = useMutation(
  //     'post-footer-form',
  //     (data: any) => getAddPriceQuote(data),
  //     {
  //       onSuccess: (data) => {
  //         if (data?.status) {
  //           // toast.info(data?.message);
  //           // setDataChangePassword('');
  //           // localStorage.clear();
  //           // sessionStorage.clear();
  //           // navigator('/login');
  //         } else {
  //           toast.error(data?.message);
  //         }
  //       },
  //       onError: (error) => {
  //         console.error('🚀: error --> getCustomerByCustomerId:', error);
  //       },
  //     },
  //   );
    const clearStateForm = () => {
      setDataForm({
      name: "",
      isCheckInsurance: false,
      gender: undefined as unknown as DropdownData,
      dayOfBirth: "",
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
        yob: dataForm.dayOfBirth,
        gender: dataForm?.gender?.label || '',
        is_insurance: dataForm.isCheckInsurance,
        insurance_object_ratio:  dataForm.isCheckInsurance === true ? parseInt(dataForm.insuranceObjectRatio.toString(), 10) : 0,
        discount:  parseInt(dataForm.discount.toString(), 10) ,
        services: serviceSelected.map((item) => {
          return { service_id: item.service_id,quantity:1,discount:item.discount }
      })
     };
     
     dispatch(getAddPriceQuote1(request as any))
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
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div className={mapModifiers('p-after_examination_total_header')} style={{borderRadius:"4px", marginTop: "8px", display: "flex", alignItems: "center", background: "#0489dc", cursor: "pointer",boxShadow:"none" }} onClick={() => {
                  setIsSelectService(true);
                }}
                >
                   <img src={iconAddTask} alt="" style={{width:"20px",height:"20px", marginRight:"3px"}}/> 
                  <div style={{color:"white", marginLeft:"5px"}}>Chọn báo giá</div>
            
          </div>
                <div style={{marginTop:"5px",display:"flex", alignItems:"center", gap:"20px",borderRadius:"8px"}}>
                  {
                    stateDataPriceQuote.status === true && (
                      
                      
                          <div
                          className={mapModifiers(
                            "m-form_add_customer_check_insurance_btn",
                            loading && "pendding"
                        )}
                        
                          onClick={() => {
                          setLoading(true)
                          const data = {
                            filetype: selectedRadio,
                            data: stateDataPriceQuote.data
                           }
                          postPrintResult(data)
                   }}
                          style={{ marginTop: "4px", marginLeft: "20px" ,background:"#4caf50"}}
                        >
                          {loading ? (
                            <Icon iconName={"loading_crm"} isPointer />
                          ) : (
                         <div style={{display:"flex", alignItems:"center"}}>  <img src={iconsExportFile} alt="" style={{ width: "20px", height: "20px", marginRight: "3px" }} /><p style={{color:"white"}}>Xuất file</p> </div> 
                          )}
                        </div>
                
                   
       
                    )
                }
                     {
                    stateDataPriceQuote.status === true && (
                         <Radio.Group onChange={handleRadioChange} value={selectedRadio} style={{border:"1px solid #e3e1e1", padding:"5px 10px", borderRadius:"10px"}}>
        <Space direction="horizontal">
          {fileFormats.map((format) => (
            <Radio key={format} value={format} style={{textTransform:"uppercase"}}>
              {format}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
                    )
                }
             
                </div>
              
              </div>
              )

           }
        
        />
        {
          stateDataPriceQuote.status === true && (
            <div className="p-after_examination_statistic">
          {statisticHeader}
        </div>
          )
        }
        
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
          
                    <InputA
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
           <InputA
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
                  <Typography content="Chọn báo giá" modifiers={["400"]} />
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
    </PublicLayout>
  );
};

export default ListPrice;
