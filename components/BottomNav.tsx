import { Box } from "@chakra-ui/react";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { getStudyStandardDate } from "../libs/study/date/getStudyStandardDate";
import { slideDirectionState } from "../recoils/navigationRecoils";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { getBottomNavSize } from "../utils/mathUtils";

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

type Category = "홈" | "커뮤니티" | "마이페이지" | "소모임";

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
    activeIcon: <i className="fa-solid fa-house fa-xl" />,
    defaultIcon: <i className="fa-light fa-house fa-xl" />,
    text: "홈",
    url: "/home",
  },
  {
    activeIcon: <i className="fa-solid fa-comments fa-xl" />,
    defaultIcon: <i className="fa-light fa-comments fa-xl" />,
    text: "커뮤니티",
    url: "/square",
  },
  {
    defaultIcon: <i className="fa-light fa-circle-plus" style={{ fontSize: "36px" }} />,
    url: "",
  },
  {
    activeIcon: <i className="fa-solid fa-users-rectangle fa-xl" />,
    defaultIcon: <i className="fa-light fa-users-rectangle fa-xl" />,
    text: "소모임",
    url: "/group",
  },
  {
    activeIcon: <i className="fa-solid fa-user fa-xl" />,
    defaultIcon: <i className="fa-light fa-user fa-xl" />,
    text: "마이페이지",
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
  padding-top: 4px;
`;

const NavLink = styled(Link)<{ active: "true" | "false" } & LinkProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: ${({ active }) => (active === "true" ? "var(--gray-800)" : "var(--gray-500)")};
`;

const NavText = styled.div`
  margin-top: 6px;
  font-size: 12px;
`;
