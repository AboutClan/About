import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MouseEvent, useMemo } from "react";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { PlusIcon } from "../../components/Icons/MathIcons";
import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useGroupsMineQuery } from "../../hooks/groupStudy/queries";
import { getRandomImage } from "../../utils/imageUtils";

function GroupMine() {
  const { data: session } = useSession();
  const { data } = useGroupsMineQuery("pending");
  const typeToast = useTypeToast();
  const isGuest = session?.user.role === "guest";

  const imageTileArr: IImageTile[] = useMemo(
    () =>
      data
        ?.filter((group) => group.status !== "end")
        .sort(() => Math.random() - 0.5)
        .map((group) => ({
          imageUrl: group?.squareImage || getRandomImage(GATHER_MAIN_IMAGE_ARR["공통"]),
          text: group.title,
          url: `/group/${group.id}`,
          type: "circle",
        })),
    [data],
  );

  const handleClick = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (isGuest) {
      typeToast("guest");
      e.stopPropagation();
      e.preventDefault();
      return;
    }
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
            소모임 개설
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
