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
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword } from 'services/api/Login';
import mapModifiers from 'utils/functions';
import * as Yup from 'yup';

export interface ChangePasswordType {
  password?: string;
  newpassword?: string;
  confirm_password?: string;
}

interface ChangePasswordProps {
}

const TabInfo = ['Thông tin tài khoản', 'Cập nhật thông tin'];

const ChangePassword: React.FC<ChangePasswordProps> = ({ }) => {
  const navigator = useNavigate();
  const [dataChangePassword, setDataChangePassword] = useState('');

  const { mutate: postChangePassword } = useMutation(
    'post-footer-form',
    (newPass: string) => changePassword(newPass),
    {
      onSuccess: (data) => {
        if (data?.status) {
          toast.info(data?.message);
          setDataChangePassword('');
          localStorage.clear();
          sessionStorage.clear();
          navigator('/login');
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀: error --> getCustomerByCustomerId:', error);
      },
    },
  );
  const handleChangePassword = async () => {
    if (!dataChangePassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới')
    } else {
      await postChangePassword(dataChangePassword)
    }
  }


  return (
    <Container modifiers={['profile_child']}>
      <div className="t-infors_user">
        <ul className="t-infors_user_tab hidden-animation" />
        <div className="t-infors_user_content">
          <form >
            <CCollapse title="Đổi mật khẩu" key_default="1">
              <Input
                id="newpassword"
                label="Mật khẩu mới"
                type="password"
                variant="border8"
                isPassword
                value={dataChangePassword}
                onChange={(e): any => setDataChangePassword(e.target.value)}
                handleEnter={handleChangePassword}
              />
            </CCollapse>
            <div className="t-infors_user_content_btn">
              <Button modifiers={['primary']} onClick={handleChangePassword}>
                <Typography content="Cập nhật" modifiers={['700', '18x32', 'capitalize', 'white']} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

ChangePassword.defaultProps = {
};

export default ChangePassword;
