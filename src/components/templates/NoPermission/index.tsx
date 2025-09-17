import React from 'react';

import PublicLayout from '../PublicLayout';

interface NoPermissionProps {
}

const NoPermission: React.FC<NoPermissionProps> = ({ }) => {
  return (
    <PublicLayout>
      <div className='p-permission'>
        <div className='p-permission_wrap'>
          <div className='p-permission_404'>
            404
          </div>
          <div className='p-permission_content'>
            <h4 className='p-permission_content_item'>
              Lỗi! Quyền truy cập bị từ chối.
            </h4>
            <p className='p-permission_content_item'>
              Bạn chưa được cấp quyền để truy cập vào đường dẫn này.
            </p>
            <span className='p-permission_content_item'>
              Xin chắc chắn rằng bạn phải được cấp quyền để truy cập đường dẫn này. Vui lòng liên hệ Quản trị để được cấp quyền hoặc trở về <a href='/conversion' onClick={() => {
                sessionStorage.setItem('indexMenu', '0');
              }}>Màn hình chính</a> của bạn.
            </span>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

NoPermission.defaultProps = {
};

export default NoPermission;
