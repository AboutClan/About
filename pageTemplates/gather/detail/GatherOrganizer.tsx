import dayjs from "dayjs";
import styled from "styled-components";
import { Badge } from "../../../components/common/customComponents/Badges";
import { AboutIcon } from "../../../components/common/Icon/AboutIcon";

import Avatar from "../../../components2/atoms/Avatar";
import { ABOUT_UID } from "../../../constants/system";
import { getDateDiff } from "../../../helpers/dateHelpers";
import { IUserSummary } from "../../../types2/userTypes/userInfoTypes";

interface IGatherOrganizer {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen: boolean;
  category: string;
}

function GatherOrganizer({
  createdAt,
  organizer,
  isAdminOpen,
  category,
}: IGatherOrganizer) {
  const writingDate = getDateDiff(dayjs(createdAt));
  const isABOUT = organizer.uid === ABOUT_UID || isAdminOpen;
  return (
    <Layout>
      <div>
        {isABOUT ? (
          <AboutIcon size="md" />
        ) : (
          <Avatar
            avatar={organizer.avatar}
            uid={organizer.uid}
            image={organizer.profileImage}
            size="md"
          />
        )}
        <Info>
          <Writer>{isABOUT ? "어바웃" : organizer.name}</Writer>
          <span>{writingDate}</span>
        </Info>
      </div>
      <Badge colorScheme="redTheme" text={category} size="lg" />
    </Layout>
  );
}

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

const Category = styled.div``;

const Writer = styled.span``;

const Info = styled.div`
  margin-left: var(--gap-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
  align-items: flex-start;
  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    font-size: 12px;
    color: var(--gray-3);
  }
`;

export default GatherOrganizer;
