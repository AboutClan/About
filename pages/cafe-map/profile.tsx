import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import LabeledInput from "../../components/molecules/LabeledInput";
import SearchLocation from "../../components/organisms/SearchLocation";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { NaverLocationProps } from "../../hooks/external/queries";
import { useUserInfoMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery, useUserNicknamesQuery } from "../../hooks/user/queries";
import { CameraIcon, ProfileCamera } from "../../pageTemplates/user/UserProfileSection";

function CafeMapProfile() {
  const router = useRouter();
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();
  const { data: allNicknames } = useUserNicknamesQuery();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [isDrawer, setIsDrawer] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    if (!userInfo) return;
    setNickname(userInfo.nickname ?? "");
    setComment(userInfo.comment ?? "");
    setPlaceInfo({
      name: userInfo.locationDetail?.name || "",
      address: userInfo.locationDetail?.address || "",
      latitude: userInfo.locationDetail?.latitude ?? null,
      longitude: userInfo.locationDetail?.longitude ?? null,
    });
  }, [userInfo]);

  const { mutate, isLoading } = useUserInfoMutation({
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      toast("success", "변경되었습니다.");
      router.push("/cafe-map?tab=profile");
    },
  });

  const validateNickname = (): boolean => {
    if (nickname.length < 1 || nickname.length > 5) {
      setNicknameError("1~5글자로 입력해주세요.");
      return false;
    }
    const isDuplicate = allNicknames?.includes(nickname) && nickname !== userInfo?.nickname;
    if (isDuplicate) {
      setNicknameError("이미 사용 중인 닉네임입니다.");
      return false;
    }
    setNicknameError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateNickname()) return;
    mutate({
      nickname,
      comment,
      locationDetail: {
        name: placeInfo.name,
        address: placeInfo.address,
        latitude: placeInfo.latitude,
        longitude: placeInfo.longitude,
      },
    });
  };

  return (
    <>
      <Header title="프로필 수정" />
      <Slide>
        <Box mt={2}>
          {/* 아바타 */}
          <Flex justify="center" mt={2} mb={4}>
            <Box position="relative">
              <Avatar user={userInfo} size="xxl1" />
              <IconWrapper onClick={() => setIsDrawer(true)}>
                <CameraIcon size="lg" color="black" />
              </IconWrapper>
            </Box>
          </Flex>

          {/* 이름 (read-only) */}
          <Box mb={3}>
            <LabeledInput
              label="이름"
              value={userInfo?.name || ""}
              isDisabled
              _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            />
          </Box>

          {/* 닉네임 */}
          <Box mb={3}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              닉네임
            </Box>
            <NicknameInputWrapper $hasError={!!nicknameError}>
              <input
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameError("");
                }}
                placeholder="5글자 이내 작성"
                maxLength={5}
              />
              <Box as="span" className="char-count" fontSize="11px" color="gray.400">
                {nickname.length}/5
              </Box>
            </NicknameInputWrapper>
            {nicknameError && (
              <Box mt={1} fontSize="11px" color="red.400">
                {nicknameError}
              </Box>
            )}
          </Box>

          {/* 코멘트 */}
          <Box mb={3}>
            <LabeledInput
              label="코멘트"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="한 줄 소개를 입력해주세요"
            />
          </Box>

          {/* 주 활동 장소 */}
          <Box mb={4}>
            <Box fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
              주 활동 장소
            </Box>
            <SearchLocation
              placeInfo={placeInfo}
              setPlaceInfo={setPlaceInfo}
              hasDetail={false}
              placeHolder="ex) 강남역, 홍대입구역 등"
            />
          </Box>
        </Box>
        <BottomNav text="수정하기" onClick={handleSubmit} isLoading={isLoading} />
      </Slide>

      {isDrawer && <ProfileCamera setIsModal={setIsDrawer} />}
    </>
  );
}

export default CafeMapProfile;

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

const NicknameInputWrapper = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  height: 48px;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#FC8181" : "var(--gray-200)")};
  border-radius: 8px;
  padding: 0 16px;
  background: white;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? "#FC8181" : "#00c2b3")};
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: var(--gray-800);
    background: transparent;

    &::placeholder {
      color: var(--gray-400);
    }
  }

  .char-count {
    flex-shrink: 0;
    margin-left: 8px;
  }
`;
