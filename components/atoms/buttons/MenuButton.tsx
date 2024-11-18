import { Button, Menu, MenuButton as ChakraMenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { EllipsisIcon } from "../../Icons/DotIcons";
import KakaoShareBtn from "../../Icons/KakaoShareBtn";

export interface MenuProps {
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
          <ChakraMenuButton isActive={isOpen} as={Button} variant="unstyled">
            <EllipsisIcon size="md" color="white" />
          </ChakraMenuButton>
          <MenuList fontSize="14px">
            {menuArr.map((menu) => (
              <MenuItem
                as={menu?.kakaoOptions ? "div" : "button"}
                key={menu?.text || "kakao"}
                onClick={menu?.func}
                bg="white"
                py={2}
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

export default MenuButton;
