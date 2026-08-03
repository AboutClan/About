import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";

import { IGatherLocation } from "../../../types/models/gatherTypes/gatherTypes";
import StudyAddressMap from "../../study/StudyAddressMap";
import ProcessGuide from "./OpenGatherStep";

interface IGather {
  content: string;

  postImage: string;
  location: IGatherLocation;
  isOpenGather: boolean;
  isOfficialGather?: boolean;
  date: string;
}

function GatherContent({
  content,
  postImage,
  location,
  isOpenGather,
  isOfficialGather,
  date,
}: IGather) {
  return (
    <Flex pt={4} pb={4} flexDir="column">
      <Content>{content}</Content>
      {postImage ? (
        <Box px={5} mt={5} position="relative" w="fit-content">
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
      ) : isOpenGather || isOfficialGather ? (
        <ProcessGuide date={date} isOfficialGather={isOfficialGather} />
      ) : null}
      <Box px={5} mt={5}>
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
      </Box>
    </Flex>
  );
}

const Content = styled.pre`
  min-height: 100px;
  background-color: white;
  padding: 0 20px;
  white-space: pre-wrap;
  font-family: apple;
  color: var(--gray-800);
`;

export default GatherContent;
