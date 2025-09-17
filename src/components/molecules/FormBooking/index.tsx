/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import { notification } from "antd";
import { NotificationPlacement } from 'antd/es/notification/interface';
import { OptionCustomerPortraitAddNew, optionBooking12 } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import InputDateOfBirth from 'components/atoms/InputDateOfBirth';
import Typography from 'components/atoms/Typography';
import CModal from 'components/organisms/CModal';
import { use } from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getCustomerByKey, getCustomerWhenCallIn } from 'services/api/dashboard';
import { CustomerSearchResponse, CustomerSearchResponseItem } from 'services/api/dashboard/types';
import mapModifiers from "utils/functions";

import PublicTable from '../PublicTable';
interface FormBookingProps {
  handleSubmitForm?: (data: any) => void;
  handleClose?: () => void;
  handleReset?: () => void;
  isSuccess?: boolean;
  isCloseForm?: boolean;
}
const FormAddContact: React.FC<FormBookingProps> = ({
  handleSubmitForm, handleClose, isSuccess, handleReset, isCloseForm
}) => {
  const [api, contextHolder] = notification.useNotification();

  const storageGenders = localStorage.getItem("genders");
  const storageLaunchSources = localStorage.getItem("launchSources");
  const storageLaunchSourcesGroup = localStorage.getItem('launchSourcesGroups');
  const storageLaunchSourcesType = localStorage.getItem('launchSourcesTypes');
  const storageDoctoronline = localStorage.getItem("doctorOnline");
  const storagePackages = localStorage.getItem("packages");
  const storageAffiliates = localStorage.getItem("affiliates");
  const storageAppointmentTypes = localStorage.getItem('appointment_types');
  const storageEndoscopics = localStorage.getItem('endoscopics');

  const [stateEndoscopics, setstateEndoscopics] = useState<DropdownData[]>(storageEndoscopics ? JSON.parse(storageEndoscopics) : []);
  const [stateAppointmentTypes, setstateAppointmentTypes] = useState<GroupRadioType[]>(storageAppointmentTypes ? JSON.parse(storageAppointmentTypes) : []);
  const [listAffiliates, setListAffiliates] = useState<DropdownData[]>(storageAffiliates ? JSON.parse(storageAffiliates || "") : []);
  const [listPackages, setListPackages] = useState<DropdownData[]>(storagePackages ? JSON.parse(storagePackages || "") : []);
  const [listDoctoronline, setListDoctoronline] = useState<DropdownData[]>(storageDoctoronline ? JSON.parse(storageDoctoronline || "") : []);
  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [resultCustomerSearch, setResultCustomerSearch] = useState<CustomerSearchResponseItem[]>()
  const [listGenders, setListGenders] = useState<DropdownData[]>(storageGenders ? JSON.parse(storageGenders || "") : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources || "") : []);
  const [isOpenFormGetCustomer, setIsOpenFormGetCustomer] = useState(false);

  const [dataContact, setDataContact] = useState({
    cs_name: '',
    cs_phone: '',
    cs_gender: undefined as unknown as DropdownData,
    cs_birthday: '',
    cs_originGroup: undefined as unknown as DropdownData,
    cs_originType: undefined as unknown as DropdownData,
    cs_origin: undefined as unknown as DropdownData,
    cs_date_appointment: undefined as unknown as Date,
    cs_note_appointment: '',
    cs_type_appointment: stateAppointmentTypes[0] || undefined as unknown as GroupRadioType,
    cs_service_allow_type: undefined as unknown as DropdownData,
    cs_partner: undefined as unknown as DropdownData,
    cs_customer_wom: '',
    cs_result_wom: undefined as unknown as CustomerSearchResponseItem,
    cs_group: undefined as unknown as any,
    cs_endoscopics: undefined as unknown as DropdownData,
  });

  const [isBooking, setIsBooking] = useState(false)

  const [errorDataContact, setErrorDataContact] = useState({
    cs_name: '',
    cs_origin: '',
    cs_originGroup: '',
    cs_date_appointment: '',
    cs_note_appointment: '',
    cs_service_allow_type: '',
    cs_partner: '',
    cs_group: '',
    cs_endoscopics: ''
  })

  const openNotification = (placement: NotificationPlacement, message: string, description: React.ReactNode, id: string) => {
    api.info({
      message: <Typography content={message} modifiers={['600', 'cg-red', 'capitalize']} />,
      description: <div>
        {description}
        <Typography content={'Click để vào chi tiết khách hàng'} modifiers={['400', 'orange', 'italic', '12x14']} />
      </div>,
      placement: placement,
      duration: 10,
      closeIcon: <Icon iconName="close" isPointer />,
      role: 'status',
      onClick: () => {
        window.open(`/customer-info/id/${id}/history-interaction`, '_blank');
      }
    });
  };

  const { mutate: getCustomerByPhone } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerWhenCallIn(data),
    {
      onSuccess: (data: any) => {
        const { name, gender, customer_id, phonenumber, year_of_birth } = data;
        if (customer_id === "unkown") return;
        openNotification('topRight',
          `Số điện thoại đã được đăng kí`,
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer', }}>
            <span style={{ margin: '0 4px' }}>Khách hàng:</span><Typography content={name} modifiers={['600', 'blueNavy', 'capitalize']} /><span style={{ margin: '0 4px' }}>-</span>
            <Typography content={gender?.name} modifiers={['600', 'blueNavy', 'capitalize']} /><span style={{ margin: '0 4px' }}>-</span>
            <Typography content={year_of_birth} modifiers={['600', 'blueNavy', 'capitalize']} />
          </div>,
          customer_id)
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );


  const cleanDataContact = () => {
    setDataContact({
      cs_name: '',
      cs_phone: '',
      cs_gender: undefined as unknown as DropdownData,
      cs_birthday: '',
      cs_originGroup: undefined as unknown as DropdownData,
      cs_originType: undefined as unknown as DropdownData,
      cs_origin: undefined as unknown as DropdownData,
      cs_endoscopics: undefined as unknown as DropdownData,
      cs_date_appointment: undefined as unknown as Date,
      cs_note_appointment: '',
      cs_type_appointment: undefined as unknown as GroupRadioType,
      cs_service_allow_type: undefined as unknown as DropdownData,
      cs_partner: undefined as unknown as DropdownData,
      cs_customer_wom: '',
      cs_result_wom: undefined as unknown as CustomerSearchResponseItem,
      cs_group: undefined as unknown as any,
    })
  }

  const handleValidationForm = () => {
    if (!dataContact.cs_name?.trim() ||
      !dataContact.cs_origin?.value ||
      !dataContact.cs_originGroup?.value ||
      isBooking && !dataContact.cs_date_appointment ||
      isBooking && !dataContact.cs_note_appointment ||
      isBooking && dataContact.cs_type_appointment?.id === 2 && !dataContact.cs_service_allow_type ||
      isBooking && dataContact.cs_type_appointment?.id === 3 && !dataContact.cs_service_allow_type ||
      Number(dataContact.cs_origin?.value) === 2 && !dataContact.cs_partner?.affiliate_type ||
      Number(dataContact.cs_origin?.value) === 3 && !dataContact.cs_partner?.affiliate_type ||
      Number(dataContact.cs_origin?.value) === 4 && !dataContact.cs_customer_wom.trim() ||
      _.isEmpty(dataContact.cs_group)
    ) {
      setErrorDataContact({
        ...errorDataContact,
        cs_name: !dataContact.cs_name?.trim() ? 'Tên khách hàng là trường bắt buộc' : '',
        cs_origin: !dataContact.cs_origin?.value ? 'Nguồn của khách hàng là trường bắt buộc' : '',
        cs_originGroup: !dataContact.cs_originGroup?.value ? 'Công ty là trường bắt buộc' : '',
        cs_date_appointment: (isBooking && !dataContact.cs_date_appointment) ? 'Ngày đặt lịch là trường bắt buộc' : '',
        cs_note_appointment: (isBooking && !dataContact.cs_note_appointment) ? 'Nội dung đặt lịch là trường bắt buộc' : '',
        cs_service_allow_type: isBooking && dataContact.cs_type_appointment?.id === 3 && !dataContact.cs_service_allow_type ? 'Vui lòng chọn gói dịch vụ !' : (isBooking && dataContact.cs_type_appointment?.id === 2 && !dataContact.cs_service_allow_type ? 'Vui lòng chọn bác sĩ!' : ''),
        cs_partner: (Number(dataContact.cs_origin?.value) === 2 && !dataContact.cs_partner?.affiliate_type) && 'Vui lòng chọn bác sĩ chỉ định' ||
          Number(dataContact.cs_origin?.value) === 3 && !dataContact.cs_partner?.affiliate_type && 'Vui lòng chọn đối tác' ||
          Number(dataContact.cs_origin?.value) === 4 && !dataContact.cs_customer_wom.trim() && 'Vui lòng chọn Người giới thiệu' || '',
        cs_group: _.isEmpty(dataContact.cs_group) ? 'error' : '',
      })
      if (_.isEmpty(dataContact.cs_group)) {
        toast.error('Vui lòng chọn nhóm khách hàng');
      }
      return false;
    }
    return true;
  }

  const handleSubmit = () => {
    if (!handleValidationForm()) return;
    const body = {
      customer: {
        customer_id: "",
        customer_fullname: dataContact.cs_name,
        customer_phone: dataContact.cs_phone || '',
        day_of_birth: moment(dataContact.cs_birthday).format('DD') || '',
        month_of_birth: moment(dataContact.cs_birthday).format('M') || '',
        year_of_birth: moment(dataContact.cs_birthday).format('YYYY') || '',
        gender_id: dataContact.cs_gender?.value,
        launch_source_id: dataContact.cs_origin?.value,
        launch_source_group_id: dataContact.cs_originGroup?.value,
        launch_source_type_id: dataContact.cs_originType?.value,
        is_portrait: false,
        portrait_survey_type: "CSTH"
      },
      master: isBooking ? {
        c_object_id: "DV",
        launch_source_id: dataContact.cs_origin?.value || null,
        appointment_note: dataContact.cs_note_appointment || null,
        master_note: "",
        package_id: dataContact.cs_type_appointment?.id === 3 && dataContact.cs_service_allow_type.value || null,
        appointment_date: moment(dataContact.cs_date_appointment).format("YYYY-MM-DDTHH:mm:03") || undefined,
        is_register_subclinical: false,
        is_register_package: false,
        is_exams: false,
        is_appointment: isBooking,
        register_type_id: "", //"KTQ"
      } : null,
      appointment: isBooking ? {
        appointment_type: dataContact.cs_type_appointment.value || null,
        package_id: dataContact.cs_type_appointment?.id === 3 && dataContact.cs_service_allow_type.value || null,
        doctor_employee_id: dataContact.cs_type_appointment?.id === 2 && dataContact.cs_service_allow_type.value || null,
        appointment_date: moment(dataContact.cs_date_appointment).format("YYYY-MM-DDTHH:mm:03") || undefined,
        appointment_note: dataContact.cs_note_appointment || "",
      } : null,
      is_appointment: isBooking,
      script_answer_json: null,
      customer_type: _.isUndefined(dataContact.cs_phone) ? "contact" : (isBooking ? "customer" : "lead"),
      tags: [],
      lead_note: "",
      process_key_id: _.isUndefined(dataContact.cs_phone) ? "TRKM" : (isBooking ? "TRKDDL" : "TRKTN"),
      current_affiliate_id: null,
      new_affiliate_id: null,
      policy_key: ['exam', 'reexam', 'telemedicine'].includes(dataContact.cs_type_appointment?.value) ? 'DVL02' : dataContact.cs_type_appointment?.value === 'endoscopics' ? dataContact.cs_endoscopics?.value : dataContact.cs_service_allow_type?.policy_key,

    }

    if (handleSubmitForm) {
      handleSubmitForm(body);
      cleanDataContact();
    }
  }

  useEffect(() => {
    if (isSuccess) {
      cleanDataContact();
      if (handleReset) handleReset();
    }
  }, [isSuccess])

  useEffect(() => {
    if (!isCloseForm) {
      cleanDataContact();
      if (handleReset) handleReset();
    }
  }, [isCloseForm])

  const { mutate: getCUstomerWoM } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerByKey(data),
    {
      onSuccess: (data) => {
        if (data?.length) {
          setResultCustomerSearch(data);
          setIsOpenFormGetCustomer(true);
        } else {
          toast.error(data?.message)
        }
      },
      onError: (err) => {
        console.error("Error🚀 line 348 -> FormAddCustomer:", err);
      },
    }
  );

  const tableColumnForSearch = [
    {
      title: (
        <Typography content="Họ tên" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "customer_fullname",
      align: "center",
      width: 200,
      render: (record: any, data: any) => (
        <Typography
          content={record}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography content="Năm sinh" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "year_of_birth",
      key: "birthday",
      width: 90,
      align: "center",
      render: (record: any, data: any) => (
        <Typography
          content={record}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Giới tính"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 90,
      render: (record: any, data: any) => (
        <Typography
          content={record === 'M' ? 'Nam' : 'Nữ'}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Số điện thoại"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "customer_phone",
      key: "customer_phone",
      align: "center",
      width: 120,
      render: (record: any, data: any) => (
        <Typography
          content={
            record
              ? record.replace(/^.{4}/, "0")
              : "---"
          }
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography content="Địa chỉ" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "customer_full_address",
      key: "customer_full_address",
      align: "center",
      render: (record: any, data: any) => (
        <Typography
          content={record}
          modifiers={["12x18", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography content="Chọn" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "",
      key: "",
      align: "center",
      width: 50,
      render: (record: any, data: any) => (
        <p
          onClick={() => {
            setDataContact({ ...dataContact, cs_result_wom: data })
            setIsOpenFormGetCustomer(false);
          }}
        >
          <Icon iconName="check" isPointer />
        </p>
      ),
    },
  ];

  return (
    <div className="m-form_add_contact">
      {contextHolder}
      <div className="m-form_add_contact_flex">
        <Input
          autoFocus
          id="customerFullName"
          label="Họ tên"
          placeholder="Nguyen Van A"
          variant="simple"
          value={dataContact.cs_name}
          isRequired
          onChange={(e) => {
            setDataContact({ ...dataContact, cs_name: e.target.value.toUpperCase() })
            setErrorDataContact({ ...errorDataContact, cs_name: "" });
          }}
          error={errorDataContact.cs_name}
        />
        <Input
          id="phoneNumber"
          label="Điện thoại"
          variant="simple"
          value={dataContact.cs_phone}
          placeholder="09267XXXXX"
          onChange={(e) => {
            setDataContact({ ...dataContact, cs_phone: e.target.value });
            if ((e.target.value as string)?.length >= 10) {
              getCustomerByPhone(e.target.value)
            }
          }}
        />
      </div>
      <div className="m-form_add_contact_flex">
        <Dropdown
          dropdownOption={listGenders}
          placeholder="Nam"
          label="giới tính"
          values={dataContact.cs_gender}
          handleSelect={(item) => {
            setDataContact({ ...dataContact, cs_gender: item })
          }}
          variant="simple"
        />
        <InputDateOfBirth
          isRequired={isBooking}
          label="Ngày sinh"
          handleOnChange={(date: string) => {
            setDataContact({ ...dataContact, cs_birthday: date })
          }}
          valueDefault={dataContact.cs_birthday}
          onChangInput={() => cleanDataContact()}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Dropdown
          dropdownOption={stateLaunchSourceGroups}
          isRequired
          placeholder={stateLaunchSourceGroups[0]?.label}
          label="Công ty"
          handleSelect={(item) => {
            setDataContact({ ...dataContact, cs_originGroup: item })
            setErrorDataContact({ ...errorDataContact, cs_originGroup: "" });
          }}
          variant="simple"
          className="form_origin"
          values={dataContact.cs_originGroup}
          error={errorDataContact.cs_originGroup}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Dropdown
          dropdownOption={listLaunchSources}
          isRequired
          placeholder="Khám tông quát - Youtube Ads..."
          label="Nguồn từ"
          handleSelect={(item) => {
            setDataContact({ ...dataContact, cs_origin: item })
            setErrorDataContact({ ...errorDataContact, cs_origin: "" });
          }}
          variant="simple"
          values={dataContact.cs_origin}
          className="form_origin"
          error={errorDataContact.cs_origin}
        />
      </div>
      {(Number(dataContact.cs_origin?.value) === 2 || Number(dataContact.cs_origin?.value) === 3) && (
        <div
          className={`m-form_add_contact  ${(Number(dataContact.cs_origin?.value) === 2 || Number(dataContact.cs_origin?.value) === 3) && "m-form_add_contact_partner"}`}
          style={{ marginBottom: 12 }}
        >
          <Dropdown
            dropdownOption={Number(dataContact.cs_origin?.value) === 2 ? listAffiliates.filter((i: any) => i?.affiliate_type === 'BSCD') : listAffiliates.filter((i: any) => i?.affiliate_type === 'CTV')}
            isRequired
            placeholder="Chọn đối tác"
            label={Number(dataContact.cs_origin?.value) === 2 ? 'Đối tác Bác Sĩ Chỉ Định' : 'Đối tác Cộng Tác Viên'}
            handleSelect={(item) => {
              setDataContact({ ...dataContact, cs_partner: item })
            }}
            variant="simple"
            className="form_origin"
            values={listAffiliates.find((affi: any) => affi?.affiliate_code === dataContact?.cs_partner?.affiliate_code)}
            error={errorDataContact.cs_partner}
          />
        </div>
      )}
      {Number(dataContact.cs_origin?.value) === 4 && (
        <>
          <div className={`m-form_add_customer_row grid_1_1_1_1 grid_customize ${Number(dataContact.cs_origin?.value) === 4 && "m-form_add_customer_row_optional"}`} >
            <Input
              id="customer_email"
              label="Tìm kiếm khách hàng giới thiệu"
              type="text"
              placeholder="Nhập họ tên, số điện thoại, địa chỉ,... để tìm kiếm"
              variant="simple"
              isRequired
              value={dataContact.cs_customer_wom}
              onChange={(event) => {
                setDataContact({ ...dataContact, cs_customer_wom: event.target.value });
                setErrorDataContact({ ...errorDataContact, cs_partner: '' });
              }}
              error={errorDataContact.cs_partner}
            />
            <div className="m-form_add_customer_row_optional_btn">
              <CTooltip
                placements="top"
                title="Tìm kiếm khách hàng"
                colorCustom="#04566e"
              >
                <p onClick={() => {
                  getCUstomerWoM(dataContact.cs_customer_wom);
                }}>
                  <Icon iconName="search" isPointer size='20x20' />
                </p>
              </CTooltip>
              <CTooltip
                placements="top"
                title="Xóa"
                colorCustom="#04566e"
              >
                <p onClick={() => { }} >
                  <Icon iconName="delete_item" isPointer size='20x20' />
                </p>
              </CTooltip>
            </div>
          </div>
          {!_.isUndefined(dataContact.cs_result_wom) && (
            <Input
              id="customer_email"
              label="Khách hàng giới thiệu"
              type="text"
              variant="simple"
              value={dataContact.cs_result_wom.customer_fullname}
              disabled
            />
          )}
        </>
      )}
      <Dropdown
        dropdownOption={stateLaunchSourceTypes}
        placeholder={stateLaunchSourceTypes[0]?.label}
        label="Hình thức chuyển đổi"
        handleSelect={(item) => {
          setDataContact({ ...dataContact, cs_originType: item })
        }}
        variant="simple"
        className="form_origin"
        values={dataContact.cs_originType}
      />

      <div className="m-form_add_contact_purpose">
        <div className={mapModifiers("m-form_add_contact_purpose_label", !!errorDataContact.cs_group.trim() && 'error')}>
          <Typography
            content="Khách hàng thuộc nhóm:"
            modifiers={['blueNavy']}
          />
        </div>
        <GroupRadio
          options={OptionCustomerPortraitAddNew}
          value={(OptionCustomerPortraitAddNew).find((i) => i.value === dataContact.cs_group)}
          handleOnchangeRadio={(data) => {
            setDataContact({
              ...dataContact,
              cs_group: data.value
            })
            setErrorDataContact({ ...errorDataContact, cs_group: "" });
          }}
        />
      </div>
      <Checkbox
        label="Đặt lịch hẹn khám?"
        isChecked={isBooking}
        onChange={() => setIsBooking(!isBooking)}
      />
      {isBooking && (
        <div className="m-form_add_contact_booking">
          <CDatePickers
            label="Ngày giờ"
            placeholder="Chọn giờ đặt lịch"
            variant="simple"
            isRequired
            isShowTime
            fomat="DD/MM/YYYY HH:mm"
            ValDefault={dataContact.cs_date_appointment}
            value={dataContact.cs_date_appointment}
            handleOnChange={(date: any) => {
              if (
                new Date(date?.$d).valueOf() < new Date().valueOf()
              ) {
                toast.error("Bạn không thể đặt lịch ở quá khứ");
              } else {
                setDataContact({ ...dataContact, cs_date_appointment: date?.$d })
                setErrorDataContact({ ...errorDataContact, cs_date_appointment: "" });
              }
            }}
            status={errorDataContact.cs_date_appointment ? "error" : undefined}
            error={errorDataContact.cs_date_appointment}
          />
          <Input
            id="note_booking"
            label="Ghi chú"
            type="text"
            variant="simple"
            placeholder="Ghi chú lịch đặt hẹn khám ..."
            value={dataContact.cs_note_appointment}
            onChange={(e) => {
              setDataContact({ ...dataContact, cs_note_appointment: e.target.value })
              setErrorDataContact({ ...errorDataContact, cs_note_appointment: "" });
            }}
            error={errorDataContact.cs_note_appointment}
          />
          <div className="m-form_add_contact_booking_type">
            <GroupRadio
              options={stateAppointmentTypes}
              defaultVal={dataContact.cs_type_appointment}
              value={dataContact.cs_type_appointment}
              handleOnchangeRadio={(e) =>
                setDataContact({ ...dataContact, cs_type_appointment: e })
              }
            />
          </div>
          {dataContact.cs_type_appointment?.value === 'telemedicine' && (
            <div className="flex-item">
              <Dropdown
                dropdownOption={listDoctoronline || []}
                label="Bác sĩ online"
                placeholder="Chọn 1 bác sĩ"
                handleSelect={(item) => {
                  setDataContact({ ...dataContact, cs_service_allow_type: item })
                  setErrorDataContact({ ...errorDataContact, cs_service_allow_type: "" });
                }}
                variant="simple"
                values={dataContact.cs_service_allow_type}
                error={errorDataContact.cs_service_allow_type}
                isRequired
              />
            </div>
          )}
          {dataContact.cs_type_appointment?.value === 'package' && (
            <Dropdown
              dropdownOption={listPackages}
              label="Gói dịch vụ"
              placeholder="Chọn gọi dịch vụ để đặt lịch khám theo gói"
              handleSelect={(item) => {
                setDataContact({ ...dataContact, cs_service_allow_type: item, cs_note_appointment: item.label })
                setErrorDataContact({ ...errorDataContact, cs_service_allow_type: "" });
              }}
              variant="simple"
              values={dataContact.cs_service_allow_type}
              error={errorDataContact.cs_service_allow_type}
              isRequired
            />
          )}
          {dataContact.cs_type_appointment?.value === 'endoscopics' && (
            <Dropdown
              dropdownOption={stateEndoscopics}
              label="Dịch vụ nội soi"
              placeholder="Chọn dịch vụ để đặt lịch"
              handleSelect={(item) => {
                setDataContact({ ...dataContact, cs_endoscopics: item, cs_note_appointment: item.label })
                setErrorDataContact({ ...errorDataContact, cs_endoscopics: "" });
              }}
              variant="simple"
              values={dataContact.cs_endoscopics}
              error={errorDataContact.cs_endoscopics}
              isRequired
            />
          )}
        </div>
      )
      }
      <div className="m-form_add_contact_btn">
        <Button
          className="m-form_note"
          modifiers={["primary"]}
          onClick={handleSubmit}
        >
          <Typography
            type="span"
            modifiers={["400", "16x24"]}
            content={"thêm mới"}
          />
        </Button>
        <Button
          className="m-form_note"
          onClick={() => {
            if (handleClose) handleClose();
            cleanDataContact();
            setErrorDataContact({
              ...errorDataContact,
              cs_name: '',
              cs_origin: '',
              cs_originGroup: '',
              cs_date_appointment: '',
              cs_note_appointment: '',
              cs_service_allow_type: '',
              cs_partner: '',
              cs_group: ''
            })
          }}
          modifiers={["red"]}
        >
          <Typography
            type="span"
            modifiers={["400", "16x24"]}
            content="Hủy"
          />
        </Button>
      </div>
      <CModal
        isOpen={isOpenFormGetCustomer}
        onCancel={() => setIsOpenFormGetCustomer(false)}
        title="Tìm kiếm Khách hàng giới thiệu"
        widths={1000}
        isHideOk
        textCancel='Thoát'
      >
        <PublicTable
          listData={resultCustomerSearch}
          column={tableColumnForSearch}
          handleOnClick={(event: any, record: any, rowIndex: any) => {
          }}
          pageSizes={100}
          isHideRowSelect
        />
      </CModal>
    </div >
  );

}
FormAddContact.defaultProps = {
};

export default FormAddContact;
