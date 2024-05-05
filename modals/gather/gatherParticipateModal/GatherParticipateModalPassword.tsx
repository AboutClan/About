import { Box } from "@chakra-ui/react";
import { faUnlock } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import TwoButtonNav from "../../../components/layouts/TwoButtonNav";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { useGatherQuery } from "../../../hooks/gather/queries";
import { DispatchNumber } from "../../../types/hooks/reactTypes";

interface IGatherParticipateModalPassword {
  setPageNum: DispatchNumber;
}

function GatherParticipateModalPassword({ setPageNum }: IGatherParticipateModalPassword) {
  const failToast = useFailToast();
  const { id } = useParams<{ id: string }>() || {};

  const [password, setPassword] = useState("");

  const { data: gathers } = useGatherQuery();

  const gatherData = gathers?.find((item) => item.id + "" === id);
  const onApply = () => {
    if (password === gatherData?.password) setPageNum(2);
    else failToast("free", "암호가 일치하지 않습니다.");
  };

  return (
    <>
      <CodeText>전달 받은 암호 네자리를 입력해 주세요.</CodeText>
      <Container>
        <FontAwesomeIcon icon={faUnlock} color="var(--gray-4)" />
        <Input
          placeholder="암호 입력"
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
  background-color: var(--gray-7);
  padding: var(--gap-1) var(--gap-2);
  border-radius: var(--rounded-lg);
`;

export default GatherParticipateModalPassword;
