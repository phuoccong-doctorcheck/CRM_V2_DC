/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
import { Progress, List, Table, Switch, Spin } from "antd";
import { sendMessagetype } from "assets/data";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CEmpty from "components/atoms/CEmpty";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Dropdown2 from "components/atoms/Dropdown2";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Typography from "components/atoms/Typography";
import FormAddMarketingCampaign, {
  AMOUNT_SMS,
  CampaignFormType,
} from "components/molecules/FormAddMarketingCampaign";
import PublicTable from "components/molecules/PublicTable";
import CDrawer from "components/organisms/CDrawer";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicLayout from "components/templates/PublicLayout";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  getCampaignLogs,
  getCampaigns,
  getSMSTemplates,
  postMakeOrUpdateCampaigns,
  postSendCampaign,
} from "services/api/point";
import { TemplateSMSItem } from "services/api/point/types";
// eslint-disable-next-line import/order
import mapModifiers from "utils/functions";
import "./index.scss";
// eslint-disable-next-line import/order
import { useAppDispatch, useAppSelector } from "store/hooks";
// eslint-disable-next-line import/order
import { clearKPIMonth, getKPIAgency, getKPIEmployee, getKPIEmployeeMonth } from "store/kpi_month";
// import { getKPIDays } from 'store/kpi_taskview';
// eslint-disable-next-line import/order
import {
  postAddKPI,
  postSetStatusKPI,
  postUpdateKPI,
} from "services/api/kpiMonth";
// eslint-disable-next-line import/order
import Cookies from "js-cookie";
// eslint-disable-next-line import/order
import { clearKPIDays, getKPIDays, getKPIDays1 } from "store/kpi_taskview";
// eslint-disable-next-line import/order
import dayjs from "dayjs";

interface DropdownData1 {
  id: number;
  value: string;
  label: string;
}
const dataCustom: DropdownData1[] = [
  {
    id: 1,
    value: "10",
    label: "Khách Hàng F1 ",
  },
  {
    id: 2,
    value: "13",
    label: "Khách Hàng F2 ",
  },
  {
    id: 3,
    value: "14",
    label: "Khách Hàng F3 ",
  },
  {
    id: 4,
    value: "15",
    label: "Khách Hàng WOM ",
  },
];
const convertToDropdownOptions = (data: any, employeeId: string) => {

  // Tạo một bản sao của `data` để không chỉnh sửa trực tiếp tham số
  const filteredData = (employeeId === "NV00082" || employeeId === "NV221124163558" )
    ?data.filter(
        (item: any) =>
          item.f_type_customer === "F2" ||
          item.f_type_customer === "F3" ||
          item.kpi_code === "KC12"
      )
    :data.filter((item: any) => item.f_type_customer === "F1");

  // Chuyển đổi mảng thành định dạng dropdown options
  return filteredData.map((item: any) => ({
    label: item.kpi_name, // Tên hiển thị trong dropdown
    value: item.kpi_id,   // Giá trị trả về khi chọn
    ...item,              // Giữ nguyên các thuộc tính khác nếu cần sử dụng sau này
  }));
};

// const order = ["Khách Hàng F1", "Khách Hàng F2","Khách Hàng F3","Khách Hàng WOM"];
const order = [16,13,14,15];
const dataListKPIA = [
  {
    group_client: "",
    revenue: "100,000,000",
    customers: 100,
    successful_calls: 80,
  },
];

const data = [
  "Doanh thu đạt 100.000.00",
  "Có 300 khách hàng đặt lịch",
  "Nhắn tin với 100 khách hành mới",
  "Gọi 10 cuộc điện thoại thành công mỗi ngày",
  "Chat lại 200 khách hàng cũ",
];
const Manage_KPIs2: React.FC = () => {
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [processedDataTotal, setProcessedDataTotal] = useState<any[]>([]);
  const [modeButton, setModeButton] = useState(false);

  const processData = (data: any[]) => {
    const resultArray: any[] = [];

    data.forEach((item) => {
      const mergedObject: any = {};
      const details = item.details;

      mergedObject["employee_id"] = item.employee_id;
      mergedObject["date"] = dayjs(item.date).format("DD-MM");

      details.forEach((detail: any, index: any) => {
        const idx = index + 1;
        mergedObject[`type_statistic_id${idx}`] = detail.type_statistic_id;
        mergedObject[`type_statistic_name${idx}`] = detail.type_statistic_name;
        mergedObject[`customer_appointments_count${idx}`] =
          detail.customer_appointments_count;
        mergedObject[`customer_checkin_count${idx}`] =
          detail.customer_checkin_count;
        mergedObject[`revenue${idx}`] = detail.revenue;
        mergedObject[`real_revenue${idx}`] = detail.real_revenue;
        mergedObject[`customer_add_service_retail_count${idx}`] =
          detail.customer_add_service_retail_count;
        mergedObject[`customer_rescreening_appointments_count${idx}`] =
          detail.customer_rescreening_appointments_count;
        mergedObject[`customer_refered_count${idx}`] =
          detail.customer_refered_count;
        mergedObject[`customer_contacts_count${idx}`] =
          detail.customer_contacts_count;

        if (detail.statistic_by_page) {
          let totalNewInboxCount = 0;
          detail.statistic_by_page.forEach((page: any) => {
            totalNewInboxCount += page.new_inbox_count || 0;
          });
          mergedObject[`new_inbox_count${idx}`] = totalNewInboxCount;

          let totalOldInboxCount = 0;
          detail.statistic_by_page.forEach((page: any) => {
            totalOldInboxCount += page.old_inbox_count || 0;
          });
          mergedObject[`old_inbox_count${idx}`] = totalOldInboxCount;

          let totalPhoneNumberCount = 0;
          detail.statistic_by_page.forEach((page: any) => {
            totalPhoneNumberCount += page.phone_number_count || 0;
          });
          mergedObject[`phone_number_count${idx}`] = totalPhoneNumberCount;
        } else {
          mergedObject[`new_inbox_count${idx}`] = 0;
          mergedObject[`old_inbox_count${idx}`] = 0;
          mergedObject[`phone_number_count${idx}`] = 0;
        }
      });
     
      resultArray.push(mergedObject);
    });

    return resultArray;
  };
  const sumObjects = (arr: any[]) => {
  // Khởi tạo object kết quả
    let result = {
    new_inbox_count1_Total: 0,
    old_inbox_count1_Total: 0,
    phone_number_count1_Total: 0,
    customer_appointments_count1_Total: 0,
    customer_checkin_count1_Total: 0,
    revenue1_Total: 0,
    real_revenue1_Total: 0,

    customer_contacts_count2_Total: 0,
    customer_add_service_retail_count2_Total: 0,
    customer_checkin_count2_Total: 0,
    revenue2_Total: 0,
    real_revenue2_Total: 0,

    customer_contacts_count3_Total: 0,
    customer_rescreening_appointments_count3_Total: 0,
    customer_checkin_count3_Total: 0,
    revenue3_Total: 0,
    real_revenue3_Total: 0,

    customer_contacts_count4_Total: 0,
    customer_refered_count4_Total: 0,
    customer_checkin_count4_Total: 0,
    revenue4_Total: 0,
    real_revenue4_Total: 0,
  };

  arr.forEach(item => {
    // Cộng dồn các giá trị tương ứng, chuyển null thành 0
    result.new_inbox_count1_Total += item.new_inbox_count1 || 0;
    result.old_inbox_count1_Total += item.old_inbox_count1 || 0;
    result.phone_number_count1_Total += item.phone_number_count1 || 0;
    result.customer_appointments_count1_Total += item.customer_appointments_count1 || 0;
    result.customer_checkin_count1_Total += item.customer_checkin_count1 || 0;
    result.revenue1_Total += item.revenue1 || 0;
    result.real_revenue1_Total += item.real_revenue1 || 0;

    result.customer_contacts_count2_Total += item.customer_contacts_count2 || 0;
    result.customer_add_service_retail_count2_Total += item.customer_add_service_retail_count2 || 0;
    result.customer_checkin_count2_Total += item.customer_checkin_count2 || 0;
    result.revenue2_Total += item.revenue2 || 0;
    result.real_revenue2_Total += item.real_revenue2 || 0;

    result.customer_contacts_count3_Total += item.customer_contacts_count3 || 0;
    result.customer_rescreening_appointments_count3_Total += item.customer_rescreening_appointments_count3 || 0;
    result.customer_checkin_count3_Total += item.customer_checkin_count3 || 0;
    result.revenue3_Total += item.revenue3 || 0;
    result.real_revenue3_Total += item.real_revenue3 || 0;

    result.customer_contacts_count4_Total += item.customer_contacts_count4 || 0;
    result.customer_refered_count4_Total += item.customer_refered_count4 || 0;
    result.customer_checkin_count4_Total += item.customer_checkin_count4 || 0;
    result.revenue4_Total += item.revenue4 || 0;
    result.real_revenue4_Total += item.real_revenue4 || 0;

  });

  return [result]; // Trả về mảng chứa object kết quả
};
  const listKPIDay1 = useAppSelector((state) => state.kpiday.listKPIDay);
  const listKPIDay2 = useAppSelector((state) => state.kpiday.listKPIDay1);
  
  useEffect(() => {
    if (listKPIDay2?.data?.statistics_by_date !== undefined) {
      const result = processData(listKPIDay2?.data?.statistics_by_date);
      setProcessedData(result);
      const result1 = sumObjects(result);
      setProcessedDataTotal(result1)

    }
  }, [listKPIDay2]);
  const position = Cookies.get("employee_team");
  const dispatch = useAppDispatch();
  const storageDoctoronline = localStorage.getItem("doctorOnline");
  const storageemployeeID = localStorage.getItem("employee_id");
  const storageemployeeERP = localStorage.getItem("erp_code");
  const storageListIdTypeCustom = localStorage.getItem("listIdTypeCustom");
  const [listDoctoronline, setListDoctoronline] = useState<DropdownData[]>(
    storageDoctoronline ? JSON.parse(storageDoctoronline || "") : []
  );
  const storageEmployeeList = localStorage.getItem("listCSKH");
  const [listEmployeeTeams, setListEmployeeTeams] = useState(
    storageEmployeeList ? JSON.parse(storageEmployeeList || "") : ([] as any)
  );
  const [listCampaign, setListCampaign] = useState([]);
  const [employeeId, setEmployeeId] = useState(storageemployeeID);
  const [employeeERP, setEmployeeERP] = useState(storageemployeeERP);
  const [listIdTypeCustom, setListIdTypeCustom] = useState(storageListIdTypeCustom ? JSON.parse(storageListIdTypeCustom || "") : ([] as any));
  const [openAdd, setOpenAdd] = useState(false);
  const [listCampaignDetail, setListCampaignDetail] = useState([]);
  const [roles, setRoles] = useState("Employees");
  const listKPIEmployee = useAppSelector(
    (state) => state.kpiMonth.listKPIEmployee
  );
   const listKPIEmployeeMonth = useAppSelector(
    (state) => state.kpiMonth.listKPIEmployeeMonth
  );
  const listKPIAgency = useAppSelector((state) => state.kpiMonth.listKPIAgency);
  const IsLoadingKPIMaster = useAppSelector(
    (state) => state.kpiday.isLoadingKPIMaster
  );
  const IsLoadingKPIMonth = useAppSelector(
    (state) => state.kpiMonth.isLoadingKPIMaster
  );
  
  const [loadingMaster, setLoadingMaster] = useState(IsLoadingKPIMaster);
  const [loadingMonth, setLoadingMonth] = useState(IsLoadingKPIMonth);
  const [kpiEmployee, setKPIEmployee] = useState(listKPIEmployee.data);
  const [kpiEmployeeMonth, setKPIEmployeeMonth] = useState(listKPIEmployeeMonth.data);
  const [kpiAgency, setKPIAgency] = useState(listKPIAgency.data);
  const [modeCount, setModeCount] = useState(false);
  const [modeTable, setModeTable] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [removedDates, setRemovedDates] = useState<string[]>([]); 
  useEffect(() => {
    setLoadingMonth(IsLoadingKPIMonth)
  }, [IsLoadingKPIMonth])
  const kpiEmployeeDetails =
    Array.isArray(kpiEmployee?.details) && kpiEmployee.details.length > 0
      ? kpiEmployee.details
      : null;
  // Nếu có kpiEmployeeDetails thì thực hiện disable, nếu không thì giữ nguyên
  const updatedDataCustom = listIdTypeCustom.map((item: any) => {
    const isDisabled = kpiEmployeeDetails
      ? kpiEmployeeDetails.some(
          (kpi) => kpi.kpi_id === item.kpi_id
        )
      : false; // Nếu mảng rỗng thì không disable
    return { ...item, disabled: isDisabled };
  });
  console.log(updatedDataCustom)
  const [campaign, setCampaign] = useState({
    isOpen: false,
    isOpenAddOrUpdate: false,
    isUpdate: false,
    nameCampaign: "",
    statusCampaign: false,
    id: 0,
  });
  
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);
  const [sendKPI, setSendKPI] = useState({
    openModal: false,
    employee_id: employeeId,
    target_customer: "",
    target_revenue: "",
    target_commission: "",
    request_sender_id: employeeId,
    kpi_id: "",
  });

  const [sendKPIEror, setSendKPIError] = useState({
    target_customer: "",
    target_revenue: "",
    target_commission: "",
    kpi_id: "",
  });
  const [sendKPIUpdate, setSendKPIUpdate] = useState({
    openModal: false,
    target_customer: "",
    target_revenue: "",
    target_commission: "",
    request_sender_id: employeeId,
    kpi_assign_id: "",
  });
  const [sendKPIErorUpdate, setSendKPIErrorUpdate] = useState({
    target_customer: "",
    target_revenue: "",
    target_commission: "",
    kpi_id: "",
  });
  const [sendStatus, setSendStatus] = useState({
    openModal: false,
    kpi_assign_id: "",
    status: "",
    request_sender_id: employeeId,
  });
  const [dataCampaign, setDataCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });
  const [isFutureMonth, setIsFutureMonth] = useState(true); // Giá trị mặc định
  const [futureMonth, setFutureMonth] = useState(true); // Giá trị mặc định
  useLayoutEffect(() => {
    getCampaign();
    getTemplateSMSOfCampaign();
       document.title = 'Quản lý KPI | CRM'
  }, []);
  useEffect(() => {
    setKPIEmployee(listKPIEmployee.data);
    setKPIAgency(listKPIAgency.data);
  }, [listKPIAgency, listKPIEmployee]);
    useEffect(() => {
    setKPIEmployeeMonth(listKPIEmployeeMonth.data);
  }, [listKPIEmployeeMonth]);
  const [states, setStates] = useState({
    employee_id: position === "CSKH" ? employeeId : "",
    employee_code: position === "CSKH" ? employeeERP : "",
    from_date: "",
    to_date: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
    date: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
    employee_idV: "",
    from_dateV: "",
  });

  const propsData = {
    employee_id: states?.employee_id,
    employee_code: states?.employee_code,
    from_date: moment(states.from_date).format("YYYY-MM-DD 00:00:00"),
    to_date: moment(states.to_date).format("YYYY-MM-DD 23:59:59"),
    date: moment(states.date).format("YYYY-MM-DD 00:00:00"),
  };
  /* API */
  const { mutate: getCampaign } = useMutation(
    "post-footer-form",
    () => getCampaigns(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setListCampaign(data?.data);
          const newCampaign = await data?.data
            ?.map((item: any) => {
              return {
                id: item.campaign_id,
                label: item.campaign_name,
                value: item.campaign_id,
                active: item.is_active,
              };
            })
            .filter(Boolean);
          setDataCampaign({
            data: newCampaign,
            dropdown: data?.data
              ?.map((item: any) => {
                if (!item.is_active) return;
                return {
                  id: item.campaign_id,
                  label: item.campaign_name,
                  value: item.campaign_id,
                  active: item.is_active,
                };
              })
              .filter(Boolean),
          });
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: createOrUpdateCampaign } = useMutation(
    "post-footer-form",
    (body: any) => postMakeOrUpdateCampaigns(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          getCampaign();
          setCampaign({
            ...campaign,
            isOpenAddOrUpdate: false,
          });
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: getTemplateSMSOfCampaign } = useMutation(
    "post-footer-form",
    () => getSMSTemplates(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setTemplateSMS(
            data?.data?.map((item: TemplateSMSItem) => {
              if (!item.is_used) return;
              return {
                id: item.id,
                label: item.name,
                value: item.content,
                sms_count: item.sms_count,
              };
            })
          );
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: sendKPIAPI } = useMutation(
    "post-footer-form",
    (body: any) => postAddKPI(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendKPI({
            openModal: false,
            kpi_id: "",
            request_sender_id: "",
            target_commission: "",
            target_revenue: "",
            target_customer: "",
            employee_id: "",
          });
          dispatch(
            getKPIEmployee({
              employee_id: states.employee_id,
              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
          dispatch(
            getKPIAgency({
              //  ...propsData,

              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
        } else {
          toast.error(data?.message);
          setSendKPI({
            openModal: false,
            kpi_id: "",
            request_sender_id: "",
            target_commission: "",
            target_revenue: "",
            target_customer: "",
            employee_id: "",
          });
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* API */

  const handleAddOrUpdateCampaign = () => {
    if (!campaign.nameCampaign.trim()) {
      toast.error("Vui lòng nhập tên chiến dịch");
      return;
    }
    const body = {
      campaign_id: campaign.id,
      campaign_name: campaign.nameCampaign,
      is_active: campaign.statusCampaign,
    };

    createOrUpdateCampaign(body);
  };

  const handleValidateSendKPI = () => {
    if (
      !sendKPI.kpi_id ||
      !sendKPI.target_customer ||
      !sendKPI.target_revenue 
    ) {
      setSendKPIError({
        ...sendKPIEror,
        kpi_id: !sendKPI.kpi_id ? "Vui lòng chọn loại khách hàng" : "",
        target_customer: !sendKPI.target_customer
          ? "Cần nhập số khách hàng mục tiêu"
          : "",
        target_revenue: !sendKPI.target_revenue
          ? "Cần nhập số doanh thu dự kiến"
          : "",
       
      });
      return false;
    }
    return true;
  };

  const handleSendKPI = () => {
    if (!handleValidateSendKPI()) return;

    const body = {
      kpi_id: Number(sendKPI.kpi_id),
      employee_id: employeeId,
      target_customer: Number(sendKPI.target_customer),
      target_revenue: Number(sendKPI.target_revenue),
      target_commission: 0,
      request_sender_id: employeeId,
    };
    sendKPIAPI(body);
  };
  const { mutate: sendKPIUpdate1 } = useMutation(
    "post-footer-form",
    (body: any) => postUpdateKPI(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendKPIUpdate({
            openModal: false,
            kpi_assign_id: "",
            request_sender_id: "",
            target_commission: "",
            target_revenue: "",
            target_customer: "",
          });
          setSendStatus({
            ...sendStatus,
            openModal: false,
            status: "",
            kpi_assign_id: "",
          });
          dispatch(
            getKPIEmployee({
              employee_id: states.employee_id,
              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
          dispatch(
            getKPIAgency({
              //  ...propsData,

              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
        } else {
          toast.error(data?.message);
          setSendKPIUpdate({
            openModal: false,
            kpi_assign_id: "",
            request_sender_id: "",
            target_commission: "",
            target_revenue: "",
            target_customer: "",
          });
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleValidateSendKPIUpdate = () => {
    if (
      !sendKPIUpdate.target_customer ||
      !sendKPIUpdate.target_revenue 
    ) {
      setSendKPIErrorUpdate({
        ...sendKPIErorUpdate,

        target_customer: !sendKPIUpdate.target_customer
          ? "Cần nhập số khách hàng mục tiêu"
          : "",
        target_revenue: !sendKPIUpdate.target_revenue
          ? "Cần nhập số doanh thu dự kiến"
          : "",
      
      });
      return false;
    }
    return true;
  };
  const handleSendKPIUpdate = () => {
    if (!handleValidateSendKPIUpdate()) return;

    const body = {
      kpi_assign_id: sendKPIUpdate.kpi_assign_id,
      target_customer: Number(sendKPIUpdate.target_customer),
      target_revenue: Number(sendKPIUpdate.target_revenue),
      target_commission: 0,
      request_sender_id: employeeId,
    };
    sendKPIUpdate1(body);
  };
  const { mutate: sendStatusKPIAPI } = useMutation(
    "post-footer-form",
    (body: any) => postSetStatusKPI(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendStatus({
            ...sendStatus,
            openModal: false,
            kpi_assign_id: "",
            status: "",
          });
          dispatch(
            getKPIEmployee({
              employee_id: states.employee_id,
              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
          dispatch(
            getKPIAgency({
              //  ...propsData,

              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
        } else {
          toast.error(data?.message);
          setSendKPI({
            openModal: false,
            kpi_id: "",
            request_sender_id: "",
            target_commission: "",
            target_revenue: "",
            target_customer: "",
            employee_id: "",
          });
        }
      },
      onError: (error) => {
        console.error("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const handleSendStatusKPI = (status: any) => {
    const body = {
      kpi_assign_id: sendStatus.kpi_assign_id,
      status: status,
      request_sender_id: sendStatus.request_sender_id,
    };
    sendStatusKPIAPI(body);
  };

  /* Column */
  const memoryTableKPI = useMemo(() => {
    return (
      <div
        className={mapModifiers("p-managekpi_table_item")}
        style={{
          width: "200px",
          borderRadius: "12px",
          border: "none",
          boxShadow: "none",
        }}
      >
        <>
          <div
            className="p-managekpi_table_item_paragraph"
            style={{ marginTop: "0px", height: "fit-content" }}
          >
            <Typography
              content="Doanh thu đạt"
              modifiers={["12x18", "400", "center"]}
              styles={{ color: "#7F7E7E", fontSize: "12px" }}
            />
          </div>
        </>
        <>
          <div
            className="p-managekpi_table_item_paragraph"
            style={{ marginTop: "7px", height: "fit-content" }}
          >
            <Typography
              content="100.000.000"
              modifiers={["12x18", "600", "center", "blueNavy"]}
              styles={{ fontSize: "20px" }}
            />
          </div>
        </>
        <>
          <div
            className="p-managekpi_table_item_paragraph"
            style={{ marginTop: "12px", height: "fit-content" }}
          >
            <Typography
              content={`${(
                (100000 / 500000) *
                100
              ).toLocaleString()}% của KPI tháng`}
              modifiers={["12x18", "400", "center"]}
              styles={{ color: "#7F7E7E", fontSize: "10px", fontWeight: "300" }}
            />
          </div>
        </>
        <>
          <div
            className="p-managekpi_table_item_paragraph"
            style={{ marginTop: "0px", height: "fit-content" }}
          >
            <Progress
              percent={(100000 / 500000) * 100}
              format={(percent: any) => `${(500000000).toLocaleString()} đ`}
            />
          </div>
        </>
      </div>
    );
  }, [listCampaign, states]);
  const handleSetKPI = (data: any) => {
    return data.status;
  };
  const columnTable = [
    {
      title: (
        <Typography
          content="Nhóm khách hàng"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{
            textAlign: "center",
            paddingBottom: "5px",
            paddingTop: "5px",
          }}
        />
      ),
      dataIndex: "kpi_name",
      key: "kpi_name",
      width: 600,
 
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "5px",
            paddingTop: "5px",
          }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "center", "blueNavy", "uppercase"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="KH Mục tiêu"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "target_customer",
      key: "target_customer",
      width: 250,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "center" }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="KH Thực Tế"
          modifiers={["12x18", "500", "center", "uppercase"]}
          styles={{ textAlign: "center" }}
        />
      ),
      dataIndex: "real_customer",
      key: "real_customer",
      width: 250,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={
              record === null ? "0" : Math.floor(record).toLocaleString("vi-VN")
            }
            modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "center" }}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Doanh thu dự kiến"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "target_revenue",
      key: "target_revenue",
      width: 250,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={Math.floor(record).toLocaleString("vi-VN")}
            modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "end", marginRight: "12px" }}
          />
        </div>
      ),
    },
      ...(position === "BOD"
    ? [
        {
          title: (
            <Typography
              content="Doanh thu thực tế"
              modifiers={["12x18", "500", "center", "uppercase"]}
            />
          ),
          dataIndex: "real_revenue",
          key: "real_revenue",
          width: 250,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{ justifyContent: "start" }}
            >
              <Typography
                content={
                  record === null
                    ? "0"
                    : Math.floor(record).toLocaleString("vi-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
                styles={{ textAlign: "end", marginRight: "12px" }}
              />
            </div>
          ),
        },
      ]
    : []),
    ...(position === "BOD"
    ? [
         {
      title: (
        <Typography
          content="Hoa hồng dự kiến"
          modifiers={["12x18", "500", "center", "uppercase"]}
         
        />
      ),
      dataIndex: "real_commision",
      key: "real_commision",
      width: 250,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={record == null ? "0" : record.toLocaleString("vn-VN")}
            modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "end", marginRight: "12px" }}
          />
        </div>
      ),
    },
      ]
    : []),
  
    {
      title: (
        <Typography
          content="Trạng thái"
          modifiers={["12x18", "500", "center", "uppercase"]}
        />
      ),
      dataIndex: "status",
      key: "status",
      width: 220,
      render: (record: any, data: any) =>
        handleSetKPI(data) === "pending" ? (
          <div
            className="ant-table-column_item"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "5px",
              paddingTop: "5px",
              background: "#7fb8e6",
            }}
            onClick={
              position === "BOD"
                ? () => {
                    setSendStatus({
                      ...sendStatus,
                      openModal: true,
                      kpi_assign_id: data?.kpi_assign_id,
                    });
                    setSendKPIUpdate({
                      ...sendKPIUpdate,
                      kpi_assign_id: data?.kpi_assign_id,
                      target_customer: data?.target_customer,
                      target_revenue: data?.target_revenue,
                      target_commission: data?.target_commision,
                    });
                  }
                : () => {}
            }
          >
            <Typography
              content={record === "pending" ? "Chờ xét duyệt" : record}
              modifiers={["14x20", "600", "center", "main", "uppercase"]}
            />
          </div>
        ) : handleSetKPI(data) === "rejected" ? (
          <div
            className="ant-table-column_item"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "5px",
              paddingTop: "5px",
              background: "#dc3545",
            }}
            onClick={
              position === "CSKH"
                ? () => {
                    setSendKPIUpdate({
                      ...sendKPIUpdate,
                      openModal: true,
                      kpi_assign_id: data?.kpi_assign_id,
                      target_customer: data?.target_customer,
                      target_revenue: data?.target_revenue,
                      target_commission: data?.target_commision,
                    });
                  }
                : () => {}
            }
          >
            <Typography
              content={record === "rejected" ? "Từ chối" : record}
              modifiers={["14x20", "600", "center", "main", "uppercase"]}
            />
          </div>
        ) : handleSetKPI(data) === "modified" ? (
          <div
            className="ant-table-column_item"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "5px",
              paddingTop: "5px",
              background: "#fd7e14",
            }}
            onClick={
              position === "BOD"
                ? () => {
                    setSendStatus({
                      ...sendStatus,
                      openModal: true,
                      kpi_assign_id: data?.kpi_assign_id,
                    });
                    setSendKPIUpdate({
                      ...sendKPIUpdate,
                      kpi_assign_id: data?.kpi_assign_id,
                      target_customer: data?.target_customer,
                      target_revenue: data?.target_revenue,
                      target_commission: data?.target_commision,
                    });
                  }
                : () => {}
            }
          >
            <Typography
             content={record === "modified" ? "Chờ duyệt lại" : record}
              modifiers={["14x20", "600", "center", "main", "uppercase"]}
            />
          </div>
        ) : (
          <div
            className="ant-table-column_item"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "5px",
              paddingTop: "5px",
            }}
          >
            <Typography
             content={record === "approved" ? "Chấp thuận" : record}
              modifiers={["14x20", "600", "center", "main", "uppercase"]}
            />
          </div>
        ),
    },
  ];

  const memoryTableSeenKPI = useMemo(() => {
    return (
      <div
        className={mapModifiers("p-managekpi_table_item3")}
        style={{
          width: "100%",
          borderRadius: "12px",
          padding: "0px",
          border: "none",
          boxShadow: "none",
          height: "fit-content",
          background: "transparent",
        }}
      >
        <Table
          // dataSource={
          //   kpiEmployee?.details?.length === 4 ? kpiEmployee?.details : dataList
          // }
         dataSource={kpiEmployee?.details
  ? [...kpiEmployee.details].sort((a, b) => {
      const aIndex = order.indexOf(a.kpi_id);
      const bIndex = order.indexOf(b.kpi_id);

      if (aIndex === -1 && bIndex === -1) {
        return String(a.kpi_name).localeCompare(String(b.kpi_name));
      } else if (aIndex === -1) {
        return 1;
      } else if (bIndex === -1) {
        return -1;
      } else {
        return aIndex - bIndex;
      }
    })
  : []
}

          columns={columnTable}
          loading={loadingMonth}
          rowKey="name"
          pagination={false}
          bordered
          rowClassName={(record: any, index: any) => {
            return index % 2 === 0 ? "bg-gay-blur" : "";
          }}
          summary={() => (
            <>
              {kpiEmployee?.details?.length !== 0 && (
                <Table.Summary>
                  <Table.Summary.Row style={{ background: "#f0f0f0" }}>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content="Tổng"
                        modifiers={["16x24", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={(
                         ( kpiEmployee?.details[0]?.target_customer === undefined ? 0 : kpiEmployee?.details[0]?.target_customer ) +
                         (  kpiEmployee?.details[1]?.target_customer === undefined ? 0 :kpiEmployee?.details[1]?.target_customer) +
                            (kpiEmployee?.details[2]?.target_customer === undefined ? 0 : kpiEmployee?.details[2]?.target_customer) +
                             (  kpiEmployee?.details[3]?.target_customer === undefined ? 0 :kpiEmployee?.details[3]?.target_customer) 
                        )?.toLocaleString("vi-VN")}
                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={(
                          ( kpiEmployee?.details[0]?.real_customer === undefined ? 0 : kpiEmployee?.details[0]?.real_customer ) +
                         (  kpiEmployee?.details[1]?.real_customer === undefined ? 0 :kpiEmployee?.details[1]?.real_customer) +
                            (kpiEmployee?.details[2]?.real_customer === undefined ? 0 : kpiEmployee?.details[2]?.real_customer) +
                             (  kpiEmployee?.details[3]?.real_customer === undefined ? 0 :kpiEmployee?.details[3]?.real_customer) 
                        )?.toLocaleString("vi-VN")}
                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={Math.floor(
                          ( kpiEmployee?.details[0]?.target_revenue === undefined ? 0 : kpiEmployee?.details[0]?.target_revenue ) +
                         (  kpiEmployee?.details[1]?.target_revenue === undefined ? 0 :kpiEmployee?.details[1]?.target_revenue) +
                            (kpiEmployee?.details[2]?.target_revenue === undefined ? 0 : kpiEmployee?.details[2]?.target_revenue) +
                             (  kpiEmployee?.details[3]?.target_revenue === undefined ? 0 :kpiEmployee?.details[3]?.target_revenue) 
                        ).toLocaleString("vi-VN")}
                        modifiers={["13x18", "600", "center", "cg-red"]}
                        styles={{ textAlign: "end", marginRight: "12px" }}
                      />
                    </Table.Summary.Cell>
                    {
                      position === "BOD" &&    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={Math.floor(
                          ( kpiEmployee?.details[0]?.real_revenue === undefined ? 0 : kpiEmployee?.details[0]?.real_revenue ) +
                         (  kpiEmployee?.details[1]?.real_revenue === undefined ? 0 :kpiEmployee?.details[1]?.real_revenue) +
                            (kpiEmployee?.details[2]?.real_revenue === undefined ? 0 : kpiEmployee?.details[2]?.real_revenue) +
                             (  kpiEmployee?.details[3]?.real_revenue === undefined ? 0 :kpiEmployee?.details[3]?.real_revenue) 
                        ).toLocaleString("vi-VN")}
                        modifiers={["13x18", "600", "center", "cg-red"]}
                        styles={{ textAlign: "end", marginRight: "12px" }}
                      />
                    </Table.Summary.Cell>
                    }
                    {
                      position === "BOD" &&   <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={Math.floor(
                          ( kpiEmployee?.details[0]?.real_commision === undefined ? 0 : kpiEmployee?.details[0]?.real_commision ) +
                         (  kpiEmployee?.details[1]?.real_commision === undefined ? 0 :kpiEmployee?.details[1]?.real_commision) +
                            (kpiEmployee?.details[2]?.real_commision === undefined ? 0 : kpiEmployee?.details[2]?.real_commision) +
                             (  kpiEmployee?.details[3]?.real_commision === undefined ? 0 :kpiEmployee?.details[3]?.real_commision) 
                        ).toLocaleString("vi-VN")}
                        modifiers={["13x18", "600", "center", "cg-red"]}
                        styles={{ textAlign: "end", marginRight: "12px" }}
                      />
                    </Table.Summary.Cell>
                    }
                    
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography content="" />
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ background: "#fff" }}>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content="Còn lại"
                        modifiers={["16x24", "600", "center", "black"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={
                        (    ( kpiEmployee?.details[0]?.target_customer === undefined ? 0 : kpiEmployee?.details[0]?.target_customer ) +
                         (  kpiEmployee?.details[1]?.target_customer === undefined ? 0 :kpiEmployee?.details[1]?.target_customer) +
                            (kpiEmployee?.details[2]?.target_customer === undefined ? 0 : kpiEmployee?.details[2]?.target_customer) +
                             (  kpiEmployee?.details[3]?.target_customer === undefined ? 0 :kpiEmployee?.details[3]?.target_customer) )
                            >
                        (   ( kpiEmployee?.details[0]?.real_customer === undefined ? 0 : kpiEmployee?.details[0]?.real_customer ) +
                         (  kpiEmployee?.details[1]?.real_customer === undefined ? 0 :kpiEmployee?.details[1]?.real_customer) +
                            (kpiEmployee?.details[2]?.real_customer === undefined ? 0 : kpiEmployee?.details[2]?.real_customer) +
                             (  kpiEmployee?.details[3]?.real_customer === undefined ? 0 :kpiEmployee?.details[3]?.real_customer) )
                            ? (
                           (      ( kpiEmployee?.details[0]?.target_customer === undefined ? 0 : kpiEmployee?.details[0]?.target_customer ) +
                         (  kpiEmployee?.details[1]?.target_customer === undefined ? 0 :kpiEmployee?.details[1]?.target_customer) +
                            (kpiEmployee?.details[2]?.target_customer === undefined ? 0 : kpiEmployee?.details[2]?.target_customer) +
                             (  kpiEmployee?.details[3]?.target_customer === undefined ? 0 :kpiEmployee?.details[3]?.target_customer)  )
                              -
                                 (   ( kpiEmployee?.details[0]?.real_customer === undefined ? 0 : kpiEmployee?.details[0]?.real_customer ) +
                         (  kpiEmployee?.details[1]?.real_customer === undefined ? 0 :kpiEmployee?.details[1]?.real_customer) +
                            (kpiEmployee?.details[2]?.real_customer === undefined ? 0 : kpiEmployee?.details[2]?.real_customer) +
                             (  kpiEmployee?.details[3]?.real_customer === undefined ? 0 :kpiEmployee?.details[3]?.real_customer) )
                              ).toLocaleString("vn-VN")
                            : "0"
                        }
                        modifiers={["13x18", "600", "center", "black"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={
                          Math.floor(
                            (  (   ( kpiEmployee?.details[0]?.real_customer === undefined ? 0 : kpiEmployee?.details[0]?.real_customer ) +
                         (  kpiEmployee?.details[1]?.real_customer === undefined ? 0 :kpiEmployee?.details[1]?.real_customer) +
                            (kpiEmployee?.details[2]?.real_customer === undefined ? 0 : kpiEmployee?.details[2]?.real_customer) +
                             (  kpiEmployee?.details[3]?.real_customer === undefined ? 0 :kpiEmployee?.details[3]?.real_customer) ) /
                             (      ( kpiEmployee?.details[0]?.target_customer === undefined ? 0 : kpiEmployee?.details[0]?.target_customer ) +
                         (  kpiEmployee?.details[1]?.target_customer === undefined ? 0 :kpiEmployee?.details[1]?.target_customer) +
                            (kpiEmployee?.details[2]?.target_customer === undefined ? 0 : kpiEmployee?.details[2]?.target_customer) +
                             (  kpiEmployee?.details[3]?.target_customer === undefined ? 0 :kpiEmployee?.details[3]?.target_customer)  )) *
                              100
                          ).toLocaleString("vn-VN") + "%"
                        }
                        modifiers={["13x18", "600", "center", "black"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={
                         position === "BOD" ?  (      ( kpiEmployee?.details[0]?.target_revenue === undefined ? 0 : kpiEmployee?.details[0]?.target_revenue ) +
                         (  kpiEmployee?.details[1]?.target_revenue === undefined ? 0 :kpiEmployee?.details[1]?.target_revenue) +
                            (kpiEmployee?.details[2]?.target_revenue === undefined ? 0 : kpiEmployee?.details[2]?.target_revenue) +
                             (  kpiEmployee?.details[3]?.target_revenue === undefined ? 0 :kpiEmployee?.details[3]?.target_revenue)  )
                            >
                           (      ( kpiEmployee?.details[0]?.real_revenue === undefined ? 0 : kpiEmployee?.details[0]?.real_revenue ) +
                         (  kpiEmployee?.details[1]?.real_revenue === undefined ? 0 :kpiEmployee?.details[1]?.real_revenue) +
                            (kpiEmployee?.details[2]?.real_revenue === undefined ? 0 : kpiEmployee?.details[2]?.real_revenue) +
                             (  kpiEmployee?.details[3]?.real_revenue === undefined ? 0 :kpiEmployee?.details[3]?.real_revenue)  )
                            ? Math.floor(
                                  (      ( kpiEmployee?.details[0]?.target_revenue === undefined ? 0 : kpiEmployee?.details[0]?.target_revenue ) +
                         (  kpiEmployee?.details[1]?.target_revenue === undefined ? 0 :kpiEmployee?.details[1]?.target_revenue) +
                            (kpiEmployee?.details[2]?.target_revenue === undefined ? 0 : kpiEmployee?.details[2]?.target_revenue) +
                             (  kpiEmployee?.details[3]?.target_revenue === undefined ? 0 :kpiEmployee?.details[3]?.target_revenue)  )
                              -
                                    (      ( kpiEmployee?.details[0]?.real_revenue === undefined ? 0 : kpiEmployee?.details[0]?.real_revenue ) +
                         (  kpiEmployee?.details[1]?.real_revenue === undefined ? 0 :kpiEmployee?.details[1]?.real_revenue) +
                            (kpiEmployee?.details[2]?.real_revenue === undefined ? 0 : kpiEmployee?.details[2]?.real_revenue) +
                             (  kpiEmployee?.details[3]?.real_revenue === undefined ? 0 :kpiEmployee?.details[3]?.real_revenue)  )
                              ).toLocaleString("vi-VN")
                            : "0" : ""
                        }
                        modifiers={["13x18", "600", "center", "black"]}
                        styles={{ textAlign: "end", marginRight: "12px" }}
                      />
                    </Table.Summary.Cell>
                      {
                      position === "BOD" &&  <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content={
                          Math.floor(
                            (  (   ( kpiEmployee?.details[0]?.real_revenue === undefined ? 0 : kpiEmployee?.details[0]?.real_revenue ) +
                         (  kpiEmployee?.details[1]?.real_revenue === undefined ? 0 :kpiEmployee?.details[1]?.real_revenue) +
                            (kpiEmployee?.details[2]?.real_revenue === undefined ? 0 : kpiEmployee?.details[2]?.real_revenue) +
                             (  kpiEmployee?.details[3]?.real_revenue === undefined ? 0 :kpiEmployee?.details[3]?.real_revenue) ) /
                             (      ( kpiEmployee?.details[0]?.target_revenue === undefined ? 0 : kpiEmployee?.details[0]?.target_revenue ) +
                         (  kpiEmployee?.details[1]?.target_revenue === undefined ? 0 :kpiEmployee?.details[1]?.target_revenue) +
                            (kpiEmployee?.details[2]?.target_revenue === undefined ? 0 : kpiEmployee?.details[2]?.target_revenue) +
                             (  kpiEmployee?.details[3]?.target_revenue === undefined ? 0 :kpiEmployee?.details[3]?.target_revenue)  )) *
                              100
                          ).toLocaleString("vn-VN") + "%"
                        }
                        modifiers={["13x18", "600", "center", "black"]}
                      />
                    </Table.Summary.Cell>
                    }
                    {
                      position === "BOD" &&   <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content=""
                        modifiers={["13x18", "600", "right", "black"]}
                      />
                    </Table.Summary.Cell>
                   }
                  
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography content="" />
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            </>
          )}
        />
      </div>
    );
  }, [listCampaign, states, kpiEmployee]);
  const columnTableKPIA = [
    {
      title: (
        <div className="custom-border1">
          <Typography
            content="DOCTOR CHECK"
            modifiers={["12x18", "500", "center", "uppercase"]}
            styles={{ textAlign: "center" }}
          />
        </div>
      ),

      dataIndex: "name",
      key: "name",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "5px",
            paddingTop: "5px",
          }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "center", "blueNavy", "uppercase"]}
          />
        </div>
      ),
    },
    {
      title: (
        <div className="custom-border">
          <Typography
            content="KH mục tiêu"
            modifiers={["12x18", "500", "center", "uppercase"]}
            styles={{
              textAlign: "center",
              paddingRight: "5px",
              borderRight: "1px solid #f0f0f0",
              height: "100%",
            }}
          />
        </div>
      ),

      dataIndex: "target_customer",
      key: "target_customer",
      width: 320,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={Math.floor(record).toLocaleString("vi-VN")}
            modifiers={["13x18", "600", "center", "main"]}
            styles={{
              textAlign: "center",
              paddingBottom: "5px",
              paddingTop: "5px",
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <div className="custom-border">
          <Typography
            content="KH thực tế"
            modifiers={["12x18", "500", "center", "uppercase"]}
            styles={{
              textAlign: "center",
              paddingRight: "5px",
              borderRight: "1px solid #f0f0f0",
              height: "100%",
            }}
          />
        </div>
      ),
      dataIndex: "real_customer",
      key: "real_customer",
      width: 320,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={Math.floor(record).toLocaleString("vi-VN")}
            modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "center" }}
          />
        </div>
      ),
    },
      ...(position === "BOD"
    ? [
       {
      title: (
        <div className="custom-border">
          <Typography
            content="Doanh thu mục tiêu"
            modifiers={["12x18", "500", "center", "uppercase"]}
            styles={{
              textAlign: "center",
              paddingRight: "5px",
              borderRight: "1px solid #f0f0f0",
              height: "100%",
            }}
          />
        </div>
      ),
      dataIndex: "target_revenue",
      key: "target_revenue",
      width: 320,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={Math.floor(record).toLocaleString("vi-VN")}
            modifiers={["13x18", "600", "center", "main"]}
          />
        </div>
      ),
    },
      ]
    : []),
     ...(position === "BOD"
    ? [
        {
      title: (
        <div className="custom-border">
          <Typography
            content="Doanh thu thực tế"
            modifiers={["12x18", "500", "center", "uppercase"]}
            styles={{
              textAlign: "center",
              paddingRight: "5px",
              borderRight: "1px solid #f0f0f0",
              height: "100%",
            }}
          />
        </div>
      ),
      dataIndex: "real_revenue",
      key: "real_revenue",
      width: 320,
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          style={{ justifyContent: "start" }}
        >
          <Typography
            content={Math.floor(record).toLocaleString("vi-VN")}
            modifiers={["13x18", "600", "center", "main"]}
          />
        </div>
      ),
    },
      ]
    : []),
  
  ];
  const memoryTableSeenKPIAgency = useMemo(() => {
    return (
      <div
        className={mapModifiers("p-managekpi_table_item3")}
        style={{
          width: "83%",
          borderRadius: "12px",
          padding: "0px",
          border: "none",
          boxShadow: "none",
          height: "fit-content",
          background: "transparent",
          marginTop: "50px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <Typography
            content="* KPI tháng DOCTOR CHECK"
            modifiers={["16x28", "600", "left", "blueNavy"]}
          />
        </div>
        <Table
          dataSource={kpiAgency?.details}
          columns={columnTableKPIA}
          rowKey="name"
          pagination={false}
          loading={loadingMonth}
          bordered
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row style={{ background: "#fff" }}>
                <Table.Summary.Cell
                  index={6}
                  className="ant-table-summary-cell"
                >
                  <Typography
                    content="Còn lại"
                    modifiers={["16x24", "600", "center", "cg-red"]}
                  />
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={6}
                  className="ant-table-summary-cell"
                >
                  <Typography
                    content={
                      kpiAgency?.details[0]?.target_customer >=
                      kpiAgency?.details[0]?.real_customer
                        ? (
                            kpiAgency?.details[0]?.target_customer -
                            kpiAgency?.details[0]?.real_customer
                          )?.toLocaleString("vi-VN")
                        : "0"
                    }
                    modifiers={["13x18", "600", "center", "cg-red"]}
                  />
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={6}
                  className="ant-table-summary-cell"
                >
                  <Typography
                    content={
                      Math.floor(
                        (kpiAgency?.details[0]?.real_customer /
                          kpiAgency?.details[0]?.target_customer) *
                          100
                      )?.toLocaleString("vi-VN") + "%"
                    }
                    modifiers={["13x18", "600", "center", "cg-red"]}
                  />
                </Table.Summary.Cell>
                {
                  position === "BOD" ?   <Table.Summary.Cell
                  index={6}
                  className="ant-table-summary-cell"
                >
                  <Typography
                    content={
                      kpiAgency?.details[0]?.target_revenue >=
                      kpiAgency?.details[0]?.real_revenue
                        ? (
                            kpiAgency?.details[0]?.target_revenue -
                            kpiAgency?.details[0]?.real_revenue
                          )?.toLocaleString("vi-VN")
                        : "0"
                    }
                    modifiers={["13x18", "600", "center", "cg-red"]}
                  />
                </Table.Summary.Cell> : <></>
                }
                {
                   position === "BOD" ?   <Table.Summary.Cell
                  index={6}
                  className="ant-table-summary-cell"
                >
                  <Typography
                    content={
                      Math.floor(
                        (kpiAgency?.details[0]?.real_revenue /
                          kpiAgency?.details[0]?.target_revenue) *
                          100
                      )?.toLocaleString("vi-VN") + "%"
                    }
                    modifiers={["13x18", "600", "center", "cg-red"]}
                  />
                </Table.Summary.Cell> : <></>
                }
              
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
        {/* <PublicTable
        listData={dataList}
       // loading={states.loading}
        column={columnTable}
        rowkey={'master_ref'}
        isHideRowSelect={false}
        showExpandColumn
        isExpandable
        scroll={{ x: 'max-content', y: 'calc(100vh - 210px)' }}
        defaultExpandAllRow={false}
      //  handleOnchange={checkYouHavePermissionApproveCommissions ? handleTableChange : handleTableChange1}
       
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
      
      /> */}
      </div>
    );
  }, [listCampaign, states, kpiAgency]);

  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            height: "189px",
            background: "#fce1d6",
            borderRight: "1px solid #f0f0f0",
          }}
        ></div>
      ),

      children: [
        {
          title: (
            <Typography
              content="Ngày"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "date",
          key: "date",
          fixed:"left",
          rowSpan: 2,
          width: 100,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            height: "190px",
            background: "#fce1d6",
            borderLeft: "1px solid #f0f0f0",
            borderRight: "2px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "10px",
            }}
          >
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "uppercase",
                color: "#00556e",
                fontWeight: "600",
              }}
            >
              Khách hàng F1
            </span>
            <br></br>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "capitalize",
                color: "#333",
                fontWeight: "600",
              }}
            >
              KH Mới Hoàn Toàn Trong Ngày
            </span>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - Mỗi ngày chat chỉn chu 10 - 15 KH
            </span>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - Tỉ lệ đặt hẹn lý thuyết/inbox trong ngày: 20%{" "}
            </span>
            <br></br>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "capitalize",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Chat lại với KH nóng, ấm & lạnh trước đây
            </span>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - Mỗi ngày gửi tối thiểu 15 KH Ấm & 10 KH Nóng{" "}
            </span>
          </div>
        </div>
      ),
      children: [
        {
          title: (
            <Typography
              content="Inbox Mới"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{
                textAlign: "center",
                paddingBottom: "10px",
                paddingTop: "10px",
              }}
            />
          ),
          dataIndex: "new_inbox_count1",
          key: "new_inbox_count1",
          width: 70,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Inbox Cũ"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "old_inbox_count1",
          key: "old_inbox_count1",
          width: 70,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="SĐT (Pancake)"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "phone_number_count1",
          key: "phone_number_count1",
          width: 90,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Đặt hẹn"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "customer_appointments_count1",
          key: "customer_appointments_count1",
          width: 70,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Tới Khám"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "customer_checkin_count1",
          key: "customer_checkin_count1",
          width: 70,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Doanh thu dự kiến"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "revenue1",
          key: "revenue1",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Doanh thu thực tế"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "real_revenue1",
          key: "real_revenue1",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            height: "190px",
            background: "#c9edfb",
            borderRight: "2px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "480px",
              paddingTop: "10px",
            }}
          >
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "uppercase",
                color: "#00556e",
                fontWeight: "600",
              }}
            >
              Khách hàng F2
            </span>
            <br></br>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              - Mỗi KH từng tầm soát gói A,B,C làm thêm trung bình &gt; 2 dịch
              vụ lẻ trong vòng 6 tháng (tiền đề để nâng cấp gói cao hơn sau 6
              tháng tiếp theo)
            </span>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - Trung bình 90% KH làm thêm 3 dịch vụ lẻ
            </span>
          </div>
        </div>
      ),
      children: [
        {
          title: (
            <Typography
              content="KH liên hệ hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
                              styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_contacts_count2",
          key: "customer_contacts_count2",
          width: 80,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH đặt thêm DV lẻ"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{
                textAlign: "center",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            />
          ),
          dataIndex: "customer_add_service_retail_count2",
          key: "customer_add_service_retail_count2",
         width: 90,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH tới thực tế hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
                              styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_checkin_count2",
          key: "customer_checkin_count2",
         width: 90,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Doanh thu dự kiến"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "revenue2",
          key: "revenue2",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
          {
          title: (
            <Typography
              content="Doanh thu thực tế"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "real_revenue2",
          key: "real_revenue2",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            height: "190px",
            background: "#f2cef0",
            borderRight: "2px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "10px",
            }}
          >
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "uppercase",
                color: "#00556e",
                fontWeight: "600",
              }}
            >
              Khách hàng F3
            </span>
            <br></br>

            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              &gt; 90% KH tầm soát lại sau 6-12 tháng với gói khám cao hơn
            </span>
          </div>
        </div>
      ),
      children: [
        {
          title: (
            <Typography
              content="KH liên hệ hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
                              styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_contacts_count3",
          key: "customer_contacts_count3",
         width: 80,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH đặt hẹn tầm soát lại"
              modifiers={["12x18", "500", "center", "uppercase"]}
                              styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_rescreening_appointments_count3",
          key: "customer_rescreening_appointments_count3",
          width: 100,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH tới thực tế hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
                  styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_checkin_count3",
          key: "customer_checkin_count3",
          width: 100,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Doanh thu dự kiến"
              modifiers={["12x18", "500", "center", "uppercase"]}
               styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}
            />
          ),
          dataIndex: "revenue3",
          key: "revenue3",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
         {
          title: (
            <Typography
              content="Doanh thu thực tế"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center",  }}
            />
          ),
          dataIndex: "real_revenue3",
          key: "real_revenue3",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            height: "190px",
            background: "#d9f2d2",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "10px",
            }}
          >
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                textTransform: "uppercase",
                color: "#00556e",
                fontWeight: "600",
              }}
            >
              Khách hàng WOM
            </span>
            <br></br>

            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - Mỗi ngày liên hệ với 10KH
            </span>
            <span
              style={{
                textAlign: "left",
                marginLeft: "20px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              - 1KH đã tầm soát sẽ giới thiệu &gt; 3 KH mới
            </span>
          </div>
        </div>
      ),
      children: [
        {
          title: (
            <Typography
              content="KH liên hệ hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
               styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_contacts_count4",
          key: "customer_contacts_count4",
          width: 80,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH Giới thiệu"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center" }}
            />
          ),
          dataIndex: "customer_refered_count4",
          key: "customer_refered_count4",
          width: 90,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="KH tới thực tế hôm nay"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "center", wordBreak: "break-word", whiteSpace: "normal" }}

            />
          ),
          dataIndex: "customer_checkin_count4",
          key: "customer_checkin_count4",
          width: 90,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "5px",
                paddingTop: "5px",
              }}
            >
              <Typography
                content={record == null ? "-" : record.toLocaleString("vn-VN")}
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
        {
          title: (
            <Typography
              content="Doanh thu dự kiến"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "revenue4",
          key: "revenue4",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
         {
          title: (
            <Typography
              content="Doanh thu thực tế"
              modifiers={["12x18", "500", "center", "uppercase"]}
              styles={{ textAlign: "right", marginRight: "5px" }}
            />
          ),
          dataIndex: "real_revenue4",
          key: "real_revenue4",
          width: 120,
          render: (record: any, data: any) => (
            <div
              className="ant-table-column_item"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "end",
                paddingBottom: "5px",
                paddingTop: "5px",
                marginRight: "5px",
              }}
            >
              <Typography
                content={
                  record == null
                    ? "-"
                    : Math.floor(record).toLocaleString("vn-VN")
                }
                modifiers={["13x18", "600", "center", "main"]}
              />
            </div>
          ),
        },
      ],
    }, 
  ];
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      const screenWidth = window.innerHeight;
      // Nếu màn hình nhỏ hơn hoặc bằng 15.6 inch (1920 x 1080 hoặc nhỏ hơn)
      setIsSmallScreen(screenWidth <= 800); // Tùy thuộc vào kích thước thực tế của màn hình 15.6 inch
    };

    // Gọi hàm kiểm tra khi component mount
    checkScreenSize();

    // Gọi hàm khi resize cửa sổ
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  const memoryTableSeenKPIDay = useMemo(() => {
    return (
      <div
        className={mapModifiers("p-managetask_table_item3")}
        style={{
          width: "100%",
          borderRadius: "12px",
          padding: "0px",
          border: "none",
          boxShadow: "none",
          height: "fit-content",
          background: "transparent",
        }}
      >
        <Table
          dataSource={processedData}
          columns={columns}
          pagination={false}
          // loading={IsLoadingKPIMaster} 
          //bordered
          // rowClassName={(record: any, index: any) => {
          //   return index % 2 === 0 ? "bg-gay-blur" : "";
          // }}
              scroll={{ x: 'max-content', y: isSmallScreen ? '50vh' : '61vh' }} // Thay đổi giá trị scroll

             summary={() => (
            <>
            
                 {/* {kpiEmployeeMonth?.details?.length !== undefined ?    <Table.Summary> */}
                   {(kpiEmployeeMonth?.details?.length !== undefined && processedData.length >> 0) ?    <Table.Summary>
                  <Table.Summary.Row style={{ background: "#f0f0f0" }}>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                      <Typography
                        content="Tổng"
                        modifiers={["16x24", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={processedDataTotal[0].new_inbox_count1_Total.toLocaleString("vn-VN")}

                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={processedDataTotal[0].old_inbox_count1_Total.toLocaleString("vn-VN")}

                     
                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                           content={processedDataTotal[0].phone_number_count1_Total.toLocaleString("vn-VN")}


  modifiers={["13x18", "600", "center", "cg-red"]}
/>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                                   content={processedDataTotal[0].customer_appointments_count1_Total.toLocaleString("vn-VN")}
             
                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                           content={processedDataTotal[0].customer_checkin_count1_Total.toLocaleString("vn-VN")}

                      
                      
                      
                        modifiers={["13x18", "600", "center", "cg-red"]}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={Math.floor(processedDataTotal[0].revenue1_Total).toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[0]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[0].revenue).toLocaleString("vn-VN")
// }
                      
                         
                      
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                      <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={Math.floor(processedDataTotal[0].real_revenue1_Total).toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[0]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[0].revenue).toLocaleString("vn-VN")
// }
                      
                         
                      
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                     <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                     content={processedDataTotal[0].customer_contacts_count2_Total.toLocaleString("vn-VN")}

                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                       />
                       
                     </Table.Summary.Cell>
                     <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={processedDataTotal[0].customer_add_service_retail_count2_Total.toLocaleString("vn-VN")}
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={processedDataTotal[0].customer_checkin_count2_Total.toLocaleString("vn-VN")}

                     
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                         content={Math.floor(processedDataTotal[0].revenue2_Total).toLocaleString("vn-VN")}
//                           content={
//   kpiEmployeeMonth?.details?.[1]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[1].revenue).toLocaleString("vn-VN")
// }
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={Math.floor(processedDataTotal[0].real_revenue2_Total).toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[0]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[0].revenue).toLocaleString("vn-VN")
// }
                      
                         
                      
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={processedDataTotal[0].customer_contacts_count3_Total.toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[2]?.customer_contacts_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[2].customer_contacts_count.toLocaleString("vn-VN")
// }
                       
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                     <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                           content={processedDataTotal[0].customer_rescreening_appointments_count3_Total.toLocaleString("vn-VN")}
//                          content={
//   kpiEmployeeMonth?.details?.[2]?.customer_rescreening_appointments_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[2].customer_rescreening_appointments_count.toLocaleString("vn-VN")
// }
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                         content={processedDataTotal[0].customer_checkin_count3_Total.toLocaleString("vn-VN")}
//                             content={
//   kpiEmployeeMonth?.details?.[2]?.customer_checkin_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[2].customer_checkin_count.toLocaleString("vn-VN")
// }
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                           content={Math.floor(processedDataTotal[0].revenue3_Total).toLocaleString("vn-VN")}
//                             content={
//   kpiEmployeeMonth?.details?.[2]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[2].revenue).toLocaleString("vn-VN")
// }
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                          styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={Math.floor(processedDataTotal[0].real_revenue3_Total).toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[0]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[0].revenue).toLocaleString("vn-VN")
// }
                      
                         
                      
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                           content={processedDataTotal[0].customer_contacts_count4_Total.toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[3]?.customer_contacts_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[3].customer_contacts_count.toLocaleString("vn-VN")
// }
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                     <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={processedDataTotal[0].customer_refered_count4_Total.toLocaleString("vn-VN")}
//                           content={
//   kpiEmployeeMonth?.details?.[3]?.customer_refered_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[3].customer_refered_count.toLocaleString("vn-VN")
// }
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={processedDataTotal[0].customer_checkin_count4_Total.toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[3]?.customer_checkin_count == null
//     ? "-"
//     : kpiEmployeeMonth.details[3].customer_checkin_count.toLocaleString("vn-VN")
// }
                         modifiers={["13x18", "600", "center", "cg-red"]}
                       
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                          content={Math.floor(processedDataTotal[0].revenue4_Total).toLocaleString("vn-VN")}
//                                           content={
//   kpiEmployeeMonth?.details?.[3]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[3].revenue).toLocaleString("vn-VN")
// }
                       
                         modifiers={["13x18", "600", "center", "cg-red"]}
                          styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                       <Table.Summary.Cell
                      index={6}
                      className="ant-table-summary-cell"
                    >
                       <Typography
                            content={Math.floor(processedDataTotal[0].real_revenue4_Total).toLocaleString("vn-VN")}
//                            content={
//   kpiEmployeeMonth?.details?.[0]?.revenue == null
//     ? "-"
//     : Math.floor(kpiEmployeeMonth.details[0].revenue).toLocaleString("vn-VN")
// }
                      
                         
                      
                      
                         modifiers={["13x18", "600", "center", "cg-red"]}
                         styles={{ textAlign: "end", marginRight: "4px" }}
                      />
                     </Table.Summary.Cell>
                  </Table.Summary.Row>
               
                   </Table.Summary> :<></>
                
                 }
            
            </>
          )}
          
        />
      </div>
    );
  }, [listCampaign, states, processedData, IsLoadingKPIMaster,listKPIEmployeeMonth, kpiEmployeeMonth]);
  const [modeButtonAdd, setModeButtonAdd] = useState(false);
  const handlePrintAndRemove = () => {
    setSelectedDates((prevDates) => {
      if (prevDates.length === 0) {
       
        return prevDates; // Mảng rỗng
      }

      // Lấy phần tử đầu tiên
      const dateToPrint = prevDates[0];
     

      // Xóa phần tử vừa in ra khỏi mảng
      const newDates = prevDates.slice(1);
      setRemovedDates((prevRemovedDates) => [...prevRemovedDates, dateToPrint]);
      return newDates;
    });
  };
  const handlePrintAndRemove1 = () => {
    setRemovedDates((prevDates) => {
      if (prevDates.length === 0) {
       
        return prevDates; // Mảng rỗng
      }

      // Lấy phần tử đầu tiên
      const dateToPrint = prevDates[0];
     

      // Xóa phần tử vừa in ra khỏi mảng
      const newDates = prevDates.slice(1);
      setSelectedDates((prevRemovedDates) => [...prevRemovedDates, dateToPrint]);
      return newDates;
    });
  };
  const handleSequentialAPI = async () => {
      dispatch(
                        getKPIEmployeeMonth({
                          //  ...propsData,
                             employee_id: states.employee_id,
            employee_code: states.employee_code,
                          from_date: states.from_date,
                          to_date: states.to_date,
                        } as any)
                      );
      setModeButton(false);
  };
  const disableFutureMonths = (current:any) => {
  return current && current > dayjs().endOf('month');
};
  return (
    <div className="p-managekpi">
      <PublicLayout>
        <PublicHeader
          titlePage={"Quản lý KPI"}
          handleGetTypeSearch={() => {}}
          handleFilter={() => {}}
          handleCleanFilter={() => {}}
          isHideFilter
          isHideService
          className="p-managekpi_header"
          isDial={false}
          isHideEmergency
          isHideCleanFilter
          tabLeft={
            <>
              <div className="p-managekpi_header1_item1">
                <CDatePickers
                    disabledDate={disableFutureMonths}
                  handleOnChange={(date: any) => {
                const selectedDate = (date).startOf('month'); // Đặt ngày đầu tiên của tháng được chọn
const currentDate = moment().startOf('month'); // Đặt ngày đầu tiên của tháng hiện tại



// Kiểm tra nếu tháng được chọn là trong quá khứ
if (selectedDate.isBefore(currentDate)) {
  setIsFutureMonth(true); // Nếu là tháng trong quá khứ
} else {
  setIsFutureMonth(false); // Nếu là tháng hiện tại hoặc tương lai
}
                    setSelectedDates([])
                    if (date) {
                      // Ngày đầu tiên của tháng đã chọn
                      setStates({
                        ...states,
                        to_date: date
                          .clone()
                          .endOf("month")
                          .format("YYYY-MM-DD 23:59:59"),
                        from_date: date
                          .clone()
                          .startOf("month")
                          .format("YYYY-MM-DD 00:00:00"),
                        date: date
                          .clone()
                          .startOf("month")
                          .format("YYYY-MM-DD 00:00:00"),
                        from_dateV: date
                          .clone()
                          .startOf("month")
                          .format("YYYY-MM-DD 00:00:00"),
                      });
                     
                      const currentDate = moment(); // Lấy ngày hiện tại
                      const selectedMonth = date.month(); // Lấy tháng đã chọn (0 - 11)
                      const currentMonth = currentDate.month(); // Lấy tháng hiện tại (0 - 11)
                      const selectedYear = date.year(); // Lấy năm đã chọn
                      const currentYear = currentDate.year(); // Lấy năm hiện tại

                      let daysInMonth: number; // TypeScript tự động suy ra kiểu `any[]`

                      if (
                        selectedYear === currentYear &&
                        selectedMonth === currentMonth
                      ) {
                        // Nếu là tháng hiện tại, chỉ lấy số ngày hiện tại trong tháng
                        daysInMonth = currentDate.date();
                      } else if (
                        selectedYear < currentYear ||
                        (selectedYear === currentYear &&
                          selectedMonth < currentMonth)
                      ) {
                        // Nếu là tháng đã qua, lấy số ngày cuối cùng của tháng
                        daysInMonth = date.daysInMonth();
                      } else {
                        // Nếu là tháng tương lai, không thêm gì vào mảng
                      
                        return;
                      }

                    
                    }
                  }}
                  variant="simple"
                  //   value={states.date}
                  fomat="MM/YYYY"
                  isShowTime={false}
                  placeholder="Chọn tháng cần xem"
                  picker="month"
                />
              </div>
              <div className="p-managekpi_header1_item1">
                {position === "CSKH" ? (
                  <></>
                ) : (
                    <div style={{minWidth:"230px"}}>
                       <Dropdown
                    dropdownOption={listEmployeeTeams || []}
                    placeholder="Chọn 1 CSKH"
                    handleSelect={(item) => {
                      setStates({
                        ...states,
                        employee_id: String(item?.id || ""),
                        employee_code: String(item?.erp_code || ""),
                        employee_idV: String(item?.id || ""),
                      });
                   
                    }}
                    variant="simple"
                    className="listFilter"
                  />
                 </div>
                )}

                <Button
                  // disabled={modeButton}
                  onClick={() => {
                    setModeButton(true);
                    if (
                      states.employee_idV === "" &&
                      states.employee_id === ""
                    ) {
                      toast.error("Vui lòng chọn 1 CSKH");
                    } else if (!states.from_dateV && !states.from_date) {
                      toast.error("Vui lòng chọn tháng");
                    }
                    // nếu mà cái khúc này thì làm sao tôi cũng chả biết nữa thật sự luôn á trời
                    else {
                      if (isFutureMonth === true) {
                        setFutureMonth(true)
                      }
                      else {
                        setFutureMonth(false)
                      }
                       dispatch(clearKPIMonth());
                      dispatch(
                        getKPIEmployee({
                          employee_id: states.employee_id,
                          from_date: states.from_date,
                          to_date: states.to_date,
                        } as any)
                      );
                      dispatch(
                        getKPIAgency({
                          //  ...propsData,

                          from_date: states.from_date,
                          to_date: states.to_date,
                        } as any)
                      );
                        dispatch(
                        getKPIDays1({
                          //  ...propsData,
                             employee_id: states.employee_id,
                          from_date: states.from_date,
                          to_date: states.to_date,
                        } as any)
                      );
      setModeButton(false);

                      setStates({
                        ...states,
                        employee_idV: "",
                        from_dateV: "",
                      });
                      setModeButtonAdd(true);
                      handleSequentialAPI();
                    }
                  }}
                  style={{ marginTop: "10px" }}
                >
                  <Typography content="Lọc" />
                </Button>
              </div>
            </>
          }
          listBtn={
            <>
              {position === "CSKH" ? (
              <>
  {kpiEmployee?.details?.length !== 4 && (
    <>
      {futureMonth === false && modeButtonAdd === true && (
        <Button
          onClick={() => {
            setSendKPI({
              ...sendKPI,
              openModal: true,
            });
          }}
        >
          <Typography content="Thêm mới KPI" modifiers={["400"]} />
        </Button>
      )}
    </>
  )}
</>

              ) : (
                <></>
              )}

              <Switch
                checkedChildren="KPI Tháng"
                unCheckedChildren="KPI Ngày"
                defaultChecked
                onChange={() => setModeTable(!modeTable)}
              />
            </>
          }
        />
        {kpiAgency?.length === 0 ? (
          <CEmpty description="Không có dữ liệu ...!" />
        ) : (
          <div
            className="p-managekpi_table"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "self-start",
              height: "fit-content",
            }}
          >
            {/* <div style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "rgb(245 245 245)",  borderRadius: '16px',height:"fit-content", padding:"30px 20px",   boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',}}> {memoryAddTableKPI}</div>  */}
            {modeTable === true ? (
              <> {memoryTableSeenKPIDay}</>
            ) : (
                  <>
                    {
                      loadingMonth === true ? <Spin /> : <>
                       {memoryTableSeenKPI}
                {memoryTableSeenKPIAgency}
                      </>
                    }
               
              </>
            )}
           
          </div>
        )}
      </PublicLayout>

      <CModal
        isOpen={sendKPI.openModal}
        title={"Thêm mới KPI"}
        onCancel={() => setSendKPI({ ...sendKPI, openModal: false })}
        textCancel="Thoát"
        textOK={"Thêm mới"}
        onOk={handleSendKPI}
      >
        <div style={{ marginBottom: "10px" }}>
          <Dropdown2
            dropdownOption={convertToDropdownOptions(updatedDataCustom, employeeId ?? "") || []}
            //   defaultValue={valUpdate?.origin as DropdownData}
            label="Chọn loại khách hàng"
            placeholder="Chọn loại khách hàng"
            handleSelect={(item) => {
              setSendKPI({
                ...sendKPI,
                kpi_id: item.kpi_id,
              });
              setSendKPIError({ ...sendKPIEror, kpi_id: "" });
            }}
            variant="simple"
            //  values={dataForm.serviceAllowTypeBooking1}
            error={sendKPIEror.kpi_id}
            isRequired
          />
        </div>

        <Input
          error={sendKPIEror.target_customer}
          isRequired
          type="number"
          label="Số KH mục tiêu"
          placeholder="Nhập số KH mục tiêu"
          variant="simple"
          value={sendKPI.target_customer}
          onChange={(event) => {
            setSendKPI({
              ...sendKPI,
              target_customer: event.target.value,
            });
            setSendKPIError({
              ...sendKPIEror,
              target_customer: "",
            });
          }}
        />

        <Input
          error={sendKPIEror.target_revenue}
          isRequired
          type="number"
          label="Số DT dự kiến"
          placeholder="Nhập số DT dự kiến"
          variant="simple"
          value={sendKPI.target_revenue}
          onChange={(event) => {
            setSendKPI({
              ...sendKPI,
              target_revenue: event.target.value,
            });
            setSendKPIError({
              ...sendKPIEror,
              target_revenue: "",
            });
          }}
        />
        
      </CModal>
      <CModal
        isOpen={sendStatus.openModal}
        title={"Xác nhận yêu cầu KPI"}
        footer={null}
        isHideFooter={false}
        onCancel={() =>
          setSendStatus({
            ...sendStatus,
            openModal: false,
            kpi_assign_id: "",
            status: "",
          })
        }
        textCancel="Thoát"
        textOK={"Xong"}
        onOk={() =>
          setSendStatus({
            ...sendStatus,
            openModal: false,
            kpi_assign_id: "",
            status: "",
          })
        }
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{ width: "40%" }}
            onClick={() => handleSendStatusKPI("approved")}
          >
            <Button modifiers={["primary"]}>
              <Typography content="Đồng ý" />
            </Button>
          </div>
          <div
            style={{ width: "40%" }}
            onClick={() => handleSendStatusKPI("rejected")}
          >
            <Button modifiers={["red"]}>
              <Typography content="Từ chối" />
            </Button>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ced4da",
            marginTop: "30px",
            padding: "20px 10px",
            borderRadius: "4px",
          }}
        >
          <Input
            error={sendKPIErorUpdate.target_customer}
            isRequired
            type="number"
            label="Số KH mục tiêu"
            variant="simple"
            value={sendKPIUpdate.target_customer}
            onChange={(event) => {
              setSendKPIUpdate({
                ...sendKPIUpdate,
                target_customer: event.target.value,
              });
              setSendKPIErrorUpdate({
                ...sendKPIErorUpdate,
                target_customer: "",
              });
            }}
          />
          <Input
            error={sendKPIErorUpdate.target_revenue}
            isRequired
            type="number"
            label="Doanh thu dự kiến"
            variant="simple"
            value={sendKPIUpdate.target_revenue}
            onChange={(event) => {
              setSendKPIUpdate({
                ...sendKPIUpdate,
                target_revenue: event.target.value,
              });
              setSendKPIErrorUpdate({
                ...sendKPIErorUpdate,
                target_revenue: "",
              });
            }}
          />
         
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div style={{ width: "40%" }} onClick={handleSendKPIUpdate}>
              <Button modifiers={["foreign"]}>
                <Typography content="Cập nhật" />
              </Button>
            </div>
          </div>
        </div>
      </CModal>
      <CModal
        isOpen={sendKPIUpdate.openModal}
        title={"Cập nhật KPI"}
        onCancel={() =>
          setSendKPIUpdate({
            ...sendKPIUpdate,
            openModal: false,
            target_customer: "",
            target_revenue: "",
            target_commission: "",
            kpi_assign_id: "",
          })
        }
        textCancel="Thoát"
        textOK={"Cập nhật"}
        onOk={handleSendKPIUpdate}
      >
        <div style={{ marginBottom: "10px" }}></div>

        <Input
          error={sendKPIErorUpdate.target_customer}
          isRequired
          type="number"
          label="Số KH mục tiêu"
          placeholder="Nhập số KH mục tiêu"
          variant="simple"
          value={sendKPIUpdate.target_customer}
          onChange={(event) => {
            setSendKPIUpdate({
              ...sendKPIUpdate,
              target_customer: event.target.value,
            });
            setSendKPIErrorUpdate({
              ...sendKPIErorUpdate,
              target_customer: "",
            });
          }}
        />

        <Input
          error={sendKPIErorUpdate.target_revenue}
          isRequired
          type="number"
          label="Số DT dự kiến"
          placeholder="Nhập số DT dự kiến"
          variant="simple"
          value={sendKPIUpdate.target_revenue}
          onChange={(event) => {
            setSendKPIUpdate({
              ...sendKPIUpdate,
              target_revenue: event.target.value,
            });
            setSendKPIErrorUpdate({
              ...sendKPIErorUpdate,
              target_revenue: "",
            });
          }}
        />
       
      </CModal>
    </div>
  );
};

export default Manage_KPIs2;
