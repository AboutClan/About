import { Box, Flex } from "@chakra-ui/react";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { useHandleMove } from "../@natives/useHandleBottomNav";
import { getStudyStandardDate } from "../libs/study/date/getStudyStandardDate";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { iPhoneNotchSize } from "../utils/validationUtils";
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

type Category = "홈" | "스터디" | "번개" | "커뮤니티" | "내 정보";

export default function BottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationEn = convertLocationLangTo(session?.user.location, "en");

  return (
    <Nav>
      {navItems.map((item, idx) => {
        const getParams = (category: Category) => {
          switch (category) {
            case "홈":
              return `?location=${locationEn}&date=${getStudyStandardDate()}`;
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
  const handleMove = useHandleMove(setSlideDirection);

  return (
    <NavLink
      onClick={handleMove}
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
    text: "번개",
    url: "/gather",
  },
  {
    activeIcon: <CommunityIcon isActive />,
    defaultIcon: <CommunityIcon />,
    text: "커뮤니티",
    url: "/square",
  },
  {
    activeIcon: <UserIcon size="md" isActive />,
    defaultIcon: <UserIcon size="md" />,
    text: "내 정보",
    url: "/user",
  },
];

const Nav = styled.nav`
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
  height: ${52 + iPhoneNotchSize()}px;
  background-color: white;
  z-index: 600;
  padding-bottom: ${iPhoneNotchSize()}px;

  border-top: var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const NavLink = styled(Link)<{ isactive: "true" | "false" } & LinkProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${({ isactive }) => (isactive === "true" ? "var(--gray-800)" : "var(--gray-500)")};
`;
