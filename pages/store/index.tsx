import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import RuleIcon from "../../components/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useStoreGiftEntryQuery } from "../../hooks/sub/store/queries";
import RuleModal, { IRuleModalContent } from "../../modals/RuleModal";
import { isPrevBooleanState } from "../../recoils/previousAtoms";
import { transferStoreGiftDataState } from "../../recoils/transferRecoils";
import { STORE_GIFT_ACTIVE, STORE_GIFT_INACTIVE } from "../../storage/Store";
import { IStoreApplicant, IStoreGift } from "../../types/models/store";

export interface IGiftEntry extends IStoreGift {
  users: IStoreApplicant[];
  totalCnt: number;
}
interface IGiftEntries {
  active: IGiftEntry[];
  inactive: IGiftEntry[];
}

const content: IRuleModalContent = {
  headerContent: {
    title: "포인트 스토어",
    text: "동아리 활동을 통해 포인트를 모으고 추첨에 응모해보세요! 다양한 상품이 있습니다 ~!",
  },
  mainContent: [
    {
      title: "포인트는 어떻게 얻나요?",
      texts: [
        "스터디 참여, 출석체크, 이벤트, 건의, 홍보 등 여러 컨텐츠에서 포인트를 흭득할 수 있어요!",
      ],
    },

    {
      title: "상품 당첨과 인원 관련해서 궁금해요.",
      texts: ["트로피의 숫자는 당첨 개수, 왼쪽 숫자는 현재 인원과 최대 응모 가능한 인원이에요!"],
    },
    {
      title: "응모 최대 개수에 제한이 있나요?",
      texts: [
        "네. 상품 당 중복해서 투표할 수 있는 숫자는 유저 개인 등급에 따라 달라집니다. 기본 아메리카노는 1개, 이후 등급이 오를때마다 하나씩 더 추가돼요.",
      ],
    },
  ],
};

function Event() {
  const router = useRouter();
  const errorToast = useErrorToast();
  const [giftEntries, setGiftEntries] = useState<IGiftEntries>();

  const [isLoading, setIsLoading] = useState(true);
  const [isPrevBoolean, setIsPrevBoolean] = useRecoilState(isPrevBooleanState);
  const [isShowActive, setIsShowActive] = useState(isPrevBoolean);
  const [isModal, setIsModal] = useState(false);

  const setTransferStoreGiftData = useSetRecoilState(transferStoreGiftDataState);

  const { data: storeGiftEntries } = useStoreGiftEntryQuery({
    onError: errorToast,
  });

  useEffect(() => {
    setIsPrevBoolean(isShowActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowActive]);

  useEffect(() => {
    if (!storeGiftEntries) return;
    const temp: IGiftEntries = {
      active: STORE_GIFT_ACTIVE.map((gift) => ({
        ...gift,
        users: [],
        totalCnt: 0,
      })),
      inactive: STORE_GIFT_INACTIVE.slice()
        .reverse()
        .map((gift) => ({
          ...gift,
          users: [],
          totalCnt: 0,
        })),
    };
    storeGiftEntries.users.forEach((who) => {
      const giftId = who.giftId;
      const gift =
        temp.active.find((item) => item.giftId === giftId) ||
        temp.inactive.find((item) => item.giftId === giftId);
      if (gift) {
        gift.users.push(who);
        gift.totalCnt += who.cnt;
      }
    });
    setGiftEntries(temp);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeGiftEntries]);

  const giftArr = isShowActive ? giftEntries?.active : giftEntries?.inactive;

  const onClickGift = (item: IGiftEntry) => {
    setTransferStoreGiftData({
      isActive: isShowActive && item.totalCnt < item.max,
      data: item,
    });
    router.push(`/store/${item.giftId}`);
  };

  return (
    <>
      <Header title="포인트 스토어">
        <RuleIcon setIsModal={setIsModal} />
      </Header>
      <Slide>
        <Layout>
          <Nav>
            <Button
              onClick={() => setIsShowActive(true)}
              colorScheme={isShowActive ? "mintTheme" : "gray"}
            >
              현재 상품
            </Button>
            <Button
              onClick={() => setIsShowActive(false)}
              colorScheme={!isShowActive ? "mintTheme" : "gray"}
            >
              지난 상품
            </Button>
          </Nav>
          {!isLoading && (
            <Container>
              {giftArr.map((item, idx) => (
                <Item key={idx} onClick={() => onClickGift(item)}>
                  <Status>
                    <ApplyCnt>
                      <span>{isShowActive ? item.totalCnt : item.max}</span>
                      <span>/{item.max}</span>
                    </ApplyCnt>
                    <Trophy>
                      {new Array(item.winner).fill(0).map((_, idx) => (
                        <div key={idx}>
                          <i
                            className="fa-solid fa-trophy"
                            style={{ color: "var(--color-mint)" }}
                          />
                        </div>
                      ))}
                    </Trophy>
                  </Status>
                  <ImageWrapper>
                    <Image
                      src={item.image}
                      alt="storeGift"
                      priority={idx < 6}
                      width={86.5}
                      height={86.5}
                      style={{ borderRadius: "var(--rounded)" }}
                    />

                    {(!isShowActive || item.max <= item.totalCnt) && <Circle>추첨 완료</Circle>}
                  </ImageWrapper>
                  <Info>
                    <Name>{item.name}</Name>
                    <Point>{item.point} point</Point>
                  </Info>
                  {(!isShowActive || item.max <= item.totalCnt) && <CompletedRapple />}
                </Item>
              ))}
            </Container>
          )}
        </Layout>
      </Slide>
      {isModal && <RuleModal content={content} setIsModal={setIsModal} />}
    </>
  );
}
const Layout = styled.div`
  margin: 0 var(--gap-4);
`;

const Nav = styled.nav`
  margin-top: var(--gap-3);
  display: flex;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  padding: var(--gap-4) 0;
  gap: var(--gap-3);
`;

const Item = styled.button`
  position: relative;

  padding: var(--gap-2);
  background-color: white;
  border: var(--border);

  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--rounded-lg);
`;

const Status = styled.div`
  justify-content: space-between;
  display: flex;
  width: 100%;
  font-size: 14px;
`;

const Trophy = styled.div`
  display: flex;
  margin-left: 4px;
  > div {
    margin-left: 4px;
  }
`;

const ApplyCnt = styled.div`
  color: var(--gray-700);
  font-size: 16px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: var(--rounded-lg);
  overflow: hidden;
`;

const Info = styled.div`
  margin-top: 12px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.span`
  font-weight: 600;
`;

const Point = styled.span`
  color: var(--color-mint);
  font-size: 16px;
`;

const Circle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  border: 2px solid var(--gray-800);
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
const CompletedRapple = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--gray-300);
  opacity: 0.5;
`;

export default Event;
