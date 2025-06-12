/* eslint-disable */

import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../../../components/atoms/Avatar";
import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import { useAdminPointMutation } from "../../../hooks/admin/mutation";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { useChatMutation } from "../../../hooks/chat/mutations";
import { ModalLayout } from "../../../modals/Modals";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

function AdminRegister() {
  const [isRefetch, setIsRefetch] = useState(false);
  const [toUid, setToUid] = useState("");
  const [modalType, setModalType] = useState<"point" | "cash">(null);

  const [pointValue, setPointValue] = useState<string>("");

  const { data, refetch } = useUserRequestQuery("지원금");

  const findUserId = data?.find((who) => who.writer.uid === toUid)?.writer._id;

  const { mutate } = useChatMutation(findUserId);

  const { mutate: updatePoint } = useAdminPointMutation(toUid);

  useEffect(() => {
    if (isRefetch)
      setTimeout(() => {
        refetch();
      }, 1000);
    setIsRefetch(false);
  }, [isRefetch, refetch]);

  const handleClick = (type: "point" | "cash") => {
    console.log(type, 22, toUid, pointValue);

    const message =
      type === "point"
        ? `모임 개설 지원금으로 ${pointValue} Point가 적립되었습니다.`
        : `모임 개설 지원금으로 ${pointValue}원이 계좌 입금되었습니다.`;
    if (type === "point") {
      updatePoint({ message, value: +pointValue });
    }
    mutate({ message });
  };

  return (
    <>
      <Header title="가입 신청 확인" url="/admin" />
      <Layout>
        {/* <AdminLocationSelector
          initialData={applyData}
          setRequestData={setRegisterData}
          type="register"
        /> */}
        <Main>
          {data?.map((data, idx) => {
            const splitData = data.content.split("/");

            return (
              <Flex flexDir="column" py={2}>
                <Flex key={idx} justify="space-between" align="center">
                  <Flex flexDir="column" align="center">
                    <Avatar user={data.writer} size="md1" />
                    <Box fontWeight={600}>{data.writer.name}</Box>
                    <Box fontSize="11px">{dayjsToFormat(dayjs(data.updatedAt), "M/DD 신청")}</Box>
                  </Flex>
                  <Box fontSize="12px" mx={3} as="p" flex={1}>
                    {splitData}
                  </Box>
                  <Flex>
                    <Button
                      color="white"
                      backgroundColor="var(--color-mint)"
                      size="sm"
                      mr={1}
                      onClick={() => {
                        setToUid(data.writer.uid);
                        setModalType("point");
                      }}
                    >
                      포인트 입금
                    </Button>
                    <Button
                      color="white"
                      backgroundColor="var(--color-mint)"
                      size="sm"
                      onClick={() => {
                        setToUid(data.writer.uid);
                        setModalType("cash");
                      }}
                    >
                      계좌 입금
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        </Main>
      </Layout>
      {modalType && (
        <ModalLayout
          title="정산"
          footerOptions={{
            main: { text: "완료", func: () => handleClick(modalType) },
            sub: { text: "취소", func: () => setModalType(null) },
          }}
          setIsModal={() => setModalType(null)}
        >
          정산을 완료하시겠어요?
          <Input
            mt={3}
            placeholder="금액 입력"
            onChange={(e) => setPointValue(e.target.value)}
            value={pointValue}
          />
        </ModalLayout>
      )}
    </>
  );
}

const Layout = styled.div`
  padding: 14px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  > div:first-child {
    border-top: 1px solid var(--gray-400);
  }
`;

export default AdminRegister;
