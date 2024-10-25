export function ShortArrowIcon({ dir }: { dir: "right" | "bottom" | "top" }) {
  return dir === "right" ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.8124 10.0502C4.6399 10.0502 4.4674 9.98271 4.3324 9.85521C4.20645 9.72871 4.13574 9.55747 4.13574 9.37896C4.13574 9.20045 4.20645 9.02921 4.3324 8.90271L7.2349 6.00021L4.3324 3.10521C4.20645 2.97871 4.13574 2.80747 4.13574 2.62896C4.13574 2.45045 4.20645 2.27921 4.3324 2.15271C4.4589 2.02677 4.63014 1.95605 4.80865 1.95605C4.98716 1.95605 5.1584 2.02677 5.2849 2.15271L8.6599 5.52771C8.78585 5.65421 8.85656 5.82545 8.85656 6.00396C8.85656 6.18247 8.78585 6.35371 8.6599 6.48021L5.2849 9.85521C5.1574 9.98271 4.9849 10.0502 4.8124 10.0502"
        fill="#00C2B3"
      />
    </svg>
  ) : dir === "bottom" ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.95 4.3124C1.95 4.1399 2.0175 3.9674 2.145 3.8324C2.2715 3.70645 2.44274 3.63574 2.62125 3.63574C2.79976 3.63574 2.971 3.70645 3.0975 3.8324L6 6.7349L8.895 3.8324C9.0215 3.70645 9.19274 3.63574 9.37125 3.63574C9.54976 3.63574 9.721 3.70645 9.8475 3.8324C9.97345 3.9589 10.0442 4.13014 10.0442 4.30865C10.0442 4.48716 9.97345 4.6584 9.8475 4.7849L6.4725 8.1599C6.346 8.28585 6.17476 8.35656 5.99625 8.35656C5.81774 8.35656 5.6465 8.28585 5.52 8.1599L2.145 4.7849C2.0175 4.6574 1.95 4.4849 1.95 4.3124Z"
        fill="#00C2B3"
      />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.95 7.6876C1.95 7.8601 2.0175 8.0326 2.145 8.1676C2.2715 8.29355 2.44274 8.36426 2.62125 8.36426C2.79976 8.36426 2.971 8.29355 3.0975 8.1676L6 5.2651L8.895 8.1676C9.0215 8.29355 9.19274 8.36426 9.37125 8.36426C9.54976 8.36426 9.721 8.29355 9.8475 8.1676C9.97345 8.0411 10.0442 7.86986 10.0442 7.69135C10.0442 7.51284 9.97345 7.3416 9.8475 7.2151L6.4725 3.8401C6.346 3.71415 6.17476 3.64344 5.99625 3.64344C5.81774 3.64344 5.6465 3.71415 5.52 3.8401L2.145 7.2151C2.0175 7.3426 1.95 7.5151 1.95 7.6876Z"
        fill="#00C2B3"
      />
    </svg>
  );
}

export function TurnArrowIcon({ color = "orange" }: { color?: "gray" | "orange" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.19331 2.66661C2.19331 2.25994 2.51997 1.93994 2.92664 1.93994H2.93331C3.33997 1.93994 3.66664 2.27327 3.65997 2.67994L3.63331 8.39994C3.63331 8.66661 3.73331 8.91994 3.92664 9.10661C4.11331 9.29327 4.36664 9.39994 4.63331 9.39994H12.0066L9.38664 6.77994C9.09997 6.49327 9.09997 6.02661 9.38664 5.73994C9.67331 5.45327 10.1333 5.45327 10.4266 5.73994L14.3 9.61327C14.44 9.75327 14.5133 9.93994 14.5133 10.1333C14.5133 10.3266 14.4333 10.5133 14.3 10.6533L10.4266 14.5266C10.2866 14.6666 10.0933 14.7399 9.90664 14.7399C9.71997 14.7399 9.53331 14.6666 9.38664 14.5266C9.09997 14.2399 9.09997 13.7733 9.38664 13.4933L12.0066 10.8733H4.62664C3.96664 10.8733 3.34664 10.6133 2.87997 10.1466C2.41331 9.67994 2.15997 9.05994 2.15997 8.39994L2.19331 2.66661Z"
        fill={color === "orange" ? "#FFA500" : "#e0e0e0"}
      />
    </svg>
  );
}
