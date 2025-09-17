/* eslint-disable @typescript-eslint/no-unused-vars */
import Loading from 'components/atoms/Loading';
import FormAddCustomer from 'components/molecules/FormAddCustomer';
import PublicLayout from 'components/templates/PublicLayout';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postPrintAppointmentServicepoint } from 'services/api/appointmentView';
import { getCustomerById, postSaveCustomerBeforeExams } from 'services/api/beforeExams';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from 'utils/functions';

const NotFoundCustomer: React.FC = () => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(true)
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { phone } = useParams();


  useEffect(() => {
    toast.error(`Không tìm thấy khách hàng với số điện thoại: ${phone}`)
  }, [])

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

  const { mutate: getCustomerIdToGetCurrentAppointment } = useMutation(
    "post-footer-form",
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {
        if (data?.data?.appointment?.master_id) {
          printAppointmentServicepoint(data?.data?.appointment?.master_id);
        }
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );

  const { mutate: postSaveCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          setIsLoadingForm(false);
          getCustomerIdToGetCurrentAppointment({
            customer_id: data?.data,
            type: 'id',
          });
          toast.success(data.message);
          navigator(`/customer-info/id/${data?.data}/history-interaction`)
        } else {
          setIsLoadingForm(false);
          toast.error(data.message);
        }
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      },
    },
  );

  const handleAddCustomer = async (data: any) => {
    await postSaveCustomer(data);
  };

  return (
    <>
      <PublicLayout>
        <div className='p-not_found'>
          <div className='p-not_found_wrap'>
            <div className='p-not_found_404'>
              404
            </div>
            <div className='p-not_found_content'>
              <h4 className='p-not_found_content_item'>
                Không tìm thấy khách hàng với số điện thoại {phone}
              </h4>
              <p className='p-not_found_content_item p-not_found_content_item_desc'>
                Thêm khách hàng ngay ...!<span onClick={() => {
                  setIsOpen(true)
                }}>Thêm khách hàng</span>
              </p>
            </div>
          </div>
          <div className='p-not_found_info'>
          </div>

        </div>
      </PublicLayout>
      {isLoadingForm ? (<div><Loading variant='max_content' /></div>) : (
        <FormAddCustomer
          isOpenPopup={isOpen}
          handleClosePopup={() => setIsOpen(false)}
          valUpdate={undefined}
          positionDrawer="left"
          titleCustomize={(<div className='p-not_found_addInfo_header'><span style={{ color: '#f00' }}>Không tìm thấy khách hàng với số điện thoại: {phone}</span></div>)}
          customerPhoneNotFound={phone}
          isUpdate={false}
          isClose={false}
          handleClose={() => { setIsOpen(false) }}
          handleAddCustomer={(data: any) => {
            handleAddCustomer(data)
            setIsLoadingForm(true)
          }}
          isHigh
          noOverLay
        />
      )}
    </>
  );
}

export default NotFoundCustomer;
