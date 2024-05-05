import styled from "styled-components";

import { IAvatar } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
type Size = "sm";

interface IUserAvatar {
  image: string;
  avatar?: IAvatar;
}

interface IAvatarGroupsOverwrap {
  userAvatarArr: IUserAvatar[];
  size: Size;
}
const VOTER_SHOW_MAX = 6;

export default function AvatarGroupsOverwrap({ userAvatarArr }: IAvatarGroupsOverwrap) {
  return (
    <Participants>
      {userAvatarArr.map((att, idx) => {
        return (
          idx < VOTER_SHOW_MAX && (
            <Avatar
              key={idx}
              image={att.image}
              avatar={att.avatar}
              size="sm"
              shadowAvatar={idx === VOTER_SHOW_MAX - 1 && userAvatarArr.length - idx}
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
