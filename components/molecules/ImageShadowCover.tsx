import { Box, Flex } from "@chakra-ui/react";

interface ImageShadowCoverProps {
  text: string;
  color: "mint" | "red";
  size: "sm" | "lg";
}

function ImageShadowCover({ text, color, size }: ImageShadowCoverProps) {
  return (
    <Flex
      bg="rgba(0,0,0,0.2)"
      justify="center"
      align="center"
      position="absolute"
      top={0}
      left={0}
      w="full"
      h="full"
      borderRadius="8px"
    >
      <Box
        p={1}
        border="1px solid var(--color-red)"
        borderColor={color}
        zIndex={5}
        borderRadius="8px"
      >
        <Box
          borderRadius="4px"
          color="white"
          bg={color}
          fontSize={size === "lg" ? "11px" : "8px"}
          w={size === "lg" ? "80px" : "40px"}
          fontWeight="semibold"
          lineHeight={size === "lg" ? "20px" : "12px"}
          textAlign="center"
        >
          {text}
        </Box>
      </Box>
    </Flex>
  );
}

export default ImageShadowCover;
