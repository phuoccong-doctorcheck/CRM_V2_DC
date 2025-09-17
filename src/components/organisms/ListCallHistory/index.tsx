/* eslint-disable @typescript-eslint/no-unused-vars */

import Button from 'components/atoms/Button';
import Dropdown from 'components/atoms/Dropdown';
import RangeDate from 'components/atoms/RangeDate';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import PublicHeader from 'components/templates/PublicHeader';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface ListCallHistoryProps {
  id: string
}

const ListCallHistory: React.FC<ListCallHistoryProps> = ({ id }) => {
  const tableColumns = [
    {
      title: <Typography content="Ngày tạo" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'create_date',
      align: 'center',
      render: (record: any) => (
        <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Tên công việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: '',
      align: 'center',
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['14x20', '400', 'center', 'uppercase']} />
      ),
    },
    {
      title: <Typography content="Nhóm việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: '',
      align: 'center',
      render: (record: any) => (
        <Typography content={record || '---'} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Đảm nhiệm" modifiers={['12x18', '500', 'center']} />,
      dataIndex: '',
      align: 'center',
      render: (record: any) => (
        <Typography content={record ? record.replace(/^.{4}/, '0') : '---'} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Hạn chót (deadline)" modifiers={['12x18', '500', 'center']} />,
      dataIndex: '',
      align: 'center',
      render: (record: any) => (
        <Typography content={record ? record.replace(/^.{4}/, '0') : '---'} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Ghi chú công việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: '',
      align: 'center',
      render: (record: any) => (
        <Typography content={record ? record.replace(/^.{4}/, '0') : '---'} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'status',
      align: 'center',
      render: (record: any) => (
        <Typography
          content="Mới"
          modifiers={['12x18', '400', 'center']}
        />
      ),
    },
  ];
  return (
    <div className="o-call_history">
      <div className="o-call_history_header">
        <PublicHeader
          titlePage=""
          className="o-call_history_header_wrap"
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data: string) => { }}
          isHideFilter
          isUseSearch
          isHideEmergency
          tabLeft={
            (
              <div className="o-call_history_header_wrap_list">
                <RangeDate />
              </div>
            )
          }

        />
      </div>
      <div className="o-call_history_content">
        <PublicTable
          loading={false}
          column={tableColumns}
          listData={[]}
          handleOnDoubleClick={(item: any) => {

          }}
          size="small"
          rowkey="lead_id"
          isbordered
          // isNormal
          isPagination
          handleChangePagination={(page: any, pageSize: any) => {
          }}
        />
      </div>
    </div>
  );
};

ListCallHistory.defaultProps = {
};

export default ListCallHistory;
