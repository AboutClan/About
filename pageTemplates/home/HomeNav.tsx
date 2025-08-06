import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { NewAlertIcon } from "../../components/Icons/AlertIcon";
import ExternalLink from "../../components/molecules/ExternalLink";

function HomeNav() {
  return (
    <Flex mb={3}>
      {HOME_RECOMMENDATION_ICON_ARR.map((item, idx) => {
        const content = (
          <Flex justify="space-between" direction="column" align="center">
            <Flex
              justify="center"
              align="center"
              w="48px"
              h="48px"
              borderRadius="50%"
              position="relative"
              mb={2}
            >
              <Box
                position="absolute"
                w="100%"
                h="100%"
                opacity={item.title === "게시판" ? 0.12 : 0.08}
                bgColor={item.bgColor}
                borderRadius="50%"
              />
              <Image
                src={item.iconImage}
                width={36}
                height={36}
                alt={item.title}
                priority
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
              {item.title === "랭킹" && (
                <Box pos="absolute" bottom="0px" right="0px">
                  <NewAlertIcon />
                </Box>
              )}
            </Flex>
            <Box fontSize="11px" color="black">
              {item.title}
            </Box>
          </Flex>
        );

        const style = { flex: 1, marginLeft: idx === 0 ? 0 : "8px" };

        return item.isExternalLink ? (
          <ExternalLink href={item.url} key={item.title} style={style}>
            {content}
          </ExternalLink>
        ) : (
          <Link href={item.url} key={item.title} style={style}>
            {content}
          </Link>
        );
      })}
    </Flex>
  );
}

interface HomeRecommendationItemProps {
  iconImage: string;
  title: string;
  url: string;
  bgColor: string;
  isExternalLink?: boolean;
}

const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/twoChat.png",
    title: "게시판",
    url: "/community?type=info",
    bgColor: "var(--color-gray)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/store.png",
    title: "스토어",
    url: "/store",
    bgColor: "var(--color-mint)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EB%8B%AC%EB%A0%A52.png",
    title: "캘린더",
    url: "/calendar",
    bgColor: "var(--color-orange)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%ED%8A%B8%EB%A1%9C%ED%94%BC2.png",
    title: "랭킹",
    url: "/ranking",
    bgColor: "var(--color-purple)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EB%94%94%EC%BD%942.png",
    title: "디스코드",
    url: "https://discord.gg/dDu2kg2uez",
    bgColor: "var(--color-blue)",
    isExternalLink: true,
  },
];

export default HomeNav;
