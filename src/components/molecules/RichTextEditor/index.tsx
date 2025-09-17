/* eslint-disable @typescript-eslint/no-unused-vars */
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';
import mapModifiers from 'utils/functions';

type Variant = 'notHeadernotBordernotBGBoxShadown' | 'notHeadernotBordernotBG' | 'notHeadernotBorder' | 'notuseHeaderCustom'

interface RichTextEditorProps {
  handleOnChange?: (item: any) => void;
  data?: string;
  showHeightHigh?: boolean;
  notuseHeader?: boolean;
  isDisabled?: boolean;
  typeText?: Variant;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  handleOnChange, data, showHeightHigh, notuseHeader, typeText,
  isDisabled
}) => (
  <div className={mapModifiers('m-richtext_editor',
    showHeightHigh && 'high',
    notuseHeader && 'not_header',
    typeText,
  )}
  >
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onReady={(editor) => {
      }}
      disabled={isDisabled}
      onChange={(event, editor) => {
        const datas = editor.getData();
        if (handleOnChange) handleOnChange(datas);
      }}
      onBlur={(event, editor) => {
      }}
      onFocus={(event, editor) => {
      }}
    />
  </div>
);

RichTextEditor.defaultProps = {
};

export default RichTextEditor;
