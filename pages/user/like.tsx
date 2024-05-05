import { faCircleHeart } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useInteractionLikeQuery } from "../../hooks/user/sub/interaction/queries";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

function Like() {
  const { data: activeLogs } = useInteractionLikeQuery();
  return (
    <>
      <Header title="좋아요 기록" />
      {activeLogs ? (
        <Slide>
          <Container>
            {activeLogs
              ?.slice()
              ?.reverse()
              ?.map((item, idx) => {
                const type = item.type;
                const [name, message] = item.message.split("님");

                return (
                  <ItemContainer key={idx}>
                    <span>{dayjsToFormat(dayjs(item.createdAt), "YYYY년 M월 D일")}</span>
                    <Item>
                      <IconWrapper>
                        <FontAwesomeIcon color="var(--color-red)" icon={faCircleHeart} size="xl" />
                      </IconWrapper>
                      <Name>{name}</Name>
                      <Content>
                        님{message} {type === "like" && <Point>+2 point</Point>}
                      </Content>
                    </Item>
                  </ItemContainer>
                );
              })}
          </Container>
        </Slide>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

const Container = styled.div``;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-3) var(--gap-4);
  padding-bottom: var(--gap-2);
  border-bottom: 1px solid var(--gray-7);
  font-size: 13px;
  > span:first-child {
    font-size: 12px;
    color: var(--gray-2);
    margin-bottom: var(--gap-2);
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: var(--gap-2);
`;

const Name = styled.div`
  height: 22px;
  font-weight: 600;
  white-space: nowrap;
`;

const Content = styled.span`
  white-space: nowrap;
  height: 22px;
  margin-right: var(--gap-2);
`;

const Point = styled.span`
  color: var(--color-mint);
  font-size: 10px;
`;

export default Like;
