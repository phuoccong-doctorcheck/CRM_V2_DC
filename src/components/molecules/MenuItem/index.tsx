/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon, { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import React, { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { postConversationActive } from 'store/pancake';
import mapModifiers from 'utils/functions';

export type ItemMenu = {
  id: number;
  name: string;
  icon: IconName;
  slug: string;
  cIcon: ReactNode
};

interface MenuItemProps {
  optionMenu: ItemMenu[];
  handleClickItem?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ optionMenu, handleClickItem }) => {
  const dispatch = useAppDispatch();

  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [indexActive, setIndexActive] = useState(0);
  const storageIndexMenu = sessionStorage.getItem('indexMenu');

  const [isHover, setIsHover] = useState<Number>(0);
  // kiếm tra  Hàm checkRoles sẽ trả về true nếu danh sách listRoles chứa bất kỳ vai trò nào có tên nằm 
  //   trong roleNames hoặc là 'normal'.Nếu không, hàm sẽ trả về false.
  const checkRoles = (roleNames: string[]) => {
    return listRoles && listRoles?.some((role: any) => roleNames?.some((i => i === role?.role_name || i === 'normal')));
  };

  useEffect(() => {
    if (storageIndexMenu) {
      setIndexActive(Number(storageIndexMenu));
    } else {
      setIndexActive(Number(sessionStorage.getItem('indexMenu')));
    }
  }, [])

  return (
    <div
      className={mapModifiers('m-menuitem')}
    >
      {
        optionMenu.length && optionMenu.map((item: any) => {
          if (checkRoles(item?.role) || item?.role?.some(((i: any) => i === 'adDashBoard'))) {
            return (
              <>
                <div
                  className={mapModifiers('m-menuitem_item', indexActive === item?.id && 'active')}
                  key={item.id}
                  onClick={() => {
                    if (handleClickItem) { handleClickItem() }

                    // 2 dòng code dưới để mà kiếm tra xem đang ở trang nào để 2light button navigate của trang đó
                    setIndexActive(item.id)
                    sessionStorage.setItem('indexMenu', item.id)
                  }}
                  onMouseEnter={() => setIsHover(item.id)}
                  onMouseLeave={() => setIsHover(0)}
                >
                  <Link to={item.slug}>
                    {
                      indexActive === item?.id ? (
                        <Icon iconName={`${item.icon}-yellow` as IconName} size="24x24" />
                      ) : (
                        <Icon iconName={isHover === item.id ? `${item.icon}-yellow` as IconName : item.icon} size="24x24" />
                      )
                    }
                    <div className={mapModifiers('m-menuitem_item_title')}>
                      <Typography content={item.name} modifiers={['400']} />
                    </div>
                  </Link>
                </div>

                {/* Đoạn code này là các  thanh thống kê con */}
                <ul>
                  {
                    item?.child?.length ?
                      item?.child?.map((child: any) => (
                        <li key={child?.idChild} className='m-menuitem_item_child'>
                          <Link to={child.slug}>
                            <span /> <p>{child?.title}</p>
                          </Link>
                        </li>
                      ))
                      : null
                  }
                </ul>
              </>
            )
          }
        })
      }
    </div>
  );
};
MenuItem.defaultProps = {
};

export default MenuItem;
