import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { faBullseyeArrow, faGear, faRotateRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { useFailToast } from "../../hooks/custom/CustomToast";
import { DispatchNumber, DispatchType } from "../../types/hooks/reactTypes";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";

type ReturnDot = "중앙" | "동쪽" | "서쪽" | "남쪽" | "북쪽";

interface IVoteMapController extends IPrecisionPopOver {
  setPreset: (preset: "first" | "second" | null) => void;
  preset: "first" | "second" | null;
  setCenterValue: DispatchType<{ lat: number; lng: number }>;
  setMyVote: DispatchType<IStudyVote>;
}

function VoteMapController({
  preset,
  setPreset,
  precision,
  setPrecision,
  setMyVote,
  setCenterValue,
}: IVoteMapController) {
  const failToast = useFailToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const newSearchParams = new URLSearchParams(searchParams);
  const router = useRouter();

  const onClickRetrun = (type: ReturnDot) => {
    const LOCATION_RETURN_DOT = {
      수원: {
        중앙: { lat: 37.2789488, lng: 127.04293 },
        서쪽: { lat: 37.278888, lng: 126.991981 },
        북쪽: { lat: 37.287918, lng: 127.027491 },
        동쪽: { lat: 37.268884, lng: 127.058477 },
      },
      강남: {
        중앙: { lat: 37.503744, lng: 127.048898 },
      },
      안양: {
        중앙: { lat: 37.388896, lng: 126.950088 },
      },
      양천: {
        중앙: { lat: 37.527588, lng: 126.896441 },
        서쪽: { lat: 37.530588, lng: 126.856441 },
        동쪽: { lat: 37.517588, lng: 126.906441 },
      },
      동대문: {
        중앙: { lat: 37.584521, lng: 27.041047 },
        서쪽: { lat: 37.582025, lng: 127.003554 },
        북쪽: { lat: 37.601182, lng: 127.04285 },
      },
    };

    const returnDot = LOCATION_RETURN_DOT[location][type];
    setCenterValue(returnDot);
  };

  const onClickPreset = (type: "first" | "second" | null) => {
    if (preset === type) setPreset(null);
    else setPreset(type);

    // if (!preferInfo) {
    //   failToast("free", "설정된 스터디 프리셋이 없습니다.");
    //   return;
    // }
  };

  const navArr: ReturnDot[] = ["중앙", "서쪽", "동쪽", "북쪽"];

  const filterArr: ReturnDot[] = navArr.filter((dot) => {
    if (location === "양천" && dot === "북쪽") return false;
    if (location === "동대문" && dot === "동쪽") return false;
    if (location === "안양") return;
    if (location === "강남") return;
    return true;
  });

  const onClickSecond = () => {
    failToast("free", "2번 프리셋이 존재하지 않습니다.");
  };

  const onClickRetunBtn = () => {
    setMyVote(null);
    onClickRetrun("중앙");
  };

  const onClickGear = () => {
    newSearchParams.append("preset", "on");
    router.replace(pathname + "?" + newSearchParams.toString());
  };

  return (
    <>
      <Layout>
        <TopNav>
          <div>
            <ReturnBtn onClick={onClickRetunBtn}>
              <FontAwesomeIcon icon={faRotateRight} size="lg" />
            </ReturnBtn>
            {filterArr.map((item) => (
              <Button
                key={item}
                bg="white"
                borderRadius="var(--rounded)"
                size="sm"
                onClick={() => onClickRetrun(item)}
                fontSize="14px"
                color="var(--gray-2)"
                p="var(--gap-2) var(--gap-3)"
                h="34px"
                w="50px"
              >
                {item}
              </Button>
            ))}
          </div>
          <PrecisionPopOver precision={precision} setPrecision={setPrecision} />
        </TopNav>
        <BottomNav>
          <Box>
            <Button
              size="sm"
              w="34px"
              h="34px"
              border={preset !== "first" && "1px solid var(--gray-4)"}
              bgColor={preset === "first" ? "var(--color-mint) !important" : "white"}
              color={preset === "first" ? "white !important" : "var(--gray-2)"}
              mr="var(--gap-2)"
              onClick={() => onClickPreset("first")}
            >
              1
            </Button>
            <Button
              w="34px"
              h="34px"
              bgColor={preset === "second" ? "var(--color-mint)" : "white"}
              color={preset === "second" ? "white !important" : "var(--gray-2)"}
              size="sm"
              mr="var(--gap-2)"
              border="1px solid var(--gray-4)"
              onClick={() => onClickSecond()}
            >
              2
            </Button>
            <Button
              w="34px"
              h="34px"
              bgColor={preset === "second" ? "var(--color-mint)" : "white"}
              color={preset === "second" ? "white !important" : "var(--gray-2)"}
              size="sm"
              border="1px solid var(--gray-4)"
              onClick={onClickGear}
            >
              <FontAwesomeIcon icon={faGear} />
            </Button>
          </Box>
          <Box as="span" fontSize="16px" color="var(--color-mint)" fontWeight={600}>
            스터디 희망 장소를 터치해 주세요!
          </Box>
        </BottomNav>
      </Layout>
    </>
  );
}

interface IPrecisionPopOver {
  precision: number;
  setPrecision: DispatchNumber;
}

export function PrecisionPopOver({ precision, setPrecision }) {
  return (
    <Popover>
      <PopoverTrigger>
        <TargetIcon>
          <Button
            as="div"
            borderRadius="4px"
            w="34px"
            h="34px"
            border="1px solid var(--gray-5)"
            bg="white"
          >
            <FontAwesomeIcon icon={faBullseyeArrow} size="xl" />
          </Button>
        </TargetIcon>
      </PopoverTrigger>
      <PopoverContent w="120px" mr="var(--gap-2)" fontSize="12px" _focus={{ outline: "none" }}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="600">정밀도 단계</PopoverHeader>
        <PopoverBody display="flex" p="var(--gap-2)">
          <Button
            as="div"
            colorScheme={precision === 0 ? "mintTheme" : "gray"}
            size="xs"
            mr="var(--gap-2)"
            onClick={() => setPrecision(0)}
          >
            0
          </Button>
          <Button
            colorScheme={precision === 1 ? "mintTheme" : "gray"}
            size="xs"
            as="div"
            mr="var(--gap-2)"
            onClick={() => setPrecision(1)}
          >
            1
          </Button>
          <Button
            onClick={() => setPrecision(2)}
            as="div"
            colorScheme={precision === 2 ? "mintTheme" : "gray"}
            size="xs"
          >
            2
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const Layout = styled.div``;

const TopNav = styled.nav`
  padding: var(--gap-3) var(--gap-4);
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;

    button {
      margin-right: var(--gap-1);
    }
  }
`;

const BottomNav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 20px;
  align-items: center;
  position: absolute;
  bottom: var(--gap-2);
  left: var(--gap-2);
  z-index: 50;
`;

const ReturnBtn = styled.button`
  width: 34px;
  height: 34px;
  background-color: var(--color-mint);
  color: white;
  padding: 4px;
  border-radius: var(--rounded);
  border: 1px solid var(--gray-5);
`;

const TargetIcon = styled.button``;

export default VoteMapController;
