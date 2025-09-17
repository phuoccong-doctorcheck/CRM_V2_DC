/* eslint-disable @typescript-eslint/no-unused-vars */
import CTooltip from 'components/atoms/CTooltip';
import { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import moment from 'moment';
import React, { useEffect, useMemo, useRef } from 'react';
import { ReportData, ReportDataItem } from 'services/api/statistics/types';

interface TableReportGrowthProps {
  listHeader?: string[],
  listHeaderWeek?: string[],
  header?: GroupRadioType,
  dataReport?: ReportData,
  typeReport?: 'days' | 'week';
  tableName?: string;
  launchSourceGroup?: '1' | '2' | '3';
  onClickSummary?: (item: ReportDataItem) => void;
  onClickDetail?: (item: ReportDataItem) => void;
  onClickToDownload?: (item: string) => void;
  onClickToCompare?: () => void;
}

const TableReportGrowth: React.FC<TableReportGrowthProps> = ({
  listHeader, dataReport, typeReport, onClickSummary, onClickDetail, onClickToDownload, onClickToCompare, launchSourceGroup, header, listHeaderWeek
}) => {
  const yourDivRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const getElement = document.querySelector('.m-table_report_growth_sums') as HTMLTableElement;
    const getElementWrap = document.querySelector('.m-table_report_growth_wrap') as HTMLElement;

    if (yourDivRef.current && Number((yourDivRef.current as any).offsetWidth + 155 + 341) > window.innerWidth) {
      // Thiết lập style cho các phần tử DOM khi điều kiện được đáp ứng
      if (getElement) {
        getElement.style.position = 'absolute';
        getElement.style.transform = 'translateX(0px)';

      }
      if (getElementWrap) {
        getElementWrap.style.display = 'block';
      }
    } else {
      if (getElement) {
        getElement.style.position = 'relative';
        getElement.style.transform = 'translateX(338px)';
      }
      if (getElementWrap) {
        getElementWrap.style.display = 'flex';

      }
    }

    return () => {
    };
  }, [dataReport, listHeader])


  const renderResult = useMemo(() => {
    let newList: any = [];

    dataReport?.launch_source?.forEach((item: any) => {
      item?.child?.forEach((child: any) => {
        if (child?.launch_source_group_id === header?.id && child?.launch_source_id !== 2) {
          newList.push(child)
        }
      })
    })

    return (
      <table className='m-table_report_growth_sums'>
        <thead>
          <tr>
            <th style={{ textTransform: 'capitalize' }}>
              Tổng kết
            </th>
          </tr>
        </thead>
        <tbody>
          {['doctorcheck', 'endo'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id !== 2)?.map((record: any, idx) => (
            <tr key={idx}>
              <td>
                <div>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.customer_number, 0)}</div>
                <div>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div style={{
                  color: record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.gross_profit, 0) >= 0 ? 'green' : '#f00',
                  fontWeight: 600,
                }}>{record.child?.filter((y: any) => y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id)?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')}</div>
              </td>
            </tr>
          ))}
          {['bscd'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id === 2)?.map((record: any, idx) => (
            <tr key={idx}>
              <td>
                <div>{record.child?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.reduce((init: any, item: any) => init + item?.customer_number, 0)}</div>
                <div>{record.child?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div>{record.child?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')}</div>
                <div style={{
                  color: record.child?.reduce((init: any, item: any) => init + item?.gross_profit, 0) >= 0 ? 'green' : '#f00',
                  fontWeight: 600,
                }}>{record.child?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')}</div>
              </td>
            </tr>
          ))}
          {!['bscd', 'summary'].includes(header?.value as string) &&
            <tr className="m-table_report_growth_resum">
              <td>
                <div>{newList?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')} </div>
                <div>{newList?.reduce((init: any, item: any) => init + item?.customer_number, 0)} </div>
                <div>{newList?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')} </div>
                <div>{newList?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')} </div>
                <div>{newList?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')} </div>
                <div style={{
                  color: newList?.reduce((init: any, item: any) => init + item?.gross_profit, 0) >= 0 ? 'green' : '#f00',
                  fontWeight: 600,
                }}>{newList?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')} </div>
              </td>
            </tr>
          }
          {header?.value === 'summary' &&
            <>
              <tr className="m-table_report_growth_summary">
                <td>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.customer_number, 0)}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')}</div>
                  <div style={{
                    color: dataReport?.data?.reduce((init: any, item: any) => init + item?.gross_profit, 0) >= 0 ? 'green' : '#f00',
                    fontWeight: 600,
                  }}>{dataReport?.data?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')}</div>
                </td>
              </tr>
              <tr className="m-table_report_growth_summary1">
                <td>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0)?.toLocaleString('vi-VN')}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0)?.toLocaleString('vi-VN')}</div>
                  <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0)?.toLocaleString('vi-VN')}</div>
                  <div style={{
                    color: Number(Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.gross_profit, 0)) - Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0))) >= 0 ? 'green' : '#f00',
                    fontWeight: 600,
                  }}>{Number(Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.gross_profit, 0)) - Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0)))?.toLocaleString('vi-VN')}</div>
                </td>
              </tr>
            </>
          }
          {header?.value === 'summary' &&
            <tr className="m-table_report_growth_summary1">
              <td>
                <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0)?.toLocaleString('vi-VN')}</div>
                <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0)?.toLocaleString('vi-VN')}</div>
                <div>{dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0)?.toLocaleString('vi-VN')}</div>
                <div style={{
                  color: Number(Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.total_revenue, 0)) - Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.investment_amount, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0))) >= 0 ? 'green' : '#f00',
                  fontWeight: 600,
                }}>{Number(Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.total_revenue, 0)) - Number(dataReport?.data?.reduce((init: any, item: any) => init + item?.investment_amount, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.debt_balance, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.fixed_assets, 0) + dataReport?.data?.reduce((init: any, item: any) => init + item?.daily_expenses, 0)))?.toLocaleString('vi-VN')}</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    )
  }, [listHeader, dataReport, typeReport, header])

  return (
    <div className="m-table_report_growth">
      <div className="m-table_report_growth_wrap">
        <table className='m-table_report_growth_table_fixed' >
          <thead>
            <tr>
              <th style={{ color: header?.color, width: 150 }}>{header?.label}</th>
              <th style={{ width: 150 }}> Hiệu quả kinh doanh </th>
            </tr>
          </thead>
          <tbody>
            {['doctorcheck', 'endo'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id !== 2)?.map((record: any, idx) => (
              <tr key={idx}>
                <td>{record.launch_source_name}</td>
                <td >
                  <div>Đầu tư</div>
                  <div>Khách hàng</div>
                  <div>Doanh thu dịch vụ</div>
                  <div>Doanh thu thuốc</div>
                  <div>Tổng doanh thu</div>
                  <div>Lãi gộp</div>
                </td>
              </tr>
            ))}
            {['bscd'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id === 2)?.map((record: any, idx) => (
              <tr key={idx}>
                <td>{record.launch_source_name}</td>
                <td >
                  <div>Đầu tư</div>
                  <div>Khách hàng</div>
                  <div>Doanh thu dịch vụ</div>
                  <div>Doanh thu thuốc</div>
                  <div>Tổng doanh thu</div>
                  <div>Lãi gộp</div>
                </td>
              </tr>
            ))}
            {!['bscd', 'summary'].includes(header?.value as string) &&
              <tr className="m-table_report_growth_resum">
                <td>Tổng</td>
                <td >
                  <div>Đầu tư</div>
                  <div>Khách hàng</div>
                  <div>Doanh thu dịch vụ</div>
                  <div>Doanh thu thuốc</div>
                  <div>Tổng doanh thu</div>
                  <div>Lãi gộp</div>
                </td>
              </tr>
            }
            {header?.value === 'summary' &&
              <>
                <tr className="m-table_report_growth_summary">
                  <td>Tổng</td>
                  <td >
                    <div>Đầu tư</div>
                    <div>Khách hàng</div>
                    <div>Doanh thu dịch vụ</div>
                    <div>Doanh thu thuốc</div>
                    <div>Tổng doanh thu</div>
                    <div>Lãi gộp</div>
                  </td>
                </tr>
                <tr className="m-table_report_growth_summary1">
                  <td>Lãi/ lỗ</td>
                  <td >
                    <div>Công nợ</div>
                    <div>Cố định</div>
                    <div>Chi phí hằng ngày</div>
                    <div>Lãi gộp</div>
                  </td>
                </tr>
              </>
            }
            {header?.value === 'summary' &&
              <tr className="m-table_report_growth_summary1">
                <td>Lãi/ lỗ v2</td>
                <td >
                  <div>Công nợ</div>
                  <div>Cố định</div>
                  <div>Chi phí hằng ngày</div>
                  <div>Lãi gộp</div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <div className="m-table_report_growth_wrap_flexible">
          <table className='m-table_report_growth_table' ref={yourDivRef}>
            <thead>
              <tr>
                {listHeader?.map((i, idx) => (
                  <th key={idx} style={{ padding: typeReport === 'days' ? '6.7px 8px' : '8px' }}>
                    <div>
                      {typeReport === 'days' ? moment(i).format('DD/MM/YYYY') : (listHeaderWeek || [])[idx]}
                      {typeReport === 'days' &&
                        <button onClick={() => {
                          if (onClickToDownload) {
                            onClickToDownload(moment(i).format('YYYY-MM-DD'));
                          }
                        }}>
                          <Icon
                            iconName={"download_crm"}
                            isPointer
                            size="16x16"
                          />
                        </button>
                      }
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['doctorcheck', 'endo'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id !== 2)?.map((record: any, idx) => (
                <tr key={idx}>
                  {listHeader?.map((time, index) => {
                    const getRecordAllowDateAndOrigin = record.child?.find((y: any) => y?.report_date === time && y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id);
                    const getRecordAllowDateAndOriginAllowWeek = (record.child || [])?.filter((y: any) => Number(y?.week) === Number(time) && y?.launch_source_id === record?.launch_source_id && y.launch_source_group_id === header?.id);

                    if (getRecordAllowDateAndOrigin || getRecordAllowDateAndOriginAllowWeek) {
                      return (
                        <td key={index}>
                          <div>{typeReport === 'days' ?
                            getRecordAllowDateAndOrigin?.investment_amount?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')
                          }</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.customer_number :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.customer_number, 0)}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.service_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.medical_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.total_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div style={{
                            color: Number(typeReport === 'days' ? getRecordAllowDateAndOrigin?.gross_profit :
                              getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.gross_profit, 0)) >= 0 ? 'green' : '#f00',
                            fontWeight: 600
                          }}>
                            {typeReport === 'days' ? getRecordAllowDateAndOrigin?.gross_profit?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')}
                          </div>
                        </td>
                      )
                    } else {
                      return (<td key={index}>
                      </td>)
                    }
                  })}
                </tr>
              ))}
              {['bscd'].includes(header?.value as string) && dataReport?.launch_source?.filter((i: any) => i.launch_source_id === 2)?.map((record: any, idx) => (
                <tr key={idx}>
                  {listHeader?.map((time, index) => {

                    const getRecordAllowDateAndOrigin = record.child?.find((y: any) => y?.report_date === time);
                    const getRecordAllowDateAndOriginAllowWeek = (record.child || [])?.filter((y: any) => Number(y?.week) === Number(time));

                    if (getRecordAllowDateAndOrigin || getRecordAllowDateAndOriginAllowWeek) {
                      return (
                        <td key={index}>
                          <div>{typeReport === 'days' ?
                            getRecordAllowDateAndOrigin?.investment_amount?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.investment_amount, 0)?.toLocaleString('vi-VN')
                          }</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.customer_number :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.customer_number, 0)}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.service_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.service_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.medical_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.medical_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.total_revenue?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.total_revenue, 0)?.toLocaleString('vi-VN')}</div>
                          <div style={{
                            color: Number(typeReport === 'days' ? getRecordAllowDateAndOrigin?.gross_profit :
                              getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.gross_profit, 0)) >= 0 ? 'green' : '#f00',
                            fontWeight: 600
                          }}>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.gross_profit?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.reduce((init: any, item: any) => init + item?.gross_profit, 0)?.toLocaleString('vi-VN')}</div>
                        </td>
                      )
                    } else {
                      return (<td key={index}>
                      </td>)
                    }
                  })}
                </tr>
              ))}
              {!['bscd', 'summary'].includes(header?.value as string) &&
                <tr className="m-table_report_growth_resum">
                  {listHeader?.map((time, index) => {
                    const newList: any = [];

                    dataReport?.launch_source?.forEach((group: any) => {
                      group.child?.forEach((item: any) => {
                        if ((typeReport === 'days' ? item.report_date === time : Number(item?.week) === Number(time)) && item?.launch_source_group_id === header?.id) {
                          newList.push(item);
                        }
                      });
                    })
                    return (
                      <td key={index}>
                        <div>{['bscd', 'summary'].includes(header?.value as string) ? newList?.reduce((init: any, item: any) => init + item.investment_amount, 0).toLocaleString('vi-VN') : newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.investment_amount, 0).toLocaleString('vi-VN')}</div>
                        <div>{['bscd', 'summary'].includes(header?.value as string) ? newList?.reduce((init: any, item: any) => init + item.customer_number, 0) : newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.customer_number, 0)}</div>
                        <div>{['bscd', 'summary'].includes(header?.value as string) ? newList?.reduce((init: any, item: any) => init + item.service_revenue, 0).toLocaleString('vi-VN') : newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.service_revenue, 0).toLocaleString('vi-VN')}</div>
                        <div>{['bscd', 'summary'].includes(header?.value as string) ? newList?.reduce((init: any, item: any) => init + item.medical_revenue, 0).toLocaleString('vi-VN') : newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.medical_revenue, 0).toLocaleString('vi-VN')}</div>
                        <div>{['bscd', 'summary'].includes(header?.value as string) ? newList?.reduce((init: any, item: any) => init + item.medical_revenue, 0).toLocaleString('vi-VN') : newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.total_revenue, 0).toLocaleString('vi-VN')}</div>
                        <div style={{
                          color: Number(['bscd', 'summary'].includes(header?.value as string) ?
                            newList?.reduce((init: any, item: any) => init + item.gross_profit, 0) :
                            newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.gross_profit, 0)) >= 0 ? 'green' : '#f00',
                          fontWeight: 600
                        }}>
                          {['bscd', 'summary'].includes(header?.value as string) ?
                            newList?.reduce((init: any, item: any) => init + item.gross_profit, 0).toLocaleString('vi-VN') :
                            newList.filter((i: any) => i?.launch_source_id !== 2)?.reduce((init: any, item: any) => init + item.gross_profit, 0).toLocaleString('vi-VN')}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              }
              {header?.value === 'summary' &&
                <>
                  <tr className="m-table_report_growth_summary">
                    {listHeader?.map((time, index) => {
                      const getRecordAllowDateAndOrigin = dataReport?.data?.find((y: any) => y?.day === moment(time).format('YYYY-MM-DD'));
                      const getRecordAllowDateAndOriginAllowWeek = dataReport?.data?.find((y: any) => Number(y?.week) === Number(time));

                      if (getRecordAllowDateAndOrigin || getRecordAllowDateAndOriginAllowWeek) {
                        return (
                          <td key={index}>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.investment_amount?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.investment_amount?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.customer_number :
                              getRecordAllowDateAndOriginAllowWeek?.customer_number
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.service_revenue?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.service_revenue?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.medical_revenue?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.medical_revenue?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.total_revenue?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.total_revenue?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.gross_profit?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.gross_profit?.toLocaleString('vi-VN')
                            }</div>
                          </td>
                        )
                      } else {
                        return (<td key={index}>
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                        </td>)
                      }
                    })}

                  </tr>
                  <tr className="m-table_report_growth_summary">
                    {listHeader?.map((time, index) => {
                      const getRecordAllowDateAndOrigin = dataReport?.data?.find((y: any) => y?.day === moment(time).format('YYYY-MM-DD'));
                      const getRecordAllowDateAndOriginAllowWeek = dataReport?.data?.find((y: any) => Number(y?.week) === Number(time));

                      if (getRecordAllowDateAndOrigin || getRecordAllowDateAndOriginAllowWeek) {
                        return (
                          <td key={index}>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.debt_balance?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.debt_balance?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.fixed_assets?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.fixed_assets?.toLocaleString('vi-VN')
                            }</div>
                            <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.daily_expenses?.toLocaleString('vi-VN') :
                              getRecordAllowDateAndOriginAllowWeek?.daily_expenses?.toLocaleString('vi-VN')
                            }</div>
                            <div style={{
                              color: Number(typeReport === 'days' ? Number(Number(getRecordAllowDateAndOrigin?.gross_profit) - Number(Number(getRecordAllowDateAndOrigin?.debt_balance) + Number(getRecordAllowDateAndOrigin?.fixed_assets) + Number(getRecordAllowDateAndOrigin?.daily_expenses)))
                                : Number(Number(getRecordAllowDateAndOriginAllowWeek?.gross_profit) - Number(Number(getRecordAllowDateAndOriginAllowWeek?.debt_balance) + Number(getRecordAllowDateAndOriginAllowWeek?.fixed_assets) + Number(getRecordAllowDateAndOriginAllowWeek?.daily_expenses)))) >= 0 ? 'green' : '#f00',
                              fontWeight: 600
                            }}>{typeReport === 'days' ? Number(Number(getRecordAllowDateAndOrigin?.gross_profit) - Number(Number(getRecordAllowDateAndOrigin?.debt_balance) + Number(getRecordAllowDateAndOrigin?.fixed_assets) + Number(getRecordAllowDateAndOrigin?.daily_expenses)))?.toLocaleString('vi-VN') :
                              Number(Number(getRecordAllowDateAndOriginAllowWeek?.gross_profit) - Number(Number(getRecordAllowDateAndOriginAllowWeek?.debt_balance) + Number(getRecordAllowDateAndOriginAllowWeek?.fixed_assets) + Number(getRecordAllowDateAndOriginAllowWeek?.daily_expenses)))?.toLocaleString('vi-VN')
                              }</div>
                          </td>
                        )
                      } else {
                        return (<td key={index}>
                          <div />
                          <div />
                          <div />
                          <div />
                        </td>)
                      }
                    })}
                  </tr>
                </>
              }

              {header?.value === 'summary' &&
                <tr className="m-table_report_growth_summary">
                  {listHeader?.map((time, index) => {
                    const getRecordAllowDateAndOrigin = dataReport?.data?.find((y: any) => y?.day === moment(time).format('YYYY-MM-DD'));
                    const getRecordAllowDateAndOriginAllowWeek = dataReport?.data?.find((y: any) => y?.week === Number(time));

                    if (getRecordAllowDateAndOrigin || getRecordAllowDateAndOriginAllowWeek) {
                      return (
                        <td key={index}>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.debt_balance?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.debt_balance?.toLocaleString('vi-VN')
                          }</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.fixed_assets?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.fixed_assets?.toLocaleString('vi-VN')
                          }</div>
                          <div>{typeReport === 'days' ? getRecordAllowDateAndOrigin?.daily_expenses?.toLocaleString('vi-VN') :
                            getRecordAllowDateAndOriginAllowWeek?.daily_expenses?.toLocaleString('vi-VN')
                          }</div>
                          <div style={{
                            color: Number(typeReport === 'days' ?
                              Number(Number(getRecordAllowDateAndOrigin?.total_revenue) - Number(Number(getRecordAllowDateAndOrigin?.investment_amount) + Number(getRecordAllowDateAndOrigin?.debt_balance) + Number(getRecordAllowDateAndOrigin?.fixed_assets) + Number(getRecordAllowDateAndOrigin?.daily_expenses))) :
                              Number(Number(getRecordAllowDateAndOriginAllowWeek?.total_revenue) - Number(Number(getRecordAllowDateAndOrigin?.investment_amount || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.debt_balance || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.fixed_assets || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.daily_expenses || 0)))
                            ) >= 0 ? 'green' : '#f00',
                            fontWeight: 600
                          }}>
                            {typeReport === 'days' ?
                              Number(Number(getRecordAllowDateAndOrigin?.total_revenue) - Number(Number(getRecordAllowDateAndOrigin?.investment_amount) + Number(getRecordAllowDateAndOrigin?.debt_balance) + Number(getRecordAllowDateAndOrigin?.fixed_assets) + Number(getRecordAllowDateAndOrigin?.daily_expenses)))?.toLocaleString('vi-VN') :
                              Number(Number(getRecordAllowDateAndOriginAllowWeek?.total_revenue) - Number(Number(getRecordAllowDateAndOrigin?.investment_amount || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.debt_balance || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.fixed_assets || 0) + Number(getRecordAllowDateAndOriginAllowWeek?.daily_expenses || 0)))?.toLocaleString('vi-VN')
                            }</div>
                        </td>
                      )
                    } else {
                      return (<td key={index}>
                        <div />
                        <div />
                        <div />
                        <div />
                      </td>)
                    }
                  })}
                </tr>
              }
            </tbody>
          </table>
        </div >
        {renderResult}
      </div >
    </div >
  );
}


// Sử dụng react.memo để tạo thành một HOC
const MemoizedTableReportGrowthProps = React.memo(TableReportGrowth);

export default MemoizedTableReportGrowthProps;
