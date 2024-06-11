import { Box, Flex } from "@chakra-ui/react";

import PointCircleText, { PointCircleTextProps } from "../atoms/PointCircleText";

interface PointCircleTextRowProps {
  props: PointCircleTextProps[];
}

function PointCircleTextRow({ props }: PointCircleTextRowProps) {
  return (
    <Flex>
      {props.map((prop, idx) => (
        <Box key={idx} mr={idx !== props.length - 1 && "12px"}>
          <PointCircleText text={prop.text} color={prop.color} />
        </Box>
      ))}
    </Flex>
  );
}

export default PointCircleTextRow;
