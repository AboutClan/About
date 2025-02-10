import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
import { useGatherMyStatusQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import GatherSkeletonMain from "../gather/GatherSkeletonMain";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";

interface UserGatherSectionProps {}

type GatherType = "참여중인 모임" | "종료된 모임" | "내가 개설한 모임";

function UserGatherSection({}: UserGatherSectionProps) {
  const [gatherType, setGatherType] = useState<GatherType>("참여중인 모임");
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();
  const setTransferGatherData = useSetRecoilState(transferGatherDataState);
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);
  console.log(gatherType);
  const { data: gatherData, isLoading } = useGatherMyStatusQuery(
    cursor,
    gatherType === "참여중인 모임"
      ? "isParticipating"
      : gatherType === "종료된 모임"
      ? "isEnded"
      : "isOwner",
  );
  console.log(gatherData);

  useEffect(() => {
    setGathers([]);
    setCursor(0);
  }, [gatherType]);

  useEffect(() => {
    if (gatherData) {
      setGathers((old) => [...old, ...gatherData]);
      firstLoad.current = false;
    }
  }, [gatherData]);

  useEffect(() => {
    if (!gathers) return;
    setCardDataArr(
      setGatherDataToCardCol(gathers, 6, (gather: IGather) => setTransferGatherData(gather)),
    );
  }, [gathers, location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prevCursor) => prevCursor + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <Box mx={5} pb={10}>
      <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              1
            </Flex>
          }
        >
          작성한 후기
        </Button>
        <Box color="gray.300" fontWeight="light" fontSize="13px" w={1} h="20px" my="auto">
          |
        </Box>
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              14
            </Flex>
          }
        >
          받은 후기
        </Button>
      </Flex>
      <Box py={2} mb={3}>
        <ButtonGroups
          buttonOptionsArr={(
            ["참여중인 모임", "종료된 모임", "내가 개설한 모임"] as GatherType[]
          ).map((prop) => ({
            icon: (
              <CheckCircleIcon color={gatherType === prop ? "black" : "gray"} size="sm" isFill />
            ),
            text: prop,
            func: () => setGatherType(prop),
            color: "black",
          }))}
          currentValue={gatherType}
          isEllipse
          size="md"
        />
      </Box>

      <Box position="relative" minH="320px">
        {cardDataArr?.length ? (
          <>
            {cardDataArr.map((cardData, idx) => (
              <Box mb="12px" key={idx}>
                <GatherThumbnailCard {...cardData} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((cardData, idx) => (
              <Box mb="12px" key={idx}>
                <GatherSkeletonMain />
              </Box>
            ))}
          </>
        )}
        <div ref={loader} />
        {isLoading && cardDataArr?.length ? (
          <Box position="relative" mt="32px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Box>
    </Box>
  );
}

export default UserGatherSection;
