import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import MainBadge from "../../../components/atoms/MainBadge";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { SUPPORT_CATEGORY_LABEL, SUPPORT_LIST } from "../../../constants/support";
import { useDenyGuest } from "../../../hooks/custom/UserHooks";
import MemberCardModal from "../../../pageTemplates/user/MemberCardModal";
import { navigateExternalLink } from "../../../utils/navigateUtils";
import { getSafeAreaBottom } from "../../../utils/validationUtils";

const IMAGE_SIZE = 112;

function SupportDetailPage() {
  const { id } = useParams<{ id: string }>() || {};
  const support = SUPPORT_LIST.find((item) => item.id === id);
  const [isMemberCardModal, setIsMemberCardModal] = useState(false);
  const denyGuest = useDenyGuest();

  return (
    <>
      <Header title="" />
      <Slide>
        <Box pb="100px">
          <Flex gap={3} align="flex-start">
            <Box
              position="relative"
              w={`${IMAGE_SIZE}px`}
              h={`${IMAGE_SIZE}px`}
              flexShrink={0}
              borderRadius="12px"
              overflow="hidden"
              bg="gray.100"
            >
              {support?.imageUrl && (
                <Image
                  fill
                  alt={support.name}
                  sizes={`${IMAGE_SIZE}px`}
                  src={support.imageUrl}
                  style={{ objectFit: "cover" }}
                />
              )}
            </Box>
            <Box flex={1} pt="2px">
              <MainBadge
                text={support && SUPPORT_CATEGORY_LABEL[support.category].replace(/^\[|\]$/g, "")}
              />
              <Box mt={1.5} fontSize="18px" fontWeight={800} lineHeight="24px" color="gray.800">
                {support?.name}
              </Box>
              <Box mt={1} fontSize="13px" lineHeight="18px" color="gray.500">
                {support?.summary}
              </Box>
            </Box>
          </Flex>

          {support?.description && (
            <Box mt={5} fontSize="14px" lineHeight="22px" color="gray.700">
              {support.description}
            </Box>
          )}

          {!!support?.benefits?.length && (
            <Box mt={5}>
              <Box fontSize="12px" fontWeight={700} color="gray.500" mb={2}>
                혜택
              </Box>
              <Flex direction="column" gap={2}>
                {support.benefits.map((benefit, idx) => (
                  <Flex key={idx} align="center" gap={2}>
                    <Box w="6px" h="6px" borderRadius="50%" bg="var(--color-mint)" flexShrink={0} />
                    <Box fontSize="13px" color="gray.700" fontWeight={500}>
                      {benefit}
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {!!support?.texts?.length && (
            <Box mt={5}>
              <Box fontSize="12px" fontWeight={700} color="gray.500" mb={2}>
                이용 안내
              </Box>
              <Box as="ul" color="gray.600" lineHeight="20px" fontSize="12px">
                {support.texts.map((text, idx) => (
                  <li key={idx}>{text}</li>
                ))}
              </Box>
            </Box>
          )}

          {!!support?.link && (
            <Button
              mt={5}
              w="100%"
              h="44px"
              variant="outline"
              borderColor="gray.300"
              color="gray.700"
              onClick={() => navigateExternalLink(support.link)}
            >
              홈페이지 바로가기
            </Button>
          )}
        </Box>
      </Slide>

      <Slide isFixed posZero="top">
        <Flex
          w="full"
          position="fixed"
          bottom={getSafeAreaBottom(0)}
          bg="white"
          borderTop="var(--border)"
          px={5}
          py={3}
          gap={2}
        >
          <Button
            flex={1}
            h="48px"
            variant="outline"
            borderColor="mint"
            color="mint"
            borderRadius="12px"
            onClick={() => denyGuest(() => setIsMemberCardModal(true))}
          >
            어바웃 멤버증
          </Button>
          <Button
            flex={1}
            h="48px"
            colorScheme="mint"
            borderRadius="12px"
            onClick={() => navigateExternalLink("https://pf.kakao.com/_SaWXn/chat")}
          >
            채널에 문의하기
          </Button>
        </Flex>
      </Slide>

      {isMemberCardModal && <MemberCardModal onClose={() => setIsMemberCardModal(false)} />}
    </>
  );
}

export default SupportDetailPage;
