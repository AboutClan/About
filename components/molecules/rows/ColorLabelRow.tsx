import { Box, Flex } from "@chakra-ui/react";

import ColorLabel, { ColorLabelProps } from "../../atoms/ColorLabel";

interface ColorLabelRowProps {
  props: ColorLabelProps[];
}

function ColorLabelRow({ props }: ColorLabelRowProps) {
  return (
    <Flex>
      {props.map((prop, idx) => (
        <Box key={idx} mr={idx !== props.length - 1 && 2}>
          <ColorLabel text={prop.text} color={prop.color} colorText={prop.colorText} />
        </Box>
      ))}
    </Flex>
  );
}

export default ColorLabelRow;
