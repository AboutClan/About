interface HomeIconProps {
  isDark?: boolean;
}

function HomeIcon({ isDark = true }: HomeIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H15C15.4142 11.25 15.75 11.5858 15.75 12V22C15.75 22.4142 15.4142 22.75 15 22.75C14.5858 22.75 14.25 22.4142 14.25 22V12.75H9.75V22C9.75 22.4142 9.41421 22.75 9 22.75C8.58579 22.75 8.25 22.4142 8.25 22V12Z"
        fill={isDark ? "#222222" : "#A0A1A3"}
      />
      <path
        d="M4.8 8.4L10.7508 3.93693C11.4849 3.38629 12.4997 3.40599 13.2119 3.9847L19.2612 8.89971C19.7286 9.27949 20 9.84968 20 10.4519V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V10C4 9.37049 4.29639 8.77771 4.8 8.4Z"
        stroke={isDark ? "#222222" : "#A0A1A3"}
        stroke-width="1.5"
      />
    </svg>
  );
}

export default HomeIcon;
