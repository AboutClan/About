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

export default function AvatarGroupsOverwrap({
  userAvatarArr,
  userLength,
  maxCnt,
}: IAvatarGroupsOverwrap) {
  return (
    <Participants>
      {userAvatarArr.map((att, idx) => {
        return (
          idx < maxCnt && (
            <Avatar
              key={idx}
              image={att.image}
              avatar={att.avatar}
              size="xs"
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
