import { Badge } from "../../../components/atoms/badges/Badges";
import OrganizerBar from "../../../components/molecules/OrganizerBar";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherOrganizer {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen: boolean;
  category: string;
}

function GatherOrganizer({ createdAt, organizer, isAdminOpen, category }: IGatherOrganizer) {
  const isABOUT = isAdminOpen;
  return (
    <OrganizerBar organizer={organizer} createdAt={createdAt} isAdminOpen={isABOUT}>
      <Badge colorScheme="red" text={category} size="lg" />
    </OrganizerBar>
  );
}

export default GatherOrganizer;
