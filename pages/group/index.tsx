import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import SectionHeader from "../../components/atoms/SectionHeader";
import Select from "../../components/atoms/Select";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { GroupCategoryMain } from "../../constants/contentsText/GroupContents";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import GroupMine from "../../pageTemplates/group/GroupMine";
import GroupSkeletonMain from "../../pageTemplates/group/GroupSkeletonMain";
import { GroupStatus, IGroup } from "../../types/models/groupTypes/group";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { getGroupParticipantCount } from "../../utils/groupUtils";

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
  { title: "공부·자기계발" },
  { title: "취미" },
  { title: "문화·놀거리" },
  { title: "친목" },
  { title: "스터디 크루" },
];

const PAGE_SIZE = 8;

// 탭에 진입할 때마다 새로 뽑는 랜덤 시드. 같은 시드로 cursor만 늘려가며 요청하면
// 서버가 시드 기준의 안정적인 랜덤 순서로 중복/스킵 없이 끝까지 페이지를 내려준다.
const generateSeed = () => Math.random().toString(36).slice(2);

function GroupPage() {
  const router = useRouter();
  const statusParam = router.query.filter as string | undefined;
  const statusFromParam =
    statusParam && enToStatus[statusParam] ? enToStatus[statusParam] : "모집중";
  const categoryIdx = (router.query.category as string | undefined) || "0";
  const userInfo = useUserInfo();
  const isGuest = userInfo?.role === "guest";

  // const setBackUrl = useSetRecoilState(backUrlState);

  const [status, setStatus] = useState<Status>(statusFromParam);
  const [groupStudies, setGroupStudies] = useState<IGroup[]>([]);
  const [cursor, setCursor] = useState(0);
  const [seed, setSeed] = useState(generateSeed);
  const [category, setCategory] = useState<GroupCategoryMain | "전체">("전체");

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);
  const hasMoreRef = useRef(true);

  const { data: groups, isLoading, isFetching } = useGroupQuery(
    status === "모집중" ? "pending" : status === "오픈 예정" ? "planned" : "end",
    category,
    cursor,
    seed,
    {
      enabled: !!status,
    },
  );

  useEffect(() => {
    if (!router.isReady) return;
    const idx = Number(categoryIdx);
    const resolved = !Number.isNaN(idx) && categoryArr[idx] ? categoryArr[idx].title : "전체";
    setCategory(resolved as GroupCategoryMain | "전체");
  }, [router.isReady, categoryIdx]);

  useEffect(() => {
    // if (status) {
    //   setBackUrl(`/group?filter=${statusToEn[status]}`);
    // }
    setCursor(0);
    setSeed(generateSeed());
    setGroupStudies([]);
    hasMoreRef.current = true;
    // return () => {
    //   setBackUrl(null);
    // };
  }, [status, category]);

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

  const isFetchingRef = useRef(false);
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  // 렌더 중 동기적으로 firstLoad를 false로 설정
  // (useEffect보다 먼저 처리되어 observer 재생성 시 race condition 방지)
  if (groups !== undefined && firstLoad.current) {
    firstLoad.current = false;
  }

  useEffect(() => {
    if (!router.isReady || !loader.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (firstLoad.current) return;
        if (isFetchingRef.current) return;
        if (!hasMoreRef.current) return;

        isFetchingRef.current = true;

        setCursor((prevCursor) => prevCursor + 1);
      },
      { threshold: 0.5 },
    );

    observer.observe(loader.current);

    return () => {
      observer.disconnect();
    };
  }, [router.isReady, groups]);

  useEffect(() => {
    if (!groups) return;
    firstLoad.current = false;
    isFetchingRef.current = false;
    hasMoreRef.current = groups.length >= PAGE_SIZE;

    setGroupStudies((old) => [
      ...old,
      ...groups.filter((item) => !old.some((existingItem) => existingItem.id === item.id)),
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
      setCategory(categoryArr[idx].title as GroupCategoryMain);
    },
  }));

  return (
    <>
      <Header title="소모임" url="/home">
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
                    group.memberCnt.max !== 0 &&
                    group.memberCnt.max <= getGroupParticipantCount(group.participants)
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
  status: getGroupParticipantCount(group.participants) <= 2 ? "planned" : status,
  category: group.category,
  participants: group.participants
    .filter((par) => par?.user?._id !== ABOUT_USER_SUMMARY._id)
    .map((user) => (group.isSecret ? { user: ABOUT_USER_SUMMARY as UserSimpleInfoProps } : user)),
  imageProps: {
    image: group?.squareImage || GATHER_MAIN_IMAGE_ARR["공통"][0],
    isPriority: isPriority && idx < 4,
  },
  maxCnt: group.memberCnt.max,
  id: group.id,
  func,
  waitingCnt: getGroupParticipantCount(group.participants) <= 1 ? group.waiting.length : null,
  isFree: group.isFree,
});

export default GroupPage;
