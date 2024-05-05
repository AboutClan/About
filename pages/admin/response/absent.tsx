import { Button } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import CheckAbsentModal from "../../../modals/admin/CheckAbsentModal";
import ModalPortal from "../../../modals/ModalPortal";

function AdminAbsent() {
  const { data: suggestData, isLoading } = useUserRequestQuery("불참");

  const [isModal, setIsModal] = useState(false);
  const [userFee, setUserFee] = useState<{ fee: number; uid: string }>();

  const onClick = (uid: string, fee: number) => {
    setUserFee({ uid, fee });
    setIsModal(true);
  };

  return (
    <>
      <Header title="당일불참 확인" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          {suggestData
            ?.slice()
            .reverse()
            .map((item, idx) => {
              const [uid, fee] = item.title.split("D");

              return (
                <Item key={idx}>
                  <ItemHeader>
                    <div>
                      <span>{item.writer || "익명"}</span>
                      <span>2022-08-14</span>
                    </div>
                    <Content>{item.content}</Content>
                  </ItemHeader>
                  <Fee>{fee}</Fee>
                  <ButtonNav>
                    <Button
                      ml="auto"
                      size="sm"
                      colorScheme="mintTheme"
                      onClick={() => onClick(uid, +fee)}
                    >
                      인정
                    </Button>
                  </ButtonNav>
                </Item>
              );
            })}
        </Layout>
      )}
      {isModal && (
        <ModalPortal setIsModal={setIsModal}>
          <CheckAbsentModal uid={userFee.uid} fee={userFee.fee} setIsModal={setIsModal} />
        </ModalPortal>
      )}
    </>
  );
}

const Layout = styled.div``;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 6px solid var(--gray-6);
  padding: var(--gap-4);
`;

const ItemHeader = styled.header`
  min-height: 30px;
  display: flex;
  flex-direction: column;

  font-size: 13px;
  > div {
    span {
      margin-right: var(--gap-2);
      color: var(--gray-1);
    }
    > span:last-child {
      font-size: 12px;
      color: var(--gray-3);
    }
  }
`;

const Fee = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-red);
  text-align: center;
`;

const ButtonNav = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding-top: 8px;
  color: var(--gray-2);
  font-size: 13px;
  min-height: 20px;
`;

export default AdminAbsent;
