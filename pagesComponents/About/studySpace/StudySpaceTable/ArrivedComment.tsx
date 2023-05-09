import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

import ProfileIconMd from "../../../../components/common/Profile/ProfileIconMd";

import { IAttendence } from "../../../../types/studyDetails";
import { IUser } from "../../../../types/user";
import { useRecoilValue } from "recoil";
import { studyDateState, voteDateState } from "../../../../recoil/studyAtoms";
import { useAbsentDataQuery } from "../../../../hooks/vote/queries";
import { Button, Portal, useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import dayjs from "dayjs";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";
import PickUserMealPopup from "../../../../components/utils/PickUserMealPopup";

function ArrivedComment({ attendances }: { attendances: IAttendence[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  const voteDate = dayjs(router.query.date as string);
  const studyDate = useRecoilValue(studyDateState);
  const { data: absentData } = useAbsentDataQuery(voteDate);

  const [meal, setMeal] = useState();

  return (
    <Layout>
      {attendances?.map((user, idx) => {
        if (studyDate !== "not passed" && !user?.firstChoice) return null;
        const arrivedTime = user?.arrived
          ? new Date(user.arrived)
          : new Date(2023, 1, 1, 21, 0, 0);

        //임의로 체크로 해놨음. 나중에 방지 대책 필요.

        arrivedTime.setHours(arrivedTime.getHours() - 9);
        const arrivedHM = arrivedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const userInfo = user.user as IUser;
        return (
          <Block key={idx}>
            <ProfileIconMd user={userInfo} />
            <BlockInfo>
              <Info>
                <div>
                  <span>{userInfo.name}</span>
                  {!meal && session?.uid === userInfo.uid && (
                    <PickUserMealPopup />
                  )}
                  {userInfo.name === "이갑철" && (
                    <FontAwesomeIcon
                      icon={faPizzaSlice}
                      color="var(--color-orange)"
                    />
                  )}
                </div>
                <div>{user.memo}</div>
              </Info>
              {user.arrived || studyDate === "passed" ? (
                <Check isCheck={true}>
                  <FontAwesomeIcon icon={faCircleCheck} size="xl" />
                  <span>{arrivedHM}</span>
                </Check>
              ) : studyDate !== "not passed" &&
                absentData?.find((who) => who.uid === userInfo?.uid) ? (
                <Check isCheck={false}>
                  <FontAwesomeIcon icon={faCircleXmark} size="xl" />
                  <span>불참</span>
                </Check>
              ) : null}
            </BlockInfo>
          </Block>
        );
      })}
    </Layout>
  );
}
const Layout = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;
const Block = styled.div`
  height: 60px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const BlockInfo = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  margin-left: 12px;
`;

const Check = styled.div<{ isCheck: boolean }>`
  margin-left: auto;
  width: 40px;
  display: flex;
  justify-content: end;
  flex-direction: column;
  align-items: center;
  color: ${(props) =>
    props.isCheck ? "var(--color-mint)" : "var(--color-red)"};
  > span {
    display: inline-block;
    margin-top: 4px;
    font-size: 11px;
    color: var(--font-h4);
  }
`;
const Info = styled.div`
  width: 80%;

  flex-direction: column;
  display: flex;
  justify-content: center;
  padding: 4px 0;
  > div:first-child {
    display: flex;
    align-items: center;
    > span {
      font-weight: 600;
      font-size: 15px;
      margin-right: 8px;
    }
  }
  > div:last-child {
    font-size: 13px;
    margin-top: 2px;
    color: var(--font-h3);
  }
`;

export default ArrivedComment;
