import {
  Button,
  Flex,
  Menu,
  MenuButton as ChakraMenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { SettingIcon } from "../../../pageTemplates/user/UserHeader2";
import KakaoShareBtn from "../../Icons/KakaoShareBtn";

export interface MenuProps {
  icon?: React.ReactNode;
  text?: string;
  func?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kakaoOptions?: any;
}

interface MenuButtonProps {
  menuArr: MenuProps[];
}

function MenuButton({ menuArr }: MenuButtonProps) {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <ChakraMenuButton
            display="flex"
            w={8}
            h={8}
            isActive={isOpen}
            as={Button}
            variant="unstyled"
          >
            <Flex justify="center" align="center">
              <SettingIcon />
            </Flex>
          </ChakraMenuButton>
          <MenuList fontSize="14px">
            {menuArr.map((menu) => (
              <MenuItem
                as={menu?.kakaoOptions ? "div" : "button"}
                key={menu?.text || "kakao"}
                onClick={menu?.func}
                bg="white"
                iconSpacing={2}
                py={2}
                {...(menu?.kakaoOptions
                  ? { icon: <ShareIcon /> }
                  : menu?.icon && { icon: <>{menu.icon}</> })}
              >
                {menu?.text}
                {menu?.kakaoOptions && <KakaoShareBtn variant="unstyled" {...menu.kakaoOptions} />}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
}

function ShareIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="var(--color-gray)"
  >
    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
  </svg>
}

export default MenuButton;
