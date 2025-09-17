/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tooltip } from 'antd';
import Icon from 'components/atoms/Icon';
import Image from 'components/atoms/Image';
import Typography from 'components/atoms/Typography';
import ImagePreviewFullScreen from 'components/molecules/ImagePreviewFullScreen';
import RichTextEditor from 'components/molecules/RichTextEditor';
import useClickOutside from 'hooks/useClickOutside';
import _ from 'lodash';
import moment from 'moment';
import React, {
  useContext,
  useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { useAppSelector } from 'store/hooks';
import mapModifiers, { handleConvertToTimeZoneZ } from 'utils/functions';

interface BoxChatProps {
  isFocusEditor?: boolean;
  tagLength?: number;
}

const BoxChat: React.FC<BoxChatProps> = ({ isFocusEditor, tagLength }) => {

  const storeMessage = useAppSelector((state) => state.pancake.respMessage);
  const storePageActive = useAppSelector((state) => state.pancake.pageActive);
  const storeLoadingMessage = useAppSelector((state) => state.pancake.loadingMessage);
  const [commerceActice, setCommerceActice] = useState(0)
  const [statePageActive, setStatePageActive] = useState(storePageActive);
  const [stateMessage, setStateMessage] = useState(storeMessage);
  const [messageHover, setMessageHover] = useState('');
  const boxChatRef = useRef(null)
  const itemHoverRef = useRef(null)
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    setStatePageActive(storePageActive);
  }, [storePageActive])

  useEffect(() => {
    setStateMessage(storeMessage);
    scrollToBottom();
  }, [storeMessage, storeLoadingMessage])

  useEffect(() => {
    scrollToBottom();
  }, [storeMessage?.messages, storePageActive])

  useEffect(() => {
    const boxChat = (boxChatRef.current as any);
    const handleScroll = () => {
      if (boxChat) {
        const isAtBottom = boxChat.scrollTop + boxChat.clientHeight + 200 >= boxChat.scrollHeight;
        setIsScroll(!isAtBottom);
      }
    };

    if (boxChat) {
      boxChat.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (boxChat) {
        boxChat.removeEventListener('scroll', handleScroll);
      }
    };
  }, [storeMessage?.messages]);


  const scrollToBottom = () => {
    const boxChat = (boxChatRef.current as any);
    if (boxChat) {
      boxChat.scrollTo({
        top: Number(boxChat.scrollHeight + 500),
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={mapModifiers("t-boxchat", isFocusEditor && 'fit', isFocusEditor && Number(tagLength) > 10 && '2line', Number(tagLength) > 10 && 'overflow')} ref={boxChatRef}>
      <div className="t-boxchat_wrap">
        <div className="t-boxchat_activitie" >
          {stateMessage?.activities?.length ? stateMessage?.activities?.map((activitie, index: any) => (
            <div className={mapModifiers("t-boxchat_activitie_item", activitie.type === "OPEN_THREAD" ? 'hidden' : '')} key={index}>
              <RichTextEditor notuseHeader typeText='notHeadernotBordernotBG' data={activitie?.message?.replaceAll('\n\n', '<br/>')} isDisabled />
              <div className="t-boxchat_activitie_item_image">
                {activitie?.data?.length ? activitie?.data.map((image: any, idx: number) => (
                  <img src={image?.url} key={idx} loading="lazy" />
                )) : null}
              </div>
            </div>
          )) : null}
          {!_.isNull(stateMessage.post as any) && (
            <div>
              <div className="t-boxchat_activitie_post t-boxchat_activitie_item">
                <RichTextEditor notuseHeader typeText='notHeadernotBordernotBG' data={(stateMessage.post as any)?.message.replaceAll('\n\n', '<br/>')} isDisabled />
              </div>
              <div className="t-boxchat_activitie_by">
                Đăng bởi:&nbsp;
                <Typography content={(stateMessage.post as any)?.admin_creator?.name} />&nbsp;{(stateMessage.post as any)?.inserted_at && (
                  <span>{moment((stateMessage.post as any)?.inserted_at).format('HH:mm - DD-MM-YYYY')}</span>
                )}
                :&nbsp; <a onClick={() => { window.open((stateMessage.post as any)?.attachments?.target?.url) }} >{(stateMessage.post as any)?.attachments?.target?.url}</a>
              </div>
            </div>
          )}
        </div>
        {
          stateMessage?.messages?.length ? stateMessage?.messages?.map((message, index) => {
            return (
              <div key={message.id} className={mapModifiers('t-boxchat_chat_wrap', (statePageActive.id !== message.from.id) ? 'guest' : 'admin')}>
                {messageHover === message?.id && (statePageActive.id === message.from.id) && (
                  <div
                    className={mapModifiers('t-boxchat_chat_item_by')}
                    ref={messageHover === message?.id ? itemHoverRef : undefined as any}
                    style={statePageActive.id !== message.from.id ? { left: `- ${(itemHoverRef.current as any)?.offsetWeight}px` } : { right: `- ${(itemHoverRef.current as any)?.offsetWeight}px` }}
                  >
                    <div className={mapModifiers('t-boxchat_chat_item_by_name')}>
                      {(statePageActive.id !== message.from.id) ? message.from.name : (message.from.admin_name ? message.from.admin_name : 'Tin nhắn tự động')}
                    </div>
                    <div className={mapModifiers('t-boxchat_chat_item_by_date')}>
                      {moment(handleConvertToTimeZoneZ(message?.inserted_at)).format('DD-MM-YYYY - HH:mm')}
                    </div>
                  </div>

                )}
                <div key={message.id} className={mapModifiers('t-boxchat_chat_item',
                  (!message.attachments.length && !message?.original_message?.trim()) && 'empty')
                }
                  onMouseEnter={() => setMessageHover(message?.id)}
                  onMouseLeave={() => setMessageHover('')}
                >
                  {message.original_message && (
                    <RichTextEditor notuseHeader typeText='notHeadernotBordernotBG' data={message.message.replaceAll('<br/><br/>', '<br/>').replaceAll('\n', '<br/>')} isDisabled />
                  )}
                  <div className={mapModifiers('t-boxchat_chat_item_image')}>
                    {message.attachments.length ? message.attachments.map((image: any) => {
                      switch (image.type) {
                        case 'photo': return (
                          <ImagePreviewFullScreen urlImage={image?.url} widths={240} />
                        )
                        case 'sticker': return (
                          <img src={image?.url} key={image.id} style={{
                            width: 50,
                            height: 50,
                          }} loading="lazy" />
                        )
                        case 'ad_click': return (
                          <div className={mapModifiers('t-boxchat_chat_item_image', 'ad_click')}>
                            <RichTextEditor
                              notuseHeader
                              typeText='notHeadernotBordernotBG'
                              data={image.name.replaceAll('\n\n', '<br/>').replaceAll('\n', '<br/>')}
                              isDisabled
                            />
                            <ImagePreviewFullScreen urlImage={image?.ad_click_photo_url} widths={240} />
                          </div>
                        )
                        case 'commerce_product': return (
                          image?.products?.map((img: any, idx: any) => (
                            <div className={mapModifiers('t-boxchat_chat_item_image_commerce', commerceActice === idx ? 'active' : '')} key={idx}>
                              <img src={img?.image?.url} loading="lazy" />
                              <div className={mapModifiers('t-boxchat_chat_item_image_commerce_action', commerceActice === 0 ? 'start' : '', commerceActice === image?.products?.length ? 'end' : '')}>
                                {commerceActice !== 0 && (
                                  <Icon iconName="chevronLeft" isPointer onClick={() => {
                                    setCommerceActice((prev) => prev - 1)
                                  }} />
                                )}
                                {commerceActice < Number(image?.products?.length - 1) && (
                                  <Icon iconName="chevronRight" isPointer onClick={() => {
                                    if (commerceActice < Number(image?.products?.length - 1)) {
                                      setCommerceActice((prev) => prev + 1)
                                    }
                                  }} />
                                )}
                              </div>
                            </div>
                          ))
                        )
                        case 'template': return (
                          <div
                            className={mapModifiers('t-boxchat_chat_item_image_template')}
                            onClick={() => {
                              window.open(image?.url);
                            }}
                          >
                            {image?.payload?.elements?.length > 0 ?
                              <img src={image?.payload?.elements[0]?.image_url} loading="lazy" />
                              : null}
                            <h5>{image?.title}</h5>
                            {image?.payload?.elements?.length > 0 ?
                              <p>{image?.payload?.elements[0]?.subtitle}</p>
                              : null}
                          </div>
                        )
                        case 'attachment': return (
                          <div className={mapModifiers('t-boxchat_chat_item_image_attachment')}>
                            {image?.name}
                          </div>
                        )
                        case 'link': return (
                          <div className={mapModifiers('t-boxchat_chat_item_image_link')}>
                            <div className={mapModifiers('t-boxchat_chat_item_image_link_name')}>
                              <RichTextEditor
                                notuseHeader
                                typeText='notHeadernotBordernotBG'
                                data={image?.name.replaceAll('\n\n', '<br/>').replaceAll('\n', '<br/>')} isDisabled
                              />
                            </div>
                            <div className={mapModifiers('t-boxchat_chat_item_image_link_content')}>
                              {image?.post_attachments?.length ? image?.post_attachments?.map((y: any) => (
                                <img src={y?.url} key={y?.messageId} loading="lazy" />
                              )) : null}
                            </div>
                          </div>
                        )
                        case 'booking_request': return (
                          <ul className={mapModifiers('t-boxchat_chat_item_image_booking_request')} >
                            <li>Lên lịch hẹn: &nbsp;{image?.bookingReq?.rawData?.ls_xma_title}</li>
                            <li>Ngày lên lịch hẹn: &nbsp;{moment(image?.bookingReq?.rawData?.ls_xma_subtitle, "ddd, MMMM DD [lúc] HH:mm A (UTC)").format("DD-MM-YYYY HH:mm")}</li>
                            <li>Từ nguồn: &nbsp;{image?.bookingReq?.rawData?.native_component_flow_request?.page?.name}</li>
                          </ul>
                        )
                        default:
                          return (
                            <div
                              onClick={() => {
                                window.open(image?.file_url);
                              }}
                            >
                              <span style={{
                                color: '#1976D2',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                              }}>{image?.name}</span>
                            </div>
                          )
                      }
                    }) : null}
                  </div>
                </div>
                {messageHover === message?.id && (statePageActive.id !== message.from.id) && (
                  <div
                    className={mapModifiers('t-boxchat_chat_item_by')}
                    ref={messageHover === message?.id ? itemHoverRef : undefined as any}
                    style={statePageActive.id !== message.from.id ? { left: `- ${(itemHoverRef.current as any)?.offsetWeight}px` } : { right: `- ${(itemHoverRef.current as any)?.offsetWeight}px` }}
                  >
                    <div className={mapModifiers('t-boxchat_chat_item_by_name')}>
                      {(statePageActive.id !== message.from.id) ? message.from.name : (message.from.admin_name ? message.from.admin_name : 'Tin nhắn tự động')}
                    </div>
                    <div className={mapModifiers('t-boxchat_chat_item_by_date')}>
                      {moment(handleConvertToTimeZoneZ(message?.inserted_at)).format('DD-MM-YYYY - HH:mm')}
                    </div>
                  </div>
                )}
              </div>
            )
          }) : null
        }
        {isScroll && (
          <div
            className='t-boxchat_scroll'
            style={{
              top: (boxChatRef.current as any)?.offsetHeight + 110
            }}
            onClick={scrollToBottom}><Icon iconName='arrow_down' isPointer /></div>
        )}
      </div >
    </div >
  );
};

BoxChat.defaultProps = {
};

export default BoxChat;
