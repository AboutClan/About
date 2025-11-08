import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { AboutIcon } from "../../components/atoms/AboutIcons";
import Avatar from "../../components/atoms/Avatar";
import { NOTICE_ACTIVE_LOG } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserFriendMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";
import { useInteractionMutation } from "../../hooks/user/sub/interaction/mutations";
import { INoticeActiveLog } from "../../types/globals/interaction";
import { Alphabet } from "../../types/models/collections";
import { getDateDiff } from "../../utils/dateTimeUtils";

interface INoticeActive {
  activeLogs: INoticeActiveLog[];
}

function NoticeActive({ activeLogs }: INoticeActive) {
  const toast = useToast();
  const errorToast = useErrorToast();

  let statusType: "approval" | "refusal" | "response";

  const resetQueryData = useResetQueryData();

  const { data: userInfo } = useUserInfoQuery();
  const { mutate: registerFriend } = useUserFriendMutation("patch", {
    onError: errorToast,
  });
  const { mutate: changeAlphabet } = useAlphabetMutation("change");

  const { mutate: interactionFriend } = useInteractionMutation("friend", "patch", {
    onSuccess() {
      if (statusType === "approval") toast("success", "친구가 되었어요!");

      statusType = null;
      resetQueryData([NOTICE_ACTIVE_LOG]);
    },
  });
  const { mutate: interactionAlphabet } = useInteractionMutation("alphabet", "patch", {
    onSuccess() {
      if (statusType === "approval") toast("success", "교환 완료!");
      statusType = null;
      resetQueryData([NOTICE_ACTIVE_LOG]);
    },
  });

  const onClickFriendRequest = async (
    type: "friend" | "alphabet",
    status: "approval" | "refusal",
    from: string,
    alphabet?: Alphabet[],
  ) => {
    statusType = status;
    if (type === "friend") {
      if (status === "approval") await registerFriend(from);
      await interactionFriend({ from, status });
    }
    if (type === "alphabet") {
      if (status === "approval") {
        await changeAlphabet({
          mine: alphabet[1],
          opponent: alphabet[0],
          myId: userInfo._id,
          toUid: from,
        });
      }
      await interactionAlphabet({ from, status });
    }
  };

  return (
    <>
      {activeLogs
        ?.slice()
        ?.reverse()
        ?.map((item, idx) => {
          const type = item.type;
          const [name, message] = item.message.split("님");
          const alphabet = item?.sub?.split("/");
          let text = message?.replace("알파벳 교환", "교환");
          text = text?.replace("친구추가", "친구");

          return (
            <Item key={idx}>
              <Box mr={2}>
                <Avatar user={{ ...item?.fromUser }} size="xs1" />
              </Box>
              <Name>
                {name}
                {type === "alphabet" && `(${alphabet[0]})`}
              </Name>
              <Content>
                님{text} {type === "like" && <Point>+2 point</Point>}
              </Content>
              {type === "alphabet" && (
                <AlphabetWrapper style={{ marginRight: "var(--gap-2)" }}>
                  <AboutIcon alphabet={alphabet[0] as Alphabet} size="xs" isActive />
                  <Box mx={1}>
                    <ArrowIcon />
                  </Box>
                  <AboutIcon alphabet={alphabet[1] as Alphabet} size="xs" isActive />
                </AlphabetWrapper>
              )}
              {type === "friend" || type === "alphabet" ? (
                item.status === "pending" ? (
                  <FriendButtons>
                    <Button
                      mr={2}
                      size="xs"
                      border="var(--border)"
                      borderColor="mint"
                      borderRadius="12px"
                      fontSize="10px"
                      variant="ghost"
                      color="var(--color-mint)"
                      onClick={() =>
                        onClickFriendRequest(
                          type,
                          "approval",
                          item.from,
                          type === "alphabet" && (alphabet as Alphabet[]),
                        )
                      }
                    >
                      수락
                    </Button>
                    <Button
                      fontSize="10px"
                      border="1px solid var(--gray-600)"
                      borderRadius="12px"
                      size="xs"
                      color="var(--gray-600)"
                      variant="ghost"
                      onClick={() =>
                        onClickFriendRequest(
                          type,
                          "refusal",
                          item.from,
                          type === "alphabet" && (alphabet as Alphabet[]),
                        )
                      }
                    >
                      거절
                    </Button>
                  </FriendButtons>
                ) : item.status === "response" ? (
                  <Date>{item?.createdAt && getDateDiff(dayjs(item.createdAt))}</Date>
                ) : (
                  <FriendComplete>{item.status === "approval" ? "수락" : "거절"}</FriendComplete>
                )
              ) : (
                <Date>{item?.createdAt && getDateDiff(dayjs(item.createdAt))}</Date>
              )}
            </Item>
          );
        })}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="m233-440 75 75q11 12 11.5 28.5T308-308q-12 12-28 12t-28-12L108-452q-6-6-8.5-13T97-480q0-8 2.5-15t8.5-13l144-144q12-12 28-12t28 12q12 12 12 28.5T308-595l-75 75h494l-75-75q-11-12-11.5-28.5T652-652q12-12 28-12t28 12l144 144q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L708-308q-12 12-28 12t-28-12q-12-12-12-28.5t12-28.5l75-75H233Z" />
    </svg>
  );
}

const AlphabetWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 8px;

  > span {
    margin: 0 var(--gap-1);
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: var(--gap-2) var(--gap-5);
  font-size: 13px;
  border-bottom: 1px solid var(--gray-200);
`;

const Name = styled.div`
  font-weight: 600;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: var(--gap-2);
`;

const Point = styled.span`
  margin-left: var(--gap-1);
  color: var(--color-mint);
  font-size: 12px;
  font-weight: 600;
`;

const Date = styled.span`
  margin-left: auto;
  white-space: nowrap;
  color: var(--gray-500);
  font-size: 10px;
`;

const FriendButtons = styled.div`
  margin-left: auto;
  display: flex;
`;

const FriendComplete = styled.span`
  margin-left: auto;
  color: var(--gray-500);
  font-size: 10px;
`;

export default NoticeActive;
