export const findParentheses = (text: string) => {
  const regex = /\(.*?\)/g; // 'g' 플래그를 추가하여 모든 일치 항목을 찾습니다.
  const found = text.match(regex);

  if (found) {
    return found; // 발견된 모든 소괄호를 포함한 문자열을 배열로 반환
  } else {
    return null; // 일치하는 결과가 없을 경우의 메시지
  }
};
