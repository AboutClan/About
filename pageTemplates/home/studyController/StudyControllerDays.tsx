import dayjs from "dayjs";
import { Fragment } from "react";
import styled from "styled-components";

import { getDateArr } from "./StudyController";

interface IStudyControllerDays {
  selectedDate: string;
}

function StudyControllerDays({ selectedDate }: IStudyControllerDays) {
  const dayArr = getDateArr(dayjs(selectedDate)).map((dateObj) => dateObj.day);

  return (
    <Container>
      {dayArr.map((day, idx) => (
        <Fragment key={idx}>
          {idx !== 3 ? <Day key={idx}>{day}</Day> : <Spacer key={`spacer-${idx}`} />}
        </Fragment>
      ))}
    </Container>
  );
}

// Styled component for the container
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px; /* mb-2 */
`;

// Styled component for the day display
const Day = styled.div`
  flex: 1;
  text-align: center;
  color: var(--gray-2); /* Assuming text-gray-2 maps to this color, adjust as necessary */
`;

// Styled component for the spacer
const Spacer = styled.div`
  width: 96px; /* w-24 */
  margin: 0 2px; /* mx-0.5 */
`;

export default StudyControllerDays;
