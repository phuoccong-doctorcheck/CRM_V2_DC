/* eslint-disable @typescript-eslint/no-unused-vars */
import { historiesCallSort, historiesCallType } from 'assets/data';
import AudioPlayer from 'components/atoms/AudioPlayer';
import Button from 'components/atoms/Button';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistoriesCallFromCloudfone } from 'store/cloudfone';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { historiesCallStatus } from 'utils/staticState';

const HistoriesCall: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigatorRoute = useNavigate();

  const historiesCall = useAppSelector((state) => state.cloudfone.historiesCall);
  
  const historiesCallLoading = useAppSelector((state) => state.cloudfone.historiesCallLoading);
  const getRoles = localStorage.getItem('roles');

  const [listRoles] = useState(getRoles ? JSON.parse(getRoles) : '');

  const [dataResponse, setDataResponse] = useState(historiesCall)
  const [dataResponseLoading, setDataResponseLoading] = useState(historiesCallLoading)
  const [filter, setFilter] = useState({
    from: new Date(),
    to: new Date(),
    type: historiesCallType[0],
    sortType: historiesCallSort[0],
    page: 1,
    pageSize: 200,
    keySearch: '',
    callNumber: '',
    ReceiveNumber: '',
    ReceiveNumberBranch:''
  })

  const bodyHistoriesCall = {
    TypeGet: filter.type.value,
    HideFWOut: 1,
    DateStart: moment(filter.from).format(`YYYY-MM-DD 00:00:01`),
    DateEnd: moment(filter.to).format(`YYYY-MM-DD 23:59:59`),
    IsSort: 1,
    CallNum: filter.callNumber,
    ReceiveNum: filter.ReceiveNumberBranch,
    Key: filter.keySearch,
    PageIndex: filter.page,
    PageSize: filter.pageSize,
  }

  useEffect(() => {
    if ((listRoles?.some((role: any) => ['BOD','normal','appointmentView'].some((i => i === role?.role_name))))) {
      return;
    }
    return navigatorRoute('/not-have-permission');
  }, []);

  useLayoutEffect(() => {
    dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall));
       document.title = 'Lịch sử cuộc gọi | CRM'
  }, [])

  useEffect(() => {
    setDataResponse(historiesCall);
  }, [historiesCall])

  useEffect(() => {
    setDataResponseLoading(historiesCallLoading);
  }, [historiesCallLoading])

  const handleGetHistoriesCall = () => {
    dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall));
  }

  const tableColumns = [
    {
      title: (<Typography content="Ngày gọi" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "ngayGoi",
      align: "center",
      showSorterTooltip: false,
      width: 180,
      render: (record: any) => (
        <Typography
          content={moment(record).format("HH:mm - DD/MM/YYYY")}
          modifiers={["14x20", "500", "center", 'main']}
        />
      ),
    },
    {
      title: (<Typography content="Hướng cuộc gọi" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "typecall",
      align: "center",
      width: 200,
      render: (record: any, data: any) => (
        <Typography
          content={record === 'Outbound' ? 'Cuộc gọi ra' : data?.dauSo.length === 3 && data?.soNhan.length === 3 ? 'Cuộc gọi nội bộ' : 'Cuộc gọi vào'}
          modifiers={["14x20", "500", "left", 'main', 'uppercase']}
        />
      ),
    },
    {
      title: (<Typography content="Số gọi đến" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "soGoiDen",
      align: "center",
      width: 200,
      render: (record: any) => (
        <Typography
          content={record?.replace(/&quot;/g, '')?.replace(/&lt;.*&gt;/g, '')?.trim()}
          modifiers={["14x20", "500", "center", 'blueNavy']}
        />
      ),
    },
    {
      title: (<Typography content="Số nhận" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "dauSo",
      align: "center",
      width: 200,
      render: (record: any, data: any) => (
        <Typography
          content={record ? record : data.soGoiDen?.replace(/&quot;/g, '')?.replace(/&lt;.*&gt;/g, '')?.trim()}
          modifiers={["14x20", "500", "center", 'blueNavy']}
        />
      ),
    },

    {
      title: (<Typography content="Nhánh số nhận" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "soNhan",
      align: "center",
      render: (record: any) => (
        <Typography
          content={record}
          modifiers={["14x20", "500", "center", 'green']}
        />
      ),
    },
    {
      title: (<Typography content="Trạng thái" modifiers={["16x24", "500", "center", "capitalize"]} />),
      dataIndex: "trangThai",
      align: "center",
      width: 200,
      render: (record: any) => (
        <Typography
          content={historiesCallStatus.find((item: any) => item?.value === record)?.label}
          modifiers={["14x20", "400", "center", record === 'ANSWERED' ? 'green' : record === 'BUSY' ? 'orange' : 'cg-red']}
        />
      ),
    },

    {
      title: (<Typography content="File ghi âm" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "",
      align: "center",
      width: 140,
      className: 'p-miss_call_cell',
      render: (record: any, data: any) => (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {Number(data?.thoiGianThucGoi) > 0 ?
            <AudioPlayer audioSrc={data?.linkFile} duration={data?.thoiGianThucGoi || 0} />
            : <Typography content='Không tìm thấy thông tim cuộc gọi' modifiers={['400', 'cg-red', 'italic']} />
          }
        </div>
      ),
    },
  ];
  const filterDatarespone = (dataResponse1: any) => {
    const filteredHistories = dataResponse1.filter((item:any) => 
        item.dauSo.length !== item.soNhan.length && item.trangThai === "ANSWERED"
    );
    
    return filteredHistories
  }
  const memoryTable = useMemo(() => {
    return (
      <div className='p-histories_call_body_table'>
        <PublicTable
          listData={filterDatarespone(dataResponse.data)}
          column={tableColumns}
          loading={dataResponseLoading}
          isPagination
          totalItem={(dataResponse.data ?? [])?.length}
          pageSizes={50}
          size='middle'
          rowkey='stt'
          rowClassNames={(record: any, index: any) => {
            return index % 2 === 0 ? 'bg-gay-blur' : ''
          }}
        />
      </div>
    )
  }, [dataResponse.data, dataResponseLoading, tableColumns])
  const FilterNumberReceive = (ReceiveNumber: any) => {
    setDataResponseLoading(true)
    if (ReceiveNumber === "") {
       dispatch(getHistoriesCallFromCloudfone({
    TypeGet: filter.type.value,
    HideFWOut: 1,
    DateStart: moment(filter.from).format(`YYYY-MM-DD 00:00:01`),
    DateEnd: moment(filter.to).format(`YYYY-MM-DD 23:59:59`),
    IsSort: 1,
    CallNum: filter.callNumber,
    ReceiveNum: "",
    Key: filter.keySearch,
    PageIndex: filter.page,
    PageSize: filter.pageSize,
  }));
    }
  const filteredHistories = historiesCall.data.filter((item: any) => {
    const cleanedSoGoiDen = item.soGoiDen?.replace(/&quot;/g, '')?.replace(/&lt;.*&gt;/g, '')?.trim();
    return item.dauSo === ReceiveNumber || (item.dauSo === "" && cleanedSoGoiDen === ReceiveNumber);
  });
   const result = {
     data: filteredHistories, message: "",
     result: "success",
     total: 162
    };
     setDataResponseLoading(false)
   setDataResponse(result);
};

  return (
    <div className='p-histories_call'>
      <PublicLayout>
        <PublicHeader
          titlePage='Lịch Sử Cuộc Gọi'
          className="p-histories_call_header"
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={() => { }}
          isHideFilter
          isHideCleanFilter
          isHideService
          isHideEmergency
          isDial={false}
          tabLeft={(
            <div className="p-histories_call_header_left">
              <RangeDate
                variant="simple"
                handleOnChange={(from: any, to: any) => {
                  setFilter({
                    ...filter,
                    from: from, to: to
                  })
                }}
                fomat='DD-MM-YYYY'
                value={{ from: filter.from, to: filter.to }}
              />
              <Button modifiers={['foreign']} onClick={handleGetHistoriesCall}>
                <Typography content='Lọc' modifiers={['400']} />
              </Button>
            </div>
          )}
          listBtn={(
          //   <div className='p-histories_call_body_sort'>
          //   <div className='p-histories_call_body_sort_left'>
          //     <Dropdown
          //       dropdownOption={historiesCallType}
          //       placeholder='Loại cuộc gọi'
          //       variant='simple'
          //       values={filter.type}
          //       handleSelect={(item: DropdownData) => {
          //         setFilter({
          //           ...filter,
          //           type: item
          //         })

          //         const newBody = {
          //           ...bodyHistoriesCall,
          //           TypeGet: item.value,
          //         }
          //         dispatch(getHistoriesCallFromCloudfone(newBody));
          //       }}
          //     />
          //     <Input
          //       variant='simple'
          //       placeholder='Số điện thoại gọi'
          //       iconName='close'
          //       value={filter.callNumber}
          //       onChange={(event) => { setFilter({ ...filter, callNumber: event.target.value, }) }}
          //       handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
          //       handleClickIcon={() => { setFilter({ ...filter, callNumber: '', }) }}
          //     />
          //     <Input
          //       variant='simple'
          //       placeholder='Số điện thoại nhận'
          //       iconName='close'
          //       value={filter.ReceiveNumber}
          //       onChange={(event) => { setFilter({ ...filter, ReceiveNumber: event.target.value, }) }}
          //       // handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
          //       handleEnter={() => FilterNumberReceive( filter.ReceiveNumber)}
          //       handleClickIcon={() => { setFilter({ ...filter, ReceiveNumber: '', }) }}
          //     />
          //     <Input
          //       variant='simple'
          //       placeholder='Nhánh số nhận'
          //       iconName='close'
          //       value={filter.ReceiveNumberBranch}
          //       onChange={(event) => { setFilter({ ...filter, ReceiveNumberBranch: event.target.value, }) }}
          //       handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
          //       handleClickIcon={() => { setFilter({ ...filter, ReceiveNumberBranch: '', }) }}
          //     />
          //     <Input
          //       variant='simple'
          //       placeholder='Nhập mã cuộc gọi cần tìm kiếm'
          //       iconName='search'
          //       value={filter.keySearch}
          //       onChange={(event) => { setFilter({ ...filter, keySearch: event.target.value, }) }}
          //       handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
          //       handleClickIcon={handleGetHistoriesCall}
          //     />
          //   </div>
          //   <Dropdown
          //     dropdownOption={historiesCallSort}
          //     placeholder='Sắp xếp'
          //     variant='simple'
          //     handleSelect={(item: DropdownData) => {
          //       setFilter({
          //         ...filter,
          //         sortType: item
          //       })
          //       const newBody = {
          //         ...bodyHistoriesCall,
          //         IsSort: item.id,
          //       }
          //       dispatch(getHistoriesCallFromCloudfone(newBody));
          //     }}
          //     values={filter.sortType}
          //   />
            // </div>
            <div></div>
          )}
        />
        <div className='p-histories_call_body'>
          <div className='p-histories_call_body_sort'>
            <div className='p-histories_call_body_sort_left'>
              <Dropdown
                dropdownOption={historiesCallType}
                placeholder='Loại cuộc gọi'
                variant='simple'
                values={filter.type}
                handleSelect={(item: DropdownData) => {
                  setFilter({
                    ...filter,
                    type: item
                  })

                  const newBody = {
                    ...bodyHistoriesCall,
                    TypeGet: item.value,
                  }
                  dispatch(getHistoriesCallFromCloudfone(newBody));
                }}
              />
              <Input
                variant='simple'
                placeholder='Số điện thoại gọi'
                iconName='close'
                value={filter.callNumber}
                onChange={(event) => { setFilter({ ...filter, callNumber: event.target.value, }) }}
                handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
                handleClickIcon={() => { setFilter({ ...filter, callNumber: '', }) }}
              />
              <Input
                variant='simple'
                placeholder='Số điện thoại nhận'
                iconName='close'
                value={filter.ReceiveNumber}
                onChange={(event) => { setFilter({ ...filter, ReceiveNumber: event.target.value, }) }}
                // handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
                handleEnter={() => FilterNumberReceive( filter.ReceiveNumber)}
                handleClickIcon={() => { setFilter({ ...filter, ReceiveNumber: '', }) }}
              />
              <Input
                variant='simple'
                placeholder='Nhánh số nhận'
                iconName='close'
                value={filter.ReceiveNumberBranch}
                onChange={(event) => { setFilter({ ...filter, ReceiveNumberBranch: event.target.value, }) }}
                handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
                handleClickIcon={() => { setFilter({ ...filter, ReceiveNumberBranch: '', }) }}
              />
              <Input
                variant='simple'
                placeholder='Nhập mã cuộc gọi cần tìm kiếm'
                iconName='search'
                value={filter.keySearch}
                onChange={(event) => { setFilter({ ...filter, keySearch: event.target.value, }) }}
                handleEnter={() => { dispatch(getHistoriesCallFromCloudfone(bodyHistoriesCall)); }}
                handleClickIcon={handleGetHistoriesCall}
              />
            </div>
            <Dropdown
              dropdownOption={historiesCallSort}
              placeholder='Sắp xếp'
              variant='simple'
              handleSelect={(item: DropdownData) => {
                setFilter({
                  ...filter,
                  sortType: item
                })
                const newBody = {
                  ...bodyHistoriesCall,
                  IsSort: item.id,
                }
                dispatch(getHistoriesCallFromCloudfone(newBody));
              }}
              values={filter.sortType}
            />
          </div>
          {memoryTable}
        </div>
      </PublicLayout>
    </div>
  );
}

export default HistoriesCall;
