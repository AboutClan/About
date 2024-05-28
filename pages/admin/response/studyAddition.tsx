import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyStatusMutation } from "../../../hooks/study/mutations";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";

function StudyAddition() {
  const toast = useToast();
  const { data: session } = useSession();
  const { data: requestData, isLoading } = useUserRequestQuery("장소 추가");

  const { data: placeData } = useStudyPlacesQuery("all", "inactive");

  const mergedData =
    requestData &&
    placeData &&
    requestData
      .map((data) => {
        const findItem = placeData?.find((place) => place.fullname === data.title);
        if (findItem) {
          return { ...data, id: findItem._id };
        }
      })
      .filter((obj) => obj);

  const { mutate } = useStudyStatusMutation({
    onSuccess() {
      toast("success", "추가되었습니다.");
    },
  });

  const onClick = (placeId: string) => {
    if (session?.user.uid !== "2259633694") {
      toast("warning", "권한이 없습니다.");
      return;
    }
    mutate({ placeId, status: "active" });
  };

  return (
    <>
      <Header title="스터디 장소 추가 요청" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          {mergedData
            ?.slice()
            .reverse()
            .map((item, idx) => (
              <Item key={idx}>
                <Wrapper>
                  <ItemHeader>
                    <span>
                      {item.writer || "익명"}({item.location})
                    </span>
                    <span>{dayjs(item.updatedAt).format("M월 D일 H시 m분")}</span>
                  </ItemHeader>
                  <Box>장소: {item.title}</Box>
                  <Content>{item.content}</Content>
                </Wrapper>
                <Button mx="20px" onClick={() => onClick(item.id)} colorScheme="mintTheme">
                  승인
                </Button>
              </Item>
            ))}
        </Layout>
      )}
    </>
  );
}

const Layout = styled.div``;

const Item = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: 6px solid var(--gray-300);
  padding: 16px 0;
`;
const Wrapper = styled.div`
  padding: 0 16px;
`;
const ItemHeader = styled.header`
  min-height: 30px;
  display: flex;

  flex: 1;
  margin-top: var(--gap-2);

  color: var(--gray-700);

  span {
    font-size: 12px;
    color: var(--gray-600);
    margin-right: 8px;
  }
`;

const Content = styled.div`
  padding: var(--gap-2) 0;
  color: var(--gray-700);
  font-size: 13px;
  display: flex;
  align-items: center;
`;

export default StudyAddition;
