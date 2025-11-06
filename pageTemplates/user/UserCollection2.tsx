import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { AboutIcon } from "../../components/atoms/AboutIcons";
import { COLLECTION_ALPHABET } from "../../constants/keys/queryKeys";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";
import { useCollectionAlphabetQuery } from "../../hooks/user/sub/collection/queries";
import { getRandomAlphabet } from "../../libs/userEventLibs/collection";
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
  const queryClient = useQueryClient();

  const { mutate } = useAlphabetMutation("get", {
    onSuccess() {
      queryClient.refetchQueries([COLLECTION_ALPHABET]);
    },
  });

  const { data: alphabets } = useCollectionAlphabetQuery({
    enabled: !isGuest,
    onError() {},
  });

  useEffect(() => {
    if (alphabets === undefined) return;
    if (!alphabets) {
      mutate({ alphabet: getRandomAlphabet(100) });
    }
  }, [alphabets]);

  const alphabetArr = alphabets?.collects;

  return (
    <Flex direction="column" fontSize="16px" mt={5}>
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
          <span>컬렉션</span>
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
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  font-size: 24px;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`;
