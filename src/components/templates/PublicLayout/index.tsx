/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-const-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { AnyAction } from "@reduxjs/toolkit";
import { Layout, Spin } from "antd";
import { DropdownData } from "components/atoms/Dropdown";
import { GroupRadioType } from "components/atoms/GroupRadio";
import { TransferType } from "components/atoms/Transfer";
import Typography from "components/atoms/Typography";
import MenuItem, { ItemMenu } from "components/molecules/MenuItem";
import UserDropdown from "components/molecules/UserDropdown";
import CDrawer from "components/organisms/CDrawer";
import CModal from "components/organisms/CModal";
import Cookies from "js-cookie";
import _ from "lodash";
import React, { createContext, useEffect, useLayoutEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCustomerWhenCallIn,
  getIdTypeCustom,
  getPackagesDetail,
} from "services/api/dashboard";
import { ServiceGroup } from "services/api/dashboard/types";
import { UserCallAgent } from "services/types";
import { getInitAfterExams } from "store/afterexams";
import { getListResourceCRM, getListServiceWItems } from "store/home";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getListPageWithPancake } from "store/pancake";
import { SOCKET_URL_CHART } from "utils/constants";
import mapModifiers from "utils/functions";
import { MenuCRMMobile } from "utils/staticState";
import W3CWebSocket from "websocket";

import HeaderNav from "../HeaderNav";
import SideNav from "../SideNav";
import { CallConnect, useSip } from "../SipProvider";
import Telephone from "../Telephone";

import { getUserMedia, handleLogin } from "./index.controller";

import logoActive from 'assets/images/short_logo.svg';
import logo from 'assets/images/short_logo.svg';


declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface SoftPhoneProvider {
  handleOpenDial?: (any: CallConnect) => void;
}

interface PublicLayoutProps {
  children?: React.ReactNode;
  isLoadings?: boolean;
  isShowPopupChat?: boolean;
  isShowPopupTelephone?: boolean;
  widthScreen?: number;
}
 let newAppointmentTypes: GroupRadioType[] = [];
      let newVouchersTypes: GroupRadioType[] = [];
      let newLaunchSources: DropdownData[] = [];
      let newLaunchSourcesGroups: DropdownData[] = [];
      let newLaunchSourcesTypes: DropdownData[] = [];
      let newNations: DropdownData[] = [];
      let newAffiliates: DropdownData[] = [];
      let newGenders: DropdownData[] = [];
      let newCareers: DropdownData[] = [];
      let newPackages: DropdownData[] = [];
      let newcs_schedule_type: DropdownData[] = [];
      let newDoctorOnline: DropdownData[] = [];
      let newGroupTask: DropdownData[] = [];
      let newEmployeeTeams: DropdownData[] = [];
      let newTags: TransferType[] = [];
      let newTagsMultiSelect: DropdownData[] = [];
      let ListTagPhareTranfer: TransferType[] = [];
      let listPharesBeforeExams: DropdownData[] = [];
      let listServiceConverted: ServiceGroup[] = [];
      let listEndoscopics: DropdownData[] = [];
      let listCSKH: GroupRadioType[] = [];
      let colors = ["#28a745", "#17a2b8", "#dc3545", "#20c997", "#333"];
      let listServicesAllowGroup: any[] = [];
      

export const SoftPhoneContext = createContext<SoftPhoneProvider>({} as SoftPhoneProvider);
type TypeConnectSK = "connected" | "disconnect";
const PublicLayout: React.FC<PublicLayoutProps> = ({
  children = undefined,
  widthScreen,
  isLoadings,
  isShowPopupChat = false,
  isShowPopupTelephone = false,
}) => {
  const dispatch = useAppDispatch();
  const navigators = useNavigate();

  const { connect, register, makeCall, transfer, hangupCall, AcceptCall, setExternalNumber, stateCall, externalNumber, stateConnect, handleSetStateConnect, handleSetStateCall, handleSetCustomerName } = useSip();
  const configAgent = localStorage.getItem('user_call_agent');
  const storeListPage = useAppSelector((state) => state.pancake.respListPage);

  // const [configTele, setcConfigTele] = useState<UserCallAgent>(configAgent ? JSON.parse(configAgent) as unknown as UserCallAgent : undefined as any);
  const [configTele, setcConfigTele] = useState<UserCallAgent>(undefined as any);
  const [loadingPage, setLoading] = useState<boolean>(true);
  const checkToken = Cookies.get("token");
  const getFullName = Cookies.get("fullname");
  const storageDms = localStorage.getItem('dms');
  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [isOpenModalSearch, setIsOpenModalSearch] = useState(false);
  const [collapsedSider, setCollapsedSider] = useState<boolean>(true);
  const [stateDms, setstateDms] = useState<string>(storageDms ? JSON.parse(storageDms) : null);
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);


  // Lắng nghe sự kiện lấy kích cỡ màn hình màn hình
  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, []);
  function isDataChanged(newData: any, oldData: any) {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
}

// Hàm cập nhật localStorage khi có socket trả về
function updateLocalStorageIfChanged(newGenders:any,nameLS:any) {
    // Lấy dữ liệu từ localStorage
    const storageGenders =JSON.parse(localStorage.getItem(nameLS) || "[]");

    // Kiểm tra nếu dữ liệu thay đổi thì cập nhật
    if (isDataChanged(newGenders, storageGenders)) {
        localStorage.setItem(nameLS, JSON.stringify(newGenders));
        console.log("LocalStorage đã được cập nhật!");
    } else {
        console.log("Dữ liệu không thay đổi, không cập nhật LocalStorage.");
    }
  }
  function updateLocalStorageIfChangedO(newData: any, nameLS: string) {
    // Lấy dữ liệu từ localStorage, mặc định là object thay vì array
    const storedData = JSON.parse(localStorage.getItem(nameLS) || "{}");

    // Kiểm tra nếu dữ liệu thay đổi thì cập nhật
    if (isDataChanged(newData, storedData)) {
        localStorage.setItem(nameLS, JSON.stringify(newData));
        console.log(`LocalStorage "${nameLS}" đã được cập nhật!`);
    } else {
        console.log(`Dữ liệu không thay đổi, không cập nhật LocalStorage "${nameLS}".`);
    }
  }
  function updateLocalStorageIfChangedS(newData: any, nameLS: string) {
    // Lấy dữ liệu từ localStorage, mặc định là object thay vì array
    const storedData = JSON.parse(localStorage.getItem(nameLS) || "");

    // Kiểm tra nếu dữ liệu thay đổi thì cập nhật
    if (isDataChanged(newData, storedData)) {
        localStorage.setItem(nameLS, JSON.stringify(newData));
        console.log(`LocalStorage "${nameLS}" đã được cập nhật!`);
    } else {
        console.log(`Dữ liệu không thay đổi, không cập nhật LocalStorage "${nameLS}".`);
    }
}
  const [infoCommingPhone, setInfoCommingPhone] = useState({
    nameCustomer: "",
    type: "",
    launch_source: "",
  });

  useEffect(() => {
  
    // nếu mà dữ liệu phía server trả về mà trong listRoles có role_name nào mà là BOD thì return luôn
    if (listRoles && listRoles?.some((i: any) => i?.role_name === 'BOD')) return;
    // tiếp k return tiếp tục kiểm tra điều kiện listRoles và configTele có undefind không
    if (listRoles && !_.isUndefined(configTele)) {
      const configCall = {
        authorizationPassword: configTele?.phone_agent_password,
        authorizationUsername: configTele?.phone_agent,
        displayName: configTele?.display_phone_agent,
        domain: configTele?.sip_realm,
        protocolSip: configTele?.phone_server_type,
        sipPort: configTele?.phone_server_port,
        serverUrl: configTele?.sip_ws_url,
      }
      // truyền object được khởi tạo ở trên vào vào connect để set up cuộc gọi của thu viện SIP
      connect(configCall as any);
      // ở đây sẽ là đăng ký dịch vụ của SIP
      register();
    }
  }, [configAgent]);

  useEffect(() => {
    if (!externalNumber?.trim()) return;
    const timeout = setTimeout(() => {
      getCustomerByPhone(externalNumber);
    }, Number(Math.random() * 3) * 1000)
    return () => clearTimeout(timeout);
  }, [externalNumber]);


  const { mutate: getCustomerByPhone } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerWhenCallIn(data),
    {
      onSuccess: (data: any) => {
        const { name, launch_source, type, phonenumber } = data;
        setInfoCommingPhone({
          ...infoCommingPhone,
          nameCustomer: name !== 'unkown' ? name : phonenumber,
          type: type,
          launch_source: launch_source?.name,
        });
        handleSetCustomerName(name)
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );
  // call API lấy gói dịch vụ
  const { mutate: getPackageWithItems } = useMutation(
    "post-footer-form",
    () => getPackagesDetail(),
    {
      onSuccess: (data: any) => {
        localStorage.setItem('packagesItems', JSON.stringify(data?.data));
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );

const { mutate: getIdTypeCustomMutate } = useMutation(
  "post-footer-form",
  getIdTypeCustom, // Đảm bảo hàm đã có kiểu
  {
    onSuccess: (data: any) => {
      localStorage.setItem('listIdTypeCustom', JSON.stringify(data?.data));
    },
    onError: (error) => {
      console.log("🚀: error --> getCustomerByCustomerId:", error);
    },
  }
);

  /* End handle connect server sip.js */

  // Hàm getUserMedia này sử dụng API getUserMedia của trình duyệt để yêu cầu quyền truy cập vào thiết bị âm thanh (microphone) của người dùng
  // const getUserMedia = async () => {
  //   try {
  //     navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  //       .then((stream) => {// Xử lý stream audio ở đây
  //       })
  //       .catch((error) => { // Xử lý lỗi nếu không thể truy cập thiết bị âm thanh
  //         return;
  //       });
  //   } catch (error) {    // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gọi getUserMedia

  //     return;
  //   }
  // };



  useEffect(() => {
    if (loadingPage) {
      const timeOut = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [loadingPage]);

  useLayoutEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "5457254141009176",
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });

      window.FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
      let js;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      (js as HTMLScriptElement).src =
        "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    getUserMedia();
    if (localStorage.getItem("setResource") === "1") {
      getPackageWithItems();
      getIdTypeCustomMutate();
      localStorage.setItem("setResource", "2");
      toast.success(
        <Typography
          content={`Đăng nhập thành công <br/> Xin chào ${getFullName}!`}
          modifiers={["400"]}
        />
      );

      // lấy data để đổ vào select box trang sau khi khám : Đã khám xong, tầm soát, chưa liên lạc được,...
      dispatch(getInitAfterExams() as unknown as AnyAction);
    }

    // nếu stateDms không có giá trị thì sẽ thực thi code
    if (!stateDms) {
      // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập
   dispatch(getListResourceCRM());
    }
    if (!stateDms) {
      // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập
   dispatch(getListServiceWItems());
    }
    if (
      localStorage.getItem("setResource") === "2" &&
      window.location.pathname === "/"
    ) {
      sessionStorage.setItem("indexMenu", "0");
      navigators("/");
    }
    if (
      localStorage.getItem("setResource") === "2" &&
      window.location.pathname === "/monitor"
    ) {
      navigators("/monitor");
    }
  

    // nếu storeListPage.categorized có giá trị là null or undefind thì nó sẽ trả về true
    if (!storeListPage.categorized) {
      dispatch(getListPageWithPancake({}));
    }

  }, []);
  // kiếm tra có token hay không, không có token thì chuyển hướng đến pending và sau đó có sự kiện F5 để load lại trang => chuyển về trang login
  useEffect(() => {
   
    if (!checkToken) {
      window.history.pushState(null, "", "/pending");
      window.location.reload();
    }
  }, []);
  // Đây là action kết nối FB ở trên thanh header
  // const handleLogin = () => {
  //   window.FB.login((response: any) => {
  //     if (response.authResponse) {
  //       const userAccessToken = response.authResponse.accessToken;
  //       window.FB.api(`/me?fields=id,name,accounts&access_token=${userAccessToken}`, { access_token: userAccessToken }, (resp: any) => {
  //         console.log("🚀 ~ file: index.tsx:242 ~ window.FB.api ~ resp:", resp)
  //       });
  //     } else {
  //       console.log("Login cancelled");
  //     }
  //   });
  // };
    const OptionUser = [
    { id: 1, label: 'Trang cá nhân', value: '/profile', handleClick: () => { } },
    // { id: 2, label: 'Kết nối Facebook', value: '/facebook', handleClick: () => { if (handleLogin) handleLogin() } },
    { id: 3, label: 'đăng xuât', value: '/logout', handleClick: () => { } },
  ];
    const username = useAppSelector((state) => state.home.shortName);
    const [name, setName] = useState(username);
     const [lastname, setLastName] = useState('');

  const getName = Cookies.get('fullname');
  const getUsername = Cookies.get('username');
  const getLastname = Cookies.get('lastname');
   useEffect(() => {
    
    if (getName) {
      setName(getName);
    } else {
      setName(username);
    }
    if (getLastname) {
      setLastName(getLastname);
    } else {
      setName(Cookies.get('lastname') || '');
    }
   }, [username, getLastname]);
  const wsUrl = SOCKET_URL_CHART;
  const employeeId = localStorage.getItem("employee_id");
  const [title,setTitle] = useState<string | JSX.Element>("Hello World!");
    const [stateConnect1, setStateConnect] = useState<TypeConnectSK>("disconnect");
   useEffect(() => {
      const socket = new W3CWebSocket.w3cwebsocket(wsUrl, "echo-protocol");
      socket.onopen = () => {
        setStateConnect("connected");
      };
      socket.onclose = () => {
        setStateConnect("disconnect");
      };
     
      socket.onmessage = (message: any) => {
        try {
          const data = JSON.parse(message.data);
           console.log(data)
          if (data.app_key === "crm" || data.app_key === "cs") {
         
         
                console.log(data)

                if (data.is_show_message) {
                  if (data.is_show_popup) {
                    if (employeeId === data.owner_id && data.is_private === true) {
                      setTitle(data.title)
                      setIsOpenModalSearch(true)
                    } else {
                      setTitle(data.title)
                      setIsOpenModalSearch(true)
                    }
                  } else { 
                     if (employeeId === data.owner_id && data.is_private === true) {
                  // toast.success(data.message);
                  console.log(123)
                    } else {
                       //  toast.success(data.message);
                       console.log(123)
                    }
                  }
                }
                if (data.key === "updateLocalStorage") {
                   // genders
              newGenders = []
              !!data?.data?.genders?.length &&
              data?.data?.genders.map((item:any, index:any) => {
              const convertStages = {
                id: index + 1,
                label: item.gender_name,
                value: item.gender_id,
              };
              newGenders.push(convertStages as unknown as DropdownData);
            });
          !!data?.data?.genders?.length &&     updateLocalStorageIfChanged(newGenders, "genders")
              // careers
              newCareers = []
              !!data?.data?.careers?.length &&
              data?.data?.careers.map((item:any, index:any) => {
              const convertStages = {
                id: index + 1,
                 label: item.career_name,
            value: item.career_id,
              };
              newCareers.push(convertStages as unknown as DropdownData);
              });
            !!data?.data?.careers?.length &&   updateLocalStorageIfChanged(newCareers, "careers")
                 // nations
              newNations = []
              !!data?.data?.nations?.length &&
              data?.data?.nations.map((item:any, index:any) => {
              const convertStages = {
                id: index + 1,
                 label: item.nation_name,
            value: item.nation_id,
              };
              newNations.push(convertStages as unknown as DropdownData);
              });
               !!data?.data?.nations?.length && updateLocalStorageIfChanged(newNations, "nations")
               // launch_source_groups
              newLaunchSourcesGroups = []
              !!data?.data?.launch_source_groups?.length &&
              data?.data?.launch_source_groups.map((item:any, index:any) => {
              const convertStages = {
                  id: item.launch_source_group_id,
            label: item.launch_source_group_displayname,
            value: item.launch_source_group_id,
              };
              newLaunchSourcesGroups.push(convertStages as unknown as DropdownData);
              });
            !!data?.data?.launch_source_groups?.length &&    updateLocalStorageIfChanged(newLaunchSourcesGroups, "launchSourcesGroups")
                // launch_source_groups
              newLaunchSourcesGroups = []
              !!data?.data?.launch_source_groups?.length &&
              data?.data?.launch_source_groups.map((item:any, index:any) => {
              const convertStages = {
                  id: item.launch_source_group_id,
            label: item.launch_source_group_displayname,
            value: item.launch_source_group_id,
              };
              newLaunchSourcesGroups.push(convertStages as unknown as DropdownData);
              });
           !!data?.data?.launch_source_groups?.length &&     updateLocalStorageIfChanged(newLaunchSourcesGroups, "launchSourcesGroups")
                // launch_sources
              newLaunchSources = []
              !!data?.data?.launch_sources?.length &&
              data?.data?.launch_sources.map((item:any, index:any) => {
              const convertStages = {
                        id: item.launch_source_id,
                        label: item.launch_source_name,
                        value: item.launch_source_id,
              };
              newLaunchSources.push(convertStages as unknown as DropdownData);
              });
            !!data?.data?.launch_sources?.length &&    updateLocalStorageIfChanged(newLaunchSources, "launchSources")
              // launch_source_types
              newLaunchSourcesTypes = []
              !!data?.data?.launch_source_types?.length &&
              data?.data?.launch_source_types.map((item:any, index:any) => {
              const convertStages = {
                        id: item.launch_source_type_id,
            label: item.launch_source_type_name,
            value: item.launch_source_type_id,
              };
              newLaunchSourcesTypes.push(convertStages as unknown as DropdownData);
              });
           !!data?.data?.launch_source_types?.length &&     updateLocalStorageIfChanged(newLaunchSourcesTypes, "launchSourcesTypes")
               // task_types
              newGroupTask = []
              !!data?.data?.task_types?.length &&
              data?.data?.task_types.map((item:any, index:any) => {
              const convertStages = {
                       id: index + 1,
            label: item.task_type_name,
            value: item.task_type_id,
              };
              newGroupTask.push(convertStages as unknown as DropdownData);
              });
           !!data?.data?.task_types?.length &&    updateLocalStorageIfChanged(newGroupTask, "groupTask")
               // stages
              listPharesBeforeExams = []
              !!data?.data?.stages?.length &&
              data?.data?.stages.map((item:any, index:any) => {
             const convertStages = {
            id: item.stage_id,
            label: item.stage_name,
            value: item.stage_id,
          };
          if (item?.type === "before") {
            listPharesBeforeExams.push(
              convertStages as unknown as DropdownData
            );
          }
              });
         !!data?.data?.stages?.length &&     updateLocalStorageIfChanged(listPharesBeforeExams, "listPharesBeforeExams")
              // employees 1
              newDoctorOnline = []
              !!data?.data?.employees?.length &&
              data?.data?.employees.map((item:any, index:any) => {
           const convertStages = {
            id: index + 1,
            label: item.employee_signature_name,
            value: item.employee_id,
          };
          if (item.employee_team_id === "BSKNTH") {
            newDoctorOnline.push(convertStages as unknown as DropdownData);
          }
              });
           !!data?.data?.employees?.length &&     updateLocalStorageIfChanged(newDoctorOnline, "doctorOnline")
               // employees 2
              listCSKH = []
              !!data?.data?.employees?.length &&
              data?.data?.employees.map((item:any, index:any) => {
             const convertStages = {
            id: item?.employee_id,
            label: item?.employee_signature_name,
            value: item.employee_id,
            employee_type: item.employee_type,
            color: colors[1],
            employee_team_id: item?.employee_team_id,
            erp_code: item?.erp_code,
            erp_type: item?.erp_type,
          };

          if (item.employee_team_id === "CSKH") {
            listCSKH.push(convertStages as unknown as GroupRadioType);
          }
              });
        !!data?.data?.employees?.length &&       updateLocalStorageIfChanged(listCSKH, "listCSKH")

                 // employee_teams
              newEmployeeTeams = []
              !!data?.data?.employee_teams?.length &&
              data?.data?.employee_teams.map((item:any, index:any) => {
              const convertStages = {
            id: index + 1,
            label: item.employee_team_name,
            value: item.employee_team_id,
          };
              newEmployeeTeams.push(convertStages as unknown as DropdownData);
              });
             !!data?.data?.employee_teams?.length &&   updateLocalStorageIfChanged(newEmployeeTeams, "employeeTeams")
                // appointment_types
              newAppointmentTypes = []
              !!data?.data?.appointment_types?.length &&
              data?.data?.appointment_types.map((item:any, index:any) => {
              const newItem = {
            id: item.service_id,
            label: item.service_name,
            value: item.appointment_type,
            color: colors[index],
            department_id: item.department_id,
            is_register_package: item.is_register_package,
            is_register_subclinical: item.is_register_subclinical,
            is_exams: item.is_exams,
            register_type_id: item.register_type_id,
            index: item.index

          };
          newAppointmentTypes.push(newItem as unknown as GroupRadioType);
              });
            !!data?.data?.appointment_types?.length &&   updateLocalStorageIfChanged(newAppointmentTypes, "appointment_types")
                // appointment_services
              listEndoscopics = []
              !!data?.data?.appointment_services?.length &&
              data?.data?.appointment_services.map((item:any, index:any) => {
             const newItem = {
            id: item.service_id,
            label: `${
              item.service_displayname
            }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
            value: item.policy_key,
            policy_key: item.policy_key,
            is_used: item.is_used,
          };
          if (item.appointment_type === "endoscopics" && item.is_used) {
            listEndoscopics.push(newItem as unknown as DropdownData);
          }
              });
          !!data?.data?.appointment_services?.length &&      updateLocalStorageIfChanged(listEndoscopics, "endoscopics")
                 // packages
              newPackages = []
              !!data?.data?.appointment_services?.length &&
              data?.data?.appointment_services.map((item:any, index:any) => {
             const convertStages = {
            id: item.service_id,
            label: `${
              item.service_displayname
            }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
            value: item.service_id,
            policy_key: item.policy_key,
          };
          if (item.appointment_type === "package" && item.is_used) {
            newPackages.push(convertStages as unknown as DropdownData);
          }
              });
           !!data?.data?.appointment_services?.length &&    updateLocalStorageIfChanged(newPackages, "packages")
                        // services
              listServicesAllowGroup = []
              !!data?.data?.services?.length &&
              data?.data?.services.map((item:any, index:any) => {
                    const checkGroupIsExit = listServicesAllowGroup.find(
              (i) => i.service_group_id === item.service_group_id
            );

            const newGroup = {
              service_group_id: item.service_group_id,
              service_group_name: item.service_group_name,
              service_group_item: [
                {
                  ...item,
                  id: item.service_id,
                  label: item.service_name,
                  value: item.service_id,
                },
              ],
            };

            if (checkGroupIsExit) {
              checkGroupIsExit.service_group_item.push({
                ...item,
                id: item.service_id,
                label: item.service_name,
                value: item.service_id,
              } as any);
            } else {
              listServicesAllowGroup.push(newGroup as any);
            }
              });
             !!data?.data?.services?.length &&   updateLocalStorageIfChanged(listServicesAllowGroup, "listServicesAllowGroup")
               // packages
              newPackages = []
              !!data?.data?.appointment_services?.length &&
              data?.data?.appointment_services.map((item:any, index:any) => {
             const convertStages = {
            id: item.service_id,
            label: `${
              item.service_displayname
            }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
            value: item.service_id,
            policy_key: item.policy_key,
          };
          if (item.appointment_type === "package" && item.is_used) {
            newPackages.push(convertStages as unknown as DropdownData);
          }
              });
           !!data?.data?.appointment_services?.length &&    updateLocalStorageIfChanged(newPackages, "packages")
                  // affiliates
              newAffiliates = []
              !!data?.data?.affiliates?.length &&
              data?.data?.affiliates.map((item:any, index:any) => {
             const convertStages = {
            id: item.affiliate_id,
            label: item.display_name,
            value: item.affiliate_id,
            affiliate_code: item.affiliate_code,
            affiliate_type: item.affiliate_type,
            launch_source_id: item.launch_source_id,
          };
          newAffiliates.push(convertStages as unknown as DropdownData);
              });
             !!data?.data?.affiliates?.length &&    updateLocalStorageIfChanged(newAffiliates, "affiliates")
                   // tags
              ListTagPhareTranfer = []
              !!data?.data?.tags?.length &&
              data?.data?.tags.map((item:any, index:any) => {
           const existingGroup = newTags.find(
            (group) => group.groupId === item.tag_group
          );
          const existingGroupPhare = ListTagPhareTranfer.find(
            (group) => group.groupId === item.tag_group
          );
          const convertedTag = {
            tag_id: item.tag_id,
            tag_name: item.tag_name,
            tag_group: item.tag_group,
            tag_group_name: item.tag_group_name,
            tag_color: item.tag_color,
            order_number: item.order_number,
          };
          if (existingGroup) {
            existingGroup.child.push(convertedTag as any);
          } else {
            const newGroup: TransferType = {
              groupId: item.tag_group,
              tagGroupName: item.tag_group_name,
              child: [convertedTag as any],
            };
            if (item.tag_group !== "htkh") {
              newTags.push(newGroup);
            }
          }
          if (existingGroupPhare) {
            existingGroupPhare.child.push(convertedTag as any);
          } else {
            const newGroup: TransferType = {
              groupId: item.tag_group,
              tagGroupName: item.tag_group_name,
              child: [convertedTag as any],
            };
            if (item.tag_group === "htkh") {
              ListTagPhareTranfer.push(newGroup);
            }
          }
              });
          !!data?.data?.tags?.length &&    updateLocalStorageIfChanged(ListTagPhareTranfer, "ListTagPhareTranfer")
               // vouchers
              newVouchersTypes = []
              !!data?.data?.vouchers?.length &&
              data?.data?.vouchers.map((item:any, index:any) => {
             if (index === 0) {
               const newItem = {
            
            id: null,
            label: "Không chọn mã giảm giá",
            valueV: null,
            value: "noValue",
          

          };
            newVouchersTypes.push(newItem as unknown as DropdownData);
          }
          const newItem = {
            
            id: item.voucher_code,
            label: item.voucher_name,
            valueV: item.voucher_value,
            value: item.voucher_code,
          

          };
          newVouchersTypes.push(newItem as unknown as DropdownData);
              });
           !!data?.data?.vouchers?.length &&    updateLocalStorageIfChanged(newVouchersTypes, "voucher_types")
               // tags
              newTagsMultiSelect = []
              !!data?.data?.tags?.length &&
              data?.data?.tags.map((item:any, index:any) => {
                      const newTagMultiSelect: DropdownData = {
            id: item?.tag_id,
            label: item?.tag_name,
            value: item?.tag_id,
          };

          if (item?.tag_group !== "htkh") {
            newTagsMultiSelect.push(newTagMultiSelect as DropdownData);
          }
              });
              !!data?.data?.tags?.length && updateLocalStorageIfChanged(newTagsMultiSelect, "tags_dropdown")
               // services
              listServiceConverted = []
              !!data?.data?.services?.length &&
              data?.data?.services.map((item:any, index:any) => {
                 const existingGroup = listServiceConverted.find(
            (group) => group.service_group_id === item.service_group_id
          );

          if (existingGroup) {
            existingGroup?.children?.push(item as any);
          } else {
            const newGroupService = {
              service_group_id: item.service_group_id,
              service_group_name: item.service_group_name,
              service_group_type: item.service_group_type,
              children: [item],
            };
            listServiceConverted.push(newGroupService);
          }
              });
              !!data?.data?.services?.length && updateLocalStorageIfChanged(listServiceConverted, "services")
              
                // schedule_types
              newcs_schedule_type = []
              !!data?.data?.cs_schedule_type?.length &&
              data?.data?.cs_schedule_type.map((item:any, index:any) => {
                    const convertStages = {
            id: item.id,
            name:  item.name,
            task_title: item.task_title,
            task_content: item.task_content,
            task_execute_day: item.task_execute_day,
            next_task_id: item.next_task_id,
            sequence: item.sequence,
            label: item.name,
            value:item.id
          };
          newcs_schedule_type.push(convertStages as unknown as DropdownData);
              });
              !!data?.data?.cs_schedule_type?.length && updateLocalStorageIfChanged(newcs_schedule_type, "schedule_types")
                }
        
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
  return (
    <div>
     <div style={{position:"absolute", top:"6px",right:"6px", zIndex:1000, fontSize:"14px"}}><UserDropdown optionsChild={OptionUser} name={getName} iconLogo={logoActive} /></div> 
      <Layout>
        <div className="t-layouts">
          {checkToken && (
            <Spin
              spinning={loadingPage}
              size="large"
              indicator={
                <img
                  className="loader"
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: 'cover',
                    backgroundColor: 'transparent',
                  }}
                  src={logo}
                />
              } >
              {/* Thanh header */}
              <HeaderNav
                handleClickMenuItem={() => {
                  setLoading(true);
                }}
                // có nghĩa là khi mà truyền 1 số nhỏ hơn 1280 thì nó sẽ là true thì thực hiện 1 số tác vụ
                isSortHeader={Number(stateBreakPoint) <= 1280}
                 // có nghĩa là khi mà truyền 1 số để thực hiện login code bên thanh header
                currentWidth={Number(stateBreakPoint)}
                handleLogin={handleLogin}
                handleClickLogo={() => {
                  if (stateBreakPoint > 1280) {
                    navigators('/conversion');
                    sessionStorage.setItem('indexMenu', `2`)
                  } else {
                    setCollapsedSider(!collapsedSider)
                  }
                }}
              />
              {/* Đây là thanh SideNav kế bên   */}
              <div className="t-layouts_wrapper">
                {
                  stateBreakPoint > 1280 &&
                  <SideNav widthNav={220} navCollapsed={collapsedSider} handleClickTelephone={() => {
                    handleSetStateConnect('dial');
                  }}
                    handleHoverSideNav={(value: boolean) => setCollapsedSider(value)}
                  />
                }
                <main className="t-layouts_main">
                  <SoftPhoneContext.Provider value={{
                    handleOpenDial: (value) => {
                      handleSetStateConnect(value)
                    },
                  }}>
                    {children}
                  </SoftPhoneContext.Provider>
                </main>
              </div>
            </Spin>
          )}
        </div>
      </Layout >
      {
        // Khi mà chiều dài màn hình nhỏ hơn 1280 thì CDrawer sẽ hiện ra ( nó là cái thanh SideNav), nó được mở khi bấm vào biểu logo Công ty
        stateBreakPoint <= 1280 &&
        <CDrawer
          isOpen={!collapsedSider}
          className="customize-menu-mobile"
          widths={260}
          positon="left"
          handleOnClose={() => {
            setCollapsedSider(!collapsedSider);
            }}

          >
            {/* MenuItem là menu phụ kia mà responsive */}
          <div className="t-layouts_menu_mobile">
            <MenuItem optionMenu={MenuCRMMobile as ItemMenu[]} handleClickItem={() => {
            }} />
          </div>
        </CDrawer>
      }

      {/* Đoạn code này là thư viện hiển thị cái điện thoại */}
      <div
        className={mapModifiers("t-layouts_wrapper_telephone-show",)}
      >
        <Telephone
          handleAccept={() => { AcceptCall(); }}
          handleHangUp={() => { hangupCall(); setExternalNumber(undefined as any); handleSetStateCall('none') }}
          customerNameRinging={infoCommingPhone.nameCustomer}
          customerInfo={`${infoCommingPhone.type === "customer" ? "Đã đặt lịch" : "Chưa đặt lịch"}`}
          phone={externalNumber}
          isOpen={!_.isUndefined('')}
          handleClosePhone={() => { handleSetStateConnect('connecting'); }}
          handleClickToCall={(val: string) => { makeCall(val); }}
          handleTranferToCall={(val: string) => { transfer(val, 'BLIND'); }}
          handleCallOutGoing={(phone: string) => {
            handleSetStateConnect('connected');
            handleSetStateCall('callout');
            makeCall(phone);
          }}
          stateCall={stateCall}
          stateConnect={stateConnect}
        />
      </div>
      <CModal
        isOpen={isOpenModalSearch}
        textOK="Đã đọc!"
        onOk={() => setIsOpenModalSearch(false)}
        widths={580}
        isHideCancel
       
        title={(
          <>
            <div className="t-header_modal_heading">
              <span>Thông báo</span>
            </div>
          </>
        )}
      >
        <div className={mapModifiers('t-header_search')} style={{maxHeight:"500px",overflowY:"scroll"}}>
    
          <div dangerouslySetInnerHTML={{ __html: typeof title === "string" ? title : "" }} />

        </div>
      </CModal>
    </div >
  );
};

// PublicLayout.defaultProps = {
//   children: undefined,
//   isShowPopupChat: false,
//   isShowPopupTelephone: false,
// };

export default PublicLayout;