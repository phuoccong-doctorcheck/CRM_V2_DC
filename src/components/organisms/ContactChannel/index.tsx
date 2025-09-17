/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Skeleton } from 'antd';
import CTooltip from 'components/atoms/CTooltip';
import Icon, { IconName } from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import _ from 'lodash';
import moment from 'moment';
import { SearchContext } from 'pages/MultiChannel';
import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { ListPages } from 'services/pancake/channel/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getListConversationByPageId, postConversationActive, postMessageActive, postPageActive } from 'store/pancake';
import mapModifiers from 'utils/functions';

interface ContactChannelProps {
  listPageOption: ListPages;
  handleGetMessage?: (data: any) => void;
  handleGetInfoConversation?: (data: any) => void;
  handleGetConversation?: (data: any) => void;
  handleSetTagActive?: (data: any) => void;
  handleSearch?: (data: boolean) => void;
  togglePauseCall?: (data: boolean) => void;
  tagActive?: any;
}

const ContactChannel: React.FC<ContactChannelProps> = ({
  listPageOption, handleGetMessage, handleSetTagActive, handleGetInfoConversation, togglePauseCall, tagActive
}) => {
  const dispatch = useAppDispatch();
  const sotreListPage = localStorage.getItem('listPage');
  const listPage = JSON.parse(sotreListPage ? sotreListPage : '');
  const { isSearch } = useContext(SearchContext);

  const storeConversation = useAppSelector((state) => state.pancake.respConversation);
  const storeLoadingConversation = useAppSelector((state) => state.pancake.loadingConversation);
  const storePageActives = useAppSelector((state) => state.pancake.pageActive);
  const storeTag = useAppSelector((state) => state.pancake.respTag);

  const [stateTag, setStateTag] = useState(storeTag);
  const [loadingConversation, setLoadingConversation] = useState(storeLoadingConversation);
  const [stateConversation, setStateConversation] = useState(storeConversation);
  const [pageActive, setPageActive] = useState(storePageActives || (listPageOption?.categorized?.activated_page_ids || [])[0]);
  const [conversationActive, setConversationActive] = useState('');
  const [valueSearchCs, setValueSearchCs] = useState('');
  const contactChannelRef = useRef(null);
  const [isOpenFilterTag, setIsOpenFilterTag] = useState(false);


  useEffect(() => {
    setPageActive(storePageActives);
  }, [storePageActives])

  useEffect(() => {
    setLoadingConversation(storeLoadingConversation);
  }, [storeLoadingConversation])

  useEffect(() => {
    if (isSearch) return;
    setStateConversation(storeConversation);
  }, [storeConversation.conversations])

  useEffect(() => {
    setStateTag(storeTag);
  }, [storeTag])

  const handleGetCustomer = () => {
    const findCS = storeConversation.conversations.filter((i) => i.from.name?.toLocaleLowerCase().search(valueSearchCs.toLocaleLowerCase()) !== -1)
    const newData = {
      conversations: [
        ...findCS
      ]
    }
    if (togglePauseCall) {
      togglePauseCall(true);
    }
    if (findCS.length) {
      setStateConversation(newData as any)
    }
  }

  return (
    <div className="o-contact_channel">
      <div className="o-contact_channel_wrap">
        <div className="o-contact_channel_content">
          <div className={mapModifiers('o-contact_channel_content_tag')} >
            <div className='o-contact_channel_content_tag-button' onClick={() => setIsOpenFilterTag(!isOpenFilterTag)}>
              <Icon iconName='filter_chat' />Lọc theo tag
            </div>
            {isOpenFilterTag && <div className='o-contact_channel_content_tag-open' >
              {stateTag?.tags?.length ? stateTag?.tags?.map((tag) => (
                <div className='o-contact_channel_content_tag_item' key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }} onClick={() => {
                  dispatch(getListConversationByPageId({ pageId: pageActive?.id, pageToken: pageActive?.settings?.page_access_token, tag: `${tag.id}` }))
                  if (handleSetTagActive)
                    handleSetTagActive(tag?.id)
                }}>
                  <p style={{ backgroundColor: tagActive === tag?.id ? tag.color : tag.lighten_color }} />
                  <span>{tag.text}</span>
                </div>
              )) : null}
              <CTooltip title="Tất cả" placements='top' colorCustom={'#fff'} overlayClassName='o-contact_channel_content_tag_customize'  >
                <p
                  className='o-contact_channel_content_tag_item'
                  style={{
                    border: '2px solid #27ACFD',
                    color: '#000',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                  onClick={() => {
                    dispatch(getListConversationByPageId({ pageId: pageActive?.id, pageToken: pageActive?.settings?.page_access_token, tag: `` }))
                    setIsOpenFilterTag(false)
                    if (handleSetTagActive)
                      handleSetTagActive(null)
                  }}
                >X</p>
              </CTooltip>
            </div>}
          </div>
          <div className="o-contact_channel_content_search">
            <Input
              variant="simple"
              iconName={isSearch ? 'close' : 'search'}
              value={valueSearchCs}
              handleClickIcon={() => {
                if (isSearch && togglePauseCall) {
                  togglePauseCall(false);
                  setValueSearchCs('')
                  setStateConversation(storeConversation);
                } else {
                  handleGetCustomer()
                }
              }}
              handleEnter={() => {
                if (togglePauseCall) togglePauseCall(true);
                handleGetCustomer()
              }}
              onChange={(event) => setValueSearchCs(event.target.value)}
            />
          </div>
          <ul className="o-contact_channel_conversation" ref={contactChannelRef}>
            {stateConversation?.conversations?.length ?
              stateConversation?.conversations?.map((conversation) => (
                <div
                  key={conversation?.id}
                  className={mapModifiers("o-contact_channel_conversation_item", conversation.seen ? 'seen' : 'new', conversationActive === conversation.id ? 'active' : '')}
                  onClick={() => {
                    if (handleGetMessage && conversationActive !== conversation.id) {
                      handleGetMessage({ customerId: conversation.customer_id, conversationId: conversation.id, pageId: conversation.page_id });
                      setConversationActive(conversation.id);
                      dispatch(postConversationActive(conversation as any));
                      dispatch(postMessageActive(undefined as any));
                    }
                    if (handleGetInfoConversation) handleGetInfoConversation(conversation);
                  }}
                >
                  <div className='o-contact_channel_conversation_item_customer'>
                    <div className='o-contact_channel_conversation_item_customer_name'>
                      {conversation?.customers?.map((customer, index) => {
                        return (
                          <div key={index}>
                            <Typography type='h4' content={customer?.name} />{conversation?.customers?.length > 1 && index !== Number(conversation?.customers?.length - 1) && ','}
                          </div>
                        )
                      })}
                    </div>
                    <span>{moment.utc(conversation?.updated_at).utcOffset('+07:00').format('MM/DD HH:mm')}</span>
                  </div>
                  <div className='o-contact_channel_conversation_item_snippet'>
                    <span style={{ fontWeight: 700 }}>{(conversation?.last_sent_by?.admin_id || conversation?.last_sent_by?.name?.includes('Doctor Check')) ? 'Bạn:' : 'Khách:'}&nbsp;</span>{conversation?.snippet}
                  </div >
                  <div className='o-contact_channel_conversation_item_origin'>
                    <span>{listPage.find((item: any) => item?.page_id === conversation?.page_id)?.name}</span>
                  </div>
                  <div className='o-contact_channel_conversation_item_bottom'>
                    <div className='o-contact_channel_conversation_item_tag'>
                      {conversation?.tags?.length ?
                        (conversation?.tags.slice(0, 3))?.map((tag, index) => {
                          if (_.isNull(tag)) return;
                          return (
                            <span
                              key={tag?.id}
                              style={{
                                backgroundColor: tag?.color
                              }}
                            >{tag?.text}</span>
                          )
                        }).filter(Boolean) : null}

                      {conversation?.tags?.length > 3 && (
                        <CTooltip
                          placements={'top'}
                          colorCustom='#fff'
                          overlayClassName='o-contact_channel_conversation_item_tag_tooltip'
                          title={(conversation?.tags.slice(3, Number(conversation?.tags?.length)))?.map((tag, index) => {
                            if (_.isNull(tag)) return;
                            return (
                              <span
                                key={tag?.id}
                                style={{
                                  backgroundColor: tag?.color
                                }}
                              >{tag?.text}</span>
                            )
                          }).filter(Boolean)}>
                          <span
                            style={{ color: '#000' }}
                          >
                            +{Number(conversation?.tags?.length - 3)}
                          </span>
                        </CTooltip>
                      )}
                    </div>
                    <div className='o-contact_channel_conversation_item_icon'>
                      {conversation?.has_phone && (
                        <Icon iconName='has_phone_channel' size='16x16' />
                      )}
                      {conversation?.type === 'INBOX' && (
                        <Icon iconName='messages_channel' size="20x20" />
                      )}
                      {conversation?.type === 'COMMENT' && (
                        <Icon iconName='comment_channel' size='18x18' />
                      )}
                    </div>
                  </div>
                  {
                    !conversation.seen && (
                      <p className='o-contact_channel_conversation_item_new'>
                        Mới
                      </p>
                    )
                  }
                </div >
              ))
              : <div style={{ marginTop: 20 }}>
                <Typography content="Không tìm thấy tin nhắn" modifiers={['400', 'center', 'cg-red', 'italic']} />
              </div>}
          </ul >
        </div >
      </div >
    </div >
  );
};

ContactChannel.defaultProps = {
};

export default ContactChannel;
