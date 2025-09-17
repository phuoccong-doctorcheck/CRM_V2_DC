/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon, { IconName } from 'components/atoms/Icon';
import React from 'react';

import logo from 'assets/images/dtc_shot_logo.png';

export const IconRamdom: IconName[] = ['animal1', 'animal2', 'animal3', 'animal4', 'animal5'];

interface AvatarProps {
  previewUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({ previewUrl }) => (
  <div className="m-avatar">
    {
      previewUrl ? (
        <img
          src={previewUrl || logo}
          alt="avatar"
        />
      )
        : (
          <Icon
            iconName={'animal5'}
            size="120x120"
          />
        )
    }
  </div>
);

Avatar.defaultProps = {
};

export default Avatar;
