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
}

export function PopOverIcon({ title, text, size = "md", marginDir = "left" }: IPopoverIcon) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconWrapper>
          <i
            className={`fa-light fa-question-circle fa-${size}`}
            style={{ color: "var(--gray-500)" }}
          />
        </IconWrapper>
      </PopoverTrigger>
      <PopoverContent
        ml={marginDir === "left" && "var(--gap-2)"}
        mr={marginDir === "right" && "var(--gap-2)"}
        fontSize="12px"
        _focus={{ outline: "none", boxShadow: "none" }}
        width={size === "xs" && "120px"}
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
