import { AspectRatio, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { EVENT_BANNER_PROMOTION } from "../../assets/images/imageUrl";
import ArrowTextButton from "../../components/atoms/buttons/ArrowTextButton";
import SectionBar from "../../components/molecules/bars/SectionBar";

export default function EventPoint() {
  return (
    <>
      <SectionBar title="다양한 포인트 획득처" size="md" />
      <Link href="/promotion">
        <AspectRatio position="relative" ratio={4 / 1}>
          <Image src={EVENT_BANNER_PROMOTION} fill={true} sizes="400px" alt="eventBanner" />
        </AspectRatio>
      </Link>
      <Box fontWeight={600}>
        <Link href="/event/point/activity">
          <Flex p="16px" justifyContent="space-between" borderBottom="var(--border)">
            <Flex>
              <Box mr="12px">
                <i
                  className="fa-duotone fa-star-shooting fa-lg"
                  style={{ color: "var(--color-red)" }}
                />
              </Box>
              동아리 활동에 참여하고
            </Flex>
            <ArrowTextButton dir="right" text="500P 받기" size="md" />
          </Flex>
        </Link>
        <Link href="/event/point/mission">
          <Flex p="16px" justifyContent="space-between">
            <Flex>
              <Box mr="12px">
                <i
                  className="fa-duotone fa-meteor fa-lg"
              
                  style={{ color: "var(--color-red)" }}
                />
              </Box>
              이벤트에 참여하고
            </Flex>
            <ArrowTextButton dir="right" text="500P 받기" size="md" />
          </Flex>
        </Link>
      </Box>
    </>
  );
}
