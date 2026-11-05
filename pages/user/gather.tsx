import UserGatherSection from "@/features/user/screens/UserGatherSection";
import UserSubPageLayout from "@/features/user/screens/UserSubPageLayout";

function UserGatherPage() {
  return (
    <UserSubPageLayout title="내가 참여했던 번개 모임">
      <UserGatherSection />
    </UserSubPageLayout>
  );
}

export default UserGatherPage;
