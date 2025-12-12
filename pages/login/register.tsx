import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "../../components/atoms/Input";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { useToast } from "../../hooks/custom/CustomToast";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";

function LoginId() {
  const router = useRouter();
  const toast = useToast();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    toast("success", "회원가입 완료");
    router.push("/loginId");
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={100} />
      <RegisterLayout>
        <RegisterOverview>
          <span>외부인 로그인</span>
          <span>동아리원을 희망하시는 분은 사용하지 말아주세요.</span>
        </RegisterOverview>

        <Box textAlign="start" mb={4}>
          <Box mb={1}>아이디(이메일)</Box>
          <Input
            placeholder="example@about.kr"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Box>
        <Box textAlign="start">
          <Box mb={1}>비밀번호</Box>
          <Input placeholder="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Box>
        <Button mt={5} w="full" colorScheme="mint" onClick={handleLogin}>
          회원가입
        </Button>
      </RegisterLayout>
    </>
  );
}

export default LoginId;
