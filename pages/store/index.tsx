import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { TrophyIcon } from "../../components/Icons/icons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import PointGuideModalButton from "../../components/modalButtons/PointGuideModalButton";
import ImageShadowCover from "../../components/molecules/ImageShadowCover";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import WinnerTextSlider from "../../components/molecules/WinnerTextSlider";
import { usePrizeQuery } from "../../constants/prize/queries";
import { useStoreQuery } from "../../hooks/sub/store/queries";
import { IStoreApplicant, IStoreGift, StoreGiftProps } from "../../types/models/store";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";

export interface IGiftEntry extends IStoreGift {
  users: IStoreApplicant[];
  totalCnt: number;
}

function StorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as "pending" | "end";
  const newSearchParams = new URLSearchParams(searchParams);

  const [tab, setTab] = useState<"pending" | "end">("pending");
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const [cards, setCards] = useState<StoreGiftProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useStoreQuery(tab, cursor);

  useEffect(() => {
    if (!statusParam) {
      newSearchParams.set("status", "pending");
      router.replace(`/store?${newSearchParams.toString()}`);
    }
  }, [statusParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    setIsLoading(true);
    setCards([]);
    newSearchParams.set("status", tab);
    router.replace(`/store?${newSearchParams.toString()}`);
    return () => clearTimeout(timer);
  }, [tab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    if (!cards.length) {
      setIsLoading(true);
    }
    return () => clearTimeout(timer);
  }, [cards]);

  useEffect(() => {
    if (data && firstLoad.current) firstLoad.current = false;
    if (data) {
      setCards((old) => [...old, ...data]);
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prev) => prev + 1);
        }
      },
      { threshold: 0 }, // ← 여기만 수정
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
      observer.disconnect();
    };
  }, []);

  const onClickGift = (item: StoreGiftProps) => {
    router.push(`/store/${item._id}`);
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "현재 상품",
      func: () => {
        setTab("pending");
        setCursor(0);
      },
    },
    {
      text: "지난 상품",
      func: () => {
        setTab("end");
        setCursor(0);
      },
    },
  ];

  const { data: prizeData } = usePrizeQuery(0, "store");
  console.log(52, prizeData);
  const textArr = shuffleArray(prizeData)
    ?.filter((props) => props.description.split(" "))
    ?.slice(0, 5)
    ?.map((props) => ({
      name: props.winner.name,
      gift: props.gift,
    }));

  return (
    <>
      <Header title="포인트 스토어" url="/home">
        <PointGuideModalButton type="store" />
      </Header>
      <Slide isNoPadding>
        <Box minH="100dvh">
          <Box mb={3}>
            <WinnerTextSlider textArr={textArr} />
          </Box>
          <TabNav tabOptionsArr={tabNavOptions} isFullSize isBlack size="md" />

          <Box px={5} mt={5}>
            {!isLoading ? (
              <Grid gap={4} templateColumns="repeat(2,1fr)" templateRows="repeat(2,1fr)">
                {cards?.map((item, idx) => {
                  const winUsers = item.winner;
                  const isMyWin = winUsers.some((user) => user?.uid === session?.user.uid);

                  const totalCnt = item.applicants.reduce((acc, cur) => {
                    return acc + cur.cnt;
                  }, 0);

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
                            // transform: item?.type === "ticket" ? "scale(0.5)" : "none",
                          }}
                        />

                        {item.max <= totalCnt && (
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
                          {totalCnt}/{item.max}
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
                            {item.winnerCnt}
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

        <div ref={loader} />
        {isLoading ? (
          <Box position="relative" mt={5}>
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Slide>
    </>
  );
}

export default StorePage;
