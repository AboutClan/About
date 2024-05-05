import { StarIcon } from "@chakra-ui/icons";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";

function ScoreSystem() {
  return (
    <>
      <Header title="자주 묻는 질문" url="/user" />
      <Slide>
        <Layout>
          <div>
            <Title>
              <StarIcon boxSize={4} mr="8px" color="var(--color-mint)" />
              점수 및 포인트 흭득 방법
            </Title>
            <Ul>
              <Li>
                스터디 투표
                <b>+ 5점</b>
              </Li>
              <Li>
                당일 참여
                <b>+ 2점</b>
              </Li>
              <Li>
                출석체크
                <b>+ 5점</b>
              </Li>
              <Li>
                건의하기
                <b>+ 3점</b>
              </Li>
              <Li>
                건의 감사 리워드
                <b>+ 10점</b>
              </Li>
              <Li>
                동아리 홍보 리워드
                <b>+ 15점</b>
              </Li>
            </Ul>
          </div>
          <div>
            <Title>
              <StarIcon boxSize={4} mr="8px" color="var(--color-mint)" />
              보증금 패널티
            </Title>
            <Ul>
              <Li>
                스터디 시작시간 이후 참여시간 변경 <b>- 100원</b>
              </Li>
              <Li>
                스터디 지각 <b> - 100원</b>
              </Li>
              <Li>
                스터디 시작시간 이전 당일 불참 <b>- 200원</b>
              </Li>
              <Li>
                스터디 시작시간 이후 당일 불참 <b>- 500원</b>
              </Li>
              <Li>
                스터디 확정 이후 잠수 <b>- 1000원</b>
              </Li>
            </Ul>
          </div>
          <div>
            <Title>
              <StarIcon boxSize={4} mr="8px" color="var(--color-mint)" />
              스터디가 열리기 위한 조건
            </Title>
            <Ul>
              <Li>
                같은 스터디 장소를 기준으로 3명 이상의 인원이 1시간 이상 참여 시간이 겹치는 경우에만
                열립니다.
              </Li>
              <Li>
                그래서 다른 사람들이 투표를 안하면 어떡하지? 라는 걱정없이 먼저 투표해주셔도
                좋습니다!
              </Li>
            </Ul>
          </div>
          <div>
            <Title>
              <StarIcon boxSize={4} mr="8px" color="var(--color-mint)" />
              기타 내용
            </Title>
            <Ul>
              <Li>
                일반 단톡방은 공지방 / 오픈 채팅방은 스터디 투표와 결과 및 간단한 소통을 위한
                방입니다.
              </Li>
              <Li>오프라인 모임은 누구나 열 수 있습니다</Li>
              <Li>
                종교/정치 문제나 이성간의 문제를 포함하여 다른 인원에게 피해나 불쾌감을 주는 행위는
                즉각 추방됩니다. 그런 인원이 있다면, 불편사항 신고 버튼을 통해 신고해주세요! 익명도
                가능합니다.
              </Li>
              <Li>지불된 회비와 벌금은 이벤트 및 서비스 향상을 위해 사용됩니다.</Li>
            </Ul>
          </div>
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  padding: 14px;
  > div {
    margin-bottom: 20px;
  }
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
`;

const Ul = styled.ul`
  padding-left: 18px;
  line-height: 1.8;
  color: var(--gray-2);
`;

const Li = styled.li`
  > b {
    margin-left: 8px;
  }
`;

export default ScoreSystem;
