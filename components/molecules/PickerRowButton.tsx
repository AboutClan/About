import { Box, Button, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { CheckCircleIcon } from "../Icons/CircleIcons";
import { UserIcon } from "../Icons/UserIcons";
import { StudyThumbnailCardProps, STUDY_MAX_CNT } from "./cards/StudyThumbnailCard";
import PlaceImage from "./PlaceImage";

export interface PickerRowButtonProps extends Partial<StudyThumbnailCardProps> {
  onClick: () => void;
  isNoSelect: boolean;
}

function PickerRowButton({ onClick, place, participantCnt, isNoSelect }: PickerRowButtonProps) {
  return (
    <Button
      h="92px"
      w="full"
      p={4}
      py={4}
      variant="unstyled"
      border=" 1px solid var(--gray-200)"
      borderColor={isNoSelect ? "gray.200" : "mint"}
      bg={!isNoSelect ? "rgba(0, 194, 179, 0.02)" : "white"}
      display="block"
      borderRadius="12px"
      onClick={onClick}
    >
      <Flex align="center">
        <Box mr={4}>
          <CheckCircleIcon size="lg" color={isNoSelect ? "gray" : "mint"} isFill />
        </Box>
        <Flex flex={1} mr={4} direction="column" alignItems="flex-start" minW={0} textAlign="left">
          <Title>{place.name}</Title>
          <Subtitle fontsize={true ? 12 : 11}>
            <Box as="span" fontWeight={600}>
              {place.distance && `${place.distance}KM`}
            </Box>
            {place.distance && (
              <Box as="span" fontWeight={400} color="var(--gray-400)">
                ・
              </Box>
            )}
            <Box as="span" fontWeight={400}>
              {place.address}
            </Box>
          </Subtitle>
          <Flex mt={3} mr={4} alignItems="center" lineHeight="12px" justify="space-between">
            <Flex align="center" color="var(--gray-500)">
              <UserIcon size="sm" />
              <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                <Box
                  fontWeight={600}
                  as="span"
                  color={participantCnt >= STUDY_MAX_CNT ? "var(--color-red)" : "var(--color-gray)"}
                >
                  {participantCnt || 0}명 참여중
                </Box>
                <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                  /
                </Box>
                <Box as="span" color="var(--gray-500)" fontWeight={500}>
                  {STUDY_MAX_CNT}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <PlaceImage size="sm" imageProps={place.imageProps} id={""} />
      </Flex>
    </Button>
  );
}
const Title = styled.div`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

const Subtitle = styled.div<{ fontsize: number }>`
  color: var(--gray-500);
  font-size: ${(props) => props.fontsize}px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  line-height: 12px;
`;
export default PickerRowButton;
