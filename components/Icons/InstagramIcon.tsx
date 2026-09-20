// 카공지도 지도 우측 상단의 인스타그램 연결 버튼용 아이콘.
// 지도 컨트롤은 흰 원형으로 통일되어 있어 배경은 두지 않고 글리프에만 인스타 그라데이션을 입힌다.
const GRADIENT_ID = "instagramIconGradient";

export function InstagramIcon({ size = "21px" }: { size?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${GRADIENT_ID})`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="70%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.7" cy="6.3" r="1.1" fill={`url(#${GRADIENT_ID})`} stroke="none" />
    </svg>
  );
}
