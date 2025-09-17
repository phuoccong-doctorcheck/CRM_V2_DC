/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Typography from 'components/atoms/Typography';
import PublicLayout from 'components/templates/PublicLayout';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import imgErr from 'assets/images/error.png';

const CommingSoon: React.FC = () => {
  const navigator = useNavigate();

  return (
    <PublicLayout>
      <div className="p-comming_soon">
        <div className="p-comming_soon_wrap">
          <div className="p-comming_soon_wrap_title">
            <Typography type="h2" content="Opps...! Page not found" />
            <Button onClick={() => navigator('/')}>
              <Typography type="p" content="Quay lại trang chủ" />
            </Button>
          </div>
          <div className="p-comming_soon_wrap_img">
            <img src={imgErr} alt="error" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CommingSoon;
