import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useToast } from "@/hooks/custom/CustomToast";
import { BOTTOM_NAV_HEIGHT_PX, getSafeAreaBottom } from "@/utils/validationUtils";

type TabId = "map" | "ranking" | "study" | "community" | "profile";

interface TabItem {
  id: TabId;
  label: string;
  isComingSoon?: boolean;
  icon: (isActive: boolean) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    id: "map",
    label: "지도",
    icon: (isActive) => <MapTabIcon isActive={isActive} />,
  },
  {
    id: "ranking",
    label: "랭킹",
    icon: (isActive) => <RankingTabIcon isActive={isActive} />,
  },
  {
    id: "study",
    label: "스터디",
    icon: (isActive) => <StudyTabIcon isActive={isActive} />,
  },
  {
    id: "community",
    label: "커뮤니티",
    icon: (isActive) => <CommunityTabIcon isActive={isActive} />,
  },
  {
    id: "profile",
    label: "마이페이지",
    icon: (isActive) => <ProfileTabIcon isActive={isActive} />,
  },
];

export default function CafeMapBottomNav() {
  const router = useRouter();
  const toast = useToast();
  const activeTab: TabId = (router.query.tab as TabId) || "map";

  const handleTabClick = (tab: TabItem) => {
    if (tab.isComingSoon) {
      toast("info", `${tab.label}는 9월 30일 오픈 예정이에요!`);
      return;
    }
    if (activeTab === tab.id) return;

    if (tab.id === "map") {
      router.replace("/cafe-map");
    } else {
      router.replace({ pathname: "/cafe-map", query: { tab: tab.id } });
    }
  };

  return (
    <Flex
      w="full"
      pos="fixed"
      bottom={0}
      h={`${BOTTOM_NAV_HEIGHT_PX}px`}
      bg="white"
      zIndex={10}
      pb={getSafeAreaBottom(0)}
      boxSizing="content-box"
      borderTop="var(--border-main)"
      maxW="var(--max-width)"
      m="0 auto"
      left={0}
      right={0}
      boxShadow="0px -2px 8px rgba(0,0,0,0.05)"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id && !tab.isComingSoon;
        const textColor = tab.isComingSoon
          ? "var(--gray-300)"
          : isActive
          ? "var(--color-mint)"
          : "var(--gray-400)";

        return (
          <Flex
            key={tab.id}
            flex={1}
            direction="column"
            align="center"
            justify="center"
            cursor={tab.isComingSoon ? "default" : "pointer"}
            onClick={() => handleTabClick(tab)}
            py={2}
            userSelect="none"
          >
            <Box pos="relative" display="flex" alignItems="center" justifyContent="center">
              {tab.icon(isActive)}
            </Box>
            <Box as="span" mt="2px" fontSize="11px" color={textColor} lineHeight="14px">
              {tab.label}
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
}

function MapTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
    </svg>
  );
}

function CommunityTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M280-240q-17 0-28.5-11.5T240-280v-80h520v-360h80q17 0 28.5 11.5T880-680v503q0 27-24.5 37.5T812-148l-92-92H280Zm-40-200-92 92q-19 19-43.5 8.5T80-377v-463q0-17 11.5-28.5T120-880h520q17 0 28.5 11.5T680-840v360q0 17-11.5 28.5T640-440H240Zm360-80v-280H160v280h440Zm-440 0v-280 280Z" />
    </svg>
  );
}

function StudyTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
    </svg>
  );
}

function RankingTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M536.5-543.5Q560-567 560-600t-23.5-56.5Q513-680 480-680t-56.5 23.5Q400-633 400-600t23.5 56.5Q447-520 480-520t56.5-23.5ZM440-200v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h120q17 0 28.5 11.5T680-160q0 17-11.5 28.5T640-120H320q-17 0-28.5-11.5T280-160q0-17 11.5-28.5T320-200h120ZM280-528v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
    </svg>
  );
}

function ProfileTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
    </svg>
  );
}
