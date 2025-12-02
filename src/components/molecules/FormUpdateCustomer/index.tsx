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
  getDistrictsAPIsNew,
  getListSourceCustomer,
  getLS,
  getProvinceAPIs,
  getProvinceAPIsNew,
  getWardsAPIs,
  postConvertAddress,
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
import InputFZ from "components/atoms/InputFZ";
import { boolean } from "yup/lib/locale";
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
  isBooking?: boolean;
  customerId?: string;
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
const FormUpdateCustomer: React.FC<FormAddCustomerProps> = ({
  handleClose,
  handleAddCustomer,
  valUpdate,
  isUpdate = false,
  customerPhoneNotFound,
  csPortrait,
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
  isBooking,
  customerId
}) => {
  moment.locale("vi");
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();

  const dataSurveyPortrait = useAppSelector(
    (state) => state.infosCustomer.respSurveyPortrait
  );
  console.log(valUpdate)
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
  const employeeId = localStorage.getItem("employee_id");
  const storageServicesAllowGroup = localStorage.getItem(
    "listServicesAllowGroup"
  );
  const storagePackageWithItems = localStorage.getItem("packagesItems");

  const [statePackagesWithItem, setstatePackagesWithItem] = useState<any[]>(
    storagePackageWithItems ? JSON.parse(storagePackageWithItems) : []
  );
  const [stateEndoscopics, setstateEndoscopics] = useState<DropdownData[]>(
    storageEndoscopics ? JSON.parse(storageEndoscopics) : []
  );
  const [stateAppointmentTypes, setstateAppointmentTypes] = useState<
    GroupRadioType[]
  >(storageAppointmentTypes ? JSON.parse(storageAppointmentTypes) : []);
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
  const [listGenders, setListGenders] = useState<DropdownData[]>(
    storageGenders ? JSON.parse(storageGenders || "") : []
  );
  const [listCareers, setListCareers] = useState<DropdownData[]>(
    storageCareers ? JSON.parse(storageCareers || "") : []
  );
  const [listPackages, setListPackages] = useState<DropdownData[]>(
    storagePackages ? JSON.parse(storagePackages || "") : []
  );
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

  const [listProvince, setListProvince] = useState<AddressData[]>();
  const [listDistrict, setListDistricts] = useState<AddressData[]>();
  const [listWard, setListWard] = useState<AddressData[]>();
  const [isAddressOld, setIsAddressOld] = useState(false);
      const [listProvinceNew, setListProvinceNEw] = useState<AddressData[]>();
    const [listDistrictNew, setListDistrictsNew] = useState<AddressData[]>();
    const [listWardNew, setListWardNew] = useState<AddressData[]>();
  const [isShowMore, setIsShowMore] = useState(true);
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
  const [dataForm, setDataForm] = useState({
    id: "",
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
      source:undefined as unknown as DropdownData,
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
        cityNew:  undefined as unknown as AddressData,
        districtNew: undefined as unknown as AddressData,
        wardNew: undefined as unknown as AddressData,
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
  });
   console.log(dataForm);
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
  // console.log(nameService,nameService1)
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
        source:undefined as unknown as DropdownData,
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
          cityNew:  undefined as unknown as AddressData,
          districtNew: undefined as unknown as AddressData,
          wardNew: undefined as unknown as AddressData,
      note: "",
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
      dayOfBirthBHYT: "",
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
        !dataForm.name.trim() ||
        !dataForm.phoneNumber.trim() ||
        dataForm.phoneNumber.trim().length >= 12 ||
        dataForm.phoneNumber.trim().length <= 9 ||
        (!dataForm.dayOfBirth)
       
      ) {
        setErrorForm({
          ...errorForm,
          name: !dataForm.name.trim() ? "Tên khách hàng là bắt buộc" : "",
          phone:
            isBooking && !dataForm.phoneNumber.trim()
              ? "Số điện thoại là bắt buộc"
              : isBooking &&
                (dataForm.phoneNumber.trim().length >= 11 ||
                  dataForm.phoneNumber.trim().length <= 9)
              ? "Số điện thoại không đúng định dạng"
              : "",
          dayOfBirth:
            isBooking && !dataForm.dayOfBirth ? "Ngày sinh là bắt buộc" : "",
          origin: !dataForm.origin?.value ? "Nguồn là bắt buộc" : "",
          originGroup: !dataForm.originGroup?.value
            ? "Nhóm nguồn là bắt buộc"
            : "",
          dateBooking:
            isBooking && !dataForm.dateBooking
              ? "Ngày đặt lịch là bắt buộc"
              : "",
          noteBooking:
            isBooking && !dataForm.noteBooking
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
  const onSubmit = () => {
    let serviceIds;
    // if (dataForm.typeBooking?.value === "package") {
    //   serviceIds = getServiceIds(servicePackageId, listPackageItems);
    // }
    if (!handleValidateForm()) return;
    // const converContent = parseCustomerPortrait(
    //   dataForm?.portraitSurveyType,
    //   dataGastrointestinal,
    //   dataForm
    // );

    const request = {
      first_owner: {
        customer_id:dataForm.id,
         launch_source_group_id: dataForm?.originGroup?.value,
            launch_source_id: dataForm?.origin?.value,
            launch_source_type_id: dataForm?.originType?.value,
        owner_id: isCompany ? ownerId : ([2, 3, 4, 5,12].includes(Number(dataForm?.origin?.value)) ? ownerId: null ),
            owner_type: isCompany ? ownerType : ([2, 3, 4, 5,12].includes(Number(dataForm?.origin?.value)) ? ownerType: null ),  
        },
        customer_id: dataForm.id,
        sales_employee_id: employeeId,
        customer_type: "customer",
        customer_fullname: dataForm.name,
        customer_identity_card: dataForm.customerId,
        customer_phone: dataForm.phoneNumber,
        customer_email: dataForm.email || "",
        customer_address:
          !dataForm.address.trim() &&
          !dataForm.country?.value &&
          !dataForm.country?.value &&
          !dataForm.country?.value
            ? valUpdate?.customer?.customer_address
            : `${dataForm.address}`,
        day_of_birth: parseInt(dataForm.dayOfBirth?.split("-")[0] ,10)|| undefined,
        month_of_birth:parseInt( dataForm.dayOfBirth?.split("-")[1],10) || undefined,
        year_of_birth:parseInt( dataForm.dayOfBirth?.split("-")[2] ,10) || undefined,
        gender_id: dataForm.gender?.value || "",
     
        nation_id: dataForm.nation?.value || "",
        country_id: dataForm.country?.value || "VN",
       province_id:
              isAddressOld ? dataForm.city?.value.toString() : dataForm.cityNew?.value.toString(),
            district_id:  isAddressOld ? dataForm.district?.value.toString() : null,
            ward_id:isAddressOld ? dataForm.ward?.value.toString() : dataForm.districtNew?.value.toString(),
        // ward_id:
        //   dataForm.ward?.value || valueUpdateCustomer?.customer?.ward?.id,
          registry_from: "CRM",
          portrait_survey_type: dataForm.portraitSurveyType,
        
      
    
    
    
    };
    console.log(request)
    if (handleAddCustomer) {
        clearStateForm();
        clearGastrointestinal();
        setCustomerPortrait(false);
        setServiceSelected([]);
        handleAddCustomer(request);
    }
  };
  /* Validate & Submit save/update customer infomation */

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
        console.error("Error🚀 line 348 -> FormAddCustomer:", err);
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
    const [keysearch, setKeysearch] = useState("")
      const [openModalKeysearch,setOpenModalKeysearch] = useState(false)
    const [nameSource, setNameSource] = useState("")
    const [isCompany, setIsCompany] = useState(false)
     const [ownerType, setOwnerType] = useState("")
  const [ownerId, setOwnerId] = useState("")
   const [stateListS,setStateListS] = useState<any[]>([])
       const { mutate: getSource } = useMutation(
        "post-footer-form",
        (id: any) => getLS(id),
        {
          onSuccess: (data) => {
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
    const handleGetSource = (data:any) => {
      const body = {
        launch_source_id: data,
        keysearch: keysearch
      }
      getSource(body)
  }
  const [openModalSourceCustomer, setOpenModalSourceCustomer] = useState(false)
  const [stateListSource,setStateListSource] = useState<any[]>([])
     const { mutate: getListSource } = useMutation(
        "post-footer-form",
        (data: any) => getListSourceCustomer(data),
        {
          onSuccess: (data) => {
            setStateListSource(data)
            setOpenModalSourceCustomer(true)
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error🚀 line 348 -> FormConvertCustomer:", err);
          },
        }
      );
      const [loading, setLoading] = useState(false)
  const handleGetListSourceCustomer = async () => {
     setLoading(true)
    await getListSource({
      customer_id: customerId,
    });
  };
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
                  "m-form_update_customer_notify",
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
         console.log(4)
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
    const { mutate: getProvincesNew } = useMutation(
      "post-footer-form",
      (id: string) => getProvinceAPIsNew(id),
      {
        onSuccess: (data) => {
          const convertProvince: any[] = [];
          data.data.map((i: any) => {
            const province = { key: i.id, label: i.name, value: i.id };
            convertProvince.push(province);
          });
          console.log(data)
          setListProvinceNEw([...convertProvince]);
        },
        onError: (err) => {
          console.error(err);
        },
      }
  );
    const { mutate: getDistrictsNew } = useMutation(
      "post-footer-form",
      getDistrictsAPIsNew,
      {
        onSuccess: (data) => {
          const convertDistricts: any[] = [];
          data.data.map((i: any) => {
            const districts = { key: i.id, label: i.name, value: i.id };
            convertDistricts.push(districts);
          });
          console.log(123)
          setListDistrictsNew([...convertDistricts]);
        },
        onError: (err) => {
          console.error(err);
        },
      }
  );
     const { mutate: postConvertA } = useMutation(
        "post-footer-form",
        (id: any) => postConvertAddress(id),
        {
          onSuccess: (data) => {
            console.log(data)
             setDataForm({
                                ...dataForm,
                                cityNew: {
                                  key: data.data.province_id,
                                  label: data.data.province_name,
                                  value: data.data.province_id,
               },
                                 districtNew: {
                                  key: data.data.ward_id,
                                  label: data.data.ward_name,
                                  value: data.data.ward_id,
               },
             });
          
          },
          onError: (err) => {
            console.error(err);
          },
        }
    );
   const handleGetItemPaseAPINew = async (
    id: string,
    option: any,
    type: string
  ) => {
    switch (type) {
      case "country":
        getProvincesNew("VN");
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
        setListDistrictsNew([]);
        setListWardNew([]);
        getDistrictsNew(id);
        setDataForm({
          ...dataForm,
          cityNew: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
      case "district":
        setListWardNew([]);
        // getWards(id);
        setDataForm({
          ...dataForm,
          districtNew: {
            key: option.key,
            label: option.children,
            value: option.value,
          },
        });
        break;
      case "ward":
        setDataForm({
          ...dataForm,
          wardNew: {
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
    getProvincesNew("VN");
  }, []);
  useEffect(() => {
    if (valUpdate?.customer?.province?.id !== "") {
      console.log(1234)
      getDistrictsNew(valUpdate?.customer?.province?.id);
    }
  }, [valUpdate?.customer?.province?.id]);
  useEffect(() => {
    if (valUpdate?.customer?.district?.id !== "") {
      getWards(valUpdate?.customer?.district?.id);
    }
  }, [valUpdate?.customer?.district?.id]);
  useEffect(() => {
    setDataForm({
      ...dataForm,
      city: (listProvince ?? []).find(
        (i) =>
          i.key ==
          (valueUpdateCustomer?.customer?.province_id ||
            valUpdate?.customer?.province_id)
      ) as any,
        cityNew: (listProvinceNew ?? []).find(
        (i) =>
          i.key ==
          (valueUpdateCustomer?.customer?.province?.id ||
            valUpdate?.customer?.province)
      ) as any,
    });
  }, [listProvince, valueUpdateCustomer,listProvinceNew]);

  useEffect(() => {
    console.log(1)
    setDataForm({
      ...dataForm,
      district: (listDistrict ?? []).find(
        (i) =>
          i.value ==
          (valueUpdateCustomer?.customer?.district_id ||
            valUpdate?.customer?.district_id)
      ) as any, 
       districtNew: (listDistrictNew ?? []).find(
        (i) =>
          i.value ==
          (valueUpdateCustomer?.customer?.ward?.id ||
            valUpdate?.customer?.ward)
      ) as any,
    });
  }, [listDistrict, valueUpdateCustomer,listDistrictNew]);

  // useEffect(() => {
  //    console.log(2)
  //   setDataForm({
  //     ...dataForm,
  //     districtNew: (listWard ?? []).find(
  //       (i) =>
  //         i.value ==
  //         (valueUpdateCustomer?.customer?.ward_id ||
  //           valUpdate?.customer?.ward_id)
  //     ) as any,
  //   });
  // }, [listWard, valueUpdateCustomer]);

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
        // setIsBooking(
        //   valUpdate?.is_has_booking ||
        //     !!valUpdate?.master?.appointment_datetime ||
        //     false
        // );
        setDataForm({
          ...dataForm,
          id: valUpdate?.customer?.customer_id || valUpdate?.lead_id,
          name:
            valUpdate?.customer?.customer_fullname ||
            valUpdate?.customer_fullname,
          // voucher: valUpdate?.master?.order_discount_refcode,
          phoneNumber:
            (valUpdate?.customer?.customer_phone || "").replace(/\+84-/, "0") ||
            (valUpdate?.customer_phone || "").replace(/\+84-/, "0"),
          gender:
            (listGenders.find(
              (gender) => gender.value === valUpdate?.customer?.gender?.id
            ) as any) ||
            (listGenders.find((i) => i.label == valUpdate?.gender_name) as any),
          dayOfBirth:
            (valUpdate?.customer?.birthday &&
              moment(valUpdate?.customer?.birthday).format("DD-MM-YYYY")) ||
            `--${valUpdate?.year_of_birth}`,
          email: valUpdate?.customer?.customer_email || "",
          nation:
            (listNations.find(
              (i) => i.value == valUpdate?.customer?.nation?.id
            ) as any) || undefined,
          career:
            (listCareers.find(
              (i) => i.value == valUpdate?.customer?.career?.id
            ) as any) || undefined,
          origin:
            (stateLaunchSource.find(
              (i) => i.value == valueUpdateCustomer?.source_first?.launch_source_id
            ) as any) ||
            (stateLaunchSource.find(
              (i) => i.value == valUpdate?.launch_source_id
            ) as any),
          originGroup:
            
            (stateLaunchSourceGroups.find(
              (i) => i.value == valueUpdateCustomer?.source_first?.launch_source_group_id
            ) as any) ||
            (stateLaunchSourceGroups.find(
              (i) => i.value == valUpdate?.launch_source_group_id
            ) as any),
          voucher: stateVoucherTypes.find(
            (i) => i.value == valUpdate?.master?.order_discount_refcode
          ) as any,
          originType:
            (stateLaunchSourceTypes.find(
              (i) => i.value == valueUpdateCustomer?.source_first?.launch_source_type_id
            ) as any) ||
            (stateLaunchSourceTypes.find(
              (i) => i.value == valUpdate?.launch_source_type_id
            ) as any),
          customerId: valUpdate?.customer?.customer_identity_card || "",
          address: valUpdate?.customer?.customer_address || "",
          country:
            OptionCountry?.find(
              (i) => i.value == valUpdate?.customer?.country?.id
            ) || OptionCountry[0],
          city: (listProvinceNew || [])?.find(
            (i) => i.value == valUpdate?.customer?.province?.id
          ) as any,
          districtNew: (listDistrictNew || [])?.find(
            (i) => i.value == valUpdate?.customer?.ward?.id
          ) as any,
          ward: (listWard || [])?.find(
            (i) => i.value == valUpdate?.customer?.ward?.id
          ) as any,
          note: valUpdate?.customer?.lead_note || "",
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
          // typeBooking: valUpdate?.is_has_booking
          //   ? (stateAppointmentTypes.find(
          //       (i) =>
          //         i.value === valUpdate?.master?.appointment_type ||
          //         i.value === valUpdate?.master?.appointment_type
          //     ) as GroupRadioType)
          //   : (undefined as unknown as GroupRadioType),
          allow_update_profile: valUpdate?.allow_update_profile,
          typeBooking: valUpdate?.is_has_booking
            ? (stateAppointmentTypes.find(
                (i) =>
                  i.value ===
                  (valUpdate?.master?.appointment_type === "endoscopics"
                    ? "services"
                    : valUpdate?.master?.appointment_type)
              ) as GroupRadioType)
            : (undefined as unknown as GroupRadioType),

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
            (i: any) => i?.affiliate_code === valUpdate?.customer?.owner_id
          ) as unknown as DropdownData,
          ctvBSCD: listAffiliates.find(
            (i: any) => i?.affiliate_code === valUpdate?.customer?.owner_id
          ) as unknown as DropdownData,
          gclid: valUpdate?.customer?.gclid || valUpdate?.gclid,
          // numberDis
        });
        if(valueUpdateCustomer?.source_first != undefined)
       {
          setKeysearch("")
           handleGetSource(valueUpdateCustomer?.source_first?.launch_source_id);
        
          const v = Number(valueUpdateCustomer?.source_first?.launch_source_id);
          setNameSource(valueUpdateCustomer?.source_first?.launch_source_id === 2 ? "Bác Sĩ Chỉ Định" : valueUpdateCustomer?.source_first?.launch_source_id === 3 ? "Đối Tác"
            : valueUpdateCustomer?.source_first?.launch_source_id === 4 ? "KH Cũ Giới Thiệu"
            : valueUpdateCustomer?.source_first?.launch_source_id === 12 ? "KOC"
            : valueUpdateCustomer?.source_first?.launch_source_id === 5 ? "Nhân Viên" : "công ty")
         
                                              if ([2, 3, 4, 12, 5].includes(v))
                                             {
                                               setIsCompany(true)
                                             }
                                             else {
                                                 setIsCompany(false)
          }
         setOwnerType(valueUpdateCustomer?.source_first?.owner_type)
                                          setOwnerId(valueUpdateCustomer?.source_first?.owner_id)
         
       }
        if(valueUpdateCustomer?.source_first?.owner_type === "company")
       {
         setIsCompany(true)
       }
      }, 1000);
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
  }, [valUpdate,listDistrictNew]);
  useEffect(() => {
    if (!dateBookingSchedule) return;
    // setIsBooking(!_.isUndefined(dateBookingSchedule));
    setDataForm({
      ...dataForm,
      dateBooking: dateBookingSchedule
        ? moment(dateBookingSchedule).format("YYYY-MM-DD HH:mm")
        : (undefined as unknown as Date),
    });
  }, [dateBookingSchedule]);

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
              "m-form_update_customer_customerPortrait",
              stateBreakPoint <= 1450 && "fit_content"
            )}
          >
            {dataForm?.portraitSurveyType == "KTQ" && ( //Khám tổng quát
              <div className="m-form_update_customer_customerPortrait_generalExamination">
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                  <div className="m-form_update_customer_customerPortrait_generalExamination_item">
                    <Typography
                      content={
                        !isUpdate
                          ? `Anh/chi đăng ký ${
                              dataGastrointestinal.bh?.label as any
                            } ở đâu`
                          : valueSurveyPortrait?.data?.card?.q10 ??
                            `Anh/chi đăng ký ${
                              dataGastrointestinal.bh?.label as any
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
              <div className="m-form_update_customer_customerPortrait_generalExamination">
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item m-form_update_customer_customerPortrait_generalExamination_item_custom">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_generalExamination_item">
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
              <div className="m-form_update_customer_customerPortrait_digestiveExamination">
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                  <div className="m-form_update_customer_customerPortrait_generalExamination_item">
                    <Typography
                      content={
                        !isUpdate
                          ? `Anh/chi đăng ký ${
                              (dataGastrointestinal.bh?.label as any) ||
                              "Bảo hiểm"
                            } ở đâu`
                          : valueSurveyPortrait?.data?.card?.q12 ??
                            `Anh/chi đăng ký ${
                              (dataGastrointestinal.bh?.label as any) ||
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                  <div className="m-form_update_customer_customerPortrait_digestiveExamination_noisoi">
                    <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                    <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                    <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                    <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
                <div className="m-form_update_customer_customerPortrait_digestiveExamination_item">
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
          <div className="m-form_update_customer_null">
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
      <div className="m-form_update_customer-booking_box_table">
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
                className="m-form_update_customer-booking_box_table_children"
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
    <div className="m-form_update_customer_wrapper">
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
          isUpdate ? "Điều chỉnh thông tin khách hàng" : "Thêm mới khách hàng"
        }
        isHideFooter
        zIndex={10}
        style={{ zIndex: 1 }}
      >
        <div
          className={mapModifiers(
            "m-form_update_customer",
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
          {(isUpdate && !_.isEmpty(dataForm?.id)) || !isUpdate ? (
            <form>
              {!csPortrait && (
                <div className="m-form_update_customer_wrap">
                  
                  <div
                    className="m-form_update_customer_row gap_10"
                    style={{ alignItems: "self-start" }}
                  >
                    <div style={{ marginTop: "5px", width: "100%" }}>
                      <Input
                        // autoFocus
                        // id="customerFullName"
                        label="Họ tên:"
                        placeholder="Nhập họ tên của khách hàng"
                        variant="simple"
                        isRequired
                        // disabled={!dataForm?.allow_update_profile}
                        error={errorForm?.name}
                        value={dataForm.name}
                        onChange={(e) => {
                          setDataForm({
                            ...dataForm,
                            name: e.target.value,
                          });
                          clearStateErrorForm("name");
                        }}
                      />
                    </div>
                    <Dropdown
                      dropdownOption={listGenders}
                      placeholder="Nam"
                      label="giới tính:"
                      handleSelect={(item) => {
                        setDataForm({ ...dataForm, gender: item });
                      }}
                      variant="simple"
                      values={(dataForm.gender as any) || undefined}
                      //disabled={!dataForm?.allow_update_profile}
                    />
                    <div style={{ marginTop: "5px", width: "100%" }}>
                      {" "}
                      <InputDateOfBirth
                        isRequired={isBooking}
                        label="Ngày sinh:"
                        handleOnChange={(date: string) => {
                          setDataForm({ ...dataForm, dayOfBirth: date });
                          clearStateErrorForm("dayOfBirth");
                        }}
                        error={errorForm.dayOfBirth}
                        valueDefault={dataForm.dayOfBirth}
                        onChangInput={() => clearStateErrorForm("dayOfBirth")}
                       // isDisable={!dataForm?.allow_update_profile}
                      />
                    </div>
                    {/* <Input
                      id=""
                      label="Tên Facebook/ Zalo:"
                      placeholder="Nhập tên Facebook/Zalo"
                      variant="simple"
                      value={dataForm.socialName}
                      onChange={(e) => {
                        setDataForm({
                          ...dataForm,
                          socialName: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                   */}
                  </div>
                  <div
                    className="m-form_update_customer_row grid_2_1_1_1_1 m-form_update_customer_address"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      alignItems: "flex-start",
                    }}
                  >
                    <Input
                      id="phoneNumber"
                      label="Điện thoại:"
                      variant="simple"
                      placeholder="Nhập số điện thoại"
                      isPhoneNumber
                      isRequired={isBooking}
                      error={errorForm?.phone}
                      value={dataForm.phoneNumber.replace(/\+84-/, "0") || ""}
                      onChange={(e) => {
                        setDataForm({
                          ...dataForm,
                          phoneNumber: e.target.value,
                        });
                        clearStateErrorForm("phone");
                        if ((e.target.value as string)?.length >= 10) {
                          getCustomerByPhone(e.target.value);
                        }
                      }}
                    />
                    <div className="m-form_update_customer_row">
                      <Input
                        id="customer_id"
                        label="CMND/CCCD"
                        type="text"
                        placeholder="0653232XXXXX"
                        variant="simple"
                        isNotUseError
                        value={(dataForm.customerId as any) || ""}
                       // disabled={!dataForm?.allow_update_profile}
                        onChange={(e) =>
                          setDataForm({
                            ...dataForm,
                            customerId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Input2
                      id="customer_email"
                      label="Email:"
                      type="text"
                      placeholder="acbd@gmail.com"
                      variant="simple"
                      value={dataForm.email}
                      onChange={(e) =>
                        setDataForm({ ...dataForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div
                    className="m-form_update_customer_row_diff grid_1_1_1 m-form_update_customer_address"
                    style={{ gridTemplateColumns: "2fr 1fr" }}
                  >
                    <div style={{ marginTop: "2px" }}>
                      <Input
                        id="customer_full_address"
                        label="Địa chỉ"
                        type="text"
                        variant="simple"
                        placeholder="Nhập số nhà, tên đường, khu phố,.."
                        value={(dataForm.address as any) || ""}
                        onChange={(e) =>
                          setDataForm({
                            ...dataForm,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "5px", paddingTop: "4px" }}>
                      <AddressDropdown
                        AddressOption={OptionCountry || []}
                        label="Quốc gia:"
                        placeholder="Chọn quốc gia"
                        variant="simple"
                        handleSelect={(item, option: any) => {
                          handleGetItemPaseAPI(item, option, "country");
                           handleGetItemPaseAPINew(item, option, "country");
                          setDataForm({
                            ...dataForm,
                            country: {
                              key: option.value,
                              label: option.children,
                              value: option.value,
                            },
                          });
                        }}
                        //    values={(dataForm.city as any) || OptionCountry[0]}
                        values={OptionCountry[0]}
                      />
                    </div>
                  </div>
                    <div className="m-form_add_customer_row grid_2_1_1_1_1 m-form_add_customer_address" style={{ display: "grid", gridTemplateColumns: "1fr 0.1fr" }}>
                          {
                            isAddressOld === false ?   <div className="m-form_add_customer_row grid_2_1_1_1_1 m-form_add_customer_address" style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
                        <AddressDropdown
                          AddressOption={listProvinceNew || []}
                          label="Thành phố:"
                          handleSelect={(item, option: any) => {
                            handleGetItemPaseAPINew(item, option, "city");
                            setDataForm({
                              ...dataForm,
                              cityNew: {
                                key: option.value,
                                label: option.children,
                                value: option.value,
                              },
                            });
                          }}
                          placeholder="Chọn thành phố"
                          variant="simple"
                          values={
                            (dataForm.cityNew as any) ||  
                             listProvinceNew?.find(
                              (i) => i.value == valUpdate?.customer?.province?.id
                            ) ||
                            undefined
                          }
                        />
                        <AddressDropdown
                          AddressOption={listDistrictNew || []}
                       label="Xã/ phường:"
                          handleSelect={(item, option: any) => {
                            handleGetItemPaseAPINew(item, option, "district");
                            setDataForm({
                              ...dataForm,
                              districtNew: {
                                key: option.value,
                                label: option.children,
                                value: option.value,
                              },
                            });
                          }}
                          placeholder="Chọn xã"
                          variant="simple"
                          values={
                            (dataForm.districtNew as any) ||
                            listDistrictNew?.find(
                              (i) => i.value == valUpdate?.customer?.ward?.id
                            ) ||
                            undefined
                          }
                        />
                     {/* <div
                                       className="m-form_note"
                                       style={{
                                         width: "100%",
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
                              if (dataForm.ward) {
                                const body = {
                                  ward_id: dataForm?.ward.value
                                }
                                          postConvertA(body)
                              } else {
                                toast.error("Vui lòng chọn xã/phường ở địa chỉ cũ")
                                        }
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
                                         content={"Chuyển đổi từ địa chỉ cũ"}
                                         styles={{ marginBottom: "2px" }}
                                       />
                                     </div> */}
                        </div> : <div className="m-form_add_customer_row grid_2_1_1_1_1 m-form_add_customer_address"  style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr"}}>
                        <AddressDropdown
                          AddressOption={listProvince || []}
                          label="Thành phố:"
                          handleSelect={(item, option: any) => {
                            handleGetItemPaseAPI(item, option, "city");
                            setDataForm({
                              ...dataForm,
                              city: {
                                key: option.value,
                                label: option.children,
                                value: option.value,
                              },
                            });
                          }}
                          placeholder="Chọn thành phố"
                          variant="simple"
                          // values={
                          //   (dataForm.city as any) ||
                       
                          //   undefined
                          // }
                        />
                        <AddressDropdown
                          AddressOption={listDistrict || []}
                         label="Quận/ Huyện:"
                          handleSelect={(item, option: any) => {
                            handleGetItemPaseAPI(item, option, "district");
                            console.log(option)
                            setDataForm({
                              ...dataForm,
                              district: {
                                key: option.value,
                                label: option.children,
                                value: option.value,
                              },
                            });
                          }}
                          placeholder="Chọn huyện"
                          variant="simple"
                          // values={
                          //   (dataForm.district as any) ||
                          //   listDistrict?.find(
                          //     (i) => i.value == valUpdate?.customer?.district_id
                          //   ) ||
                          //   undefined
                          // }
                        />
                      <AddressDropdown
                          AddressOption={listWard || []}
                          label="Xã/ phường:"
                          handleSelect={(item, option: any) => {
                            handleGetItemPaseAPI(item, option, "ward");
                            setDataForm({
                              ...dataForm,
                              ward: {
                                key: option.value,
                                label: option.children,
                                value: option.value,
                              },
                            });
                          }}
                          placeholder="Chọn xã"
                          variant="simple"
                          values={
                            (dataForm.ward as any) ||
                            listWard?.find(
                              (i) => i.value == valUpdate?.customer?.ward_id
                            ) ||
                            undefined
                          }
                          />
                          
                        </div>
                          }
                          
                          <Checkbox
                                              label="Dạng cũ?"
                                              isChecked={isAddressOld}
                                              onChange={() => {
                                                
                                                setIsAddressOld(!isAddressOld);
                                              }}
                                            />
                        </div>
                  <div>
                    <div className="m-form_update_customer_row_diff grid_1_1_1" style={{gridTemplateColumns:"repeat(2, 1fr)"}}>
                      <Dropdown
                        dropdownOption={listNations as DropdownData[]}
                        placeholder="Kinh"
                        label="dân tộc:"
                        handleSelect={(item) => {
                          setDataForm({ ...dataForm, nation: item });
                        }}
                        variant="simple"
                        values={(dataForm.nation as any) || undefined}
                      />
                      <Dropdown
                        dropdownOption={listCareers as DropdownData[]}
                        placeholder="Nghề nghiệp khách hàng"
                        className="form_carrer"
                        label="Nghề nghiệp"
                        handleSelect={(item) => {
                          setDataForm({ ...dataForm, career: item });
                        }}
                        variant="simple"
                        values={(dataForm.career as any) || undefined}
                      />
                      {/* <div style={{ width: "100%", marginTop: "2px" }}>
                        <InputFZ
                          id=""
                          isRequired={false}
                          label="Tên Facebook/ Zalo:"
                          placeholder="Nhập tên Facebook/Zalo"
                          variant="simple"
                          value={dataForm.socialName}
                          onChange={(e) => {
                            setDataForm({
                              ...dataForm,
                              socialName: e.target.value.toUpperCase(),
                            });
                          }}
                        />
                      </div> */}
                        {/* <div className="m-form_add_customer_type_purpose">
                                               
                                             
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
                                              </div> */}
                    </div>
                     <div
                                          className="m-form_add_customer_row gap_10 m-form_add_customer_row-origins"
                                        style={{ marginBottom: "0px", maxHeight: "85px",gridTemplateColumns:"1fr 1fr 1fr 0.6fr" }}
                                        >
                                         <Dropdown
                                                                 dropdownOption={stateLaunchSourceGroups}
                                                                 isRequired
                                                                 placeholder={stateLaunchSourceGroups[0]?.label}
                                                                 defaultValue={valueUpdateCustomer?.source_first?.launch_source_group_id as DropdownData}
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
                                                                                                                              defaultValue={valueUpdateCustomer?.source_first?.launch_source_id as DropdownData}
                                                                                                                             label="Nguồn:"
                                                                                                                         handleSelect={(item) => {
                                                                setKeysearch("")
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
                                                                 defaultValue={valueUpdateCustomer?.source_first?.launch_source_type_id as DropdownData}
                                                                 label="Hình thức chuyển đổi:"
                                                                 handleSelect={(item) => {
                                                                   setDataForm({ ...dataForm, originType: item });
                                                                   clearStateErrorForm("origin");
                                                                 }}
                                                                 variant="simple"
                                                                 className="form_origin"
                                                                 values={(dataForm.originType as any) || undefined}
                                        />
                                         <div style={{marginTop:"20px"}}>
                                                               <Button
                                                                    className="m-form_note"
                                                                    onClick={() => {
                                                                    handleGetListSourceCustomer()
                                                              }}
                                                              style={{marginTop:"10px"}}
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
                           defaultValue={valueUpdateCustomer?.source_first?.owner_id as DropdownData}
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
                    {/* <div className="m-form_update_customer_desc">
                        <TextArea
                          id=""
                          readOnly={false}
                          label="Những điều cần lưu ý:"
                          placeholder="Những điều cần lưu ý về khách hàng"
                          value={(dataForm.note as any) || undefined}
                          handleOnchange={(e) => {
                            setDataForm({
                              ...dataForm,
                              note: e.target.value,
                            });
                          }}
                          isResize
                        />
                      </div> */}
                    
                  </div>
                  {/* <div
                    className="m-form_update_customer_row gap_10 m-form_update_customer_row-origins"
                    style={{ marginBottom: "0px", maxHeight: "85px" }}
                  >
                    <div style={{ marginTop: "3px", width: "100%" }}>
                      <Dropdown
                        dropdownOption={stateLaunchSourceGroups}
                        isRequired
                        placeholder={stateLaunchSourceGroups[0]?.label}
                        // defaultValue={valueUpdateCustomer?.origin as DropdownData}
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
                    </div>
                    <div style={{ marginTop: "3px", width: "100%" }}>
                      {" "}
                      <Dropdown
                        dropdownOption={stateLaunchSource}
                        isRequired
                        placeholder={stateLaunchSource[0]?.label}
                        defaultValue={
                          valueUpdateCustomer?.origin as DropdownData
                        }
                        label="Nguồn:"
                        handleSelect={(item) => {
                          setDataForm({ ...dataForm, origin: item });
                          clearStateErrorForm("origin");
                        }}
                        variant="simple"
                        error={errorForm.origin}
                        className="form_origin"
                        values={(dataForm.origin as any) || undefined}
                      />
                    </div>
                    <Dropdown
                      dropdownOption={stateLaunchSourceTypes}
                      placeholder={stateLaunchSourceTypes[0]?.label}
                      defaultValue={valueUpdateCustomer?.origin as DropdownData}
                      label="Hình thức chuyển đổi:"
                      handleSelect={(item) => {
                        setDataForm({ ...dataForm, originType: item });
                        clearStateErrorForm("origin");
                      }}
                      variant="simple"
                      className="form_origin"
                      values={(dataForm.originType as any) || undefined}
                    />
                  </div> */}
                  
                  {/* Đây là layout nhập ID google khi chọn nguồn Google */}
                 
               
                
                </div>
              )}

            
              <div className="m-form_update_customer_button">
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
                    content={isUpdate ? "Cập nhật" : "thêm mới"}
                    styles={{ marginBottom: "2px" }}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="m-form_update_customer_null">
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
          <div className="m-form_update_customer-booking_box">
            <div
              className="m-form_update_customer-booking_box_header"
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
                        noteBooking: "",
                        typeBooking: e,
                      });
                      setServicePackageId("");
                      setNotePackage("");
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
              className="m-form_update_customer-booking_box_body"
              style={{ height: "calc(85vh - 110px)" }}
            >
              <div className="m-form_update_customer-booking_box_service">
                {listServicesAllowGroup.length &&
                  listServicesAllowGroup.map((parent: any) => {
                    return (
                      <div
                        key={parent.service_group_id}
                        className="m-form_update_customer-booking_box_service_item"
                      >
                        <CCollapse
                          key_default="1"
                          title={`${parent.service_group_name} (${parent?.service_group_item.length})`}
                        >
                          <div className="m-form_update_customer-booking_box_service_item_wrapper">
                            {parent?.service_group_item?.map((item: any) => (
                              <div
                                key={item.service_id}
                                className="m-form_update_customer-booking_box_service_item_children"
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
                  Hiện tại bạn chưa chọn gói tầm soát nào!
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
          <div className="m-form_update_customer-booking_box">
            <div
              className="m-form_update_customer-booking_box_header"
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
              className="m-form_update_customer-booking_box_body"
              style={{ height: "calc(85vh - 110px)" }}
            >
              <div className="m-form_update_customer-booking_box_service">
                {listServicesAllowGroup.length &&
                  listServicesAllowGroup.map((parent: any) => {
                    return (
                      <div
                        key={parent.service_group_id}
                        className="m-form_update_customer-booking_box_service_item"
                      >
                        <CCollapse
                          key_default="1"
                          title={`${parent.service_group_name} (${parent?.service_group_item.length})`}
                        >
                          <div className="m-form_update_customer-booking_box_service_item_wrapper">
                            {parent?.service_group_item?.map((item: any) => (
                              <div
                                key={item.service_id}
                                className="m-form_update_customer-booking_box_service_item_children"
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
                  Hiện tại bạn chưa chọn gói tầm soát nào!
                </p>
              )}
            </div>
          </div>
        </CModal>
      )}
      {/* Đây là layout khi category "Nguồn" mà bấm chọn "KH Cũ Giới Thiệu (WoM)" và search xong tên Khách hàng cũ thì server trả về sẽ được map ra ở layout dưới (popup) */}
      <CModal
        isOpen={isOpenFormGetCustomer}
        onCancel={() => setIsOpenFormGetCustomer(false)}
        title="Tìm kiếm Khách hàng giới thiệu"
        widths={1000}
        isHideFooter
      >
        <PublicTable
          listData={listCustomerWoM}
          column={tableColumnForSearch}
          handleOnClick={(event: any, record: any, rowIndex: any) => {}}
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

FormUpdateCustomer.defaultProps = {
  dateBookingSchedule: undefined as any,
  positionDrawer: "left",
  noOverLay: false,
  isUsedDrawer: true,
};

export default FormUpdateCustomer;
