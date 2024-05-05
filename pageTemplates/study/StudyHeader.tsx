import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

import KakaoShareBtn from "../../components/atoms/Icons/KakaoShareBtn";
import Header from "../../components/layouts/Header";
import { WEB_URL } from "../../constants/system";
import { IPlace } from "../../types/models/studyTypes/studyDetails";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IStudyHeader {
  place: IPlace;
}

function StudyHeader({ place }: IStudyHeader) {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();

  const url = WEB_URL + router?.asPath;

  return (
    <Header title={place.brand} url="/home">
      {place?.brand !== "자유 신청" && (
        <KakaoShareBtn
          type="study"
          title={`${dayjsToFormat(dayjs(date), "(M/D)")} 같이 스터디 해요~!`}
          subtitle={place.fullname}
          location={place.locationDetail}
          img={place.coverImage}
          url={url}
        />
      )}
    </Header>
  );
}

export default StudyHeader;
