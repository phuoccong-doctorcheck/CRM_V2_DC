/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default */

import { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import Avatar from 'components/molecules/Avatar';
import ChangePassword from 'components/molecules/ChangePassword';
import CTabs, { CTab, TabPanel } from 'components/organisms/CTabs';
import Container from 'components/organisms/Container';
import InformationUser from 'components/templates/InformationUser';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

const OptionTab = [
  // {
  //   label: 'Thông tin cá nhân',
  //   icon: '',
  //   content: <InformationUser />,
  // },
  {
    label: 'Đổi mật khẩu',
    icon: '',
    content: <ChangePassword />,
  },
];

const Profile: React.FC = () => {
  const [indexActive, setIndexActive] = useState(0);
  const name = Cookies.get('fullname')
  const position = Cookies.get('employee_team')
  return (
    <PublicLayout>
      <Container modifiers={['profile']}>
        <div className="p-profile">
          <div className="p-profile_left">
            <Avatar />
            <Typography content={name ? name : Cookies.get('fullname')?.toString()} type="p" modifiers={['700', 'cadet']} />
            <Typography content={`Vị trí: ${position ? position : Cookies.get('employee_team')}`} modifiers={['400', 'cadet']} />
            <CTabs variableMutate={indexActive} type="default">
              {
                OptionTab.map((item, index) => (
                  <CTab
                    icon={item.icon as IconName}
                    type="default"
                    key={`tab-${index.toString()}`}
                    label={item.label}
                    active={index === indexActive}
                    handleClick={() => setIndexActive(index)}
                  />
                ))
              }
            </CTabs>
          </div>
          <div className="p-profile_right">
            {
              OptionTab.map((item, index) => (
                <TabPanel key={`tab-panel-${index.toString()}`} active={index === indexActive}>
                  {item.content}
                </TabPanel>
              ))
            }
          </div>
        </div>
      </Container>
    </PublicLayout>
  );
};

export default Profile;
