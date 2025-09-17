import { Empty } from 'antd';
import React from 'react';

interface CEmptyProps {
  description?: React.ReactNode;
  image?: React.ReactNode;
}

const CEmpty: React.FC<CEmptyProps> = ({ description, image }) => {
  return (
    <div className="">
      <Empty description={description} image={image} />
    </div>
  );
}

// CEmpty.defaultProps = {
// };

export default CEmpty;
