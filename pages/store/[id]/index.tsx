import "dayjs/locale/ko";

import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import MenuButton from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStoreGiftQuery } from "../../../hooks/sub/store/queries";
import StoreApplyGiftModal from "../../../modals/store/StoreApplyGiftModal";
import StoreGiftWinModal from "../../../modals/store/StoreGiftWinModal";
import StoreMembersModal from "../../../modals/store/StoreMembersModal";

dayjs.extend(localizedFormat);
dayjs.locale("ko");

function StoreItem() {
  const typeToast = useTypeToast();
  const { id } = useParams() || {};
  const [modalType, setModalType] = useState<"vote" | "winner" | "member">();
  const [drawerHeight, setDrawerHeight] = useState(0);

  const { data: giftInfo } = useStoreGiftQuery(id as string, { enabled: !!id });

  useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight; // 100dvh
      const viewportWidth = window.innerWidth; // 100dvw
      setDrawerHeight(viewportHeight - viewportWidth);
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  return (
    <>
      <Box w="full" aspectRatio={1 / 1} position="relative">
        <Box
          w="full"
          h="full"
          position="absolute"
          bg="linear-gradient(to top,rgba(31,32,36,0.12) 0%,rgba(31,32,36,0) 60%,rgba(31,32,36,1) 100%)"
          opacity={0.4}
          zIndex={1}
        />
        <Header title="" isTransparent>
          <MenuButton
            menuArr={[
              {
                text: "카카오톡 공유하기",
                func: () => {
                  typeToast("not-yet");
                },
              },
            ]}
          />
        </Header>
        <Box w="full" h="full" position="absolute">
          {giftInfo && (
            <Image
              fill
              alt="storeImageCover"
              sizes="800px"
              src={giftInfo.image}
              style={{
                objectFit: "cover",
                // transform: giftInfo?.type === "ticket" ? "scale(0.3)" : "none",
              }}
            />
          )}
        </Box>
      </Box>

      {drawerHeight && (
        <BottomFlexDrawer
          isHideBottom
          isOverlay={false}
          height={drawerHeight + 64}
          isDrawerUp
          setIsModal={() => {}}
        >
          {giftInfo && (
            <Flex mt={4} w="full" direction="column" align="start">
              <Box mb={2}>
                <Badge size="lg">{giftInfo.status === "pending" ? "응모 가능" : "응모 마감"}</Badge>
              </Box>
              <Box mb={2} fontSize="18px" fontWeight="semibold" lineHeight="28px">
                {giftInfo.name}
              </Box>
              <Box fontSize="13px" lineHeight="20px" mb={4}>
                현재 전체 응모 횟수는{" "}
                <b>
                  {giftInfo.applicants.reduce((acc, cur) => {
                    return acc + cur.cnt;
                  }, 0)}
                  회
                </b>
                입니다.
              </Box>
              <Box mb={4} fontWeight="extrabold" fontSize="16px" lineHeight="24px" color="mint">
                {giftInfo.point * 10} Point
              </Box>
              <Flex
                w="full"
                h="full"
                py={1}
                mb={1}
                borderBottom="var(--border)"
                justify="space-between"
                fontSize="13px"
                lineHeight="20px"
              >
                <Box fontWeight="medium">추첨 인원</Box>
                <Box color="gray.600" fontWeight="regular">
                  <>{giftInfo.winnerCnt}명</>
                </Box>
              </Flex>
              <Flex
                w="full"
                py={1}
                mb={1}
                borderBottom="var(--border)"
                justify="space-between"
                fontSize="13px"
                lineHeight="20px"
              >
                <Box fontWeight="medium">응모 가능 인원</Box>
                <Box color="gray.600" fontWeight="regular">
                  {giftInfo.max}명
                </Box>
              </Flex>
              <Flex
                mb={1}
                w="full"
                py={1}
                justify="space-between"
                fontSize="13px"
                lineHeight="20px"
              >
                <Box fontWeight="medium">안내사항</Box>
              </Flex>
              <Box color="gray.600" lineHeight="16px" fontSize="12px">
                상품은 일주일 이내 개인 카톡으로 발송됩니다.
                <br />
                응모할 수 있는 최대 횟수는 개인 점수에 따라 달라집니다.
              </Box>
            </Flex>
          )}
          <Flex py={2} w="full" mt="auto">
            <Button
              colorScheme="black"
              size="lg"
              mr={3}
              flex={1}
              onClick={() => setModalType("member")}
            >
              참여 현황
            </Button>

            <Button
              onClick={() => setModalType(giftInfo.status !== "pending" ? "winner" : "vote")}
              size="lg"
              flex={1}
              colorScheme="mint"
            >
              {giftInfo?.status !== "pending" ? "당첨자 확인" : "응모하기"}
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}
      {modalType === "member" && (
        <StoreMembersModal members={giftInfo.applicants} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "vote" && (
        <StoreApplyGiftModal setIsModal={() => setModalType(null)} giftInfo={giftInfo} />
      )}
      {modalType === "winner" && (
        <StoreGiftWinModal setIsModal={() => setModalType(null)} winners={giftInfo.winner} />
      )}
    </>
  );
}

export default StoreItem;
