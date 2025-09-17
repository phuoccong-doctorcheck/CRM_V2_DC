import Dropdown, { DropdownData } from "components/atoms/Dropdown";
import Icon from "components/atoms/Icon";
import Input from "components/atoms/Input";
import Switchs from "components/atoms/Switchs";
import { TransferType } from "components/atoms/Transfer";
import Typography from "components/atoms/Typography";
import PublicTable from "components/molecules/PublicTable";
import CModal from "components/organisms/CModal";
import { Plus, } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ChromePicker } from 'react-color';
import { useMutation } from "react-query";
import { tagItems } from "services/api/afterexams/types";
import { postAddTagsAPI, postHideShowTagsAPI } from "services/api/tags";
import { getListResourceCRM } from "store/home";
import { useAppDispatch } from "store/hooks";






const ManageTags = () => {
   const dispatch = useAppDispatch();
  const storageTags = localStorage.getItem('tagsCustomer');
  const storageTagsType = localStorage.getItem('tagstype');
  const [tags, setTags] = useState<[TransferType]>(storageTags ? JSON.parse(storageTags || '') : undefined as any)
  const [tagsType, ] = useState<[]>(storageTagsType ? JSON.parse(storageTagsType || '') : undefined as any)
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(storageTags)
  useEffect(() => {
    const interval = setInterval(() => {
      const newTags = localStorage.getItem('tagsCustomer');
      if (newTags) {
        const parsedTags = JSON.parse(newTags);
        // So sánh nếu khác thì mới set lại để tránh render không cần thiết
        setTags((prev) => {
          const prevString = JSON.stringify(prev);
          const newString = JSON.stringify(parsedTags);
          if (prevString !== newString) {
            return parsedTags;
          }
          return prev;
        });
      }
    }, 1000); // Kiểm tra mỗi 1 giây
  
    return () => clearInterval(interval); // clear khi component unmount
  }, []);

  // Form states


 
    const [isUpdate, setIsUpdate] = useState(false);

    const [conversation, setConversation] = useState<tagItems>({
      tag_id: 0,
      tag_name: '',
      tag_type: undefined as unknown as DropdownData,
      tag_color: '',
      pancake_tag_id: '',
      is_show: true,
    });
    const { mutate: postAddTags } = useMutation(
      "post-footer-form",
      (id: any) => postAddTagsAPI(id),
      {
        onSuccess: (data) => {
          dispatch(getListResourceCRM());
          setConversation({
            tag_id: 0,
            tag_name: '',
            tag_type: undefined as unknown as DropdownData,
            tag_color: '',
            pancake_tag_id: '', 
            is_show: true,
          });
          setIsOpenModal(false);
          setIsLoading(false);
        },
        onError: (e) => {
          console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
        },
      }
    );
    const handleSubmit = () => {
      setIsLoading(true);
      const body = {
        tag_id: conversation.tag_id,
        tag_name: conversation.tag_name,
        tag_type: conversation.tag_type?.value || conversation.tag_type,
        tag_color: conversation.tag_color,
        pancake_tag_id: conversation.pancake_tag_id,
        is_show: conversation.is_show,
      };
      postAddTags(body)
  }
  const formUserGuid = useMemo(() => (
    <div className="t-support_libraries_form">
      <Input
        variant="simple"
        label={'Tên tag'}
        value={conversation?.tag_name}
        onChange={(e) => {
          setConversation({
            ...conversation,
            tag_name: e?.target?.value
          })
        }}
      />
      <div className="t-support_libraries_form_input">
      <Input
        variant="simple"
        label={'ID Pancake'}
        value={conversation?.pancake_tag_id}
        onChange={(e) => {
          setConversation({
            ...conversation,
            tag_name: e?.target?.value
          })
        }}
      />
      </div>
      <Dropdown
                    dropdownOption={tagsType}
        variant="simple"
        label={'Loại tag'}
                     values={conversation.tag_type}
                     handleSelect={(item) => {
                      setConversation({
                        ...conversation,
                        tag_type:item
                      })
                     }}
      />
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <ChromePicker
        
        color={conversation?.tag_color || '#fff'}
        onChange={(newColor: any) => {
          setConversation({
            ...conversation,
            tag_color: newColor.hex
          })
        }}
      />
      </div>
      <Switchs
        label='Kích hoạt'
        checked={conversation?.is_show}
        onChange={(checked: boolean, event: any) => {
          setConversation({ ...conversation, is_show: checked })
        }} 
        />
    </div>
  ), [conversation, isUpdate, isOpenModal])

   const { mutate: postHideShowTags } = useMutation(
      "post-footer-form",
      (id: any) => postHideShowTagsAPI(id),
      {
        onSuccess: (data) => {
          dispatch(getListResourceCRM());
         
        },
        onError: (e) => {
          console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
        },
      }
    );
   const columnTable = [
    
      {
        title: <Typography content="Tên Tag" modifiers={['14x20', '500', 'center', 'capitalize']} />,
        dataIndex: 'tag_name',
        align: 'center',
        width: 300,
        render: (record: any, data: any) => (
          <Typography content={record} modifiers={['14x20', '400', 'center']} />
        ),
      },
      {
        title: <Typography content={"Loại Tag"} modifiers={['14x20', '500', 'center', 'capitalize']} />,
        dataIndex: 'tag_type',
        align: 'center', width: 200,
        render: (record: any) => (
          <Typography content={record} modifiers={['12x18', '400', 'center']} />
        ),
     },
     {
      title: <Typography content={"Mã màu"} modifiers={['14x20', '500', 'center', 'capitalize']} />,
      dataIndex: 'tag_color',
       align: 'center',
       width: 200,
      render: (record: any) => (
        <Typography content={record} modifiers={['12x18', '400', 'center']} />
      ),
    },
      {
        title: <Typography content="Trạng thái" modifiers={['14x20', '500', 'center', 'capitalize']} />,
        dataIndex: 'is_show',
        align: 'center',
        width: 100,
        className: 't-support_libraries_content_action',
        render: (record: any, data: any) => (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Switchs
              checked={record}
              onChange={(checked: boolean, event: any) => {
                // 1. Cập nhật UI ngay
                setTags((prevTags) => {
                  const updated = prevTags?.map((tag) => {
                    if (tag.tag_id === data.tag_id) {
                      return { ...tag, is_show: checked };
                    }
                    return tag;
                  });
                  // Cập nhật lại localStorage nếu cần
                  localStorage.setItem('tagsCustomer', JSON.stringify(updated));
                  return updated as [TransferType]; // đảm bảo kiểu
                });
              
                // 2. Gửi API bất đồng bộ
                postHideShowTags(
                  {
                    tag_id: data.tag_id,
                    is_show: checked,
                  },
                  {
                    // rollback nếu lỗi
                    onError: () => {
                      setTags((prevTags) => {
                        const rolledBack = prevTags?.map((tag) => {
                          if (tag.tag_id === data.tag_id) {
                            return { ...tag, is_show: !checked };
                          }
                          return tag;
                        });
                        localStorage.setItem('tagsCustomer', JSON.stringify(rolledBack));
                        return rolledBack as [TransferType];
                      });
                    },
                  }
                );
              }}
              
            />
          </div>
        )
        
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
            onClick={() => {console.log(data.tag_type)
              setConversation({
                tag_id: data.tag_id,
                tag_name: data.tag_name,
                tag_type: data.tag_type,
                tag_color: data.tag_color,
                pancake_tag_id: data.pancake_tag_id,
                is_show: data.is_show,
              });
              setIsUpdate(true);
              setIsOpenModal(true);
           }}
          >
            <Icon iconName="edit_crm" isPointer />
          </div>
        ),
      },
    ]
    const tableTags = useMemo(() => {
      return (
        <PublicTable
          listData={tags}
          column={columnTable}
          isPagination
          pageSizes={20}
          loading={false}
          scroll={{
            y: '100vh - 220px'
          }}
          size="small"
          rowkey={'cs_guid_id'}
        />
      );
    }, [tags]);
    
  return (
    <div role="tabpanel" aria-labelledby="tags-tab">
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Quản lý Tags</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Thêm mới và chỉnh sửa các tag trong hệ thống</p>
          </div>
          <button
            onClick={() => setIsOpenModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer"
            }}
          >
            <Plus size={16} style={{ marginRight: 6 }} />
            Thêm tag
          </button>
        </div>

     <div className="t-support_libraries_content">
            {tableTags}
           </div>
      </div>
        <CModal
        isOpen={isOpenModal}
        confirmLoading={isLoading}
              onCancel={() => { setIsOpenModal(false); }}
              title={isUpdate ? 'Cập nhật tag' : 'Thêm mới tag'}
              widths={600}
              zIndex={100}
              onOk={handleSubmit}
              textCancel='Hủy'
              textOK={isUpdate ? 'Cập nhật' : 'Thêm mới'}
              className='t-support_libraries_modal'
            >
              {formUserGuid}
            </CModal >
    </div>
  );
};

export default ManageTags;
