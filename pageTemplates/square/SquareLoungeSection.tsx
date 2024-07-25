import Image from "next/image";
import { useFeedQuery } from "../../hooks/feed/queries";

function SquareLoungeSection() {
  const { data } = useFeedQuery("669fa81aa44f22392f4e487b");

  console.log(data);
  return (
    <>{data?.imageUrl?.[0] && <Image src={data.imageUrl[0]} alt="" width={400} height={200} />}</>
  );
}

export default SquareLoungeSection;
