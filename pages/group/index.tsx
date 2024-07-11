import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import RuleIcon from "../../components/atoms/Icons/RuleIcon";
import Selector from "../../components/atoms/Selector";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
// import RuleModal from "../../components/modals/RuleModal";
import SectionBar from "../../components/molecules/bars/SectionBar";
import CheckBoxNav from "../../components/molecules/CheckBoxNav";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import {
  GROUP_STUDY_CATEGORY_ARR,
  GROUP_STUDY_RULE_CONTENT,
  GROUP_STUDY_SUB_CATEGORY,
} from "../../constants/contentsText/GroupStudyContents";
import { GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { useGroupQuery } from "../../hooks/groupStudy/queries";
import RuleModal from "../../modals/RuleModal";
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

function Index() {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const categoryIdx = searchParams.get("category");
  const filterType = searchParams.get("filter");
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [status, setStatus] = useState<"모집중" | "종료">("모집중");
  const [category, setCategory] = useState<ICategory>({
    main: categoryIdx !== null ? GROUP_STUDY_CATEGORY_ARR[categoryIdx] : "전체",
    sub: null,
  });

  const isFirstRender = useRef(true);

  const [groupStudies, setGroupStudies] = useState<IGroup[]>();
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [isRuleModal, setIsRuleModal] = useState(false);

  const { data: groups, isLoading } = useGroupQuery();

  useEffect(() => {
    localStorage.setItem(GROUP_WRITING_STORE, null);
    setCategory({
      main: categoryIdx !== null ? GROUP_STUDY_CATEGORY_ARR[categoryIdx] : "전체",
      sub: null,
    });

    const filterToStatus = {
      open: "모집중",
      gathering: "소그룹",
      end: "종료",
    };

    setStatus(filterType ? filterToStatus[filterType] : "모집중");
    if (!searchParams.get("filter")) {
      newSearchParams.append("filter", "open");
      newSearchParams.append("category", "0");
      router.replace(`/group?${newSearchParams.toString()}`);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 첫 렌더링 후에 false로 설정
      return; // 첫 렌더링 시에는 여기서 종료
    }
    const statusToEn = {
      모집중: "open",
      소그룹: "gathering",
      종료: "end",
    };

    newSearchParams.set("filter", statusToEn[status]);
    router.replace(`/group?${newSearchParams.toString()}`);
  }, [status]);

  useEffect(() => {
    if (!groups) return;
    if (!isGuest) {
      setMyGroups(
        groups.filter((item) =>
          item.participants.some((who) => {
            if (!who?.user?.uid) {
              return;
            }
            return who.user.uid === session?.user.uid;
          }),
        ),
      );
    }

    const filtered =
      category.main === "전체"
        ? groups
        : groups.filter(
            (item) =>
              (item.category.main === category.main && !category.sub) ||
              item.category.sub === category.sub,
          );

    const filtered2 =
      status === "모집중"
        ? filtered.filter((item) => item.status === "open" || item.status === "pending")
        : status === "종료"
          ? filtered.filter((item) => item.status === "end")
          : filtered;

    setGroupStudies(shuffleArray(filtered2));
  }, [category, groups, isGuest, status, session?.user]);

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
      <Header title="소모임" url="/home" isBack={false}>
        <RuleIcon setIsModal={setIsRuleModal} />
      </Header>

      <Slide>
        <Layout>
          {!groupStudies ? <GroupSkeletonMine /> : <GroupMine myGroups={myGroups} />}
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
          <>
            {isLoading ? (
              <GroupSkeletonMain />
            ) : (
              <Main>
                {groupStudies
                  ?.slice()
                  ?.reverse()
                  ?.map((group) => <GroupBlock group={group} key={group.id} />)}
              </Main>
            )}
          </>
        </Layout>
      </Slide>

      {isRuleModal && <RuleModal content={GROUP_STUDY_RULE_CONTENT} setIsModal={setIsRuleModal} />}
    </>
  );
}

const Layout = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
  padding-bottom: 40px;
`;

const NavWrapper = styled.div`
  padding: 12px 16px;
`;

const SubNavWrapper = styled.div``;

const Main = styled.main`
  margin: 8px var(--gap-4);
`;

export default Index;
