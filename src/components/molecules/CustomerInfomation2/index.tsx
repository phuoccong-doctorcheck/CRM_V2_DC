/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { message } from 'antd';
import { optionCancelBooking, optionsLevelNote } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CPopupConfirm from 'components/atoms/CPopupConfirm';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import DropdownButton from 'components/atoms/DropdownButton';
import DropdownButtonQue from 'components/atoms/DropdownButtonQue';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon, { IconName } from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Transfer, { TransferItemType, TransferType } from 'components/atoms/Transfer';
import Typography from 'components/atoms/Typography';
import CModal from 'components/organisms/CModal';
import { da } from 'date-fns/locale';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postPrintAppointmentServicepoint } from 'services/api/appointmentView';
import { postBookCustomerAPI, postObjectTag, postSaveCustomerBeforeExams, postUpdateCustomer } from 'services/api/beforeExams';
import { TagCustomer } from 'services/api/beforeExams/types';
import {
  getOTPCustomerById,
  postAPIConfirmBooking,
  postCallOutCustomer, postCanceledAppointment, postDelayAppointment, postGeneralUrl, postGeneralUrlCustomerInfo, postGeneralUrlResult, postRecoveryAppointment, postSurveyUrl
} from 'services/api/customerInfo';
import { getCustomerByKey } from 'services/api/dashboard';
import { getGroupSurveyPortrait, getInfosCustomerById, getListNotes } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { copyClipboard, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from 'utils/functions';

import FormAddCustomer from '../FormAddCustomer';
import FormBookingCustomer from '../FormBookingCustomer';
import FormUpdateBookingCustomer from '../FormUpdateBookingCustomer';
import FormUpdateCustomer from '../FormUpdateCustomer';

import iconAddTasB from "assets/iconButton/iconAddTagBlue.png"
import iconLK from "assets/iconButton/iconLK.png"
import iconPen from "assets/iconButton/iconPen.png"
import iconCall from "assets/iconButton/icon_call.png"
import iconOTP from "assets/iconButton/icon_otp.png"
import iconAddTag from "assets/iconButton/icons-add-tag.png"
import iconCallB from "assets/iconButton/icons-phone-blue.png"
import iconProfile from "assets/iconButton/icons-profile.png"
import iconQuestionB from "assets/iconButton/icons-question-blue.png"
import iconCanR from "assets/iconButton/icons8-cancel-red.png"
import iconCanW from "assets/iconButton/icons8-cancel-white.png"
import iconCallW from "assets/iconButton/icons8-phone-white.png"
import iconPrintO from "assets/iconButton/icons8-print-organge.png"
import iconPrintW from "assets/iconButton/icons8-print-white.png"
import iconQuestionW from "assets/iconButton/icons8-question-white.png"
import iconReG from "assets/iconButton/icons8-remove-green.png"
import iconReW from "assets/iconButton/icons8-remove-white.png"
import iconTagBl from "assets/iconButton/icons8-tag-black.png"
import iconTagW from "assets/iconButton/icons8-tag-white.png"
import iconUpdateG from "assets/iconButton/icons8-update-green.png"
import iconUpdateW from "assets/iconButton/icons8-update-white.png"
interface CustomerInformationProps {
  handleAddNote?: (data: any) => void;
  dataCustomerPortrait?: any;
  typeNoteCs?: string;
  type?: any;
  info?: any;
}

const CustomerInfomation2: React.FC<CustomerInformationProps> = ({
  handleAddNote, dataCustomerPortrait, typeNoteCs, type, info
}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpen, setIsOpen] = useState(false)
    const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const storageLaunchSourcesType = localStorage.getItem("launchSourcesTypes");
   const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
    const [stateLaunchSource, setstateLaunchSource] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);
    const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const infoCustomer = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const [dataCustomerInfos, setDataCustomerInfos] = useState(infoCustomer?.data);
  const storageTags = localStorage.getItem('tagsCustomer');
  const [listeTags, setListeTags] = useState<TransferType[]>(storageTags ? JSON.parse(storageTags || '') : undefined as any);
  const [formData, setFormData] = useState({
    id: infoCustomer?.data?.customer?.customer_id,
    master_id: infoCustomer?.data?.lastest_result_master_id,//
    name: infoCustomer?.data?.customer_fullname,
    gender: infoCustomer?.data?.customer?.gender?.name,
    dayOfBirth: infoCustomer?.data?.customer?.birthday,
    phoneNumber: infoCustomer?.data?.customer?.customer_phone.replace('+84-', '0'),
    customerId: infoCustomer?.data?.customer?.customer_identity_card,
    career: infoCustomer?.data?.customer?.career?.name,
    address: infoCustomer?.data?.customer?.customer_full_address,
    email: infoCustomer?.data?.customer?.customer_email,
    group: infoCustomer?.data?.customer_type,//
    originGroup: infoCustomer?.data?.launch_source_group?.name,
    originType: infoCustomer?.data?.launch_source_type?.name,
    origin: infoCustomer?.data?.launch_source?.name,
    isBooking: infoCustomer?.data?.is_has_booking,
    dateBooking:  infoCustomer?.data?.master?.appointment_date ,
    noteBooking: infoCustomer?.data?.master?.appointment_note,
    status: infoCustomer?.data?.master?.status || '',
    affiliateId: infoCustomer?.data?.launch_source_id,
    affiliateName: infoCustomer?.data?.affiliate_name ? infoCustomer?.data?.affiliate_name : '',
    affiliatePhone: infoCustomer?.data?.phone ? infoCustomer?.data?.phone : '',
    sales_employee_name: infoCustomer?.data?.sales_employee,
    master: infoCustomer?.data?.master,//
    allow_update_profile: infoCustomer?.data?.allow_update_profile,
    launch_source_group_id: infoCustomer?.data?.source_first?.launch_source_group_id,
     launch_source_id: infoCustomer?.data?.source_first?.launch_source_id,
     launch_source_type_id: infoCustomer?.data?.source_first?.launch_source_type_id,
  });
   const [isLoadingB, setIsLoadingB] = useState(false)
   const [isLoading,setIsLoading] = useState(false)
    const [listCustomerRelate, setListCustomerRelate] = useState<any[]>([])
  const [listTag, setListTag] = useState<TagCustomer[]>(dataCustomerInfos?.tags as any);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
    const [isUpdateBooking, setIsUpdateBooking] = useState(false);
  const [isCloseBookPopup, setIsCloseBookPopup] = useState(false);
  const [isAddTag, setIsAddTag] = useState(false);
  const [isSendQuestions, setSendQuestions] = useState(false);
  const [reschedule, setReschedule] = useState(false);
   const [isSendQuestions1, setSendQuestions1] = useState(false);
  const [reschedule1, setReschedule1] = useState(false);
  const [valueNote, setValueNote] = useState('');
  const [typeNote, setTypeNote] = useState<DropdownData>();
  const [isCanceled, setIsCanceled] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  const storeVisit = useAppSelector((state) => state.listVisit.listVisitItemMaster);
  const [stateDetallVisit, setStateDetailVisit] = useState(storeVisit);
  const [reschedule2, setReschedule2] = useState(false);
  const [isSendQuestions2, setSendQuestions2] = useState(false);
  const [stateIds, setStateIds] = useState("")
  console.log(stateDetallVisit)
    const [stateDataUpdateBooking, setStateDataUpdateBooking] = useState({})
  useEffect(() => {
    setStateIds(stateDetallVisit?.data?.servicepoint?.items.map((item: any) => item.service_id).join(","))
  }, [stateDetallVisit?.data?.servicepoint])
   useEffect(() => {
    setStateDataUpdateBooking(stateDetallVisit?.data?.master)
  },[stateDetallVisit])
  console.log(stateIds)
   useEffect(() => {
      setStateDetailVisit(storeVisit);
    },[storeVisit])
   const { mutate: getCustomerByPhones } = useMutation(
     'post-footer-form',
     (data: any) => getCustomerByKey(data),
     {
       onSuccess: (data) => {
         setListCustomerRelate(data);
       },
       onError: (error) => {
         console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
       },
     },
   );
   useLayoutEffect(() => {

     if (listCustomerRelate.length >= 1) return;
     if (type === 'phone') {
       getCustomerByPhones(info);
     }
     if (!_.isEmpty(infoCustomer?.data?.customer?.customer_phone) && type !== 'phone') {
       getCustomerByPhones(infoCustomer?.data?.customer?.customer_phone?.replace('+84-', '0'));
     }
   }, [type, infoCustomer?.data?.customer]);
  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
  const [valueServay, setValueServay] = useState('');
  const [valueDelay, setValueDelay] = useState({
    note: '',
    date: ''
  });

  const [isGetOTP, setIsGetOTP] = useState({
    open: false,
    data: ''
  });
  const [stateIB,setIB] = useState(false)
  const nameCS = Cookies.get('signature_name');
  useEffect(() => {
    setDataCustomerInfos(infoCustomer?.data)
    setListTag(infoCustomer?.data?.tags as any);
    setFormData({
      ...formData,
      id: infoCustomer?.data?.customer?.customer_id,
      name: infoCustomer?.data?.customer?.customer_fullname,
      gender: infoCustomer?.data?.customer?.gender?.name,
      dayOfBirth: infoCustomer?.data?.customer?.birthday,
      phoneNumber: infoCustomer?.data?.customer?.customer_phone?.replace('+84-', '0'),
      customerId: infoCustomer?.data?.customer?.customer_identity_card,
      career: infoCustomer?.data?.customer?.career?.name,
      address: infoCustomer?.data?.customer?.customer_full_address,
      email: infoCustomer?.data?.customer?.customer_email,
      group: infoCustomer?.data?.customer?.customer_type,
      originGroup: infoCustomer?.data?.customer?.launch_source_group?.name,
      originType: infoCustomer?.data?.customer?.launch_source_type?.name,
      origin: infoCustomer?.data?.customer?.launch_source?.name,
      isBooking: infoCustomer?.data?.customer?.is_has_booking,
      dateBooking: infoCustomer?.data?.customer?.is_has_booking? infoCustomer?.data?.master?.appointment_date : formData?.dateBooking,
      noteBooking: infoCustomer?.data?.customer?.is_has_booking ? infoCustomer?.data?.master?.appointment_note : formData?.noteBooking,
      status: infoCustomer?.data?.status || '',
      affiliateId: infoCustomer?.data?.customer?.launch_source_id,
      affiliateName: infoCustomer?.data?.affiliate_name,
      affiliatePhone: infoCustomer?.data?.phone,
        sales_employee_name: infoCustomer?.data?.sales_employee,
      master: infoCustomer?.data?.master,
      allow_update_profile: infoCustomer?.data?.allow_update_profile,
        launch_source_group_id: infoCustomer?.data?.source_first?.launch_source_group_id,
     launch_source_id: infoCustomer?.data?.source_first?.launch_source_id,
     launch_source_type_id: infoCustomer?.data?.source_first?.launch_source_type_id,

    });
  }, [infoCustomer]);
  useEffect(() => {
     
    if (infoCustomer?.data?.allow_update_profile === true && stateIB === true) {
      setIsOpen(true)
    }
  },[formData.allow_update_profile,stateIB,formData?.id,infoCustomer])
  const { mutate: postTagCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postObjectTag(data),
    {
      onSuccess: (data) => {
        setListTag(data?.data);
        dispatch(getInfosCustomerById({ customer_id: formData.id }));
        toast.success(data?.message);
        setIsAddTag(false);
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: postRestoreBooking } = useMutation(
    'post-footer-form',
    (data: any) => postRecoveryAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          dispatch(getListNotes({
            customer_id: formData.id,
            cs_node_type: typeNoteCs,
          }));
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: postDelayBooking } = useMutation(
    'post-footer-form',
    (data: any) => postDelayAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          dispatch(getListNotes({
            customer_id: formData.id,
            cs_node_type: typeNoteCs,
          }));
          setSendQuestions(false);
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: postCanceledBooking } = useMutation(
    'post-footer-form',
    (data: any) => postCanceledAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setIsCanceled(false);
          dispatch(getListNotes({
            customer_id: formData.id,
            cs_node_type: typeNoteCs,
          }));
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: getSurveyUrlForCustomerId } = useMutation(
    'post-footer-form',
    (data: any) => postSurveyUrl(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setValueServay(data?.data?.link);
          setReschedule(false);
          setSendQuestions(true);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: getGeneral } = useMutation(
    'post-footer-form',
    (data: any) => postGeneralUrl(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setValueServay(data?.data);
          setReschedule1(false);
          setSendQuestions1(true);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
    const { mutate: getGeneralIB } = useMutation(
    'post-footer-form',
    (data: any) => postGeneralUrl(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setValueServay(data?.data);
          setIB(true)
          setReschedule1(false);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: postCallOut } = useMutation(
    'post-footer-form',
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
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  const { mutate: printAppointmentServicepoint } = useMutation(
    "post-footer-form",
    (data: string) => postPrintAppointmentServicepoint(data),
    {
      onSuccess: (data) => {
        if (data.status) {
           setIsLoadingGetService(false);
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
  /* End Call API */

  // Cập nhật tags cho khách hàng
  const handleUpdateTag = async (data: TransferItemType[]) => {
    const newTag = data.map((i) => i.tag_id);
    const body = {
      object_id: formData.id,
      object_type: "customer",
      tag_ids: [...newTag]
    };
    await postTagCustomer(body);
  };
  // Hủy lịch
  const handleCanceledAppointment = async () => {
    if (!canceledReason.reason.trim()) {
      toast.error('Vui lòng nhập lí do khách hàng hủy khám');
    } else {
      await postCanceledBooking({
        master_id: stateDetallVisit.data.master?.master_id,
        canceled_reason: canceledReason.reason,
      });
    }
  };
  // Khôi phục lịch đã hủy
  const handleRestoreAppointment = async () => {
    await postRestoreBooking({ master_id: stateDetallVisit.data.master?.master_id });
  };
   console.log(stateDetallVisit)
  // Dời lịch đã đặt
  const handleDelayAppointment = async () => {
    const data = {
      master_id: stateDetallVisit.data.master?.master_id,
      master_note: valueDelay.note,
      appointment_date: moment(valueDelay.date).format('YYYY-MM-DDTHH:mm:03'),
    }
    if (!valueDelay.date.trim() && !valueDelay.note.trim()) return;
    await postDelayBooking(data);
  };
  // Gọi điện khách hàng
  const handleCallOutCustomer = async () => {
    await postCallOut({
      message: `${nameCS || Cookies.get('signature_name')} gọi ra cho khách hàng`,
      is_portal_redirect: false,
      customer_phone: formData.phoneNumber,
    });
  };
  const handleGetSurveyUrl = async (type: string) => {
    await getSurveyUrlForCustomerId({
      survey_type: type,
      customer_id: formData?.id,
      master_id: formData.master_id || formData.master.master_id,
    });
  };
  const handleGetGeneralUrl = async () => {
    await getGeneral({
      customer_id: formData?.id,
      master_id: formData.master_id || formData.master?.master_id,
    });
  };
  const handleGetGeneralUrlResult = async () => {
    await getGeneralResult({
     
    customer_id: formData?.id,
    });
  };
   
   const handleConfirmBooking = async () => {
    await postConfirmBooking({
     
    customer_id: formData?.id,
    });
  };
   const { mutate: getGeneralResult } = useMutation(
    'post-footer-form',
    (data: any) => postGeneralUrlResult(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
            dispatch(getListNotes({
          customer_id: formData.id
        }))
          setValueServay(data.data.data.content);
          setReschedule2(false);
          setSendQuestions2(true);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  
  const { mutate: postConfirmBooking } = useMutation(
    'post-footer-form',
    (data: any) => postAPIConfirmBooking(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message)
          
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
  
  const [isHovered, setIsHovered] = useState(false);
   const listBtnBooking = [
   
    {
      id: 1,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconUpdateG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconUpdateW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Cập nhật & Đặt lịch',
      handleClick: () => {
        setIsUpdateInfo(true);
        setDataCustomerInfos(dataCustomerInfos);
        dispatch(getGroupSurveyPortrait({ customerId: formData.id, servey_type: infoCustomer?.data?.customer?.portrait_survey_type }));
      },
    },
    {
      id: 2,
      loading: false,
      icon: '',
        buttonIcon: <img src={iconQuestionB} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconQuestionW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Gửi link sàng lọc trước khám',
      handleClick: () => {
      },
    },
   
   
    {
      id: 6,
      icon: '',
      loading: isLoadingGetService,
      name: 'In dịch vụ',
        buttonIcon: <img src={iconPrintO} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconPrintW} style={{width:"18px", marginRight:"5px"}}></img>,
      handleClick: () => {
        if (!stateDetallVisit.data.master?.master_id) {
          toast.info('Không tìm thấy thông tin phiếu khám');
        } else {
          setIsLoadingGetService(true);
          printAppointmentServicepoint(stateDetallVisit.data.master?.master_id);
        }
      },
    }
  ];
    const listBtnBookingAdd = [
   
    {
      id: 1,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconUpdateG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconUpdateW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Đặt lịch hẹn mới',
      handleClick: () => {
        setIsUpdateInfo(true);
        setDataCustomerInfos(dataCustomerInfos);
        dispatch(getGroupSurveyPortrait({ customerId: formData.id, servey_type: infoCustomer?.data?.customer?.portrait_survey_type }));
      },
    },
   
  ];
   const listBtnBookingUpdate = [
   
    {
      id: 1,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconUpdateG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconUpdateW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Cập nhật đặt lịch hẹn',
      handleClick: () => {
        setIsUpdateBooking(true);
        setDataCustomerInfos(dataCustomerInfos);
        dispatch(getGroupSurveyPortrait({ customerId: formData.id, servey_type: infoCustomer?.data?.customer?.portrait_survey_type }));
      },
    },
   
  ];
     const handleGetGeneralUrlCustomerInfo = async () => {
    await getGeneralCustomerInfo({
     
   master_id: stateDetallVisit.data.master?.master_id,
    });
  };
     const { mutate: getGeneralCustomerInfoB } = useMutation(
    'post-footer-form',
    (data: any) => postGeneralUrlCustomerInfo(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setValueServay(data.data);
          setReschedule2(false);
          // setSendQuestions2(true);
          setIB(true)
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
     const { mutate: getGeneralCustomerInfo } = useMutation(
    'post-footer-form',
    (data: any) => postGeneralUrlCustomerInfo(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setValueServay(data.data);
          setReschedule2(false);
          setSendQuestions2(true);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      }
    }
  );
    const listBtnSC = [
   
    {
      id: 9,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconProfile} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Gửi link bổ sung thông tin',
      handleClick: () => {
         handleGetGeneralUrlCustomerInfo()
      },
    },
    
   
  ];
  const listBtnR_C = [
   
    {
      id: 4,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconReG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Dời lịch',
      handleClick: () => {
        if (stateDetallVisit.data.master?.status === "new") {
          setReschedule(true); setSendQuestions(true);
          setValueDelay({ ...valueDelay, note: formData.noteBooking })
        } else {
          toast.error('Không tìm thấy thông tin đặt lịch')
        }
      },
    },
    {
      id: 5,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconCanR} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconCanW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: formData.status === 'canceled' ? 'Khôi phục lịch hẹn' : 'Hủy lịch',
      handleClick: () => {
        if (formData.status === 'canceled') {
          handleRestoreAppointment();
        } else {
          setIsCanceled(true);
        }
      },
    },
   
  ];
   const listBtnR = [
   
    {
      id: 9,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconProfile} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'SMS xem kết quả',
      handleClick: () => {
          handleGetGeneralUrlResult()
      },
    },
    
   
  ];
     const listBtnConfirmBooking = [
   
    {
      id: 9,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconProfile} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Gửi SMS xác nhận lịch hẹn',
      handleClick: () => {
          handleConfirmBooking()
      },
    },
    
   
  ];
    const listBtnL = [
   
    {
      id: 9,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconProfile} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Gửi link bổ sung thông tin',
      handleClick: () => {
          handleGetGeneralUrl()
      },
    },
    
   
  ];
  const listBtn = [
    {
      id: 0,
      loading: false,
      icon: '',
      buttonIcon: <img src={iconCallB} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconCallW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Gọi khách hàng',
      handleClick: () => { handleCallOutCustomer(); },
    },
    {
      id: 1,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconUpdateG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconUpdateW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Cập nhật & Đặt lịch',
      handleClick: () => {
        setIsUpdateInfo(true);
        setDataCustomerInfos(dataCustomerInfos);
        dispatch(getGroupSurveyPortrait({ customerId: formData.id, servey_type: infoCustomer?.data?.customer?.portrait_survey_type }));
      },
    },
    {
      id: 2,
      loading: false,
      icon: '',
        buttonIcon: <img src={iconQuestionB} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconQuestionW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Bộ câu hỏi khảo sát',
      handleClick: () => {
      },
    },
    {
      id: 3,
      icon: '',
      loading: false,
      name: 'Tag',
        buttonIcon: <img src={iconTagBl} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconTagW} style={{width:"18px", marginRight:"5px"}}></img>,
      handleClick: () => {
        setIsAddTag(true);
      },
    },
    {
      id: 4,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconReG} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconReW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: 'Dời lịch',
      handleClick: () => {
        if (dataCustomerInfos.is_has_booking) {
          setReschedule(true); setSendQuestions(true);
          setValueDelay({ ...valueDelay, note: formData.noteBooking })
        } else {
          toast.error('Không tìm thấy thông tin đặt lịch')
        }
      },
    },
    {
      id: 5,
      icon: '',
      loading: false,
        buttonIcon: <img src={iconCanR} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconCanW} style={{width:"18px", marginRight:"5px"}}></img>,
      name: formData.status === 'canceled' ? 'Khôi phục lịch hẹn' : 'Hủy lịch',
      handleClick: () => {
        if (formData.status === 'canceled') {
          handleRestoreAppointment();
        } else {
          setIsCanceled(true);
        }
      },
    },
    {
      id: 6,
      icon: '',
      loading: isLoadingGetService,
      name: 'In chỉ định',
        buttonIcon: <img src={iconPrintO} style={{width:"18px", marginRight:"5px"}}></img>,
      buttonIconH: <img src={iconPrintW} style={{width:"18px", marginRight:"5px"}}></img>,
      handleClick: () => {
        if (!stateDetallVisit.data.master?.master_id) {
          toast.info('Không tìm thấy thông tin phiếu khám');
        } else {
          setIsLoadingGetService(true);
          printAppointmentServicepoint(stateDetallVisit.data.master?.master_id);
        }
      },
    }
  ];

  const { mutate: postSaveCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postUpdateCustomer(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
          setIsUpdateInfo1(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
             setIsUpdateInfo(false);
          setIsUpdateInfo1(false);
        }
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      }
    }
  );
  const { mutate: postBookCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postBookCustomerAPI(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
          setIsUpdateInfo1(false);
          setIsLoadingB(false)
          setIsUpdateBooking(false);
          setIsLoading(false)
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
             setIsUpdateInfo(false);
          setIsUpdateInfo1(false);
        }
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      }
    }
  );
  const { mutate: getOTPCUstomer } = useMutation(
    'post-footer-form',
    (data: string) => getOTPCustomerById(data),
    {
      onSuccess: (data) => {
        setIsGetOTP({ ...isGetOTP, open: true, data: data?.data });
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      }
    }
  );

  const [isUpdateInfo1,setIsUpdateInfo1] = useState(false);
  const handleUpdateCustomer = async (data: any) => {
    await postSaveCustomer(data);
  };
  const handleBookingCustomer = async (data: any) => {
    await postBookCustomer(data);
  };
  const [isCustomerRelate, setIsCustomerRelate] = useState(false);
  const saveNewUiInfoCustomer = useMemo(() => (
    <div className="m-customer_infos_new" style={{display:"grid", gridTemplateColumns:"1fr 1fr", height:"100%", overflowY:"hidden"}}>

      <div className="m-customer_infos_new_information">
        <div className="m-customer_infos_new_information_title" style={{height:"50px", display:"flex", justifyContent:"start", alignItems:"center", gap:"15px"}}>
          <p className='blue-hover-effect-text'> {`Thông tin cá nhân - ${formData.id}`}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column", gap:"2px"}}>
           <div style={{width:"100%",marginTop:"6px"}} >
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "15px", height: "fit-content",fontSize:"14px",  }}>
              <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px",  }}>
                <Typography content={`Họ và tên:`} styles={{ fontWeight: 500 }} /><Typography content={formData.name} styles={{ fontWeight: 600, textTransform: "uppercase" }} />
         </div>
              <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px", height: "fit-content", fontSize: "14px", }}>
                  <CTooltip
                                     placements="top"
                                     title="Cập nhật thông tin khách hàng"
                colorCustom="#04566e"
                
                                   >
                  <img src={iconPen} width="26" style={{ marginLeft: "13x", cursor: "pointer" }} onClick={() => {
                     setIsUpdateInfo1(true);
        setDataCustomerInfos(dataCustomerInfos);
        dispatch(getGroupSurveyPortrait({ customerId: formData.id, servey_type: infoCustomer?.data?.customer?.portrait_survey_type }));
                                   }} />
              </CTooltip>
           <CTooltip
                                     placements="top"
                                     title="Gọi điện KH"
                colorCustom="#04566e"
                
                                   >
                                   <img src={iconCall} width="26" style={{ marginLeft: "13x" ,cursor:"pointer"}} onClick={() => handleCallOutCustomer()} />
              </CTooltip>
                      {/* <CTooltip
                                     placements="top"
                                     title="Gửi OTP"
                                     colorCustom="#04566e"
                                   >
                                 <img src={iconOTP} width="26" style={{ marginLeft: "3x",cursor:"pointer"}} onClick={async () => {
                await getOTPCUstomer(formData.id);
              }} />
                                   </CTooltip> */}
           </div>
             
          </div>
         
        </div>
        <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"0.6fr 1fr"}}>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px" }}><Typography content={`Giới tính:`} styles={{ fontWeight: 500 }} /><Typography content={formData.gender}   />        </div>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`Năm sinh:`} styles={{ fontWeight: 500 }} /><Typography content={moment(formData.dayOfBirth).format('DD-MM-YYYY')}   />        </div>

        </div>
        <div style={{width:"100%",}} >
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px" }}><Typography content={`Địa chỉ:`} styles={{ fontWeight: 500 }} /><Typography content={formData.address}   />
          </div>
        </div>
         <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"0.6fr 1fr"}}>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px" }}><Typography content={`Điện thoại:`} styles={{ fontWeight: 500 }} /><Typography content={formData?.phoneNumber}   />        </div>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`CCCD:`} styles={{ fontWeight: 500 }} /><Typography content={formData?.customerId}   />        </div>

        </div>
       <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"0.6fr 1fr"}}>
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`Nhóm nguồn ban đầu:`} styles={{ fontWeight: 500 }} />
            <Typography content={stateLaunchSourceGroups.find(item => item.id === formData?.launch_source_group_id)?.label}   />
          </div>
       <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: "5px", height: "fit-content", fontSize: "14px" }}>
              <Typography content={`Nguồn ban đầu:`} styles={{ fontWeight: 500 }} />
                  <Typography content={stateLaunchSource.find(item => item.id === formData?.launch_source_id)?.label}   />
                        {/* <Typography
  content={
    `${stateDetallVisit?.data?.owner?.source?.name || ""}${
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? ` (${stateDetallVisit?.data?.owner?.owner?.owner_name_display || ""})`
        : ""
    }`
  }
  styles={{
    color:
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? "red"
        : "",
    fontWeight:
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? 600
        : ""
  }}
/> */}

              {/* {
                      [2, 3, 4].includes(dataCustomerInfos?.customer?.launch_source?.id) && !_.isNull(dataCustomerInfos) && (
                        <div className="m-customer_infos_new_information_row6">
                          <Typography
                      content={`(${dataCustomerInfos?.display_name} - ${dataCustomerInfos?.phone})`}
                        styles={{color:`${dataCustomerInfos?.customer?.launch_source?.id === 2 ? "red": ""}`, fontWeight:`${dataCustomerInfos?.customer?.launch_source?.id === 2 ? 600: ""}`}}
                    />
                        </div>
                      )
              } */}
              {/* {
                  listCustomerRelate.length > 1 && ( 
                 <div style={{position:"relative", marginLeft:"5px"}}>
            {
              listCustomerRelate.length && isCustomerRelate && (
                        <div style={{position:"absolute", top:"-100px", left:"0", backgroundColor:"#f1f1f1", zIndex:1000, opacity:1, minWidth:"180px",cursor:"pointer",width:"fit-content",overflow:"hidden",borderRadius:"8px",fontWeight:500,padding:"0.3rem 0.6rem",fontSize:"0.85rem",whiteSpace:"nowrap",boxShadow:"1px 1px 2px #c5c5c5, -1px -1px 2px #fff",border:"1px solid #c5c5c5"}}>
                        <div className={mapModifiers("p-detail_customer_relate_wrapper")}>
                    <div className="p-detail_customer_relate_title">
                      <Typography content="Khách hàng có cùng SĐT" />
                    </div>
                    <div className={mapModifiers("p-detail_customer_relate_content")} style={{maxHeight:"100px"}}>
                      {
                        listCustomerRelate.length > 1 ? listCustomerRelate.filter((i) => i?.customer_id !== infoCustomer?.data?.customer?.customer_id)?.map((customer) => (
                          <div
                            key={customer?.customer_id}
                            className="p-detail_customer_relate_item"
                            onClick={() => {
                              window.open(
                                `/customer-info/id/${customer?.customer_id}/history-interaction`,
                                "_blank"
                              );
                            }}
                            style={{flexWrap:"nowrap"}}
                          >
                            <div className="p-detail_customer_relate_item_feild" style={{
                              fontSize: "12px",
                              
                            }}>
                              <span>Họ tên:</span><span style={{color:"#0489dc"}}>{customer?.customer_fullname}</span>
                            </div>
                        <div className="p-detail_customer_relate_item_feild" style={{fontSize:"12px"}}>
                              <span>Ngày sinh:</span><span>{moment(customer?.birthday).format('DD/MM/YYYY')}</span>
                            </div>
                        <div className="p-detail_customer_relate_item_feild" style={{fontSize:"12px"}}>
                              <span>Giới tính:</span><span>{customer?.gender_id === 'M' ? 'Nam' : 'Nữ'}</span>
                            </div>
                          </div>
                        )) : <Typography content='Không tìm thấy khách hàng liên quan' modifiers={['12x24', 'cg-red', 'italic', '400']} />
                      }
                    </div>
                    <div className="p-detail_customer_relate_close">
                      <Icon iconName='close' onClick={() => setIsCustomerRelate(false)} />
                    </div>
                  </div>
            </div>
              )
                    }
                    <CTooltip
                                     placements="top"
                                     title="Danh sách KH có cùng số điện thoại"
                colorCustom="#04566e"
                
                                   >
                  <img src={iconLK} width="24" style={{ marginLeft: "13x", cursor: "pointer" }} onClick={() => setIsCustomerRelate(true)}/>
                </CTooltip>
          </div>
                )
              } */}
              
          </div>
        </div>
           <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"0.6fr 1fr"}}>
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`Chuyển đổi ban đầu:`} styles={{ fontWeight: 500 }} />
                <Typography content={stateLaunchSourceTypes.find(item => item.id === formData?.launch_source_type_id)?.label}   />
            </div>
            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`Tags:`} styles={{ fontWeight: 500 }} />
              <>
                 {infoCustomer?.data?.tags?.length  !== 0 && infoCustomer?.data?.tags?.map((tag:any) => (
            <span key={tag.tag_id} style={{
                                      backgroundColor: `${tag.tag_color}`,
              color: "#4B5563",
              padding: "0.25rem 0.5rem",
              borderRadius: 12,
                     fontSize: "0.75rem",
              fontWeight: 500,
            }} >
              {tag.tag_name}
            </span>
          ))}
              </>
               <button style={{
              background: "transparent",
              color: "#2563EB",
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              border: "none",
              cursor: "pointer"
                                    }}
                                      onClick={() => {
                                        setIsAddTag(true)
                                    }}
                                    >+ Thêm tag</button>
          </div>
          
        </div>
       </div>
       
       
      
      </div>
      <div className="m-customer_infos_new_booking" >
<div
  className="m-customer_infos_new_booking_title"
  style={{
    display: "flex",
    justifyContent:
      stateDetallVisit.data.master?.master_id !== undefined
        ? "space-between"
        : "start",
    alignItems: "center",
    gap: "15px",
    height: "50px",
  }}
>
       <p className='blue-hover-effect-text'> {`Thông tin lượt khám:`}</p>
          <div>
            {
           stateDetallVisit.data.master?.master_id !== undefined ?
              <div className={mapModifiers('', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{ padding: "0px",display:"flex", justifyContent:"center", alignItems:"center", gap:"10px" }}>
        {listBtnBooking?.map((btn:any) => {
          switch (btn?.id) {
            case 2: return (
              <DropdownButtonQue textButton={btn?.name} key={btn.id} iconButton={btn?.buttonIcon} >
               <div
                  onClick={() => {
                    handleGetSurveyUrl('NS');
                  }}
                  className='blue-hover-effect'
                  style={{border:"1px solid #e3e1e1", borderRadius:"5px", cursor:"pointer",paddingLeft:"10px",width:"150px"}}
                >
                 <p style={{textAlign:"center", }}>Nội soi</p>
                </div>
                <div
                  onClick={() => {
                    handleGetSurveyUrl('KTQ');
                  }}
                    className='green-hover-effect'
                  style={{border:"1px solid #e3e1e1", borderRadius:"5px", cursor:"pointer"}}
                >

                   <p style={{textAlign:"center", }}>Khám tổng quát</p>
                </div>
              </DropdownButtonQue>
            );
            case 1: return (
              
                <div
                key={btn.id}
                  onClick={() => {
                    btn?.handleClick();
                  }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer",width:"fit-content", paddingRight:"5px",paddingLeft:"5px"}}
              >
                {btn.buttonIcon}
                  <p style={{ textTransform: "none", fontWeight:600}}>Đặt lịch hẹn mới</p>
              </div>
            );
       case 6: return (
              
                <div
                key={btn.id}
                  onClick={() => {
                    btn?.handleClick();
                  }}
                 className={mapModifiers(
                            "orange-hover-effect",
                            isLoadingGetService && "pendding"
                        )}
                style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer",width:"fit-content", paddingRight:"5px",paddingLeft:"5px"}}
              >
                {isLoadingGetService ?    <Icon iconName={"loading_crm"} isPointer /> : <> {btn.buttonIcon}
                <p style={{ textTransform: "none", fontWeight:600}}>{btn.name}</p></>}
               
              </div>
            );
       
         
          
          }
        })}
                     <div>
                  {
                    stateDetallVisit.data.master?.status === "new" ? <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"center",paddingBottom:"2px",gap:"10px"}}>
        {listBtnR_C?.map((btn) => {
          switch (btn?.id) {
            

            case 4: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer",color:"#0caa31"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} styles={{color:"#0caa31",fontWeight:600,textTransform:"capitalize"}}/>
              </div>
            );
            case 5: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='red-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} styles={{color:"#ff0000",fontWeight:600,textTransform:"capitalize" }}/>
              </div>
            );
          
          }
        })}
      </div> :  <></> 
                  }
             
           </div>
              </div>
              : 
              <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{ padding: "0px" }}>
       {listBtnBooking?.map((btn:any) => {
          switch (btn?.id) {
           
            case 1: return (
              
                <div
                key={btn.id}
                  onClick={() => {
                    btn?.handleClick();
                  }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                  <p style={{ textTransform: "none", fontWeight:600}}>Đặt lịch hẹn mới</p>
              </div>
            );
    
       
         
          
          }
        })}
      </div>
             }</div>
          
          
        </div>
        {
        stateDetallVisit?.data?.master?.master_id === undefined ?
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                Chọn thông tin lượt khám
           {/* <div style={{width:"100%",marginTop:"6px"}} >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}>
                  <Typography content={`Lịch hẹn:`} styles={{ fontWeight: 500 }} /><Typography content={moment(formData.dateBooking).format('HH:mm - DD/MM/YYYY')} />
     {formData.isBooking && (
  <p>
    (Mã: {formData.master.master_id} {formData.master.is_re_exams && (
      <span style={{marginLeft:"-3px", marginRight:"3px"}}>,</span>
    )}
    {formData.master.is_re_exams && (
      <span style={{ color: "#ff0000" }}>Tái khám theo lịch hẹn của Bác sĩ</span>
    )})
  </p>
                  )}
                  
                      <div>
             {formData.allow_update_profile && (   <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnL?.map((btn) => {
          switch (btn?.id) {
            

            case 9: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='blue-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} styles={{fontWeight:"600"}}/>
              </div>
            );
          
          
          }
        })}
      </div>)}
           </div>  
</div>

             <div>
             {formData.isBooking && (   <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnR_C?.map((btn) => {
          switch (btn?.id) {
            

            case 4: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
            case 5: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='red-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
          
          }
        })}
      </div>)}
           </div>
          </div>
         
        </div>
     
        
          <div style={{ width: "100%", }} >
            <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Người đặt lịch:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
  
  <Typography
    content={formData.sales_employee_name?.name}
    styles={{  wordBreak: "break-word" }}
  />
</div>
       

        </div>
    
         <div style={{width:"100%",}} >
        <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Ghi chú đặt lịch:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
  
  <Typography
    content={formData?.noteBooking}
    styles={{  wordBreak: "break-word" }}
  />
</div>

            </div>
              {
       
              <div className="m-customer_infos_new_tag" style={{ display: "flex", justifyContent:"start",alignItems:"center", gap:"2px"}}>
              <CTooltip
                                     placements="top"
                                     title="Thêm tag"
                  colorCustom="#04566e"
                  
                                   >
                                    <img src={iconAddTasB} style={{width:"18px", marginRight:"5px" ,cursor:"pointer"}} onClick={ () => {
        setIsAddTag(true);
      }}></img>
                                   </CTooltip>
                  <Typography content="Tags:" />
                 
            <div className="m-customer_infos_new_tag_row" >
  {listTag?.length > 0 &&
    listTag
      .filter(tag => tag?.tag_group !== "htkh")
      .map((tag, idx, arr) => (
        <span key={idx}>
          {tag.tag_name}
          {idx < arr.length - 1 && ", "}
        </span>
      ))}
</div>

          </div> 
      } */}
            </div> : 
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
           <div style={{width:"100%",marginTop:"6px"}} >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}>
                    <Typography content={`Ngày hẹn khám:`} styles={{ fontWeight: 500 }} /><Typography content={stateDetallVisit.data.master?.appointment_date ? moment(stateDetallVisit.data.master?.appointment_date).format('DD/MM/YYYY') : ""} /> 
                    {
                        stateDetallVisit.data.master?.status === "canceled" && (<Typography content="(Lịch đã hủy)" styles={{color:"red"}}/> )
                    }
            
                    
                      {/* <div>
             {formData.allow_update_profile && (   <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnL?.map((btn) => {
          switch (btn?.id) {
            

            case 9: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='blue-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} styles={{fontWeight:"600"}}/>
              </div>
            );
          
          
          }
        })}
      </div>)}
           </div>   */}
                
                      <div>
           
           </div>  
</div>
                  {
                    (stateDetallVisit.data.master?.status === "canceled") ? <></> : <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", }}>
                      {
                        stateDetallVisit.data.master?.status !== "done" && (<div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnBookingUpdate?.map((btn) => {
          switch (btn?.id) {
            

            case 1: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                               className='blue-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {/* <img src={iconCB} alt="" width={23}/> */}
                <Typography content={btn?.name} styles={{ fontWeight: "600" }} />
              </div>
            );
          
          
          }
        })}
                  </div>)
                      }
                         
                       <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnR?.map((btn) => {
          switch (btn?.id) {
            

            case 9: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                  className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
             <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 3L13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2V3ZM19 9H20C20 8.73478 19.8946 8.48043 19.7071 8.29289L19 9ZM13.109 8.45399L14 8V8L13.109 8.45399ZM13.546 8.89101L14 8L13.546 8.89101ZM10 13C10 12.4477 9.55228 12 9 12C8.44772 12 8 12.4477 8 13H10ZM8 16C8 16.5523 8.44772 17 9 17C9.55228 17 10 16.5523 10 16H8ZM8.5 9C7.94772 9 7.5 9.44772 7.5 10C7.5 10.5523 7.94772 11 8.5 11V9ZM9.5 11C10.0523 11 10.5 10.5523 10.5 10C10.5 9.44772 10.0523 9 9.5 9V11ZM8.5 6C7.94772 6 7.5 6.44772 7.5 7C7.5 7.55228 7.94772 8 8.5 8V6ZM9.5 8C10.0523 8 10.5 7.55228 10.5 7C10.5 6.44772 10.0523 6 9.5 6V8ZM17.908 20.782L17.454 19.891L17.454 19.891L17.908 20.782ZM18.782 19.908L19.673 20.362L18.782 19.908ZM5.21799 19.908L4.32698 20.362H4.32698L5.21799 19.908ZM6.09202 20.782L6.54601 19.891L6.54601 19.891L6.09202 20.782ZM6.09202 3.21799L5.63803 2.32698L5.63803 2.32698L6.09202 3.21799ZM5.21799 4.09202L4.32698 3.63803L4.32698 3.63803L5.21799 4.09202ZM12 3V7.4H14V3H12ZM14.6 10H19V8H14.6V10ZM12 7.4C12 7.66353 11.9992 7.92131 12.0169 8.13823C12.0356 8.36682 12.0797 8.63656 12.218 8.90798L14 8C14.0293 8.05751 14.0189 8.08028 14.0103 7.97537C14.0008 7.85878 14 7.69653 14 7.4H12ZM14.6 8C14.3035 8 14.1412 7.99922 14.0246 7.9897C13.9197 7.98113 13.9425 7.9707 14 8L13.092 9.78201C13.3634 9.92031 13.6332 9.96438 13.8618 9.98305C14.0787 10.0008 14.3365 10 14.6 10V8ZM12.218 8.90798C12.4097 9.2843 12.7157 9.59027 13.092 9.78201L14 8V8L12.218 8.90798ZM8 13V16H10V13H8ZM8.5 11H9.5V9H8.5V11ZM8.5 8H9.5V6H8.5V8ZM13 2H8.2V4H13V2ZM4 6.2V17.8H6V6.2H4ZM8.2 22H15.8V20H8.2V22ZM20 17.8V9H18V17.8H20ZM19.7071 8.29289L13.7071 2.29289L12.2929 3.70711L18.2929 9.70711L19.7071 8.29289ZM15.8 22C16.3436 22 16.8114 22.0008 17.195 21.9694C17.5904 21.9371 17.9836 21.8658 18.362 21.673L17.454 19.891C17.4045 19.9162 17.3038 19.9539 17.0322 19.9761C16.7488 19.9992 16.3766 20 15.8 20V22ZM18 17.8C18 18.3766 17.9992 18.7488 17.9761 19.0322C17.9539 19.3038 17.9162 19.4045 17.891 19.454L19.673 20.362C19.8658 19.9836 19.9371 19.5904 19.9694 19.195C20.0008 18.8114 20 18.3436 20 17.8H18ZM18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362L17.891 19.454C17.7951 19.6422 17.6422 19.7951 17.454 19.891L18.362 21.673ZM4 17.8C4 18.3436 3.99922 18.8114 4.03057 19.195C4.06287 19.5904 4.13419 19.9836 4.32698 20.362L6.10899 19.454C6.0838 19.4045 6.04612 19.3038 6.02393 19.0322C6.00078 18.7488 6 18.3766 6 17.8H4ZM8.2 20C7.62345 20 7.25117 19.9992 6.96784 19.9761C6.69617 19.9539 6.59545 19.9162 6.54601 19.891L5.63803 21.673C6.01641 21.8658 6.40963 21.9371 6.80497 21.9694C7.18864 22.0008 7.65645 22 8.2 22V20ZM4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673L6.54601 19.891C6.35785 19.7951 6.20487 19.6422 6.10899 19.454L4.32698 20.362ZM8.2 2C7.65645 2 7.18864 1.99922 6.80497 2.03057C6.40963 2.06287 6.01641 2.13419 5.63803 2.32698L6.54601 4.10899C6.59545 4.0838 6.69617 4.04612 6.96784 4.02393C7.25117 4.00078 7.62345 4 8.2 4V2ZM6 6.2C6 5.62345 6.00078 5.25117 6.02393 4.96784C6.04612 4.69617 6.0838 4.59545 6.10899 4.54601L4.32698 3.63803C4.13419 4.01641 4.06287 4.40963 4.03057 4.80497C3.99922 5.18864 4 5.65645 4 6.2H6ZM5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803L6.10899 4.54601C6.20487 4.35785 6.35785 4.20487 6.54601 4.10899L5.63803 2.32698Z" fill="#0caa31"></path> </g></svg>
                <Typography content={btn?.name} styles={{fontWeight:"600"}}/>
              </div>
            );
          
          
          }
        })}
                      </div>
                       <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnConfirmBooking?.map((btn) => {
          switch (btn?.id) {
            

            case 9: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                               className='blue-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {/* <img src={iconCB} alt="" width={23}/> */}
                <Typography content={btn?.name} styles={{ fontWeight: "600" }} />
              </div>
            );
          
          
          }
        })}
                  </div>
                      {
                        infoCustomer?.data?.allow_update_profile === true && (
                           <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnSC?.map((btn) => {
          switch (btn?.id) {
            

            case 9: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                  className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px",fontWeight:"600", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
             <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 3L13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2V3ZM19 9H20C20 8.73478 19.8946 8.48043 19.7071 8.29289L19 9ZM13.109 8.45399L14 8V8L13.109 8.45399ZM13.546 8.89101L14 8L13.546 8.89101ZM10 13C10 12.4477 9.55228 12 9 12C8.44772 12 8 12.4477 8 13H10ZM8 16C8 16.5523 8.44772 17 9 17C9.55228 17 10 16.5523 10 16H8ZM8.5 9C7.94772 9 7.5 9.44772 7.5 10C7.5 10.5523 7.94772 11 8.5 11V9ZM9.5 11C10.0523 11 10.5 10.5523 10.5 10C10.5 9.44772 10.0523 9 9.5 9V11ZM8.5 6C7.94772 6 7.5 6.44772 7.5 7C7.5 7.55228 7.94772 8 8.5 8V6ZM9.5 8C10.0523 8 10.5 7.55228 10.5 7C10.5 6.44772 10.0523 6 9.5 6V8ZM17.908 20.782L17.454 19.891L17.454 19.891L17.908 20.782ZM18.782 19.908L19.673 20.362L18.782 19.908ZM5.21799 19.908L4.32698 20.362H4.32698L5.21799 19.908ZM6.09202 20.782L6.54601 19.891L6.54601 19.891L6.09202 20.782ZM6.09202 3.21799L5.63803 2.32698L5.63803 2.32698L6.09202 3.21799ZM5.21799 4.09202L4.32698 3.63803L4.32698 3.63803L5.21799 4.09202ZM12 3V7.4H14V3H12ZM14.6 10H19V8H14.6V10ZM12 7.4C12 7.66353 11.9992 7.92131 12.0169 8.13823C12.0356 8.36682 12.0797 8.63656 12.218 8.90798L14 8C14.0293 8.05751 14.0189 8.08028 14.0103 7.97537C14.0008 7.85878 14 7.69653 14 7.4H12ZM14.6 8C14.3035 8 14.1412 7.99922 14.0246 7.9897C13.9197 7.98113 13.9425 7.9707 14 8L13.092 9.78201C13.3634 9.92031 13.6332 9.96438 13.8618 9.98305C14.0787 10.0008 14.3365 10 14.6 10V8ZM12.218 8.90798C12.4097 9.2843 12.7157 9.59027 13.092 9.78201L14 8V8L12.218 8.90798ZM8 13V16H10V13H8ZM8.5 11H9.5V9H8.5V11ZM8.5 8H9.5V6H8.5V8ZM13 2H8.2V4H13V2ZM4 6.2V17.8H6V6.2H4ZM8.2 22H15.8V20H8.2V22ZM20 17.8V9H18V17.8H20ZM19.7071 8.29289L13.7071 2.29289L12.2929 3.70711L18.2929 9.70711L19.7071 8.29289ZM15.8 22C16.3436 22 16.8114 22.0008 17.195 21.9694C17.5904 21.9371 17.9836 21.8658 18.362 21.673L17.454 19.891C17.4045 19.9162 17.3038 19.9539 17.0322 19.9761C16.7488 19.9992 16.3766 20 15.8 20V22ZM18 17.8C18 18.3766 17.9992 18.7488 17.9761 19.0322C17.9539 19.3038 17.9162 19.4045 17.891 19.454L19.673 20.362C19.8658 19.9836 19.9371 19.5904 19.9694 19.195C20.0008 18.8114 20 18.3436 20 17.8H18ZM18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362L17.891 19.454C17.7951 19.6422 17.6422 19.7951 17.454 19.891L18.362 21.673ZM4 17.8C4 18.3436 3.99922 18.8114 4.03057 19.195C4.06287 19.5904 4.13419 19.9836 4.32698 20.362L6.10899 19.454C6.0838 19.4045 6.04612 19.3038 6.02393 19.0322C6.00078 18.7488 6 18.3766 6 17.8H4ZM8.2 20C7.62345 20 7.25117 19.9992 6.96784 19.9761C6.69617 19.9539 6.59545 19.9162 6.54601 19.891L5.63803 21.673C6.01641 21.8658 6.40963 21.9371 6.80497 21.9694C7.18864 22.0008 7.65645 22 8.2 22V20ZM4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673L6.54601 19.891C6.35785 19.7951 6.20487 19.6422 6.10899 19.454L4.32698 20.362ZM8.2 2C7.65645 2 7.18864 1.99922 6.80497 2.03057C6.40963 2.06287 6.01641 2.13419 5.63803 2.32698L6.54601 4.10899C6.59545 4.0838 6.69617 4.04612 6.96784 4.02393C7.25117 4.00078 7.62345 4 8.2 4V2ZM6 6.2C6 5.62345 6.00078 5.25117 6.02393 4.96784C6.04612 4.69617 6.0838 4.59545 6.10899 4.54601L4.32698 3.63803C4.13419 4.01641 4.06287 4.40963 4.03057 4.80497C3.99922 5.18864 4 5.65645 4 6.2H6ZM5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803L6.10899 4.54601C6.20487 4.35785 6.35785 4.20487 6.54601 4.10899L5.63803 2.32698Z" fill="#0caa31"></path> </g></svg>
                <Typography content={btn?.name} styles={{fontWeight:"600"}}/>
              </div>
            );
          
          
          }
        })}
                      </div>
                        )
                  }
                      
                     
             {formData.isBooking && (   <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnR_C?.map((btn) => {
          switch (btn?.id) {
            

            case 4: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
            case 5: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='red-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
          
          }
        })}
      </div>)}
                    </div>
              }
           
          </div>
         
        </div>
     
        
           <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"1fr 1.3fr 0.8fr"}}>
            <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Checkin lúc:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
                  {
                    stateDetallVisit.data.master?.register_date ?   <Typography content={ moment(formData.master?.register_date).format('HH:mm - DD/MM/YYYY')} /> :  <Typography styles={{color:"#fe0000"}} content={ "Chưa đến"} />
  }

</div>
          <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Mã lượt khám:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
  
  <Typography
    content={stateDetallVisit.data.master?.master_id}
    styles={{  wordBreak: "break-word" }}
  />
                </div>
                {/* <div>
                  {
                    stateDetallVisit.data.master?.status === "new" ? <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')} style={{display:"flex", justifyContent:"end"}}>
        {listBtnR_C?.map((btn) => {
          switch (btn?.id) {
            

            case 4: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='green-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
            case 5: return (
              <div
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
                className='red-hover-effect'
                style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </div>
            );
          
          }
        })}
      </div> :  <></> 
                  }
             
           </div> */}
        </div>
       <div style={{width:"100%",}} >
     
              <div className="m-customer_infos_new_information_row2" style={{gridTemplateColumns:"1fr 1.3fr 0.8fr"}}>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content",fontSize:"14px" }}><Typography content={`Nhóm nguồn:`} styles={{ fontWeight: 500 }} /><Typography content={stateDetallVisit.data.owner?.source_group?.name}   />
          </div>
       <div style={{ display: "flex", justifyContent: "start", alignItems: "start", gap: "5px", height: "fit-content", fontSize: "14px" }}>
            <Typography content={`Nguồn:`} styles={{ fontWeight: 500 }} />
                        <Typography
  content={
    `${stateDetallVisit?.data?.owner?.source?.name || ""}${
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? `${stateDetallVisit?.data?.owner?.owner === null ? "" : ` (${stateDetallVisit?.data?.owner?.owner?.owner_name_display || ""})`}`
        : ""
    }`
  }
  styles={{
    color:
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? "red"
        : "",
    fontWeight:
      (stateDetallVisit?.data?.owner?.source?.id === 2 ||
       stateDetallVisit?.data?.owner?.source?.id === 3 ||
       stateDetallVisit?.data?.owner?.source?.id === 4 ||
       stateDetallVisit?.data?.owner?.source?.id === 5)
        ? 600
        : ""
  }}
/>

             
         
              
                  </div>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", height: "fit-content", fontSize: "14px" }}><Typography content={`Chuyển đổi:`} styles={{ fontWeight: 500 }} />
                <Typography content={stateDetallVisit.data?.owner?.source_type?.name}   />
            </div>
        </div>  

            </div>
         <div style={{width:"100%",}} >
        <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Ghi chú:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
  
  <Typography
                    content={stateDetallVisit.data.master?.master_note}
    styles={{  wordBreak: "break-word" }}
  />
</div>

            </div>
             <div style={{width:"100%",}} >
        {/* <div
  style={{
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    gap: "5px",
    height: "fit-content",
    fontSize: "14px",
  }}
>
  <Typography
    content={`Chẩn đoán:`}
    styles={{ fontWeight: 500, whiteSpace: "nowrap" }}
  />
  
  <Typography
    content={formData?.master?.diagnose_note || ""}
    styles={{  wordBreak: "break-word" }}
  />
</div> */}

            </div>
          </div>
        }
      
      </div> 
      {/* {
        listTag?.length > 0 ?
          <div className="m-customer_infos_new_tag">
            <div className="m-customer_infos_new_tag_title">
              <Typography content="Tag" />
            </div>
            <div className="m-customer_infos_new_tag_row">
              {listTag?.length && listTag?.map((tag, idx) => {
                if (tag?.tag_group !== 'htkh') {
                  return (
                    <div className="m-customer_infos_new_tag_row_item" key={tag.tag_id}>
                      {tag.tag_name}
                    </div>
                  )
                }
              })}
            </div>
          </div> : null
      }
      <div className={mapModifiers('m-customer_infos_new_function', formData.status === 'canceled' && 'canceled', !formData.isBooking && 'not_booking')}>
        {listBtn?.map((btn) => {
          switch (btn?.id) {
            case 2: return (
              <DropdownButton textButton={btn?.name} key={btn.id} iconButton={btn?.buttonIcon}>
                <Button
                  onClick={() => {
                    handleGetSurveyUrl('NS');
                  }}
                >
                  <Typography content="Nội soi" />
                </Button>
                <Button
                  onClick={() => {
                    handleGetSurveyUrl('KTQ');
                  }}
                >

                  <Typography content="Khám tổng quat" />
                </Button>
              </DropdownButton>
            );

            // case 0: return (
            //   <Button
            //     key={btn.id}
            //     onClick={() => {
            //       makeCall(formData.phoneNumber);
            //     }}
            //   >
            //     {btn?.icon && <Icon iconName={btn?.icon as IconName} />}
            //     <Typography content={btn?.name} />
            //   </Button>
            // );
            case 5: return (
              <Button
                key={btn.id}
                onClick={() => {
                  btn?.handleClick();
                }}
              >
                {btn.buttonIcon}
                <Typography content={btn?.name} />
              </Button>
            );
            default:
              return (
                <Button
                  isLoading={btn.loading}
                  key={btn?.id}
                  onClick={() => {
                    btn?.handleClick();
                  }}
                   onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
 
                >
                 {isHovered ? btn.buttonIconH : btn.buttonIcon}
                  <Typography content={btn?.name} />
                </Button>
              );
          }
        })}
      </div> */}
    </div>
  ), [infoCustomer, formData, isShowMore,isLoadingGetService,isCustomerRelate, listCustomerRelate.length,stateDetallVisit]);

  return (
    <>
      {contextHolder}
      <div className="m-customer_infos" style={{height:"100%"}}>
        {saveNewUiInfoCustomer}
      
      </div>
        {isUpdateInfo1 &&
        <FormUpdateCustomer
          isOpenPopup={isUpdateInfo1}
          positionDrawer='right'
          handleClosePopup={() => { setIsUpdateInfo1(false); setIsClosePopup(false); }}
          valUpdate={dataCustomerInfos}
          isUpdate
          dataCustomerPortrait={dataCustomerPortrait}
          isClose={isClosePopup}
          handleClose={() => { setIsUpdateInfo1(false); setIsClosePopup(false); }}
          handleAddCustomer={(data: any) => handleUpdateCustomer(data)}
          isHigh
          isUsedDrawer={false}
          isBooking={false}
        />
      }
      {isUpdateInfo &&
        <FormBookingCustomer
          isOpenPopup={isUpdateInfo}
          positionDrawer='right'
          handleClosePopup={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
          valUpdate={dataCustomerInfos}
          isUpdate
          dataCustomerPortrait={dataCustomerPortrait}
          isClose={isClosePopup}
          handleClose={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
          handleAddCustomer={(data: any) => handleBookingCustomer(data)}
          isHigh
        isUsedDrawer={false}
        isLoadingB={isLoadingB}
        handleLoading={setIsLoadingB}
        />
      }
       {isUpdateBooking &&
        <FormUpdateBookingCustomer
        isOpenPopup={isUpdateBooking}
        positionDrawer='right'
        handleClosePopup={() => { setIsUpdateBooking(false); setIsCloseBookPopup(false); }}
        valUpdate={stateDataUpdateBooking}
        isUpdate
        dataCustomerPortrait={dataCustomerPortrait}
        isClose={isCloseBookPopup}
        handleClose={() => { setIsUpdateBooking(false); setIsCloseBookPopup(false); }}
        handleAddCustomer={(data: any) => handleBookingCustomer(data)}
        isHigh
        isUsedDrawer={false}
        isLoadingB={isLoading}
        handleLoading={setIsLoading}
        listDataServices={ stateIds}
        customerId= {infoCustomer?.data?.customer?.customer_id}
        />
      }
      <Transfer
        dataSource={listeTags.filter(tag => tag.tag_type === "lead")}
        dataUpdate={listTag as any}
        isOpen={isAddTag}
        widths={700}
        title="Cập nhật Tag"
        handleClose={() => setIsAddTag(false)}
        handleSubmit={(data) => {
          handleUpdateTag(data);
        }}
      />
      <CModal
        isOpen={isSendQuestions}
        widths={540}
        title={reschedule ? 'Dời ngày hẹn khám' : 'Bộ câu hỏi khảo sát khách hàng'}
        onCancel={() => { setSendQuestions(false); setValueServay(''); }}
        onOk={() => {
          if (reschedule) {
            return handleDelayAppointment()
          } else {
            copyClipboard(valueServay);
            setSendQuestions(false); setValueServay('');
          }
        }}
        textCancel="Hủy"
        textOK={reschedule ? 'Dời Lịch' : 'Copy'}
        zIndex={200}
      >
        {
          reschedule ? (
            <div className="m-customer_infos_reschedule">
              <CDatePickers
                label="Ngày đặt hẹn:"
                handleOnChange={(date: any) => {
                  setValueDelay({ ...valueDelay, date: moment(date?.$d).format("YYYY-MM-DDTHH:mm") });
                }}
                variant="simple"
                fomat="HH:mm DD/MM/YYYY"
                isShowTime
                placeholder="08:00 - 12/01/2023"
                ValDefault={valueDelay.date ? valueDelay.date : undefined as any}
              />
              <TextArea
                id=""
                readOnly={false}
                value={valueDelay.note}
                isResize
                defaultValue={undefined}
                handleOnchange={(e) => setValueDelay({ ...valueDelay, note: e.target.value })}
              />
            </div>
          ) : (
            <div className="m-customer_infos_cancel-schedule">
              <TextArea
                id=""
                readOnly={false}
                value={valueServay}
                isResize
                defaultValue={undefined}
                handleOnchange={(e) => { }}
              />
            </div>
          )
        }

      </CModal >
       <CModal
        isOpen={isSendQuestions1}
        widths={540}
        title={reschedule1 ? 'Dời ngày hẹn khám' : 'Link bổ sung hồ sơ bệnh án'}
        onCancel={() => { setSendQuestions1(false); setValueServay(''); }}
        onOk={() => {
          if (reschedule) {
            return handleDelayAppointment()
          } else {
            copyClipboard(valueServay);
            setSendQuestions1(false); setValueServay('');
          }
        }}
        textCancel="Hủy"
        textOK={reschedule1 ? 'Dời Lịch' : 'Copy'}
        zIndex={200}
      >
       
            <div className="m-customer_infos_cancel-schedule">
              <TextArea
                id=""
                readOnly={false}
                value={valueServay}
                isResize
                defaultValue={undefined}
                handleOnchange={(e) => { }}
              />
            </div>
        
       

      </CModal >
      <CModal
        isOpen={isCanceled}
        widths={540}
        title="Lí do khách hàng muốn hủy lịch hẹn"
        isHideFooter
        zIndex={100}
      >
        <div className="m-customer_infos_canceled">
          <GroupRadio
            options={optionCancelBooking}
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
          <div className="m-customer_infos_canceled_btn">
            <Button
              modifiers={['foreign']}
              onClick={() => {
                setIsCanceled(false);
              }}
            >
              <Typography content="Xem lại" />
            </Button>
            <CPopupConfirm
              title={`Bạn có chắc chắn muốn hủy lịch hẹn của khách hàng ${formData.name}`}
              desc=""
              textOK="Hủy lịch"
              textCancel="Xem lại"
              handleConfirm={() => handleCanceledAppointment()}
              handleCancel={() => setIsCanceled(false)}
            >
              <Button
                modifiers={['red']}
              >
                <Typography content="Hủy lịch" />
              </Button>
            </CPopupConfirm>
          </div>
        </div>
      </CModal>
      <CModal
        isOpen={isGetOTP.open}
        widths={340}
        title="OTP Đăng nhập App Member"
        onCancel={() => setIsGetOTP({ ...isGetOTP, open: false })}
        isHideOk
        textCancel='Thoát'
      >
        <Typography content={isGetOTP.data} modifiers={['48x64', '600', 'orange', 'center']} />
      </CModal>
         <CModal
        isOpen={isOpen}
        widths={460}
        title=""
        onCancel={() => setIsOpen(false)}
        onOk={() => { setSendQuestions1(true); setIsOpen(false)}}
        textCancel='Không'
        textOK='Có'
      >
        <div style={{ minHeight: "60px", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <p style={{fontSize:"16px",color:"black"}}>Bạn có muốn gửi "Link bổ sung thông tin" cho KH không?</p>
        </div>
      </CModal>
      <CModal
        isOpen={isSendQuestions2}
        widths={540}
        title={reschedule2 ? 'Dời ngày hẹn khám' : `TIN NHẮN ĐÃ GỬI ĐẾN ${formData.phoneNumber}`}
        onCancel={() => { setSendQuestions2(false); setValueServay(''); }}
        onOk={() => {
          if (reschedule) {
            return handleDelayAppointment()
          } else {
            copyClipboard(valueServay);
            setSendQuestions2(false); setValueServay('');
          }
        }}
        textCancel="Hủy"
        textOK={reschedule2 ? 'Dời Lịch' : 'Copy'}
        zIndex={200}
      >
       
            <div className="m-customer_infos_cancel-schedule">
              <TextArea
                id=""
                readOnly={false}
                value={valueServay}
                isResize
                defaultValue={undefined}
                handleOnchange={(e) => { }}
              />
            </div>
        
       

      </CModal >
    </>
  );
};

CustomerInfomation2.defaultProps = {
};

export default CustomerInfomation2;
