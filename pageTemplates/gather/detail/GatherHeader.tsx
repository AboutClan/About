import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { GATHER_SHARE_IMAGES } from "../../../assets/images/imageUrl";
import { GATHER_RANDOM_IMAGE_ARR } from "../../../assets/images/randomImages";
import KakaoShareBtn from "../../../components/Icons/KakaoShareBtn";
import Header from "../../../components/layouts/Header";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { WEB_URL } from "../../../constants/system";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomIdx } from "../../../utils/mathUtils";

interface IGatherHeader {
  gatherData: IGather;
}

function GatherHeader({ gatherData }: IGatherHeader) {
  const router = useRouter();
  const { data: session } = useSession();

  const title = gatherData?.title;
  const date = gatherData?.date;
  const locationMain = gatherData?.location.main;

  const [drawerType, setDrawerType] = useState<"kakaoShare">(null);

  const [selectedItem, setSelectedItem] = useState<number>();

  const onClickItem = (idx) => {
    setSelectedItem(idx);
  };
  console.log(gatherData);
  return (
    <>
      <Header title="" defaultUrl="/gather">
        <Flex>
          <Box>
            <KakaoShareBtn
              type="gather"
              img={
                gatherData?.image ||
                GATHER_RANDOM_IMAGE_ARR[getRandomIdx(GATHER_RANDOM_IMAGE_ARR.length - 1)]
              }
              title={gatherData.title}
              subtitle={gatherData.content}
              date={gatherData.date}
              extraCnt={
                gatherData.memberCnt.max === 0
                  ? null
                  : gatherData.memberCnt.max - gatherData.participants.length - 1
              }
              url="/"
            />
          </Box>
          {((gatherData.user as IUserSummary)._id === session?.user.id ||
            session?.user.uid === "2259633694") && (
            <IconWrapper>
              <Link href={`/gather/${gatherData.id}/setting`}>
                <i className="fa-light fa-gear fa-lg" />
              </Link>
            </IconWrapper>
          )}
        </Flex>
      </Header>
      {drawerType === "kakaoShare" && (
        <RightDrawer title="이미지 공유" onClose={() => setDrawerType(null)}>
          <Box pb={20}>
            <Box fontSize="16px" mt="4px" mb="20px" fontWeight={600}>
              단톡방에 공유 할 이미지를 선택해 주세요!
            </Box>
            <Container>
              {GATHER_SHARE_IMAGES.map((item, idx) => (
                <Item key={idx} onClick={() => onClickItem(idx)} isSelected={idx === selectedItem}>
                  <Image src={item} fill={true} sizes="150px" alt="gatherShareImage" />
                </Item>
              ))}
            </Container>
          </Box>
          <Box position="fixed" bottom="8px" w="90%" maxW="var(--view-max-width)">
            <KakaoShareBtn
              isFull
              title={title}
              subtitle={date === "미정" ? date : dayjs(date).format("M월 D일(dd)")}
              type="gather"
              url={WEB_URL + router.asPath}
              location={locationMain}
              isBig={true}
              img={
                selectedItem !== null ? GATHER_SHARE_IMAGES[selectedItem] : GATHER_SHARE_IMAGES[1]
              }
            />
          </Box>
        </RightDrawer>
      )}
    </>
  );
}

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 16px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: var(--gap-3);
`;

const Item = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${(props) => (props.isSelected ? "4px solid var(--color-mint)" : null)};
  border-radius: var(--rounded-lg);
  overflow: hidden;
  width: 100%;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default GatherHeader;
