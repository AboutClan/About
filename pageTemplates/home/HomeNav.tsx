import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import ExternalLink from "../../components/molecules/ExternalLink";
import { useTypeToast } from "../../hooks/custom/CustomToast";

interface HomeIconProps {
  title: string;
  bgColor: string;
  image: string;
}

export function HomeIcon({ title, image, bgColor }: HomeIconProps) {
  const typeToast = useTypeToast();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (title === "캘린더") {
      typeToast("inspection");
      e.preventDefault();
      e.stopPropagation;
    }
  };

  return (
    <Flex justify="space-between" direction="column" align="center" onClick={handleClick}>
      <Flex
        justify="center"
        align="center"
        w="48px"
        h="48px"
        borderRadius="50%"
        position="relative"
      >
        <Box
          position="absolute"
          w="100%"
          h="100%"
          opacity={title === "게시판" ? 0.12 : 0.08}
          bgColor={bgColor}
          borderRadius="50%"
        />
        <Image
          src={image}
          width={36}
          height={36}
          alt={title + image}
          priority
          style={{ width: "36px", height: "36px", objectFit: "contain" }}
        />
      </Flex>
      {title && (
        <Box fontSize="11px" color="222222" mt={2}>
          {title}
        </Box>
      )}
    </Flex>
  );
}

function HomeNav() {
  return (
    <>
      <Box mr="auto" color="var(--gray-800)" fontSize={"18px"} mb={4} fontWeight={600}>
        소모임 가입
      </Box>
      <Flex mb={3}>
        {HOME_RECOMMENDATION_ICON_ARR.map((item, idx) => {
          const style = { flex: 1, marginLeft: idx === 0 ? 0 : "8px" };

          return item.isExternalLink ? (
            <ExternalLink href={item.url} key={item.title} style={style}>
              <HomeIcon title={item.title} bgColor={item.bgColor} image={item.iconImage} />
            </ExternalLink>
          ) : (
            <Link href={item.url} key={item.title} style={style}>
              <HomeIcon title={item.title} bgColor={item.bgColor} image={item.iconImage} />
            </Link>
          );
        })}
      </Flex>
    </>
  );
}

interface HomeRecommendationItemProps {
  iconImage: string;
  title: string;
  url: string;
  bgColor: string;
  isExternalLink?: boolean;
}

export const StoreIconImage =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/store.png";

export const RankingIconImage =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%ED%8A%B8%EB%A1%9C%ED%94%BC2.png";

const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
  {
    iconImage: "/연필.png",
    title: "스터디",
    url: `/group?category=1`,
    bgColor: "var(--color-gray)",
  },
  {
    iconImage: "/취미.png",
    title: "취미",
    url: `/group?category=2`,
    bgColor: "var(--color-orange)",
  },
  {
    iconImage: "/액티비티.png",
    title: "스포츠",
    url: `/group?category=3`,
    bgColor: "var(--color-purple)",
  },
  {
    title: "문화·감상",
    iconImage: "/문화.png",
    url: `/group?category=4`,
    bgColor: "var(--color-mint)",
  },

  {
    iconImage: "친목.png",
    title: "친목",
    url: `/group?category=5`,
    bgColor: "var(--color-blue)",
  
  },
];

export default HomeNav;
