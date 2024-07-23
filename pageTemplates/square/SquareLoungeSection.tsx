import { useFeedQuery } from "../../hooks/feed/queries";

function SquareLoungeSection() {
  const { data } = useFeedQuery();
  console.log(data);

  return <></>;
}

export default SquareLoungeSection;
