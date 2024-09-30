/* eslint-disable */

import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useQueryClient } from "react-query";
// import { RotatingLines } from "react-loader-spinner";
import { useSetRecoilState } from "recoil";

import ScreenOverlay from "../../components/atoms/ScreenOverlay";
import Spinner from "../../components/atoms/Spinner";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useImageUploadMutation } from "../../hooks/image/mutations";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { useAboutPointMutation, usePointSystemMutation } from "../../hooks/user/mutations";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";
import { getRandomAlphabet } from "../../libs/userEventLibs/collection";
import { transferAlphabetState } from "../../recoils/transferRecoils";

import { Box, Flex, Switch } from "@chakra-ui/react";
import styled from "styled-components";
import { PopOverIcon } from "../../components/atoms/Icons/PopOverIcon";
import { Input } from "../../components/atoms/Input";
import Selector from "../../components/atoms/Selector";
import Textarea from "../../components/atoms/Textarea";
import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
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
  const resetStudy = useResetStudyQuery();

  const { date: dateParam2, id } = useParams<{ date: string; id: string }>() || {};
  const dateParam1 = searchParams.get("date");
  const locationParam1 = searchParams.get("location");

  const location = locationParam1
    ? convertLocationLangTo(searchParams.get("location") as LocationEn, "kr")
    : PLACE_TO_LOCATION[id];

  const date = dateParam1 || dateParam2;

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
      // if (!isFree) {
      //   const studyVotingTable = JSON.parse(localStorage.getItem(STUDY_ATTEND_MEMBERS)) || [];
      //   const newEntry = {
      //     date,
      //     members: myStudy?.attendences
      //       .map((who) => who.user)
      //       .filter((who) => who.uid !== session?.user.uid),
      //   };
      //   localStorage.setItem(STUDY_ATTEND_MEMBERS, JSON.stringify([...studyVotingTable, newEntry]));
      // }
      resetStudy();
      const alphabet = getRandomAlphabet(20);
      if (alphabet) {
        getAlphabet({ alphabet });
        setTransferAlphabet(alphabet);
      }
      const pointObj = POINT_SYSTEM_PLUS.STUDY_ATTEND_CHECK;
      getAboutPoint(pointObj);
      // const studyVoteInfo = getMyStudyVoteInfo(myStudy, session?.user.uid);

      // const isLate = dayjs().isAfter(dayjs(studyVoteInfo.start).add(1, "hour"));
      // if (isLate) getDeposit(POINT_SYSTEM_DEPOSIT.STUDY_ATTEND_LATE);
      // toast(
      //   "success",
      //   `출석 완료! ${pointObj.value} 포인트가 적립되었습니다. ${isLate ? "하지만 지각..." : ""}`,
      // );
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
      // handleArrived(isPrivate ? null : value || "출석");
      setTimeout(() => {
        setIsChecking(false);
        setIsModal(false);
      }, 2000);
    } else {
    }
  };

  const { mutate: imageUpload } = useImageUploadMutation({
    onSuccess() {
      resetStudy();
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
      // func: !isPrivate ? handleAttendCheck : handlePrivateSubmit,
    },
    isFull: true,
  };

  const [isFocus, setIsFocus] = useState(false);

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
        <Flex direction="column">
          <Box>현재 장소 명:</Box>
          <Input />
        </Flex>
        <Box fontSize="16px" mb={1} fontWeight={600}>
          인증 사진 올리기
        </Box>
        <ImageUploadInput setImageUrl={setImageUrl} />{" "}
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
            // isChecked={condition.isApprove}
            // onChange={(e) => toggleSwitch(e, "isApprove")}
          />
        </Item>{" "}
        <Textarea
          placeholder="ex. 입구 오른쪽 계단 아래 초록색 후드티"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          setIsFocus={setIsFocus}
        />
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
          <Selector options={["22:00"]} />
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
