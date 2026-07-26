import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";

import { SupportItem } from "../../constants/support";
import { useToast } from "../../hooks/custom/CustomToast";
import { ModalLayout } from "../../modals/Modals";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface SupportCouponModalProps {
  name: string;
  coupon: NonNullable<SupportItem["coupon"]>;
  onClose: () => void;
}

function SupportCouponModal({ name, coupon, onClose }: SupportCouponModalProps) {
  const toast = useToast();
  const steps = coupon.text.split("→").map((step) => step.trim());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      toast("success", "쿠폰 코드가 복사되었어요");
    } catch {
      toast("error", "복사에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <ModalLayout
      title={`${name} 쿠폰`}
      footerOptions={{
        main: { text: "쿠폰 사용하러 가기", func: () => navigateExternalLink(coupon.link) },
      }}
      setIsModal={onClose}
    >
      <Box textAlign="left">
        <Flex
          align="center"
          justify="space-between"
          h="52px"
          px={4}
          borderRadius="12px"
          border="1.5px dashed var(--color-mint)"
          bg="var(--mint-50, #F0FBF8)"
        >
          <Box
            fontSize={coupon.code.length > 8 ? "12px" : "14px"}
            fontWeight={600}
            color="gray.800"
            letterSpacing="0.5px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {coupon.code}
          </Box>
          <Button
            flexShrink={0}
            ml={2}
            size="xs"
            h="28px"
            px={2.5}
            borderRadius="8px"
            colorScheme="mint"
            variant="solid"
            onClick={handleCopy}
          >
            {coupon.code.length > 8 ? "복사" : "복사하기"}
          </Button>
        </Flex>

        <Box mt={5}>
          <Box fontSize="12px" fontWeight={700} color="gray.500" mb={2}>
            쿠폰 사용 방법
          </Box>
          <Flex wrap="wrap" align="center" rowGap={1}>
            {steps.map((step, idx) => (
              <Flex key={idx} align="center">
                {idx > 0 && (
                  <ChevronRightIcon boxSize="14px" color="gray.400" mx={0.5} flexShrink={0} />
                )}
                <Box fontSize="13.5px" lineHeight="18px" color="gray.700" fontWeight={600}>
                  {step}
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>
    </ModalLayout>
  );
}

export default SupportCouponModal;
