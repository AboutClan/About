import { Box, Flex } from "@chakra-ui/react";

import ColorLabel, { ColorLabelProps } from "../../atoms/ColorLabel";

interface ColorLabelRowProps {
  props: ColorLabelProps[];
  isBold?: boolean;
  size?: "sm" | "md";
}

function ColorLabelRow({ props, isBold, size }: ColorLabelRowProps) {
  return (
    <Flex>
      {props.map((prop, idx) => (
        <Box key={idx} mr={idx !== props.length - 1 && 2} fontWeight={isBold ? 600 : 400}>
          <ColorLabel size={size} text={prop.text} color={prop.color} colorText={prop.colorText} />
        </Box>
      ))}
    </Flex>
  );
}

export default ColorLabelRow;
