import styled from "styled-components";

import { AvatarProps } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";

interface IAvatarGroupsOverwrap {
  users: { avatar: AvatarProps; _id?: string; profileImage?: string }[];
  userLength?: number;
  maxCnt: number;
}

export default function AvatarGroupsOverwrap({ users, userLength, maxCnt }: IAvatarGroupsOverwrap) {
  return (
    <Participants>
      {users?.map((att, idx) => {
        return (
          idx < maxCnt && (
            <Avatar
              key={idx}
              user={att}
              size="xxs1"
              isLink={false}
              shadowAvatar={
                idx === maxCnt - 1 && (userLength ? userLength - maxCnt : users.length - idx)
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
    margin-left: -4px;
  }
`;
