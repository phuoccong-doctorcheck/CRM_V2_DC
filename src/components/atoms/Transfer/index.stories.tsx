/* eslint-disable import/no-named-as-default */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import Transfer from '.';

export default {
  title: 'Components/atoms/Transfer',
  component: Transfer,
  argTypes: {},
} as Meta;
export const listss = [
  {
    groupId: 1,
    tagGroup: 'symptom',
    tagGroupName: 'Triệu chứng',
    child: [
      {
        tag_id: 11,
        tag_name: 'Đau bụng',
        tag_color: '#99D9EA',
        orderNumber: 1,
      },
      {
        tag_id: 12,
        tag_name: 'Đau bụng mạn tính',
        tag_color: '#99D9EA',
        orderNumber: 2,
      },
      {
        tag_id: 13,
        tag_name: 'Ợ hơi',
        tag_color: '#99D9EA',
        orderNumber: 3,
      },
      {
        tag_id: 14,
        tag_name: 'Ợ chua',
        tag_color: '#99D9EA',
        orderNumber: 4,
      },
      {
        tag_id: 15,
        tag_name: 'Ợ nóng',
        tag_color: '#99D9EA',
        orderNumber: 5,
      }],
  },
  {
    groupId: 2,
    tagGroup: 'symptom',
    tagGroupName: 'Dạ dày',
    child: [
      {
        tag_id: 21,
        tag_name: 'Đau bụng',
        tag_color: '#99D9EA',
        orderNumber: 1,
      },
      {
        tag_id: 22,
        tag_name: 'Đau bụng mạn tính',
        tag_color: '#99D9EA',
        orderNumber: 2,
      },
      {
        tag_id: 23,
        tag_name: 'Ợ hơi',
        tag_color: '#99D9EA',
        orderNumber: 3,
      },
      {
        tag_id: 24,
        tag_name: 'Ợ chua',
        tag_color: '#99D9EA',
        orderNumber: 4,
      },
      {
        tag_id: 25,
        tag_name: 'Ợ nóng',
        tag_color: '#99D9EA',
        orderNumber: 5,
      }],
  },
  {
    groupId: 3,
    tagGroup: 'symptom',
    tagGroupName: 'Gan',
    child: [
      {
        tag_id: 31,
        tag_name: 'Đau bụng',
        tag_color: '#99D9EA',
        orderNumber: 1,
      },
      {
        tag_id: 32,
        tag_name: 'Đau bụng mạn tính',
        tag_color: '#99D9EA',
        orderNumber: 2,
      },
      {
        tag_id: 33,
        tag_name: 'Ợ hơi',
        tag_color: '#99D9EA',
        orderNumber: 3,
      },
      {
        tag_id: 34,
        tag_name: 'Ợ chua',
        tag_color: '#99D9EA',
        orderNumber: 4,
      },
      {
        tag_id: 35,
        tag_name: 'Ợ nóng',
        tag_color: '#99D9EA',
        orderNumber: 5,
      }],
  },
  {
    groupId: 4,
    tagGroup: 'symptom',
    tagGroupName: 'Tá tràng',
    child: [
      {
        tag_id: 41,
        tag_name: 'Đau bụng',
        tag_color: '#99D9EA',
        orderNumber: 1,
      },
      {
        tag_id: 42,
        tag_name: 'Đau bụng mạn tính',
        tag_color: '#99D9EA',
        orderNumber: 2,
      },
      {
        tag_id: 43,
        tag_name: 'Ợ hơi',
        tag_color: '#99D9EA',
        orderNumber: 3,
      },
      {
        tag_id: 44,
        tag_name: 'Ợ chua',
        tag_color: '#99D9EA',
        orderNumber: 4,
      },
      {
        tag_id: 45,
        tag_name: 'Ợ nóng',
        tag_color: '#99D9EA',
        orderNumber: 5,
      }],
  },
];
export const normal: Story = () => (
  <Transfer dataSource={listss} isOpen widths={700} title="Đây là title của Transfer" />
);
