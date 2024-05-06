import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import AttendanceModal from "../../design/attendance/AttendanceModal";

// Meta 타입에 typeof를 사용하여 컴포넌트 타입을 정확히 지정합니다.
const meta: Meta<typeof AttendanceModal> = {
  title: "DESIGNS/AttendanceModal",
  component: AttendanceModal,
  parameters: {},
  tags: ["autodocs"],
};

export default meta;

// StoryObj를 사용할 때는 컴포넌트의 Props 타입을 정확하게 매핑합니다.
type AttendanceModalProps = {
  isExist?: boolean;
  setIsModal: (exist: boolean) => void;
};

export const Primary: StoryObj<typeof AttendanceModal> = {
  render: (args) => {
    const [isExist, setIsExist] = useState(args.isExist ?? false); // args.isExist가 undefined일 경우 false를 기본값으로 사용

    // isExist 상태를 토글하는 함수
    const setIsModal = () => setIsExist(!isExist);

    return <div />;
  },
  args: {
    isExist: false,
  },
};
