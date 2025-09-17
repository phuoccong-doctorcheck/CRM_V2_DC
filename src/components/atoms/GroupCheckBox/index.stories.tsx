/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import GroupCheckBox from '.';

export default {
  title: 'Components/atoms/GroupCheckBox',
  component: GroupCheckBox,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const option = [
    {
      label: 'Test 1',
      value: '1',
    },
    {
      label: 'Test 2',
      value: '2',
    },
    {
      label: 'Test 3',
      value: '3',
    },
  ];
  const [data, setData] = useState([]);
  return (
    <GroupCheckBox
      options={option}
      defaultVal={[]}
      values={data}
      onChange={(any: any) => {
        setData(data.concat(any));
      }}
    />
  );
};
