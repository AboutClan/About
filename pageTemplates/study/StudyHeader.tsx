import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import AlertSimpleModal from "../../components/AlertSimpleModal";
import { EllipsisIcon } from "../../components/Icons/DotIcons";
import Header from "../../components/layouts/Header";
import { WEB_URL } from "../../constants/system";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IStudyHeader {
  brand: string;
  name?: string;
  address?: string;
  coverImage?: string;
}

function StudyHeader({ brand, name, address, coverImage }: IStudyHeader) {
  const { date } = useParams<{ date: string }>() || {};
  const typeToast = useTypeToast();
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const url = WEB_URL + router?.asPath;

  const onClick = () => {
    if (name) setIsModal(true);
    else {
      typeToast("not-yet");
    }
  };

  return (
    <>
      <Header title={brand} isCenter defaultUrl="/home">
        <Button variant="unstyled" onClick={onClick}>
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
