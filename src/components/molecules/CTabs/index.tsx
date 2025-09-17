import { Tabs } from 'antd';
import React from 'react';
import mapModifiers from 'utils/functions';

type Size = 'large' | 'middle' | 'small';
type Position = 'top' | 'right' | 'bottom' | 'left';
type TypeCTabs = 'line' | 'card' | 'editable-card';
type Style = 'default' | 'style' | 'simple';

export interface TabItemType {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  [x: string]: any;
}

interface CTabsProps {
  options: TabItemType[],
  defaultActiveKey?: string,
  animated?: boolean,
  centered?: boolean,
  size?: Size,
  position?: Position,
  type?: TypeCTabs,
  variant?: Style,
  onChange?: () => void,
  handleOnTabClick?: (data: any) => void
}

const CTabs: React.FC<CTabsProps> = ({
  options, onChange, defaultActiveKey, animated, centered, size, position, handleOnTabClick, type, variant
}) => (
  <div className={mapModifiers("m-ctabs", variant)}>
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={options}
      animated={animated}
      centered={centered}
      hideAdd
      size={size}
      tabPosition={position}
      onChange={onChange}
      onTabClick={(key: string, event: any) => {
        if (handleOnTabClick) handleOnTabClick(options[Number(key) - 1])
      }}
      type={type}
    />
  </div>
);

CTabs.defaultProps = {
  defaultActiveKey: '1',
  size: 'middle',
  animated: true,
  variant: 'default',
};

export default CTabs;
