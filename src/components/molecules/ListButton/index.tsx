/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */

import { Cplacement } from 'components/atoms/CTooltip';
import Icon, { IconName, IconSize } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import React, { useRef, useState } from 'react';
import mapModifiers from 'utils/functions';

export interface ItemButtonType {
  title: string,
  titlePlacement: Cplacement,
  icon: IconName,
  iconSizes: IconSize,
  handleClick: () => void;
}

interface ListButtonProps {
  iconName?: IconName;
  textButton?: string;
  listChildren: ItemButtonType[];
}

const ListButton: React.FC<ListButtonProps> = ({
  iconName, textButton, listChildren,
}) => {
  const [isOpenListBtn, setIsOpenListBtn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [possition, setPossiton] = useState(false);

  useClickOutside(dropdownRef, () => { if (isOpenListBtn) { setIsOpenListBtn(false); } });

  const handleCheckHeight = () => {
    const topOffset = dropdownRef?.current?.getBoundingClientRect().top;
    if (topOffset && topOffset > 250) {
      setPossiton(true);
    } else {
      setPossiton(false);
    }
  };

  return (
    <div
      className={mapModifiers('m-list_btn', isOpenListBtn && 'open', possition ? 'top' : 'bottom')}
      ref={dropdownRef}
    >
      <p onClick={(event) => {
        event.preventDefault();
        setIsOpenListBtn(true); handleCheckHeight();
      }}>
        {iconName
          ? <Icon iconName={iconName} />
          : <Typography content={textButton} />}
      </p>
      {
        isOpenListBtn && (
          <div
            className="m-list_btn-open_option"
          >
            {listChildren.map((item, idx) => {
              const { handleClick } = item;
              return (
                <div
                  key={idx}
                  className="m-list_btn-open_option_item"
                  onClick={() => {
                    if (handleClick) handleClick(); setIsOpenListBtn(false);
                  }}
                >
                  <Icon iconName={item.icon} size={item.iconSizes} isPointer />
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};

ListButton.defaultProps = {
};

export default ListButton;
