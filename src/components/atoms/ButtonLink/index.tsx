import React from 'react';

import Icon from '../Icon';
import Typography from '../Typography';

interface ButtonLinkProps {
}

const ButtonLink: React.FC<ButtonLinkProps> = (props) => (
  <div className="a-button_link" {...props}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Typography content="Thêm trang liên kết" />
      <Icon iconName="link" size="14x14" />
    </div>
  </div>
);

ButtonLink.defaultProps = {
};

export default ButtonLink;
