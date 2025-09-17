/* eslint-disable import/order */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { SipProvider } from 'components/templates/SipProvider';
import viVN from 'antd/lib/locale/vi_VN'; // Import the Vietnamese locale
import 'dayjs/locale/vi'; import dayjs from 'dayjs'
import './index.scss';
import moment from 'moment';
import 'moment/locale/vi' // Import the dayjs locale for Vietnamese

// Set the dayjs locale
dayjs.locale('vi');
moment.locale('vi');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <ConfigProvider locale={viVN}>
    {/* <React.StrictMode> */}
      <SipProvider>
        <App />
      </SipProvider>
    {/* </React.StrictMode> */}
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
