import { faMagnifyingGlass } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import styled from "styled-components";

import { IGatherSummary } from "../../pages/review";
import { SingleLineText } from "../../styles/layout/components";

interface IReviewGatherSummary {
  summary: IGatherSummary;
}

function ReviewGatherSummary({ summary }: IReviewGatherSummary) {
  const router = useRouter();
  const date = dayjs(summary?.date);

  const onClick = () => {
    router.push(`/gather/${summary?.id}`);
  };

  return (
    <Layout onClick={onClick}>
      <IconWrapper>
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" color="var(--gray-2)" />
      </IconWrapper>
      <Content>
        <span>{summary.title}</span>
        <ContentDetail>
          <span>
            {summary.place} {summary.place === "전체" && "지역"}
          </span>
          ·<span>{summary.type.title}</span>·<span>{date.format("M월 D일")}</span> ·
          <LocationText>{summary.location.main}</LocationText>
        </ContentDetail>
      </Content>
    </Layout>
  );
}

const Layout = styled.button`
  flex: 1;
  text-align: start;
  margin: var(--gap-4);
  margin-bottom: var(--gap-5);
  border: var(--border);
  background-color: white;
  box-shadow: var(--shadow);

  border-radius: var(--rounded-lg);
  display: flex;
  padding: var(--gap-2);
  align-items: center;
  height: 60px;
`;

const LocationText = styled(SingleLineText)`
  margin-left: 4px;

  width: 100px;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 44px;
  margin-right: var(--gap-2);
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  > span:first-child {
    font-weight: 600;
    font-size: 13px;
  }
`;

const ContentDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--gray-3);
  > span:first-child {
    margin-right: var(--gap-1);
  }
  > span:nth-child(2) {
    margin: 0 var(--gap-1);
  }
  > span:nth-child(3) {
    margin: 0 var(--gap-1);
  }
  > span:last-child {
    margin-left: var(--gap-1);
  }
`;

export default ReviewGatherSummary;
