import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import React, { useLayoutEffect } from 'react';

const ApproveCommissions: React.FC = () => {

  useLayoutEffect(() => {
    document.title = "Duyệt hoa hồng | CRM";
  }, [])

  return (
    <PublicLayout>
      <div className='p-approve_commissions'>
        <PublicHeader
          titlePage={'Duyệt hoa hồng'}
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          isHideCleanFilter
          isHideLibraly
          isHideSearch
          isHideEmergency
          isHideFilter
          isHideService
          isDial={false}
          className='p-approve_commissions_header'
        />
      </div>
    </PublicLayout>
  );
}

export default ApproveCommissions;
