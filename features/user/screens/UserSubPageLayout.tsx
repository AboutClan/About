import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import { useCheckGuest } from "@/hooks/custom/UserHooks";

/** [내 정보] 하단 메뉴(멤버 평가·소모임·번개·스터디)로 여는 하위 페이지 공통 틀. 게스트는 /user로 돌려보낸다(가입 안내 모달) */
function UserSubPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const isGuest = useCheckGuest();

  useEffect(() => {
    if (!isGuest) return;
    router.replace("/user?guest=on");
  }, [isGuest]);

  return (
    <>
      <Header title={title} url="/user" />
      <Slide isNoPadding>
        {/* /user/* 하위 경로는 Layout이 헤더 여백을 주지 않으므로 고정 헤더 높이만큼 직접 띄운다 */}
        <Box pt="calc(var(--header-h) + 16px)" pb={10} minH="100dvh">
          {isGuest === false && children}
        </Box>
      </Slide>
    </>
  );
}

export default UserSubPageLayout;
