/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/button-has-type */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import CModal from '.';

export default {
  title: 'Components/organisms/CModal',
  component: CModal,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <CModal
        isOpen
        onCancel={() => { }}
        onOk={() => { }}
        textCancel="1"
        textOK="2"
        title="Hello world"
      >
        Hello world
      </CModal>
    </>
  );
};
