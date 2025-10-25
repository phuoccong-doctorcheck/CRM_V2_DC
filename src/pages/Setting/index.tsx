/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default */
import CTabs, { TabItemType } from 'components/molecules/CTabs';
import Container from 'components/organisms/Container';
import CampaignTemplateSetting from 'components/templates/CampaignTemplateSetting';
import LinkedAccountSetting from 'components/templates/LinkedAccountSetting';
import ShiftManagement from 'components/templates/ManageShift';
import ManageShift from 'components/templates/ManageShift';
import ManageTags from 'components/templates/ManageTags';
import NotificationSetting from 'components/templates/NotificationSetting';
import PublicLayout from 'components/templates/PublicLayout';
import SupportLibraries from 'components/templates/SupportLibraries';
import TagSetting from 'components/templates/TagSetting';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OptionTab = [
  {
    key: 1,
    label: 'Tags',
    children: <ManageTags />,
  },
  // {
  //   key: 3,
  //   label: 'Tự dộng hóa',
  //   children: <LinkedAccountSetting />,
  // },
  // {
  //   key: 0,
  //   label: 'Danh mục',
  //   children: <CampaignTemplateSetting />,
  // },
  // {
  //   key: 2,
  //   label: 'Tài liệu hướng dẫn',
  //   children: <TagSetting />,
  // },
  // {
  //   key: 4,
  //   label: 'Người dùng',
  //   children: <NotificationSetting />,
  // },
  {
    key: 5,
    label: 'Ca trực',
    children: <ShiftManagement />,
  },
];

const Setting: React.FC = () => {
  const navigator = useNavigate();

  const [indexActive, setIndexActive] = useState(0);
  const tabactive = localStorage.getItem('settingTab_active');

  const getRoles = localStorage.getItem('roles');
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');

  useEffect(() => {
    // if (!(listRoles?.some((role: any) => ['adDashBoard'].some((i => i === role?.role_name)))) && !menuData?.find((i) => i?.slug === window.location.pathname)?.role.some((y) => y === 'All')) {
    if ((listRoles?.some((role: any) => ['adDashBoard', 'normal', 'robot'].some((i => i === role?.role_name))))) {
      setIndexActive(Number(tabactive));
      return;
    }
    return navigator('/not-have-permission');
  }, []);

  return (
    <PublicLayout>
      <Container modifiers={['web-app']}>
        <div className="p-setting">
          <CTabs
            options={OptionTab as unknown as TabItemType[]}
            defaultActiveKey="0"
            position="left"
            size="small"
            variant="style"
            handleOnTabClick={(data: any) => { }} />
        </div>
      </Container>
    </PublicLayout>
  );
};

export default Setting;
