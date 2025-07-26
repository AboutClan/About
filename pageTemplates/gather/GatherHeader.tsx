import Header from "../../components/layouts/Header";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";

function GatherHeader({ tab }: { tab: "번개" | "라운지" | "이런 번개 어때요?" }) {
  return (
    <Header title="소셜링" isBack={false}>
      {tab === "번개" ? (
        <InfoModalButton type="gather" />
      ) : tab === "이런 번개 어때요?" ? (
        <InfoModalButton type="gatherRequest" />
      ) : null}
    </Header>
  );
}

export default GatherHeader;
