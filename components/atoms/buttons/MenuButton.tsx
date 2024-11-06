import { Button, Menu, MenuButton as ChakraMenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { EllipsisIcon } from "../../Icons/DotIcons";
import KakaoShareBtn from "../../Icons/KakaoShareBtn";
import ButtonWrapper from "../ButtonWrapper";

export interface MenuProps {
  text?: string;
  func?: () => void;
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
            <ButtonWrapper>
              <EllipsisIcon />
            </ButtonWrapper>
          </ChakraMenuButton>
          <MenuList fontSize="14px">
            {menuArr.map((menu) => (
              <MenuItem key={menu?.text || "kakao"} onClick={menu?.func}>
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
