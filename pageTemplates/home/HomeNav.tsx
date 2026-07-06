import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useSetRecoilState } from "recoil";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import ExternalLink from "../../components/molecules/ExternalLink";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { transferHomeActivityDrawerOpenState } from "../../recoils/transferRecoils";

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
        <Box fontSize="11px" color="black.500" mt={2} lineHeight="16px" letterSpacing={0.08}>
          {title}
        </Box>
      )}
    </Flex>
  );
}

function HomeNav() {
  const setIsActivityDrawerOpen = useSetRecoilState(transferHomeActivityDrawerOpenState);

  return (
    <>
      <Flex align="center" mb={4}>
        <Box mr="auto" color="var(--gray-800)" fontSize="18px" fontWeight={600}>
          내 취향 소모임 찾기
        </Box>
        <Flex
          as="button"
          type="button"
          align="center"
          onClick={() => setIsActivityDrawerOpen(true)}
        >
          <Box fontSize="12px" color="var(--gray-500)" fontWeight={500} mr={0.5}>
            한눈에 보기
          </Box>
          <ShortArrowIcon dir="right" />
        </Flex>
      </Flex>
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
    url: `/group?category=3`,
  },
  {
    iconImage: "/group/액티비티.png",
    title: "액티비티",
    url: `/group?category=4`,
  },
  {
    title: "문화·감상",
    iconImage: "/group/티켓.png",
    url: `/group?category=5`,
  },

  {
    iconImage: "/group/칵테일.png",
    title: "친목",
    url: `/group?category=6`,
  },
];

export default HomeNav;
