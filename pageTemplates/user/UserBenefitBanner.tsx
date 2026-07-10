import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { SUPPORT_LIST } from "../../constants/support";
import { useOpenHomeActivityDrawer } from "../../hooks/custom/useHomeActivityDrawer";
import { useDenyGuest } from "../../hooks/custom/UserHooks";
import MemberCardModal from "./MemberCardModal";

function UserBenefitBanner() {
  const [isMemberCardModal, setIsMemberCardModal] = useState(false);
  const denyGuest = useDenyGuest();
  const openHomeActivityDrawer = useOpenHomeActivityDrawer();

  return (
    <Box px={5} pb={3}>
      <Box
        borderRadius="16px"
        border="var(--border)"
        bg="gray.50"
        boxShadow="0px 2px 8px 0px rgba(0,0,0,0.04)"
        p={4}
      >
        <Flex align="center" justify="space-between" mb={2}>
          <Box fontSize="16px" fontWeight={800} color="var(--gray-800)">
            어바웃 멤버 제휴 혜택
          </Box>
          <Badge
            px={2}
            py={0.5}
            borderRadius="8px"
            fontWeight={700}
            fontSize="10px"
            color="white"
            bg="linear-gradient(135deg, #00C2B3 0%, #007DFB 100%)"
          >
            30여 개 제휴
          </Badge>
        </Flex>

        <Box
          fontSize="12px"
          lineHeight="18px"
          color="var(--gray-500)"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
          }}
        >
          {SUPPORT_LIST.map((item) => item.name).join(" · ")}
        </Box>

        <Flex mt={3} gap={2}>
          <Button
            flex={1}
            h="40px"
            variant="outline"
            borderColor="mint"
            color="mint"
            onClick={() => openHomeActivityDrawer("benefit")}
          >
            제휴 업체 확인
          </Button>
          <Button
            flex={1}
            h="40px"
            colorScheme="mint"
            onClick={() => denyGuest(() => setIsMemberCardModal(true))}
          >
            어바웃 멤버증
          </Button>
        </Flex>
      </Box>
      {isMemberCardModal && <MemberCardModal onClose={() => setIsMemberCardModal(false)} />}
    </Box>
  );
}

export default UserBenefitBanner;
