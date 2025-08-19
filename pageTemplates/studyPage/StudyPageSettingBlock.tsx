import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import AvatarGroupsOverwrap from "../../components/molecules/groups/AvatarGroupsOverwrap";
import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { STUDY_RECORD_MODAL_AT, USER_INFO } from "../../constants/keys/queryKeys";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { RegisterLocationLayout } from "../../pages/register/location";
import { NaverLocationProps } from "../../types/externals/kakaoLocationSearch";
import { AvatarProps } from "../../types/models/userTypes/userInfoTypes";

function StudyPageSettingBlock() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfoQuery();
  const isGuest = session?.user.role === "guest";

  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModal, setIsModal] = useState(false);

  const recentStudyAttendStorage = localStorage.getItem(STUDY_RECORD_MODAL_AT);
  const recentStudyRecord: {
    date: string;
    place: string;
    members: { image: string; avatar?: AvatarProps }[];
  } = recentStudyAttendStorage ? JSON.parse(recentStudyAttendStorage) : null;

  const { mutate: changeLocationDetail } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {
      typeToast("change");
      setIsModal(false);
      queryClient.invalidateQueries([USER_INFO]);
    },
  });
  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    changeLocationDetail({
      text: placeInfo.title,
      lon: +placeInfo.x,
      lat: +placeInfo.y,
    });
  };

  return (
    <>
      <Box p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
        <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
          내 스터디 정보
        </Box>
        <InfoBoxCol
          infoBoxPropsArr={[
            {
              category: `스터디 매칭 기준 위치 (${
                !userInfo?.isLocationSharingDenided ? "공개 상태" : "비공개 상태"
              })`,
              text: userInfo?.locationDetail?.text,
            },
            {
              category: "최근 참여한 스터디 장소",
              text: recentStudyRecord ? recentStudyRecord?.place : "정보 없음",
            },
            {
              category: "최근 함께한 스터디 멤버",
              rightChildren: recentStudyRecord?.members.length ? (
                <Box>
                  <AvatarGroupsOverwrap
                    users={recentStudyRecord?.members.map((member) => ({
                      avatar: member.avatar,
                      profileImage: member.image,
                    }))}
                    maxCnt={4}
                  />
                </Box>
              ) : (
                "정보 없음"
              ),
              // text: userInfo?.studyPreference?.place || "정보 없음",
            },
          ]}
          size="md"
        />
        <Flex
          as="button"
          w="full"
          justify="center"
          align="center"
          fontSize="12px"
          fontWeight="semibold"
          mt={4}
          borderRadius="12px"
          bg="gray.800"
          color="white"
          h="44px"
          onClick={() => {
            if (isGuest) {
              typeToast("guest");
              return;
            }
            setIsModal(true);
          }}
        >
          즐겨 찾는 위치 변경하기
        </Flex>
      </Box>
      {isModal && (
        <RightDrawer title="활동 장소 변경" px={false} onClose={() => setIsModal(false)}>
          <RegisterLocationLayout
            handleButton={handleButton}
            placeInfo={placeInfo}
            setPlaceInfo={setPlaceInfo}
            text="변 경"
            errorMessage={errorMessage}
            isSlide={false}
          />
        </RightDrawer>
      )}
    </>
  );
}

export default StudyPageSettingBlock;
