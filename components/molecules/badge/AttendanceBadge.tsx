import { Box, Button } from "@chakra-ui/react";

import { CheckCircleIcon, XCircleIcon } from "../../Icons/CircleIcons";
import { ImageIcon } from "../../Icons/ImageIcons";

interface IAttendanceBadge {
  type: "attend" | "dismissed";
  time?: string;
  setImageProps: () => void;
}

export default function AttendanceBadge({ type, time, setImageProps }: IAttendanceBadge) {
  const onClickButton = () => {
    if (setImageProps) {
      setImageProps();
    }
  };

  return (
    <Box my={1}>
      <Button
        variant="unstyled"
        display="flex"
        mb={1}
        alignItems="center"
        w="56px"
        h="24px"
        px="10px"
        py={1}
        borderRadius="8px"
        color="white"
        bg={type === "attend" ? "mint" : "red"}
        onClick={onClickButton}
      >
        {type === "attend" ? (
          setImageProps ? (
            <ImageIcon />
          ) : (
            <CheckCircleIcon size="sm" isFill />
          )
        ) : (
          <XCircleIcon size="sm" />
        )}
        <Box ml={1} fontSize="11px" lineHeight="16px" fontWeight="semibold">
          {type === "attend" ? (setImageProps ? "인증" : "출석") : "불참"}
        </Box>
      </Button>

      {time && (
        <Box fontSize="11px" lineHeight="12px" color="gray.500" textAlign="center">
          {time}
        </Box>
      )}
    </Box>
  );
}
