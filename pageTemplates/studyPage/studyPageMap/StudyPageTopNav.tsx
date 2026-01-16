import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "../../../components/layouts/Header";
import LocationSearch from "../../../components/organisms/location/LocationSearch";
import { AboutLogo } from "../../../components/services/AboutLogo";
import { useToast } from "../../../hooks/custom/CustomToast";
import { LocationProps } from "../../../types/common";
import { navigateExternalLink } from "../../../utils/navigateUtils";
import { getDeviceOS, isApp } from "../../../utils/validationUtils";

interface StudyPageTopNavProps {
  handleCenterLocation: (location: { lat: number; lon: number }) => void;
  openMenu: () => void;
  isCafeMap: boolean;
  onClose?: () => void;
}

export function StudyPageTopNav({
  handleCenterLocation,
  openMenu,
  isCafeMap,
  onClose,
}: StudyPageTopNavProps) {
  const toast = useToast();
  const router = useRouter();
  const [isFocus, setIsFocus] = useState(true);
  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  useEffect(() => {
    if (!placeInfo) return;
    handleCenterLocation({ lat: placeInfo.latitude, lon: placeInfo.longitude });
  }, [placeInfo]);

  const device = getDeviceOS();

  const handleAppOpen = () => {
    if (device === "Android") {
      navigateExternalLink(
        "https://play.google.com/store/apps/details?id=com.about.studyaboutclubapp",
      );
    } else if (device === "iOS") {
      navigateExternalLink(
        "https://apps.apple.com/kr/app/%EC%96%B4%EB%B0%94%EC%9B%83/id6737145787",
      );
    } else {
      toast("warning", "앱 설치를 지원하는 단말기가 아닙니다.");
    }
  };

  return (
    <>
      {!isFocus && (
        <Box
          h="calc(100dvh - 112px)"
          w="full"
          bg="linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 20%)"
          pos="fixed"
          top="112px"
          zIndex={30}
          pointerEvents="none"
        />
      )}
      <Flex flexDir="column" w="full">
        <Flex
          w="full"
          h="var(--header-h)"
          pl={isCafeMap ? 3 : 0}
          as="header"
          align="center"
          justify="space-between"
          // px="12px"
          // py="10px"
          pr={2}
          bg="white"
          maxW="var(--max-width)"
          margin="0 auto"
          borderColor="gray.100"
        >
          {isCafeMap ? (
            <>
              <Button
                px={2}
                py={2}
                variant="unstyled"
                onClick={() => {
                  router.push(`/home`);
                }}
              >
                <AboutLogo />
              </Button>
              <Flex align="center" mr={1}>
                {isApp() && (
                  <Button mr={3} h="32px" w="64px" colorScheme="mint" onClick={handleAppOpen}>
                    앱 열기
                  </Button>
                )}

                <Button variant="unstyled" p={2} onClick={openMenu}>
                  <MenuIcon />
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Header
                title="카공 지도"
                func={() => {
                  onClose();
                }}
                isSlide={false}
              ></Header>
            </>
          )}
        </Flex>{" "}
        <Box px={5} pb={3} bg="white">
          <LocationSearch
            info={placeInfo}
            setInfo={setPlaceInfo}
            size="sm"
            setIsFocus={setIsFocus}
          />
        </Box>
      </Flex>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32px"
      viewBox="0 -960 960 960"
      width="32px"
      fill="var(--color-gray)"
    >
      <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
    </svg>
  );
}
