import {
  faCirclePlus,
  faHandshake as faDefaultHandShake,
  faHouse as faDefaultHouse,
  faRankingStar as faDefaultRankingStar,
  faUsersRectangle as faDefaultUsersRectangle,
} from "@fortawesome/pro-light-svg-icons";
import {
  faHandshake,
  faHouse,
  faRankingStar,
  faUsersRectangle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { HAS_STUDY_TODAY } from "../constants/keys/localStorage";
import { getStudyStandardDate } from "../libs/study/date/getStudyStandardDate";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";

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
  return (
    <Nav>
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
      {active ? activeIcon || defaultIcon : defaultIcon}
      <NavText>{text}</NavText>
    </NavLink>
  );
}

const navItems: INavButtonProps[] = [
  {
    activeIcon: <FontAwesomeIcon icon={faHouse} size="xl" />,
    defaultIcon: <FontAwesomeIcon icon={faDefaultHouse} size="xl" />,
    text: "홈",
    url: "/home",
  },
  {
    activeIcon: <FontAwesomeIcon icon={faRankingStar} size="xl" />,
    defaultIcon: <FontAwesomeIcon icon={faDefaultRankingStar} size="xl" />,
    text: "통계",
    url: "/statistics",
  },
  {
    defaultIcon: <FontAwesomeIcon icon={faCirclePlus} fontSize="36px" />,
    url: "",
  },
  {
    activeIcon: <FontAwesomeIcon icon={faHandshake} size="xl" />,
    defaultIcon: <FontAwesomeIcon icon={faDefaultHandShake} size="xl" />,
    text: "모임",
    url: "/gather",
  },
  {
    activeIcon: <FontAwesomeIcon icon={faUsersRectangle} size="xl" />,
    defaultIcon: <FontAwesomeIcon icon={faDefaultUsersRectangle} size="xl" />,
    text: "소그룹",
    url: "/group",
  },
];

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: even;
  position: fixed;
  bottom: 0;
  height: 64px; /* Adjusted from the inline style */
  background-color: white;
  z-index: 10;
  box-shadow: var(--shadow);
  border-top: var(--border);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const NavLink = styled(Link)<{ active: "true" | "false" } & LinkProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-top: 4px;
  color: ${({ active }) => (active === "true" ? "var(--gray-2)" : "var(--gray-3)")};
`;

const NavText = styled.div`
  margin-top: 6px; /* 2rem if you're using rem */
  font-size: 12px; /* Adjusted for text-xs */
`;
