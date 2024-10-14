import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import { AboutIcon } from "../../components/atoms/AboutIcons";

import { StarIcon } from "../../components/Icons/StarIcons";
import { IModal } from "../../types/components/modalTypes";
import { CollectionProps } from "../../types/models/collections";
import { IFooterOptions, ModalLayout } from "../Modals";

interface ICollectionModal extends IModal {
  collection: CollectionProps;
}

function CollectionModal({ collection, setIsModal }: ICollectionModal) {
  if (!collection) return;

  console.log("collection", collection);
  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <ModalLayout
      title={collection?.alphabet ? "알파벳을 획득했어요!" : "출석 완료!"}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <>
        {collection?.alphabet ? (
          <AboutIcon alphabet={collection.alphabet} size="lg" />
        ) : (
          <Box w="100%">
            <Flex w="100%" justify="space-between" px={3}>
              {new Array(5).fill(0).map((_, idx) => (
                <Flex
                  justify="center"
                  align="center"
                  key={idx}
                  w={10}
                  h={10}
                  opacity={idx < collection.stamps - 1 ? 1 : 0.2}
                  borderRadius="50%"
                  bgColor={idx < collection.stamps - 1 ? "var(--color-mint)" : "var(--color-gray)"}
                >
                  <StarIcon />
                </Flex>
              ))}
            </Flex>
            <Box mt={2} lineHeight="20px">
              <b>{5 - collection.stamps}개의 스탬프</b>를 더 모으면
              <br />
              알파벳을 획득할 수 있어요 !
            </Box>
          </Box>
        )}
      </>
    </ModalLayout>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  height: 100%;
`;

export default CollectionModal;
