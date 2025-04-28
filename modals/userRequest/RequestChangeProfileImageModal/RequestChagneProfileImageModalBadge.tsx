import { Badge, Box, Button, Grid } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import {
  BADGE_COLOR_MAPPINGS,
  BADGE_SCORE_MAPPINGS,
  USER_BADGE_ARR,
} from "../../../constants/serviceConstants/badgeConstants";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { IFooterOptions, ModalLayout } from "../../Modals";

function RequestChagneProfileImageModalBadge({ setIsModal }) {
  const { data: session } = useSession();
  const toast = useToast();
  const errorToast = useErrorToast();

  const [selectBadge, setSelectBadge] = useState<(typeof USER_BADGE_ARR)[number]>("아메리카노");

  const { data: userInfo } = useUserInfoQuery();
  console.log(userInfo);

  const { mutate: sendRequest } = useUserRequestMutation({
    onSuccess() {
      toast("success", "apply");
    },
    onError: errorToast,
  });

  const onApply = () => {
    sendRequest({
      category: "배지",
      title: selectBadge ? `${selectBadge}로 변경 신청` : "배지 해제 신청",
      content: session?.user?.uid as string,
    });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변 경",
      func: onApply,
    },
  };

  const getBadgesByScore = (score: number): string[] => {
    return Object.entries(BADGE_SCORE_MAPPINGS)
      .filter(([_, badgeScore]) => badgeScore <= score)
      .map(([badgeName]) => badgeName);
  };

  const basicBadgeList = getBadgesByScore(userInfo?.score);

  return (
    <ModalLayout footerOptions={footerOptions} title="배지 변경" setIsModal={setIsModal}>
      <Box as="p" mb={1} lineHeight="18px" fontSize="12px" color="gray.700"> 
        동아리 점수에 따라 새로운 배지가 오픈됩니다. 특정 이벤트에서만 얻을 수 있는{" "}
        <b>유니크 배지</b>도 존재합니다.
      </Box>
      <Grid h="132px" overflow="auto" gridTemplateColumns="repeat(3,1fr)" gap={2} p={3}>
        {USER_BADGE_ARR.map((badge, idx) => {
          const hasBadge =
            basicBadgeList?.includes(badge) || userInfo?.badge.badgeList.includes(badge);
          return (
            <Button
              key={idx}
              h="44px"
              borderRadius="8px"
              border={selectBadge === badge ? "2px solid var(--color-mint)" : "var(--border-main)"}
              bg={selectBadge === badge ? "rgba(0,194,179,0.1)" : hasBadge ? "white" : "gray.100"}
              onClick={() => setSelectBadge(badge)}
              position="relative"
              _hover={{ boxShadow: "none" }}
              overflow="hidden"
              isDisabled={!hasBadge}
            >
              <Badge size="lg" variant="subtle" colorScheme={BADGE_COLOR_MAPPINGS[badge]}>
                {badge}
              </Badge>
            </Button>
          );
        })}
      </Grid>
    </ModalLayout>
  );
}

export default RequestChagneProfileImageModalBadge;
