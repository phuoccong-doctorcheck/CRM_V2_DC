import EmojiPicker, { EmojiStyle, Theme, EmojiClickData } from 'emoji-picker-react';
import React from 'react';

interface CEmojiPickerProps {
  typeEmoji?: EmojiStyle;
  handleClickEmoji?: (item: EmojiClickData) => void;
  themes?: Theme;
}

const CEmojiPicker: React.FC<CEmojiPickerProps> = ({ typeEmoji, handleClickEmoji, themes }) => (
  <div className="m-emoji">
    <EmojiPicker
      lazyLoadEmojis
      emojiStyle={typeEmoji as EmojiStyle}
      onEmojiClick={handleClickEmoji}
      theme={themes}
    />
  </div>
);

CEmojiPicker.defaultProps = {
};

export default CEmojiPicker;
