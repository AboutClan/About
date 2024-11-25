import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import { AboutIcon } from "../Icons/AboutIcon";

interface OrganizerBarProps {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen?: boolean;
  children?: React.ReactNode;
}

function OrganizerBar({ organizer, createdAt, children, isAdminOpen }: OrganizerBarProps) {
  const isSecret = organizer.name === "익명";

  return (
    <Layout isSecret={isSecret}>
      <Box>
        {isAdminOpen ? (
          <AboutIcon size="md" />
        ) : (
          <Avatar
            userId={organizer._id}
            avatar={organizer.avatar}
            uid={organizer.uid}
            image={organizer.profileImage}
            size="md"
            isLink={!isSecret}
          />
        )}
        <Info>
          <Box as="span">{isAdminOpen ? "어바웃" : organizer.name}</Box>
          <span>{getDateDiff(dayjs(createdAt))}</span>
        </Info>
      </Box>
      {children}
    </Layout>
  );
}

const Layout = styled.div<{ isSecret: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) =>
    !props.isSecret ? "var(--gap-3) var(--gap-4)" : "var(--gap-1) 0 var(--gap-3) 0"};
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
