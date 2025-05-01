import Header from "../../layouts/Header";
import Slide from "../../layouts/PageSlide";
import ProgressStatus from "../ProgressStatus";
interface IProgressHeader {
  value: number;
  title: string;
  url?: string;
}
export default function ProgressHeader({ value, title, url }: IProgressHeader) {
  return (
    <Slide isFixed={true}>
      <ProgressStatus value={value} />
      <Header url={url} isBorder={false} isSlide={false} title={title} />
    </Slide>
  );
}
