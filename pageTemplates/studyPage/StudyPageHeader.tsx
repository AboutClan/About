import { Box, Button, chakra, Flex, HTMLChakraProps, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion, MotionProps } from "framer-motion";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import IconButton from "../../components/atoms/buttons/IconButton";

import Slide from "../../components/layouts/PageSlide";
import { PointGuideModal } from "../../components/modalButtons/PointGuideModalButton";
import TabNav from "../../components/molecules/navs/TabNav";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { RegisterLocationLayout } from "../../pages/register/location";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { DispatchType } from "../../types/hooks/reactTypes";

export type StudyTab = "스터디 참여" | "카공 지도";
interface StudyPageHeaderProps {
  tab: StudyTab;
  setTab: DispatchType<StudyTab>;
}

function StudyPageHeader({ tab, setTab }: StudyPageHeaderProps) {
  const queryClient = useQueryClient();
  const typeToast = useTypeToast();
  const [modalType, setModalType] = useState<"point" | "location">();

  const { data: userInfo } = useUserInfoQuery();

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>();
  const [errorMessage, setErrorMessage] = useState("");

  const location = userInfo?.locationDetail;
  useEffect(() => {
    if (!location) return;
    setPlaceInfo({ place_name: location.text, x: location.lon + "", y: location.lat + "" });
  }, [location]);
  console.log(24, userInfo);
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
    changeLocationDetail({
      text: placeInfo.place_name,
      lon: +placeInfo.x,
      lat: +placeInfo.y,
    });
  };

  return (
    <>
      <Slide isFixed>
        <Flex bg="white" as="header" px={5} py={5} justify="space-between" align="center">
          <Flex>
            <TabNav
              tabOptionsArr={[
                { text: "스터디 참여", func: () => setTab("스터디 참여") },
                { text: "카공 지도", func: () => setTab("카공 지도") },
              ]}
              isBlack
              size="lg"
              isMain
            />
          </Flex>
          <Flex align="center">
            <Button variant="unstyled" onClick={() => setModalType("point")}>
              <AnimatedBadge />
            </Button>
            {/* <Flex
            justify="center"
            align="center"
            mr={3}
            bgColor="rgba(0, 194, 179, 0.1)"
            borderRadius="full"
            w="32px"
            h="32px"
          >
            <Flex
              justify="center"
              align="center"
              color="white"
              bgColor="mint"
              fontWeight="1000"
              fontSize="16px"
              borderRadius="full"
              w="24px"
              h="24px"
              lineHeight="1"
              pt="2px"
            >
              P
            </Flex>
            <PointGuideModalButton type="study" />
          </Flex> */}
            <Box position="relative">
              <IconButton onClick={() => setModalType("location")}>
                <LocationIcon />
              </IconButton>

              {/* 말풍선 */}
              <Box
                position="absolute"
                top="36px" // 아이콘 아래
                left="-48px" // 왼쪽 정렬
                mt="8px"
                px="10px"
                py="6px"
                bg="mint"
                color="white"
                fontSize="10px"
                borderRadius="md"
                whiteSpace="nowrap"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-8px", // 말풍선 위쪽
                  right: "16px", // 왼쪽에 붙이기
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid var(--color-mint)", // 말풍선 색과 동일
                }}
              >
                설정 위치: 강남구
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Slide>
      {modalType === "point" && <PointGuideModal type="study" onClose={() => setModalType(null)} />}
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

const AnimatedBadge = () => {
  return (
    <MotionFlex
      display="flex"
      justifyContent="center"
      alignItems="center"
      mr={3}
      bgColor="rgba(0, 194, 179, 0.1)"
      borderRadius="full"
      w="32px"
      h="32px"
      // 바깥 원에 pulse 적용
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }} // ⬅ 원래 1.08 → 1.15로 변경
      transition={{
        duration: 1, // pulse 애니메이션 시간
        ease: "easeInOut",
        delay: 1, // 빛 애니메이션(1초) 끝난 후 시작
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 2, // 쿨타임
      }}
    >
      <MotionFlex
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        color="white"
        bgColor="mint"
        fontWeight="1000"
        fontSize="16px"
        borderRadius="full"
        w="24px"
        h="24px"
        lineHeight="1"
        pt="2px"
        // 안쪽은 scale 제거(바깥 scale에 따라 같이 커짐)
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* 대각선 빛줄기 */}
          <motion.div
            style={{
              position: "absolute",
              width: "200%",
              height: "30%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
              transformOrigin: "center",
              rotate: "125deg",
              pointerEvents: "none",
            }}
            initial={{ x: "-150%", y: "-150%" }} // 왼쪽 위
            animate={{ x: "150%", y: "150%" }} // 오른쪽 아래
            transition={{
              duration: 1,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 2, // 쿨타임(바깥 pulse와 동일)
            }}
          />
        </div>
        P
      </MotionFlex>
    </MotionFlex>
  );
};
// 1) Chakra의 CSS transition 제거
type ChakraDivProps = Omit<HTMLChakraProps<"div">, "transition">;
// 2) Framer Motion props와 합치기
type MotionDivProps = ChakraDivProps & MotionProps;

// 3) Chakra + Motion 컴포넌트 생성
const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
}) as React.FC<MotionDivProps>;

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--gray-800)"
  >
    <path d="M480-107q-14 0-28-5t-25-15q-65-60-115-117t-83.5-110.5q-33.5-53.5-51-103T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 45-17.5 94.5t-51 103Q698-301 648-244T533-127q-11 10-25 15t-28 5Zm0-373q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z" />
  </svg>
);

const LocationCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--color-gray)"
  >
    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-180q45-45 80-93 30-41 55-90t25-97q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 48 25 97t55 90q35 48 80 93Zm0-220q-25 0-42.5-17.5T420-540q0-25 17.5-42.5T480-600q25 0 42.5 17.5T540-540q0 25-17.5 42.5T480-480Z" />
  </svg>
);

export default StudyPageHeader;
