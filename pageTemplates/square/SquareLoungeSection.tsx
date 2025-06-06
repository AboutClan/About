import { Box, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Select from "../../components/atoms/Select";
import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import FeedLayout, { FeedLayoutProps } from "../../components/organisms/FeedLayout";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useFeedsQuery } from "../../hooks/feed/queries";
import { convertFeedToLayout } from "../../libs/convertFeedToLayout";
import { FeedProps, FeedType } from "../../types/models/feed";

function SquareLoungeSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const categoryParam = searchParams.get("category") as FeedType | undefined;
  const drawerParam = searchParams.get("drawer");
  const typeToast = useTypeToast();

  const [category, setCategory] = useState<FeedType | "all">();
  const [loungeData, setLoungeData] = useState<FeedProps[]>();
  const [cursor, setCursor] = useState(0);

  const [subCategory, setSubCategory] = useState<"최신순" | "예전순">("최신순");
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const scrollId = searchParams.get("scroll");

  const {
    data: feeds,
    isLoading,
    refetch,
  } = useFeedsQuery(category === "all" ? null : category, null, cursor, subCategory === "최신순");
  console.log(feeds, category, cursor, subCategory);
  useEffect(() => {
    if (categoryParam) {
      setLoungeData(null);
      setCursor(0);
      setCategory(categoryParam);
    } else {
      newSearchParams.append("category", "all");
      router.replace(`/gather?${newSearchParams}`);
    }
  }, [categoryParam, subCategory]);

  useEffect(() => {
    if (!feeds) return;
    firstLoad.current = false;

    setLoungeData((old) => {
      if (old?.length && !drawerParam) return [...old, ...(feeds as FeedProps[])];
      else return feeds as FeedProps[];
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

  useEffect(() => {
    if (scrollId && loungeData) {
      const element = document.getElementById(`review${scrollId}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const timeout = setTimeout(() => {
        newSearchParams.delete("scroll");
        router.replace(`/gather?${newSearchParams}`, { scroll: false });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [scrollId, loungeData]);

  const textObj: Record<FeedType | "all", string> = {
    all: "전체",
    gather: "번개 리뷰",
    group: "소모임",
  };

  const buttonOptionsArr: ButtonOptionsProps[] = (
    ["all", "gather", "group"] as (FeedType | "all")[]
  ).map((category) => {
    return {
      text: `${textObj[category]}`,
      func: () => {
        if (category === "group") {
          typeToast("inspection");
          return;
        }
        newSearchParams.set("category", category);
        router.replace(`/gather?${newSearchParams}`);
        setCategory(category);
      },
    };
  });

  return (
    <>
      <Box pb="60px">
        <Flex px={5} pt={1} pb={3} justify="space-between">
          <ButtonGroups
            buttonOptionsArr={buttonOptionsArr}
            currentValue={`${textObj[category]}`}
            size="sm"
            isEllipse
          />
          <Select
            defaultValue={subCategory}
            options={["최신순", "예전순"]}
            setValue={setSubCategory}
            isBorder={false}
            size="sm"
          />
        </Flex>
        <Box minH="calc(100dvh - 162px)">
          {loungeData ? (
            loungeData?.length ? (
              loungeData.map((feed, idx) => {
                const feedProps: FeedLayoutProps = convertFeedToLayout(feed);
                return (
                  <Box key={idx} id={`review${feed.typeId}`}>
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
            <Box mt="180px" position="relative">
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
    </>
  );
}

export default SquareLoungeSection;
