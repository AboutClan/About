import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import UserNavigation from "../../../pageTemplates/user/userNavigation/UserNavigation";

export default function Index() {
  return (
    <>
      <Header title="설정" url="/user" />
      <Slide isNoPadding>
        <UserNavigation />
      </Slide>
    </>
  );
}
