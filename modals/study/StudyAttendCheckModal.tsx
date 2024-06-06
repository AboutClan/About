/* eslint-disable */

import { Box, Textarea } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useQueryClient } from "react-query";
// import { RotatingLines } from "react-loader-spinner";
import { useRecoilValue, useSetRecoilState } from "recoil";

import ScreenOverlay from "../../components/atoms/ScreenOverlay";
import Spinner from "../../components/atoms/Spinner";
import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { STUDY_VOTE } from "../../constants/keys/queryKeys";
import {
  POINT_SYSTEM_DEPOSIT,
  POINT_SYSTEM_PLUS,
} from "../../constants/serviceConstants/pointSystemConstants";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useImageUploadMutation } from "../../hooks/image/mutations";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { useAboutPointMutation, usePointSystemMutation } from "../../hooks/user/mutations";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";
import { getMyStudyVoteInfo } from "../../libs/study/getMyStudy";
import { getRandomAlphabet } from "../../libs/userEventLibs/collection";
import { myStudyState } from "../../recoils/studyRecoils";
import { transferAlphabetState } from "../../recoils/transferRecoils";

import { STUDY_ATTEND_MEMBERS } from "../../constants/keys/localStorage";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { IFooterOptions, ModalLayout } from "../Modals";

const LOCATE_GAP = 0.00008;

interface IStudyAttendCheckModal extends IModal {}

function StudyAttendCheckModal({ setIsModal }: IStudyAttendCheckModal) {
  const { data: session } = useSession();
  const toast = useToast();
  const typeToast = useTypeToast();
  const searchParams = useSearchParams();

  const { date: dateParam2, id } = useParams<{ date: string; id: string }>() || {};
  const dateParam1 = searchParams.get("date");
  const locationParam1 = searchParams.get("location");

  const location = locationParam1
    ? convertLocationLangTo(searchParams.get("location") as LocationEn, "kr")
    : PLACE_TO_LOCATION[id];

  const date = dateParam1 || dateParam2;

  const myStudy = useRecoilValue(myStudyState);
  const isFree = myStudy.status === "free";
  const isPrivate = myStudy.place.brand === "자유 신청";

  const initialRef = useRef(null);
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const setTransferAlphabet = useSetRecoilState(transferAlphabetState);

  const queryClient = useQueryClient();

  const { mutate: getAboutPoint } = useAboutPointMutation();
  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const { mutate: handleArrived } = useStudyAttendCheckMutation(date, {
    onSuccess() {
      if (!isFree) {
        const studyVotingTable = JSON.parse(localStorage.getItem(STUDY_ATTEND_MEMBERS)) || [];
        const newEntry = {
          date,
          members: myStudy?.attendences
            .map((who) => who.user)
            .filter((who) => who.uid !== session?.user.uid),
        };
        localStorage.setItem(STUDY_ATTEND_MEMBERS, JSON.stringify([...studyVotingTable, newEntry]));
      }
      queryClient.invalidateQueries([STUDY_VOTE, date, location]);
      const alphabet = getRandomAlphabet(20);
      if (alphabet) {
        getAlphabet({ alphabet });
        setTransferAlphabet(alphabet);
      }
      const pointObj = isPrivate
        ? POINT_SYSTEM_PLUS.STUDY_PRIVATE_ATTEND
        : POINT_SYSTEM_PLUS.STUDY_ATTEND_CHECK;
      getAboutPoint(pointObj);
      const studyVoteInfo = getMyStudyVoteInfo(myStudy, session?.user.uid);

      const isLate = !isFree && dayjs().isAfter(dayjs(studyVoteInfo.start).add(1, "hour"));
      if (isLate) getDeposit(POINT_SYSTEM_DEPOSIT.STUDY_ATTEND_LATE);
      toast(
        "success",
        `출석 완료! ${pointObj.value} 포인트가 적립되었습니다. ${isLate ? "하지만 지각..." : ""}`,
      );
    },
    onError: () => typeToast("error"),
  });

  const handleAttendCheck = () => {
    setIsChecking(true);
    // navigator.geolocation.getCurrentPosition((data) => {
    //   const coords = data?.coords;
    if (
      // (coords.latitude > myPlace?.latitude - LOCATE_GAP ||
      //   coords.latitude < myPlace?.latitude + LOCATE_GAP) &&
      // (coords.longitude > myPlace?.longitude - LOCATE_GAP ||
      //   coords.longitude < myPlace?.longitude + LOCATE_GAP)
      true
    ) {
      handleArrived(isPrivate ? null : value || "출석");
      setTimeout(() => {
        setIsChecking(false);
        setIsModal(false);
      }, 2000);
    } else {
    }
  };

  const { mutate: imageUpload } = useImageUploadMutation({
    onSuccess() {
      queryClient.invalidateQueries([STUDY_VOTE, date, location]);
    },
    onError(err) {
      console.error(err);
      toast("error", "이미지 업로드에 실패했습니다.");
    },
  });

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
      func: !isPrivate ? handleAttendCheck : handlePrivateSubmit,
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title="출석 체크"
        footerOptions={footerOptions}
        setIsModal={setIsModal}
        initialRef={initialRef}
      >
        <ModalSubtitle>
          도착하셨나요? <br />
          자리나 인상착의를 간단하게 적어주세요!
          <br />
          <Box as="span" fontSize="12px" color="var(--gray-600)">
            {isPrivate &&
              "+ 현재 아이폰에서 가끔 출석 인증 오류가 나는 경우가 있습니다. 만약 그런 경우 마이페이지 건의하기에서 -> 출석오류라고 하나만 보내주시면 바꿔드릴게요!"}
          </Box>
        </ModalSubtitle>
        {!isPrivate ? (
          <Textarea
            placeholder="ex. 입구 오른쪽 계단 아래 초록색 후드티"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            ref={initialRef}
          />
        ) : (
          <ImageUploadInput setImageUrl={setImageUrl} />
        )}
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

export default StudyAttendCheckModal;
