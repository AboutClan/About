import "dayjs/locale/ko";

import { Box, Flex, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { GATHER_COVER_IMAGE_ARR } from "@/assets/gather";
import Divider from "@/components/atoms/Divider";
import { MainLoading } from "@/components/atoms/loaders/MainLoading";
import Slide from "@/components/layouts/PageSlide";
import BottomButtonNav from "@/components/molecules/BottomButtonNav";
import { ABOUT_ORIGIN } from "@/constants/seo";
import { SERVER_URI } from "@/constants/system";
import { useGatherWaitingMutation } from "@/features/gather/hooks/mutations";
import { useGatherIDQuery } from "@/features/gather/hooks/queries";
import GatherContent from "@/features/gather/screens/detail/GatherContent";
import GatherDetailInfo from "@/features/gather/screens/detail/GatherDetail";
import GatherParticipation from "@/features/gather/screens/detail/GatherParticipation";
import GatherTitle from "@/features/gather/screens/detail/GatherTitle";
import RegularGatherApplicants from "@/features/gather/screens/detail/RegularGatherApplicants";
import RegularGatherConfirmedList from "@/features/gather/screens/detail/RegularGatherConfirmedList";
import RegularGatherSchedule from "@/features/gather/screens/detail/RegularGatherSchedule";
import { getRandomImage } from "@/utils/imageUtils";
import { navigateExternalLink } from "@/utils/navigateUtils";

/**
 * 카카오톡 등 공유 미리보기(OG)를 모임 기준으로 만든다. 번개 API는 로그인이 필요해서
 * 로그인 없이 부를 수 있는 GET /gather/og(구글폼 있는 공개 모임만)를 쓰고, _document가 pageProps.og를 쓴다.
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${SERVER_URI}/gather/og?gatherId=${encodeURIComponent(id)}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return { props: {} };
    const data: { title?: string; description?: string; image?: string | null } = await res.json();
    return {
      props: {
        og: {
          title: data.title || "어바웃 모임",
          description: data.description || "어바웃 모임에 참여해 보세요!",
          url: `${ABOUT_ORIGIN}/gather/${id}/p`,
          ...(data.image ? { image: data.image } : {}),
        },
      },
    };
  } catch {
    // OG를 못 받아도 페이지는 열려야 한다(경로 기본 OG 사용)
    return { props: {} };
  }
};

/** 실시간 참여 현황: 페이지를 열어 둔 동안 이 간격으로 다시 불러온다 */
const REFRESH_INTERVAL_MS = 30 * 1000;

/**
 * 누구나 볼 수 있는 모임 단독 공개 페이지(/gather/[id]/p). 구글폼이 있는 모임만 공개한다.
 * - 헤더·하단 메뉴가 없고, 다른 어바웃 페이지로 이동하는 경로를 모두 막는다
 *   (아바타 → "참여자끼리만" 토스트, 확정된 모임 카드 링크 없음, 댓글·소모임 카드·단톡방 숨김)
 * - 실명은 운영진·모임장이어도 보여 주지 않는다
 * - 신청은 구글폼으로 받는다(회원 로그인은 그대로 둔다. 비로그인은 Layout이 게스트로 접속시킨다).
 *   로그인한 회원이면 상세 페이지처럼 신청 기록을 남겨, 서버가 폼 응답과 짝지어 명단에 프로필을 붙이게 한다.
 */
function GatherPublicPage() {
  const { id } = useParams<{ id: string }>() || {};
  const { data: session } = useSession();
  const isMember = !!session?.user?.uid && session.user.role !== "guest";
  const { mutate: recordApply } = useGatherWaitingMutation(+id);

  const { data: gather, isError } = useGatherIDQuery(+id, {
    enabled: !!id,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  // 커버가 없는 모임은 랜덤 커버를 한 번만 골라 30초 갱신마다 바뀌지 않게 한다
  const fallbackCover = useMemo(() => getRandomImage(GATHER_COVER_IMAGE_ARR["공통"]), []);

  // 이미 받은 데이터가 있으면 백그라운드 갱신이 실패해도 그대로 보여 준다
  if (isError && !gather) return <PublicNotice text="모임 정보를 불러올 수 없어요." />;
  if (!gather) return <MainLoading />;
  if (!gather.googleFormUrl) return <PublicNotice text="공개되지 않은 모임이에요." />;

  const isRegularGather = gather.category === "regularGather";
  const isOpenGather = gather.category === "openGather";
  const isOfficialGather = gather.category === "officialGather";
  const isClosed = gather.status === "close" || gather.status === "end";

  return (
    <>
      <Slide isNoPadding>
        <Box position="relative" width="100%">
          <Image
            src={gather.coverImage || fallbackCover}
            width={0}
            height={0}
            sizes="100vw"
            alt="cover"
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
        <Box paddingBottom="40px">
          <GatherTitle
            type={gather.category}
            title={gather.title}
            category={gather.type.title}
            age={gather.age}
            isFree={!gather.isApprovalRequired}
            isGroupGather={false}
            isOpenGather={isOpenGather}
            isRegularGather={isRegularGather}
          />
          {isRegularGather ? (
            <RegularGatherSchedule data={gather} />
          ) : (
            <GatherDetailInfo data={gather} isMember={false} isOpenGather={isOpenGather} isPublic />
          )}
          <GatherContent
            content={gather.content}
            postImage={gather.postImage}
            location={gather.location}
            isOpenGather={isOpenGather}
            isOfficialGather={isOfficialGather}
            isRegularGather={isRegularGather}
            date={gather.date}
          />
          <Divider />
          {isRegularGather ? (
            <>
              <RegularGatherApplicants data={gather} isPublic />
              <RegularGatherConfirmedList gatherId={gather.id} isPublic />
            </>
          ) : (
            <GatherParticipation data={gather} gatherType={gather.category} isPublic />
          )}
        </Box>
      </Slide>
      <BottomButtonNav
        text={isClosed ? "종료된 모임이에요" : "구글폼으로 신청하기"}
        handleClick={() => {
          if (isClosed) return;
          if (isMember) recordApply({ phase: "first" });
          navigateExternalLink(gather.googleFormUrl);
        }}
        isReverse={isClosed}
        colorScheme={isClosed ? "black" : "mint"}
        hasHeart={false}
      />
    </>
  );
}

function PublicNotice({ text }: { text: string }) {
  return (
    <Flex h="100dvh" align="center" justify="center" px={5}>
      <Text fontSize="15px" color="gray.600" textAlign="center">
        {text}
      </Text>
    </Flex>
  );
}

export default GatherPublicPage;
