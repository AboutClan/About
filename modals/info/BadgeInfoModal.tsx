import { Badge, useTheme } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { ModalXXL } from "../../styles/LayoutStyles";

export default function BadgeInfoModal({
  setIsModal,
}: {
  setIsModal: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [isFirst, setIsFirst] = useState(true);
  return (
    <Layout>
      {isFirst ? (
        <>
          <Header>
            <span>멤버 배지</span>
            <div>
              멤버 등급은 기본적으로는 7가지로 나뉩니다. <br />
              흭득한 배지는 원하는 종류로 선택해서 사용할 수 있습니다.
              <br />
              간혹 7가지 종류에 없는 유니크한 배지도 흭득할 수 있습니다.
            </div>
          </Header>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle">
                아메리카노
              </Badge>
            </div>
            <Info>0점 ~ 29점</Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="orange">
                라떼
              </Badge>
            </div>
            <Info>30점 ~ 69점 </Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="green">
                마키아토
              </Badge>
            </div>
            <Info>70점 ~ 119점</Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="purple">
                에스프레소
              </Badge>
            </div>
            <Info>120점 ~ 179점</Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="yellow">
                모카
              </Badge>
            </div>
            <Info>180점 ~ 249점</Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="twitter">
                콜드브루
              </Badge>
            </div>
            <Info>250점 ~ 329점</Info>
          </Item>
          <Item>
            <div>
              <Badge fontSize={12} variant="subtle" colorScheme="teal">
                아인슈페너
              </Badge>
            </div>
            <Info>330점 +</Info>
          </Item>
          <Footer onClick={() => setIsFirst(false)}>
            <button>다음 페이지</button>
          </Footer>
        </>
      ) : (
        <>
          <Header>
            <span>점수 관련</span>
            <div style={{ fontSize: "13px" }}>
              동아리 점수는 다양한 방식으로 얻을 수 있습니다!
            </div>
          </Header>
          <RuleMain>
            <RuleHeader>
              <span>내용</span>
              <span>점수</span>
            </RuleHeader>
            <RuleItem>
              <span>스터디 투표</span>
              <span>+ 5점</span>
            </RuleItem>
            <RuleItem>
              <span>스터디 참여</span>
              <span>+ 5점</span>
            </RuleItem>
            <RuleItem>
              <span>번개 참여</span>
              <span>+ 5점</span>
            </RuleItem>
            <RuleItem>
              <span>번개 개최</span>
              <span>+ 5점</span>
            </RuleItem>{" "}
            <RuleItem>
              <span>건의</span>
              <span>+ 2점</span>
            </RuleItem>
            <RuleItem>
              <span>추가 예정</span>
              <span>+ ?</span>
            </RuleItem>{" "}
            <br />
            <RuleItem style={{ borderTop: "1px solid var(--font-h6)" }}>
              <span>스터디 지각</span>
              <span>- 2점</span>
            </RuleItem>{" "}
            <RuleItem>
              <span>당일 불참</span>
              <span>- 10점</span>
            </RuleItem>
            <RuleItem>
              <span>한 달 참여 미달</span>
              <span>- 10점</span>
            </RuleItem>
          </RuleMain>{" "}
          <Footer onClick={() => setIsModal(false)}>
            <button>확인했어요!</button>
          </Footer>
        </>
      )}
    </Layout>
  );
}

const Layout = styled(ModalXXL)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 16px 0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid var(--font-h5);
  width: 100%;
  padding-bottom: 16px;
  > span:first-child {
    font-size: 20px;
    font-weight: 600;
  }
  > div {
    margin-top: 10px;
    font-size: 12px;
    color: var(--font-h1);
    text-align: center;
  }
`;
const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 100%;
  align-items: center;
  padding: 0 16px;

  border-bottom: 1px solid var(--font-h5);

  > div {
    width: 40%;
    text-align: center;
  }
`;

const Info = styled.span`
  display: inline-block;
  font-size: 12px;
  width: 200px;
  text-align: center;
`;

const Footer = styled.footer`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  > button {
    width: 100px;
    font-size: 16px;
    height: 26px;
    background-color: var(--color-red);
    color: white;
    border-radius: 10px;
  }
`;

const RuleItem = styled.div`
  width: 100%;
  padding: 0 18px 0 14px;
  display: flex;
  border-bottom: 1px solid var(--font-h6);
  > span {
    display: inline-block;
    font-size: 13px;
    flex: 1;
    text-align: center;
    padding: 4px 0;
  }
`;

const RuleMain = styled.main`
  height: 100%;
  width: 100%;
`;

const RuleHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: var(--font-h7);

  align-items: center;
  padding: 0 16px;

  border-bottom: 1px solid var(--font-h5);
  font-size: 14px;
  font-weight: 600;
  > div {
    width: 60%;
    text-align: center;
  }
`;
