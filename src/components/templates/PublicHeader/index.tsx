/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */

import CTooltip from "components/atoms/CTooltip";
import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import RichTextEditor from "components/molecules/RichTextEditor";
import CDrawer from "components/organisms/CDrawer";
import useClickOutside from "hooks/useClickOutside";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { getDetailDocumentItem } from "services/api/afterexams";
import { getInsuranceHospitals } from "services/api/customerInfo";
import { InsuranceHospitalsData } from "services/api/dashboard/types";
import { useAppSelector } from "store/hooks";
import mapModifiers from "utils/functions";

import PriceList from "../PriceList";
import { useSip } from "../SipProvider";

interface PublicHeaderProps {
  titlePage: string;
  handleGetTypeSearch: (type: DropdownData) => void;
  placeholderSearch?: string;
  className?: string;
  handleOnClickSearch?: (data: string) => void;
  handleFilter: () => void;
  handleCleanFilter: () => void;
  handleShowPriceList?: () => void;
  listBtn?: React.ReactNode;
  tabLeft?: React.ReactNode;
  tabBottom?: React.ReactNode;
  tabBottomRight?: React.ReactNode;
  valueSearch?: string;
  isHideFilter?: boolean;
  isHideCleanFilter?: boolean;
  isUseSearch?: boolean;
  isHideLibraly?: boolean;
  isHideSearch?: boolean;
  isHideService?: boolean;
  isHideEmergency?: boolean;
  isShowTotalCustomer?: boolean;
  isHideFilterMobile?: boolean;
  isDial?: boolean;
  totalCustomer?: number;
  dataTotal?: React.ReactNode;
  isClearFilter?: boolean;
  handleClickFilterMobile?: () => void;

}

const PublicHeader: React.FC<PublicHeaderProps> = ({
  titlePage,
  handleGetTypeSearch,
  placeholderSearch,
  handleOnClickSearch,
  handleFilter,
  listBtn,
  className,
  valueSearch,
  tabLeft,
  isHideFilter,
  isUseSearch,
  isHideLibraly,
  isHideSearch,
  tabBottom,
  isShowTotalCustomer,
  totalCustomer,
  dataTotal,
  isHideCleanFilter,
  handleCleanFilter,
  handleShowPriceList,
  handleClickFilterMobile,
  isHideService,
  isHideFilterMobile,
  isDial,
  isHideEmergency,
  isClearFilter,
  tabBottomRight
}) => {
  const dataDocumentAfterExams = useAppSelector(
    (state) => state.afterExams.userguidsAfterExams
  );
  const { handleSetStateConnect } = useSip();

  const storageDocument = localStorage.getItem("userguids");
  const [listDocument, setListDocument] = useState(
    storageDocument ? JSON.parse(storageDocument) : ""
  );
  const storageFilterSetting = Cookies.get(window.location.pathname.replaceAll('/', ''));

  const [stateFilterSetting, setstateFilterSetting] = useState<string[]>(storageFilterSetting ? JSON.parse(storageFilterSetting) : []);
  const [isOpenDocument, setIsOpenDocument] = useState(false);
  const [documentAfterExams, setDocumentAfterExams] = useState(
    dataDocumentAfterExams
  )
  const [contentDetailDoc, setContentDetailDoc] = useState("");
  const [isOpenDetailDoc, setIsOpenDetailDoc] = useState(false);
  const [isShowListTotal, setIsShowListTotal] = useState(false);
  const [priceList, setPriceList] = useState(false);
  const [isInsuranceHospitals, setIsInsuranceHospitals] = useState(false);
  const [insuranceHospitalsValue, setInsuranceHospitalsValue] = useState("");
  const [insuranceHospitals, setInsuranceHospitals] = useState({
    data: {} as InsuranceHospitalsData,
    clone: {} as InsuranceHospitalsData,
  });

  const [enableItemSeting, setEnableItemSeting] = useState<string[]>([]);
  const ElementTotal = useRef<HTMLDivElement>(null);

  useClickOutside(ElementTotal, () => {
    if (isShowListTotal) setIsShowListTotal(false);
  });

  const { mutate: getDetailItemDoc } = useMutation(
    "post-footer-form",
    (id: string) => getDetailDocumentItem(id),
    {
      onSuccess: (data) => {
        setContentDetailDoc(data.data.cs_guid_content);
        setIsOpenDetailDoc(true);
      },
      onError: (e) => {
        console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
      },
    }
  );

  const { mutate: getListInsuranceHospitals } = useMutation(
    "post-footer-form",
    (id: any) => getInsuranceHospitals(id),
    {
      onSuccess: (data) => {
        if (!data.status) return;
        setInsuranceHospitals({
          ...insuranceHospitals,
          data: data.data,
          clone: data.data
        });
      },
      onError: (e) => {
        console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
      },
    }
  );

  const handleGetListInsuranceHospital = () => {
    setIsInsuranceHospitals(true);
    const body = {
      keyword: "",
      page: 1,
      limit: 200
    };

    getListInsuranceHospitals(body);
  }

  const handleSearchListInsuranceHospital = () => {
    const newList = insuranceHospitals?.clone.data.filter((item) => item.hospital_name.toLowerCase().search(insuranceHospitalsValue.toLowerCase()) !== -1);
    setInsuranceHospitals({
      ...insuranceHospitals,
      data: {
        data: newList,
        paging: insuranceHospitals.clone.paging
      },
    });
  }

  const handleGetDetailDoc = async (data: any) => {
    await getDetailItemDoc(data.cs_guid_id);
  };

  useEffect(() => {
    switch (window.location.pathname.replaceAll('/', '')) {
      case 'medical-appointment':
        setEnableItemSeting(stateFilterSetting);
        break;
      case 'appointment-examination':
        setEnableItemSeting(stateFilterSetting);
        break;
      case 'medical-care':
        setEnableItemSeting(stateFilterSetting);
        break;
      case 'booking-schedule':
        setEnableItemSeting(stateFilterSetting);
        break;
    }
  }, [window.location.pathname])

  const columnForDocument = [
    {
      title: (
        <Typography content="Tiêu đề" modifiers={["12x18", "500", "center"]} />
      ),
      dataIndex: "cs_guid_title",
      render: (record: any, data: any) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography content={record} modifiers={["14x20", "400", "center"]} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {data?.tags?.length
              ? data?.tags?.map((tag: any, index: any) => (
                <span
                  style={{
                    backgroundColor: "#6495ed",
                    color: "#fff",
                    padding: "1px 2px",
                    borderRadius: 4,
                  }}
                  key={index}
                >
                  {tag}
                </span>
              ))
              : null}
          </div>
        </div>
      ),
    },
    {
      title: (
        <Typography
          content="Ngày cập nhật"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "update_datetime",
      align: "center",
      width: 135,
      render: (record: any) => (
        <Typography
          content={moment(record).format("HH:mm - DD/MM/YYYY")}
          modifiers={["14x20", "400", "center"]}
        />
      ),
    },
    {
      title: (
        <Typography
          content="Người cập nhật"
          modifiers={["12x18", "500", "center"]}
        />
      ),
      dataIndex: "update_employee_name",
      align: "center",
      width: 160,
      render: (record: any) => (
        <Typography content={record} modifiers={["14x20", "400", "center"]} />
      ),
    },
    {
      title: "",
      dataIndex: "",
      align: "center",
      width: 50,
      render: (data: any, record: any) => (
        <CTooltip placements="topLeft" title="Xem hướng dẫn">
          <p onClick={() => handleGetDetailDoc(data)} className="click_event">
            <Icon iconName="play2" isPointer />
          </p>
        </CTooltip>
      ),
    },
  ];

  return (
    <>
      <div className={mapModifiers(`${className} t-public_header`, enableItemSeting.length > 5 ? 'multi' : 'none')}>
        <div className="t-public_header_top">
          <div className="t-public_header_left">
            {isHideFilterMobile ?
              <div className={mapModifiers("t-public_header_left_filter_icon")} >
                <Icon iconName="setting-lines" size="20x20" isPointer onClick={handleClickFilterMobile} />
              </div> : null
            }
            {titlePage && (
              <Typography
                content={titlePage}
                type="p"
                modifiers={["18x32", "700", 'blueNavy']}
              />
            )}
            {tabLeft}
          </div>
          <div className="t-public_header_right">
            {listBtn}
            {isShowTotalCustomer && (
              <div className="t-public_header_right_total" ref={ElementTotal}>
                <CTooltip title="Thống kê Khách hàng" placements="top">
                  <div
                    className="t-public_header_right_library"
                    onClick={() => setIsShowListTotal(!isShowListTotal)}
                  >
                    <Icon iconName="statistics_white" size="20x20" />
                  </div>
                </CTooltip>
                {isShowListTotal && (
                  <div className="t-public_header_right_total_data">
                    {dataTotal}
                  </div>
                )}
              </div>
            )}
            {!isHideCleanFilter && (
              <CTooltip title="Reload" placements="bottomLeft" colorCustom="#333">
                <div
                  className={mapModifiers("t-public_header_right_filter",)} //isClearFilter
                  onClick={handleCleanFilter}
                >
                  <Icon iconName="clean_filter" size="20x20" />
                </div>
              </CTooltip>
            )}
            {!isHideService ?
            <CTooltip placements="top" title="Xem bảng giá">    <div className={mapModifiers("t-public_header_right_services")}>
                <Icon iconName="price-list" size="20x20" isPointer onClick={() => setPriceList(true)} />
              </div> </CTooltip>: null
            }
            {!isHideEmergency ?
            <CTooltip placements="top" title="DS bệnh viện được khám BHYT">    <div className={mapModifiers("t-public_header_right_services")}>
                <Icon iconName="emergency" size="20x20" isPointer onClick={handleGetListInsuranceHospital} />
              </div> </CTooltip>: null
            }
            {/* {!isHideLibraly && (
            <CTooltip title="Thư viện hỗ trợ" placements="bottomLeft">
              <div
                className="t-public_header_right_library"
                onClick={() => setIsOpenDocument(true)}
              >
                <Icon iconName="book" size="20x20" />
              </div>
            </CTooltip>
          )} */}
            {!isHideFilter && (
               <div
                className="t-public_header_right_filter"
                onClick={handleFilter}
              >
                <Icon iconName="filter" size="20x20" />
              </div>
            
            )}
            {
              isDial &&
              <CTooltip placements="top" title="Gọi điện"> <div
                className="t-public_header_right_dial"
                onClick={() => {
                  if (handleSetStateConnect) {
                    handleSetStateConnect('dial')
                  }
                }}
              >
                <Icon iconName="dial" size="20x20" />
              </div>  </CTooltip>
            }
          </div>
        </div>
        <div className="t-public_header_bottom">
          {tabBottom}
          {tabBottomRight}
        </div>
        <CDrawer
          isOpen={isInsuranceHospitals}
          titleHeader="Danh sách Bệnh viện/ Phòng khám được phép đăng ký khám BHYT"
          isHaveHeader
          widths={610}
          positon="right"
          handleOnClose={() => {
            setIsInsuranceHospitals(false);
            setInsuranceHospitalsValue('');
          }}
        >
          <div className="t-public_header_hospital">
            <div className="t-public_header_hospital_search">
              <Input iconName="search"
                handleClickIcon={handleSearchListInsuranceHospital}
                handleEnter={handleSearchListInsuranceHospital}
                value={insuranceHospitalsValue}
                onChange={(event) => {
                  const newList = insuranceHospitals?.clone.data.filter((item) => item.hospital_name.toLowerCase().search(event.target.value.toLowerCase()) !== -1);
                  setInsuranceHospitals({
                    ...insuranceHospitals,
                    data: {
                      data: newList,
                      paging: insuranceHospitals.clone.paging
                    },
                  });
                  setInsuranceHospitalsValue(event.target.value)
                }}
                placeholder="Vui lòng nhập tên Bệnh viện/ Phòng khám cần tìm..."
              />
            </div>
            <ul className="t-public_header_hospital_content">
              {insuranceHospitals.data?.data?.length ? insuranceHospitals.data?.data.map((item) => (
                <li key={item.hospital_id}>
                  <Typography content={item.hospital_name} />
                  <span>{item.hospital_address}</span>
                </li>
              )) : null}
            </ul>
          </div>
        </CDrawer>
      </div>
      <CDrawer
        isOpen={isOpenDocument}
        widths={800}
        levelDrawer="level1"
        positon="left"
        handleOnClose={() => setIsOpenDocument(false)}
        isHaveHeader
        titleHeader="Thư viện trợ giúp"
      >
        <div className="t-public_header_document">
          <PublicTable
            listData={
              !_.isEmpty(documentAfterExams) ? documentAfterExams : listDocument
            }
            column={columnForDocument}
            loading={
              _.isEmpty(documentAfterExams)
                ? listDocument.length === 0
                : documentAfterExams.length === 0
            }
            size="middle"
            rowkey="id"
            isbordered
            isNormal
            pageSizes={15}
            isPagination
            totalItem={documentAfterExams.length}
          />
        </div>
      </CDrawer>
      <CDrawer
        isOpen={isOpenDetailDoc}
        widths={900}
        levelDrawer="level2"
        handleOnClose={() => setIsOpenDetailDoc(false)}
      >
        <RichTextEditor
          data={contentDetailDoc.replace(/\n/g, "<br/>")}
          isDisabled
          typeText="notHeadernotBordernotBG"
        />
      </CDrawer>
      <CDrawer
        isOpen={priceList}
        titleHeader="Bảng giá"
        isHaveHeader
        widths={700}
        positon="right"
        handleOnClose={() => setPriceList(false)}
      >
        <PriceList isClose={!priceList} />
      </CDrawer>
    </>
  );
};

PublicHeader.defaultProps = {
  placeholderSearch:
    "Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm khách hàng",
  isHideFilter: false,
  isHideSearch: false,
  isHideCleanFilter: false,
  isShowTotalCustomer: false,
  isHideService: false,
  isHideEmergency: false,
  isDial: true
};

export default PublicHeader;
