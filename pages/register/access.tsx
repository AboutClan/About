/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box } from "@chakra-ui/react";
import Script from "next/script";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import RegisterAccessHeader from "../../pageTemplates/register/access/RegisterAccessHeader";
import RegisterComparation from "../../pageTemplates/register/access/RegisterComparation";
import RegisterFAQ from "../../pageTemplates/register/access/RegisterFAQ";
import RegisterFee from "../../pageTemplates/register/access/RegisterFee";
import RegisterGatherCount from "../../pageTemplates/register/access/RegisterGatherCount";
import RegisterInvite from "../../pageTemplates/register/access/RegisterInvite";
import RegisterPaymentButton from "../../pageTemplates/register/access/RegisterPaymentButton";
import RegisterReview from "../../pageTemplates/register/access/RegisterReview";
import RegisterSlideImage from "../../pageTemplates/register/access/RegisterSlideImage";

const JQ_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

function Access() {
  const [codeText, setCodeText] = useState("");
  const [discount, setDiscount] = useState(0);

  return (
    <>
      <Script src={JQ_SRC} strategy="afterInteractive" />
      <RegisterAccessHeader />
      <Slide isNoPadding>
        <RegisterGatherCount />
      </Slide>
      <Slide>
        <RegisterComparation />
        <RegisterSlideImage />
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
      <RegisterPaymentButton type="register" value={20000} discount={discount} />
    </>
  );
}

export default Access;
