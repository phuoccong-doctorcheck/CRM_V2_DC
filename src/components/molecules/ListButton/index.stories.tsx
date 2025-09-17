/* eslint-disable @typescript-eslint/no-unused-vars */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import ListButton, { ItemButtonType } from '.';

export default {
  title: 'Components/molecules/ListButton',
  component: ListButton,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const listBtn: ItemButtonType[] = [
    {
      title: 'Thêm ghi chú',
      titlePlacement: 'top',
      icon: 'add_crm',
      iconSizes: '24x24',
      handleClick: (item?: any) => { },
    },
    {
      title: 'Tiếp nhận',
      titlePlacement: 'top',
      icon: 'accept_crm',
      iconSizes: '24x24',
      handleClick: (item?: any) => { },
    },
    {
      title: 'Chỉnh sửa thông tin',
      titlePlacement: 'bottom',
      icon: 'edit_info',
      iconSizes: '24x24',
      handleClick: (item?: any) => { },
    },
    {
      title: 'Trò chuyện',
      titlePlacement: 'bottom',
      icon: 'calendar',
      iconSizes: '24x24',
      handleClick: (item?: any) => { },
    },
  ];
  return (
    <div style={{ padding: 190 }}>
      <ListButton iconName="hamburger" listChildren={listBtn} />
    </div>
  );
};
