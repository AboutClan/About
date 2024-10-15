import { Box, Button, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import { SingleLineText } from "../../styles/layout/components";
import { CheckCircleIcon } from "../Icons/CircleIcons";
import { UserIcon } from "../Icons/UserIcons";
import { StudyThumbnailCardProps, STUDY_MAX_CNT } from "./cards/StudyThumbnailCard";
import PlaceImage from "./PlaceImage";

interface PickerRowButtonProps extends Partial<StudyThumbnailCardProps> {
  pickType: "main" | "sub" | null;
}

function PickerRowButton({ pickType, place, participantCnt, func, id }: PickerRowButtonProps) {
  return (
    <Button
      h="92px"
      w="full"
      p={4}
      variant="unstyled"
      border="1px solid var(--gray-200)"
      borderRadius="12px"
    >
      <Flex align="center">
        <Box mr={4}>
          <CheckCircleIcon size="lg" />
        </Box>

        <Flex flex={1} bg="pink" mr={4} direction="column" align="flex-start">
          <Title>하우짓 블랙</Title>
          <Subtitle>
            <Box as="span" fontWeight={600}>
              {place.distance && `${place.distance}KM`}
            </Box>
            <Box as="span" color="var(--gray-400)">
              ・
            </Box>
            <Box as="span">{place.address}</Box>
          </Subtitle>

          <Flex mt={3} mr={4} alignItems="center" justify="space-between">
            <Flex align="center" color="var(--gray-500)">
              <UserIcon size="sm" />
              <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                <Box
                  fontWeight={600}
                  as="span"
                  color={participantCnt >= STUDY_MAX_CNT ? "var(--color-red)" : "var(--color-gray)"}
                >
                  {participantCnt}명 참여중
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

        <Box ml="auto">
          <PlaceImage size="sm" imageProps={place.imageProps} hasToggleHeart id={id} />
        </Box>
      </Flex>
    </Button>
  );
}
const Title = styled(SingleLineText)`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;

  line-height: 12px;
`;
export default PickerRowButton;
