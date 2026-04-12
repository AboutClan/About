import { Button, Flex } from "@chakra-ui/react";

import { useTypeToast } from "../../../../../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../../../../../hooks/custom/UserHooks";
import { LocationIcon } from "../../../../../../pageTemplates/studyPage/StudyPageHeader";
import { LocationProps } from "../../../../../../types/common";

interface LocationSearchProps {
  text: string;
  handleClick: () => void;
  changeVoteLocation: (l: LocationProps) => void;
  defaultLocation: LocationProps;
}

function LocationSearch({ text, handleClick }: LocationSearchProps) {
  const typeToast = useTypeToast();
  const isGuest = useCheckGuest();

  return (
    <Flex align="center">
      <Flex
        ml="-1px"
        p={1}
        px={1.5}
        justify="center"
        align="center"
        h={5}
        bg=" rgba(160, 174, 192, 0.2)"
        fontSize="10px"
        borderRadius="6px"
        color="gray.800"
        w="max-content"
      >
        설정 위치 - {text}
      </Flex>
      <RightTriangleIcon />
      <Button
        display="flex"
        justifyItems="center"
        alignItems="center"
        variant="unstyled"
        w={6}
        h={6}
        mr={0.5}
        onClick={() => {
          if (isGuest) {
            typeToast("guest");
            return;
          }
          handleClick();
        }}
      >
        <LocationIcon />
      </Button>
    </Flex>
  );
}

function RightTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M6 5L0.75 0.669872L0.75 9.33013L6 5Z" fill="var(--gray-200)" />
    </svg>
  );
}

export default LocationSearch;
