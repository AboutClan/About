import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import KakaoShareBtn from "../../components/atoms/Icons/KakaoShareBtn";
import Header from "../../components/layouts/Header";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { WEB_URL } from "../../constants/system";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IStudyHeader {
  brand: string;
  fullname: string;
  locationDetail: string;
  coverImage: string;
}

function StudyHeader({ brand, fullname, locationDetail, coverImage }: IStudyHeader) {
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>();
  const location = PLACE_TO_LOCATION?.[id] || session?.user.location;
  const locationEn = convertLocationLangTo(location, "en");
  const router = useRouter();

  const url = WEB_URL + router?.asPath;

  return (
    <Header title={brand} url={`/home/?location=${locationEn}&date=${date}`}>
      {brand !== "자유 신청" && (
        <KakaoShareBtn
          type="study"
          title={`${dayjsToFormat(dayjs(date), "(M/D)")} 같이 스터디 해요~!`}
          subtitle={fullname}
          location={locationDetail}
          img={coverImage}
          url={url}
        />
      )}
    </Header>
  );
}

export default StudyHeader;
