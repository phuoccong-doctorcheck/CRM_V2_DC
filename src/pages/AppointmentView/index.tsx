/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import {
  OptionTypeCustomer,
  exampleDataItemAppointmentView,
  optionCancelBooking,
  optionDate,
  optionNoteAppointmentView,
} from "assets/data";
import CDatePickers from "components/atoms/CDatePickers";
import CEmpty from "components/atoms/CEmpty";
import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Loading from "components/atoms/Loading";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import CCollapse from "components/organisms/CCollapse";
import CModal from "components/organisms/CModal";
import PublicHeader from "components/templates/PublicHeader";
import PublicHeaderStatistic from "components/templates/PublicHeaderStatistic";
import PublicLayout from "components/templates/PublicLayout";
import { useSip } from "components/templates/SipProvider";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import {
  postChangeMasterCare,
  postPrintAppointmentServicepoint,
} from "services/api/appointmentView";
import { AppointmentViewItem } from "services/api/appointmentView/types";
import { postNoteByID } from "services/api/beforeExams";
import { postCallOutCustomer } from "services/api/customerInfo";
import {
  getListAppointmentMaster,
  getStatisticAppointment,
} from "store/appointment_view";
import { getInfosCustomerById } from "store/customerInfo";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers, { downloadBlobPDF, previewBlobPDFOpenLink } from "utils/functions";
import { stateAppointView } from "utils/staticState";

const AppointmentView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { makeCall } = useSip();

  const isLoadingStatistic = useAppSelector((state) => state.appointmentMaster.isLoadingStatistic);
  const storeStatistic = useAppSelector((state) => state.appointmentMaster.statistic);
  const storeisLoadingAppointmentMaster = useAppSelector((state) => state.appointmentMaster.isLoadingAppointmentMaster);
  const storeAppointmentMaster = useAppSelector((state) => state.appointmentMaster.listAppointmentMaster);

  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<
    DropdownData[]
  >(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<
    DropdownData[]
  >(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(
    storageLaunchSources ? JSON.parse(storageLaunchSources) : ""
  );

  const [appointmentStatistic, setAppointmentStatistic] = useState(storeStatistic.data);
  const [listAppointmentMaster, setListAppointmentMaster] = useState(storeAppointmentMaster);
  const [dataFinish, setDataFinish] = useState<AppointmentViewItem[]>(storeAppointmentMaster?.data?.data || [])

  const [isOpenDetailService, setIsOpenDetailService] = useState(false);
  const [listDetailService, setListDetailService] = useState();
  const [payment, setPayment] = useState(0);
  const nameCS = Cookies.get("signature_name");
  const [contentNote, setContentNote] = useState("");
  const [csId, setCsId] = useState("");
  const [isAddNote, setIsAddNote] = useState(false);
  const employeeId = localStorage.getItem("employee_id");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 500 });
  const tableRefAppointment = useRef<HTMLDivElement>(null);
  
  const [infoCustomer, setInfoCustomer] = useState({
    name: "",
    date: "",
    masterId: '',
  });

  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
const [dataFilter, setDataFilter] = useState({
    date:  moment().add(1, 'days').toDate(),
    launchSourceId: undefined as unknown as DropdownData,
    launchSourceGroup: undefined as unknown as DropdownData,
    keyWord: "",
  });

  const initial = {
    fromDate: dataFilter?.date
      ?? moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    toDate: dataFilter?.date
      ?? moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
  };

  const propsData = {
    date: moment(dataFilter?.date).format("YYYY-MM-DDTHH:mm:ss"),
    launchSourceId: dataFilter?.launchSourceId?.value || 0,
    launchSourceGroupID: dataFilter?.launchSourceGroup?.value || 0,
    keyWord: dataFilter?.keyWord || "",
    pages: pagination?.page || 1,
    limits: pagination?.pageSize || 500,
  };

  const [filterColumn, setFilterColumn] = useState({
    company: [],
    launch_source: [],
    launch_source_type: [],
    partner: [],
    package: [],
    typeCustomer: [],
  });

  const [dataStatistic, setDataStatistic] = useState({
    pagination: undefined as any,
    filters: undefined as any,
    sorter: undefined as any,
    extra: undefined as any,
  });
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setstateBreakPoint(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getListAppointmentMaster(propsData as any));
    dispatch(getStatisticAppointment(initial as any));
    document.title = "Theo dõi lịch hẹn | CRM";
  }, []);
  
  const handleGetOptionFilterColumn = (key: string) => {
    let uniqueValues: any = [];
    switch (key) {
      case "affiliate_name":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item) => item?.affiliate_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_name":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item) => item?.launch_source_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_type_name":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item: any) => item?.launch_source_type_name)
              .filter(Boolean)
          )
        );
        break;
      case "launch_source_group_name":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item: any) => item?.launch_source_group_name)
              .filter(Boolean)
          )
        );
        break;
      case "package_name":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item: any) => item?.package_name)
              .filter(Boolean)
          )
        );
        break;
      case "f_type":
        uniqueValues = Array.from(
          new Set(
            (storeAppointmentMaster?.data?.data || [])
              ?.map((item: any) => stateAppointView.find((i) => i.value === item?.f_type)?.label)
              .filter(Boolean)
          )
        );
        break;
      default:
        break;
    }

    return uniqueValues.map((value: any) => ({ text: value, value: value }));
  };

  useEffect(() => {
    setListAppointmentMaster(storeAppointmentMaster);
    setFilterColumn({
      ...filterColumn,
      company: handleGetOptionFilterColumn("launch_source_group_name") as any,
      launch_source: handleGetOptionFilterColumn("launch_source_name") as any,
      launch_source_type: handleGetOptionFilterColumn(
        "launch_source_type_name"
      ) as any,
      partner: handleGetOptionFilterColumn("affiliate_name") as any,
      package: handleGetOptionFilterColumn("package_name") as any,
      typeCustomer: handleGetOptionFilterColumn("f_type") as any,
    });
    setDataFinish(storeAppointmentMaster?.data?.data);
  }, [storeAppointmentMaster]);

  useEffect(() => {
    setAppointmentStatistic(storeStatistic.data);
  }, [storeStatistic]);

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
  const { mutate: postChangeStatusCustomer } = useMutation(
    "post-footer-form",
    (master_id: string) => postChangeMasterCare(master_id),
    {
      onSuccess: (data) => {
        dispatch(
          getListAppointmentMaster({
            ...propsData,
          } as any)
        );
        dispatch(getStatisticAppointment(initial as any));
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  const { mutate: postCallOut } = useMutation(
    "post-footer-form",
    (data: any) => postCallOutCustomer(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: postNoteCustomerById } = useMutation(
    "post-footer-form",
    (data: any) => postNoteByID(data),
    {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsAddNote(false);
        setContentNote("");
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const { mutate: printAppointmentServicepoint } = useMutation(
    "post-footer-form",
    (data: string) => postPrintAppointmentServicepoint(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          previewBlobPDFOpenLink(data?.data, data?.message);
        } else {
          toast.info(data?.message);
        }
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );

  const handleCallOutCustomer = (data: any) => {
    postCallOut({
      message: `${nameCS || Cookies.get("signature_name")
        } gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: data,
    });
  };
  const handleAddNoteCustomer = () => {
    const body = {
      customer_id: csId,
      cs_node_type: "cs",
      cs_node_content: canceledReason.reason,
    };
    postNoteCustomerById(body);
  };

  const handlePrintAllServices = (masterID: string) => {
    printAppointmentServicepoint(masterID);
  };

  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    dispatch(
      getListAppointmentMaster({
        ...propsData,
        pages: pages,
        limits: size || 30,
      } as any)
    );
    dispatch(getStatisticAppointment(initial as any));
  };
  const descriptionGrid = [
    { id: 0, color: '#fbf7aadb', title: 'Chưa đến', type: 'new' },
    { id: 1, color: '#c8ebfa', title: 'Đang phục vụ', type: 'inprogress' },
    { id: 2, color: '#98e0ad', title: 'Đã xong', type: 'done' },
  ];

  const ColumnTable = [
    {
      title: (<Typography content="STT" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "index",
      width: 50,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          <Typography content={`${index + 1}`} modifiers={["14x20", "600", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày đặt lịch" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "appointment_date",
      width: 160,
      showSorterTooltip: false,
      sorter: (a: any, b: any) => new Date(a?.appointment_date).valueOf() - new Date(b?.appointment_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record ? moment(record).format("YYYY-MM-DD HH:mm") : ""} modifiers={["14x20", "jetSub", "600", "center"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Ngày checkin" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "register_date",
      width: 160,
      showSorterTooltip: false,
      sorter: (a: any, b: any) => new Date(a?.register_date).valueOf() - new Date(b?.register_date).valueOf(),
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record ? moment(record).format("YYYY-MM-DD HH:mm") : ""} modifiers={["14x20", "jetSub", "600", "center"]} />
        </div>
      ),
    },
    
    {
      title: (<Typography content="Họ và tên" modifiers={["12x18", "500", "center"]} styles={{textAlign:"left", marginLeft:"18px"}}/>),
      align: "center",
      sorter: (a: any, b: any) => (a?.customer_fullname || "").localeCompare(b?.customer_fullname || ""),
      showSorterTooltip: false,
      dataIndex: "customer_fullname",
      width: 220,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => {
        const { year_of_birth, gender_name } = data;
        return (
          <div className="ant-table-column_item" onClick={() => {
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
          style={{marginLeft:"12px"}}
          >
            <Typography
              content={record}
              modifiers={["14x20", "main", "600", "justify"]}
              styles={{marginLeft:"10px"}}
            />
            {/* <div>
              <span style={{ color: "#28a745" }}>{year_of_birth}</span>
              &nbsp;-&nbsp;
              <span style={{ color: "#f00" }}>{gender_name}</span>
            </div> */}
          </div>
        );
      },
    },
    {
      title: (<Typography content="Năm sinh" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      sorter: (a: any, b: any) => (a?.customer_fullname || "").localeCompare(b?.customer_fullname || ""),
      showSorterTooltip: false,
      dataIndex: "customer_fullname",
      width: 120,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => {
        const { year_of_birth, gender_name } = data;
        return (
          <div className="ant-table-column_item" onClick={() => {
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
          }}>
            <Typography
              content={year_of_birth}
              modifiers={["14x20", "main", "600", "center"]}
            />
            {/* <div>
              <span style={{ color: "#28a745" }}>{year_of_birth}</span>
            </div> */}
          </div>
        );
      },
    },
     {
      title: (<Typography content="Giới tính" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      sorter: (a: any, b: any) => (a?.customer_fullname || "").localeCompare(b?.customer_fullname || ""),
      showSorterTooltip: false,
      dataIndex: "customer_fullname",
      width: 120,
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => {
        const { year_of_birth, gender_name } = data;
        return (
          <div className="ant-table-column_item" onClick={() => {
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
          }}>
            <Typography
              content={gender_name}
              modifiers={["14x20", "main", "600", "center"]}
            />
            {/* <div>
              <span style={{ color: "#28a745" }}>{year_of_birth}</span>
            </div> */}
          </div>
        );
      },
    },
    {
      title: (<Typography content="Phân loại" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      width: 160,
      dataIndex: "f_type",
      filters: filterColumn.typeCustomer,
      onFilter: (value: any, record: any) => { return stateAppointView.find((i) => i.value === record.f_type)?.label?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={(stateAppointView || []).find((i: any) => i?.value === record)?.label} modifiers={["14x20", "600", "center", record === "Khách hàng mới" ? "blueNavy" : 'main',]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Công ty" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "launch_source_group_name",
      showSorterTooltip: false,
      width: 200,
      filters: filterColumn.company,
      onFilter: (value: any, record: any) => { return record.launch_source_group_name?.includes(value); },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record} modifiers={["14x20", "600", "center", "blueNavy"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Nguồn" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      width: 220,
      dataIndex: "launch_source_name",
      showSorterTooltip: false,
      filters: filterColumn.launch_source,
      onFilter: (value: any, record: any) => {
        if (value.includes("(WoM)")) {
          return record.launch_source_name?.includes("(WoM)");
        } else {
          return (
            record.launch_source_name
              ?.toLocaleLowerCase()
              .search(value?.toLocaleLowerCase()) !== -1
          );
        }
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record} modifiers={["14x20", "600", "center", data?.affiliate_type && data?.affiliate_type === "BSCD" ? "cg-red" : "green"]} />
        </div>
      ),
    },
    {
      title: (data: any) => { return (<Typography content="Đối tác" modifiers={["12x18", "500", "center"]} />); },
      width: 260,
      dataIndex: "affiliate_name",
      filters: filterColumn.partner,
      filterSearch: true,
      onFilter: (value: string, record: any) => {
        if (value.split("] ")[1]) {
          return (
            record.affiliate_name
              .split("] ")[1]
              ?.toLocaleLowerCase()
              .search(value.split("] ")[1]?.toLocaleLowerCase()) !== -1
          );
        } else {
          return (
            record.affiliate_name
              ?.toLocaleLowerCase()
              .search(value.toLocaleLowerCase()) !== -1
          );
        }
      },
      className: "ant-table-column_wrap-column",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          {(data?.affiliate_type !== "customer" && data?.affiliate_type !== "BSCD") ? (
            <Typography content={data?.affiliate_type} modifiers={["14x20", "600", "center", data?.affiliate_type === "BSCD" ? "cg-red" : "blueNavy",]} />
          ) : null}
          <Typography content={record} modifiers={["14x20", "600", "center", data?.affiliate_type === "BSCD" ? "cg-red" : "blueNavy",]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Dịch vụ" modifiers={["12x18", "500", "center"]} />),
      dataIndex: "note",
      align: "center",
      width: 320,
      filters: filterColumn.package,
      filterSearch: true,
      onFilter: (value: any, record: any) => {
        return (
          record.package_name
            ?.toLocaleLowerCase()
            .search(value.toLocaleLowerCase()) !== -1
        );
      },
      ellipsis: true,
      render: (record: any, data: any) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {data?.package_name && (
            <Typography
              type="span"
              content={data?.package_name}
              modifiers={["14x20", "600", "justify", "cg-red"]}
            />
          )}
          <Typography
            content={record}
            modifiers={["13x18", "600", "justify", "blueNavy"]}
          />
        </div>
      ),
    },
    {
      title: (
        <Typography content="Ghi chú" modifiers={["12x18", "500", "center"]} />
      ),
      align: "justify",
      dataIndex: "appointment_note",
      width: 240,
      ellipsis: true,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record} modifiers={["14x20", "600", "left", "blueNavy"]} />
        </div>
      ),
    },
    {
      title: (<Typography content="Tình trạng" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "is_care",
      className: "p-appointment_view_column_care",
      showSorterTooltip: false,
      fixed: 'right',
      sorter: (a: any, b: any) =>
        (a?.status_display || "").localeCompare(b?.status_display || ""),
      width: 150,
      ellipsis: true,
      render: (record: any, data: any) => {
        const { care_employee_name, care_employee_id, master_id, is_care,customer_id } =
          data;
        return (
          <div
            className="p-appointment_view_column_care_item"
            onClick={async () => {
              console.log("🚀", care_employee_id === null,
                !is_care,
                care_employee_id === employeeId, care_employee_id, employeeId)
              if (
                care_employee_id === null ||
                !is_care ||
                care_employee_id === employeeId
              ) {
                console.log(data)
                 await postChangeStatusCustomer(master_id);
              } else {
                toast.info(
                  "Bạn không thể sửa trạng thái khách hàng đã có người phụ trách"
                );
              }
            }}
          >
            <Typography
              content={record ? "Đã chăm sóc" : "Chưa chăm sóc"}
              modifiers={[
                "14x20",
                "600",
                "center",
                record ? "green" : "cg-red",
              ]}
            />
            {!_.isNull(care_employee_name) && (
              <p style={{ fontSize: 12, color: "#04566e" }}>
                Bởi:&nbsp;{care_employee_name}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: (<Typography content="Trạng thái" modifiers={["12x18", "500", "center"]} />),
      align: "center",
      dataIndex: "status_display",
      showSorterTooltip: false,
      sorter: (a: any, b: any) => (a?.status_display || "").localeCompare(b?.status_display || ""), width: 140,
      ellipsis: true,
      fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" onClick={() => {
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
        }}>
          <Typography content={record} modifiers={["14x20", "400", "center", data?.status === 'done' ? 'green' : data?.status === 'inprogress' ? 'blueNavy' : 'cg-red', '600']} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
          <CTooltip placements="top" title="Xem chỉ định"><div className={mapModifiers("p-appointment_view_column_pdf")}>
        
            <Icon
              iconName={"pdf"}
              isPointer
              onClick={() => {
              ///Checkpoint
              setListDetailService(
                handleConvertInfoTolistService(data?.items) as any
              );
              setInfoCustomer({
                name: data?.customer_fullname,
                date: data?.appointment_date,
                masterId: data?.master_id,
              });
              setIsOpenDetailService(true);

            }}
          // onClick={() => {
          //   handlePrintAllServices(data?.master_id);
          // }}
          />
        </div></CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
        <CTooltip placements={"top"} title={'Thêm ghi chú'}>
          <div className={mapModifiers("p-appointment_view_column_pdf")}>
          <Icon
            iconName={"note_crm"}
            isPointer
            onClick={() => {
              setCsId(data?.customer_id);
              setIsAddNote(true);
            }}
            />
          </div>
        </CTooltip>
      ),
    },
    {
      title: <Typography content="" modifiers={["12x18", "500", "center"]} />,
      align: "center",
      dataIndex: "",
      className: "",
      width: 40,
      ellipsis: true,
      fixed: 'right',
      render: (record: any, data: any) => (
         <CTooltip placements={"top"} title={'Gọi điện'}> <div className={mapModifiers("p-appointment_view_column_pdf")}>
          <Icon
            iconName={"phone_icon-main"}
            isPointer
            onClick={() => {
              handleCallOutCustomer(data?.customer_phone);
            }}
          />
        </div></CTooltip>
      ),
    },
  ];
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
        <Typography content={record} modifiers={["12x18", "400", "center"]} />
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
  const SevenDays = [
    {
      id: 3,
      days: moment(new Date()).subtract(4, "days").format("dd"),
      date: moment(new Date()).subtract(4, "days").format('YYYY-MM-DD'),
    },
    {
      id: 4,
      days: moment(new Date()).subtract(3, "days").format("dd"),
      date: moment(new Date()).subtract(3, "days").format('YYYY-MM-DD'),
    },
    {
      id: 5,
      days: moment(new Date()).subtract(2, "days").format("dd"),
      date: moment(new Date()).subtract(2, "days").format('YYYY-MM-DD'),
    },
    {
      id: 6,
      days: moment(new Date()).subtract(1, "days").format("dd"),
      date: moment(new Date()).subtract(1, "days").format('YYYY-MM-DD'),
    },
    {
      id: 7,
      days: moment(new Date()).format("dd"),
      date: moment(new Date()).format('YYYY-MM-DD'),
    },
    {
      id: 1,
      days: moment(new Date()).add({ days: 1 }).format("dd"),
      date: moment(new Date()).add({ days: 1 }).format('YYYY-MM-DD'),
    },
    {
      id: 2,
      days: moment(new Date()).add({ days: 2 }).format("dd"),
      date: moment(new Date()).add({ days: 2 }).format('YYYY-MM-DD'),
    },
  ];
  const renderItemCollapse = (data: any) => {
    const titleRender: any = {
      appointment_date: (<Typography content="Ngày đặt lịch:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      customer_fullname: (<Typography content="Họ Và Tên:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      register_date: (<Typography content="Ngày Đến:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      gender_name: (<Typography content="Giới tính:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      launch_source_group_name: (<Typography content="Công Ty:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      customer_phone: (<Typography content="Điện thoại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      launch_source_name: (<Typography content="Nguồn:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      affiliate_name: (<Typography content="Đối Tác:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      status_display: (<Typography content="Trạng Thái:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      f_type: (<Typography content="Phân Loại:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      note: (<Typography content="Dịch vụ:" modifiers={["14x20", "500", "center", "capitalize"]} />),
      package_name: (<Typography content="Gói khám:" modifiers={["14x20", "500", "center", "capitalize"]} />),
    };

    const keysInTitleRender = Object.keys(titleRender);

    const sortedFields = keysInTitleRender
      .filter((key) => data.hasOwnProperty(key))
      .map((key) => {
        if (["appointment_date", "register_date"].includes(key)) {
          return {
            key,
            value: data[key]
              ? moment(data[key]).format("HH:mm - DD/MM/YYYY")
              : "",
          };
        } else if (["customer_phone"].includes(key)) {
          return { key, value: data[key]?.replace("+84-", "0") };
        } else if (["affiliate_name"].includes(key)) {
          return { key, value: data[key] ? `${data[key]}` : "--" };
        } else {
          return { key, value: data[key] };
        }
      });

    return (
      <>
        {sortedFields.map(({ key, value }) => {
          return (
            <div
              className="p-appointment_view_collapse_item_content_field"
              key={key}
            >
              {titleRender[key]}
              <span>{value}</span>
            </div>
          );
        })}
      </>
    );
  };

  const collapseBeforeExams = useMemo(
    () => (
      <div className="p-appointment_view_collapse">
        {listAppointmentMaster?.data?.data?.length ? listAppointmentMaster?.data?.data?.map((itemBeforeExams: any) => (
          <div
            className={mapModifiers(
              "p-appointment_view_collapse_item",
              itemBeforeExams.is_care ? "care" : "",
              itemBeforeExams?.status
            )}
            key={itemBeforeExams.index}
          >
            <CCollapse
              title={
                <div
                  className="p-appointment_view_collapse_item_header"
                  key={itemBeforeExams.index}
                >
                  <div className="p-appointment_view_collapse_item_title">
                    {itemBeforeExams.is_care ? (
                      <div className="p-appointment_view_collapse_item_title_care">
                        <Typography
                          content={itemBeforeExams?.customer_fullname}
                          modifiers={["blueNavy"]}
                        />
                      </div>
                    ) : (
                      <Typography
                        content={itemBeforeExams?.customer_fullname}
                        modifiers={["blueNavy"]}
                      />
                    )}
                    {itemBeforeExams?.customer_phone?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.customer_phone.replace(
                            "+84-",
                            "0"
                          )}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_group_name?.trim() ? (
                      <>
                        <Typography
                          content={
                            itemBeforeExams?.launch_source_group_name
                          }
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_name?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.launch_source_name}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                    {itemBeforeExams?.launch_source_type_name?.trim() ? (
                      <>
                        <Typography
                          content={itemBeforeExams?.launch_source_type_name}
                          modifiers={["green"]}
                        />
                      </>
                    ) : stateBreakPoint < 600 ? null : (
                      <span>---</span>
                    )}
                  </div>
                </div>
              }
              key_default="0"
            >
              <div className="p-appointment_view_collapse_item_content">
                {renderItemCollapse(itemBeforeExams)}
              </div>
              <div className="p-appointment_view_collapse_item_wrap">
                <div className="p-appointment_view_collapse_item_action">
                  {[
                    {
                      titleAction: "Thêm ghi chú",
                      titlePlacement: "top",
                      icon: "note_crm",
                      iconSizes: "24x24",
                      handleClick: () => { },
                    },
                    {
                      titleAction: "Tiếp nhận",
                      titlePlacement: "top",
                      icon: "accept_crm_feild",
                      iconSizes: "24x24",
                      handleClick: async () => { },
                    },
                    {
                      titleAction: "Gắn Tag",
                      titlePlacement: "bottom",
                      icon: "hook_tag",
                      iconSizes: "24x24",
                      handleClick: () => { },
                    },
                    {
                      titleAction: "Trò chuyện",
                      titlePlacement: "bottom",
                      icon: "messager_crm",
                      iconSizes: "24x24",
                      handleClick: () => {
                        toast.info("Tính năng này đang được phát triển");
                      },
                    },
                  ].map((item: any, idx: any) => (
                    <CTooltip
                      title={item.titleAction}
                      placements="top"
                      key={idx}
                      colorCustom="#3e79f7"
                    >
                      <div
                        className="m-list_btn-open_option_item"
                        onClick={item?.handleClick}
                      >
                        <Icon
                          iconName={item.icon}
                          size={item.iconSizes}
                          isPointer
                        />
                      </div>
                    </CTooltip>
                  ))}
                </div>

                <div className="p-appointment_view_collapse_item_enter">
                  <CTooltip
                    title={"Chi tiết khách hàng"}
                    placements="top"
                    colorCustom="#3e79f7"
                  >
                    <div className="m-list_btn-open_option_item">
                      <Icon
                        iconName="exits"
                        isPointer
                        onClick={() => {
                          const {
                            customer_id,
                            customer_fullname,
                            ...prevData
                          } = itemBeforeExams;
                          if (customer_id) {
                            sessionStorage.setItem("indexMenu", "101");
                            Cookies.set("id_customer", customer_id);
                            dispatch(
                              getInfosCustomerById({
                                customer_id: customer_id,
                              })
                            );
                            const newTab = window.open(
                              `/customer-info/id/${customer_id}/history-interaction`,
                              "_blank"
                            );
                            if (newTab) {
                              newTab.focus();
                            }
                          } else {
                            toast.error(
                              `Không tìm thấy khách hàng: ${customer_fullname}`
                            );
                          }
                        }}
                      />
                    </div>
                  </CTooltip>
                </div>
              </div>
            </CCollapse>
          </div>
        ))
          : (
            storeisLoadingAppointmentMaster ? <div className="p-appointment_view_collapse_loading">
              <Loading variant="fullScreen" />
            </div> : <CEmpty description="Không có dữ liệu ...!" />
          )
        }
      </div>
    ),
    [listAppointmentMaster?.data?.data, storeisLoadingAppointmentMaster]);

  const TableMemory = useMemo(() => {
    return (
      <PublicTable
        loading={storeisLoadingAppointmentMaster}
        listData={listAppointmentMaster?.data?.data}
        column={ColumnTable}
        rowkey="master_id"
        isHideRowSelect
        pageSizes={1000}
        scroll={{
          x:
            listAppointmentMaster?.data?.data?.length > 0
              ? "max-content"
              : "100%",
          y: 400,
        }}
        isPagination
        rowClassNames={(record: any, index: any) => {
          return index % 2 === 0 ? 'bg-gay-blur' : ''
        }}
        totalItem={listAppointmentMaster?.data?.paging?.total_count}
        handleChangePagination={(page: any, pageSize: any) => {
          handleChangePagination(page, pageSize);
        }}
        handleOnchange={(pagination: any, filters: any, sorter: any, extra: any) => {
          setDataStatistic({
            ...dataStatistic,
            pagination: pagination,
            filters: filters,
            sorter: sorter,
            extra: extra,
          });
          if (Object.values(filters).every(value => value === null)) {
            setDataFinish(storeAppointmentMaster?.data?.data);
          } else {
            setDataFinish(extra.currentDataSource);
          }
        }}
        tableRef={tableRefAppointment}
      />
    );
  }, [storeisLoadingAppointmentMaster, listAppointmentMaster?.data?.data]);

  const statisticHeader = useMemo(
    () => (
      <PublicHeaderStatistic
        title="Theo dõi lịch hẹn"
        isSendRequest={isLoadingStatistic}
        handleClick={(data: any) => {
          dispatch(
            getStatisticAppointment({
              fromDate: moment(data.from).format("YYYY-MM-DD"),
              toDate: moment(data.to).format("YYYY-MM-DD"),
            } as any)
          );
        }}
        isStatistic={false}
        valueRangeDate={{
          from: new Date(),
          to: new Date(),
        }}
      >
        {
          stateBreakPoint < 980 ?
            <ul className="p-appointment_view_description">
              {
                descriptionGrid.map((item) => (
                  <li key={item.id}>
                    <p style={{ backgroundColor: item.color }} />
                    <Typography content={item.title} />
                  </li>
                ))
              }
            </ul> : null
        }
      </PublicHeaderStatistic>
    ),
    [appointmentStatistic, storeStatistic.data, listAppointmentMaster?.data]
  );

  const memoryListRecentDay = useMemo(() => (
    <ul className="p-appointment_view_date_list">
      {
        SevenDays.map((item) => {
          return (
            <li
              key={item.id}
              className={mapModifiers("p-appointment_view_date_list_item", item.date === moment(dataFilter.date).format('YYYY-MM-DD') && 'active')}
              onClick={() => {
                if (!storeisLoadingAppointmentMaster) {
                  setDataFilter({
                    ...dataFilter,
                    date: new Date(moment(item.date).format("YYYY-MM-DDT00:00:01")),
                  });
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      date: moment(item.date).format("YYYY-MM-DDTHH:mm:ss"),
                    } as any)
                  );
                  dispatch(
                    getStatisticAppointment({
                      fromDate: moment(item.date).format("YYYY-MM-DD"),
                      toDate: moment(item.date).format("YYYY-MM-DD"),
                    } as any)
                  );
                }
              }}
            >
              <span>{item.days}</span>
              <p>{moment(item.date).format('DD/MM/YYYY')}</p>
            </li>
          )
        })
      }

    </ul>
  ), [dataFilter, storeisLoadingAppointmentMaster])

  return (
    <div className="p-appointment_view">
      <PublicLayout>

        
        <PublicHeader
          titlePage=""
          className="p-appointment_view_header_public"
          handleFilter={() => { }}
          isHideFilter
          isClearFilter={storeisLoadingAppointmentMaster}
          handleCleanFilter={() => {
            setDataFilter({
              date: new Date(),
              launchSourceId: undefined as unknown as DropdownData,
              launchSourceGroup: undefined as unknown as DropdownData,
              keyWord: "",
            });
            dispatch(getListAppointmentMaster({} as any));
            dispatch(getStatisticAppointment(initial as any));
          }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data) => {
        
          }}
          isUseSearch
          isHideFilterMobile={false}
          handleClickFilterMobile={() => { }}
          tabLeft={
            <div className="p-appointment_view_filter">
              <CDatePickers
                fomat="YYYY-MM-DD"
                variant="simple"
                ValDefault={dataFilter.date}
                value={new Date(dataFilter?.date)}
                handleOnChange={(date: any) => {
                  setDataFilter({
                    ...dataFilter,
                    date: date?.$d,
                  });
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      date: moment(date?.$d).format("YYYY-MM-DDT00:00:00"),
                    } as any)
                  );
                }}
              />
              {stateBreakPoint > 600 &&
                <GroupRadio
                  options={optionDate}
                  defaultVal={optionDate.find((i) => new Date(i.value as any).valueOf() === new Date(moment(dataFilter.date as any).format("YYYY-MM-DD 00:00:00")).valueOf())}
                  value={optionDate.find((i) => new Date(i.value as any).valueOf() === new Date(moment(dataFilter.date as any).format("YYYY-MM-DD 00:00:00")).valueOf())}
                  handleOnchangeRadio={(e) => {
                    setDataFilter({
                      ...dataFilter,
                      date: new Date(e.value),
                    });
                    dispatch(
                      getListAppointmentMaster({
                        ...propsData,
                        date: moment(e.value).format("YYYY-MM-DDT00:00:00"),
                      } as any)
                    );
                  }}
                />}
            </div>
          }
          tabBottom={
            <div className="p-appointment_view_filter_bottom">
              <Dropdown
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...stateLaunchSourceGroups,
                ]}
                variant="simple"
                placeholder="Nhóm nguồn"
                values={dataFilter.launchSourceGroup}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, launchSourceGroup: e });
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      launchSourceGroupID: e?.value || 0,
                    } as any)
                  );
                }}
              />
              <Dropdown
                dropdownOption={[
                  { id: 99, label: "Tất cả", value: null as any },
                  ...listLaunchSources,
                ]}
                variant="simple"
                placeholder="-- Chọn nguồn --"
                values={dataFilter.launchSourceId}
                handleSelect={(e: any) => {
                  setDataFilter({ ...dataFilter, launchSourceId: e });
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      launchSourceId: e.value || "all",
                    } as any)
                  );
                }}
              />
              <div style={{marginTop:"10px"}}>
                  <Input
                id="user_name"
                variant="simple"
                onChange={(e) => {
                  setDataFilter({ ...dataFilter, keyWord: e.target.value });
                }}
                value={dataFilter.keyWord}
                placeholder="Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm"
                handleClickIcon={() => {
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      keyWord: dataFilter.keyWord || 0,
                    } as any)
                  );
                }}
                handleEnter={() => {
                  dispatch(
                    getListAppointmentMaster({
                      ...propsData,
                      keyWord: dataFilter.keyWord || 0,
                    } as any)
                  );
                }}
                iconName="search"
              />
              </div>
            </div>
          }
          isHideCleanFilter
          tabBottomRight={
            <div className="p-appointment_view_filter_bottom_right">
              <div style={{ color: "#f00", fontSize: 15, minWidth: 120 }}>
                <span style={{ color: "#333", marginRight: 6 }}>Có:</span>
                {Number(dataFinish?.length || 0)}
                <span style={{ color: "#333", marginLeft: 6 }}>Khách hàng</span>
              </div>
            </div>
          }
        />
        {statisticHeader}
        {stateBreakPoint < 980 && (
          <div className="p-appointment_view_date">
            {memoryListRecentDay}
          </div>
        )}
        <div className="p-appointment_view_table">
          {stateBreakPoint < 980 ? collapseBeforeExams : TableMemory}
        </div>
      </PublicLayout>
      <CModal
        isOpen={isAddNote}
        widths={540}
        title="Cập nhật ghi chú về khách hàng"
        onCancel={() => {
          setIsAddNote(false);
        }}
        onOk={() => {
          if (canceledReason) {
            handleAddNoteCustomer();
          } else {
            toast.error("Bạn không thể ghi chú mà không có nội dung");
          }
        }}
        textCancel="Hủy"
        textOK="Cập nhật"
      >
        <div className="m-customer_infos_canceled">
          <GroupRadio
            options={optionNoteAppointmentView}
            handleOnchangeRadio={(item: GroupRadioType) => {
              setCanceledReason({
                ...canceledReason,
                type: item.value,
                reason: item.id !== 6 ? item.label : '',
                item: item,
              })
            }}
            value={canceledReason.item}
          />
          {
            canceledReason.type === '6' &&
            <TextArea
              id=""
              readOnly={false}
              value={canceledReason.reason}
              handleOnchange={(e) => setCanceledReason({
                ...canceledReason, reason: e.target.value
              })}
            />
          }
        </div>
      </CModal>
      <div className="p-appointment_view_modal">
        <CModal
          isOpen={isOpenDetailService}
          onCancel={() => setIsOpenDetailService(false)}
          onOk={() => {
            handlePrintAllServices(infoCustomer?.masterId);
          }}
          widths={1024}
          className="detail_service"
          textCancel="Hủy"
          textOK="In phiếu chỉ định"
          title={
            <p className="p-appointment_view_detail_header">
              <span>Chi tiết dịch vụ của KH:</span>&nbsp;
              <span style={{ color: "#1976D2" }}>{`${infoCustomer.name}`}</span>
              {infoCustomer.date &&
                <>
                  , Thời gian:&nbsp;
                  <span style={{ color: "#1976D2" }}>
                    {moment(infoCustomer.date).format("HH:mm - DD/MM/YYYY")}
                  </span>
                </>
              }
            </p>
          }
        >
          <div className="p-appointment_view_detail_service">
            <div className="p-appointment_view_detail_service_heading">
              <PublicTable
                listData={exampleDataItemAppointmentView}
                isHideRowSelect
                column={ColumnTableDetailService}
                scroll={{
                  y: '100%'
                }}
                isSimpleHeader
                isNormal
                isbordered={false}
              />
            </div>
            <div className="p-appointment_view_detail_service_content">
              <PublicTable
                listData={listDetailService}
                loading={_.isEmpty(listDetailService)}
                isHideRowSelect
                isHideHeader
                defaultExpandAllRow
                rowkey="id_group"
                scroll={{ x: 'max-content' }}
                column={[
                  {
                    title: "",
                    align: "left",
                    dataIndex: "name",
                    render: (record: any, data: any) => (
                      <div className="p-booking_schedule_heading">
                        <Typography
                          content={`${record} (${data?.child?.length})`}
                          modifiers={["16x24", "600", "justify", "blueNavy"]}
                        />
                      </div>
                    ),
                  },
                ]}
                expandedRender={(data) => (
                  <PublicTable
                    isSimpleHeader
                    column={ColumnTableDetailService}
                    listData={data?.child}
                    size="small"
                    rowkey="service_id"
                    isbordered
                    isPagination={false}
                    isHideRowSelect
                    isHideHeader
                    handleOnDoubleClick={(item: any) => { }}
                    rowClassNames={(record, index) => ""}
                    scroll={{
                      x: 'max-content',
                      // y: '100%',
                    }}
                  />
                )}
                isExpandable
                expandedRowKeys={Array?.from({ length: 50 }, (_, index) => index)}
              />
            </div>
            {!_.isEmpty(listDetailService) && (
              <div className="p-appointment_view_detail_service_money">
                <span>Thành tiền:</span>
                <p>{payment?.toLocaleString("vi-VN")} VNĐ</p>
              </div>
            )}
          </div>
        </CModal>
      </div>
    </div>
  );
};

export default AppointmentView;
