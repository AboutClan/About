import { Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";

import RowTextBlockButton from "../../../components/atoms/buttons/RowTextBlockButton";
import TextDevider from "../../../components/atoms/devider/TextDevider";
import Textarea from "../../../components/atoms/Textarea";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useGatherWaitingStatusMutation } from "../../../hooks/gather/mutations";
import InviteUserModal from "../../../modals/InviteUserModal";
import { ModalLayout } from "../../../modals/Modals";
import { isGatherEditState } from "../../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

type ModalType = "inviteMember" | "waitingMember" | "removeMember";

function Setting() {
  const { id } = useParams<{ id: string }>() || {};

  const typeToast = useTypeToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const setIsGatherEdit = useSetRecoilState(isGatherEditState);
  const [gatherData, setGatherData] = useRecoilState(transferGatherDataState);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [isRefuseModal, setIsRefuseModal] = useState<string>();
  const [refuseText, setRefuseText] = useState("");
  const [waitingMembers, setWaitingMembers] = useState<
    {
      user: IUserSummary;
      phase: "first" | "second";
    }[]
  >([]);

  useEffect(() => {
    setWaitingMembers(gatherData?.waiting);
  }, [gatherData]);

  const { mutate } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GATHER_CONTENT, +id]);
      setGatherData(null);
      setIsRefuseModal(null);
    },
    onError() {
      queryClient.invalidateQueries([GATHER_CONTENT, +id]);
      setGatherData(null);
      setIsRefuseModal(null);
    },
  });
  const handleButtonClick = (type: "edit" | ModalType) => {
    switch (type) {
      case "edit":
        setGatherWriting({ ...gatherData, date: dayjs(gatherData.date) });
        setIsGatherEdit(true);
        router.push("/gather/writing/category");
        break;
      case "inviteMember":
        setModalType("inviteMember");
        break;

      case "waitingMember":
        setModalType("waitingMember");
        break;

      case "removeMember":
        typeToast("not-yet");
        break;
    }
  };
  console.log(gatherData);

  const handleUserStatus = async (userId: string, status: "agree" | "refuse") => {
    await mutate({ userId, status, text: status === "refuse" ? refuseText : null });
    setWaitingMembers((old) => old.filter((who) => who.user._id !== userId));
  };
  console.log(waitingMembers);
  return (
    <>
      <Header title="모임장 페이지" />
      <Slide>
        <Flex direction="column">
          <TextDevider text="모임 정보 변경" />
          <RowTextBlockButton text="모임 글 수정" onClick={() => handleButtonClick("edit")} />
          <TextDevider text="인원 관리" />
          <RowTextBlockButton text="인원 초대" onClick={() => handleButtonClick("inviteMember")} />
          <RowTextBlockButton
            text="참여 대기 인원"
            onClick={() => handleButtonClick("waitingMember")}
          />
          <RowTextBlockButton
            text="인원 내보내기"
            onClick={() => handleButtonClick("removeMember")}
          />
        </Flex>
      </Slide>
      {modalType === "inviteMember" && <InviteUserModal setIsModal={() => setModalType(null)} />}
      {modalType === "waitingMember" && (
        <RightDrawer title="신천중인 인원" onClose={() => setModalType(null)}>
          <Flex direction="column">
            {waitingMembers?.map((who, idx) => (
              <ProfileCommentCard
                key={idx}
                user={who.user}
                comment={who.phase === "first" ? "1차 참여" : "2차 참여"}
                rightComponent={
                  <Flex>
                    <Button
                      variant="outline"
                      size="sm"
                      colorScheme="redTheme"
                      mr="12px"
                      onClick={() => setIsRefuseModal(who.user._id)}
                    >
                      거절
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="mintTheme"
                      onClick={() => handleUserStatus(who.user._id, "agree")}
                    >
                      승인
                    </Button>
                  </Flex>
                }
              />
            ))}
          </Flex>
        </RightDrawer>
      )}
      {isRefuseModal && (
        <ModalLayout
          title="신청 거절"
          setIsModal={() => setIsRefuseModal(null)}
          footerOptions={{
            main: {
              text: "완료",
              func: () => handleUserStatus(isRefuseModal, "refuse"),
            },
            sub: {
              text: "취소",
            },
          }}
        >
          <Textarea
            placeholder="전달할 거절 메세지가 있다면 적어주세요. 적지 않아주셔도 됩니다."
            value={refuseText}
            onChange={(e) => setRefuseText(e.target.value)}
          />
        </ModalLayout>
      )}
    </>
  );
}

export default Setting;
