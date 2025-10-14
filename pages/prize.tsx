import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Fragment, useEffect, useRef, useState } from "react";

import Avatar from "../components/atoms/Avatar";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import IconRowBlock2 from "../components/molecules/IconRowBlock2";
import { usePrizeQuery } from "../constants/prize/queries";
import { HomeIcon, RankingIconImage, StoreIconImage } from "../pageTemplates/home/HomeNav";
import { dayjsToFormat, dayjsToStr } from "../utils/dateTimeUtils";

function Prize() {
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const [cards, setCards] = useState([]);

  const { data, isLoading } = usePrizeQuery(cursor, null);

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

  let stepDate: string;

  return (
    <>
      <Header title="이벤트 당첨 기록" />{" "}
      <Slide isNoPadding>
        <Box minH="100dvh">
          {cards?.length &&
            cards?.map((log, idx) => {
              const timeStamp = dayjs(log.date);
              const timeStr = dayjsToStr(timeStamp);

              if (!stepDate || timeStr !== stepDate) {
                const isFirst = !stepDate;
                stepDate = timeStr;

                const block = (
                  <Fragment key={idx}>
                    <Box
                      mt={!isFirst && 5}
                      pt={5}
                      borderTop={!isFirst && "var(--border-main)"}
                      fontSize="11px"
                      lineHeight="12px"
                      color="gray.500"
                      px={5}
                      key={idx}
                    >
                      {dayjsToFormat(dayjs(log.date).locale("ko"), "M월 D일 (ddd)")}
                    </Box>
                    <IconRowBlock2
                      text={log.gift}
                      time={
                        log.category === "ranking"
                          ? "월간 랭킹 상품"
                          : log.category === "store"
                          ? "스토어 당첨 선물"
                          : ""
                      }
                      leftChildren={
                        <HomeIcon
                          title={null}
                          image={
                            log.category === "store"
                              ? StoreIconImage
                              : log.category === "ranking"
                              ? RankingIconImage
                              : null
                          }
                          bgColor={
                            log.category === "store"
                              ? "var(--color-mint)"
                              : log.category === "ranking"
                              ? "var(--color-purple)"
                              : null
                          }
                        />
                      }
                      rightChildren={
                        <Flex flexDir="column" align="center" justify="center">
                          <Avatar user={{ ...log.winner }} size="xs1" />
                          <Box fontSize="10px" mt={1}>
                            {log.winner.name}
                          </Box>
                        </Flex>
                      }
                    />
                  </Fragment>
                );

                // stepValue -= log.meta.value;
                return block;
              } else {
                const block = (
                  <IconRowBlock2
                    text={log.gift.includes("point") ? "+" + log.gift : log.gift}
                    time={
                      log.category === "ranking"
                        ? "월간 랭킹 상품"
                        : log.category === "store"
                        ? "스토어 당첨 선물"
                        : ""
                    }
                    rightChildren={
                      <Flex flexDir="column" align="center">
                        <Avatar user={{ ...log.winner }} size="xs1" />
                        <Box fontSize="10px" mt={1}>
                          {log.winner.name}
                        </Box>
                      </Flex>
                    }
                    key={idx}
                    leftChildren={
                      <HomeIcon
                        title={null}
                        image={
                          log.category === "store"
                            ? StoreIconImage
                            : log.category === "ranking"
                            ? RankingIconImage
                            : null
                        }
                        bgColor={
                          log.category === "store"
                            ? "var(--color-mint)"
                            : log.category === "ranking"
                            ? "var(--color-purple)"
                            : null
                        }
                      />
                    }
                  />
                );
                // stepValue -= log.meta.value;
                return block;
              }
            })}
        </Box>
        <div ref={loader} />
      </Slide>
      {isLoading ? (
        <Box position="relative" mt={5}>
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : undefined}
    </>
  );
}

export default Prize;
