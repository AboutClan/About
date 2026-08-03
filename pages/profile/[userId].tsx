import { useParams } from "next/navigation";

import { useUserIdToUserInfoQuery } from "../../hooks/user/queries";
import ProfileDetailPage from "../../pageTemplates/profile/ProfileDetailPage";

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>() || {};

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });

  return <ProfileDetailPage user={user} />;
}

export default ProfilePage;
