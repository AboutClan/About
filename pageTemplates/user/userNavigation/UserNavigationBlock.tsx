import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import RowTextBlockButton from "../../../components/atoms/buttons/RowTextBlockButton";
import TextDevider from "../../../components/atoms/devider/TextDevider";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { DispatchString } from "../../../types/hooks/reactTypes";
import { UserOverviewModal } from "./UserNavigation";

interface IUserNavigationBlock {
  setModalOpen: DispatchString;
}

type ContentByType<T extends "page" | "modal"> = T extends "page" ? string : UserOverviewModal;

function UserNavigationBlock({ setModalOpen }: IUserNavigationBlock) {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const failToast = useFailToast();
  const couponParams = searchParams.get("coupon");

  const { data: userInfo } = useUserInfoQuery();

  const isGuest = session?.user.name === "guest";
  const isAdmin = userInfo?.role === "previliged";

  useEffect(() => {
    if (couponParams === "on") {
      setModalOpen("coupon");
    }
  }, [couponParams]);

  //네비게이션 함수
  const onClickBlock = <T extends "page" | "modal">(type: T, content: ContentByType<T>): void => {
    console.log(content);
    if (isGuest && (content as UserOverviewModal) !== "logout" && content !== "/faq") {
      failToast("guest");
      return;
    }
    if (type === "page") {
      router.push(content);
    }
    if (type === "modal") {
      setModalOpen(content);
    }
  };

  return (
    <Layout>
      {isAdmin && (
        <div>
          <TextDevider text="관리자" />
          {isAdmin && (
            <>
              <RowTextBlockButton
                text="관리자 페이지"
                onClick={() => onClickBlock("page", "/admin")}
              />
            </>
          )}
        </div>
      )}
      <div>
        <BlockName>계정 설정</BlockName>
        <NavBlock>
          <button onClick={() => onClickBlock("modal", "profile")}>프로필 공개 설정</button>
          <button onClick={() => onClickBlock("modal", "isLocationSharingDenided")}>
            스터디 위치 공개 설정
          </button>
          <button onClick={() => onClickBlock("modal", "mainPlace")}>주 활동 장소 변경</button>
        </NavBlock>
      </div>
      <div>
        <BlockName>프로모션</BlockName>
        <NavBlock>
          <button onClick={() => onClickBlock("modal", "friend")}>친구 초대</button>
          <button onClick={() => onClickBlock("modal", "coupon")}>쿠폰 입력</button>
        </NavBlock>
      </div>
      <div>
        <BlockName>문의 및 요청</BlockName>
        <NavBlock>
          <button onClick={() => onClickBlock("modal", "suggest")}>건의하기</button>
          <button onClick={() => onClickBlock("modal", "declaration")}>불편사항 신고</button>
          <button onClick={() => onClickBlock("modal", "rest")}>
            {userInfo?.role === "resting" ? "휴식 해제" : "휴식 신청"}
          </button>
        </NavBlock>
      </div>
      <div>
        <BlockName>이용 안내</BlockName>
        <NavBlock>
          <button onClick={() => onClickBlock("page", `/faq`)}>자주 묻는 질문</button>
          <button onClick={() => onClickBlock("page", `/user/info/policy`)}>
            서비스 이용 약관
          </button>
          <button onClick={() => onClickBlock("page", `/user/info/privacy`)}>
            개인정보 처리방침
          </button>
        </NavBlock>
      </div>
      <div>
        <BlockName>계정 관리</BlockName>
        <NavBlock>
          <button onClick={() => onClickBlock("modal", "secede")}>회원 탈퇴</button>
          <button onClick={() => onClickBlock("modal", "logout")}>로그아웃</button>
        </NavBlock>
      </div>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--gap-5);
`;

const BlockName = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  background-color: var(--gray-200);
  font-weight: 600;
  display: flex;
  color: var(--gray-600);
`;

const NavBlock = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  > button {
    padding: var(--gap-4) 20px;
    text-align: start;
    border-bottom: var(--border);
  }
`;

export default UserNavigationBlock;
