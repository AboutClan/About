import { Button } from "@chakra-ui/react";
import { useState } from "react";

import TimeSelectModal from "../pageTemplates/community/TestClock";

export default function ExamplePage() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<"lunch" | "dinner" | null>(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>모달 열기</Button>

      <TimeSelectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedPreset={selectedPreset}
        onSelectPreset={(preset) => setSelectedPreset(preset)}
        onManualSelect={() => {
          // 기존 수동 시간 선택 모달/화면으로 이동
          console.log("직접 시간 선택");
        }}
        onSubmit={() => {
          console.log("선택된 값:", selectedPreset);
          setIsOpen(false);
        }}
      />
    </>
  );
}
