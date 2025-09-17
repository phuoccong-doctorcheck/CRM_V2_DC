/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { configConversion, configConversion1, configStatisticAppointment, dataExampleConversionPharse } from "assets/data";
import Icon, { IconName } from "components/atoms/Icon";
import Typography from "components/atoms/Typography";
import StatictisConversion from "components/molecules/StatictisConversion";
import StatisticAppointment from "components/molecules/StatisticAppointment";
import StattisticsMessage from "components/molecules/StattisticsMessage";
import Container from "components/organisms/Container";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "store/hooks";
import mapModifiers, { handleRenderGUID } from "utils/functions";

import { ModuleType } from "../ModuleStatistic";

interface StatisticOverviewProps {
  dataFilter?: any;
}

const StatisticOverview: React.FC<StatisticOverviewProps> = ({ dataFilter }) => {
  const dispatch = useAppDispatch();

  const location = window.location

  const searchParams = new URLSearchParams(location.search);
  const [moduleActive, setModuleActive] = useState<moduleType>()

  interface moduleType {
    id: string,
    title: string,
    icon: IconName,
    keyWord: ModuleType,
    component?: React.ReactNode | any | undefined,
  }

  const [params, setParams] = useState({
    type: '',
    statistic: '',
  });

  useEffect(() => {
    /* Call APIs statistic chat */

    /* Call APIs statistic chat */
  }, [])

  useEffect(() => {
    const type = searchParams.get('type');
    const statistic = searchParams.get('statistic');
    setParams({ ...params, type: type as any, statistic: statistic ? statistic : '', });
    if (statistic) {
      const getCurrentItem = moduleStatisticOverview.find((item) => item.keyWord === statistic);
      setModuleActive(getCurrentItem)
    }
  }, [location])

  const moduleStatisticOverview: moduleType[] = [
    {
      id: handleRenderGUID(),
      title: 'Chuyển đổi',
      icon: 'conversion-white',
      keyWord: 'conversion',
      component: <StatictisConversion
        configStatisticConversionCS={configConversion}
        configStatisticCategoriesConversion={configConversion1}
        dataRenderCategoryConversion={dataExampleConversionPharse}
      />
    },
    {
      id: handleRenderGUID(),
      title: 'Đặt lịch',
      icon: 'list_appointment-white',
      keyWord: 'appointment',
      component: < StatisticAppointment
        configStatisticOverviewSAppointment={configStatisticAppointment}
      />,
    },
    {
      id: handleRenderGUID(),
      title: 'Chăm sóc sau khám',
      icon: 'before_exams-white',
      keyWord: 'beforeExam',
      component: '',
    },
    {
      id: handleRenderGUID(),
      title: 'Cuộc gọi',
      icon: 'misscall_crm-white',
      keyWord: 'missCall',
      component: '',
    },
    {
      id: handleRenderGUID(),
      title: 'Tin nhắn',
      icon: 'chat_crm-white',
      keyWord: 'conversation',
      component: <StattisticsMessage />,
    },
    {
      id: handleRenderGUID(),
      title: 'Khách hàng theo nguồn',
      icon: 'origin-white',
      keyWord: 'origin',
      component: '',
    },
  ];

  const renderAllowStatisticType = useMemo(() => {
    return moduleActive?.component
  }, [params.statistic])


  return (
    <div className="t-statistic_overview">
      <ul className="t-statistic_overview-list">
        {!params.statistic.trim() && moduleStatisticOverview.map((item) => (
          <div
            key={item.id}
            className="t-statistic_overview_item"
            onClick={() => {
              window.history.pushState(
                null,
                "",
                `/reports?type=${params.type}&statistic=${item.keyWord}`
              )
              setParams({ ...params, statistic: item.keyWord, });
              setModuleActive(item);
            }}>
            <span><Icon iconName={item.icon as IconName} size={'28x28'} /></span>
            <Typography content={item.title} />
          </div>
        ))}
      </ul>
      {
        params.statistic.trim() && (
          <div className="t-statistic_overview_main">
            <Container modifiers={['web-app']}>
              <div className="t-statistic_overview_main_back">
                <p onClick={() => {
                  setParams({ ...params, statistic: '', });
                }}><Icon iconName={'back'} size={'28x28'} /></p>
              </div>
              <div className="t-statistic_overview_main_header">
                {moduleActive &&
                  <div className="t-statistic_overview_main_header_left" >
                    <span><Icon iconName={moduleActive.icon} size={'28x28'} /></span>
                    <Typography content={moduleActive.title} />
                  </div>
                }
              </div>
              {renderAllowStatisticType}
            </Container>
          </div>
        )
      }
    </div >
  );
};

// StatisticOverview.defaultProps = {};

export default StatisticOverview;
