import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

import { Input } from "../components/atoms/Input";
import ProgressHeader from "../components/molecules/headers/ProgressHeader";
import { useToast } from "../hooks/custom/CustomToast";
import RegisterLayout from "../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../pageTemplates/register/RegisterOverview";

const publicID = "team.about.20s@gmail.com";
const publicPW = "abcde12345?!";

function LoginId() {
  const router = useRouter();
  const toast = useToast();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    if (id === publicID && pw === publicPW) {
      const result = await signIn("credentials", {
        callbackUrl: `${window.location.origin}/home`,
        username: "게스트",
        password: "비밀번호",
      });

      if (result?.error) {
        console.error("로그인 실패:", result?.error);
      } else {
        console.log("로그인 성공!");
      }
    } else {
      toast("error", "아이디 비밀번호가 일치하지 않습니다.");
    }
  };

  useEffect(() => {
    toast("info", "동아리원을 희망하시는 분은 카카오 로그인을 이용해주세요.");
  }, []);

  return (
    <>
      <ProgressHeader title="로그인" value={100} />
      <RegisterLayout>
        <RegisterOverview>
          <span>외부인 로그인</span>
          <span>동아리원을 희망하시는 분은 카카오 로그인을 이용해주세요.</span>
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
          로그인
        </Button>
        <Box
          mt={5}
          onClick={() => router.push("/loginRegister")}
          fontSize="13px"
          color="gray.600"
          ml="auto"
          width="max-content"
        >
          회원가입 하기
        </Box>
      </RegisterLayout>
    </>
  );
}

export default LoginId;
