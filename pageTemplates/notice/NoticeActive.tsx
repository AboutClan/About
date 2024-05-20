import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { AlphabetIcon } from "../../components/atoms/Icons/AlphabetIcon";
import { ActiveIcon } from "../../components/atoms/Icons/NoticeIcons";
import { NOTICE_ACTIVE_LOG } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast, useFailToast } from "../../hooks/custom/CustomToast";
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
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const failToast = useFailToast();
  let statusType: "approval" | "refusal" | "response";

  const resetQueryData = useResetQueryData();

  const { data: userInfo } = useUserInfoQuery();
  const { mutate: registerFriend } = useUserFriendMutation("patch", {
    onError: errorToast,
  });
  const { mutate: changeAlphabet } = useAlphabetMutation("change");

  const { mutate: interactionFriend } = useInteractionMutation("friend", "patch", {
    onSuccess() {
      if (statusType === "approval") completeToast("free", "수락 완료 !");
      if (statusType === "refusal") completeToast("free", "거절하였습니다.");
      statusType = null;
      resetQueryData([NOTICE_ACTIVE_LOG]);
    },
  });
  const { mutate: interactionAlphabet } = useInteractionMutation("alphabet", "patch", {
    onSuccess() {
      if (statusType === "approval") completeToast("free", "수락 완료 !");
      if (statusType === "refusal") failToast("free", "거절하였습니다.");
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

          return (
            <Item key={idx}>
              <IconWrapper>
                <ActiveIcon type={item.type} />
              </IconWrapper>
              <Name>
                {name}
                {type === "alphabet" && `(${alphabet[0]})`}
              </Name>
              <Content>
                님{message} {type === "like" && <Point>+2 point</Point>}
              </Content>
              {type === "alphabet" && (
                <AlphabetWrapper style={{ marginRight: "var(--gap-2)" }}>
                  <AlphabetIcon alphabet={alphabet[0] as Alphabet} isCircle={true} />
                  <span>
                    <i className="fa-solid fa-arrow-right" />
                  </span>
                  <AlphabetIcon alphabet={alphabet[1] as Alphabet} isCircle={true} />
                </AlphabetWrapper>
              )}
              {type === "friend" || type === "alphabet" ? (
                item.status === "pending" ? (
                  <FriendButtons>
                    <Button
                      mx="var(--gap-1)"
                      size="xs"
                      border="1px solid var(--color-mint)"
                      borderRadius="11px"
                      fontSize="12px"
                      fontWeight="700"
                      mr="var(--gap-2)"
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
                      fontSize="12px"
                      border="1px solid var(--gray-800)"
                      borderRadius="11px"
                      size="xs"
                      color="var(--gray-800)"
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
                  <FriendComplete>
                    {item.status === "approval" ? "수락 완료" : "거절 완료"}
                  </FriendComplete>
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
  padding: var(--gap-3) var(--gap-5);
  font-size: 13px;
  border-bottom: 1px solid var(--gray-200);
`;

const IconWrapper = styled.div`
  margin-right: var(--gap-2);
`;

const Name = styled.div`
  font-weight: 600;
  white-space: nowrap;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 22px;
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
  color: var(--gray-700);
  font-size: 11px;
`;

const FriendButtons = styled.div`
  margin-left: auto;
  display: flex;
`;

const FriendComplete = styled.span`
  margin-left: auto;
  color: var(--gray-700);
  font-weight: 500;
  font-size: 12px;
`;

export default NoticeActive;
