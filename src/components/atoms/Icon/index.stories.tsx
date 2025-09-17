/* eslint-disable import/no-named-as-default */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import Icon, { IconName } from '.';

export default {
  title: 'Components/atoms/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['20x20', '24x24'],
      },
      defaultValue: '24x24',
    },
  },
} as Meta;

const listIcon = [
  'search',
  'dropDown',
  'bell',
  'Earth',
  'home',
  'user',
  'England',
  'home',
  'Korea',
  'user',
  'VietNam',
  'close',
  'errorOutline',
  'successOutline',
  'add',
  'cancel',
  'chevronLeft',
  'chevronRight',
  'hamburger',
  'dropDown_blue',
  'clock',
  'calendar',
  'doneall',
  'right',
  'left_feild',
  'addInput',
  'calendar_white',
  'setting',
  'tag',
  'showpass',
  'hidepass',
  'message',
  'right_feild',
  'drop_up',
  'timezone',
  'loading_notify',
  'done_notify',
  'circle_half',
  'confirm',
  'cancelimage',
  'edit',
  'cancel_notify',
  'task_notify',
  'department_list',
  'logout',
  'file',
  'edit_dept',
  'delete_item',
  'sidebar_menu',
  'save_all',
  'dept_mail',
  'dept_info',
  'dept_phone',
  'micro',
  'addgroup',
  'filter',
  'download',

];

export const normal: Story = ({ size }) => (
  <div style={{
    backgroundColor: '#ddd',
    padding: 10,
    display: 'flex',
    flexWrap: 'wrap',
  }}
  >
    {listIcon.map((item) => (
      <div
        key={item}
        style={{ marginLeft: 10 }}
      >
        <Icon size={size} iconName={item as IconName} />
      </div>
    ))}
  </div>
);
