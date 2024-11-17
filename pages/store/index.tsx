import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { TrophyIcon } from "../../components/Icons/icons";

import RuleIcon from "../../components/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useStoreGiftEntryQuery } from "../../hooks/sub/store/queries";
import RuleModal, { IRuleModalContent } from "../../modals/RuleModal";
import { isPrevBooleanState } from "../../recoils/previousAtoms";
import { transferStoreGiftDataState } from "../../recoils/transferRecoils";
import { STORE_GIFT_ACTIVE, STORE_GIFT_INACTIVE } from "../../storage/Store";
import { IStoreApplicant, IStoreGift } from "../../types/models/store";

export interface IGiftEntry extends IStoreGift {
  users: IStoreApplicant[];
  totalCnt: number;
}
interface IGiftEntries {
  active: IGiftEntry[];
  inactive: IGiftEntry[];
}

const content: IRuleModalContent = {
  headerContent: {
    title: "포인트 스토어",
    text: "동아리 활동을 통해 포인트를 모으고 추첨에 응모해보세요! 다양한 상품이 있습니다 ~!",
  },
  mainContent: [
    {
      title: "포인트는 어떻게 얻나요?",
      texts: [
        "스터디 참여, 출석체크, 이벤트, 건의, 홍보 등 여러 컨텐츠에서 포인트를 흭득할 수 있어요!",
      ],
    },

    {
      title: "상품 당첨과 인원 관련해서 궁금해요.",
      texts: ["트로피의 숫자는 당첨 개수, 왼쪽 숫자는 현재 인원과 최대 응모 가능한 인원이에요!"],
    },
    {
      title: "응모 최대 개수에 제한이 있나요?",
      texts: [
        "네. 상품 당 중복해서 투표할 수 있는 숫자는 유저 개인 등급에 따라 달라집니다. 기본 아메리카노는 1개, 이후 등급이 오를때마다 하나씩 더 추가돼요.",
      ],
    },
  ],
};

function Event() {
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
      func: () => {},
    },
    {
      text: "지난 상품",
      func: () => {},
    },
  ];

  return (
    <>
      <Header title="포인트 스토어">
        <RuleIcon setIsModal={setIsModal} />
      </Header>
      <Slide isNoPadding>
        <TabNav tabOptionsArr={tabNavOptions} isFullSize />
        <Box px={5} mt={4}>
          <Box fontWeight="bold" mb={2} lineHeight="28px" fontSize="18px">
            All Products
          </Box>
          {!isLoading && (
            <Grid gap={4} templateColumns="repeat(2,1fr)" templateRows="repeat(2,1fr)">
              {giftArr.map((item, idx) => (
                <Button
                  display="flex"
                  flexDir="column"
                  key={idx}
                  h="max-content"
                  onClick={() => onClickGift(item)}
                  variant="unstyled"
                >
                  <Box w="full" aspectRatio={1 / 1} position="relative">
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
                        <Box p={1} border="1px solid var(--color-red)" zIndex={5}>
                          <Box
                            borderRadius="4px"
                            color="white"
                            bg="var(--color-red)"
                            fontSize="11px"
                            w="80px"
                            fontWeight="semibold"
                            lineHeight="20px"
                          >
                            추첨 완료
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
                  {/* <Info>
                    <Name>{item.name}</Name>
                    <Point>{item.point} point</Point>
                  </Info> */}
                  {/* {(!isShowActive || item.max <= item.totalCnt) && <CompletedRapple />} */}
                </Button>
              ))}
            </Grid>
          )}
        </Box>
      </Slide>
      {isModal && <RuleModal content={content} setIsModal={setIsModal} />}
    </>
  );
}
const Layout = styled.div`
  margin: 0 var(--gap-4);
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  gap: var(--gap-3);
`;

const Item = styled.button`
  position: relative;

  padding: var(--gap-2);
  background-color: white;
  border: var(--border);

  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--rounded-lg);
`;

const Status = styled.div`
  justify-content: space-between;
  display: flex;
  width: 100%;
  font-size: 14px;
`;

const Trophy = styled.div`
  display: flex;
  margin-left: 4px;
  > div {
    margin-left: 4px;
  }
`;

const ApplyCnt = styled.div`
  color: var(--gray-700);
  font-size: 16px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: var(--rounded-lg);
  overflow: hidden;
`;

const Info = styled.div`
  margin-top: 12px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.span`
  font-weight: 600;
`;

const Point = styled.span`
  color: var(--color-mint);
  font-size: 16px;
`;

const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border: 2px solid var(--gray-800);
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
const CompletedRapple = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--gray-300);
  opacity: 0.5;
`;

export default Event;
