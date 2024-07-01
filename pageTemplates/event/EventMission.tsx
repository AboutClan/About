import { Box } from "@chakra-ui/react";
import { useState } from "react";

import AlertNotCompletedModal from "../../components/AlertNotCompletedModal";
import HighlightedTextButton from "../../components/atoms/buttons/HighlightedTextButton";
import Accordion, { IAccordionContent } from "../../components/molecules/Accordion";
import SectionBar from "../../components/molecules/bars/SectionBar";

export default function EventMission() {
  const [isModal, setIsModal] = useState(false);

  const accordionOptions: IAccordionContent[] = [
    {
      title: "(6월 중순) 방학 기념 이벤트",
      content: "모임을 개설하고 진행시 10000원을 지원해드려요! 단! 사진 및 리뷰 필수!",
    },
    {
      title: "(완료) 최애 햄버거 이벤트",
      content:
        "여러분의 최애하는 햄버거 브랜드는 어디인가요? 단톡방에서 투표에 참여해 주시면 총 8분께 해당 햄버거 브랜드 깊티를 드려요!",
    },
    {
      title: "(항시) 홍보 이벤트",
      content:
        "학교 에브리타임에 동아리 게시판에 홍보글을 작성해주시면 매번 100 POINT(최초 등록 학교일시 300 POINT)와 추첨을 통해 치킨 깊티를 드려요!",
    },
  ];

  return (
    <>
      <SectionBar
        title="진행 이벤트"
        size="md"
        rightComponent={<HighlightedTextButton text="더보기" onClick={() => setIsModal(true)} />}
      />
      <Box p="12px 16px" border="var(--border)">
        <Accordion contentArr={accordionOptions} />
      </Box>
      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
