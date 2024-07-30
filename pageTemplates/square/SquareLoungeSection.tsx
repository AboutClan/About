import { Box, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import ButtonGroups, { IButtonOptions } from "../../components/molecules/groups/ButtonGroups";
import FeedLayout, { FeedLayoutProps } from "../../components/organisms/FeedLayout";
import { useFeedsQuery } from "../../hooks/feed/queries";
import { convertFeedToLayout } from "../../libs/convertFeedToLayout";
import { FeedProps, FeedType } from "../../types/models/feed";

function SquareLoungeSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const categoryParam = searchParams.get("category") as FeedType | undefined;

  const [category, setCategory] = useState<FeedType | "all">();
  const [loungeData, setLoungeData] = useState<FeedProps[]>();
  const [cursor, setCursor] = useState(0);

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const {
    data: feeds,
    isLoading,
    refetch,
  } = useFeedsQuery(category === "all" ? null : category, null, cursor);

  useEffect(() => {
    if (categoryParam) {
      setLoungeData(null);
      setCursor(0);
      setCategory(categoryParam);
    } else {
      newSearchParams.append("category", "all");
      router.replace(`/square?${newSearchParams}`);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (!feeds) return;
    firstLoad.current = false;

    setLoungeData((old) => {
      if (old?.length) return [...old, ...(feeds as FeedProps[])];
      else return feeds;
    });
  }, [feeds, categoryParam]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prevCursor) => prevCursor + 1);
        }
      },
      { threshold: 1.0 },
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const textObj: Record<FeedType | "all", string> = {
    all: "전체",
    gather: "모임 리뷰",
    group: "소모임 활동",
  };

  const buttonItems: IButtonOptions[] = (["all", "gather", "group"] as (FeedType | "all")[]).map(
    (category) => {
      return {
        text: `${textObj[category]}`,
        func: () => {
          newSearchParams.set("category", category);
          router.replace(`/square?${newSearchParams}`);
          setCategory(category);
        },
      };
    },
  );

  return (
    <Box pb="60px">
      <Box p="12px 16px">
        <ButtonGroups
          buttonItems={buttonItems}
          currentValue={`${textObj[category]}`}
          size="sm"
          isEllipse
        />
      </Box>
      <Box minH="calc(100dvh - 162px)">
        {loungeData ? (
          loungeData?.length ? (
            loungeData.map((feed, idx) => {
              const feedProps: FeedLayoutProps = convertFeedToLayout(feed);
              return (
                <Box key={idx}>
                  <FeedLayout {...feedProps} refetch={() => refetch()} />
                </Box>
              );
            })
          ) : (
            <Flex fontSize="18px" height="200px" justify="center" align="center">
              게시된 피드가 없습니다.
            </Flex>
          )
        ) : (
          <Box bg="pink" mt="180px" position="relative">
            <MainLoadingAbsolute size="md" />
          </Box>
        )}
      </Box>

      <div ref={loader} />
      {isLoading && loungeData?.length ? (
        <Box position="relative" mt="32px" mb="40px">
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : undefined}
    </Box>
  );
}

export default SquareLoungeSection;
