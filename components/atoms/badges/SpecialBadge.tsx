import { Badge, Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { ModalLayout } from "../../../modals/Modals";
import {
  MEMBERSHIP_CONVERTOR,
  UserMemberShip,
} from "../../../types/models/userTypes/userInfoTypes";
import ValueBoxCol from "../../molecules/ValueBoxCol";

interface SpecialBadgeProps {
  hasMembership: boolean;
}

function SpecialBadge({ hasMembership }: SpecialBadgeProps) {
  const userInfo = useUserInfo();
  const [isModal, setIsModal] = useState(false);

  const [idx, setIdx] = useState(0);

  const mapping: Record<UserMemberShip, { type: string; value: string }[]> = {
    newbie: [
      {
        type: "일일 출석체크",
        value: "+ 20% 포인트",
      },
      {
        type: "공부 인증 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "스터디 참여 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "번개 참여권",
        value: "월 1장 추가",
      },
      {
        type: "소모임 참여권",
        value: "월 2장 추가",
      },
    ],
    studySupporters: [
      {
        type: "일일 출석체크",
        value: "+ 20% 포인트",
      },
      {
        type: "공부 인증 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "스터디 참여 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "스토어 상품 할인",
        value: "- 10%",
      },
    ],
    gatherSupporters: [
      {
        type: "일일 출석체크",
        value: "+ 20% 포인트",
      },
      {
        type: "번개 개설 리워드",
        value: "+ 150%",
      },
      {
        type: "번개 참여권",
        value: "월 2장 추가",
      },
      {
        type: "스토어 상품 할인",
        value: "- 10%",
      },

      {
        type: "소셜링 온도 평가",
        value: "200% 반영",
      },
      {
        type: "공식 행사 참여비 할인",
        value: "- 20 ~ 30%",
      },
    ],
    manager: [
      {
        type: "일일 출석체크",
        value: "+ 20% 포인트",
      },
      {
        type: "공부 인증 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "스터디 참여 리워드",
        value: "+ 20% 포인트",
      },
      {
        type: "번개 개설 리워드",
        value: "+ 150%",
      },
      {
        type: "번개 참여권",
        value: "+ 월 2장",
      },
      {
        type: "소모임 참여권",
        value: "+ 월 4장",
      },
      {
        type: "스토어 상품 할인",
        value: "- 10%",
      },
      {
        type: "소셜링 온도 평가",
        value: "200% 반영",
      },
      {
        type: "공식 행사 참여비 할인",
        value: "- 20 ~ 30%",
      },
    ],
    normal: [],
  };

  const entries = Object.entries(mapping);

  const [currentKey, currentValue] = entries[idx];

  return (
    <>
      <Badge
        as="button"
        onClick={() => setIsModal(true)}
        px={2}
        py={1}
        borderRadius="8px"
        fontWeight="700"
        fontSize="9px"
        color="white"
        bg={
          hasMembership
            ? "linear-gradient(135deg, #00C2B3 0%, #007DFB 100%)"
            : "linear-gradient(135deg, #D3D5DB 0%, #A8ABB3 100%)"
        }
        position="relative"
        overflow="hidden"
        sx={{
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "80%",
            height: "100%",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-20deg)",
            animation: "shine 2.4s infinite ease-in-out",
          },

          "@keyframes shine": {
            "0%": { left: "-100%" },
            "70%": { left: "130%" },
            "100%": { left: "130%" },
          },
        }}
      >
        {hasMembership ? "멤버십 적용중" : "멤버십 미적용"}
      </Badge>
      {isModal && (
        <ModalLayout
          title="About 멤버십 안내"
          footerOptions={{
            main: {},
          }}
          setIsModal={setIsModal}
        >
          <Box minH="330px">
            <Flex flexDir="column">
              <Box fontSize="14px">
                {userInfo?.membership === "normal" ? (
                  <Box color="gray.500">적용중인 멤버십이 없습니다.</Box>
                ) : (
                  <>
                    <b>[{MEMBERSHIP_CONVERTOR[userInfo?.membership]}]</b> 멤버십이 적용중입니다 !
                  </>
                )}
              </Box>
            </Flex>{" "}
            <Flex
              my={3}
              mt={5}
              justify="center"
              align="center"
              fontSize="16px"
              fontWeight={800}
              alignItems="center"
              color="gray.800"
            >
              <Box
                as="button"
                px={1}
                onClick={() => {
                  if (idx == 0) return;
                  setIdx((old) => old - 1);
                }}
              >
                <LeftArrowIcon isActive={idx > 0} />
              </Box>
              <Box mx="auto">{MEMBERSHIP_CONVERTOR[currentKey]}</Box>
              <Box
                as="button"
                px={1}
                onClick={() => {
                  if (idx === 3) return;
                  setIdx((old) => old + 1);
                }}
              >
                <RightArrowIcon isActive={idx < 3} />
              </Box>
            </Flex>
            <Flex flexDir="column">
              <ValueBoxCol
                items={currentValue.map((value) => ({ left: value.type, right: value.value }))}
              />
            </Flex>
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

function LeftArrowIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28px"
      viewBox="0 -960 960 960"
      width="28px"
      fill={isActive ? "var(--gray-900)" : "var(--gray-500)"}
    >
      <path d="M526-314 381-459q-5-5-7-10t-2-11q0-6 2-11t7-10l145-145q3-3 6.5-4.5t7.5-1.5q8 0 14 5.5t6 14.5v304q0 9-6 14.5t-14 5.5q-2 0-14-6Z" />
    </svg>
  );
}

function RightArrowIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28px"
      viewBox="0 -960 960 960"
      width="28px"
      fill={isActive ? "var(--gray-900)" : "var(--gray-500)"}
    >
      <path d="M420-308q-8 0-14-5.5t-6-14.5v-304q0-9 6-14.5t14-5.5q2 0 14 6l145 145q5 5 7 10t2 11q0 6-2 11t-7 10L434-314q-3 3-6.5 4.5T420-308Z" />
    </svg>
  );
}

export default SpecialBadge;
