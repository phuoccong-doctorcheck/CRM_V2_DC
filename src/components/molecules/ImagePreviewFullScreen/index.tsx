/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image } from 'antd';
import React, { useEffect, useState } from 'react';
interface ImagePreviewFullScreenProps {
  urlImage?: string;
  widths?: number | string;
}

const ImagePreviewFullScreen: React.FC<ImagePreviewFullScreenProps> = ({ urlImage, widths }) => {
  return (
    <div className="m-image_preview">
      <Image
        width={widths}
        placeholder={undefined}
        rootClassName='m-image_preview_custom'
        src={urlImage}
        preview={{
          src: urlImage,
          movable: false,
        }}
      />
    </div>
  );
}

ImagePreviewFullScreen.defaultProps = {
};

export default ImagePreviewFullScreen;
