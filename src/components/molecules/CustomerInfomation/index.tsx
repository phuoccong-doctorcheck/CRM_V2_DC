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
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import DropdownButton from 'components/atoms/DropdownButton';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon, { IconName } from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Transfer, { TransferItemType, TransferType } from 'components/atoms/Transfer';
import Typography from 'components/atoms/Typography';
import CModal from 'components/organisms/CModal';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postPrintAppointmentServicepoint } from 'services/api/appointmentView';
import { postObjectTag, postSaveCustomerBeforeExams } from 'services/api/beforeExams';
import { TagCustomer } from 'services/api/beforeExams/types';
import {
  getOTPCustomerById,
  postCallOutCustomer, postCanceledAppointment, postDelayAppointment, postRecoveryAppointment, postSurveyUrl
} from 'services/api/customerInfo';
import { getGroupSurveyPortrait, getInfosCustomerById, getListNotes } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { copyClipboard, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from 'utils/functions';

import FormAddCustomer from '../FormAddCustomer';

import iconCallB from "assets/iconButton/icons-phone-blue.png"
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
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  handleAddNote, dataCustomerPortrait, typeNoteCs
}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();


  const infoCustomer = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const [dataCustomerInfos, setDataCustomerInfos] = useState(infoCustomer?.data);
  const storageTags = localStorage.getItem('tagsCustomer');
  const [listeTags, setListeTags] = useState<TransferType[]>(storageTags ? JSON.parse(storageTags || '') : undefined as any);
  console.log(dataCustomerInfos)
  const [formData, setFormData] = useState({
    id: infoCustomer?.data?.customer?.customer_id,
    master_id: infoCustomer?.data?.lastest_result_master_id,
    name: infoCustomer?.data?.customer?.customer_fullname,
    gender: infoCustomer?.data?.customer?.gender?.name,
    dayOfBirth: infoCustomer?.data?.customer?.birthday,
    phoneNumber: infoCustomer?.data?.customer?.customer_phone.replace(/^.{4}/, '0'),
    customerId: infoCustomer?.data?.customer?.customer_identity_card,
    career: infoCustomer?.data?.customer?.career?.name,
    address: infoCustomer?.data?.customer?.customer_full_address,
    email: infoCustomer?.data?.customer?.customer_email,
    group: infoCustomer?.data?.customer_type,
    originGroup: infoCustomer?.data?.customer?.launch_source_group?.name,
    originType: infoCustomer?.data?.customer?.launch_source_type?.name,
    origin: infoCustomer?.data?.customer?.launch_source?.name,
    isBooking: infoCustomer?.data?.is_has_booking,
    dateBooking: infoCustomer?.data?.is_has_booking ? infoCustomer?.data?.master?.appointment_date : null,
    noteBooking: infoCustomer?.data?.is_has_booking ? infoCustomer?.data?.master?.appointment_note : '',
    status: infoCustomer?.data?.master?.status || '',
    affiliateId: infoCustomer?.data?.customer?.launch_source_id,
    affiliateName:  infoCustomer?.data?.affiliate_name ,
    affiliatePhone: infoCustomer?.data?.phone ,
  });

  const [listTag, setListTag] = useState<TagCustomer[]>(dataCustomerInfos?.tags as any);
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [isClosePopup, setIsClosePopup] = useState(false);
  const [isAddTag, setIsAddTag] = useState(false);
  const [isSendQuestions, setSendQuestions] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [valueNote, setValueNote] = useState('');
  const [typeNote, setTypeNote] = useState<DropdownData>();
  const [isCanceled, setIsCanceled] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isLoadingGetService, setIsLoadingGetService] = useState(false);
  console.log(isLoadingGetService)
  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
  console.log(listTag)
  const [valueServay, setValueServay] = useState('');
  const [valueDelay, setValueDelay] = useState({
    note: '',
    date: ''
  });

  const [isGetOTP, setIsGetOTP] = useState({
    open: false,
    data: ''
  });

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
      phoneNumber: infoCustomer?.data?.customer?.customer_phone.replace(/^.{4}/, '0'),
      customerId: infoCustomer?.data?.customer?.customer_identity_card,
      career: infoCustomer?.data?.customer?.career?.name,
      address: infoCustomer?.data?.customer?.customer_full_address,
      email: infoCustomer?.data?.customer?.customer_email,
      group: infoCustomer?.data?.customer_type,
      originGroup: infoCustomer?.data?.customer?.launch_source_group?.name,
      originType: infoCustomer?.data?.customer?.launch_source_type?.name,
      origin: infoCustomer?.data?.customer?.launch_source?.name, isBooking: infoCustomer?.data?.is_has_booking,
      dateBooking: infoCustomer?.data?.is_has_booking ? infoCustomer?.data?.master?.appointment_date : formData?.dateBooking,
      noteBooking: infoCustomer?.data?.is_has_booking ? infoCustomer?.data?.master?.appointment_note : formData?.noteBooking,
      status: infoCustomer?.data?.master?.status || '',
      affiliateId: infoCustomer?.data?.customer?.launch_source_id,
      affiliateName: infoCustomer?.data?.affiliate_name,
      affiliatePhone: infoCustomer?.data?.phone,
    });
  }, [infoCustomer]);

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
      object_type: dataCustomerInfos?.customer_type,
      tag_ids: [...newTag]
    };
    await postTagCustomer(body);
  };
  // Hủy lịch
  const handleCanceledAppointment = async () => {
    if (!canceledReason.reason.trim()) {
      toast.error('Vui lòng nhập lí do khách hàng hủy khám');
    } else {
      console.log(canceledReason)
      await postCanceledBooking({
        master_id: dataCustomerInfos?.master?.master_id,
        canceled_reason: canceledReason.reason,
      });
    }
  };
  // Khôi phục lịch đã hủy
  const handleRestoreAppointment = async () => {
    await postRestoreBooking({ master_id: dataCustomerInfos?.master?.master_id });
  };

  // Dời lịch đã đặt
  const handleDelayAppointment = async () => {
    const data = {
      master_id: dataCustomerInfos?.master?.master_id,
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
      customer_phone: formData.phoneNumber?.replace(/^\s*0/, '+84-'),
    });
  };
  const handleGetSurveyUrl = async (type: string) => {
    await getSurveyUrlForCustomerId({
      survey_type: type,
      customer_id: formData?.id,
      master_id: formData.master_id,
    });
  };
   const [isHovered, setIsHovered] = useState(false);
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
        if (!dataCustomerInfos?.master?.master_id) {
          toast.info('Không tìm thấy thông tin phiếu khám');
        } else {
          setIsLoadingGetService(true);
          printAppointmentServicepoint(dataCustomerInfos?.master?.master_id);
        }
      },
    }
  ];

  const { mutate: postSaveCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          dispatch(getInfosCustomerById({ customer_id: formData.id }));
          toast.success(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
        } else {
          toast.error(data.message);
          setIsClosePopup(true);
          setIsUpdateInfo(false);
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


  const handleUpdateCustomer = async (data: any) => {
    await postSaveCustomer(data);
  };
  const saveNewUiInfoCustomer = useMemo(() => (
    <div className="m-customer_infos_new">

      <div className="m-customer_infos_new_information">
        <div className="m-customer_infos_new_information_title">
          <Typography content={`Thông tin cá nhân - ${formData.id}`} styles={{fontWeight:600}}/>
        </div>
        <div className="m-customer_infos_new_information_row1">
          <Input
            variant='simple'
            label={'Họ tên'}
            value={formData.name}
            disabled
          />
          <Input
            variant='simple'
            label={'Giới tính'}
            value={formData.gender}
            disabled
          />
        </div>
        <div className="m-customer_infos_new_information_row2">
          <Input
            variant='simple'
            label={'Ngày sinh'}
            value={moment(formData.dayOfBirth).format('DD-MM-YYYY')}
            disabled
          />
          <Input
            variant='simple'
            label={'Điện thoại'}
            value={formData.phoneNumber}
            disabled
          />
        </div>
        <div className={mapModifiers('m-customer_infos_new_information_row5', !isShowMore && 'hide')}>
          {isShowMore ? (
            <>
              <Input
                variant='simple'
                label={'Công ty'}
                value={formData.originGroup}
                disabled
              />
              <Input
                variant='simple'
                label={'Nguồn'}
                value={formData.origin}
                disabled
              />
            </>
          ) : (
            <div>
              <Input
                variant='simple'
                label={'Công ty'}
                value={formData.originGroup}
                disabled
              />
              <Input
                variant='simple'
                label={'Nguồn'}
                value={formData.origin}
                disabled
              />
            </div>
          )}

          <Input
            variant='simple'
            label={'Chuyển đổi'}
            value={formData.originType}
            disabled
          />
          {isShowMore && (
            <div>
              <Input
                variant='simple'
                label={'Email'}
                value={formData.email}
                disabled
              />
            </div>
          )}
        </div>
        {/* {
          [2, 3, 4].includes(dataCustomerInfos?.customer?.launch_source?.id) && !_.isNull(dataCustomerInfos?.affiliate) && (
            <div className="m-customer_infos_new_information_row6">
              <Input
                variant='simple'
                label={dataCustomerInfos?.customer?.launch_source?.id === 4 && 'Người giới thiệu' || dataCustomerInfos?.customer?.launch_source?.id === 3 && 'Đối tác' || dataCustomerInfos?.customer?.launch_source?.id === 2 && 'BSCD' || ''}
                value={`${dataCustomerInfos?.affiliate?.display_name} - ${dataCustomerInfos?.affiliate?.phone}`}
                disabled
              />
            </div>
          )
        } */}
        {
          isShowMore ? (
            <>
              <div className="m-customer_infos_new_information_row3">
                <Input
                  variant='simple'
                  label={'Nghề nghiệp'}
                  value={formData.career}
                  disabled
                />
                <Input
                  variant='simple'
                  label={'CMND/CCCD'}
                  value={formData.customerId}
                  disabled
                />
              </div>
              <div className="m-customer_infos_new_information_row4">
                <TextArea
                  variant='simple'
                  label={'Địa chỉ'}
                  value={formData.address}
                  disabled
                  id={''}
                  readOnly
                />
              </div>
              <div className="m-customer_infos_showmore">
                <span onClick={() => setIsShowMore(false)}>
                  <Typography content="Ẩn bớt" />
                </span>
              </div>
            </>
          ) : (
            <div className="m-customer_infos_showmore">
              <span onClick={() => setIsShowMore(true)}>
                <Typography content="Xem thêm" />
              </span>
            </div>
          )
        }
      </div>
      <div className="m-customer_infos_new_booking">
        <div className="m-customer_infos_new_booking_title">
          <Typography content="Thông tin đặt lịch" styles={{fontWeight:600}}/>
        </div>
        <div className="m-customer_infos_new_booking_row">
          <Input
            variant='simple'
            label={'Tình trạng'}
            value={formData.isBooking ? 'Đã đặt lịch' : 'Không có thông tin đặt lịch'}
            disabled
          />
          <Input
            variant='simple'
            label={'Lịch hẹn lúc'}
            value={formData.isBooking ? moment(formData.dateBooking).format('HH:mm - DD/MM/YYYY') : 'Không có thông tin đặt lịch'}
            disabled
          />
          <TextArea
            variant='simple'
            label={'Ghi chú đặt lịch'}
            value={formData.noteBooking ? formData.noteBooking : 'Không có thông tin đặt lịch'}
            disabled
            id={''}
            readOnly
          />
        </div>
      </div>
      {
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
      </div>
    </div>
  ), [infoCustomer, formData, isShowMore,isLoadingGetService]);

  return (
    <>
      {contextHolder}
      <div className="m-customer_infos">
        {saveNewUiInfoCustomer}
        <div className="m-customer_infos_input">
          <div className="m-customer_infos_input_title">
            <Typography content="Tương tác với khách hàng" styles={{fontWeight:600}}/>
          </div>
          <div className="m-customer_infos_input_enter">
            <TextArea
              id=""
              readOnly={false}
              value={valueNote}
              placeholder="Nhập các ghi chú cần thiết mô tả chân dung khách hàng"
              handleOnchange={(e) => setValueNote(e.target.value)}
              onKeyDown={(events: any) => {
                if (
                  events.key === "Enter" &&
                  !events.altKey &&
                  !events.ctrlKey &&
                  !events.shiftKey
                ) {
                  events.preventDefault();
                  const body = { cs_node_type: typeNoteCs, cs_node_content: valueNote, };
                  if (handleAddNote && valueNote.trim()) {
                    handleAddNote(body);
                    setValueNote(''); setTypeNote(undefined);
                  } else {
                    toast.error('Không thể lưu một ghi chú rỗng');
                  }
                }
                if (
                  events.key === "Enter" &&
                  events.altKey &&
                  !events.ctrlKey &&
                  !events.shiftKey
                ) {
                  events.preventDefault();
                  setValueNote((prev) => prev?.concat("\n"));
                }
              }}
            />
            <div className="m-customer_infos_input_btn">
              <Dropdown
                dropdownOption={optionsLevelNote}
                defaultValue={optionsLevelNote[0]}
                placeholder="Nam"
                handleSelect={(item: any) => {
                  setTypeNote(item)
                }}
                variant="simple"
              />
              <Button modifiers={['red']} onClick={async () => {
                await getOTPCUstomer(formData.id);
              }}
              >
                <Typography content="OTP" modifiers={['400']} />
              </Button>
              <Button modifiers={['foreign']} onClick={() => {
                const body = { cs_node_type: typeNote?.value || 'cs', cs_node_content: valueNote, };
                if (handleAddNote && valueNote.trim()) {
                  handleAddNote(body);
                  setValueNote(''); setTypeNote(undefined);
                } else {
                  toast.error('Không thể lưu một ghi chú rỗng');
                }
              }}
              >
                <Typography content="Lưu note" modifiers={['400']} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isUpdateInfo &&
        <FormAddCustomer
          isOpenPopup={isUpdateInfo}
          positionDrawer='right'
          handleClosePopup={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
          valUpdate={dataCustomerInfos}
          isUpdate
          dataCustomerPortrait={dataCustomerPortrait}
          isClose={isClosePopup}
          handleClose={() => { setIsUpdateInfo(false); setIsClosePopup(false); }}
          handleAddCustomer={(data: any) => handleUpdateCustomer(data)}
          isHigh
          isUsedDrawer={false}

        />
      }
      <Transfer
        dataSource={listeTags}
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
    </>
  );
};

CustomerInformation.defaultProps = {
};

export default CustomerInformation;
