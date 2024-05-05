import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { SECTION_NAME } from "../../pages/member/[location]";
import { MemberGroup } from "../../types/models/member";

interface IMemberSectionTitle {
  section: MemberGroup;
  onClickSection?: (section: MemberGroup) => void;
}

const SECTION_TEXT = {
  member: "정식 활동 멤버입니다",
  human: "새싹 멤버 뉴비~!",
  enthusiastic: "열심히 활동해봐요~!",
  resting: "휴식중인 멤버입니다",
  birth: "생일을 축하해요!",
};

function MemberSectionTitle({ section, onClickSection }: IMemberSectionTitle) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  return (
    <Layout>
      <TitleWrapper>
        <span>{SECTION_NAME[section]}</span>
        <span>{SECTION_TEXT[section]}</span>
      </TitleWrapper>
      {section !== "birth" && section !== "enthusiastic" && (
        <Button disabled={isGuest} onClick={() => onClickSection(section)}>
          <span>더보기</span>
          <FontAwesomeIcon icon={faChevronRight} size="xs" />
        </Button>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > span:first-child {
    color: var(--color-mint);
    font-size: 12px;
  }
  > span:last-child {
    font-weight: 600;
    font-size: 14px;
  }
`;

const Button = styled.button`
  align-self: flex-end;
  color: var(--gray-3);
  font-size: 12px;
  > span {
    margin-right: var(--gap-1);
  }
`;

export default MemberSectionTitle;
