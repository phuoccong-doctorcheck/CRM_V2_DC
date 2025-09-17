/* eslint-disable @typescript-eslint/no-unused-vars */
import { Radio } from 'antd';
import React from 'react';
import { handleRenderGUID } from 'utils/functions';

import Typography from '../Typography';

type LevelRadio = '1' | '2' | '3' | '4' | '5';

export interface GroupRadioType {
  id: any;
  label: string;
  value: any;
  color?: string;
  level?: LevelRadio;
  select?:any
  [x: string]: any;
}
export interface GroupRadioType1 {
  id: any;
  label: string;
  value: number;
  color?: string;
  level?: LevelRadio;
  select?:any
  [x: string]: any;
}

interface GroupRadioProps {
  options: GroupRadioType[];
  handleOnchangeRadio?: (item: GroupRadioType) => void;
  defaultVal?: GroupRadioType;
  value?: GroupRadioType;
  isDisable?: boolean;
  styles?: React.CSSProperties
  handleOnClickRadio?: any
  isStyle?:boolean
}

const GroupRadio: React.FC<GroupRadioProps> = ({
  options, handleOnchangeRadio, defaultVal, value, isDisable,styles,handleOnClickRadio,isStyle
}) => (
  <div className="a-group_radio"  style={styles}>
    <Radio.Group
      onChange={(e: any) => {
        if (handleOnchangeRadio) {
          const data = options.find((ix) => ix.value === e.target.value);
          handleOnchangeRadio(data as GroupRadioType);
        }
      }}
      defaultValue={defaultVal?.value}
      disabled={isDisable}
      value={value?.value}
      style={styles}
      
    >
      {options.length && options.map((item) => (
        <Radio key={`${item.id}-${handleRenderGUID()}`} value={item.value} onClick={handleOnClickRadio} style={{ marginRight: isStyle ? "40px" : undefined }}>
          <Typography content={item.label} styles={{ color: item?.color || '#04566e' }} />
        </Radio>
      ))}
    </Radio.Group>
  </div>
);

GroupRadio.defaultProps = {
};

export default GroupRadio;
