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
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import {
  useGatherStatusMutation,
  useGatherWaitingStatusMutation,
} from "../../../hooks/gather/mutations";
import { useGroupMyStatusQuery } from "../../../hooks/groupStudy/queries";
import InviteUserModal from "../../../modals/InviteUserModal";
import { ModalLayout } from "../../../modals/Modals";
import { isGatherEditState } from "../../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

type ModalType = "inviteMember" | "waitingMember" | "removeMember" | "exile";

function Setting() {
  const { id } = useParams<{ id: string }>() || {};

  const toast = useToast();
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

  const { data: groupData } = useGroupMyStatusQuery(0, "isOwner");

  const [filterMembers, setFilterMembers] = useState<string[]>([]);

  useEffect(() => {
    setWaitingMembers(gatherData?.waiting);
  }, [gatherData]);

  const { mutate } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
      setGatherData(null);
      setIsRefuseModal(null);
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
      setGatherData(null);
      setIsRefuseModal(null);
    },
  });

  const { mutate: changeStatus } = useGatherStatusMutation(+id, {
    onSuccess() {
      toast("success", "모집중으로 변경되었습니다.");
    },
  });

  const handleButtonClick = (
    type: "edit" | ModalType | "groupStudy" | "exile" | "pending",
    user?: IUserSummary[],
  ) => {
    switch (type) {
      case "pending":
        changeStatus("pending");
        break;
      case "exile":
        setModalType("exile");
        setFilterMembers(user.map((who) => who?._id));
        break;
      case "edit":
        setGatherWriting({ ...gatherData, date: dayjs(gatherData.date) });
        setIsGatherEdit(true);
        router.push(`/gather/writing/category?id=${id}`);
        break;
      case "inviteMember":
        setModalType("inviteMember");
        break;
      case "groupStudy":
        setFilterMembers(user.map((who) => who?._id));
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

  const handleUserStatus = async (userId: string, status: "agree" | "refuse") => {
    await mutate({ userId, status, text: status === "refuse" ? refuseText : null });
    setWaitingMembers((old) => old.filter((who) => who.user._id !== userId));
  };

  return (
    <>
      <Header title="모임장 페이지" />
      <Slide isNoPadding>
        <Flex direction="column">
          <TextDevider text="모임 정보 변경" />
          <RowTextBlockButton text="모임 글 수정" onClick={() => handleButtonClick("edit")} />
          {gatherData?.status !== "pending" && (
            <RowTextBlockButton
              text="모집중으로 상태 변경"
              onClick={() => handleButtonClick("pending")}
            />
          )}
          <TextDevider text="인원 관리" />
          <RowTextBlockButton
            text="참여 대기 인원"
            onClick={() => handleButtonClick("waitingMember")}
          />
          <RowTextBlockButton text="인원 초대" onClick={() => handleButtonClick("inviteMember")} />
          <RowTextBlockButton
            text="인원 내보내기"
            onClick={() =>
              handleButtonClick(
                "exile",
                gatherData.participants.map((par) => par.user),
              )
            }
          />
          {groupData?.map((group, idx) => (
            <RowTextBlockButton
              key={idx}
              text={`"${group.title}" 소모임 인원 초대`}
              onClick={() =>
                handleButtonClick(
                  "groupStudy",
                  group?.participants.map((par) => par.user),
                )
              }
            />
          ))}
          <RowTextBlockButton
            text="인원 내보내기"
            onClick={() => handleButtonClick("removeMember")}
          />
        </Flex>
      </Slide>

      {modalType === "inviteMember" && (
        <InviteUserModal
          prevUsers={[
            // gatherData.user as IUserSummary,
            ...gatherData.participants.map((par) => par.user),
          ]}
          setIsModal={() => setModalType(null)}
          filterUsers={filterMembers}
        />
      )}
      {modalType === "waitingMember" && (
        <RightDrawer title="신청중인 인원" onClose={() => setModalType(null)}>
          <Flex direction="column">
            {waitingMembers?.map((who, idx) => (
              <ProfileCommentCard
                key={idx}
                user={who.user}
                comment={{ comment: who.phase === "first" ? "1차 참여" : "2차 참여" }}
                rightComponent={
                  <Flex>
                    <Button
                      variant="outline"
                      size="sm"
                      colorScheme="red"
                      mr="12px"
                      onClick={() => setIsRefuseModal(who.user._id)}
                    >
                      거절
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="mint"
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
