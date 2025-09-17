/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import React from 'react';
import mapModifiers from 'utils/functions';

import Loading from '../Loading';
import Typography from '../Typography';

interface StatisticBoxItemProps {
  title?: string,
  money?: string,
  guest?: number,
  unit?: string,
  isWarning?: boolean,
  isGrouth?: boolean,
  isMoney?: boolean,
  onClick?: () => void,
}

const StatisticBoxItem: React.FC<StatisticBoxItemProps> = ({
  title, isWarning, isGrouth, guest, unit, onClick, isMoney, money,
}) => (
  <div
    className={mapModifiers('a-statistic', isWarning && 'red', isGrouth && 'grouth', isMoney && 'money')}
    onClick={onClick}
  >
    <div className="a-statistic_title">
      <Typography content={title} />
    </div>
    <div className="a-statistic_quality">
      {
        _.isUndefined(isMoney ? money : guest) ?
          <div className="a-statistic_quality_loading">
            <Loading variant="default" isShow size="medium" />
          </div>
          : <Typography content={`${isMoney ? money?.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : guest?.toString()}`} />
      }

    </div>
  </div>
);

StatisticBoxItem.defaultProps = {
};

export default StatisticBoxItem;
