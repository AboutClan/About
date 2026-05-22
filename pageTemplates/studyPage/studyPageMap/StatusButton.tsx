import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";

function StatusButton() {
  return (
    <>
      <Flex
        as="button"
        w="48px"
        h="88px"
        pb={0.5}
        direction="column"
        align="center"
        justify="center"
        bg="white"
        borderRadius="999px"
        boxShadow="0 10px 24px rgba(0,0,0,0.18)"
        position="relative"
      >
        <Flex justify="center" align="center" pos="relative" w="48px" h="48px">
          <Flex justify="center" align="center" pos="absolute">
            <Image src="/cafe/자산 7.png" width={32} height={32} alt="imoji" />
          </Flex>
          <Box
            fontSize="10px"
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            fontWeight={600}
          >
            여유
          </Box>
        </Flex>

        <Box w="28px" h="2px" bg="blue.400" borderRadius="999px" my={2}></Box>
        <Text fontSize="10px" fontWeight={800} color="gray.800" lineHeight="1">
          카페 자리
        </Text>
      </Flex>
      {/* {<BottomSheet />} */}
    </>
  );
}

export default StatusButton;

function BottomSheet() {
  return (
    <Flex
      direction="column"
      w="full"
      bg="white"
      borderTopRadius="28px"
      px="24px"
      pt="20px"
      pb="32px"
    >
      {/* 헤더 */}
      <Flex justify="space-between" align="center" mb="28px">
        <Text fontSize="20px" fontWeight="800">
          수원시 영통구 광교1동
        </Text>

        <IconButton
          aria-label="close"
          icon={<CloseIcon boxSize={4} />}
          borderRadius="full"
          bg="gray.100"
          minW="48px"
          h="48px"
        />
      </Flex>

      {/* 메인 날씨 */}
      <Flex direction="column" align="center" mb="32px">
        <Flex align="center" mb="12px">
          <Box mr="16px">
            <Image src="/weather/moon.png" width={72} height={72} alt="weather" />
          </Box>

          <Text fontSize="72px" fontWeight="300" lineHeight="1">
            18.3°
          </Text>
        </Flex>

        <Text fontSize="24px" fontWeight="700" mb="6px">
          맑음
        </Text>

        <Text fontSize="18px" color="gray.600">
          체감온도 19.3° · 미세{" "}
          <Text as="span" color="blue.400" fontWeight="700">
            좋음
          </Text>{" "}
          · 초미세{" "}
          <Text as="span" color="blue.400" fontWeight="700">
            좋음
          </Text>
        </Text>
      </Flex>

      {/* 시간대별 */}
      <Box bg="#f7f7f8" borderRadius="24px" px="20px" py="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="18px" fontWeight="800">
            시간대별{" "}
            <Text as="span" color="gray.400" fontWeight="600">
              · 일별
            </Text>
          </Text>

          <Text fontSize="18px" color="gray.600" fontWeight="600">
            날씨 더보기 ›
          </Text>
        </Flex>

        <Box h="1px" bg="gray.200" mb="20px" />

        <Flex justify="space-between">
          {[
            { time: "23시", temp: "17°" },
            { time: "내일", temp: "17°", badge: true },
            { time: "1시", temp: "16°" },
            { time: "2시", temp: "15°" },
            { time: "3시", temp: "14°" },
            { time: "4시", temp: "14°" },
          ].map((item) => (
            <Flex key={item.time} direction="column" align="center">
              {item.badge ? (
                <Box
                  px="10px"
                  py="4px"
                  borderRadius="999px"
                  bg="gray.500"
                  color="white"
                  fontSize="12px"
                  fontWeight="700"
                  mb="12px"
                >
                  {item.time}
                </Box>
              ) : (
                <Text fontSize="16px" color="gray.500" fontWeight="700" mb="12px" mt="6px">
                  {item.time}
                </Text>
              )}

              <Box mb="10px">
                <Image src="/weather/cloud.png" width={40} height={40} alt="weather" />
              </Box>

              <Text fontSize="18px" fontWeight="700">
                {item.temp}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* 하단 */}
      <Text mt="24px" fontSize="15px" color="gray.500">
        제공{" "}
        <Text as="span" color="blue.400">
          기상청
        </Text>{" "}
        · 2026.05.21 22:27 업데이트
      </Text>
    </Flex>
  );
}
