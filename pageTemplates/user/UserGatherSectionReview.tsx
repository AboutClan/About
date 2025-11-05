import { Box, Button, Flex } from "@chakra-ui/react";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useFeedCntQuery } from "../../hooks/feed/queries";

function UserGatherSectionReview() {
  const typeToast = useTypeToast();

  const { data } = useFeedCntQuery("gather");

  return (
    <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
      <Button
        flex={1}
        variant="unstyled"
        fontSize="12px"
        fontWeight="semibold"
        lineHeight="16px"
        color="gray.700"
        onClick={() => typeToast("inspection")}
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
            {data?.writtenReviewCnt || 0}
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
        onClick={() => typeToast("inspection")}
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
            {data?.reviewReceived || 0}
          </Flex>
        }
      >
        받은 후기
      </Button>
    </Flex>
  );
}

export default UserGatherSectionReview;
