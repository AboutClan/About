import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import Slide from "../../components/layouts/PageSlide";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { RegisterLocationLayout } from "../../pages/register/location";
import { LocationProps } from "../../types/common";
import { getTodayStr } from "../../utils/dateTimeUtils";
import StudyPageBenefitDrawer from "./StudyPageBenefitDrawer";

export type StudyTab = "스터디 참여" | "카공 지도";

function StudyPageHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const drawerParam = searchParams.get("drawer");
  const queryClient = useQueryClient();
  const typeToast = useTypeToast();
  const [modalType, setModalType] = useState<"point" | "location">();

  const { data: userInfo } = useUserInfoQuery();

  const [placeInfo, setPlaceInfo] = useState<LocationProps>();
  const [errorMessage, setErrorMessage] = useState("");

  const location = userInfo?.locationDetail;
  useEffect(() => {
    if (!location) return;
    setPlaceInfo({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }, [location]);

  useEffect(() => {
    if (drawerParam === "location") {
      setModalType("location");
      router.replace(`/studyPage?date=${getTodayStr()}`);
    }
    if (drawerParam === "study") {
      setModalType("point");
      router.replace(`/studyPage?date=${getTodayStr()}`);
    }
  }, [drawerParam]);

  const { mutate: changeLocationDetail } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {
      typeToast("change");
      setModalType(null);
      queryClient.invalidateQueries([USER_INFO]);
    },
  });

  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    changeLocationDetail(placeInfo);
  };

  const locationTextArr = userInfo?.locationDetail?.name?.split(" ");

  return (
    <>
      <Slide isFixed>
        <Flex bg="white" as="header" px={5} py={5} pr="14px" justify="space-between" align="center">
          <Flex align="center">
            <Button
              display="flex"
              justifyItems="center"
              alignItems="center"
              variant="unstyled"
              w={6}
              h={6}
              mr={0.5}
              onClick={() => {
                if (userInfo?.role === "guest") {
                  typeToast("guest");
                  return;
                }
                setModalType("location");
              }}
            >
              <LocationIcon />
            </Button>
            <TriangeIcon />
            <Flex
              ml="-1px"
              p={1}
              px={1.5}
              justify="center"
              align="center"
              h={5}
              bg=" rgba(160, 174, 192, 0.2)"
              fontSize="10px"
              borderRadius="6px"
              color="gray.800"
            >
              설정 위치 - {locationTextArr?.[0]}
            </Flex>
          </Flex>

          <Flex align="center">
            <Button variant="unstyled" onClick={() => setModalType("point")}>
              <Flex align="center">
                <Flex
                  justify="center"
                  align="center"
                  w={5}
                  h={5}
                  borderRadius="full"
                  bg="mint"
                  color="white"
                >
                  <Box ml="1.5px" mt="1px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="10"
                      viewBox="0 0 8 10"
                      fill="none"
                    >
                      <path
                        d="M0.135742 9.58366V0.416992H3.73151C5.82059 0.416992 7.01074 1.69577 7.01074 3.50631C7.01074 5.34218 5.79527 6.59563 3.68086 6.59563H2.03491V9.58366H0.135742ZM2.03491 5.06363H3.37699C4.50384 5.06363 5.04826 4.43057 5.04826 3.50631C5.04826 2.59471 4.50384 1.97431 3.37699 1.97431H2.03491V5.06363Z"
                        fill="white"
                      />
                    </svg>
                  </Box>
                </Flex>
                <Box
                  ml="6px"
                  fontSize="12px"
                  lineHeight="16px"
                  color="gray.600"
                  fontWeight="semibold"
                  mt="2px"
                >
                  스터디 혜택
                </Box>
                <Flex justify="center" alignItems="center" w={5} h={5}>
                  <ShortArrowIcon dir="right" color="gray" />
                </Flex>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Slide>
      {modalType === "point" && <StudyPageBenefitDrawer onClose={() => setModalType(null)} />}
      {modalType === "location" && (
        <RightDrawer title="활동 장소 변경" px={false} onClose={() => setModalType(null)}>
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

export function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1.5C16.9629 1.5 21 5.46722 21 10.3779C21 13.4321 19.2117 16.4464 17.3164 18.6406C16.3573 19.751 15.3393 20.6888 14.4414 21.3555C13.9931 21.6883 13.5618 21.9632 13.1729 22.1582C12.8084 22.341 12.392 22.5 12 22.5C11.608 22.5 11.1917 22.341 10.8271 22.1582C10.4382 21.9632 10.0069 21.6883 9.55859 21.3555C8.66066 20.6888 7.64269 19.751 6.68359 18.6406C4.78828 16.4464 3 13.4321 3 10.3779C3.00001 5.46723 7.03708 1.50002 12 1.5ZM12 6.87793C10.2958 6.87797 8.91406 8.25395 8.91406 9.95117C8.91412 11.6483 10.2959 13.0244 12 13.0244C13.7042 13.0244 15.0859 11.6484 15.0859 9.95117C15.0859 8.25392 13.7042 6.87793 12 6.87793Z"
        fill="var(--color-gray)"
      />
    </svg>
  );
}

export function TriangeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M5.96244e-08 5L5.25 0.669872L5.25 9.33013L5.96244e-08 5Z" fill="var(--gray-200)" />
    </svg>
  );
}

export default StudyPageHeader;
