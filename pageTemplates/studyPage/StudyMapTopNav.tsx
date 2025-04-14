import { Button, Flex } from "@chakra-ui/react";

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
      {!isRight && (
        <Button
          borderRadius="4px"
          bgColor="white"
          boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
          w="32px"
          h="32px"
          size="sm"
          p="0"
          border="1px solid var(--gray-100)"
        >
          <ExpansionIcon />
        </Button>
      )}
    </Flex>
  );
}

export default StudyMapTopNav;

function ExpansionIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="#424242"
  >
    <path d="M160-120q-17 0-28.5-11.5T120-160v-240q0-17 11.5-28.5T160-440q17 0 28.5 11.5T200-400v144l504-504H560q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v240q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-144L256-200h144q17 0 28.5 11.5T440-160q0 17-11.5 28.5T400-120H160Z" />
  </svg>
}
