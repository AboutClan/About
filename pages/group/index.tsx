import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import SectionHeader from "../../components/atoms/SectionHeader";
import Select from "../../components/atoms/Select";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { GatherCategoryMain } from "../../constants/contentsText/GatherContents";
import { GROUP_CURSOR_NUM } from "../../constants/keys/localStorage";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import GroupMine from "../../pageTemplates/group/GroupMine";
import GroupSkeletonMain from "../../pageTemplates/group/GroupSkeletonMain";
import { backUrlState } from "../../recoils/navigationRecoils";
import { GroupStatus, IGroup } from "../../types/models/groupTypes/group";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";
import { getRandomImage } from "../../utils/imageUtils";

type Status = "모집중" | "종료" | "오픈 예정";

const statusToEn: Record<Status, string> = {
  모집중: "pending",
  종료: "end",
  "오픈 예정": "expected",
};
const enToStatus: Record<string, Status> = Object.entries(statusToEn).reduce(
  (acc, [key, value]) => {
    acc[value] = key as Status; // key를 Status 타입으로 캐스팅
    return acc;
  },
  {} as Record<string, Status>,
);

const categoryArr = [
  { title: "전체" },
  { title: "공부 · 자기계발" },

  { title: "영화 · 전시 · 공연" },
  { title: "소셜 게임" },
  { title: "스포츠" },
  { title: "취미 · 창작" },
  // { title: "말하기" },
  { title: "푸드" },
  // { title: "힐링" },
  { title: "친목" },
  // { title: "파티" },
];

const getInitialCursor = () => {
  if (typeof window === "undefined") return 0;
  const saved = window.localStorage.getItem(GROUP_CURSOR_NUM);
  const num = Number(saved);
  if (!Number.isFinite(num) || num < 0) return 0;
  // 0~3로만 제한
  return num % 4;
};

function GroupPage() {
  const router = useRouter();
  const statusParam = router.query.filter as string | undefined;
  const statusFromParam =
    statusParam && enToStatus[statusParam] ? enToStatus[statusParam] : "모집중";
  const categoryIdx = (router.query.category as string | undefined) || "0";
  const localStorageCursorNum = getInitialCursor();
  const userInfo = useUserInfo();
  const isGuest = userInfo?.role === "guest";

  const setBackUrl = useSetRecoilState(backUrlState);

  const [status, setStatus] = useState<Status>(statusFromParam);
  const [groupStudies, setGroupStudies] = useState<IGroup[]>([]);
  const [cursor, setCursor] = useState(status === "모집중" ? localStorageCursorNum : 0);
  const [category, setCategory] = useState<GatherCategoryMain | "전체">("전체");

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data: groups, isLoading } = useGroupQuery(
    status === "모집중" ? "pending" : status === "오픈 예정" ? "planned" : "end",
    category,
    cursor,
    {
      enabled: !!status,
    },
  );
  console.log("status", status, "cursor", cursor, "category", category);
  useEffect(() => {
    if (!router.isReady) return;
    const idx = Number(categoryIdx);
    const resolved = !Number.isNaN(idx) && categoryArr[idx] ? categoryArr[idx].title : "전체";
    setCategory(resolved as GatherCategoryMain | "전체");
  }, [router.isReady, categoryIdx]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      if (status === "모집중" && category === "전체") {
        // 0~3 사이에서만 다음 시작점을 돌리기
        const next = ((cursor % 4) + 1) % 4;
        // cursor: 0 → 1, 1 → 2, 2 → 3, 3 → 0, 4 → 1
        window.localStorage.setItem(GROUP_CURSOR_NUM, String(next));
      }
    };
  }, [cursor, status, category]);

  useEffect(() => {
    if (status) {
      setBackUrl(`/group?filter=${statusToEn[status]}`);
    }
    const baseCursor = status === "모집중" && category === "전체" ? getInitialCursor() : 0;
    setCursor(baseCursor);
    setGroupStudies([]);
  }, [status, category, setBackUrl]);

  useEffect(() => {
    if (!router.isReady) return;
    const { filter, category, ...rest } = router.query;
    if (filter && category) return; // 이미 둘 다 있으면 손대지 않음
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...rest,
          filter: filter ?? "pending",
          category: category ?? "0",
        },
      },
      undefined,
      { shallow: true },
    );
  }, [router.isReady, router.query, router.pathname]);

  useEffect(() => {
    if (!router.isReady) return;
    const nextFilter = statusToEn[status];
    const currentFilter = router.query.filter as string | undefined;

    if (currentFilter === nextFilter) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          filter: nextFilter,
        },
      },
      undefined,
      { shallow: true },
    );
  }, [status, router]);

  useEffect(() => {
    if (!router.isReady) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          if (groups?.length < 8 && categoryIdx !== "0") return;
          setCursor((prevCursor) => {
            const nextCursor =
              prevCursor === 0
                ? 1
                : prevCursor === 1
                ? 2
                : prevCursor === 2
                ? 3
                : prevCursor === 3
                ? 4
                : 0;

            return nextCursor;
          });
        }
      },
      { threshold: 0.5 },
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [groups, categoryIdx, status, localStorageCursorNum, router.isReady]);

  useEffect(() => {
    if (!groups) return;
    firstLoad.current = false;

    const newArray = shuffleArray(groups);
    setGroupStudies((old) => [
      ...old,
      ...newArray.filter((item) => !old.some((existingItem) => existingItem.id === item.id)),
    ]);
  }, [groups]);

  const mainTabOptionsArr: ITabNavOptions[] = categoryArr.map((cat, idx) => ({
    text: cat.title,
    func: () => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            category: String(idx),
          },
        },
        undefined,
        { shallow: true },
      );
      setCategory(categoryArr[idx].title as GatherCategoryMain);
    },
  }));

  return (
    <>
      <Header title="소모임" isBack={false}>
        <InfoModalButton type="group" />
      </Header>
      <Slide isNoPadding>
        <Box minH="100vh" pb="60px">
          {!isGuest && (
            <Box minH="108px">
              <GroupMine />
            </Box>
          )}
          <Box px={5} mt={isGuest ? 2 : 5} mb={3}>
            <SectionHeader title="ABOUT 소모임" subTitle="관심사로 연결되는 지속성 모임">
              <Select
                size="sm"
                isThick
                defaultValue={status}
                options={["모집중", "오픈 예정", "종료"]}
                setValue={setStatus}
              />
            </SectionHeader>
          </Box>
          {status === "모집중" && (
            <Box borderBottom="var(--border)" px={5} mb={2}>
              <TabNav isBlack selected={category} tabOptionsArr={mainTabOptionsArr} isMain />
            </Box>
          )}

          <Box minH="100dvh" p={5}>
            {!groupStudies.length && isLoading ? (
              [1, 2, 3, 4, 5].map((num) => <GroupSkeletonMain key={num} />)
            ) : (
              <Flex direction="column">
                {groupStudies?.slice()?.map((group, idx) => {
                  const status =
                    group.memberCnt.max !== 0 && group.memberCnt.max <= group.participants.length
                      ? "full"
                      : group.status;

                  return (
                    <Box key={group.id} pb={3} mb={3} borderBottom="var(--border)">
                      <GroupThumbnailCard
                        {...createGroupThumbnailProps(group, status, idx, null, true)}
                      />
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Box>
          <div ref={loader} />
          {isLoading && groupStudies.length ? (
            <Box position="relative" mt="32px" mb="40px">
              <MainLoadingAbsolute size="sm" />
            </Box>
          ) : undefined}
        </Box>
      </Slide>
    </>
  );
}

export const createGroupThumbnailProps = (
  group: IGroup,
  status: GroupStatus,
  idx: number,
  func,
  isPriority,
) => ({
  title: group.title,
  text: group.guide,
  status: group.participants.length <= 2 ? "planned" : status,
  category: group.category,
  participants: group.participants.map((user) =>
    group.isSecret ? { user: ABOUT_USER_SUMMARY } : user,
  ),
  imageProps: {
    image: group?.squareImage || getRandomImage(GATHER_MAIN_IMAGE_ARR["공통"]),
    isPriority: isPriority && idx < 4,
  },
  maxCnt: group.memberCnt.max,
  id: group.id,
  func,
  waitingCnt: group.participants.length <= 1 ? group.waiting.length : null,
  isFree: group.isFree,
});

export default GroupPage;
