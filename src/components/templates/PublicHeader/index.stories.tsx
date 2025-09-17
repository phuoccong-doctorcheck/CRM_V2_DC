import { Story, Meta } from '@storybook/react';
import { HeaderExcel } from 'assets/data';
import Button from 'components/atoms/Button';
import Typography from 'components/atoms/Typography';
import React from 'react';
import { CSVLink } from 'react-csv';

import PublicHeader from '.';

export default {
  title: 'Components/templates/PublicHeader',
  component: PublicHeader,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ margin: '50px 0' }}>
    <PublicHeader
      titlePage="Đặt vé"
      placeholderSearch="Tìm kiếm phim"
      handleFilter={() => { }}
      handleCleanFilter={() => { }}
      handleGetTypeSearch={() => { }}
      handleOnClickSearch={() => { }}
      listBtn={
        (
          <Button modifiers={['foreign']} id="ticket_add">
            <CSVLink headers={HeaderExcel} data={[]}>
              <Typography content="Xuất excel" modifiers={['400', 'white']} />
            </CSVLink>
          </Button>
        )
      }
    />
  </div>
);
