import { Tooltip } from 'antd';
import React from 'react';

export type Cplacement = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

interface CTooltipProps {
  children?: React.ReactNode;
  placements: Cplacement;
  title: string | React.ReactNode;
  colorCustom?: string;
  overlayClassName?: string;
}

const CTooltip: React.FC<CTooltipProps> = ({
  children, placements, title, colorCustom, overlayClassName
}) => (
  <Tooltip
    placement={placements}
    title={title}
    color={colorCustom}
    overlayClassName={overlayClassName}
  >
    {children}
  </Tooltip>
);

CTooltip.defaultProps = {
  children: undefined,
  placements: 'topLeft',
  colorCustom: '#6ea5db',
};

export default CTooltip;
