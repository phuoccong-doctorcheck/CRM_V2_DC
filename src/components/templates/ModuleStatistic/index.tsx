/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Typography from 'components/atoms/Typography';
import StatictisConversion from 'components/molecules/StatictisConversion';
import RenderChart from 'components/organisms/RenderChart';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { handleRenderGUID } from 'utils/functions';

export type ModuleType = 'conversion' | 'appointment' | 'beforeExam' | 'missCall' | 'conversation' | 'origin';

interface ModuleStatisticProps {
  moduleName: ModuleType;
}

const ModuleStatistic: React.FC<ModuleStatisticProps> = ({ moduleName }) => {
  const textStyle = {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
  };

  const tooltipStyle = {
    shadowColor: '#333',
    borderRadius: 12,
    padding: 16,
  };

  const dataExampleConversion = [
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(6, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(5, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(4, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(3, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(2, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).subtract(1, 'days').format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
    {
      id: handleRenderGUID(),
      value: [moment(new Date()).format('DD/MM/YYYY'), Math.floor(Math.random() * 200), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    },
  ]

  const dataExampleConversionPharse = [
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Quan tâm',
      color: '#73c0de'
    },
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Cân nhắc',
      color: '#91cc75'
    },
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Cho số điện thoại',
      color: '#fac858'

    },
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Đặt hẹn',
      color: '#ee6666'

    },
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Hủy hẹn',
      color: '#73c0de'

    },
    {
      id: handleRenderGUID(),
      value: Math.floor(Math.random() * 200),
      title: 'Đã đến',
      color: '#3ba272'

    },
  ]

  const configConversion = {
    textStyle: textStyle,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true
        }
      },
      ...tooltipStyle,
    },
    calculable: true,
    legend: {
      data: ['Contact', 'Total', 'Lead', 'Customer'],
      orient: 'horizontal',
      left: 'top',
      itemGap: 20,
    },
    grid: {
      top: '12%',
      left: '1%',
      right: '10%',
      containLabel: true
    },
    xAxis: { type: 'category' },
    yAxis: {},
    dataZoom: [
      { show: true, start: 0, end: 100 },
      { type: 'inside', start: 0, end: 100 },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: 'empty',
        width: 10,
        height: '90%',
        showDataShadow: false,
        left: '93%'
      }
    ],
    dataset: {
      source: [
        ['', 'Contact', 'Total', 'Lead', 'Customer'],
        ...dataExampleConversion.map((date) => [...date.value, Math.floor(Math.random() * 150)])
      ],
    },
    series: [
      { type: 'bar', color: '#007bff', animationEasing: 'bounceOut' },
      { type: 'bar', color: '#00556E', animationEasing: 'bounceOut' },
      { type: 'bar', color: '#f99', animationEasing: 'bounceOut' },
      { type: 'line', smooth: true, color: '#28a745', animationEasing: 'quarticIn' }],
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    backgroundStyle: {
      borderRadius: 8,
    },
    color: '#00456e',
    itemStyle: {
      borderRadius: [2, 2, 0, 0],
    },
    barWidth: 20,

  }
  const configConversion1 = {
    tooltip: {
      axisPointer: {
        type: 'shadow',
        label: {
          show: true
        }
      },
      borderWidth: 0,
      trigger: 'item',
      ...tooltipStyle,
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: dataExampleConversionPharse.map((i) => {
          const data = { name: i.title, value: i.value }
          return data;
        })
      }
    ],
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
  }

  const renderStatistic = useMemo(() => {
    switch (moduleName) {
      case 'conversion': return (
        <StatictisConversion
          configStatisticConversionCS={configConversion}
          configStatisticCategoriesConversion={configConversion1}
          dataRenderCategoryConversion={dataExampleConversionPharse}
        />
      )
      case 'appointment': return (
        <div className="t-module_statistic-appointment">
          conversion
        </div>
      )
      case 'beforeExam': return (
        <div className="t-module_statistic-beforeExam">
          conversion
        </div>
      )
      case 'missCall': return (
        <div className="t-module_statistic-missCall">
          conversion
        </div>
      )
      case 'conversation': return (
        <div className="t-module_statistic-conversation">
          conversion
        </div>
      )
    }

  }, [moduleName])

  return (
    <div className="t-module_statistic" >
      {renderStatistic}
    </div >
  );
}

ModuleStatistic.defaultProps = {
};

export default ModuleStatistic;
