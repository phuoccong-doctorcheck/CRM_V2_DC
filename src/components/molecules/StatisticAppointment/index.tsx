import { configStatisticAppointmentAllowOrigin, configStatisticAppointmentCompany, configStatisticAppointments } from 'assets/data';
import Typography from 'components/atoms/Typography';
import RenderChart from 'components/organisms/RenderChart';
import React from 'react';

interface StatisticAppointmentProps {
  configStatisticOverviewSAppointment?: object;
}

const StatisticAppointment: React.FC<StatisticAppointmentProps> = ({ configStatisticOverviewSAppointment }) => {
  return (
    <div className="m-statistic_appointment">
      <div className="m-statistic_appointment_item">
        <Typography content="Biến động đặt lịch trong tuần" />
        <div className="m-statistic_appointment_item_overview">
          <RenderChart option={configStatisticOverviewSAppointment} />
        </div>
      </div>
      <div className="m-statistic_appointment_item">
        <Typography content="Thống kê đặt lịch trong tuần theo công ty" />
        <div className="m-statistic_appointment_item_overview">
          <RenderChart option={configStatisticAppointmentCompany} />
        </div>
      </div>
      <div className="m-statistic_appointment_item">
        <Typography content="Thống kê đặt lịch trong tuần theo nguồn" />
        <div className="m-statistic_appointment_item_origin">
          <RenderChart option={configStatisticAppointmentAllowOrigin} />
        </div>
      </div>
      <div className="m-statistic_appointment_item">
        <Typography content="Thống kê đặt lịch theo hình thức chuyển đổi" />
        <div className="m-statistic_appointment_item_partner">
          <RenderChart option={configStatisticAppointments} />
        </div>
      </div>
    </div>
  );
}

StatisticAppointment.defaultProps = {
};

export default StatisticAppointment;
