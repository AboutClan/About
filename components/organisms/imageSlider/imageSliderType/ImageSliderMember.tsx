import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { prevPageUrlState } from "../../../../recoils/previousAtoms";
import { transferUserSummaryState } from "../../../../recoils/transferRecoils";
import { IUser, IUserSummary } from "../../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../../utils/dateTimeUtils";
import Avatar from "../../../atoms/Avatar";
import HeartLikeIcon from "../../../atoms/Icons/HeartLikeIcon";
import { ImageContainer } from "../ImageSlider";

interface IImageSliderMember {
  imageContainer: ImageContainer;
}

function ImageSliderMember({ imageContainer }: IImageSliderMember) {
  const router = useRouter();
  const setBeforePage = useSetRecoilState(prevPageUrlState);
  const setUserData = useSetRecoilState(transferUserSummaryState);

  const onClickUser = (user: IUserSummary) => {
    setUserData(user);
    router.push(`/profile/${user.uid}`);
    setBeforePage(router?.asPath);
  };

  const today = dayjsToFormat(dayjs(), "MMDD");
  const isBirth = imageContainer.length && (imageContainer[0] as IUser).birth.slice(2) === today;

  return (
    <Swiper
      navigation
      style={{
        width: "100%",
        height: "auto",
      }}
      slidesPerView={9.5}
    >
      {(imageContainer as IUserSummary[]).map((user, index) => {
        return (
          <SwiperSlide key={index}>
            <MemberItem>
              <ProfileWrapper onClick={() => onClickUser(user)}>
                <Avatar image={user.profileImage} avatar={user.avatar} uid={user.uid} size="sm" />
              </ProfileWrapper>
              <span>{user?.name}</span>
              {isBirth && (
                <HeartWrapper>
                  <HeartLikeIcon toUid={user.uid} />
                </HeartWrapper>
              )}
            </MemberItem>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

const MemberItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > span {
    display: inline-block;
    margin-top: var(--gap-1);
    font-size: 10px;
  }
`;

const ProfileWrapper = styled.div``;

const HeartWrapper = styled.div`
  margin-top: 2px;
`;

export default ImageSliderMember;
