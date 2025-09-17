/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DataCustomerInfo } from 'services/api/beforeExams/types';
import { useAppSelector } from 'store/hooks';

import CCollapse from '../CCollapse';
import InteractionHistory from '../InteractionHistory';

interface CustomerInfoProps {
  dataCustomer: DataCustomerInfo;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ dataCustomer }) => {
  const listNotesCustomer = useAppSelector((state) => state.infosCustomer.noteList);
  const [listNodeById, setListNodeById] = useState(listNotesCustomer);

  useEffect(() => {
    setListNodeById(listNotesCustomer)
  }, [listNotesCustomer.data])

  return (
    <div className="o-customer_infos">
      <CCollapse title="Thông tin cá nhân" key="1" key_default='1'>
        <div className="o-customer_infos_item">
          <span>Họ tên:</span><p>{dataCustomer?.customer?.customer_fullname}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Giới tính:</span><p>{dataCustomer?.customer?.gender?.name}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Ngày sinh:</span><p>{moment(dataCustomer?.customer?.birthday).format('DD-MM-YYYY')}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Điện thoại:</span><p>{dataCustomer?.customer?.customer_phone.replace('+84-', '0')}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Email:</span><p>{dataCustomer?.customer?.customer_email}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>CMND/CCCD:</span><p>{dataCustomer?.customer?.customer_identity_card}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Nghề nghiệp:</span><p>{dataCustomer?.customer?.career?.name}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Địa chỉ:</span><p>{dataCustomer?.customer?.customer_full_address}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Nguồn:</span><p>{dataCustomer?.customer?.launch_source?.name}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Nhóm:</span><p>{dataCustomer?.customer_type}</p>
        </div>
        <div className="o-customer_infos_item">
          <span>Giai đoạn:</span><p>{dataCustomer?.customer?.process_key_id}</p>
        </div>
      </CCollapse>
      <CCollapse title="Thông tin đặt lịch" key="1" key_default='1'>
        <ul className='o-customer_infos_booking'>
          <li className="o-customer_infos_item">
            <span>Tình trạng:</span><p>{dataCustomer?.is_has_booking ? 'Đã đặt lịch' : 'Không có thông tin'}</p>
          </li>
          {/* <li className="o-customer_infos_item">
            <span>Lịch hẹn lúc:</span><p>{dataCustomer?.is_has_booking ? moment(dataCustomer?.appointment.appointment_date).format('HH:mm DD/MM/YYYY') : 'Không có thông tin'}</p>
          </li>
          <li className="o-customer_infos_item">
            <span>Ghi chú đặt lịch:</span><p>{dataCustomer?.is_has_booking ? dataCustomer?.appointment?.appointment_note : 'Không có thông tin'}</p>
          </li> */}
        </ul>
      </CCollapse>
      <CCollapse title="Lịch sử tương tác" key="1" key_default='1' classnameCustom='interaction'>
        {
          listNodeById?.data.length ? (
            <InteractionHistory
              get5Item
              options={listNodeById?.data?.slice(0, 5)}
              id={dataCustomer?.customer.customer_id || ''}
              isPopup
            />
          ) : (<div style={{ color: '#f00' }}>Không có dữ liệu</div>)}
      </CCollapse>
    </div>
  );
}

CustomerInfo.defaultProps = {
};

export default CustomerInfo;
