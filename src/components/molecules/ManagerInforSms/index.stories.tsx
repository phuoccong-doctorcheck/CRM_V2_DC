import { Story, Meta } from '@storybook/react';
import React from 'react';

import ManagerInforSms from '.';

export default {
  title: 'Components/molecules/ManagerInforSms',
  component: ManagerInforSms,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ margin: 22 }}>
    <ManagerInforSms
      type="sms"
      optionForSMS={[
        {
          id: 1,
          name: 'dsa',
          apiKey: '2387-3223-32432-2334',
          secretKey: 'adsd2-2332c-322f4-234r32-322aa',
          smsType: 'sjs',
          branchName: 'jsj',
          phone: '0293749273',
          isDisable: false,
        },
        {
          id: 2,
          name: '123121',
          apiKey: '2387-3223-32432-2334',
          secretKey: 'adsd2-2332c-322f4-234r32-322aa',
          smsType: 'sjs',
          branchName: 'jsj',
          phone: '0293749273',
          isDisable: false,
        },
        {
          id: 3,
          name: '34324112e',
          apiKey: '2387-3223-32432-2334',
          secretKey: 'adsd2-2332c-322f4-234r32-322aa',
          smsType: 'sjs',
          branchName: 'jsj',
          phone: '0293749273',
          isDisable: false,
        },
      ]}
    />
  </div>
);
