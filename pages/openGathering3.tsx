import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import SocialingScoreBadge from "../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../components/organisms/ProfileCardColumn";
import { useAllUserDataQuery } from "../hooks/admin/quries";

function OpenGathering() {
  const { data: allUserData } = useAllUserDataQuery(null, {
    enabled: true,
  });

  const arr = [
    "6996054f5318db174430873f",
    "699605195318db174430873d",
    "675eaa4162a9b9a9d70d02aa",
    "683f92e2c470fb74df5215f1",
  ];

  const filterUsers = allUserData
    ?.filter((user) => arr.includes(user?._id))
    ?.map((par, idx) => ({
      user: { ...par, name: `${idx + 1} / ${par?.name}` },
      memo: par.comment,
      rightComponent: <SocialingScoreBadge user={par} size="sm" />,
    }));

  return (
    <>
      <Header title="모임 추천 인원" isBack={false} />
      <Slide>
        {filterUsers?.length && (
          <ProfileCardColumn hasCommentButton={false} userCardArr={filterUsers} />
        )}
      </Slide>
    </>
  );
}

export default OpenGathering;
