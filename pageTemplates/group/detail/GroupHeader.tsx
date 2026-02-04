import { Box, Button, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import InfoList from "../../../components/atoms/lists/InfoList";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import GradeGauge from "../../../components/molecules/GradeGauge";
import TabNav from "../../../components/molecules/navs/TabNav";
import TextCheckButton from "../../../components/molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import {
  useGroupDepositMutation,
  useGroupParticipationMutation,
} from "../../../hooks/groupStudy/mutations";
import { useGroupIdMannerQuery } from "../../../hooks/groupStudy/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IFooterOptions, ModalLayout } from "../../../modals/Modals";
import { calculateGrade } from "../../../pages/group/[id]/manner";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
import {
  CheckCircleIcon,
  EditIcon,
  MemberActivity,
  MemberCheckIcon,
  MemberHeartIcon,
  MemberMinusIcon,
} from "../../gather/detail/GatherHeader";
import RegisterOverview from "../../register/RegisterOverview";
interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const router = useRouter();
  const { data: session } = useSession();
  const resetGroupQuery = useResetGroupQuery();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();
  const findMyInfo = group?.participants.find((par) => {
    return par.user._id === userInfo?._id;
  });

  const isAdmin =
    findMyInfo?.role === "admin" ||
    findMyInfo?.role === "manager" ||
    session?.user.name === "어바웃" ||
    session?.user.uid === "2259633694";
  const isMember =
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232" ||
    group?.participants.some((par) => par.user?.uid === session?.user.uid);

  const [isSettigModal, setIsSettingModal] = useState(false);
  const [isDepositDrawer, setIsDepositDrawer] = useState(false);
  const [isMannerModal, setIsMannerModal] = useState(false);

  const { mutate } = useGroupParticipationMutation("delete", group?.id, {
    onSuccess: () => {
      toast("success", "탈퇴되었습니다.");
      resetGroupQuery();
    },
  });

  const { mutate: updateDeposit } = useGroupDepositMutation(group?.id + "", {
    onSuccess: () => {
      toast("success", "탈퇴되었습니다.");
      resetGroupQuery();
    },
  });

  const handleSubmit = () => {
    updateDeposit({ deposit: 4000 });
  };

  const handleQuit = () => {
    mutate();
    setIsSettingModal(false);
  };

  const { data } = useGroupIdMannerQuery(group?.id + "", "private", { enabled: !!group?.id });
  console.log(data);
  const myGrade = data?.[userInfo?.uid];

  const { total } = calculateGrade(myGrade);

  const menuArr: MenuProps[] = group
    ? [
        ...(isMember && group.fee
          ? [
              // {
              //   text: findMyInfo?.deposit
              //     ? `보유 보증금: ${findMyInfo.deposit?.toLocaleString()} Point`
              //     : "보증금 납부하기",
              //   icon: <MoneyIcon />,
              //   func: () => {
              //     setIsDepositDrawer(true);
              //   },
              // },
            ]
          : []),
        ...(isAdmin
          ? [
              {
                text: "모임 정보 수정",
                icon: <EditIcon />,
                func: () => {
                  setLocalStorageObj(GROUP_WRITING_STORE, {
                    ...group,
                  });
                  router.push(`/group/writing/main?id=${group.id}&edit=on`);
                },
              },
              {
                text: "신청 인원 확인",
                icon: <MemberCheckIcon />,
                func: () => {
                  router.push(`/group/${group.id}/admin`);
                },
              },
              {
                text: "참여 인원 관리",
                icon: <MemberMinusIcon />,
                func: () => {
                  router.push(`/group/${group.id}/member`);
                },
              },
              {
                text: "멤버 후기 지표",
                icon: <MemberHeartIcon />,
                func: () => {
                  router.push(`/group/${group.id}/manner`);
                },
              },
              {
                text: "멤버 활동 지표",
                icon: <MemberActivity />,
                func: () => {
                  router.push(`/group/${group.id}/activity`);
                },
              },
              {
                text: "월간 출석체크",
                icon: <CheckCircleIcon />,
                func: () => {
                  router.push(`/group/${group.id}/month`);
                },
              },
            ]
          : []),
        {
          kakaoOptions: {
            title: group?.title,
            subtitle: group?.guide,
            img: group?.image,
            url: "https://about20s.club" + router.asPath,
          },
        },
        ...(isMember && !isAdmin
          ? [
              {
                text: "내 멤버 지표 확인하기",
                icon: <MemberHeartIcon />,
                func: () => {
                  if (total < 5) {
                    toast(
                      "info",
                      `현재 받은 멤버 평가가 5건 미만입니다. 5명 이상의 멤버 후기가 존재해야 확인 가능합니다.`,
                    );
                    return;
                  }
                  setIsMannerModal(true);
                },
              },
              {
                text: "소모임 탈퇴하기",
                icon: <MemberOutIcon />,
                func: () => {
                  setIsSettingModal(true);
                },
              },
            ]
          : []),
      ]
    : [];

  const alertOptions: IAlertModalOptions = {
    title: "소모임 탈퇴",
    subTitle: "소모임을 탈퇴하시겠어요?",
    text: "탈퇴",
    func: handleQuit,
  };

  return (
    <>
      <Header title="모임 정보" url="/group">
        <MenuButton menuArr={menuArr} />
      </Header>
      {isSettigModal && (
        <AlertModal options={alertOptions} setIsModal={setIsSettingModal} colorType="red" />
      )}
      {isDepositDrawer && (
        <DepositRightDrawer
          myPoint={userInfo?.point}
          fee={group.fee}
          rules={group.rules}
          onClose={() => setIsDepositDrawer(false)}
          handleSubmit={handleSubmit}
        />
      )}
      {isMannerModal && <MannerModal id={group?.id} onClose={() => setIsMannerModal(false)} />}
    </>
  );
}

function DepositRightDrawer({
  myPoint,
  fee,
  rules,
  onClose,
  handleSubmit,
}: {
  myPoint: number;
  fee: number;
  rules: string[];
  onClose: () => void;
  handleSubmit: () => void;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [tab, setTab] = useState<"보증금 납부" | "보증금 규칙">("보증금 납부");

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: `보유 포인트`,
      right: myPoint?.toLocaleString() + " Point",
    },
    {
      left: "필요 보증금",
      right: "- " + fee?.toLocaleString() + " Point",
      color: "red",
    },
    {
      left: "최종 포인트",
      right: "= " + (myPoint - fee)?.toLocaleString() + " Point",
      isFinal: true,
    },
  ];

  return (
    <RightDrawer title="보증금 납부" onClose={onClose}>
      <RegisterOverview>
        <span>활동 보증금 납부</span>
        <span>아래 내용을 확인하신 후, 활동을 시작할 수 있습니다.</span>
      </RegisterOverview>{" "}
      <TabNav
        isFullSize
        isBlack
        tabOptionsArr={[
          {
            text: "보증금 납부",
            func: () => setTab("보증금 납부"),
          },
          { text: "보증금 규칙", func: () => setTab("보증금 규칙") },
        ]}
      />
      {tab === "보증금 납부" ? (
        <Flex direction="column" mt={5}>
          <ValueBoxCol items={valueBoxColItems} />
          <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
            보증금은 소모임을 탈퇴할 때 환급받을 수 있습니다.
          </Box>
          <Button ml="auto" size="sm" colorScheme="mint" mt={2}>
            포인트 충전하기
          </Button>
          <Box mt={8} mb={5}>
            <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              Q) 보증금은 무엇이고, 어떤 목적인가요?
            </Box>
            <InfoList
              items={[
                "실제 활동 의지가 있는 분들과 함께하기 위한 목적입니다.",
                "소모임 규칙에 따라 보증금이 차감될 수 있습니다.",
                "남은 보증금은 소모임을 탈퇴할 때 환급됩니다.",
              ]}
            />
          </Box>
          <TextCheckButton
            text="위 내용을 확인했고, 활동을 시작합니다."
            isChecked={isChecked}
            toggleCheck={() => setIsChecked((old) => !old)}
          />
        </Flex>
      ) : (
        <>
          {rules.length ? (
            <>
              <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px">
                <UnorderedList ml={-1.5}>
                  <ListItem
                    className="colored-bullet"
                    sx={{
                      "::marker": {
                        color: "blue", // 원하는 색상
                      },
                    }}
                  >
                    <Text lineHeight="20px">규 칙</Text>
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box
                fontWeight="light"
                fontSize="12px"
                lineHeight="20px"
                bg="rgba(160, 174, 192, 0.08)"
                py={4}
                borderRadius="8px"
                mb={5}
              >
                {rules.length === 1 ? (
                  <Box px={4}>※ {rules[0]}</Box>
                ) : (
                  <UnorderedList>
                    {rules.map((rule, idx) => (
                      <ListItem key={idx}>
                        <Text lineHeight="20px">{rule}</Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                )}
              </Box>
            </>
          ) : null}
        </>
      )}
      <BottomNav text="완 료" isSlide={false} onClick={handleSubmit} />
    </RightDrawer>
  );
}

export function MannerModal({ id, onClose }: { id: number; onClose: () => void }) {
  const userInfo = useUserInfo();

  const { data } = useGroupIdMannerQuery(id + "", "private", { enabled: !!id });
  console.log(32, data);
  const myGrade = data?.[userInfo?.uid];

  const { total, value } = calculateGrade(myGrade);

  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <ModalLayout title="내 멤버 지표" setIsModal={onClose} footerOptions={footerOptions}>
      <Box as="p">
        소모임 멤버들이 평가한 내 멤버 지표입니다.
        <br />
        멤버 평가는 익명을 보장하며, <br />
        5명 단위로 한번에 업데이트 됩니다.
      </Box>
      <Flex justify="center" align="center" p={4} mt={3} mb={2}>
        <GradeGauge value={value} label={total + ""} size={150} />
      </Flex>
    </ModalLayout>
  );
}

// function MoneyIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="16px"
//       viewBox="0 -960 960 960"
//       width="16px"
//       fill="var(--color-gray)"
//     >
//       <path d="M481-120q-17 0-28.5-11.5T441-160v-46q-45-10-79-35t-55-70q-7-14-.5-29.5T330-363q14-6 29 .5t23 21.5q17 30 43 45.5t64 15.5q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-44q0-17 11.5-28.5T481-840q17 0 28.5 11.5T521-800v44q38 6 66 24.5t46 45.5q9 13 3.5 29T614-634q-14 6-29 .5T557-653q-13-14-30.5-21.5T483-682q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v44q0 17-11.5 28.5T481-120Z" />
//     </svg>
//   );
// }

function MemberOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z" />
    </svg>
  );
}

export default GroupHeader;
