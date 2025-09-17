import Loading from 'components/atoms/Loading';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PagePending  = () => {
  const navigator = useNavigate();
  const checkToken = Cookies.get('token');

  useEffect(() => {
    if (!checkToken) {
      const timeOut = setTimeout(() => {
        navigator('/login');
      }, 1500);

      return () => {
        clearTimeout(timeOut)
      }
    }
  }, []);

  return (
    <div className='p-pending'>
      <Loading variant="fullScreen" isShow size="medium" />
    </div>
  );

}
export default PagePending;
