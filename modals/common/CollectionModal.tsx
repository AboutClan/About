import styled from "styled-components";

import { AlphabetIcon } from "../../components/Icons/AlphabetIcon";
import { IModal } from "../../types/components/modalTypes";
import { CollectionProps } from "../../types/models/collections";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../Modals";

interface ICollectionModal extends IModal {
  collection: CollectionProps;
}

function CollectionModal({ collection, setIsModal }: ICollectionModal) {
  if (!collection) return;

  const footerOptions: IFooterOptions = {
    main: {},
  };

  const headerOptions: IHeaderOptions = {};

  return (
    <ModalLayout
      title="알파벳을 획득했어요!"
      footerOptions={footerOptions}
      headerOptions={headerOptions}
      setIsModal={setIsModal}
    >
      <Container>
        {collection?.alphabet ? (
          <AlphabetIcon alphabet={collection.alphabet} isBeat={true} />
        ) : (
          <></>
        )}
      </Container>
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
