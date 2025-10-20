import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";

import InfoBoxCol, { InfoBoxProps } from "../../../components/molecules/InfoBoxCol";
import { IGatherListItem, IGatherLocation } from "../../../types/models/gatherTypes/gatherTypes";
import StudyAddressMap from "../../study/StudyAddressMap";

interface IGather {
  content: string;
  gatherList: IGatherListItem[];
  postImage: string;
  location: IGatherLocation;
}

function GatherContent({ content, gatherList, postImage, location }: IGather) {
  const firstItem = gatherList?.[0];
  const secondItem = gatherList?.[1];

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: `1차 참여(${firstItem?.text}):`,
      text: `${firstItem.time.hours}:${firstItem.time.minutes || firstItem.time.minutes + "0"}`,
    },
    {
      category: `2차 참여(${secondItem?.text}):`,
      text: `${secondItem.time.hours}:${secondItem.time.minutes || secondItem.time.minutes + "0"}`,
    },
  ];

  return (
    <Flex px={5} pt={4} pb={4} flexDir="column">
      <Content>{content}</Content>
      {postImage ? (
        <Box mt={5} position="relative" w="fit-content">
          <Image
            src={postImage}
            alt="postImage"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "auto", height: "auto" }}
            unoptimized
          />
        </Box>
      ) : (
        <Box borderTop="var(--border)" mt={5}>
          <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} highlightSide="right" />
        </Box>
      )}
      {location?.latitude && (
        <StudyAddressMap
          location={{
            name: location.main,
            address: location.sub,
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      )}
    </Flex>
  );
}

const Content = styled.pre`
  min-height: 100px;
  background-color: white;
  white-space: pre-wrap;
  font-family: apple;
  color: var(--gray-800);
`;

export default GatherContent;
