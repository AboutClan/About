import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import TextCheckButton from "../../components/molecules/TextCheckButton";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserPointMutation } from "../../hooks/user/mutations";
import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { navigateExternalLink } from "../../utils/navigateUtils";

export const CAFE_MAP_INSTAGRAM_REWARD_POINT = 500;
export const CAFE_MAP_INSTAGRAM_REWARD_SUB = "cafemap_instagram";

function CafeMapInstagramRewardModal({ onClose }: CloseProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isCheckInsta, setIsCheckInsta] = useState(false);

  const { mutate, isLoading } = useUserPointMutation({
    onSuccess() {
      toast("success", `${CAFE_MAP_INSTAGRAM_REWARD_POINT}포인트가 지급되었어요!`);
      queryClient.invalidateQueries(["pointLog", "sub", CAFE_MAP_INSTAGRAM_REWARD_SUB]);
      queryClient.invalidateQueries([USER_INFO]);
      onClose();
    },
  });

  const getReward = () => {
    if (!isCheckInsta) {
      toast("warning", "인스타 팔로우 후 받을 수 있습니다.");
      return;
    }
    mutate({
      point: CAFE_MAP_INSTAGRAM_REWARD_POINT,
      message: "카공지도 인스타 팔로우 리워드",
      sub: CAFE_MAP_INSTAGRAM_REWARD_SUB,
    });
  };

  return (
    <ModalLayout
      title="인스타그램 팔로워 이벤트"
      footerOptions={{
        main: {
          text: "500 포인트 받기",
          func: getReward,
          isLoading,
        },
        sub: { text: "다음에" },
      }}
      setIsModal={onClose}
    >
      <Box as="p">
        저희 인스타그램을 팔로우 해주시면
        <br />
        즉시 <b>500P</b>를 지급해 드려요!
      </Box>
      <Box mt={3}>
        <TextCheckButton
          text="인스타 팔로우"
          isChecked={isCheckInsta}
          toggleCheck={() => setIsCheckInsta((old) => !old)}
          buttonText="이동하기"
          handleBtn={() => {
            setIsCheckInsta(true);
            navigateExternalLink("https://www.instagram.com/about._.20s/");
          }}
        />
      </Box>
    </ModalLayout>
  );
}

export default CafeMapInstagramRewardModal;
