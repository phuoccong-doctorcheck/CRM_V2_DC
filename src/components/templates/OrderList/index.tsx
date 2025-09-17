/* eslint-disable no-param-reassign */
"use client"

import type React from "react"
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
const OrderList = ({setIsSelectService,ordersList,setDataRemove,setIsUpdateInfo,setListDataServices,setDataSaleOrderRef,setServiceSelected,setIsSeenPrice,setDataPrint}: OrderListProps) => {
  const orders: Order[] = [
    {
      id: "1",
      name: "Đơn hàng 1",
      code: "S25081414310004-01",
      status: "waiting",
    },
    {
      id: "2",
      name: "Đơn hàng 2",
      code: "S25081414310004-02",
      status: "scheduled",
    },
  ]

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
    <div style={{ margin: "0 auto", }}>
      <div
        style={{
          backgroundColor: "#ffffff",
         
         
        
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
            }}
          >
            Danh sách đơn hàng
          </h1>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "8px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              fontSize: "14px",
            }}
            onMouseEnter={(e:any) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
            onClick={() => setIsSelectService(true)}
          >
            <span style={{ fontSize: "18px" }}>+</span>
            Tạo mới đơn hàng
          </button>
        </div>

        <div style={{ maxHeight: "460px", overflowY: "auto" }}>
          {ordersList?.map((order, index) => (
            <div
              key={order.saleorder_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: "24px",
                paddingRight: "24px",
                borderBottom: index < orders.length - 1 ? "1px solid #f3f4f6" : "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {/* Order Info */}
              <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: "4px", alignItems: "center",justifyContent: "flex-start" }}>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#111827",
                    fontSize: "18px",
                    marginBottom: "4px",
                  }}
                >
                  {order.saleorder_name}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  ({order.saleorder_ref})
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    // backgroundColor: order.draft !== "draft" ? "#fef2f2" : "#f0fdf4",
                    minWidth: "120px", // Fixed width for consistent alignment
                    justifyContent: "center", // Center the content within the fixed width
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                       backgroundColor: order.status === "draft" ? "#ef4444" : "#22c55e",
                    }}
                  ></div>
                  <span
                    style={{
                      color: order.status === "draft" ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "140px" }}>
                  {order.status === "draft" ? (
                    <>
                      <button
                        style={{
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#ffffff",
                          backgroundColor: "#049be7",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        // onMouseEnter={(e) => {
                        //   e.currentTarget.style.backgroundColor = "#eff6ff"
                        //   e.currentTarget.style.color = "#2563eb"
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.backgroundColor = "transparent"
                        //   e.currentTarget.style.color = "#3b82f6"
                        // }}
                        onClick={() => {
                          // setSaleOR(order.saleorder_ref)
                          setDataSaleOrderRef(order.saleorder_ref)
                          handleRemoveQuoteCustomer(
                            order.saleorder_ref,
                          );
                         
                        }}
                      >
                        Đặt lịch
                      </button>
                      <div
                        style={{
                          width: "1px",
                          height: "16px",
                          backgroundColor: "#e5e7eb",
                        }}
                      ></div>
                       <button
                        style={{
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#ffffff",
                          backgroundColor: "#add579",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        // onMouseEnter={(e) => {
                        //   e.currentTarget.style.backgroundColor = "#fef2f2"
                        //   e.currentTarget.style.color = "#dc2626"
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.backgroundColor = "transparent"
                        //   e.currentTarget.style.color = "#ef4444"
                        // }}  // onMouseEnter={(e) => {
                        //   e.currentTarget.style.backgroundColor = "#fef2f2"
                        //   e.currentTarget.style.color = "#dc2626"
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.backgroundColor = "transparent"
                        //   e.currentTarget.style.color = "#ef4444"
                        // }}
                        onClick={() => {
                          handleQuoteCustomer( order.saleorder_ref)
                          setDataSaleOrderRef(order.saleorder_ref
                          )
                        }}
                      >
                        Báo giá
                      </button>
                      <button
                        style={{
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#ffffff",
                          backgroundColor: "#ee697c",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        // onMouseEnter={(e) => {
                        //   e.currentTarget.style.backgroundColor = "#fef2f2"
                        //   e.currentTarget.style.color = "#dc2626"
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.backgroundColor = "transparent"
                        //   e.currentTarget.style.color = "#ef4444"
                        // }}  // onMouseEnter={(e) => {
                        //   e.currentTarget.style.backgroundColor = "#fef2f2"
                        //   e.currentTarget.style.color = "#dc2626"
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.backgroundColor = "transparent"
                        //   e.currentTarget.style.color = "#ef4444"
                        // }}
                        onClick={() => setDataRemove({
                          isOpenR: true,
                          saleorder_ref: order.saleorder_ref,
                        })}
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        padding: "6px 12px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#3b82f6",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff"
                        e.currentTarget.style.color = "#2563eb"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                        e.currentTarget.style.color = "#3b82f6"
                        }}
                         onClick={() => {
                           handleQuoteCustomerS(order.saleorder_ref)
                           setIsSeenPrice(true)
                          // setDataSaleOrderRef(order.saleorder_ref
                          // )
                        }}
                    >
                      Xem
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderList
