/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin } from "antd";
import { sendMessagetype } from "assets/data";
import Button from "components/atoms/Button";
import CDatePickers from "components/atoms/CDatePickers";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Switchs from "components/atoms/Switchs";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import FormAddMarketingCampaign, {
  AMOUNT_SMS,
  CampaignFormType,
} from "components/molecules/FormAddMarketingCampaign";
import CDrawer from "components/organisms/CDrawer";
import CModal from "components/organisms/CModal";
import MemoizedResultCampaignSMS from "components/organisms/ResultCampaignSms";
import PublicHeader from "components/templates/PublicHeader";
import PublicLayout from "components/templates/PublicLayout";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { loadKPIEmployeeChartViewItem } from "services/api/kpiMonth/types";
import {
  getCampaignLogs,
  getCampaigns,
  getSMSTemplates,
  postMakeOrUpdateCampaigns,
  postSendCampaign,
} from "services/api/point";
import { TemplateSMSItem } from "services/api/point/types";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getKPIEmployeeChart } from "store/kpi_month";
import mapModifiers from "utils/functions";

interface SalesData {
  name: string;
  revenue: number;
}

interface SalesBarChartProps {
  data: SalesData[];
  title: string;
}
interface KpiDetail {
  kpi_assign_id: number;
  kpi_id: number;
  kpi_name: string;
  kpi_code: string;
  target_customer: number;
  target_revenue: number;
  target_commision: number;
  real_customer: number;
  real_revenue: number;
  real_commision: number;
  status: string;
}
interface EmployeeDetails {
  employee_fullname: string;
  details: KpiDetail[];
}

interface KpiChartProps {
  data: EmployeeDetails[];
}

const formatMoney = (value:any) => {
  return value.toLocaleString('vi-VN'); // Định dạng theo kiểu Việt Nam
};
const KpiChart = ({ data }: KpiChartProps) => {

  const processData = (kpiName: string) => {
    return data.map((employee: any) => {
      const kpi = employee.details.find(
        (d: any) => d.kpi_name.trim() === kpiName
      );
      return {
        name: employee.employee_fullname,
        target_customer: kpi?.target_customer ?? 0,
        real_customer: kpi?.real_customer ?? 0,
        target_revenue: kpi?.target_revenue ?? 0,
        real_revenue: kpi?.real_revenue ?? 0,
      };
    });
  };
  
  const charts = [
    "Report Tổng",
    "Khách Hàng F1",
    "Khách Hàng F2",
    "Khách Hàng F3",
    "Khách Hàng WOM",
 
  ].map((kpiName) => {
    return (
      <div
        key={kpiName}
        style={{ width: "100%", height: "35vh", marginBottom: 30 }}
      >
        <h3>{kpiName}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processData(kpiName)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey={(entry) => {
    if (entry.name) {
      const nameParts = entry.name.split(" ");
      return nameParts.slice(-2).join(" ");
    }
    return ""; // Trường hợp entry.name là null hoặc undefined
  }}
  interval={0}
  tick={{
    textAnchor: "center",
    fontSize: 10
  }}
/>

             <Tooltip formatter={formatMoney} />
            {/* Y-axis for Customer (left) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: "", angle: -90, position: "insideLeft" }}
            />

            {/* Y-axis for Revenue (right) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "",
                angle: -90,
                position: "insideRight",
              }}
              tickFormatter={formatMoney}
            />

            <Tooltip />
            <Legend />

            {/* Bars for Customer Data */}
            <Bar
              yAxisId="left"
              dataKey="target_customer"
              name="Khách hàng mục tiêu"
              fill="#5a9bd5"
            />
            <Bar
              yAxisId="left"
              dataKey="real_customer"
              name="Khách hàng thực tế"
              fill="#145f82"
            />

            {/* Lines for Revenue Data */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="target_revenue"
              name="Doanh thu dự kiến"
              stroke="#ff7300"
              strokeWidth={2}
              
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="real_revenue"
              name="Doanh thu thực tế"
              stroke="#ff0000"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: "20px",
        justifyContent: "center",
      }}
    >
      {charts}
    </div>
  );
};

const ChartSalers: React.FC = () => {
  const dispatch = useAppDispatch();
  const listKPIEmployeeChart = useAppSelector(
    (state) => state.kpiMonth.listKPIEmployeeChart
  );
  const loadingKPIEmployeeChart = useAppSelector(
    (state) => state.kpiMonth.isLoadingKPIMasterChart
  );
  const [loadingKpiEmployeeChart, setLoadingKPIEmployeeChart] =
    useState(loadingKPIEmployeeChart);
  const [kpiEmployeeChart, setKPIEmployeeChart] =
    useState(listKPIEmployeeChart);
  const [kpiEmployeeChart1, setKPIEmployeeChart1] =
    useState(listKPIEmployeeChart?.data?.employees);
  const [listCampaign, setListCampaign] = useState([]);
  const [listCampaignDetail, setListCampaignDetail] = useState([]);
  const storageEmployeeList = localStorage.getItem("listCSKH");

  const [listEmployeeTeams1, setListEmployeeTeams1] = useState(
    storageEmployeeList ? JSON.parse(storageEmployeeList || "") : ([] as any)
  );
  const [listEmployeeTeams, setListEmployeeTeams] = useState([]);
   useLayoutEffect(() => {
    document.title = "Biểu đồ KPI | CRM";
  }, [])
  useEffect(() => {
    const filteredArray = listEmployeeTeams1.filter((item: any) => 
        item.id !== "NV26224163644" && item.id !== "NV00078"
  );
    const result = filteredArray?.map((item: any) => item.value);
     dispatch(
                      getKPIEmployeeChart({
                        employee_ids: result,
                        from_date: states.from_date,
                        to_date: states.to_date,
                      } as any)
                    );
  setListEmployeeTeams(result);
}, []);
    useEffect(() => {
    setLoadingKPIEmployeeChart(loadingKpiEmployeeChart)
  }, [loadingKPIEmployeeChart]);
  const [campaign, setCampaign] = useState({
    isOpen: false,
    isOpenAddOrUpdate: false,
    isUpdate: false,
    nameCampaign: "",
    statusCampaign: false,
    id: 0,
  });


  useEffect(() => {
    setKPIEmployeeChart1(listKPIEmployeeChart?.data?.employees)
   
  
  }, [listKPIEmployeeChart])
    useEffect(() => {
      if (kpiEmployeeChart1?.length !== undefined) {

    
        const newData = kpiEmployeeChart1.map(employee => {
  const reportTotal = employee.details.reduce(
    (acc, current) => {
      // eslint-disable-next-line no-param-reassign
      acc.real_commision += current.real_commision;
      // eslint-disable-next-line no-param-reassign
      acc.real_customer += current.real_customer;
      // eslint-disable-next-line no-param-reassign
      acc.real_revenue += current.real_revenue;
      // eslint-disable-next-line no-param-reassign
      acc.target_commision += current.target_commision;
      // eslint-disable-next-line no-param-reassign
      acc.target_customer += current.target_customer;
      // eslint-disable-next-line no-param-reassign
      acc.target_revenue += current.target_revenue;
      return acc;
    },
    {
      kpi_assign_id: 197, // ID mới
      kpi_code: "KC0", // Mã KPI cho tổng report
      kpi_id: 10,
      kpi_name: "Report Tổng",
      real_commision: 0,
      real_customer: 0,
      real_revenue: 0,
      status: "approved",
      target_commision: 0,
      target_customer: 0,
      target_revenue: 0
    }
  );

  return {
    ...employee,
    details: [...employee.details, reportTotal]
  };
});
      setKPIEmployeeChart1(newData)
   }
   
    }, [kpiEmployeeChart1])
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);

  const [sendSMS, setSendSMS] = useState({
    openModal: false,
    type: "",
    listCS: [],
    campaignType: sendMessagetype[0] as unknown as GroupRadioType,
    template: undefined as unknown as DropdownData,
    campaign: undefined as unknown as DropdownData,
    content: "",
    subject: "",
  });

  const [sendSMSEror, setSendSMSError] = useState({
    subject: "",
    template: "",
    content: "",
    campaign: "",
  });

  const [dataCampaign, setDataCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });

  useLayoutEffect(() => {
    getCampaign();
    getTemplateSMSOfCampaign();
  }, []);

  const [states, setStates] = useState({
    employee_ids: listEmployeeTeams,
    from_date: moment().startOf("month").format("YYYY-MM-DD 00:00:00"), // Ngày đầu tháng
    to_date: moment().endOf("month").format("YYYY-MM-DD 23:59:59"), // Ngày cuối tháng
    employee_idV: "",
    from_dateV: "",
    date: moment()
  });
 
  useEffect(() => {
    setKPIEmployeeChart(listKPIEmployeeChart);
  }, [listKPIEmployeeChart]);
  useEffect(() => {
    setStates({ ...states, employee_ids: listEmployeeTeams });
  }, [listEmployeeTeams]);
 
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

  const { mutate: sendCampaign } = useMutation(
    "post-footer-form",
    (body: any) => postSendCampaign(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: "",
            subject: "",
          });
        } else {
          toast.error(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: "",
            subject: "",
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

  const handleValidateSendMessage = () => {
    if (sendSMS.campaignType?.value === "SMS") {
      if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
        setSendSMSError({
          ...sendSMSEror,
          subject: !sendSMS.subject.trim()
            ? "Tiêu đề là bắt buộc để gửi tin nhắn"
            : "",
          template: !sendSMS.template
            ? "Cần chọn template để gửi tin nhắn"
            : "",
          campaign: !sendSMS.campaign ? "Vui lòng chọn 1 chiến dịch" : "",
        });
        return false;
      }
      return true;
    } else {
      if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
        setSendSMSError({
          ...sendSMSEror,
          campaign: !sendSMS.campaign ? "Vui lòng chọn 1 chiến dịch" : "",
          subject: !sendSMS.subject.trim()
            ? "Tiêu đề là bắt buộc để gửi tin nhắn"
            : "",
          content: !sendSMS.content?.trim()
            ? "Cần nhập nội dung tin nhắn để gửi tin nhắn"
            : "",
        });
        return false;
      }
      return true;
    }
  };

  const handleExcuteSendMessage = () => {
    if (!handleValidateSendMessage()) return;
    const to = listCampaignDetail
      .filter(
        (i: any) =>
          i?.status !== "OK" &&
          !!i.customer_phone
            ?.replace("+84-", "0")
            ?.match(/^(03|05|07|08|09)\d{8}$/)
      )
      .map((i: any) => {
        return { customer_ref: i?.customer_ref };
      });

    const body = {
      send_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      campaign_id: sendSMS.campaign?.value,
      method: sendSMS.campaignType.value,
      template_id: sendSMS.template.id || "",
      content:
        sendSMS.campaignType.value === "SMS"
          ? sendSMS.template.value?.replace("&", "va")
          : sendSMS.content?.replace("&", "va"),
      to: to,
    };
    sendCampaign(body);
  };

  /* Column */
 const disableFutureMonths = (current:any) => {
  return current && current > dayjs().endOf('month');
};
    return (
    <div className="p-campaign">
      <PublicLayout>
        <PublicHeader
          titlePage={"Biểu đồ"}
          handleGetTypeSearch={() => {}}
          handleFilter={() => {}}
          handleCleanFilter={() => {}}
          isHideFilter
          isHideService
          className="p-campaign_header"
          isDial={false}
          isHideEmergency
          isHideCleanFilter
          tabLeft={
            <>
              <div className="p-managekpi_header1_item1">
                <CDatePickers
                   value={states.date}
                     disabledDate={disableFutureMonths}
                  handleOnChange={(date: any) => {
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

                        from_dateV: date
                          .clone()
                          .startOf("month")
                          .format("YYYY-MM-DD 00:00:00"),
                        date: date.format("YYYY-MM"), 
                      });

                      // Cập nhật state với các ngày mới được thêm vào
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
              <Button
                onClick={() => {
                  if (!states.from_dateV && !states.from_date) {
                    toast.error("Vui lòng chọn tháng");
                  }
                  // nếu mà cái khúc này thì làm sao tôi cũng chả biết nữa thật sự luôn á trời
                  else {
                    dispatch(
                      getKPIEmployeeChart({
                        employee_ids: states.employee_ids,
                        from_date: states.from_date,
                        to_date: states.to_date,
                      } as any)
                    );

                    setStates({
                      ...states,
                      employee_idV: "",
                      from_dateV: "",
                    });
                  }
                }}
                style={{ marginTop: "10px" }}
              >
                <Typography content="Lọc" />
              </Button>
            </>
          }
        />
        {
          loadingKpiEmployeeChart === true ? <Spin /> : <>
           {kpiEmployeeChart1?.length === undefined  ? (
          <></>
        ) : (
          <KpiChart data={kpiEmployeeChart1} />
          
        )}</>
        }
      </PublicLayout>
    </div>
  );
};

export default ChartSalers;
