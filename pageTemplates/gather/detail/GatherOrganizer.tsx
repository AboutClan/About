import styled from "styled-components";

import { Badge } from "../../../components/atoms/badges/Badges";
import OrganizerBar from "../../../components/molecules/OrganizerBar";
import { ABOUT_UID } from "../../../constants/system";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherOrganizer {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen: boolean;
  category: string;
}

function GatherOrganizer({ createdAt, organizer, isAdminOpen, category }: IGatherOrganizer) {
  const isABOUT = organizer.uid === ABOUT_UID || isAdminOpen;
  return (
    <Layout>
      <OrganizerBar organizer={organizer} createdAt={createdAt} isAdminOpen={isABOUT}>
        <Badge colorScheme="redTheme" text={category} size="lg" />
      </OrganizerBar>
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
    color: var(--gray-600);
  }
`;

export default GatherOrganizer;
