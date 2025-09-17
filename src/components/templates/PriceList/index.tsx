/* eslint-disable @typescript-eslint/no-unused-vars */
import Input from 'components/atoms/Input';
import CCollapse from 'components/organisms/CCollapse';
import React, { useEffect, useState } from 'react';
import { Service, ServiceGroup } from 'services/api/dashboard/types';

interface PriceListProps {
  children?: React.ReactNode;
  isClose?: boolean;
}

const PriceList: React.FC<PriceListProps> = ({ children, isClose }) => {
  const storageServicesDefault = localStorage.getItem('servicesDefault');

  const [stateServicesDefault, setStateServicesDefault] = useState<Service[]>(storageServicesDefault ? JSON.parse(storageServicesDefault) : []);
  const [dataSearch, setDataSearch] = useState<Service[]>(stateServicesDefault || []);
  const [valueSearch, setValueSearch] = useState('');

  const handleSearchService = (key: string) => {
    setValueSearch(key);
    const result: Service[] = []
    stateServicesDefault.flat(1).forEach((item: Service) => {
     
      if (item?.service_name?.toLocaleLowerCase().search(key.toLocaleLowerCase()) !== -1) {
        result.push(item);
      }
    });
    // console.log(result)
    setDataSearch(result);
  }

  useEffect(() => {
    if (isClose) {
      setDataSearch(stateServicesDefault);
      setValueSearch('');
    }
  }, [isClose])

  return (
    <div className="t-price_list">
      <div className="t-price_list_search">
        <Input iconName="search" variant='simple' onChange={(e) => { handleSearchService(e.target.value); }} value={valueSearch} />
      </div>
      <div className="t-price_list_content">
        {dataSearch.length ? dataSearch.map((service, index) => (
          <div key={`${index}-${Math.floor(Math.random() * 100000)}`} className="t-price_list_content_item">
            <ul className="t-price_list_content_item_wrap" >
              <li>{service.service_name}</li>
              <li>{service.service_prices.toLocaleString("vi-VN")}&ensp;VNĐ</li>
            </ul>
          </div>
        )) : null}
      </div>
    </div>
  );
}

PriceList.defaultProps = {
  children: undefined,
};

export default PriceList;
