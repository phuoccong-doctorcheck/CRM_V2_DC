/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from "antd";
import { optionLaunchSourceChannel, optionTypeReportChannel } from "assets/data";
import Button from 'components/atoms/Button';
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Input from "components/atoms/Input";
import RangeDate from "components/atoms/RangeDate";
import Typography from 'components/atoms/Typography';
import CModal from 'components/organisms/CModal';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import { Dayjs } from "dayjs";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { getReportFacebookByDate, updateReport } from "services/api/statistics";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getReportGrowthByDate, getReportGrowthByDates, getReportGrowthByWeeks } from "store/statistics";
import mapModifiers, { convertRangeDateToList } from "utils/functions";

const ReportChannel= () => {
  const dispatch = useAppDispatch();

  const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");
  const getRoles = localStorage.getItem('roles');
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const responseReportGrowth = useAppSelector((state) => state.statistic.responseReportGrowth);

  const [stateLaunchSourceGroups, setstateLaunchSourceGroups] = useState<DropdownData[]>(storageLaunchSourcesGroup ? JSON.parse(storageLaunchSourcesGroup) : []);

  const [isOpenReportFacebook, setIsOpenReportFacebook] = useState(false);
  const [typeCompare, setTypeCompare] = useState<GroupRadioType>(optionTypeReportChannel[0])
  const [stateReport, setStateReport] = useState(responseReportGrowth.data)

  const [formReport, setFormReport] = useState({
    date: undefined as unknown as any,
    group: undefined as unknown as DropdownData,
    launchSource: undefined as unknown as DropdownData,
    appointment: '0',
    new_customer: '0',
    hasPhone: '0',
    total: '0',
    hot: '0',
    warm: '0',
    cool: '0',
  });

  const [dataFilter, setDataFilter] = useState({
    group: undefined as unknown as DropdownData,
    origin: undefined as unknown as DropdownData,
    date: undefined as unknown as any,
    week: undefined as unknown as Dayjs[],
    year: undefined as unknown as Dayjs,
    from: undefined as unknown as any,
    to: undefined as unknown as any,
  })

  const [formReportErr, setFormReportErr] = useState({
    date: '',
    group: '',
    launchSource: '',
  })

  useEffect(() => {
    setStateReport(responseReportGrowth.data)
  }, [responseReportGrowth.data])

  // // useLayoutEffect(() => {
  // //   const body = {
  // //     date: moment(new Date()).format('YYYY-MM-DD'),
  // //     launch_source_group_id: 1,
  // //     launch_source_id: 6
  // //   }
  // //   // dispatch(getReportGrowthByDate(body));
  // // }, [])
  useLayoutEffect(() => {
       document.title = 'Báo cáo kênh | CRM'
  }, []);

  const { mutate: getDataFacebook } = useMutation(
    'post-footer-form',
    (body: any) => getReportFacebookByDate(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          const getDataAllowBrand = data?.data?.find((i: any) => i.launch_source_group_id === formReport.group.id)
          if (getDataAllowBrand) {
            const getDataAllowLaunchSource = getDataAllowBrand?.items?.find((i: any) => i.launch_source_id === formReport.launchSource.id)
            setFormReport({
              ...formReport,
              appointment: `${getDataAllowLaunchSource.appointment_number}`,
              new_customer: `${getDataAllowLaunchSource.new_customer_number}`,
              hasPhone: `${getDataAllowLaunchSource.has_phone_number}`,
              total: `${getDataAllowLaunchSource.inbox_total}`,
              hot: `${getDataAllowLaunchSource.inbox_hot}`,
              warm: `${getDataAllowLaunchSource.inbox_warm}`,
              cool: `${getDataAllowLaunchSource.inbox_cool}`,
            })
          }
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  const { mutate: updateGrowthReport } = useMutation(
    'post-footer-form',
    (body: any) => updateReport(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          const body = {
            date: moment(formReport.date?.$d).format('YYYY-MM-DD'),
            launch_source_group_id: 1,
            launch_source_id: 6
          }
          dispatch(getReportGrowthByDate(body));
          toast.success('Lưu báo cáo thành công!')
          setIsOpenReportFacebook(false);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const handleValidategetDataFacebook = () => {
    if (!formReport.date || !formReport.launchSource || !formReport.group) {
      setFormReportErr({
        date: !formReport.date ? 'Vui lòng chọn ngày cần báo cáo' : '',
        group: !formReport.group ? 'Vui lòng chọn công ty cần báo cáo' : '',
        launchSource: !formReport.launchSource ? 'Vui lòng chọn nguồn cần báo cáo' : '',
      })
      return false;
    }
    return true;
  }

  const handleGetDataFacebook = () => {
    if (!handleValidategetDataFacebook()) return;
    const param = {
      date: moment(formReport.date?.$d).format('YYYY-MM-DD'),
      launch_source_group_id: formReport.group?.id,
      launch_source_id: formReport.launchSource?.id,
    }
    getDataFacebook(param);
  }

  const handleUpdateGrowthReport = () => {
    const body = {
      launch_source_group_id: formReport.group.id,
      launch_source_group_name: formReport.group.label,
      date: moment(formReport.date?.$d).format('YYYY-MM-DD'),
      launch_source_id: formReport.launchSource.id,
      launch_source_name: formReport.launchSource.label,
      appointment_number: Number(formReport.appointment),
      new_customer_number: Number(formReport.new_customer),
      has_phone_number: Number(formReport.hasPhone),
      inbox_total: Number(formReport.total),
      inbox_hot: Number(formReport.hot),
      inbox_warm: Number(formReport.warm),
      inbox_cool: Number(formReport.cool),
    }
    updateGrowthReport(body)
  }

  const handleGetReportByOneDate = () => {

    if (typeCompare.value === 'days') {
      if (dataFilter.date?.length > 1) {
        const body = {
          dates: dataFilter.date?.map((i: any) => moment(i?.$d)?.format('YYYY-MM-DD'))?.join(', '),
          launch_source_group_id: 1,
          launch_source_id: 6
        }
        dispatch(getReportGrowthByDates(body));

      } else if (dataFilter.date?.length === 1) {
        const body = {
          date: dataFilter.date?.map((i: any) => moment(i?.$d)?.format('YYYY-MM-DD'))?.join(', '),
          launch_source_group_id: 1,
          launch_source_id: 6
        }
        dispatch(getReportGrowthByDate(body));
      }

    }
    if (typeCompare.value === 'week') {
      const body = {
        year: (dataFilter.year as any)?.$y,
        weeks: dataFilter.week?.map((i: any) => moment(i?.$d)?.isoWeeks()),
        launch_source_group_id: 1,
        launch_source_id: 6,
      }
      dispatch(getReportGrowthByWeeks(body));
    }
    if (typeCompare.value === 'range') {
      const body = {
        dates: convertRangeDateToList(dataFilter.from as Date, dataFilter.to as Date)?.join(','),
        launch_source_group_id: 1,
        launch_source_id: 6,
      }
      dispatch(getReportGrowthByDates(body));
    }

  }

  const checkIsAdmin = () => listRoles?.some((role: any) => ['adAnalytics'].some((i => i === role?.role_name)));

  return (
    <PublicLayout>
      <div className="p-report_channel">
        <PublicHeader
          titlePage='Báo Cáo Kênh'
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          isHideCleanFilter
          isHideEmergency
          isHideLibraly
          isHideService
          isDial={false}
          isHideFilter
          className="p-report_channel_header"
          listBtn={<>
            <GroupRadio
              options={optionTypeReportChannel}
              defaultVal={optionTypeReportChannel.find(
                (i) => i.value === typeCompare.value
              )}
              value={optionTypeReportChannel.find(
                (i) => i.value === typeCompare.value
              )}
              handleOnchangeRadio={(e) => {
                setTypeCompare(e);
                setStateReport(undefined as any);
                setDataFilter({
                  group: undefined as unknown as DropdownData,
                  origin: undefined as unknown as DropdownData,
                  date: undefined as unknown as any,
                  week: undefined as unknown as Dayjs[],
                  year: undefined as unknown as Dayjs,
                  from: undefined as unknown as any,
                  to: undefined as unknown as any,
                })
              }}
            />
            <Button onClick={() => setIsOpenReportFacebook(true)}>
              <Typography content='Tạo báo cáo' modifiers={['400']} />
            </Button>
          </>
          }
          tabLeft={
            <>
              {typeCompare.value === 'week' &&
                <DatePicker
                  picker="year"
                  format="YYYY"
                  placeholder="Vui lòng chọn năm"
                  onChange={(date: Dayjs, dateString: string | string[]) => {
                    setDataFilter({
                      ...dataFilter,
                      year: date
                    })
                  }}
                  value={dataFilter.year}
                />}
              {typeCompare.value !== 'range' &&
                <DatePicker
                  picker={typeCompare.value === 'days' ? 'date' : 'week'}
                  format={typeCompare.value === 'days' ? "DD-MM-YYYY" : 'Tuần w-YYYY'}
                  className="p-report_channel_header_date"
                  placeholder="Chọn ngày cần xem"
                  multiple
                  onChange={(date: Dayjs | Dayjs[], dateString: string | string[]) => {
                    setDataFilter({
                      ...dataFilter,
                      [typeCompare.value === 'days' ? 'date' : 'week']: date
                    })
                  }}
                  value={dataFilter.date}
                />
              }
              {typeCompare.value === 'range' &&
                <RangeDate
                  variant="simple"
                  handleOnChange={(from: any, to: any) => {
                    setDataFilter({
                      ...dataFilter,
                      from: from, to: to
                    })
                  }}
                  value={{
                    from: dataFilter.from,
                    to: dataFilter.to,
                  }}
                />
                // <DatePicker
                //   picker={typeCompare.value === 'days' ? 'date' : 'week'}
                //   format={typeCompare.value === 'days' ? "DD-MM-YYYY" : 'Tuần w-YYYY'}
                //   className="p-report_channel_header_date"
                //   placeholder="Chọn ngày cần xem"
                //   multiple
                //   onChange={(date: Dayjs | Dayjs[], dateString: string | string[]) => {
                //     setDataFilter({
                //       ...dataFilter,
                //       [typeCompare.value === 'days' ? 'date' : 'week']: date
                //     })
                //   }}
                //   value={dataFilter.date}
                // />
              }
              <Button modifiers={['foreign']} onClick={handleGetReportByOneDate}>
                <Typography content="Lọc" modifiers={['400']} />
              </Button>
            </>
          }
        />
        <div className="p-report_channel_body">
          <div className="p-report_channel_body_list">
            {stateReport?.data?.map((group, index) => {
              if (group.details?.length) {
                return (
                  <div className="p-report_channel_body_result">
                    <h3>{index === 0 && 'I' || index === 1 && 'II' || index === 2 && 'III' || index === 3 && 'IV' || index === 4 && 'V' || index === 5 && 'VI' || index === 6 && 'VII' || ''}. Brand {group.launch_source_group_name}</h3>
                    <>
                      {group?.details?.length && group?.details?.map((item, ydex) => {
                        return (
                          <ul className="p-report_channel_body_result_wrap">
                            <h4>{ydex + 1}. Nhận xét hiệu quả {typeCompare.value === 'days' && (dataFilter.date?.length > 1 ? `các ngày: ${dataFilter.date?.map((i: any) => moment(i?.$d)?.format('YYYY-MM-DD'))?.join(', ')}` : `ngày ${moment(item.report_date).format('DD-MM-YYYY')}`)
                              || typeCompare.value === 'week' && `các tuần: ${dataFilter.week?.map((i: any) => moment(i?.$d)?.isoWeeks()).join(',')} của`
                              || typeCompare.value === 'range' && `từ ngày ${moment(dataFilter.from).format('DD/MM')} - ${moment(dataFilter.to).format('DD/MM')}`} kênh {item.launch_source_name}:</h4>
                            {checkIsAdmin() &&
                              <li className="p-report_channel_body_result_item">
                                <Typography content="- Tiền đầu tư: " modifiers={['400', 'main']} />
                                <p>{Number(item.investment_amount).toLocaleString('vi-VN')} VNĐ</p>
                              </li>
                            }
                            {item?.growths?.map((y) => (
                              <li className="p-report_channel_body_result_item">
                                <Typography content={`- ${y.name}: `} modifiers={['400', 'main']} />
                                <p>{y.customer_number} KH</p>
                              </li>
                            ))}
                            {item?.services?.map((i) => (
                              <li className="p-report_channel_body_result_item">
                                <Typography content={`- ${i.name}: `} modifiers={['400', 'main']} />
                                <p>{i.customer_number} KH</p>
                              </li>
                            ))}
                          </ul>
                        )
                      })}
                    </>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
      <CModal
        isOpen={isOpenReportFacebook}
        onCancel={() => setIsOpenReportFacebook(false)}
        title="Báo cáo tăng trưởng kênh"
        textCancel="Hủy"
        textOK="Gửi báo cáo"
        widths={500}
        onOk={handleUpdateGrowthReport}
      >
        <div className={mapModifiers('t-header_form_report')}>
          <div className="a-week_picker_label">
            <Typography type='p' content={'Chọn ngày báo cáo:'} modifiers={['14x21', 'capitalize']} />
          </div>
          <DatePicker
            picker={'date'}
            format={"DD-MM-YYYY"}
            placeholder=""
            onChange={(date: Dayjs, dateString: string | string[]) => {
              setFormReport({
                ...formReport,
                date: date,
              })
              setFormReportErr({
                ...formReportErr,
                date: ''
              })
            }}
            value={formReport.date}
          />
          <div style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
          }}>
            <Dropdown
              values={formReport.group}
              dropdownOption={stateLaunchSourceGroups}
              label="Chọn Brand"
              variant="simple"
              isRequired
              handleSelect={(item: DropdownData) => {
                setFormReport({
                  ...formReport,
                  group: item
                })
                setFormReportErr({
                  ...formReportErr,
                  group: ''
                })
              }}
              error={formReportErr.group}
            />
            <Dropdown
              values={formReport.launchSource}
              dropdownOption={optionLaunchSourceChannel}
              label="Chọn nguồn"
              variant="simple"
              isRequired
              handleSelect={(item: DropdownData) => {
                setFormReport({
                  ...formReport,
                  launchSource: item
                })
                setFormReportErr({
                  ...formReportErr,
                  launchSource: ''
                })
              }}
              error={formReportErr.launchSource}
            />
            <Input onChange={(event) => setFormReport({ ...formReport, appointment: event.target.value })} value={formReport.appointment} type="number" variant="simple" label="Đặt hẹn lý thuyết" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, hasPhone: event.target.value })} value={formReport.hasPhone} type="number" variant="simple" label="Khách để lại SĐT" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, new_customer: event.target.value })} value={formReport.new_customer} type="number" variant="simple" label="Khách hàng mới" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, total: event.target.value })} value={formReport.total} type="number" variant="simple" label="Tổng Inbox" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, hot: event.target.value })} value={formReport.hot} type="number" variant="simple" label="Inbox Nóng" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, warm: event.target.value })} value={formReport.warm} type="number" variant="simple" label="Inbox Ấm" suffix="người" />
            <Input onChange={(event) => setFormReport({ ...formReport, cool: event.target.value })} value={formReport.cool} type="number" variant="simple" label="Inbox Lạnh" suffix="người" />
            <Button modifiers={['orange']} onClick={handleGetDataFacebook}>
              <Typography content="Lấy dữ liệu từ Pancake" />
            </Button>
          </div>
        </div>
      </CModal>
    </PublicLayout >
  );
}

export default ReportChannel;
