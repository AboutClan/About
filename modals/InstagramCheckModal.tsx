import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "react-query";

import { Input } from "@/components/atoms/Input";
import { COLLECTION_ALPHABET } from "@/constants/keys/queryKeys";
import { useToast } from "@/hooks/custom/CustomToast";
import { useAlphabetMutation } from "@/hooks/user/sub/collection/mutations";
import { useUserRequestMutation } from "@/hooks/user/sub/request/mutations";
import { getRandomAlphabet } from "@/libs/userEventLibs/collection";
import { IFooterOptions, ModalLayout } from "@/modals/Modals";
import { IModal } from "@/types/components/modalTypes";
import { dayjsToStr } from "@/utils/dateTimeUtils";

const INSTAGRAM_AT = "instagramAt";

function InstagramCheckModal({ setIsModal }: IModal) {
  const toast = useToast();

  const queryClient = useQueryClient();

  const instaStorage = localStorage.getItem(INSTAGRAM_AT);

  const [value, setValue] = useState("");

  const { mutate } = useUserRequestMutation();

  const { mutate: mutate2 } = useAlphabetMutation("get", {
    onSuccess() {
      mutate({ category: "인스타", content: value });
      localStorage.setItem(INSTAGRAM_AT, dayjsToStr(dayjs()));
      queryClient.refetchQueries([COLLECTION_ALPHABET]);

      setIsModal(false);
    },
  });

  const onClickCheck = () => {
    if (!value) {
      toast("error", "아이디를 확인해 주세요!");
      return;
    }
    if (instaStorage === dayjsToStr(dayjs())) {
      toast("warning", "하루 최대 1번만 가능합니다.");
      return;
    }
    mutate2({ alphabet: getRandomAlphabet(100) });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "완 료",
      func: onClickCheck,
    },
    sub: {
      text: "다음에",
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title="인스타그램 스토리 태그"
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Flex direction="column" align="center">
          <Image src="/star.png" width={72} height={72} alt="star" />

          <Box textAlign="center" my={3} mt={4}>
            About 활동에 참여하고, 인스타 스토리에 <b>@about._.20s</b>를 태그해서 올려주세요!
            <br />
            <b>알파벳</b>을 획득할 수 있습니다😉 <br />
            <b style={{ color: "var(--color-mint)" }}>[ABOUT]</b> 완성 시{" "}
            <b style={{ color: "var(--color-purple)" }}>베스킨라빈스 기프티콘</b> 지급!
          </Box>
          <Box
            fontSize="10px"
            borderRadius="20px"
            bgColor="var(--gray-100)"
            color="var(--gray-600)"
            p="8px 12px"
            mb={3}
          >
            ※ 스토리 화면에 @about._.20s가 노출되어야 합니다.
          </Box>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="인스타그램 아이디 입력"
          />
        </Flex>
      </ModalLayout>
    </>
  );
}

export default InstagramCheckModal;
