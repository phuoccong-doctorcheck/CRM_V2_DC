import Typography from 'components/atoms/Typography';
import RenderChart from 'components/organisms/RenderChart';
import React from 'react';

interface StatictisConversionProps {
  children?: React.ReactNode;
  configStatisticConversionCS: object;
  configStatisticCategoriesConversion: object;
  dataRenderCategoryConversion: any;
}

const StatictisConversion: React.FC<StatictisConversionProps> = ({
  configStatisticConversionCS, configStatisticCategoriesConversion, dataRenderCategoryConversion
}) => {
  return (
    <div className="t-module_statistic-conversion">
      <div className="t-module_statistic-conversion_growth">
        <div className="t-module_statistic-conversion_growth_header">
          <Typography content="Số lượng khách hàng quan tâm" /> <span>( tuần )</span>
        </div>
        <RenderChart option={configStatisticConversionCS} />
      </div>

      <div className="t-module_statistic-conversion_ratio">
        <div className="t-module_statistic-conversion_ratio_header">
          <Typography content="Thống kê khách hàng chuyển đổi theo trạng thái" /> <span>( tuần )</span>
        </div>
        <div className="t-module_statistic-conversion_ratio_content">
          <RenderChart option={configStatisticCategoriesConversion} />
          <div className="t-module_statistic-conversion_detail">
            {dataRenderCategoryConversion.map((detail: any) => {
              const totalValue = dataRenderCategoryConversion.reduce((acc: any, item: any) => acc + item.value, 0);

              return (
                <div className="t-module_statistic-conversion_detail_item" key={detail.id}>
                  <p style={{ color: detail.color, fontSize: 18, marginBottom: 8, fontWeight: 600 }}>{detail.title}</p>
                  <div className="t-module_statistic-conversion_detail_item_flex" >
                    <span style={{ color: detail.color }}>{detail.value}</span>
                    <a>{Number((detail.value / totalValue) * 100).toFixed(2)}%</a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

StatictisConversion.defaultProps = {
  children: undefined,
};

export default StatictisConversion;
