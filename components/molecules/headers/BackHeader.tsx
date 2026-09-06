import ArrowBackButton from "@/components/atoms/buttons/ArrowBackButton";

interface IBackHeader {
  title: string;
  url?: string;
  children?: React.ReactNode;
}
export default function BackHeader({ title, url, children }: IBackHeader) {
  return (
    <header className=" bg-white h-14 text-lg pl-2 pr-4 flex justify-between items-center border-b border-gray-7 ">
      <div className="flex items-center ">
        <ArrowBackButton url={url} />
        <div className="ml-1 font-extrabold text-gray-1">{title}</div>
      </div>
      <div>{children}</div>
    </header>
  );
}
