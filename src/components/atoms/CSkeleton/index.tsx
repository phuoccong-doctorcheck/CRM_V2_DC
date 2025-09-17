import { Skeleton } from 'antd';
import React from 'react';
interface CSkeletonProps {
  children?: React.ReactNode;
}

const CSkeleton: React.FC<CSkeletonProps> = ({ children = undefined}) => {
  return (
    <Skeleton.Input active={true} size={'default'} />
  );
}

// CSkeleton.defaultProps = {
//   children: undefined,
// };

export default CSkeleton;
