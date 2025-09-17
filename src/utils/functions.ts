/* eslint-disable no-param-reassign */
/* eslint-disable no-dupe-else-if */
/* eslint-disable no-useless-escape */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-bitwise */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { message } from "antd";
import { DropdownData } from "components/atoms/Dropdown";
import _ from "lodash";
import moment from "moment";
import addNotification from "react-push-notification";
import { AlertType } from "services/api/Example/types";
import { Messagetype } from "services/types";
import * as XLSX from "xlsx";

export type ThemesNotify = "darkblue" | "red" | "light";

/* eslint-disable consistent-return */

/* eslint-disable max-len */
// Hàm mapModifiers giúp bạn tạo ra một chuỗi class name cho CSS bằng cách kết hợp một tên class
//   cơ bản với các modifier được chỉ định.Điều này rất hữu ích trong việc tạo các class name động 
//   cho các phần tử giao diện trong các ứng dụng web, đặc biệt là khi sử dụng các phương pháp CSS như BEM(Block Element Modifier).
function mapModifiers(
  baseClassName: string,
  ...modifiers: (string | string[] | false | undefined)[]
): string {
  return modifiers
    .reduce<string[]>(
      (acc, m) => (!m ? acc : [...acc, ...(typeof m === "string" ? [m] : m)]),
      []
    )
    .map((m) => `-${m}`)
    .reduce<string>(
      (classNames, suffix) => `${classNames} ${baseClassName}${suffix}`,
      baseClassName
    );
}

export const isArray = (value: string | any[], minLength: any) =>
  Array.isArray(value) &&
  (minLength
    ? value.length >= (typeof minLength === "number" ? minLength : 1)
    : true);

export const BASE_URL = process.env.REACT_APP_BASE_URL;

export default mapModifiers;

/*!
 * Scroll down to next block element
 */
export function scrollDownNextSection(ref: React.RefObject<HTMLDivElement>) {
  if (ref && ref.current) {
    window.scrollTo({ behavior: "smooth", top: ref.current.offsetTop - 68 }); // Minus header height
  }
}

/*!
 * getMousePosition(event) - cross browser normalizing of:
 * clientX, clientY, screenX, screenY, offsetX, offsetY, pageX, pageY
 * HTMLElement
 */
export function getMousePosition(
  evt:
    | React.MouseEvent<SVGPathElement, MouseEvent>
    | React.MouseEvent<SVGRectElement, MouseEvent>,
  item: HTMLDivElement
) {
  let { pageX } = evt;
  let { pageY } = evt;
  if (pageX === undefined) {
    pageX =
      evt.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    pageY =
      evt.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  const rect = item.getBoundingClientRect();
  const offsetX = evt.clientX - rect.left;
  const offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX, y: offsetY }, // relative to the event target
    page: { x: pageX, y: pageY }, // relative to the html document
  };
}

export function getDimensions(ele: HTMLDivElement) {
  const { height } = ele.getBoundingClientRect();
  const { offsetTop } = ele;
  const offsetBottom = offsetTop + height;

  return {
    height,
    offsetTop,
    offsetBottom,
  };
}

export function scrollStop(callback: (value: any) => void, time = 2000) {
  // Make sure a valid callback was provided
  if (!callback || typeof callback !== "function") return;

  // Setup scrolling variable
  let isScrolling: any;

  // Listen for scroll events
  window.addEventListener(
    "scroll",
    () => {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(callback, time);
    },
    false
  );
}

export const formatDateDDMMYYYY = (date?: string, unitDot?: boolean) => {
  if (!date) return "";
  const dateFormat = new Date(date);
  let day: string | number = dateFormat.getDate();
  let month: string | number = dateFormat.getMonth() + 1;
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }

  if (unitDot) return `${day}.${month}.${dateFormat.getFullYear()}`;
  return `${day}/${month}/${dateFormat.getFullYear()}`;
};

export const lengthMinutes = (minutes: Date) => {
  if (minutes.getMinutes().toString().length === 1) {
    return "00";
  }
  return "30";
};
export const handleScrollCenter = (
  ref: React.RefObject<HTMLDivElement | HTMLUListElement | null>,
  classNameEleActive: string
) => {
  const eleScroll = ref.current;
  const eleActive = eleScroll && eleScroll.querySelector(classNameEleActive);
  if (!eleActive || !eleScroll) return;
  // get width element scroll
  const widthEleScroll = eleScroll.getBoundingClientRect().width;
  // get distance element scroll compared to y window
  const xEleScroll = eleScroll.getBoundingClientRect().x;
  // get width element active
  const widthEleActive = eleActive.getBoundingClientRect().width;
  // get distance element active compared to y window
  const xEleActive = eleActive.getBoundingClientRect().x;
  // get position sroll bar
  const positionScroll = eleScroll.scrollLeft;
  const scrollX =
    xEleActive -
    xEleScroll +
    widthEleActive / 2 +
    positionScroll -
    widthEleScroll / 2;
  eleScroll.scroll({
    left: scrollX,
    behavior: "smooth",
  });
};

export function getImageURL(imgUrl?: string) {
  if (!imgUrl) return "";
  return imgUrl;
}

export const RenderDateToWeek = (
  currDate: number,
  currMonth: number,
  currYear: number
) => new Date(currYear, currMonth, currDate);

export const showNotification = (
  title: string,
  subTile: string,
  duration: number,
  handleClick: () => void
) => {
  const notification = new Notification(title, {
    body: subTile,
    silent: false,
  });
  notification.addEventListener("click", () => {
    handleClick();
    notification.close();
  });
  setTimeout(() => {
    notification.close();
  }, duration * 1000);
};

export const pushNotifications = (
  title: string,
  message: string,
  handleClick?: () => void
) => {
  addNotification({
    title,
    message,
    subtitle: "",
    duration: 5000,
    theme: "light",
    onClick: () => handleClick,
  });
};

export const parseCustomerPortrait = (type: any, data: any, dataForm: any) => {
  const {
    customerIllness,
    symptoms,
    medicalHistory,
    pastMedicalHistory,
    time,
    treatmentElsewhere,
    endoscopy,
    typeEndoscopy,
    resultEndoscopy,
    expectations,
    recentEndoscopy,
    other,
    serviceExperience,
    regularCheckups,
    lastCheckup,
    consultation,
    sedatedEndoscopy,
    takeMedication,
    medicationInstructions,
    documentBeforeEndoscopy,
    documentRoadmap,
    symptomsRecently,
    bh,
    bh_where,
    resultConsultation,
  } = data;
  switch (type) {
    case "CSTH":
      return {
        q1: "Xác nhận thông tin hành chính:",
        q1_fullname_text: dataForm?.name,
        q1_gender_text: dataForm.gender?.label,
        q1_yob_text: moment(dataForm?.dayOfBirth).format("YYYY"),
        q1_phone_text: dataForm?.phoneNumber,
        q2: "Bệnh lý của {{PREFIX_NAME}}?",
        q2_dd: customerIllness?.some((i: any) => i === "daday"),
        q2_dt: customerIllness?.some((i: any) => i === "daitrang"),
        q2_dtt: customerIllness?.some((i: any) => i === "daitt"),
        q3: "Triệu chứng của {{PREFIX_NAME}}?",
        q3_tc_text: symptoms,
        q4: "Tiền sử bệnh của {{PREFIX_NAME}}?",
        q4_tsb_text: medicalHistory,
        q5: "Bệnh sử của {{PREFIX_NAME}}?",
        q5_bs_text: pastMedicalHistory,
        q6: "{{PREFIX_NAME}} đã bị bao lâu rồi",
        q6_time_text: time,
        q7: "{{PREFIX_NAME}} đã từng điều trị ở đâu chưa?",
        q7_time_text: treatmentElsewhere,
        q8: "{{PREFIX_NAME}} đã từng nội soi chưa?",
        q8_ns_yes: endoscopy?.id === 2 ? true : false,
        q8_ns_no: endoscopy?.id === 2 ? false : true,
        q8_1: "Loại nội soi {{PREFIX_NAME}} đã thực hiện:",
        q8_1_nsddt: typeEndoscopy?.some((i: any) => i === "dtt"),
        q8_1_nsddm: typeEndoscopy?.some((i: any) => i === "dtm"),
        q8_1_nsdtt: typeEndoscopy?.some((i: any) => i === "ddt"),
        q8_1_nsdtm: typeEndoscopy?.some((i: any) => i === "ddm"),
        q8_1_nsct: typeEndoscopy?.some((i: any) => i === "nsct"),
        q8_1_nscm: typeEndoscopy?.some((i: any) => i === "nscm"),
        q8_2: "Lần nội soi gần nhất",
        q8_2_time_text: recentEndoscopy,
        q8_3: " {{PREFIX_NAME}}, Hiệu quả của lần khám trước như thế nào?",
        q8_3_khb_yesno: resultEndoscopy?.id === 1 ? true : false,
        q8_3_tp_yesno: resultEndoscopy?.id === 2 ? true : false,
        q8_4: "Kết quả của lần nội soi gần nhất",
        q8_4_time_text: resultConsultation,
        q9: "Mong muốn của {{PREFIX_NAME}}:",
        q9_time_text: expectations,
        q10: "Thông tin khác",
        q10_text: other,
        q11: "{{PREFIX_NAME}} có sử dụng BHYT hay BHTN không?",
        q11_no: bh?.value === "1" ? true : false,
        q11_bhyt: bh?.value === "2" ? true : false,
        q11_bhtn: bh?.value === "3" ? true : false,
        q12: `{{PREFIX_NAME}} đăng ký Bảo Hiểm ở đâu`,
        q12_text: bh_where,
      };

    case "CSKTQ":
      return {
        q1: "Xác nhận thông tin hành chính:",
        q1_fullname_text: dataForm?.name,
        q1_gender_text: dataForm.gender?.label,
        q1_yob_text: moment(dataForm?.dayOfBirth).format("YYYY"),
        q1_phone_text: dataForm?.phoneNumber,
        q2: "{{PREFIX_NAME}} đã từng trải nghiệm dịch vụ khám tổng quát ở cơ sở y tế nào chưa?",
        q2_tn_yes: serviceExperience?.value === "chua" ? false : true,
        q2_tn_no: serviceExperience?.value === "chua" ? true : false,
        q3: "{{PREFIX_NAME}} có hay đi khám định kỳ không?",
        q3_kdk_yes: regularCheckups?.value === "no" ? false : true,
        q3_kdk_no: regularCheckups?.value === "no" ? true : false,
        q4: "Lần khám trước cách đây bao lâu?",
        q4_tsb_text: lastCheckup,
        q5: "Tiền sử bệnh của {{PREFIX_NAME}}?",
        q5_time_text: medicalHistory,
        q6: "Bệnh sử của {{PREFIX_NAME}}?",
        q6_time_text: pastMedicalHistory,
        q7: "{{PREFIX_NAME}} có triệu chứng bất thường gần đây không?",
        q7_time_text: symptomsRecently,
        q8: "Thông tin khác",
        q8_text: other,
        q9: "{{PREFIX_NAME}} có sử dụng BHYT hay BHTN không?",
        q9_no: bh?.value === "1" ? true : false,
        q9_bhyt: bh?.value === "2" ? true : false,
        q9_bhtn: bh?.value === "3" ? true : false,
        q10: "{{PREFIX_NAME}} đăng ký Bảo Hiểm ở đâu",
        q10_text: bh_where,
      };

    case "CSBSCD":
      return {
        q1: "Xác nhận thông tin hành chính:",
        q1_fullname_text: dataForm?.name,
        q1_gender_text: dataForm.gender?.label,
        q1_yob_text: moment(dataForm?.dayOfBirth).format("YYYY"),
        q1_phone_text: dataForm?.phoneNumber,
        q2: "{{PREFIX_NAME}} đã được Bác sĩ {{BS}} gặp mặt để thăm khám chưa?",
        q2_tk_yes: consultation?.value === "yes" ? true : false,
        q2_tk_no: consultation?.value === "yes" ? false : true,
        q3: "Bác sĩ {{BS}} đã tư vấn và chỉ định cho {{PREFIX_NAME}} đến Doctor Check để thực hiện dịch vụ sau có đúng không?",
        q3_nsddt: typeEndoscopy?.some((i: any) => i === "dtt"),
        q3_nsddm: typeEndoscopy?.some((i: any) => i === "dtm"),
        q3_nsdtt: typeEndoscopy?.some((i: any) => i === "ddt"),
        q3_nsdtm: typeEndoscopy?.some((i: any) => i === "ddm"),
        q3_nsct: typeEndoscopy?.some((i: any) => i === "nsct"),
        q3_nscm: typeEndoscopy?.some((i: any) => i === "nscm"),
        q4: "Bác sĩ {{BS}} tư vấn cho {{PREFIX_NAME}} uống thuốc xổ tại nhà hay uống thuốc xổ tại Phòng khám ạ?",
        q4_tn_yes: takeMedication?.value === "tainha" ? true : false,
        q4_tpk_no: takeMedication?.value === "taiphongkham" ? true : false,
        q4_unknow_no: takeMedication?.value === "khongbiet" ? true : false,
        q5: "{{PREFIX_NAME}} đã có tài liệu hướng dẫn uống thuốc xổ chưa?",
        q5_tl_yes: medicationInstructions?.value === "yes" ? true : false,
        q5_tl_no: medicationInstructions?.value === "yes" ? false : true,
        q6: "Mấy giờ {{PREFIX_NAME}} đến Phòng khám? (Lưu ý cho {{PREFIX_NAME}} đến sớm để kịp uống thuốc xổ nếu có NS đại tràng)",
        q6_time_text: moment(time).format("DD-MM-YYYY HH:mm"),
        q7: "Lời dặn nhịn ăn, uống trước khi lấy máu xét nghiệm, nội soi.",
        q7_time_text:
          documentBeforeEndoscopy?.value === "yes" ? "Đã dặn" : "Chưa dặn dò",
        q8: "Hướng dẫn {{PREFIX_NAME}} đường đi tới Phòng khám?",
        q8_time_text:
          documentRoadmap?.value === "yes"
            ? "Đã chỉ đường đến phòng khám"
            : "Chưa chỉ đường đến phòng khám",
        q9: "Thông tin khác",
        q9_text: other,
      };
  }
};

export const hanldeConvertListCustomer = (id: string) => {
  const newList: DropdownData[] = [];
  const getList = JSON.parse(localStorage.getItem("list_users") || "");
  if (getList) {
    getList.map((i: any, index: any) => {
   
      const newItem = {
        id: index + 1,
        label: i?.label,
        value: i?.u_id,
      };
      if (i?.employee_team_id === id) {
        newList.push(newItem);
      }
    });
  } else {
    (JSON.parse(localStorage.getItem("list_users") || "") || [])?.map(
      (i: any, index: any) => {
      
        const newItem = {
          id: index + 1,
          label: i?.label,
          value: i?.u_id,
        };
        if (i?.employee_team_id === id) {
          newList.push(newItem);
        }
      }
    );
  }
  return newList;
};
export const hanldeConvertListTask = (id: string) => {
  console.log(id)
  const newList: DropdownData[] = [];
  const getList = JSON.parse(localStorage.getItem("taskTexts") || "");
  if (getList) {
    getList.map((i: any, index: any) => {
   
      const newItem = {
        id: index + 1,
        label: i?.label,
        value: i?.value,
        task_type_id: i?.task_type_id
      };
      console.log(i?.task_type_id,id)
      if (i?.task_type_id === id) {
        newList.push(newItem);
      }
    });
  } else {
    (JSON.parse(localStorage.getItem("taskTexts") || "") || [])?.map(
      (i: any, index: any) => {
      
        const newItem = {
          id: index + 1,
          label: i?.label,
          value: i?.u_id,
           task_type_id: i?.task_type_id
        };
           console.log(i?.task_type_id,id)
        if (i?.task_type_id === id) {
          newList.push(newItem);
        }
      }
    );
  }
  return newList;
};
export const hanldeConvertListCustomer2 = (id: string): DropdownData[] => {
  const newList: DropdownData[] = [];
  const rawList = localStorage.getItem("list_users");
console.log(id,rawList)
  if (!rawList) return newList;
  console.log(newList)
  try {
    const getList = JSON.parse(rawList);
     console.log(1)
    if (!Array.isArray(getList)) return newList;
    console.log(getList)
    getList.forEach((item: any, index: number) => {
      const teamIds: string[] = item?.signatures || [];
      console.log(teamIds)
      if (Array.isArray(teamIds) && teamIds.includes(id)) {
        console.log(item)
        newList.push({
          id: index + 1,
          label: item?.signature_name || item?.label,
          value: item?.u_id || item?.value,
        });
      }
    });
  } catch (error) {
    console.error("Error parsing list_users:", error);
  }
  console.log(newList)
  return newList;
};

export const handleAddIndex = (data: any) => {
  if (!data?.length) return data;
  const newData =
    data?.length &&
    data?.map((item: any, index: any) => ({
      index: Number(index + 1),
      ...item,
    }));

  return newData;
};

export const handleRenderGUID = () =>
  "00-0-4-1-000".replace(/[^-]/g, (s: any) =>
    (((Math.random() + ~~s) * 0x10000) >> s).toString(16).padStart(4, "0")
  );

export const handleConvertDataBooking = (data: any[]) => {
  const groupedData: { [id: string]: any } = {};
  console.log(data)
  data?.forEach((item) => {
    if (!groupedData[item.id]) {
      groupedData[item.id] = {
        id: item.id,
        time_range: item.time_range,
        valueTime: moment(item?.appointment_command_datetime).format(
          `YYYY-MM-DDT${item?.time_range?.slice(8)}`
        ),
        slotLeft: item?.appointment_slot_limit,
        child: item?.master_id ? [item] : null,
      };
    } else {
      !!item?.master_id && groupedData[item.id].child.push(item);
    }
  });
  return Object.values(groupedData);
};

export const downloadBlobPDF = (base64Data: any, fileName: string) => {
  // Chuyển đổi base64 thành mảng byte
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Tạo một blob từ mảng byte
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Tạo URL cho blob và tạo một liên kết tải xuống
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  // Thêm liên kết vào DOM và kích hoạt sự kiện nhấp chuột
  document.body.appendChild(link);
  link.click();

  // Giải phóng tài nguyên sau khi tải xuống hoàn tất
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadBlobPDFOpenLink = (base64Data: any, fileName: string) => {
  // Chuyển đổi base64 thành mảng byte
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Tạo một blob từ mảng byte
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Tạo URL cho blob và tạo một liên kết tải xuống
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  window.open(url);

  // Thêm liên kết vào DOM và kích hoạt sự kiện nhấp chuột
  document.body.appendChild(link);
  link.click();

  // Giải phóng tài nguyên sau khi tải xuống hoàn tất
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
// Function In PDF
export const previewBlobPDFOpenLink = (base64Data: any, fileName: string) => {

  // Chuyển đổi base64 thành mảng byte
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Tạo một blob từ mảng byte
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Tạo URL cho blob và tạo một liên kết tải xuống
  const url = URL.createObjectURL(blob);
  window.open(url);
};

export const AlertNofitys = (type: AlertType, notify: string) => {
  switch (type) {
    case "success":
      return message.success(notify);
    case "info":
      return message.info(notify);
    case "warning":
      return message.warning(notify);
    case "error":
      return message.error(notify);
  }
};

export const downloadBlobTXT = (base64Data: any, fileName: string) => {
  // Chuyển đổi base64 thành chuỗi văn bản
  const textData = atob(base64Data);

  // Chuyển đổi chuỗi văn bản thành mảng byte
  const byteNumbers = new Array(textData.length);
  for (let i = 0; i < textData.length; i++) {
    byteNumbers[i] = textData.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Tạo một blob từ mảng byte
  const blob = new Blob([byteArray], { type: "text/plain" });

  // Tạo URL cho blob và tạo một liên kết tải xuống
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  // Thêm liên kết vào DOM và kích hoạt sự kiện nhấp chuột
  document.body.appendChild(link);
  link.click();

  // Giải phóng tài nguyên sau khi tải xuống hoàn tất
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const handleConverFileToBase64 = (file: any) => {
  const result = {
    name: file?.name,
    ext: file?.type?.split("/").pop(),
    blob: "",
  };
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const base64Data = e.target.result;
      result.blob = base64Data?.split(",")[1];
    };

    reader.readAsDataURL(file);
  }
  return result;
};

export const enterFullScreen = () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
};

// Hàm để thoát khỏi chế độ full màn hình
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const handleConvertToTimeZoneZ = (utcTimeString: any) => {
  const padZero = (number: any) => {
    return (number < 10 ? "0" : "") + number;
  };

  const utcDate = new Date(utcTimeString);

  utcDate.setHours(utcDate.getHours() + 7);

  const year = utcDate.getFullYear();
  const month = utcDate.getMonth() + 1;
  const day = utcDate.getDate();
  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();
  const seconds = utcDate.getSeconds();

  const convertedTimeString =
    year +
    "-" +
    padZero(month) +
    "-" +
    padZero(day) +
    "T" +
    padZero(hours) +
    ":" +
    padZero(minutes) +
    ":" +
    padZero(seconds) +
    ".000000";

  return convertedTimeString;
};
export const messageNoti = (type: Messagetype, mess: string) => {
  const [messageApi, contextHolder] = message.useMessage();

  return messageApi.open({
    type: type,
    content: mess,
  });
};

export const copyClipboard = (text: string, callBack?: () => void) => {
  const tempElement = document.createElement("textarea");
  tempElement.value = text;

  // Thêm thẻ tạm thời vào DOM
  document.body.appendChild(tempElement);

  // Chọn và sao chép nội dung vào Clipboard
  tempElement.select();
  document.execCommand("copy");
  if (callBack) callBack();

  // Loại bỏ thẻ tạm thời khỏi DOM
  document.body.removeChild(tempElement);
};
export const removeVietnameseAccents = (str: string): string => {
  return str
    .normalize("NFD") // Chuẩn hóa Unicode để tách dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .split(" ") // Tách thành mảng từ
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Viết hoa chữ cái đầu
    .join(""); // Ghép lại thành một chuỗi
};
export const getFormattedDate = (): string => {
  const now = new Date();
  const day = now.getDate(); // Lấy ngày
  const month = now.getMonth() + 1; // Lấy tháng (JS tính từ 0)
  const year = now.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm

  const dayFormatted = day < 10 ? day.toString() : day.toString().padStart(2, "0");

  return month === 1 ? `${dayFormatted}${year}` : `${dayFormatted}${month}${year}`;
};
export const exportDatatoExcel = (
  data: any[],
  columnHeaders: string[],
  filename: string,
  tableName: string
) => {
  try {
    const combinedData = [
      columnHeaders,
      ...data.map((item) => Object.values(item)),
    ];
    const ws = XLSX.utils.aoa_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tableName);
    XLSX.writeFile(wb, filename + ".xlsx");
  } catch (error) {
    console.error("Lỗi khi tạo tệp Excel:", error);
  }
};

export function numberToWords(number: any) {
  const ones = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "mười",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const thousands = ["", "nghìn", "triệu", "tỷ"];

  function convertThreeDigits(num: any) {
    if (num === 0) return "";
    if (num < 10) return ones[num];
    if (num < 20) return "mười " + ones[num - 10];
    const digitOne = num % 10;
    const digitTen = Math.floor(num / 10);
    return tens[digitTen] + (ones[digitOne] ? " " + ones[digitOne] : "");
  }

  const numGroups = [];
  while (number > 0) {
    numGroups.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  const words = [];
  for (let i = 0; i < numGroups.length; i++) {
    const word = convertThreeDigits(numGroups[i]);
    if (word !== "") {
      words.push(word + " " + thousands[i]);
    }
  }

  return words.length ? words.reverse().join(" ") : "không";
}

export const convertRangeDateToList = (
  startDate: Date,
  endDate: Date
): string[] => {
  const tempListData: string[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    // Format the current date to 'yyyy-mm-dd'
    const formattedDate =
      currentDate.getFullYear().toString() +
      "-" +
      (currentDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      currentDate.getDate().toString().padStart(2, "0");
    tempListData.push(formattedDate);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tempListData;
};

export const processString = (input: string): string => {
  // Bước 1: Loại bỏ dấu ngoặc kép ở đầu và cuối chuỗi
  const withoutOuterQuotes = input.slice(1, -1);

  // Bước 2: Loại bỏ các ký tự HTML entities (ví dụ: "&lt;", "&gt;")
  const withoutEntities = withoutOuterQuotes.replace(
    /&[a-z]+;|&#[0-9]+;/gi,
    ""
  );

  // Bước 3: Loại bỏ các khoảng trắng ở đầu và cuối chuỗi
  const trimmedString = withoutEntities.trim();

  return trimmedString;
};
