import { Box, Flex } from "@chakra-ui/react";

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
              <Box color={idx !== 0 ? "mint" : "red"} as="span">
                {props.text}
              </Box>
              <Box ml={props?.rightChildren && 2}>{props?.rightChildren}</Box>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}

export default InfoBoxCol;
