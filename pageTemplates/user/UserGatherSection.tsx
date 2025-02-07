import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";

interface UserGatherSectionProps {}

type GatherType = "참여중인 모임" | "종료된 모임" | "내가 개설한 모임";

function UserGatherSection({}: UserGatherSectionProps) {
  const [gatherType, setGatherType] = useState<GatherType>("참여중인 모임");

  return (
    <Box mx={5}>
      <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              1
            </Flex>
          }
        >
          작성한 후기
        </Button>
        <Box color="gray.300" fontWeight="light" fontSize="13px" w={1} h="20px" my="auto">
          |
        </Box>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              14
            </Flex>
          }
        >
          받은 후기
        </Button>
      </Flex>
      <Box py={2}>
        <ButtonGroups
          buttonOptionsArr={(
            ["참여중인 모임", "종료된 모임", "내가 개설한 모임"] as GatherType[]
          ).map((prop) => ({
            icon: (
              <CheckCircleIcon color={gatherType === prop ? "black" : "gray"} size="sm" isFill />
            ),
            text: prop,
            func: () => setGatherType(prop),
            color: "black",
          }))}
          currentValue={gatherType}
          isEllipse
          size="md"
        />
      </Box>
    </Box>
  );
}

export default UserGatherSection;
