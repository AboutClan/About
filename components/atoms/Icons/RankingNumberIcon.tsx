interface RankingNumberIconProps {
  rankNum: number;
}

function RankingNumberIcon({ rankNum }: RankingNumberIconProps) {
  const color =
    rankNum === 1
      ? "var(--color-red)"
      : rankNum === 2
        ? "var(--color-orange)"
        : "var(--color-gray)";

  return (
    <>
      <span className="fa-stack fa-md" style={{ color }}>
        <i className="fa-light fa-wreath-laurel fa-stack-2x"></i>
        <i
          className={`fab fa-solid fa-${rankNum} fa-stack-1x fa-inverse`}
          style={{ color: "inherit" }}
        ></i>
      </span>
    </>
  );
}

export default RankingNumberIcon;
