/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import Icon from "components/atoms/Icon";
import Typography from "components/atoms/Typography";
import { throttle } from "lodash";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
  BarChart,
  BarProps,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getKPIEmployeeChart, getKPIEmployeeChart2 } from "store/kpi_month";
import { SOCKET_URL, SOCKET_URL_CHART } from "utils/constants";
import W3CWebSocket from "websocket";

import myAudioVotay from "assets/audio/votay.mp3"

interface SalesData {
  name: string;
  revenue: number;
}
let audioTimeout: any = null;
interface SalesBarChartProps {
  data: SalesData[];
  title: string;
}
type PieData = { name: string; achieved: number };
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
type TypeConnectSK = "connected" | "disconnect";
let globalAchievedFB = 0;
let globalAchievedGG = 0;
let globalAchievedFB1 = 0;
let globalAchievedGG1 = 0;
let globalAchievedRFB = 0;
let globalAchievedRGG = 0;
const Notification: React.FC<{
  message: string;
  description: JSX.Element;
  position: 'topRight' | 'topLeft';
  duration: number;
}> = ({ message, description, position, duration }) => {
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
    position: 'fixed',
    top: '20px',
    [position === 'topRight' ? 'right' : 'left']: '20px',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    cursor: 'pointer',
  } as React.CSSProperties;

  const titleStyle = {
    fontWeight: 600,
    textTransform: 'capitalize',
    color: '#52c41a',
  } as React.CSSProperties;

  return (
    <div style={notificationStyle}>
      <div style={titleStyle}>{message}</div>
      <div>{description}</div>
    </div>
  );
};
const CustomBar: React.FC<BarProps> = ({ x, y, width, height, fill }) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      style={{ cursor: "pointer" }} // Thêm hiệu ứng con trỏ nếu cần
    />
  );
};
let a = true

const COLORSPIE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f0f0f0'];

const formatMoney = (value: any) => {
  return value.toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
};
const formatMoney2 = (value: number) => {

  if (value >= 1e9) {
    // Giá trị trên 1 tỷ -> chuyển sang đơn vị B
    return `${(Math.round(value / 1e8) / 10).toLocaleString("en-US")} B`;
  } else if (value >= 1e6) {
    // Giá trị trên 1 triệu -> chuyển sang đơn vị M
    return `${(Math.round(value / 1e5) / 10).toLocaleString("en-US")} M`;
  } else if (value >= 1e3) {
    // Giá trị trên 1 nghìn -> chuyển sang đơn vị k
    return `${Math.round(value / 1e3).toLocaleString("vi-VN")} k`;
  }

  return "0"; // Định dạng gốc cho giá trị dưới 1 nghìn
};
  const formatLabel = (real_customer: any, totalDetails: any) => {
     if (real_customer.real_customer >= real_customer.target_customer * 0.11) {
    return `${real_customer.real_customer?.toLocaleString(
      'vi-VN'
    )}  `;
  } else {
    return;
  }
   
};

// Hàm tính tổng số lượng khách hàng mục tiêu cho tất cả các KPI

// Hàm tính tổng số lượng khách hàng mục tiêu cho tất cả các KPI
const totalTargetCustomers = (details: any[]) =>
  details.reduce((total, { target_customer }) => total + target_customer, 0);

const totalTargetRevenue = (details: any[]) =>
  details.reduce((total, { target_revenue }) => total + target_revenue, 0);

// Hàm tính tổng số lượng khách hàng thực tế cho từng KPI
const totalRealCustomersByKPI = (details: any[]) => {
  return details.reduce((acc, { kpi_name, real_customer }) => {
    // eslint-disable-next-line no-param-reassign
    acc[kpi_name] = (acc[kpi_name] || 0) + real_customer;
    return acc;
  }, {} as Record<string, number>);
};
const totalRealRevenueByKPI = (details: any[]) => {
  return details.reduce((acc, { kpi_name, real_revenue }) => {
    // eslint-disable-next-line no-param-reassign
    acc[kpi_name] = (acc[kpi_name] || 0) + real_revenue;
    return acc;
  }, {} as Record<string, number>);
};
const totalTargetCustomersByKPI = (details: any[]) => {
  return details.reduce((acc, { kpi_name, target_customer }) => {
    // eslint-disable-next-line no-param-reassign
    acc[kpi_name] = (acc[kpi_name] || 0) + target_customer;
    return acc;
  }, {} as Record<string, number>);
};
// Hàm tạo dữ liệu cho biểu đồ
const createPieChartData = (data: any[]) => {
  const details = data.flatMap((employee) => employee.details);
  const targetTotal = totalTargetCustomers(details);
  const targetRTotal = totalTargetRevenue(details);
  const realTotals = totalRealCustomersByKPI(details);
  const realRTotals = totalRealRevenueByKPI(details);
  const targetTotals = totalTargetCustomersByKPI(details);
   const totalFBCustomer = details
  .filter((detail) => detail.kpi_name === 'Khách Hàng F1')
  .reduce((sum, detail) => sum + (detail.fb_customer || 0), 0);

const totalGGCustomer = details
  .filter((detail) => detail.kpi_name === 'Khách Hàng F1')
  .reduce((sum, detail) => sum + (detail.gg_customer || 0), 0);
 const totalFBRevenue = details
    .filter((detail) => detail.kpi_name === 'Khách Hàng F1')
    .reduce((sum, detail) => sum + (detail.real_revenue_of_fb_customer || 0), 0);

  const totalGGRevenue = details
    .filter((detail) => detail.kpi_name === 'Khách Hàng F1')
    .reduce((sum, detail) => sum + (detail.real_revenue_of_gg_customer || 0), 0);
// Tính tổng achieved cho "Khách Hàng F1" (loại bỏ FB và GG khỏi tổng)
const achievedF1 =
  (realTotals['Khách Hàng F1'] || 0) - totalFBCustomer - totalGGCustomer;
  const pieData = [
    {
      name: 'Khách Hàng FB - F1',
      achieved: totalFBCustomer,
      achievedR:  totalFBRevenue,
      achievedT: details.find(detail => detail.kpi_name === 'Khách Hàng F1')?.expected_revenue_of_fb_customer || 0,
    },
    {
      name: 'Khách Hàng GG - F1',
      achieved:totalGGCustomer,
      achievedR:  totalGGRevenue,
      achievedT: details.find(detail => detail.kpi_name === 'Khách Hàng F1')?.expected_revenue_of_gg_customer || 0,
    },
    {
      name: 'Khách Hàng F1',
      achieved: achievedF1,
      achievedR: realRTotals['Khách Hàng F1'],
      achievedT: targetTotals['Khách Hàng F1'],
    },
    {
      name: 'Khách Hàng F2',
      achieved: realTotals['Khách Hàng F2'] || 0,
      achievedR: realRTotals['Khách Hàng F2'],
      achievedT: targetTotals['Khách Hàng F2'],
    },
    {
      name: 'Khách Hàng F3',
      achieved: realTotals['Khách Hàng F3'] || 0,
      achievedR: realRTotals['Khách Hàng F3'],
      achievedT: targetTotals['Khách Hàng F3'],
    },
    {
      name: 'Khách Hàng WOM',
      achieved: realTotals['Khách Hàng WOM'] || 0,
      achievedR: realRTotals['Khách Hàng WOM'],
      achievedT: targetTotals['Khách Hàng WOM'],
    },
  ];

  const totalReal = pieData.reduce(
    (total, { achieved }) => total + achieved,
    0
  );
  const totalRealR = pieData.reduce(
    (total, { achievedR }) => total + achievedR,
    0
  );
  const totalMissing = targetTotal - totalReal;
  const totalRMissing = targetRTotal - totalRealR + totalFBRevenue + totalGGRevenue;
  console.log(targetRTotal,totalRealR)
  if (totalMissing > 0) {
    pieData.push({
      name: 'KH còn lại',
      achieved: totalMissing,
      achievedR: totalRMissing,
      achievedT: targetTotal
    });
  }

  return pieData;
};
interface Props {
  achieved: any,
  achievedR: any
}
const CustomLabel = ({ achieved, achievedR }: Props) => (
  <text
    fill="#000" // Color of the label text
    fontSize={16} // Adjust the font size here
    textAnchor="middle" // Center the text
  >
    {`${achieved} (${formatMoney2(achievedR)})`}
  </text>
);
const colorMapping: { [key: string]: string } = {
  "Quách Thu Trang": "#05556C",
  "Nguyễn Ái Trang": "#8E00CC",
  "Nguyễn Tô Huỳnh Châu": "#F18B07",
  "Lê Thị Kim Giang": "#6DBA33",
  "Nguyễn Thị Hồng Phúc": "#EA4067",
};
const colorMappingBland: { [key: string]: string } = {
  "Quách Thu Trang": "#4DBDDD",
  "Nguyễn Ái Trang": "#DF95FF",
  "Nguyễn Tô Huỳnh Châu": "#FFC983",
  "Lê Thị Kim Giang": "#BCF292",
  "Nguyễn Thị Hồng Phúc": "#FFBECD",
};
const getColor = (data: any, index: number) => {
  return colorMapping[data.employee_fullname];
};
const KpiChart = ({ data }: KpiChartProps) => {
  const processData = (kpiName: string) => {
    return data.map((employee: any) => {
      const kpi = employee.details.find(
        (d: any) => d.kpi_name.trim() === kpiName
      );
      return {
        employee_fullname: employee.employee_fullname,
        real_customer: kpi?.real_customer ?? 0, 
        real_revenue: kpi?.real_revenue ?? 0,
        remaining_revenue:  kpi?.real_revenue < kpi?.target_revenue
        ? kpi?.target_revenue - kpi?.real_revenue
          : 0,
        remaining_customer:  kpi?.real_customer < kpi?.target_customer
        ? kpi?.target_customer - kpi?.real_customer
        : 0
        // fill: colorMapping[employee.employee_fullname] || "#000", // Map color here
      };
    });
  };

  const charts = [
    "Khách Hàng F1",
    "Khách Hàng F2",
    "Khách Hàng F3",
    "Khách Hàng WOM",
  ].map((kpiName) => {
    const chartData = processData(kpiName); // Store processed data in a variable

    return (
      <div
        key={kpiName}
        style={{ width: "100%", height: "28vh", marginBottom: 30 }}
      >
        <h3 style={{ textAlign: "center", fontFamily: "'UTM Avo', sans-serif" }}>{kpiName}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={(entry) => {
                if (entry.employee_fullname) {
                  const nameParts = entry.employee_fullname.split(" ");
                  return nameParts.slice(-2).join(" ");
                }
                return ""; // Handle case where entry.name is null or undefined
              }}
              interval={0}
              tick={{
                textAnchor: "right",
                fontSize: "50%",
              }}
            />
            <Tooltip formatter={formatMoney} />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: "", angle: -90, position: "insideLeft" }}
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "", angle: -90, position: "insideRight" }}
              tickFormatter={formatMoney2}
              style={{ fontSize: "12px" }}
            />
            <Legend />
            <Bar
              yAxisId="right"
              dataKey="real_customer"
              name="Doanh thu thực tế"
              fill="#5a9bd5"
              stackId="a" // Sử dụng stackId để nhóm
            >
              {data?.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
              ))}
              <LabelList
                dataKey="real_customer"
                position="inside"
                formatter={formatMoney}
                style={{
                  fill: "#fff",
                  fontSize: "12px",
                  marginRight: "10px",
                  fontWeight: "700",

                }}
              />
            </Bar>

            {/* Bar for Remaining Revenue */}
           {chartData.some((entry) => entry.remaining_customer > 0) && (
              <Bar
                yAxisId="right"
                dataKey="remaining_customer"
                name="Khách hàng còn lại"
                fill="#d0d0d0"
                stackId="a"
              >
                {chartData.map((entry, index) =>
                  entry.remaining_customer > 0 ? (
                    <Cell key={`cell-rem-${index}`} fill="#d0d0d0" />
                  ) : null
                )}
              </Bar>
            )}
            {/* Bars for Customer Data */}
           
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridGap: "20px",
        justifyContent: "center",
      }}
    >
      {charts}
    </div>
  );
};

const CustomizedTick1 = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#666"
      fontSize={12} // Kích thước font chữ
      fontWeight="bold" // Độ đậm của chữ
    >
      {payload.value}
    </text>
  );
};
const getLastTwoNames = (fullName: any) => {
  const names = fullName.split(" ");
  return names.length > 1 ? names.slice(-2).join(" ") : fullName;
};

const CustomizedTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#666"
      fontSize={20} // Kích thước font chữ
      fontWeight="bold" // Độ đậm của chữ
    >
      {getLastTwoNames(payload.value)} {/* Hiển thị 2 tên cuối */}
    </text>
  );
};

const ChartSalersTV: React.FC = () => {
  const dispatch = useAppDispatch();
  const COLORS = ['#FF6666', '#66CCFF','#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0D0D0'];
  const [dataChartPie, setDataChartPie] = useState<PieData[]>([]);

  const [audio] = useState(new Audio(myAudioVotay)); // Khởi tạo âm thanh
  //    const playAudioNotify = () => {
  //   audio.play().catch((error) => {
  //       if (error.name === 'NotAllowedError') {
  //         console.log('User interaction required before playing audio');
  //       } else {
  //         console.error('Error playing audio:', error);
  //       }
  //     });

  // };
const playAudioNotify = () => {
  const audio = new Audio(myAudioVotay); // Tạo một đối tượng Audio mới mỗi lần gọi

  audio.onended = () => {
    a = true; // Đặt lại biến a khi âm thanh kết thúc
  };

  // Bắt đầu phát âm thanh và xử lý lỗi
  audio.play().then(() => {
    console.log('Audio started playing successfully.');
  }).catch((error) => {
    console.log('Error playing audio:', error);
    a = true; // Nếu phát lỗi, đặt lại biến a để lần sau có thể phát lại
  });
};
  const listKPIEmployeeChart = useAppSelector(
    (state) => state.kpiMonth.listKPIEmployeeChart2
  );
  const loadingKPIEmployeeChart = useAppSelector(
    (state) => state.kpiMonth.isLoadingKPIMasterChart2
  );
  const [loadingKpiEmployeeChart, setLoadingKPIEmployeeChart] = useState(
    loadingKPIEmployeeChart
  );
  const listKPIEmployeeChartItem = useAppSelector(
    (state) => state.kpiMonth.listKPIEmployeeChart
  );
  const [kpiEmployeeChart1, setKPIEmployeeChart1] = useState(
    listKPIEmployeeChartItem.data.employees
  );
  const storageEmployeeList = localStorage.getItem("listCSKH");
  const [chartData, setChartData] = useState([]);
  const [listEmployeeTeams1, setListEmployeeTeams1] = useState(
    storageEmployeeList ? JSON.parse(storageEmployeeList || "") : ([] as any)
  );
  //  const { isConnected, send } = useWebSocket("https://sockets.doctorcheck.online:3333/");
  const [listEmployeeTeams, setListEmployeeTeams] = useState([]);
  const [modeNotify, setModeNotyfi] = useState(false);
  useLayoutEffect(() => {
    document.title = "So sánh hiệu suất | CRM";
  }, []);
  const [kpiEmployeeChart, setKPIEmployeeChart] =
    useState(listKPIEmployeeChart);
  useEffect(() => {
    setKPIEmployeeChart1(listKPIEmployeeChartItem.data.employees);


  }, [listKPIEmployeeChartItem]);
  useEffect(() => {

    if (kpiEmployeeChart1?.length !== undefined) {
      const processedData = createPieChartData(kpiEmployeeChart1);
      setDataChartPie(processedData)
    }
  }, [kpiEmployeeChart1?.length]);
  useEffect(() => {
    setLoadingKPIEmployeeChart(loadingKpiEmployeeChart);
  }, [loadingKPIEmployeeChart]);
  const [states, setStates] = useState({
    employee_ids: listEmployeeTeams,
    from_date: moment().startOf("month").format("YYYY-MM-DD 00:00:00"), // Ngày đầu tháng
    to_date: moment().endOf("month").format("YYYY-MM-DD 23:59:59"), // Ngày cuối tháng
    employee_idV: "",
    from_dateV: "",
  });

  useEffect(() => {
    const filteredArray = listEmployeeTeams1.filter(
      (item: any) => item.id !== "NV26224163644" && item.id !== "NV00078"
    );
    const result = filteredArray?.map((item: any) => item.value);
    dispatch(
      getKPIEmployeeChart2({
        employee_ids: result,
        from_date: states.from_date,
        to_date: states.to_date,
        // from_date: "2024-09-01 00:00:00",
        // to_date: "2024-09-30 23:59:59",
      } as any)
    );
    dispatch(
      getKPIEmployeeChart({
        employee_ids: result,
        from_date: states.from_date,
        to_date: states.to_date,
        //    from_date: "2024-09-01 00:00:00",
        // to_date: "2024-09-30 23:59:59",
      } as any)
    );
  }, []);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (success: boolean, placement: NotificationPlacement, message: React.ReactNode, description: React.ReactNode, id?: string, duration?: number) => {
    if (success) {
      api.success({
        message: message,
        description: description,
        placement: placement,
        duration: duration || 10,
        closeIcon: <Icon iconName="close" isPointer />,
        role: 'status',
        onClick: () => {
          if (id?.trim()) {
            window.open(`/customer-info/id/${id}/history-interaction`, '_blank');
          } else {
            return;
          }
        }
      });
    } else {
      api.error({
        message: message,
        description: description,
        placement: placement,
        duration: duration || 10,
        closeIcon: <Icon iconName="close" isPointer />,
        role: 'status',
      });

    }
  }
  const wsUrl = SOCKET_URL_CHART;
  const [stateConnect, setStateConnect] = useState<TypeConnectSK>("disconnect");
  const [showNotification, setShowNotification] = useState(false);

  const openCustomNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1000); // Thời gian hiển thị thông báo 1 giây
  };
  useEffect(() => {
    const socket = new W3CWebSocket.w3cwebsocket(wsUrl, "echo-protocol");
    socket.onopen = () => {
      setStateConnect("connected");
    };
    socket.onclose = () => {
      setStateConnect("disconnect");
    };
    // socket.onmessage = (message: any) => {
    //   try {
    //     const data = JSON.parse(message.data);
    //     console.log(data.key === "result_kpi_alarm",data)
    //     if (data.key === "result_kpi_alarm") {
    //       console.log(data.key)
    //       const filteredArray = listEmployeeTeams1.filter(
    //         (item: any) => item.id !== "NV26224163644" && item.id !== "NV00078"
    //       );
    //       const result = filteredArray?.map((item: any) => item.value);
    //       dispatch(
    //         getKPIEmployeeChart2({
    //           employee_ids: result,
    //           from_date: states.from_date,
    //           to_date: states.to_date,
    //         } as any)
    //       );
    //       dispatch(
    //         getKPIEmployeeChart({
    //           employee_ids: result,
    //           from_date: states.from_date,
    //           to_date: states.to_date,
    //           //    from_date: "2024-09-01 00:00:00",
    //           // to_date: "2024-09-30 23:59:59",
    //         } as any)
    //       );
    //       playAudio();
    //     }
    //   } catch (error) {
    //     console.error("Error parsing message:", error);
    //   }
    // };
    socket.onmessage = (message: any) => {
      try {
        const data = JSON.parse(message.data);
        if (data.key === "scheduled_alarm") {
          // openNotification(true, 'topRight',
          //   <Typography content={`Đặt lịch`} modifiers={['600', 'capitalize']} styles={{ color: "#52c41a", fontSize: "35px", marginLeft: "12px" }} />,
          //   <div>
          //     <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', }}>
          //       {data.data}
          //     </div>

          //   </div>,
          //   "", 10)
          toast.success(data.data);
          setModeNotyfi(true);
           if (a === true) {
        playAudioNotify();
        a = false; // Ngăn phát lại trước khi âm thanh kết thúc
      }
        }
        if (data.key === "result_kpi_alarm") {
          const filteredArray = listEmployeeTeams1.filter(
            (item: any) => item.id !== "NV26224163644" && item.id !== "NV00078"
          );
          const result = filteredArray?.map((item: any) => item.value);
          dispatch(
            getKPIEmployeeChart2({
              employee_ids: result,
              from_date: states.from_date,
              to_date: states.to_date,
            } as any)
          );
          dispatch(
            getKPIEmployeeChart({
              employee_ids: result,
              from_date: states.from_date,
              to_date: states.to_date,
              //    from_date: "2024-09-01 00:00:00",
              // to_date: "2024-09-30 23:59:59",
            } as any)
          );
          playAudio();
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.onerror = (error: any) => {
      setStateConnect("disconnect");
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [wsUrl]);
  const [totalCustomer, setTotalCustomer] = useState(0)
  const [totalCustomerMonth, setTotalCustomerMonth] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalRevenueMonth, setTotalRevenueMonth] = useState(0)
  useEffect(() => {
    if (listKPIEmployeeChart.data?.employees?.length !== undefined) {

      let total = 0;
      listKPIEmployeeChart.data?.employees.map((item) => {
        total += item?.totalDetails?.real_customer
      })
      let totalCustomerMonth = 0;
      listKPIEmployeeChart.data?.employees.map((item) => {
        totalCustomerMonth += item?.totalDetails?.target_customer
      })
      let totalRevune = 0;
      listKPIEmployeeChart.data?.employees.map((item) => {
        totalRevune += item?.totalDetails?.real_revenue
      })
      let totalRevenueMonth = 0;
      listKPIEmployeeChart.data?.employees.map((item) => {
        totalRevenueMonth += item?.totalDetails?.target_revenue
      })
      setTotalCustomer(total)
      setTotalCustomerMonth(totalCustomerMonth)
      setTotalRevenueMonth(totalRevenueMonth)
      setTotalRevenue(totalRevune)
      // Tạo một bản sao của dữ liệu để không thay đổi dữ liệu gốc
      const updatedEmployees = listKPIEmployeeChart.data.employees.map(
        (employee: any) => ({
          ...employee,
          totalDetails: [employee.totalDetails], // Chuyển đổi totalDetails thành mảng
        })
      );

      // Cập nhật dữ liệu biểu đồ với nhân viên đã được cập nhật
      const updatedChartData = {
        ...listKPIEmployeeChart,
        data: {
          ...listKPIEmployeeChart.data,
          employees: updatedEmployees,
        },
      };

      // Kiểm tra nếu dữ liệu đã thay đổi trước khi cập nhật trạng thái
      if (
        JSON.stringify(updatedChartData) !==
        JSON.stringify(listKPIEmployeeChart)
      ) {
        setKPIEmployeeChart(updatedChartData);
      }
    }
  }, [listKPIEmployeeChart]);
  const transformedData = kpiEmployeeChart?.data?.employees?.map((item) => ({
    ...item,
    real_customer: item?.totalDetails[0]?.real_customer,
    remaining_customer:
      item.totalDetails[0].real_customer < item.totalDetails[0].target_customer
        ? item.totalDetails[0].target_customer - item.totalDetails[0].real_customer
        : 0, // Nếu real_customer >= target_customer thì remaining_customer là 0
    color: colorMapping[item.employee_fullname], // Thêm màu sắc vào dữ liệu
  }))
    .sort((a, b) => b.real_customer - a.real_customer); // Sắp xếp từ cao đến thấp
  const getColor = (data: any, index: number) => {
    return colorMapping[data.employee_fullname];
  };

  const sortedByCustomer = [...(kpiEmployeeChart.data.employees || [])].sort(
    (a, b) =>
      b.totalDetails[0]?.real_customer - a.totalDetails[0]?.real_customer
  );

  // Hàm sắp xếp theo real_revenue
  const sortedByRevenue = [...(kpiEmployeeChart.data.employees || [])].sort(
    (a, b) => b.totalDetails[0]?.real_revenue - a.totalDetails[0]?.real_revenue
  );
  const coloredData = sortedByRevenue.map((item, index) => ({
    ...item,
    fill: colorMapping[item.employee_fullname] || "#5a9bd5", // Gán màu hoặc màu mặc định
  }));
  // const coloredData = sortedByRevenue.map((item, index) => ({
  //   ...item,
  //   fill: index < 3 ? colors[index] : "#5a9bd5", // Màu cho các cột
  // }));

  const coloredData1 = sortedByCustomer.map((item, index) => ({
    ...item,
    fill: colorMapping[item.employee_fullname] || "#5a9bd5", // Màu cho các cột
  }));
  // useWebSocket("https://sockets.doctorcheck.online:3333/send?app_key=crm")
  const playAudio = () => {
    const audio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/chaapprj.appspot.com/o/change-monitor.mp3?alt=media&token=8a263a73-7269-4e1d-82ff-c319a5712415"
    );
    audio.play();
  };


  const renderCustomLabel = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, index, achieved, achievedR, achievedT ,name} = props;
      const isDiagonalLabel = name.includes('GG') || name.includes('FB');
    // Điều chỉnh bán kính để nhãn nằm xa hơn
    const radius = isDiagonalLabel ? outerRadius - 50 : outerRadius + 50 // Tăng giá trị này để nhãn cách xa biểu đồ hơn
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
      if (name.includes('FB')) {
        globalAchievedFB = achieved;
          globalAchievedRFB = achievedR;
  } else if (name.includes('GG')) {
        globalAchievedGG = achieved;
         globalAchievedRGG = achievedR;
  }

  // Nếu là "Khách Hàng F1", cộng thêm giá trị từ FB và GG
  const totalAchievedF1 = name.includes('Khách Hàng F1')
    ? achieved + globalAchievedFB + globalAchievedGG
      : achieved;
      const totalAchievedRF1 = name.includes('Khách Hàng F1')
    ? achievedR + globalAchievedRFB + globalAchievedRGG
    : achievedR;
    // Tùy chỉnh màu sắc cho nhãn tương ứng với màu của phần biểu đồ
   const color = name.includes('GG') || name.includes('FB')
    ? '#FFFFFF'
    : name.includes('Khách Hàng F1')
    ? COLORS[2]
    : name === 'Khách Hàng F2'
    ? COLORS[3]
    : name === 'Khách Hàng F3'
    ? COLORS[4]
    : name === 'Khách Hàng WOM'
    ? COLORS[5]
    : COLORS[6];
     const rotationAngle = isDiagonalLabel ? 0 : (midAngle <= 90 || midAngle >= 270 ? midAngle : midAngle + 180);
    // midAngle <= 90 || midAngle >= 270 ? midAngle  + 0 : midAngle + 180;
    //   const labelContent = isDiagonalLabel
    // ? name.includes('GG')
    //   ? `Google ${achieved}`
    //   : `Facebook ${achieved}`
    //   : `${achieved} (${formatMoney2(achievedR)})`;
    const labelContent = isDiagonalLabel
    ? name.includes('GG')
      ? `GG ${achieved}`
      : `FB ${achieved}`
    : name.includes('Khách Hàng F1')
    ? `${totalAchievedF1}/${achievedT} (${formatMoney2(achievedR)})`
    : `${achieved}/${achievedT} (${formatMoney2(achievedR)})`;
    return (
      <text
        x={x}
        y={y}
        fill={color} // Sử dụng màu sắc tương ứng với phần biểu đồ
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
          fontSize={isDiagonalLabel ? 10 : 12}
          fontWeight="bold"
          transform={isDiagonalLabel ? `rotate(${rotationAngle}, ${x}, ${y})` : ''}
      >
        {labelContent}
        {/* {isDiagonalLabel ? (
      name.includes('GG') ? `GG ${achieved}` : `FB ${achieved}`
    ) : (
      <>
        {name.includes('Khách Hàng F1') ? totalAchievedF1 : achieved}
        <tspan style={{ fill: "#ff0000" }}>/</tspan>
        {achievedT} ({formatMoney2(achievedR)})
      </>
    )} */}
      </text>
    );
  };
  const shouldRenderLabelLine = (name: string) => {
  return !(name.includes('GG') || name.includes('FB'));
  };
  const CustomTooltip = ({ active, payload }: any) => {
    console.log(active,payload)
  if (active && payload && payload.length) {
    const { name, achieved, achievedR } = payload[0].payload;
      if (name.includes('FB')) {
        globalAchievedFB1 = achieved;
  } else if (name.includes('GG')) {
        globalAchievedGG1 = achieved;
      }
      const totalAchievedF1 = name.includes('Khách Hàng F1')
    ? achieved + globalAchievedGG1 + globalAchievedGG1
      : achieved;
    return (
      <div style={{ backgroundColor: '#ffffff', padding: '5px', border: '1px solid #cccccc' }}>
        <p><strong>{name}</strong></p>
        <p>KH: { name.includes('Khách Hàng F1') ? achieved+  globalAchievedGG + globalAchievedFB : achieved}</p>
        {achievedR !== undefined && <p>Doanh thu: {formatMoney2(achievedR)}</p>}
      </div>
    );
  }
  return null;
};
 const renderCustomLabelLine = (props:any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, outerRadius, name } = props;

  const color = name.includes('Khách Hàng F1')
    ? COLORS[2]
    : name === 'Khách Hàng F2'
    ? COLORS[3]
    : name === 'Khách Hàng F3'
    ? COLORS[4]
    : name === 'Khách Hàng WOM'
    ? COLORS[5]
    : COLORS[6];
                   
  // Line starts from the edge of the pie chart
  const radius = outerRadius;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Extend the line outwards
  const endRadius = outerRadius + 50;
  const xEnd = cx + endRadius * Math.cos(-midAngle * RADIAN);
  const yEnd = cy + endRadius * Math.sin(-midAngle * RADIAN);

  return <line x1={x} y1={y} x2={xEnd} y2={yEnd} stroke={color} />;
};
    const legendData = dataChartPie.filter(
    (entry) => !entry.name.includes('FB') && !entry.name.includes('GG')
  );
  const labelLineFunction = (props: any) => shouldRenderLabelLine(props.name) ? renderCustomLabelLine(props) : <></>;
  //   const [currentTime, setCurrentTime] = useState<string>("");

  // useEffect(() => {
  //   const updateClock = () => {
  //     const now = new Date();
  //     // Chuyển đổi múi giờ sang Việt Nam (GMT+7)
  //     const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  //     setCurrentTime(vietnamTime.toLocaleTimeString());
  //   };

  //   // Cập nhật đồng hồ mỗi giây
  //   updateClock(); // Gọi ngay lần đầu khi component mount
  //   const intervalId = setInterval(updateClock, 1000);

  //   // Xóa interval khi component unmount
  //   return () => clearInterval(intervalId);
  // }, []);
  return (
    <div className="p-monitor">
      <>
        {contextHolder}
        <div
          className="p-managekpi_header1_item1"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Typography
            content="Bảng Số Liệu Tăng Trưởng Khách Hàng"
            modifiers={["12x18", "600", "center", "blueNavy", "uppercase"]}
            styles={{
              fontSize: "30px",
              marginBottom: "20px",
              textAlign: "center",
              marginTop: "20px",
              fontFamily: "'UTM Avo', sans-serif"
            }}
            
          />
          <div style={{ display: "none" }}>
            <audio controls>
              <source
                src="https://firebasestorage.googleapis.com/v0/b/chaapprj.appspot.com/o/change-monitor.mp3?alt=media&token=8a263a73-7269-4e1d-82ff-c319a5712415"
                type="audio/mpeg"
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
          <div style={{ display: "none" }}>
            <audio controls>
              <source
                src={myAudioVotay}
                type="audio/mpeg"
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      </>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "55vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "80%",
            flexDirection: "column",
            height: "90%",
          }}
        >
          {/* <div style={{ width: "100%" }}>
            {" "}
            <Typography
         content={`Số lượng KH tháng ${moment().month() + 1}`}

              modifiers={["12x18", "500", "center", "blueNavy"]}
              styles={{
                fontSize: "25px",
                marginBottom: "20px",
                textAlign: "center",
                marginRight: "90px",
              }}
            />
          </div> */}
          <PieChart width={600} height={480}>
            <Pie
              data={dataChartPie}
              dataKey="achieved"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={160}
              fill="#8884d8"
              label={renderCustomLabel}
              labelLine={labelLineFunction}
            >
              {/* {dataChartPie?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))} */}
             {dataChartPie.map((entry, index) => {
  // Assign colors to each category with FB and GG having distinct colors
  let color;
  if (entry.name === 'Khách Hàng F1') color = COLORS[2];           // Màu chính cho F1
  else if (entry.name === 'Khách Hàng FB - F1') color = COLORS[0];  // Màu riêng cho F1 - FB
  else if (entry.name === 'Khách Hàng GG - F1') color = COLORS[1];  // Màu riêng cho F1 - GG
  else if (entry.name === 'Khách Hàng F2') color = COLORS[3];       // Màu chính cho F2
  else if (entry.name === 'Khách Hàng F3') color = COLORS[4];       // Màu chính cho F3
  else if (entry.name === 'Khách Hàng WOM') color = COLORS[5];      // Màu chính cho WOM
  else color = COLORS[6];                                           // Màu xám cho bất kỳ mục nào khác

  return <Cell key={`cell-${index}`} fill={color} />;
})}
            </Pie>
                 <Tooltip content={<CustomTooltip />} />

           
             <Legend
        payload={legendData.map((item) => {
          // Áp dụng màu cho phần chú thích dựa trên tên phần tử
         let color;
  if (item.name === 'Khách Hàng F1') color = COLORS[2];           // Màu chính cho F1
  else if (item.name === 'Khách Hàng FB - F1') color = COLORS[0];  // Màu riêng cho F1 - FB
  else if (item.name === 'Khách Hàng GG - F1') color = COLORS[1];  // Màu riêng cho F1 - GG
  else if (item.name === 'Khách Hàng F2') color = COLORS[3];       // Màu chính cho F2
  else if (item.name === 'Khách Hàng F3') color = COLORS[4];       // Màu chính cho F3
  else if (item.name === 'Khách Hàng WOM') color = COLORS[5];      // Màu chính cho WOM
  else color = COLORS[6];                     

          return {
            value: item.name,
            type: 'square',
            id: item.name, // Đặt ID là tên cho dễ quản lý
            color: color,
          };
        })}
      />
           
          </PieChart>
        </div>
        {
          kpiEmployeeChart?.data?.employees?.length !== undefined ? <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "80%",
              flexDirection: "column",
              height: "90%",
            }}
          >
            {/* <Typography
            content="Top CSKH có lượng khách hàng nhiều nhất"
            modifiers={["12x18", "500", "center", "blueNavy"]}
            styles={{ fontSize: "25px", marginBottom: "20px" }}
          /> */}

            <ResponsiveContainer width="90%" height="100%">
              <BarChart
                data={transformedData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="employee_fullname"
                  width={200}
                  tick={<CustomizedTick />}
                />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="totalDetails[0].real_customer"
                  stackId="a"
                  shape={(props: any) => (
                    <CustomBar {...props} fill={props.fill} />
                  )} // Sử dụng shape
                  name="Khách hàng đạt được"
                  fill="#5a9bd5"

                >
                  {transformedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
                  ))}
                  <LabelList
                    dataKey="totalDetails[0]"
                    position="insideRight"
                    formatter={(value: any, entry: any) => formatLabel(value, entry)}
                    style={{ fill: "white", marginRight: "10px", fontSize: "16px" }} // Đảm bảo nhãn hiển thị bằng màu đen
                  />
                </Bar>
                 <Bar
          dataKey="remaining_customer"
          stackId="a"
          name="Số lượng KH còn lại"
          fill="#d0d0d0"
        >
          {transformedData.map((entry, index) =>
            entry.remaining_customer > 0 ? (
              <Cell key={`cell-rem-${index}`} fill="#d0d0d0" />
            ) : null
          )}
          <LabelList
                    dataKey="remaining_customer"
                    position="insideRight"
                    formatter={formatMoney}
                    style={{ fill: 'white', marginRight: '10px', fontSize: '24px', fontFamily: "'UTM Avo', sans-serif" }} // Đảm bảo nhãn hiển thị bằng màu trắng
                  />
        </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div> : <></>
        }

      </div>
      <div style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "#e7e9eb",
        width: "fit-content",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 15px",
        borderRadius: "5px",
        fontFamily: "'UTM Avo', sans-serif"
      }} 
      onClick={playAudioNotify}
      >
        <Typography content={`Số lượng KH tháng ${moment().month() + 1}: `} modifiers={['600', 'capitalize']} styles={{ color: "#52c41a", fontSize: "20px", fontFamily: "'UTM Avo', sans-serif" }} />
        <Typography content={totalCustomer.toString() + "/" + totalCustomerMonth.toString()} modifiers={['600', 'capitalize']} styles={{ color: "#ff0000", fontSize: "20px", marginLeft: "10px", fontFamily: "'UTM Avo', sans-serif" }} />
        <Typography content={"(" + (formatMoney2(totalRevenue) + "/" + formatMoney2(totalRevenueMonth)) + ")"} modifiers={['600', 'capitalize']} styles={{ color: "#ff0000", fontSize: "15px", marginLeft: "10px", marginTop: "1px", fontFamily: "'UTM Avo', sans-serif" }} />
      </div>
      {/* <div style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#e7e9eb",
        width: "fit-content",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 15px",
        borderRadius: "5px",
        fontFamily: "'UTM Avo', sans-serif"
      }}
      >
        <Typography content={currentTime} modifiers={['600', 'capitalize']} styles={{ color: "#52c41a", fontSize: "20px", fontFamily: "'UTM Avo', sans-serif" }} />
       
      </div> */}
      {kpiEmployeeChart1?.length === undefined ? (
        <></>
      ) : (
        <div>
          <KpiChart data={kpiEmployeeChart1} />
        </div>
      )}
    </div>
  );
};

export default ChartSalersTV;