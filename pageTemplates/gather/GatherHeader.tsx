import { Button, Flex } from "@chakra-ui/react";
import RuleIcon from "../../components/Icons/RuleIcon";
import Header from "../../components/layouts/Header";
import { useTypeToast } from "../../hooks/custom/CustomToast";

function GatherHeader() {
  const typeToast = useTypeToast();
  return (
    <Header title="소셜링" isBack={false}>
      <Flex>
        <Button variant="unstyled" mr={4} onClick={() => typeToast("not-yet")}>
          <i
            className="fa-regular fa-magnifying-glass fa-xl"
            style={{ color: "var(--gray-600)" }}
          />
        </Button>
        <RuleIcon
          setIsModal={() => {
            typeToast("not-yet");
          }}
        />
      </Flex>
    </Header>
  );
}

export default GatherHeader;
