/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Input, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import { exampleDataItemAppointmentView } from "assets/data";
import Button from "components/atoms/Button";
import CTooltip from "components/atoms/CTooltip";
import { DropdownData } from "components/atoms/Dropdown";
import Icon from "components/atoms/Icon";
import Loading from "components/atoms/Loading";
import RangeDate from "components/atoms/RangeDate";
import Switchs from "components/atoms/Switchs";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicLayout from "components/templates/PublicLayout";
import StatisticOverview from "components/templates/StatisticOverview";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getListPointsOfCustomer } from "services/api/point";
import { StatisticCustomerItem } from "services/api/statistics/types";
import { getInfosCustomerById } from "store/customerInfo";
import {
  getListCustomerWOMByIdMaster,
  getListCustomerWOMMaster,
} from "store/customerWOM_view";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListPointMinusOfCustom, getListPointOfCustom } from "store/point";
import { getCustomerStatiscal } from "store/statistics";
import mapModifiers, { exportDatatoExcel } from "utils/functions";

const CustomerWOM: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigatorRoute = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isLoadingStatistic = useAppSelector(
    (state) => state.statistic.isLoadingStatiscal
  );
  const storeStatistic = useAppSelector(
    (state) => state.statistic.responseStatiscal
  );
  ///

  const isLoadingCustomerWOM = useAppSelector(
    (state) => state.CustomerWOM.isLoadingResponCustomerWom
  );
  const storeCustomerWOM = useAppSelector(
    (state) => state.CustomerWOM.listCustomerWOMMaster
  );
  const [stateCustomerWOM, setStateCustomerWOM] = useState(
    storeCustomerWOM.data.items
  );

    const responsePointOfCustomerLoading = useAppSelector((state) => state.point.responsePointOfCustomerLoading);
  const responsePointOfCustomer = useAppSelector((state) => state.point.responsePointOfCustomer);
  const responsePointMinusOfCustomerLoading = useAppSelector((state) => state.point.responsePointMinusOfCustomerLoading);
  const responsePointMinusOfCustomer = useAppSelector((state) => state.point.responsePointMinusOfCustomer);
  const isLoadingCustomerWOMById = useAppSelector(
    (state) => state.CustomerWOM.isLoadingResponCustomerWomById
  );
  const storeCustomerWOMById = useAppSelector(
    (state) => state.CustomerWOM.listCustomerWOMByIdMaster
  );
  const [stateCustomerWOMById, setStateCustomerWOMById] =
    useState(storeCustomerWOMById);

  ///
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
  const getRoles = localStorage.getItem("roles");

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
    DropdownData[]
  >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
    DropdownData[]
  >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(
    storageLaunchSources ? JSON.parse(storageLaunchSources) : []
  );

  const [stateStatistic, setStateStatistic] = useState(storeStatistic.data);
  const [stateStatisticLoading, setStateStatisticLoading] =
    useState(isLoadingStatistic);
  const [dataFinish, setDataFinish] = useState<StatisticCustomerItem[]>(
    storeStatistic.data || []
  );
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : "");
  const [payment, setPayment] = useState(0);
  const [isOpenDetailService, setIsOpenDetailService] = useState(false);
  const [listDetailService, setListDetailService] = useState();
  const [isOverview, setIsOverview] = useState(false);
  const [isLoadingSwitchScreen, setIsLoadingSwitchScreen] = useState(false);
  const [stateParams, setStateParams] = useState({
    type: "",
    f_type: "",
    status: "",
    launch_source_group_id: "",
    launch_source_id: "",
    launch_source_type_id: "",
    affiliate_name: "",
    package_name: "",
  });
  const [stateGetCustomerWOM, setStateGetCustomerWOM] = useState({
    page_number: 1,
    page_size: 200,
    key_word: ""
  });
  const [dataFilter, setDataFilter] = useState({
    fromDay: new Date(moment(new Date()).format("YYYY-MM-DDT00:00:00")) as Date,
    toDay: undefined as unknown as Date,
  });
  const [infoCustomer, setInfoCustomer] = useState({
    name: "",
    date: "",
  });
  const [nameCustomer, setNameCustomer] = useState("");
   const [getListPointOfCustomer, setGetListPointOfCustomer] = useState({
    openModal: false,
    customer_id: ""
  })
  const [getListPointMinusOfCustomer, setGetListPointMinusOfCustomer] = useState({
    openModal: false,
    customer_id: ""
  })
  useLayoutEffect(() => {
    if (
      window.location.href.replace(window.location.origin, "") ===
        "/reports?type=grid&role=cskh" ||
      listRoles?.some((role: any) =>
        ["adDashBoard","campaign"].some((i) => i === role?.role_name)
      )
    ) {
      return;
    }
    return navigatorRoute("/not-have-permission");
  }, []);

  useEffect(() => {
    setStateCustomerWOM(storeCustomerWOM.data.items);
  }, [storeCustomerWOM]);
  useEffect(() => {
    setStateCustomerWOMById(storeCustomerWOMById);
  }, [storeCustomerWOMById]);
  useEffect(() => {
    dispatch(
      getListCustomerWOMMaster({
        page_number: 1,
        page_size: 200,
        key_word: stateGetCustomerWOM.key_word
      } as any)
    );
  }, []);
  const [filterColumn, setFilterColumn] = useState({
    partner: [],
    package: [],
    status: [],
  });

  const optionStateCS = [
    { id: 2, label: "Chưa đến", value: "new" },
    { id: 3, label: "Đã xong", value: "done" },
    { id: 4, label: "Đã hủy", value: "canceled" },
    { id: 5, label: "Đang phục vụ", value: "inprogress" },
  ];

  useEffect(() => {
    setStateStatisticLoading(isLoadingStatistic);
  }, [isLoadingStatistic]);

  useLayoutEffect(() => {
    setStateStatistic(storeStatistic.data);
    setDataFinish(storeStatistic.data);
  }, [storeStatistic.data]);

  const handleConvertData = (
    data: StatisticCustomerItem[],
    value: string,
    key: string
  ) => {
    try {
      let newData: any[] = [...data];
      if (value.trim() && value.includes(",")) {
        newData = newData.filter((record: any) => {
          if (
            [
              "launch_source_group_id",
              "launch_source_id",
              "launch_source_type_id",
            ].includes(key)
          ) {
            return value.split(",").some((y: any) => Number(y) === record[key]);
          } else {
            return value
              .split(",")
              .some((y: string) => y?.search(record[key]) !== -1);
          }
        });
      } else if (value.trim()) {
        newData = newData.filter((record: any) => {
          if (
            [
              "launch_source_group_id",
              "launch_source_id",
              "launch_source_type_id",
            ].includes(key)
          ) {
            return Number(value) === record[key];
          } else {
            return value.search(record[key]) !== -1;
          }
        });
      }
      return newData;
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:137 ~ handleConverData ~ err:", err);
    }
  };

  useEffect(() => {
    if (!Object.values(stateParams).some((value) => value.trim())) {
      setDataFinish(storeStatistic.data);
    } else {
      for (const [key, value] of Object.entries(stateParams)) {
        if (!value.trim()) {
          continue;
        } else {
          setDataFinish(
            (prev: any) => handleConvertData(prev, value, key) as any
          );
        }
      }
    }
  }, [
    storeStatistic.data,
    dataFilter.fromDay,
    dataFilter.toDay,
    window.location.pathname,
  ]);

  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case "affiliate_name":
        uniqueValues = Array.from(
          new Set(
            (stateStatistic || [])
              ?.map((item: any) => item?.affiliate_name)
              .filter(Boolean)
          )
        );
        break;
      case "package_name":
        uniqueValues = Array.from(
          new Set(
            (stateStatistic || [])
              ?.map((item: any) => item?.package_name)
              .filter(Boolean)
          )
        );
        break;
      case "status_display":
        uniqueValues = Array.from(
          new Set(
            (stateStatistic || [])
              ?.map((item: any) => item?.status_display)
              .filter(Boolean)
          )
        );
        break;
      default:
        break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  };

  useLayoutEffect(() => {
    setFilterColumn({
      ...filterColumn,
      partner: handleGetOptionFilterColumn("affiliate_name"),
      package: handleGetOptionFilterColumn("package_name"),
      status: handleGetOptionFilterColumn("status"),
    });
  }, [storeStatistic.data, isLoadingStatistic]);

  const handleCountCustomerAllowPackage = (type: string) => {
    let count = 0;
    if (!dataFinish?.length) return count;

    switch (type) {
      case "package_a_male":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("Tiêu Chuẩn Dành Cho Nam".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_a_female":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("Tiêu Chuẩn Dành Cho Nữ".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_b_male":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("Chuyên Sâu Dành Cho Nam".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_b_female":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("Chuyên Sâu Dành Cho Nữ".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_c_male":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("VIP Dành Cho Nam".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_c_female":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search("VIP Dành Cho Nữ".toLocaleLowerCase()) !== -1
        ).length;
        break;
      case "package_d_male":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search(
                "Tầm Soát Ung Thư Ống Tiêu Hoá Tiêu Chuẩn Dành Cho Nam".toLocaleLowerCase()
              ) !== -1
        ).length;
        break;
      case "package_d_female":
        count = dataFinish.filter(
          (data: any) =>
            data.package_name
              ?.toLocaleLowerCase()
              .search(
                "Tầm Soát Ung Thư Ống Tiêu Hoá Tiêu Chuẩn Dành Cho Nữ".toLocaleLowerCase()
              ) !== -1
        ).length;
        break;
      case "note_package":
        count = dataFinish.filter(
          (data: any) => !data.package_name?.trim()
        ).length;
        break;
    }

    return count;
  };

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
  const [dataRP,setDataRP] = useState([])
  const { mutate: getRevicePoint } = useMutation(
    'post-footer-form',
    (data:any) => getListPointsOfCustomer(data),
    {
      onSuccess: async (data:any) => {
        if (data?.status) {
          //  const filtered = data.data.filter((item:any) => item.type !== 'redeem');
            const filtered = data.data
          setDataRP(filtered)
        }
      },
      onError: (error:any) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  const handleGetRevicePoint = (id:any) => {
    const body = {
      customer_ref: id
    }
    getRevicePoint(body)
  }
  const ColumnTableCompany = [
    {
      title: (
        <Typography
          content="STT"
          modifiers={["12x18", "500", "center", 'main']}
        />
      ),
      align: "center",
      dataIndex: "RowNum",
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, customer_fullname, ...prevData } = data;
            if (Id_NguoiGioiThieu) {
              Cookies.set("id_customer", Id_NguoiGioiThieu);
              dispatch(
                getInfosCustomerById({ customer_id: Id_NguoiGioiThieu })
              );
              window.open(
                `/customer-info/id/${Id_NguoiGioiThieu}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "blueNavy", "center"]}
          />
          {/* <Typography content={data.register_date ? moment(data.register_date).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['12x18', '400', 'center']} /> */}
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Lần giới thiệu gần nhất"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "LanGioiThieuGanNhat",
      width: 135,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, customer_fullname, ...prevData } = data;
            if (Id_NguoiGioiThieu) {
              Cookies.set("id_customer", Id_NguoiGioiThieu);
              dispatch(
                getInfosCustomerById({ customer_id: Id_NguoiGioiThieu })
              );
              window.open(
                `/customer-info/id/${Id_NguoiGioiThieu}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record ? moment(record).format("HH:mm - DD/MM/YYYY") : ""}
            modifiers={["13x18", "600", "main", "center"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Người Giới Thiệu"
          modifiers={["12x18", "500", "left"]}
          styles={{textAlign:"left", marginLeft:"9px"}}
        />
      ),
      align: "center",
      dataIndex: "Ten_NguoiGioiThieu",
      width: 170,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, customer_fullname, ...prevData } = data;
            if (Id_NguoiGioiThieu) {
              Cookies.set("id_customer", Id_NguoiGioiThieu);
              dispatch(
                getInfosCustomerById({ customer_id: Id_NguoiGioiThieu })
              );
              window.open(
                `/customer-info/id/${Id_NguoiGioiThieu}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
          style={{display:"flex", justifyContent:"start"}}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "blueNavy", "left"]}
           
          />
          {/* <Typography content={data.register_date ? moment(data.register_date).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['12x18', '400', 'center']} /> */}
        </div>
      ),
    },
      {
      title: (
        <Typography
          content="Giới tính"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "GioiTinh",
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, customer_fullname, ...prevData } = data;
            if (Id_NguoiGioiThieu) {
              Cookies.set("id_customer", Id_NguoiGioiThieu);
              dispatch(
                getInfosCustomerById({ customer_id: Id_NguoiGioiThieu })
              );
              window.open(
                `/customer-info/id/${Id_NguoiGioiThieu}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "main", "center"]}
          />
          {/* <Typography content={data.register_date ? moment(data.register_date).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['12x18', '400', 'center']} /> */}
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Số KH giới thiệu"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "SL_NguoiDaGioiThieu",
      width: 120,
      sorter: (a: any, b: any) =>
        a?.SL_NguoiDaGioiThieu - b?.SL_NguoiDaGioiThieu,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, Ten_NguoiGioiThieu, ...prevData } = data;
            setNameCustomer(Ten_NguoiGioiThieu);
            dispatch(
              getListCustomerWOMByIdMaster({
                owner_id: Id_NguoiGioiThieu,
              } as any)
            );
          }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "orange", "center"]}
          />
        </div>
      ),
    },
      {
      title: (
        <Typography
          content="Điểm"
            modifiers={["12x18", "500", "center"]}
            styles={{textAlign:"right", marginRight:"8px"}}
        />
      ),
      align: "center",
        dataIndex: "Diem_HienTai",
            sorter: (a: any, b: any) =>
        a?.Diem_HienTai - b?.Diem_HienTai,
      width: 140,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, Ten_NguoiGioiThieu, ...prevData } = data;
            setNameCustomer(Ten_NguoiGioiThieu);
            dispatch(
              getListCustomerWOMByIdMaster({
                owner_id: Id_NguoiGioiThieu,
              } as any)
            );
          }}
          
        >
          <Typography
            content={record === null ? "0" : record?.toLocaleString('vi-VN')}
            modifiers={["14x20", "600", "green", "right"]}
            styles={{textAlign:"right", marginRight:"8px"}}
          />
        </div>
      ),
    },
      {
      title: (
        <Typography
          content="Hạng thành viên"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "member_display_text",
      width: 120,
      sorter: (a: any, b: any) =>
        a?.member_level - b?.member_level,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { Id_NguoiGioiThieu, Ten_NguoiGioiThieu, ...prevData } = data;
            setNameCustomer(Ten_NguoiGioiThieu);
            dispatch(
              getListCustomerWOMByIdMaster({
                owner_id: Id_NguoiGioiThieu,
              } as any)
            );
          }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "main", "center"]}
          />
        </div>
      ),
    },
      {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 50,
      ellipsis: true,
      render: (record: any, data: any) => (
            <CTooltip placements="topLeft" title="Xem lịch sử điểm"> <div className="ant-table-column_item">
          <Icon style={{marginLeft:"12px"}} iconName="giftbox"onClick={() => {
            const { Id_NguoiGioiThieu, Ten_NguoiGioiThieu, ...prevData } = data;
            setGetListPointOfCustomer({ openModal: true, customer_id: Id_NguoiGioiThieu });
            handleGetRevicePoint(Id_NguoiGioiThieu)
            // dispatch(getListPointOfCustom({ customer_ref: Id_NguoiGioiThieu }))
          }}/>
        </div> </CTooltip>
      ),
    },
    //  {
    //   title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
    //   align: "center",
    //   dataIndex: "",
    //   className: "",
    //   width: 50,
    //   ellipsis: true,
    //   render: (record: any, data: any) => (
    //         <CTooltip placements="topLeft" title="Xem lịch sử dùng điểm"> <div className="ant-table-column_item">
    //        <Icon style={{marginLeft:"12px"}}  iconName="history2" onClick={() => {
    //         const { Id_NguoiGioiThieu, Ten_NguoiGioiThieu, ...prevData } = data;
    //         setGetListPointMinusOfCustomer({ openModal: true, customer_id: Id_NguoiGioiThieu }); dispatch(getListPointMinusOfCustom({ customer_code: Id_NguoiGioiThieu }))
    //       }} />
    //     </div> </CTooltip>
    //   ),
    // },
  ];
  const ColumnTableCompanyId = [
    {
      title: (
        <Typography content="STT" modifiers={["12x18", "500", "center", 'main']} />
      ),
      align: "center",
      width: 40,
      className: "ant-table-column_wrap",
      render: (text: any, record: any, index: number) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = record;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_id}`);
            }
          }}
        >
          <Typography
            content={`${index + 1}`}
            modifiers={["12x18", "600", "center"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Tên KH Được Giới Thiệu"
          modifiers={["12x18", "500", "center"]}
          styles={{textAlign:"left", marginLeft:"8px"}}
        />
      ),
      align: "center",
      dataIndex: "customer_fullname",
      width: 170,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
         style={{display:"flex", justifyContent:"start",marginLeft:"2px"}}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "blueNavy", "center"]}
          />
          {/* <Typography content={data.register_date ? moment(data.register_date).format('HH:mm - DD/MM/YYYY') : ''} modifiers={['12x18', '400', 'center']} /> */}
        </div>
      ),
    },
      {
      title: (
        <Typography
          content="Giới tính"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "gender",
      width: 80,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record}
            modifiers={["13x18", "600", "main", "center"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography content="SĐT" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "customer_phone",
      width: 130,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
        <Typography content={record ? record.replace('+84-', '0') : '---'} modifiers={['14x20', '600', 'main', 'center']} />
        </div>
      ),
    },
      {
      title: (
        <Typography
          content="Điểm"
            modifiers={["12x18", "500", "center"]}
            styles={{textAlign:"right", marginRight:"5px"}}
        />
      ),
      align: "center",
      dataIndex: "use_points",
      width: 130,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record === null ? "0" : record?.toLocaleString('vi-VN')}
            modifiers={["14x20", "600", "green", "center"]}
            styles={{textAlign:"right", marginRight:"5px"}}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Hạng Thành Viên"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      align: "center",
      dataIndex: "member_display_text",
      width: 130,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div
          className="ant-table-column_item"
          onClick={() => {
            const { customer_id, customer_fullname, ...prevData } = data;
            if (customer_id) {
              Cookies.set("id_customer", customer_id);
              dispatch(getInfosCustomerById({ customer_id: customer_id }));
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            } else {
              toast.error(`Không tìm thấy khách hàng: ${customer_fullname}`);
            }
          }}
        >
          <Typography
            content={record}
            modifiers={["14x20", "600", "main", "center"]}
          />
        </div>
      ),
    },
      {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 50,
      ellipsis: true,
      render: (record: any, data: any) => (
            <CTooltip placements="topLeft" title="Xem lịch sử điểm"> <div className="ant-table-column_item">
          <Icon style={{marginLeft:"12px"}} iconName="giftbox"onClick={() => {
            const { customer_id, Ten_NguoiGioiThieu, ...prevData } = data;
            setGetListPointOfCustomer({ openModal: true, customer_id: customer_id });
            handleGetRevicePoint(customer_id)
            // dispatch(getListPointOfCustom({ customer_ref: customer_id }))
          }}/>
        </div> </CTooltip>
      ),
    },
    //  {
    //   title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
    //   align: "center",
    //   dataIndex: "",
    //   className: "",
    //   width: 50,
    //   ellipsis: true,
    //   render: (record: any, data: any) => (
    //         <CTooltip placements="topLeft" title="Xem lịch sử dùng điểm"> <div className="ant-table-column_item">
    //        <Icon style={{marginLeft:"12px"}}  iconName="history2" onClick={() => {
    //         const { customer_id, Ten_NguoiGioiThieu, ...prevData } = data;
    //         setGetListPointMinusOfCustomer({ openModal: true, customer_id: customer_id }); dispatch(getListPointMinusOfCustom({ customer_code: customer_id }))
    //       }} />
    //     </div> </CTooltip>
    //   ),
    // },
  ];

  const ColumnTableDetailService = [
    {
      title: (
        <Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "service_name",
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: (
        <Typography content="DVT" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      dataIndex: "unit_name",
      width: 60,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: <Typography content="SL" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "quantity",
      width: 40,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
      ),
    },
    {
      title: (
        <Typography content="Đơn giá" modifiers={["12x18", "500", "center"]} />
      ),
      align: "center",
      width: 140,
      dataIndex: "service_prices",
      render: (record: any, data: any) => (
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
      width: 120,

      render: (record: any, data: any) => (
        <Typography
          content={record ? record?.toLocaleString("vi-VN") : "0.00"}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
  ];

  const handleConvertStatus = (value: string[]) => {
    const newString = optionStateCS
      ?.filter((item) => {
        if (value.length > 1) {
          return value.some((y: string) => y.search(item.label) !== -1);
        } else {
          return value.some((yy) => yy === item.label);
        }
      })
      .map((o) => o.value)
      .join(",");
    return newString;
  };
  const handleChangePagination = (pages: number, size: number) => {
    dispatch(
      getListCustomerWOMMaster({
        page_number: pages,
        page_size: size,
        key_word: stateGetCustomerWOM.key_word
      } as any)
    );
    // setStates({
    //   ...states, page: pages, size: size
    // });
    // dispatch(getCustomerLeadsData({
    //   launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
    //   launch_source_id: Number(states.launchSourceID?.value ?? 0),
    //   from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
    //   to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
    //   keyword: states.keyword,
    //   page: pages, limit: size
    // }));
  };
  const memoTableCustomer = useMemo(
    () => (
      <PublicTable
        listData={stateCustomerWOM}
        column={ColumnTableCompany}
        rowkey={"Id_NguoiGioiThieu"}
        isPagination
        loading={isLoadingCustomerWOM}
        pageSizes={200}
        isHideRowSelect
        //  totalItem={storeResponseLeads?.total_items ?? 0}
        totalItem={
          (storeCustomerWOM?.status &&
            storeCustomerWOM?.data?.paging?.total_count) ||
          0
        }
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? "bg-gay-blur" : "";
        }}
        scroll={{ x: "max-content", y: "calc(100vh - 100px)" }}
        handleSelectRow={(
          record: any,
          selected: any,
          selectedRows: any,
          nativeEvent: any
        ) => {
          // setSendSMS({
          //   ...sendSMS,
          //   openModal: false,
          //   listCS: selectedRows.map((item: any) => ({
          //     customer_ref: item.Id_NguoiGioiThieu,
          //     ago_month: getDayago(item.create_date) || 0
          //   }))
          // })
        }}
        handleSelectAllRow={(
          selected: any,
          selectedRows: any,
          changeRows: any
        ) => {
          // setSendSMS({
          //   ...sendSMS,
          //   openModal: false,
          //   listCS: selectedRows.map((item: any) => ({
          //     customer_ref: item.Id_NguoiGioiThieu,
          //      ago_month:  getDayago(item.create_date) || 0
          //   }))
          // })
        }}
        handleSelectMultiple={(
          selected: any,
          selectedRows: any,
          changeRows: any
        ) => {
          // setSendSMS({
          //   ...sendSMS,
          //   openModal: false,
          //   listCS: selectedRows.map((item: any) => ({
          //     customer_ref: item.Id_NguoiGioiThieu,
          //      ago_month:  getDayago(item.create_date) || 0
          //   }))
          // })
        }}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        handleOnchange={(
          pagination: any,
          filters: any,
          sorter: any,
          extra: any
        ) => {
          // if (Object.values(filters).every(value => value === null)) {
          //   setDataFinish(storeResponseLeads?.data?.items);
          //   setCustomerCount([]);
          // } else {
          //   setDataFinish(extra.currentDataSource);
          //   setCustomerCount(extra.currentDataSource);
          // }
        }}
      />
    ),
    [
      storeStatistic.data,
      stateStatisticLoading,
      filterColumn,
      dataFilter.fromDay,
      dataFilter.toDay,
      stateCustomerWOM,
    ]
  );
  const memoTableCustomerId = useMemo(
    () => (
      <PublicTable
        isHideRowSelect
        listData={stateCustomerWOMById.data}
        column={ColumnTableCompanyId}
        // rowkey={"Id_NguoiGioiThieu"}
        // isPagination
        loading={isLoadingCustomerWOMById}
        // pageSizes={200}
        //  totalItem={storeResponseLeads?.total_items ?? 0}
        // totalItem={
        //   (storeCustomerWOM?.status &&
        //     storeCustomerWOM?.data?.paging?.total_count) ||
        //   0
        // }
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? "bg-gay-blur" : "";
        }}
        scroll={{ x: "max-content", y: "calc(100vh - 100px)" }}

    
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        handleOnchange={(
          pagination: any,
          filters: any,
          sorter: any,
          extra: any
        ) => {
          // if (Object.values(filters).every(value => value === null)) {
          //   setDataFinish(storeResponseLeads?.data?.items);
          //   setCustomerCount([]);
          // } else {
          //   setDataFinish(extra.currentDataSource);
          //   setCustomerCount(extra.currentDataSource);
          // }
        }}
      />
    ),
    [stateCustomerWOMById]
  );

  const renderUI = useMemo(() => {
    return isLoadingSwitchScreen ? (
      <div className="p-manager_customer_loading_switch" />
    ) : isOverview ? (
      <StatisticOverview dataFilter={dataFilter} />
    ) : (
      memoTableCustomer
    );
  }, [stateCustomerWOM]);
  const renderUIID = useMemo(() => {
    return isLoadingSwitchScreen ? (
      <div className="p-manager_customer_loading_switch" />
    ) : isOverview ? (
      <StatisticOverview dataFilter={dataFilter} />
    ) : (
      memoTableCustomerId
    );
  }, [stateCustomerWOMById]);

  const handleChangeOverview = () => {
    const timeout = setTimeout(() => {
      setIsLoadingSwitchScreen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  };

  useLayoutEffect(() => {
    handleChangeOverview();
  }, [isOverview]);

  useLayoutEffect(() => {
    document.title = "KH Giới Thiệu | CRM";
  }, []);

  const statisticHeader = useMemo(
    () => (
      <>
        <div className="t-statistic_manager_total_item">
          <span>TSUT:</span>
          <p>
            {
              dataFinish?.filter(
                (item: any) =>
                  item?.package_name
                    ?.toLocaleLowerCase()
                    .search("Tầm Soát Ung Thư".toLocaleLowerCase()) !== -1
              )?.length
            }
          </p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>NSDD:</span>
          <p>
            {
              dataFinish?.filter(
                (item: any) =>
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search("chẩn đoán H. pylori".toLocaleLowerCase()) !== -1 &&
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search(
                      "Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo".toLocaleLowerCase()
                    ) === -1
              )?.length
            }
          </p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>NSĐT:</span>
          <p>
            {
              dataFinish?.filter(
                (item: any) =>
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search("chẩn đoán H. pylori".toLocaleLowerCase()) === -1 &&
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search(
                      "Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo".toLocaleLowerCase()
                    ) !== -1
              )?.length
            }
          </p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>NSC:</span>
          <p>
            {
              dataFinish?.filter(
                (item: any) =>
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search("chẩn đoán H. pylori".toLocaleLowerCase()) !== -1 &&
                  item?.jsonitems
                    ?.toLocaleLowerCase()
                    .search(
                      "Làm Sạch Đại Tràng Bằng Thuốc Xổ Hoặc Thụt Tháo".toLocaleLowerCase()
                    ) !== -1
              )?.length
            }
          </p>
        </div>
        <div
          className="t-statistic_manager_total_item"
          style={{
            borderLeft: "1px solid #dbdbdb",
            paddingLeft: 8,
          }}
        >
          <span>Dịch vụ lẻ:</span>
          <p>{handleCountCustomerAllowPackage("note_package")}</p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Gói C:</span>
          <div className="t-statistic_manager_total_item_package">
            <span>
              Nam: {handleCountCustomerAllowPackage("package_c_male")}
              <a style={{ margin: "0 4px" }}>-</a>
              Nữ: {handleCountCustomerAllowPackage("package_c_female")}
            </span>
          </div>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Gói B:</span>
          <div className="t-statistic_manager_total_item_package">
            <span>
              Nam: {handleCountCustomerAllowPackage("package_b_male")}
              <a style={{ margin: "0 4px" }}>-</a>
              Nữ: {handleCountCustomerAllowPackage("package_b_female")}
            </span>
          </div>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Gói A:</span>
          <div className="t-statistic_manager_total_item_package">
            <span>
              Nam: {handleCountCustomerAllowPackage("package_a_male")}
              <a style={{ margin: "0 4px" }}>-</a>
              Nữ: {handleCountCustomerAllowPackage("package_a_female")}
            </span>
          </div>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Số KH:</span>
          <p>{dataFinish?.length || 0}</p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Tiền thuốc</span>
          <p>
            {Math.floor(
              _.sum(dataFinish?.map((item: any) => item?.total_drugs))
            )?.toLocaleString("vi-VN")}{" "}
            VNĐ
          </p>
        </div>
        <div className="t-statistic_manager_total_item">
          <span>Tiền dịch vụ</span>
          <p>
            {Math.floor(
              _.sum(dataFinish?.map((item: any) => item?.total_services))
            )?.toLocaleString("vi-VN")}{" "}
            VNĐ
          </p>
        </div>
      </>
    ),
    [dataFinish]
  );
    const columnTable = [
   
    {
      title: <Typography content="Thời gian" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'date',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
       },
      {
      title: <Typography content="Hình thức" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'type_display',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
      },
     {
      title: <Typography content="Điểm" modifiers={['12x18', '500', 'center', 'uppercase']} styles={{textAlign:"right", marginRight:"8px"}}/>,
      dataIndex: 'points',
       align: 'center',
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }} >
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung" modifiers={['12x18', '500', 'center', 'uppercase']}  styles={{textAlign:"left", marginLeft:"10px"}}/>,
      dataIndex: 'note',
      align: 'center',
      width: 340,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'left' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
   
   
  ];
   const columnTableMinus = [
    // {
    //   title: <Typography content="STT" modifiers={['12x18', '500', 'center', 'uppercase']} />,
    //   dataIndex: 'suggestion_count',
    //   align: 'center',
    //   width: 50,
    //   className: "ant-table-column_wrap",
    //   render: (record: any, data: any,index: number) => (
    //     <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}
    //       >
    //        <Typography content={`${index + 1}`} modifiers={['13x18', '600', 'main', 'justify']} />
    //     </div>
    //   ),
    // },
    {
      title: <Typography content="Ngày dùng điểm" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'date',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }} >
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
      },
     {
      title: <Typography content="Điểm sử dụng" modifiers={['12x18', '500', 'center', 'uppercase']}  styles={{textAlign:"right", marginRight:"8px"}}/>,
      dataIndex: 'points',
       align: 'center',
      width:170,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'right' }} >
         <Typography content={record?.toLocaleString('vi-VN')} modifiers={["14x20", "600", "center", "main"]} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung sử dụng điểm" modifiers={['12x18', '500', 'center', 'uppercase']}    styles={{textAlign:"left", marginLeft:"8px"}}/>,
      dataIndex: 'note',
      align: 'center',
      width: 340,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'left' }} >
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
   
   
  ];
        const tableMergeCustomer = useMemo(() => (
    <div className="t-header_wrapper_table" >
      <PublicTable
        column={columnTable}
        listData={dataRP}
        loading={responsePointOfCustomerLoading}
        size="middle"
        rowkey="customer_id"
        isbordered
        isPagination={false}
        scroll={{ x: "max-content", y: "calc(100vh - 500px)" }}
        isHideRowSelect
        pageSizes={15}
        handleChangePagination={(page: any, pageSize: any) => {
        }}
      />
    </div>
  ), [dataRP])
      const tableMergeCustomerMinus = useMemo(() => (
    <div className="t-header_wrapper_table" >
      <PublicTable
        column={columnTableMinus}
        listData={responsePointMinusOfCustomer?.data}
        loading={responsePointMinusOfCustomerLoading}
        size="middle"
        rowkey="customer_id"
        isbordered
        isPagination={false}
        scroll={{ x: "max-content", y: "calc(100vh - 500px)" }}
        isHideRowSelect
        pageSizes={15}
        handleChangePagination={(page: any, pageSize: any) => {
        }}
      />
    </div>
  ), [responsePointMinusOfCustomer])
  return (
    <PublicLayout isShowPopupChat={false} isShowPopupTelephone={false}>
      <div className="p-manager_customer">
        {stateStatisticLoading ? (
          <div className="p-manager_customer_header_skeleton">
            <Skeleton.Input active={true} size={"default"} />
          </div>
        ) : (
          <PublicHeader
            titlePage="Thống kê khách hàng giới thiệu"
            className="p-manager_customer_header"
            handleFilter={() => {}}
            handleCleanFilter={() => {}}
            handleGetTypeSearch={() => {}}
            handleOnClickSearch={(data: string) => {}}
            isHideLibraly
            isHideService
            isDial={false}
            isHideEmergency
            tabLeft={
              <div className="p-manager_customer_header_statistic">
                <Input
                  // variant='simple'
                  placeholder="Tìm kiếm khách hàng"
                  type="text"
              
                  value={stateGetCustomerWOM.key_word}
                  onChange={(event) => {
                    setStateGetCustomerWOM({
                      ...stateGetCustomerWOM, key_word: event?.target?.value
                    });
                  }}
                  // handleClickIcon={() => {
                  //   dispatch(getCustomerLeadsData({
                  //     launch_source_group_id: Number(states.launchSourceGroupID?.value ?? 0),
                  //     launch_source_id: Number(states.launchSourceID?.value ?? 0),
                  //     from_date: moment(states.dateFrom).format('YYYY-MM-DD 00:00:00'),
                  //     to_date: moment(states.dateTo).format('YYYY-MM-DD 23:59:59'),
                  //     page: states.page,
                  //     limit: states.size,
                  //     keyword: states.keyword
                  //   }));
                  // }}
                  onPressEnter={() => {
                    dispatch( getListCustomerWOMMaster({
        page_number: 1,
        page_size: 1000000,
        key_word: stateGetCustomerWOM.key_word
      } as any))
                  }}
                
                />

                <Button
                  isLoading={isLoadingStatistic}
                  disabled={isLoadingStatistic}
                  onClick={() => {
                    dispatch( getListCustomerWOMMaster({
        page_number: 1,
        page_size: 1000000,
        key_word: stateGetCustomerWOM.key_word
      } as any))
                  }}
                >
                  <Typography
                    content="Tìm kiếm"
                    modifiers={["13x18", "500", "justify", "white"]}
                    styles={{ paddingLeft: "5px", paddingRight: "5px" }}
                  />
                </Button>
                {/* <div className="t-statistic_manager_switch">
                  <Switchs
                    variant={'simple'}
                    textOn="Chi tiết"
                    textOff="Tổng quan"
                    defaultChecked={isOverview}
                    onChange={(checked: boolean, event: any) => {
                      setIsOverview(checked);
                      setIsLoadingSwitchScreen(true);
                      window.history.pushState(
                        null,
                        "",
                        `?type=${checked ? 'overview' : 'grid'}`
                      )
                    }}
                    disabled={isLoadingSwitchScreen || isLoadingStatistic}
                  />
                </div> */}
              </div>
            }
            isHideCleanFilter
            isHideFilter
          />
        )}
        <div
          className={mapModifiers("p-manager_customer_content")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            className="p-customer_leads_table"
            style={{ width: "50vw", overflowY: "hidden", height: "84vh" }}
          >
            {/* {stateStatisticLoading ?
              <div className="t-statistic_manager_skeleton">
                <Skeleton.Input active={true} size={'default'} />
              </div> :
              <div className="t-statistic_manager_total">
                {!isOverview && (
                  statisticHeader
                )}
              </div>
            } */}
            {renderUI}
          </div>
          {stateCustomerWOMById.data.length !== 0 && (
            <div
              className="t-statistic_manager"
              style={{ width: "44vw", marginLeft: "40px", overflowY: "hidden", height:"83vh" }}
            >
              <div style={{ width: "100%", height: "fit-content" }}>
                <Typography
                  content={`${
                    "Danh sách được " +
                    " " +
                    nameCustomer +" giới thiệu"
                  }`}
                  modifiers={["16x24", "600", "justify", "blueNavy"]}
                  styles={{ textAlign: "left" }}
                />
              </div>

              {renderUIID}
            </div>
          )}
        </div>
      </div>
       <CModal
        isOpen={getListPointOfCustomer.openModal}
        widths={1100}
          title={"Lịch sử nhận điểm"}
        onCancel={() => setGetListPointOfCustomer({
          openModal: false,
          customer_id: ""
        })}
        textCancel='Thoát'
        textOK={"Ok"}
        onOk={() => setGetListPointOfCustomer({
          openModal: false,
          customer_id: ""
        })}
      >
         {tableMergeCustomer}
      </CModal>
        <CModal
        isOpen={getListPointMinusOfCustomer.openModal}
        widths={1000}
          title={"Lịch sử sử dụng điểm"}
        onCancel={() => setGetListPointMinusOfCustomer({
          openModal: false,
          customer_id: ""
        })}
        textCancel='Thoát'
        textOK={"Ok"}
        onOk={() => setGetListPointMinusOfCustomer({
          openModal: false,
          customer_id: ""
        })}
      >
         {tableMergeCustomerMinus}
      </CModal>
    </PublicLayout>
  );
};

export default CustomerWOM;
