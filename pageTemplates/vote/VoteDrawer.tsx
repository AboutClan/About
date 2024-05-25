import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import { StudyVoteMapActionType } from "../../pages/vote";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../types/models/studyTypes/studyInterActions";

export interface VoteDrawerItemProps {
  place: IPlace;
  voteCnt: number;
  favoritesCnt: number;
  myFavorite: "first" | "second";
}

interface VoteDrawerProps {
  items: VoteDrawerItemProps[];
  myVote: IStudyVoteWithPlace;
  setMyVote: DispatchType<IStudyVoteWithPlace>;
  setActionType: DispatchType<StudyVoteMapActionType>;
}

function VoteDrawer({ items, myVote, setMyVote, setActionType }: VoteDrawerProps) {
  if (!items) return null;
  console.log("items", items);

  const [placeItems, setPlaceItems] = useState(items);

  useEffect(() => {
    if (myVote?.place) {
      setPlaceItems((item) => item.filter((place) => place.place._id !== myVote.place._id));
    } else setPlaceItems(items);
  }, [myVote?.place]);

  const onClickItem = (item: VoteDrawerItemProps) => {
    if (!myVote?.place) setMyVote({ place: item.place, subPlace: [], start: null, end: null });
    else
      setMyVote((prevState) => {
        const { subPlace } = prevState;
        const placeExists = subPlace?.some((obj) => obj._id === item.place._id);

        return {
          ...prevState,
          subPlace: placeExists
            ? subPlace.filter((obj) => obj._id !== item.place._id)
            : subPlace
              ? [...subPlace, item.place]
              : [item.place],
        };
      });
  };

  return (
    <>
      <BottomDrawerLg setIsModal={() => {}} height={300} isXPadding={false} isOverlay={false}>
        {myVote?.place && (
          <Flex
            pt="4px"
            pb="16px"
            w="100%"
            px="20px"
            h="84px"
            borderBottom="var(--border-main)"
            justify="space-between"
          >
            <Flex flex={0.9} direction="column" justify="space-between">
              <Box fontSize="18px" fontWeight={800}>
                {myVote.place.fullname}
              </Box>
              <Flex fontSize="12px" align="center">
                <Box>{myVote.place.locationDetail}</Box>
                <Button
                  size="xs"
                  ml="auto"
                  onClick={() => setMyVote({ place: null, subPlace: [], start: null, end: null })}
                >
                  선택 취소
                </Button>
              </Flex>
            </Flex>
            <Button
              w="60px"
              h="60px"
              colorScheme="mintTheme"
              onClick={() => setActionType("timeSelect")}
            >
              <Flex direction="column" h="100%" py="8px" justify="space-between" align="center">
                <Box fontSize="24px" mb="2px">
                  <i className="fa-solid fa-circle-check " />
                </Box>
                <Box fontSize="13px" fontWeight={400}>
                  결정
                </Box>
              </Flex>
            </Button>
          </Flex>
        )}
        <Box overflow="auto" w="100%" flex={1}>
          {placeItems.map((item, idx) => (
            <Flex
              key={idx}
              py="8px"
              align="center"
              pl="16px"
              pr="20px"
              borderBottom="var(--border-main)"
              onClick={() => onClickItem(item)}
              as="button"
              w="100%"
            >
              <HeartButton>
                {myVote?.place ? (
                  <i className="fa-regular fa-turn-down-right fa-lg" />
                ) : item.myFavorite ? (
                  <i
                    className="fa-solid fa-heart"
                    style={{
                      color:
                        item.myFavorite === "first" ? "var(--color-red)" : "var(--color-orange)",
                    }}
                  />
                ) : (
                  <i className="fa-regular fa-heart" />
                )}
              </HeartButton>

              <Flex direction="column" align="flex-start">
                <Box fontWeight={600} fontSize="16px">
                  {item.place.fullname}
                </Box>
                <Box color="var(--gray-600)" fontSize="14px">
                  <Box as="span">{item.voteCnt}명 참여중</Box>
                  {" / "}
                  <Box as="span">즐겨찾기: {item.favoritesCnt}</Box>
                </Box>
              </Flex>
              <Box ml="auto" mr="12px">
                {myVote?.subPlace?.map((obj) => obj._id).includes(item.place._id) ? (
                  <i
                    className="fa-solid fa-circle-check fa-xl"
                    style={{ color: "var(--color-orange)" }}
                  />
                ) : (
                  <i className="fa-regular fa-circle-check fa-xl" />
                )}
              </Box>
            </Flex>
          ))}
        </Box>
      </BottomDrawerLg>
    </>
  );
}

const HeartButton = styled.button`
  padding: 8px;
  margin-right: 12px;
`;

export default VoteDrawer;
