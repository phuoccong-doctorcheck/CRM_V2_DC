/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import CTooltip from 'components/atoms/CTooltip';
import Icon, { IconName } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import CDrawer from 'components/organisms/CDrawer';
import ContactChannel from 'components/organisms/ContactChannel';
import InfoMessage from 'components/organisms/InfoMessage';
import ContentMessage from 'components/templates/ContentMessage';
import PublicLayout from 'components/templates/PublicLayout';
import SettingMultiChannel from 'components/templates/SettingMultiChannel';
import _ from 'lodash';
import React, { createContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { getCustomerById } from 'services/api/beforeExams';
import { RespMessage } from 'services/pancake/channel/types';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { InfoAds, getListConversationByPageId, getListTagOfPage, getMessageByCustomerId, postConversationActive, postMessageActive, postPageActive } from 'store/pancake';
import mapModifiers from 'utils/functions';

export const SearchContext = createContext({ isSearch: false });

const MultiChannel: React.FC = () => {
  const dispatch = useAppDispatch();

  const storeListPage = useAppSelector((state) => state.pancake.respListPage);
  const storeconversationActive = useAppSelector((state) => state.pancake.conversationActive);
  const storeMessage = useAppSelector((state) => state.pancake.respMessage);
  const storePageActive = useAppSelector((state) => state.pancake.pageActive);
  const storeLoadingConversation = useAppSelector((state) => state.pancake.loadingConversation);

  const [loadingConversation, setLoadingConversation] = useState(storeLoadingConversation);
  const [stateConversationActive, setStateConversationActive] = useState(storeconversationActive);
  const [stateListPage, setStateListPage] = useState(storeListPage);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [isSearchCustomer, setIsSearchCustomer] = useState(false);
  const [statePageActive, setStatePageActive] = useState(storePageActive);
  const [tagActive, setTagActive] = useState<any>()

  useEffect(() => {
    setStatePageActive(storePageActive);
  }, [storePageActive])

  useEffect(() => {
    setLoadingConversation(storeLoadingConversation);
  }, [storeLoadingConversation])

  useEffect(() => {
    setStateConversationActive(storeconversationActive);
  }, [storeconversationActive])

  const togglePauseCall = (value: boolean) => setIsSearchCustomer(value)

  const handleInit = () => new Promise((resolve, reject) => {
    try {
      if (_.isUndefined(statePageActive)) {
        dispatch(getListConversationByPageId({ pageId: (storeListPage?.categorized?.activated as any || [])[0]?.page_id, pageToken: (storeListPage?.categorized?.activated as any || [])[0]?.page_access_token }))
        dispatch(postPageActive((storeListPage?.categorized?.activated as any || [])[0] || undefined));
        dispatch(getListTagOfPage({ pageId: (storeListPage?.categorized?.activated as any || [])[0]?.page_id, pageToken: (storeListPage?.categorized?.activated as any || [])[0]?.page_access_token }))
      } else {
        dispatch(getListTagOfPage({ pageId: statePageActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
        dispatch(getListConversationByPageId({ pageId: statePageActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
      }
    } catch (err) {
      reject(err)
    }
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isSearchCustomer || !_.isNull(tagActive)) return;
      if (_.isUndefined(statePageActive)) {
        dispatch(getListConversationByPageId({ pageId: (storeListPage?.categorized?.activated as any || [])[0]?.page_id, pageToken: (storeListPage?.categorized?.activated as any || [])[0]?.page_access_token }))
        dispatch(postPageActive((storeListPage?.categorized?.activated as any || [])[0] || undefined));
        dispatch(getListTagOfPage({ pageId: (storeListPage?.categorized?.activated as any || [])[0]?.page_id, pageToken: (storeListPage?.categorized?.activated as any || [])[0]?.page_access_token }))
      } else {
        dispatch(getListTagOfPage({ pageId: statePageActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
        dispatch(getListConversationByPageId({ pageId: statePageActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
        if (!_.isUndefined(stateConversationActive)) {
          dispatch(getMessageByCustomerId({ pageId: statePageActive?.id, customerId: stateConversationActive?.customer_id, conversationId: stateConversationActive?.id, pageToken: statePageActive?.settings?.page_access_token }))
        }
      }
    }, 1000 * 5);

    return () => {
      clearInterval(intervalId);
    };
  }, [statePageActive, statePageActive?.id])

  useLayoutEffect(() => {
    document.title = "Tư vấn | CRM";
  }, [])

  useEffect(() => {
    setStateListPage(storeListPage);
    handleInit()
  }, [storeListPage.categorized?.activated])

  const handleGetMessageByConversationId = (data: any) => {
    dispatch(getMessageByCustomerId({ pageId: data?.pageId, customerId: data?.customerId, conversationId: data?.conversationId, pageToken: statePageActive?.settings?.page_access_token }))
  }

  const { mutate: getCustomerByPhone } = useMutation(
    'post-footer-form',
    (data: any) => getCustomerById(data),
    {
      onSuccess: (data) => {
        console.log("🚀 ~ file: index.tsx:95 ~ data:", data)
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const memoryContactChannel = useMemo(() => (
    <ContactChannel
      listPageOption={stateListPage}
      togglePauseCall={togglePauseCall}
      handleGetMessage={(data: any) => {
        handleGetMessageByConversationId(data);
      }}
      handleGetInfoConversation={(data: any) => {
        if (data?.recent_phone_numbers.length) {
          getCustomerByPhone({ type: 'phone', customer_id: data?.recent_phone_numbers[0]?.phone_number })
        }
      }}
      handleGetConversation={(data: any) => {
        dispatch(getListConversationByPageId({ pageId: data?.id, pageToken: data?.settings?.page_access_token }));
        dispatch(getListTagOfPage({ pageId: data?.id, pageToken: data?.settings?.page_access_token }));
        dispatch(postConversationActive(undefined as any));
        dispatch(postMessageActive(undefined as any));
      }}
      handleSetTagActive={(tag: any) => setTagActive(tag)}
      tagActive={tagActive}
    />
  ), [stateListPage.categorized?.activated, statePageActive, storeconversationActive])

  const memoryContentMessage = useMemo(() => (
    <ContentMessage />
  ), [storeMessage, storeMessage?.messages])

  const infoCustomer = useMemo(() => (
    <InfoMessage />
  ), [storeconversationActive, stateConversationActive?.recent_phone_numbers])

  return (
    <PublicLayout isShowPopupChat={false}>
      <div className={mapModifiers("p-channel")}>
        <div className={mapModifiers("p-channel_wrap")}>
          <div className={mapModifiers("p-channel_wrap_top")}>
            {stateListPage.categorized?.activated?.length ?
              stateListPage.categorized?.activated.map((item) => {
                return (
                  <CTooltip placements='bottom' title={item?.name} key={item?.id} colorCustom='#fff' overlayClassName='o-contact_channel_content_tag_customize'>
                    <div
                      onClick={() => {
                        dispatch(getListConversationByPageId({ pageId: item?.id, pageToken: item?.settings?.page_access_token }));
                        dispatch(getListTagOfPage({ pageId: item?.id, pageToken: item?.settings?.page_access_token }));
                        dispatch(postPageActive(item))
                        dispatch(postConversationActive(undefined as any));
                        dispatch(postMessageActive(undefined as any));
                      }}
                      className={mapModifiers("p-channel_wrap_top_page", statePageActive?.id === item?.id && 'active')}
                    >
                      <Icon iconName={`${['personal_zalo', 'zalo'].includes(item?.platform as any) ? 'zalo' : 'facebook'}_channel` as IconName} isPointer size="28x28" />
                      {
                        statePageActive?.id === item?.id &&
                        <Typography content={item?.name} />
                      }
                    </div>
                  </CTooltip>
                )
              })
              : null}
          </div>
          <div className={mapModifiers("p-channel_wrap_bottom")}>
            <div className="p-channel_contact">
              <SearchContext.Provider value={{ isSearch: isSearchCustomer }}>
                {memoryContactChannel}
              </SearchContext.Provider>
            </div>
            <div className="p-channel_message">
              <SearchContext.Provider value={{ isSearch: isSearchCustomer }}>
                {memoryContentMessage}
              </SearchContext.Provider>
            </div>
          </div>
        </div>
        <div className={mapModifiers('p-channel_info')}>
          {infoCustomer}
        </div>
      </div>
      <CDrawer
        positon="right"
        isOpen={isShowSetting}
        widths={700}
        handleOnClose={() => setIsShowSetting(false)}
      >
        <SettingMultiChannel />
      </CDrawer>
    </PublicLayout>
  );
};

export default MultiChannel;