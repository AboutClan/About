import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import AlertDot from "../../components/atoms/AlertDot";
import { GATHER_REVIEW_RECEIVE, GATHER_REVIEW_WRITE } from "../../constants/keys/localStorage";
import { useToast } from "../../hooks/custom/CustomToast";
import { useFeedCntQuery, useFeedTypeQuery } from "../../hooks/feed/queries";
import GathersReviewDrawer from "../../modals/gather/gatherExpireModal/GathersReviewDrawer";

function UserGatherSectionReview() {
  const toast = useToast();
  const [modalType, setModalType] = useState<"mine" | "receive">(null);

  const { data } = useFeedTypeQuery(modalType, { enabled: !!modalType });
  const { data: feeds } = useFeedCntQuery();

  const feedSumWriteSave = localStorage.getItem(GATHER_REVIEW_WRITE);
  const feedSumReceiveSave = localStorage.getItem(GATHER_REVIEW_RECEIVE);

  useEffect(() => {
    if (!data) return;
    if (modalType === "mine") {
      localStorage.setItem(GATHER_REVIEW_WRITE, data?.length + "");
    } else {
      localStorage.setItem(GATHER_REVIEW_RECEIVE, data?.length + "");
    }
  }, [data]);

  console.log(54, data);
  return (
    <>
      <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          onClick={() => {
            if (!feeds?.writtenReviewCnt) {
              toast("info", "작성한 후기가 없습니다.");
              return;
            }
            setModalType("mine");
          }}
          pos="relative"
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
              {feeds?.writtenReviewCnt || 0}
            </Flex>
          }
        >
          작성한 후기
          {feeds?.writtenReviewCnt > 0 && feedSumWriteSave !== feeds?.writtenReviewCnt + "" && (
            <Box pos="absolute" bottom={3} right={6}>
              <AlertDot />
            </Box>
          )}
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
          onClick={() => {
            if (!feeds?.reviewReceived) {
              toast("info", "받은 후기가 없습니다.");
              return;
            }
            setModalType("receive");
          }}
          pos="relative"
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
              {feeds?.reviewReceived || 0}
            </Flex>
          }
        >
          받은 후기
          {feeds?.reviewReceived > 0 && feedSumReceiveSave !== feeds?.reviewReceived + "" && (
            <Box pos="absolute" bottom={3} right={7}>
              <AlertDot />
            </Box>
          )}
        </Button>
      </Flex>
      {modalType && <GathersReviewDrawer isOpen feeds={data} onClose={() => setModalType(null)} />}
    </>
  );
}

export default UserGatherSectionReview;
