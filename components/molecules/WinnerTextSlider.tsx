import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import TextSlider, { TextProps } from "../organisms/TextSlider";

interface WinnerTextSliderProps {
  textArr: TextProps[];
}

function WinnerTextSlider({ textArr }: WinnerTextSliderProps) {
  const router = useRouter();

  return (
    <Box>
      <Flex
        w="full"
        as="button"
        onClick={() => {
          router.push(`/prize`);
        }}
       
        px={4}
        py={5}
        h="64px"
        bg="rgba(0, 194, 179, 0.1)"
        borderRadius="8px"
      >
        <Box
          fontWeight="medium"
          w="max-content"
          borderRadius="full"
          color="white"
          bg="mint"
          fontSize="11px"
          px="6px"
          py="5px"
          mr={2}
        >
          당첨자 기록
        </Box>
        <Flex overflow="hidden" flex={1}>
          <TextSlider textArr={textArr || []} />
        </Flex>
      </Flex>
    </Box>
  );
}

export default WinnerTextSlider;
