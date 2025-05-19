import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { MouseEvent, useMemo } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { PlusIcon } from "../../components/Icons/MathIcons";
import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { useToast } from "../../hooks/custom/CustomToast";
import { useGroupsMineQuery } from "../../hooks/groupStudy/queries";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { getRandomImage } from "../../utils/imageUtils";

function GroupMine() {
  const { data } = useGroupsMineQuery("pending");
  const toast = useToast();

  const setGroup = useSetRecoilState(transferGroupDataState);

  const imageTileArr: IImageTile[] = useMemo(
    () =>
      data
        ?.filter((group) => group.status !== "end")
        .sort(() => Math.random() - 0.5)
        .map((group) => ({
          imageUrl: group?.squareImage || getRandomImage(GATHER_MAIN_IMAGE_ARR["공통"]),
          text: group.title,
          url: `/group/${group.id}`,
          func: () => setGroup(group),
          type: "circle",
        })),
    [data, setGroup],
  );

  const handleClick = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    toast("info", "소모임 개설을 위해서는 운영진에게 문의주세요!");
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Flex pl={5} pt="10px" pb="14px">
      <Link href="/group/writing/main" onClick={(e) => handleClick(e)}>
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
