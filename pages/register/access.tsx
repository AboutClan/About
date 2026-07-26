/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeActivityDrawer from "../../components/overlay/HomeActivityDrawer";
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

function Access() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [codeText, setCodeText] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    const role = session?.user?.role;
    if (role && !NOT_YET_REGISTERED_ROLES.includes(role)) {
      // 이미 가입이 완료된 유저는 결제/가입 화면을 다시 볼 필요가 없음
      router.replace("/home");
    }
  }, [session, status, router]);

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
        <RegisterFee />
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
        value={20000}
        discount={discount}
        codeText={codeText}
      />
    </>
  );
}

export default Access;
