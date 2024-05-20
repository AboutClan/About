import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import CalendarIcon from "../../assets/icons/CalendarIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import GiftIcon from "../../assets/icons/GiftIcon";
import LoaderIcon from "../../assets/icons/LoaderIcon";
import UserTwoIcon from "../../assets/icons/UserTwoIcon";
import { NewAlertIcon } from "../../components/atoms/Icons/AlertIcon";
import NotCompletedModal from "../../modals/system/NotCompletedModal";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";

function HomeCategoryNav() {
  const searchParams = useSearchParams();

  const location = searchParams.get("location");

  const [isNotCompletedModal, setIsNotCompletedModal] = useState(false);

  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const onClick = () => {
    setSlideDirection("right");
  };

  return (
    <>
      <Layout>
        <Item className="about_navigation1">
          <CustomLink href="/calendar" onClick={onClick}>
            <CalendarIcon />
          </CustomLink>
          <span>캘린더</span>
        </Item>
        <Item className="about_navigation2">
          <CustomLink href="event" onClick={onClick}>
            <GiftIcon />

            <IconWrapper>
              <NewAlertIcon />
            </IconWrapper>
          </CustomLink>
          <span>스토어</span>
        </Item>
        <Item className="about_navigation3">
          <CustomLink
            onClick={onClick}
            href={`/member/${convertLocationLangTo(location as LocationEn, "kr")}`}
          >
            <UserTwoIcon />
          </CustomLink>
          <span>동아리원</span>
        </Item>
        <Item className="about_navigation4">
          <CustomLink href="review" onClick={onClick}>
            <ChatIcon />
          </CustomLink>
          <span>리뷰</span>
        </Item>
        <Item>
          <CustomLink href="review" onClick={onClick}>
            <LoaderIcon />
          </CustomLink>
          <span>커뮤니티</span>
        </Item>
      </Layout>
      {isNotCompletedModal && <NotCompletedModal setIsModal={setIsNotCompletedModal} />}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 20px;
  padding-bottom: 8px;
  background-color: white;
`;

const IconWrapper = styled.div`
  font-size: 12px;
  position: absolute;
  right: -1px;
  bottom: -1px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 46px;
  > span {
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    color: black;
  }
`;

const CustomLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 8px;
  position: relative;
  background-color: var(--gray-100);
  border-radius: 6px;
`;

export default HomeCategoryNav;
