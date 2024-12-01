import Header from "../../layouts/Header";
import Slide from "../../layouts/PageSlide";
import ProgressStatus from "../ProgressStatus";
interface IProgressHeader {
  value: number;
  title: string;
}
export default function ProgressHeader({ value, title }: IProgressHeader) {
  return (
    <Slide isFixed={true}>
      <ProgressStatus value={value} />
      <Header isBorder={false} isSlide={false} title={title} />
    </Slide>
  );
}
