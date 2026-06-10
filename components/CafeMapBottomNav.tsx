import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { getSafeAreaBottom } from "../utils/validationUtils";

type TabId = "map" | "feed" | "study" | "bookmark" | "profile";

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
    id: "feed",
    label: "피드",
    icon: (isActive) => <FeedTabIcon isActive={isActive} />,
  },
  {
    id: "bookmark",
    label: "아카이브",
    icon: (isActive) => <BookmarkTabIcon isActive={isActive} />,
  },
  {
    id: "study",
    label: "스터디",
    icon: (isActive) => <StudyTabIcon isActive={isActive} />,
  },
  {
    id: "profile",
    label: "마이페이지",
    icon: (isActive) => <ProfileTabIcon isActive={isActive} />,
  },
];

export default function CafeMapBottomNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn =
    !!session && session.user?.role !== "guest" && session.user?.role !== "newUser";

  const activeTab: TabId = (router.query.tab as TabId) || "map";

  const handleTabClick = (tab: TabItem) => {
    console.log(315);
    if (tab.isComingSoon) return;
    if (activeTab === tab.id) return;
    if (tab.id === "profile") {
      if (isLoggedIn) {
        router.push({ pathname: "/cafe-map", query: { tab: "profile" } });
      } else if (
        typeof window !== "undefined" &&
        /xn--ob0b42knwutje\.com$/.test(window.location.hostname)
      ) {
        window.location.href = "https://study-about.club/cafe-map/login";
      } else {
        router.push("/cafe-map/login");
      }
      return;
    }

    if (tab.id === "map") {
      router.push("/cafe-map");
    } else {
      router.push({ pathname: "/cafe-map", query: { tab: tab.id } });
    }
  };

  return (
    <Flex
      w="full"
      pos="fixed"
      bottom={0}
      h={getSafeAreaBottom(52)}
      bg="white"
      zIndex={10}
      pb={getSafeAreaBottom(0)}
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

function FeedTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h280v-480H160v480Zm360 0h280v-480H520v480Zm40-120h200v-60H560v60Zm0-100h200v-60H560v60Zm0-100h200v-60H560v60ZM160-240v-480 480Z" />
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

function BookmarkTabIcon({ isActive }: { isActive: boolean }) {
  const color = isActive ? "var(--color-mint)" : "var(--gray-500)";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill={color}
    >
      <path d="M455-64q-12-4-23-12L192-256q-15-11-23.5-28t-8.5-36v-480q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v480q0 19-8.5 36T768-256L528-76q-11 8-23 12t-25 4q-13 0-25-4Zm25-76 240-180v-480H240v480l240 180Zm-42-334-56-56q-12-12-28-11.5T326-530q-12 12-12.5 28.5T325-473l85 85q12 12 28 12t28-12l170-170q12-12 11.5-28T636-614q-12-12-28.5-12.5T579-615L438-474Zm42-326H240h480-240Z" />
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
