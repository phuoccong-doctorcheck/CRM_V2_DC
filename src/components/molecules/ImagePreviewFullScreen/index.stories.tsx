import { Story, Meta } from '@storybook/react';
import React from 'react';

import ImagePreviewFullScreen from '.';

export default {
  title: 'Components/molecules/ImagePreviewFullScreen',
  component: ImagePreviewFullScreen,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ImagePreviewFullScreen urlImage='https://doctorcheck-my.sharepoint.com/:i:/g/personal/quocdai_nguyen_doctorcheck_vn/ERXhW7tQr9JGu8x8AKgYOK8B-3pqxmlhz19wTy0Do6jtqg?e=0HRpmC' />
);
