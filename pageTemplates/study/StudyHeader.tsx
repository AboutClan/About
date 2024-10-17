import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import AlertSimpleModal from "../../components/AlertSimpleModal";
import { EllipsisIcon } from "../../components/Icons/DotIcons";

import Header from "../../components/layouts/Header";
import { WEB_URL } from "../../constants/system";
import { useToast } from "../../hooks/custom/CustomToast";
import { BasicButtonProps } from "../../types/components/propTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IStudyHeader {
  brand: string;
  name: string;
  address: string;
  coverImage: string;
}

function StudyHeader({ brand, name, address, coverImage }: IStudyHeader) {
  const { date } = useParams<{ date: string }>();
  const toast = useToast();
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const url = WEB_URL + router?.asPath;

  const infoArr: BasicButtonProps[] = [
    {
      text: "카카오톡으로 공유하기",
      func: () => {},
    },
    {
      text: "스터디 정보 수정하기",
      func: () => {},
    },
  ];

  const onClick = () => {
    toast("warning", "장소 수정 요청, 공유하기 등 준비중입니다");
  };

  return (
    <>
      <Header title={brand} isCenter>
        <Button variant="unstyled" onClick={() => setIsModal(true)}>
          <EllipsisIcon />
        </Button>
        {/* <KakaoShareBtn
          type="study"
          title={`${dayjsToFormat(dayjs(date), "(M/D)")} 같이 스터디 해요~!`}
          subtitle={name}
          location={address}
          img={coverImage}
          url={url}
        /> */}
      </Header>
      {/* {isModal && <BottomButtonColDrawer infoArr={infoArr} setIsModal={setIsModal} />} */}
      {isModal && (
        <AlertSimpleModal
          options={{
            title: "기능 점검",
            subTitle: "장소 추가, 카카오톡 공유, 정보 수정 등의 기능을 점검중에 있습니다.",
            kakaoOption: {
              type: "study",
              title: `${dayjsToFormat(dayjs(date), "(M/D)")} 같이 스터디 해요~!}`,
              subtitle: name,
              location: address,
              img: coverImage,
              url: url,
            },
          }}
          setIsModal={setIsModal}
        />
      )}
    </>
  );
}

export default StudyHeader;
