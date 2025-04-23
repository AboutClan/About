import { Box, Flex } from "@chakra-ui/react";

import { IGiftEntry } from "../../pages/store";
import { IModal } from "../../types/components/modalTypes";
import { selectRandomWinners } from "../../utils/validationUtils";
import { IFooterOptions, ModalLayout } from "../Modals";
interface IStoreGiftWinModal extends IModal {
  applicants: IGiftEntry;
  winCnt: number;
}

function StoreGiftWinModal({ setIsModal, applicants, winCnt }: IStoreGiftWinModal) {
  const users = applicants.users.reduce((acc, curr) => {
    for (let i = 0; i < curr.cnt; i++) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const winners: number[] = selectRandomWinners(applicants.max, winCnt, applicants.giftId);

  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
    },
  };
 
  return (
    <ModalLayout title="당첨자 발표" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box mb={4} color="gray.700" lineHeight="20px">
        당첨을 축하합니다
      </Box>
      <Flex py={2} bg="gray.100" border="1px solid var(--gray-200)" borderRadius="8px">
        {winners.map((num, idx) => {
          const name = users[num];
       
          return (
            <Box
              flex={1}
              color="mint"
              fontSize="14px"
              fontWeight="semibold"
              lineHeight="20px"
              key={idx}
            >
              {name?.name?.[0]}*{name?.name?.[2]}
            </Box>
          );
        })}
      </Flex>
    </ModalLayout>
  );
}

export default StoreGiftWinModal;
