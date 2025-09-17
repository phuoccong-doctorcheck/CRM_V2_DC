import React from 'react';

interface ManagerCampaignProps {
  children?: React.ReactNode;
}

const ManagerCampaign: React.FC<ManagerCampaignProps> = ({ children = undefined  }) => {
  return (
    <div className="">
      ManagerCampaign
      {children}
    </div>
  );
}

// ManagerCampaign.defaultProps = {
//   children: undefined,
// };

const MemoizedManagerCampaign = React.memo(ManagerCampaign);

export default MemoizedManagerCampaign;
