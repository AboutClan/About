import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import CirclePlusIcon from "../assets/icons/CirclePlusIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import PeopleIcon from "../assets/icons/PeopleIcon";
import StatisticsIcon from "../assets/icons/StatisticsIcon";

import { HAS_STUDY_TODAY } from "../constants/keys/localStorage";
import { getStudyStandardDate } from "../libs/study/date/getStudyStandardDate";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { detectDevice } from "../utils/validationUtils";

interface INavButtonProps {
  url: string;
  defaultIcon: React.ReactNode;
  text?: Category;
  activeIcon?: React.ReactNode;
}

interface INavButton extends INavButtonProps {
  active: boolean;
  idx: number;
}

type Category = "홈" | "통계" | "모임" | "소그룹";

export default function BottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationEn = convertLocationLangTo(session?.user.location, "en");
  const hasStudyToday = localStorage.getItem(HAS_STUDY_TODAY);
  const deviceType = detectDevice();

  return (
    <Nav isIPhone={deviceType === "iPhone"}>
      {navItems.map((item, idx) => {
        const getParams = (category: Category) => {
          switch (category) {
            case "홈":
              return `/?location=${locationEn}&date=${getStudyStandardDate(
                hasStudyToday === "true",
              )}`;
            case "모임":
              return `/?location=${locationEn}`;
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
            active={pathname === item.url}
          />
        );
      })}
    </Nav>
  );
}

function NavButton({ text, url, activeIcon, defaultIcon, active, idx }: INavButton) {
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const handleMove = () => {
    setSlideDirection(null);
  };

  return (
    <NavLink
      onClick={() => handleMove()}
      href={url}
      active={active.toString() as "true" | "false"}
      replace={!text}
      className={`bottom_nav${idx}`}
    >
      <Box>{active ? activeIcon || defaultIcon : defaultIcon}</Box>
      <NavText>{text}</NavText>
    </NavLink>
  );
}

const navItems: INavButtonProps[] = [
  {
    activeIcon: <HomeIcon />,
    defaultIcon: <HomeIcon isDark={false} />,
    text: "홈",
    url: "/home",
  },
  {
    activeIcon: <StatisticsIcon />,
    defaultIcon: <StatisticsIcon isDark={false} />,
    text: "통계",
    url: "/statistics",
  },
  {
    defaultIcon: <CirclePlusIcon />,
    url: "",
  },
  {
    activeIcon: <StatisticsIcon />,
    defaultIcon: <StatisticsIcon isDark={false} />,
    text: "모임",
    url: "/gather",
  },
  {
    activeIcon: <PeopleIcon />,
    defaultIcon: <PeopleIcon isDark={false} />,
    text: "소그룹",
    url: "/group",
  },
];

const Nav = styled.nav<{ isIPhone: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 0 24px;
  padding-bottom: ${(props) => (props.isIPhone ? "34px" : "24px")};
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
  height: ${(props) => (props.isIPhone ? "87px" : "77px")};
  background-color: white;
  z-index: 10;
  box-shadow: var(--shadow);
  border-top: var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const NavLink = styled(Link)<{ active: "true" | "false" } & LinkProps>`
  width: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ active }) => (active === "true" ? "var(--gray-900)" : "var(--gray-500)")};
`;

const NavText = styled.div`
  margin-top: 4px;
  font-size: 10px;
  font-weight: 600;
`;
