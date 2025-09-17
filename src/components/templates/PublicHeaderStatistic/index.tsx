/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import RangeDate, { RangeDateType } from 'components/atoms/RangeDate';
import Typography from 'components/atoms/Typography';
import moment from 'moment';
import React, { useState } from 'react';

interface PublicHeaderStatisticProps {
  children?: React.ReactNode;
  leftNode?: React.ReactNode;
  title?: string
  handleGetData?: (data: any, data2: any) => void;
  handleClick?: (data: any) => void;
  valueRangeDate?: RangeDateType;
  isSendRequest?: boolean;
  isStatistic?: boolean;
}

const PublicHeaderStatistic: React.FC<PublicHeaderStatisticProps> = ({
  children, title, handleGetData, handleClick, valueRangeDate, isSendRequest, isStatistic, leftNode
}) => {
  const [rangeTime, setRangeTime] = useState({
    from: Date,
    to: Date,
  })
  return (
    <div className="p-header-statistic">
      <div className="p-header-statistic_left">
        {title &&
          <div className="p-header-statistic_title">
            <Typography content={title} />
          </div>
        }
        {
          isStatistic && (
            <>
              <div className="p-header-statistic_range_time">
                <RangeDate
                  label=""
                  variant="style"
                  handleOnChange={(data: any, data1: any) => {
                    setRangeTime({ from: data, to: data1 })
                    if (handleGetData) handleGetData(data, data1);
                  }}
                  defaultValue={valueRangeDate || { from: new Date(), to: new Date() }}
                  fomat='DD-MM-YYYY'
                />
              </div>
              <Button modifiers={['foreign']} onClick={() => {
                if (handleClick) handleClick(rangeTime);
              }} isLoading={isSendRequest}>
                <Typography content={'Thống kê'} />
              </Button>
            </>
          )
        }
        {leftNode}
      </div>
      <div className="p-header-statistic_right">
        {children}
      </div>
    </div>
  );
}

PublicHeaderStatistic.defaultProps = {
  children: undefined,
  isSendRequest: false,
  isStatistic: true,
};

export default PublicHeaderStatistic;
