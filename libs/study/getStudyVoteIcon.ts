export const getStudyVoteIcon = (type: "default" | "main" | "sub", text: string) => {
  const getBasicIcon = () => {
    switch (type) {
      case "default":
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28px" height="28px"><path class="fa-secondary" opacity="1" fill="#bdbdbd" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM256 104c-6.1 0-11.7 3.5-14.3 8.9l-36.2 73.4-81 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.8 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81.1-11.8-36.2-73.4c-2.7-5.5-8.3-8.9-14.3-8.9z"/><path class="fa-primary" fill="#ffffff" d="M270.3 112.9c-2.7-5.5-8.3-8.9-14.3-8.9s-11.7 3.5-14.3 8.9l-36.2 73.4-81.1 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.9 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81-11.8-36.2-73.4z"/></svg>
`;
      case "main":
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28px" height="28px"><path class="fa-secondary" opacity="1" fill="#00c2b3" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM256 104c-6.1 0-11.7 3.5-14.3 8.9l-36.2 73.4-81 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.8 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81.1-11.8-36.2-73.4c-2.7-5.5-8.3-8.9-14.3-8.9z"/><path class="fa-primary" fill="#ffffff" d="M270.3 112.9c-2.7-5.5-8.3-8.9-14.3-8.9s-11.7 3.5-14.3 8.9l-36.2 73.4-81.1 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.9 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81-11.8-36.2-73.4z"/></svg>`;
      case "sub":
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28px" height="28px"><path class="fa-secondary" opacity="1" fill="#ffa500" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM256 104c-6.1 0-11.7 3.5-14.3 8.9l-36.2 73.4-81 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.8 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81.1-11.8-36.2-73.4c-2.7-5.5-8.3-8.9-14.3-8.9z"/><path class="fa-primary" fill="#ffffff" d="M270.3 112.9c-2.7-5.5-8.3-8.9-14.3-8.9s-11.7 3.5-14.3 8.9l-36.2 73.4-81.1 11.8c-6 .9-11 5.1-12.9 10.9s-.3 12.2 4 16.4l58.6 57.2-13.8 80.7c-1 6 1.4 12.1 6.4 15.6s11.5 4.1 16.9 1.2L256 342.1l72.5 38.1c5.4 2.8 11.9 2.4 16.9-1.2s7.4-9.6 6.4-15.6l-13.8-80.7 58.6-57.2c4.4-4.3 5.9-10.6 4-16.4s-6.9-10-12.9-10.9l-81-11.8-36.2-73.4z"/></svg>`;
    }
  };
  return `<div style=" width:72px; height:72px; justify-content:center; display: flex; flex-direction: column; align-items:center;">
  <div style="padding:0px 4px; text-align:center; border:1px solid #9e9e9e; margin-bottom:8px;  background-color:#f5f5f5; font-weight:600; font-size:12px; white-space: nowrap;">${text}</div>
    ${getBasicIcon()}</div>`;
};

export const getStudyIcon = (
  type: "active" | "inactive" | "pending" | "none",
  cnt?: number,
  color?: string,
) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
      <rect x="2" y="3" width="32" height="32" rx="16" fill=${
        color === "orange" ? "#ffa501" : "#00C2B3"
      } />
      <path
        d="M12.825 25.4829C12.4226 25.3079 12.1105 25.0658 11.8889 24.7567C11.6731 24.4417 11.5652 24.0801 11.5652 23.6718C11.5652 23.3685 11.6439 22.9982 11.8014 22.5607L14.881 14.608C15.1668 13.8789 15.5809 13.319 16.1234 12.9282C16.6716 12.5316 17.2957 12.3333 17.9956 12.3333C18.7014 12.3333 19.3255 12.5316 19.8679 12.9282C20.4162 13.319 20.8332 13.8789 21.119 14.608L24.1986 22.5607C24.3561 23.0215 24.4348 23.3919 24.4348 23.6718C24.4348 24.0801 24.324 24.4417 24.1024 24.7567C23.8866 25.0658 23.5774 25.3079 23.175 25.4829C22.895 25.6053 22.6092 25.6666 22.3176 25.6666C21.9035 25.6666 21.5185 25.5354 21.1627 25.2729C20.8128 25.0104 20.5532 24.6459 20.3841 24.1793L20.1829 23.5843H15.8347L15.6159 24.1793C15.4584 24.6342 15.2018 24.9958 14.846 25.2641C14.4961 25.5324 14.1082 25.6666 13.6824 25.6666C13.3908 25.6666 13.105 25.6053 12.825 25.4829ZM17.0333 19.9798H18.9668L17.9956 16.5065L17.0333 19.9798Z"
        fill="white"
      />
      <path
        d="M18.433 37.3999C18.2405 37.7332 17.7594 37.7332 17.5669 37.3999L15.7699 34.2874C15.5775 33.9541 15.818 33.5374 16.2029 33.5374L19.797 33.5374C20.1819 33.5374 20.4224 33.9541 20.23 34.2874L18.433 37.3999Z"
        fill=${color === "orange" ? "#ffa501" : "#00C2B3"}
      />
      <g opacity="0.12" filter="url(#filter0_f_35_316)">
        <ellipse cx="18" cy="41.1499" rx="16" ry="1" fill="#424242" />
      </g>
${
  type === "none"
    ? null
    : type
    ? ` <div style="
    position: absolute;
    top: 1px;
    left: 24px;
    width: 16px;
    height: 16px;
    border-radius: 50%;

    background-color: ${
      type === "active"
        ? "var(--color-blue)"
        : type === "inactive"
        ? "var(--color-orange)"
        : "var(--color-gray)"
    };
    border: 2px solid white;
  "></div>`
    : `<div style="
    position: absolute;
    top: 1px;
    left: 24px;
    width: 16px;
    height: 16px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:8px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid var(--gray-300);
  ">${cnt}</div>`
}
    
      <defs>
        <filter id="filter0_f_35_316" x="0" y="38.1499" width="36" height="6" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_35_316" />
        </filter>
      </defs>
    </svg>`;
};

export const getCurrentLocationIcon = () => `
<div style="
width:16px;
height:16px;
background-color:var(--color-red);
border: 2px solid white;
box-shadow: 0px 0px 12px 12px rgba(255, 107, 107, 0.2);
border-radius:50%;
">

</div>

`;

export const getVoteLocationIcon = () => `
<div style="
width:16px;
height:16px;
background-color:var(--color-orange);
border: 2px solid white;
box-shadow: 0px 0px 12px 12px rgba(255, 165, 1, 0.2);
border-radius:50%;
">

</div>

`;
