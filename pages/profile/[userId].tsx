import { useParams } from "next/navigation";

import ProfileDetailPage from "@/features/profile/screens/ProfileDetailPage";
import { useUserIdToUserInfoQuery } from "@/hooks/user/queries";

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>() || {};

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });

  return <ProfileDetailPage user={user} />;
}

export default ProfilePage;
