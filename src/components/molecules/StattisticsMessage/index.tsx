/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useAppSelector } from 'store/hooks';

interface StattisticsMessageProps {
  children?: React.ReactNode;
}

const StattisticsMessage: React.FC<StattisticsMessageProps> = ({ children }) => {
  const storeListPage = useAppSelector((state) => state.pancake.respListPage);
  const [stateListPage, setStateListPage] = useState(storeListPage);

  return (
    <div className="">
      StattisticsMessage
      {children}
    </div>
  );
}

StattisticsMessage.defaultProps = {
  children: undefined,
};

export default StattisticsMessage;
