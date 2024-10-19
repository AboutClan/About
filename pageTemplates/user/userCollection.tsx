import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { AboutIcon } from "../../components/atoms/AboutIcons";
import { useCollectionAlphabetQuery } from "../../hooks/user/sub/collection/queries";
import UserCollectionModal from "../../modals/user/collection/UserCollectionAlphabetModal";

export default function UserCollection() {
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";

  const [isCollectionModal, setIsCollectionModal] = useState(false);

  const { data: alphabets } = useCollectionAlphabetQuery({
    enabled: !isGuest,
  });
  const alphabetArr = alphabets?.collects;

  return (
    <Flex direction="column">
      <Link href="/user/alphabet">
        <BlockItem>
          <span>알파벳 컬렉션</span>
          <i className="fa-solid fa-chevron-right" />
        </BlockItem>
        <AlphabetContainer>
          <AboutIcon alphabet="A" isActive={alphabetArr?.includes("A")} />
          <AboutIcon alphabet="B" isActive={alphabetArr?.includes("B")} />
          <AboutIcon alphabet="O" isActive={alphabetArr?.includes("O")} />
          <AboutIcon alphabet="U" isActive={alphabetArr?.includes("U")} />
          <AboutIcon alphabet="T" isActive={alphabetArr?.includes("T")} />
        </AlphabetContainer>
      </Link>
      <AlphabetQNABtn onClick={() => setIsCollectionModal(true)}>
        <IconWrapper>
          <i className="fa-duotone fa-stars fa-2x" style={{ color: "var(--color-mint)" }} />
        </IconWrapper>
        <AlphabetQNABtnContents>
          <span>여러번 수집하면 보상이 더 올라가요!</span>
          <span>컬렉션 수집 보상</span>
        </AlphabetQNABtnContents>
      </AlphabetQNABtn>
      {isCollectionModal && <UserCollectionModal setIsModal={setIsCollectionModal} />}
    </Flex>
  );
}

const BlockItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--gap-4);

  font-weight: 600;
  > span:first-child {
    > b {
      color: var(--color-mint);
    }
  }
`;

const AlphabetContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 32px;
  display: flex;
  justify-content: center;
  font-size: 24px;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`;

const AlphabetQNABtn = styled.button`
  margin: 0 16px;
  width: inherit;
  display: flex;
  align-items: center;
  background-color: var(--gray-100);

  padding: var(--gap-3) var(--gap-4);
  border-radius: var(--rounded-lg);
  color: var(--color-font-h2);
`;

const IconWrapper = styled.div`
  margin-right: var(--gap-3);
`;

const AlphabetQNABtnContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > span:first-child {
    font-size: 12px;
    color: var(--gray-600);
  }
  > span:last-child {
    font-weight: 600;
    color: var(--gray-700);
    font-size: 14px;
  }
`;
