import { Box, Flex } from "@chakra-ui/react";

interface ParticipationBarProps {
  type: "open" | "pending";
  participantsCnt: number;
  maxCnt?: number;
}

function ParticipationBar({ type, participantsCnt, maxCnt = 8 }: ParticipationBarProps) {
  return (
    <Flex align="center" py={4} fontSize="16px" fontWeight="semibold" borderBottom="var(--border)">
      <span>{type === "open" ? "참여 인원" : "참여중인 인원"}</span>
      <Box as="span" ml={2} color="mint">
        {participantsCnt}
      </Box>
      <Box as="span" mx={1} color="gray.600">
        /
      </Box>
      {maxCnt ? (
        <Box as="span" color="gray.600">
          {maxCnt}
        </Box>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="var(--gray-600)"
          >
            <path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" />
          </svg>
        </>
      )}
    </Flex>
  );
}

export default ParticipationBar;
