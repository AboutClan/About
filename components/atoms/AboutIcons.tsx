import { Flex } from "@chakra-ui/react";
import { Alphabet } from "../../types/models/collections";

const ALPHABET_BG: Record<Alphabet, string> = {
  A: "var(--color-red)",
  b: "var(--color-orange)",
  o: "var(--color-blue)",
  u: "var(--color-green)",
  t: "var(--color-purple)",
};

export const AboutIcon = ({
  alphabet,
  size = "md",
  isActive = true,
}: {
  alphabet: Alphabet;
  size?: "md" | "lg";
  isActive?: boolean;
}) => (
  <Flex
    justify="center"
    align="center"
    aspectRatio={1 / 1}
    w={size === "md" ? "48px" : size === "lg" ? "62px" : null}
    borderRadius="50%"
    bg={ALPHABET_BG[alphabet]}
  >
    {alphabet === "A" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M13.4695 21.2899L13.6191 17.4071H9.45502L8.23322 21.2899H3.4707L9.87891 3.4834H18.1073L18.2071 21.2899H13.4695ZM12.4472 7.81136L10.4773 14.0931H13.7438L14.0181 7.81136H12.4472Z"
          fill="white"
        />
      </svg>
    ) : alphabet === "b" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M14.3142 9.56477C15.8282 9.56477 16.8911 9.98709 17.5028 10.8317C17.9616 11.4307 18.191 12.1601 18.191 13.0201C18.191 13.3733 18.1528 13.7419 18.0763 14.1258L17.6175 16.7058C17.3575 18.1801 16.677 19.3165 15.5759 20.115C14.49 20.8982 13.1136 21.2898 11.4467 21.2898C9.79498 21.2898 8.52563 20.9597 7.63862 20.2993C6.93512 19.7772 6.58337 19.0477 6.58337 18.1109C6.58337 17.8652 6.60631 17.6118 6.65219 17.3508L9.08384 3.4834H12.9836L11.8137 10.1867C12.456 9.77209 13.2895 9.56477 14.3142 9.56477ZM14.1077 14.4713C14.123 14.3485 14.1306 14.1796 14.1306 13.9646C14.1306 13.7342 14.0312 13.4962 13.8324 13.2505C13.6489 12.9894 13.236 12.8589 12.5937 12.8589C11.9666 12.8589 11.5155 13.0508 11.2402 13.4347L10.5749 17.2817C10.7585 17.7424 11.1408 17.9727 11.7219 17.9727C12.8995 17.9727 13.5954 17.3815 13.8095 16.199L14.1077 14.4713Z"
          fill="white"
        />
      </svg>
    ) : alphabet === "o" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M13.8287 7.02832C15.9468 7.02832 17.5451 7.49112 18.6238 8.41671C19.4671 9.14536 19.8888 10.1596 19.8888 11.4593C19.8888 11.8926 19.8397 12.3652 19.7417 12.8773L19.1239 16.3335C18.7513 18.421 17.8785 19.898 16.5057 20.7645C15.1525 21.631 13.3384 22.0642 11.0635 22.0642C8.78849 22.0642 7.12148 21.631 6.06245 20.7645C5.27798 20.1146 4.88574 19.1398 4.88574 17.84C4.88574 17.387 4.93477 16.8849 5.03283 16.3335L5.6506 12.8773C6.33701 8.97797 9.06305 7.02832 13.8287 7.02832ZM14.623 13.4681C14.6622 13.2711 14.6818 13.025 14.6818 12.7296C14.6818 12.4145 14.5544 12.0698 14.2994 11.6957C14.0444 11.3215 13.5934 11.1344 12.9462 11.1344C12.3186 11.1344 11.7891 11.351 11.3576 11.7843C10.9262 12.1978 10.6516 12.7591 10.5339 13.4681L10.1515 15.6836C10.1123 15.8805 10.0927 16.1365 10.0927 16.4516C10.0927 16.747 10.2201 17.072 10.4751 17.4264C10.7301 17.7809 11.1713 17.9582 11.7989 17.9582C12.4461 17.9582 12.9854 17.7415 13.4169 17.3083C13.8483 16.8553 14.1229 16.3138 14.2406 15.6836L14.623 13.4681Z"
          fill="white"
        />
      </svg>
    ) : alphabet === "u" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18.1224 16.6018C18.1224 17.1254 18.3831 17.3872 18.9046 17.3872C19.4461 17.3872 19.8974 17.2865 20.2584 17.0851L20.108 20.4988C19.1453 21.2843 18.0622 21.677 16.8589 21.677C14.5925 21.677 13.359 20.8009 13.1584 19.0488C11.9551 20.8009 10.3305 21.677 8.28473 21.677C6.25903 21.677 4.94533 21.2138 4.34364 20.2874C3.94251 19.7033 3.74194 19.0387 3.74194 18.2935C3.74194 17.5483 3.80211 16.8636 3.92245 16.2393L5.60719 6.72314H10.7216L9.3076 14.759C9.24743 15.1215 9.21735 15.484 9.21735 15.8465C9.21735 16.8132 9.75887 17.2966 10.8419 17.2966C11.7445 17.2966 12.4665 16.9844 13.008 16.3601L14.7228 6.72314H19.8372L18.1525 16.2393C18.1324 16.3601 18.1224 16.4809 18.1224 16.6018Z"
          fill="white"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M10.7678 21.6771C8.69635 21.6771 7.20524 21.2108 6.2945 20.2784C5.61591 19.5969 5.27661 18.6824 5.27661 17.5348C5.27661 17.1582 5.31233 16.7547 5.38376 16.3244L7.20524 5.91485L12.1072 3.87061L11.3304 8.36256H18.7234L18.0538 12.1552H10.6607L10.125 15.1946C10.0535 15.5354 10.0178 15.8402 10.0178 16.1092C10.0178 17.2389 10.5535 17.8037 11.625 17.8037C12.1965 17.8037 12.6697 17.5617 13.0447 17.0775C13.4376 16.5933 13.7054 15.9478 13.8483 15.1409H18.2948C17.5448 19.4983 15.0358 21.6771 10.7678 21.6771Z"
          fill="white"
        />
      </svg>
    )}
  </Flex>
);
