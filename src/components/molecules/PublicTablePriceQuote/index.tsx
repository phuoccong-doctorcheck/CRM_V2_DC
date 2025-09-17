/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ColumnsType } from 'antd/es/table';
import CEmpty from 'components/atoms/CEmpty';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from 'utils/functions';

import { border8 } from '../../atoms/Input2/index.stories';

// Định nghĩa kiểu dữ liệu
type TableLayoutType = 'auto' | 'fixed' | undefined;
type RowSelectType = 'checkbox' | 'radio';

interface PublicTableProps {
  listData: any;
  listDataT?: any;
  loading?: boolean;
  column: any;
  rowkey?: any;
  heightTable?: number | any;
  size?: SizeType;
  pageSizes?: number;
  tableLayout?: TableLayoutType;
  isPagination?: boolean;
  isbordered?: boolean;
  isNormal?: boolean;
  totalItem?: number;
  isExpandable?: boolean;
  expandedRowKey?: string[];
  rowSelectType?: RowSelectType;
  hideSelectAllRow?: boolean;
  isSimpleHeader?: boolean;
  isHideRowSelect?: boolean;
  isHideHeader?: boolean;
  textHeader?: string;
  className?: string;
  expandedRowKeys?: string[] | number[];
  isHideBody?: boolean;
  showExpandColumn?: boolean;
  defaultExpandAllRow?: boolean;
  virtual?: boolean;
  scroll?: object;
  tableRef?: React.RefObject<HTMLDivElement>;
  handleChangePagination?: (page: any, pageSize: any) => void;
  expandedRender?: (record: any, index: any, indent: any, expanded: any) => React.ReactNode;
  rowClassNames?: (record: any, index: any) => string;
  expandedRowClassNames?: (record: any, index: any, indent: any) => string;
  handleOnClick?: (event: any, record: any, rowIndex: any) => void;
  handleOnDoubleClick?: (event: any, record: any, rowIndex: any) => void;
  handleOnContextMenu?: (event: any, record: any, rowIndex: any) => void;
  handleOnClickHeaderRow?: (record: any) => void;
  handleOnchange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
  handleSelectRow?: (record: any, selected: any, selectedRows: any, nativeEvent: any) => void;
  handleSelectAllRow?: (selected: any, selectedRows: any, changeRows: any) => void;
  handleSelectMultiple?: (selected: any, selectedRows: any, changeRows: any) => void;
  onExpand?:(expanded:any, record:any) => void
}

const PublicTablePriceQuote: React.FC<PublicTableProps> = ({
  listData,listDataT, loading, column, rowkey, size, pageSizes, tableLayout, isPagination, heightTable, showExpandColumn, virtual,
  handleOnClick, handleOnDoubleClick, handleOnContextMenu, handleOnClickHeaderRow, isbordered, isNormal, className,
  handleChangePagination, totalItem, isExpandable, expandedRowKey, expandedRender, rowSelectType, hideSelectAllRow,
  isSimpleHeader, isHideRowSelect, isHideHeader, textHeader, isHideBody, rowClassNames, expandedRowClassNames,
  defaultExpandAllRow, scroll, handleOnchange, tableRef, handleSelectRow, handleSelectAllRow, expandedRowKeys, handleSelectMultiple,onExpand,
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>();
  // myRowSelection định nghĩa các hành động khi chọn dòng hoặc chọn nhiều dòng.
  const myRowSelection = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
    },
    onSelectMultiple: (selected: boolean, selectedRows: any[], changeRows: any[]) => { },
  };
  const handleExpand = (expanded: boolean, record: any) => {
    if (onExpand) {
      onExpand(expanded, record);
    }
  };
  console.log(listDataT);  
  return (
    <div className={mapModifiers('m-public_table', isNormal && 'small', isSimpleHeader && 'simple', isHideBody && 'hide_body', !textHeader?.trim() && 'hide_title')}>
      <Table
        columns={column}
        // dataSource sẽ là data hiển thị
        dataSource={listData}
        // loading kiểu như chờ load data 
        loading={loading}
        virtual={virtual}
        className={className}
        locale={{ emptyText: <CEmpty description="Không có dữ liệu ...!" /> }}
        rowKey={rowkey}
        showHeader={!isHideHeader}
        rowSelection={!isHideRowSelect ? {
          checkStrictly: true,
          selections: true,
          selectedRowKeys,
          hideSelectAll: hideSelectAllRow,
          type: rowSelectType,
          ...myRowSelection,
          onSelect: handleSelectRow,
          onSelectAll: handleSelectAllRow,
          onSelectMultiple: handleSelectMultiple,
        } : undefined}
        scroll={scroll}
        sticky={false}
        onRow={(record, rowIndex) => ({
          onClick: (event: any) => { event.preventDefault(); if (handleOnClick) handleOnClick(event, record, rowIndex) }, // one click row
          onDoubleClick: (event: any) => { if (handleOnDoubleClick) handleOnDoubleClick(event, record, rowIndex); }, // double click row
          onContextMenu: event => { if (handleOnContextMenu) handleOnContextMenu(event, record, rowIndex); },  // right button click row
        })}
        onHeaderRow={(columns, index) => ({
          onClick: handleOnClickHeaderRow, // click header row
        })}
        ref={tableRef as any}
        pagination={isPagination ? {
          position: ['bottomCenter'],
          pageSize: pageSizes,
         // pageSize: 20,
          showSizeChanger: false,
          responsive: true,
          showQuickJumper: true,
          locale: { jump_to: 'Chuyển đến trang', page: '' },
          defaultCurrent: 1,
          defaultPageSize: 15,
          pageSizeOptions: ['10', '20', '50', '100'],
          total: totalItem,
          onChange: (page, pageSize) => { if (handleChangePagination) handleChangePagination(page, pageSize); },
        } : false}
        size={size || 'small'}
        onChange={handleOnchange}
        tableLayout={tableLayout as any}
        bordered={isbordered}
        rowClassName={rowClassNames}
        expandable={isExpandable ? {
          expandedRowKeys: expandedRowKeys,
          fixed: true,
          showExpandColumn: showExpandColumn,
          expandedRowClassName: expandedRowClassNames,
          expandedRowRender: expandedRender,
          defaultExpandAllRows: defaultExpandAllRow,
          expandRowByClick: false,
          rowExpandable: (record) => true,
          onExpand: handleExpand,
        } : undefined}
        title={() => (textHeader ? <Typography content={textHeader} modifiers={['16x24', '500', 'left']} /> : undefined)}
        summary={() => (
          listDataT.length !== 0 && (
             listDataT.is_insurance === true ? (
              <Table.Summary fixed="bottom" >
    {/* Hàng 1 */}
    <Table.Summary.Row style={{background:"#f4f3f2"}}>
              <Table.Summary.Cell index={9} colSpan={9} />
                <Table.Summary.Cell index={11} className="ant-table-summary-cell" >
        <Typography
          content="Tổng tiền DV:"
          modifiers={["13x18", "600", "center", "main"]}
          styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={12} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.total_services.toLocaleString("vn-VN")}
          modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>

    {/* Hàng 2 */}
     <Table.Summary.Row style={{background:"#f4f3f2"}}>
                           <Table.Summary.Cell index={9} colSpan={9} />
                <Table.Summary.Cell index={11} className="ant-table-summary-cell" >
        <Typography
          content="Chiết khấu:"
          modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={12} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.discount.toLocaleString("vn-VN")}
          modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>

    {/* Hàng 3 */}
   <Table.Summary.Row style={{background:"#f4f3f2"}}>
                  <Table.Summary.Cell index={9} colSpan={9} />
                <Table.Summary.Cell index={11} className="ant-table-summary-cell" >
        <Typography
          content="BHYT trả:"
          modifiers={["13x18", "600", "center", "main"]}
          styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={12} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.total_insurances.toLocaleString("vn-VN")}
            modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>

    {/* Hàng 4 */}
      <Table.Summary.Row style={{background:"#f4f3f2"}}>
                        <Table.Summary.Cell index={9} colSpan={9} />
                <Table.Summary.Cell index={11} className="ant-table-summary-cell" >
        <Typography
          content="Tổng tiền KH trả: "
          modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={12} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.total.toLocaleString("vn-VN")}
          modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>
  </Table.Summary>
          ) :
            //// No insurance
            (
               <Table.Summary fixed="bottom" >
    {/* Hàng 1 */}
    <Table.Summary.Row style={{background:"#f4f3f2"}}>
              <Table.Summary.Cell index={4} colSpan={4} />
                <Table.Summary.Cell index={6} className="ant-table-summary-cell" >
        <Typography
          content="Tổng tiền DV:"
          modifiers={["13x18", "600", "center", "main"]}
          styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
                    <Table.Summary.Cell index={7} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.total_services.toLocaleString("vn-VN")}
          modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>

  

    {/* Hàng 3 */}
    <Table.Summary.Row style={{background:"#f4f3f2"}}>
                <Table.Summary.Cell index={4} colSpan={4} />
                <Table.Summary.Cell index={6} className="ant-table-summary-cell" >
        <Typography
          content="Chiết khấu:"
          modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={7} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.discount.toLocaleString("vn-VN")}
           modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>

    {/* Hàng 4 */}
      <Table.Summary.Row style={{background:"#f4f3f2"}}>
                      <Table.Summary.Cell index={4} colSpan={4} />
                <Table.Summary.Cell index={6} className="ant-table-summary-cell" >
        <Typography
          content="Tổng cộng thanh toán: "
          modifiers={["13x18", "600", "center", "main"]}
            styles={{ textAlign: "right", paddingTop: "5px", paddingBottom: "5px" , borderLeft:"1px solid #dcdcdc", borderBottom:"1px solid #dcdcdc"}}
        />
      </Table.Summary.Cell>
      <Table.Summary.Cell index={7} className="ant-table-summary-cell" >
        <Typography
          content={listDataT.length !== 0 && listDataT.total.toLocaleString("vn-VN")}
           modifiers={["13x18", "600", "center", "cg-red"]}
          styles={{ textAlign: "right", paddingRight: "15px",  borderBottom:"1px solid #dcdcdc" ,paddingTop: "5px", paddingBottom: "5px"}}
        />
      </Table.Summary.Cell>
    </Table.Summary.Row>
  </Table.Summary>
          )
         )
)
}
        {...props}
      />
    </div>
  );
};
PublicTablePriceQuote.defaultProps = {
  size: 'small',
  pageSizes: 15,
  tableLayout: undefined,
  isPagination: false,
  isNormal: false,
  isbordered: false,
  heightTable: Number(window.innerHeight),
  isExpandable: false,
  isSimpleHeader: false,
  isHideRowSelect: false,
  isHideHeader: false,
  rowSelectType: 'checkbox',
  showExpandColumn: false,
  scroll: { y: 900, x: '100%' },
  defaultExpandAllRow: true,
  virtual: false,
};

export default PublicTablePriceQuote;
