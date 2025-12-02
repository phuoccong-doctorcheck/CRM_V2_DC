/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Notifications } from 'react-push-notification';
import './App.scss';
import './i18n';
import Loading from 'components/atoms/Loading';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DEFAULT_QUERY_OPTION } from 'utils/constants';
import { Provider } from 'react-redux';
import { persistor, store } from 'store';
import Authentication from 'pages/Authentication';
import Dashboard from 'pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from 'pages/Profile';
import MultiChannel from 'pages/MultiChannel';
import DetailCustomer from 'pages/DetailCustomer';
import CommingSoon from 'pages/CommingSoon';
import MedicalApointmentList from 'pages/BeforeMedicalExamination';
import AfterMedicalExamination from 'pages/AfterMedicalExamination';
import BookingSchedule from 'pages/BookingSchedule';
import MissCall from 'pages/MissCall';
import Setting from 'pages/Setting';
import CReport from 'pages/Report';
import AppointmentView from 'pages/AppointmentView';
import LoginWithLink from 'pages/LoginWithLink';
import NoPermission from 'components/templates/NoPermission';
import PagePending from 'pages/PagePending';
import NotFoundCustomer from 'pages/NotFoundCustomer';
import ErrorPage from 'pages/ErrorPage';
import ManagerTask from 'components/templates/ManagerTask';
import MonitoringMissedCall from 'pages/MonitoringMissedCall';
import Affiliate from 'pages/Affiliate';
import ApproveCommissions from 'pages/ApproveCommissions';
import ReportGrowthClinic from 'pages/ReportGrowthClinic';
import CompareGrowth from 'pages/CompareGrowth';
import ReportChannel from 'pages/ReportChannel';
import HistoriesCall from 'pages/HistoriesCall';
import PointManagement from 'pages/PointManagement';
import Campaigns from 'pages/Campaigns';
import CustomerLeads from 'pages/CustomerLeads';
import PreviewNewFeature from 'pages/PreviewNewFeature';
import FormerCustomerReferrals from 'pages/FormerCustomerReferrals';
import CustomerAllowFType from 'pages/CustomerAllowFType';
import BusinessPlan from 'pages/BusinessPlan';
import Manage_Task from 'pages/Manage_Task';
import ChartSalers from 'pages/ChartSalers';
import ManageKPIs from 'pages/Manage_KPIs';
import ScreeningReminder from 'pages/ScreeningReminder';
import ChartSalersTV from 'pages/ChartSalersTV';
import Manage_KPIs2 from 'pages/Manage_KPIs2';
import SurveyStatistics from 'pages/SurveyStatistics';
import CustomerWOM from 'pages/CustomerWOM';
import ReportCustomerReExamination from 'pages/ReportCustomerReExamination';
import AfterMedicalExaminationTask from 'pages/AfterMedicalExaminationTask';
import ListPrice from 'pages/ListPrice';
import ShiftPage from 'pages/ShiftPage';
import PageInfoLeads from 'pages/PageInfoLeads';
import ListCustomer from 'pages/ListCustomer';
import DashboardPage from 'pages/DashboardPage';
import DashboardMarketingPage from 'pages/DashboardMarketingPage';
import CallReExamination from 'pages/CallReExamination';
import UserGuids from 'pages/UserGuids';
import DashboardSalesPage from 'pages/DashboardSalesPage';
import AddAimDashboardPage from 'pages/AddAimDashboardPage';
import CustomerOnDayView from 'pages/CustomerOnDayView';


const routes = [
  {
    path: '/pending',
    element: <PagePending />, // pending
  },
  {
    path: '/login',
    element: <Authentication />, // login
  },
  {
    path: '/report-channel',
    element: <ReportChannel />, // login
  },
  {
    path: '/histories-call',
    element: <HistoriesCall />, // login
  },
  {
    path: '/sso-crm',
    element: <LoginWithLink />, // login
  },
  {
    path: '/',
    element: <Dashboard />, // trang chủ
  },
  {
    path: '/growth',
    element: <ReportGrowthClinic />, // trươc khám
  },
  {
    path: '/growth-compare',
    element: <CompareGrowth />, // trươc khám
  },
  {
    path: '/conversion',
    element: <MedicalApointmentList />, // trươc khám
  },
  {
    path: '/after-exams',
    element: <AfterMedicalExamination />, // sau khám
  },
  {
    path: '/customer-info/:type/:info/:tab',
    element: <DetailCustomer />, // chi tiết thông tin KH
  },
  {
    path: '/profile',
    element: <Profile />, // cá nhân
  },
  {
    path: '/grid-booking',
    element: <BookingSchedule />, // Danh sách đạt lịch
  },
  {
    path: '/track-booking',
    element: <AppointmentView />, // Danh sách hẹn khám
  },
  {
    path: '/miss-call',
    element: <MissCall />, // misscall
  },
  {
    path: '/channel',
    element: <MultiChannel />, // Chat
  },
  {
    path: '/setting',
    element: <Setting />, // cài đặt
  },
  {
    path: '/reports',
    element: <CReport />, // thống kê
  },
  {
    path: '/not-have-permission',
    element: <NoPermission />, // Không có quyền truy cập
  },
  {
    path: '/customer-not-found/:phone',
    element: <NotFoundCustomer />, // Không tìm thấy khách hàng có sdt gọi đến
  },
  {
    path: '/error',
    element: <ErrorPage />, // trang lỗi
  },
  {
    path: '/shift',
    element: <ShiftPage />, // trang lỗi
  },
  {
    path: '/account/task',
    element: <ManagerTask />, // trang lỗi
  },
  {
    path: '/monitor',
    element: <MonitoringMissedCall />, // trang lỗi
  },
  
  {
    path: '/affiliate',
    element: <Affiliate />, // trang lỗi
  },
  {
    path: '/approve-commissions',
    element: <ApproveCommissions />, // trang lỗi
  },
  {
    path: '/point-management',
    element: <PointManagement />, // trang lỗi
  },
  {
    path: '/campaign',
    element: <Campaigns />, // trang lỗi
  },
  {
    path: '/customer-leads',
    element: <CustomerLeads />, // trang lỗi
  },
  {
    path: '/wom',
    element: <FormerCustomerReferrals />, // trang lỗi
  },
    {
    path: '/manage-task',
    element: <Manage_Task />, // trang lỗi
  },
  {
    path: '/preview-new-feature',
    element: <PreviewNewFeature />, // trang lỗi
  },
  {
    path: '/customer-f-type',
    element: <CustomerAllowFType />, // trang lỗi
  },
    {
    path: '/bussiness-plan',
    element: <BusinessPlan />, // trang lỗi
  },
   {
    path: '/chart',
    element: <ChartSalers />, // trang xem biểu đồ của các CSKH
  },
   {
    path: '/monitor-chart-sales',
    element: <ChartSalersTV />, // trang xem biểu đồ của các CSKH
  },
  {
    path: '/mangage-kpi2',
    element: <ManageKPIs />, // trang xem KPI tháng
  },
   {
    path: '/mangage-kpi',
    element: <Manage_KPIs2 />, // trang xem KPI tháng
  },
  {
    path: '/screening-reminder',
    element: <ScreeningReminder />, // trang xem KPI tháng
  },
   {
    path: '/survey-statistics',
    element: <SurveyStatistics />, // trang xem KPI tháng
  },
    {
    path: '/customer-wom',
    element: <CustomerWOM />, // trang xem KPI tháng
  },
  {
    path: '*',
    element: <CommingSoon />, // đang phát triển
  },
   {
    path: '/customer-re-examination',
    element: <ReportCustomerReExamination />, // đang phát triển
  },
    {
    path: '/after-medical-task',
    element: <AfterMedicalExaminationTask />, // đang phát triển
  },
      {
    path: '/service-quote',
    element: <ListPrice />, // đang phát triển
  },
  {
    path: '/',
    element: <ListPrice />, // đang phát triển
  },
  {
    path: '/lead-info',
    element: <PageInfoLeads />, // chi tiết thông tin KH
  },
   {
    path: '/list-customer',
    element: <ListCustomer />, // chi tiết thông tin KH
  },
     {
    path: '/user-guids',
    element: <UserGuids />, // chi tiết thông tin KH
  },
    {
    path: '/dashboard',
    element: <DashboardPage />, // chi tiết thông tin KH
  },
        {
    path: '/dashboard-marketing',
    element: <DashboardMarketingPage />, // chi tiết thông tin KH
  },
          {
    path: '/call-re-examination',
    element: <CallReExamination />, // đang phát triển
  },
            {
    path: '/dashboard-sale',
    element: <DashboardSalesPage />, // đang phát triển
  },
             {
    path: '/add-dashboard-sales',
    element: <AddAimDashboardPage />, // đang phát triển
  },

            {
    path: '/customer-on-day-view',
    element: <CustomerOnDayView />, // đang phát triển
  },];
const queryClient = new QueryClient({
  defaultOptions: {
    queries: DEFAULT_QUERY_OPTION,
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/">
            <Suspense fallback={<Loading variant="fullScreen" />}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={`route-${index.toString()}`}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                theme="colored"
              />
            </Suspense>
          </BrowserRouter>
          <Notifications />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
