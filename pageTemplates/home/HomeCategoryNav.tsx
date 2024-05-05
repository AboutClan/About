import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { NewAlertIcon } from "../../components/atoms/Icons/AlertIcon";
import {
  CalendarIcon,
  CampfireIcon,
  GroupIcon,
  MemberIcon,
  StoreIcon,
} from "../../components/atoms/Icons/CategoryIcons";
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
            <StoreIcon />
            {/* {isPointAlert && (
              <IconWrapper>
                <FontAwesomeIcon
                  icon={faStar}
                  color="var(--color-red)"
                  size="sm"
                />
              </IconWrapper>
            )} */}
            <IconWrapper>
              <NewAlertIcon size="lg" />
            </IconWrapper>
          </CustomLink>
          <span>이벤트</span>
        </Item>
        <Item className="about_navigation3">
          <CustomLink
            onClick={onClick}
            href={`/member/${convertLocationLangTo(location as LocationEn, "kr")}`}
          >
            <MemberIcon />{" "}
            {/* <IconWrapper>
              <NewAlertIcon size="lg" />
            </IconWrapper> */}
          </CustomLink>
          <span>동아리원</span>
        </Item>
        <Item className="about_navigation4">
          <CustomLink href="review" onClick={onClick}>
            <GroupIcon />{" "}
            {/* <IconWrapper>
              <NewAlertIcon size="lg" />
            </IconWrapper> */}
          </CustomLink>
          <span>리뷰</span>
        </Item>
        <Item>
          <Button onClick={() => setIsNotCompletedModal(true)}>
            <CampfireIcon />
          </Button>
          <span>? ? ?</span>
        </Item>
      </Layout>
      {isNotCompletedModal && <NotCompletedModal setIsModal={setIsNotCompletedModal} />}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  padding-bottom: 8px;
  background-color: var(--gray-8);
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
    color: var(--gray-1);
    font-weight: 400;
  }
`;

const CustomLink = styled(Link)`
  margin-bottom: 8px;
  position: relative;
`;

const Button = styled.button`
  margin-bottom: 9px;
  position: relative;
`;

export default HomeCategoryNav;
