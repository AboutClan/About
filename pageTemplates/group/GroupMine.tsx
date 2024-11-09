import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { PlusIcon } from "../../components/Icons/MathIcons";

import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { IGroup } from "../../types/models/groupTypes/group";
import { getRandomImage } from "../../utils/imageUtils";

interface IGroupMine {
  myGroups: IGroup[];
}

function GroupMine({ myGroups }: IGroupMine) {
  const setGroup = useSetRecoilState(transferGroupDataState);

  const imageTileArr: IImageTile[] = myGroups
    ?.filter((group) => group.status !== "end")
    .map((group) => ({
      imageUrl: group.image || getRandomImage(),
      text: group.title,
      url: `/group/${group.id}`,
      func: () => setGroup(group),
      type: "circle",
    }));

  return (
    <Flex pl={5} pt="10px" pb="14px">
      <Link href="/group/writing/main">
        <Flex direction="column" w="64px" h="84px" align="center">
          <Button
            w="56px"
            h="56px"
            color="white"
            borderRadius="50%"
            variant="unstyled"
            bg="gray.800"
            display="flex"
            m={1}
          >
            <PlusIcon size="md" color="white" />
          </Button>
          <Box mt={2} fontSize="10px" lineHeight="12px" fontWeight="regular" color="gray.600">
            모임 만들기
          </Box>
        </Flex>
      </Link>
      <Box mx={3} w="1px" bg="gray.200" h="24px" my="auto" />
      {myGroups?.length ? (
        <ImageTileSlider imageTileArr={imageTileArr} slidesPerView={3.8} size="md" />
      ) : (
        <BlockLayout>가입중인 소모임이 없습니다.</BlockLayout>
      )}
    </Flex>
  );
}

const Layout = styled.div`
  background-color: var(--gray-100);
  border-bottom: 6px solid var(--gray-200);
  padding: 16px;
`;

const BlockLayout = styled.div`
  height: 110px;
  background-color: inherit;
  padding-top: 2px;
  border-radius: var(--rounded);
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  color: var(--gray-600);
`;

export default GroupMine;
