import { AspectRatio, Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export interface RecommendationBannerCardProps {
  title: string;
  text: string;
  bannerImage: string;
  buttonProps: {
    link: string;
    text: string;
  };
}

function RecommendationBannerCard({
  title,
  text,
  bannerImage,
  buttonProps,
}: RecommendationBannerCardProps) {
  return (
    <Box>
      <AspectRatio w="100%" ratio={1.25} position="relative">
        <Image fill src={bannerImage} alt={title} />
      </AspectRatio>
      <Flex p="16px" direction="column">
        <Box fontSize="20px" fontWeight={600}>
          {title}
        </Box>
        <Box as="p" py="16px">
          {text}
        </Box>
        <Box>
          <Link href={buttonProps.link}>
            <Button colorScheme="mintTheme">{buttonProps.text}</Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

export default RecommendationBannerCard;
