import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { AboutIcon } from "../../components/atoms/AboutIcons";
import IconRowBlock from "../../components/atoms/blocks/IconRowBlock";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useCollectionAlphabetQuery } from "../../hooks/user/sub/collection/queries";
import UserCollectionModal from "../../modals/user/collection/UserCollectionAlphabetModal";
import { Alphabet } from "../../types/models/collections";
import { ArrowIcon } from "./UserProfile2";

export const changeAlphabet = (alphabet: Alphabet) => {
  switch (alphabet) {
    case "A":
      return "A";
    case "B":
      return "b";
    case "O":
      return "o";
    case "U":
      return "u";
    case "T":
      return "t";
  }
};

export default function UserCollection() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const isGuest = session?.user.name === "guest";

  const [isCollectionModal, setIsCollectionModal] = useState(false);

  const { data: alphabets } = useCollectionAlphabetQuery({
    enabled: !isGuest,
  });
  const alphabetArr = alphabets?.collects;

  return (
    <Flex direction="column" mb={8}>
      <Link
        href="/user/alphabet"
        onClick={
          isGuest
            ? (e) => {
                typeToast("guest");
                e.preventDefault();
                e.stopPropagation();
              }
            : () => {}
        }
      >
        <BlockItem>
          <span>알파벳 컬렉션</span>
          <ArrowIcon />
        </BlockItem>
        <AlphabetContainer>
          <AboutIcon alphabet="A" isActive={alphabetArr?.includes("A")} />
          <AboutIcon alphabet="B" isActive={alphabetArr?.includes("B")} />
          <AboutIcon alphabet="O" isActive={alphabetArr?.includes("O")} />
          <AboutIcon alphabet="U" isActive={alphabetArr?.includes("U")} />
          <AboutIcon alphabet="T" isActive={alphabetArr?.includes("T")} />
        </AlphabetContainer>
      </Link>
      <Box mx={5}>
        <IconRowBlock
          leftIcon={
            <i className="fa-duotone fa-stars fa-2x" style={{ color: "var(--color-mint)" }} />
          }
          func={() => setIsCollectionModal(true)}
          mainText=" 컬렉션 수집 보상"
          subText=" 여러번 수집하면 보상이 더 올라가요!"
        />
      </Box>
      {isCollectionModal && <UserCollectionModal setIsModal={setIsCollectionModal} />}
    </Flex>
  );
}

const BlockItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  line-height: 20px;
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
