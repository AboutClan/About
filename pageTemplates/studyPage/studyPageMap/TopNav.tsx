import { Button, Flex } from "@chakra-ui/react";
import { MouseEvent } from "react";

import CurrentLocationBtn from "../../../components/atoms/CurrentLocationBtn";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { StudyPlaceFilter } from "../../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../../utils/validationUtils";

interface TopNavProps {
  handleLocationRefetch: () => void;
  isMapExpansion: boolean;
  onClose: () => void;
  filterType: StudyPlaceFilter;
  setFilterType: DispatchType<StudyPlaceFilter>;
  isMainType?: boolean;
  openList: () => void;
  isCafeMap: boolean;
  addCafe: () => void;
}

function TopNav({
  handleLocationRefetch,
  isMapExpansion,
  filterType,
  setFilterType,
  isMainType,
  openList,
  addCafe,
}: TopNavProps) {
  const handleFilter = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    type: StudyPlaceFilter,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setFilterType(type);
  };

  return (
    <>
      <Flex
        w="100%"
        // direction={isMapExpansion ? "row" : "row-reverse"}
        justify="space-between"
        align="center"
        px={5}
        py={4}
        position="absolute"
        top={isMapExpansion ? "0" : "0"}
        left="0"
        zIndex={100}
      >
        <Flex gap={2} h="36px">
          <Button
            h="36px"
            mr={1}
            px={4}
            borderRadius="20px"
            border={filterType === "all" ? "none" : "1px solid"}
            borderColor="gray.200"
            boxShadow="0px 4px 12px rgba(66, 66, 66, 0.10)"
            bg={filterType === "all" ? "gray.800" : "white"}
            fontSize="12px"
            color={filterType === "all" ? "white" : "gray.800"}
            fontWeight={700}
            lineHeight="1"
            letterSpacing="-0.01em"
            transition="all 0.15s ease"
            onClick={(e) => handleFilter(e, "all")}
            _hover={{
              bg: filterType === "all" ? "gray.900" : "gray.50",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: filterType === "all" ? "gray.900" : "gray.100",
              transform: "translateY(0)",
            }}
            _focus={{
              boxShadow: "0 0 0 3px rgba(0,0,0,0.06)",
            }}
          >
            모든 카공 카페
          </Button>

          {isMapExpansion && !isMainType && (
            <Button
              h="36px"
              px={4}
              borderRadius="20px"
              border={filterType === "good" ? "none" : "1px solid"}
              borderColor="gray.200"
              boxShadow="0px 4px 12px rgba(66, 66, 66, 0.10)"
              bg={filterType === "good" ? "gray.900" : "white"}
              fontSize="12px"
              color={filterType === "good" ? "white" : "gray.800"}
              fontWeight={700}
              lineHeight="1"
              letterSpacing="-0.01em"
              transition="all 0.15s ease"
              onClick={(e) => handleFilter(e, "good")}
              _hover={{
                bg: filterType === "good" ? "gray.900" : "gray.50",
                transform: "translateY(-1px)",
              }}
              _active={{
                bg: filterType === "good" ? "gray.900" : "gray.100",
                transform: "translateY(0)",
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(0,0,0,0.06)",
              }}
            >
              인기 카공 스팟
            </Button>
          )}

          {!isMainType && (
            <Button
              h="36px"
              px={4}
              borderRadius="20px"
              border={filterType === "best" ? "none" : "1px solid"}
              borderColor="gray.200"
              boxShadow="0px 4px 12px rgba(66, 66, 66, 0.10)"
              bg={filterType === "best" ? "gray.900" : "white"}
              fontSize="12px"
              color={filterType === "best" ? "white" : "gray.800"}
              fontWeight={700}
              lineHeight="1"
              letterSpacing="-0.01em"
              transition="all 0.15s ease"
              onClick={(e) => handleFilter(e, "best")}
              _hover={{
                bg: filterType === "best" ? "gray.900" : "gray.50",
                transform: "translateY(-1px)",
              }}
              _active={{
                bg: filterType === "best" ? "gray.900" : "gray.100",
                transform: "translateY(0)",
              }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(0,0,0,0.06)",
              }}
            >
              베스트 카공 스팟
            </Button>
          )}
        </Flex>

        {!isMapExpansion && (
          <Button
            borderRadius="8px"
            bg="white"
            boxShadow="0px 4px 12px rgba(66, 66, 66, 0.10)"
            w="36px"
            h="36px"
            p="0"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.15s ease"
            _hover={{
              bg: "gray.50",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "gray.100",
              transform: "translateY(0)",
            }}
          >
            <ExpansionIcon />
          </Button>
        )}
      </Flex>
      {isMapExpansion && (
        <Flex
          flexDir="column"
          pos="absolute"
          bottom={getSafeAreaBottom(80)}
          right="20px"
          zIndex={300}
        >
          {/* <Button
            rounded="full"
            bgColor="white"
            boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
            w="40px"
            h="40px"
            mb={3}
            size="sm"
            p="0"
            border="var(--border-main)"
            borderColor="var(--gray-300)"
            onClick={() => {
              openAddCafeDrawer();
            }}
          >
            <AddCafeIcon />
          </Button> */}
          {/* <CurrentLocationBtn onClick={handleLocationRefetch} isBig={true} /> */}
        </Flex>
      )}
      {isMapExpansion && (
        <Flex flexDir="column" pos="absolute" w="full" bottom={0} left={0} zIndex={300}>
          <Flex px={5} justify="space-between" align="center" mb={4}>
            <CurrentLocationBtn onClick={handleLocationRefetch} isBig={true} />
            {!isMainType && (
              <>
                <Button
                  leftIcon={<MenuIcon />}
                  borderRadius="full"
                  border="var(--border-main)"
                  borderColor="var(--gray-300)"
                  boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
                  bg="white"
                  mt="2px"
                  fontSize="13px"
                  iconSpacing={3}
                  h="40px"
                  onClick={() => openList()}
                >
                  리스트로 보기
                </Button>

                <Button
                  rounded="full"
                  bgColor="white"
                  boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
                  w="40px"
                  h="40px"
                  size="sm"
                  p="0"
                  border="var(--border-main)"
                  borderWidth="1px"
                  borderColor="var(--gray-300)"
                  onClick={addCafe}
                >
                  <AddCafeIcon />
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default TopNav;

export function AddCafeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="var(--gray-800)"
    >
      <path d="M720-160h-80q-17 0-28.5-11.5T600-200q0-17 11.5-28.5T640-240h80v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80h80q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160h-80v80q0 17-11.5 28.5T760-40q-17 0-28.5-11.5T720-80v-80Zm-600 0q-17 0-28.5-11.5T80-200v-200h-7q-19 0-31-14.5T34-448l40-200q3-14 14-23t25-9h534q14 0 25 9t14 23l40 200q4 19-8 33.5T687-400h-7v80q0 17-11.5 28.5T640-280q-17 0-28.5-11.5T600-320v-80H440v200q0 17-11.5 28.5T400-160H120Zm40-80h200v-160H160v160Zm-38-240h516-516Zm-2-240q-17 0-28.5-11.5T80-760q0-17 11.5-28.5T120-800h520q17 0 28.5 11.5T680-760q0 17-11.5 28.5T640-720H120Zm2 240h516l-24-120H146l-24 120Z" />
    </svg>
  );
}
export function AddCafeIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-800)"
    >
      <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-900)"
    >
      <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
    </svg>
  );
}

export function ExpansionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="#424242"
    >
      <path d="M160-120q-17 0-28.5-11.5T120-160v-240q0-17 11.5-28.5T160-440q17 0 28.5 11.5T200-400v144l504-504H560q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v240q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-144L256-200h144q17 0 28.5 11.5T440-160q0 17-11.5 28.5T400-120H160Z" />
    </svg>
  );
}

export function StudyIcon({ color }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="45"
        viewBox="0 0 37 45"
        fill="none"
      >
        <rect
          x="2"
          y="3"
          width="32"
          height="32"
          rx="16"
          fill={color === "orange" ? "#ffa501" : "#00C2B3"}
        />
        <path
          d="M12.825 25.4829C12.4226 25.3079 12.1105 25.0658 11.8889 24.7567C11.6731 24.4417 11.5652 24.0801 11.5652 23.6718C11.5652 23.3685 11.6439 22.9982 11.8014 22.5607L14.881 14.608C15.1668 13.8789 15.5809 13.319 16.1234 12.9282C16.6716 12.5316 17.2957 12.3333 17.9956 12.3333C18.7014 12.3333 19.3255 12.5316 19.8679 12.9282C20.4162 13.319 20.8332 13.8789 21.119 14.608L24.1986 22.5607C24.3561 23.0215 24.4348 23.3919 24.4348 23.6718C24.4348 24.0801 24.324 24.4417 24.1024 24.7567C23.8866 25.0658 23.5774 25.3079 23.175 25.4829C22.895 25.6053 22.6092 25.6666 22.3176 25.6666C21.9035 25.6666 21.5185 25.5354 21.1627 25.2729C20.8128 25.0104 20.5532 24.6459 20.3841 24.1793L20.1829 23.5843H15.8347L15.6159 24.1793C15.4584 24.6342 15.2018 24.9958 14.846 25.2641C14.4961 25.5324 14.1082 25.6666 13.6824 25.6666C13.3908 25.6666 13.105 25.6053 12.825 25.4829ZM17.0333 19.9798H18.9668L17.9956 16.5065L17.0333 19.9798Z"
          fill="white"
        />
        <path
          d="M18.433 37.3999C18.2405 37.7332 17.7594 37.7332 17.5669 37.3999L15.7699 34.2874C15.5775 33.9541 15.818 33.5374 16.2029 33.5374L19.797 33.5374C20.1819 33.5374 20.4224 33.9541 20.23 34.2874L18.433 37.3999Z"
          fill={color === "orange" ? "#ffa501" : "#00C2B3"}
        />
        <g opacity="0.12" filter="url(#filter0_f_35_316)">
          <ellipse cx="18" cy="41.1499" rx="16" ry="1" fill="#424242" />
        </g>
        <defs>
          <filter
            id="filter0_f_35_316"
            x="0"
            y="38.1499"
            width="36"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_35_316" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
