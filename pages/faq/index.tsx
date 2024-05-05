import styled from "styled-components";

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
        <Layout>
          <SectionBar title="동아리 가이드" />
          <Container>
            <Accordion contentArr={ACCORDION_CONTENT_FAQ} isFull={true} />
          </Container>
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div``;

const Container = styled.div``;

export default Faq;
