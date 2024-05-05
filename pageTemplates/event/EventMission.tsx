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
      title: "(3/4) 개강 시즌 이벤트",
      content:
        "1학기가 시작되었습니다! 시험기간이 아니더라도 미리미리 같이 카공하고 하자고요~ 4월 1일, 3월 동안 스터디에 2회 이상 참여한 기록이 있는 분들 중 지역별로 추첨을 통해 커피 기프티콘을 드립니다!",
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
      <Box p="16px" border="var(--border)">
        <Accordion contentArr={accordionOptions} />
      </Box>
      {isModal && <AlertNotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}
