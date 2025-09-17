/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from 'antd';
import { optionReportGrowth, optionTypeCompare } from 'assets/data';
import Button from 'components/atoms/Button';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import Typography from 'components/atoms/Typography';
import MemoizedTableReportGrowthProps from 'components/molecules/TableReportGrowth';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { exportFileReport, postCreateSummaryPerfReport } from 'services/api/statistics';
import { ReportDataItem } from 'services/api/statistics/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getGrowthReportByWeek, getSummaryReportByDate, getSummaryReportByDays } from 'store/statistics';
import { convertRangeDateToList, downloadBlobTXT } from 'utils/functions';
const { RangePicker } = DatePicker;


const ReportGrowthClinic: React.FC = () => {
  const navigatorRoute = useNavigate();
  const dispatch = useAppDispatch();

  const responseRePortSummary = useAppSelector((state) => state.statistic.reponseRePortSummary);
  const responseRePortSummaryLoading = useAppSelector((state) => state.statistic.reponseRePortSummaryLoading);

  const [dataReport, setDataReport] = useState(responseRePortSummary?.data);
  const getRoles = localStorage.getItem('roles');
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [isNewReport, setIsNewReport] = useState(false);
  const [isSummaryReport, setIsSummaryReport] = useState(false);
  const [loadingCreateReport, setLoadingCreateReport] = useState(false);
  const [timePicker, setTimePicker] = useState({
    date: undefined as unknown as any,
    fromDay: moment(new Date()).format("YYYY-MM-DDT00:00:00") as any,
    toDay: moment(new Date()).format("YYYY-MM-DDT23:59:59") as any,
    fromWeek: undefined as any,
    toWeek: undefined as any,
    year: undefined as unknown as Dayjs,
  });


  const [listHeaderByDate, setlistHeaderByDate] = useState<string[]>([])

  const [tableTypeReport, setTableTypeReport] = useState(optionReportGrowth[0])

  const [dataSummaryReport, setDataSummaryReport] = useState<ReportDataItem>();

  const [formData, setFormData] = useState({
    date: undefined as unknown as any,
    dc_google: '',
    dc_facebook: '',
    dc_tiktok: '',
    endo_google: '',
    endo_facebook: '',
    endo_tiktok: '',
  })
  const [typeCompare, setTypeCompare] = useState<GroupRadioType>(
    optionTypeCompare[0]
  );

  useEffect(() => {
    document.title = "Báo cáo tăng trưởng | CRM";
    if (listRoles?.some((role: any) => ['adAnalytics'].some((i => i === role?.role_name)))) {
      return;
    }
    navigatorRoute('/not-have-permission');
    return window.location.reload();
  }, []);

  useEffect(() => {
    setDataReport(responseRePortSummary?.data)
  }, [responseRePortSummary?.data]);


  const getWeeksArrayString = (from: Date, to: Date): string[] => {
    const weeks: string[] = [];
    let currentDate = new Date(from);

    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    };

    while (currentDate <= to) {
      const startOfWeek = new Date(currentDate);
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const weekString = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
      weeks.push(weekString);

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  const getWeeksArrayNumber = (from: Date, to: Date): number[] => {
    const weeks: number[] = [];
    let currentDate = new Date(from);

    const getWeekNumber = (date: Date): number => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const millisecondsInDay = 86400000; // Số mili giây trong một ngày
      const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / millisecondsInDay);
      return Math.ceil((dayOfYear + 1) / 7);
    };

    while (currentDate <= to) {
      const weekNumber = getWeekNumber(currentDate);
      weeks.push(weekNumber);

      // Di chuyển currentDate đến ngày đầu tuần tiếp theo
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  /* API */
  const { mutate: createReport } = useMutation(
    "post-footer-form",
    (data: any) => postCreateSummaryPerfReport(data),
    {
      onSuccess: (data) => {
        setLoadingCreateReport(false);
        toast.success('Tạo báo cáo thành công!')
        dispatch(getSummaryReportByDate(moment(formData.date?.$d).format('YYYY-MM-DD')));
        setIsNewReport(false);
        setFormData({
          ...formData,
          date: undefined as unknown as any,
          dc_google: '',
          dc_facebook: '',
          dc_tiktok: '',
          endo_google: '',
          endo_facebook: '',
          endo_tiktok: '',
        })
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  const { mutate: exportFile } = useMutation(
    "post-footer-form",
    (data: any) => exportFileReport(data),
    {
      onSuccess: (data) => {
        const text = data?.data?.data?.file
        downloadBlobTXT(text, data?.message);
      },
      onError: (error) => {
        console.log("🚀 ~ file: index.tsx:159 ~ error:", error);
      },
    }
  );
  /* END API */

  const handleCreateReport = async () => {
    setLoadingCreateReport(true);
    const body = {
      date_report: moment(formData.date?.$d).format('YYYY-MM-DD') || moment(new Date()).format('YYYY-MM-DD'),
      data: [
        {
          launch_source_group_id: 1,
          launch_source_id: 8,
          investment_amount: Number(formData.dc_google.replaceAll('.', '')),
        },
        {
          launch_source_group_id: 1,
          launch_source_id: 6,
          investment_amount: Number(formData.dc_facebook.replaceAll('.', '')),
        },
        {
          launch_source_group_id: 1,
          launch_source_id: 10,
          investment_amount: Number(formData.dc_tiktok.replaceAll('.', '')),
        },
        {
          launch_source_group_id: 2,
          launch_source_id: 8,
          investment_amount: Number(formData.endo_google.replaceAll('.', '')),
        },
        {
          launch_source_group_id: 2,
          launch_source_id: 6,
          investment_amount: Number(formData.endo_facebook.replaceAll('.', '')),
        },
        {
          launch_source_group_id: 2,
          launch_source_id: 10,
          investment_amount: Number(formData.endo_tiktok.replaceAll('.', '')),
        },
      ]
    }

    await createReport(body);
  }


  const handleGetReport = () => {
    if (typeCompare.value === "days") {
      console.log("🚀 ~ handleGetReport ~", moment(timePicker.fromDay).format('DD-MM-YYYY'), moment(timePicker.toDay).format('DD-MM-YYYY'))
      if (moment(timePicker.fromDay).format('DD-MM-YYYY') === moment(timePicker.toDay).format('DD-MM-YYYY')) {
        dispatch(getSummaryReportByDate(moment(timePicker.fromDay)?.format("YYYY-MM-DD")));
      } else {
        const body = {
          dates: listHeaderByDate?.join(','),
        };
        dispatch(getSummaryReportByDays(body));
      }
    }
    if (typeCompare.value === "week") {
      const body = {
        year: (timePicker.year as any)?.$y,
        weeks: getWeeksArrayNumber(timePicker.fromWeek, timePicker.toWeek),
      };
      dispatch(getGrowthReportByWeek(body));
    }
  }


  const tableBeforeExams = useMemo(
    () => {
      return (
        dataReport ?
          <MemoizedTableReportGrowthProps
            dataReport={dataReport}
            header={tableTypeReport}
            typeReport={typeCompare?.value as any}
            listHeader={
              typeCompare?.value === "days"
                ? listHeaderByDate
                : getWeeksArrayNumber(timePicker.fromWeek, timePicker.toWeek) as unknown as string[]
            }
            listHeaderWeek={getWeeksArrayString(timePicker.fromWeek, timePicker.toWeek) as unknown as string[]}
            onClickSummary={(item) => {
              setIsSummaryReport(true)
              setDataSummaryReport(item);
            }}
            onClickDetail={(item) => {
            }}
            onClickToDownload={(item) => {
              exportFile(item);
            }}
            onClickToCompare={() => { }}
            launchSourceGroup='1'
          /> : (
            <div className='p-report_growth_empty'>
              <div className='p-report_growth_empty_box'>
                {typeCompare?.value === "days" ? "Vui lòng chọn ngày cần xem" : "Vui lòng chọn ít nhất 2 tuần để xem"}
              </div>
            </div>
          )
      )
    },
    [dataReport, tableTypeReport, typeCompare?.value, exportFile, responseRePortSummaryLoading]
  );


  return (
    <div className='p-report_growth'>
      <PublicHeader
        titlePage={''}
        handleGetTypeSearch={() => { }}
        handleFilter={() => { }}
        handleCleanFilter={() => { }}
        isDial={false}
        isHideService
        isHideEmergency
        isClearFilter={false}
        isHideFilter
        isHideCleanFilter
        className='p-report_growth_header'
        tabLeft={(
          <div className='p-report_growth_header_left'>
            {
              typeCompare.value === 'days' ?
                <RangeDate
                  variant="simple"
                  handleOnChange={(from: any, to: any) => {
                    setTimePicker({
                      ...timePicker,
                      toDay: new Date(to),
                      fromDay: new Date(from),
                    });
                    const list = convertRangeDateToList(from, to);
                    setlistHeaderByDate(list);
                  }}
                  value={{
                    from: timePicker?.fromDay,
                    to: timePicker?.toDay,
                  }}
                />
                : <div className='p-report_growth_header_left_week'>

                  <DatePicker
                    picker="year"
                    format="YYYY"
                    placeholder="Vui lòng chọn năm"
                    onChange={(date: Dayjs, dateString: string | string[]) => {
                      setTimePicker({
                        ...timePicker,
                        year: date,
                      });
                    }}
                    value={timePicker.year}
                  />
                  <RangeDate
                    picker="week"
                    variant="simple"
                    placeholder={['Từ tuần', 'Đến tuần']}
                    handleOnChange={(from: any, to: any) => {
                      setTimePicker({
                        ...timePicker,
                        fromWeek: from,
                        toWeek: to,
                      });
                    }}
                  />
                </div>
            }
            <Button onClick={handleGetReport}>
              <Typography content='Tìm kiếm' />
            </Button>
          </div>
        )}
        listBtn={(
          <>
            <div className='p-report_growth_header_right_tabs'>
              <GroupRadio
                options={optionReportGrowth}
                value={tableTypeReport}
                handleOnchangeRadio={(item) => {
                  setTableTypeReport(item);
                }}
              />
            </div>
            <Button className='p-report_growth_header_btn_home' modifiers={['foreign']} onClick={() => {
              window.open(`/conversion`, '_blank');
            }}><Icon iconName={"home"} size='18x18' /></Button>
            <GroupRadio
              options={optionTypeCompare}
              defaultVal={optionTypeCompare.find(
                (i) => i.value === typeCompare.value
              )}
              value={optionTypeCompare.find(
                (i) => i.value === typeCompare.value
              )}
              handleOnchangeRadio={(e) => {
                setTypeCompare(e);
                setDataReport(undefined as any)
                setTimePicker({
                  date: undefined as unknown as any,
                  fromWeek: undefined as any,
                  toWeek: undefined as any,
                  year: undefined as unknown as Dayjs,
                  fromDay: moment(new Date()).subtract(3, 'days').format("YYYY-MM-DDT00:00:00") as any,
                  toDay: moment(new Date()).format("YYYY-MM-DDT23:59:59") as any,
                })
              }}
            />
            <Button
              modifiers={["primary"]}
              onClick={() => {
                setIsNewReport(true)
              }}
            >
              <Typography
                content="Tạo báo cáo"
                modifiers={["400"]}
              />
            </Button>
          </>
        )}
      />
      <div className='p-report_growth_body'>
        {tableBeforeExams}
      </div>
      <CDrawer
        isOpen={isNewReport}
        widths={350}
        positon='left'
        titleHeader="Tạo mới phiếu báo cáo"
        handleOnClose={() => {
          setIsNewReport(false);
          setFormData({
            ...formData,
            date: undefined as unknown as any,
            dc_google: '',
            dc_facebook: '',
            dc_tiktok: '',
            endo_google: '',
            endo_facebook: '',
            endo_tiktok: '',
          })
        }}
        isHaveHeader
      >
        <div className='p-report_growth_new_report'>
          <div className='p-report_growth_new_report_date'>
            <Typography content='Chọn ngày cần báo cáo:' modifiers={['400']} />
            <DatePicker
              picker={'date'}
              autoFocus
              format={"DD-MM-YYYY"}
              placeholder="Nhập ngày cần báo cáo"
              onChange={(date: Dayjs, dateString: string | string[]) => {
                setFormData({ ...formData, date: date });
              }}
              value={formData.date}
            />
          </div>
          <div className='p-report_growth_new_report_investment_money'>
            <Typography type='h3' content='1. Tiền đầu tư' modifiers={['capitalize', '600', 'orange']} />
            <div className='p-report_growth_new_report_investment_money_group'>
              <Typography type='h4' content='Brand Doctor Check:' modifiers={['capitalize', '600', 'green']} />
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.dc_google} label='Google:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, dc_google: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.dc_facebook} label='Facebook:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, dc_facebook: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.dc_tiktok} label='Tiktok:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, dc_tiktok: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
            </div>
            <div className='p-report_growth_new_report_investment_money_group'>
              <Typography type='h4' content='Brand Endo Clinic:' modifiers={['capitalize', '600', 'green']} />
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.endo_google} label='Google:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, endo_google: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.endo_facebook} label='Facebook:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, endo_facebook: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
              <div className='p-report_growth_new_report_investment_money_item'>
                <Input value={formData.endo_tiktok} label='Tiktok:' variant='simple' suffix={'VNĐ'} type='text' onChange={(event) => setFormData({ ...formData, endo_tiktok: parseInt(event.target?.value.replace(/\D/g, '') || 0).toLocaleString('vi-VN') })} />
              </div>
            </div>
          </div>
          <div className='p-report_growth_new_report_button'>
            <Button onClick={handleCreateReport} isLoading={loadingCreateReport} >
              <Typography content='Lưu dữ liệu' modifiers={['capitalize', '600', 'white']} />
            </Button>
          </div>
        </div>
      </CDrawer>
      <CModal
        isOpen={isSummaryReport}
        onCancel={() => {
          setIsSummaryReport(false);
        }}
        onOk={() => {
          setIsSummaryReport(false);
        }}
        widths={600}
        title="Tổng kết"
        isHideCancel
        textOK='Thoát'
      >
        <div className='p-report_growth_summary'>
          <ul className='p-report_growth_summary_group'>
            <li className='p-report_growth_summary_group_title'>Tổng</li>
            <ul>
              <li><Typography content='Đầu tư' /> <p>{dataSummaryReport?.investment_amount?.toLocaleString("vi-VN")}</p></li>
              <li><Typography content='Khách hàng' /><p>{dataSummaryReport?.customer_number}</p></li>
              <li><Typography content='Doanh thu' /> <p>{dataSummaryReport?.total_revenue?.toLocaleString("vi-VN")}</p></li>
              <li><Typography content='Lãi gộp' /> <p>{dataSummaryReport?.gross_profit?.toLocaleString("vi-VN")}</p></li>
            </ul>
          </ul>
          <ul className='p-report_growth_summary_group'>
            <li className='p-report_growth_summary_group_title'>{Number((dataSummaryReport?.gross_profit || 0) - ((dataSummaryReport?.debt_balance || 0) + (dataSummaryReport?.fixed_assets || 0) + (dataSummaryReport?.daily_expenses || 0))) > 0 ? 'Lãi' : 'Lỗ'}</li>
            <ul>
              <li><Typography content='Công nợ' /><p>{dataSummaryReport?.gross_profit?.toLocaleString("vi-VN")}</p></li>
              <li><Typography content='Cố định' /> <p>{dataSummaryReport?.fixed_assets?.toLocaleString("vi-VN")}</p></li>
              <li><Typography content='Chi phí hàng ngày' /> <p>{dataSummaryReport?.daily_expenses?.toLocaleString("vi-VN")}</p></li>
              <li><Typography content='Tổng' /> <p>{`${Number((dataSummaryReport?.gross_profit || 0) - ((dataSummaryReport?.debt_balance || 0) + (dataSummaryReport?.fixed_assets || 0) + (dataSummaryReport?.daily_expenses || 0))) > 0 ? 'Lãi' : 'Lỗ'} ${Number((dataSummaryReport?.gross_profit || 0) - ((dataSummaryReport?.debt_balance || 0) + (dataSummaryReport?.fixed_assets || 0) + (dataSummaryReport?.daily_expenses || 0)))?.toLocaleString("vi-VN")?.replace('-', '')}`}</p></li>
              {/* <li><Typography content='Tổng' /> <p>{numberToWords(Math.abs(Number((dataSummaryReport?.gross_profit || 0) - ((dataSummaryReport?.debt_balance || 0) + (dataSummaryReport?.fixed_assets || 0) + (dataSummaryReport?.daily_expenses || 0)))))}</p></li> */}
            </ul>
          </ul>
        </div>
      </CModal>
    </div>
  );
}

export default ReportGrowthClinic;
