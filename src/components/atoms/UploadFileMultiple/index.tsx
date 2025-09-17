import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import React from 'react';

import Icon from '../Icon';
import Typography from '../Typography';

const { Dragger } = Upload;

interface UploadFileProps {
  label?: string;
  isMultiple?: boolean;
  isShowUploadList?: boolean;
  hanleOnChange?: (data: any) => void;
}

const UploadFileMultiple: React.FC<UploadFileProps> = ({
  label, isMultiple, isShowUploadList, hanleOnChange
}) => {
  const props: UploadProps = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    accept: '*',
    name: 'file',
    multiple: false,
    showUploadList: isShowUploadList,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className='a-upload'>
      <div className='a-upload_label'>
        <Typography content={label} />
      </div>
      <Dragger {...props} onChange={hanleOnChange}>
        <p className="a-upload_icon">
          <Icon iconName="upload" size="32x32" />
        </p>
        <p className="a-upload_title">Chọn hoặc kéo file vào để tải file</p>
      </Dragger>
    </div>
  );
}

UploadFileMultiple.defaultProps = {
  isMultiple: true,
  isShowUploadList: true,
};

export default UploadFileMultiple;
