import { Button } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Step } from "react-joyride";
import styled from "styled-components";

const Title = styled.span`
  font-weight: 700;
`;

const Content = styled.div`
  color: var(--gray-2);
`;

function BackButton({ children }: PropsWithChildren) {
  return <Button variant="outline">{children}</Button>;
}

function NextButton({ children }: PropsWithChildren) {
  return <Button>{children}</Button>;
}

export const STEPS_CONTENTS: Step[] = [
  {
    content: (
      <Content>동아리에서 진행중인 컨텐츠와 웹사이트 기능 설명을 위한 안내 가이드입니다!</Content>
    ),
    title: <Title>웹사이트 이용 가이드</Title>,
    locale: {
      skip: "나중에",
      close: "닫기",

      next: <NextButton>보여주세요!</NextButton>,
    },

    placement: "center",
    target: "body",
  },
  // 헤더의 아이콘
  {
    content: <Content>매일 출석체크, 알림 페이지가 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='about_header']",
  },
  // 랭킹
  {
    content: <Content>스터디 랭킹을 확인할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='랭킹']",
  },
  // 스토어
  {
    content: (
      <Content>
        커피, 아이스크림 등의 상품을 구매할 수 있어요. 포인트를 모아 상품을 구매해봐요!
      </Content>
    ),
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='스토어']",
  },
  // 캘린더
  {
    content: <Content>동아리 공식 행사, 이벤트를 확인해보세요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='캘린더']",
  },
  // 익명 게시판
  {
    content: <Content>익명 게시판에서 관심있는 주제로 동아리원과 소통해보세요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='게시판']",
  },
  // 디스코드
  {
    content: <Content>About 공식 디스코드 채널에 가입할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='디스코드']",
  },

  // 소셜링 섹션
  {
    content: <Content>동아리원들과의 번개 모임에 참여할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='gather-section']",
  },

  // 라운지 섹션
  {
    content: <Content>동아리 모임 관련 리뷰를 확인할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='lounge-section']",
  },

  // 오프라인 소모임 섹션
  {
    content: <Content>동아리에서 열리는 오프라인 모임에 참여해보세요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='offline-group-section']",
  },
  // 온라인 소모임 섹션
  {
    content: <Content>오프라인 모임 외 온라인 모임에 참여할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='online-group-section']",
  },
  // 신규 소모임 섹션
  {
    content: <Content>최근에 열린 소모임 활동에 참여해보세요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='new-group-section']",
  },
  // 오픈 예정 소모임 섹션
  {
    content: <Content>곧 열릴 소모임 활동을 확인해보세요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='opened-group-section']",
  },

  // Bottom nav: 홈
  {
    content: <Content>About 메인 홈으로 이동할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='홈']",
  },
  // Bottom nav: 스터디
  {
    content: <Content>원하는 장소와 시간에서 함께 스터디 활동을 신청해요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='스터디']",
  },
  // Bottom nav: 소셜링
  {
    content: <Content>About 메인 홈으로 이동할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='소셜링']",
  },
  // Bottom nav: 소모임
  {
    content: <Content>About 메인 홈으로 이동할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='소모임']",
  },
  // Bottom nav: 내 정보
  {
    content: <Content>About 메인 홈으로 이동할 수 있어요!</Content>,
    locale: {
      back: <BackButton>뒤로</BackButton>,
      next: <NextButton>다음</NextButton>,
    },
    target: "[data-joyride-step='내 정보']",
  },
  {
    content: (
      <Content>
        추가적으로 궁금한 내용은 마이페이지의 &lsquo;자주 묻는 질문&rsquo;을 확인해주세요!
      </Content>
    ),
    title: <Title>환영해요!</Title>,
    styles: {
      options: {
        width: 320,
      },
    },

    locale: {
      back: <BackButton>뒤로</BackButton>,
      skip: null,
      last: <NextButton>확인</NextButton>,
    },

    placement: "center",
    target: "body",
  },
];

export const STEPS_FAVORITES_CONTENTS: Step[] = [
  {
    content: (
      <Content>
        스터디 상세 정보와 참여자를 알 수 있습니다. 좌우 스와이프로 날짜 이동도 가능!
      </Content>
    ),
    placement: "top",
    styles: {
      options: {
        width: 320,
      },
    },
    locale: {
      back: (
        <Button
          as="div"
          color="var(--color-mint)"
          borderColor="var(--color-mint)"
          variant="outline"
        >
          뒤로
        </Button>
      ),
      close: "닫기",
      skip: null,
      next: (
        <Button as="div" colorScheme="mint">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".vote_favorite",
  },
];
