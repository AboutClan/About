import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import SectionBar from "../../components/molecules/bars/SectionBar";
import { FRIEND_RECOMMEND_CATEGORY } from "../../constants/contentsText/friend";
import { useFailToast } from "../../hooks/custom/CustomToast";
import { transferMemberDataState } from "../../recoils/transferRecoils";
import { IUser } from "../../types/models/userTypes/userInfoTypes";

interface IMemberRecommend {
  members: IUser[];
}

function MemberRecommend({ members }: IMemberRecommend) {
  const failToast = useFailToast();
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const locationUrl = router.query.location;

  const setTransferMemberData = useSetRecoilState(transferMemberDataState);

  const onClickBtn = (idx: number) => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    setTransferMemberData({ section: "all", members });
    router.push(`/member/${locationUrl}/${idx}`);
  };

  return (
    <>
      <SectionBar title="친구 추천" size="md" />
      <Nav>
        <Button onClick={() => onClickBtn(0)}>
          <i className="fa-solid fa-dragon" style={{ color: "#FF8896" }} />
          <span>{FRIEND_RECOMMEND_CATEGORY[0]}</span>
        </Button>
        <Button onClick={() => onClickBtn(1)}>
          <i className="fa-solid fa-paw" style={{ color: "#71C3FF" }} />
          <span>{FRIEND_RECOMMEND_CATEGORY[1]}</span>
        </Button>
        <Button onClick={() => onClickBtn(2)}>
          <i className="fa-solid fa-cake-candles" style={{ color: "#FEBC5A" }} />
          <span>{FRIEND_RECOMMEND_CATEGORY[2]}</span>
        </Button>
        <Button onClick={() => onClickBtn(3)}>
          <i className="fa-solid fa-dog" style={{ color: "#9E7CFF" }} />
          <span>{FRIEND_RECOMMEND_CATEGORY[3]}</span>
        </Button>
        <Button onClick={() => onClickBtn(4)}>
          <i className="fa-solid fa-shrimp" style={{ color: "var(--color-mint)" }} />
          <span>{FRIEND_RECOMMEND_CATEGORY[4]}</span>
        </Button>
        <Button onClick={() => onClickBtn(5)}>
          <i className="fa-solid fa-cat" />
          <span>{FRIEND_RECOMMEND_CATEGORY[5]}</span>
        </Button>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  background-color: white;
  border-radius: var(--rounded-lg);
  border: var(--border);
  height: 60px;
  margin-bottom: var(--gap-2);
  font-size: 15px;
  text-align: start;
  padding: 0 var(--gap-5);
  > span {
    margin-left: var(--gap-3);
  }
`;

export default MemberRecommend;
