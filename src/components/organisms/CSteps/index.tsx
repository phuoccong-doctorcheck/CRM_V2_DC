import { Steps } from 'antd';
import React, { useState, useEffect } from 'react';

interface StepType {
  name: string;
  component: React.ReactNode;
  icon?: React.ReactNode; // thêm icon nếu có
}

interface CStepsProps {
  children?: React.ReactNode;
  active?: number;
  options: StepType[];
  onStepChange?: (newStep: number) => void;
}

const CSteps: React.FC<CStepsProps> = ({
  children, active = 0, options, onStepChange,
}) => {
  const [step, setStep] = useState(active);
  const items = options.map((item) => ({
    key: item.name,
    title: item.name,
  }));  console.log('CSteps options', items);
  useEffect(() => {
    setStep(active); // cập nhật khi prop active thay đổi từ ngoài
  }, [active]);

  const handleChange = (current: number) => {
   // if (current < step) return; // Không cho phép quay lại step trước
    setStep(current);
    onStepChange?.(current);
  };
  return (
  
      <Steps current={step} items={items} onChange={handleChange}  type="default"
  size="default"/>
    
  );
};

CSteps.defaultProps = {
  children: undefined,
};

export default CSteps;
