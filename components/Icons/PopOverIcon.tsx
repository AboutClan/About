import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import styled from "styled-components";

interface IPopoverIcon {
  title: string;
  text: string;
  size?: "xs" | "md";
  marginDir?: "left" | "right";
  isMint?: boolean;
}

export function PopOverIcon({
  title,
  text,
  size = "md",
  marginDir = "left",
  isMint,
}: IPopoverIcon) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconWrapper>
          <i
            className={`fa-regular fa-question-circle fa-${size}`}
            style={{ color: isMint ? "var(--color-mint)" : "var(--gray-500)" }}
          />
        </IconWrapper>
      </PopoverTrigger>
      <PopoverContent
        ml={marginDir === "left" && "var(--gap-2)"}
        mr={marginDir === "right" && "var(--gap-2)"}
        fontSize="12px"
        _focus={{ outline: "none", boxShadow: "none" }}
        width={size === "xs" ? "120px" : undefined}
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="600">{title}</PopoverHeader>
        <PopoverBody fontWeight={400}>{text}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const IconWrapper = styled.div`
  margin-left: var(--gap-2);
`;
