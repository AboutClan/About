import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ProfileCommentCard from "../../components/molecules/cards/ProfileCommentCard";
import { useUidsToUsersInfoQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { prevPageUrlState } from "../../recoils/navigationRecoils";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

function ProfileFriend() {
  const router = useRouter();

  const { data: userInfo } = useUserInfoQuery();

  const setBeforePage = useSetRecoilState(prevPageUrlState);

  const { data: friends } = useUidsToUsersInfoQuery(userInfo?.friend, {
    enabled: !!userInfo?.friend,
  });

  const onClickUser = (user: IUserSummary) => {
    setBeforePage(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };

  return (
    <>
      <Header title="내 친구 목록" url="/user" />
      <Slide>
        <Box minH="100dvh">
          {friends ? (
            friends?.map((who) => {
              return (
                <Item key={who.uid} onClick={() => onClickUser(who)}>
                  <ProfileCommentCard user={who} comment={who.comment} />
                </Item>
              );
            })
          ) : (
            <MainLoading />
          )}
        </Box>
      </Slide>
    </>
  );
}

const Item = styled.div``;

export default ProfileFriend;
