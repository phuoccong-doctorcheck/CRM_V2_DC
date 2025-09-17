/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import Button from 'components/atoms/Button';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithAccount } from 'services/api/Login';
import { InfoUserType } from 'services/types';
import { getMyTask } from 'store/customerInfo';
import { isLoading, isLogined } from 'store/example';
import {
  setInforUser,
  setInfoUserAgent,
  setRoleUser,
  setShortName,
  setTokenUser,
} from 'store/home';
import { useAppDispatch } from 'store/hooks';

interface FormLoginProps {
  children?: React.ReactNode;
}

const LoginAccount: React.FC<FormLoginProps> = () => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [dataLogin, setDataLogin] = useState({
    username: '', password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ username: '', password: '' });

  const { mutate: loginAccount } = useMutation(
    'post-footer-form',
    (data: any) => loginWithAccount(data),
    {
      onSuccess: (data: any) => new Promise((resolve, reject) => {
        try {
          setLoading(false);
          const {
            roles, lastname, employee_signature_name, employee_id, fullname, employee_team_id, username, department_id, mainscreen, erp_code, token, employee_group, user_call_agent, user_country_id, user_country_phone_prefix, pancakeToken, ...prevData
          } = data.data;
          Cookies.set('token', `DC${token}`);
          Cookies.set('repository', JSON.stringify({
            username: username,
            employee_id: employee_id,
            department_id: department_id,
            fullname: fullname,
            lastname: lastname,
            mainscreen: mainscreen,
            token: token,
            employee_group: employee_group,
            employee_team_id: employee_team_id,
            user_country_id: user_country_id,
            user_country_phone_prefix: user_country_phone_prefix,
            avatar: null
          }), { expires: new Date(new Date().getTime() + (20 * 60 * 60 * 1000)) }); // thời gian hết hạn là 20 giờ
          const newRole: any[] = [
            ...roles,
            ["quocthinh.le"].includes(username) ? {
              role_name: "directer",
              role_display_name: "bot",
              menu_display_name: "bot",
              menu_display_icon: "fas fa-question-circle",
              menu_type: "all",
              menu_order_number: 10,
              module: "bot",
              is_default: false
            } :
              {
                role_name: "normal",
                role_display_name: "CS",
                menu_display_name: "CS",
                menu_display_icon: "fas fa-question-circle",
                menu_type: "all",
                menu_order_number: 3,
                module: "admincs",
                is_default: false
              },
            employee_team_id === "BOD" && {
              role_name: "BOD",
              role_display_name: "bot",
              menu_display_name: "bot",
              menu_display_icon: "fas fa-question-circle",
              menu_type: "all",
              menu_order_number: 10,
              module: "bot",
              is_default: false
            },
          ];
          dispatch(setTokenUser(`DC${prevData.token}`));
          dispatch(getMyTask({ task_status: 'inprogress', isAssignMe: false }));
          Cookies.set('islogin', `${true}`);
          Cookies.set('lastname', lastname);
          Cookies.set('username', username);
          Cookies.set('fullname', fullname);
          Cookies.set('signature_name', employee_signature_name);
          localStorage.setItem('setResource', '1');
          localStorage.setItem('employee_id', employee_id);
          Cookies.set('employee_team', employee_team_id);
          Cookies.set('user_call_agent', user_call_agent);
          localStorage.setItem('roles', JSON.stringify(newRole));
          sessionStorage.setItem('indexMenu', '0')
          localStorage.setItem('pancakeToken', pancakeToken)
          localStorage.setItem('erp_code', erp_code)
          dispatch(isLogined(true));
          dispatch(isLoading(true));
          dispatch(setShortName(lastname));
          dispatch(setRoleUser(newRole));
          dispatch(setInforUser(prevData as InfoUserType));
          navigator('/');
          resolve(true);
        } catch (err) {
          console.log("🚀 ~ file: index.tsx:96 ~ onSuccess: ~ err:", err)
          reject(err);
        }
      }),
      onError: () => {
        setError({ username: 'Tài khoản không chính xác !', password: 'Mật khẩu không chính xác !' });
        toast.error('Vui lòng kiểm tra lại tài khoản và mật khẩu');
        setLoading(false);
      },
    },
  );

  const handleValidate = () => {
    if (!dataLogin.username?.trim() || !dataLogin.password?.trim()) {
      if (!dataLogin.password.trim()) {
        setError({ ...error, password: !dataLogin.password?.trim() ? 'Mật khẩu là trường bắt buộc !' : '', username: !dataLogin.username?.trim() ? 'Tài khoản là trường bắt buộc !' : '' });
      }
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!handleValidate()) return;
    setError({ username: '', password: '' });
    setLoading(true);
    await loginAccount({ userName: dataLogin.username, passwords: dataLogin.password });
  };

  return (
    <div className="t-loginaccount">
      <form>
        <Input
          id="user_name"
          placeholder="Tài khoản đăng nhập"
          label="Tên đăng nhập"
          autoFocus
          onChange={(e) => {
            setDataLogin({ ...dataLogin, username: e.target.value });
            setError({ ...error, username: '' });
          }}
          error={error.username}
          handleEnter={onSubmit}
          variant="simple"
          value={dataLogin.username}
        />

        <Input
          id="_password"
          placeholder="Mật khẩu"
          label="Mật khẩu"
          type="password"
          isPassword
          onChange={(e) => {
            setDataLogin({ ...dataLogin, password: e.target.value });
            setError({ ...error, password: '' });
          }}
          error={error.password}
          handleEnter={onSubmit}
          variant="simple"
          value={dataLogin.password}
        />
        <div className="t-loginaccount_btn">
          <Button modifiers={['foreign']} isLoading={loading} disabled={loading} onClick={onSubmit}>
            <Typography
              content="đăng nhập"
              modifiers={['500', '18x32', 'capitalize', 'white']}
            />
          </Button>
        </div>
      </form>
    </div>
  );
};

LoginAccount.defaultProps = {
  children: undefined,
};

export default LoginAccount;
