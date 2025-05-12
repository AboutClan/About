import { Box, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";

interface IPopoverIcon {
  text: string;
  size?: "xs" | "md" | "lg";
  marginDir?: "left" | "right";
  type?: "info";
  rightText?: string;
}

export function PopOverIcon({
  text,
  size = "md",
  marginDir = "left",
  type,
  rightText,
}: IPopoverIcon) {
  return (
    <Popover>
      <PopoverTrigger>
        <Flex ml={1} align="center">
          <Box>
            {type === "info" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14px"
                height="14px"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_2444_1052)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 7.66671C9.73479 7.66671 9.48044 7.56135 9.2929 7.37381C9.10537 7.18628 9.00001 6.93192 9.00001 6.66671C9.00001 6.40149 9.10537 6.14714 9.2929 5.9596C9.48044 5.77206 9.73479 5.66671 10 5.66671C10.2652 5.66671 10.5196 5.77206 10.7071 5.9596C10.8947 6.14714 11 6.40149 11 6.66671C11 6.93192 10.8947 7.18628 10.7071 7.37381C10.5196 7.56135 10.2652 7.66671 10 7.66671ZM10.8333 13.8625C10.8333 14.0836 10.7455 14.2955 10.5893 14.4518C10.433 14.6081 10.221 14.6959 10 14.6959C9.779 14.6959 9.56704 14.6081 9.41076 14.4518C9.25447 14.2955 9.16668 14.0836 9.16668 13.8625V9.69587C9.16668 9.47486 9.25447 9.2629 9.41076 9.10662C9.56704 8.95034 9.779 8.86254 10 8.86254C10.221 8.86254 10.433 8.95034 10.5893 9.10662C10.7455 9.2629 10.8333 9.47486 10.8333 9.69587V13.8625ZM10 0.833374C4.93751 0.833374 0.833344 4.93754 0.833344 10C0.833344 15.0625 4.93751 19.1667 10 19.1667C15.0625 19.1667 19.1667 15.0625 19.1667 10C19.1667 4.93754 15.0625 0.833374 10 0.833374Z"
                    fill="var(--color-icon)"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2444_1052">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="var(--color-icon)"
              >
                <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm2 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm4-572q25 0 43.5 16t18.5 40q0 22-13.5 39T502-525q-23 20-40.5 44T444-427q0 14 10.5 23.5T479-394q15 0 25.5-10t13.5-25q4-21 18-37.5t30-31.5q23-22 39.5-48t16.5-58q0-51-41.5-83.5T484-720q-38 0-72.5 16T359-655q-7 12-4.5 25.5T368-609q14 8 29 5t25-17q11-15 27.5-23t34.5-8Z" />
              </svg>
            )}
          </Box>
          {rightText && (
            <Box ml={1} lineHeight="20px" fontSize="11px" color="var(--color-gray)">
              {rightText}
            </Box>
          )}
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        ml={marginDir === "left" && "var(--gap-2)"}
        mr={marginDir === "right" && "var(--gap-2)"}
        fontSize="12px"
        _focus={{ outline: "none", boxShadow: "none" }}
        width={size === "xs" ? "120px" : "max-content"}
      >
        <PopoverBody
          fontSize="11px"
          border="var(--border)"
          bg="gray.100"
          fontWeight={400}
          color="gray.800"
        >
          {text}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
