// 나이 제한이 사실상 없는 범위(기본값 만 19~28세, 만 20~29세)인지
export const isAllAgeRange = (age: number[]) =>
  (age?.[0] === 19 && age?.[1] === 28) || (age?.[0] === 20 && age?.[1] === 29);
