import { Box, Flex } from "@chakra-ui/react";
import IconButton from "../../components/atoms/buttons/IconButton";

import Slide from "../../components/layouts/PageSlide";
import TabNav from "../../components/molecules/navs/TabNav";

function StudyPageHeader() {
  return (
    <Slide isFixed>
      <Flex bg="white" as="header" px={5} py={5} justify="space-between" align="center">
        <Flex>
          <TabNav
            tabOptionsArr={[{ text: "스터디 참여" }, { text: "카공 지도" }]}
            isBlack
            size="lg"
            isMain
          />
        </Flex>
        <Flex>
          <Flex
            justify="center"
            align="center"
            mr={3}
            bgColor="rgba(0, 194, 179, 0.1)"
            borderRadius="full"
            w="32px"
            h="32px"
          >
            <Flex
              justify="center"
              align="center"
              color="white"
              bgColor="mint"
              fontWeight="1000"
              fontSize="16px"
              borderRadius="full"
              w="24px"
              h="24px"
              lineHeight="1"
              pt="2px"
            >
              P
            </Flex>
            {/* <PointGuideModalButton type="study" /> */}
          </Flex>
          <Box>
            <IconButton>
              <LocationIcon />
            </IconButton>
          </Box>
        </Flex>
      </Flex>
    </Slide>
  );
}

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="var(--color-gray)"
  >
    <path d="M480-107q-14 0-28-5t-25-15q-65-60-115-117t-83.5-110.5q-33.5-53.5-51-103T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 45-17.5 94.5t-51 103Q698-301 648-244T533-127q-11 10-25 15t-28 5Zm0-373q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z" />
  </svg>
);

export default StudyPageHeader;
