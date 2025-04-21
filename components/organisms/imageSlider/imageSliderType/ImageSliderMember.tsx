import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { prevPageUrlState } from "../../../../recoils/previousAtoms";
import { IUser, IUserSummary } from "../../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../../utils/dateTimeUtils";
import Avatar from "../../../atoms/Avatar";
import HeartCircleIcon from "../../../Icons/HeartCircleIcon";
import { ImageContainer } from "../ImageSlider";

interface IImageSliderMember {
  imageContainer: ImageContainer;
}

function ImageSliderMember({ imageContainer }: IImageSliderMember) {
  const router = useRouter();
  const setBeforePage = useSetRecoilState(prevPageUrlState);

  const onClickUser = (user: IUserSummary) => {
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
                <Avatar user={user} size="sm1" />
              </ProfileWrapper>
              <span>{user?.name}</span>
              {isBirth && (
                <HeartWrapper>
                  <HeartCircleIcon toUid={user.uid} />
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
