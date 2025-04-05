import "dayjs/locale/ko";

import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import MenuButton from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import StoreApplyGiftModal from "../../../modals/store/StoreApplyGiftModal";
import StoreGiftWinModal from "../../../modals/store/StoreGiftWinModal";
import StoreMembersModal from "../../../modals/store/StoreMembersModal";
import { transferStoreGiftDataState } from "../../../recoils/transferRecoils";

dayjs.extend(localizedFormat);
dayjs.locale("ko");

function StoreItem() {
  const typeToast = useTypeToast();
  const [modalType, setModalType] = useState<"vote" | "winner" | "member">();

  const [drawerHeight, setDrawerHeight] = useState(0);

  const storeGiftData = useRecoilValue(transferStoreGiftDataState);

  const giftInfo = storeGiftData?.data;

  const isResult = giftInfo.totalCnt >= giftInfo.max;

  useEffect(() => {
    // 높이 계산: 100dvh - 100dvw
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight; // 100dvh
      const viewportWidth = window.innerWidth; // 100dvw
      setDrawerHeight(viewportHeight - viewportWidth);
    };

    // 초기 계산
    calculateHeight();

    // 창 크기 변경 시 재계산
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
          {storeGiftData && (
            <Image
              fill
              alt="storeImageCover"
              sizes="800px"
              src={giftInfo.image}
              style={{
                objectFit: "cover",
                transform: giftInfo?.type === "ticket" ? "scale(0.3)" : "none",
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
          {storeGiftData && (
            <Flex mt={4} w="full" direction="column" align="start">
              <Box mb={2}>
                <Badge size="lg">{giftInfo.brand}</Badge>
              </Box>
              <Box mb={2} fontSize="18px" fontWeight="semibold" lineHeight="28px">
                {giftInfo.name}
              </Box>
              <Box fontSize="13px" lineHeight="20px" mb={4}>
                현재 전체 응모 횟수는{" "}
                <b>
                  &lsquo;
                  {giftInfo.totalCnt +
                    (giftInfo?.name === "소모임 참여권"
                      ? 13
                      : giftInfo?.name === "번개 참여권"
                      ? 2
                      : 0)}
                  회&rsquo;
                </b>
                입니다.
              </Box>
              <Box mb={4} fontWeight="extrabold" fontSize="16px" lineHeight="24px" color="mint">
                {giftInfo.point} Point
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
                  {giftInfo.winner}명
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
                {!giftInfo?.type && "당첨자는 중복되지 않습니다."}
                <br />
                응모할 수 있는 최대 횟수는 개인 점수에 따라 달라집니다.
              </Box>
            </Flex>
          )}
          <Flex my={2} w="full" mt="auto">
            {!giftInfo?.type && (
              <Button
                colorScheme="black"
                size="lg"
                mr={3}
                flex={1}
                onClick={() => setModalType("member")}
              >
                참여 현황
              </Button>
            )}
            <Button
              onClick={() => setModalType(isResult ? "winner" : "vote")}
              size="lg"
              flex={1}
              colorScheme="mint"
            >
              {giftInfo?.type ? "구매하기" : isResult ? "당첨자 확인" : "응모하기"}
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}
      {modalType === "member" && (
        <StoreMembersModal members={giftInfo.users} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "vote" && (
        <StoreApplyGiftModal setIsModal={() => setModalType(null)} giftInfo={giftInfo} />
      )}
      {modalType === "winner" && (
        <StoreGiftWinModal
          setIsModal={() => setModalType(null)}
          applicants={giftInfo}
          winCnt={giftInfo.winner}
        />
      )}
    </>
  );
}

export default StoreItem;
