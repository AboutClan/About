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
    "68739f5babe1521d350ad30e",
    "6809ca6c60ee279833beaec7",
    "67c08ed366baa8b01c6a0f1a",
    "67cc423c00886856ca16bce3",
    "692f02a88c1609fbf932b8cc",
    "677d48935e6b4250b9bc61ea",
    "67c992fac9978b626c6c3d3e",
    "6809cb1f60ee279833beaec9",
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
