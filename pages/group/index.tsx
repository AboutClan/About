import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import SectionHeader from "../../components/atoms/SectionHeader";
import Select from "../../components/atoms/Select";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
// import RuleModal from "../../components/modals/RuleModal";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import {
  GROUP_STUDY_CATEGORY_ARR,
  GROUP_STUDY_SUB_CATEGORY,
} from "../../constants/contentsText/GroupStudyContents";
import { GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import GroupMine from "../../pageTemplates/group/GroupMine";
import GroupSkeletonMain from "../../pageTemplates/group/GroupSkeletonMain";
import { GroupCategory, IGroup } from "../../types/models/groupTypes/group";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";

interface ICategory {
  main: GroupCategory;
  sub: string | null;
}

function GroupPage() {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const categoryIdx = searchParams.get("category");
  const filterType = searchParams.get("filter") as "pending" | "end";
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [status, setStatus] = useState<"모집중" | "종료">("모집중");
  const [category, setCategory] = useState<ICategory>({
    main: categoryIdx !== null ? GROUP_STUDY_CATEGORY_ARR[categoryIdx] : "전체",
    sub: null,
  });

  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const [groupStudies, setGroupStudies] = useState<IGroup[]>([]);
  const [myGroups, setMyGroups] = useState<IGroup[]>();
  const [cursor, setCursor] = useState(0);
  const { data: groups, isLoading } = useGroupQuery(filterType, category.main, cursor, {
    enabled: !!filterType,
  });

  useEffect(() => {
    setCursor(0);
    setGroupStudies([]);
  }, [filterType, category.main]);

  useEffect(() => {
    localStorage.setItem(GROUP_WRITING_STORE, null);
    setCategory({
      main: categoryIdx !== null ? GROUP_STUDY_CATEGORY_ARR[categoryIdx] : "전체",
      sub: null,
    });
    const filterToStatus: Record<string, "모집중" | "종료"> = {
      pending: "모집중",
      end: "종료",
    };
    setStatus(filterType ? filterToStatus[filterType] : "모집중");
    if (!searchParams.get("filter")) {
      newSearchParams.append("filter", "pending");
      newSearchParams.append("category", "0");
      router.replace(`/group?${newSearchParams.toString()}`);
    }
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
    const statusToEn = {
      모집중: "pending",
      종료: "end",
    };
    newSearchParams.set("filter", statusToEn[status]);
    router.replace(`/group?${newSearchParams.toString()}`);
  }, [status]);

  useEffect(() => {
    if (!groups) return;
    firstLoad.current = false;
    if (category.main !== "전체") return;
    setGroupStudies((old) => [...shuffleArray(groups), ...old]);
  }, [groups, category.main]);

  useEffect(() => {
    if (!groups || category.main === "전체") return;
    setGroupStudies(groups.filter((item) => !category.sub || item.category.sub === category.sub));
  }, [category.sub, groups]);

  useEffect(() => {
    if (isGuest) setMyGroups([]);
    else if (groupStudies.length && !myGroups) {
      setMyGroups(
        groupStudies.filter((item) =>
          item.participants.some((who) => {
            if (!who?.user?.uid) {
              return;
            }

            return who.user.uid === session?.user.uid;
          }),
        ),
      );
    }
  }, [groupStudies, session?.user]);

  const mainTabOptionsArr: ITabNavOptions[] = GROUP_STUDY_CATEGORY_ARR.map((category, idx) => ({
    text: category,
    func: () => {
      newSearchParams.set("category", idx + "");
      router.replace(`/group?${newSearchParams.toString()}`, {
        scroll: false,
      });
      setCategory({
        main: GROUP_STUDY_CATEGORY_ARR[idx],
        sub: null,
      });
    },
  }));

  function StatusSelector() {
    return (
      <Select
        size="md"
        isEllipse={false}
        defaultValue={status}
        setValue={setStatus}
        options={["모집중", "종료"]}
      />
    );
  }

  return (
    <>
      <Header title="소모임" isBack={false} />
      <Slide isNoPadding>
        <Layout>
          <GroupMine myGroups={myGroups} />
          <Box px={5} mt={5} mb={3}>
            <SectionHeader title="전체 소모임" subTitle="All Small Group">
              <Select
                size="sm"
                isThick
                defaultValue={status}
                options={["모집중", "종료"]}
                setValue={setStatus}
              />
            </SectionHeader>
          </Box>
          <Box borderBottom="var(--border)" px={5} mb={2}>
            <TabNav isBlack selected={category.main} tabOptionsArr={mainTabOptionsArr} isMain />
          </Box>

          {category.main !== "전체" && (
            <Box px={5} py={3}>
              <ButtonGroups
                buttonOptionsArr={GROUP_STUDY_SUB_CATEGORY[category.main].map((prop) => ({
                  icon: (
                    <CheckCircleIcon
                      color={category.sub === prop ? "mint" : "gray"}
                      size="sm"
                      isFill
                    />
                  ),
                  text: prop,
                  func: () => setCategory((old) => ({ ...old, sub: prop })),
                }))}
                currentValue={category.sub}
                isEllipse
                size="md"
              />
              {/* <CheckBoxNav
              buttonList={GROUP_STUDY_SUB_CATEGORY[category.main]}
              selectedButton={category.sub}
              setSelectedButton={(value: string) => setCategory((old) => ({ ...old, sub: value }))}
            /> */}
            </Box>
          )}
          <Box minH="1000px">
            {!groupStudies.length && isLoading ? (
              <GroupSkeletonMain />
            ) : (
              <Flex direction="column" p={5}>
                {groupStudies
                  ?.slice()
                  ?.reverse()
                  ?.map((group, idx) => (
                    <Box key={group.id} pb={3} mb={3} borderBottom="var(--border)">
                      <GroupThumbnailCard
                        title={group.title}
                        text={group.guide}
                        status={group.status}
                        category={group.category}
                        participants={group.participants.map((user) =>
                          group.isSecret ? ABOUT_USER_SUMMARY : user,
                        )}
                        imageProps={{ image: group.image, isPriority: idx < 4 }}
                        maxCnt={group.memberCnt.max}
                        id={group.id}
                      />
                    </Box>
                  ))}
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

const Layout = styled.div`
  min-height: 100vh;

  padding-bottom: 60px;
`;

const NavWrapper = styled.div`
  padding: 0px 20px;
  background: white;
`;

const SubNavWrapper = styled.div``;

export default GroupPage;
