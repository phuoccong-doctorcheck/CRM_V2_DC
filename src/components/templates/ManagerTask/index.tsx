/* eslint-disable @typescript-eslint/no-unused-vars */
import { OptionCustomerTask, OptionMyTaskDropdown } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import Checkbox from 'components/atoms/Checkbox';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Input from 'components/atoms/Input';
import RangeDate from 'components/atoms/RangeDate';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import RichTextEditor from 'components/molecules/RichTextEditor';
import CModal from 'components/organisms/CModal';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postCustomerTask } from 'services/api/customerInfo';
import { getMyTask } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleRenderGUID, hanldeConvertListCustomer } from 'utils/functions';

import PublicHeader from '../PublicHeader';
import PublicLayout from '../PublicLayout';

interface ManagerTaskProps {
  children?: React.ReactNode;
}

const ManagerTask: React.FC<ManagerTaskProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const myTask = useAppSelector((state) => state.infosCustomer.respMyTask);

  const storageGroupTask = localStorage.getItem('groupTask');
  const storageEmployeeTeams = localStorage.getItem('employeeTeams');

  const [listTask, setListTask] = useState<DropdownData[]>(storageGroupTask ? JSON.parse(storageGroupTask || '') : undefined as any);
  const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);

  const [dataFilter, setDataFilter] = useState({
    fromDay: undefined as unknown as Date,
    toDay: undefined as unknown as Date,
    groupTask: '',
    assignment: undefined as unknown as DropdownData,
    employeeTeam: listEmployeeTeams?.find((i) => i?.value === 'CSKH') as unknown as DropdownData,
    taskStatus: OptionMyTaskDropdown?.find((i) => i?.value === 'inprogress'),
    keyWord: '',
    myTask: false,
    pages: 0,
    limits: 30,
  });

  const [listPerson, setListPerson] = useState<DropdownData[]>();
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [isAddTask, setIsAddTask] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    group: undefined as unknown as DropdownData,
    assign: undefined as unknown as DropdownData,
    personCharge: undefined as unknown as DropdownData,
    deadline: undefined as unknown as Date,
    type: OptionCustomerTask[0],
    desc: '',
    id: '',
  });

  const [formDataErr, setFormDataErr] = useState({
    name: '',
    group: '',
    deadline: '',
    desc: '',
  });

  const propsData = {
    from:moment(dataFilter?.fromDay).format('YYYY-MM-DDT00:00:00') ,
    to: moment(dataFilter?.toDay).format('YYYY-MM-DDTHH:mm:ss'),
    task_type: dataFilter?.assignment?.value || 'all',
    task_status: dataFilter?.taskStatus?.value || 'all',
    employee_team: dataFilter?.employeeTeam?.value || null,
    isAssignMe: dataFilter.myTask,
    keySearch: dataFilter?.keyWord || '',
    pages: dataFilter?.pages || 1,
    limits: dataFilter?.limits || 30,
  }

  const handleChangePagination = (pages: number, size: number) => {
    setDataFilter({ ...dataFilter, pages: pages, limits: size })
    dispatch(getMyTask({ ...propsData, pages: pages, limits: size }));
  };

  const { mutate: postTask } = useMutation(
    'post-footer-form',
    (data: any) => postCustomerTask(data),
    {
      onSuccess: (data: any) => {
        dispatch(getMyTask({ ...propsData }));
        toast.success('Thêm công việc thành công!')
        setIsAddTask(false);
        setFormData({
          name: '',
          shortDesc: '',
          group: undefined as unknown as DropdownData,
          assign: undefined as unknown as DropdownData,
          personCharge: undefined as unknown as DropdownData,
          deadline: undefined as unknown as Date,
          type: undefined as unknown as GroupRadioType,
          desc: '',
          id: '',
        });

      },
      onError: (err: any) => {
      },
    },
  );


  const handleValidate = () => {
    if (!formData.name.trim() || !formData.group || !formData.deadline) {
      if (!formData.name.trim()) {
        setFormDataErr({ ...formDataErr, name: 'Tên công việc là trường bắt buộc' });
      }
      if (!formData.group) {
        setFormDataErr({ ...formDataErr, group: 'Nhóm công việc là trường bắt buộc' });
      }
      if (new Date().valueOf() < formData?.deadline?.valueOf()) {
        setFormDataErr({ ...formDataErr, name: 'Không thể sét hạn chót nhỏ hơn thời gian hiện tại' });
      }
      if (!formData.deadline) {
        setFormDataErr({ ...formDataErr, name: 'Hạn chót (deadline) là trường bắt buộc' });
      }
      return false;
    }
    return true;
  };

  const handleAddTask = async () => {
    if (!handleValidate()) return;
    const body = {
      task_id: handleRenderGUID(),
      task_type_id: formData?.group?.value,
      customer_id: formData.id,
      task_name: formData?.name,
      task_description: formData?.shortDesc,
      task_last_note: formData?.desc,
      employee_team_id: formData?.assign?.value,
      assign_employee_id: formData?.personCharge?.value,
      remind_datetime: moment(formData?.deadline).format('YYYY-MM-DDTHH:mm:ss'),
      task_status: formData?.type?.value,
    };
    await postTask(body);
  }

  const tableColumns = [
    {
      title: (<Typography content="Ngày tạo" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "create_datetime",
      align: "center",
      width: 140,
      render: (record: any, data: any) => (
        <Typography
          content={moment(data?.create_datetime).format("HH:mm - DD/MM/YYYY")}
          modifiers={["14x20", "400", "center"]}
          styles={{fontSize:"12px",paddingRight:"5px",paddingLeft:"5px"}}
        />
      ),
    },
  {
  title: (
    <Typography content="Tên công việc" modifiers={["14x20", "500", "center", "capitalize"]}  styles={{textAlign:"left",paddingRight:"10px",paddingLeft:"10px"}}/>
  ),
  dataIndex: "task_name",
  align: "left",
  width: 14000,
  render: (record: any, data: any) => (
    <div style={{  wordWrap: "break-word", whiteSpace: "normal" }}>
      <Typography
        content={data?.task_name}
        modifiers={["14x20", "600", "justify", "cg-red"]}
        styles={{ fontSize: "12.66px", paddingRight: "10px", paddingLeft: "10px" }}
      />
      <Typography
        content={data?.task_description}
        modifiers={["14x20", "400", "justify", "italic", "green"]}
        styles={{ fontSize: "12px", paddingRight: "10px", paddingLeft: "10px" }}
      />
    </div>
  ),
},


    {
      title: (<Typography content="Nhóm việc" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "task_type_name",
      align: "center",
        width: 200,
      render: (record: any) => (
        <Typography
          content={record}
          modifiers={["14x20", "400", "center"]}
            styles={{ fontSize: "12.66px", paddingRight: "15px", paddingLeft: "15px",color:"#00556e" }}
        />
      ),
    },
    {
      title: (<Typography content="Người đảm nhiệm" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "assign_employee_name",
      align: "center",
      width: 200,
      render: (record: any) => (
        <Typography
          content={record ? record : '--'}
          modifiers={["14x20", "400", "center"]}
           styles={{ fontSize: "12.66px", paddingRight: "20px", paddingLeft: "20px" ,color:"#00556e" }}
        />
      ),
    },
    {
      title: (<Typography content="Hạn chót (deadline)" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "update_datetime",
      align: "center",
      width: 300,
      render: (record: any, data: any) => {
        return <Typography
          content={moment(data?.remind_datetime).format("HH:mm - DD/MM/YYYY")}
          modifiers={["14x20", "400", "center"]}
           styles={{ fontSize: "12.66px", paddingRight: "5px", paddingLeft: "5px",color:"#dc3545"  }}
        />
      },
    },
    
    {
      title: (<Typography content="Ghi chú công việc" modifiers={["14x20", "500", "center", "capitalize"]} styles={{textAlign:"left",paddingRight:"10px",paddingLeft:"10px"}}/>),
      dataIndex: "task_notes",
      align: "left",
      width: 10000,
      className: ".t-manager_task_note",
      render: (record: any, data: any) => {
        const listTask: any[] = record ? JSON?.parse(record || '') : [];
        return (
          <div className='t-manager_task_note_item' style={{  wordWrap: "break-word", whiteSpace: "normal" , padding:"10px"}}>
            {
              listTask?.length ? listTask?.map((task, index) => (
                <div key={index} style={{ padding: '2px 0' }}>
                  <Typography
                    content={`${task?.note} - ${moment(task?.note_datetime).format('HH:mm - DD/MM/YYYY')}`}
                    modifiers={["14x20", "400", "justify"]}
                  />
                </div>
              )) : null
            }
            <span>Cập nhật: {data?.update_employee_name}. Lúc {moment(data?.update_datetime).format('HH:mm - DD/MM/YYYY')}</span>
          </div>
        )
      },
    }
    ,
    {
      title: (<Typography content="Trạng thái" modifiers={["14x20", "500", "center", "capitalize"]} />),
      dataIndex: "task_status_text",
      align: "center",
      width: 130,
      render: (record: any) => (
        <Typography
          content={record}
          modifiers={["14x20", "400", "center"]}
           styles={{ fontSize: "12.66px", paddingRight: "10px", paddingLeft: "10px",color:`${record === "Đang thực hiện" ? "#28a745" : record === "Đã hoàn thành" ?"#28a745" :record === "Đã hủy" ? "#dc3545" :"#dc3545" }`  }}
        />
      ),
    },
  ];
  useEffect(() => {
     dispatch(getMyTask(propsData));
  },[])
  return (
    <div className="t-manager_task">
      <PublicLayout>
        <div className="t-manager_task_header">
          <PublicHeader
            titlePage={''}
            handleGetTypeSearch={() => { }}
            handleFilter={() => { }}
            handleCleanFilter={() => {
              dispatch(getMyTask({ ...propsData }));
            }}
            isHideFilter
            isHideEmergency
            tabLeft={(
              <div className="t-manager_task_header_wrapper">
                <RangeDate
                  fomat='YYYY-MM-DD'
                  variant="simple"
                  handleOnChange={(from: any, to: any) => {
                    setDataFilter({ ...dataFilter, fromDay: new Date(moment(from).format('YYYY-MM-DDT00:00:00')), toDay: new Date(moment(to).format('YYYY-MM-DDT23:59:59')) })
                    dispatch(getMyTask({ ...propsData, from: moment(from).format('YYYY-MM-DDT00:00:00'), to: moment(to).format('YYYY-MM-DDT23:59:59') }));
                  }}
                  value={{ from: dataFilter?.fromDay, to: dataFilter?.toDay }}
                />
                <Input
                  id="user_name"
                  variant="simple"
                  onChange={(e) => {
                    setDataFilter({ ...dataFilter, keyWord: e.target.value })
                    setDataFilter({ ...dataFilter, keyWord: e.target.value })
                  }}
                  value={dataFilter.keyWord}
                  placeholder='Nhập tên, địa chỉ, số điện thoại,.. để tìm kiếm'
                  handleClickIcon={() => {
                    dispatch(getMyTask({ ...propsData, keysearch: dataFilter.keyWord }));
                  }}
                  handleEnter={() => {
                    dispatch(getMyTask({ ...propsData, keysearch: dataFilter.keyWord }));
                  }}
                  iconName='search'
                />
              </div>
            )}
            tabBottom={(
              <div className="t-manager_task_header_wrapper_bottom">
                <Dropdown
                  dropdownOption={[{ id: 99, label: 'Tất cả', value: 'all' }, ...listTask]}
                  placeholder="-- Lọc theo nhóm việc --"
                  variant="simple"
                  values={[{ id: 99, label: 'Tất cả', value: 'all' }, ...listTask].find((i) => i.value == dataFilter.groupTask)}
                  handleSelect={(e: any) => {
                    setDataFilter({ ...dataFilter, groupTask: e?.value })
                    dispatch(getMyTask({ ...propsData, task_type: e?.value }));
                  }}
                />
                <Dropdown
                  dropdownOption={[{ id: 99, label: 'Tất cả', value: 'all' }, ...listEmployeeTeams]}
                  variant="simple"
                  placeholder="-- Team phụ trách --"
                  values={dataFilter.employeeTeam}
                  handleSelect={(e: any) => {
                    setDataFilter({ ...dataFilter, employeeTeam: e })
                    dispatch(getMyTask({ ...propsData, employee_team: e?.value }));
                  }}
                />
                <Dropdown
                  dropdownOption={OptionMyTaskDropdown}
                  variant="simple"
                  placeholder="-- Trạng thái --"
                  values={dataFilter.taskStatus}
                  handleSelect={(e: any) => {
                    setDataFilter({ ...dataFilter, taskStatus: e })
                    dispatch(getMyTask({ ...propsData, task_status: e?.value }));
                  }}
                />
                {/* <Checkbox isCheckCustom label="Việc của tôi" isChecked={dataFilter.myTask} onChange={(data: any) => {
                  setDataFilter({ ...dataFilter, myTask: !dataFilter.myTask })
                  dispatch(getMyTask({ ...propsData, isAssignMe: !dataFilter.myTask }));
                }} /> */}
              </div>
            )}
            listBtn={(
              <>
                <Button modifiers={['foreign']} onClick={() => setIsAddTask(true)}>
                  <Typography content='Thêm công việc' modifiers={['400']} />
                </Button>
              </>
            )}
          />
        </div>
        <div className="t-manager_task_table">
          <PublicTable
            listData={myTask?.data}
            column={tableColumns}
            isNormal
            isbordered={true}
            isHideRowSelect
            isPagination
            handleOnClick={(event: any, record: any, rowIndex: any) => {
              const { customer_id } = record
              window.open(
                `/customer-info/id/${customer_id}/history-interaction`,
                "_blank"
              );
            }}
            size="small"
            pageSizes={30}
            handleChangePagination={(page: any, pageSize: any) => {
              handleChangePagination(page, pageSize);
            }}
            totalItem={myTask.total_items}
          />
        </div>
      </PublicLayout>
      <CModal
        isOpen={isAddTask}
        widths={800}
        onCancel={() => {
          setIsAddTask(false); setIsUpdateTask(false);
          setFormData({
            name: '',
            shortDesc: '',
            group: undefined as unknown as DropdownData,
            assign: undefined as unknown as DropdownData,
            personCharge: undefined as unknown as DropdownData,
            deadline: undefined as unknown as Date,
            type: undefined as unknown as GroupRadioType,
            desc: '',
            id: '',
          });
        }}
        isHideFooter
        zIndex={10}>
        <div className="t-list_job_form">
          <div className="t-list_job_form_content">
            <Input
              label="Tên công việc"
              isRequired
              value={formData.name}
              variant="border8"
              placeholder="Nhập tên công việc"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formDataErr.name}
            />
            <Input label="Mô tả ngắn" value={formData.shortDesc} variant="border8" placeholder="Nhập mô tả" onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} />
            <div className="t-list_job_form_content_flex">
              <Dropdown
                dropdownOption={listTask}
                isRequired
                values={formData.group}
                placeholder="Nhóm việc"
                label="Nhóm việc"
                handleSelect={(item) => { setFormData({ ...formData, group: item }); }}
                variant="style"
                className="form_origin"
                error={formDataErr.group}
              />
              <Dropdown
                dropdownOption={listEmployeeTeams}
                isRequired
                placeholder=""
                label="Phân công cho"
                handleSelect={(item) => {
                  setFormData({ ...formData, assign: item });
                  setListPerson(hanldeConvertListCustomer(item?.value));
                }}
                variant="style"
                className="form_origin"
                values={formData.assign}
              />
              <Dropdown
                dropdownOption={listPerson || []}
                isRequired
                placeholder="Chọn người đảm nhiệm"
                label="Người đảm nhiệm"
                handleSelect={(item) => { setFormData({ ...formData, personCharge: item }); }}
                variant="style"
                className="form_origin"
                values={formData.personCharge}
              />
            </div>
            <div className="t-list_job_form_content_flex2">
              <CDatePickers
                isRequired
                label="Hạn chót (deadline)"
                handleOnChange={(date: any) => { setFormData({ ...formData, deadline: date?.$d }); }}
                variant="style"
                fomat="YYYY-MM-DD HH:mm"
                isShowTime
                placeholder="1990-01-01"
                value={formData.deadline}
                error={formDataErr.deadline}
              />
              <GroupRadio options={OptionCustomerTask} value={formData.type} handleOnchangeRadio={(data: any) => setFormData({ ...formData, type: data })} />
            </div>
            <TextArea label="Ghi chú" placeholder="Mô tả công việc" required id="" readOnly={false} handleOnchange={(e) => setFormData({ ...formData, desc: e.target.value })} />
          </div>
          <div className="t-list_job_form_content_btn">
            <Button modifiers={['foreign']} className="m-form_note" onClick={() => { setIsAddTask(false); setIsUpdateTask(false); }}>
              <Typography type="span" modifiers={['400', '16x24']} content="Đóng" />
            </Button>
            <Button modifiers={['primary']} className="m-form_note" onClick={handleAddTask}>
              <Typography type="span" modifiers={['400', '16x24']} content="Lưu công việc" />
            </Button>
          </div>
        </div>
      </CModal>
    </div>
  );
}

ManagerTask.defaultProps = {
  children: undefined,
};

export default ManagerTask;
