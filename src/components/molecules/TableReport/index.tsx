/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import React, { useEffect, useRef } from 'react';
import { ReportData } from 'services/api/statistics/types';

interface TableReportProps {
  listHeader?: string[],
  dataReport?: ReportData,
  brand?: 'dc' | 'endo';
  typeReport?: 'days' | 'week';
  tableName?: string;
  onClickChart?: () => void;
}

const TableReport: React.FC<TableReportProps> = ({ listHeader, dataReport, brand, typeReport, tableName, onClickChart }) => {
  const yourDivRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra nếu div tồn tại và có thể truy cập đến current
      if (yourDivRef.current) {
        // Cập nhật giá trị của ref theo vị trí scroll ngang của trang
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        yourDivRef.current.style.left = `${scrollLeft}px`;
      }
    };

    // Gắn sự kiện scroll và cập nhật giá trị của ref khi scroll xảy ra
    window.addEventListener('scroll', handleScroll);

    // Đảm bảo loại bỏ sự kiện scroll khi component unmount để tránh memory leak
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <>
      <div className="m-table_report_name">
        {tableName}
        <Button
          modifiers={["orange"]}
          onClick={onClickChart}
        >
          <Icon iconName="visualization" />
        </Button>
      </div>
      <div className="m-table_report">
        <table className='m-table_report_fixed' ref={yourDivRef} style={{ position: 'absolute', top: '0', left: '0' }}>
          <thead>
            <tr>
              <th>
                Hạng mục
              </th>
            </tr>
          </thead>
          <tbody>
            <tr> <td> Đầu tư </td> </tr>
            <tr> <td> Khách hàng </td> </tr>
            <tr> <td> Doanh thu </td> </tr>
            <tr> <td> Lãi gộp </td> </tr>
          </tbody>
        </table>
        <div className="m-table_report_wrap">
          {listHeader ?
            <table className='m-table_report_flexible'>
              <thead>
                <tr style={(listHeader || [])?.length < 13 ? {
                  display: 'grid', gridTemplateColumns: `repeat(${(listHeader || [])?.length},1fr)`
                } : { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {listHeader?.length ? listHeader.map((header) => (
                    <th key={header}>
                      {typeReport === 'days' ? header : `Tuần ${header}`}
                    </th>
                  )) : null}
                </tr>
              </thead>
              <tbody>
                <tr style={(listHeader || [])?.length < 13 ? {
                  display: 'grid', gridTemplateColumns: `repeat(${(listHeader || [])?.length},1fr)`
                } : { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {listHeader?.length ? listHeader.map((title) => {
                    const findRecord = (dataReport?.data || []).find((i) => (typeReport === 'days' ? i.day : i?.week) === (typeReport === 'days' ? title : Number(title)))
                    if (findRecord) {
                      return (
                        <td>
                          {brand === 'dc' ? findRecord.dc_report.investment_amount?.toLocaleString("vi-VN") : findRecord.endo_report.investment_amount?.toLocaleString("vi-VN")}
                        </td>
                      )
                    } else {
                      return (<td>0</td>)
                    }
                  }) : null}

                </tr>
                <tr style={(listHeader || [])?.length < 13 ? {
                  display: 'grid', gridTemplateColumns: `repeat(${(listHeader || [])?.length},1fr)`
                } : { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {listHeader?.length ? listHeader.map((title) => {
                    const findRecord = (dataReport?.data || []).find((i) => (typeReport === 'days' ? i.day : i?.week) === (typeReport === 'days' ? title : Number(title)))
                    if (findRecord) {
                      return (
                        <td>
                          {brand === 'dc' ? findRecord.dc_report.customer_number : findRecord.endo_report.customer_number}
                        </td>
                      )
                    } else {
                      return (<td>0</td>)
                    }
                  }) : null}
                </tr>
                <tr style={(listHeader || [])?.length < 13 ? {
                  display: 'grid', gridTemplateColumns: `repeat(${(listHeader || [])?.length},1fr)`
                } : { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {listHeader?.length ? listHeader.map((title) => {
                    const findRecord = (dataReport?.data || []).find((i) => (typeReport === 'days' ? i.day : i?.week) === (typeReport === 'days' ? title : Number(title)))
                    if (findRecord) {
                      return (
                        <td>
                          {brand === 'dc' ? findRecord.dc_report.revenue?.toLocaleString("vi-VN") : findRecord.endo_report.revenue?.toLocaleString("vi-VN")}
                        </td>
                      )
                    } else {
                      return (<td>0</td>)
                    }
                  }) : null}
                </tr>
                <tr style={(listHeader || [])?.length < 13 ? {
                  display: 'grid', gridTemplateColumns: `repeat(${(listHeader || [])?.length},1fr)`
                } : { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {listHeader?.length ? listHeader.map((title) => {
                    const findRecord = (dataReport?.data || []).find((i) => (typeReport === 'days' ? i.day : i?.week) === (typeReport === 'days' ? title : Number(title)))
                    if (findRecord) {
                      return (
                        <td>
                          {brand === 'dc' ? findRecord.dc_report.gross_profit?.toLocaleString("vi-VN") : findRecord.endo_report.gross_profit?.toLocaleString("vi-VN")}
                        </td>
                      )
                    } else {
                      return (<td>0</td>)
                    }
                  }) : null}
                </tr>
              </tbody>
            </table>
            :
            <div className="m-table_report_empty">
              <Typography content='Vui lòng chọn thời gian cần so sánh' modifiers={['400', 'cg-red', 'italic', '18x32']} />
            </div>
          }
        </div>
      </div >
    </>
  );
}

TableReport.defaultProps = {
};

// Sử dụng react.memo để tạo thành một HOC
const MemoizedTableReport = React.memo(TableReport);

export default MemoizedTableReport;
