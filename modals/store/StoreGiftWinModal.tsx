import { Box, Flex } from "@chakra-ui/react";

import { IModal } from "../../types/components/modalTypes";
import { StoreGiftProps } from "../../types/models/store";
import { IFooterOptions, ModalLayout } from "../Modals";
interface IStoreGiftWinModal extends IModal {
  winners: StoreGiftProps["winner"];
}

function StoreGiftWinModal({ setIsModal, winners }: IStoreGiftWinModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
    },
  };

  return (
    <ModalLayout title="당첨자 발표" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box mb={5} color="gray.700" lineHeight="20px">
        🎉 당첨을 축하합니다 🎉
      </Box>
      <Flex py={4} bg="gray.100" border="1px solid var(--gray-200)" borderRadius="8px">
        {winners.map((winner, idx) => {
          return (
            <Box flex={1} color="mint" fontSize="12px" fontWeight="semibold" key={idx}>
              {winner.name}
            </Box>
          );
        })}
      </Flex>
    </ModalLayout>
  );
}

export default StoreGiftWinModal;
