import dayjs from "dayjs";
import Head from "next/head";
import { useEffect } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function ShareParticipations() {
  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(dayjs())}?type=participations`;

    window.location.replace(openUrl);
  }, []);

  return (
    <>
      <Head>
        {/* ✅ OG 여기서 결정 */}
        <meta property="og:title" content="카공 스터디 라운지" />
        <meta property="og:description" content="스터디 확인, 신청, 변경 모두 이 곳에서!" />
        <meta
          property="og:image"
          content="https://studyabout.s3.ap-northeast-2.amazonaws.com/동아리/1.스터디-매칭-라운지.png"
        />
      </Head>
    </>
  );
}
