/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import ImagePreview from 'components/atoms/ImagePreview';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import PublicTable from 'components/molecules/PublicTable';
import CModal from 'components/organisms/CModal';
import _ from 'lodash';
import moment from 'moment';
import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postSaveExternalFie } from 'services/api/customerInfo';
import { getListExternalFile } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleConverFileToBase64, handleRenderGUID } from 'utils/functions';

import PublicHeader from '../PublicHeader';

interface ExternalFileProps {
  customerId?: string;
}

const ExternalFile: React.FC<ExternalFileProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();

  const storeExternalFile = useAppSelector((state) => state.infosCustomer.listExternalFile);
  const pendingExternalFile = useAppSelector((state) => state.infosCustomer.pendingExternalFile);

  const [pendingExternal, setPendingExternal] = useState(pendingExternalFile);
  const [dataExternalFile, setdataExternalFile] = useState(storeExternalFile);

  const [isAddProfile, setIsAddProfile] = useState(true);
  const [isSendFile, setIsSendFile] = useState(false);
  const [dataAddFile, setDataAddFile] = useState({
    id: handleRenderGUID(),
    out_exams_title: '',
    out_exams_note: '',
    file: {},
  });
  const [errors, setErrors] = useState({
    out_exams_title: '',
  });

  const [preview, setPreview] = useState({
    open: false,
    value: { original: '' },
  })

  useEffect(() => {
    if (pendingExternalFile) {
      setdataExternalFile(undefined as any);
    }
    setPendingExternal(pendingExternalFile);
  }, [pendingExternalFile])
  useEffect(() => { setdataExternalFile(storeExternalFile); }, [storeExternalFile])
  useLayoutEffect(() => {
    if (!dataExternalFile.data) {
      dispatch(getListExternalFile({
        customer_id: customerId,
        keyword: '',
        page: 1,
        limit: 15,
      }));
    }
  }, [])

  const { mutate: postSaveExternalFile } = useMutation(
    'post-footer-form',
    (data: any) => postSaveExternalFie(data),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          await setDataAddFile({
            ...dataAddFile,
            out_exams_title: '',
            out_exams_note: '',
            file: {},
          })
          setIsSendFile(false);
          dispatch(getListExternalFile({
            customer_id: customerId,
            keyword: '',
            page: 1,
            limit: 15,
          }));
          toast.success('Thêm hồ sơ thành công')
        } else {
          setIsAddProfile(false);
          setDataAddFile({
            ...dataAddFile,
            out_exams_title: '',
            out_exams_note: '',
            file: {},
          })
          toast.success(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const handleAddExternalFile = async (data: any) => {
    const body = {
      ...data,
      customer_id: customerId
    }
    if (_.isEmpty(dataAddFile?.out_exams_title) || _.isEmpty(dataAddFile?.file)) {
      if (_.isEmpty(dataAddFile?.out_exams_title)) {
        toast.error('Tên file là trường bắt buộc!');
        setErrors({ ...errors, out_exams_title: 'Tên file là trường bắt buộc' })
        setDataAddFile({
          ...dataAddFile,
          out_exams_title: '',
          out_exams_note: '',
          file: {},
        })
      } else {
        toast.error('Vui lòng chọn file tải lên!');
        setDataAddFile({
          ...dataAddFile,
          out_exams_title: '',
          out_exams_note: '',
          file: {},
        })
      }
    } else {
      setIsSendFile(true)
      await postSaveExternalFile(body);

    }
  }

  const tableColumns = [
    {
      title: <Typography content="Ngày tạo" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'create_datetime',
      align: 'center',
      width: 160,
      render: (record: any) => (
        <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['13x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Tên hồ sơ" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'out_exams_title',
      align: 'center',
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['13x18', '400', 'center', 'uppercase']} />
      ),
    },
    {
      title: <Typography content="Mô tả" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'out_exams_note',
      align: 'center',
      render: (record: any) => (
        <Typography content={record || '---'} modifiers={['13x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Người tạo" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'create_employee',
      align: 'center',
      width: 260,
      render: (record: any) => (
        <Typography content={record?.name} modifiers={['14x20', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Chi tiết" modifiers={['12x18', '500', 'center']} />,
      dataIndex: 'task_status',
      align: 'center',
      width: 100,
      render: (record: any, data: any) => (
        <p
          style={{ width: '100%', display: 'flex', justifyContent: 'center ' }}
          onClick={() => {
            setPreview({
              ...preview, open: true, value: { original: data?.file?.path }
            })
          }}
        > <Icon iconName={'play'} isPointer /></p >
      ),
    },
  ];

  const TableExternalFile = useMemo(() => (
    <PublicTable
      listData={dataExternalFile?.data?.data}
      column={tableColumns}
      loading={pendingExternal}
    />
  ), [dataExternalFile?.data?.data, pendingExternal]);

  return (
    <div className='t-external_file'>
      <div className='t-external_file_header'>
        <PublicHeader
          titlePage=""
          className="t-external_file_header_wrap"
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          handleGetTypeSearch={() => { }}
          handleOnClickSearch={(data: string) => { }}
          isHideFilter
          isHideLibraly
          isHideSearch
          isDial={false}
          isHideCleanFilter
          isHideService
          isHideEmergency
          listBtn={
            (
              <>
                <Button className="m-form_note" modifiers={['primary']} onClick={() => setIsAddProfile(true)}>
                  <Typography type="span" modifiers={['400', '16x24']} content="Thêm hồ sơ" />
                </Button>
              </>
            )
          }
        />
      </div>
      <div className='t-external_file_content'>
        {TableExternalFile}
      </div>
      <CModal
        isOpen={isAddProfile}
        widths={500}
        onCancel={() => {
          setDataAddFile({
            ...dataAddFile,
            out_exams_title: '',
            out_exams_note: '',
            file: {},
          });
          setIsAddProfile(false);
        }}
        disableOk={isSendFile}
        onOk={() => {
          setIsAddProfile(false);
          handleAddExternalFile(dataAddFile);
        }}
      >
        <div className='t-external_file_form'>
          <Input
            label='Tên file'
            error={errors.out_exams_title}
            variant="border8"
            value={dataAddFile.out_exams_title}
            isRequired
            onChange={(e) => {
              setDataAddFile({ ...dataAddFile, out_exams_title: e.target.value })
              setErrors({ ...errors, out_exams_title: '' })
            }} />
          <TextArea
            id={''}
            readOnly={false}
            label='Mô tả'
            handleOnchange={(e) => {
              setDataAddFile({ ...dataAddFile, out_exams_note: e.target.value })
              setErrors({ ...errors, out_exams_title: '' })
            }}
            value={dataAddFile.out_exams_note}
          />
          <div className='t-external_file_form_btn'>
            <div className="m-editor_item">
              <label htmlFor="input_file" className="m-editor_item">
                <Typography content='Tải file' modifiers={['400', 'italic']} />
              </label>
              <input type="file" hidden id="input_file" onChange={(e: any) => {
                setDataAddFile({ ...dataAddFile, file: handleConverFileToBase64(e.target.files[0]) })
                setErrors({ ...errors, out_exams_title: '' })
              }} multiple accept="*" />
            </div>
            {
              (dataAddFile?.file as any)?.name && (<span className='t-external_file_form_btn_file'><Icon iconName='done_circle' />{(dataAddFile?.file as any)?.name}</span>)
            }
          </div>

        </div>
      </CModal>
      <ImagePreview
        isOpen={preview.open}
        handleClose={() => setPreview({
          ...preview, open: false
        })}
        options={[preview.value]} />
    </div>
  );
}

ExternalFile.defaultProps = {
};

export default ExternalFile;
