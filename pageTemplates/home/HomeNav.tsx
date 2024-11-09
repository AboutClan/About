import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

function HomeNav() {
  return (
    <Flex mb={8}>
      {HOME_RECOMMENDATION_ICON_ARR.map((item, idx) => (
        <Link
          data-joyride-step={item.title}
          href={item.url}
          key={item.title}
          style={{ flex: 1, marginLeft: idx === 0 ? 0 : "8px" }}
        >
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
                opacity={0.08}
                bgColor={item.bgColor}
                borderRadius="50%"
              ></Box>
              <Image
                src={item.iconImage}
                width={36}
                height={36}
                alt={item.title}
                priority
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
            </Flex>
            <Box fontSize="11px" color="black">
              {item.title}
            </Box>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
}

interface HomeRecommendationItemProps {
  iconImage: string;
  title: string;
  url: string;
  bgColor: string;
}

const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%ED%8A%B8%EB%A1%9C%ED%94%BC2.png",
    title: "랭킹",
    url: "/ranking",
    bgColor: "var(--color-red)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EC%87%BC%ED%95%912.png",
    title: "스토어",
    url: "/store",
    bgColor: "var(--color-mint)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EB%8B%AC%EB%A0%A52.png",
    title: "캘린더",
    url: `/calendar`,
    bgColor: "var(--color-orange)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EA%B9%83%EB%B0%9C2.png",
    title: "게시판",
    url: "/board",
    bgColor: "var(--color-gray)",
  },
  {
    iconImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EB%94%94%EC%BD%942.png",
    title: "디스코드",
    url: "https://discord.gg/dDu2kg2uez",
    bgColor: "var(--color-blue)",
  },
];

export default HomeNav;
