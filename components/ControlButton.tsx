import { Box, Button, Flex, ThemeTypings } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ReactElement } from "react";

import { GUEST_BOTTOM_NAV_HEIGHT } from "@/components/layouts/atoms/GuestBottomNav";
import { getSafeAreaBottom } from "@/utils/validationUtils";

interface ControlButtonProps {
  colorScheme?: ThemeTypings["colorSchemes"];
  rightIcon: ReactElement;
  handleClick: () => void;
  isDisabled?: boolean;
  text: string;
  hasBottomNav?: boolean;
}

function ControlButton({
  colorScheme = "mint",
  rightIcon,
  handleClick,
  text,
  isDisabled = false,
  hasBottomNav = false,
}: ControlButtonProps) {
  const { data: session } = useSession();
  // 하단 탭이 있는 화면에서 게스트는 탭 위에 게스트 안내 바가 한 줄 더 뜬다(Layout과 같은 판정).
  const guestBarHeight =
    hasBottomNav && session?.user.role === "guest" ? GUEST_BOTTOM_NAV_HEIGHT : 0;

  return (
    <Flex
      position="fixed"
      zIndex="50"
      fontSize="12px"
      lineHeight="24px"
      fontWeight="bold"
      bottom={`calc(${hasBottomNav ? "var(--bottom-nav-height)" : "8px"} + ${
        guestBarHeight
      }px + ${getSafeAreaBottom(12)})`}
      right="20px"
    >
      <Button
        fontSize="12px"
        h="40px"
        color="white"
        px={4}
        borderRadius="20px"
        lineHeight="24px"
        iconSpacing={1}
        colorScheme={"black" || colorScheme}
        rightIcon={<Box mb="1px">{rightIcon}</Box>}
        onClick={handleClick}
        isDisabled={isDisabled}
        _hover={{
          background: undefined,
        }}
      >
        {text}
      </Button>
    </Flex>
  );
}

export default ControlButton;
