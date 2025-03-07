import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { TurnArrowIcon } from "../Icons/ArrowIcons";
import { CheckCircleIcon } from "../Icons/CircleIcons";
import { UserIcon } from "../Icons/UserIcons";
import { STUDY_MAX_CNT,StudyThumbnailCardProps } from "./cards/StudyThumbnailCard";
import PlaceImage from "./PlaceImage";

export interface PickerRowButtonProps extends Partial<StudyThumbnailCardProps> {
  pickType: "main" | "first" | "second" | null;
  onClick: () => void;
  isNoSelect?: boolean;
  isOnlyPlaceInfo?: boolean;
  hasLocationDetail?: boolean;
}

function PickerRowButton({
  onClick,
  pickType,
  place,
  participantCnt,
  id,
  isNoSelect,
  isOnlyPlaceInfo = false,
  hasLocationDetail,
}: PickerRowButtonProps) {
  return (
    <Button
      h={
        pickType === "second"
          ? isOnlyPlaceInfo
            ? "64px"
            : "68px"
          : isOnlyPlaceInfo
            ? "88px"
            : "92px"
      }
      w="full"
      p={4}
      pl={pickType == "second" ? 5 : undefined}
      py={isOnlyPlaceInfo ? 3 : 4}
      variant="unstyled"
      border=" 1px solid var(--gray-200)"
      borderColor={
        isNoSelect ? "gray.200" : pickType === "second" ? "orange" : !pickType ? "gray.200" : "mint"
      }
      bg={pickType === "first" || pickType === "main" ? "rgba(0, 194, 179, 0.02)" : "white"}
      display="block"
      borderRadius="12px"
      onClick={onClick}
    >
      <Flex align="center">
        <Box mr={4}>
          {pickType !== "second" ? (
            <CheckCircleIcon
              size="lg"
              color={pickType === "first" || pickType === "main" ? "mint" : "gray"}
              isFill
            />
          ) : (
            <TurnArrowIcon color={isNoSelect ? "gray" : "orange"} />
          )}
        </Box>
        <Flex flex={1} mr={4} direction="column" alignItems="flex-start" minW={0} textAlign="left">
          {pickType === "main" && (
            <Badge
              mb={1}
              borderRadius="4px"
              fontWeight="bold"
              px={2}
              colorScheme="mint"
              fontSize="10px"
              h="20px"
              lineHeight="20px"
            >
              1지망
            </Badge>
          )}
          <Title>{place.name}</Title>
          {(pickType !== "second" || hasLocationDetail) && (
            <Subtitle fontsize={pickType === "main" ? 12 : 11}>
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
          )}
          {pickType !== "main" && !isOnlyPlaceInfo && (
            <Flex
              mt={pickType !== "second" && 3}
              mr={4}
              alignItems="center"
              lineHeight="12px"
              justify="space-between"
            >
              <Flex align="center" color="var(--gray-500)">
                <UserIcon size="sm" />
                <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                  <Box
                    fontWeight={600}
                    as="span"
                    color={
                      participantCnt >= STUDY_MAX_CNT ? "var(--color-red)" : "var(--color-gray)"
                    }
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
              {pickType === "second" && (
                <Box fontSize="11px">
                  <Box as="span" fontWeight={400} color="var(--gray-400)">
                    ・
                  </Box>
                  <Box as="span" fontWeight="semibold" color="var(--gray-500)">
                    1지망으로부터 {place?.distance}KM
                  </Box>
                </Box>
              )}
            </Flex>
          )}
        </Flex>

        <Box>
          {pickType !== "second" ? (
            <PlaceImage size="sm" imageProps={place.imageProps} id={id} />
          ) : (
            <CheckCircleIcon size="lg" color={isNoSelect ? "gray" : "orange"} isFill />
          )}
        </Box>
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
