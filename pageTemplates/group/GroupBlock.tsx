import { faLockKeyhole } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Badge } from "../../components/common/customComponents/Badges";
import { dayjsToFormat } from "../../helpers/dateHelpers";
import { useFailToast } from "../../hooks/custom/CustomToast";
import { transferGroupDataState } from "../../recoil/transferDataAtoms";
import { isGuestState } from "../../recoil/userAtoms";
import { IGroup } from "../../types/page/group";

interface IGroupBlock {
  group: IGroup;
}

function GroupBlock({ group }: IGroupBlock) {
  const router = useRouter();
  const failToast = useFailToast();
  const infoArrText = ["그룹장", "인원", "조건", "참여금", "진행", "개설"];

  const isGuest = useRecoilValue(isGuestState);
  const setGroup = useSetRecoilState(transferGroupDataState);

  const groupInfo = {
    그룹장: group.organizer.name === "이승주" ? "어바웃" : group.organizer.name,
    인원: `${group.participants.length}/${
      group.memberCnt.max === 0 ? "자유" : group.memberCnt.max + "명"
    }`,
    조건: `${
      group.age[0] === 19 && group.age[1] === 28
        ? "제한없음"
        : group.age[0] + " ~ " + group.age[1] + "세"
    }`,
    참여금: `${group.fee ? group.fee + "원" : "기본"}`,
    진행: `${group.period || "자율"}`,
    개설: dayjsToFormat(dayjs(group.createdAt), "YY년 M월 D일"),
  };

  const onClick = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }

    setGroup(group);
    router.push(`/group/${group.id}`);
  };

  const getBadgeText = () => {
    const status = group.status;
    const min = group.memberCnt.min;
    const max = group.memberCnt.max;
    const participantCnt = group.participants.length;
    if (status === "pending") {
      if (participantCnt < min) {
        return {
          text: `개설까지 ${min - participantCnt}명 남음`,
          color: "redTheme",
        };
      } else if (participantCnt >= max) {
        if (max !== 0) {
          return {
            text: "인원마감",
            color: "yellowTheme",
          };
        }
        return {
          text: "모집중",
          color: "mintTheme",
        };
      } else {
        return {
          text: `마감까지 ${max - participantCnt}명 남음`,
          color: "redTheme",
        };
      }
    }
  };

  return (
    <Layout onClick={onClick}>
      <Header>
        <div>
          <span>{group.category.main}</span>·<span>{group.category.sub}</span>
          {!group?.isFree && <FontAwesomeIcon icon={faLockKeyhole} />}
        </div>
        <Badge
          text={getBadgeText().text}
          colorScheme={getBadgeText().color}
          type="outline"
          size="md"
        />
      </Header>
      <Title>{group.title}</Title>
      <Info>
        {infoArrText.map((item) => (
          <InfoItem key={item}>
            <span>{item}</span>
            <span>{groupInfo[item]}</span>
          </InfoItem>
        ))}
      </Info>
      <Content>{group.guide}</Content>
    </Layout>
  );
}

const Layout = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
  padding: var(--gap-3);
  margin-bottom: var(--gap-4);
  box-shadow: var(--shadow);
  border: var(--border);
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-mint);
  margin-bottom: var(--gap-1);
  > div:first-child {
    display: flex;
    align-items: center;

    > span {
      margin-right: var(--gap-2);
    }
    > span:nth-child(2) {
      margin-left: var(--gap-2);
    }

    > svg {
      margin-bottom: 2px;
    }
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
`;
const Info = styled.div`
  width: 100%;

  padding: var(--gap-2) 0;
  display: grid;
  grid-template-columns: 0.9fr 0.8fr 1.2fr;
  gap: var(--gap-1);
  border-bottom: var(--border-light);
`;

const InfoItem = styled.div`
  text-align: start;
  font-size: 13px;
  > span:first-child {
    display: inline-block;
    margin-right: var(--gap-2);
    font-weight: 600;
    color: var(--gray-2);
  }
  > span:last-child {
    color: var(--gray-3);
  }
`;

const Content = styled.pre`
  text-align: start;
  font-size: 13px;
  color: var(--gray-2);
  padding-top: var(--gap-3);
  font-family: apple;
  white-space: pre-wrap;
  /* display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden; */
`;

export default GroupBlock;
