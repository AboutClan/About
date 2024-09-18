import styled from "styled-components";

import { IAvatar } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";

interface IUserAvatar {
  image: string;
  avatar?: IAvatar;
}

interface IAvatarGroupsOverwrap {
  userAvatarArr: IUserAvatar[];
  userLength?: number;
  maxCnt?: number;
}

const BASIC_MAX_CNT = 8;

export default function AvatarGroupsOverwrap({
  userAvatarArr,
  userLength,
  maxCnt,
}: IAvatarGroupsOverwrap) {
  console.log(userAvatarArr.length, userLength, maxCnt);
  return (
    <Participants>
      {userAvatarArr.map((att, idx) => {
        return (
          idx < maxCnt && (
            <Avatar
              key={idx}
              image={att.image}
              avatar={att.avatar}
              size="sm"
              isLink={false}
              shadowAvatar={
                idx === maxCnt - 1 &&
                (userLength ? userLength - maxCnt : userAvatarArr.length - idx)
              }
            />
          )
        );
      })}
    </Participants>
  );
}
const Participants = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: -8px;
  }
`;
