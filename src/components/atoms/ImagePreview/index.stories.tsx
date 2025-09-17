/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import ImagePreview from '.';

export default {
  title: 'Components/atoms/ImagePreview',
  component: ImagePreview,
  argTypes: {},
} as Meta;

export const normal: Story = () => {
  const [open, setOpen] = useState(true)
  return (
    <ImagePreview
      options={[
        { original: 'https://imaging.doctorcheck.online:8899/2023/24082023/DC23051511120013/20230824093758_nguyenquocdai_example2.png' },
        { original: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp', },
        { original: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp', },
      ]}
      isOpen={open}
      handleClose={() => setOpen(false)}
    />
  );
}
