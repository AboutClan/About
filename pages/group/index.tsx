import { Box, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
import { GROUP_CURSOR_NUM, GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import GroupMine from "../../pageTemplates/group/GroupMine";
import GroupSkeletonMain from "../../pageTemplates/group/GroupSkeletonMain";
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

/** cursor 수동으로 관리하고 있음. */

function GroupPage() {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const statusParam = searchParams.get("filter");
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";

  const categoryIdx = searchParams.get("category") || "0";

  const localStorageCursorNum = +localStorage.getItem(GROUP_CURSOR_NUM);

  const [status, setStatus] = useState<Status>(statusParam ? enToStatus[statusParam] : "모집중");
  const [groupStudies, setGroupStudies] = useState<IGroup[]>([]);

  const [cursor, setCursor] = useState(localStorageCursorNum);
  const [category, setCategory] = useState<GatherCategoryMain | "전체">("전체");

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data: groups, isLoading } = useGroupQuery(
    status === "모집중" ? "pending" : status === "오픈 예정" ? "planned" : "end",
    category,
    category === "전체" && status !== "오픈 예정" ? cursor : 0,
    {
      enabled: !!status,
    },
  );

  const categoryArr = [
    { title: "전체" },
    { title: "스터디" },
    { title: "자기계발" },
    { title: "감상" },
    { title: "소셜 게임" },
    { title: "운동" },
    { title: "말하기" },
    { title: "푸드" },
    { title: "힐링" },
    { title: "친목" },
    { title: "파티" },
  ];

  console.log(54, category, cursor, groups, localStorageCursorNum);
  useEffect(() => {
    return () => {
      const localStorageCursorNumChange = !localStorageCursorNum
        ? 1
        : localStorageCursorNum === 1
        ? 2
        : localStorageCursorNum === 2
        ? 3
        : localStorageCursorNum === 3
        ? 0
        : localStorageCursorNum;
      localStorage.setItem(GROUP_CURSOR_NUM, localStorageCursorNumChange + "");
    };
  }, []);

  useEffect(() => {
    setCursor(localStorageCursorNum);
    setGroupStudies([]);
  }, [status, category]);

  useEffect(() => {
    localStorage.setItem(GROUP_WRITING_STORE, null);
    setCategory(categoryIdx !== null ? categoryArr[categoryIdx].title : "전체");

    if (!searchParams.get("filter")) {
      newSearchParams.append("filter", "pending");
      newSearchParams.append("category", "0");
      router.replace(`/group?${newSearchParams.toString()}`);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
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
            if (nextCursor === localStorageCursorNum) {
              return prevCursor;
            }

            return nextCursor;
          });
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
    newSearchParams.set("filter", statusToEn[status]);
    router.replace(`/group?${newSearchParams.toString()}`);
  }, [status]);

  useEffect(() => {
    if (!groups) return;
    firstLoad.current = false;

    if (category === "전체") {
      const newArray = shuffleArray(groups);
      setGroupStudies((old) => [
        ...newArray.filter((item) => !old.some((existingItem) => existingItem.id === item.id)),
        ...old,
      ]);
    } else {
      setGroupStudies(groups);
    }
  }, [groups, category, category]);

  const mainTabOptionsArr: ITabNavOptions[] = categoryArr?.map((category, idx) => ({
    text: category.title,
    func: () => {
      newSearchParams.set("category", idx + "");
      router.replace(`/group?${newSearchParams.toString()}`, {
        scroll: false,
      });
      setCategory(categoryArr[idx].title as GatherCategoryMain);
    },
  }));

  return (
    <>
      <Header title="소모임" isBack={false}>
        <InfoModalButton type="group" />
      </Header>
      <Slide isNoPadding>
        <Layout>
          {!isGuest && (
            <Box minH="108px">
              <GroupMine />
            </Box>
          )}
          <Box px={5} mt={5} mb={3}>
            <SectionHeader title="전체 소모임" subTitle="All Small Group">
              <Select
                size="sm"
                isThick
                defaultValue={status}
                options={["모집중", "오픈 예정", "종료"]}
                setValue={setStatus}
              />
            </SectionHeader>
          </Box>
          <Box borderBottom="var(--border)" px={5} mb={2}>
            <TabNav isBlack selected={category} tabOptionsArr={mainTabOptionsArr} isMain />
          </Box>

          <Box minH="100dvh" p={5}>
            {!groupStudies.length && isLoading ? (
              [1, 2, 3, 4, 5].map((num) => <GroupSkeletonMain key={num} />)
            ) : (
              <Flex direction="column">
                {groupStudies
                  ?.slice()
                  ?.reverse()
                  ?.map((group, idx) => {
                    const status =
                      group.status === "end"
                        ? "end"
                        : group.memberCnt.max === 0
                        ? "pending"
                        : group.memberCnt.max <= group.participants.length
                        ? "full"
                        : group.memberCnt.max - 2 <= group.participants.length
                        ? "imminent"
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
        </Layout>
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

const Layout = styled.div`
  min-height: 100vh;
  padding-bottom: 60px;
`;

export default GroupPage;
