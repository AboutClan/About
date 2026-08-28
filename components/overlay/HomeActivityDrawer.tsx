import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import {
  ActivityCategory,
  ActivityItem,
  HOME_ACTIVITY_ITEMS,
} from "../../constants/contents/groupInfo";
import { HOME_ACTIVITY_INTRO_POPUP_AT } from "../../constants/keys/localStorage";
import { MODAL_QUEUE_PRIORITY } from "../../constants/modalQueuePriority";
import {
  SUPPORT_CATEGORY_LABEL,
  SUPPORT_CATEGORY_ORDER,
  SUPPORT_LIST,
  SupportCategory,
  SupportItem,
} from "../../constants/support";
import { useSingleModalSlot } from "../../hooks/custom/useSingleModalSlot";
import {
  HOME_ACTIVITY_DRAWER_QUERY_KEY,
  HomeActivityDrawerTab,
  transferHomeActivityDrawerOpenState,
  transferHomeActivityDrawerTabState,
} from "../../recoils/transferRecoils";
import RightDrawer from "../organisms/drawer/RightDrawer";

// HOME_ACTIVITY_ITEMS의 mainCategory 값 자체가 group.category.main과 동일한 5분류라서
// 별도 라벨/변환 매핑 없이 그대로 분류 기준으로 쓴다.
const CATEGORY_ORDER: ActivityCategory[] = [
  "공부·자기계발",
  "취미",
  "문화·놀거리",
  "친목",
  "스터디 크루",
];

type PopupTab = HomeActivityDrawerTab;

const TAB_OPTIONS: { key: PopupTab; text: string }[] = [
  { key: "activity", text: "소모임" },
  { key: "benefit", text: "제휴 혜택" },
];

interface HomeActivityDrawerProps {
  // true면 카드/배너를 클릭해도 다른 경로로 이동하지 않고 단순 렌더링만 한다. (예: register/access)
  isNavigationDisabled?: boolean;
}

// 홈 화면 인트로 팝업, 홈/그룹 화면의 플로팅 버튼, 제휴 혜택 배너 등 여러 진입점에서 공유하는
// "소모임/제휴 혜택 한눈에 보기" Drawer.
// 열림 여부는 transferHomeActivityDrawerOpenState로 관리하되, useOpenHomeActivityDrawer가 열 때마다
// 라우터 쿼리(HOME_ACTIVITY_DRAWER_QUERY_KEY)에도 흔적을 남겨 히스토리를 만든다.
// 그래야 뒤로가기를 누르면 이 Drawer만 닫히고, Drawer에서 들어간 내부 페이지(예: /support/[id])에서
// 다시 뒤로가기를 누르면 쿼리가 남아있는 이 화면으로 돌아와 Drawer가 재오픈된다.
function HomeActivityDrawer({ isNavigationDisabled = false }: HomeActivityDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const drawerParam = searchParams?.get(HOME_ACTIVITY_DRAWER_QUERY_KEY) as HomeActivityDrawerTab;

  const [isOpen, setIsOpen] = useRecoilState(transferHomeActivityDrawerOpenState);
  const [tab, setTab] = useRecoilState(transferHomeActivityDrawerTabState);
  const sectionRefs = useRef<Partial<Record<ActivityCategory, HTMLDivElement | null>>>({});

  useEffect(() => {
    if (drawerParam) {
      setIsOpen(true);
      setTab(drawerParam);
    } else {
      setIsOpen(false);
    }
  }, [drawerParam]);

  const categorizedItems = useMemo(() => {
    const itemsByCategory = CATEGORY_ORDER.reduce(
      (acc, category) => ({ ...acc, [category]: [] as ActivityItem[] }),
      {} as Record<ActivityCategory, ActivityItem[]>,
    );

    HOME_ACTIVITY_ITEMS.forEach((item) => {
      itemsByCategory[item.mainCategory].push(item);
    });

    return CATEGORY_ORDER.map((category) => ({
      category,
      items: itemsByCategory[category],
    })).filter((group) => group.items.length > 0);
  }, []);

  const handleClose = () => {
    localStorage.setItem(HOME_ACTIVITY_INTRO_POPUP_AT, dayjs().toISOString());
    router.back();
    setIsOpen(false);
    setTab("activity");
  };

  const scrollToCategory = (category: ActivityCategory) => {
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // HomeInitialSetting이 관리하는 홈 화면 팝업들(강제 업데이트, 유저 설정 팝업들, 앱 설치 유도)이
  // 아직 결정 중이거나 이미 하나를 띄우고 있는 동안에는 이 Drawer가 그 위를 덮어버리지 않도록
  // 같은 전역 대기열에 후보로 등록한다.
  const isActive = useSingleModalSlot(
    "homeActivityDrawer",
    MODAL_QUEUE_PRIORITY.homeActivityDrawer,
    isOpen,
  );

  if (!isActive) return null;

  return (
    <RightDrawer
      title={tab === "activity" ? "소모임 둘러보기" : "제휴 혜택"}
      onClose={handleClose}
      stickyHeader
      px={false}
    >
      {/* {!isNavigationDisabled && (
        <Box
          position="sticky"
          top="var(--header-h)"
          bg="white"
          zIndex={2}
          borderBottom="var(--border)"
        >
          <TabNav
            isFullSize
            selected={TAB_OPTIONS.find((option) => option.key === tab)?.text}
            tabOptionsArr={TAB_OPTIONS.map((option) => ({
              text: option.text,
              func: () => setTab(option.key),
            }))}
          />
        </Box>
      )} */}

      <Box pb="88px">
        {isNavigationDisabled || tab === "activity" ? (
          <ActivityTab
            categorizedItems={categorizedItems}
            sectionRefs={sectionRefs}
            onClickFilter={scrollToCategory}
            isNavigationDisabled={isNavigationDisabled}
          />
        ) : (
          <BenefitTab isNavigationDisabled={isNavigationDisabled} />
        )}
      </Box>

      {/* <Flex
        position="fixed"
        bottom={0}
        right={0}
        w="100%"
        maxW="var(--max-width)"
        px={5}
        py={3}
        bg="white"
        borderTop="var(--border)"
      >
        <Button w="100%" size="lg" colorScheme="mint" onClick={handleClose}>
          {isNavigationDisabled ? "돌아가기" : "홈 화면으로"}
        </Button>
      </Flex> */}
    </RightDrawer>
  );
}

interface ActivityTabProps {
  categorizedItems: { category: ActivityCategory; items: ActivityItem[] }[];
  sectionRefs: React.MutableRefObject<Partial<Record<ActivityCategory, HTMLDivElement | null>>>;
  onClickFilter: (category: ActivityCategory) => void;
  isNavigationDisabled?: boolean;
}

function ActivityTab({
  categorizedItems,
  sectionRefs,
  onClickFilter,
  isNavigationDisabled,
}: ActivityTabProps) {
  const totalCnt = categorizedItems.flatMap((group) => group.items).length;

  return (
    <Box px={5} pb={10}>
      <Box pt={4} pb={3}>
        <Box fontSize="18px" fontWeight={700} color="var(--gray-800)">
          신규 멤버가 참여 가능한 소모임: <b>{totalCnt}개</b>
        </Box>
        <Box mt={1} fontSize="13px" color="var(--gray-500)">
          공부 · 자기계발 · 취미 · 문화·놀거리 · 친목 · 스터디 크루
          <br /> 여러 소모임을 한눈에 둘러보세요!
        </Box>
      </Box>

      {categorizedItems.map(({ category, items }) => (
        <Box
          key={category}
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current[category] = el;
          }}
          pt={3}
          pb={3}
        >
          <Flex align="baseline" mb={2} gap={1}>
            <Box fontSize="15px" fontWeight={700} color="var(--gray-800)">
              {category} 소모임
            </Box>
            <Box fontSize="13px" color="var(--gray-500)">
              {items.length}
            </Box>
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={2}>
            {items.map((item) => (
              <ActivityCard key={item.id} item={item} isNavigationDisabled={isNavigationDisabled} />
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

interface ActivityCardProps {
  item: ActivityItem;
  isNavigationDisabled?: boolean;
}

export function ActivityCard({ item, isNavigationDisabled }: ActivityCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const content = (
    <Box cursor={isNavigationDisabled ? "default" : "pointer"}>
      <Box
        position="relative"
        w="100%"
        aspectRatio="1 / 1"
        borderRadius="12px"
        overflow="hidden"
        bg="gray.100"
        boxShadow="0px 2px 6px 0px rgba(0,0,0,0.06)"
      >
        {!hasImageError && (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
            onError={() => setHasImageError(true)}
          />
        )}
      </Box>
      <Box
        mt={1.5}
        fontSize="12.5px"
        fontWeight={600}
        lineHeight="16px"
        color="var(--gray-800)"
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
        }}
      >
        {item.title}
      </Box>
      {!!item.activeMemberCnt && (
        <Box mt="2px" fontSize="11px" color="var(--gray-500)">
          {item.activeMemberCnt < 3 ? "오픈 준비중" : `${item.activeMemberCnt}명 참여중`}
        </Box>
      )}
    </Box>
  );

  if (isNavigationDisabled) return content;

  return (
    <Link href={`/group/${item.groupStudyId}`} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
}

function BenefitTab({ isNavigationDisabled }: { isNavigationDisabled?: boolean }) {
  const categorizedItems = useMemo(() => {
    const itemsByCategory = SUPPORT_CATEGORY_ORDER.reduce(
      (acc, category) => ({ ...acc, [category]: [] as SupportItem[] }),
      {} as Record<SupportCategory, SupportItem[]>,
    );

    SUPPORT_LIST.forEach((item) => {
      itemsByCategory[item.category].push(item);
    });

    return SUPPORT_CATEGORY_ORDER.map((category) => ({
      category,
      items: itemsByCategory[category],
    })).filter((group) => group.items.length > 0);
  }, []);

  return (
    <Box px={5} pb={10} mt={0}>
      <Flex align="stretch" gap={0}>
        {categorizedItems.map(({ category, items }, idx) => (
          <Fragment key={category}>
            <Flex flex={1} minW={0} direction="column" gap={2.5} px={2} pt={1}>
              <Flex direction="column" align="center" gap={1} pb={2.5} mb={0.5}>
                <Box
                  fontSize="12.5px"
                  fontWeight={700}
                  color="var(--gray-800)"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  {SUPPORT_CATEGORY_LABEL[category].replace(/[[\]]/g, "")}
                </Box>
                <Box fontSize="11px" fontWeight={600} color="var(--color-mint)">
                  {items.length}개
                </Box>
              </Flex>
              {items.map((item) => (
                <SupportCard
                  key={item.id}
                  item={item}
                  isNavigationDisabled={isNavigationDisabled}
                />
              ))}
            </Flex>
            {idx < categorizedItems.length - 1 && (
              <Box w="1px" alignSelf="stretch" bg="var(--gray-200)" />
            )}
          </Fragment>
        ))}
      </Flex>
    </Box>
  );
}

interface SupportCardProps {
  item: SupportItem;
  isNavigationDisabled?: boolean;
}

export function SupportCard({ item, isNavigationDisabled }: SupportCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const content = (
    <Box cursor={isNavigationDisabled ? "default" : "pointer"}>
      <Box
        position="relative"
        w="100%"
        aspectRatio="1 / 1"
        borderRadius="12px"
        overflow="hidden"
        bg="gray.100"
        boxShadow="0px 2px 6px 0px rgba(0,0,0,0.06)"
      >
        {!hasImageError && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
            onError={() => setHasImageError(true)}
          />
        )}
      </Box>
      <Box
        mt={1.5}
        fontSize="12.5px"
        fontWeight={600}
        lineHeight="16px"
        color="var(--gray-800)"
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
        }}
      >
        {item.name}
      </Box>
      <Box
        mt="2px"
        fontSize="11px"
        color="var(--gray-500)"
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
        }}
      >
        {item.summary}
      </Box>
    </Box>
  );

  if (isNavigationDisabled) return content;

  return (
    <Link href={`/support/${item.id}`} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
}

export default HomeActivityDrawer;
