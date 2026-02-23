/* eslint-disable */
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import SocialingScoreBadge from "../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../components/organisms/ProfileCardColumn";
import { useAllUserDataQuery } from "../hooks/admin/quries";
import { useToast } from "../hooks/custom/CustomToast";
import { useUserInfo } from "../hooks/custom/UserHooks";
import { birthToAge } from "../utils/convertUtils/convertTypes";

function OpenGathering() {
  const toast = useToast();
  const { data: allUserData } = useAllUserDataQuery(null, {
    enabled: true,
  });

  const userInfo = useUserInfo();

  const users = allUserData?.map((a) => ({ ...a._doc, telephone: a.telephone }));
  const data = users?.map((user) => ({ name: user.name, phone: user.telephone, _id: user._id }));
  console.log(data);
  const findMine = users?.find((user) => user.uid === "4756703725");

  const AGroup = users?.filter((user) =>
    [
      "010-4790-2509",
      "010-6204-4929",
      "010-6319-1710",
      "010-8928-7318",
      "010-2359-6167",
      "010-2359-6167",
      "010-3174-0411",
      "010-3607-8594",
      "010-7204-9072",
      "010-4871-4507",
      "010-7668-9815",
      "010-8783-9914",
      "010-9939-1759",
      "010-4846-8043",
      "010-6687-0779",
      "010-6230-0206",
    ].includes(user.telephone),
  );
  const BGroup = users?.filter((user) =>
    [
      "010-3191-2952",
      "010-3435-8937",
      "010-2635-5617",
      "010-4182-9220",
      "010-3465-9325",
      "010-4624-7097",
      "010-7400-8506",
      "010-9979-9422",
      "010-9607-4570",
      "010-8401-7560",
      "010-9324-8960",
      "010-7162-5257",
      "010-5699-8671",
      "010-2672-4836",
      "010-4655-6099",
    ].includes(user.telephone),
  );

  const myAge = birthToAge(findMine?.birth);

  const myFriends = AGroup?.some((user) => user?.uid === "4756703725")
    ? users?.filter((user) => {
        console.log(Math.abs(birthToAge(user.birth) - myAge) <= 3);
        if (user.gender === "남성") return Math.abs(birthToAge(user.birth) - myAge) <= 3;
        else return Math.abs(birthToAge(user.birth) - myAge) <= 2;
      })
    : null;

  const filterUsers = allUserData
    ?.filter((user) => [].includes(user?._id))
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
