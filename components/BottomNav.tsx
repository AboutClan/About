import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { useHandleMove } from "../@natives/useHandleBottomNav";
import { useCheckGuest } from "../hooks/custom/UserHooks";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { dayjsToStr } from "../utils/dateTimeUtils";
import { getSafeAreaBottom } from "../utils/validationUtils";
import { CommunityIcon, HomeIcon, StudyIcon, ThunderIcon } from "./Icons/BottomNavIcons";
import { UserIcon } from "./Icons/UserIcons";

interface INavButtonProps {
  url: string;
  defaultIcon: React.ReactNode;
  text?: Category;
  activeIcon?: React.ReactNode;
}

interface INavButton extends INavButtonProps {
  isActive: boolean;
  idx: number;
}

type Category = "홈" | "스터디" | "소셜링" | "커뮤니티" | "내 정보";

export default function BottomNav({ hasBottomNav }: { hasBottomNav: boolean }) {
  const router = useRouter();
  const pathname = router.pathname;
  const asPath = router.asPath;

  return (
    <Flex
      w="full"
      pos="fixed"
      bottom="0"
      h={getSafeAreaBottom(52)}
      bg="white"
      zIndex={600}
      pb={getSafeAreaBottom(0)}
      borderTop={hasBottomNav ? "var(--border-main)" : "var(--border)"}
      maxW="var(--max-width)"
      m="0 auto"
      boxShadow={hasBottomNav ? "none" : "0px -4px 12px 0px rgba(0, 0, 0, 0.04)"}
    >
      {navItems.map((item, idx) => {
        const getParams = (category: Category) => {
          switch (category) {
            case "스터디":
              return `?date=${dayjsToStr(dayjs())}`;

            case undefined: {
              const currentQueryString = asPath.split("?")[1] || "";
              const newSearchParams = new URLSearchParams(currentQueryString);
              newSearchParams.set("write", "on");
              return `?${newSearchParams.toString()}`;
            }

            default:
              return "";
          }
        };

        return (
          <NavButton
            idx={idx}
            text={item.text}
            key={idx}
            url={item.url + getParams(item.text)}
            activeIcon={item.activeIcon}
            defaultIcon={item.defaultIcon}
            isActive={pathname === item.url}
          />
        );
      })}
    </Flex>
  );
}

function NavButton({ text, url, activeIcon, defaultIcon, isActive, idx }: INavButton) {
  const router = useRouter();
  const setSlideDirection = useSetRecoilState(slideDirectionState);
  const handleMove = useHandleMove(setSlideDirection);
  const isGuest = useCheckGuest();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isGuest && text === "내 정보") {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          guest: "on",
        },
      });
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    handleMove();
  };

  return (
    <NavLink
      onClick={onClick}
      href={url}
      isactive={isActive.toString() as "true" | "false"}
      replace={!text}
      className={`bottom_nav${idx}`}
    >
      <Flex justify="center" align="center" w="26px" h="26px">
        {isActive ? activeIcon || defaultIcon : defaultIcon}
      </Flex>
      <Box
        as="span"
        mt="2px"
        fontSize="11px"
        color={isActive ? "var(--color-mint)" : "var(--gray-400)"}
      >
        {text}
      </Box>
    </NavLink>
  );
}

const navItems: INavButtonProps[] = [
  {
    activeIcon: <HomeIcon isActive />,
    defaultIcon: <HomeIcon />,
    text: "홈",
    url: "/home",
  },
  {
    activeIcon: <StudyIcon isActive />,
    defaultIcon: <StudyIcon />,
    text: "스터디",
    url: "/studyPage",
  },
  {
    activeIcon: <ThunderIcon isActive />,
    defaultIcon: <ThunderIcon />,
    text: "소셜링",
    url: "/gather",
  },
  {
    activeIcon: <CommunityIcon isActive />,
    defaultIcon: <CommunityIcon />,
    text: "커뮤니티",
    url: "/community",
  },
  {
    activeIcon: <UserIcon size="md" isActive />,
    defaultIcon: <UserIcon size="md" />,
    text: "내 정보",
    url: "/user",
  },
];

const NavLink = styled(Link)<{ isactive: "true" | "false" } & LinkProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ isactive }) => (isactive === "true" ? "var(--gray-800)" : "var(--gray-500)")};
`;
