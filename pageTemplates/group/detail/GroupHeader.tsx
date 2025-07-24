import { Box, Button, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import InfoList from "../../../components/atoms/lists/InfoList";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import TabNav from "../../../components/molecules/navs/TabNav";
import TextCheckButton from "../../../components/molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupDepositMutation,
  useGroupParticipationMutation,
} from "../../../hooks/groupStudy/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
import {
  CheckCircleIcon,
  EditIcon,
  MemberCheckIcon,
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

  const isAdmin =
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232" ||
    group?.organizer.uid === session?.user.uid;
  const isMember =
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232" ||
    group?.participants.some((par) => par.user?.uid === session?.user.uid);

  const findMyInfo = group?.participants.find((par) => par.user._id === userInfo?._id);

  const [isSettigModal, setIsSettingModal] = useState(false);
  const [isDepositDrawer, setIsDepositDrawer] = useState(false);

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

  const menuArr: MenuProps[] = group
    ? [
        ...(isMember && !isAdmin
          ? [
              {
                text: findMyInfo?.deposit
                  ? `보유 보증금: ${findMyInfo.deposit?.toLocaleString()} Point`
                  : "보증금 납부하기",
                icon: <MoneyIcon />,
                func: () => {
                  setIsDepositDrawer(true);
                },
              },
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
            url: "https://study-about.club" + router.asPath,
          },
        },
        ...(isMember && !isAdmin
          ? [
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

function MoneyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M481-120q-17 0-28.5-11.5T441-160v-46q-45-10-79-35t-55-70q-7-14-.5-29.5T330-363q14-6 29 .5t23 21.5q17 30 43 45.5t64 15.5q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-44q0-17 11.5-28.5T481-840q17 0 28.5 11.5T521-800v44q38 6 66 24.5t46 45.5q9 13 3.5 29T614-634q-14 6-29 .5T557-653q-13-14-30.5-21.5T483-682q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v44q0 17-11.5 28.5T481-120Z" />
    </svg>
  );
}

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
