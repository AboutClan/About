import RuleIcon from "../../components/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import { useTypeToast } from "../../hooks/custom/CustomToast";

interface StudyPageHeaderProps {}

function StudyPageHeader({}: StudyPageHeaderProps) {
  const typeToast = useTypeToast();
  return (
    <Header title="스터디" isBack={false}>
      <RuleIcon
        setIsModal={() => {
          typeToast("not-yet");
        }}
      />
    </Header>
  );
}

export default StudyPageHeader;
