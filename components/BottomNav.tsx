import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { getStudyStandardDate } from "../libs/study/date/getStudyStandardDate";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { getBottomNavSize } from "../utils/mathUtils";
import { CommunityIcon, HomeIcon, StudyIcon, ThunderIcon, UserIcon } from "./Icons/BottomNavIcons";

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

type Category = "홈" | "스터디" | "번개" | "커뮤니티" | "내 정보";

export default function BottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationEn = convertLocationLangTo(session?.user.location, "en");

  return (
    <Nav height={getBottomNavSize()}>
      {navItems.map((item, idx) => {
        const getParams = (category: Category) => {
          switch (category) {
            case "홈":
              return `?tab=study&location=${locationEn}&date=${getStudyStandardDate()}`;
            case undefined:
              newSearchParams.append("write", "on");
              return pathname + "?" + newSearchParams.toString();
          }
          return "";
        };

        return (
          <NavButton
            idx={idx}
            text={item.text}
            key={idx}
            url={item.url + `${getParams(item.text)}`}
            activeIcon={item.activeIcon}
            defaultIcon={item.defaultIcon}
            isActive={pathname === item.url}
          />
        );
      })}
    </Nav>
  );
}

function NavButton({ text, url, activeIcon, defaultIcon, isActive, idx }: INavButton) {
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const handleMove = () => {
    setSlideDirection(null);
  };

  return (
    <NavLink
      onClick={() => handleMove()}
      href={url}
      isActive={isActive.toString() as "true" | "false"}
      replace={!text}
      className={`bottom_nav${idx}`}
    >
      <Box>{isActive ? activeIcon || defaultIcon : defaultIcon}</Box>
      <Box
        as="span"
        fontSize="11px"
        fontWeight={500}
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
    text: "번개",
    url: "/gatherPage",
  },
  {
    activeIcon: <CommunityIcon isActive />,
    defaultIcon: <CommunityIcon />,
    text: "커뮤니티",
    url: "/square",
  },
  {
    activeIcon: <UserIcon isActive />,
    defaultIcon: <UserIcon />,
    text: "내 정보",
    url: "/user",
  },
];

const Nav = styled.nav<{ height: number }>`
  width: 100%;
  display: flex;
  justify-content: even;
  position: fixed;
  bottom: 0;
  height: ${(props) => `${props.height}px`};
  background-color: white;
  z-index: 10;

  border-top: var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
  padding-top: ${(props) => (props.height > 90 ? 0 : "4px")};
  padding-bottom: ${(props) => (props.height > 90 ? "4px" : 0)};
`;

const NavLink = styled(Link)<{ isActive: "true" | "false" } & LinkProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${({ isActive }) => (isActive === "true" ? "var(--gray-800)" : "var(--gray-500)")};
`;

const NavText = styled.div`
  margin-top: 6px;
  font-size: 12px;
`;
