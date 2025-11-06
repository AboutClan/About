import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useFeedsQuery } from "../../hooks/feed/queries";
import { useGatherMyStatusQuery } from "../../hooks/gather/queries";
import GatherReviewDrawer from "../../modals/gather/gatherExpireModal/GatherReviewDrawer";
import { backUrlState } from "../../recoils/navigationRecoils";
import { FeedProps } from "../../types/models/feed";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import GatherSkeletonMain from "../gather/GatherSkeletonMain";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";
import UserGatherSectionReview from "./UserGatherSectionReview";

type GatherType = "참여중인 모임" | "종료된 모임" | "내가 개설한 모임";

function UserGatherSection() {
  const router = useRouter();
  const userInfo = useUserInfo();

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const setBackUrl = useSetRecoilState(backUrlState);
  const [isGatherReviewDrawer, setIsGatherReviewDrawer] = useState<{
    category: "gather" | "group";
    id: string;
  }>();

  const { data: gatherData } = useGatherMyStatusQuery(cursor);

  const { data: feed } = useFeedsQuery(
    isGatherReviewDrawer?.category,
    +isGatherReviewDrawer?.id,
    null,
    true,
    {
      enabled: !!isGatherReviewDrawer,
    },
  );

  useEffect(() => {
    if (gatherData?.length) {
      setGathers((old) => [...old, ...gatherData]);
      firstLoad.current = false;
    }
  }, [gatherData, cursor]);

  useEffect(() => {
    setIsLoading(true);
    if (!gathers?.length || !userInfo) return;

    const leftFunc = (hasReview: boolean, id: string, category: "gather" | "group") => {
      if (hasReview) {
        setIsGatherReviewDrawer({ category, id });
      } else {
        router.push(`/feed/writing/${category}?id=${id}`);
      }
    };
    const rightFunc = (id: string) => router.push(`/home/gatherReview?id=${id}`);
    setCardDataArr(
      setGatherDataToCardCol(
        gathers,
        true,
        () => setBackUrl("/user?tab=gather"),
        userInfo._id,
        leftFunc,
        rightFunc,
      ),
    );
    setIsLoading(false);
  }, [gathers, userInfo]);

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

  return (
    <>
      <Box mx={5} pb={10}>
        <UserGatherSectionReview />
        <Box position="relative" minH="1000px">
          {cardDataArr?.length ? (
            <>
              {cardDataArr.map((cardData, idx) => (
                <Box mb="12px" key={idx}>
                  <GatherThumbnailCard {...cardData} />
                </Box>
              ))}
            </>
          ) : isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <Box mb="12px" key={idx}>
                  <GatherSkeletonMain />
                </Box>
              ))}
            </>
          ) : (
            <Flex
              justify="center"
              align="center"
              fontSize="14px"
              fontWeight="medium"
              bg="gray.100"
              px={3}
              py={4}
              minH="114px"
              borderRadius="8px"
              color="gray.600"
              border="var(--border)"
            >
              현재 참여중인 모임이 없습니다.
            </Flex>
          )}
        </Box>
        <div ref={loader} />
        {isLoading && cardDataArr?.length ? (
          <Box position="relative" mt="32px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Box>
      {isGatherReviewDrawer && (
        <GatherReviewDrawer
          feed={feed as FeedProps}
          isOpen
          onClose={() => setIsGatherReviewDrawer(null)}
        />
      )}
    </>
  );
}

export default UserGatherSection;
