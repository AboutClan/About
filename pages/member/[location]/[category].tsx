import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { FRIEND_RECOMMEND_CATEGORY } from "../../../constants/contentsText/friend";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { prevPageUrlState } from "../../../recoils/previousAtoms";
import {
  transferMemberDataState,
  transferUserSummaryState,
} from "../../../recoils/transferRecoils";
import { IUser, IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge, birthToDayjs } from "../../../utils/convertUtils/convertTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

function FriendCategory() {
  const router = useRouter();

  const idx = Number(router.query?.category);

  const membersData = useRecoilValue(transferMemberDataState);
  const setBeforePage = useSetRecoilState(prevPageUrlState);
  const setUserData = useSetRecoilState(transferUserSummaryState);

  const [filterMember, setFilterMember] = useState<IUser[]>([]);

  const { data: userInfo, isLoading } = useUserInfoQuery();

  const members = membersData?.members;

  useEffect(() => {
    if (isLoading || !members) return;

    const filtered = members.filter((who) => {
      switch (idx) {
        case 0:
          return birthToAge(who.birth) === birthToAge(userInfo.birth);
        case 1:
          return who.mbti === userInfo.mbti;
        case 2: {
          const birthDayjs = birthToDayjs(who.birth);
          return birthDayjs.month() === dayjs().month();
        }
        case 3:
          return who?.majors && who?.majors[0]?.department === userInfo?.majors[0]?.department;
      }
    });
    setFilterMember(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onClickProfile = (user: IUserSummary) => {
    setUserData(user);
    setBeforePage(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };

  return (
    <>
      <Header title={FRIEND_RECOMMEND_CATEGORY[idx]} />
      <Slide>
        <Layout>
          {filterMember?.map((who) => (
            <Item key={who.uid} onClick={() => onClickProfile(who)}>
              <ProfileHeader>
                <Avatar image={who.profileImage} avatar={who.avatar} uid={who.uid} size="md" />
                <span>{who.name}</span>
              </ProfileHeader>
              <Info>
                <Detail>
                  <span>나이</span>
                  <span>{birthToAge(who.birth)}</span>
                  {idx === 2 && (
                    <Birthday>/ {dayjsToFormat(birthToDayjs(who.birth), "M월 D일")}</Birthday>
                  )}
                </Detail>
                <Detail>
                  <span>성별</span>
                  <span>{who?.gender.slice(0, 1)}</span>
                </Detail>
                <Detail>
                  <span>MBTI</span>
                  <span>{who?.mbti || "미작성"}</span>
                </Detail>
                <Detail>
                  <span>전공</span>
                  <span>{who?.majors ? who?.majors[0]?.detail : "미작성"}</span>
                </Detail>
              </Info>
            </Item>
          ))}
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  padding: var(--gap-3) 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-2);
`;

const Item = styled.div`
  border: var(--border);
  border-radius: var(--rounded-lg);
  padding: var(--gap-2);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  > span {
    font-weight: 600;
    margin-left: var(--gap-4);
    font-size: 15px;
  }
`;

const Info = styled.div`
  margin-top: var(--gap-3);
  display: flex;
  flex-direction: column;
  line-height: 2.2;
  padding-left: var(--gap-1);
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    display: inline-block;
    width: 50px;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-3);
  }
  > span:last-child {
    color: var(--gray-1);
    font-size: 13px;
  }
`;

const Birthday = styled.span`
  margin-left: var(--gap-1);
  font-weight: 600;
  color: var(--gray-1);
`;

export default FriendCategory;
