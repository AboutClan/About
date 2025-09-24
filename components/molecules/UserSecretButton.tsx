import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import FlexSwitchBlock from "../atoms/FlexSwitchBlock";
interface UserSecretButtonProps {
  isAnonymous: boolean;
  setIsAnonymous: DispatchBoolean;
}

function UserSecretButton({ isAnonymous, setIsAnonymous }: UserSecretButtonProps) {
  const toast = useToast();
  const [isModal, setIsModal] = useState(false);

  const [condition, setCondition] = useState({
    anonymous: isAnonymous,
    tag: false,
  });

  useEffect(() => {
    setIsAnonymous(condition.anonymous);
  }, [condition]);

  const handleToggle = (key: keyof typeof condition, checked: boolean) => {
    if (key === "tag") {
      toast("warning", "개발중인 기능입니다.");
      return;
    }
    setCondition((prevCondition) => ({ ...prevCondition, [key]: checked }));
  };

  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <>
      <Button
        color="var(--gray-600)"
        type="button"
        outline="none"
        border="none"
        leftIcon={<SecretIcon />}
        variant="ghost"
        size="sm"
        px="8px"
        onClick={() => setIsModal(true)}
      >
        익명
      </Button>
      {isModal && (
        <ModalLayout
          isCloseButton={false}
          title="익명 설정"
          setIsModal={setIsModal}
          footerOptions={footerOptions}
        >
          <FlexSwitchBlock
            label="익명으로 글쓰기"
            icon={<i className="fa-solid fa-lock" />}
            isChecked={condition.anonymous}
            onToggle={(checked) => handleToggle("anonymous", checked)}
          />

          <FlexSwitchBlock
            label="친구 태그하기"
            icon={<i className="fa-solid fa-tag" />}
            isChecked={condition.tag}
            onToggle={(checked) => handleToggle("tag", checked)}
          />
        </ModalLayout>
      )}
    </>
  );
}

function SecretIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-500)"
  >
    <path d="M312-240q-51 0-97.5-18T131-311q-48-45-69.5-106.5T40-545q0-78 38-126.5T189-720q14 0 26.5 2.5T241-710l239 89 239-89q13-5 25.5-7.5T771-720q73 0 111 48.5T920-545q0 66-21.5 127.5T829-311q-37 35-83.5 53T648-240q-66 0-112-30l-46-30h-20l-46 30q-46 30-112 30Zm37-160q29 0 46-13.5t17-36.5q0-39-52-74.5T251-560q-29 0-46 13.5T188-510q0 39 52 74.5T349-400Zm262 0q57 0 109-35.5t52-74.5q0-24-16.5-37T709-560q-57 0-109 35.5T548-450q0 23 16.5 36.5T611-400Z" />
  </svg>
}

export default UserSecretButton;
