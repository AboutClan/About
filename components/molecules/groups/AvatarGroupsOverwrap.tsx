import styled from "styled-components";

import { AvatarProps } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";

interface IAvatarGroupsOverwrap {
  users: { avatar: AvatarProps; _id?: string; profileImage?: string }[];
  userLength?: number;
  maxCnt: number;
  size?: "sm" | "lg";
}

export default function AvatarGroupsOverwrap({
  users,
  userLength,
  maxCnt,
  size = "sm",
}: IAvatarGroupsOverwrap) {
  return (
    <Participants size={size}>
      {users?.map((att, idx) => {
        return (
          idx < maxCnt && (
            <Avatar
              key={idx}
              user={att}
              size={size === "sm" ? "xxs1" : "sm1"}
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
const Participants = styled.div<{ size: "sm" | "lg" }>`
  display: flex;

  & > *:not(:first-child) {
    margin-left: ${(props) => (props.size === "sm" ? "-4px" : "-8px")};
  }
`;
