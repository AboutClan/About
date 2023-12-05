import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import Header from "../../../components/layout/Header";
import { dayjsToFormat } from "../../../helpers/dateHelpers";
import { useVoteStatusResetMutation } from "../../../hooks/admin/mutation";

function ResetStudyStatus() {
  const onClick = () => {};

  const currentMonth = dayjs().month();
  const currentDate = dayjs().date();

  const [date, setDate] = useState({ month: null, date: null });

  const onClickBtn = (type: "month" | "date", num: number) => {
  
    setDate((old) => ({ ...old, [type]: num }));
  };

  const { mutate, data } = useVoteStatusResetMutation();


  const onClickReset = () => {
    mutate(
      dayjs()
        .month(date.month - 1)
        .date(date.date)
    );
  };

  return (
    <Layout>
      <Header title="스터디 상태 초기화" url="/admin" />
      <Container>
        <span>
          {dayjsToFormat(
            dayjs()
              .month(date.month - 1)
              .date(date.date),
            "M월 D일"
          )}
        </span>
        <Month>
          {[12, 1, 2, 3, 4].map((item) => (
            <Button key={item} onClick={() => onClickBtn("month", item)}>
              {item}
            </Button>
          ))}
        </Month>
        <Date>
          {[currentDate - 1, currentDate, currentDate + 1, currentDate + 2].map(
            (item) => (
              <Button key={item} onClick={() => onClickBtn("date", item)}>
                {item}
              </Button>
            )
          )}
        </Date>
        <Button onClick={onClickReset}>초기화</Button>
      </Container>
    </Layout>
  );
}

const Layout = styled.div``;

const Month = styled.div`
  display: flex;
`;
const Date = styled.div``;

const Container = styled.div`
  margin: var(--margin-max);
`;

export default ResetStudyStatus;
