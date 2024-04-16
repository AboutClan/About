import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import HighlightedTextButton from "../../components/atoms/buttons/HighlightedTextButton";
import SectionBar from "../../components/molecules/bars/SectionBar";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { WIN_RECORD } from "../../storage/winRecord";
interface IHomeWinRecordSection {}
export default function HomeWinRecordSection({}: IHomeWinRecordSection) {
  const router = useRouter();
  const contentArr = WIN_RECORD.slice().reverse().slice(0, 12);
  const [isModal, setIsModal] = useState();
  const setSlideDirection = useSetRecoilState(slideDirectionState);
  const tableInfosArr = contentArr.map((content) => [
    content.date,
    content.name,
    content.detail,
    content.present,
  ]);

  const handleNavigate = () => {
    setSlideDirection("right");
    router.push(`/winRecord`);
  };

  return (
    <>
      <SectionBar
        title="이벤트 당첨 현황"
        rightComponent={
          <HighlightedTextButton text="더보기" onClick={handleNavigate} />
        }
      />
      <Layout>
        <SummaryTable
          headerInfos={["날짜", "이름", "내용", "상품"]}
          tableInfosArr={tableInfosArr}
          size="lg"
        />
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin: 16px;
  margin-bottom: 36px;
  border: var(--border);
  border-radius: var(--rounded-lg);
`;
