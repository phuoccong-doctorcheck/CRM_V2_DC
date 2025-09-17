import React from 'react';
import mapModifiers from 'utils/functions';

import Typography from '../Typography';

interface TitleGroupProps {
  children?: React.ReactNode;
  lable?: string;
  className?: string;
}

const TitleGroup: React.FC<TitleGroupProps> = ({ children, lable, className }) => (
  <div className={mapModifiers('a-title_group', className)}>
    <div className="a-title_group_title">
      <Typography content={lable} />
    </div>
    <div className="a-title_group_child">
      {children}
    </div>
  </div>
);

TitleGroup.defaultProps = {
  children: undefined,
};

export default TitleGroup;
