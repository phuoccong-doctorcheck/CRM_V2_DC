/* eslint-disable import/no-named-as-default */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import Button from 'components/atoms/Button';
import React, { useState } from 'react';

import CTabs, { CTab, TabPanel } from '.';

export default {
  title: 'Components/organisms/CTabs',
  component: CTabs,
  argTypes: {},
} as Meta;

const dummyData = [
  {
    label: 'HỘI ĐỒNG QUẢN TRỊ',
    content: 'Content 1',
  },
  {
    label: 'BAN TỔNG GIÁM ĐỐC',
    content: 'Content 2',
  },
  {
    label: 'GIÁM ĐỐC CÁC BAN CHUYÊN MÔN',
    content: <Button name="hihi">test</Button>,
  },
];

export const normal: Story = () => {
  const [indexActive, setIndexActive] = useState(0);

  return (
    <div style={{ margin: 50, display: 'flex' }}>
      <CTabs variableMutate={indexActive} type="default">
        {
          dummyData.map((item, index) => (
            <CTab
              type="default"
              key={`tab-${index.toString()}`}
              label={item.label}
              active={index === indexActive}
              handleClick={() => setIndexActive(index)}
            />
          ))
        }
      </CTabs>
      {
        dummyData.map((item, index) => (
          <TabPanel key={`tab-panel-${index.toString()}`} active={index === indexActive}>
            {item.content}
          </TabPanel>
        ))
      }
    </div>
  );
};
