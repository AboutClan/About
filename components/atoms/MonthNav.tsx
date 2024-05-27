import { Dayjs } from "dayjs";
import styled from "styled-components";

import { DispatchType } from "../../types/hooks/reactTypes";

interface IMonthNav {
  month: number;
  setNavMonth: DispatchType<Dayjs>;
}

function MonthNav({ month, setNavMonth }: IMonthNav) {
  const onClick = (dir: "left" | "right") => {
    if (dir === "left") setNavMonth((old) => old.subtract(1, "month"));
    else setNavMonth((old) => old.add(1, "month"));
  };

  return (
    <Layout>
      <IconWrapper onClick={() => onClick("left")}>
        <i className="fa-solid fa-caret-left fa-xs"  />
      </IconWrapper>
      <span>{month + 1}월</span>
      <IconWrapper onClick={() => onClick("right")}>
        <i className="fa-solid fa-caret-right fa-xs" />
      </IconWrapper>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--gap-3);
  font-size: 20px;
  font-weight: 700;
  padding: 0 var(--gap-3);
`;

const IconWrapper = styled.button`
  padding: 0 var(--gap-1);
`;

export default MonthNav;
