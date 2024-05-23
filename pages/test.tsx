/* eslint-disable */

import dayjs from "dayjs";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { useGroupBelongMatchMutation, useMonthCalcMutation } from "../hooks/admin/mutation";
import { useAdminStudyRecordQuery } from "../hooks/admin/quries";
import { useImageUploadMutation } from "../hooks/image/mutations";
import { useStudyDailyVoteCntQuery } from "../hooks/study/queries";
import { studyDateStatusState } from "../recoils/studyRecoils";
function Test() {
  const { data } = useAdminStudyRecordQuery(dayjs("2024-04-16"), dayjs("2024-04-30"), null, "인천");
  console.log(data);

  const a = useRecoilValue(studyDateStatusState);

  const AA = "te";
  const BB = "te ";

  const { data: data2 } = useAdminStudyRecordQuery(
    dayjs("2023-12-04"),
    dayjs("2023-12-10"),
    null,
    "동대문",
  );
  // const decodeByAES256 = (encodedTel: string) => {
  //   const bytes = CryptoJS.AES.decrypt(encodedTel, key);
  //   const originalText = bytes.toString(CryptoJS.enc.Utf8);
  //   return originalText;
  // };

  const { data: data3 } = useStudyDailyVoteCntQuery(
    "수원",
    dayjs().subtract(1, "day"),
    dayjs().add(2, "day"),
  );
  console.log(data3);
  const { mutate: match } = useGroupBelongMatchMutation({
    onSuccess(data) {},
  });

  const { mutate } = useMonthCalcMutation({
    onSuccess(data) {},
    onError(err) {
      console.error(err);
    },
  });

  const handleForm = (e) => {
    e.preventDefault();
  };

  const { mutate: A } = useImageUploadMutation({
    onSuccess(data) {},
  });

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage(file);
  };
  const submitForm = () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("path", "hello");

    A(formData);
  };

  return (
    <>
      <Layout></Layout>
    </>
  );
}

const Layout = styled.div`
  margin-top: 200px;
  margin-left: 50px;
  display: flex;
`;

export default Test;
