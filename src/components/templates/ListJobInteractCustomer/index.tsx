/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-useless-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { OptionCustomerTask, OptionCustomerTaskDropdown } from 'assets/data';
import Button from 'components/atoms/Button';
import CDatePickers from 'components/atoms/CDatePickers';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { postCustomerTask } from 'services/api/customerInfo';
import { getTaskByCustomerID } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleRenderGUID, hanldeConvertListCustomer } from 'utils/functions';

import PublicHeader from '../PublicHeader';

interface ListJobInteractCustomerProps {
  customer_id: string;
}

const ListJobInteractCustomer: React.FC<ListJobInteractCustomerProps> = ({ customer_id }) => {
  const listTaskCustomer = useAppSelector((state) => state.infosCustomer.listTaskById);
  const loadingTask = useAppSelector((state) => state.infosCustomer.loadingTaskById);
  const dispatch = useAppDispatch();

  const storageGroupTask = localStorage.getItem('groupTask');
  const storageEmployeeTeams = localStorage.getItem('employeeTeams');

  const [listTask, setListTask] = useState<DropdownData[]>(storageGroupTask ? JSON.parse(storageGroupTask || '') : undefined as any);
  const [listEmployeeTeams, setListEmployeeTeams] = useState<DropdownData[]>(storageEmployeeTeams ? JSON.parse(storageEmployeeTeams || '') : undefined as any);

  const [optionTask, setOptionTask] = useState(listTaskCustomer.data);
  const [isAddTask, setIsAddTask] = useState(false);
  const [listPerson, setListPerson] = useState<DropdownData[]>();
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 0 });

  const [dataFilter, setDataFilter] = useState({
    task_type: undefined as unknown as DropdownData,
    task_status: undefined as unknown as DropdownData,
  });

  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    group: undefined as unknown as DropdownData,
    assign: undefined as unknown as DropdownData,
    personCharge: undefined as unknown as DropdownData,
    deadline: undefined as unknown as Date,
    type: OptionCustomerTask[1],
    desc: '',
    id: '',
  });

  const [formDataErr, setFormDataErr] = useState({
    name: '',
    group: '',
    deadline: '',
    desc: '',
  });

  const optionStatus = [
    { id: 0, title: 'Chưa phân công', key: 'new' },
    { id: 1, title: 'Đã phân công', key: 'inprogress' },
    { id: 2, title: 'Dời lại', key: 'delay' },
    { id: 3, title: 'Hủy', key: 'cancel' },
    { id: 4, title: 'Đã hoàn thành', key: 'done' },
  ]

  const tableColumns = [
    {
      title: <Typography content="Ngày tạo" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'create_datetime',
      align: 'center',
      width: 140,
      render: (record: any) => (
        <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['13x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Tên công việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'task_name',
      align: 'center',
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['13x18', '400', 'center', 'uppercase']} />
      ),
    },
    {
      title: <Typography content="Nhóm việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'task_type_name',
      align: 'center',
      width: 120,
      render: (record: any) => (
        <Typography content={record || '---'} modifiers={['13x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Đảm nhiệm" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'assign_employee_name',
      align: 'center',
      width: 170,
      render: (record: any) => (
        <Typography content={record} modifiers={['14x20', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Hạn chót (deadline)" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'remind_datetime',
      align: 'center',
      width: 140,
      render: (record: any) => (
        <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['13x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Ghi chú công việc" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'task_notes',
      align: 'center',
      render: (record: any, data: any) => (
        <>
          <Typography content={data?.task_description} modifiers={['13x18', '400', 'center', 'blueNavy', 'justify']} />
          <Typography content={`Cập nhật: ${data?.update_employee_name}. Lúc: ${moment(data?.update_datetime).format('HH:mm - DD/MM/YYYY')} `} modifiers={['13x18', '400', 'center', 'green', 'justify']} />
        </>
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'task_status',
      align: 'center',
      width: 120,
      render: (record: any, data: any) => (
        <Typography
          content={optionStatus.find((i) => i.key === record)?.title}
          modifiers={['12x18', '400', 'center', data?.task_status === 'new' && 'orange' || data?.task_status === 'done' && 'green' || data?.task_status === 'inprogress' && 'blueNavy' || (data?.task_status === 'delay' || data?.task_status === 'cancel') && 'cg-red' || 'jet']}
        />
      ),
    },
  ];

  useEffect(() => {
    setOptionTask(listTaskCustomer.data);
  }, [listTaskCustomer.data, loadingTask]);

  useLayoutEffect(() => {
    if (!optionTask) {
      dispatch(getTaskByCustomerID({
        id: customer_id,
        task_status: 'all',
      }));
    }
    
  }, [])

  const { mutate: postTask } = useMutation(
    'post-footer-form',
    (data: any) => postCustomerTask(data),
    {
      onSuccess: (data: any) => {
        dispatch(getTaskByCustomerID({
          id: customer_id,
          task_status: 'all',
        }));
        setIsAddTask(false); setIsUpdateTask(false);
        setFormData({ name: '', shortDesc: '', group: undefined as unknown as DropdownData, assign: undefined as unknown as DropdownData, personCharge: undefined as unknown as DropdownData, deadline: undefined as unknown as Date, type: OptionCustomerTask[0], desc: '', id: '', })
      },
      onError: (err: any) => {
        console.error("🚀 ~ file: index.tsx:157 ~ err:", err)
      },
    },
  );

  const handleValidate = () => {
    if (!formData.name.trim() || !formData.group || !formData.deadline) {
      setFormDataErr({
        ...formDataErr,
        name: !formData.name.trim() ? 'Tên công việc là trường bắt buộc' : '',
        group: !formData.group ? 'Nhóm công việc là trường bắt buộc' : '',
        deadline: !formData.deadline ? 'Hạn chót (deadline) là trường bắt buộc' : (new Date().valueOf() < formData?.deadline?.valueOf() ? 'Không thể sét hạn chót nhỏ hơn thời gian hiện tại' : ''),
        desc: !formData.desc.trim() ? 'Tên công việc là trường bắt buộc' : '',
      });
      return false;
    }
    return true;
  };

  const handleAddTask = async () => {
    if (!handleValidate()) return;
    if (isUpdateTask) {
      const body = {
        task_id: formData?.id,
        task_type_id: formData?.group?.value,
        customer_id: customer_id,
        task_name: formData?.name,
        task_description: formData?.shortDesc,
        task_last_note: formData?.desc,
        employee_team_id: formData?.assign?.value,
        assign_employee_id: formData?.personCharge?.value,
        remind_datetime: moment(formData?.deadline).format('YYYY-MM-DDTHH:mm:ss'),
        task_status: formData?.type?.value,
      };
      await postTask(body);
    } else {
      const body = {
        task_id: handleRenderGUID(),
        task_type_id: formData?.group?.value,
        customer_id: customer_id,
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
  };

  const handleGetMyTask = () => {
    dispatch(getTaskByCustomerID({
      id: customer_id,
      task_status: 'all',
    }));
  };

  const handleChangePagination = (pages: number, size: number) => {
    setPagination({ page: pages, pageSize: size });
    dispatch(getTaskByCustomerID({
      id: customer_id,
      task_status: 'all',
      pages: pages,
      limits: size,
    }));
  };


  return (
    <div className="t-list_job">
      <div className="t-list_job_header">
        <PublicHeader
          titlePage=""
          className="t-list_job_header_wrap"
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data: string) => { }}
          isHideLibraly
          isHideCleanFilter
          isHideSearch
          isHideService
          isHideFilter
          isDial={false}
          isHideEmergency
          listBtn={
            (
              <>
                <Button className="m-form_note" modifiers={['foreign']} onClick={handleGetMyTask}>
                  <Typography type="span" modifiers={['400', '16x24']} content="Công việc của tôi" />
                </Button>
                <Button className="m-form_note" modifiers={['primary']} onClick={() => setIsAddTask(true)}>
                  <Typography type="span" modifiers={['400', '16x24']} content="Thêm mới công việc" />
                </Button>
                <Button className="m-form_note" modifiers={['primary']} onClick={() => dispatch(getTaskByCustomerID({ id: customer_id }))}>
                  <Typography type="span" modifiers={['400', '16x24']} content="Hủy Lọc" />
                </Button>
              </>
            )
          }
        />
      </div>
      <div className="t-list_job_content">
        <PublicTable
          loading={loadingTask}
          column={tableColumns}
          listData={optionTask}
          handleOnDoubleClick={(event: any, record: any, rowIndex: any) => {
            setFormData({
              name: record?.task_name,
              shortDesc: record?.task_description,
              group: (listTask || []).find((i) => i.value === record?.task_type_id) as any,
              assign: listEmployeeTeams?.find((i) => i.value === record?.employee_team_id) as any,
              personCharge: hanldeConvertListCustomer(record?.employee_team_id).find((i) => i.value === record?.assign_employee_id) as any,
              deadline: record?.remind_datetime,
              type: OptionCustomerTask?.find((y) => y.value === record?.task_status) as any,
              desc: record?.task_last_note,
              id: record?.task_id,
            });
            setIsAddTask(true);
            setIsUpdateTask(true);
          }}
          scroll={{
            x: '100%',
            y: '300px',
          }}
          size="small"
          rowkey="task_id"
          isbordered
          isNormal
          isPagination
          handleChangePagination={handleChangePagination}
          totalItem={listTaskCustomer.total_items}
        />
      </div>
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
      <CDrawer
        isOpen={isFilter}
        widths={400}
        isHaveHeader
        titleHeader="Bộ lọc công việc"
        isHaveFooter
        footerCancel='Hủy'
        footerSubmit='Tìm kiếm'
        handleOnClose={() => { setIsFilter(false) }}
        handleSubmit={() => {
          dispatch(getTaskByCustomerID({ id: customer_id, task_type: dataFilter?.task_type?.value, task_status: dataFilter?.task_status?.value }));
        }}
      >
        <div className="t-list_job_header_wrap_list">
          <Dropdown
            dropdownOption={[{ id: 99, label: 'Tất cả', value: 'all' }, ...(listTask ? listTask : [])]}
            label="Loại công việc"
            placeholder="Chọn loại công việc"
            handleSelect={(item) => {
              setDataFilter({ ...dataFilter, task_type: item })
            }}
            variant="style"
          />
          <Dropdown
            dropdownOption={OptionCustomerTaskDropdown}
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            handleSelect={(item) => {
              setDataFilter({ ...dataFilter, task_status: item })
            }}
            variant="style"
          />

        </div>
      </CDrawer>
    </div>
  );
};
ListJobInteractCustomer.defaultProps = {
};

export default ListJobInteractCustomer;
