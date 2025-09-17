/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ReportData } from 'services/api/statistics/types';

interface ChartReportCompareProps {
  children?: React.ReactNode;
  listHeader?: string;
  keyActive?: string;
  brand?: string;
  type?: 'days' | 'week' | string;
  dataCompare?: ReportData;
}

const ChartReportCompare: React.FC<ChartReportCompareProps> = ({ brand, children, listHeader, keyActive, dataCompare, type }) => {
  const [dataConvert, setDataConvert] = useState<any>((dataCompare?.data || [])?.map((item, index) => ([
    type === 'days' ? item.day : `Tuần ${item.week}`,
    keyActive === 'investment_amount' ? (brand === 'dc' ? item?.dc_report.investment_amount : item?.endo_report.investment_amount) : null,
    keyActive === 'customer_number' ? (brand === 'dc' ? item?.dc_report.customer_number : item?.endo_report.customer_number) : null,
    keyActive === 'revenue' ? (brand === 'dc' ? item?.dc_report.revenue : item?.endo_report.revenue) : null,
    keyActive === 'cost_price' ? (brand === 'dc' ? item?.dc_report.cost_price : item?.endo_report.cost_price) : null,
    keyActive === 'gross_profit' ? (brand === 'dc' ? item?.dc_report.gross_profit : item?.endo_report.gross_profit) : null,
  ].filter(i => !!i))));


  const [configChart, setConfigChart] = useState({
    textStyle: {
      fontFamily: "Roboto",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
        },
      },
      tooltipStyle: {
        shadowColor: "#333",
        borderRadius: 12,
        padding: 16,
      },
    },
    calculable: true,
    legend: {
      data: [listHeader, "timeline"],
      orient: "horizontal",
      left: "top",
      itemGap: 20,
    },
    grid: {
      top: "12%",
      left: "1%",
      right: "10%",
      containLabel: true,
    },
    xAxis: { type: "category" },
    yAxis: {},
    dataset: {
      source: [
        ["", listHeader],
        ...dataConvert,
      ],
    },
    series: [
      { type: "bar", color: "#04566e", smooth: true, animationEasing: "quarticIn" },
      { type: "line", color: "#f00", smooth: false, animationEasing: "quarticIn" },
    ],
    toolbox: {
      show: true,
      feature: {
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    backgroundStyle: {
      borderRadius: 8,
    },
    color: "#00456e",
    itemStyle: {
      borderRadius: [2, 2, 0, 0],
    },
    barWidth: 40,
  })

  useLayoutEffect(() => {
    const newData = (dataCompare?.data || [])?.map((item, index) => ([
      type === 'days' ? moment(item.day)?.format("DD-MM-YYYY") : `Tuần ${item.week}`,
      keyActive === 'investment_amount' ? (brand === 'dc' ? item?.dc_report.investment_amount : item?.endo_report.investment_amount) : null,
      keyActive === 'customer_number' ? (brand === 'dc' ? item?.dc_report.customer_number : item?.endo_report.customer_number) : null,
      keyActive === 'revenue' ? (brand === 'dc' ? item?.dc_report.revenue : item?.endo_report.revenue) : null,
      keyActive === 'cost_price' ? (brand === 'dc' ? item?.dc_report.cost_price : item?.endo_report.cost_price) : null,
      keyActive === 'gross_profit' ? (brand === 'dc' ? item?.dc_report.gross_profit : item?.endo_report.gross_profit) : null,
    ].filter(i => !!i)));
    if (newData)
      setDataConvert(newData)
  }, [brand, dataCompare, keyActive])

  useEffect(() => {
    setConfigChart(prevConfig => ({
      ...prevConfig,
      legend: {
        data: [listHeader],
        orient: "horizontal",
        left: "top",
        itemGap: 20,
      },
      dataset: {
        source: [
          ["", listHeader],
          ...dataConvert,
        ],
      },
    }));
  }, [dataConvert, listHeader, keyActive]);



  return (
    <div className="m-chart_report">
      <ReactECharts
        option={configChart}
        notMerge={true}
        lazyUpdate={true}
      />
      <div className="m-chart_report_option">
        {children}
      </div>
    </div>
  );
}

ChartReportCompare.defaultProps = {
  children: undefined,
};

const MemoizedChartReportCompare = React.memo(ChartReportCompare)

export default MemoizedChartReportCompare;