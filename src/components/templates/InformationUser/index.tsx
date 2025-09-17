/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import CCollapse from 'components/organisms/CCollapse';
import Container from 'components/organisms/Container';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import mapModifiers from 'utils/functions';
import * as Yup from 'yup';

export interface InfosUser {
  id?: number;
  fullName?: string;
  phone?: string;
  email?: string;
  active?: boolean;
  dateUpdate?: Date;
  urlAvatar?: string;
  status: boolean;
  social?: any;
  notify?: any;
}

interface InformationUserProps {
}

const TabInfo = ['Thông tin tài khoản'];

const InformationUser: React.FC<InformationUserProps> = ({ }) => {
  const [tabActive, setTabActive] = useState(0);

  const formSchema = Yup.object().shape({
    fullName: Yup.string(),
    phone: Yup.string()
      .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Số điện thoại không đúng định dạng')
      .max(10, 'Số điện thoại không đúng định dạng'),
    email: Yup.string(),
    urlAvatar: Yup.string(),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState: { errors } } = useForm<InfosUser>(formOptions);

  const onSubmit = async (data: InfosUser) => {
  };

  return (
    <Container modifiers={['profile_child']}>
      <div className="t-infors_user">
        <ul className="t-infors_user_tab">
          {TabInfo.map((tab, index) => (
            <li className={mapModifiers('t-infors_user_tab_item', tabActive === index && 'active')} key={tab} onClick={() => setTabActive(index)}>{tab}</li>
          ))}
        </ul>
        <div className="t-infors_user_content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CCollapse title="Thông tin cá nhân" key_default="1">
              <Input
                id="fullName"
                label="Họ tên"
                placeholder="Tên dầy đủ"
                type="text"
                disabled={tabActive === 0}
                variant="border8"
                {...register('fullName')}
                error={errors.fullName?.message}
                isRequired={tabActive !== 0}
              />
              <Input
                id="phone"
                label="Số điện thoại"
                placeholder="Số điện thoại"
                type="text"
                disabled={tabActive === 0}
                variant="border8"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                id="email"
                label="Email"
                placeholder="Email"
                type="email"
                disabled={tabActive === 0}
                variant="border8"
                {...register('email')}
                error={errors.email?.message}
              />
            </CCollapse>
            <CCollapse title="Hoạt động" classnameCustom="state" key_default="1">
              <Typography content="Trạng thái" modifiers={['600']} />
              <p className="profile_state_active">Hoạt động</p>
            </CCollapse>
            <CCollapse title="File đính kèm" key_default="1">
              <Input
                id="file"
                label="FIle đính kèm"
                type="file"
                disabled={tabActive === 0}
                variant="border8"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
            </CCollapse>
            {tabActive !== 0 && (
              <div className="t-infors_user_content_btn">
                <Button modifiers={['primary']} type="submit">
                  <Typography content="Cập nhật" modifiers={['700', '18x32', 'capitalize', 'white']} />
                </Button>
                <Button modifiers={['foreign']} type="submit">
                  <Typography content="Hủy" modifiers={['700', '18x32', 'capitalize', 'white']} />
                </Button>
              </div>
            )}

          </form>
        </div>
      </div>
    </Container>
  );
};

InformationUser.defaultProps = {
};

export default InformationUser;
