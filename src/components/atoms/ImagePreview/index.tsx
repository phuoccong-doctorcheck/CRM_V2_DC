/* eslint-disable import/order */
import React from 'react';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import CModal from 'components/organisms/CModal';
import "react-image-gallery/styles/css/image-gallery.css";

interface ImageItemType {
  original: string;
  thumbnail?: string; // Thêm thuộc tính thumbnail nếu cần
  [x: string]: string | undefined; // Sửa kiểu giá trị của các thuộc tính khác
}

interface ImagePreviewProps {
  options: ImageItemType[]; // Đảm bảo truyền vào mảng các hình ảnh
  isOpen: boolean;
  handleClose?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ options, isOpen, handleClose }) => {
  const images = options.map(option => ({
    thumbnail: option.thumbnail || option.original,
    ...option,
  }));

  return (
    <div className="a-image_preview">
      <CModal isOpen={isOpen} onCancel={handleClose} widths={1000} textCancel='Thoát' isHideOk>
        <div className="a-image_preview_wrap">
          <ImageGallery
            items={images}
            showBullets={false}
            showIndex={false}
            showThumbnails={options.length >= 2}
            lazyLoad={false}
            showPlayButton={false}
            showNav={true}
            showFullscreenButton={false}
            thumbnailPosition={"right"}
          />
        </div>
      </CModal>
    </div>
  );
}

export default ImagePreview;
