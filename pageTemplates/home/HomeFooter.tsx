import { Box, Link, Stack, Text } from "@chakra-ui/react";

function HomeFooter() {
  return (
    <Box bg="gray.100" color="gray.600" mt={6} py={6} px={4}>
      <Box mx="auto">
        <Stack spacing={1} fontSize="sm">
          <Text>상호명: About | 대표자: 이승주</Text>
          <Text>사업자등록번호: 260-48-00924</Text>
          <Text>주소: 경기도 부천시 원미구 부천로 666번길 93, 나동 408호</Text>
          <Text>대표번호: 010-6230-0206 | 이메일: team.about.20s@gmail.com</Text>
        </Stack>

        <Stack direction="row" spacing={4} mt={4}>
          <Link href="/user/info/policy" fontSize="sm" _hover={{ textDecoration: "underline" }}>
            이용약관
          </Link>
          <Link href="/user/info/privacy" fontSize="sm" _hover={{ textDecoration: "underline" }}>
            개인정보처리방침
          </Link>
        </Stack>

        <Text fontSize="xs" color="gray.500" mt={3}>
          © 2025 About. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}

export default HomeFooter;
