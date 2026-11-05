import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";

import ProcessGuide from "@/features/gather/screens/detail/OpenGatherStep";
import StudyAddressMap from "@/features/study/screens/StudyAddressMap";
import { IGatherLocation } from "@/types/models/gatherTypes/gatherTypes";

interface IGather {
  content: string;

  postImage: string;
  location: IGatherLocation;
  isOpenGather: boolean;
  isOfficialGather?: boolean;
  isRegularGather?: boolean;
  /** 소모임형 상시 행사(소모임 가입으로 참여) */
  isGroupRegular?: boolean;
  date: string;
}

function GatherContent({
  content,
  postImage,
  location,
  isOpenGather,
  isOfficialGather,
  isRegularGather,
  isGroupRegular,
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
      ) : isOpenGather || isOfficialGather || isRegularGather ? (
        <ProcessGuide
          date={date}
          isOfficialGather={isOfficialGather}
          isRegularGather={isRegularGather}
          isGroupRegular={isGroupRegular}
        />
      ) : null}
      <Box px={5} mt={5}>
        {/* 상시 행사는 회차마다 장소가 달라 회차 목록에서 따로 보여 준다 */}
        {!isRegularGather && location?.latitude && (
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
