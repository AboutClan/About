import { Box, Flex } from "@chakra-ui/react";
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
      <Slide>
        <Box minH="100dvh" mt="56px">
          {activeLogs ? (
            !activeLogs.length ? (
              <Flex
                justify="center"
                align="center"
                fontSize="14px"
                fontWeight="medium"
                bg="gray.100"
                px={3}
                py={4}
                minH="114px"
                borderRadius="8px"
                color="gray.600"
                border="var(--border)"
              >
                받은 좋아요가 없습니다.
              </Flex>
            ) : (
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
                            <i
                              className="fa-regular fa-circle-heart fa-xl"
                              style={{ color: "var(--color-red)" }}
                            />
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
            )
          ) : (
            <MainLoading />
          )}
        </Box>
      </Slide>
    </>
  );
}

const Container = styled.div``;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-3) 0;
  padding-bottom: var(--gap-2);
  border-bottom: var(--border-main);
  font-size: 13px;
  > span:first-child {
    font-size: 12px;
    color: var(--gray-700);
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
  font-size: 12px;
`;

export default Like;
