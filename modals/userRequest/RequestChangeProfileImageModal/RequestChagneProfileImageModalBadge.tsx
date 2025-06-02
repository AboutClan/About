import { Badge, Box, Button, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import {
  BADGE_COLOR_MAPPINGS,
  USER_BADGE_ARR,
} from "../../../constants/serviceConstants/badgeConstants";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IFooterOptions, ModalLayout } from "../../Modals";

function RequestChagneProfileImageModalBadge({ setIsModal }) {
  const typeToast = useTypeToast();
  const [selectBadge, setSelectBadge] = useState<(typeof USER_BADGE_ARR)[number]>("대학생");

  const { data: userInfo } = useUserInfoQuery();

  //   useEffect(() => {
  //   if(userInfo?.ba)
  // },[userInfo])

  const { mutate: changeBadge } = useUserInfoFieldMutation("badge", {
    onSuccess() {
      typeToast("change");
      setIsModal(false);
    },
  });

  const onApply = () => {
    const findIdx = USER_BADGE_ARR.findIndex((badge) => badge === selectBadge);
    changeBadge({ badgeIdx: findIdx });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변 경",
      func: onApply,
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="배지 변경" setIsModal={setIsModal}>
      <Box as="p" mb={1} lineHeight="18px" fontSize="12px" color="gray.700">
        원하는 배지를 선택해 착용할 수 있습니다. 특정 조건에서만 획득할 수 있는 <b>유니크 배지</b>도
        존재합니다.
      </Box>
      <Grid h="210px" overflow="auto" gridTemplateColumns="repeat(3,1fr)" gap={2} p={3}>
        {USER_BADGE_ARR.map((badge, idx) => {
          const hasBadge =
            userInfo?.badge.badgeList.includes(badge) ||
            ["대학생", "휴학생", "졸업생"].includes(badge) ||
            (badge === "뉴비" && dayjs(userInfo?.registerDate).add(3, "month").isAfter(dayjs()));
          return (
            <Button
              key={idx}
              h="44px"
              borderRadius="8px"
              border={selectBadge === badge ? "2px solid var(--color-mint)" : "var(--border-main)"}
              bg={selectBadge === badge ? "rgba(0,194,179,0.1)" : hasBadge ? "white" : "white"}
              onClick={() => setSelectBadge(badge)}
              position="relative"
              _hover={{ boxShadow: "none" }}
              overflow="hidden"
              // isDisabled={!hasBadge}
              opacity={1}
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
