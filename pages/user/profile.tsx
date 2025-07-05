import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import LabeledInput from "../../components/molecules/LabeledInput";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { CameraIcon, ProfileCamera } from "../../pageTemplates/user/UserProfileSection";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { MajorLayout } from "../register/major";
import { MBTILayout } from "../register/mbti";

function Profile() {
  const router = useRouter();
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();

  const queryClient = useQueryClient();
  const [majors, setMajors] = useState<
    {
      department: string;
      detail: string;
    }[]
  >(userInfo?.majors);

  const [mbti, setMbti] = useState("");
  const [instagram, setInstagram] = useState("");
  const [comment, setComment] = useState("");
  const [isDrawer, setIsDrawer] = useState(false);
  const [text, setText] = useState("");
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [drawerType, setDrawerType] = useState<"major" | "mbti">();

  const { mutate } = useUserInfoMutation({
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      toast("success", "변경되었습니다.");
      router.push("/user");
    },
  });

  useEffect(() => {
    setMajors(userInfo?.majors);
    setMbti(userInfo?.mbti);
    setPlaceInfo({
      place_name: userInfo?.locationDetail?.text || "",
      x: userInfo?.locationDetail?.lon + "",
      y: userInfo?.locationDetail?.lat + "",
    });
    setInstagram(userInfo?.instagram);
    setComment(userInfo?.comment);
    setText(userInfo?.introduceText);
  }, [userInfo]);

  const handleSubmit = () => {
    mutate({
      locationDetail: {
        text: placeInfo?.place_name,
        lat: +placeInfo?.y,
        lon: +placeInfo?.x,
      },
      comment,
      majors,
      mbti,
      instagram,
      introduceText: text,
    });
  };

  return (
    <>
      <Header title="" />
      <Slide>
        <Box mt={2}>
          <Box fontSize="24px" fontWeight="bold" lineHeight="36px">
            프로필 수정
          </Box>
          <Flex justify="center" mt={5} mb={4}>
            <Avatar user={userInfo} size="xxl1" />
            <Box position="relative">
              <IconWrapper
                onClick={() => {
                  //   if (isGuest) {
                  //     // typeToast("guest");
                  //     return;
                  //   }
                  setIsDrawer(true);
                  // setIsProfileModal(true);
                }}
              >
                <CameraIcon size="lg" />
              </IconWrapper>
            </Box>
          </Flex>
          <Box mb={4}>
            <LabeledInput label="이름" value={userInfo?.name || ""} isDisabled />
          </Box>
          <Box mb={4}>
            <LabeledInput
              label="코멘트"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
          <Box mb={4}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              주 활동 장소
            </Box>
            <SearchLocation
              placeInfo={placeInfo}
              setPlaceInfo={setPlaceInfo}
              hasDetail={false}
              placeHolder="ex) 당산역, 용산구, 사당동 등"
            />
          </Box>
          <Box mb={4}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              전공
            </Box>
            <Button
              variant="unstyled"
              h="52px"
              border="1px solid var(--gray-200)"
              borderRadius="8px"
              w="full"
              fontWeight="regular"
              fontSize="13px"
              lineHeight="20px"
              onClick={() => setDrawerType("major")}
            >
              <Flex px={5} pr={4} w="full" justify="space-between">
                <Box>{majors?.[0]?.detail}</Box>
                <RightArrowIcon />
              </Flex>
            </Button>
          </Box>
          <Box mb={4}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              MBTI
            </Box>
            <Button
              variant="unstyled"
              h="52px"
              border="1px solid var(--gray-200)"
              borderRadius="8px"
              w="full"
              fontWeight="regular"
              fontSize="13px"
              lineHeight="20px"
              onClick={() => setDrawerType("mbti")}
            >
              <Flex px={5} pr={4} w="full" justify="space-between">
                <Box>{mbti}</Box>
                <RightArrowIcon />
              </Flex>
            </Button>
          </Box>
          <Box mb={4}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              자기소개
            </Box>
            <Textarea
              h="96px"
              placeholder="나는 어떤 사람인가요? 사람들과 어울릴 때의 성격이나 대화 스타일을 적어주세요!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Flex ml="auto" mt={1} w="max-content" fontSize="12px" color="gray.500">
              <Box
                color={text.length >= 90 ? "red" : text.length < 40 ? "gray.500" : "gray.800"}
                mr={1}
              >
                {text.length}
              </Box>{" "}
              / {text.length >= 90 ? "최대 90자" : "최소 40자"}
            </Flex>
          </Box>
          <Box mb={4}>
            <LabeledInput
              label="Instagram (친구만 공개)"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </Box>
        </Box>
        <Button mt={5} mb={5} size="lg" colorScheme="mint" w="full" onClick={handleSubmit}>
          수정하기
        </Button>
      </Slide>
      {drawerType && (
        <RightDrawer title="프로필 수정" px={false} onClose={() => setDrawerType(null)}>
          {drawerType === "mbti" ? (
            <MBTILayout errorMessage="" mbti={mbti} setMbti={setMbti} />
          ) : (
            <MajorLayout majors={majors} setMajors={setMajors} />
          )}

          <BottomNav isSlide={false} onClick={() => setDrawerType(null)} text="확 인" />
        </RightDrawer>
      )}
      {isDrawer && <ProfileCamera setIsModal={setIsDrawer} />}
    </>
  );
}

export default Profile;

function RightArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" transform="translate(16 16) rotate(-180)" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.74995 2.59994C5.86813 2.59987 5.98515 2.62317 6.09429 2.66847C6.20344 2.71378 6.30256 2.7802 6.38595 2.86394L10.886 7.36393C10.9696 7.44751 11.0359 7.54674 11.0811 7.65595C11.1264 7.76516 11.1497 7.88222 11.1497 8.00043C11.1497 8.11865 11.1264 8.23571 11.0811 8.34492C11.0359 8.45413 10.9696 8.55336 10.886 8.63693L6.38595 13.1369C6.30303 13.2234 6.20368 13.2925 6.09372 13.3401C5.98376 13.3876 5.8654 13.4128 5.7456 13.414C5.62579 13.4153 5.50695 13.3926 5.39603 13.3473C5.28511 13.302 5.18435 13.235 5.09967 13.1502C5.01498 13.0655 4.94807 12.9646 4.90285 12.8537C4.85764 12.7427 4.83504 12.6239 4.83637 12.5041C4.8377 12.3843 4.86294 12.2659 4.9106 12.156C4.95827 12.0461 5.0274 11.9468 5.11395 11.8639L8.97695 7.99993L5.11395 4.13693C4.9879 4.01112 4.90201 3.85074 4.86715 3.67609C4.83229 3.50144 4.85003 3.32038 4.91813 3.15582C4.98622 2.99126 5.10161 2.8506 5.24968 2.75164C5.39776 2.65269 5.57186 2.59989 5.74995 2.59994Z"
        fill="#E0E0E0"
      />
    </svg>
  );
}

const IconWrapper = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: white;
  opacity: 0.96;
  border: 1px solid var(--gray-200);
  border-radius: 50%;
`;
