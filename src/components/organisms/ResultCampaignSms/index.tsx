import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import moment from 'moment';
import React from 'react';

interface ResultCampaignSmsProps {
  listCampaignDetail: any[];
}

const ResultCampaignSms: React.FC<ResultCampaignSmsProps> = ({ listCampaignDetail }) => {


  const columnTableDetail = [
    {
      title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
      align: "center",
      dataIndex: "index",
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Ngày gửi" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'send_date',
      align: 'center',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record ? moment(record).format('HH:mm DD-MM-YYYY') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Mã khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_ref',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Tên khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_name',
      width: 240,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Số điện thoại" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'customer_phone',
      width: 240,
      filters: [
        { text: 'Tất cả', value: 'all' },
        { text: 'Số điện thoại hợp lệ', value: 'isPhoneNumber' },
        { text: 'Số điện thoại không hợp lệ', value: 'isNotPhoneNumber' },
      ],
      onFilter: (value: any, record: any) => {
        console.log("🚀 ~ record:", !record.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/));
        switch (value) {
          case 'isPhoneNumber':
            return !!record.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/);
          case 'isNotPhoneNumber':
            return !record.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/);
          case 'all':
            return true;
          default:
            return false;
        }
      },
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record ? record.replace('+84-', '0') : ''} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Nội dung" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'content',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '500', 'black', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Hình thức gửi" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'method',
      align: 'center',
      ellipsis: true,
      width: 100,
      fixed: 'right',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      filters: [
        { text: 'OK', value: 'OK' },
        { text: 'FAILED', value: 'FAILED' },
      ],
      onFilter: (value: any, record: any) => {
        return record?.status == value
      },
      fixed: 'right',
      width: 120,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', record ? 'green' : 'cg-red']} />
        </div>
      ),
    },
    {
      title: <Typography content="Số lần gửi" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'count',
      align: 'center',
      ellipsis: true,
      fixed: 'right',
      width: 100,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record} modifiers={['13x18', '600', 'center', record ? 'green' : 'cg-red']} />
        </div>
      ),
    },
    {
      title: <Typography content="Chi phí (VNĐ)" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'cost',
      align: 'center',
      ellipsis: true,
      fixed: 'right',
      width: 140,
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item">
          <Typography content={record.toLocaleString('vi-VN')} modifiers={['13x18', '600', 'center',]} />
        </div>
      ),
    },
  ];

  return (
    <div className="m-result_campaign">
      <PublicTable
        listData={listCampaignDetail}
        column={columnTableDetail}
        // isHideRowSelect
        isPagination
        pageSizes={500}
        // virtual
        rowkey={'customer_ref'}
        handleSelectRow={(record: any, selected: any, selectedRows: any, nativeEvent: any) => {
          console.log("🚀 ~ selectedRows:", selectedRows)
        }}
        handleSelectAllRow={(selected: any, selectedRows: any, changeRows: any) => {
          console.log("🚀 ~ selectedRows:", selectedRows)
        }}
        handleSelectMultiple={(selected: any, selectedRows: any, changeRows: any) => {
          console.log("🚀 ~ selectedRows:", selectedRows)
        }}
      />
    </div>
  );
}

// ResultCampaignSms.defaultProps = {
// };

const MemoizedResultCampaignSMS = React.memo(ResultCampaignSms);

export default MemoizedResultCampaignSMS;