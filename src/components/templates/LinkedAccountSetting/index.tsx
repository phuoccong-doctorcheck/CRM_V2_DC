/* eslint-disable import/no-named-as-default */

import { DataExampleForSMS, ExampleDataForEmail } from 'assets/data';
import Button from 'components/atoms/Button';
import { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import ManagerInforSms from 'components/molecules/ManagerInforSms';
import CDrawer from 'components/organisms/CDrawer';
import CTabs, { CTab, TabPanel } from 'components/organisms/CTabs';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

export interface SMSInfos {
  id: number;
  name: string;
  apiKey: string;
  secretKey: string;
  smsType: string;
  branchName: string;
  phone: string;
  isDisable: boolean;
}
export interface EmailInfos {
  id: number;
  name: string;
  apiKey: string;
  email: string;
  senderName: string;
  isDisable: boolean;
}

interface LinkedAccountSettingProps {
}

const LinkedAccountSetting: React.FC<LinkedAccountSettingProps> = ({ }) => {
  const [indexActive, setIndexActive] = useState(0);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const tabActive = localStorage.getItem('tabIntegration_active');

  useEffect(() => {
    setIndexActive(Number(tabActive));
  }, []);

  const OptionTab = [
    {
      label: 'SMS',
      icon: '',
      content: <ManagerInforSms type="sms" optionForSMS={DataExampleForSMS} />,
    },
    {
      label: 'Email',
      icon: '',
      content: <ManagerInforSms type="email" optionForEmail={ExampleDataForEmail} />,
    },
  ];

  return (
    <div className="t-integration">
      <div className="t-integration_header">
        <CTabs variableMutate={indexActive} type="default">
          {
            OptionTab.map((item, index) => (
              <CTab
                icon={item.icon as IconName}
                type="default"
                key={`tab-${index.toString()}`}
                label={item.label}
                active={index === indexActive}
                handleClick={() => {
                  setIndexActive(index);
                  Cookies.set('tabIntegration_active', index.toString());
                }}
              />
            ))
          }
        </CTabs>
        {(indexActive === 0 || indexActive === 1) && (
          <Button modifiers={['primary']} onClick={() => setIsOpenDrawer(true)}>
            <Typography content="Thêm mới" modifiers={['500']} />
          </Button>
        )}
      </div>
      <div className="t-integration_content">
        {
          OptionTab.map((item, index) => (
            <TabPanel key={`tab-panel-${index.toString()}`} active={index === indexActive}>
              {item.content}
            </TabPanel>
          ))
        }
      </div>
      <CDrawer isOpen={isOpenDrawer} handleOnClose={() => setIsOpenDrawer(false)} widths={600}>
        2
      </CDrawer>
    </div>
  );
};

LinkedAccountSetting.defaultProps = {
};

export default LinkedAccountSetting;
