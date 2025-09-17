/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Switchs from 'components/atoms/Switchs';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import MultiSelect from 'components/molecules/MultiSelect';
import PublicTable from 'components/molecules/PublicTable';
import RichTextEditor from 'components/molecules/RichTextEditor';
import CModal from 'components/organisms/CModal';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { getDetailDocumentItem, postUserGuids } from 'services/api/afterexams';
import { detailUserGuidItem } from 'services/api/afterexams/types';
import { getDtailUserGuidById, getListUserGuidsCRM } from 'store/afterexams';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { handleRenderGUID } from 'utils/functions';

import PublicHeader from '../PublicHeader';


interface SupportLibrariesProps {
}

const SupportLibraries: React.FC<SupportLibrariesProps> = ({ }) => {
  const dispatch = useAppDispatch();

  const storeBeforeExams = useAppSelector((state) => state.afterExams.listUserGuids);
  const storeLoadingBeforeExams = useAppSelector((state) => state.afterExams.loadingListUserGuids);

  const [listConversation, setListConversation] = useState(storeBeforeExams.data);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [conversation, setConversation] = useState<detailUserGuidItem>({
    cs_guid_id: '',
    cs_guid_type: '',
    update_employee_id: '',
    update_employee_name: '',
    cs_guid_title: '',
    cs_guid_tags: '',
    cs_guid_content: '',
    tags: [],
    update_datetime: '',
    is_public: false,
  });

  const columnTable = [
    {
      title: <Typography content="Ngày cập nhật" modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: 'update_date',
      align: 'center',
      width: 140,
      render: (record: any) => (
        <Typography content={moment(record).format('HH:mm - DD/MM/YYYY')} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Người tạo" modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: 'update_employee_name',
      align: 'center',
      width: 200,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['14x20', '400', 'center']} />
      ),
    },
    {
      title: <Typography content={"Tên tin nhắn"} modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: 'cs_guid_title',
      align: 'center',
      render: (record: any) => (
        <Typography content={record} modifiers={['12x18', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Trạng thái" modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: 'is_public',
      align: 'center',
      width: 100,
      className: 't-support_libraries_content_action',
      render: (record: any, data: any) => (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Switchs checked={record} onChange={(checked: boolean, event: any) => {
            getDetailItemDocForUpdate(data.cs_guid_id)
          }} />
        </div>
      ),
    },
    {
      title: <Typography content="" modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: '',
      align: 'center',
      width: 60,
      className: 't-support_libraries_content_action',
      render: (record: any, data: any) => (
        <div
          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => {
            if (!data?.cs_guid_id) return;
            setIsUpdate(true);
            setIsOpenModal(true);
            getDetailItemDoc(data?.cs_guid_id);
            setConversation({
              ...conversation,
              cs_guid_title: data?.cs_guid_title,
              cs_guid_id: data.cs_guid_id,
              cs_guid_type: data.cs_guid_type,
              update_employee_id: data.update_employee_id,
              update_employee_name: data.update_employee_name,
              cs_guid_tags: data.cs_guid_tags,
              tags: data.tags,
              update_datetime: data.update_datetime,
              is_public: data.is_public,
            });
          }}
        >
          <Icon iconName="edit_crm" isPointer />
        </div>
      ),
    },
  ]
  const { mutate: getDetailItemDocForUpdate } = useMutation(
    "post-footer-form",
    (id: string) => getDetailDocumentItem(id),
    {
      onSuccess: (data) => {
        const body = {
          cs_guid_id: data.data.cs_guid_id,
          cs_guid_type: 'conversation',
          cs_guid_title: data.data.cs_guid_title,
          cs_guid_content: data.data.cs_guid_content,
          tags: data.data.tags,
          is_public: !data.data.is_public
        }
        postUpdateUserGuid(body);
      },
      onError: (e) => {
        console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
      },
    }
  );


  const { mutate: getDetailItemDoc } = useMutation(
    "post-footer-form",
    (id: string) => getDetailDocumentItem(id),
    {
      onSuccess: (data) => {
        setConversation({
          ...conversation,
          cs_guid_content: data.data.cs_guid_content,
        });
      },
      onError: (e) => {
        console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
      },
    }
  );

  useEffect(() => {
    setListConversation(storeBeforeExams.data);
  }, [storeBeforeExams.data])

  useEffect(() => {
    dispatch(getListUserGuidsCRM({
      cs_guid_type: "conversation",
      is_public: 'all'
    }));
  }, []);

  const { mutate: postUpdateUserGuid } = useMutation(
    'post-footer-form',
    (data: any) => postUserGuids(data),
    {
      onSuccess: (data) => {
        dispatch(getListUserGuidsCRM({
          cs_guid_type: "conversation",
          is_public: 'all'
        }));
        setConversation({
          ...conversation,
          cs_guid_id: '',
          cs_guid_type: '',
          update_employee_id: '',
          update_employee_name: '',
          cs_guid_title: '',
          cs_guid_tags: '',
          cs_guid_content: '',
          tags: [],
          update_datetime: '',
          is_public: false,
        })
        setIsOpenModal(false);
      },
      onError: (error) => {
        console.error('🚀: error --> getCustomerByCustomerId:', error);
      },
    },
  );

  const handleSubmit = () => {
    const body = {
      cs_guid_id: isUpdate ? conversation.cs_guid_id : handleRenderGUID(),
      cs_guid_type: 'conversation',
      cs_guid_title: conversation.cs_guid_title,
      cs_guid_content: conversation.cs_guid_content,
      tags: conversation.tags,
      is_public: conversation.is_public
    }
    postUpdateUserGuid(body);
  }

  const formUserGuid = useMemo(() => (
    <div className="t-support_libraries_form">
      <Input
        variant="simple"
        label={'Tên tin nhắn'}
        value={conversation?.cs_guid_title}
        onChange={(e) => {
          setConversation({
            ...conversation,
            cs_guid_title: e?.target?.value
          })
        }}
      />
      <div className="t-support_libraries_form_input">
        <Typography content="Nội dung" />
        <RichTextEditor
          data={conversation?.cs_guid_content}
          handleOnChange={(data: any) => {
            setConversation({
              ...conversation,
              cs_guid_content: data,
            })
          }}
        />
      </div>
      <MultiSelect
        lable='Tags'
        mode="tags"
        value={conversation?.tags}
        handleChange={(data: any) => {
          setConversation({
            ...conversation,
            tags: data,
          })
        }}
      />
      <Switchs
        label='Kích hoạt'
        checked={conversation?.is_public}
        onChange={(checked: boolean, event: any) => {
          setConversation({ ...conversation, is_public: checked })
        }} />
    </div>
  ), [conversation, isUpdate, isOpenModal])

  return (
    <div className="t-support_libraries">
      <PublicHeader
        titlePage=""
        className="t-support_libraries_header"
        handleFilter={() => { }}
        handleCleanFilter={() => { }}
        handleGetTypeSearch={() => { }}
        isHideLibraly
        isHideCleanFilter
        isHideSearch
        isHideFilter
        isHideService
        isHideEmergency
        isDial={false}
        listBtn={(
          <Button modifiers={['primary']} onClick={() => {
            setIsOpenModal(true);
            setIsUpdate(false);
            setConversation({
              ...conversation,
              cs_guid_id: '',
              cs_guid_type: '',
              update_employee_id: '',
              update_employee_name: '',
              cs_guid_title: '',
              cs_guid_tags: '',
              cs_guid_content: '',
              tags: [],
              update_datetime: '',
              is_public: false,
            })
          }} >
            <Typography content="Thêm mới" modifiers={['400']} />
          </Button>
        )}
      />
      <div className="t-support_libraries_content">
        <PublicTable
          listData={listConversation}
          column={columnTable}
          isPagination
          pageSizes={20}
          loading={storeLoadingBeforeExams}
          scroll={{
            y: '100vh - 220px'
          }}

          size="small"
          rowkey={'cs_guid_id'}
        />
      </div>
      <CModal
        isOpen={isOpenModal}
        onCancel={() => { setIsOpenModal(false); }}
        title={isUpdate ? 'Cập nhật tin nhắn nhanh' : 'Thêm mới tin nhắn nhanh'}
        widths={600}
        zIndex={100}
        onOk={handleSubmit}
        textCancel='Hủy'
        textOK='Lưu'
        className='t-support_libraries_modal'
      >
        {formUserGuid}
      </CModal >
    </div >
  );
}

// SupportLibraries.defaultProps = {
// };

export default SupportLibraries;
