import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import MainBadge from "../../../components/atoms/MainBadge";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { SUPPORT_CATEGORY_LABEL, SUPPORT_LIST } from "../../../constants/support";
import { useCouponIssueByPartnerMutation } from "../../../hooks/coupon/mutations";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useCheckGuest, useDenyGuest } from "../../../hooks/custom/UserHooks";
import SupportCouponModal from "../../../pageTemplates/support/SupportCouponModal";
import MemberCardModal from "../../../pageTemplates/user/MemberCardModal";
import { navigateExternalLink } from "../../../utils/navigateUtils";

const IMAGE_SIZE = 96;

function SupportDetailPage() {
  const isGuest = useCheckGuest();
  const typeToast = useTypeToast();
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};
  const support = SUPPORT_LIST.find((item) => item.id === id);
  const [isMemberCardModal, setIsMemberCardModal] = useState(false);
  const [isCouponModal, setIsCouponModal] = useState(false);
  const [issuedCouponCode, setIssuedCouponCode] = useState("");

  const denyGuest = useDenyGuest();

  const { mutate: issueCouponByPartner } = useCouponIssueByPartnerMutation({
    onSuccess: (data) => {
      setIssuedCouponCode(data.code ?? "");
      setIsCouponModal(true);
    },
  });

  const handleClickBenefit = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (support?.benefitMethod === "coupon-single" && support.coupon) {
      setIsCouponModal(true);
      return;
    }
    if (support?.useLink) {
      navigateExternalLink(support.useLink);
      return;
    }
    if (support?.benefitMethod === "coupon-multi") {
      issueCouponByPartner({ partnerId: id });
      return;
    }
    toast("info", "8월 1일(토)부터 이용 가능");
  };

  return (
    <>
      <Header title="">
        <Button
          p={1}
          color="gray.500"
          fontWeight={600}
          variant="unstyled"
          onClick={() => {
            navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
          }}
        >
          어바웃에 문의하기
        </Button>
      </Header>
      <Slide>
        <Box pb="96px">
          <Flex gap={3.5} align="flex-start">
            <Box
              position="relative"
              w={`${IMAGE_SIZE}px`}
              h={`${IMAGE_SIZE}px`}
              flexShrink={0}
              borderRadius="14px"
              overflow="hidden"
              bg="gray.100"
              border="1px solid"
              borderColor="gray.100"
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
              <Box mt={1.5} fontSize="19px" fontWeight={800} lineHeight="24px" color="gray.800">
                {support?.name}
              </Box>
              <Box mt={1} fontSize="13px" lineHeight="18px" color="gray.500">
                {support?.summary}
              </Box>
            </Box>
          </Flex>

          {support?.description && (
            <Box mt={5} fontSize="14px" lineHeight="22px" color="gray.600">
              {support.description}
            </Box>
          )}

          {!!support?.benefits?.length && (
            <Box
              mt={5}
              p={4}
              borderRadius="14px"
              bg="rgba(0, 194, 179, 0.06)"
              border="1px solid rgba(0, 194, 179, 0.16)"
            >
              <Box fontSize="12px" fontWeight={700} color="var(--color-mint)" mb={2.5}>
                제휴 혜택
              </Box>
              <Flex direction="column" gap={2.5}>
                {support.benefits.map((benefit, idx) => (
                  <Flex key={idx} align="flex-start" gap={2}>
                    <Flex
                      align="center"
                      justify="center"
                      w="16px"
                      h="16px"
                      mt="1px"
                      borderRadius="50%"
                      bg="var(--color-mint)"
                      flexShrink={0}
                    >
                      <CheckIcon boxSize="8px" color="white" />
                    </Flex>
                    <Box fontSize="13.5px" lineHeight="19px" color="gray.700" fontWeight={600}>
                      {benefit}
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {!!support?.texts?.length && (
            <Box mt={5} pt={5} borderTop="var(--border)">
              <Box fontSize="12px" fontWeight={700} color="gray.500" mb={2.5}>
                이용 안내
              </Box>
              <Flex direction="column" gap={1.5}>
                {support.texts.map((text, idx) => (
                  <Flex key={idx} align="flex-start" gap={1.5}>
                    <Flex
                      align="center"
                      justify="center"
                      w="15px"
                      h="15px"
                      mt="1px"
                      borderRadius="4px"
                      bg="gray.100"
                      flexShrink={0}
                      fontSize="9.5px"
                      fontWeight={700}
                      color="gray.500"
                    >
                      {idx + 1}
                    </Flex>
                    <Box fontSize="12.5px" lineHeight="18px" color="gray.600">
                      {text}
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {!!support?.link && (
            <Button
              mt={5}
              w="100%"
              h="46px"
              variant="outline"
              borderColor="gray.200"
              color="gray.700"
              fontSize="14px"
              rightIcon={<ChevronRightIcon boxSize="18px" color="gray.400" />}
              justifyContent="space-between"
              px={4}
              onClick={() => navigateExternalLink(support.link)}
            >
              {support.name} 방문하기
            </Button>
          )}
        </Box>
      </Slide>
      <BottomNav text="제휴 혜택 받기" onClick={handleClickBenefit} />

      {isMemberCardModal && <MemberCardModal onClose={() => setIsMemberCardModal(false)} />}
      {isCouponModal && (support?.coupon || issuedCouponCode) && (
        <SupportCouponModal
          name={support?.name ?? ""}
          coupon={{
            link: support?.coupon?.link ?? support?.link ?? "",
            code: support?.coupon?.code ?? issuedCouponCode,
            text: support?.coupon?.text ?? "",
          }}
          onClose={() => setIsCouponModal(false)}
        />
      )}
    </>
  );
}

export default SupportDetailPage;
