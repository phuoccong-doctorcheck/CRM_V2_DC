/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import PublicLayout from 'components/templates/PublicLayout';
import React from 'react';

import introDc from 'assets/images/intro_dc.jpg';

export interface FormAddTodoStep {
  id: number;
  name: string;
  isDone: boolean;
}

const Dashboard: React.FC = () => {
  return (
    <PublicLayout>
      <div className="p-dashboard">
        <div className="p-dashboard_intro">
          <img src={introDc} />
        </div>
      </div>
    </PublicLayout>
  );
};
export default Dashboard;
