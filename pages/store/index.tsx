import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import InfoCol from "../../components/atoms/InfoCol";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { TrophyIcon } from "../../components/Icons/icons";
import RuleIcon from "../../components/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useStoreGiftEntryQuery } from "../../hooks/sub/store/queries";
import RuleModal from "../../modals/RuleModal";
import { isPrevBooleanState } from "../../recoils/previousAtoms";
import { transferStoreGiftDataState } from "../../recoils/transferRecoils";
import { STORE_GIFT_ACTIVE, STORE_GIFT_INACTIVE } from "../../storage/Store";
import { IStoreApplicant, IStoreGift } from "../../types/models/store";
import { selectRandomWinners } from "../../utils/validationUtils";

export interface IGiftEntry extends IStoreGift {
  users: IStoreApplicant[];
  totalCnt: number;
}
interface IGiftEntries {
  active: IGiftEntry[];
  inactive: IGiftEntry[];
}

function StorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const errorToast = useErrorToast();
  const [giftEntries, setGiftEntries] = useState<IGiftEntries>();

  const [isLoading, setIsLoading] = useState(true);
  const [isPrevBoolean, setIsPrevBoolean] = useRecoilState(isPrevBooleanState);
  const [isShowActive, setIsShowActive] = useState(isPrevBoolean);
  const [isModal, setIsModal] = useState(false);

  const setTransferStoreGiftData = useSetRecoilState(transferStoreGiftDataState);

  const { data: storeGiftEntries } = useStoreGiftEntryQuery({
    onError: errorToast,
  });

  useEffect(() => {
    setIsPrevBoolean(isShowActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowActive]);

  useEffect(() => {
    if (!storeGiftEntries) return;
    const temp: IGiftEntries = {
      active: STORE_GIFT_ACTIVE.map((gift) => ({
        ...gift,
        users: [],
        totalCnt: 0,
      })),
      inactive: STORE_GIFT_INACTIVE.slice()
        .reverse()
        .map((gift) => ({
          ...gift,
          users: [],
          totalCnt: 0,
        })),
    };
    storeGiftEntries.users.forEach((who) => {
      const giftId = who.giftId;
      const gift =
        temp.active.find((item) => item.giftId === giftId) ||
        temp.inactive.find((item) => item.giftId === giftId);
      if (gift) {
        gift.users.push(who);
        gift.totalCnt += who.cnt;
      }
    });

    setGiftEntries(temp);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeGiftEntries]);

  const giftArr = isShowActive ? giftEntries?.active : giftEntries?.inactive;

  const onClickGift = (item: IGiftEntry) => {
    setTransferStoreGiftData({
      isActive: isShowActive && item.totalCnt < item.max,
      data: item,
    });
    router.push(`/store/${item.giftId}`);
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "현재 상품",
      func: () => {
        setIsShowActive(true);
      },
    },
    {
      text: "지난 상품",
      func: () => {
        setIsShowActive(false);
      },
    },
  ];

  const pointInfoArr: { left: string; right: string }[] = [
    {
      left: "스터디 출석체크",
      right: "5 Point",
    },
    {
      left: "번개 모임 참여",
      right: "+ 5 Point",
    },
    {
      left: "일일 출석체크",
      right: "+ 2 Point",
    },
    {
      left: "피드 좋아요 누르기",
      right: "+ 2 Point",
    },
    {
      left: "함께한 멤버 좋아요 보내기",
      right: "+ 2 Point",
    },
    {
      left: "동아리 홍보 글 올리기",
      right: "+ 100 Point",
    },
  ];

  return (
    <>
      <Header title="포인트 스토어" url="/home">
        <RuleIcon setIsModal={setIsModal} />
      </Header>
      <Slide isNoPadding>
        <Box minH="100dvh">
          <TabNav tabOptionsArr={tabNavOptions} isFullSize />
          <Box px={5} mt={4}>
            <Box fontWeight="bold" mb={2} lineHeight="28px" fontSize="18px">
              All Products
            </Box>
            {!isLoading ? (
              <Grid gap={4} templateColumns="repeat(2,1fr)" templateRows="repeat(2,1fr)">
                {giftArr.map((item, idx) => {
                  const winners: number[] = selectRandomWinners(item.max, item.winner, item.giftId);
                  const users = item.users.reduce((acc, curr) => {
                    for (let i = 0; i < curr.cnt; i++) {
                      acc.push(curr);
                    }
                    return acc;
                  }, []);
                  const winUsers = winners.map((win) => users[win]);
                  const isMyWin = winUsers.some((user) => user?.uid === session?.user.uid);

                  return (
                    <Button
                      display="flex"
                      flexDir="column"
                      key={idx}
                      h="max-content"
                      onClick={() => onClickGift(item)}
                      variant="unstyled"
                    >
                      <Box
                        borderRadius="8px"
                        overflow="hidden"
                        w="full"
                        aspectRatio={1 / 1}
                        position="relative"
                      >
                        <Image src={item.image} alt="storeGift" priority={idx < 6} fill />

                        {(!isShowActive || item.max <= item.totalCnt) && (
                          <Flex
                            bg="rgba(0,0,0,0.2)"
                            justify="center"
                            align="center"
                            position="absolute"
                            w="full"
                            h="full"
                            borderRadius="8px"
                          >
                            <Box
                              p={1}
                              border="1px solid var(--color-red)"
                              borderColor={isMyWin ? "mint" : "red"}
                              zIndex={5}
                              borderRadius="8px"
                            >
                              <Box
                                borderRadius="4px"
                                color="white"
                                bg={!isMyWin ? "var(--color-red)" : "mint"}
                                fontSize="11px"
                                w="80px"
                                fontWeight="semibold"
                                lineHeight="20px"
                              >
                                {!isMyWin ? "추첨 완료" : "당 첨"}
                              </Box>
                            </Box>
                          </Flex>
                        )}
                      </Box>
                      <Flex mt={3} mb={2} justify="space-between" w="full">
                        <Box
                          fontSize="11px"
                          lineHeight="12px"
                          fontWeight="medium"
                          py={1}
                          px={2}
                          color="gray.500"
                          bg="rgba(142,160,172,0.08)"
                        >
                          {item.totalCnt}/{item.max}
                        </Box>
                        <Flex my="auto">
                          <TrophyIcon />
                          <Box
                            ml={0.5}
                            fontWeight="semibold"
                            fontSize="12px"
                            lineHeight="16px"
                            as="span"
                          >
                            {item.winner}
                          </Box>
                        </Flex>
                      </Flex>
                      <Box mr="auto" fontWeight="bold" fontSize="14px" lineHeight="20px">
                        {item.name}
                      </Box>
                      <Box
                        color="mint"
                        mt={1}
                        mr="auto"
                        fontWeight="bold"
                        fontSize="13px"
                        lineHeight="20px"
                      >
                        {item.point} Point
                      </Box>
                    </Button>
                  );
                })}
              </Grid>
            ) : (
              <MainLoadingAbsolute />
            )}
          </Box>
        </Box>
      </Slide>
      {isModal && (
        <RuleModal
          title="포인트 스토어 가이드"
          text="동아리 활동을 통해 포인트를 획득하고 상품에 응모해보세요. 다양한 상품이 기다리고 있어요!"
          setIsModal={setIsModal}
        >
          <InfoCol optionsArr={pointInfoArr} isMint />
        </RuleModal>
      )}
    </>
  );
}

export default StorePage;
