import { DropdownData } from "components/atoms/Dropdown";

export const MenuCRMMobile = [
  
      {
        id: 1,
        name: "Chuyển đổi",
        icon: "conversion",
        slug: "/conversion",
        role: ["beforeExams", "adDashBoard", "normal"],
        child: [],
    isHaveChild: false,
        
    cIcon: `<svg width="201px" height="201px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
       
   

];

export const MenuCRM = [
  {
    groupId: "1",
    groupName: "Quy trình",
    items: [
      // {
      //   id: 1,
      //   name: "Khách hàng tiềm năng",
      //   icon: "conversion",
      //   slug: "/conversion",
      //   role: ["beforeExams", "adDashBoard", "normal"],
      //   child: [],
      //   isHaveChild: false,
      //   cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
      // },
      {
        id: 2,
        name: "Khách hàng",
        icon: "person_crm2",
        slug: "/list-customer",
        role: ["beforeExams", "adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
      {
        id: 3,
       name: "Đặt lịch theo khung giờ",
        icon: "list_appointment",
        slug: "/grid-booking",
        role: ["beforeExams", "adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
       {
        id: 111,
        name: "Danh sách lịch hẹn",
        icon: "calendar_crm",
        slug: "/track-booking",
        role: ["appointmentView", "adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
      },
        {
        id: 116,
        name: "Chăm sóc khách hàng",
        icon: "before_exams",
        slug: "/after-medical-task",
        role: ["afterExams", "BOD"],
        child: [],
        isHaveChild: false,
      },
        {
        id: 117,
        name: "Nhắc tầm soát lại",
        icon: "histories_call",
        slug: "/call-re-examination",
     role: ["afterExams", "BOD"],
        child: [],
        isHaveChild: false,
      },
      // {
      //   id: 4,
      //   name: "Đối tác",
      //   icon: "list_schedule",
      //   slug: "/conversion",
      //   role: ["beforeExams", "adDashBoard", "normal"],
      //   child: [],
      //   isHaveChild: false,
      //   cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      // },
      // {
      //   id: 5,
      //   name: "Lịch trực",
      //   icon: "list_appointment",
      //   slug: "/conversion",
      //   role: ["beforeExams", "adDashBoard", "normal"],
      //   child: [],
      //   isHaveChild: false,
      //   cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      // },
      // {
      //   id: 6,
      //   name: "Tài liệu hướng dẫn",
      //   icon: "marketing_crm",
      //   slug: "/user-guids",
      //   role: ["beforeExams", "adDashBoard", "normal"],
      //   child: [],
      //   isHaveChild: false,
      //   cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      // },
       {
        id: 2,
        name: "Phân loại khách hàng",
        icon: "person_crm2",
        slug: "/customer-on-day-view",
        role: ["adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
        {
    id: 7,
    name: "Thống kê",
          icon: "report_crm",
               role: ["beforeExams", "adDashBoard", "normal"],
               slug: "",
    child: [
 
          {
            idChild: 1,
            type: "customer",
            title: "Thống kê khách hàng",
            slug: "/reports?type=grid",
        role: ["adDashBoard"],
           
           
      },
        // {
        //      idChild: 2,
        //      type: "customer",
        //      title: "Khách hàng khám trong ngày",
        //      slug: "/customer-on-day-view",
        //  role: ["adDashBoard"],
           
           
        //    },
      //     {
      //       id:10,
      //       type: "customer",
      //       name: "Khách hàng tiềm năng",
      //       slug: "/customer-leads",
      //       role: ["campaign"],
      //         icon: "person_crm2",
      //         child: [],
      //   isHaveChild: false,
      //     },
      //     {
      //       id: 11,
      //       type: "customer",
      //       name: "Khách hàng F1, F2, F3",
      //       slug: "/customer-f-type",
      //       role: ["campaign"],
      //         icon: "person_crm2",
      //         child: [],
      //   isHaveChild: false,
      // },
      //      {
      //       id: 12,
      //       type: "cskh",
      //       name: "Khách hàng giới thiệu",
      //       slug: "/customer-wom",
      //        role: ["campaign"],
      //        icon: "person_crm2",
      //         child: [],
      //   isHaveChild: false,
      //     },
          ],
    isHaveChild: true,
      },
  
      {
        id: 8,
        name: "Dashboard",
        icon: "report_crm2",
        slug: "/dashboard-marketing",
        role: ["adDashBoardMarketing"],
        child: [
             {
               idChild: 1,
               title: "Dashboard Marketing",
               slug: "/dashboard-marketing",
               role: ["beforeExams", "adDashBoard", "normal"],
             },
             {
               idChild: 2,
               title: "Dashboard doanh thu",
               slug: "/dashboard",
               role: ["beforeExams", "adDashBoard", "normal"],
          },
              {
               idChild: 3,
               title: "Dashboard Sales",
               slug: "/add-dashboard-sales",
               role: ["beforeExams", "adDashBoard", "normal"],
             },
           ],
        isHaveChild: true,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
 {
        id: 9,
        name: "Lịch sử cuộc gọi",
        icon: "histories_call",
        slug: "/histories-call",
        role: ["beforeExams", "adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
      
      {
        id: 10,
        name: "Cấu hình",
        icon: "setting_crm",
        slug: "/setting",
        role: ["beforeExams", "adDashBoard", "normal"],
        child: [],
        isHaveChild: false,
        cIcon: `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17.5C16.722 18.188 16.1226 18.8 15.2878 19.2483C14.453 19.6966 13.4256 19.9581 12.3529 19.9954C11.2801 20.0327 10.2172 19.8438 9.31626 19.4558C8.41537 19.0679 7.38496 18.165 7 17.5M7 17.5V19.1667M7 17.5H8.66667M7 7.5C7.27802 6.81196 7.87739 6.19996 8.7122 5.75169C9.54701 5.30342 10.5744 5.0419 11.6471 5.00462C12.7199 4.96735 13.7828 5.15622 14.6837 5.54417C15.5846 5.93212 16.615 6.835 17 7.5M17 7.5V5.83333M17 7.5H15.3333M10.5098 13.3333H13.4902C13.7583 13.3333 13.8923 13.3333 14.0122 13.3525C14.4271 13.419 14.7859 13.6526 14.987 13.9871C15.045 14.0837 15.0874 14.1986 15.1722 14.4282C15.2741 14.7042 15.325 14.8422 15.3319 14.9535C15.3562 15.3461 15.0732 15.7007 14.6531 15.804C14.534 15.8333 14.373 15.8333 14.0509 15.8333H9.94913C9.62702 15.8333 9.46597 15.8333 9.3469 15.804C8.92677 15.7007 8.64382 15.3461 8.66812 14.9535C8.675 14.8422 8.72593 14.7042 8.82779 14.4282C8.91256 14.1986 8.95495 14.0837 9.01303 13.9871C9.21405 13.6526 9.57287 13.419 9.98781 13.3525C10.1077 13.3333 10.2417 13.3333 10.5098 13.3333ZM13.6667 10C13.6667 10.9205 12.9205 11.6667 12 11.6667C11.0795 11.6667 10.3333 10.9205 10.3333 10C10.3333 9.07953 11.0795 8.33333 12 8.33333C12.9205 8.33333 13.6667 9.07953 13.6667 10Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

      },
      
    ],
  },
  
];

export const optionStateExchangeGift: DropdownData[] = [
  { id: 6, label: "Tất cả", value: "all" },
  { id: 8, label: "Đã đổi quà", value: "exchange" },
  { id: 8, label: "Chưa đổi quà", value: "unExchange" },
];
export const optionStateTypeAfterTask: DropdownData[] = [
  { id: 1, label: "Chăm sóc sau 1 ngày", value: "n1" },
  { id: 2, label: "Chăm sóc sau 1 tuần", value: "n7" },
  { id: 3, label: "Chăm sóc khi KH uống hết thuốc", value: "ndrug" },
  { id: 4, label: "Chăm sóc trước tái khám 1 ngày", value: "nreexam" },
  { id: 5, label: "Chăm sóc sau 2 tháng", value: "n60" },
  { id: 6, label: "Chăm sóc sau 5 tháng", value: "n150" },
  { id: 7, label: "Chăm sóc sau 6 tháng", value: "n180" },
  { id: 8, label: "Chăm sóc sau 1 năm", value: "n360" },
];
export const optionStateStatusAfterTask: DropdownData[] = [
  { id: 6, label: "Tất cả", value: "all" },
  { id: 8, label: "Chưa liên hệ", value: "new" },
  { id: 8, label: "Đang thực hiện", value: "inprogress" },
  { id: 8, label: "Dời lại", value: "delay" },
  { id: 8, label: "Hoàn thành", value: "done" },
  { id: 8, label: "Hủy", value: "canceled" },
]
export const optionStateStatusAfterTask2: DropdownData[] = [
  { id: 8, label: "Chưa liên hệ", value: "new" },
  { id: 8, label: "Đang thực hiện", value: "inprogress" },
  { id: 8, label: "Dời lại", value: "delay" },
  { id: 8, label: "Hoàn thành", value: "done" },
  { id: 8, label: "Hủy", value: "canceled" },
]
export const historiesCallStatus: DropdownData[] = [
  { id: 6, label: "Không bắt máy", value: "NO ANSWER" },
  { id: 6, label: "Trả lời", value: "ANSWERED" },
  { id: 6, label: "Bận", value: "BUSY" },
];

// export const stateAppointView = [
//   { id: 6, label: "Dịch vụ mới", value: "new_service" },
//   { id: 6, label: "Khách hàng mới", value: "new" },
//   { id: 6, label: "Khách hàng cũ", value: "old" },
// ];
export const stateAppointView = [
  { id: 6, label: "F1", value: "F1" },
  { id: 6, label: "F2", value: "F2" },
  { id: 6, label: "F3", value: "F3" },
];

export const localeVN = {
  lang: {
    locale: "vi_VN",
    yearPlaceholder: "Chọn năm",
    quarterPlaceholder: "Chọn quý",
    monthPlaceholder: "Chọn tháng",
    weekPlaceholder: "Chọn tuần",
    rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
    rangeYearPlaceholder: ["Năm bắt đầu", "Năm kết thúc"],
    rangeQuarterPlaceholder: ["Quý bắt đầu", "Quý kết thúc"],
    rangeMonthPlaceholder: ["Tháng bắt đầu", "Tháng kết thúc"],
    rangeWeekPlaceholder: ["Tuần bắt đầu", "Tuần kết thúc"],
    today: "Hôm nay",
    now: "Bây giờ",
    backToToday: "Back to today",
    ok: "Lưu",
    clear: "Xóa",
    month: "Tháng",
    year: "Năm",
    timeSelect: "Chọn thời gian",
    dateSelect: "Chọn ngày",
    weekSelect: "Chọn tuần",
    monthSelect: "Chọn tháng",
    yearSelect: "Chọn năm",
    decadeSelect: "Chọn thập kỷ",
    yearFormat: "YYYY",
    dateFormat: "DD-MM-YYYY",
    dayFormat: "DD",
    dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
    monthBeforeYear: true,
    previousMonth: "Tháng trước (PageUp)",
    nextMonth: "Tháng sau (PageDown)",
    previousYear: "Năm trước (Control + left)",
    nextYear: "Năm sau (Control + right)",
    previousDecade: "Thập kỷ trước",
    nextDecade: "Thập kỷ sau",
    previousCentury: "Thế kỷ trước",
    nextCentury: "Thế kỷ sau",
    shortWeekDays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    shortMonths: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
  },
  timePickerLocale: {
    placeholder: "Chọn thời gian",
    rangePlaceholder: ["Bắt đầu", "Kết thúc"],
  },
  dateFormat: "DD-MM-YYYY",
  dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
  weekFormat: "wo-YYYY",
  monthFormat: "MM-YYYY",
};

export const dataExampleSMS = {
  data: [
    {
      campaign_id: 1,
      campaign_name: "Thử nghiệm 1",
      is_active: false,
    },
    {
      campaign_id: 2,
      campaign_name: "Chiến dịch gửi tin nhắn thông báo điểm",
      is_active: false,
    },
    {
      campaign_id: 3,
      campaign_name: "Chiến dịch 30/4 - 01/05",
      is_active: false,
    },
    {
      campaign_id: 4,
      campaign_name:
        "Chiến dịch chăm sóc cho khách hàng thường xuyên thăm khám",
      is_active: false,
    },
    {
      campaign_id: 5,
      campaign_name: "100KH F2",
      is_active: true,
    },
    {
      campaign_id: 6,
      campaign_name: "F2 - 296 KH năm 2023 - 15/05/2024",
      is_active: true,
    },
    {
      campaign_id: 7,
      campaign_name: "F2 - 1437 KH - 1/1/2024 --> 15/5/2024 - 15/05/2024",
      is_active: true,
    },
  ],
  message: "Danh sách chiến dịch hiện có",
  status: true,
  client_ip: "192.168.15.103",
};

export const relationshipAvatar = [
  {
    relation_type_id: 2,
    relationship_type_name: "Vợ Chồng",
    iconName: "",
  },
  {
    relation_type_id: 3,
    relationship_type_name: "Cha Mẹ",
    iconName: "",
  },
  {
    relation_type_id: 4,
    relationship_type_name: "Ông Bà",
    iconName: "",
  },
  {
    relation_type_id: 5,
    relationship_type_name: "Con",
    iconName: "",
  },
  {
    relation_type_id: 6,
    relationship_type_name: "Cháu",
    iconName: "",
  },
  {
    relation_type_id: 7,
    relationship_type_name: "Anh Chị Em",
    iconName: "",
  },
  {
    relation_type_id: 8,
    relationship_type_name: "Cô Chú Bác",
    iconName: "",
  },
  {
    relation_type_id: 9,
    relationship_type_name: "Bạn bè",
    iconName: "",
  },
];
