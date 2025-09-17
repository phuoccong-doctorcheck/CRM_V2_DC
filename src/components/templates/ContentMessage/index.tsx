/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Icon, { IconName } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import EditorChat from 'components/molecules/EditorChat';
import _, { reject } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postMessageByConversationId, postTagByConversationId } from 'services/pancake/channel';
import { RespMessage } from 'services/pancake/channel/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { InfoAds, getListConversationByPageId, getMessageByCustomerId, postConversationActive, postSetInfoAdsMessageItem } from 'store/pancake';
import mapModifiers from 'utils/functions';

import BoxChat from '../BoxChat';

interface ContentMessageProps {
}

const ContentMessage: React.FC<ContentMessageProps> = ({ }) => {
  const dispatch = useAppDispatch();

  const listPage = JSON.parse(localStorage.getItem('listPage') || '');

  const storeMessage = useAppSelector((state) => state.pancake.respMessage);
  const storeLoadingMessage = useAppSelector((state) => state.pancake.loadingMessage);
  const storeCsActive = useAppSelector((state) => state.pancake.conversationActive);
  const storeTag = useAppSelector((state) => state.pancake.respTag);
  const storePageActive = useAppSelector((state) => state.pancake.pageActive);
  const [statePageActive, setStatePageActive] = useState(storePageActive);

  const [stateTag, setStateTag] = useState(storeTag);
  const [stateCsActive, setStateCsActive] = useState(storeCsActive);
  const [stateMessage, setStateMessage] = useState<any>(storeMessage);
  const [stateLoadingMessage, setStateLoadingMessage] = useState<boolean>(storeLoadingMessage);
  const [isFocusEditor, setIsFocusEditor] = useState(false);
  const [stateBreakPoint, setstateBreakPoint] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setstateBreakPoint(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setStateLoadingMessage(storeLoadingMessage)
  }, [storeLoadingMessage])

  useEffect(() => {
    setStateCsActive(storeCsActive)
  }, [storeCsActive])

  useEffect(() => {
    setStatePageActive(storePageActive)
  }, [storePageActive])

  useEffect(() => {
    setStateMessage(storeMessage)
    handleGetInfoAdsCustomer(storeMessage);
  }, [storeMessage])

  useEffect(() => {
    setStateTag(storeTag)
  }, [storeTag.tags])

  // dispatch(postSetInfoAdsMessageItem())
  const handleGetInfoAdsCustomer = async (data: RespMessage) => {
    if (data?.activities?.length) {
      data?.activities.map((item) => {
        switch (item?.type) {
          case 'OPEN_THREAD':
            dispatch(postSetInfoAdsMessageItem({
              id_ads: item?.ads_context_data.post_id,
              title_ads: item?.ads_context_data.ad_title,
              image_ads: item?.ads_context_data.video_url,
            }));
            break;
          default:
            dispatch(postSetInfoAdsMessageItem({
              id_ads: `${item.post_id}`.split('_')[1],
              title_ads: item?.message,
              image_ads: item?.attachments?.target?.url,
            }));
            break;
        }
      })
    }
  }

  const { mutate: postTagConversation } = useMutation(
    'post-footer-form',
    (data: any) => postTagByConversationId(data),
    {
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error('Cập nhật tag thất bại')
        } else {
          dispatch(getListConversationByPageId({ pageId: stateCsActive?.page_id, pageToken: listPage ? listPage.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token : JSON.parse(localStorage.getItem('listPage') || '')?.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token, }))
          const newListTag = data.data.map((id: string) => (stateTag.tags || [])?.find((tag: any) => tag?.id === id))
          const newData = { ...stateCsActive, tags: newListTag }
          dispatch(postConversationActive(newData as any));
        }
      },
      onError: (error) => {
        console.error('🚀: error --> getCustomerByCustomerId:', error);
      },
    },
  );

  const { mutate: postMessage } = useMutation(
    'post-footer-form',
    (data: any) => postMessageByConversationId(data),
    {
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error('Gửi tin nhắn thất bại')
        } else {
          dispatch(getMessageByCustomerId({ pageId: stateCsActive?.page_id, customerId: stateCsActive?.customer_id, conversationId: stateCsActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
          dispatch(getListConversationByPageId({ pageId: stateCsActive?.page_id, pageToken: listPage ? listPage.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token : JSON.parse(localStorage.getItem('listPage') || '')?.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token, }))
        }
      },
      onError: (error) => {
        console.error('🚀: error --> getCustomerByCustomerId:', error);
      },
    },
  );

  const handleUpdateTag = (tag_id: string) => {
    return new Promise((reject, resolve) => {
      try {
        postTagConversation({
          pageId: stateCsActive?.page_id,
          conversationId: stateCsActive?.id,
          pageToken: listPage ? listPage.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token : JSON.parse(localStorage.getItem('listPage') || '')?.find((i: any) => i?.page_id === stateCsActive?.page_id)?.page_access_token,
          body: {
            action: stateCsActive?.tags.some((tag) => tag?.id == Number(tag_id)) ? 'remove' : 'add',
            tag_id: tag_id,
          }
        })
        resolve(true);
      } catch (e) {
        reject(e)
      }
    })
  }

  const handlePostMessage = (data: any) => {
    const body = {
      pageId: stateCsActive?.page_id,
      conversationId: stateCsActive?.id,
      body: { ...data }
    }
    postMessage(body)
  }



  return (
    <div className="t-content_message">
      <div className="t-content_message_header">
        <div className="t-content_message_header_left">
          <div className="t-content_message_header_left_title">
            <Typography content={!_.isUndefined(stateMessage?.customers) && (stateMessage?.customers[0] || [])?.name} />
            {!_.isUndefined(stateMessage?.customers) && (stateMessage?.customers[0] || [])?.tags?.length ? stateMessage?.customers[0]?.tags.map((tag: string, index: number) => (
              <span key={index}>{tag}</span>
            )) : null}
          </div>
        </div>
        <div className="t-content_message_header_right">
        </div>
      </div>
      <div className="t-content_message_main">
        {_.isUndefined(stateMessage) ? (<>
          {stateLoadingMessage
            ? (
              <div style={{
                height: stateBreakPoint > 1280 ? 'calc(100vh - 307px)' : 'calc(100vh - 295px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Loading variant="max_content" />
              </div>
            )
            : (
              <div style={{
                height: stateBreakPoint > 1280 ? 'calc(100vh - 307px)' : 'calc(100vh - 295px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <h2 style={{ color: '#919191', fontWeight: 400, fontStyle: 'italic' }}>Xin chọn 1 hội thoại từ danh sách bên trái</h2>
              </div>
            )}
        </>) : (
          <BoxChat isFocusEditor={isFocusEditor} tagLength={stateTag?.tags?.length} />)
        }
        <div className={mapModifiers("t-content_message_tag", stateTag?.tags?.length > 10 && 'overflow')} style={{ gridTemplateColumns: `repeat(${stateTag?.tags?.length > 10 ? Number(stateTag?.tags?.length / 2) : stateTag?.tags?.length},1fr)` }}>
          {stateTag?.tags?.length ? stateTag?.tags?.map((tag) => (
            <p
              className={mapModifiers('t-content_message_tag_item', stateCsActive?.tags?.some((item: any) => item?.id === tag.id) ? 'active' : '')}
              style={{
                backgroundColor: stateCsActive?.tags?.some((item: any) => item?.id === tag.id) ? tag.color : tag.lighten_color,
                color: stateCsActive?.tags?.some((item: any) => item?.id === tag.id) ? '#fff' : '#000',
                opacity: stateCsActive?.tags?.some((item: any) => item?.id === tag.id) ? 1 : 0.6,
              }}
              key={tag.id}
              onClick={() => {
                handleUpdateTag(tag.id.toString())
              }}
            >
              {tag.text}
            </p>
          )) : null}
        </div>
        <div className={mapModifiers("t-content_message_main_editor", stateTag?.tags?.length > 10 && 'overflow')}>
          <EditorChat
            handlePostMessage={handlePostMessage}
            isFocusEditor={isFocusEditor}
            handleBlur={() => setIsFocusEditor(false)}
            handleFocus={() => setIsFocusEditor(true)}
          />
        </div>
      </div>
    </div >
  );
};

ContentMessage.defaultProps = {
};

export default ContentMessage;
