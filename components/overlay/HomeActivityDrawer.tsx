import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import {
  ActivityCategory,
  ActivityItem,
  HOME_ACTIVITY_ITEMS,
} from "../../constants/contents/groupInfo";
import { HOME_ACTIVITY_INTRO_POPUP_AT } from "../../constants/keys/localStorage";
import {
  SUPPORT_CATEGORY_LABEL,
  SUPPORT_CATEGORY_ORDER,
  SUPPORT_LIST,
  SupportCategory,
  SupportItem,
} from "../../constants/support";
import { getGroupKeyByValue } from "../../pageTemplates/gather/GatherMain";
import {
  HOME_ACTIVITY_DRAWER_QUERY_KEY,
  HomeActivityDrawerTab,
  transferHomeActivityDrawerOpenState,
  transferHomeActivityDrawerTabState,
} from "../../recoils/transferRecoils";
import RightDrawer from "../organisms/drawer/RightDrawer";

const CATEGORY_ORDER: ActivityCategory[] = ["hobby", "study", "social"];

const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  study: "공부",
  hobby: "취미",
  social: "친목",
};

// 실제 소모임 대분류(GatherMain.tsx의 GROUP_MAPPING)를 홈 팝업용 3분류로 축약한다.
// 스터디/자기계발 → study, 취미/문화·감상 → hobby, 액티비티/친목 → social
const GROUP_KEY_TO_ACTIVITY_CATEGORY: Record<string, ActivityCategory> = {
  스터디: "study",
  자기계발: "study",
  취미: "hobby",
  "문화·감상": "hobby",
  액티비티: "social",
  친목: "social",
};

// GROUP_MAPPING에 없는 mainCategory(예: "기타")가 들어오면 이 값으로 분류한다.
const FALLBACK_ACTIVITY_CATEGORY: ActivityCategory = "hobby";

function resolveActivityCategory(item: ActivityItem): ActivityCategory {
  const groupKey = getGroupKeyByValue(item.mainCategory);
  return GROUP_KEY_TO_ACTIVITY_CATEGORY[groupKey] ?? FALLBACK_ACTIVITY_CATEGORY;
}

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
      itemsByCategory[resolveActivityCategory(item)].push(item);
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

  if (!isOpen) return null;

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
          참여 가능한 소모임: <b>{totalCnt}개</b>
        </Box>
        <Box mt={1} fontSize="13px" color="var(--gray-500)">
          공부 · 취미 · 친목 소모임을 한눈에 둘러보세요
        </Box>
      </Box>

      <Flex
        position="sticky"
        top={isNavigationDisabled ? "var(--header-h)" : "calc(var(--header-h) + 44px)"}
        bg="white"
        zIndex={1}
        gap={2}
        py={2}
        mb={2}
      >
        {categorizedItems.map(({ category }) => (
          <Button
            key={category}
            size="sm"
            h="32px"
            px={4}
            borderRadius="full"
            variant="outline"
            borderColor="var(--gray-800)"
            color="var(--gray-800)"
            fontSize="13px"
            fontWeight={600}
            _hover={{ bg: "var(--gray-100)" }}
            _active={{ bg: "var(--gray-800)", color: "white" }}
            onClick={() => onClickFilter(category)}
          >
            {CATEGORY_LABEL[category]}
          </Button>
        ))}
      </Flex>

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
              {CATEGORY_LABEL[category]} 소모임
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
  const sectionRefs = useRef<Partial<Record<SupportCategory, HTMLDivElement | null>>>({});

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

  const totalCnt = SUPPORT_LIST.length;

  const scrollToCategory = (category: SupportCategory) => {
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box px={5} pb={10} mt={0}>
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
              {SUPPORT_CATEGORY_LABEL[category]} 제휴 업체
            </Box>
            <Box fontSize="13px" color="var(--gray-500)">
              {items.length}
            </Box>
          </Flex>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {items.map((item) => (
              <SupportCard key={item.id} item={item} isNavigationDisabled={isNavigationDisabled} />
            ))}
          </Grid>
        </Box>
      ))}
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
