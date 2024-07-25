import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Selector from "../../components/atoms/Selector";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
// import RuleModal from "../../components/modals/RuleModal";
import SectionBar from "../../components/molecules/bars/SectionBar";
import CheckBoxNav from "../../components/molecules/CheckBoxNav";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import {
  GROUP_STUDY_CATEGORY_ARR,
  GROUP_STUDY_SUB_CATEGORY,
} from "../../constants/contentsText/GroupStudyContents";
import { GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import GroupBlock from "../../pageTemplates/group/GroupBlock";
import GroupMine from "../../pageTemplates/group/GroupMine";
import GroupSkeletonMain from "../../pageTemplates/group/GroupSkeletonMain";
import GroupSkeletonMine from "../../pageTemplates/group/GroupSkeletonMine";
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
    if (!groups || category.main !== "전체") return;
    setGroupStudies((old) => [...shuffleArray(groups), ...old]);
  }, [groups, category.main]);

  useEffect(() => {
    if (!groups) return;
    firstLoad.current = false;

    setGroupStudies(groups.filter((item) => !category.sub || item.category.sub === category.sub));
  }, [category.sub, groups]);

  useEffect(() => {
    if (!isGuest && groupStudies.length && !myGroups) {
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
    return <Selector defaultValue={status} setValue={setStatus} options={["모집중", "종료"]} />;
  }

  return (
    <>
      <Header title="소모임" url="/home" isBack={false} />
      <Slide>
        <Layout>
          {!myGroups ? <GroupSkeletonMine /> : <GroupMine myGroups={myGroups} />}
          <SectionBar title="전체 소모임" rightComponent={<StatusSelector />} />
          <NavWrapper>
            <TabNav selected={category.main} tabOptionsArr={mainTabOptionsArr} isMain />
          </NavWrapper>
          <SubNavWrapper>
            <CheckBoxNav
              buttonList={GROUP_STUDY_SUB_CATEGORY[category.main]}
              selectedButton={category.sub}
              setSelectedButton={(value: string) => setCategory((old) => ({ ...old, sub: value }))}
            />
          </SubNavWrapper>
          <Box minH="1000px">
            {!groupStudies.length && isLoading ? (
              <GroupSkeletonMain />
            ) : (
              <Main>
                {groupStudies
                  ?.slice()
                  ?.reverse()
                  ?.map((group) => <GroupBlock group={group} key={group.id} />)}
              </Main>
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
  background-color: var(--gray-100);
  padding-bottom: 60px;
`;

const NavWrapper = styled.div`
  padding: 12px 16px;
`;

const SubNavWrapper = styled.div``;

const Main = styled.main`
  margin: 8px var(--gap-4);
`;

export default GroupPage;
