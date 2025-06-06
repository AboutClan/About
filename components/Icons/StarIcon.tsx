import { Box } from "@chakra-ui/react";

export function StarIcon({
  type,
  size: tempSize,
}: {
  type: "fill" | "empty" | "half";
  size: "sm" | "lg" | "xl";
}) {
  const size = tempSize === "sm" ? "12px" : tempSize === "lg" ? "20px" : "28px";
  return type === "empty" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="var(--gray-400)"
    >
      <path d="M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z" />
    </svg>
  ) : type === "half" ? (
    <Box position="relative" w={size} h={size}>
      {/* 회색 하트 배경 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox="0 -960 960 960"
        width={size}
        fill="var(--gray-400)"
      >
        <path d="M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z" />
      </svg>

      {/* 노란 하트 앞쪽 절반만 덮기 */}
      <Box position="absolute" top="0" left="0" w="50%" h="100%" overflow="hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          width={size}
          height={size}
          fill="var(--color-yellow)"
        >
          <path d="M480-675v312l126 77-33-144 111-96-146-13-58-136Zm0 406L314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z" />
        </svg>
      </Box>
    </Box>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="var(--color-yellow)"
    >
      <path d="M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z" />
    </svg>
  );
}
