import { Box, Flex } from "@chakra-ui/react";

export interface InfoBoxProps {
  category: string;
  text?: string;
  color?: "mint" | "red";
  rightChildren?: React.ReactNode;
}

interface InfoBoxColProps {
  infoBoxPropsArr: InfoBoxProps[];
  size?: "sm" | "md";
  highlightSide?: "left" | "right";
}

function InfoBoxCol({ infoBoxPropsArr, size = "sm", highlightSide = "right" }: InfoBoxColProps) {
  return (
    <Flex direction="column" fontSize={size === "sm" ? "12px" : "13px"}>
      {infoBoxPropsArr.map((props, idx) => {
        const isNotLast = idx !== infoBoxPropsArr.length - 1;

        return (
          <Flex
            justify="space-between"
            py={2}
            borderBottom={isNotLast && "var(--border)"}
            key={idx}
            align="center"
            lineHeight={size === "sm" ? "18px" : "20px"}
          >
            <Box color={highlightSide === "right" ? "gray.500" : "gray.800"}>{props.category}</Box>
            <Flex align="center">
              <Box
                fontWeight={highlightSide === "right" ? "regular" : "medium"}
                color={highlightSide === "right" ? props?.color || "gray.800" : "gray.600"}
                as="span"
                
              >
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
