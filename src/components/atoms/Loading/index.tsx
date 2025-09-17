/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import mapModifiers from 'utils/functions';

import logo from 'assets/images/short_logo.svg';

interface LoadingProps {
  isShow?: boolean;
  variant?: 'fullScreen' | 'default' | 'max_content';
  size?: 'large' | 'medium' | 'small';
}

const Loading: React.FC<LoadingProps> = ({
  isShow,
  variant,
  size,
}) => {
  const classModify = () => mapModifiers(
    'a-loader-circle',
    variant,
    size,
  );

  return (
    <div className={isShow ? classModify() : 'a-loader-circle-hide'}>
      <div className="loader-wrapper">
        <div className="loader-general">
          <img className="loader" src={logo} />
        </div>
      </div>
    </div>
  );
};

Loading.defaultProps = {
  size: 'medium',
};

export default Loading;
