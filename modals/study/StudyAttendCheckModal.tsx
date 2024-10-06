import { Box, Flex, Switch } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
// import { RotatingLines } from "react-loader-spinner";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { PopOverIcon } from "../../components/atoms/Icons/PopOverIcon";
import { Input } from "../../components/atoms/Input";
import ScreenOverlay from "../../components/atoms/ScreenOverlay";
import Selector from "../../components/atoms/Selector";
import Spinner from "../../components/atoms/Spinner";
import Textarea from "../../components/atoms/Textarea";
import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { STUDY_ATTEND_MEMBERS } from "../../constants/keys/localStorage";
import {
  POINT_SYSTEM_DEPOSIT,
  POINT_SYSTEM_PLUS,
} from "../../constants/serviceConstants/pointSystemConstants";
import { STUDY_VOTE_HOUR_ARR } from "../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useImageUploadMutation } from "../../hooks/image/mutations";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { useAboutPointMutation, usePointSystemMutation } from "../../hooks/user/mutations";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";
import { getRandomAlphabet } from "../../libs/userEventLibs/collection";
import { myRealStudyInfoState, myStudyInfoState } from "../../recoils/studyRecoils";
import { transferAlphabetState } from "../../recoils/transferRecoils";
import { IModal } from "../../types/components/modalTypes";
import { createTimeArr, dayjsToFormat } from "../../utils/dateTimeUtils";
import { isPWA } from "../../utils/validationUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

const LOCATE_GAP = 0.00008;

function StudyAttendCheckModal({ setIsModal }: IModal) {
  const typeToast = useTypeToast();
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const { date: dateParam2 } = useParams<{ date: string; id: string }>() || {};
  const searchParams = useSearchParams();
  const dateParam1 = searchParams.get("date");

  const date = dateParam1 || dateParam2;

  const initialRef = useRef(null);
  const [imageUrl, setImageUrl] = useState<Blob>();
  const [isChecking, setIsChecking] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isOtherPermission, setIsOtherPermission] = useState(true);
  const [titleText, setTitleText] = useState("");
  const [attendText, setAttendText] = useState("");
  const [endHour, setEndHour] = useState<string>(dayjsToFormat(dayjs(), "HH:mm"));

  const myStudy = useRecoilValue(myStudyInfoState);
  const myRealStudy = useRecoilValue(myRealStudyInfoState);
  const setTransferAlphabet = useSetRecoilState(transferAlphabetState);

  const myParticipationInfo =
    myStudy?.attendences?.find((who) => who.user.uid === session?.user?.uid) || myRealStudy;

  const { mutate: getAboutPoint } = useAboutPointMutation();
  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const { mutate: handleArrived } = useStudyAttendCheckMutation(date, {
    onSuccess() {
      saveTogetherMembers();
      resetStudy();
      getRandomAlphabetOrNone();

      const pointObj =
        myStudy?.status === "open"
          ? POINT_SYSTEM_PLUS.STUDY_ATTEND_CHECK
          : POINT_SYSTEM_PLUS.STUDY_PRIVATE_ATTEND;

      getAboutPoint(pointObj);

      const isLate = dayjs().isAfter(dayjs(myParticipationInfo?.time?.end).add(1, "hour"));
      if (isLate) getDeposit(POINT_SYSTEM_DEPOSIT.STUDY_ATTEND_LATE);
      toast(
        "success",
        `출석 완료! ${pointObj.value} 포인트가 적립되었습니다. ${isLate ? "하지만 지각..." : ""}`,
      );
    },
    onError: () => typeToast("error"),
  });

  const { mutate: imageUpload } = useImageUploadMutation({
    onSuccess() {
      resetStudy();
    },
    onError(err) {
      console.error(err);
      toast("error", "이미지 업로드에 실패했습니다.");
    },
  });

  useEffect(() => {
    setEndHour(dayjsToFormat(dayjs(myParticipationInfo?.time?.end) || dayjs(), "HH:mm"));
  }, []);

  useEffect(() => {
    const newTitleText = myStudy?.place.fullname || myRealStudy?.place.text;
    setTitleText(newTitleText || "");
  }, [myStudy, myRealStudy]);

  const saveTogetherMembers = () => {
    const studyVotingTable = JSON.parse(localStorage.getItem(STUDY_ATTEND_MEMBERS)) || [];
    const newEntry = {
      date,
      members: myStudy?.attendences
        .map((who) => who.user)
        .filter((who) => who.uid !== session?.user.uid),
    };
    localStorage.setItem(STUDY_ATTEND_MEMBERS, JSON.stringify([...studyVotingTable, newEntry]));
  };

  const getRandomAlphabetOrNone = () => {
    const alphabet = getRandomAlphabet(20);
    if (alphabet) {
      getAlphabet({ alphabet });
      setTransferAlphabet(alphabet);
    }
  };

  const handleAttendCheck = () => {
    if (isPWA()) {
      toast("error", "어플상으로만 출석체크가 가능합니다.");
      return;
    }
    setIsChecking(true);
    handleArrived(attendText || "출석");
    setTimeout(() => {
      setIsChecking(false);
      setIsModal(false);
    }, 2000);
  };

  const handlePrivateSubmit = () => {
    if (!imageUrl) {
      toast("error", "이미지를 확인할 수 없습니다.");
      return;
    }
    handleAttendCheck();
    const formData = new FormData();
    formData.append("image", imageUrl);
    formData.append("path", "studyAttend");
    imageUpload(formData);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "출석",
      func: myStudy?.status === "open" ? handleAttendCheck : handlePrivateSubmit,
    },
    isFull: true,
  };

  const endTimeArr = createTimeArr(
    dayjs().hour(),
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 1],
  );

  return (
    <>
      <ModalLayout
        title="출석 체크"
        footerOptions={footerOptions}
        setIsModal={setIsModal}
        initialRef={initialRef}
        isInputFocus={isFocus}
      >
        <Box mb={2} fontSize="15px" color="var(--color-mint)">
          출석시 얻을 수 있는 보상: +2점 & 알파벳
        </Box>
        <Flex align="center" mb={2}>
          <Box fontWeight={600} w="80px" mr={1}>
            현재 장소:
          </Box>
          <Input value={titleText} onChange={(e) => setTitleText(e.target.value)} />
        </Flex>
        {myStudy?.status !== "open" && (
          <>
            <Box fontSize="16px" mb={1} fontWeight={600}>
              인증 사진 올리기
            </Box>
            <ImageUploadInput setImageUrl={setImageUrl} />
          </>
        )}
        <>
          {!myStudy && (
            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-person-to-door" />
                </div>
                <span>다른 인원 참여 허용</span>
                <PopOverIcon
                  title="참여 승인제"
                  text="선착순 참여가 아니라 모임장이 승인하는 방식으로 진행됩니다."
                />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mintTheme"
                isChecked={!isOtherPermission}
                onChange={() => setIsOtherPermission((old) => !old)}
              />
            </Item>
          )}
          {!isOtherPermission && (
            <Textarea
              placeholder="ex. 입구 오른쪽 계단 아래 초록색 후드티"
              onChange={(e) => setAttendText(e.target.value)}
              value={attendText}
              setIsFocus={setIsFocus}
            />
          )}
        </>
        <Item>
          <Name>
            <div>
              <i className="fa-solid fa-person-to-door" />
            </div>
            <span>예상 종료 시간</span>
            <PopOverIcon
              title="참여 승인제"
              text="선착순 참여가 아니라 모임장이 승인하는 방식으로 진행됩니다."
            />
          </Name>
          <Selector options={endTimeArr} defaultValue={endHour} setValue={setEndHour} />
        </Item>
      </ModalLayout>
      {isChecking && (
        <>
          <Spinner text="위치를 확인중입니다..." />
          <ScreenOverlay zIndex={2000} />
        </>
      )}
    </>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  > div:first-child {
    text-align: center;
    width: 20px;
  }
  span {
    margin-left: var(--gap-2);
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--gap-4) 0;
  align-items: center;
  border-bottom: var(--border);
`;

export default StudyAttendCheckModal;
