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
        <Box position="absolute" w="100%" h="100%" bgColor={bgColor} borderRadius="50%" />
        <Image
          src={image}
          width={28}
          height={28}
          alt={title + image}
          priority
          style={{ width: "28px", height: "28px", objectFit: "contain", zIndex: 2 }}
        />
      </Flex>
      {title && (
        <Box fontSize="11px" color="222222" mt={2} lineHeight="16px" letterSpacing={0.08}>
          {title}
        </Box>
      )}
    </Flex>
  );
}

function HomeNav() {
  return (
    <>
      <Box mr="auto" color="var(--gray-800)" fontSize="18px" mb={4} fontWeight={600}>
        소모임 가입
      </Box>
      <Flex mb={3}>
        {HOME_RECOMMENDATION_ICON_ARR.map((item, idx) => {
          const style = { flex: 1, marginLeft: idx === 0 ? 0 : "8px" };

          return item.isExternalLink ? (
            <ExternalLink href={item.url} key={item.title} style={style}>
              <HomeIcon title={item.title} bgColor="gray.100" image={item.iconImage} />
            </ExternalLink>
          ) : (
            <Link href={item.url} key={item.title} style={style}>
              <HomeIcon title={item.title} bgColor="gray.100" image={item.iconImage} />
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
  isExternalLink?: boolean;
}

export const StoreIconImage =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/store.png";

export const RankingIconImage =
  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%ED%8A%B8%EB%A1%9C%ED%94%BC2.png";

const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
  {
    iconImage: "/group/스터디.png",
    title: "스터디",
    url: `/group?category=1`,
  },
  {
    iconImage: "/group/취미.png",
    title: "취미",
    url: `/group?category=2`,
  },
  {
    iconImage: "/group/액티비티.png",
    title: "액티비티",
    url: `/group?category=3`,
  },
  {
    title: "문화·감상",
    iconImage: "/group/티켓.png",
    url: `/group?category=4`,
  },

  {
    iconImage: "/group/칵테일.png",
    title: "친목",
    url: `/group?category=5`,
  },
];

export default HomeNav;
