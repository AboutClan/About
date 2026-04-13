import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import RightDrawer from "../../../../components/organisms/drawer/RightDrawer";
import {
  CrewLocationProps,
  STUDY_CREW,
  STUDY_CREW_ID_MAPPING,
  STUDY_CREW_PLACE_MAPPING,
} from "../../../../constants/service/study/place";
import { useResetStudyQuery } from "../../../../hooks/custom/CustomHooks";
import { useGroupIdQuery } from "../../../../hooks/groupStudy/queries";
import { useStudyInviteMutation } from "../../../../hooks/study/mutations";
import { CloseProps } from "../../../../types/components/modalTypes";
import { StudyCrew } from "../../../../types/models/studyTypes/study-entity.types";
import { StudyVoteProps } from "../../../../types/models/studyTypes/studyInterActions";
import { UserSimpleInfoProps } from "../../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat, dayjsToStr } from "../../../../utils/dateTimeUtils";
import { MainLoadingAbsolute } from "../../../atoms/loaders/MainLoading";
import InviteUserGroups from "../../../molecules/groups/InviteUserGroups";

export function StudyInviteDrawer({ onClose }: CloseProps) {
  const resetStudy = useResetStudyQuery();

  const [users, setUsers] = useState<UserSimpleInfoProps[]>([]);

  const [locationInfo, setLocationInfo] = useState<{
    main: StudyCrew;
    sub: CrewLocationProps;
  }>({
    main: null,
    sub: null,
  });
  const [date, setDate] = useState<string>();

  const locationMain = locationInfo.main;
  const { data: groupData, isLoading } = useGroupIdQuery(
    locationMain && STUDY_CREW_ID_MAPPING[locationMain],
    {
      enabled: !!locationMain,
    },
  );

  const { mutate: inviteMember } = useStudyInviteMutation(date, {
    onSuccess() {
      resetStudy();
    },
  });

  useEffect(() => {
    if (groupData) {
      setUsers(groupData.participants.map((p) => p.user));
    }
  }, [groupData]);

  const handleInviteBtn = (who: UserSimpleInfoProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { standard, rating, address, ...placeProps } = locationInfo.sub;
    const startHour = dayjs(date).day() <= 5 ? 18 : 14;

    const voteInfo: StudyVoteProps = {
      ...placeProps,
      locationDetail: address,
      userId: who._id,
      start: dayjs(date).hour(startHour).minute(0),
      end: dayjs(date)
        .hour(startHour + 4)
        .minute(0),
      eps: 1,
    };
    inviteMember(voteInfo);
    setUsers((old) => [...old].filter((u) => u._id !== who._id));
  };

  return (
    <RightDrawer title="인원 초대" onClose={onClose}>
      <>
        <Flex mb={2}>
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <Button
              key={n}
              onClick={() => {
                setDate(dayjsToStr(dayjs().add(n, "day")));
              }}
              colorScheme={date === dayjsToStr(dayjs().add(n, "day")) ? "mint" : "gray"}
            >
              {dayjsToFormat(dayjs().add(n, "day"), "D(ddd)")}
            </Button>
          ))}
        </Flex>
        <Box h="2px" bg="gray.100" mb={2} />
        <Grid templateColumns="repeat(2,1fr)" gap={1}>
          {STUDY_CREW.map((place) => (
            <Button
              key={place}
              colorScheme={locationMain === place ? "mint" : "gray"}
              onClick={() => {
                setLocationInfo({ main: place, sub: STUDY_CREW_PLACE_MAPPING[place][0] });
              }}
            >
              {place}
            </Button>
          ))}
        </Grid>
        <Box h="2px" bg="gray.100" my={2} />
        {locationMain && (
          <Grid templateColumns="repeat(2,1fr)" gap={1}>
            {STUDY_CREW_PLACE_MAPPING[locationMain].map((place) => (
              <Button
                key={place.name}
                colorScheme={locationInfo.sub === place ? "mint" : "gray"}
                onClick={() => {
                  setLocationInfo({ main: locationMain, sub: place });
                }}
              >
                {place.name}
              </Button>
            ))}
          </Grid>
        )}{" "}
        <Box h="2px" bg="gray.100" my={2} />
        <Box
          mb={5}
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {isLoading ? (
            <MainLoadingAbsolute />
          ) : users.length ? (
            <InviteUserGroups
              users={users}
              inviteUser={(who) => {
                handleInviteBtn(who);
              }}
            />
          ) : null}
        </Box>
      </>
    </RightDrawer>
  );
}
