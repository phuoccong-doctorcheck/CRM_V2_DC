/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Progress } from 'antd';
import { OptionTypeCustomerBooking, optionCancelBooking, optionDate } from 'assets/data';
import CDatePickers from 'components/atoms/CDatePickers';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import FloatFilter from 'components/molecules/FloatFilter';
import FormAddCustomer from 'components/molecules/FormAddCustomer';
import PublicTable from 'components/molecules/PublicTable';
import CCollapse from 'components/organisms/CCollapse';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicHeaderStatistic from 'components/templates/PublicHeaderStatistic';
import PublicLayout from 'components/templates/PublicLayout';
import Cookies from 'js-cookie';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postPrintAppointmentServicepoint } from 'services/api/appointmentView';
import { postSaveCustomerBeforeExams } from 'services/api/beforeExams';
import { BookingScheduleItem } from 'services/api/booking_schedule/types';
import { postCanceledAppointment, postDelayAppointment } from 'services/api/customerInfo';
import { getListBooking, postLoadingBooking } from 'store/booking_schedule';
import { getInfosCustomerById } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getSurveyStatistics } from 'store/statistics';
import mapModifiers, { downloadBlobPDF, downloadBlobPDFOpenLink, previewBlobPDFOpenLink } from 'utils/functions';

export type StateActionType = 'Đã khám xong' | 'Đã hủy' | 'Chưa đến' | 'Đang phục vụ';
type StateType = 'KH mới' | 'KH cũ';
export interface BookingScheduleType {
  id: number;
  timeBooking: Date;
  name: string;
  yearOfBirh: Date;
  sex: DropdownData;
  phoneNumber: string;
  state: StateType;
  origin: DropdownData;
  stateAction: StateActionType;
}
interface Comment {
  datetime: string;
  owner: string;
  content: string;
}

interface Statistics {
  scores: number;
  score_total: number;
  comment_total: number;
  comments: Comment[];
}
  const convertDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format
        };

        // Get formatted date string
        const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
        
        // Replace spaces to get the desired format
        return formattedDate.replace(/\//g, '-').replace(' ', ' ');
    };
const SurveyStatistics: React.FC = () => {
  const dispatch = useAppDispatch();

  const storeBookingSchedule = useAppSelector((state) => state.bookingSchedule.listBooking);
  const storeBookingStatistic = useAppSelector((state) => state.bookingSchedule.statisticBooking);
  const storeLoadingBookingSchedule = useAppSelector((state) => state.bookingSchedule.loadingBooking);

  const storeSurveyStatistics = useAppSelector((state) => state.statistic.responseSurveyStatistics);
  const storeLoadingSurveyStatistics = useAppSelector((state) => state.statistic.loadingSurveyStatistics);

  const storageLaunchSources = localStorage.getItem('launchSources');
  const storageLaunchSourcesGroup = localStorage.getItem('launchSourcesGroups');
  const storageLaunchSourcesType = localStorage.getItem('launchSourcesTypes');

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);
  const [stateLaunchSourceTypes, setstateLaunchSourceTypes] = useState<DropdownData[]>(storageLaunchSourcesType ? JSON.parse(storageLaunchSourcesType) : []);
  const [listLaunchSources, setListLaunchSources] = useState<DropdownData[]>(storageLaunchSources ? JSON.parse(storageLaunchSources) : []);

  const [stateBookingStatistic, setStateBookingStatistic] = useState(storeBookingStatistic);
  const [listSchedule, setListSchedule] = useState(storeBookingSchedule);
  const [surveyStatistics, setSurveyStatistics] = useState(storeSurveyStatistics.data);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [masterID, setMasterID] = useState('');
  const [isSendQuestions, setSendQuestions] = useState(false);
  const [dataDelayBooking, setDataDelayBooking] = useState({ date: new Date(), value: '' });
  const [dateBooking, setDateBooking] = useState<Date>();
  const [dataFilter, setDataFilter] = useState({
    fromDate: moment(moment(new Date()).format('YYYY-MM-DDT00:00:00')).subtract(1, 'month').startOf('month').format('YYYY-MM-DDT00:00:00'),
    toDate: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    altStatus: '',
    launchSourceId: '',
    launchSourceGroupId: '',
    launchSourceTypeId: '',
    keySearch: '',
    key: ''
  });
  const [canceledReason, setCanceledReason] = useState({
    type: '',
    reason: '',
    item: undefined as unknown as GroupRadioType,
  });
  const [isStatisticMobile, setIsStatisticMobile] = useState(false);
   const today = moment(); // Current date
  const threeMonthsAgo = moment().subtract(3, 'months'); // Date three months ago
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);
  const [arrayComment,setArraycomment] = useState<any>([])
  useEffect(() => {
    dispatch(getListBooking({} as any));
    dispatch(getSurveyStatistics({fromdate : dataFilter.fromDate, todate: dataFilter.toDate} as any));
    document.title = 'Kết quả khảo sát | CRM'
  }, []);

  const propsData = {
    dateGetList: dataFilter?.dateGetList || moment(new Date()).format('YYYY-MM-DDT00:00:00'),
    launchSourceId: dataFilter?.launchSourceId || null,
    launchSourceGroupId: dataFilter?.launchSourceGroupId || null,
    launchSourceTypeId: dataFilter?.launchSourceTypeId || null,
    altStatus: dataFilter?.altStatus || null,
    keySearch: dataFilter?.keySearch || '',
    key: dataFilter.key
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, [window.innerWidth]);

  useEffect(() => {
    setStateBookingStatistic(storeBookingStatistic);
  }, [storeBookingStatistic]);

  useEffect(() => {
    setListSchedule(storeBookingSchedule);
  }, [storeBookingSchedule]);
    useEffect(() => {
    setSurveyStatistics(storeSurveyStatistics.data);
  }, [storeSurveyStatistics]);
  // React Query dời lịch
  const { mutate: postDelayBooking } = useMutation(
    'post-footer-form',
    (data: any) => postDelayAppointment(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setDataDelayBooking({ date: undefined as unknown as Date, value: '' })
          dispatch(getListBooking(data));
          setSendQuestions(false);
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  // bảng thông tin danh sách các khách hàng book vào từng khung giờ
  const getTitle = (data: any, index: number) => {

    const title = data.q_id.toString() + ". " + data.q_title
    return title
  }
   const getCountRespond = (data: any, index: number) => {
    const countRp =   data.s_total
    return countRp
  }
    const getArrayStatistics = (data: any, index: number) => {

    const countRp = "Phản hồi:" + " " + data.s_total
    return data?.statistics
  }
   const statistics: Statistics[] = [
    {
      scores: 10,
      score_total: 12,
      comment_total: 0,
      comments: [],
    },
    {
      scores: 9,
      score_total: 2,
      comment_total: 1,
      comments: [
        {
          datetime: '2024-09-25T13:29:23.677+07:00',
          owner: 'Anh Tân',
          content:
            'Gọi tổng đài 12:00 trưa không bắt máy, đề xuất luôn có người trực tổng đài',
        },
      ],
    },
  ];

  // Tổng số score_total để tính phần trăm


  // Tạo mảng từ 1 đến 10 cho các cột
  const scoreColumns = Array.from({ length: 10 }, (_, i) => i + 1);
  const memoTableBooking = useMemo(() => (
    <main style={{height:"100vh"}}>
     
      <div  style={{height:"calc(100vh - 120px)"}}>
        <PublicTable
          listData={surveyStatistics?.items}
          loading={storeLoadingSurveyStatistics}
          isPagination={false}
          column={[
            {
              title: '',
              align: 'left',
              dataIndex: 'time_range',
              render: (record: any, data: any,index:number) => (
               
                <div style={{ height: "fit-content", width: "100%",}}>
                  <div style={{height:"100%", width:"100%"}}>
                    <div style={{marginLeft:"10px"}}>
                       <Typography
                     content={getTitle(data, index)}
                      modifiers={['16x24', '600', 'justify', 'blueNavy']}
                    styles={{fontSize:"20px", marginBottom:"5px", marginTop:"5px"}}
                      />
                      <div style={{display:"flex",alignItems:"center",}}>
                         <Typography
                     content="Tổng khách hàng đánh giá: "
                      modifiers={['14x20', '500', 'justify', 'main']}
                      styles={{marginRight:"5px"}}
                    />
                    <Typography
                     content={getCountRespond(data, index)}
                      modifiers={['14x20', '600', 'justify', 'green']}
                    
                    />
                      </div>

                </div>
                    <div>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
     
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
        }}
      >
        {scoreColumns.map((score) => {
          // Tìm object trong statistics tương ứng với điểm
            const totalScore = getArrayStatistics(data, index).reduce(
    (total:any, stat:any) => total + stat.score_total,
    0
  );
          const stat = getArrayStatistics(data, index).find((item:any) => item.scores === score);
          // Tính phần trăm cho mỗi điểm
          const percent = stat ? (stat.score_total / totalScore) * 100 : 0;

          return (
            <div key={score} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: "600", fontSize: "20px" }}>{score}</div>
                <div style={{ position: 'relative', height: '130px', display:"flex", alignItems:"center" }}>
              <Progress
                type="line"
                percent={percent}
                showInfo={false} // Ẩn phần trăm mặc định trong cột
                strokeWidth={16} // Độ dày của cột Progress
                style={{
                  height: '150px',
                  width: '20px',
                  transform: 'rotate(-90deg)', // Xoay để Progress đứng
                  transformOrigin: 'center', // Điểm xoay ở giữa
                  marginBottom: '10px',
                }}
              />
               <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Căn chỉnh vị trí giữa cột
                    color: '#000', // Màu chữ của phần trăm
                    fontSize: '12px', // Kích thước chữ
                    fontWeight: 'bold', // Đậm chữ
                    whiteSpace: 'nowrap', // Không xuống dòng
                  }}
                >
                  {percent.toFixed(1)}%
                </div>
                 </div>
                <Typography
                //content={percent.toFixed(1) + "%"}
                content={stat?.score_total === undefined ? "0 KH đánh giá" : stat?.score_total + " KH đánh giá"}
                      modifiers={['14x20', '600', 'center', 'green']}
                    styles={{ marginBottom: "8px" }}
                />
              <>
                {
                  (stat?.comment_total === undefined || stat?.comment_total === 0) ? 
                       <div  className="p-booking_schedule_heading_button" style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", background: "#e9e9e9", borderRadius:"5px",boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",color:"black" }}>
                                  <div>0 nhận xét</div>
                </div> :  <div className="p-booking_schedule_heading_button buttonHover" style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",  background: "#1976D2", borderRadius:"5px",boxShadow: "0 2px 1px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }} onClick={() => { setIsCanceled(true); setArraycomment(stat?.comments) }}> {stat?.comment_total} nhận xét</div>
              }
              </>
             
            </div>
          );
        })}
      </div>
    </div>
                    </div>
                   </div>
                </div>
              ),
            }]}
          rowClassNames={(record, index) => 'p-surveyStatistics_row_item'}
          expandedRowClassNames={(record: any, index: any, indent: any) => {
            const { valueTime, child } = record;
            if (new Date(valueTime).valueOf() < new Date().valueOf()) {
              return `p-surveyStatistics_over_time ${_.isEmpty(child) && 'p-surveyStatistics_empty_child'}`;
            }
            return `p-surveyStatistics_normal_time ${_.isEmpty(child) && 'p-surveyStatistics_empty_child'}`;
          }}
          rowkey="id"
          scroll={{ x: 'max-content', y:'100vh' }}
          isHideHeader
          isHideRowSelect
          isExpandable={true}
          defaultExpandAllRow={true}
          expandedRowKeys={Array?.from({ length: 100 }, (_, index) => index)}
         
        />
      </div >
    </main >
  ), [storeLoadingSurveyStatistics, storeSurveyStatistics,surveyStatistics])

  const statisticHeader = useMemo(() => (
    <PublicHeaderStatistic
      handleClick={(data: any) => {

      }}
      title='KHẢO SÁT CHẤT LƯỢNG DỊCH VỤ CỦA DOCTOR CHECK'
      
      isStatistic={false}
      valueRangeDate={{
        from: new Date(),
        to: new Date(),
      }}>
     
    </PublicHeaderStatistic>
  ), [stateBookingStatistic, stateBreakPoint, isStatisticMobile]);
  
  return (
    <>
      <PublicLayout  >
        <div className="p-surveyStatistics">
   <div className={mapModifiers('p-surveyStatistics_statistics', stateBreakPoint < 1000 && 'mobile')}>
            {statisticHeader}
          </div>
         
          <PublicHeader
             isHideEmergency
          isHideFilter
          isHideService
            isHideCleanFilter
            
            titlePage=""
            className="p-surveyStatistics_header_public"
            handleFilter={() => { }}
            isDial={false}
          
            handleCleanFilter={() => {
              setDataFilter({
                ...dataFilter,
                dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'), launchSourceId: '', altStatus: '', keySearch: '', launchSourceGroupId: '', launchSourceTypeId: ''
              })
              const body = {
                dateGetList: moment(new Date()).format('YYYY-MM-DDT00:00:00'),
                launchSourceId: '',
                altStatus: '',
                keySearch: '',
                launchSourceGroupId: '',
                launchSourceTypeId: ''
              }
              setListSchedule(undefined as any);
              dispatch(getListBooking(body as any));
            }}
            handleGetTypeSearch={() => { }}
            isHideFilterMobile={false}
            handleClickFilterMobile={() => { }}
            isUseSearch
            tabLeft={(
              <div className='p-surveyStatistics_form_filter'>
                <RangeDate
                   disabledDate={(current:any) => {
        // Disable future dates and dates older than 3 months
        return (
          current && 
          (current > today.endOf('day') || current < threeMonthsAgo.startOf('day'))
        );
      }}
  variant="simple"
  handleOnChange={(from: any, to: any) => {
    setDataFilter({
      ...dataFilter,
      fromDate: moment(from).format('YYYY-MM-DDT00:00:00'),  // giữ dưới dạng string
      toDate: moment(to).format('YYYY-MM-DDT23:59:59'),      // giữ dưới dạng string
    });
      dispatch(getSurveyStatistics({fromdate : moment(from).format('YYYY-MM-DDT00:00:00'), todate: moment(to).format('YYYY-MM-DDT23:59:59')} as any));
  }}
  value={{
    from: dataFilter?.fromDate,   // từ string
    to: dataFilter?.toDate,       // từ string (chỉnh lại đúng toDate thay vì toDay)
  }}
  fomat="DD/MM/YYYY"  // Sửa "fomat" thành "format"
  />

               
              </div>
            )}
           
          />
          {memoTableBooking}
        
            <CModal
              isOpen={isCanceled}
              widths={540}
              title=""
              onCancel={() => setIsCanceled(false)}
              textCancel='Hủy'
              textOK='OK'
              onOk={() => setIsCanceled(false)}
            >
                 {
            arrayComment?.map((data:any) => {
             
              return <div style={{ width:"100%", borderBottom:"1px solid #deded9", paddingBottom:"10px", paddingTop:"10px"}}>
                  <Typography
                     content={data.owner}
                      modifiers={['16x24', '600', 'justify', 'blueNavy']}
                    
                />
                <div style={{ display: "flex", alignItems:"center"}}>
                     <Typography
                     content={"Thời gian: " + " " }
                      modifiers={['14x20', '600', 'justify', 'main']}
                    styles={{marginRight:"5px"}}
                  />
                   <Typography
                     content={" " + convertDate(data.datetime)}
                      modifiers={['14x20', '500', 'justify', 'main']}
                    
                />
                </div>
                <div style={{ display: "flex", alignItems:"center"}}>
                     <Typography
                     content={"Nội dung: " + " " }
                      modifiers={['14x20', '600', 'justify', 'main']}
                    styles={{marginRight:"5px"}}
                  />
                 <Typography
                     content={" " + data.content}
                      modifiers={['14x20', '500', 'justify', 'main']}
                    
                  />
                   </div>
              </div>
            })
            }
         
            </CModal>
         
         
        </div >
      </PublicLayout >

    
    
    </>
  );
};
export default SurveyStatistics;
