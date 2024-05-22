import { Button } from "@chakra-ui/react";
import { Step } from "react-joyride";
import styled from "styled-components";

const Title = styled.span`
  font-weight: 700;
`;

const Content = styled.div`
  color: var(--gray-2);
`;

export const STEPS_CONTENTS: Step[] = [
  {
    content: (
      <Content>동아리에서 진행중인 컨텐츠와 웹사이트 기능 설명을 위한 안내 가이드입니다!</Content>
    ),
    title: <Title>웹사이트 이용 가이드</Title>,
    styles: {
      options: {
        width: 320,
      },
    },

    locale: {
      skip: "나중에",
      back: "뒤로",
      close: "닫기",

      next: (
        <Button as="div" colorScheme="mintTheme">
          보여주세요!
        </Button>
      ),
    },

    placement: "center",
    target: "body",
  },

  {
    content: <Content>매일 출석체크, 포인트 가이드, 알림 페이지, 마이페이지가 있어요!</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_header",
  },
  {
    content: <Content>스터디 기록을 확인할 수 있습니다.</Content>,
    styles: {
      options: {
        width: 320,
      },
    },

    locale: {
      back: null,

      skip: null,
      next: (
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_navigation1",
  },
  {
    content: <Content>이벤트와 스토어가 있습니다. 포인트를 모아 상품을 구매해봐요!</Content>,
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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_navigation2",
  },
  {
    content: <Content>동아리원들의 프로필을 확인하고, 친구를 추천받을 수 있습니다.</Content>,
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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_navigation3",
  },
  {
    content: <Content>진행되었던 모임들의 리뷰를 확인할 수 있습니다.</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_navigation4",
  },

  {
    content: (
      <Content>원하는 날짜로 이동할 수 있습니다. 버튼을 누르면 월간 달력 팝업이 나와요!</Content>
    ),

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_calendar_month",
  },
  {
    content: (
      <Content>
        스와이핑을 통해 원하는 날짜로 이동할 수 있습니다. 색상 표시를 통해 현재 참여 인원 정도를 알
        수 있어요!
      </Content>
    ),

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".about_calendar",
  },
  {
    content: (
      <Content>
        원하는 장소와 시간에 스터디 신청을 할 수 있습니다. 매일 오후 11시에 결과 발표!
      </Content>
    ),
    styles: {
      options: {
        width: 320,
      },
    },
    placement: "top",
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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".main_vote_btn",
  },
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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".study_space",
  },
  {
    content: <Content>현재 페이지로 이동합니다.</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".bottom_nav0",
  },
  {
    content: <Content>스터디 랭킹과 내 참여 기록을 확인할 수 있습니다.</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".bottom_nav1",
  },
  {
    content: <Content>모임, 소그룹, 스터디 등 여러 활동을 직접 열 수 있습니다.</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".bottom_nav2",
  },
  {
    content: <Content>번개, 정기모임 등 동아리 내 오프라인 모임에 참여할 수 있습니다.</Content>,

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".bottom_nav3",
  },
  {
    content: (
      <Content>여러 분야의 스터디 및 소모임이 있습니다. 관심있는 모임에 가입해보세요!</Content>
    ),

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
        <Button as="div" colorScheme="mintTheme">
          다음
        </Button>
      ),
    },
    spotlightPadding: 8,
    target: ".bottom_nav4",
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
      back: null,
      skip: null,
      last: (
        <Button as="div" colorScheme="mintTheme">
          확인
        </Button>
      ),
    },

    placement: "center",
    target: "body",
  },
];
