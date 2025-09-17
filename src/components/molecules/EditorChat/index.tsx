/* eslint-disable react/style-prop-object */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Tooltip } from "antd";
import { OptionMediaType } from "assets/data";
import GroupRadio, { GroupRadioType } from "components/atoms/GroupRadio";
import Icon, { IconName } from "components/atoms/Icon";
import Input from "components/atoms/Input";
import TextArea from "components/atoms/TextArea";
import Typography from "components/atoms/Typography";
import CPopover from "components/organisms/CPopover";
import Gallery from "components/templates/Gallery";
import { EmojiClickData } from "emoji-picker-react";
import useClickOutside from "hooks/useClickOutside";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { getUserGuidsDetail } from "services/api/afterexams";
import { getListUserGuidsCRM } from "store/afterexams";
import { useAppDispatch, useAppSelector } from "store/hooks";
import mapModifiers from "utils/functions";

import CEmojiPicker from "../CEmojiPicker";

interface EditorChatProps {
  handlePostMessage?: (data: any) => void;
  isFocusEditor?: boolean;
  handleFocus?: () => void;
  handleBlur?: () => void;
}

const EditorChat: React.FC<EditorChatProps> = ({ handlePostMessage, isFocusEditor, handleFocus, handleBlur }) => {
  const dispatch = useAppDispatch();
  const storeListQuitChat = useAppSelector((state) => state.afterExams.listUserGuids);

  const [listQuitChat, setListQuitChat] = useState(storeListQuitChat.data);
  const [contentChat, setContentChat] = useState("");
  const [valueSearchTemplate, setValueSearchTemplate] = useState("");
  const [isOpenTemplate, setIsOpenTemplate] = useState(false);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [media, setMedia] = useState({
    type: undefined as unknown as GroupRadioType,
    value: '',
  });
  const emojiRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef(null);

  useClickOutside(emojiRef, () => {
    if (isShowEmoji) {
      setIsShowEmoji(false);
    }
  });


  const listButtonActions = [
    {
      id: 2,
      icon: "attachment",
      type: "attachment",
      text: "Bộ câu trả lời sẵn",
      handle: () => {
      },
    },
    {
      id: 2,
      icon: "template_message",
      type: "template",
      text: "Bộ câu trả lời sẵn",
      handle: () => {
        setListQuitChat(storeListQuitChat?.data);
        setValueSearchTemplate('');
      },
    },
  ];

  const { mutate: getDtailUserGuidById } = useMutation(
    "post-footer-form",
    (data: any) => getUserGuidsDetail(data),
    {
      onSuccess: (data) => {
        setContentChat(data?.data?.cs_guid_content.replaceAll('<br>', '\n').replaceAll('<p>', '').replaceAll('</p>', ''));
      },
      onError: (error) => {
        console.log("🚀: error --> getCustomerByCustomerId:", error);
      },
    }
  );

  const handleSendMessage = () => {
    // if (!contentChat.trim()) return;
    const body = {
      action: "reply_inbox",
      message: contentChat,
    };

    const bodyImage = {
      action: "reply_inbox",
      content_url: media?.value,
    };

    return new Promise((resolve, reject) => {
      try {
        if (handlePostMessage && !media?.value?.trim() && _.isUndefined(media?.type)) {
          handlePostMessage(body);
        }
        if (handlePostMessage && !!media?.value?.trim() && !_.isUndefined(media?.type)) {
          handlePostMessage(body);
          handlePostMessage(bodyImage);
        }

        setContentChat("");
        setMedia({ value: '', type: undefined as any })
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleClickEmoji = (item: EmojiClickData) => {
    const { selectionStart, selectionEnd } = (textAreaRef.current as any)?.resizableTextArea?.textArea as any;
    const newText = contentChat.substring(0, selectionStart) + item.emoji + contentChat.substring(selectionEnd);
    setContentChat(newText);
  }

  const handleSearchTemplate = () => {
    const newList = storeListQuitChat?.data?.filter((item) => item.cs_guid_title.toLowerCase().search(valueSearchTemplate.toLowerCase()) !== -1);
    if (!valueSearchTemplate.trim()) {
      setListQuitChat(storeListQuitChat?.data);
    } else {
      setListQuitChat(newList);
    }
  }

  useEffect(() => {
    dispatch(
      getListUserGuidsCRM({ cs_guid_type: "conversation", is_public: true })
    );
  }, []);

  useEffect(() => {
    setListQuitChat(storeListQuitChat?.data);
  }, [storeListQuitChat?.data]);


  return (
    <div className={mapModifiers("m-editor_chat", isFocusEditor ? 'fit' : '')}>
      <div className="m-editor_chat_input_emoji" ref={emojiRef}>
        <TextArea
          id="text_editor"
          variant="simple"
          value={contentChat}
          textAreaRef={textAreaRef}
          iconName="emoji_smile"
          placeholder="Nhập nội dung tin nhắn..."
          readOnly={false}
          iconSize="20x20"
          handleOnchange={(e) => {
            setContentChat(e.target.value);
          }}
          handleClickIcon={() => {
            setIsShowEmoji(true);
          }}
          onKeyDown={(events: any) => {
            if (
              events.key === "Enter" &&
              !events.altKey &&
              !events.ctrlKey &&
              !events.shiftKey
            ) {
              events.preventDefault();
              return handleSendMessage();
            }
            if (
              events.key === "Enter" &&
              events.altKey &&
              !events.ctrlKey &&
              !events.shiftKey
            ) {
              events.preventDefault();
              const { selectionStart, selectionEnd } = (textAreaRef.current as any)?.resizableTextArea?.textArea as any;
              const newText = contentChat.substring(0, selectionStart) + "\n" + contentChat.substring(selectionEnd);
              setContentChat(newText);
              (textAreaRef.current as any).selectionStart = selectionStart;
              (textAreaRef.current as any).selectionEnd = selectionStart;


            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isShowEmoji && <CEmojiPicker handleClickEmoji={handleClickEmoji} />}
      </div>
      <div className="m-editor_chat_input_btn">
        <div className="m-editor_chat_input_btn_action">
          {listButtonActions.map((action, index) => {
            switch (action?.type) {
              case "template":
                return (
                  <CPopover
                    key={index}
                    title="Trả lời nhanh"
                    className="m-editor_chat_input_btn_quit_chat"
                    style="padding"
                    placement="topRight"
                    isSearch
                    valueSearch={valueSearchTemplate}
                    handleOnChangeSearch={(value) => setValueSearchTemplate(value)}
                    handleSearch={handleSearchTemplate}
                    content={(
                      (listQuitChat as any)?.length
                        ? (listQuitChat as any)?.map((user: any) => (
                          <div
                            className="m-editor_chat_input_btn_quit_chat_item"
                            key={user?.cs_guid_id}
                            onClick={() => {
                              getDtailUserGuidById(user.cs_guid_id);
                            }}
                          >
                            <span>
                              {user?.cs_guid_title}
                            </span>
                          </div>
                        ))
                        : (<div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography content="Không tìm thấy tin nhắn nhanh" modifiers={['400', 'cg-red', 'italic']} />
                        </div>)
                    )}
                  >
                    <div className="m-editor_item">
                      <Icon
                        iconName={action.icon as IconName}
                        size="25x25"
                        isPointer
                        onClick={action.handle}
                      />
                    </div>
                  </CPopover>
                );
              case "attachment":
                return (
                  <Tooltip title={action.text} placement="top" key={action.id}>
                    <CPopover
                      title="Bộ sưu tập"
                      classNamePopover="m-editor_chat_input_btn_quit_chat"
                      style="padding"
                      placement="topRight"
                      content={<Gallery />}
                    >
                      <div className="m-editor_item">
                        <Icon
                          iconName={action.icon as IconName}
                          size="25x25"
                          isPointer
                          onClick={action.handle}
                        />
                      </div>
                    </CPopover>
                  </Tooltip>
                );
              default:
                return (
                  <Tooltip title={action.text} placement="top" key={action.id}>
                    <div className="m-editor_item">
                      <Icon
                        iconName={action.icon as IconName}
                        size="25x25"
                        isPointer
                        onClick={action.handle}
                      />
                    </div>
                  </Tooltip>
                );
            }
          })}
          <Tooltip title="Gửi" placement="top">
            <div className="m-editor_item">
              <Icon
                iconName="send"
                size="25x25"
                isPointer
                onClick={handleSendMessage}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

EditorChat.defaultProps = {};

export default EditorChat;
