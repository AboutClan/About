import { Box, Button, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupAttendUserMutation,
  useGroupExileUserMutation,
} from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { checkGroupGathering } from "../../../libs/group/checkGroupGathering";
import { GroupParicipantProps } from "../../../types/models/groupTypes/group";

export default function Member() {
  const { data: session } = useSession();
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deleteUser, setDeleteUser] = useState<GroupParicipantProps>(null);

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id });

  const [users, setUsers] = useState<GroupParicipantProps[]>([]);

  useEffect(() => {
    if (groupData) {
      setUsers(groupData.participants);
    }
  }, [groupData]);

  const queryClient = useQueryClient();
  const { mutate } = useGroupExileUserMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY]);
      toast("success", "추방되었습니다.");
      console.log(123, users);
      setUsers((old) => old.filter((who) => who.user?._id !== deleteUser.user._id));
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: attendUser } = useGroupAttendUserMutation("6687e816d514b89f15031c08", {
    onSuccess() {
      toast("success", "출석체크 완료");
    },
  });

  const { mutate: handleBelong } = useUserInfoFieldMutation("belong", {
    onSuccess() {},
  });
  const belong = groupData && checkGroupGathering(groupData.hashTag);

  const alertOptions: IAlertModalOptions = {
    title: "유저 추방",
    subTitle: `${deleteUser?.user?.name || "외부인"}님을 해당 모임에서 추방합니다.`,
    func: async () => {
      if (!deleteUser.user) {
        toast("info", "외부인은 모두 제거됩니다. 인원에 맞게 다시 추가해주세요!");
      }
      await mutate({ toUid: deleteUser?.user?._id, randomId: deleteUser?.randomId });
      if (belong) {
        handleBelong({ uid: deleteUser?.user?.uid, belong: null });
      }
      // setUsers((old) => ({
      //   ...old,
      //   participants: old.participants.filter((par) =>
      //     deleteUser.user ? par.user?.uid !== deleteUser.user.uid : !deleteUser.user,
      //   ),
      // }));
      setDeleteUser(null);
    },
    text: "추방",
  };

  const onClickAttend = (userId: string) => {
    attendUser({ userId });
    setUsers((old) =>
      old.map((who) =>
        who.user._id === userId
          ? { ...who, attendCnt: who.attendCnt + 1, weekAttendance: true }
          : who,
      ),
    );
  };

  return (
    <>
      <Header title="멤버 관리" />
      <Slide>
        <Box>
          <Box p="12px 0" fontSize="16px" fontWeight={800}>
            참여중인 멤버
          </Box>
          <Flex direction="column">
            {users
              ?.slice()
              ?.sort((a, b) => (!a.user || !b.user ? 1 : a.user.name > b.user.name ? 1 : -1))
              .map((who, idx) => (
                <Box key={idx}>
                  <ProfileCommentCard
                    user={who.user}
                    comment={{
                      comment: `구성:${GROUP_STUDY_ROLE[who.role]} / 출석 횟수:${who.attendCnt}회`,
                    }}
                    rightComponent={
                      <Flex align="center">
                        {!who.weekAttendance ? (
                          <Button
                            onClick={() => onClickAttend(who.user._id)}
                            colorScheme="mint"
                            size="sm"
                          >
                            출석 체크
                          </Button>
                        ) : (
                          <Box color="mint" mr={5}>
                            <i className="fa-regular fa-check-circle fa-xl" />
                          </Box>
                        )}
                        <Button
                          isDisabled={who.user?.uid === session?.user.uid}
                          onClick={() => setDeleteUser(who)}
                          colorScheme="red"
                          size="sm"
                          ml={3}
                        >
                          추방
                        </Button>
                      </Flex>
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
