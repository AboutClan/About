/* eslint-disable */
// import './button.css';

import { Button as ChakraButton } from "@chakra-ui/react";
export interface BasicButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export function BasicButton({
  primary = true,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: BasicButtonProps) {
  const secondaryOptions = {
    color: "mint",
    backgroundColor: "white",
    border: "1.2px solid #00c2b3",
  };

  return (
    <ChakraButton
      type="button"
      colorScheme={primary ? "mintTheme" : null}
      {...(!primary ? secondaryOptions : {})}
      {...props}
    >
      {label}
    </ChakraButton>
  );
}
