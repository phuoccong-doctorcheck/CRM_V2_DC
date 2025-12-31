/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
"use client"

import { Plus, Eye, MoreVertical, Clock, CheckCircle2, AlertCircle, Calendar, Edit2, Trash2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useMutation } from "react-query"
import { postDetailSalesOrder } from "services/api/beforeExams"
import { SaleOrder } from "services/api/beforeExams/types"
interface Order {
  id: string
  name: string
  code: string
  status: "waiting" | "scheduled"
  
}
interface OrderListProps {
  setIsSelectService: any;
  ordersList: SaleOrder[];
  setDataRemove: any;
  setIsUpdateInfo: any;
  setDataSaleOrderRef: any;
  setListDataServices: any;
  setServiceSelected: any;
  setIsSeenPrice: any;
  setDataPrint?:any
 }

 const statusConfig = {
  draft: {
    label: "Nháp",
    bgColor: "#fef2f2",
    textColor: "#b91c1c",
    borderColor: "#fecaca",
    dotColor: "#dc2626",
  },
  new: {
    label: "Đặt lịch",
    bgColor: "#f0fdf4",
    textColor: "#15803d",
    borderColor: "#bbf7d0",
    dotColor: "#22c55e",
  },
}
interface Order1 {
  saleorder_id: number
  saleorder_name: string
  saleorder_ref: string
  total: number
  total_discount: number
  total_invoice: number
  create_datetime: string
  customer_id: string
  status: "draft" | "new"
}
const OrderList = ({setIsSelectService,ordersList,setDataRemove,setIsUpdateInfo,setListDataServices,setDataSaleOrderRef,setServiceSelected,setIsSeenPrice,setDataPrint}: OrderListProps) => {
  const [orders, setOrders] = useState<SaleOrder[]>(ordersList)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const getStatusConfig = (status: string): { label: string; bgColor: string; textColor: string; borderColor: string; dotColor: string } => {
    const key = status as keyof typeof statusConfig
    return statusConfig[key] ?? statusConfig.draft
  }

  console.log(ordersList)
  const getStatusText = (status: string) => {
    return status === "draft" ? "Đang chờ" : "Đã đặt lịch"
  }

    const handleRemoveQuoteCustomer = (data:any) => { 
      const request = {
        saleorder_ref: data,
      }
      postSalesOrder(request)
  }

    const { mutate: postSalesOrder } = useMutation(
      'post-footer-form',
      (data: any) => postDetailSalesOrder(data),
      {
        onSuccess: (data) => {
          const serviceIdsString = data?.data?.items.map((item: any) => item.service_id).join(",")
          console.log( data?.data?.items)
          setIsUpdateInfo(true);
          setListDataServices(serviceIdsString);
          // setDataSaleOrderRef(saleOR)
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
  );
   const handleQuoteCustomer = (data:any) => { 
      const request = {
        saleorder_ref: data,
      }
      postSalesOrderC(request)
  }

    const { mutate: postSalesOrderC } = useMutation(
      'post-footer-form',
      (data: any) => postDetailSalesOrder(data),
      {
        onSuccess: (data) => {
          const serviceIdsString = data?.data?.items.map((item: any) => item.service_id).join(",")
          console.log(data?.data?.items)
          setServiceSelected(data?.data?.items)
          //  setIsUpdateInfo(true);
           setIsSelectService(true)
          setListDataServices(serviceIdsString);
          // setDataSaleOrderRef(saleOR)
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
  );
     const handleQuoteCustomerS = (data:any) => { 
      const request = {
        saleorder_ref: data,
      }
      postSalesOrderS(request)
  }

    const { mutate: postSalesOrderS } = useMutation(
      'post-footer-form',
      (data: any) => postDetailSalesOrder(data),
      {
        onSuccess: (data) => {
          const serviceIdsString = data?.data?.items.map((item: any) => item.service_id).join(",")
          setServiceSelected(data?.data?.items)
          setDataPrint(data?.data)
          //  setIsUpdateInfo(true);
       //    setIsSelectService(true)
          setListDataServices(serviceIdsString);
          // setDataSaleOrderRef(saleOR)
        },
        onError: (error) => {
          console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
      },
  );
  
  return (
    // <div style={{ margin: "0 auto", }}>
    //   <div
    //     style={{
    //       backgroundColor: "#ffffff",
         
         
        
    //       overflow: "hidden",
    //     }}
    //   >
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         alignItems: "center",
    //         padding: "0px 12px",
    //         borderBottom: "1px solid #e5e7eb",
    //         backgroundColor: "#f9fafb",
    //       }}
    //     >
    //       <h1
    //         style={{
    //           fontSize: "20px",
    //           fontWeight: "600",
    //           color: "#111827",
    //           margin: 0,
    //         }}
    //       >
    //         Danh sách đơn hàng
    //       </h1>
    //       <button
    //         style={{
    //           display: "inline-flex",
    //           alignItems: "center",
    //           gap: "8px",
    //           padding: "10px 16px",
    //           backgroundColor: "#3b82f6",
    //           color: "white",
    //           borderRadius: "8px",
    //           border: "none",
    //           fontWeight: "500",
    //           cursor: "pointer",
    //           transition: "background-color 0.2s ease",
    //           fontSize: "14px",
    //         }}
    //         onMouseEnter={(e:any) => (e.currentTarget.style.backgroundColor = "#2563eb")}
    //         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
    //         onClick={() => setIsSelectService(true)}
    //       >
    //         <span style={{ fontSize: "18px" }}>+</span>
    //         Tạo mới đơn hàng
    //       </button>
    //     </div>

    //     <div style={{ maxHeight: "460px", overflowY: "auto" }}>
    //       {ordersList?.map((order, index) => (
    //         <div
    //           key={order.saleorder_id}
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "space-between",
    //             paddingTop: "6px",
    //             paddingBottom: "6px",
    //             paddingLeft: "24px",
    //             paddingRight: "24px",
    //             borderBottom: index < orders.length - 1 ? "1px solid #f3f4f6" : "none",
    //             transition: "background-color 0.2s ease",
    //           }}
    //           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
    //           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    //         >
    //           {/* Order Info */}
    //           <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: "4px", alignItems: "center",justifyContent: "flex-start" }}>
    //             <div
    //               style={{
    //                 fontWeight: "500",
    //                 color: "#111827",
    //                 fontSize: "18px",
    //                 marginBottom: "4px",
    //               }}
    //             >
    //               {order.saleorder_name}
    //             </div>
    //             <div
    //               style={{
    //                 fontSize: "14px",
    //                 color: "#6b7280",
    //               }}
    //             >
    //               ({order.saleorder_ref})
    //             </div>
    //           </div>

    //           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
    //             <div
    //               style={{
    //                 display: "inline-flex",
    //                 alignItems: "center",
    //                 gap: "8px",
    //                 padding: "6px 12px",
    //                 borderRadius: "20px",
    //                 fontSize: "14px",
    //                 fontWeight: "500",
                  
    //                 minWidth: "120px", 
    //                 justifyContent: "center", 
    //               }}
    //             >
    //               <div
    //                 style={{
    //                   width: "8px",
    //                   height: "8px",
    //                   borderRadius: "50%",
    //                    backgroundColor: order.status === "draft" ? "#ef4444" : "#22c55e",
    //                 }}
    //               ></div>
    //               <span
    //                 style={{
    //                   color: order.status === "draft" ? "#dc2626" : "#16a34a",
    //                 }}
    //               >
    //                 {getStatusText(order.status)}
    //               </span>
    //             </div>

    //             <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "140px" }}>
    //               {order.status === "draft" ? (
    //                 <>
    //                   <button
    //                     style={{
    //                       padding: "6px 12px",
    //                       fontSize: "14px",
    //                       fontWeight: "500",
    //                       color: "#ffffff",
    //                       backgroundColor: "#049be7",
    //                       border: "none",
    //                       borderRadius: "6px",
    //                       cursor: "pointer",
    //                       transition: "all 0.2s ease",
    //                     }}
                       
    //                     onClick={() => {
                        
    //                       setDataSaleOrderRef(order.saleorder_ref)
    //                       handleRemoveQuoteCustomer(
    //                         order.saleorder_ref,
    //                       );
                         
    //                     }}
    //                   >
    //                     Đặt lịch
    //                   </button>
    //                   <div
    //                     style={{
    //                       width: "1px",
    //                       height: "16px",
    //                       backgroundColor: "#e5e7eb",
    //                     }}
    //                   ></div>
    //                    <button
    //                     style={{
    //                       padding: "6px 12px",
    //                       fontSize: "14px",
    //                       fontWeight: "500",
    //                       color: "#ffffff",
    //                       backgroundColor: "#add579",
    //                       border: "none",
    //                       borderRadius: "6px",
    //                       cursor: "pointer",
    //                       transition: "all 0.2s ease",
    //                     }}
                       
    //                     onClick={() => {
    //                       handleQuoteCustomer( order.saleorder_ref)
    //                       setDataSaleOrderRef(order.saleorder_ref
    //                       )
    //                     }}
    //                   >
    //                     Báo giá
    //                   </button>
    //                   <button
    //                     style={{
    //                       padding: "6px 12px",
    //                       fontSize: "14px",
    //                       fontWeight: "500",
    //                       color: "#ffffff",
    //                       backgroundColor: "#ee697c",
    //                       border: "none",
    //                       borderRadius: "6px",
    //                       cursor: "pointer",
    //                       transition: "all 0.2s ease",
    //                     }}
                      
    //                     onClick={() => setDataRemove({
    //                       isOpenR: true,
    //                       saleorder_ref: order.saleorder_ref,
    //                     })}
    //                   >
    //                     Xóa
    //                   </button>
    //                 </>
    //               ) : (
    //                 <button
    //                   style={{
    //                     padding: "6px 12px",
    //                     fontSize: "14px",
    //                     fontWeight: "500",
    //                     color: "#3b82f6",
    //                     backgroundColor: "transparent",
    //                     border: "none",
    //                     borderRadius: "6px",
    //                     cursor: "pointer",
    //                     transition: "all 0.2s ease",
    //                   }}
    //                   onMouseEnter={(e) => {
    //                     e.currentTarget.style.backgroundColor = "#eff6ff"
    //                     e.currentTarget.style.color = "#2563eb"
    //                   }}
    //                   onMouseLeave={(e) => {
    //                     e.currentTarget.style.backgroundColor = "transparent"
    //                     e.currentTarget.style.color = "#3b82f6"
    //                     }}
    //                      onClick={() => {
    //                        handleQuoteCustomerS(order.saleorder_ref)
    //                        setIsSeenPrice(true)
                          
    //                     }}
    //                 >
    //                   Xem
    //                 </button>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
           
            margin: "0 auto",
            padding: "0rem 4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a" }}>Danh sách đơn hàng</p>
            <p style={{ marginTop: "0rem", fontSize: "0.875rem", color: "#64748b" }}>
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
             onClick={() => setIsSelectService(true)}
          >
            <Plus size={16} />
            Tạo một đơn hàng
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ margin: "0 auto", padding: "0.5rem 4rem" }}>
        {/* Stats Cards */}
        <div
          style={{
            marginBottom: "0.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {/* Total Orders Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "0.5rem 2.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#64748b" }}>Tổng đơn hàng</p>
                <p style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>
                  {orders.length}
                </p>
              </div>
              <div style={{ backgroundColor: "#dbeafe", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <Clock size={24} color="#2563eb" />
              </div>
            </div>
          </div>

          {/* Draft Orders Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
               padding: "0.5rem 2.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#64748b" }}>Nháp</p>
                <p style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: "bold", color: "#dc2626" }}>
                  {orders.filter((o) => o.status === "draft").length}
                </p>
              </div>
              <div style={{ backgroundColor: "#fee2e2", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <AlertCircle size={24} color="#dc2626" />
              </div>
            </div>
          </div>

          {/* New Orders Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
               padding: "0.5rem 2.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#64748b" }}>Đặt lịch</p>
                <p style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: "bold", color: "#16a34a" }}>
                  {orders.filter((o) => o.status === "new").length}
                </p>
              </div>
              <div style={{ backgroundColor: "#dcfce7", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <CheckCircle2 size={24} color="#16a34a" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "1rem 1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr 1.5fr",
                gap: "1rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              <div>Mã đơn hàng</div>
              <div style={{textAlign:"right"}}>Số tiền</div>
              <div style={{textAlign:"center"}}>Ngày tạo</div>
              <div  style={{textAlign:"center"}}>Trạng thái</div>
              <div style={{ textAlign: "right" }}>Hành động</div>
            </div>
          </div>

          {/* Table Body */}
          <div style={{ borderTop: "1px solid #e2e8f0", maxHeight:"35vh", minHeight:"35vh",overflowY:"scroll" }}>
            {orders.map((order) => {
              const config = getStatusConfig(order.status)

              return (
                <div
                  key={order.saleorder_id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    padding: "0.2rem 1.5rem",
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr 1.5fr",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Order Number */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "0.5rem",
                          height: "0.5rem",
                          borderRadius: "50%",
                          backgroundColor: config.dotColor,
                        }}
                      />
                      <div>
                        <p style={{ fontWeight: "600", color: "#0f172a" }}>{order.saleorder_ref}</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8",  }}>
                          {order.customer_id}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <p style={{ fontWeight: "600", color: "#0f172a",textAlign:"right" }}>{formatCurrency(order.total)}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "#64748b",textAlign:"center" }}>{formatDate(order.create_datetime)}</p>
                    </div>

                    {/* Status */}
                    <div style={{display:"flex", justifyContent:"center"}}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: config.bgColor,
                          color: config.textColor,
                          border: `1px solid ${config.borderColor}`,
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          textAlign:"right"
                        }}
                      >
                        {order.status === "draft" && <AlertCircle size={12} />}
                        {order.status === "new" && <CheckCircle2 size={12} />}
                        {config.label}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.5rem 0.75rem",
                          backgroundColor: "transparent",
                          color: "#2563eb",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                 onClick={() => {
                            handleQuoteCustomerS(order.saleorder_ref)
                            setIsSeenPrice(true)
                          
                         }}
                      >
                        <Eye size={16} />
                        <span>Xem</span>
                      </button>
                      <div style={{ position: "relative" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0.75rem",
                            backgroundColor: "transparent",
                            color: "#64748b",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          onClick={() =>
                            setOpenDropdown(openDropdown === order.saleorder_id ? null : order.saleorder_id)
                          }
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openDropdown === order.saleorder_id && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-40%",
                              right: "40px",
                              marginTop: "0.5rem",
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "0.375rem",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              zIndex: 150,
                              minWidth: "150px",
                            }}
                          >
                            <button
                           
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                width: "100%",
                                padding: "0.75rem 1rem",
                                backgroundColor: "transparent",
                                color: "#0f172a",
                                border: "none",
                                borderBottom: "1px solid #e2e8f0",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                transition: "background-color 0.2s",
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                              onClick={() => {
                        
                     setDataSaleOrderRef(order.saleorder_ref)
                       handleRemoveQuoteCustomer(
                          order.saleorder_ref,
                      );
                         
                   }}
                            >
                              <Calendar size={16} color="#2563eb" />
                              Đặt lịch
                            </button>
                            <button
                                       onClick={() => {
                         handleQuoteCustomer( order.saleorder_ref)
                      setDataSaleOrderRef(order.saleorder_ref
                          )
                      }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                width: "100%",
                                padding: "0.75rem 1rem",
                                backgroundColor: "transparent",
                                color: "#0f172a",
                                border: "none",
                                borderBottom: "1px solid #e2e8f0",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                transition: "background-color 0.2s",
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <Edit2 size={16} color="#16a34a" />
                              Sửa
                            </button>
                            <button
                                                   onClick={() => setDataRemove({
                           isOpenR: true,
                           saleorder_ref: order.saleorder_ref,
                         })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                width: "100%",
                                padding: "0.75rem 1rem",
                                backgroundColor: "transparent",
                                color: "#dc2626",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                transition: "background-color 0.2s",
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <Trash2 size={16} color="#dc2626" />
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "3rem 1.5rem",
              textAlign: "center",
            }}
          >
            <Clock size={48} color="#cbd5e1" style={{ margin: "0 auto" }} />
            <h3 style={{ marginTop: "1rem", fontSize: "1.125rem", fontWeight: "600", color: "#0f172a" }}>
              Không có đơn hàng
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
              Bắt đầu bằng cách tạo một đơn hàng mới
            </p>
            <button
              style={{
                marginTop: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            >
              <Plus size={16} />
              Tạo đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderList
