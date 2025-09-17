/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-async-promise-executor */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Radio, Space, Spin } from 'antd';
import { exampleDataItemAppointmentView, interactionHistoryType, OptionCustomerTask, optionsLevelNote } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import Dropdown3 from 'components/atoms/Dropdown3';
import Dropdown4 from 'components/atoms/Dropdown4';
import DropdownNote from 'components/atoms/DropdownNote';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import InputA from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import CTabs, { TabItemType } from 'components/molecules/CTabs';
import CustomerInformation from 'components/molecules/CustomerInfomation';
import CustomerInfomation2 from 'components/molecules/CustomerInfomation2';
import FormBookingCustomerSalesOrder from 'components/molecules/FormBookingCustomerSalesOrder';
import MultiSelect from 'components/molecules/MultiSelect';
import PublicTable from 'components/molecules/PublicTable';
import PublicTableListPrice from 'components/molecules/PublicTableListPrice';
import PublicTablePriceQuote from 'components/molecules/PublicTablePriceQuote';
import PublicTablePriceQuoteC from 'components/molecules/PublicTablePriceQuoteC';
import RichTextEditor from 'components/molecules/RichTextEditor';
import CCollapse from 'components/organisms/CCollapse';
import CModal from 'components/organisms/CModal';
import CategoriesCustomer from 'components/organisms/CategoriesCustomer';
import InteractionHistory from 'components/organisms/InteractionHistory';
import InteractionHistory2 from 'components/organisms/InteractionHistory2';
import SurveyQuestionnaire from 'components/organisms/SurveyQuestionnaire';
import DetailResultPhysical from 'components/templates/DetailResultPhysical';
import FamilyMembers from 'components/templates/FamilyMembers';
import ListBooking from 'components/templates/ListBooking';
import ListJobInteractCustomer from 'components/templates/ListJobInteractCustomer';
import OrderList from 'components/templates/OrderList';
import PortraitCustomer from 'components/templates/PortraitCustomer';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ServiceItem } from 'services/api/Example/types';
import { postPrintQuote } from 'services/api/add_price_quote';
import { getDataGPT, getInfoDetailGuid, postNoteLog, postNoteLogC, postUserGuids } from 'services/api/afterexams';
import { postBookCustomerAPI, postNoteByID, postRemovePriceQuote, postSavePriceQuote } from 'services/api/beforeExams';
import { Appointment } from 'services/api/beforeExams/types';
import { getCardSurveyPortrait, getOTPCustomerById } from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import { postAddTaskOfOneCustomer, postAssignTaskAPI, postChangeStatusTaskAPI } from 'services/api/tasks';
import { getAddPriceQuote } from 'store/AddPriceQuote';
import { getListUserGuidsCRM } from 'store/afterexams';
import {
  getInfosCustomerById, getListNotes, getListNotesLog, getSurveyCustomer,
} from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getListTask, getListTaskE } from 'store/tasks';
import mapModifiers, { downloadBlobPDF, getFormattedDate, hanldeConvertListCustomer, removeVietnameseAccents } from 'utils/functions';

import iconsExportFile from "assets/iconButton/icons-export-file.png"
import iconAddTask from "assets/iconButton/icons8-add-note-50.png"
import imgClose from "assets/iconButton/iconsclose.png";
import imgDelete from "assets/iconButton/iconsdelete.png";
import imgSave from "assets/iconButton/iconssave.png";
import logo from 'assets/images/short_logo.svg';
interface DataForm {
  customer_id: string;
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
  const fileFormats = ["pdf", "word", "excel"];
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
export interface DataPrint {
  total_invoice: number;
  insurance_object_ratio: number;
  total: number;
  is_insurance: boolean;
  items: any[]; // hoặc khai báo type chi tiết nếu có
  saleorder_ref: string;
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
const DetailCustomer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { type, info, tab } = useParams();
  const service = localStorage.getItem('services');
  const storageUserguidTypes1 = localStorage.getItem("userguid_types");
   const storageUserguidTypes = localStorage.getItem("groupTask");
  const [userguidType, setListUserguidType] = useState<any[]>(
    storageUserguidTypes ? JSON.parse(storageUserguidTypes) : []
  );
    const [userguidType1, setListUserguidType1] = useState<any[]>(
    storageUserguidTypes1 ? JSON.parse(storageUserguidTypes1) : []
  );
  const infoCustomer = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const isGetCustomerSuccess = useAppSelector((state) => state.infosCustomer.isGetCustomerSuccess);
    const isLoadingRespCustomerInfo = useAppSelector((state) => state.infosCustomer.loadingRespCustomerInfo);
  const isNotFoundCs = useAppSelector((state) => state.infosCustomer.notfound);
  const listNotesCustomer1 = useAppSelector((state) => state.infosCustomer);
  const listNotesCustomer = useAppSelector(
    (state) => state.infosCustomer.noteLog
  );
  const listNotes= useAppSelector((state) => state.infosCustomer.noteList);
   const infoSurvey = useAppSelector((state) => state.infosCustomer.responseSurvey);
  const [listServices] = useState(service ? JSON.parse(service) : '');
  const [listNode, setListNode] = useState(listNotesCustomer);
  const [listNodeLoading, setListNodeLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [indexActive, setIndexActive] = useState('6');

  console.log(infoCustomer)
  const [isCustomerRelate, setIsCustomerRelate] = useState(false);
  const [dataCustomerPortrait, setDataCustomerPortrait] = useState();
  const [listCustomerRelate, setListCustomerRelate] = useState<any[]>([])
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [typeNote, setTypeNote] = useState(interactionHistoryType[0]);
  const employeeId = localStorage.getItem("employee_id");
  const storageTagsCustomer = localStorage.getItem("tagsCustomer");
    const loadingListTask = useAppSelector((state) => state.listTaskReducer.loadingTaskList);
  const [stateTagsCustomer, setstateTagsCustomer] = useState<DropdownData[]>(storageTagsCustomer ? JSON.parse(storageTagsCustomer) : []);
  const storageTouchPointLogType = localStorage.getItem("TouchPointLogType");
  const [listTouchPointLogType, setListTouchPointLogType] = useState<any[]>(
    storageTouchPointLogType ? JSON.parse(storageTouchPointLogType) : []
  );
   const [listPersonA, setListPersonA] = useState<DropdownData[]>(hanldeConvertListCustomer("CSKH"));
   const [stateAssignTask, setStateAssignTask] = useState({
      openModal: false,
      id:  0,
      note: "",
      exec_u_id: undefined as unknown as DropdownData,
   });
    const [isAddTask1, setIsAddTask1] = useState(false);
  useEffect(() => {
      setListNode(listNotesCustomer);
    }, [listNotesCustomer]);
    const [dataLog, setDataLog] = useState({
      node_type: listTouchPointLogType[0],
      note_node_content: "",
      note_attach_url: "",
      customer_id: undefined as unknown as number,
      visit_id: "",
      object_id:""
    })
    const [conversation, setConversation] = useState<any>({
      category_id: undefined as unknown as DropdownData,
      guid_title: '',
      guid_content: '',
      guid_suggest: '',
      guid_status: '',
      guid_u_id: employeeId,
      tags: [],
    });
const [stateEmployeeId, setStateEmployeeId] = useState<any>(
  employeeId ? JSON.parse(employeeId) : ""
);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
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
    const storeListUser = localStorage.getItem("list_users");
   const [listUsers, setListUsers] = useState<DropdownData[]>(
        storeListUser ? JSON.parse(storeListUser) : ""
      );
  const [payment, setPayment] = useState(0);
    const [stateChangeStatusTask, setStateChangeStatusTask] = useState({
      openModal: false,
      id:  0,
      note: "",
      status: OptionCustomerTask[1],
    });
   const [filterTaskAll, setFilterTaskAll] = useState({
    own_u_id: stateEmployeeId,
    status:OptionCustomerTask[0].value || "all",
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, [window.innerWidth]);

  const handleGetPortrait = async () => {
    await getCardSurveyPortraitByCustomer({ customerId: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id, survey_type: infoCustomer?.data?.customer?.portrait_survey_type });
  }
  /// 
const [dataPrint, setDataPrint] = useState<DataPrint | null>(null);

  const [isSelectService, setIsSelectService] = useState(false);
    const storageServicesAllowGroup = localStorage.getItem(
    "listServicesAllowGroup"
  );
   const [listServicesAllowGroup, setListServicesAllowGroup] = useState<any[]>(
      storageServicesAllowGroup ? JSON.parse(storageServicesAllowGroup || "") : []
  );
  const [selectedService, setSelectedService] = useState<DropdownData | undefined>(undefined);
  const [loadingP, setLoadingP] = useState(false)
   const storageGenders = localStorage.getItem("genders");
     const [listGenders, setListGenders] = useState<DropdownData[]>(
        storageGenders ? JSON.parse(storageGenders || "") : []
  );
    const [serviceSelected, setServiceSelected] = useState<ServiceItem[]>([]);
    console.log(serviceSelected)
  const [packageSelected, setPackageSelected] = useState<DropdownData>();
  const storagePackages = localStorage.getItem("packages");
  const [listPackages, setListPackages] = useState<DropdownData[]>(
      storagePackages ? JSON.parse(storagePackages || "") : []
  );
  const [openSelect, setOpenSelect] = useState(true);
  const storagePackageWithItems = localStorage.getItem("packagesItems");
   const [statePackagesWithItem, setstatePackagesWithItem] = useState<any[]>(
      storagePackageWithItems ? JSON.parse(storagePackageWithItems) : []
  );
   const [dataForm, setDataForm] = useState<DataForm>({
     customer_id: infoCustomer?.data?.customer?.customer_id,
     saleorder_ref:"",
      name: infoCustomer?.data?.customer?.customer_fullname,
      isCheckInsurance: false,
      gender: undefined as unknown as DropdownData,
      dayOfBirth:infoCustomer?.data?.customer?.year_of_birth?.toString(),
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

  
   });console.log(dataForm.customer_id)
  useEffect(() => { 
    setDataForm({
      ...dataForm,
      customer_id: infoCustomer?.data?.customer?.customer_id,
      name: infoCustomer?.data?.customer?.customer_fullname,
       dayOfBirth:infoCustomer?.data?.customer?.year_of_birth?.toString()
       
    })
  },[infoCustomer?.data])
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
  const [isSeenPrice,setIsSeenPrice] = useState(false)
    const clearStateErrorForm = (title: string) => {
    setErrorForm({ ...errorForm, [title]: "" });
  };
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
          customer_id: dataForm.customer_id,
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
    (data: any) => postSavePriceQuote(data),
    {
      onSuccess: (data) => {
       setLoadingP(false);
        setIsSelectService(false);
         dispatch(getInfosCustomerById({ type: type, customer_id: info }));
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
  const dataPriceQuote = useAppSelector((state) => state.addPriceQuote.AddPriceQuote);
  const [stateDataPriceQuote, setDataPriceQuote] = useState(dataPriceQuote);
  const [loading, setLoading] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState("pdf");
    const handleRadioChange = (e:any) => {
    setSelectedRadio(e.target.value);
  };
    const { mutate: postPrintResult } = useMutation(
        'post-footer-form',
         (data: any) => postPrintQuote(data),
        {
          onSuccess: (data) => {
            if (data?.status) {
               setLoading(false)
              if (data?.message === "Xuất file báo giá dạng excel!") 
              {
                downloadExcelFromBase64(data.data, `BaogiaDV.xlsx`)
                
              } 
              console.log(123)
              if (data?.message === "Xuất file báo giá dạng pdf!") 
              {
                     console.log(1234)
                downloadBlobPDF(data?.data, `BaogiaDV.pdf`);
              }
              if (data?.message === "Xuất file báo giá dạng word!") 
              {
                downloadWordFromBase64(data?.data, `BaogiaDV.docs`);
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
         dispatch(getInfosCustomerById({ type: type, customer_id: info }));
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
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [listDataServices, setListDataServices] = useState("");
    const [dataSaleOrderRef, setDataSaleOrderRef] = useState("");
  const [isClosePopup, setIsClosePopup] = useState(false);
   const [isUpdateInfo1,setIsUpdateInfo1] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false)
    const { mutate: postBookCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postBookCustomerAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
           dispatch(getInfosCustomerById({ type: type, customer_id: info }));
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
     const [listPerson, setListPerson] = useState<DropdownData[]>();
  const storageEmployeeTeams = localStorage.getItem('employeeTeams');
       const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);
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
  useLayoutEffect(() => {
    console.log(type, info);
    if (listCustomerRelate.length >= 1) return;
    if (type === 'phone') {
      getCustomerByPhones(info);
    }
    if (!_.isEmpty(infoCustomer?.data?.customer?.customer_phone) && type !== 'phone') {
      getCustomerByPhones(infoCustomer?.data?.customer?.customer_phone?.replace('+84-', '0'));
    }
  }, [type, infoCustomer?.data?.customer]);

  useLayoutEffect(() => {
    dispatch(getInfosCustomerById({ type: type, customer_id: info }));
        document.title = 'Thông tin khách hàng | CRM'
  }, []);

  useEffect(() => {
    const currentTab = OptionTab.find((tabinfo) => tabinfo.short === tab)
    if (currentTab) {
      setIndexActive(currentTab.key as any);
    }
    sessionStorage.setItem('indexMenu', '0');
      dispatch(getListNotesLog({
                  node_type: dataAddNote.node_type,
                  id: info
                }));
       dispatch(getListTask({ ...filterTask } as unknown as any));
    dispatch(getListUserGuidsCRM({
      ...formDataGuid,
  
    }));
  }, []);

  useEffect(() => {
    if (isNotFoundCs) {
      if (type === 'phone') {
        navigator(`/customer-not-found/${info}`)
      }
    }
  }, [isNotFoundCs]);

  useEffect(() => {
    if (isGetCustomerSuccess && _.isUndefined(infoCustomer.data)) {
      toast.error('Không tìm thấy thông tin khách hàng');
    }
  }, [isGetCustomerSuccess]);

  const { mutate: postNoteCustomerById } = useMutation(
    'post-footer-form',
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        dispatch(getListNotes({
          customer_id: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id,
          cs_node_type: typeNote?.value,
        }));
        setListNodeLoading(false)
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCustomerByPhones } = useMutation(
    'post-footer-form',
    (data: any) => getCustomerByKey(data),
    {
      onSuccess: (data) => {
        setListCustomerRelate(data);
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCardSurveyPortraitByCustomer } = useMutation(
    'post-footer-form',
    (id: any) => getCardSurveyPortrait(id),
    {
      onSuccess: (data) => {
        setDataCustomerPortrait(data?.data)
        setIndexActive('6');
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
    const [isAddNote, setIsAddNote] = useState(false);
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
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
                    assign_employee_id: formData?.personCharge?.value || formData?.personCharge,
                    exec_employee_id: formData?.personCharge?.value || formData?.personCharge,
                    customer_id: infoCustomer?.data?.customer?.customer_id,
                    task_name: formData?.task_name,
                    task_description: formData?.task_description,
                    note: formData?.note,
                    employee_team_id: formData?.assign.value || null,
                    status: formData?.type?.value,
                    remind_datetime: moment(formData?.remind_datetime).format(
                      "YYYY-MM-DDTHH:mm:ss"
                    ),
            
                    task_id: formData?.id || null,
          };
    await postAddTask(body);

  };
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
                    values={conversation.category_id}
                    defaultValue={conversation.category_id} 
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
  const handleConvertInfoTolistService = (data: any) => {
    const groupedData: any[] = [];

    setPayment(_.sum(data.map((i: any) => i?.service_prices)));

    data?.forEach((item: any, index: any) => {
      const groupOrderNumber = item.service_group_order_number;
      const existingGroup = groupedData.find(
        (group) => group.service_group_order_number === groupOrderNumber
      );

      if (existingGroup) {
        existingGroup.child.push(item);
      } else {
        groupedData.push({
          id_group: index,
          name: item.service_group_name,
          service_group_order_number: groupOrderNumber,
          child: [item],
        });
      }
    });
    return groupedData;
  };
  const handleAddNote = async (data: any) => {
    const body = {
      ...data,
      customer_id: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any,
    };
    setListNodeLoading(true);
    setListNode(undefined as any);
    await postNoteCustomerById(body);
  };

   const ColumnTableDetailService = [
    {
      title: (
        <Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "service_name",
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "600", "justify", "main"]} />
      ),
    },
    {
      title: (
        <Typography content="DVT" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "unit_name",
      width: 60,
      render: (record: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: <Typography content="SL" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "quantity",
      width: 50,
      render: (record: any) => (
        <Typography content={"1"} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: (
        <Typography content="Đơn giá" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      width: 160,
      dataIndex: "service_prices",
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={[
            "12x18",
            "400",
            "center",
            record === "Khách hàng mới" ? "blueNavy" : "jet",
          ]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Thành tiền"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "service_prices",
      width: 130,
      render: (record: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
  ];
    
  const [valueNote, setValueNote] = useState('');
   const [typeNote1, setTypeNote1] = useState<DropdownData>();
      const [isGetOTP, setIsGetOTP] = useState({
        open: false,
        data: ''
      });
    const { mutate: getOTPCUstomer } = useMutation(
      'post-footer-form',
      (data: string) => getOTPCustomerById(data),
      {
        onSuccess: (data) => {
          setIsGetOTP({ ...isGetOTP, open: true, data: data?.data });
        },
        onError: (e) => {
          toast.error('Đã có lỗi xảy ra ...!');
        }
      }
  );
   const [dataFilterGPT, setDataFilterGPT] = useState({
      opemnModal: false,
      prompt: '',
   });
  const [formDataErr, setFormDataErr] = useState({
    name: "",
    group: "",
    deadline: "",
    desc: "",
  });
    const [dataGPT, setDataGPT] = useState<any>([]);
  const [isLoadingGPT, setLoadingGPT] = useState(false);
    const [openModalGuidDetail, setOpenModalGuidDetail] = useState(false);
    const [guidDetail, setGuidDetail] = useState<any>([]);
  const listGuid = useAppSelector((state) => state.afterExams.listUserGuids2);
  const loadingListGuid = useAppSelector((state) => state.afterExams.loadingListUserGuids);
  const [dataListGuid, setDataListGuid] = useState(listGuid || []);
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
  useEffect(() => {
    setDataListGuid(listGuid);
  }, [listGuid]);
    const [formDataGuid, setFormDataGuid] = useState({
      limit: 50,
      page: 1,
      keyword:  "",
      guid_status: statusGuid[0].value || "pending",
      guid_type: userguidType[0].id || 0,
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
   const [dataAddNote, setDataAddNote] = useState({
      openAddNote: false,
      id:  0,
      node_type: "all",
    });
    const { mutate: handlePostLog } = useMutation(
      "post-footer-form",
      (data: any) => postNoteLogC(data),
      {
        onSuccess: (data) => {
          if (data.status) {
            setDataLog({
              node_type: listTouchPointLogType[0],
              note_node_content: "",
              note_attach_url: "",
              customer_id: undefined as unknown as number,
              visit_id: "",
              object_id:""
            })
            dispatch(getListNotesLog({
              node_type: dataAddNote.node_type,
              id: info
            }));
          } 
        },
        onError: (error) => {
          console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
        },
      }
    );
    const [isAddTask, setIsAddTask] = useState(false);
   const [filterTask, setFilterTask] = useState({
      task_type_id: userguidType[0].id || "all",
      status:OptionCustomerTask[0].value || "all",
      id: infoCustomer?.data?.customer?.customer_id,
    });
  //
  useEffect(() => {
    setFilterTask({
      ...filterTask,
      id: infoCustomer?.data?.customer?.customer_id,
    })
  },[infoCustomer])
  console.log(infoCustomer?.data?.customer?.customer_id)
  const listTask = useAppSelector((state) => state.listTaskReducer.taskList);
  const [dataListTask, setDataListTask] = useState(listTask || []);
  useEffect(() => {
    setDataListTask(listTask);
  }, [listTask]);
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
  const OptionTab = [
    {
      key: '1',
      short: 'history-interaction',
      label: stateBreakPoint > 1280 ? 'Lịch sử tương tác' : <CTooltip placements={'right'} title={'Lịch sử tương tác'}> <Icon iconName="interactive" /> </CTooltip>,
      children:  <div style={{ width:"100%", margin: '0 auto' }}>
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
                              cs_node_type: dataLog.node_type.value,
                              cs_node_content: dataLog.note_node_content,
                              note_attach_url: dataLog.note_attach_url,
                              customer_id: info,
                              object_id: null,
                              
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
          </div>,
      onClick: () => { }
    },
    // {
    //   key: '2',
    //   short: 'category',
    //   label: stateBreakPoint > 1280 ? 'Kết quả gần đây' : <CTooltip placements={'right'} title={'Kết quả gần đây'}> <Icon iconName="recent_result" /> </CTooltip>,
    //   children: <CategoriesCustomer id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any} />,
    //   onClick: () => { }
    // },
    //  {
    //   key: '6',
    //   short: 'category',
    //   label: stateBreakPoint > 1280 ? 'Đặt lịch gần nhất' : <CTooltip placements={'right'} title={'Kết quả gần đây'}> <Icon iconName="recent_result" /> </CTooltip>,
    //   children: infoCustomer && memoriesTableSelected,
    //   onClick: () => { }
    // },
  {
    key: '3',
      short: 'diary-medical',
     label: stateBreakPoint > 1280 ? 'Công việc' : <CTooltip placements={'right'} title={'Công việc'}> <Icon iconName="results" /> </CTooltip>,
   children:   <div style={{width:"100%",padding:"10px 10px"}}>
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
                                                 ,...userguidType
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
 </div>,
      onClick: () => { }
 },
         {
        key: '4',
        short: 'guid',
        label: stateBreakPoint > 1280 ? 'Hướng dẫn' : <CTooltip placements={'right'} title={'Hướng dẫn'}> <Icon iconName="results" /> </CTooltip>,
        children:
          <div style={{ width: "100%", padding: "10px 10px" }}>
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
                  ...userguidType1
                ]}
  variant="simple"
  isColor
  placeholder="-- Chọn danh mục --"
                    values={formDataGuid.guid_type}
                    defaultValue={formDataGuid.guid_type} 
  handleSelect={(item: any) => {
    setFormDataGuid({ ...formDataGuid, guid_type: item.value });
    dispatch(getListUserGuidsCRM({ ...formDataGuid,guid_type:item.value } as unknown as any));
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
      </div>,
        onClick: () => {  console.log("click guid") }
      },
    {
      key: '5',
      short: 'booking',
      label: stateBreakPoint > 1280 ? 'Đơn hàng' : <CTooltip placements={'right'} title={'Đơn hàng'}> <Icon iconName="task" /> </CTooltip>,
      children: <>
      {
          <OrderList setDataSaleOrderRef={setDataSaleOrderRef} setIsSelectService={setIsSelectService} ordersList={infoCustomer?.data?.sale_orders} setDataRemove={setDataRemove} setIsUpdateInfo={setIsUpdateInfo}
            setListDataServices={setListDataServices} setServiceSelected={setServiceSelected} setIsSeenPrice={setIsSeenPrice} setDataPrint={setDataPrint} />
      }
      </>,
      onClick: () => { }
    },
 {
      key: '6',
      short: 'booking',
      label: stateBreakPoint > 1280 ? 'Danh sách lịch hẹn' : <CTooltip placements={'right'} title={'DS lịch hẹn'}> <Icon iconName="task" /> </CTooltip>,
      children: <>
      {
       (infoCustomer?.data === undefined ||  infoCustomer?.data?.visits === null) ? <></> :  <ListBooking data={ infoCustomer?.data?.visits} />
      }
      </>,
      onClick: () => { }
    },

    // {
    //   key: '6',
    //   short: 'question',
    //   label: stateBreakPoint > 1280 ? 'Bộ câu hỏi khảo sát' : <CTooltip placements={'right'} title={'Bộ câu hỏi khảo sát'}> <Icon iconName="faqs" /> </CTooltip>,
    //   children: <SurveyQuestionnaire />,
    //   onClick: () => {
    //     if (!infoSurvey.data) {
    //       dispatch(getSurveyCustomer({ customerId: type === 'id' ? info : infoCustomer?.data?.customer?.customer_id, type: infoCustomer?.data?.master?.register_type_id || 'NS' }))
    //     }
    //   }
    // },
    
    // {
    //   key: '7',
    //   short: 'portrait-customer',
    //   label: stateBreakPoint > 1280 ? 'Chân dung khách hàng' : <CTooltip placements={'right'} title={'Chân dung khách hàng'}> <Icon iconName="portrait" /> </CTooltip>,
    //   children: <PortraitCustomer
    //     type={infoCustomer?.data?.customer?.portrait_survey_type}
    //     data={dataCustomerPortrait}
    //     customer_id={type === 'id' ? info : infoCustomer?.data?.customer?.customer_id as any}
    //   />,
    //   onClick: () => {
    //     if (_.isNull(infoCustomer?.data?.master)) {
    //       return toast.info(`Không tìm thấy chân dung khách hàng ${infoCustomer?.data?.customer?.customer_fullname}`);
    //     }
    //     return handleGetPortrait()
    //   }
    // },
    // {
    //   key: '7',
    //   short: 'family-members',
    //   label: stateBreakPoint > 1280 ? 'Thành viên' : <CTooltip placements={'right'} title={'Thành viên gia đình'}> <Icon iconName="task" /> </CTooltip>,
    //   children: <FamilyMembers />,
    //   onClick: () => { }
    // },
  ];
  console.log(isGetCustomerSuccess)
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
        dataIndex: 'service_prices',
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
            <Typography content={record } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
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
            <Typography content={record } modifiers={['13x18', '600', 'center', 'blueNavy']}   styles={{
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
            <Typography content={record } modifiers={['13x18', '600', 'center', 'green']}   styles={{
            display: 'block',     // Đảm bảo hiển thị như block
            wordWrap: "break-word", // Xuống dòng khi quá dài
            whiteSpace: "normal", // Nội dung nhiều dòng
            textAlign:"right"
          }}/>
          </div>
        ),
      },
    
  
  
       
      
      
     
      
    
  ];
  
  const tableAfterExams = useMemo(() => (
     
     
      <PublicTablePriceQuoteC
        listData={serviceSelected}
        // loading={dataPriceQuoteLoading}
        column={ColumnTable }
        rowkey="customer_id"
        size="small"
        isHideRowSelect={true}
        isNormal
        scroll={{ x: 'max-content', y: '510px' }}
        // handleChangePagination={(page: any, pageSize: any) => {
        //   handleChangePagination(page, pageSize);
        // }}
        // listDataT={stateDataPriceQuote.data}
      
        // totalItem={
        //     (listAfterExamsTask?.status &&
        //       listAfterExamsTask?.data?.paging?.total_count) ||
        //     0
        //   }
      />
    ), [serviceSelected]);
  return (
    <PublicLayout >
    
        <Spin
              spinning={isLoadingRespCustomerInfo}
              size="large"
              indicator={
               <div  className={mapModifiers(
                            "orange-hover-effect",
                            isLoadingRespCustomerInfo && "pendding"
                        )}><Icon iconName={"loading_crm"} isPointer style={{position:"absolute",top:"50%",insetInlineStart:"50%"}}/></div> 
              } >  <div className={mapModifiers("p-detail_customer", stateBreakPoint < 1280 && 'tablet')} style={{ display: 'flex',width:"calc(100% - 0px)",flexDirection:"column" }}>
      
        <div className="p-detail_customer_left" style={{width:"100%",height:"34%"}}>
          <CustomerInfomation2 handleAddNote={(data: any) => handleAddNote(data)} dataCustomerPortrait={dataCustomerPortrait} typeNoteCs={typeNote.value} type={type} info={info} />
        </div>
        <div className="p-detail_customer_right" style={{height:"calc(100vh - 185px)"}}>
          <CTabs
            options={OptionTab as unknown as TabItemType[]}
            defaultActiveKey={indexActive}
            position={"top"}
            handleOnTabClick={(data: any) => {
              return new Promise((resolve, reject) => {
                console.log("🚀 ~ returnnewPromise ~ data?.short:", data)
                try {
                  data?.onClick();
               
                  Cookies.set('tabName', data?.short);
                  setIndexActive(data?.id);
                  window.history.pushState(null, `${type}/customer-info/${type === 'id' ? info : infoCustomer?.data?.customer?.customer_id}/`, `${data?.short}`);
                  resolve(true);
                } catch (error) {
                  reject(error);
                }
              })
            }}
          />
        </div>
        </div></Spin>
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
                      placeholder="-- Chọn nhóm việc --"
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
       <CModal
                    isOpen={isSeenPrice}
        onCancel={() => {
        setIsSeenPrice(false)  
        }}
                    title={''}
                    widths={900}
                    zIndex={100}
                    onOk={handleRemoveQuoteCustomer}
                    textCancel='Hủy'
                    textOK='Xác nhận'
                    className='t-support_libraries_modal'
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center", marginTop:"10px"}}>
          <p style={{
  fontSize: "14px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "5px",fontWeight: 600
}}>
Bảng báo giá dịch vụ
 
          </p> 
            <div style={{marginTop:"5px",display:"flex", alignItems:"center", gap:"20px",borderRadius:"8px"}}>
                  {
                 
                      
                      
                          <div
                          className={mapModifiers(
                            "m-form_add_customer_check_insurance_btn",
                            loading && "pendding"
                        )}
                        
                          onClick={() => {
                          setLoading(true)
                          const data = {
                            filetype: selectedRadio,
                            data: {
                              total_services: dataPrint?.total_invoice,
                              insurance_object_ratio: dataPrint?.insurance_object_ratio,
                              total: dataPrint?.total,
                              total_invoice: 0,
                              discount: 0,
                              fullname: infoCustomer?.data?.customer?.customer_fullname,
                              gender: infoCustomer?.data?.customer?.gender.name,
                              is_insurance: dataPrint?.is_insurance,
                              items: dataPrint?.items,
                              saleorder_ref: dataPrint?.saleorder_ref,
                              yob: infoCustomer?.data?.customer?.year_of_birth.toString()
                            }
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
                
                   
       
                 
                }
                     {
                   
                         <Radio.Group onChange={handleRadioChange} value={selectedRadio} style={{border:"1px solid #e3e1e1", padding:"5px 10px", borderRadius:"10px"}}>
        <Space direction="horizontal">
          {fileFormats.map((format) => (
            <Radio key={format} value={format} style={{textTransform:"uppercase"}}>
              {format}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
                 
                }
             
                </div>
        </div>
                 {tableAfterExams}
      </CModal >
      {isUpdateInfo &&
              <FormBookingCustomerSalesOrder
                isOpenPopup={isUpdateInfo}
                positionDrawer='right'
                handleClosePopup={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
                valUpdate={infoCustomer?.data}
                isUpdate
                dataCustomerPortrait={dataCustomerPortrait}
                isClose={isClosePopup}
                handleClose={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
                handleAddCustomer={(data: any) => handleBookingCustomer(data)}
                isHigh
              isUsedDrawer={false}
              isLoadingB={isLoadingB}
        handleLoading={setIsLoadingB}
        listDataServices={listDataServices}
        dataSaleOrderRef={dataSaleOrderRef}
              />
            }
    </PublicLayout>
  );
};

export default DetailCustomer;
