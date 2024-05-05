/* eslint-disable */

import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { useGroupBelongMatchMutation, useMonthCalcMutation } from "../hooks/admin/mutation";
import { useAdminStudyRecordQuery } from "../hooks/admin/quries";
import { useImageUploadMutation } from "../hooks/image/mutations";
import { studyDateStatusState } from "../recoils/studyRecoils";
function Test() {
  const { data } = useAdminStudyRecordQuery(dayjs("2024-04-01"), dayjs("2024-04-07"), null, "인천");
  console.log(data);

  const a = useRecoilValue(studyDateStatusState);

  const AA = "te";
  const BB = "te ";

  const { data: data2 } = useAdminStudyRecordQuery(
    dayjs("2023-12-04"),
    dayjs("2023-12-10"),
    null,
    "수원",
  );
  // const decodeByAES256 = (encodedTel: string) => {
  //   const bytes = CryptoJS.AES.decrypt(encodedTel, key);
  //   const originalText = bytes.toString(CryptoJS.enc.Utf8);
  //   return originalText;
  // };

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
      <Layout>
        <Box w="72px" h="72px">
          <div
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "0 4px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "white",
                fontWeight: "600",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              테스트테스트테스트
            </div>
            <button
              style={{
                width: "48px",
                height: "48px",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 194, 179, 0.1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00c2b3",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "700",
                  padding: "4px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
                ></div>
              </div>
            </button>
          </div>
        </Box>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin-top: 200px;
  margin-left: 50px;
  display: flex;
`;

export default Test;
