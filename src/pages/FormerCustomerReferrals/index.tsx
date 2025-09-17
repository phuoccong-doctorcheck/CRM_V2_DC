import { DropdownData } from 'components/atoms/Dropdown';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import React from 'react';

const FormerCustomerReferrals: React.FC = () => {

  return (
    <div className='p-wom'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Quản lí Khách hàng cũ giới thiệu'}
          handleGetTypeSearch={function (type: DropdownData): void {
            throw new Error('Function not implemented.');
          }}
          handleFilter={function (): void {
            throw new Error('Function not implemented.');
          }}
          handleCleanFilter={function (): void {
            throw new Error('Function not implemented.');
          }}
          isHideEmergency
          isDial={false}
          isHideCleanFilter
          isHideFilter
          isHideService
          className='p-wom_header'
        />
      </PublicLayout>
    </div>
  );
}

export default FormerCustomerReferrals;
