import { Button } from "@chakra-ui/react";

interface CurrentLocationBtnProps {
  onClick: () => void;
  isBig: boolean;
}

function CurrentLocationBtn({ onClick, isBig }: CurrentLocationBtnProps) {
  const size = isBig ? "48px" : "32px";
  return (
    <Button
      rounded="full"
      bgColor="white"
      boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
      w={size}
      h={size}
      size="sm"
      p="0"
      border="1px solid var(--gray-100)"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={isBig ? "24px" : "16px"}
        width={isBig ? "24px" : "16px"}
        viewBox="0 -960 960 960"
        fill={isBig ? "var(--gray-900)" : "#424242"}
      >
        <path d="M440-82v-40q-125-14-214.5-103.5T122-440H82q-17 0-28.5-11.5T42-480q0-17 11.5-28.5T82-520h40q14-125 103.5-214.5T440-838v-40q0-17 11.5-28.5T480-918q17 0 28.5 11.5T520-878v40q125 14 214.5 103.5T838-520h40q17 0 28.5 11.5T918-480q0 17-11.5 28.5T878-440h-40q-14 125-103.5 214.5T520-122v40q0 17-11.5 28.5T480-42q-17 0-28.5-11.5T440-82Zm40-118q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z" />
      </svg>
    </Button>
  );
}

export default CurrentLocationBtn;
