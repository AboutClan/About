import { Box, Button, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupExileUserMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { checkGroupGathering } from "../../../libs/group/checkGroupGathering";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { GroupParicipantProps, IGroup } from "../../../types/models/groupTypes/group";

export default function Member() {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deleteUser, setDeleteUser] = useState<GroupParicipantProps>(null);
  const [group, setGroup] = useState<IGroup>();

  const transferGroup = useRecoilValue(transferGroupDataState);

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id && !transferGroup });

  const [users, setUsers] = useState<GroupParicipantProps[]>([]);

  useEffect(() => {
    if (group) {
      setUsers(group.participants);
    }
  }, [group]);

  useEffect(() => {
    if (transferGroup) setGroup(transferGroup);
    else if (groupData) setGroup(groupData);
  }, [transferGroup, groupData]);

  const queryClient = useQueryClient();
  const { mutate } = useGroupExileUserMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY]);
      completeToast("free", "추방되었습니다.");
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: handleBelong } = useUserInfoFieldMutation("belong", {
    onSuccess() {},
  });
  const belong = group && checkGroupGathering(group.hashTag);
 
  const alertOptions: IAlertModalOptions = {
    title: "유저 추방",
    subTitle: `${deleteUser?.user?.name || "외부인"}님을 해당 모임에서 추방합니다.`,
    func: async () => {
      await mutate({ toUid: deleteUser?.user?._id, randomId: deleteUser?.randomId });
      if (belong) {
        await handleBelong({ uid: deleteUser?.user?.uid, belong: null });
      }
      setGroup((old) => ({
        ...old,
        participants: old.participants.filter((par) => par.user?.uid !== deleteUser.user.uid),
      }));
      setDeleteUser(null);
    },
    text: "추방",
  };

  return (
    <>
      <Header title="멤버 관리" />
      <Slide>
        <Box>
          <Box p="12px 16px" fontSize="16px" fontWeight={800}>
            참여중인 멤버
          </Box>
          <Flex direction="column">
            {users.map((who, idx) => (
              <Box key={idx}>
                <ProfileCommentCard
                  user={who.user}
                  comment={{
                    text: `구성:${GROUP_STUDY_ROLE[who.role]} / 출석 횟수:${who.attendCnt}회`,
                  }}
                  rightComponent={
                    who.user?.uid !== session?.user.uid ? (
                      <Button onClick={() => setDeleteUser(who)} colorScheme="red" size="sm">
                        추방
                      </Button>
                    ) : null
                  }
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </Slide>
      {deleteUser && <AlertModal options={alertOptions} setIsModal={() => setDeleteUser(null)} />}
    </>
  );
}
