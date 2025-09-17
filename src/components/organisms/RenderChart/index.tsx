/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactECharts from 'echarts-for-react';
import React from 'react';

interface RenderChartProps {
  option: any;
}

const RenderChart: React.FC<RenderChartProps> = ({ option }) => {
  return (
    <div className="o-render_chart">
      <ReactECharts
        option={option}
        notMerge={false}
        lazyUpdate={false}
      />
    </div>
  );
}

RenderChart.defaultProps = {
};

export default RenderChart;
