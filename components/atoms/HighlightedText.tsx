export interface IHighlightedText {
  text: string;
  hightlightedText?: string;
}
export default function HighlightedText({ text, hightlightedText }: IHighlightedText) {
  // const escapedHighlightedText = escapeRegExp(hightlightedText);
  const parts = text.split(new RegExp(`(${hightlightedText})`, "gi"));

  return (
    <span>
      {parts.map((part, index) =>
        part === hightlightedText ? <strong key={index}>{part}</strong> : part,
      )}
    </span>
  );
}

// const escapeRegExp = (string) => {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 특수 문자 앞에 백슬래시를 추가
// };
