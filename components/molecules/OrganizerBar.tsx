import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { ComponentProps } from "react";
import styled from "styled-components";

import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";

interface OrganizerBarProps {
  avatar: React.ReactNode;
  name: string;
  createdAt: string;
  right?: React.ReactNode;
}

function OrganizerBar({ avatar, name, createdAt, right }: OrganizerBarProps) {
  return (
    <Layout>
      <Box>
        {avatar}
        <Info>
          <Box as="span">{name}</Box>
          <span>{getDateDiff(dayjs(createdAt))}</span>
        </Info>
      </Box>
      {right}
    </Layout>
  );
}

type OrganizerBarAvatarProps = ComponentProps<typeof Avatar>;
function OrganizerBarAvatar(props: OrganizerBarAvatarProps) {
  return <Avatar {...props} />;
}
OrganizerBar.Avatar = OrganizerBarAvatar;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--gap-3) var(--gap-4);
  background-color: white;
  border-bottom: var(--border);
  > div:first-child {
    display: flex;
  }
`;

const Info = styled.div`
  margin-left: var(--gap-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
  line-height: 1.6;
  align-items: flex-start;
  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    font-size: 12px;
    color: var(--gray-600);
  }
`;

export default OrganizerBar;
