import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

export interface InfoBoxProps {
  category: string;
  text: string;
  rightChildren?: React.ReactNode;
}

interface InfoBoxColProps {
  infoBoxPropsArr: InfoBoxProps[];
}

function InfoBoxCol({ infoBoxPropsArr }: InfoBoxColProps) {
  return (
    <Flex direction="column" fontSize="12px">
      {infoBoxPropsArr.map((props, idx) => {
        const isNotLast = idx !== infoBoxPropsArr.length - 1;

        return (
          <Flex
            justify="space-between"
            pb={isNotLast && 2}
            mb={isNotLast && 2}
            borderBottom={isNotLast && "var(--border)"}
            key={idx}
            align="center"
          >
            <Box color="gray.500">{props.category}</Box>
            <Flex align="center">
              <Box as="span">{props.text}</Box>
              <Box ml={props?.rightChildren && 2}>{props?.rightChildren}</Box>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
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

export default InfoBoxCol;
