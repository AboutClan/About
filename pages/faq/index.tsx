import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import Accordion from "../../components/molecules/Accordion";
import SectionBar from "../../components/molecules/bars/SectionBar";
import { ACCORDION_CONTENT_FAQ } from "../../constants/contentsText/accordionContents";

function Faq() {
  return (
    <>
      <Header title="자주 묻는 질문" />
      <Slide>
        <SectionBar title="동아리 가이드" />
        <Accordion contentArr={ACCORDION_CONTENT_FAQ} isFull={true} />
      </Slide>
    </>
  );
}

export default Faq;
