import PublicLayout from 'components/templates/PublicLayout';
import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className='p-permission'>
        <div className='p-permission_wrap'>
          <div className='p-permission_404'>
            404
          </div>
          <div className='p-permission_content'>
            <h4 className='p-permission_content_item'>
              Lỗi! Không tìm thấy khách hàng
            </h4>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default ErrorPage;
