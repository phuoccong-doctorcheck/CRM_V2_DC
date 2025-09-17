import { Story, Meta } from '@storybook/react';
import React from 'react';

import AudioPlayer from '.';

export default {
  title: 'Components/molecules/AudioPlayer',
  component: AudioPlayer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <AudioPlayer audioSrc={"https://91.cloudfone.vn/Home?ID=U1%2f%2b61tz%2f2Tloau8xBLRm30Tf%2bMfXb7uN4pN7bnsXYz37EtLVfdhzfgO6qwFd9Y7OlnSbPLF4V3PRBNbJidiermIAgsn9myISvIuHDpiPqc%3d"} duration={undefined || 0} />
);
