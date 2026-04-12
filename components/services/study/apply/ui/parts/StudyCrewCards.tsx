import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

import { CrewLocationProps } from "../../../../../../constants/service/study/place";
import { LocationProps } from "../../../../../../types/common";
import { StudyCrew } from "../../../../../../types/models/studyTypes/study-entity.types";

interface MainCardProps {
  isSelected: boolean;
  handleClick: (c: StudyCrew) => void;
  title: StudyCrew;
  subTitle: string;
  memberCnt: {
    current: number;
    max: number;
  };
  image: string;
}

export function MainCard({
  title,
  subTitle,
  memberCnt,
  image,
  isSelected,
  handleClick,
}: MainCardProps) {
  return (
    <Flex
      w="full"
      as="button"
      h="92px"
      border={isSelected ? "var(--border-mint)" : "var(--border-main)"}
      borderRadius="12px"
      align="center"
      bg={isSelected ? "rgba(0,194,179,0.02)" : "white"}
      borderWidth="1px"
      p={4}
      mb={3}
      gap={4}
      onClick={() => handleClick(title)}
    >
      <Flex align="center" justify="center">
        {isSelected ? <CheckIcon /> : <Check2Icon />}
      </Flex>

      <Flex flexDir="column" flex="1" mr={4} align="start">
        <Text fontSize="14px" lineHeight="20px" fontWeight="600" color="gray.800" mb={1}>
          {title} 지역
        </Text>

        <Text fontSize="12px" fontWeight="700" color="gray.500" lineHeight="12px" mb={3}>
          {subTitle}
        </Text>

        <Flex align="center" fontSize="12px" fontWeight="700">
          <Box w={3} h={3} mr={1}>
            <UserIcon />
          </Box>
          <Box
            color="var(--color-gray)"
            fontSize="10px"
            lineHeight="12px"
            fontWeight={600}
            mr={0.5}
          >
            {memberCnt.current}명 참여중
          </Box>
          <Box color="gray.400" mr={0.5} fontSize="10px">
            /
          </Box>
          <Box color="gray.500" fontSize="10px">
            총 {memberCnt.max}명
          </Box>
        </Flex>
      </Flex>
      <Box w="60px" h="60px" borderRadius="4px" overflow="hidden">
        <Image src={image} alt="장소 썸네일" width={60} height={60} objectFit="cover" />
      </Box>
    </Flex>
  );
}

interface SubCardProps {
  isSelected: boolean;
  handleClick: (place: LocationProps) => void;

  location: CrewLocationProps;
}

export function SubCard({ isSelected, handleClick, location }: SubCardProps) {
  return (
    <Flex
      mb={2}
      as="button"
      p={4}
      pl={5}
      w="full"
      border={isSelected ? "1.5px solid var(--color-orange)" : "var(--border-main)"}
      onClick={() => handleClick(location)}
      borderRadius="12px"
      align="center"
      bg={isSelected ? "rgba(255,165,0,0.02)" : "white"}
    >
      <Box>
        <ArrowIcon />
      </Box>
      <Flex flexDir="column" mx={4} align="start">
        <Flex fontSize="14px" fontWeight={600} lineHeight="20px" mr={1}>
          {location.name}
        </Flex>
        <Flex align="center" fontSize="12px" fontWeight="700">
          <Box
            color="var(--color-gray)"
            fontSize="10px"
            lineHeight="12px"
            fontWeight={600}
            mr={0.5}
          >
            {location.standard}
          </Box>
          <Box color="gray.400" mr={0.5} fontSize="10px">
            /
          </Box>
          <Box color="gray.500" fontSize="10px">
            {location.address}
          </Box>
        </Flex>
      </Flex>
      <Flex align="center" justify="center" ml="auto">
        {isSelected ? <OrangeCheckIcon /> : <Check2Icon />}
      </Flex>
    </Flex>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M16.207 9.215L10.624 14.799C10.4359 14.9858 10.1816 15.0906 9.9165 15.0906C9.65141 15.0906 9.39708 14.9858 9.209 14.799L5.793 11.383C5.70016 11.2902 5.62651 11.1799 5.57626 11.0586C5.52601 10.9373 5.50015 10.8073 5.50015 10.676C5.50015 10.4108 5.60549 10.1565 5.793 9.969C5.98051 9.78149 6.23482 9.67615 6.5 9.67615C6.76518 9.67615 7.01949 9.78149 7.207 9.969L9.916 12.678L14.793 7.801C14.8858 7.70816 14.9961 7.63451 15.1174 7.58426C15.2387 7.53401 15.3687 7.50815 15.5 7.50815C15.6313 7.50815 15.7613 7.53401 15.8826 7.58426C16.0039 7.63451 16.1142 7.70816 16.207 7.801C16.2998 7.89384 16.3735 8.00407 16.4237 8.12537C16.474 8.24668 16.4998 8.3767 16.4998 8.508C16.4998 8.6393 16.474 8.76932 16.4237 8.89063C16.3735 9.01193 16.2998 9.12216 16.207 9.215ZM11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0Z"
        fill="#00C2B3"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M8.44346 3.32201C8.4435 3.64342 8.38022 3.96169 8.25725 4.25864C8.13429 4.5556 7.95403 4.82543 7.72678 5.05272C7.49954 5.28002 7.22974 5.46033 6.93281 5.58336C6.63588 5.70638 6.31762 5.76972 5.99621 5.76976C5.3471 5.76982 4.72454 5.51202 4.2655 5.05308C3.80645 4.59413 3.54853 3.97162 3.54846 3.32251C3.54843 3.0011 3.61171 2.68283 3.73467 2.38587C3.85764 2.08891 4.03789 1.81908 4.26514 1.59179C4.72409 1.13275 5.3466 0.874822 5.99571 0.874756C6.64483 0.87469 7.26739 1.13249 7.72643 1.59144C8.18547 2.05038 8.4434 2.67289 8.44346 3.32201ZM5.99596 6.51851C2.47146 6.51851 1.10046 8.76151 1.10046 9.80501C1.10046 10.848 4.01896 11.126 5.99596 11.126C7.97296 11.126 10.8915 10.848 10.8915 9.80501C10.8915 8.76151 9.52046 6.51851 5.99596 6.51851Z"
        fill="#A0AEC0"
      />
    </svg>
  );
}

function Check2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M17.207 10.215L11.624 15.799C11.4359 15.9858 11.1816 16.0906 10.9165 16.0906C10.6514 16.0906 10.3971 15.9858 10.209 15.799L6.793 12.383C6.70016 12.2902 6.62651 12.1799 6.57626 12.0586C6.52601 11.9373 6.50015 11.8073 6.50015 11.676C6.50015 11.4108 6.60549 11.1565 6.793 10.969C6.98051 10.7815 7.23482 10.6762 7.5 10.6762C7.76518 10.6762 8.01949 10.7815 8.207 10.969L10.916 13.678L15.793 8.801C15.8858 8.70816 15.9961 8.63451 16.1174 8.58426C16.2387 8.53401 16.3687 8.50815 16.5 8.50815C16.6313 8.50815 16.7613 8.53401 16.8826 8.58426C17.0039 8.63451 17.1142 8.70816 17.207 8.801C17.2998 8.89384 17.3735 9.00407 17.4237 9.12537C17.474 9.24668 17.4998 9.3767 17.4998 9.508C17.4998 9.6393 17.474 9.76932 17.4237 9.89063C17.3735 10.0119 17.2998 10.1222 17.207 10.215ZM12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1Z"
        fill="#E0E0E0"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.19331 2.66661C2.19331 2.25994 2.51997 1.93994 2.92664 1.93994H2.93331C3.33997 1.93994 3.66664 2.27327 3.65997 2.67994L3.63331 8.39994C3.63331 8.66661 3.73331 8.91994 3.92664 9.10661C4.11331 9.29327 4.36664 9.39994 4.63331 9.39994H12.0066L9.38664 6.77994C9.09997 6.49327 9.09997 6.02661 9.38664 5.73994C9.67331 5.45327 10.1333 5.45327 10.4266 5.73994L14.3 9.61327C14.44 9.75327 14.5133 9.93994 14.5133 10.1333C14.5133 10.3266 14.4333 10.5133 14.3 10.6533L10.4266 14.5266C10.2866 14.6666 10.0933 14.7399 9.90664 14.7399C9.71997 14.7399 9.53331 14.6666 9.38664 14.5266C9.09997 14.2399 9.09997 13.7733 9.38664 13.4933L12.0066 10.8733H4.62664C3.96664 10.8733 3.34664 10.6133 2.87997 10.1466C2.41331 9.67994 2.15997 9.05994 2.15997 8.39994L2.19331 2.66661Z"
        fill="#FFA500"
      />
    </svg>
  );
}

function OrangeCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M17.207 10.215L11.624 15.799C11.4359 15.9858 11.1816 16.0906 10.9165 16.0906C10.6514 16.0906 10.3971 15.9858 10.209 15.799L6.793 12.383C6.70016 12.2902 6.62651 12.1799 6.57626 12.0586C6.52601 11.9373 6.50015 11.8073 6.50015 11.676C6.50015 11.4108 6.60549 11.1565 6.793 10.969C6.98051 10.7815 7.23482 10.6762 7.5 10.6762C7.76518 10.6762 8.01949 10.7815 8.207 10.969L10.916 13.678L15.793 8.801C15.8858 8.70816 15.9961 8.63451 16.1174 8.58426C16.2387 8.53401 16.3687 8.50815 16.5 8.50815C16.6313 8.50815 16.7613 8.53401 16.8826 8.58426C17.0039 8.63451 17.1142 8.70816 17.207 8.801C17.2998 8.89384 17.3735 9.00407 17.4237 9.12537C17.474 9.24668 17.4998 9.3767 17.4998 9.508C17.4998 9.6393 17.474 9.76932 17.4237 9.89063C17.3735 10.0119 17.2998 10.1222 17.207 10.215ZM12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1Z"
        fill="#FFA500"
      />
    </svg>
  );
}
