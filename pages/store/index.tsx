import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Select from "../../components/atoms/Select";
import { TrophyIcon } from "../../components/Icons/icons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import PointGuideModalButton from "../../components/modalButtons/PointGuideModalButton";
import ImageShadowCover from "../../components/molecules/ImageShadowCover";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useStoreGiftEntryQuery } from "../../hooks/sub/store/queries";
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

  const [sortBy, setSortBy] = useState<"전체" | "스토어 상품" | "동아리 상품">("전체");

  const setTransferStoreGiftData = useSetRecoilState(transferStoreGiftDataState);

  const { data: storeGiftEntries } = useStoreGiftEntryQuery({
    onError: errorToast,
  });
  console.log(32, storeGiftEntries);

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

  return (
    <>
      <Header title="포인트 스토어" url="/home">
        <PointGuideModalButton type="store" />
      </Header>
      <Slide isNoPadding>
        <Box minH="100dvh">
          <TabNav tabOptionsArr={tabNavOptions} isFullSize />
          <Box px={5} mt={4}>
            <Flex
              mb={4}
              justify="space-between"
              fontWeight="bold"
              lineHeight="28px"
              fontSize="18px"
            >
              All Products
              <Select
                size="sm"
                isThick
                defaultValue={sortBy}
                options={["전체", "스토어 상품", "동아리 상품"]}
                setValue={setSortBy}
              />
            </Flex>
            {!isLoading ? (
              <Grid gap={4} templateColumns="repeat(2,1fr)" templateRows="repeat(2,1fr)">
                {giftArr
                  ?.slice()
                  .sort((a, b) =>
                    !a?.type || !b?.type
                      ? 1
                      : a?.type === "ticket" || b?.type === "ticket"
                      ? -1
                      : a.totalCnt < b.totalCnt
                      ? 1
                      : -1,
                  )
                  .filter((item) =>
                    sortBy === "전체"
                      ? true
                      : sortBy === "스토어 상품"
                      ? !item?.type
                      : item?.type === "about" || item?.type === "ticket",
                  )
                  .map((item, idx) => {
                    const winners: number[] = !item?.type
                      ? selectRandomWinners(item.max, item.winner, item.giftId)
                      : [];
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
                          <Image
                            src={item.image}
                            alt="storeGift"
                            priority={idx < 6}
                            fill
                            style={{
                              objectFit: "cover",
                              transform: item?.type === "ticket" ? "scale(0.5)" : "none",
                            }}
                          />

                          {(!isShowActive || item.max <= item.totalCnt) && (
                            <ImageShadowCover
                              color={isMyWin ? "mint" : "red"}
                              text={isMyWin ? "당 첨" : "추첨 완료"}
                              size="lg"
                            />
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
                          {item.point * 10} Point
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
    </>
  );
}

export default StorePage;
