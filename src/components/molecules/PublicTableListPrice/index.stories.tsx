/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import CTooltip from 'components/atoms/CTooltip';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { useAppSelector } from 'store/hooks';

import PublicTable from '.';

export default {
  title: 'Components/molecules/PublicTable',
  component: PublicTable,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PublicTable
    listData={[]}
    column={[
      {
        title: <Typography content="Tiêu đề" modifiers={['12x18', '500', 'center']} />,
        dataIndex: 'cs_guid_title',
        render: (record: any) => (
          <Typography content={record} modifiers={['12x18', '400', 'center']} />
        ),
      },
      {
        title: <Typography content="Ngày cập nhật" modifiers={['12x18', '500', 'center']} />,
        dataIndex: 'update_datetime',
        align: 'center',
        width: 135,
        render: (record: any) => (
          <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['12x18', '400', 'center']} />
        ),
      },
      {
        title: <Typography content="Người cập nhật" modifiers={['12x18', '500', 'center']} />,
        dataIndex: 'update_employee',
        align: 'center',
        width: 135,
        render: (record: any) => (
          <Typography content={record.name} modifiers={['12x18', '400', 'center']} />
        ),
      },
      {
        title: '',
        dataIndex: '',
        align: 'center',
        width: 35,
        render: () => (
          <CTooltip placements="topLeft" title="Xem hướng dẫn">
            <p onClick={() => { }} className="click_event"><Icon iconName="play2" isPointer /></p>
          </CTooltip>
        ),
      },

    ]}
  />
);
