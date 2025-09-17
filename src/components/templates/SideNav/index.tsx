/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout } from 'antd';
import Icon, { IconName } from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import mapModifiers from 'utils/functions';
import { MenuCRM } from 'utils/staticState'


const { Sider } = Layout;

interface SideNavProps {
  navCollapsed?: boolean;
  widthNav?: number;
  handleClickTelephone?: () => void;
  handleHoverSideNav?: (item: boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ navCollapsed = false, widthNav, handleClickTelephone, handleHoverSideNav }) => {
  const dispatch = useAppDispatch();
  const navigators = useNavigate();

  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');
  const [indexActive, setIndexActive] = useState(0);
  const storageIndexMenu = sessionStorage.getItem('indexMenu');

  const [isHover, setIsHover] = useState<Number>(0);
  const [idHover, setIdHover] = useState<Number>(0);

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
      className="t-side-nav"
      onMouseEnter={() => {
        if (handleHoverSideNav) {
          handleHoverSideNav(false)
        }
      }}
      onMouseLeave={() => {
        if (handleHoverSideNav) {
          handleHoverSideNav(true)
        }
        setIdHover(0);
      }}
    >
      <Sider
        className={mapModifiers(`t-side-nav_wrap`, navCollapsed ? 'uncollapse' : 'collapse')}
        width={widthNav}
        collapsed={navCollapsed}
        collapsedWidth={48}
        theme="light"
      >
        <div className="t-side-nav_menu">
          {
            MenuCRM?.map((group) => (
              <div className="t-side-nav_menu_group" key={group.groupId}>
               
                {
                  group?.items?.map((item) => {
                    if (checkRoles(item.role))
                      return (
                        <div className="t-side-nav_menu_item_wrapper" key={item.id}>
                          <div
                            onClick={() => {
                              if (item.isHaveChild) {
                                if (idHover === item.id) {
                                  setIdHover(0)
                                } else {
                                  setIdHover(item.id)
                                }
                              } else {
                                setIndexActive(item.id)
                                sessionStorage.setItem('indexMenu', `${item?.id}`)
                                navigators(item.slug)
                              }
                            }}
                            className={mapModifiers('t-side-nav_menu_item', indexActive === item?.id && 'active')}
                          >
                            <div className="t-side-nav_menu_item_block">
                             {
                                indexActive === item?.id ? (
                                  <Icon iconName={isHover === item.id ? `${item.icon}-yellow` as IconName : item.icon as any} size="24x24" />
                                ) : (
                                  <Icon iconName={`${item.icon}-yellow` as IconName} size="24x24" />
                                )
                              }
                              {!navCollapsed &&
                                <div className={mapModifiers('t-side-nav_menu_item_title')}>
                                  <Typography type='p' content={item.name} modifiers={['600']} />
                                </div>
                              }
                            </div>
                            {item.isHaveChild && !navCollapsed &&
                              <div className={mapModifiers('t-side-nav_menu_item_icon', item.id === idHover && 'active')}>
                                <Icon iconName="chevronLeft" size='16x16' />
                              </div>
                            }
                          </div>
                             {item.id === idHover && item.isHaveChild && !navCollapsed && item.child?.map((child) => {
                            if (checkRoles(child.role)) {
                              return (
                                <div
                                  key={child.idChild}
                                  onClick={() => {
                                    setIndexActive(item.id)
                                    sessionStorage.setItem('indexMenu', `${item?.id}`)
                                    navigators(child.slug)
                                  }}
                                  className={mapModifiers('t-side-nav_menu_item_child')}
                                >
                                  {!navCollapsed &&
                                    <div className={mapModifiers('t-side-nav_menu_item_child_title')}>
                                      <Typography type='p' content={child.title} modifiers={['600']} />
                                    </div>
                                  }
                                </div>
                              )
                            }
                          })}
                         
                        </div>
                      )
                  })
                }
              </div>
            ))
          }
        </div>
      </Sider >
    </div >
  );
}

// SideNav.defaultProps = {
//   navCollapsed: false,
// };

export default SideNav;
