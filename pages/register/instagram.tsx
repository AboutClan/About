import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { useQueryClient } from "react-query";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Instagram() {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const info = getLocalStorageObj(REGISTER_INFO);

  const inputRef = useRef(null);

  const isProfileEdit = !!searchParams.get("edit");

  const [value, setValue] = useState(info?.instagram || "");

  const { data: userInfo } = useUserInfoQuery({ enabled: isProfileEdit });

  const { mutate: updateUserInfo } = useUserInfoMutation({
    onSuccess() {
      setLocalStorageObj(REGISTER_INFO, null);
      queryClient.invalidateQueries([USER_INFO]);
      router.push("/user");
      toast("success", "변경되었습니다.");
    },
    onError: () => typeToast("error"),
  });

  const onClickNext = () => {
    updateUserInfo({
      ...userInfo,
      ...info,
      instagram: value,
    });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const instagram = e.target.value;
    setValue(instagram);
  };

  return (
    <>
      <ProgressHeader title="프로필 수정" value={100} />
      <RegisterLayout>
        <RegisterOverview>
          <span>인스타 아이디를 작성해주세요</span>
          <span>선택사항으로, 적지 않으셔도 됩니다!</span>
        </RegisterOverview>
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder="선택사항"
          disabled={isProfileEdit}
        />
      </RegisterLayout>
      <BottomNav onClick={onClickNext} text="완료" />
    </>
  );
}

export default Instagram;
