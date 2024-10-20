export function ChatTalkIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        width="20"
        height="20"
        rx="10"
        fill="#A0AEC0"
        fill-opacity={isActive ? "0.64" : "0.32"}
      />
      <g clip-path="url(#clip0_2234_1923)">
        <path
          fillRule="evenodd"
          clip-rule="evenodd"
          d="M12.4899 10.3735C12.3873 10.3761 12.2853 10.3581 12.1897 10.3206C12.0942 10.2831 12.0071 10.2269 11.9336 10.1552C11.8602 10.0836 11.8018 9.9979 11.7619 9.90332C11.7221 9.80873 11.7016 9.70713 11.7016 9.60449C11.7016 9.50186 11.7222 9.40027 11.7621 9.30571C11.802 9.21115 11.8605 9.12554 11.934 9.05392C12.0075 8.9823 12.0946 8.92612 12.1902 8.88869C12.2858 8.85127 12.3878 8.83335 12.4904 8.836C12.6909 8.84118 12.8815 8.92448 13.0214 9.06813C13.1614 9.21179 13.2397 9.40444 13.2396 9.60499C13.2395 9.80555 13.1611 9.99815 13.0211 10.1417C12.881 10.2853 12.6904 10.3685 12.4899 10.3735ZM10.0329 10.3735C9.93028 10.3761 9.82813 10.3581 9.73252 10.3206C9.63692 10.2831 9.54979 10.2268 9.47627 10.1551C9.40275 10.0834 9.34433 9.99766 9.30446 9.90301C9.26458 9.80837 9.24405 9.7067 9.24409 9.60399C9.24412 9.50129 9.26471 9.39963 9.30465 9.30501C9.34459 9.21039 9.40306 9.12473 9.47663 9.05306C9.55019 8.98139 9.63736 8.92518 9.73299 8.88773C9.82862 8.85028 9.93078 8.83235 10.0334 8.835C10.2341 8.84018 10.4247 8.92353 10.5648 9.06728C10.7048 9.21103 10.7832 9.40381 10.7831 9.60449C10.783 9.80518 10.7046 9.9979 10.5644 10.1416C10.4243 10.2852 10.2336 10.3685 10.0329 10.3735ZM7.57545 10.3735C7.47285 10.3761 7.37076 10.3581 7.27522 10.3206C7.17967 10.2831 7.0926 10.2269 7.01913 10.1552C6.94565 10.0836 6.88727 9.9979 6.84742 9.90332C6.80757 9.80873 6.78706 9.70713 6.78709 9.60449C6.78713 9.50186 6.80771 9.40027 6.84762 9.30571C6.88753 9.21115 6.94597 9.12554 7.01948 9.05392C7.093 8.9823 7.18011 8.92612 7.27568 8.88869C7.37125 8.85127 7.47335 8.83335 7.57595 8.836C7.77644 8.84118 7.96697 8.92448 8.10692 9.06813C8.24687 9.21179 8.32516 9.40444 8.32509 9.60499C8.32503 9.80555 8.24661 9.99815 8.10657 10.1417C7.96653 10.2853 7.77594 10.3685 7.57545 10.3735ZM9.99995 4.75C7.08345 4.75 4.71045 6.907 4.71045 9.5585C4.71045 10.6935 5.19045 12.238 6.52745 13.235L6.36995 14.882C6.36404 14.9427 6.37475 15.0038 6.40094 15.0589C6.42714 15.114 6.46782 15.1609 6.51864 15.1946C6.56946 15.2283 6.62849 15.2475 6.68941 15.2503C6.75033 15.253 6.81084 15.2391 6.86445 15.21L8.57995 14.287C8.79345 14.309 9.42045 14.367 9.99995 14.367C12.9164 14.367 15.2894 12.21 15.2894 9.5585C15.2894 6.907 12.9164 4.75 9.99995 4.75Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2234_1923">
          <rect width="12" height="12" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}