/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tooltip } from 'antd';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Icon from 'components/atoms/Icon';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import EditorChat from 'components/molecules/EditorChat';
import MultiSelect from 'components/molecules/MultiSelect';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import { store } from 'store';
import mapModifiers from 'utils/functions';

import BoxChat from '../BoxChat';

interface PopupBoxChatProps {
  isOpen?: boolean;
  name?: string;
  handleAddCustomer?: () => void;
}

const PopupBoxChat: React.FC<PopupBoxChatProps> = ({
  isOpen, name, handleAddCustomer,
}) => {
  const [isShowPopup, setIsShowPopup] = useState(isOpen);
  const [isShowPopupNote, setIsShowPopupNote] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    // hiển thị lại width
    window.addEventListener('resize', handleResize);
    // clean up để fix lỗi toggle
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={mapModifiers('t-popup_boxchat', !isShowPopup && 'hide')}
      onClick={() => {
        if (!isShowPopup) {
          setIsShowPopup(true);
        }
      }}
    >
      {
        isShowPopup && (
          <>
            <div className="t-popup_boxchat_header">
              <div className="t-popup_boxchat_header_left">
                <div className="t-popup_boxchat_header_left_logo">
                  <Icon iconName="facebook_channel" size="36x36" />
                </div>
                <div className="t-popup_boxchat_header_left_name">
                  {name}
                  Eric Nguyen
                </div>
              </div>
              <div className="t-popup_boxchat_header_right">
                <CTooltip placements="topLeft" title="Ẩn">
                  <div
                    className="t-popup_boxchat_header_right_btn"
                    onClick={() => {
                      if (isShowPopup) {
                        setIsShowPopup(false);
                      }
                    }}
                  >
                    <Icon iconName="hide_popup" size="26x26" />
                  </div>
                </CTooltip>
                <CTooltip placements="topLeft" title="Xem đầy đủ">
                  <div className="t-popup_boxchat_header_right_btn">
                    <Icon iconName="fullscreen" size="26x26" />
                  </div>
                </CTooltip>
              </div>
            </div>
            <div className="t-popup_boxchat_body">
              <Provider store={store}>
                <BoxChat />
              </Provider>
              <div style={{
                outline: '1px solid #ced0d4',
                paddingBottom: 10,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
              >
                <div className="t-popup_boxchat_body_quit">
                  <li className="t-popup_boxchat_body_quit_tag">
                    <MultiSelect option={[]} lable="Tags" isFlex />
                  </li>
                  <li>
                    <Button modifiers={['h36']} onClick={handleAddCustomer}>
                      {width > 1280 ? <Typography content="Thêm khách hàng" modifiers={['400', '14x20']} /> : (
                        <Icon iconName="add_crm_v2" />
                      )}
                    </Button>

                  </li>
                  <li>
                    <Button modifiers={['h36']} onClick={() => setIsShowPopupNote(!isShowPopupNote)}>
                      <CTooltip placements="top" title="Ghi chú">
                        <Icon iconName="note_phone" />
                      </CTooltip>
                    </Button>
                  </li>
                </div>
                <div className="t-popup_boxchat_body_editor">
                  <Provider store={store}>
                    <EditorChat />
                  </Provider>
                </div>
              </div>
            </div>
          </>
        )
      }
      <div className={mapModifiers('t-popup_notes', (isShowPopup && isShowPopupNote) && 'show')}>
        <TextArea id="" readOnly={false} label="Ghi chú nội bộ" />
        <Button onClick={() => { setIsShowPopupNote(false); toast.success('Ghi chú thành công'); }}> Lưu</Button>
      </div>
    </div>
  );
};

PopupBoxChat.defaultProps = {
  isOpen: false,
};

export default PopupBoxChat;
