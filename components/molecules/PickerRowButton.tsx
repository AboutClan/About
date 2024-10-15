import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import { SingleLineText } from "../../styles/layout/components";
import { TurnArrowIcon } from "../Icons/ArrowIcons";
import { CheckCircleIcon } from "../Icons/CircleIcons";
import { UserIcon } from "../Icons/UserIcons";
import { StudyThumbnailCardProps, STUDY_MAX_CNT } from "./cards/StudyThumbnailCard";
import PlaceImage from "./PlaceImage";

interface PickerRowButtonProps extends Partial<StudyThumbnailCardProps> {
  pickType: "main" | "first" | "second" | null;
  onClick: () => void;
}

function PickerRowButton({ onClick, pickType, place, participantCnt, id }: PickerRowButtonProps) {
  console.log(pickType);
  return (
    <Button
      h="92px"
      w="full"
      p={4}
      pl={pickType == "second" ? 5 : undefined}
      variant="unstyled"
      border=" 1px solid var(--gray-200)"
      borderColor={pickType === "second" ? "orange" : !pickType ? "gray.200" : "mint"}
      bg={pickType === "first" || pickType === "main" ? "rgba(0, 194, 179, 0.02)" : "white"}
      borderRadius="12px"
      onClick={onClick}
    >
      <Flex align="center">
        <Box mr={4}>
          {pickType !== "second" ? (
            <CheckCircleIcon size="lg" type={pickType === "first" ? "mint" : "gray"} />
          ) : (
            <TurnArrowIcon />
          )}
        </Box>
        <Flex flex={1} mr={4} direction="column" align="flex-start">
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
          <Subtitle>
            <Box as="span" fontWeight={600}>
              {place.distance && `${place.distance}KM`}
            </Box>
            <Box as="span" color="var(--gray-400)">
              ・
            </Box>
            <Box as="span">{place.address}</Box>
          </Subtitle>
          {pickType !== "main" && (
            <Flex mt={3} mr={4} alignItems="center" justify="space-between">
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
          )}
        </Flex>

        <Box ml="auto">
          {pickType !== "second" ? (
            <PlaceImage size="sm" imageProps={place.imageProps} hasToggleHeart id={id} />
          ) : (
            <CheckCircleIcon size="lg" type="orange" />
          )}
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
