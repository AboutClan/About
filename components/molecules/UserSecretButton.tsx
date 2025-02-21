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
        leftIcon={<i className="fa-regular fa-face-hand-peeking fa-lg" />}
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

export default UserSecretButton;
