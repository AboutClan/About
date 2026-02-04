import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const groupId = String(ctx.query?.groupId ?? "");
  const m = GROUP_OG_MAPPING[groupId];

  const og = groupId
    ? {
        title: `번개 모임`,
        description: m?.title
          ? `[${m.title}]에서 진행하는 번개 모임!`
          : "공유된 번개 모임을 확인해보세요!",
        url: `https://about20s.club/s/gather/${id}?groupId=${groupId}`,
        image:
          m?.image ??
          "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg",
      }
    : {
        title: "번개 모임",
        description: "공유된 번개 모임을 확인해보세요!",
        url: `https://about20s.club/gather/${id}`,
        image:
          "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/thumbnail.jpg",
      };

  return {
    props: { id, og, groupId },
  };
};

export default function ShareParticipationsGroup({ id, og, groupId }) {
  useEffect(() => {
    if (!id) return;

    const dl = groupId ? `gather/${id}%3FgroupId=${encodeURIComponent(groupId)}` : `gather/${id}`;

    window.location.replace(`https://about20s.club/_open?dl=${dl}`);
  }, [id, groupId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={og.title} key="og:title2" />

        <meta property="og:description" content={og.description} key="og:description2" />

        <meta property="og:image" content={og.image} key="og:image2" />
        <meta property="og:url" content={og.url} key="og:url2" />
      </Head>
    </>
  );
}

export const GROUP_OG_MAPPING: Record<
  string,
  { image: string | null; description: string; title: string }
> = {
  "17": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B2%8C%EC%9E%84.jpg",
    description:
      "솔랭이 지겹다면, 이제 같이 큐 돌려요! 🎮 저희는 실력 상관없이 재미와 분위기를 가장 중요하게 생각하는 즐겜러들의 게임 소모임입니다. 다양한 인기 게임을 함께 즐기며 스트레스 없이 찐하게 웃고 떠들 멤버를 찾습니다! 오늘 밤도 파티원 모집 중! 🚀",
    title: "🎮 온라인 게임 소모임 🎮",
  },
  "18": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%9A%B4%EB%8F%99%EC%9D%B8%EC%A6%9D.jpg",
    description:
      "운동 시작은 했는데 혼자라 쉽게 미룬 적 있지 않나요? 여기는 각자 운동하고 인증 올리면서 같이 꾸준함을 만들어가는 소모임입니다!",
    title: "💪 오운완! 꾸준히 운동 인증하는 모임!",
  },
  "25": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%ED%88%AC%EB%91%90.jpg",
    description:
      "해야 할 일, 자꾸 깜박하거나 미루게 되진 않나요? 🥹 매일 계획만 세우고 작심삼일이었다면, 이제 TO DO MATE와 함께 매일 계획하고 실천해 봐요! 혼자 미루던 일도 서로 응원하며 시작하면 습관이 되는 건 시간 문제랍니다! (3년 차인 제가 보증해요! ㅎㅎ) ✨",
    title: "✅ TO DO MATE | 매일 할 일 체크",
  },
  "83": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9D%BC%EA%B8%B0%EC%A7%81%EC%82%AC.png",
    description:
      "하루를 돌아보고, 익명으로 일기를 쓰는 소모임입니다.\n감사일기, 하루일기, 생각정리… 어떤 내용이든 좋아요 ✍️",
    title: "하루의 끝에서, 공유 일기 (익명)",
  },
  "93": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8.jpg",
    description:
      "건강한 다이어트를 목표로, 식단과 운동 인증을 통해 함께 응원하며 습관을 만들어가는 소모임입니다!",
    title: "다이어트 메이트 (익명)",
  },
  "102": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%B6%9C%EC%82%AC+%EC%BB%A4%EB%B2%84+2.jpg",
    description:
      "다양한 장소를 함께 거닐며, 풍경부터 감성 스냅까지 담아내는 사진 소모임입니다. 서울 골목, 전시 공간, 야경, 감성 카페까지!📷",
    title: "포커스 온 📷 사진 출사 소모임",
  },
  "104": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%AC%B8%ED%99%94%EC%A7%81%EC%82%AC.jpg",
    description:
      "전시,팝업,연극,뮤지컬 등! 여러분의 감성을 채워줄 든든한 문화생활 크루, 바로 여기 있습니다! 🌟 혼자서는 놓치기 쉬웠던 팝업 공간부터 화제의 전시까지 저희와 함께해요! 같은 것을 보고 다른 생각을 나누는 즐거움에 푹 빠져보실 분들 환영합니다! 🚀\n",
    title: "🎨 문화 탐방 소모임 🎭",
  },
  "106": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%B0%A9%ED%83%88%EC%B6%9C.jpg",
    description:
      "추리력, 팀워크, 그리고 스릴까지! 이 모든 걸 즐길 준비 되셨나요? 🔓 수도권의 핫한 인기 테마부터 신규 테마까지 섭렵하며 함께 방을 탈출할 크루를 모집합니다! 활동이 정말 활발한 곳이라 매주 재밌는 일을 찾고 있다면 지금 바로 합류하세요! 🔥",
    title: "🕵️‍♀️ 방탈출: 미스터리 추리반 🔓",
  },
  "107": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%8A%B5%EA%B4%80.jpg",
    description:
      "영양제 챙겨 먹기, 글쓰기, 물 많이 마시기 등 여러분이 원하는 습관을 자유롭게 정하고 매일 인증하며 실천합니다. 시작은 쉽고 목표는 확실하게! 혼자서는 어려웠던 꾸준함을 서로 응원하는 책임감으로 만들어가요. 함께 독려하며 습관 달성하고 푸짐한 상품까지 챙겨가세요!",
    title: "2026부터 갓생 시작! 습관 만들기 소모임",
  },
  "110": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%86%A0%EB%A1%A0+%EC%A7%81%EC%82%AC.png",
    description:
      "살면서 “그게 내 생각이야”라고 확신 있게 말해본 적, 얼마나 될까요? 말문이 막히거나, 말한 뒤에도 아리송했던 순간들… 누구나 있어요! 이 모임은 그런 고민에서 출발합니다.",
    title: "우당탕탕 토론 대소동",
  },
  "116": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EB%B3%BC%EB%A7%81.jpg",
    description:
      '볼링 핀 쓰러지는 소리에 스트레스도 한 방에! 🎳 실력보다는 재미와 친목을 최우선으로 생각하는 친근한 볼링 모임입니다! "나 완전 초보인데..." 하는 걱정은 NO! 일일 코치가 기초부터 차근차근 알려드리니 가벼운 마음으로 몸만 오세요! 다 같이 신나게 굴리다 보면 어느새 스트레스는 제로! 🔥',
    title: "🎳 Strike Club 🎳 볼링 소모임",
  },
  "117": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EB%B8%94%EB%A1%9C%EA%B7%B8.jpg",
    description:
      "오늘의 소소한 일상, 그냥 잊어버리기 너무 아깝잖아요? 🥹 블로그에 내 하루를 기록하고 싶은데 혼자선 막막했다면 저희와 함께해요! 서로 이웃 맺고 소통하며 즐거운 기록 습관을 만들어갈 친구들을 찾습니다! ✨",
    title: "Daily Blog, 왓츠인마이블로그",
  },
  "118": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%B9%B4%ED%8E%98%ED%83%90%EB%B0%A9.jpg",
    description:
      "카공 메이트 찾으세요? ✨ 집은 답답하고 혼자 카페 가긴 좀 심심했다면 저희랑 같이 가요! 사실 옆에 공부하는 사람 한 명만 있어도 집중력이 확 올라가잖아요. 카페 가서 각자 할 일 딱 끝내고 맛있는 거 먹으러 가는 심플하고 알찬 모임입니다! 📚",
    title: "☕ 오늘의 카페 | 카공 + 카페 탐방",
  },
  "131": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%ED%81%B4%EB%9D%BC%EC%9D%B4%EB%B0%8D+%EC%BB%A4%EB%B2%84.jpg",
    description:
      "클라이밍, 너무 어렵게 생각하지 말고, 저희랑 같이 도전해요! 같이 즐겁게 땀 흘리고 오르다 보면, 금방 적응하고 재미 붙일 거예요! ",
    title: "클라이밍 소모임 🧗 GRIP",
  },
  "132": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EA%B8%B0%EC%83%81+-+%EC%BB%A4%EB%B2%84.jpg",
    description:
      "매일 아침, 내가 정한 시간에 일어나서 인증해보자. \n'오늘 일진이 좋은데'라는 말은 모닝 루틴에서 시작된다!",
    title: "🌅 기상 인증 스터디, 모닝 루틴!",
  },
  "135": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84.jpg",
    description:
      "처음하는 사람도, 자주 즐기는 사람도 모두 환영합니다 🙂 보드게임에 관심은 있지만 아직 제대로 해본 적이 없거나, 새로운 게임 파티원을 찾고 있었다면 여기가 딱이에요! 매주 다양한 게임을 통해 자연스럽게 어울리고, 함께 취미를 즐겨봐요!",
    title: "🎲 보드게임 소모임, ROLL THE DICE 🎲",
  },
  "136": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%98%81%ED%99%94.jpg",
    description:
      '팝콘과 함께 영화 토크 할 찐친 찾습니다! 🔥 영화 다 보고 나서 "아, 이거 누구랑 얘기하지?" 고민했던 적 다들 있죠? 저희 씨네로그와 함께라면, 벅차오르는 감동부터 별별 TMI까지! 감상평은 기본, 인생 토크까지 시간 순삭이에요! 영화 취향 맞는 친구들을 가장 쉽고 재미있게 만날 수 있는 곳, 바로 여기입니다!',
    title: "🍿 씨네로그 🍿 프레쉬",
  },
  "146": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%BB%B4%ED%99%9C%EF%BC%92%EC%A7%81%EC%82%AC.jpg",
    description:
      "이번 겨울에야말로 컴활 준비하시는 분들! 혼자 공부하면 자꾸 미루게 되잖아요. 우리 모임은 각자 개념 공부를 베이스로 하되, 오프라인에서 기출 문제를 같이 풀고 서로 틀린 문제를 피드백해 주는 식으로 운영돼요. 혼자 하면 헷갈릴 부분들을 같이 짚어가면서 6주 안에 확실하게 끝내실 분들을 모집합니다!",
    title: "[겨울 시즌] 컴활 합격 스터디",
  },
  "148": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EB%A7%A4%EC%9A%B4+%EC%9D%8C%EC%8B%9D+-+%EC%A7%81%EC%82%AC%EA%B0%81%ED%98%95+(1).webp",
    description:
      "나는 매운 거 좋아하는데 친구들이 맵찔이라 아쉬웠던 분들 주목! 🌶️ 떡볶이, 마라탕, 불냉면까지 매운맛 도장깨기 하며 스트레스 시원하게 날려봐요! 혼자 먹긴 아쉬웠던 역대급 매운맛, 이젠 찐 고수들끼리 모여서 제대로 즐겨봅시다! 🔥",
    title: "🌶 맵당 🌶 매운 음식 뿌시기🔥",
  },
  "149": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%ED%99%9C%EB%8F%99%EC%84%B1+%EC%A7%81%EC%82%AC.webp",
    description:
      "현실판 어몽어스부터 점핑 배틀까지! 🏃‍♂️ 협동과 경쟁이 오가는 색다른 액티비티로 스트레스를 제대로 날려봐요! 운동 효과와 즐거움을 동시에 잡을 멤버 모집 중!",
    title: "💥 서바이벌 액션: 액티비티 소모임",
  },
  "150": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%9D%8C%EC%95%85+%EC%A7%81%EC%82%AC.webp",
    description:
      "음악을 통해 내 얘기를 꺼내고, 누군가의 곡을 함께 듣는 시간.\n감정과 경험을 플레이리스트로 나누는 소모임, 썰플리!",
    title: "🎵 썰플리 | 음악으로 나누는 내 얘기",
  },
  "152": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%98%81%EC%96%B4+%EC%A7%81%EC%82%AC.webp",
    description:
      "지루한 영어 공부는 STOP! 영어로 수다 떨면서 실력도 같이 올려요! 시간 가는 줄 모르게 재밌게 영어에 익숙해지는 모임입니다. 가벼운 토픽을 읽고 토론하며 부담 없이 말해보세요. 실수해도 괜찮아요! 중요한 건 자신감 있게 말해보는 거고, 그렇게만 해도 실력은 자연스럽게 늘어날 거예요!",
    title: "영어 회화 스터디 | 기사 읽고 토론, 프리토킹까지!",
  },
  "162": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A9%94%EC%9D%B8%EC%BB%A4%EB%B2%84/%EC%95%BC%EA%B5%AC+%EC%A7%81%EC%82%AC%EA%B0%81%ED%98%95.jpg",
    description:
      "야구를 좋아하시거나, 좋아할 예정이시거나, 아님 단순히 야구장이 가보고 싶다 하시는 분들 모두 환영!!!",
    title: "⚾️ 야구 직관 소모임 🍺 ",
  },
  "164": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EA%B2%BD%EC%A0%9C%EC%A7%81%EC%82%AC.jpg",
    description:
      "경제 뉴스 꾸준히 읽는 습관을 만들고, 흥미로운 이슈를 편하게 이야기하는 모임이에요. 딱딱한 스터디가 아닌, 함께 읽으면 훨씬 꾸준히 할 수 있고 재밌는 뉴스 공유 모임입니다! 세상 돌아가는 이야기를 놓치지 않고 싶은 분들, 함께 해요!",
    title: "경제 기사 읽기 소모임",
  },
  "165": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%8A%A4%ED%94%BC%EC%B9%98%EC%A7%81%EC%82%AC.jpg",
    description:
      "내 생각을 정리하고 조리 있게 말해야 하는 순간, 정말 많죠! 면접 자기소개부터 팀플 의견 조율, 발표, 그리고 일상 대화까지... 😅 말 못 해서 아쉬웠던 경험이 있다면 저희와 함께해요! 다양한 상황을 직접 연습하고 피드백하며 함께 성장하는 모임입니다. 🎤",
    title: "Talk & Talk, 어색하지만 말해볼게요",
  },
  "176": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%B1%85+-+%EC%A7%81%EC%82%AC.jpg",
    description:
      "여러분의 책장에는 어떤 책들이 꽂혀 있나요? 🌟 서로의 책장을 함께 넘기며 풍성한 이야기를 만들어가는 따뜻한 독서 모임입니다! 다양한 분야의 책을 접하며 나만의 관점을 키워보고 싶은 분들 모두 환영해요! ✨",
    title: "📚 책 한 권의 온도 📚",
  },
  "216": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%86%A0%EC%9D%B52%EC%A7%81%EC%82%AC.png",
    description:
      "이번 겨울, 토익 하긴 해야 하는데 어떻게 공부할지 고민이신가요? 😅 혼자 책상 앞에 앉으면 오답 정리는 슬쩍 넘어가게 되고, 단어 암기도 금방 지루해지기 마련입니다. 비슷한 목표를 가진 사람들끼리 모여 서로 모르는 걸 가르쳐주고 자극도 받으면서, 이번에야말로 토익 졸업하실 멤버를 모집합니다!🚀",
    title: "[겨울 시즌] 토익 스터디",
  },
  "219": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%B2%84%ED%82%B7+%EC%A7%84%EC%A7%9C+%EC%A7%81%EC%82%AC.webp",
    description:
      "하고 싶었던 건 많은데… 왜 난 아직도 못 했을까?\n혼자선 망설였던 도전들, 이제 마음 맞는 사람들과 함께 해봐요!",
    title: "🎯버킷랩, 함께 이루는 버킷리스트",
  },
  "221": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%A7%9B%ED%83%90.jpg",
    description:
      "맛있게 먹으면 0 칼로리! 같은 음식을 먹어도, 누구랑 먹느냐에 따라 재미가 달라진다고 믿어요! 겨울 동안 같이 맛집 돌 사람 모집중! ",
    title: "제로칼로리",
  },
  "224": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%98%81%ED%99%94.jpg",
    description:
      "영화 보고 수다 떨 사람? 영화로 시작해서 친구로 끝나는 모임, 씨네로그(Cinema + Log)",
    title: "🍿 씨네로그 🍿 스탠다드",
  },
  "230": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%85%8C%EC%9D%B4%EC%8A%A4%ED%8C%85+%EC%A7%81%EC%82%AC.jpg",
    description:
      "인생에서 술이 빠질 수 없지!\n기분 좋은 정도의 취기 속에서 술과 이야기를 함께 나눠요🤗",
    title: "🍸 한 잔의 이야기",
  },
  "231": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84%2B%EB%A9%94%EC%9D%B8%2B%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9D%8C%EC%8B%9D%EC%9D%B5%EC%A7%81%EC%82%AC.jpg",
    description:
      "맛있는 음식을 먹고, 누구한테 자랑하고 싶을 때 있잖아요. 일상 속 그런 순간들을 익명으로 편하게 공유하는 공간입니다!",
    title: "🍔 오늘의 한 끼 🍔",
  },
  "232": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B8%B0%EB%A6%B0%EC%A7%81%EC%82%AC.jpg",
    description:
      "그림을 사랑하는 사람들이 모여 편안하게 소통하는 모임입니다! :) 잘 그려야 한다는 부담은 내려놓으세요! 🎨 실력보다 그리는 과정의 즐거움을 소중히 여기며, 따뜻한 분위기 속에서 나만의 스케치북 한 권을 채워가는 힐링 타임을 함께해요! ✨",
    title: "🎨내가 그린 기린 그림🦒",
  },
  "233": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%A7%81%EC%82%AC.jpg",
    description:
      "프론트엔드 개발자들이 진짜 필요로 하는 공간을 만들었어요. 개발자로서 더 성장하고 싶다는 생각이 들 때, 혼자 코딩하다가 답답할 때, 더 좋은 코드를 짜고, 더 많은 인사이트를 쌓고 싶을 때. 이제는 함께 이야기하고 피드백을 나눌 수 있습니다.",
    title: "프론트엔드 인사이트",
  },
  "234": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%97%B0%EA%B7%B9%EC%A7%81%EC%82%AC.png",
    description:
      "뮤지컬이나 연극 보고 싶은데, 혼자 가긴 살짝 망설여질 때 있잖아요? 그럴 땐 같이 가면 훨씬 재밌어요!\n",
    title: "🎭 뮤지컬 & 연극 관람 소모임",
  },
  "235": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%A7%81%EC%9E%A5%EC%9D%B8%EC%A7%81%EC%82%AC.jpg",
    description:
      "퇴근 벨 울리자마자 집으로 '직행'하기엔 너무 아쉬운 날! 🌙 회사-집 루트를 벗어나 활기찬 에너지를 채워볼 직장인 멤버들을 모집합니다! 맛있는 음식과 술, 그리고 즐거운 대화가 있는 우리만의 아지트로 놀러 오세요! 🥂",
    title: "퇴사하고 싶다",
  },
  "240": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%85%8C%EB%8B%88%EC%8A%A4+%EC%A7%81%EC%82%AC(%EC%B0%90).jpg",
    description:
      "테니스를 통해 즐거움과 활력을 찾는 소모임입니다! 함께 치며 건강한 에너지를 충전해봐요!",
    title: "테니스_소모임🎾🎾",
  },
  "241": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8C%8C%ED%8B%B0%EC%A7%81%EC%82%AC.jpg",
    description:
      "다양한 문화생활, 일일호프, 컨셉 파티 등을 직접 기획하고 실행하는 파티 기획 소모임이에요! 모든 순간을 처음부터 끝까지 우리 손으로 만들어 볼 수 있답니다!",
    title: "About Party Lab 🤩 파티 기획 소모임",
  },
  "242": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%85%EA%B8%B0%EC%A7%81%EC%82%AC.jpg",
    description:
      "일렉·베이스·드럼·피아노 등 어떤 악기든 자유롭게 연습하며 서로 동기부여를 주고받습니다!",
    title: "악기 연습 소모임",
  },
  "243": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%86%8C%EB%B9%84%EC%A7%81%EC%82%AC.jpg",
    description:
      "매주 한 번, 내 소비를 돌아보는 시간!\n작심삼일로 끝나던 가계부, 이번엔 다 같이 꾸준히 써봐요 💰",
    title: "내 월급의 행방불명 (익명)",
  },
  "245": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/pair-cooking-table-kitchen.jpg",
    description:
      "여러분! 요리 좋아하세요? 😍 사실... 레시피대로 안 나오고, 뒷정리는 귀찮고, 혼자 해 먹자니 의욕 안 생기는 게 함정이죠? 🤣",
    title: "🍳 요리조리 🍳 같이 만들고 먹는 찐친 홈쿡!",
  },
  "246": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%82%AC%EC%86%8C%ED%95%9C%EB%8F%85%EC%84%9C%EC%A7%81%EC%82%AC.jpg",
    description:
      "바쁜 일상 속에서 잠깐 쉬어가고 싶을 때, 책 한 권 읽고 조용히 이야기 나누는 시간 어때요?",
    title: "사소한 독서모임",
  },
  "248": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%98%81%EC%83%81%ED%8E%B8%EC%A7%91%EC%A7%81%EC%82%AC.jpg",
    description:
      "영상 제작, 머릿속으로만 생각하고 계셨죠? 편집 프로그램만 깔아두고 첫 편집을 망설였던 분들을 위한 온라인 초보 영상 제작 소모임입니다.",
    title: "초보 영상 제작실",
  },
  "250": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%BD%94%EB%94%A9%EC%A7%81%EC%82%AC.png",
    description:
      "\"내 코드는 왜 안 될까?\" 혼자 고민하며 시간 낭비하지 마세요! 코테는 정답을 맞히는 것만큼이나 '어떻게' 풀었는지가 중요합니다. 저희는 매주 4문제를 풀고 오프라인에서 직접 코드 리뷰를 주고받는 방식으로 운영돼요. 내가 짠 코드의 효율성을 점검받고, 동료들의 풀이를 보면서 시야를 넓히고 싶은 분들께 추천합니다. 12주 동안 함께 달려봐요! 🚀",
    title: "멱살 잡고 코테 졸업",
  },
  "251": {
    image: null,
    description:
      "참여 조건: (02년생~06년생 대학 재학생)\n번개나 모임은 나가고 싶은데 추워서 멀리 가기는 싫고.. 이런 대학생 분들을 위해 위 지역을 위주로 활동하실 분들을 찾습니다! 맛집탐방, 보드게임, 핫플 방문, 술 한잔 등등 어떤 활동이든 괜찮아요!\n정해진 틀 없이 그때그때 하고 싶은 활동을 함께 정하며 부담 없이 즐기는 모임이에요.\n“집에서 너무 멀지만 않으면 나가고 싶다”는 분들, 편하게 들어와 주세욥! ",
    title: "강남, 잠실, 서초 친목 모임",
  },
  "253": {
    image: null,
    description: "독서도 좋고 글쓰기도 좋아요. \n글을 사랑하는 내향인 환영합니다!",
    title: "📕 글이 좋은 내향인들을 위해 📕",
  },
  "254": {
    image: null,
    description:
      "혼자 있으면 괜히 더 우울한 날,\n밥은 먹어야 하는데 혼자는 싫은 날,\n갑자기 가고 싶은 카페나 팝업이 생긴 날.\n“오늘 같이 갈래?” 한마디로 모여\n부담 없이 밥 먹고, 커피 마시고, 걷는 모임이에요.\n가벼운 모임도 좋고 가고 싶은 곳이 생기면 의견도 적극 환영합니다.",
    title: "👀가벼운 친목 소모임👀 갈래? 말래?",
  },
  "255": {
    image:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8A%B8%EB%A0%8C%EB%93%9C%EC%A7%81%EC%82%AC.jpg",
    description:
      "인스타 중독자 환영! 트렌드 릴스나 밈을 보면서 ‘와, 저거 해보고 싶다’ 생각만 하고 넘긴 적 없나요? 혼자 하긴 쑥스럽고, 막상 하려니 귀찮아서 미뤘던 트렌드들! 이제 [TREND LAB]에서 같이 웃으면서 해치워버려요. 🚀",
    title: "[TREND LAB] 유행하는 그거, 같이 할 사람?",
  },
  "256": {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%85%B8%EB%9E%98%EB%B0%A9%EC%A7%81%EC%82%AC.jpg",
    description:
      '"오늘 코노 갈 사람?" 한마디에 편하게 나올 수 있는 분들, 지금 바로 들어오세요! 🎤🔥',
    title: "코노 한 판 🎤 노래방 X 맛집",
  },
  "257": {
    image: null,
    description:
      "기존 방이 인원이 넘쳐나서 새로 개설했습니다.\n야구를 좋아하는 멤버들과 함께 직관하고, 응원하고, 같이 즐기는 모임이에요!",
    title: "야구 직관 동아리⚾️",
  },
};
