import RowButtonBlock from "../../components/atoms/blocks/RowButtonBlock";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";

function DesignsPage() {
  return (
    <>
      <Header title="디자인 페이지" />
      <Slide>
        <RowButtonBlock text="스터디 점수판" url="designs/studyAttendance" />
      </Slide>
    </>
  );
}

export default DesignsPage;
