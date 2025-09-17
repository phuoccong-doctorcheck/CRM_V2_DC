import { DropdownData } from 'components/atoms/Dropdown';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import Cookies from 'js-cookie';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLogined } from 'store/example';
import { useAppDispatch } from 'store/hooks';
import mapModifiers from 'utils/functions';

interface UserDropdownProps {
  optionsChild: DropdownData[];
  iconLogo?: string;
  name?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ optionsChild, iconLogo, name }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => setIsOpen(!isOpen);
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div className="m-user_dropdown" ref={dropdownRef} onClick={toggling}>
      <div className="m-user_dropdown_image">
        <img src={iconLogo} alt="avatar header" />
      </div>
      <Typography
        content={name}
        type="p"
        modifiers={['700', 'jetSub', 'uppercase']}
      />
      <div className={mapModifiers('m-user_dropdown_icon', isOpen && 'open_list')}>
        <Icon iconName="dropDown_blue" size="17x12" isPointer />
      </div>
      {isOpen
        && (
          <ul className="m-user_dropdown_list">
            {
              optionsChild.length && optionsChild.map((option) => (
                <li
                  key={option.id}
                  className="m-user_dropdown_item"
                  onClick={() => {
                    if (option.value === '/logout') {
                      dispatch(isLogined(false));
                      localStorage.clear();
                      sessionStorage.clear();
                      Object.keys(Cookies.get()).forEach((cookieName) => {
                        Cookies.remove(cookieName, {});
                      });
                      navigator('/login');
                      window.location.reload();
                    } else {
                      if (option.value !== '/profile') {
                        option?.handleClick();
                      } else {
                        navigator(option.value);
                      }
                    }
                  }}
                >
                  <Typography type="p" modifiers={['jetSub', 'capitalize', '400']} content={option.label} />
                </li>
              ))
            }
          </ul>
        )
      }

    </div >
  );
};

UserDropdown.defaultProps = {
};

export default UserDropdown;
