import { Button, Flex, ModalHeader } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { PROMOTION_WIN_DATE } from "../../constants/settingValue/dateSettingValue";
import { usePromotionQuery } from "../../hooks/sub/promotion/queries";
import { IModal } from "../../types/components/modalTypes";
import { IPromotionApply } from "../../types/models/promotion";
import { IFooterOptions, IHeaderOptions, IPaddingOptions, ModalLayout } from "../Modals";

interface IPromotionAllCoolTimeModal extends IModal {
  promotionData: IPromotionApply[];
}

function PromotionAllCoolTimeModal({ promotionData, setIsModal }: IPromotionAllCoolTimeModal) {
  const { data, isLoading } = usePromotionQuery();
  const applyCnt = data?.filter(
    (item) =>
      dayjs(item.lastDate) > dayjs(PROMOTION_WIN_DATE) &&
      item.uid !== "2259633694" &&
      item.uid !== "2636066822" &&
      item.uid !== "3224546232",
  ).length;

  const footerOptions: IFooterOptions = {
    children: (
      <Flex w="100%" align="center" justifyContent="space-between">
        {!isLoading && (
          <Sum>
            <span>
              홍보 인원: <b>{applyCnt}명</b>,
            </span>
            <span>
              현재 당첨률:
              <b>{applyCnt < 2 ? "100" : Math.round((3 / applyCnt) * 100)}%</b>
            </span>
          </Sum>
        )}
        <Button variant="ghost" color="var(--color-mint)" onClick={() => setIsModal(false)}>
          확인
        </Button>
      </Flex>
    ),
  };

  const headerOptions: IHeaderOptions = {
    children: (
      <ModalHeader display="flex" justifyContent="space-between">
        <Detail>
          <span>전체 홍보 현황</span>
          <Explanation>
            <div>
              <i className="fa-regular fa-thumbs-up" style={{ color: "var(--color-mint)" }} />
              <span>신청 가능</span>
            </div>
            <div>
              <i className="fa-regular fa-clock" style={{ color: "var(--color-red)" }} />
              <span>쿨타임</span>
            </div>
          </Explanation>
        </Detail>
        <div onClick={() => setIsModal(false)}>
          <i className="fa-regular fa-xmark fa-lg" style={{ color: "var(--gray-200)" }} />
        </div>
      </ModalHeader>
    ),
  };

  const paddingOptions: IPaddingOptions = {
    body: {
      top: 0,
      bottom: 0,
    },
    footer: 12,
  };

  return (
    <ModalLayout
      footerOptions={footerOptions}
      headerOptions={headerOptions}
      setIsModal={setIsModal}
      paddingOptions={paddingOptions}
    >
      <Flex h="300px" direction="column" position="relative" overflowY="auto">
        <Container>
          {promotionData?.map((item) => {
            const cool = dayjs(item.lastDate).add(3, "day").diff(dayjs(), "hours");

            return (
              <Item key={item.name}>
                <UniName>
                  {item.name.length <= 6 ? item.name : item.name.slice(0, 5) + "..."}
                </UniName>
                <CoolTime>
                  {cool >= 1 ? (
                    <Cool>
                      <i className="fa-light fa-clock" />
                      {cool >= 24 ? <span>{Math.ceil(cool / 24)}일</span> : <span>{cool}H</span>}
                    </Cool>
                  ) : (
                    <Ok>
                      <i className="fa-light fa-thumbs-up" />
                      <span />
                      <i className="fa-light fa-thumbs-up" />
                      <span />
                      <i className="fa-light fa-thumbs-up" />
                    </Ok>
                  )}
                </CoolTime>
              </Item>
            );
          })}
        </Container>
      </Flex>
    </ModalLayout>
  );
}

const Detail = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-800);
`;

const Explanation = styled.div`
  font-size: 12px;
  display: flex;
  margin-left: var(--gap-1);
  align-items: center;
  > div {
    font-weight: 400;
    margin-left: var(--gap-2);
    > span {
      margin-left: var(--gap-1);
      color: var(--gray-600);
    }
  }
`;

const Container = styled.div`
  border: var(--border-mint);
  border-radius: var(--rounded-lg);
  padding: var(--gap-2);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40%, auto));
  grid-auto-rows: 36px;
  gap: var(--gap-2) var(--gap-3);
  overflow-y: auto;
`;

const Item = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gap-1);
`;

const UniName = styled.div`
  flex: 0.65;
`;

const CoolTime = styled.div`
  flex: 0.35;
`;

const Cool = styled.div`
  padding: 0 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-red);
`;

const Ok = styled.div`
  display: flex;
  color: var(--color-mint);
  align-items: center;
  > span {
    margin: 0 1px;
  }
`;

const Sum = styled.div`
  font-size: 13px;
  margin-left: var(--gap-1);

  > span:first-child {
    margin-right: var(--gap-1);
  }
`;

export const ModalFooterNav = styled.footer`
  display: flex;
  justify-content: space-between;
  margin-top: auto;

  > button {
    font-size: 14px;
    font-weight: 600;
    margin-right: var(--gap-1);
    cursor: pointer;
  }
`;

export default PromotionAllCoolTimeModal;
