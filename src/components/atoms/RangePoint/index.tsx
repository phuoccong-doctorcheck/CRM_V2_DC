import { SwapRightOutlined } from '@ant-design/icons';
import React from 'react';

import Input from '../Input';

interface RangePointProps {
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

const RangePoint: React.FC<RangePointProps> = ({ value, onChange }) => {
  const handleInputChange = (index: number, newValue: number) => {
    if (!onChange) return;

    const updatedValue = value ? [...value] : [undefined, undefined];
    updatedValue[index] = Number(newValue || 0);

    onChange(updatedValue as [number, number]);
  };

  return (
    <div className="a-range_point">
      <Input
        variant='simple'
        placeholder='Từ'
        suffix='Điểm'
        type="text"
        value={((value || [])[0] as any)?.toString()}
        onChange={(e) => handleInputChange(0, parseInt(e.target.value.replace(/[^0-9.-]/g, '')))}
      />
      <SwapRightOutlined />
      <Input
        variant='simple'
        placeholder='Đến'
        suffix='Điểm'
        type='text'
        value={((value || [])[1] as any)?.toString()}
        onChange={(e) => handleInputChange(1, parseInt(e.target.value.replace(/[^0-9.-]/g, '')))}
      />
    </div>
  );
};

RangePoint.defaultProps = {};

export default RangePoint;
