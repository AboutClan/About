import { Flex } from "@chakra-ui/react";
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
          idx < maxCnt &&
          (att ? (
            <Avatar
              key={idx}
              user={att}
              size={size === "sm" ? "xxs1" : "sm1"}
              isLink={false}
              shadowAvatar={
                idx === maxCnt - 1 && (userLength ? userLength - maxCnt : users.length - idx)
              }
            />
          ) : (
            <Flex
              fontSize="6px"
              color="var(--gray-500)"
              fontWeight={600}
              justify="center"
              alignItems="center"
              w={4}
              h={4}
              p="1px"
              bg="white"
              borderRadius="full"
              zIndex={100 + idx}
              key={idx}
            >
              <Flex
                w="full"
                h="full"
                bg="gray.200"
                borderRadius="full"
                justify="center"
                align="center"
                textAlign="center"
              >
                <PlusIcon />
              </Flex>
            </Flex>
          ))
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

function PlusIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="10px"
    viewBox="0 -960 960 960"
    width="10px"
    fill="var(--gray-500)"
  >
    <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
  </svg>
}
