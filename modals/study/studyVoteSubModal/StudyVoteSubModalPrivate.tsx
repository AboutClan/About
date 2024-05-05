import { useEffect, useState } from "react";
import styled from "styled-components";

import { InputLg } from "../../../styles/layout/input";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IStudyVote } from "../../../types/models/studyTypes/studyInterActions";

interface IStudyVoteSubModalPrivate {
  setVoteInfo: DispatchType<IStudyVote>;
}

function StudyVoteSubModalPrivate({ setVoteInfo }: IStudyVoteSubModalPrivate) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setVoteInfo((old) => ({ ...old, memo: value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <Layout>
      <Overview>장소를 특정할 수 있도록 적어주세요!</Overview>
      <InputLg
        placeholder="예시: 아주대 앞 탐앤탐스, 개인 독서실 등"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Rule>
        <li>혼자라도 개인 카공을 신청하고 인증할 수 있습니다.</li>
        <li>출석체크시에는 사진을 통해 인증해야 합니다.</li>
        <li>출석완료시 +2 point를 받습니다.</li>
        <li>미 인증시 -100원이 부과됩니다.</li>
      </Rule>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: var(--gap-3);
`;

const Overview = styled.div`
  color: var(--gray-2);
  font-size: 16px;
  margin-bottom: var(--gap-3);
`;

const Rule = styled.div`
  color: var(--gray-2);
  margin-top: 32px;
  font-size: 14px;
`;

export default StudyVoteSubModalPrivate;
