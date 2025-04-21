import { Badge } from "@chakra-ui/react";

import PostAuthorCard from "../../../components/molecules/cards/PostAuthorCard";
import { STATUS_TO_TEXT } from "../../../constants/util/convert";
import { GatherStatus } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherOrganizer {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen: boolean;
  status: GatherStatus;
}

function GatherOrganizer({ createdAt, organizer, isAdminOpen, status }: IGatherOrganizer) {
  const isABOUT = isAdminOpen;
  const color = status === "pending" ? "mint" : status === "open" ? "red" : null;

  return (
    <PostAuthorCard organizer={organizer} createdAt={createdAt} isAdminOpen={isABOUT}>
      <Badge colorScheme={color} size="lg">
        {STATUS_TO_TEXT[status]}
      </Badge>
    </PostAuthorCard>
  );
}

export default GatherOrganizer;
