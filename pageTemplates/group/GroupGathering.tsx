import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";

interface GroupGatheringProps {
  gatherData: GatherThumbnailCardProps[];
}

function GroupGathering({ gatherData }: GroupGatheringProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box mx={5} mb={10} mt={5}>
      <Flex mb={2} fontSize="18px" lineHeight="28px">
        <Box mr={2} fontWeight="bold">
          소모임 활동 {gatherData?.length}
        </Box>
      </Flex>
      {gatherData?.length ? (
        (isOpen ? gatherData : gatherData?.slice(0, 3))?.map((cardData, idx) => (
          <Box mb="12px" key={idx}>
            <GatherThumbnailCard {...cardData} />
          </Box>
        ))
      ) : (
        <Box color="gray.600" mb={40} as="p" fontSize="14px" mt={20} textAlign="center">
          아직 업로드 된 활동이 없습니다.
        </Box>
      )}
      {!isOpen && gatherData?.length >= 3 && (
        <Button
          mt={2}
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          onClick={() => setIsOpen(true)}
        >
          더보기
        </Button>
      )}
    </Box>
  );
}

export default GroupGathering;
