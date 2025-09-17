import { FloatButton } from 'antd';
import React from 'react';

type FloatButtonType = 'default' | 'primary';
type FloatButtonShape = 'circle' | 'square';

interface FloatOptionType {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  type?: FloatButtonType;
  shape?: FloatButtonShape;
  tooltip?: string | React.ReactNode;
  href?: string;
  target?: string;
  handleClick: () => void;
  badge?: object;
}

interface CFloatButtonProps {
  children?: React.ReactNode;
  icons?: React.ReactNode;
  option: FloatOptionType[];
}

const CFloatButton: React.FC<CFloatButtonProps> = ({ children, icons, option }) => {
  return (
    <div className="a-float_button">
      <FloatButton.Group
        icon={icons}
        trigger="click"
        type="primary"
        shape='circle'
      >
        {
          option.length ? option?.map((button, index) => (
            <FloatButton
              key={index}
              href={button.href}
              tooltip={button.tooltip}
              icon={button.icon}
              badge={button.badge}
              onClick={button.handleClick}
              type={button.type}
              shape={button.shape}
              description={button.description}
              target={button.target}
            />
          )) : null
        }
      </FloatButton.Group>
    </div>
  );
}

CFloatButton.defaultProps = {
  children: undefined,
};

export default CFloatButton;
