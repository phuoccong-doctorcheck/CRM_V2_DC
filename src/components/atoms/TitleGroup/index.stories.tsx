/* eslint-disable max-len */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import TitleGroup from '.';

export default {
  title: 'Components/atoms/TitleGroup',
  component: TitleGroup,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <TitleGroup lable="Hồ sơ bệnh án">
    What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    It has survived not only five centuries,
    but also the leap into electronic typesetting, remaining essentially unchanged.
    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
  </TitleGroup>
);
