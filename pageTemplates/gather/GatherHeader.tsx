import Header from "../../components/layouts/Header";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";

function GatherHeader() {
  return (
    <Header title="소셜링" isBack={false}>
      <InfoModalButton type="gather" />
    </Header>
  );
}

export default GatherHeader;
