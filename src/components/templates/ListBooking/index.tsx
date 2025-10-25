

import CategoriesCustomer from "components/organisms/CategoriesCustomer";
import {
  Clock,
  Stethoscope,
  FileText, ShoppingCart,

} from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { getCategoriesCustomer } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListVisitItemMaster } from "store/visit";



const salesOrders = [
  { id: "SO001", item: "Thuốc giảm đau", quantity: 2, price: 50000 },
  { id: "SO002", item: "Vitamin C", quantity: 1, price: 120000 },
  { id: "SO003", item: "Khám tổng quát", quantity: 1, price: 300000 },
];

const examResults = [
  { test: "Xét nghiệm máu", result: "Bình thường", date: "2024-01-10" },
  { test: "Đo huyết áp", result: "120/80 mmHg", date: "2024-01-15" },
  { test: "Cân nặng", result: "65 kg", date: "2024-01-15" },
];
const tabs = [
    { id: "result", label: "Kết quả khám", icon: <Stethoscope size={16} /> },
 
  { id: "order", label: "Đơn hàng", icon: <ShoppingCart size={16} /> },
  { id: "info", label: "Thông tin lịch hẹn", icon: <FileText size={16} /> },
];





const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("vi-VN")
}

// const getStatusColor = (status: string | null): string => {
//   if (!status) return "#6b7280"
//   switch (status.toLowerCase()) {
//     case "new":
//       return "#10b981"
//     case "completed":
//       return "#3b82f6"
//     case "cancelled":
//       return "#ef4444"
//     default:
//       return "#6b7280"
//   }
// }
export default function ListBooking(data: any) {
  console.log(data.data[0])
  const [selectedAppointment, setSelectedAppointment] = useState(data.data[0]);
  const storeVisit = useAppSelector((state) => state.listVisit.listVisitItemMaster);
  const [stateDetallVisit, setStateDetailVisit] = useState(storeVisit);
  const [stateMaster, setStateMaster] = useState("");
  const [stateCustomer, setStateCustomer] = useState("");
  console.log(data.data[0],data.data.length)
  useEffect(() => {
    setStateDetailVisit(storeVisit);
  }, [storeVisit])
    useEffect(() => { 

    dispatch(getCategoriesCustomer({
      master_id: stateMaster,
    }));
    }, [stateDetallVisit])
  console.log(stateDetallVisit)
  useEffect(() => { 

     setSelectedAppointment(selectedAppointment);
                const body = {
                  master_id: selectedAppointment?.master_id,
                }
                setStateMaster(selectedAppointment.master_id);
                setStateCustomer(selectedAppointment.customer_id);
                dispatch(getListVisitItemMaster(body))
  }, [data.data[0]])
  const [activeTab, setActiveTab] = useState("result");
  const dispatch = useAppDispatch();
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { backgroundColor: "#fef9c3", color: "#854d0e" };
      case "completed":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "cancelled":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };


  const tabContent = useMemo(() => {
    if (activeTab === "info") {
      return (
        <div style={{ maxWidth: "900px", }}>
      <p style={{ fontSize: "24px", fontWeight: 700 }}>Thông tin lượt khám</p>
          <div style={{display:"flex", alignItems: "center", gap: "8px", justifyContent:"flex-start"}}>
          <p style={{ color: "gray" }}>Mã lượt khám: {stateDetallVisit.data.master?.master_id}</p>
      <p style={{ padding: "4px 8px", background: "#e0f2fe", display: "inline-block", borderRadius: "4px" ,textTransform:"capitalize"}}>
        { stateDetallVisit.data.master?.status}
      </p>
     </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "12px" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", }}>Thông tin cơ bản</h3>
          <p><strong>Mã khách hàng:</strong> {stateDetallVisit.data.master?.customer_id}</p>
          <p><strong>Ngày hẹn khám:</strong> {moment(stateDetallVisit.data.master?.appointment_date).format("DD/MM/YYYY")}</p>
          <p><strong>Ngày tạo:</strong> {moment(stateDetallVisit.data.master?.create_date).format("DD/MM/YYYY")}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Thông tin khám bệnh</h3>
          <p><strong>Khoa khám:</strong> {stateDetallVisit.data.master?.exams_department_id}</p>
          <p><strong>Bác sĩ khám:</strong> {stateDetallVisit.data.master?.exams_doctor_id}</p>
          <p><strong>Dịch vụ khám:</strong> {stateDetallVisit.data.master?.exams_service_id}</p>
          <p><strong>Ghi chú:</strong> {stateDetallVisit.data.master?.appointment_note || "Không có ghi chú"}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Thông tin nhân viên</h3>
          <p><strong>Nhân viên sales:</strong> {stateDetallVisit.data.sales_employee?.name}</p>
          <p><strong>Người tạo:</strong> {stateDetallVisit.data.master?.create_employee_id}</p>
        </div>

        {/* <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Chi phí & Nguồn khách</h3>
          <p><strong>Chi phí dự kiến:</strong> {stateDetallVisit.data.visit?.expected_total.toLocaleString("vn-VN")}</p>
          <p><strong>Nguồn khách:</strong> {stateDetallVisit.data.owner?.source_group.name}</p>
          <p><strong>Hình thức:</strong> {stateDetallVisit.data.owner?.source.name}</p>
          <p><strong>Kênh liên hệ:</strong> {stateDetallVisit.data.owner?.source_type.name}</p>
        </div> */}
      </div>

      {/* <div style={{ marginTop: "24px", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Trạng thái</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>Đặt lịch</p>
            <p>{stateDetallVisit.data.master?.is_appointment ? "✓ Có" : "✗ Không"}</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>Khám bệnh</p>
            <p>{stateDetallVisit.data.master?.is_exams ? "✓ Có" : "✗ Không"}</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>Cận lâm sàng</p>
            <p>{stateDetallVisit.data.master?.is_register_subclinical ? "✓ Có" : "✗ Không"}</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>Tái khám</p>
            <p>{stateDetallVisit.data.master?.is_re_exams ? "✓ Có" : "✗ Không"}</p>
          </div>
        </div>
      </div> */}
    </div>
      );
    } else if (activeTab === "order") {
    
      return (
        <>
          {
            stateDetallVisit?.data?.saleorders !== null ? (   <div
              style={{
              
                margin: "0 auto",
                  maxHeight: "calc(72vh - 200px)",
                overflowY: "scroll",
                backgroundColor: "#f9fafb",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#111827",
                        margin: "0 0 8px 0",
                      }}
                    >
                      Đơn Hàng #{stateDetallVisit?.data?.saleorders[0]?.saleorder_name}
                    </h1>
                    <p
                      style={{
                        color: "#6b7280",
                        margin: "0",
                        fontSize: "14px",
                      }}
                    >
                      Mã tham chiếu: {stateDetallVisit?.data?.saleorders[0]?.saleorder_ref}
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        display: "inline-block",
                      }}
                    >
                      ID: {stateDetallVisit?.data?.saleorders[0]?.saleorder_id}
                    </div>
                  </div>
                </div>
        
                {/* Order Info Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Thông Tin Khách Hàng
                    </h3>
                    <div style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Mã KH:</strong> {stateDetallVisit?.data?.saleorders[0]?.customer_id}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Nguồn:</strong> {stateDetallVisit?.data?.saleorders[0]?.source?.source.name}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Nhóm nguồn:</strong> {stateDetallVisit?.data?.saleorders[0]?.source.source_group?.name}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Loại nguồn:</strong> {stateDetallVisit?.data?.saleorders[0]?.source.source_type?.name}
                      </p>
                    </div>
                  </div>
        
                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Nhân Viên Phụ Trách
                    </h3>
                    <div style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Tên:</strong> {stateDetallVisit?.data?.saleorders[0]?.own_employee?.fullname}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Mã NV:</strong> {stateDetallVisit?.data?.saleorders[0]?.own_employee?.employee_id}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Mã ERP:</strong> {stateDetallVisit?.data?.saleorders[0]?.own_employee?.own_erp_code}
                      </p>
                    </div>
                  </div>
        
                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Thời Gian
                    </h3>
                    <div style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Tạo:</strong> {formatDateTime(stateDetallVisit?.data?.saleorders[0]?.create_datetime)}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Cập nhật:</strong> {formatDateTime(stateDetallVisit?.data?.saleorders[0]?.update_datetime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
        
              {/* Services */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#111827",
                    margin: "0 0 20px 0",
                  }}
                >
                  Dịch Vụ ({stateDetallVisit?.data?.saleorders[0]?.items.length} mục)
                </h2>
        
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                       
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Tên Dịch Vụ
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          SL
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Đơn Giá
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Thành Tiền
                        </th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {stateDetallVisit?.data?.saleorders[0]?.items.map((item:any, index:any) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                          }}
                        >
                         
                          <td
                            style={{
                              padding: "12px",
                              color: "#374151",
                              maxWidth: "300px",
                            }}
                          >
                            {item.service_name}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              color: "#6b7280",
                            }}
                          >
                            {item.quantity} {item.unit_name}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              color: "#6b7280",
                            }}
                          >
                            {formatCurrency(item.service_prices)}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#1f2937",
                            }}
                          >
                            {formatCurrency(item.total_invoice)}
                          </td>
                          {/* <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: item.status === "new" ? "#dcfce7" : "#f3f4f6",
                                color: getStatusColor(item.status),
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "500",
                                textTransform: "capitalize",
                              }}
                            >
                              {item.status || "N/A"}
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
        
              {/* Summary */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#111827",
                    margin: "0 0 20px 0",
                  }}
                >
                  Tổng Kết Đơn Hàng
                </h2>
        
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Tổng Tiền 
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#1e293b",
                        margin: "0",
                      }}
                    >
                      {formatCurrency(stateDetallVisit?.data?.saleorders[0]?.total)}
                    </p>
                  </div>
        
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#fef7f0",
                      borderRadius: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9a3412",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Discount
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#ea580c",
                        margin: "0",
                      }}
                    >
                      {formatCurrency(stateDetallVisit?.data?.saleorders[0]?.total_discount)}
                    </p>
                  </div>
                        <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#fef7f0",
                      borderRadius: "8px",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9a3412",
                        margin: "0 0 4px 0",
                      }}
                    >
                   BHYT chi trả
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#ea580c",
                        margin: "0",
                      }}
                    >
                      {formatCurrency(0)}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f0fdf4",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#166534",
                        margin: "0 0 4px 0",
                      }}
                    >
                    Tiền khách phải trả
                    </p>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#15803d",
                        margin: "0",
                      }}
                    >
                      {formatCurrency(stateDetallVisit?.data?.saleorders[0]?.total_invoice)}
                    </p>
                  </div>
        
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#fefce8",
                      borderRadius: "8px",
                      border: "1px solid #fde047",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#a16207",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Trạng Thái Thanh Toán
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#ca8a04",
                        margin: "0",
                      }}
                    >
                      {stateDetallVisit?.data?.saleorders[0]?.payment_datetime ? "Đã thanh toán" : "Chưa thanh toán"}
                    </p>
                  </div>
                </div>
              </div>
            </div>) : (
                <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
          <p style={{ fontSize: "18px", fontWeight: "500" }}>Không có đơn hàng nào.</p> 
          </div>
            )
        }
        </>
      );
    } else if (activeTab === "result") {
      return (
        <div>
        
          <CategoriesCustomer id={stateMaster} cid={stateCustomer} />
        </div>
      );
    }
    return null;
  }, [activeTab, selectedAppointment, salesOrders, examResults,stateDetallVisit]);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{ width: "20%", backgroundColor: "white", borderRight: "1px solid #e5e7eb", overflowY: "auto" }}>
       

        <div style={{ padding: 16,maxHeight:"60%", overflowY: "scroll" }}>
          {data?.data?.map((item:any) => (
            <div
              key={item.master_id}
              onClick={() => {
                console.log(item)
                setSelectedAppointment(item);
                const body = {
                  master_id: item.master_id,
                }
                setStateMaster(item.master_id);
                setStateCustomer(item.customer_id);
                dispatch(getListVisitItemMaster(body))
              }
              }
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                marginBottom: 12,
                padding: 16,
                cursor: "pointer",
                backgroundColor:
                  selectedAppointment.master_id === item.master_id ? "#eff6ff" : "white",
                boxShadow:
                  selectedAppointment.master_id === item.master_id ? "0 0 0 2px #3b82f6" : "",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8,alignItems: "center" }}>
                <p style={{ fontWeight: 600 }}>{item.title} ({item.master_id})</p>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    height: 'fit-content',
                    ...getStatusStyle(item.status.status),
                  }}
                >
                  {item.status.status_display}
                </span>
              </div>
              <div style={{ fontSize: 14, color: "#4b5563" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={16} /> {item.time_ago_text} ( {moment(item.datetime).format("HH:mm DD/MM/YYYY")})
                </div>
                {/* <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <User size={16} /> {item.doctor}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Stethoscope size={16} /> {item.service}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      {
        stateCustomer !== "" && (
          <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
     
            <div style={{
              display: "flex",
              backgroundColor: "#f8f9fa",
              padding: "4px",
              borderRadius: "6px",
              maxWidth: "900px"
            }}>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: activeTab === tab.id ? "#fff" : "transparent",
                    color: activeTab === tab.id ? "#000" : "#6c757d",
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                    cursor: "pointer",
                    border: activeTab === tab.id ? "1px solid #ddd" : "1px solid transparent",
                    boxShadow: activeTab === tab.id ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              ))}
            </div>

      
     
            <div style={{ marginTop: 12 }}>{tabContent}</div>
        
            
         
          </div>
        )}
    </div>
  );
}
