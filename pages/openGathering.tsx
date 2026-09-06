import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import SocialingScoreBadge from "@/components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "@/components/organisms/ProfileCardColumn";
import { useAllUserDataQuery } from "@/hooks/admin/quries";

function OpenGathering() {
  const { data: allUserData } = useAllUserDataQuery(null, {
    enabled: true,
  });

  const arr = [
    "67e6c0d32f9b47cb765be84f",
    "67bed937082b160ceb6374fc",
    "6846426a75cb2f22f3270c20",
    "6858be891381d7148d531ab0",
    "69899769820b1ccc239867c0",
    "68063be5b8770ad6100aa4ac",
    "6613a57eb63eed0688b48ab4",
    "693f8e639bfd1441253bf533",
    "674aadf46f28da51807e0afb",
    "68ee59c3346d8af2023cbab1",
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
