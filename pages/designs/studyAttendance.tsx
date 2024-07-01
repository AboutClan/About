import { useState } from "react";

import RowButtonBlock from "../../components/atoms/blocks/RowButtonBlock";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import AttendanceModal from "../../design/attendance/AttendanceModal";

function StudyAttendance() {
  const [hasModalNumber, setHasModalNumber] = useState<1 | 2>();
  return (
    <>
      <Header title="스터디 점수판" />
      <Slide>
        <RowButtonBlock text="기존 스터디 출석표 모달 1" func={() => setHasModalNumber(1)} />
        <RowButtonBlock text="기존 스터디 출석표 모달 2" func={() => setHasModalNumber(2)} />
      </Slide>
      {hasModalNumber && (
        <AttendanceModal type={hasModalNumber} setIsModal={() => setHasModalNumber(null)} />
      )}
    </>
  );
}

export default StudyAttendance;
