import { faThumbTack } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { USER_GUIDE_POP_UP } from "../../constants/keys/localStorage";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../Modals";

function UserGuidePopUp({ setIsModal }: IModal) {
  const onClick = () => {
    setIsModal(false);
    localStorage.setItem(USER_GUIDE_POP_UP, "read");
  };

  const footerOptions: IFooterOptions = {
    main: {
      func: onClick,
    },
  };

  const headerOptions: IHeaderOptions = {
    subTitle: "기본적인 기능은 알고 쓰자!",
  };

  return (
    <ModalLayout
      title="신규회원 가이드"
      headerOptions={headerOptions}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <Item>
        <Category>
          <FontAwesomeIcon icon={faThumbTack} color="var(--color-red)" size="sm" />
          &nbsp;
          <span>스터디</span>
        </Category>
        <Content>
          <li>
            매일 <b>오후 11시</b>에 스터디 결과 발표 !
          </li>
          <li>
            스터디가 열리지 않았더라도, <b>Free 오픈</b> 신청 가능
          </li>
          <li>
            <b>출석체크</b>를 통해 자리나 인상착의 기록
          </li>
          <li>
            인사만 해도, 같이 공부를 해도, 밥을 먹어도 <b>OK</b>
          </li>
        </Content>
      </Item>
      <Item>
        <Category>
          <FontAwesomeIcon icon={faThumbTack} color="var(--color-red)" size="sm" />
          &nbsp;
          <span>참여 규칙</span>
        </Category>
        <Content>
          <li>한 달에 최소 1회 이상 참여 필수 !</li>
          <li>스터디 모임도 하나의 약속입니다 ! 타인 배려 !</li>
        </Content>
      </Item>{" "}
      <Item>
        <Category>
          <FontAwesomeIcon icon={faThumbTack} color="var(--color-red)" size="sm" />
          &nbsp;
          <span>서비스 이용</span>
        </Category>
        <Content>
          <li>
            <b>오른쪽 상단의 동아리 이용가이드 확인하기 !</b>
          </li>
          <li>다양한 컨텐츠가 존재해요! 계속 생겨날 예정!</li>
          <li>건의사항 항상 환영해요! 이용 문의도 관리자에게</li>
          <li>다들 재밌는 활동 해봐요~!</li>
        </Content>
      </Item>
    </ModalLayout>
  );
}

const Item = styled.div`
  margin-bottom: var(--gap-3);
`;

const Category = styled.span`
  > span:last-child {
    color: var(--gray-1);
    font-weight: 600;
    font-size: 14px;
  }
`;

const Content = styled.ul`
  margin-top: var(--gap-1);
  margin-left: var(--gap-5);
`;

export default UserGuidePopUp;
