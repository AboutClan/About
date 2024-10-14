import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

import KakaoShareBtn from "../../components/Icons/KakaoShareBtn";
import Header from "../../components/layouts/Header";
import { WEB_URL } from "../../constants/system";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IStudyHeader {
  name: string;
  address: string;
  coverImage: string;
}

function StudyHeader({ name, address, coverImage }: IStudyHeader) {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();

  const url = WEB_URL + router?.asPath;

  return (
    <Header title="">
      <KakaoShareBtn
        type="study"
        title={`${dayjsToFormat(dayjs(date), "(M/D)")} 같이 스터디 해요~!`}
        subtitle={name}
        location={address}
        img={coverImage}
        url={url}
      />
    </Header>
  );
}

export default StudyHeader;
