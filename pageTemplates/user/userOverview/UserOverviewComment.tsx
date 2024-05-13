import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { faPenCircle } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";

function UserOverviewComment() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const resetQueryData = useResetQueryData();

  const { data: userInfo, isLoading } = useUserInfoQuery();
  const { mutate: setComment } = useUserInfoFieldMutation("comment", {
    onSuccess() {
      resetQueryData([USER_INFO]);
    },
  });

  useEffect(() => {
    if (isLoading) return;
    setValue(userInfo?.comment || "안녕하세요! 잘 부탁드려요~ ㅎㅎ");
  }, [isLoading, userInfo]);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const input = inputRef.current;
    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);

    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleWrite = () => {
    const input = inputRef.current;
    input.focus();
  };
  const onWrite = () => {
    const text = inputRef.current.value;
    setValue(text);
  };

  const handleSubmit = () => {
    if (userInfo.comment === value) {
      return;
    }

    setComment({ comment: value });
  };

  const iconStyle: React.CSSProperties & {
    "--fa-secondary-color": string;
    "--fa-secondary-opacity": number;
  } = {
    "--fa-secondary-color": "white",
    "--fa-secondary-opacity": 1,
    border: isFocused ? "1px solid var(--color-mint)" : "1px solid var(--gray-300)",
    borderRadius: "50%",
  };

  return (
    <InputGroup size="md" onClick={handleWrite}>
      <Input
        value={value}
        ref={inputRef}
        type="text"
        onBlur={handleSubmit}
        onChange={onWrite}
        border="var(--border)"
        focusBorderColor="gray.300"
      />
      <InputRightElement>
        <FontAwesomeIcon
          icon={faPenCircle}
          size="lg"
          color={isFocused ? "var(--color-mint)" : "var(--gray-500)"}
          style={iconStyle}
        />
      </InputRightElement>
    </InputGroup>
  );
}

export default UserOverviewComment;
