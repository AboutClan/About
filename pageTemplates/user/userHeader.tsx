
import Header from "../../components/layouts/Header";
import IconButtonNav, { IIconButtonNavBtn } from "../../components/molecules/navs/IconButtonNav";

export default function UserHeader() {
  const iconBtnArr: IIconButtonNavBtn[] = [
    {
      icon: <i className="fa-light fa-gear fa-lg"  />,
      link: "/user/setting",
    },
  ];
  return (
    <Header title="마이페이지" url="/home">
      <IconButtonNav iconList={iconBtnArr} />
    </Header>
  );
}
