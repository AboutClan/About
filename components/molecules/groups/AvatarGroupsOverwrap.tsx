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
    <Participants size="2xs">
      {userAvatarArr.map((att, idx) => {
        return (
          idx < maxCnt && (
            <Avatar
              key={idx}
              image={att.image}
              avatar={att.avatar}
              size="2xs"
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
const Participants = styled.div<{ size: string }>`
  display: flex;
  & > *:not(:first-child) {
    margin-left: ${(props) => (props.size === "2xs" ? "-4px" : "-8px")};
  }
`;
