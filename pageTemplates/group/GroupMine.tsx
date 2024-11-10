import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";
import { useSetRecoilState } from "recoil";

import { PlusIcon } from "../../components/Icons/MathIcons";
import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { useGroupsMineQuery } from "../../hooks/groupStudy/queries";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { getRandomImage } from "../../utils/imageUtils";

function GroupMine() {
  const { data } = useGroupsMineQuery();

  const setGroup = useSetRecoilState(transferGroupDataState);

  const imageTileArr: IImageTile[] = useMemo(
    () =>
      data
        ?.filter((group) => group.status !== "end")
        .map((group) => ({
          imageUrl: group.image || getRandomImage(),
          text: group.title,
          url: `/group/${group.id}`,
          func: () => setGroup(group),
          type: "circle",
        })),
    [data, setGroup],
  );

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
      {imageTileArr?.length ? (
        <ImageTileSlider
          imageTileArr={imageTileArr}
          slidesPerView={imageTileArr.length < 4 ? imageTileArr.length : 3.7}
          size="md"
        />
      ) : null}
    </Flex>
  );
}

export default GroupMine;
