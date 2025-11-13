import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";

interface GroupContentProps {
  isResting: boolean;
  content: string;
  rules: string[];
  hashTagString: string;
  isSecret: boolean;
}

function GroupContent({ isResting, content, rules, hashTagString, isSecret }: GroupContentProps) {
  return (
    <Flex direction="column">
      <Box px={5} mt={5}>
        {isResting ? (
          <Box fontSize="12px" mb={4} color="mint">
            ※ 현재 휴식중인 소모임입니다. 곧 활동 예정!
          </Box>
        ) : isSecret ? (
          <Box fontSize="12px" mb={4} color="mint">
            ※ 익명으로 활동하는 소모임입니다.
          </Box>
        ) : null}
        <Box
          color="gray.800"
          fontWeight="regular"
          fontSize="14px"
          fontFamily="apple"
          whiteSpace="pre-wrap"
          mb={5}
        >
          {content}
        </Box>{" "}
        {rules.length ? (
          <>
            <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px">
              <UnorderedList ml={-1.5}>
                <ListItem
                  className="colored-bullet"
                  sx={{
                    "::marker": {
                      color: "blue", // 원하는 색상
                    },
                  }}
                >
                  <Text lineHeight="20px">규 칙</Text>
                </ListItem>
              </UnorderedList>
            </Box>
            <Box
              fontWeight="light"
              fontSize="12px"
              lineHeight="20px"
              bg="rgba(160, 174, 192, 0.08)"
              py={4}
              borderRadius="8px"
              mb={5}
            >
              {rules.length === 1 ? (
                <Box px={4}>※ {rules[0]}</Box>
              ) : (
                <UnorderedList>
                  {rules.map((rule, idx) => (
                    <ListItem key={idx}>
                      <Text lineHeight="20px">{rule}</Text>
                    </ListItem>
                  ))}
                </UnorderedList>
              )}
            </Box>
          </>
        ) : null}
        {/* {group?.notionUrl ? (
                    <Box fontSize="13px" lineHeight="20px">
                      <ExternalLink
                        href={group.notionUrl}
                        style={{ fontWeight: "600", color: "var(--color-blue)" }}
                      >
                        <u>&gt;&gt; 활동 기록 보러가기</u>
                      </ExternalLink>
                    </Box>
                  ) : null} */}
        <Flex mt={5}>
          {hashTagString?.split("#").map((tag, idx) =>
            tag ? (
              <Box
                h={5}
                py={1}
                px={2}
                fontSize="10px"
                fontWeight="medium"
                color="gray.600"
                borderRadius="4px"
                bg="gray.100"
                mr={1}
                key={idx}
              >
                #{tag}
              </Box>
            ) : null,
          )}
        </Flex>
      </Box>

      <Box h="1px" my={5} bg="gray.100" />
    </Flex>
  );
}

export default GroupContent;
