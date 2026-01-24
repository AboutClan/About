import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAdminPoint2Mutation } from "../../../hooks/admin/mutation";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import AlertModal from "../../AlertModal";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";

interface UserAbsenceBoardProps {
  gatherData: IGather;
  users: { user: UserSimpleInfoProps; text: string; isAbsence: boolean }[];

  handleDelete: (userId: string) => void;
}

function UserAbsenceBoard({ gatherData, users, handleDelete }: UserAbsenceBoardProps) {
  const { mutate: updatePoint } = useAdminPoint2Mutation();
  const { mutate: getPoint } = usePointSystemMutation("point");

  const [deleteUserId, setDeleteUserId] = useState<string>(null);
  const [isNoManner, setIsNoManner] = useState(false);
  const [members, setMembers] = useState<
    { user: UserSimpleInfoProps; text: string; isAbsence: boolean }[]
  >([]);

  useEffect(() => {
    if (!members.length && users.length) {
      setMembers(users);
    }
  }, [users]);

 

  const title =
    gatherData.title.length > 16 ? gatherData.title.slice(0, 16) + "..." : gatherData.title;

  const deleteUserUid = gatherData?.participants?.find((par) => par?.user._id === deleteUserId)
    ?.user?.uid;

  return (
    <>
      <Flex direction="column">
        {members?.map((user, idx) => (
          <ProfileCommentCard
            key={idx}
            user={user.user}
            comment={{ comment: user.text }}
            rightComponent={
              user.isAbsence ? (
                <Box fontSize="11px" color="red">
                  불참 처리
                </Box>
              ) : (
                <>
                  <Flex>
                    <Button
                      mr={1}
                      isDisabled={user?.isAbsence ? true : false}
                      size="sm"
                      colorScheme={user?.isAbsence ? "gray" : "orange"}
                      variant="subtle"
                      onClick={() => {
                        setIsNoManner(false);
                        setDeleteUserId(user.user._id);
                      }}
                    >
                      일반 불참
                    </Button>
                    <Button
                      isDisabled={user?.isAbsence ? true : false}
                      size="sm"
                      variant="subtle"
                      colorScheme="red"
                      onClick={() => {
                        setIsNoManner(true);
                        setDeleteUserId(user.user._id);
                      }}
                    >
                      비매너 불참
                    </Button>
                  </Flex>
                </>
              )
            }
          />
        ))}
      </Flex>
      {deleteUserId && (
        <AlertModal
          options={{
            title: isNoManner ? "비매너 불참" : "일반 불참",
            subTitle: isNoManner
              ? "무단 잠수, 불참으로 인한 피해 발생, 이해할 수 없는 파토 등 비매너 불참의 경우 체크해 주세요. 해당 멤버는 3,000원의 패널티가 부과되며, 모임장님에게도 추가 보상이 전달됩니다. (초대받은 경우 제외)"
              : `모임 직전에 불참한 인원인가요? 해당 멤버는 2,000원의 패널티가 부과되며, 모임장님에게도 추가 보상이 전달됩니다. (초대받은 경우 제외)`,
            func: () => {
              handleDelete(deleteUserId);

              if (isNoManner) {
                updatePoint({
                  uid: deleteUserUid,
                  data: {
                    value: -3000,
                    sub: "gather",
                    message: `[${title}] 모임 불참 패널티(비매너)`,
                  },
                });
              } else {
                updatePoint({
                  uid: deleteUserUid,
                  data: { value: -2000, sub: "gather", message: `[${title}] 모임 불참 패널티` },
                });
              }
              getPoint({ value: 1000, sub: "gather", message: "노쇼 인원에 대한 포인트 보상" });

              setMembers((old) =>
                old.map((props) => ({
                  ...props,
                  isAbsence: props.user._id === deleteUserId ? true : props.isAbsence,
                })),
              );
              setDeleteUserId(null);
            },
            text: "불참 처리",
          }}
          setIsModal={() => setDeleteUserId(null)}
        />
      )}
    </>
  );
}

export default UserAbsenceBoard;
