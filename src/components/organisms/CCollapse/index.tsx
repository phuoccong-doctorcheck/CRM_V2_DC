/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/button-has-type */
import { Collapse } from 'antd';
import Input from 'components/atoms/Input';
import Typography from 'components/atoms/Typography';
import React, { useState } from 'react';
import mapModifiers from 'utils/functions';

const { Panel } = Collapse;
type Keydefault = '0' | '1';
type Variant = 'default' | 'todo';

interface CCollapseProps {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  footerCustom?: React.ReactNode;
  title: string | React.ReactNode;
  classnameCustom?: string;
  key_default?: Keydefault;
  handleOnChange?: () => void;
  typeCollapse?: Variant;
  handleAddStepTodo?: (item: string) => void;
  isDisableAddStep?: boolean;
  handleClickHeader?: () => void;
}

const CCollapse: React.FC<CCollapseProps> = ({
  children, title, classnameCustom, key_default,
  handleOnChange, footer, footerCustom, handleClickHeader,
  typeCollapse, handleAddStepTodo, isDisableAddStep, ...props
}) => {
  const [valueStep, setValueStep] = useState('');
  return (
    <div className={mapModifiers(
      'o-collapse',
      typeCollapse,
    )}
    >
      <Collapse
        defaultActiveKey={[key_default as string]}
        bordered
        expandIconPosition="end"
        accordion
        onChange={handleOnChange}
        {...props}
      >
        <Panel
          header={(
            typeof title === 'string' ?
              <p onClick={handleClickHeader}>
                <Typography content={title} />
              </p> : title
          )}
          key="1"
          className={mapModifiers('o-collapse_panel', classnameCustom)}
        >
          {children}
          {footerCustom || (
            <div className="o-collapse_footer">
              {footer}
            </div>
          )}
          {typeCollapse === 'todo' && (
            <Input
              id="step_todo"
              variant="todo_list"
              placeholder="Thêm các bước cần thực hiện"
              iconName="plus"
              iconSize="25x25"
              disabled={isDisableAddStep}
              value={valueStep}
              onChange={(e) => setValueStep(e.target.value)}
              handleClickIcon={() => {
                if (handleAddStepTodo) {
                  handleAddStepTodo(valueStep);
                  setValueStep('');
                }
              }}
              onKeyPress={(e) => {
                if (e.code === 'Enter' && handleAddStepTodo) {
                  handleAddStepTodo(valueStep);
                  setValueStep('');
                }
              }}
            />
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

CCollapse.defaultProps = {
  children: undefined,
  typeCollapse: 'default',
};

export default CCollapse;
