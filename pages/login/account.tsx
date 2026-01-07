import { Box, Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Input } from "../../components/atoms/Input";
import Header from "../../components/layouts/Header";
import { useToast } from "../../hooks/custom/CustomToast";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";

const publicID = "team.about.20s@gmail.com";
const publicPW = "abcde12345?!";

function LoginId() {
  const toast = useToast();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    if (id === publicID && pw === publicPW) {
      const result = await signIn("credentials", {
        callbackUrl: `${window.location.origin}/register/name`,
        username: "테스트",
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

  return (
    <>
      <Header title="관리자 로그인" />
      <RegisterLayout>
        <Box textAlign="start" mb={4} mt={20}>
          <Box mb={1}>아이디</Box>
          <Input placeholder="id" value={id} onChange={(e) => setId(e.target.value)} />
        </Box>
        <Box textAlign="start">
          <Box mb={1}>비밀번호</Box>
          <Input placeholder="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Box>
        <Button mt={5} w="full" colorScheme="mint" onClick={handleLogin}>
          로그인
        </Button>
      </RegisterLayout>
    </>
  );
}

export default LoginId;
