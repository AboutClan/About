import { Box } from "@chakra-ui/react";
import styled from "styled-components";
import InfoBox, { InfoBoxProp } from "../../components/molecules/InfoBox";
interface StudyWaitingOverviewProps {
  title: string;
}

function StudyWaitingOverview({ title }: StudyWaitingOverviewProps) {
  const infos: InfoBoxProp[] = [
    {
      text: "대기소입니다",
      icon: <i className="fa-solid fa-circle-info" />,
    },
    {
      text: "설명입니다",
      icon: <i className="fa-solid fa-circle-info" />,
    },
  ];

  return (
    <OverviewWrapper>
      <Title>{title}2</Title>
      <Box mt="12px">
        <InfoBox infos={infos} />
      </Box>
    </OverviewWrapper>
  );
}

const OverviewWrapper = styled.div`
  padding: 16px 16px;
  padding-bottom: 12px;
  background-color: white;
`;
const Title = styled.span`
  font-weight: bold;
  font-size: 18px;
`;
export default StudyWaitingOverview;
