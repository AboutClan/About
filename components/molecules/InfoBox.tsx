import { Box } from "@chakra-ui/react";
import styled from "styled-components";

export interface InfoBoxProp {
  text: string;
  icon: React.ReactNode;
}

interface InfoBoxProps {
  infos: InfoBoxProp[];
}

function InfoBox({ infos }: InfoBoxProps) {
  return (
    <InfoContainer>
      {infos.map((info, idx) => (
        <InfoRow key={idx}>
          <InfoIconText className="flex-1">
            <Box w="16px" textAlign="center" color="var(--gray-600)">
              {info.icon}
            </Box>
            <Box as="span" ml="4px">
              {info.text}
            </Box>
          </InfoIconText>
        </InfoRow>
      ))}
    </InfoContainer>
  );
}

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2;
  font-size: 14px;
`;

const InfoIconText = styled.div`
  display: flex;
  align-items: center;

  i {
    width: 14px;
    margin-right: 8px;
    color: var(--gray-600);
  }
`;

export default InfoBox;
