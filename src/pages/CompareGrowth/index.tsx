/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from "antd";
import { optionTypeCompare } from "assets/data";
import Button from "components/atoms/Button";
import Checkbox from "components/atoms/Checkbox";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon from "components/atoms/Icon";
import Typography from "components/atoms/Typography";
import MemoizedChartReportCompare from "components/molecules/ChartReportCompare";
import PublicTable from "components/molecules/PublicTable";
import MemoizedTableReport from "components/molecules/TableReport";
import TableReport from "components/molecules/TableReport";
import CDrawer from "components/organisms/CDrawer";
import CModal from "components/organisms/CModal";
import RenderChart from "components/organisms/RenderChart";
import PublicHeader from "components/templates/PublicHeader";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getSummaryReportByDaysCompare,
  getSummaryReportByWeeksCompare,
} from "store/statistics";

const propertiesCharts = [
  { id: 1, value: "investment_amount", label: "Tiền đầu tư" },
  { id: 2, value: "customer_number", label: "Khách hàng" },
  { id: 3, value: "revenue", label: "Doanh thu" },
  { id: 4, value: "cost_price", label: "Giá vốn" },
  { id: 5, value: "gross_profit", label: "Lãi gộp" },
]

const CompareGrowth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigatorRoute = useNavigate();

  const responseRePortSummary = useAppSelector(
    (state) => state.statistic.responseCompare
  );
  const loadingCompare = useAppSelector(
    (state) => state.statistic.loadingCompare
  );
  const getRoles = localStorage.getItem("roles");
  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : "");

  const [dataCompare, setDataCompare] = useState(responseRePortSummary?.data);
  const [loading, setLoading] = useState(loadingCompare);
  const [typeCompare, setTypeCompare] = useState<GroupRadioType>(
    optionTypeCompare[0]
  );
  const [timePicker, setTimePicker] = useState({
    date: undefined as unknown as any,
    week: undefined as unknown as Dayjs[],
    year: undefined as unknown as Dayjs,
  });
  const [propertiesCreateChart, setPropertiesCreateChart] = useState<GroupRadioType>({ id: 1, value: "investment_amount", label: "Tiền đầu tư" });

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isCreateChart, setIsCreateChart] = useState({
    brand: "dc",
    value: false,
  });


  useEffect(() => {
    setDataCompare(responseRePortSummary?.data);
  }, [responseRePortSummary?.data, responseRePortSummary?.data.data]);

  useEffect(() => {
    setLoading(loadingCompare);
    if (loadingCompare) {
      setIsOpenFilter(false);
    }
  }, [loadingCompare]);

  const handleRequestCompare = () => {
    if (typeCompare.value === "days") {
      const body = {
        dates: timePicker.date
          ?.map((i: any) => moment(i?.$d)?.format("YYYY-MM-DD"))
          ?.join(", "),
      };
      dispatch(getSummaryReportByDaysCompare(body));
    }
    if (typeCompare.value === "week") {
      const body = {
        year: (timePicker.year as any)?.$y,
        weeks: timePicker.week?.map((i: any) => moment(i?.$d)?.isoWeeks()),
      };
      dispatch(getSummaryReportByWeeksCompare(body));
    }
  };

  useLayoutEffect(() => {
    document.title = "So sánh tăng trưởng | CRM";
    if (listRoles?.some((role: any) => ["adAnalytics"].some((i) => i === role?.role_name))) {
      return;
    }
    navigatorRoute('/not-have-permission');
    return window.location.reload();
  }, []);

  return (
    <div className="p-compare_growth">
      <PublicHeader
        titlePage={"So Sánh Tăng Trưởng"}
        handleGetTypeSearch={() => { }}
        handleFilter={() => { }}
        handleCleanFilter={() => { }}
        isDial={false}
        isHideService
        isHideEmergency
        isClearFilter={false}
        isHideFilter
        isHideCleanFilter
        className="p-compare_growth_header"
        listBtn={
          <>
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
              }}
            />
            <Button onClick={() => setIsOpenFilter(true)}>
              <Typography content="Chọn thời gian so sánh" modifiers={["400"]} />
            </Button>
          </>
        }
        tabLeft={<Button modifiers={['foreign']} onClick={() => navigatorRoute('/conversion')}><Icon size="20x20" iconName={"home"} /></Button>}
      />
      <div className="p-compare_growth_body">
        <div className="p-compare_growth_body_dc">
          <MemoizedTableReport
            tableName="1. Doctor Check:"
            listHeader={
              typeCompare?.value === "days"
                ? timePicker.date?.map((i: any) =>
                  moment(i?.$d)?.format("YYYY-MM-DD")
                )
                : timePicker.week?.map((i: any) =>
                  moment(i?.$d)?.isoWeeks().toString()
                )
            }
            dataReport={dataCompare}
            brand="dc"
            typeReport={typeCompare?.value as any}
            onClickChart={() =>
              setIsCreateChart({
                ...isCreateChart,
                value: true,
                brand: "dc",
              })
            }
          />
        </div>
        <div className="p-compare_growth_body_endo">
          <MemoizedTableReport
            onClickChart={() =>
              setIsCreateChart({
                ...isCreateChart,
                value: true,
                brand: "endo_clinic",
              })
            }
            tableName="2. Endo Clinic:"
            listHeader={typeCompare?.value === 'days' ? timePicker.date?.map((i: any) => moment(i?.$d)?.format('YYYY-MM-DD')) : timePicker.week?.map((i: any) => moment(i?.$d)?.isoWeeks().toString())}
            dataReport={dataCompare}
            brand="endo"
            typeReport={typeCompare?.value as any}
          />
        </div>
      </div>
      <CModal
        isOpen={isOpenFilter}
        widths={500}
        textOK="Tiến hành so sánh"
        textCancel="Hủy"
        onCancel={() => {
          setIsOpenFilter(false);
        }}
        onOk={() => {
          if (typeCompare.value === "days" && timePicker.date?.length > 13) {
            toast.warning("So sánh tối đa là 12 ngày!");
          } else if (
            typeCompare.value === "week" &&
            timePicker.week?.length > 13
          ) {
            toast.warning("So sánh tối đa là 12 tuần!");
          } else {
            handleRequestCompare();
          }
        }}
        title="CHỌN THỜI GIAN SO SÁNH"
      >
        <div className="p-compare_growth_form">
          <div className="p-compare_growth_form_item">
            {typeCompare.value === "week" ? (
              <div className="a-week_picker">
                <div className="a-week_picker_label">
                  <Typography
                    type="p"
                    content={"Chọn năm :"}
                    modifiers={["14x21", "capitalize"]}
                  />
                </div>
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
                <div className="a-week_picker_label">
                  <Typography
                    type="p"
                    content={"Chọn tuần:"}
                    modifiers={["14x21", "capitalize"]}
                  />
                </div>
                <DatePicker
                  picker="week"
                  format="Tuần w-YYYY"
                  multiple
                  showWeek
                  placeholder="Vui lòng chọn tuần bạn muốn so sánh"
                  onChange={(date: Dayjs[], dateString: string | string[]) => {
                    setTimePicker({
                      ...timePicker,
                      week: date,
                    });
                  }}
                  value={timePicker.week}
                />
                {timePicker.week && (
                  <>
                    <p style={{ marginTop: 12 }}>Các tuần đã chọn:</p>
                    <ul>
                      {timePicker.week?.map((i: any) => (
                        <li>{moment(i?.$d)?.format("Tuần w-YYYY")}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="a-week_picker_label">
                  <Typography
                    type="p"
                    content={"Chọn (Tối thiểu 2 ngày, Tối đa 12 ngày):"}
                    modifiers={["14x21", "capitalize"]}
                  />
                </div>
                <DatePicker
                  picker={"date"}
                  multiple
                  format={"DD-MM-YYYY"}
                  placeholder="Chọn ngày cần xem"
                  onChange={(date: Dayjs[], dateString: string | string[]) => {
                    setTimePicker({
                      ...timePicker,
                      date: date,
                    });
                  }}
                  value={timePicker.date}
                />
                {timePicker.date && (
                  <>
                    <p style={{ marginTop: 12 }}>Các ngày đã chọn:</p>
                    <ul>
                      {timePicker.date?.map((i: any) => (
                        <li>{moment(i?.$d)?.format("YYYY-MM-DD")}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CModal>
      <CModal
        isOpen={isCreateChart.value}
        widths={'100vw'}
        isHideOk
        onCancel={() =>
          setIsCreateChart({
            ...isCreateChart,
            value: false,
          })
        }
        textCancel='Thoát'
      >
        <div className='p-compare_growth_chart'>
          <MemoizedChartReportCompare
            listHeader={propertiesCreateChart?.label}
            keyActive={propertiesCreateChart?.value}
            dataCompare={dataCompare}
            brand={isCreateChart.brand}
            type={typeCompare.value as string}
          >
            <div className="p-compare_growth_create_chart">
              <GroupRadio options={propertiesCharts} value={propertiesCreateChart} defaultVal={propertiesCreateChart} handleOnchangeRadio={(item: GroupRadioType) => { setPropertiesCreateChart(item) }} />
            </div>
          </MemoizedChartReportCompare>
        </div>
      </CModal>
    </div>
  );
};

export default CompareGrowth;
