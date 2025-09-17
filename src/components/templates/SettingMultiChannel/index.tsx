/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { exampleDataSocial, listNotification } from 'assets/data';
import Button from 'components/atoms/Button';
import ButtonLink from 'components/atoms/ButtonLink';
import Checkbox from 'components/atoms/Checkbox';
import Icon, { IconName } from 'components/atoms/Icon';
import InputLink from 'components/atoms/InputLink';
import TitleGroup from 'components/atoms/TitleGroup';
import Typography from 'components/atoms/Typography';
import React, { useState } from 'react';

type TypeSocial = 'facebook' | 'zalo';

export interface InfosSocialAccount {
  id?: number;
  icon: IconName;
  usename: string;
  name: string;
  type: TypeSocial;
}
export interface InfosNotify {
  id?: number;
  content: string;
  enable: boolean;
}

interface SettingMultiChannelProps {
  optionsSocial?: InfosSocialAccount[];
  optionsNotifications?: string[];
}

const SettingMultiChannel: React.FC<SettingMultiChannelProps> = ({
  optionsSocial, optionsNotifications,
}) => {
  const [idSocialHover, setIdSocialHover] = useState<number>();
  const [idCheckbox, setIdCheckbox] = useState(10);
  const [isChecked, setIsChecked] = useState(false);
  const listSocialFacebook = exampleDataSocial.filter((i) => i.type === 'facebook');
  const listSocialZalo = exampleDataSocial.filter((i) => i.type === 'zalo');
  return (
    <div className="t-setting_chat">
      <div className="t-setting_chat_field">
        <TitleGroup lable="Kênh tương tác" className="field">
          <div className="t-setting_chat_field_flex">
            <Typography content="Facebook" modifiers={['16x24', 'jetSub', 'capitalize', '600']} />
            <p className="grid-col2">
              {
                listSocialFacebook?.length && listSocialFacebook.map((social) => (
                  <div
                    key={social.id}
                    className="flexbox_item"
                    onMouseOver={() => setIdSocialHover(social.id)}
                    onMouseLeave={() => setIdSocialHover(0)}
                  >
                    <Icon iconName={social.icon} size="80x80" />
                    <div>
                      <Typography content={social.usename} />
                      <Typography content={social.name} />
                    </div>
                    {
                      idSocialHover === social.id && (
                        <div key={social.id} className="flexbox_item_close">
                          <Icon iconName="close" size="20x20" isPointer />
                        </div>
                      )
                    }
                  </div>
                ))
              }
              <ButtonLink />
            </p>
          </div>
          <div>
            <Typography content="Zalo" modifiers={['16x24', 'jetSub', 'capitalize', '600']} />
            <p className="grid-col2">
              {
                listSocialZalo?.length && listSocialZalo.map((social) => (
                  <div
                    key={social.id}
                    className="flexbox_item"
                    onMouseOver={() => setIdSocialHover(social.id)}
                    onMouseLeave={() => setIdSocialHover(0)}
                  >
                    <Icon iconName={social.icon} size="80x80" />
                    <div>
                      <Typography content={social.usename} />
                      <Typography content={social.name} />
                    </div>
                    {
                      idSocialHover === social.id && (
                        <div key={social.id} className="flexbox_item_close">
                          <Icon iconName="close" size="20x20" isPointer />
                        </div>
                      )
                    }
                  </div>
                ))
              }
              <ButtonLink />
            </p>
          </div>
        </TitleGroup>
        <TitleGroup lable="Thông báo">
          {
            listNotification.length && listNotification.map((notifi, index) => (
              <div className="t-setting_notify_item" key={index} id={`${index}`}>
                <Typography content={notifi.content} />
                <Checkbox
                  isCheckCustom
                  onChange={() => {
                    setIsChecked(!isChecked);
                    setIdCheckbox(notifi.id || 0);
                  }}
                  checked={isChecked && idCheckbox === notifi.id}
                />
              </div>
            ))
          }
        </TitleGroup>
      </div>
    </div>
  );
};

// SettingMultiChannel.defaultProps = {
// };

export default SettingMultiChannel;
