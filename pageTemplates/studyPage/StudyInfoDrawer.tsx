import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DispatchType } from "../../types/hooks/reactTypes";

import Avatar from "../../components/atoms/Avatar";
import { Input } from "../../components/atoms/Input";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import StudyVoteDrawer from "../../components/services/studyVote/StudyVoteDrawer";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../hooks/realtime/mutations";
import {
  useStudyCommentMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { ModalLayout } from "../../modals/Modals";

import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import StudyChangeAlertModal from "../../components/modals/alertModals/StudyChangeAlertModal";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { StudyPlaceProps, StudyStatus } from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { IAvatar } from "../../types/models/userTypes/userInfoTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export interface StudyInfoProps {
  id: string;
  place: StudyPlaceProps | PlaceInfoProps;
  title: string;
  time: { start: string; end: string };
  participantCnt: number;
  status: StudyStatus;
  image: string;
  comment: {
    user: {
      userImage: string;
      uid: string;
      avatar: IAvatar;
    };
    text: string;
  };
  location: ActiveLocation;
  memberStatus: "participation" | "notParticipation" | "attendance";
  isPrivate: boolean;
}

interface StudyInFoDrawerProps {
  detailInfo: StudyInfoProps;
  setDetailInfo: DispatchType<StudyInfoProps>;
}

function StudyInFoDrawer({ detailInfo, setDetailInfo }: StudyInFoDrawerProps) {
  const resetStudy = useResetStudyQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeToast = useTypeToast();

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const { mutate: studyVote, isLoading: isLoading1 } = useStudyParticipationMutation(
    dayjs(),
    "post",
    {
      onSuccess() {
        handleSuccess();
      },
    },
  );

  const { mutate: realTimeStudyVote, isLoading: isLoading2 } = useRealtimeVoteMutation({
    onSuccess() {
      handleSuccess();
    },
  });

  const { mutate } = useStudyCommentMutation(dayjs(), {
    onSuccess() {
      typeToast("change");
      setCommentText(commentValue);
      setIsCommentModal(false);
    },
  });

  const [isCommentModal, setIsCommentModal] = useState(false);
  const [commentValue, setCommentValue] = useState(detailInfo?.comment?.text);
  const [commentText, setCommentText] = useState(detailInfo?.comment?.text);
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);
  const [isAlertMoal, setIsAlertModal] = useState(false);

  const handleStudyActionButton = (type: "vote" | "comment" | "attend") => {
    if (type === "comment") {
      setIsCommentModal(true);
    }
    if (type === "vote") {
      setIsVoteDrawer(true);
    }
    if (type === "attend") {
      const isOpenStudy = detailInfo.status === "open";
      router.push(
        isOpenStudy
          ? `/vote/attend/configuration?${searchParams.toString()}`
          : `/vote/attend/certification?${searchParams.toString()}`,
      );
    }
  };

  const handleSuccess = () => {
    typeToast("vote");
    resetStudy();
    setIsVoteDrawer(false);
    setDetailInfo(null);
  };

  const handleComment = () => {
    mutate(commentValue);
  };

  const onClickStudyVote = (voteTime: IStudyVoteTime) => {
    if (myStudyParticipation) {
      setVoteTime(voteTime);
      setIsAlertModal(true);
      return;
    }
    handleVote(voteTime);
  };

  const handleVote = (time?: IStudyVoteTime) => {
  ;
    if (!detailInfo.isPrivate) {
      studyVote({
        place: detailInfo?.id,
        start: time?.start || voteTime?.start,
        end: time?.end || voteTime?.end,
      });
    } else {
      realTimeStudyVote({
        place: detailInfo.place as PlaceInfoProps,
        time: {
          start: time?.start || voteTime?.start,
          end: time?.end || voteTime?.end,
        },
      });
    }
  };

  const status = detailInfo.memberStatus;

  return (
    <>
      <BottomDrawerLg zIndex={700} height={185} setIsModal={() => setDetailInfo(null)}>
        <Flex direction="column" w="100%">
          <Flex justifyContent="space-between" mb={4}>
            <Flex direction="column">
              <Box fontSize="18px" fontWeight={600}>
                {detailInfo.title}
              </Box>
              <Flex align="center" fontSize="11px">
                <Box mr={1}>
                  <i className="fa-solid fa-clock fa-xs" style={{ color: "var(--color-mint)" }} />
                </Box>
                <Box color="var(--gray-500)">
                  {detailInfo.time.start} ~ {detailInfo.time.end}
                </Box>
                <Box w={3} textAlign="center">
                  ·
                </Box>
                <Box color="var(--color-blue)">{detailInfo.participantCnt}명 참여 중</Box>
              </Flex>
              <Flex mt={2} align="center">
                <Avatar {...detailInfo.comment.user} size="xs" />
                <Box ml={1} fontSize="12px" color="var(--gray-600)">
                  {commentText}
                </Box>
              </Flex>
            </Flex>
            <Box
              width="75px"
              height="75px"
              position="relative"
              borderRadius="4px"
              overflow="hidden"
            >
              <Image src={detailInfo.image} fill sizes="80px" alt="studyImage" />
            </Box>
          </Flex>
          <Box py={2}>
            <NewTwoButtonRow
              leftProps={{
                icon: (
                  <i className="fa-solid fa-circle-info" style={{ color: "var(--gray-400)" }} />
                ),
                children: (
                  <Link
                    href={`/study/${detailInfo.id}/${dayjsToStr(dayjs())}?location=${convertLocationLangTo(detailInfo.location, "en")}`}
                  >
                    자세히 보기
                  </Link>
                ),
              }}
              rightProps={{
                icon:
                  status === "attendance" ? (
                    <i className="fa-solid fa-comment-quote fa-flip-horizontal" />
                  ) : status === "notParticipation" ? (
                    <i className="fa-solid fa-user-plus" style={{ color: "#CCF3F0" }} />
                  ) : (
                    <CheckCircleIcon />
                  ),

                children: (
                  <div
                    onClick={() =>
                      handleStudyActionButton(
                        status === "attendance"
                          ? "comment"
                          : status === "notParticipation"
                            ? "vote"
                            : "attend",
                      )
                    }
                  >
                    {status === "attendance"
                      ? "한줄 코멘트 변경"
                      : status === "notParticipation"
                        ? "스터디 합류"
                        : "스터디 출석"}
                  </div>
                ),
              }}
            />
          </Box>
        </Flex>
      </BottomDrawerLg>
      {isCommentModal && (
        <ModalLayout
          footerOptions={{ main: { text: "작성 완료", func: handleComment } }}
          title="코멘트 작성"
          setIsModal={setIsCommentModal}
        >
          <Input value={commentValue} onChange={(e) => setCommentValue(e.target.value)} />
        </ModalLayout>
      )}
      {isVoteDrawer && (
        <StudyVoteDrawer
          hasPlace
          isLoading={isLoading1 || isLoading2}
          handleSubmit={onClickStudyVote}
          setIsModal={setIsVoteDrawer}
        />
      )}
      {isAlertMoal && (
        <StudyChangeAlertModal handleFunction={handleVote} setIsModal={setIsAlertModal} />
      )}
    </>
  );
}

export default StudyInFoDrawer;
