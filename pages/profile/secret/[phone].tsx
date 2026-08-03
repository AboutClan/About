import { Box, Button, Flex } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../../../components/atoms/Input";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { useUserPhoneToUserInfoQuery } from "../../../hooks/user/queries";
import ProfileDetailPage from "../../../pageTemplates/profile/ProfileDetailPage";

const ADMIN_ROLES = ["previliged", "manager"];

function SecretPhoneProfilePage() {
  const router = useRouter();
  const { phone } = useParams<{ phone: string }>() || {};
  const myInfo = useUserInfo();

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(phone ? decodeURIComponent(phone) : "");
  }, [phone]);

  const isAdmin = !!myInfo && ADMIN_ROLES.includes(myInfo.role);

  const {
    data: user,
    isLoading,
    isError,
  } = useUserPhoneToUserInfoQuery(phone as string, {
    enabled: !!phone && isAdmin,
    retry: false,
  });

  const handleSearch = () => {
    const trimmed = searchValue.replace(/\s/g, "");
    if (!trimmed) return;
    router.push(`/profile/secret/${encodeURIComponent(trimmed)}`);
  };

  if (myInfo && !isAdmin) {
    return (
      <>
        <Header title="접근 불가" />
        <Slide>
          <Box mt={10} textAlign="center" color="gray.600" fontSize="14px">
            운영진만 접근할 수 있는 페이지입니다.
          </Box>
        </Slide>
      </>
    );
  }

  if (user) {
    return <ProfileDetailPage user={user} />;
  }

  return (
    <>
      <Header title="전화번호로 프로필 찾기" />
      <Slide>
        <Box mt={4} mb={3} fontSize="13px" color="gray.500">
          휴대폰 번호를 입력하면 일치하는 멤버의 프로필을 확인할 수 있어요.
        </Box>
        <Flex gap={2}>
          <Input
            size="md"
            placeholder="010-1234-5678"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button colorScheme="mint" onClick={handleSearch} isLoading={isLoading}>
            검색
          </Button>
        </Flex>
        {phone && !isLoading && isError && (
          <Box mt={6} textAlign="center" color="gray.500" fontSize="13px">
            일치하는 유저를 찾을 수 없습니다.
          </Box>
        )}
      </Slide>
    </>
  );
}

export default SecretPhoneProfilePage;
