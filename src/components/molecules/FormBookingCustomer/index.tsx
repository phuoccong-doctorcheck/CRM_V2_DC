/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import {
  OptionBH,
  optionBooking12,
  OptionCountry,
  OptionCustomerPortrait1,
  OptionCustomerPortraitAddNew,
  OptionCustomerPortraitDigestiveExamination2,
  OptionCustomerPortraitDigestiveExamination_noisoi1,
  OptionGroupCheckbox,
  OptionGroupCheckboxTypedigestiveExamination,
  OptionPackage,
  OptionPostion,
  optionTyeAddCustomerRadio,
  OptionYesNo,
} from "assets/data";
import "jspdf-autotable";
import AddressDropdown, { AddressData } from "components/atoms/AddressDropdown";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CTooltip from "components/atoms/CTooltip";
import Checkbox from "components/atoms/Checkbox";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupCheckBox from "components/atoms/GroupCheckBox";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import InputDateOfBirth from "components/atoms/InputDateOfBirth";
import Loading from "components/atoms/Loading";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import CCollapse from "components/organisms/CCollapse";
import CDrawer, { PlacementsDrawer } from "components/organisms/CDrawer";
import CModal from "components/organisms/CModal";
import dayjs, { Dayjs } from "dayjs";
import _, { isEmpty, isUndefined } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { postCheckInsurance } from "services/api/customerInfo";
import {
  getCustomerByKey,
  getCustomerWhenCallIn,
  getDistrictsAPIs,
  getListSourceCustomer,
  getLS,
  getProvinceAPIs,
  getWardsAPIs,
} from "services/api/dashboard";
import { getGroupSurveyPortrait } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, { parseCustomerPortrait } from "utils/functions";
import { ServiceItem } from "services/api/Example/types";
import imgAdd from "assets/iconButton/iconsadd.png";
import imgDelete from "assets/iconButton/iconsdelete.png";
import imgSave from "assets/iconButton/iconssave.png";
import imgClose from "assets/iconButton/iconsclose.png";
import PublicTable from "../PublicTable";

import "moment/locale/vi";
import "dayjs/locale/vi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import iconSuccess from "assets/icons/icons8-success.svg";
import Input2 from "components/atoms/Input2";
import InputDateOfBirth2 from "components/atoms/InputDateOfBirth2";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import Dropdown3 from "components/atoms/Dropdown3";
import Cookies from "js-cookie";
dayjs.locale("vi");

type IconTypes = "success" | "info" | "error" | "warning";

interface FormAddCustomerProps {
  handleClose?: () => void;
  handleAddCustomer?: (data: any) => void;
  valUpdate?: any;
  isUpdate?: boolean;
  csPortrait?: boolean;
  isHigh?: boolean;
  isClose?: boolean;
  dateBookingSchedule?: Date;
  customerPhoneNotFound?: string;
  dataCustomerPortrait?: any;
  isOpenPopup?: boolean;
  handleClosePopup?: () => void;
  positionDrawer?: PlacementsDrawer;
  titleCustomize?: React.ReactNode;
  noOverLay?: boolean;
  isUsedDrawer?: boolean;
  isLoadingB?: boolean;
  handleLoading?: any;
}
const Notification: React.FC<{
  message: string;
  name: JSX.Element;
  male: JSX.Element;
  age: JSX.Element;
  id: string;
  position: "topRight" | "topLeft";
  duration: number;
}> = ({ message, name, male, age, id, position, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  // Xử lý style cho các vị trí thông báo (topRight, topLeft)
  const notificationStyle = {
    position: "fixed",
    top: "20px",
    [position === "topRight" ? "right" : "left"]: "20px",
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "450px",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    cursor: "pointer",
  } as React.CSSProperties;

  const titleStyle = {
    fontWeight: 600,
    textTransform: "capitalize",
    color: "red",
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties;

  return (
    <div style={notificationStyle}>
      <div style={titleStyle}>
        <img src={iconSuccess} alt="" style={{ width: "30px" }} />{" "}
        <p style={{ fontSize: "16px", marginLeft: "5px" }}>{message}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontSize: "15px" }}>
        Khách hàng:{" "}
        <div style={{ display: "flex", marginLeft: "8px" }}>
          {name} {male} {age}
        </div>
      </div>
      <div
        onClick={() => {
          if (id?.trim()) {
            window.open(
              `/customer-info/id/${id}/history-interaction`,
              "_blank"
            );
          } else {
            return;
          }
        }}
      >
        {" "}
        <Typography
          modifiers={["13x18", "400", "orange"]}
          content="Click để vào chi tiết khách hàng"
        ></Typography>
      </div>
    </div>
  );
};
function getServiceIds(servicePackageId: any, listPackageItems: any) {
  // Tìm kiếm object có package_id trùng với servicePackageId

  const selectedPackage = listPackageItems.find(
    (item: any) => item.package_id === servicePackageId
  );

  // Nếu tìm thấy object phù hợp thì trả về mảng service_id, ngược lại trả về mảng rỗng
  if (selectedPackage && Array.isArray(selectedPackage.items)) {
    // Tạo mảng service_id và nối chúng thành chuỗi phân tách bằng dấu phẩy
  
    return selectedPackage.items
      .map((service: any) => service.service_id)
      .join(",");
  } else {
    return "";
  }
}
function getServiceIds2(servicePackageId: any, listPackageItems: any) {
  // Tìm kiếm object có package_id trùng với servicePackageId

  const totalServicePrices = listPackageItems.reduce((total: any, pkg: any) => {
    const matchedServices = servicePackageId.filter(
      (service: any) => service.package_id === pkg.package_id
    );

    const packageTotal = matchedServices.reduce(
      (sum: any, service: any) => sum + service.service_prices,
      0
    );
    return total + packageTotal;
  }, 0);
  return totalServicePrices;
}

interface Cell {
  content: string;
  colSpan?: any;
  styles?: {
    cellPadding?: any;
    fontSize?: any;
    textColor?: [any, any, any];
    fillColor?: [any, any, any];
    halign?: "left" | "center" | "right";
  };
}

// Define the type for table rows
type Row = Cell[];

// Define the type for service group item
interface ServiceGroupItem {
  service_id: string;
  service_name: string;
}

// Define the type for service group
interface ServiceGroup {
  service_group_id: string;
  service_group_name: string;
  service_group_item: ServiceGroupItem[];
}
const removeParenthesesContent = (str: string | null | undefined): string => {
  if (str === null || str === undefined) {
    return ""; // Trả về chuỗi rỗng nếu input không hợp lệ
  }

  return str.replace(/\(.*\)/, "").trim();
};
const FormBookingCustomer: React.FC<FormAddCustomerProps> = ({
  handleClose,
  handleAddCustomer,
  valUpdate,
  isUpdate,
  customerPhoneNotFound,
  csPortrait = false,
  isHigh,
  isClose,
  isUsedDrawer,
  dateBookingSchedule,
  dataCustomerPortrait,
  isOpenPopup,
  titleCustomize,
  handleClosePopup,
  positionDrawer,
  noOverLay,
  isLoadingB,
  handleLoading
}) => {
  moment.locale("vi");
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();
  console.log(valUpdate)
  const dataSurveyPortrait = useAppSelector(
    (state) => state.infosCustomer.respSurveyPortrait
  );
  const [totalService, setTotalService] = useState("Chưa chọn dịch vụ");
  const storageNation = localStorage.getItem("nations");
  const storageAffiliates = localStorage.getItem("affiliates");
  const storageGenders = localStorage.getItem("genders");
  const storageCareers = localStorage.getItem("careers");
  const storagePackages = localStorage.getItem("packages");
  const storagePackageItems = localStorage.getItem("packagesItems");
  const storageDoctoronline = localStorage.getItem("doctorOnline");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const storageAppointmentTypes = localStorage.getItem("appointment_types");
  const storageVoucherTypes = localStorage.getItem("voucher_types");
  const storageEndoscopics = localStorage.getItem("endoscopics");
  const storageNewFType = localStorage.getItem("newFType");
  const storageServicesAllowGroup = localStorage.getItem(
    "listServicesAllowGroup"
  );
    const storageListStaff = localStorage.getItem("listStaff");
  const storagePackageWithItems = localStorage.getItem("packagesItems");

  const [statePackagesWithItem, setstatePackagesWithItem] = useState<any[]>(
    storagePackageWithItems ? JSON.parse(storagePackageWithItems) : []
  );
  const [stateEndoscopics, setstateEndoscopics] = useState<DropdownData[]>(
    storageEndoscopics ? JSON.parse(storageEndoscopics) : []
  );
  const [stateNewFType, setStateNewFType] = useState<DropdownData[]>(
    storageNewFType ? JSON.parse(storageNewFType) : []
  );
  const [stateAppointmentTypes, setstateAppointmentTypes] = useState<
    GroupRadioType[]
    >(storageAppointmentTypes ? JSON.parse(storageAppointmentTypes) : []);
  const [ownerType, setOwnerType] = useState("")
   const [ownerId,setOwnerId] = useState("")
  useEffect(() => {
    // Filter and update labels directly in stateAppointmentTypes
    const updatedAppointmentTypes = (
      storageAppointmentTypes ? JSON.parse(storageAppointmentTypes) : []
    )
      .filter((item: any) => item.label !== "Gói + Tùy chọn")
      .map((item: any) => {
        if (item.label === "Tùy chọn") {
          return { ...item, label: "Không gói dịch vụ" };
        } else if (item.label === "Gói") {
          return { ...item, label: "Gói" };
        }
        return item;
      });

    setstateAppointmentTypes(updatedAppointmentTypes);
  }, [storageAppointmentTypes]);
  const [stateVoucherTypes, setstateVoucherTypes] = useState<GroupRadioType[]>(
    storageVoucherTypes ? JSON.parse(storageVoucherTypes || "") : []
  );

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
    DropdownData[]
  >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
    DropdownData[]
  >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(
    storageLaunchSources ? JSON.parse(storageLaunchSources) : []
  );
  const [listNations, setListNations] = useState<DropdownData[]>(
    storageNation ? JSON.parse(storageNation || "") : []
  );
  const [listAffiliates, setListAffiliates] = useState<DropdownData[]>(
    storageAffiliates ? JSON.parse(storageAffiliates || "") : []
  );
    const [listStaffs, setListStaffs] = useState<DropdownData[]>(
      storageListStaff ? JSON.parse(storageListStaff || "") : []
    );
  const [listGenders, setListGenders] = useState<DropdownData[]>(
    storageGenders ? JSON.parse(storageGenders || "") : []
  );
  const [listCareers, setListCareers] = useState<DropdownData[]>(
    storageCareers ? JSON.parse(storageCareers || "") : []
  );
  const [listPackages, setListPackages] = useState<DropdownData[]>(
    storagePackages ? JSON.parse(storagePackages || "") : []
  );
  console.log("listPackages", listPackages);
  const [listPackageItems, setListPackageItems] = useState<DropdownData[]>(
    storagePackageItems ? JSON.parse(storagePackageItems || "") : []
  );
  const [listDoctoronline, setListDoctoronline] = useState<DropdownData[]>(
    storageDoctoronline ? JSON.parse(storageDoctoronline || "") : []
  );
  const [listServicesAllowGroup, setListServicesAllowGroup] = useState<any[]>(
    storageServicesAllowGroup ? JSON.parse(storageServicesAllowGroup || "") : []
  );
  const [valueUpdateCustomer, setValueUpdateCustomer] = useState(valUpdate);
  const [valueSurveyPortrait, setValueSurveyPortrait] =
    useState(dataSurveyPortrait);
  const employeeId1 = localStorage.getItem("employee_id");
    const [employeeId, setStateEmployeeId] = useState<any>(employeeId1 ? JSON.parse(employeeId1) : "");
    const getName = Cookies.get('fullname');
  const [listProvince, setListProvince] = useState<AddressData[]>();
  const [listDistrict, setListDistricts] = useState<AddressData[]>();
  const [listWard, setListWard] = useState<AddressData[]>();
  const [isShowMore, setIsShowMore] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSelectService, setIsSelectService] = useState(false);
  const [customerPortrait, setCustomerPortrait] = useState(false);
  const [purposerPackage, setPurposoerPackage] = useState<GroupRadioType>(
    optionTyeAddCustomerRadio[0]
  );
  const [isOpenFormGetCustomer, setIsOpenFormGetCustomer] = useState(false);
  const [valueGetCustomerWoM, setValueGetCustomerWoM] = useState("");
  const [listCustomerWoM, setlistCustomerWoM] = useState<any[]>();
  const [saveCustomerWoM, setSaveCustomerWoM] = useState<any>();
  const [isUpdateWoM, setIsUpdateWOM] = useState(true);
  const [isCheckInsurance, setIsCheckInsurance] = useState(false);
  const [isCheckInsuranceSuccess, setIsCheckInsuranceSuccess] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    isValid: false,
    content: <></>,
  });
  const [servicePackageId, setServicePackageId] = useState(
    valUpdate?.master?.package_id
  );
  const [openSelect, setOpenSelect] = useState(true);
  const [isCloseB, setIsCloseB] = useState(false);
  const [stateOID, setStateOID] = useState<string>("");
  const [nameSource, setNameSource] = useState("")
     const [openModalKeysearch,setOpenModalKeysearch] = useState(false)
  const [dataForm, setDataForm] = useState({
     id: "",
     lead_dob: 0,
     lead_mob: 0,
     lead_yob: 0,
    step_id: 0,
    staff: undefined as unknown as DropdownData,
            source: undefined as unknown as DropdownData,
    customer_identity_card:"",
     f_type:undefined as unknown as DropdownData,
     is_converted: null,
     lead_pancake_link: null,
     visit_id: null,
     saleorder_id: null,
     lead_appointment_datetime: null,
     lead_convert_datetime: null,
     lead_last_datetime: null,
     owner_id:"",
     follow_employee_id: "EMP002",
     own_employee_id: "EMP001",
     lead_first_datetime:"2025-06-19T08:00:00",
     name: "",
     phoneNumber: !_.isUndefined(customerPhoneNotFound)
       ? customerPhoneNotFound
       : "",
     gender: undefined as unknown as DropdownData,
     dayOfBirth: "",
     dayOfBirthBHYT: "",
     email: "",
     nation: undefined as unknown as DropdownData,
     voucher: undefined as unknown as DropdownData,
     voucherName: "",
     voucherId: "",
     voucherValue: "",
     career: undefined as unknown as DropdownData,
     originGroup: undefined as unknown as DropdownData,
     originType: undefined as unknown as DropdownData,
     origin: undefined as unknown as DropdownData,
     partner: undefined as unknown as DropdownData,
     customerId: "",
     customerType: "",
     address: "",
     country: undefined as unknown as AddressData,
     city: undefined as unknown as AddressData,
     district: undefined as unknown as AddressData,
     ward: undefined as unknown as AddressData,
     note: "",
     dateBooking: dateBookingSchedule
       ? moment(dateBookingSchedule).format("YYYY-MM-DD HH:mm")
       : (undefined as unknown as Date), //moment(dateBookingSchedule).format('YYYY-MM-DD')
     noteBooking: "",
     typeBooking: {
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
     } as GroupRadioType,
     serviceAllowTypeBooking1: undefined as unknown as DropdownData,
     serviceAllowTypeBooking2: undefined as unknown as DropdownData,
     //serviceAllowTypeBooking3: undefined as unknown as DropdownData,
     registerTypeId: "",
     portraitSurveyType: undefined as unknown as any,
     ctvBSCD: undefined as unknown as DropdownData,
     ctv: undefined as unknown as DropdownData,
     endoscopics: undefined as unknown as DropdownData,
     idBHYT: "",
     socialName: "",
     gclid: "",
     numberDis: undefined,
     allow_update_profile: true,
     lead_pancake_id: "",
     lead_facebook_id: "",
     lead_google_id: "",
     lead_zalo_id: "",
     status:"",
   });
  const [dataGastrointestinal, setDataGastrointestinal] = useState({
    customerIllness: [],
    symptoms: "",
    medicalHistory: "",
    pastMedicalHistory: "",
    treatmentElsewhere: "",
    endoscopy: undefined as unknown as GroupRadioType,
    typeEndoscopy: [],
    recentEndoscopy: "",
    expectations: "",
    serviceExperience: undefined as unknown as GroupRadioType,
    regularCheckups: undefined as unknown as GroupRadioType,
    lastCheckup: "",
    resultEndoscopy: undefined as unknown as GroupRadioType,
    symptomsRecently: "",
    resultConsultation: "",
    consultation: undefined as unknown as GroupRadioType,
    sedatedEndoscopy: undefined as unknown as GroupRadioType,
    takeMedication: undefined as unknown as GroupRadioType,
    medicationInstructions: undefined as unknown as GroupRadioType,
    time: "",
    documentBeforeEndoscopy: undefined as unknown as GroupRadioType,
    documentRoadmap: undefined as unknown as GroupRadioType,
    other: "",
    bh: OptionBH[0] as unknown as DropdownData,
    bh_where: "",
  });
  const [errorForm, setErrorForm] = useState({
    name: "",
    phone: "",
    dayOfBirth: "",
    origin: "",
    dateBooking: "",
    noteBooking: "",
    bookingService1: "",
    bookingService2: "",
    bookingService3: "",
    originGroup: "",
    originType: "",
    ctv: "",
    groupCs: "",
    endoscopics: "",
    gclid: "",
    dayOfBirthBHYT: "",
    f_type: "",
    gender: "",
    nation_id: "",
    country_id:""
  });
  const [insuranceErrr, setInsuranceErr] = useState({
    fullName: "",
    dayOfBirth: "",
    idcard: "",
    idBHYT: "",
  });
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [serviceSelected, setServiceSelected] = useState<ServiceItem[]>([]);
  const [packageSelected, setPackageSelected] = useState<DropdownData>();
  const [totalPackage, setTotalPackage] = useState("");
  const [notePackage, setNotePackage] = useState<any>(
    valUpdate?.master?.appointment_note === undefined
      ? ""
      : valUpdate?.master?.appointment_note
  );
  const [nameService, setNameService] = useState(
    valUpdate?.master?.appointment_type
  );

  const nameService1 = useRef("");
  // Side effect when resize
  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, []);
  useEffect(() => {
    let serviceIds;

    serviceIds = getServiceIds2(serviceSelected, listPackageItems);
    setTotalPackage(serviceIds);
  }, [serviceSelected]);
  
  // Layout hiện lên là message được truyền vào, bấm vào chuyển hướng tới trang user cụ thể thông qua id truyền vào
  const openNotification = (
    success: boolean,
    placement: NotificationPlacement,
    message: React.ReactNode,
    description: React.ReactNode,
    id?: string,
    duration?: number
  ) => {
    if (success) {
      api.success({
        message: message,
        description: description,
        placement: placement,
        duration: duration || 10,
        closeIcon: <Icon iconName="close" isPointer />,
        role: "status",
        onClick: () => {
          if (id?.trim()) {
            window.open(
              `/customer-info/id/${id}/history-interaction`,
              "_blank"
            );
          } else {
            return;
          }
        },
      });
    } else {
      api.error({
        message: message,
        description: description,
        placement: placement,
        duration: duration || 10,
        closeIcon: <Icon iconName="close" isPointer />,
        role: "status",
        onClick: () => {
          if (id?.trim()) {
            window.open(
              `/customer-info/id/${id}/history-interaction`,
              "_blank"
            );
          } else {
            return;
          }
        },
      });
    }
  };
  /* Clear state function */
  const clearStateForm = () => {
    setDataForm({
      customerType: "",
      id: "",
      name: "",
      phoneNumber: "",
      gender: undefined as unknown as DropdownData,
      dayOfBirth: "",
      dayOfBirthBHYT: "",
      email: "",
      nation: undefined as unknown as DropdownData,
      voucher: undefined as unknown as DropdownData,
             staff: undefined as unknown as DropdownData,
      voucherName: "",
      voucherId: "",
      voucherValue: "",
      career: undefined as unknown as DropdownData,
      origin: undefined as unknown as DropdownData,
      partner: undefined as unknown as DropdownData,
      customerId: "",
      address: "",
      country: undefined as unknown as AddressData,
      city: undefined as unknown as AddressData,
      district: undefined as unknown as AddressData,
      ward: undefined as unknown as AddressData,
      note: "",
       source: undefined as unknown as DropdownData,
      dateBooking: undefined as unknown as Date,
      noteBooking: "",
      typeBooking: undefined as unknown as GroupRadioType,
      serviceAllowTypeBooking1: undefined as unknown as DropdownData,
      serviceAllowTypeBooking2: undefined as unknown as DropdownData,
      //  serviceAllowTypeBooking3: undefined as unknown as DropdownData,
      registerTypeId: "",
      portraitSurveyType: "",
      originGroup: undefined as unknown as DropdownData,
      originType: undefined as unknown as DropdownData,
      ctv: undefined as unknown as DropdownData,
      ctvBSCD: undefined as unknown as DropdownData,
      endoscopics: undefined as unknown as DropdownData,
      idBHYT: "",
      socialName: "",
      gclid: "",
      numberDis: undefined,
      allow_update_profile: true,
      lead_pancake_id: "",
      lead_facebook_id: "",
      lead_google_id: "",
      lead_zalo_id: "",
      follow_employee_id: "EMP002",
      own_employee_id: "EMP001",
      lead_first_datetime: "2025-06-19T08:00:00",
      
      lead_dob: 0,
    lead_mob: 0,
    lead_yob: 0,
    step_id: 0,
    is_converted: null,
      lead_pancake_link: null, status: "",
      owner_id: "",
      visit_id: null,
      saleorder_id: null,
      lead_appointment_datetime: null,
      lead_convert_datetime: null,
      lead_last_datetime: null,
      f_type: undefined as unknown as DropdownData,
      customer_identity_card: "",

    });
  };
  const clearGastrointestinal = () => {
    setDataGastrointestinal({
      resultConsultation: "",
      bh_where: "",
      bh: undefined as unknown as DropdownData,
      customerIllness: [],
      symptoms: "",
      medicalHistory: "",
      pastMedicalHistory: "",
      treatmentElsewhere: "",
      endoscopy: undefined as unknown as GroupRadioType,
      typeEndoscopy: [],
      recentEndoscopy: "",
      expectations: "",
      serviceExperience: undefined as unknown as GroupRadioType,
      regularCheckups: undefined as unknown as GroupRadioType,
      lastCheckup: "",
      resultEndoscopy: undefined as unknown as GroupRadioType,
      symptomsRecently: "",
      consultation: undefined as unknown as GroupRadioType,
      sedatedEndoscopy: undefined as unknown as GroupRadioType,
      takeMedication: undefined as unknown as GroupRadioType,
      medicationInstructions: undefined as unknown as GroupRadioType,
      time: "",
      documentBeforeEndoscopy: undefined as unknown as GroupRadioType,
      documentRoadmap: undefined as unknown as GroupRadioType,
      other: "",
    });
  };
  const [isDelete, setIsDelete] = useState(false);
  const clearStateErrorFormAll = () => {
    setErrorForm({
      ...errorForm,
      name: "",
      phone: "",
      dayOfBirth: "",
      origin: "",
      dateBooking: "",
      noteBooking: "",
      bookingService1: "",
      bookingService2: "",
      bookingService3: "",
      ctv: "",
      originGroup: "",
      groupCs: "",
      dayOfBirthBHYT: "",   gender: "",
    nation_id: "",
    country_id:""
    });
    setInsuranceErr({
      ...insuranceErrr,
      fullName: "",
      dayOfBirth: "",
      idcard: "",
    });
    setInsuranceData({ ...insuranceData, isValid: false, content: <></> });
  };
  const clearStateErrorForm = (title: string) => {
    setErrorForm({ ...errorForm, [title]: "" });
  };
  const setStateFormDataFunc = (title: string, value: any) => {
    setDataForm({ ...dataForm, [title]: value });
  };
  /* Clear state function */
  const [showDVK, setShowDVL] = useState(dataForm.typeBooking);

  useEffect(() => {
    setShowDVL(dataForm.typeBooking);
  }, [dataForm.typeBooking]);
  /* Validate & Submit save/update customer infomation */
  const handleValidateForm = () => {
    try {
     
      if (
         !dataForm.noteBooking ||
        !dataForm.origin.value ||
        !dataForm.originGroup.value ||
        (Number(dataForm.origin?.value) === 2 &&
          !dataForm.ctvBSCD?.affiliate_type) ||
        (Number(dataForm.origin?.value) === 3 &&
          !dataForm.ctv?.affiliate_type) ||
        (Number(dataForm.origin?.value) === 4 &&
          !valueGetCustomerWoM.trim() &&
          _.isUndefined(saveCustomerWoM)) ||
        (Number(dataForm.origin?.value) === 8 &&
          Number(dataForm.originType?.value) === 5 &&
          !dataForm?.gclid?.trim()) 
      
        // || _.isEmpty(dataForm.portraitSurveyType)
      ) {
        setErrorForm({
          ...errorForm,
         
          origin: !dataForm.origin?.value ? "Nguồn là bắt buộc" : "",
          originGroup: !dataForm.originGroup?.value
            ? "Nhóm nguồn là bắt buộc"
            : "",
          dateBooking:
          !dataForm.dateBooking
              ? "Ngày đặt lịch là bắt buộc"
              : "",
          noteBooking:
             !dataForm.noteBooking
              ? "Ghi chú đặt lịch là bắt buộc"
              : "",
          bookingService1:
            isBooking &&
              dataForm.typeBooking?.value === "telemedicine" &&
              !dataForm.serviceAllowTypeBooking1
              ? "Vui lòng chọn bác sĩ!"
              : "",
          bookingService2:
            isBooking &&
              dataForm.typeBooking?.value === "package" &&
              !dataForm.serviceAllowTypeBooking2
              ? "Vui lòng chọn gói dịch vụ !"
              : "",

          endoscopics:
            isBooking &&
              dataForm.typeBooking?.value === "endoscopics" &&
              !dataForm.endoscopics
              ? "Vui lòng chọn dịch vụ nội soi !"
              : "",
          ctv:
            (Number(dataForm.origin?.value) === 2 &&
              !dataForm.ctvBSCD?.affiliate_type &&
              "Vui lòng chọn bác sĩ chỉ định") ||
            (Number(dataForm.origin?.value) === 3 &&
              !dataForm.ctv?.affiliate_type &&
              "Vui lòng chọn đối tác") ||
            "" ||
            (Number(dataForm.origin?.value) === 4 &&
              !valueGetCustomerWoM.trim() &&
              _.isUndefined(saveCustomerWoM) &&
              "Vui lòng chọn Người giới thiệu") ||
            "",
          groupCs: _.isEmpty(dataForm?.portraitSurveyType) ? "error" : "",
          gclid:
            Number(dataForm.origin?.value) === 8 &&
              Number(dataForm.originType?.value) === 5 &&
              !dataForm?.gclid?.trim()
              ? "Vui lòng nhập Google ID từ mail"
              : "",
        });
        // if (_.isEmpty(dataForm?.portraitSurveyType)) {
        //   toast.error('Vui lòng chọn nhóm khách hàng');
        // }
        return false;
      }
      return true;
    } catch (err) {
      console.error(" 🚀- DaiNQ - 🚀: -> handleValidateForm -> err:", err);
    }
  };
  // Submit add customer
  const [isCompany,setIsCompany] = useState(false)
  const onSubmit = () => {
    let serviceIds;
    if (dataForm.typeBooking?.value === "package") {
      serviceIds = getServiceIds(servicePackageId, listPackageItems);
    }
    if (!handleValidateForm()) return;
    const converContent = parseCustomerPortrait(
      dataForm?.portraitSurveyType,
      dataGastrointestinal,
      dataForm
    );
    console.log("🚀- dataForm:", isBooking);
    if (isBooking) {
     
      if (serviceSelected.length !== 0) {
       
        const request = {
                is_appointment: true,
              employee_id:employeeId,
          employee_ref: employeeId,
          sales_employee_id: employeeId,
          cs_employee_id: employeeId,
          employee_name:getName,
          
          master_id: "",
          ads_id:"",
          customer_id: dataForm.customerId,
          owner_id: isCompany ? ownerId : ([2, 3, 4, 5,12].includes(Number(dataForm?.origin?.value)) ? ownerId: null ),
            owner_type: isCompany ? ownerType : ([2, 3, 4, 5,12].includes(Number(dataForm?.origin?.value)) ? ownerType: null ),  
            //   owner_id: dataForm.owner_id,
            // owner_id: Number(dataForm?.origin?.value) === 4 ? stateOID : Number(dataForm?.origin?.value) === 2 ? dataForm?.ctvBSCD?.affiliate_code : Number(dataForm?.origin?.value) === 3 ? dataForm?.ctv?.affiliate_code : Number(dataForm?.origin?.value) === 5? dataForm?.staff?.value : null,
            // owner_type: Number(dataForm?.origin?.value) === 4 ? "customer": Number(dataForm?.origin?.value) === 2 ? "BSCD": Number(dataForm?.origin?.value) === 3  ?  "CTV ": Number(dataForm?.origin?.value) === 5? "staff" :null,
            launch_source_group_id: dataForm?.originGroup?.value,
            launch_source_id: dataForm?.origin?.value,
            launch_source_type_id: dataForm?.originType?.value,
            appointment_datetime: moment(dataForm.dateBooking).format("YYYY-MM-DDTHH:mm:03"),
            appointment_note: dataForm.noteBooking,
            appointment_type:
            dataForm.typeBooking?.value || optionBooking12[0].value,  
            register_type_id:dataForm.portraitSurveyType,
            package_id:
              isBooking && dataForm.typeBooking?.value === "package"
                ? servicePackageId
                : isBooking && dataForm.typeBooking?.value === "packageservice"
                  ? servicePackageId
                  : null,
            // f_type:  "F0",
              ids: [
                "endoscopics",
                "services",
                "packageservice",
                "package",
              ].includes(dataForm.typeBooking?.value)
                ? dataForm.typeBooking?.value === "endoscopics"
                  ? dataForm.endoscopics.id
                  : serviceSelected?.map((i) => i?.service_id).join(",")
                : ["package"].includes(dataForm.typeBooking?.value)
                  ? serviceIds
                  : dataForm.typeBooking?.id,
             
          
         
          //   },
        
        
          
         
        };
       
        if (handleAddCustomer) {
           clearStateForm();
           clearGastrointestinal();
           setCustomerPortrait(false);
          setServiceSelected([]);
          handleLoading(true)
           handleAddCustomer(request);
        }
      } else {
        toast.error("Vui lòng chọn dịch vụ");
      }
    }
  };
  /* Validate & Submit save/update customer infomation */
  console.log(dataForm)
  const [stateListS,setStateListS] = useState<any[]>([])
   const { mutate: getSource } = useMutation(
    "post-footer-form",
    (id: any) => getLS(id),
    {
      onSuccess: (data) => {
        console.log(data)
        const mappedData = data.data.map((item:any) => ({
  ...item,
  value: item.owner_id,
  label: item.owner_name_display || item.owner_name,
}));
      setStateListS(mappedData)
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );
  const [keysearch,setKeysearch] = useState("")
  const handleGetSource = (data:any) => {
    const body = {
      launch_source_id: data,
      keysearch: keysearch
    }
    getSource(body)
  }
  // React Query lấy danh sách tỉnh, thành phố
  const { mutate: getProvinces } = useMutation(
    "post-footer-form",
    (id: string) => getProvinceAPIs(id),
    {
      onSuccess: (data) => {
        const convertProvince: any[] = [];
        data.data.map((i: any) => {
          const province = { key: i.id, label: i.name, value: i.id };
          convertProvince.push(province);
        });
        setListProvince([...convertProvince]);
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  // React Query lấy danh sách quận, huyện
  const { mutate: getDistricts } = useMutation(
    "post-footer-form",
    getDistrictsAPIs,
    {
      onSuccess: (data) => {
        const convertDistricts: any[] = [];
        data.data.map((i: any) => {
          const districts = { key: i.id, label: i.name, value: i.id };
          convertDistricts.push(districts);
        });
        setListDistricts([...convertDistricts]);
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );
  // React Query lấy danh sách phường, xã
  const { mutate: getWards } = useMutation("post-footer-form", getWardsAPIs, {
    onSuccess: (data) => {
      const convertWard: any[] = [];
      data.data.map((i: any) => {
        const ward = { key: i.id, label: i.name, value: i.id };
        convertWard.push(ward);
      });
      setListWard([...convertWard]);
    },
    onError: (err) => {
      console.error(err);
    },
  });
  // React Query lấy danh sách những tên khách hàng cũ
  const { mutate: getCUstomerWoM } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerByKey(data),
    {
      onSuccess: (data) => {
        setlistCustomerWoM(data);
        if (valueGetCustomerWoM.trim()) {
          setIsOpenFormGetCustomer(true);
        }
      },
      onError: (err) => {
        console.error("Error🚀 line 348 -> FormConvertCustomer:", err);
      },
    }
  );
  const [stateListSource,setStateListSource] = useState<any[]>([])
   // React Query lấy danh sách nhóm nguồn, loại nguồn, nguồn 
  const { mutate: getListSource } = useMutation(
    "post-footer-form",
    (data: any) => getListSourceCustomer(data),
    {
      onSuccess: (data) => {
        setStateListSource(data)
        console.log(data)
        setOpenModalSourceCustomer(true)
        setLoading(false)
      },
      onError: (err) => {
        console.error("Error🚀 line 348 -> FormConvertCustomer:", err);
      },
    }
  );
  // React Query getCustomer theo SDT
  // nếu như khi thực hiện call API xong server trả về mà có customer_id với dữ liệu là unkown có nghĩa là sdt chưa được sử dụng,
  //   khi mà sdt đã được sử dụng thì có thông báo hiện lên và có thể bấm vào thông báo bằng openNotification
  const [showNotification, setShowNotification] = useState(false);
  const [textNameNotification, setTextNameNotification] = useState("");
  const [textMaleNotification, setTextMaleNotification] = useState("");
  const [textAgeNotification, setTextAgeNotification] = useState("");
  const [textIdNotification, setTextIdNotification] = useState("");
  const { mutate: getCustomerByPhone } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerWhenCallIn(data),
    {
      onSuccess: (data: any) => {
        const { name, gender, customer_id, phonenumber, year_of_birth } = data;
        if (customer_id === "unkown") return;
        // openNotification(true, 'topLeft',
        //   <Typography content={`Số điện thoại đã được đăng kí`} modifiers={['600', 'cg-red', 'capitalize']} />,
        //   <div>
        //     <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', }}>
        //       <span style={{ margin: '0 4px' }}>Khách hàng:</span><Typography content={name} modifiers={['600', 'blueNavy', 'capitalize']} /><span style={{ margin: '0 4px' }}>-</span>
        //       <Typography content={gender?.name} modifiers={['600', 'blueNavy', 'capitalize']} /><span style={{ margin: '0 4px' }}>-</span>
        //       <Typography content={year_of_birth} modifiers={['600', 'blueNavy', 'capitalize']} />
        //     </div>
        //     <Typography content={'Click để vào chi tiết khách hàng'} modifiers={['400', 'orange', 'italic', '12x14']} />
        //   </div>,
        //   customer_id, 10)
        setShowNotification(true);
        setTextNameNotification(name);
        setTextMaleNotification(gender?.name);
        setTextAgeNotification(year_of_birth);
        setTextIdNotification(customer_id);
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  // React Query kiểm tra bảo hiểm Y tế
  const { mutate: checkInsurance } = useMutation(
    "post-footer-form",
    (body: any) => postCheckInsurance(body),
    {
      onSuccess: (data) => {
        setIsCheckInsuranceSuccess(false);
        setInsuranceData({
          ...insuranceData,
          isValid: data.status && data.data?.maKetQua == "000",
          content: (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  content={data.message}
                  modifiers={[
                    "600",
                    data?.status && data?.data?.maKetQua === "000"
                      ? "green"
                      : "cg-red",
                    "capitalize",
                  ]}
                />
              </div>
              <ul
                className={mapModifiers(
                  "m-form_add_customer_notify",
                  data?.status && data?.data?.maKetQua == "000"
                    ? "active"
                    : "error"
                )}
                style={{ marginTop: 6 }}
              >
                {data.data?.tenDKBDMoi?.trim() && (
                  <li>
                    <span>Nơi đăng kí ban đầu:</span>
                    {data.data?.tenDKBDMoi}
                  </li>
                )}
              </ul>
            </>
          ),
        });
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  // end Call API

  const handleGetItemPaseAPI = async (
    id: string,
    option: any,
    type: string
  ) => {
    switch (type) {
      case "country":
        getProvinces("VN");
        setDataForm({
          ...dataForm,
          country: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
      case "city":
        setListDistricts([]);
        setListWard([]);
        getDistricts(id);
        setDataForm({
          ...dataForm,
          city: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
      case "district":
        setListWard([]);
        getWards(id);
        setDataForm({
          ...dataForm,
          district: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
      case "ward":
        setDataForm({
          ...dataForm,
          ward: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
    }
  };

  const handleUpdateListService = (
    listServices: ServiceItem[],
    serviceIds: string
  ) =>
    listServices
      ?.map((item) => {
        if (!serviceIds || !serviceIds.split(",")?.includes(item.service_id))
          return;

        return item;
      })
      .filter(Boolean);

  // Side Effect

  useEffect(() => {
    if (!storageNation) {
      setListNations(storageNation ? JSON.parse(storageNation || "") : []);
    }
    if (!storageLaunchSources) {
      setstateLaunchSource(
        storageLaunchSources ? JSON.parse(storageLaunchSources || "") : []
      );
    }
    if (!storageAffiliates) {
      setListAffiliates(
        storageAffiliates ? JSON.parse(storageAffiliates || "") : []
      );
    }
    if (!storageGenders) {
      setListGenders(storageGenders ? JSON.parse(storageGenders || "") : []);
    }
    if (!storageVoucherTypes) {
      setstateVoucherTypes(
        storageVoucherTypes ? JSON.parse(storageVoucherTypes || "") : []
      );
    }
    getProvinces("VN");
  }, []);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      city: (listProvince ?? []).find(
        (i) =>
          i.key ==
          (valueUpdateCustomer?.customer?.province_id ||
            valUpdate?.customer?.province_id)
      ) as any,
    });
  }, [listProvince, valueUpdateCustomer]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      district: (listDistrict ?? []).find(
        (i) =>
          i.value ==
          (valueUpdateCustomer?.customer?.district_id ||
            valUpdate?.customer?.district_id)
      ) as any,
    });
  }, [listDistrict, valueUpdateCustomer]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      ward: (listWard ?? []).find(
        (i) =>
          i.value ==
          (valueUpdateCustomer?.customer?.ward_id ||
            valUpdate?.customer?.ward_id)
      ) as any,
    });
  }, [listWard, valueUpdateCustomer]);

  useEffect(() => {
    setValueSurveyPortrait(dataSurveyPortrait);
  }, [dataSurveyPortrait]);

  useEffect(() => {
    if (
      !valUpdate?.is_customer_converted &&
      valUpdate?.lead_source_display === "Bác Sĩ Chỉ Định"
    ) {
      setDataForm({
        ...dataForm,
        portraitSurveyType: "CSBSCD",
      });
      dispatch(
        getGroupSurveyPortrait({
          customerId: dataForm.id,
          servey_type: "CSBSCD",
        })
      );
    }

    const listServices = listServicesAllowGroup?.flatMap(
      (item) => item.service_group_item
    );
    if (isUpdate) {
      if (valUpdate?.customer?.province_id) {
        getDistricts(valUpdate?.customer?.province_id);
      }
      if (valUpdate?.customer?.district_id) {
        getWards(valUpdate?.customer?.district_id);
      }

     const delay = setTimeout(() => {
            setIsBooking(
            true
            );
            setDataForm({
              ...dataForm,
              visit_id: valUpdate.visit_id,
              customerId:valUpdate?.customer?.customer_id || "",
              saleorder_id: valUpdate.saleorder_id,
              lead_appointment_datetime: valUpdate.lead_appointment_datetime,
              lead_convert_datetime: valUpdate.lead_convert_datetime,
              lead_last_datetime: valUpdate.lead_last_datetime,
              lead_dob: valUpdate?.lead_dob,
              lead_mob: valUpdate?.mob,
              lead_yob: valUpdate?.lead_yob,
              step_id: valUpdate?.step_id,
              is_converted: valUpdate?.is_converted,
              lead_pancake_link: valUpdate?.lead_pancake_link,
             
              id:  valUpdate?.lead_id,
              name:        valUpdate?.lead_name,
              // voucher: valUpdate?.master?.order_discount_refcode,
              phoneNumber:
             
                (valUpdate?.lead_phone || "").replace(/\+84-/, "0"),
                status:valUpdate.status,
              gender:
                (listGenders.find(
                  (gender) => gender.value === valUpdate?.customer?.gender?.id
                ) as any) ||
                (listGenders.find((i) => i.label == valUpdate?.gender_name) as any),
              dayOfBirth:
               
                `${valUpdate?.lead_yob}`,
              email: valUpdate?.customer?.customer_email || "",
              nation:
                (listNations.find(
                  (i) => i.value == valUpdate?.customer?.nation_id
                ) as any) || undefined,
              career:
                (listCareers.find(
                  (i) => i.value == valUpdate?.customer?.career?.id
                ) as any) || undefined,
               origin:
                (stateLaunchSource.find(
                  (i) => i.id == valUpdate?.source_first?.launch_source_id
                ) as any),
              originGroup:
                (stateLaunchSourceGroups.find(
                  (i) => i.id == valUpdate?.source_first?.launch_source_group_id
                ) as any) ,
              voucher: stateVoucherTypes.find(
                (i) => i.value == valUpdate?.master?.order_discount_refcode
              ) as any,
              originType:
                (stateLaunchSourceTypes.find(
                  (i) => i.value == valUpdate?.source_first?.launch_source_type_id
                ) as any) ||
                (stateLaunchSourceTypes.find(
                  (i) => i.value == valUpdate?.launch_source_type_id
                ) as any),
              address: valUpdate?.lead_address || "",
              country:
                OptionCountry?.find(
                  (i) => i.value == valUpdate?.customer?.country?.id
                ) || OptionCountry[0],
              city: (listProvince || [])?.find(
                (i) => i.value == valUpdate?.lead_province_id
              ) as any,
              district: (listDistrict || [])?.find(
                (i) => i.value == valUpdate?.lead_district_id
              ) as any,
              ward: (listWard || [])?.find(
                (i) => i.value == valUpdate?.lead_ward_id
              ) as any,
              note: valUpdate?.lead_note || "",
              dateBooking:
                valUpdate?.is_has_booking || !!valUpdate?.appointment_datetime
                  ? valUpdate?.master?.appointment_date ||
                  valUpdate?.master?.appointment_date ||
                  valUpdate?.appointment_datetime
                  : (undefined as unknown as Date),
              noteBooking: valUpdate?.is_has_booking
                ? valUpdate?.master?.appointment_note ||
                valUpdate?.master?.appointment_note
                : "",
              allow_update_profile: valUpdate?.allow_update_profile,
              // typeBooking: valUpdate?.is_has_booking
              //   ? (stateAppointmentTypes.find(
              //       (i) =>
              //         i.value === valUpdate?.master?.appointment_type ||
              //         i.value === valUpdate?.master?.appointment_type
              //     ) as GroupRadioType)
              //   : (undefined as unknown as GroupRadioType),
              typeBooking: valUpdate?.is_has_booking
                ? (stateAppointmentTypes.find(
                  (i) =>
                    i.value ===
                    (valUpdate?.master?.appointment_type === "endoscopics"
                      ? "services"
                      : valUpdate?.master?.appointment_type)
                ) as GroupRadioType)
                : ({
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
                } as GroupRadioType),
    
              serviceAllowTypeBooking1: undefined as unknown as DropdownData,
              serviceAllowTypeBooking2:
                valUpdate?.is_has_booking &&
                valUpdate?.master?.appointment_type === "package" &&
                listPackages?.find((i) => i.id === valUpdate?.master?.package_id),
              endoscopics:
                valUpdate?.is_has_booking &&
                valUpdate?.master?.appointment_type === "endoscopics" &&
                stateEndoscopics.find(
                  (i: DropdownData) =>
                    i.label?.toLocaleLowerCase() ===
                    valUpdate?.master?.appointment_note?.toLocaleLowerCase()
                ),
              customerType: valUpdate?.customer_type || "lead",
              portraitSurveyType: valUpdate?.customer?.portrait_survey_type
                ? valUpdate?.customer?.portrait_survey_type
                : valUpdate?.customer?.launch_source_id == 2
                  ? "CSBSCD"
                  : OptionCustomerPortrait1[0]?.value,
               ctv: listAffiliates.find(
                              (i: any) => i?.affiliate_code === valUpdate?.source_first?.owner_id
                            ) as unknown as DropdownData,
                            ctvBSCD: listAffiliates.find(
                              (i: any) => i?.affiliate_code === valUpdate?.source_first?.owner_id
                            ) as unknown as DropdownData,
              gclid: valUpdate?.customer?.gclid || valUpdate?.gclid,
              // numberDis
            });
     }, 1000);
      console.log("🚀 ~ file: index.tsx:1231 ~ delay:", listAffiliates.find(
                              (i: any) => i?.affiliate_code === valUpdate?.source_first?.owner_id
                            ) as unknown as DropdownData)
      setValueUpdateCustomer(valUpdate);

      if (
        valUpdate?.master?.appointment_type === "services" ||
        valUpdate?.master?.appointment_type === "packageservice" ||
        valUpdate?.master?.appointment_type === "package" ||
        valUpdate?.master?.appointment_type === "endoscopics"
      ) {
        const currentListService = handleUpdateListService(
          listServices,
          valUpdate?.master?.ids
        );
        setServiceSelected(currentListService as ServiceItem[]);
      }
      if (
        valUpdate?.customer?.launch_source?.id === 4 &&
        _.isNull(valUpdate?.affiliate) &&
        isOpenFormGetCustomer
      ) {
        if (!valUpdate?.customer.owner_id.trim()) return;
        getCUstomerWoM(valUpdate?.customer.owner_id);
      } else {
        setSaveCustomerWoM(valUpdate?.affiliate);
        setIsUpdateWOM(true);
      }
      return () => {
        clearTimeout(delay);
      };
    }
  }, [valUpdate]);
  useEffect(() => {
    if (!dateBookingSchedule) return;
    setIsBooking(!_.isUndefined(dateBookingSchedule));
    setDataForm({
      ...dataForm,
      dateBooking: dateBookingSchedule
        ? moment(dateBookingSchedule).format("YYYY-MM-DD HH:mm")
        : (undefined as unknown as Date),
    });
  }, [dateBookingSchedule]);
  console.log("🚀 ~ file: index.tsx:1313 ~ useEffect ~ dataForm:", dataForm)
  useEffect(() => {
    if (isClose) {
      // setIsBooking(false);
      setCustomerPortrait(false);
      clearStateForm();
      clearStateErrorFormAll();
    }
  }, [isClose]);

  // End Side Effect

  const handleGetCustomer = async () => {
    await getCUstomerWoM(valueGetCustomerWoM);
  };
  const [loading, setLoading] = useState(false)
  const [openModalSourceCustomer, setOpenModalSourceCustomer] = useState(false)
  const handleGetListSourceCustomer = async () => {
     setLoading(true)
    await getListSource({
      customer_id: dataForm.customerId,
    });
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
  // Bảng layout từng cột
   const tableColumnForSearch = [
    {
      title: (
        <Typography content="Họ tên" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "owner_name",
      key: "customer_fullname",
      align: "center",
      width: 200,
      render: (record: any, data: any) => (
        <div
          onClick={() => {
            setDataForm(prev => ({ ...prev, source: data, }));
            setOpenModalKeysearch(false)
             setOwnerType(data?.owner_type)
            setOwnerId(data?.owner_id)
             setKeysearch("")
          }}
        >
          {" "}
          <Typography
            content={record ?  record : data?.owner_name_display}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
    {
      title: (
        <Typography content="Điện thoại" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "owner_phone",
      width: 90,
      align: "center",
      render: (record: any, data: any) => (
        <div
           onClick={() => {
             setDataForm(prev => ({ ...prev, source: data, }));
            setOpenModalKeysearch(false)
             setOwnerType(data?.owner_type)
            setOwnerId(data?.owner_id)
             setKeysearch("")
          }}
        >
          {" "}
          <Typography
            content={record?.replace(/^\s*0/, '+84-')}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Nhóm"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "owner_type",
      align: "center",
      width: 90,
      render: (record: any, data: any) => (
        <div
           onClick={() => {
              setDataForm(prev => ({ ...prev, source: data, }));
            setOpenModalKeysearch(false)
             setOwnerType(data?.owner_type)
            setOwnerId(data?.owner_id)
             setKeysearch("")
          }}
        >
          {" "}
          <Typography
            content={record}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ngày cập nhật
"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "update_datetime",
      key: "update_datetime",
      align: "center",
      width: 120,
      render: (record: any, data: any) => (
        <div
           onClick={() => {
             setDataForm(prev => ({ ...prev, source: data, }));
            setOpenModalKeysearch(false)
             setOwnerType(data?.owner_type)
            setOwnerId(data?.owner_id)
             setKeysearch("")
          }}
        >
          {" "}
          <Typography
content={moment(record).format("DD-MM-YYYY HH:mm")}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
 
   
  ];
  const tableColumnListSource = [
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
        <Typography content="Nhóm nguồn" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "launch_source_group",
      key: "customer_fullname",
      align: "center",
      width: 130,
      render: (record: any, data: any) => (
        <div
          onClick={() => {
            setDataForm({
              ...dataForm,
                origin:
                (stateLaunchSource.find(
                  (i) => i.id == data?.launch_source?.id
                ) as any),
              originGroup:
                (stateLaunchSourceGroups.find(
                  (i) => i.id ==data?.launch_source_group?.id
                ) as any),
               originType:
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any) ||
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any),
                ctv: listAffiliates.find(
                (i: any) => i?.affiliate_code === data?.owner?.owner_id
              ) as unknown as DropdownData,
              ctvBSCD: listAffiliates.find(
                (i: any) => i?.affiliate_code ===data?.owner?.owner_id
              ) as unknown as DropdownData,
            })
            setOpenModalSourceCustomer(false)
          }}
          
        >
          {" "}
         <Typography
            content={
              record === null
                ? "N/A"
                : record?.name 
            }
            modifiers={["12x18", "400", "center"]}
          />

        </div>
      ),
    },
    {
      title: (
        <Typography content="Nguồn" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "launch_source",
       width: 110,
      align: "center",
      render: (record: any, data: any) => (
        <div
          onClick={() => {
            setDataForm({
              ...dataForm,
                origin:
                (stateLaunchSource.find(
                  (i) => i.id == data?.launch_source?.id
                ) as any),
              originGroup:
                (stateLaunchSourceGroups.find(
                  (i) => i.id ==data?.launch_source_group?.id
                ) as any),
               originType:
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any) ||
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any),
                ctv: listAffiliates.find(
                (i: any) => i?.affiliate_code === data?.owner?.owner_id
              ) as unknown as DropdownData,
              ctvBSCD: listAffiliates.find(
                (i: any) => i?.affiliate_code ===data?.owner?.owner_id
              ) as unknown as DropdownData,
            })
            setOpenModalSourceCustomer(false)
          }}
        >
          {" "}
      <Typography
  content={
    record === null
      ? "N/A"
      : `${record?.name === "Bác Sĩ Chỉ Định" ? "BSCĐ" : record?.name}${
          data?.owner ? ` (${(data?.owner as any)?.owner_name})` : ""
        }`
  }
  modifiers={["12x18", "400", "center"]}
/>

        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Chuyển đổi"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "launch_source_type",
      align: "center",
      width: 130,
      render: (record: any, data: any) => (
        <div
          onClick={() => {
            setDataForm({
              ...dataForm,
                origin:
                (stateLaunchSource.find(
                  (i) => i.id == data?.launch_source?.id
                ) as any),
              originGroup:
                (stateLaunchSourceGroups.find(
                  (i) => i.id ==data?.launch_source_group?.id
                ) as any),
               originType:
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any) ||
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any),
                ctv: listAffiliates.find(
                (i: any) => i?.affiliate_code === data?.owner?.owner_id
              ) as unknown as DropdownData,
              ctvBSCD: listAffiliates.find(
                (i: any) => i?.affiliate_code ===data?.owner?.owner_id
              ) as unknown as DropdownData,
            })
            setOpenModalSourceCustomer(false)
          }}
        >
          {" "}
          <Typography
            content={record === null ? "N/A" :record?.name}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ghi chú"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "note",
      align: "center",
      width: 130,
      render: (record: any, data: any) => (
        <div
          onClick={() => {
            setDataForm({
              ...dataForm,
                origin:
                (stateLaunchSource.find(
                  (i) => i.id == data?.launch_source?.id
                ) as any),
              originGroup:
                (stateLaunchSourceGroups.find(
                  (i) => i.id ==data?.launch_source_group?.id
                ) as any),
               originType:
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any) ||
                (stateLaunchSourceTypes.find(
                  (i) => i.value == data?.launch_source_type?.id
                ) as any),
                ctv: listAffiliates.find(
                (i: any) => i?.affiliate_code === data?.owner?.owner_id
              ) as unknown as DropdownData,
              ctvBSCD: listAffiliates.find(
                (i: any) => i?.affiliate_code ===data?.owner?.owner_id
              ) as unknown as DropdownData,
            })
            setOpenModalSourceCustomer(false)
          }}
        >
          {" "}
          <Typography
            content={(record === null || record === "") ? "N/A" :record}
            modifiers={["12x18", "400", "center"]}
          />{" "}
        </div>
      ),
    },
  ];
  const handleValidateInsurance = () => {
    if (
      (!dataForm.customerId.trim() && !dataForm.idBHYT.trim()) ||
      !dataForm.name.trim() ||
      !dataForm.dayOfBirthBHYT
    ) {
      setInsuranceErr({
        ...insuranceErrr,
        fullName: !dataForm.name.trim() ? "Tên khách hàng là bắt buộc" : "",
        dayOfBirth: !dataForm.dayOfBirthBHYT ? "Ngày sinh là bắt buộc" : "",
        idcard:
          !dataForm.customerId.trim() && !dataForm.idBHYT.trim()
            ? "CCCD/ Mã BHYT là bắt buộc"
            : "",
      });

      return true;
    }

    return false;
  };
  // Hàm kiểm tra bảo hiểm Y tế
  const handleCheckInsurance = async () => {
    if (handleValidateInsurance()) return;
    setIsCheckInsuranceSuccess(true);

    const body = {
      idcard: dataForm.customerId,
      fullname: dataForm.name.toUpperCase(),
      birthday: dataForm.dayOfBirthBHYT,
    };
    await checkInsurance(body);
  };
  // Layout khi bấm checkbox "Chăm sóc trước khám"

  const renderPortrait = useMemo(
    () => (
      <div
        style={{
          display:
            (!!isOpenPopup &&
              customerPortrait &&
              !_.isNull(dataForm.portraitSurveyType)) ||
              (!!isOpenPopup &&
                !!csPortrait &&
                !_.isNull(dataForm.portraitSurveyType))
              ? "block"
              : "none",
          borderLeft:
            (!!isOpenPopup &&
              customerPortrait &&
              !_.isNull(dataForm.portraitSurveyType) &&
              stateBreakPoint > 1450) ||
              (!!isOpenPopup &&
                !!csPortrait &&
                !_.isNull(dataForm.portraitSurveyType) &&
                stateBreakPoint > 1450)
              ? "1px solid #dbdbdd"
              : "unset",
          paddingLeft:
            (!!isOpenPopup &&
              customerPortrait &&
              !_.isNull(dataForm.portraitSurveyType) &&
              stateBreakPoint > 1450) ||
              (!!isOpenPopup &&
                !!csPortrait &&
                !_.isNull(dataForm.portraitSurveyType) &&
                stateBreakPoint > 1450)
              ? 12
              : 0,
        }}
      >
        {(isUpdate && !_.isEmpty(dataForm?.id)) || !isUpdate ? (
          <div
            className={mapModifiers(
              "m-form_add_customer_customerPortrait",
              stateBreakPoint <= 1450 && "fit_content"
            )}
          >
            {dataForm?.portraitSurveyType == "KTQ" && ( //Khám tổng quát
              <div className="m-form_add_customer_customerPortrait_generalExamination">
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Anh/chị có sử dụng BHYT hoặc BHTN không?"
                        : valueSurveyPortrait?.data?.card?.q9 ??
                        "Anh/chị có có sử dụng BHYT hay BHTN không?"
                    }
                  />
                  <Dropdown
                    dropdownOption={OptionBH}
                    variant="simple"
                    values={dataGastrointestinal.bh}
                    handleSelect={(item) => {
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        bh: item,
                      });
                    }}
                  />
                </div>
                {(dataGastrointestinal.bh?.value == "2" ||
                  dataGastrointestinal.bh?.value == "3") && (
                    <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? `Anh/chi đăng ký ${dataGastrointestinal.bh?.label as any
                            } ở đâu`
                            : valueSurveyPortrait?.data?.card?.q10 ??
                            `Anh/chi đăng ký ${dataGastrointestinal.bh?.label as any
                            } ở đâu`
                        }
                      />
                      <Input
                        id=""
                        value={dataGastrointestinal.bh_where}
                        variant="simple"
                        onChange={(event) =>
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            bh_where: event.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Đã từng trải nghiệm dịch vụ khám tổng quát ở cơ sở y tế nào chưa?"
                        : valueSurveyPortrait?.data?.card?.q2 ??
                        "Đã từng trải nghiệm dịch vụ khám tổng quát ở cơ sở y tế nào chưa?"
                    }
                  />
                  <GroupRadio
                    options={OptionCustomerPortraitDigestiveExamination2}
                    defaultVal={OptionCustomerPortraitDigestiveExamination2[0]}
                    value={dataGastrointestinal.serviceExperience}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        serviceExperience: data,
                      })
                    }
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Có hay đi khám định kỳ không?"
                        : valueSurveyPortrait?.data?.card?.q3 ??
                        "Có hay đi khám định kỳ không?"
                    }
                  />
                  <GroupRadio
                    options={OptionYesNo}
                    defaultVal={OptionYesNo[0]}
                    value={dataGastrointestinal.regularCheckups}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        regularCheckups: data,
                      })
                    }
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Lần khám trước cách đây bao lâu?"
                        : valueSurveyPortrait?.data?.card?.q4 ??
                        "Lần khám trước cách đây bao lâu?"
                    }
                  />
                  <Input
                    id=""
                    value={dataGastrointestinal.lastCheckup}
                    variant="simple"
                    onChange={(event) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        lastCheckup: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Tiền sử bệnh:"
                        : valueSurveyPortrait?.data?.card?.q5 ?? "Tiền sử bệnh:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Triệu chứng của khách hàng như thế nào...!"
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        medicalHistory: e.target.value,
                      })
                    }
                    isResize={false}
                    value={dataGastrointestinal.medicalHistory}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Bệnh sử:"
                        : valueSurveyPortrait?.data?.card?.q6 ?? "Bệnh sử:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Bệnh sử của khách hàng như thế nào...!"
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        pastMedicalHistory: e.target.value,
                      })
                    }
                    isResize={false}
                    value={dataGastrointestinal.pastMedicalHistory}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Có triệu chứng bất thường gần đây không:"
                        : valueSurveyPortrait?.data?.card?.q7 ??
                        "Có triệu chứng bất thường gần đây không:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Triệu chứng của khách hàng như thế nào...!"
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        symptomsRecently: e.target.value,
                      })
                    }
                    isResize={false}
                    value={dataGastrointestinal.symptomsRecently}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Thông tin khác"
                        : valueSurveyPortrait?.data?.card?.q8 ??
                        "Thông tin khác"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Các thông tin khác...!"
                    value={dataGastrointestinal.other}
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        other: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
              </div>
            )}
            {dataForm?.portraitSurveyType == "CSBSCD" && ( //BSCD
              <div className="m-form_add_customer_customerPortrait_generalExamination">
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Cô/Chú đã được Bác sĩ gặp mặt để thăm khám chưa?"
                        : valueSurveyPortrait?.data?.card?.q11 ??
                        "Cô/Chú đã được Bác sĩ gặp mặt để thăm khám chưa?"
                    }
                  />
                  <GroupRadio
                    options={OptionYesNo}
                    defaultVal={OptionYesNo[0]}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        consultation: data,
                      })
                    }
                    value={dataGastrointestinal.consultation}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item m-form_add_customer_customerPortrait_generalExamination_item_custom">
                  <Typography
                    content={
                      !isUpdate
                        ? "Bác sĩ đã tư vấn và chỉ định cho cô/ chú đến Doctor Check để thực hiện dịch vụ sau có đúng không?"
                        : valueSurveyPortrait?.data?.card?.q3 ??
                        "Bác sĩ đã tư vấn và chỉ định cho cô/ chú đến Doctor Check để thực hiện dịch vụ sau có đúng không?"
                    }
                  />
                  <GroupCheckBox
                    options={OptionGroupCheckboxTypedigestiveExamination}
                    onChange={(any: any) => {
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        typeEndoscopy: any,
                      });
                    }}
                    defaultVal={[]}
                    values={dataGastrointestinal.typeEndoscopy}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Bác sĩ tư vấn cho Cô/Chú là uống thuốc xổ tại nhà hay uống thuốc xổ tại Phòng khám?"
                        : valueSurveyPortrait?.data?.card?.q4 ??
                        "Bác sĩ tư vấn cho Cô/Chú là uống thuốc xổ tại nhà hay uống thuốc xổ tại Phòng khám?"
                    }
                  />
                  <GroupRadio
                    options={OptionPostion}
                    defaultVal={OptionPostion[0]}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        takeMedication: data,
                      })
                    }
                    value={dataGastrointestinal.takeMedication}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Cô/Chú đã có tài liệu hướng dẫn uống thuốc xổ chưa?"
                        : valueSurveyPortrait?.data?.card?.q5 ??
                        "Cô/Chú đã có tài liệu hướng dẫn uống thuốc xổ chưa?"
                    }
                  />
                  <GroupRadio
                    options={OptionYesNo}
                    defaultVal={OptionYesNo[0]}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        medicationInstructions: data,
                      })
                    }
                    value={dataGastrointestinal.medicationInstructions}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Mấy giờ Cô/Chú đến Phòng khám?"
                        : valueSurveyPortrait?.data?.card?.q6 ??
                        "Mấy giờ Cô/Chú đến Phòng khám?"
                    }
                  />
                  <CDatePickers
                    placeholder="Lưu ý đến sớm để kịp uống thuốc xổ."
                    variant="style"
                    isShowTime
                    fomat="DD/MM/YYYY HH:mm"
                    ValDefault={dataForm.dateBooking}
                    handleOnChange={(date: any) => {
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        time: date,
                      });
                    }}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Đã nhắn khách hàng nhịn ăn, uống trước khi lấy máu xét nghiệm, nội soi."
                        : valueSurveyPortrait?.data?.card?.q7 ??
                        "Đã nhắn khách hàng nhịn ăn, uống trước khi lấy máu xét nghiệm, nội soi."
                    }
                  />
                  <GroupRadio
                    options={OptionYesNo}
                    defaultVal={OptionYesNo[0]}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        documentBeforeEndoscopy: data,
                      })
                    }
                    value={dataGastrointestinal.documentBeforeEndoscopy}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Đã Hướng dẫn khách hàng đường đi tới Phòng khám."
                        : valueSurveyPortrait?.data?.card?.q8 ??
                        "Đã Hướng dẫn khách hàng đường đi tới Phòng khám."
                    }
                  />
                  <GroupRadio
                    options={OptionYesNo}
                    defaultVal={OptionYesNo[0]}
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        documentRoadmap: data,
                      })
                    }
                    value={dataGastrointestinal.documentRoadmap}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Thông tin khác"
                        : valueSurveyPortrait?.data?.card?.q9 ??
                        "Thông tin khác"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Các thông tin khác...!"
                    value={dataGastrointestinal.other}
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        other: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
              </div>
            )}
            {dataForm?.portraitSurveyType == "NS" && ( //Tiêu Hóa
              <div className="m-form_add_customer_customerPortrait_digestiveExamination">
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Anh/chị có sử dụng BHYT hoặc BHTN không?"
                        : valueSurveyPortrait?.data?.card?.q11 ??
                        "Anh/chị có có sử dụng BHYT hay BHTN không?"
                    }
                  />
                  <Dropdown
                    dropdownOption={OptionBH}
                    variant="simple"
                    values={dataGastrointestinal.bh}
                    handleSelect={(item) => {
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        bh: item,
                      });
                    }}
                  />
                </div>
                {(dataGastrointestinal.bh?.value == "2" ||
                  dataGastrointestinal.bh?.value == "3") && (
                    <div className="m-form_add_customer_customerPortrait_generalExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? `Anh/chi đăng ký ${(dataGastrointestinal.bh?.label as any) ||
                            "Bảo hiểm"
                            } ở đâu`
                            : valueSurveyPortrait?.data?.card?.q12 ??
                            `Anh/chi đăng ký ${(dataGastrointestinal.bh?.label as any) ||
                            "Bảo hiểm"
                            } ở đâu`
                        }
                      />
                      <Input
                        id=""
                        value={dataGastrointestinal.bh_where}
                        variant="simple"
                        onChange={(event) => {
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            bh_where: event.target.value,
                          });
                        }}
                      />
                    </div>
                  )}
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Bệnh lý của Khách Hàng:"
                        : valueSurveyPortrait?.data?.card?.q2 ??
                        "Bệnh lý của Khách Hàng:"
                    }
                  />
                  <div style={{ width: "80%" }}>
                    <GroupCheckBox
                      options={OptionGroupCheckbox}
                      onChange={(any: any) => {
                        setDataGastrointestinal({
                          ...dataGastrointestinal,
                          customerIllness: any,
                        });
                      }}
                      defaultVal={[]}
                      values={dataGastrointestinal.customerIllness}
                    />
                  </div>
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Triệu chứng:"
                        : valueSurveyPortrait?.data?.card?.q3 ?? "Triệu chứng:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Triệu chứng của khách hàng như thế nào...!"
                    value={(dataGastrointestinal?.symptoms as any) || undefined}
                    handleOnchange={(e) => {
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        symptoms: e.target.value,
                      });
                    }}
                    isResize
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Tiền sử bệnh:"
                        : valueSurveyPortrait?.data?.card?.q4 ?? "Tiền sử bệnh:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Triệu chứng của khách hàng như thế nào...!"
                    value={
                      (dataGastrointestinal?.medicalHistory as any) || undefined
                    }
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        medicalHistory: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Bệnh sử:"
                        : valueSurveyPortrait?.data?.card?.q5 ?? "Bệnh sử:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    value={
                      (dataGastrointestinal?.pastMedicalHistory as any) ||
                      undefined
                    }
                    placeholder="Bệnh sử của khách hàng như thế nào...!"
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        pastMedicalHistory: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Khách hàng đã bị bao lâu rồi"
                        : valueSurveyPortrait?.data?.card?.q6 ??
                        "Khách hàng đã bị bao lâu rồi"
                    }
                  />
                  <Input
                    id=""
                    variant="simple"
                    value={(dataGastrointestinal?.time as any) || undefined}
                    onChange={(event) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        time: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Đã từng điều trị ở đâu chưa"
                        : valueSurveyPortrait?.data?.card?.q7 ??
                        "Đã từng điều trị ở đâu chưa"
                    }
                  />
                  <Input
                    id=""
                    variant="simple"
                    value={
                      (dataGastrointestinal?.treatmentElsewhere as any) ||
                      undefined
                    }
                    onChange={(event) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        treatmentElsewhere: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Khách hàng đã nội soi?"
                        : valueSurveyPortrait?.data?.card?.q8 ??
                        "Khách hàng đã nội soi?"
                    }
                  />
                  <GroupRadio
                    options={OptionCustomerPortraitDigestiveExamination2}
                    defaultVal={OptionCustomerPortraitDigestiveExamination2[0]}
                    value={
                      (dataGastrointestinal?.endoscopy as any) || undefined
                    }
                    handleOnchangeRadio={(data) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        endoscopy: data,
                      })
                    }
                  />
                </div>
                {dataGastrointestinal.endoscopy?.id === 2 && (
                  <div className="m-form_add_customer_customerPortrait_digestiveExamination_noisoi">
                    <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? "Loại nội soi"
                            : valueSurveyPortrait?.data?.card?.q8_1 ??
                            "Loại nội soi"
                        }
                      />
                      <GroupCheckBox
                        options={OptionGroupCheckboxTypedigestiveExamination}
                        onChange={(any: any) => {
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            typeEndoscopy: any,
                          });
                        }}
                        defaultVal={[]}
                        values={dataGastrointestinal.typeEndoscopy}
                      />
                    </div>
                    <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? "Lần nội soi gần nhất"
                            : valueSurveyPortrait?.data?.card?.q8_2 ??
                            "Lần nội soi gần nhất"
                        }
                      />
                      <Input
                        variant="simple"
                        id=""
                        value={dataGastrointestinal.recentEndoscopy}
                        onChange={(event) =>
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            recentEndoscopy: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? "Kết quả của lần nội soi gần nhất"
                            : valueSurveyPortrait?.data?.card?.q8_3 ??
                            "Kết quả của lần nội soi gần nhất"
                        }
                      />
                      <TextArea
                        id=""
                        readOnly={false}
                        placeholder="Kết quả của lần nội soi gần nhất thế nào...!"
                        value={
                          (dataGastrointestinal?.resultConsultation as any) ||
                          undefined
                        }
                        handleOnchange={(e) =>
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            resultConsultation: e.target.value,
                          })
                        }
                        isResize={false}
                      />
                    </div>
                    <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                      <Typography
                        content={
                          !isUpdate
                            ? "Hiệu quả như thế nào"
                            : valueSurveyPortrait?.data?.card?.q8_3 ??
                            "Kết quả như thế nào"
                        }
                      />
                      <GroupRadio
                        options={
                          OptionCustomerPortraitDigestiveExamination_noisoi1
                        }
                        defaultVal={
                          OptionCustomerPortraitDigestiveExamination_noisoi1[0]
                        }
                        value={dataGastrointestinal.resultEndoscopy}
                        handleOnchangeRadio={(data) =>
                          setDataGastrointestinal({
                            ...dataGastrointestinal,
                            resultEndoscopy: data,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Mong muốn của khách hàng:"
                        : valueSurveyPortrait?.data?.card?.q9 ??
                        "Mong muốn của khách hàng:"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Mong muốn...!"
                    value={
                      (dataGastrointestinal?.expectations as any) || undefined
                    }
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        expectations: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
                <div className="m-form_add_customer_customerPortrait_digestiveExamination_item">
                  <Typography
                    content={
                      !isUpdate
                        ? "Thông tin khác"
                        : valueSurveyPortrait?.data?.card?.q10 ??
                        "Thông tin khác"
                    }
                  />
                  <TextArea
                    id=""
                    readOnly={false}
                    placeholder="Các thông tin khác...!"
                    value={(dataGastrointestinal?.other as any) || undefined}
                    handleOnchange={(e) =>
                      setDataGastrointestinal({
                        ...dataGastrointestinal,
                        other: e.target.value,
                      })
                    }
                    isResize={false}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="m-form_add_customer_null">
            <Loading />
          </div>
        )}
      </div>
    ),
    [dataForm, customerPortrait, isOpenPopup, dataGastrointestinal]
  );

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
          {record === "Khám Nội" &&
            dataForm?.typeBooking?.value === "package" ? (
            <></>
          ) : (
            <Icon
              iconName="delete_item"
              onClick={() => {
                const newList = serviceSelected.filter(
                  (i) => i.service_id !== data.service_id
                );
                setServiceSelected(newList);
              }}
            />
          )}
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
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "400", "center", "main"]}
          />
        </div>
      ),
    },
    // đây là giá tiền tưng ứng dịch vụ đó
    {
      title: (
        <Typography
          content="Thành tiền"
          modifiers={["14x20", "500", "center", "capitalize"]}
        />
      ),
      dataIndex: "service_prices",
      align: "center",
      width: 120,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography
            content={record?.toLocaleString("vi-VN")}
            modifiers={["14x20", "400", "center"]}
          />
        </div>
      ),
    },
  ];
  // cái này là khi chọn dịch vụ lẻ thì 1 popup hiện lên, và khi tích chọn các dịch vụ muốn khám thì các dịch vụ sẽ được hiển thị bên phải màn hình
  // hàm này sử dụng useMemo có depen nên chỉ load dữ liệu khi lần đầu và
  const convertServiceSelected: any[] = [];

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
                <PublicTable
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
    );
  }, [serviceSelected, dataForm?.typeBooking?.value]);
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("User Name: John Doe", 10, 10);

    // Sample data as per your structure

    const tableBody: Row[] = [];

    convertServiceSelected.forEach((group) => {
      // Add parent row (Service Group)
      tableBody.push([
        {
          content: group.service_group_name,
          colSpan: 2,
          styles: {
            halign: "left",
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            // No `fontStyle` here, as it is not supported directly
          },
        },
      ]);

      // Add child rows (Service Group Items)
      group.service_group_item.forEach((item: any) => {
        tableBody.push([
          { content: "", styles: { cellPadding: 10 } }, // Indentation for child rows
          {
            content: item.service_name,
            styles: {
              cellPadding: 5,
              fontSize: 10,
              textColor: [0, 0, 0], // Black text color
              fillColor: [240, 240, 240], // Light gray background
            },
          },
        ]);
      });
    });

    autoTable(doc, {
      startY: 20,
      head: [["Service Group", "Service Name"]],
      body: tableBody,
      theme: "striped",
      styles: { cellPadding: 5, fontSize: 12 }, // Default styles
      columnStyles: {
        0: { halign: "left", fillColor: [255, 223, 186] }, // Custom style for first column
        1: { halign: "left", fillColor: [255, 255, 255] }, // Custom style for second column
      },
      margin: { top: 20 },
    });

    doc.save("services.pdf");
  };
  // Layout chính để điền các thông tin
  const extractNumber = (text: string) => {
    const match = text.match(/\d+(\.\d+)+/g); // Sử dụng Regular Expression để tìm số
    setTotalService(match?.[0] || "");
    return match?.[0]; // Xóa các dấu chấm và trả về số
  };
  return (
    <div className="m-form_add_customer_wrapper">
      {contextHolder}
      <CModal
        isOpen={isOpenPopup || false}
        onCancel={() => {
          if (handleClosePopup) {
            handleClosePopup();
          }
          setServiceSelected([]);
          setPackageSelected(undefined);
        }}
        widths={
          (!!isOpenPopup &&
            customerPortrait &&
            !_.isNull(dataForm.portraitSurveyType) &&
            stateBreakPoint > 1450) ||
            (!!isOpenPopup &&
              !!csPortrait &&
              !_.isNull(dataForm.portraitSurveyType) &&
              stateBreakPoint > 1450)
            ? 1500
            : 940
        }
        title={
          "Đặt lịch"
        }
        isHideFooter
        zIndex={10}
        style={{ zIndex: 1 }}
      >
        <div
          className={mapModifiers(
            "m-form_add_customer",
            (!!isOpenPopup &&
              customerPortrait &&
              !_.isNull(dataForm.portraitSurveyType) &&
              stateBreakPoint > 1450) ||
              (!!isOpenPopup &&
                !!csPortrait &&
                !_.isNull(dataForm.portraitSurveyType) &&
                stateBreakPoint > 1450)
              ? "full"
              : ""
          )}
        >
           {isLoadingB === false ? ( 
            <form>
              {!csPortrait && (
                <div className="m-form_add_customer_wrap">
                  <div
                    style={{
                      borderBottom: "1px solid #dee2e6",
                      marginBottom: "5px",
                    }}
                  >
                    <Typography
                      content="Thông tin đặt lịch"
                      modifiers={["13x18", "main", "500", "uppercase"]}
                      styles={{
                        fontSize: "14px",
                        color: "#353B41 ",
                        fontWeight: "600",
                      }}
                    />
                  </div>
               
                  
                    <div
                      className="m-form_add_customer_row gap_10 m-form_add_customer_row-origins"
                      style={{ marginBottom: "0px", maxHeight: "85px",gridTemplateColumns:"1fr 1fr 1fr 0.6fr",alignItems:"end" }}
                    >
                     <Dropdown
                                             dropdownOption={stateLaunchSourceGroups}
                                             isRequired
                                             placeholder={stateLaunchSourceGroups[0]?.label}
                                             defaultValue={valueUpdateCustomer?.source_group_id as DropdownData}
                                             label="Nhóm nguồn:"
                                             handleSelect={(item) => {
                                               setDataForm({ ...dataForm, originGroup: item });
                                               clearStateErrorForm("originGroup");
                                             }}
                                             variant="simple"
                                             error={errorForm.originGroup}
                                             className="form_origin"
                                             values={(dataForm.originGroup as any) || undefined}
                                           />
                                            <Dropdown
                                                                dropdownOption={stateLaunchSource}
                                                                isRequired
                                                                placeholder={stateLaunchSource[0]?.label}
                                                                defaultValue={valueUpdateCustomer?.origin as DropdownData}
                                                                label="Nguồn:"
                                                               handleSelect={(item) => {
                                                                  setDataForm(prev => ({ ...prev, origin: item , source:  undefined as unknown as DropdownData,}));
                                                                  handleGetSource(item?.value);
                                          
                                                                  const v = Number(item?.value);
                                                                 setNameSource([2, 3, 4, 12].includes(v) ? (item?.label ?? "") : [5].includes(v) ? "Nhân Viên" : "công ty");
                                                                 if ([2, 3, 4, 12, 5].includes(v))
                                                                 {
                                                                   setIsCompany(true)
                                                                 }
                                                                 else {
                                                                    setIsCompany(false)
                                                                 }
                                                                  
                                                                 clearStateErrorForm("origin");
                                                                 
                                                                }}
                                          
                                                                variant="simple"
                                                                error={errorForm.origin}
                                                                className="form_origin"
                                                                values={(dataForm.origin as any) || undefined}
                                                              />
                                           <Dropdown
                                             dropdownOption={stateLaunchSourceTypes}
                                             placeholder={stateLaunchSourceTypes[0]?.label}
                                             defaultValue={valueUpdateCustomer?.source_type_id as DropdownData}
                                             label="Hình thức chuyển đổi:"
                                             handleSelect={(item) => {
                                               setDataForm({ ...dataForm, originType: item });
                                               clearStateErrorForm("origin");
                                             }}
                                             variant="simple"
                                             className="form_origin"
                                             values={(dataForm.originType as any) || undefined}
                    />
                    <div style={{marginBottom:"5px"}}>
                       <Button
                            className="m-form_note"
                            onClick={() => {
                            handleGetListSourceCustomer()
                      }}
                     
                            modifiers={["foreign"]}
                      >
                        {
                          loading ? <span className="loaderB"></span> : <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
<svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.9998 8L6 14L12.9998 21" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                             <Typography
                              type="span"
                              modifiers={["400", "13x18"]}
                              content={
                                "Lấy lại nguồn"
                              }
                            /> 
                          </div>
                        }
                         
                       
                          </Button>
                   </div>
                  </div>
            { (<div
                                        className={`m-form_add_customer_row grid_1_1_1_1 grid_customize ${Number(dataForm?.origin?.value) === 4 &&
                                          "m-form_add_customer_row_optional"
                                          }`}
                                        style={{ alignItems: "center", marginBottom: "8px", gridTemplateColumns:((isNaN(Number(dataForm?.origin?.value)) || Number(dataForm?.origin?.value) === 1)) ?"1fr":  "0.3fr 1fr 0.1fr" ,display:"grid"}}
                                    >
                                      {
                                        ( Number(dataForm?.origin?.value) === 6 || Number(dataForm?.origin?.value) === 9 || Number(dataForm?.origin?.value) === 11 || Number(dataForm?.origin?.value) === 7  || Number(dataForm?.origin?.value) === 10  || Number(dataForm?.origin?.value) === 8  ) && (
                                           <Checkbox
                                          label="Khám doanh nghiệp:"
                                          isChecked={isCompany}
                                          onChange={() => {
                                            setIsCompany(!isCompany)
                                          }}
                                        />
                                        )
                                      }
                                      {
                                        (Number(dataForm?.origin?.value) === 2 || Number(dataForm?.origin?.value) === 3 || Number(dataForm?.origin?.value) === 4 || Number(dataForm?.origin?.value) === 5 || Number(dataForm?.origin?.value) === 12) && (
                                           <span>Chọn {nameSource === "KH Cũ Giới Thiệu (WoM)" ? "KH Cũ Giới Thiệu" : nameSource}: </span>
                                          )
                                      }
                                       {/* { (isNaN(Number(dataForm?.origin?.value)) || Number(dataForm?.origin?.value) === 1) && (
    <Checkbox
      label="Khám doanh nghiệp:"
      isChecked={isCompany}
                        onChange={() => setIsCompany(!isCompany)}
                        disabled
    />
)} */}
                                       <Dropdown
                                              dropdownOption={
                                                stateListS
                                              }
                                              values={dataForm.source}
                                              isRequired={false}
placeholder={
  !isCompany && (Number.isNaN(Number(dataForm?.origin?.value)) || [1,6,7,9,11,10].includes(Number(dataForm?.origin?.value)))
    ? ""
    : `Chọn ${nameSource || ""} tại đây ...`
}
                                        // defaultValue={
                                              //   valueUpdateCustomer?.origin as DropdownData
                                              // }
                                              // defaultValue={listAffiliates.find(
                                              //   (affi: any) =>
                                              //     affi.affiliate_code ===
                                              //     valUpdate?.source_first?.owner_id
                      // )}
                      
                                              label={
                                                Number(dataForm?.origin?.value) === 2 ? "" : ""
                                              }
                                        disabled={[2, 3,4,5,12].includes(Number(dataForm?.origin?.value)) ? false : !isCompany }
                                        handleSelect={(item) => {
                                    
                                         
                                          setOwnerType(item?.owner_type)
                                          setOwnerId(item?.owner_id)
                                          setDataForm({
                                            ...dataForm,
                                            source:item
                                             })
                                              }}
                                              variant="simple"
                                              className="form_origin"
                                            
                    />
                    {
                      ([2,3,4,5,6,7,8,9,10,11,12].includes(Number(dataForm?.origin?.value))) && (
                     <CTooltip
                                                                          placements="top"
                                                                          title="Tìm và chọn BSCĐ, WOM, Đối tác,..."
                                                     colorCustom="#04566e"
                                                     
                                                                        >
                                      <div
                          style={{display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}}
                            onClick={() => {
                            setOpenModalKeysearch(true)
                            }}
                          >
                          <svg fill="#000000" width="25px" height="25px" viewBox="0 0 24 24" id="add-user-3" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M19,8a1,1,0,0,1-1-1V6H17a1,1,0,0,1,0-2h1V3a1,1,0,0,1,2,0V4h1a1,1,0,0,1,0,2H20V7A1,1,0,0,1,19,8Z" style={{fill:"#2ca9bc"}}></path><path id="primary" d="M16.46,13.37a6.86,6.86,0,0,0,1.46-3.49,5,5,0,0,1-3.46-7A7,7,0,0,0,5.54,13.37,8,8,0,0,0,2,20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2A8,8,0,0,0,16.46,13.37Z" style={{fill:"#2ca9bc"}}></path></g></svg>
                          </div></CTooltip>)
                    }
                                    
                                      </div>
                                      )}
                   
                 
               
                 
                 
                
                
                </div>
              )}

              <div
                className="m-form_add_customer_check"
                style={{ marginTop: "0px" }}
              >
               
               
                  <div
                    className="m-form_add_customer_check_booking"
                    style={{ marginBottom: "0px" }}
                  >
                    <div
                      className="m-form_add_customer_check_booking_flex2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        {/* <div
                          onClick={() => {
                               setIsSelectService(true);
                            setTimeout(() => {
                              setOpenSelect(true);
                            }, 300);
                        }}
                        >
                          Chọn dịch vụ
                        </div> */}
                        <div style={{ width: "70%", marginTop: "5px" }}>
                          <Button
                            className="m-form_note"
                            onClick={() => {
                              setIsSelectService(true);
                              setTimeout(() => {
                                setOpenSelect(true);
                              }, 300);
                            }}
                            modifiers={["foreign"]}
                          >
                            <Typography
                              type="span"
                              modifiers={["400", "14x20"]}
                              content={
                                "Chọn dịch vụ" +
                                (serviceSelected.length === 0
                                  ? ""
                                  : ` (đã chọn: ${serviceSelected.length})`)
                              }
                            />
                          </Button>
                        </div>

                        <div className="m-form_add_customer_type_purpose">
                          <div
                            className={mapModifiers(
                              "m-form_add_customer_type_purpose_label",
                              !!errorForm.groupCs.trim() && "error"
                            )}
                            style={{ width: "16%" }}
                          >
                            <Typography
                              content="Nhóm:"
                              modifiers={[
                                "16x24",
                                !errorForm.groupCs.trim()
                                  ? "blueNavy"
                                  : "cg-red",
                                "500",
                              ]}
                            />
                          </div>
                          {/* Nếu props truyền vào là true thì có nghĩa là bác sĩ chỉ định nên sẽ k thể chọn loại dịch vụ */}
                          <GroupRadio
                            options={
                              !isUpdate
                                ? OptionCustomerPortraitAddNew
                                : valUpdate?.lead_source_display ===
                                  "Bác Sĩ Chỉ Định" ||
                                  dataForm?.origin?.value == "2"
                                  ? OptionCustomerPortrait1
                                  : OptionCustomerPortraitAddNew
                            }
                            value={(!isUpdate
                              ? OptionCustomerPortraitAddNew
                              : OptionCustomerPortrait1
                            ).find(
                              (i) =>
                                i.value ===
                                (valUpdate?.lead_source_display ===
                                  "Bác Sĩ Chỉ Định"
                                  ? "CSBSCD"
                                  : dataForm?.portraitSurveyType)
                            )}
                            handleOnchangeRadio={(data) => {
                              setPurposoerPackage(data);
                              setDataForm({
                                ...dataForm,
                                portraitSurveyType: data?.value,
                              });
                              clearStateErrorForm("groupCs");
                              if (isUpdate) {
                                dispatch(
                                  getGroupSurveyPortrait({
                                    customerId: dataForm.id,
                                    servey_type: data?.value,
                                  })
                                );
                              }
                            }}
                            isDisable={
                              isUpdate &&
                              valUpdate?.lead_source_display ===
                              "Bác Sĩ Chỉ Định"
                            }
                          />
                        </div>
                        {/* <div style={{width: "40%" }}>
                        <Dropdown
                      dropdownOption={stateNewFType}
                      isRequired
                      placeholder={stateNewFType[0]?.label}
                      // defaultValue={valueUpdateCustomer?.origin as DropdownData}
                      label="Loại khách hàng:"
                      handleSelect={(item) => {
                        setDataForm({ ...dataForm, f_type: item });
                        clearStateErrorForm("f_type");
                      }}
                      variant="simple"
                      error={errorForm.f_type}
                      className="form_origin"
                      values={(dataForm.f_type as any) || undefined}
                    />
                        </div> */}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          width: "50%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center",
                            width: "auto",
                            marginBottom: "5px",
                          }}
                        >
                          <p style={{ marginTop: "5px", marginRight: "4px" }}>
                            Tổng giá trị dịch vụ đã chọn:{" "}
                          </p>
                          <p
                            style={{
                              marginTop: "5px",
                              marginRight: "4px",
                              color: "#ff0000",
                            }}
                          >
                            {totalService}
                          </p>
                        </div>
                        {/* <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            width: "100%",
                          }}
                        >
                          <p style={{ marginTop: "5px", marginRight: "3px" }}>
                            Chọn mã chiết khấu (nếu có):{" "}
                          </p>

                          <div style={{ width: "60%" }}>
                            <Dropdown
                              dropdownOption={
                                stateVoucherTypes as DropdownData[]
                              }
                              placeholder="Mã chiết khấu"
                              label=""
                              handleSelect={(item) => {
                                setDataForm({ ...dataForm, voucher: item });
                              }}
                              variant="simple"
                              values={(dataForm.voucher as any) || undefined}
                            />
                          </div>
                        </div> */}
                     
                        {/* <div
                          style={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center",
                            width: "auto",
                            marginBottom: "5px",
                          }}
                        >
                          <p style={{ marginTop: "5px", marginRight: "4px" }}>
                            Mã giảm giá:{" "}
                          </p>
                          <p
                            style={{
                              marginTop: "5px",
                              marginRight: "4px",
                              color: "#ff0000",
                            }}
                          >
                            {dataForm.voucher?.id !== undefined &&
                              dataForm.voucher?.id !== null
                              ? `[${dataForm.voucher?.id}] - ${Number(
                                dataForm.voucher?.valueV
                              ).toLocaleString("vn-VN")}đ`
                              : "Chưa chọn mã giảm giá"}
                          </p>
                        </div> */}
                      </div>
                    </div>
                    <div
                      className="m-form_add_customer_check_booking_flex"
                      style={{ marginTop: "5px" }}
                    >
                      <div>
                        <CDatePickers
                          label="Ngày đặt hẹn:"
                          handleOnChange={(date: any) => {
                            setDataForm({ ...dataForm, dateBooking: date?.$d });
                            setErrorForm({ ...errorForm, dateBooking: "" });
                          }}
                          variant="simple"
                          format={"DD-MM-YYYY HH:mm"}
                          isShowTime
                          placeholder="08:00 - 12/01/2023"
                          ValDefault={dataForm.dateBooking}
                          value={dataForm.dateBooking as Date}
                          error={errorForm.dateBooking}
                        />
                      </div>
                    
                      <Input
                        id="note_booking"
                        label="Ghi chú"
                        type="text"
                        variant="simple"
                        placeholder="Ghi chú lịch đặt hẹn khám ..."
                        value={dataForm.noteBooking}
                        onChange={(e) => {
                          setDataForm({
                            ...dataForm,
                            noteBooking: e.target.value,
                          });
                          setErrorForm({ ...errorForm, noteBooking: "" });
                        }}
                        error={errorForm.noteBooking}
                      />
                    </div>
                    {dataForm.typeBooking?.value === "telemedicine" && (
                      <div className="flex-item">
                        <Dropdown
                          dropdownOption={listDoctoronline || []}
                          defaultValue={valUpdate?.origin as DropdownData}
                          label="Bác sĩ online"
                          placeholder="Chọn 1 bác sĩ"
                          handleSelect={(item) => {
                            setDataForm({
                              ...dataForm,
                              serviceAllowTypeBooking1: item,
                            });
                            setErrorForm({ ...errorForm, bookingService1: "" });
                          }}
                          variant="simple"
                          values={dataForm.serviceAllowTypeBooking1}
                          error={errorForm.bookingService1}
                          isRequired
                        />
                      </div>
                    )}

                    {dataForm.typeBooking?.value === "endoscopics" && (
                      <Dropdown
                        dropdownOption={stateEndoscopics}
                        label="Dịch vụ nội soi"
                        placeholder="Chọn dịch vụ để đặt lịch"
                        handleSelect={(item) => {
                          setDataForm({
                            ...dataForm,
                            endoscopics: item,
                            noteBooking: item.label,
                          });
                          setErrorForm({ ...errorForm, noteBooking: "" });
                        }}
                        variant="simple"
                        values={dataForm.endoscopics}
                        error={errorForm.endoscopics}
                        isRequired
                      />
                    )}
                  </div>
             
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    {/* {!csPortrait && (
                      <Checkbox
                        label="Chăm sóc trước khám"
                        isChecked={customerPortrait}
                        onChange={() => {
                          if (_.isEmpty(dataForm.portraitSurveyType)) {
                            toast.warning("Vui lòng chọn nhóm khách hàng");
                          } else {
                            setCustomerPortrait(!customerPortrait);
                          }
                        }}
                      />
                    )}
                    {!csPortrait && (
                      <div style={{ marginLeft: "30px" }}>
                        <Checkbox
                          label="Kiểm tra BHYT?"
                          isChecked={isCheckInsurance}
                          onChange={(check: any) => {
                            setIsCheckInsurance(!isCheckInsurance);
                          }}
                        />
                      </div>
                    )} */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    {dataForm?.typeBooking?.value === "package" &&
                      notePackage !== "" ? (
                      <p
                        style={{
                          marginRight: "4px",
                          color: "#ff0000",
                        }}
                      >
                        Bạn đã chọn: {removeParenthesesContent(notePackage)}
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
                    )}
                  </div>
                </div>
                {isCheckInsurance && (
                  <div className="m-form_add_customer_check_insurance">
                    <div className="m-form_add_customer_check_insurance_wrap_form">
                      <div style={{ marginBottom: "17px", width: "150%" }}>
                        <Input2
                          id="note_booking"
                          label="Họ tên:"
                          type="text"
                          isRequired
                          variant="simple"
                          placeholder="Nguyễn Văn A ..."
                          value={dataForm.name}
                          onChange={(e) => {
                            setDataForm({
                              ...dataForm,
                              name: e.target.value,
                            });
                            setInsuranceErr({
                              ...insuranceErrr,
                              fullName: "",
                            });
                          }}
                          error={insuranceErrr.fullName}
                        />{" "}
                      </div>
                      <div style={{ marginBottom: "17px", width: "150%" }}>
                        <Input2
                          id="note_booking"
                          label="CCCD/ Mã thẻ BHYT:"
                          type="text"
                          variant="simple"
                          placeholder="024E834..."
                          value={dataForm.customerId}
                          onChange={(e) => {
                            setDataForm({
                              ...dataForm,
                              customerId: e.target.value,
                            });
                            setInsuranceErr({
                              ...insuranceErrr,
                              idcard: "",
                            });
                          }}
                          error={insuranceErrr.idcard}
                        />
                      </div>
                      <div style={{ marginBottom: "17px", width: "150%" }}>
                        <Input2
                          id="date"
                          isRequired
                          label="Ngày sinh:"
                          type="text"
                          variant="simple"
                          placeholder="19/10/2020"
                          onChange={(e) => {
                            setDataForm({
                              ...dataForm,
                              dayOfBirthBHYT: e.target.value,
                            });
                            setInsuranceErr({
                              ...insuranceErrr,
                              dayOfBirth: "",
                            });
                          }}
                          error={insuranceErrr.dayOfBirth}
                          ValDefault={dataForm.dayOfBirthBHYT}
                        // onChangInput={() => clearStateErrorForm("dayOfBirth")}
                        />
                      </div>
                      <div className="m-form_add_customer_check_insurance_btn_wrap">
                        <div
                          className={mapModifiers(
                            "m-form_add_customer_check_insurance_btn",
                            isCheckInsuranceSuccess && "pendding"
                          )}
                          onClick={handleCheckInsurance}
                          style={{ marginTop: "4px", marginLeft: "20px" }}
                        >
                          {isCheckInsuranceSuccess ? (
                            <Icon iconName={"loading_crm"} isPointer />
                          ) : (
                            <Typography content="Kiểm tra ngay" />
                          )}
                        </div>
                      </div>
                    </div>
                    {insuranceData.content && (
                      <div
                        className={mapModifiers(
                          "m-form_add_customer_check_insurance_wrap_result",
                          insuranceData ? "green" : "red"
                        )}
                      >
                        {insuranceData.content}
                      </div>
                    )}
                  </div>
                )}
                {/* {!csPortrait && ( (showDVK?.label && showDVK.label === "Tùy chọn") || (showDVK?.label && showDVK.label === "Gói + Tùy chọn")) && (isUpdate  || !isEmpty(serviceSelected)) && (
                  <Checkbox
                      label="Xem dịch vụ lẻ đã chỉ định"
                      isChecked={customerPortrait}
                      onChange={(data: any) => {
                        console.log(data)
                        setIsSelectService(data);
                         setTimeout(() => {
                                 setOpenSelect(true)
                              }, 300);  
                      }}
                    />  
                  )} */}
              </div>
              {stateBreakPoint <= 1450 ? renderPortrait : null}
              <div className="m-form_add_customer_button">
                <div
                  className="m-form_note"
                  onClick={() => {
                    if (handleClose) handleClose();
                    clearStateForm();
                    setServiceSelected([]);
                    setPackageSelected(undefined);
                  }}
                  style={{
                    width: "80px",
                    background: "#e43434",
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
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={imgClose}
                    alt=""
                    sizes="20"
                    style={{
                      height: "19px",
                      width: "19px",
                      marginRight: "3px",
                    }}
                  />{" "}
                  <Typography content="Hủy" modifiers={["400"]} />
                </div>
                <div
                  className="m-form_note"
                  style={{
                    width: "fit-content",
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
                    cursor: "pointer",
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
                      height: "20px",
                      width: "20px",
                      marginRight: "5px",
                    }}
                  />{" "}
                  <Typography
                    type="span"
                    modifiers={["400", "16x24"]}
                    content={"Đặt lịch"}
                    styles={{ marginBottom: "2px" }}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="m-form_add_customer_null">
            <Loading />
            </div>
         )}
          {stateBreakPoint > 1450 ? renderPortrait : null}
        </div>
      </CModal>
      {isUsedDrawer ? (
        <CModal
          isOpen={isSelectService}
          onCancel={() => {
            setIsSelectService(false);
          }}
          widths={"100vw"}
          isHideFooter
          isHeight
        >
          <div className="m-form_add_customer-booking_box">
            <div
              className="m-form_add_customer-booking_box_header"
              style={{ alignItems: "end", justifyContent: "space-between" }}
            >
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <CDatePickers
                  label="Ngày đặt hẹn:"
                  handleOnChange={(date: any) => {
                    setDataForm({ ...dataForm, dateBooking: date?.$d });
                    setErrorForm({ ...errorForm, dateBooking: "" });
                  }}
                  variant="simple"
                  format={"DD-MM-YYYY HH:mm"}
                  isShowTime
                  placeholder="08:00 - 12/01/2023"
                  ValDefault={dataForm.dateBooking}
                  value={dataForm.dateBooking as Date}
                />

                <Dropdown3
                  dropdownOption={listServicesAllowGroup?.flatMap((item) =>
                    item.service_group_item.map((serviceItem: any) => ({
                      label: (
                        <span>
                          {serviceItem.service_name} (
                          {serviceItem.service_prices.toLocaleString()} VND){" "}
                          {""}
                          <span
                            style={{
                              backgroundColor:
                                serviceItem.product_status === "NEW"
                                  ? "red"
                                  : "transparent",
                              color:
                                serviceItem.product_status === "NEW"
                                  ? "white"
                                  : "transparent",
                              padding: "4px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            {serviceItem.product_status === "NEW"
                              ? "Mới"
                              : "Cũ"}
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
                    handleConvertServiceSelected(item.value2 as any, true);
                  }}
                  variant="simple"
                  values={undefined}
                  defaultValue={undefined}
                />

                <Dropdown
                  dropdownOption={[
                    {
                      id: 99,
                      label: "Dịch vụ lẻ (không dùng gói)",
                      value: "no-package",
                    },
                    ...listPackages,
                  ]}
                  defaultValue={valUpdate?.origin as DropdownData}
                  isOpen={false}
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
                        noteBooking: "",
                        typeBooking: e,
                      });
                      setServicePackageId("");
                      setNotePackage("");
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
                        noteBooking: item.label,
                        typeBooking: e,
                      });

                      setServicePackageId(item.value);
                      setNotePackage(item.label);
                    }
                  }}
                  variant="simple"
                  values={
                    notePackage === ""
                      ? {
                        id: 99,
                        label: "Dịch vụ lẻ (không dùng gói)",
                        value: "no-package",
                      }
                      : packageSelected
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "5px" }}>
                <div
                  // onClick={() => {
                  //   if (isCloseB === true) {
                  //     setIsSelectService(false);
                  //   } else {
                  //     setIsSelectService(false);
                  //     setServicePackageId("");
                  //     setNotePackage("");
                  //     setServiceSelected([]);
                  //   }
                  // }}
                  onClick={() => {
                    if (dataForm?.typeBooking?.value === "package") {
                      if (notePackage === "") {
                        toast.error("Hãy chọn 1 gói dịch vụ!");
                      } else {
                        setIsSelectService(false);
                        // setIsCloseB(true);
                      }
                    } else {
                      if (serviceSelected.length !== 0) {
                        setIsSelectService(false);
                        // setIsCloseB(true);
                      } else {
                        toast.error("Bạn chưa chọn dịch vụ nào!");
                      }
                    }
                  }}
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
                    cursor: "pointer",
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
                  <Typography content="Lưu & Đóng" modifiers={["400"]} />
                </div>
                <div
                  onClick={() => {
                    setIsDelete(true);
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
                    cursor: "pointer",
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
                    setServicePackageId("");
                    setNotePackage("");
                    setServiceSelected([]);
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
                      noteBooking: "",
                      typeBooking: e,
                    });
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
                    cursor: "pointer",
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
            <div
              className="m-form_add_customer-booking_box_body"
              style={{ height: "calc(85vh - 110px)" }}
            >
              <div className="m-form_add_customer-booking_box_service">
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
              {memoriesTableSelected}
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              {dataForm?.typeBooking?.value === "package" &&
                notePackage !== "" ? (
                <p
                  style={{
                    marginRight: "4px",
                    color: "#ff0000",
                  }}
                >
                  Bạn đã chọn:{" "}
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {removeParenthesesContent(notePackage)}
                    {/* (
    {new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 })
      .format(Number(totalPackage))
      .replace(/\./g, ",")}
                      ) */}
                  </span>{" "}
                  - Tổng số dịch vụ đã chọn:{" "}
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {serviceSelected.length}
                  </span>{" "}
                  - Tổng số tiền:
                  <span style={{ fontWeight: "600" }}> {totalService} </span>
                </p>
              ) : (
                <p
                  style={{
                    marginRight: "4px",
                    color: "#ff0000",
                  }}
                >
                  Tổng giá dịch vụ bạn đã chọn: {totalService}
                </p>
              )}
            </div>
          </div>
        </CModal>
      ) : (
        <CModal
          isOpen={isSelectService}
          onCancel={() => {
            setIsSelectService(false);
          }}
          widths={"100vw"}
          isHideFooter
          isHeight
        >
          <div className="m-form_add_customer-booking_box">
            <div
              className="m-form_add_customer-booking_box_header"
              style={{ alignItems: "end", justifyContent: "space-between" }}
            >
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <CDatePickers
                  label="Ngày đặt hẹn:"
                  handleOnChange={(date: any) => {
                    setDataForm({ ...dataForm, dateBooking: date?.$d });
                    setErrorForm({ ...errorForm, dateBooking: "" });
                  }}
                  variant="simple"
                  format={"DD-MM-YYYY HH:mm"}
                  isShowTime
                  placeholder="08:00 - 12/01/2023"
                  ValDefault={dataForm.dateBooking}
                  value={dataForm.dateBooking as Date}
                />
                <Dropdown3
                  // dropdownOption={listServicesAllowGroup?.flatMap(
                  //   (item) => item.service_group_item
                  // )}
                  // dropdownOption={listServicesAllowGroup?.flatMap(
                  //   (item) => item.service_group_item
                  // )}
                  dropdownOption={listServicesAllowGroup?.flatMap((item) =>
                    item.service_group_item.map((serviceItem: any) => ({
                      label: (
                        <span>
                          {serviceItem.service_name} (
                          {serviceItem.service_prices.toLocaleString()} VND){" "}
                          {""}
                          <span
                            style={{
                              backgroundColor:
                                serviceItem.product_status === "NEW"
                                  ? "red"
                                  : "transparent",
                              color:
                                serviceItem.product_status === "NEW"
                                  ? "white"
                                  : "transparent",
                              padding: "4px 6px",
                              borderRadius: "6px",
                            }}
                          >
                            {serviceItem.product_status === "NEW"
                              ? "Mới"
                              : "Cũ"}
                          </span>
                        </span>
                      ),
                      value: serviceItem.service_id,
                      value2: serviceItem,
                      searchText: `${serviceItem.service_name}  (${serviceItem.service_prices})`, // Chuỗi để tìm kiếm
                    }))
                  )}
                  label="Tìm kiếm dịch vụ"
                  placeholder="Nhập tên dịch vụ cần tìm..."
                  handleSelect={(item) => {
                    handleConvertServiceSelected(item.value2 as any, true);
                  }}
                  variant="simple"
                  values={undefined}
                  // catch me if you can
                  defaultValue={undefined}
                />

                <Dropdown
                  dropdownOption={[
                    {
                      id: 99,
                      label: "Dịch vụ lẻ (không dùng gói)",
                      value: "no-package",
                    },
                    ...listPackages,
                  ]}
                  defaultValue={
                    {
                      color: "#dc3545",
                      department_id: "PK01",
                      id: "KHAMDV122301",
                      index: 3,
                      is_exams: false,
                      is_register_package: false,
                      is_register_subclinical: true,
                      label: "Dịch vụ lẻ (không dùng gói)",
                      register_type_id: "KTQ",
                      value: "services",
                    } as DropdownData
                  }
                  isOpen={false}
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
                      setServicePackageId("");
                      setNotePackage("");
                      setDataForm({
                        ...dataForm,
                        noteBooking: "",
                        typeBooking: e,
                      });
                      // setServiceSelected([]);
                    } else {
                      const getPackageById = statePackagesWithItem.find(
                        (i) => i.package_id === item.id
                      );
                      setServiceSelected(getPackageById?.items);
                      setPackageSelected(item);

                      setServicePackageId(item.value);
                      setNotePackage(item.label);

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
                      setDataForm({
                        ...dataForm,
                        noteBooking: item.label,
                        typeBooking: e,
                      });
                    }
                  }}
                  variant="simple"
                  values={
                    notePackage === ""
                      ? {
                        id: 99,
                        label: "Dịch vụ lẻ (không dùng gói)",
                        value: "no-package",
                      }
                      : packageSelected
                  }
                // disabled={dataForm.typeBooking?.value !== "package"}
                />
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <div
                  // onClick={() => {
                  //   setNotePackage(
                  //     valueUpdateCustomer?.master?.appointment_note
                  //   );
                  //   const listServices = listServicesAllowGroup?.flatMap(
                  //     (item) => item.service_group_item
                  //   );
                  //   if (
                  //     valUpdate?.master?.appointment_type === "services" ||
                  //     valUpdate?.master?.appointment_type ===
                  //       "packageservice" ||
                  //     valUpdate?.master?.appointment_type === "package"
                  //   ) {
                  //     const currentListService = handleUpdateListService(
                  //       listServices,
                  //       valUpdate?.master?.ids
                  //     );
                  //     const packageId = valUpdate?.master?.package_id;

                  //     const selectedPackage = listPackages.find(
                  //       (pkg) => pkg.id === packageId
                  //     );

                  //     if (selectedPackage) {
                  //       setPackageSelected(selectedPackage);
                  //       console.log("Đối tượng tìm thấy:", selectedPackage);
                  //       // Bạn có thể làm các thao tác với `selectedPackage` ở đây.
                  //     } else {
                  //       console.log(
                  //         "Không tìm thấy gói dịch vụ có id phù hợp."
                  //       );
                  //     }
                  //     setServiceSelected(currentListService as ServiceItem[]);
                  //   }

                  //   setDataForm({
                  //     ...dataForm,
                  //     noteBooking:
                  //       valueUpdateCustomer?.master?.appointment_note,
                  //     typeBooking:
                  //       valueUpdateCustomer?.master?.appointment_type ===
                  //       "services"
                  //         ? {
                  //             color: "#dc3545",
                  //             department_id: "PK01",
                  //             id: "KHAMDV122301",
                  //             index: 3,
                  //             is_exams: false,
                  //             is_register_package: false,
                  //             is_register_subclinical: true,
                  //             label: "Không gói dịch vụ",
                  //             register_type_id: "KTQ",
                  //             value: "services",
                  //           }
                  //         : {
                  //             color: "#28a745",
                  //             department_id: "PK01",
                  //             id: "KHAMDV122301",
                  //             index: 1,
                  //             is_exams: true,
                  //             is_register_package: true,
                  //             is_register_subclinical: false,
                  //             label: "Gói",
                  //             register_type_id: "KTQ",
                  //             value: "package",
                  //           },
                  //   });

                  //   setOpenSelect(false);
                  //   setIsSelectService(false);
                  // }}
                  onClick={() => {
                    if (dataForm?.typeBooking?.value === "package") {
                      if (notePackage === "") {
                        toast.error("Hãy chọn 1 gói dịch vụ!");
                      } else {
                        setIsSelectService(false);
                      }
                    } else {
                      if (serviceSelected.length !== 0) {
                        setIsSelectService(false);
                      } else {
                        toast.error("Bạn chưa chọn dịch vụ nào!");
                      }
                    }
                  }}
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
                    cursor: "pointer",
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
                  <Typography content="Lưu & Đóng" modifiers={["400"]} />
                </div>
                <div
                  onClick={() => {
                    setIsDelete(true);
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
                    cursor: "pointer",
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
                    cursor: "pointer",
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
              {/* <Button modifiers={['primary']}onClick={generatePDF}><Typography content='PDF' modifiers={['400']} /></Button> */}
            </div>
            <div
              className="m-form_add_customer-booking_box_body"
              style={{ height: "calc(85vh - 110px)" }}
            >
              <div className="m-form_add_customer-booking_box_service">
                {listServicesAllowGroup.length &&
                  listServicesAllowGroup.map((parent: any) => {
                    return (
                      <div
                        key={parent.service_group_id}
                        className="m-form_add_customer-booking_box_service_item"
                      >
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
              {memoriesTableSelected}
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              {dataForm?.typeBooking?.value === "package" &&
                notePackage !== "" ? (
                <p
                  style={{
                    marginRight: "4px",
                    color: "#ff0000",
                  }}
                >
                  Bạn đã chọn:{" "}
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {removeParenthesesContent(notePackage)}
                    {/* (
    {new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 })
      .format(Number(totalPackage))
      .replace(/\./g, ",")}
                        ) */}
                  </span>{" "}
                  - Tổng số dịch vụ đã chọn:{" "}
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {serviceSelected.length}
                  </span>{" "}
                  - Tổng số tiền:
                  <span style={{ fontWeight: "600" }}> {totalService} </span>
                </p>
              ) : (
                <p
                  style={{
                    marginRight: "4px",
                    color: "#ff0000",
                  }}
                >
                  Tổng giá dịch vụ bạn đã chọn: {totalService}
                </p>
              )}
            </div>
          </div>
        </CModal>
      )}
      {/* Đây là layout khi category "Nguồn" mà bấm chọn "KH Cũ Giới Thiệu (WoM)" và search xong tên Khách hàng cũ thì server trả về sẽ được map ra ở layout dưới (popup) */}
        <CModal
        isOpen={openModalKeysearch}
        onCancel={() => { setOpenModalKeysearch(false), setKeysearch("") }}
  title={`Tìm và chọn ${nameSource || ""}`}
        widths={800}
        isHideFooter

      >
        <div>
           <Input
                        variant="borderRadius"
                        type="text"
                        id=""
                        isSearch
                        value={keysearch}
                        placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng'
                        onChange={(e) => { setKeysearch(e.target.value); }}
                        handleEnter={async () => {
                          if (keysearch.trim()) {
                            await handleGetSource(dataForm.origin.value);
                            // setIsLoading(true);
                          }
                          else {
                            toast.error('Không thể tìm kiếm với một giá trị rỗng');
                          }
                        }}
                        iconName='search'
                        // isLoading={isLoading}
                      />
        </div>
        <PublicTable
          listData={stateListS}
          column={tableColumnForSearch}
          handleOnClick={(event: any, record: any, rowIndex: any) => { }}
          pageSizes={100}
          isHideRowSelect
           scroll={{
            x: '100%',
            y: '300px',
          }}
        />
      </CModal>
        <CModal
        isOpen={openModalSourceCustomer}
        onCancel={() => setOpenModalSourceCustomer(false)}
        title="Danh sách nhóm nguồn, nguồn, hình thức chuyển đổi cũ của khách hàng"
        widths={800}
        isHideFooter
      >
        <PublicTable
          listData={stateListSource}
          column={tableColumnListSource}
          handleOnClick={(event: any, record: any, rowIndex: any) => { }}
          pageSizes={100}
          isHideRowSelect
        />
      </CModal>
      <CModal
        isOpen={isDelete}
        widths={340}
        title=""
        onCancel={() => setIsDelete(false)}
        onOk={() => {
          setServicePackageId("");
          setNotePackage("");
          setServiceSelected([]);
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
            noteBooking: "",
            typeBooking: e,
          });
          setIsDelete(false);
        }}
        textOK="Xác nhận"
        textCancel="Hủy"
      >
        <p>Bạn xác nhận xóa hết tất cả dịch vụ?</p>
      </CModal>
      {showNotification && (
        <Notification
          message="Số điện thoại đã được đăng ký"
          name={
            <Typography
              modifiers={["16x24", "600", "capitalize", "blueNavy"]}
              content={textNameNotification + " " + "-" + " "}
            ></Typography>
          }
          age={
            <Typography modifiers={["16x24", "600", "capitalize", "blueNavy"]}>
              {textAgeNotification}
            </Typography>
          }
          male={
            <Typography
              modifiers={["16x24", "600", "capitalize", "blueNavy"]}
              content={textMaleNotification + " " + "-" + " "}
            ></Typography>
          }
          id={textIdNotification}
          position="topLeft"
          duration={10000}
        />
      )}
    </div>
  );
};

FormBookingCustomer.defaultProps = {
  dateBookingSchedule: undefined as any,
  positionDrawer: "left",
  noOverLay: false,
  isUsedDrawer: true,
};

export default FormBookingCustomer;
