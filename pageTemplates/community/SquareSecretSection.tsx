import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import BlurredPart from "../../components/molecules/BlurredPart";
import {
  SecretSquareListResponse,
  useSecretSquareListQuery,
} from "../../hooks/secretSquare/queries";
import { CommunityCategory } from "../../pages/community";
import SquareItem from "./SquareItem";

interface SquareSecretSectionProps {
  category: CommunityCategory;
}

function SquareSecretSection({ category }: SquareSecretSectionProps) {
  const { data: session } = useSession();

  const [cursor, setCursor] = useState(0);
  const [sqaures, setSqaures] = useState<SecretSquareListResponse["squareList"]>([]);

  const isGuest = session?.user.role === "guest";
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data, isLoading } = useSecretSquareListQuery(
    { category, cursor },
    {
      enabled: (!!category && cursor === 0 && firstLoad.current) || cursor !== 0,
    },
  );

  useEffect(() => {
    firstLoad.current = true;
    setSqaures([]);
    setCursor(0);
  }, [category]);

  useEffect(() => {
    if (!data?.squareList?.length) return;

    const now = dayjs();

    const squareList = data.squareList.map((s) => {
      const createdAt = dayjs(s.createdAt);
      const elapsedMinutes = now.diff(createdAt, "minute");

      // 미래 시간 예외 방지
      if (elapsedMinutes <= 0) {
        return s;
      }

      // 각 게시물마다 증가 타이밍이 완전히 같지 않게 오프셋 부여
      const offset = createdAt.minute() % 10;

      // 조회수 증가 주기
      const intervalMinutes = 57;

      // 최대 추가 조회수 제한
      const maxExtraViews = 20;

      // offset 이후부터 interval마다 1씩 증가
      const extraViewCount = Math.max(
        0,
        Math.min(maxExtraViews, Math.floor((elapsedMinutes - offset) / intervalMinutes)),
      );

      return {
        ...s,
        viewCount: s.viewers?.length + extraViewCount,
      };
    });

    setSqaures((old) => [...old, ...squareList]);
    firstLoad.current = false;
  }, [data]);

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
      {/* <SecretSquareCategories type="secret" category={category} setCategory={setCategory} /> */}
      <Box pb="80px" pos="relative" minH="90dvh">
        {sqaures && sqaures.length === 0 && data ? (
          <Flex fontSize="18px" height="200px" justify="center" align="center">
            가장 먼저 &ldquo;#{category}&rdquo;에 글을 남겨보세요!
          </Flex>
        ) : (
          <>
            {sqaures.map((squareItem, idx) => (
              <BlurredPart key={idx} isBlur={!!isGuest}>
                <SquareItem item={squareItem} />
              </BlurredPart>
            ))}
          </>
        )}
        <div ref={loader} />
        {isLoading && (
          <Box position="relative" mt="80px" mb="40px">
            <MainLoading size="sm" />
          </Box>
        )}
      </Box>
    </>
  );
}

export default SquareSecretSection;
