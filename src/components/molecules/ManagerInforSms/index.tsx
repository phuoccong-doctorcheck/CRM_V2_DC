/* eslint-disable @typescript-eslint/no-unused-vars */

import Icon from 'components/atoms/Icon';
import Switchs from 'components/atoms/Switchs';
import Typography from 'components/atoms/Typography';
import { SMSInfos, EmailInfos } from 'components/templates/LinkedAccountSetting';
import React, { useState } from 'react';
import mapModifiers from 'utils/functions';

type Type = 'sms' | 'email';

interface ManagerInforSmsProps {
  optionForSMS?: SMSInfos[];
  optionForEmail?: EmailInfos[];
  type: Type;
}

const ManagerInforSms: React.FC<ManagerInforSmsProps> = ({
  optionForSMS, optionForEmail, type,
}) => {
  const [idHover, setIdHover] = useState(0);
  return (
    <div className={mapModifiers('m-integration_manager', type)}>
      {
        (type === 'sms' ? optionForSMS : optionForEmail)?.length && type === 'sms' ? optionForSMS?.map((sms) => (
          <div
            className="m-integration_manager_item"
            key={sms.id}
            onMouseEnter={() => setIdHover(sms.id)}
            onMouseLeave={() => setIdHover(0)}
          >
            <Typography type="span" content={sms.name} />
            <Typography type="p" content={sms?.phone} />
            <Switchs checked={sms.isDisable} onChange={() => { }} />
            {
              idHover === sms.id && (
                <div className="close">
                  <Icon iconName="close" isPointer />
                </div>
              )
            }
          </div>
        )) : optionForEmail?.map((item) => (
          <div
            className="m-integration_manager_item"
            key={item.id}
            onMouseEnter={() => setIdHover(item.id)}
            onMouseLeave={() => setIdHover(0)}
          >
            <Typography type="span" content={item.name} />
            <Typography type="p" content={item?.email} />
            <Switchs checked={item.isDisable} onChange={() => { }} />
            {
              idHover === item.id && (
                <div className="close">
                  <Icon iconName="close" isPointer />
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  );
};

ManagerInforSms.defaultProps = {
};

export default ManagerInforSms;
