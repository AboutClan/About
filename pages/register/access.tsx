/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeActivityDrawer from "../../components/overlay/HomeActivityDrawer";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RegisterAccessHeader from "../../pageTemplates/register/access/RegisterAccessHeader";
import RegisterComparation from "../../pageTemplates/register/access/RegisterComparation";
import RegisterFAQ from "../../pageTemplates/register/access/RegisterFAQ";
import RegisterFee from "../../pageTemplates/register/access/RegisterFee";
import RegisterGatherCount from "../../pageTemplates/register/access/RegisterGatherCount";
import RegisterGroup from "../../pageTemplates/register/access/RegisterGroup";
import RegisterInvite from "../../pageTemplates/register/access/RegisterInvite";
import RegisterPaymentButton from "../../pageTemplates/register/access/RegisterPaymentButton";
import RegisterReview from "../../pageTemplates/register/access/RegisterReview";
import RegisterSlideImage from "../../pageTemplates/register/access/RegisterSlideImage";
import RegisterSlideImage2 from "../../pageTemplates/register/access/RegisterSlideImage2";

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

  const fee = userInfo?.gender === "남성" ? MALE_FEE : BASE_FEE;

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
