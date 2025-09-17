import Button from 'components/atoms/Button';
import Typography from 'components/atoms/Typography';
import CTabs, { TabItemType } from 'components/molecules/CTabs';
import React from 'react';

interface GalleryProps {
}

const Gallery: React.FC<GalleryProps> = ({ }) => {

  const OptionTab = [
    {
      key: 0,
      label: 'File',
      children: <div className="m-info_message_tab_infos">
        2
      </div>,
    },
    {
      key: 2,
      label: 'Ảnh',
      children: <div>1</div>,
    },
    {
      key: 1,
      label: 'Video',
      children: <div>3</div>,
    },
  ];


  return (
    <div className="t-gallery">
      <div className="t-gallery_upload">
        <Button modifiers={['foreign']}>
          <Typography content='Thêm mới' modifiers={['400']} />
        </Button>
      </div>
      <div className="t-gallery_render">
        <CTabs
          options={OptionTab as unknown as TabItemType[]}
          defaultActiveKey="0"
          position="top"
          size="small"
          handleOnTabClick={(data: any) => { }} />
      </div>
    </div>
  );
}

Gallery.defaultProps = {
};

export default Gallery;
