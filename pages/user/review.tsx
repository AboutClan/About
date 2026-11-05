import UserReviewableSection from "@/features/user/screens/UserReviewableSection";
import UserSubPageLayout from "@/features/user/screens/UserSubPageLayout";

function UserReviewPage() {
  return (
    <UserSubPageLayout title="할 수 있는 멤버 평가">
      <UserReviewableSection />
    </UserSubPageLayout>
  );
}

export default UserReviewPage;
