interface IconProps {
  isActive?: boolean;
}

export const HomeIcon = ({ isActive = false }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2505 5.60876L7.96333 0.236488C7.8318 0.123841 7.66857 0.0625 7.50037 0.0625C7.33217 0.0625 7.16895 0.123841 7.03741 0.236488L0.749456 5.60876C0.574208 5.75854 0.432665 5.94888 0.335368 6.1656C0.238071 6.38231 0.187527 6.61983 0.1875 6.86044V14.393C0.1875 14.9021 0.375704 15.3903 0.71071 15.7503C1.04572 16.1103 1.50008 16.3125 1.97385 16.3125H6.01175V12.5118C6.01175 12.2997 6.09017 12.0963 6.22975 11.9463C6.36934 11.7963 6.55866 11.712 6.75606 11.712H8.24468C8.44209 11.712 8.63141 11.7963 8.77099 11.9463C8.91058 12.0963 8.989 12.2997 8.989 12.5118V16.3125H13.0262C13.4999 16.3125 13.9543 16.1103 14.2893 15.7503C14.6243 15.3903 14.8125 14.9021 14.8125 14.393V6.86124C14.8125 6.62063 14.7619 6.38311 14.6646 6.1664C14.5673 5.94968 14.4258 5.75934 14.2505 5.60955"
      fill={isActive ? "var(--color-mint)" : "var(--gray-400)"}
    />
  </svg>
);

export const StudyIcon = ({ isActive }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
    <path
      d="M8.49973 17.125C8.12419 17.125 7.74933 17.0729 7.38462 16.9687L2.83351 15.6689C1.38888 15.2561 0.380005 13.9184 0.380005 12.4156V3.59213C0.380005 3.21862 0.683141 2.91548 1.05665 2.91548C1.43016 2.91548 1.73329 3.21862 1.73329 3.59213V12.4156C1.73329 13.3175 2.33889 14.12 3.20567 14.3677L7.75677 15.6675C8.24328 15.8062 8.75685 15.8062 9.24404 15.6675L13.7945 14.3677C14.6612 14.12 15.2668 13.3175 15.2668 12.4156V2.91548C15.2668 2.54198 15.57 2.23884 15.9435 2.23884C16.317 2.23884 16.6201 2.54198 16.6201 2.91548V12.4156C16.6201 13.9177 15.6113 15.2554 14.1666 15.6689L9.61551 16.9687C9.25013 17.0729 8.87526 17.125 8.5004 17.125H8.49973ZM12.5752 0.990433C12.0826 0.808415 11.5338 0.853751 11.0459 1.04862L10.4525 1.28545C9.68182 1.59332 9.17569 2.34034 9.17569 3.17058V12.9792C8.95376 13.036 8.72708 13.0651 8.49905 13.0651C8.27102 13.0651 8.04435 13.036 7.82241 12.9792V3.17058C7.82241 2.34034 7.31695 1.59332 6.54558 1.28545L5.95149 1.04795C5.46363 0.853074 4.91487 0.807739 4.42227 0.990433C3.60015 1.29492 3.08523 2.06156 3.08523 2.89992V11.5028C3.08523 12.4088 3.68609 13.2052 4.55693 13.4542L7.38259 14.2621C7.74662 14.3656 8.12216 14.4177 8.4977 14.4177C8.87323 14.4177 9.24877 14.3656 9.61281 14.2621L12.4385 13.4542C13.31 13.2052 13.9102 12.4088 13.9102 11.5028V2.89992C13.9102 2.06156 13.3946 1.29425 12.5724 0.990433H12.5752Z"
      fill={isActive ? "var(--color-mint)" : "var(--gray-400)"}
    />
  </svg>
);

export const ThunderIcon = ({ isActive }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="18" viewBox="0 0 13 18" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.6745 8.21533L8.23532 7.01423L9.2745 1.88308C9.44157 1.05586 8.42078 0.528171 7.84305 1.14197L0.991215 8.41919C0.89543 8.52089 0.826583 8.64493 0.790933 8.78001C0.755283 8.91509 0.753962 9.05695 0.787089 9.19267C0.820216 9.3284 0.88674 9.45369 0.980615 9.55716C1.07449 9.66063 1.19274 9.739 1.32461 9.78514L4.76304 10.9862L3.72533 16.1174C3.55679 16.9439 4.57757 17.4716 5.15604 16.8585L12.0086 9.57981C12.4244 9.13823 12.2471 8.41477 11.6745 8.21533Z"
      fill={isActive ? "var(--color-mint)" : "var(--gray-400)"}
    />
  </svg>
);

export const CommunityIcon = ({ isActive }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4139 9.57755C12.2551 9.58155 12.0971 9.55372 11.9493 9.4957C11.8014 9.43769 11.6667 9.35067 11.553 9.23976C11.4393 9.12885 11.3489 8.9963 11.2873 8.84993C11.2256 8.70356 11.1939 8.54632 11.1939 8.38749C11.194 8.22865 11.2258 8.07144 11.2876 7.9251C11.3493 7.77877 11.4398 7.64628 11.5535 7.53545C11.6673 7.42462 11.8021 7.33768 11.95 7.27976C12.0979 7.22184 12.2559 7.19412 12.4147 7.19822C12.7249 7.20623 13.0198 7.33514 13.2364 7.55745C13.453 7.77977 13.5741 8.07789 13.574 8.38826C13.5739 8.69863 13.4526 8.99668 13.2358 9.21885C13.0191 9.44102 12.7242 9.56974 12.4139 9.57755M8.61162 9.57755C8.45274 9.58155 8.29466 9.5537 8.1467 9.49565C7.99875 9.4376 7.86391 9.35051 7.75014 9.23953C7.63637 9.12855 7.54596 8.99592 7.48425 8.84945C7.42254 8.70299 7.39078 8.54565 7.39083 8.38671C7.39088 8.22778 7.42275 8.07046 7.48455 7.92403C7.54636 7.77761 7.63685 7.64503 7.75069 7.53413C7.86454 7.42322 7.99943 7.33622 8.14742 7.27827C8.29542 7.22031 8.45351 7.19257 8.61239 7.19667C8.92286 7.20469 9.21791 7.33368 9.43463 7.55614C9.65135 7.77859 9.77259 8.07692 9.77248 8.38749C9.77238 8.69806 9.65095 8.9963 9.43409 9.21862C9.21723 9.44094 8.92209 9.56973 8.61162 9.57755M4.80856 9.57755C4.64978 9.58155 4.4918 9.55372 4.34394 9.4957C4.19608 9.43769 4.06133 9.35067 3.94763 9.23976C3.83393 9.12885 3.74359 8.9963 3.68192 8.84993C3.62025 8.70356 3.5885 8.54632 3.58855 8.38749C3.58861 8.22865 3.62045 8.07144 3.68222 7.9251C3.74398 7.77877 3.83441 7.64628 3.94818 7.53545C4.06196 7.42462 4.19676 7.33768 4.34466 7.27976C4.49256 7.22184 4.65055 7.19412 4.80933 7.19822C5.1196 7.20623 5.41445 7.33514 5.63103 7.55745C5.8476 7.77977 5.96876 8.07789 5.96866 8.38826C5.96856 8.69863 5.84721 8.99668 5.63049 9.21885C5.41377 9.44102 5.11883 9.56974 4.80856 9.57755M8.56055 0.875C4.04717 0.875 0.374878 4.21303 0.374878 8.31631C0.374878 10.0728 1.11769 12.4629 3.18674 14.0058L2.94301 16.5546C2.93386 16.6485 2.95044 16.7432 2.99097 16.8284C3.03151 16.9136 3.09447 16.9862 3.17311 17.0383C3.25175 17.0905 3.34311 17.1203 3.43738 17.1245C3.53165 17.1287 3.62529 17.1072 3.70826 17.0622L6.36306 15.6338C6.69345 15.6679 7.66376 15.7576 8.56055 15.7576C13.0739 15.7576 16.7462 12.4196 16.7462 8.31631C16.7462 4.21303 13.0739 0.875 8.56055 0.875Z"
      fill={isActive ? "var(--color-mint)" : "var(--gray-400)"}
    />
  </svg>
);
