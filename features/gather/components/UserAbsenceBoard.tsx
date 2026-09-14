import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import AlertModal from "@/components/AlertModal";
import ProfileCommentCard from "@/components/molecules/cards/ProfileCommentCard";
import { usePointSystemMutation } from "@/features/user/hooks/mutations";
import { GatherAbsenceType, IGather } from "@/types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

interface AbsenceBoardUser {
  user: UserSimpleInfoProps;
  text: string;
  isAbsence: boolean;
  absenceType?: GatherAbsenceType;
}

interface UserAbsenceBoardProps {
  gatherData: IGather;
  users: AbsenceBoardUser[];
  handleDelete: (userId: string, type: GatherAbsenceType) => void;
}

// 차감 금액의 기준은 서버(CONST.POINT.GATHER_ABSENCE_*)다. 여기 값은 안내 문구용이다.
const ABSENCE_OPTIONS: Record<
  GatherAbsenceType,
  { label: string; point: number; colorScheme: string; variant: string; description: string }
> = {
  normal: {
    label: "일반 불참",
    point: 1000,
    colorScheme: "orange",
    variant: "subtle",
    description: "모임 하루이틀 전에 불참을 알린 경우예요.",
  },
  noshow: {
    label: "당일 노쇼",
    point: 3000,
    colorScheme: "red",
    variant: "subtle",
    description: "모임 당일에 불참한 경우예요.",
  },
  nomanner: {
    label: "비매너 불참",
    point: 5000,
    colorScheme: "red",
    variant: "solid",
    description: "연락 없이 당일에 불참한 경우예요.",
  },
};

const ABSENCE_ORDER: GatherAbsenceType[] = ["normal", "noshow", "nomanner"];

function UserAbsenceBoard({ users, handleDelete }: UserAbsenceBoardProps) {
  const { mutate: getPoint } = usePointSystemMutation("point");

  const [target, setTarget] = useState<{ userId: string; type: GatherAbsenceType }>(null);
  const [members, setMembers] = useState<AbsenceBoardUser[]>([]);

  useEffect(() => {
    if (!members.length && users.length) {
      setMembers(users);
    }
  }, [users]);

  const targetOption = target ? ABSENCE_OPTIONS[target.type] : null;

  return (
    <>
      <Flex direction="column">
        {members?.map((member, idx) => (
          <ProfileCommentCard
            key={idx}
            user={member.user}
            comment={{ comment: member.text }}
            rightComponent={
              member.isAbsence ? (
                <Box fontSize="11px" color="red">
                  {ABSENCE_OPTIONS[member.absenceType]?.label ?? "불참 처리"}
                </Box>
              ) : (
                <Flex gap={1}>
                  {ABSENCE_ORDER.map((type) => (
                    <Button
                      key={type}
                      size="xs"
                      colorScheme={ABSENCE_OPTIONS[type].colorScheme}
                      variant={ABSENCE_OPTIONS[type].variant}
                      onClick={() => setTarget({ userId: member.user._id, type })}
                    >
                      {ABSENCE_OPTIONS[type].label}
                    </Button>
                  ))}
                </Flex>
              )
            }
          />
        ))}
      </Flex>
      {target && targetOption && (
        <AlertModal
          options={{
            title: targetOption.label,
            subTitle: `${targetOption.description} 해당 멤버에게 ${targetOption.point.toLocaleString()} 포인트 패널티가 부과되고 알림이 발송되며, 모임장님에게도 추가 보상이 전달됩니다.`,
            func: () => {
              handleDelete(target.userId, target.type);
              getPoint({ value: 1000, sub: "gather", message: "노쇼 인원에 대한 포인트 보상" });

              setMembers((old) =>
                old.map((props) =>
                  props.user._id === target.userId
                    ? { ...props, isAbsence: true, absenceType: target.type }
                    : props,
                ),
              );
              setTarget(null);
            },
            text: "불참 처리",
          }}
          setIsModal={() => setTarget(null)}
        />
      )}
    </>
  );
}

export default UserAbsenceBoard;
