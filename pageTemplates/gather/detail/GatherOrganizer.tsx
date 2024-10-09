import { Badge } from "../../../components/atoms/badges/Badges";
import { AboutIcon } from "../../../components/atoms/Icons/AboutIcon";
import OrganizerBar from "../../../components/molecules/OrganizerBar";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherOrganizer {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen: boolean;
  category: string;
}

function GatherOrganizer({ createdAt, organizer, isAdminOpen, category }: IGatherOrganizer) {
  return (
    <OrganizerBar
      avatar={
        isAdminOpen ? (
          <AboutIcon size="md" />
        ) : (
          <OrganizerBar.Avatar
            avatar={organizer.avatar}
            uid={organizer.uid}
            image={organizer.profileImage}
            isLink
            size="md"
          />
        )
      }
      name={organizer.name}
      createdAt={createdAt}
      right={<Badge colorScheme="redTheme" text={category} size="lg" />}
    />
  );
}

export default GatherOrganizer;
