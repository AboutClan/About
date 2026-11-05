import UserStudySection from "@/features/user/screens/UserStudySection";
import UserSubPageLayout from "@/features/user/screens/UserSubPageLayout";

function UserStudyPage() {
  return (
    <UserSubPageLayout title="내 스터디 기록">
      <UserStudySection />
    </UserSubPageLayout>
  );
}

export default UserStudyPage;
