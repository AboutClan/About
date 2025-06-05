import { Box } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import TwoButtonNav from "../../../components/layouts/TwoButtonNav";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { DispatchNumber } from "../../../types/hooks/reactTypes";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";

interface IGatherParticipateModalPassword {
  setPageNum: DispatchNumber;
  gather: IGather;
}

function GatherParticipateModalPassword({
  setPageNum,
  gather: gatherData,
}: IGatherParticipateModalPassword) {
  const failToast = useFailToast();

  const [password, setPassword] = useState("");

  const onApply = () => {
    if (password === gatherData?.password) setPageNum(2);
    else failToast("free", "초대 코드가 일치하지 않습니다.");
  };

  return (
    <>
      <CodeText>전달 받은 초대코드 네자리를 입력해 주세요.</CodeText>
      <Container>
        <i className="fa-solid fa-unlock" style={{ color: "var(--gray-500)" }} />
        <Input
          placeholder="초대코드 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Container>

      <Box p="16px 0 ">
        <TwoButtonNav
          leftText="뒤로"
          rightText="입력"
          onClickLeft={() => setPageNum(0)}
          onClickRight={onApply}
        />
      </Box>
    </>
  );
}

const Container = styled.div`
  margin-top: var(--gap-1);
  flex: 1;
  display: flex;
  align-items: center;
`;

const CodeText = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  margin-left: var(--gap-2);
  background-color: var(--gray-200);
  padding: var(--gap-1) var(--gap-2);
  border-radius: var(--rounded-lg);
`;

export default GatherParticipateModalPassword;
