import { Button, Flex } from "@chakra-ui/react";

import CurrentLocationBtn from "../../../components/atoms/CurrentLocationBtn";

interface TopNavProps {
  handleLocationRefetch: () => void;
  isMapExpansion: boolean;
  onClose: () => void;
}

function TopNav({ handleLocationRefetch, isMapExpansion, onClose }: TopNavProps) {
  return (
    <>
      <Flex
        w="100%"
        direction={isMapExpansion ? "row-reverse" : "row"}
        justify="space-between"
        p={4}
        position="absolute"
        top="0"
        left="0"
        zIndex={700}
      >
        <CurrentLocationBtn onClick={handleLocationRefetch} isBig={isMapExpansion} />
        {/* <Flex align="center" flex={1} bg="white">
          <div
            style={{ position: "relative", width: "37px", height: "45px" }}
            dangerouslySetInnerHTML={{ __html: getStudyIcon("none") }}
          />
        </Flex> */}
        {!isMapExpansion ? (
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
        ) : (
          <Button p={0} w="48px" h="48px" bg="white" onClick={onClose}>
            <XIcon />
          </Button>
        )}
      </Flex>
    </>
  );
}

export default TopNav;

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-900)"
    >
      <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
    </svg>
  );
}

function ExpansionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="#424242"
    >
      <path d="M160-120q-17 0-28.5-11.5T120-160v-240q0-17 11.5-28.5T160-440q17 0 28.5 11.5T200-400v144l504-504H560q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v240q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-144L256-200h144q17 0 28.5 11.5T440-160q0 17-11.5 28.5T400-120H160Z" />
    </svg>
  );
}
