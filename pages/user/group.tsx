import UserGroupSection from "@/features/user/screens/UserGroupSection";
import UserSubPageLayout from "@/features/user/screens/UserSubPageLayout";

function UserGroupPage() {
  return (
    <UserSubPageLayout title="가입중인 소모임">
      <UserGroupSection />
    </UserSubPageLayout>
  );
}

export default UserGroupPage;
