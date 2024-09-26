import { Box, Button } from "@chakra-ui/react";
import styled from "styled-components";

import InfoBox, { InfoBoxProp } from "../../components/molecules/InfoBox";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
interface StudyWaitingOverviewProps {
  setIsModal: DispatchBoolean;
}

function StudyWaitingOverview({ setIsModal }: StudyWaitingOverviewProps) {
  const infos: InfoBoxProp[] = [
    {
      text: "오후 11시에 스터디 결과가 발표됩니다.",
      icon: <i className="fa-solid fa-circle-info" />,
    },
    {
      text: "조건에 따라 포인트를 획득합니다.",
      icon: <i className="fa-solid fa-circle-info" />,
    },
  ];

  return (
    <OverviewWrapper>
      <Box mt="12px" flex={1}>
        <InfoBox infos={infos} />
      </Box>
      <Button
        onClick={() => setIsModal(true)}
        alignSelf="flex-end"
        colorScheme="mintTheme"
        size="xs"
      >
        포인트 설명서
      </Button>
    </OverviewWrapper>
  );
}

const OverviewWrapper = styled.div`
  display: flex;
  padding: 16px 16px;
  padding-bottom: 12px;
  background-color: white;
`;

export default StudyWaitingOverview;
