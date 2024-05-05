import {
  faCakeCandles,
  faCat,
  faDog,
  faDragon,
  faPaw,
  faShrimp,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          <FontAwesomeIcon icon={faDragon} color="#FF8896" />
          <span>{FRIEND_RECOMMEND_CATEGORY[0]}</span>
        </Button>
        <Button onClick={() => onClickBtn(1)}>
          <FontAwesomeIcon icon={faPaw} color="#71C3FF" />
          <span>{FRIEND_RECOMMEND_CATEGORY[1]}</span>
        </Button>
        <Button onClick={() => onClickBtn(2)}>
          <FontAwesomeIcon icon={faCakeCandles} color="#FEBC5A" />
          <span>{FRIEND_RECOMMEND_CATEGORY[2]}</span>
        </Button>
        <Button onClick={() => onClickBtn(3)}>
          <FontAwesomeIcon icon={faDog} color="#9E7CFF" />
          <span>{FRIEND_RECOMMEND_CATEGORY[3]}</span>
        </Button>
        <Button onClick={() => onClickBtn(4)}>
          <FontAwesomeIcon icon={faShrimp} color="var(--color-mint)" />
          <span>{FRIEND_RECOMMEND_CATEGORY[4]}</span>
        </Button>
        <Button onClick={() => onClickBtn(5)}>
          <FontAwesomeIcon icon={faCat} />
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
