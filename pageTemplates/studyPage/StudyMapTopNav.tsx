import { Flex } from "@chakra-ui/react";

import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";

interface StudyMapTopNavProps {
  handleLocationRefetch: () => void;
  isRight: boolean;
}

function StudyMapTopNav({ handleLocationRefetch, isRight }: StudyMapTopNavProps) {
  return (
    <Flex
      w="100%"
      justify={isRight ? "flex-end" : "space-between"}
      p={4}
      position="absolute"
      top="0"
      left="0"
      zIndex={5}
    >
      <CurrentLocationBtn onClick={handleLocationRefetch} isBig={isRight} />
    </Flex>
  );
}

export default StudyMapTopNav;
