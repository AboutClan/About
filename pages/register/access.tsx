/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Slide from "@/components/layouts/PageSlide";
import HomeActivityDrawer from "@/components/overlay/HomeActivityDrawer";
import {
  Gender,
  getRegisterGender,
  normalizeGender,
} from "@/features/register/lib/registerGender";
import RegisterAccessHeader from "@/features/register/screens/access/RegisterAccessHeader";
import RegisterComparation from "@/features/register/screens/access/RegisterComparation";
import RegisterFAQ from "@/features/register/screens/access/RegisterFAQ";
import RegisterFee from "@/features/register/screens/access/RegisterFee";
import RegisterGatherCount from "@/features/register/screens/access/RegisterGatherCount";
import RegisterGroup from "@/features/register/screens/access/RegisterGroup";
import RegisterInvite from "@/features/register/screens/access/RegisterInvite";
import RegisterPaymentButton from "@/features/register/screens/access/RegisterPaymentButton";
import RegisterReview from "@/features/register/screens/access/RegisterReview";
import RegisterSlideImage from "@/features/register/screens/access/RegisterSlideImage";
import RegisterSlideImage2 from "@/features/register/screens/access/RegisterSlideImage2";
import { useUserInfoQuery } from "@/features/user/hooks/queries";

const JQ_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

// 아직 가입 절차가 끝나지 않은 유저만 이 페이지에 머무를 수 있음
const NOT_YET_REGISTERED_ROLES = ["guest", "waiting", "newUser", "noMember"];

const BASE_FEE = 20000;
// 남성 회원은 가입비를 5,000원 더 받는다.
const MALE_FEE = BASE_FEE + 5000;

function Access() {
  const router = useRouter();
  const [codeText, setCodeText] = useState("");
  const [discount, setDiscount] = useState(0);

  // HomeInitialSetting이 "waiting"이면 이 페이지로 보내는 것과 동일한 소스(DB, useUserInfoQuery)를
  // 써야 한다. next-auth 세션(JWT)의 role은 승인 직후 즉시 갱신되지 않아 DB 값과 어긋날 수 있고,
  // 그 상태로 서로 다른 role을 기준으로 판단하면 /home ↔ /register/access 무한 리다이렉트가 생길 수 있다.
  const { data: userInfo } = useUserInfoQuery();
  const { data: session } = useSession();

  // 가입 신청서(POST /register)의 성별은 승인(POST /register/approval) 시점에야 유저 문서로
  // 옮겨지는데, 그 승인은 이 화면에서 결제가 끝난 뒤에 일어난다. 즉 지금 GET /user/profile의
  // gender는 비어 있거나 카카오 원본("male"/"female")이라 그대로 비교하면 남성도 기본 금액이
  // 청구된다. 그래서 성별을 고른 시점에 저장해 둔 값을 먼저 보고, 없을 때만 유저 문서를 본다.
  // localStorage는 서버 렌더에서 읽을 수 없어 첫 렌더 후에 채운다(hydration 불일치 방지).
  const [storedGender, setStoredGender] = useState<Gender | null>(null);

  useEffect(() => {
    setStoredGender(getRegisterGender(session?.user?.uid));
  }, [session?.user?.uid]);

  const gender =
    storedGender ??
    normalizeGender(userInfo?.gender) ??
    normalizeGender(userInfo?.kakao_account?.gender);

  const fee = gender === "남성" ? MALE_FEE : BASE_FEE;

  // useEffect(() => {
  //   const role = userInfo?.role;
  //   if (role && !NOT_YET_REGISTERED_ROLES.includes(role)) {
  //     // 이미 가입이 완료된 유저는 결제/가입 화면을 다시 볼 필요가 없음
  //     router.replace("/home");
  //   }
  // }, [userInfo?.role, router]);

  return (
    <>
      <Script src={JQ_SRC} strategy="afterInteractive" />
      <HomeActivityDrawer isNavigationDisabled />
      <RegisterAccessHeader />
      <Slide isNoPadding>
        <RegisterGatherCount />
      </Slide>
      <Slide>
        <RegisterComparation />
        <RegisterSlideImage />
        <RegisterGroup />
        <RegisterSlideImage2 />
        <RegisterFee fee={fee} />
        <RegisterReview isShort={false} />
        <RegisterFAQ />
        <RegisterInvite
          codeText={codeText}
          setCodeText={setCodeText}
          discount={discount}
          setDiscount={setDiscount}
          fee={fee}
        />
        <Box h={20} />
      </Slide>
      <RegisterPaymentButton
        type="register"
        value={fee}
        discount={discount}
        codeText={codeText}
      />
    </>
  );
}

export default Access;
