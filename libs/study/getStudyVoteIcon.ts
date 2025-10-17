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

export const getStudyIcon = (cnt?: number) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="60" viewBox="0 0 56 60" fill="none">
<g filter="url(#filter0_d_2023_1738)">
<rect x="12" y="12.7065" width="32" height="32" rx="16" fill="#00C2B3"/>
<path d="M22.825 35.1896C22.4226 35.0147 22.1105 34.7726 21.8889 34.4635C21.6731 34.1485 21.5652 33.7869 21.5652 33.3786C21.5652 33.0753 21.6439 32.705 21.8014 32.2675L24.881 24.3148C25.1668 23.5857 25.5809 23.0257 26.1234 22.635C26.6716 22.2383 27.2957 22.04 27.9956 22.04C28.7014 22.04 29.3255 22.2383 29.8679 22.635C30.4162 23.0257 30.8332 23.5857 31.119 24.3148L34.1986 32.2675C34.3561 32.7283 34.4348 33.0987 34.4348 33.3786C34.4348 33.7869 34.324 34.1485 34.1024 34.4635C33.8866 34.7726 33.5774 35.0147 33.175 35.1896C32.895 35.3121 32.6092 35.3734 32.3176 35.3734C31.9035 35.3734 31.5185 35.2421 31.1627 34.9797C30.8128 34.7172 30.5532 34.3527 30.3841 33.8861L30.1829 33.2911H25.8347L25.6159 33.8861C25.4584 34.341 25.2018 34.7026 24.846 34.9709C24.4961 35.2392 24.1082 35.3734 23.6824 35.3734C23.3908 35.3734 23.105 35.3121 22.825 35.1896ZM27.0333 29.6866H28.9668L27.9956 26.2133L27.0333 29.6866Z" fill="white"/>
<path d="M28.433 47.1064C28.2405 47.4398 27.7594 47.4398 27.5669 47.1064L25.7699 43.9939C25.5775 43.6606 25.818 43.2439 26.2029 43.2439L29.797 43.2439C30.1819 43.2439 30.4224 43.6606 30.23 43.9939L28.433 47.1064Z" fill="#00C2B3"/>
</g>
<defs>
<filter id="filter0_d_2023_1738" x="0" y="0.706543" width="56" height="59.1499" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="6"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.760784 0 0 0 0 0.701961 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2023_1738"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2023_1738" result="shape"/>
</filter>
</defs>${`<div style="
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:8px;
    font-weight:600;
    border-radius: 50%;
    background-color: white;
  
    outline: 1px solid var(--gray-300);
  ">${cnt}</div>`}
</svg>`;
};

export const getStudyIcon2 = (
  type: "active" | "none",
  cnt?: number,
  color?: string,
  text?: string,
) => {
  return `
  <div style="display:flex; flex-direction:column; align-items:center;">
  ${
    text
      ? `<div  style= "  overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis; padding:4px 8px;padding-right:4px; margin-bottom:4px; text-align:center; line-height:12px; font-weight:600;font-size:10px;color:#424242; background:white; border:1px solid #eeeeee; border-radius:4px; height:20px; width:60px;" >
    ${text} </div>`
      : ``
  }
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
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

    background-color:var(--color-orange);
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
    
     
    </svg></div>`;
};

export const getStudyIcon3 = (text: string) => {
  // wrapper는 반드시 SVG와 동일한 박스 크기로 고정
  return `
  <div style="position:relative; font-size:10px;  font-weight:600; text-align:center; width:36px; height:42px; display:block; box-sizing:border-box;">
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42" fill="none" style="display:block">
      <rect x="2" width="32" height="32" rx="16" fill="#00C2B3"/>
      <path d="M12.825 22.4831C12.4226 22.3081 12.1105 22.0661 11.8889 21.7569C11.6731 21.442 11.5652 21.0804 11.5652 20.6721C11.5652 20.3688 11.6439 19.9984 11.8014 19.561L14.881 11.6082C15.1668 10.8791 15.5809 10.3192 16.1234 9.92842C16.6716 9.5318 17.2957 9.3335 17.9956 9.3335C18.7014 9.3335 19.3255 9.5318 19.8679 9.92842C20.4162 10.3192 20.8332 10.8791 21.119 11.6082L24.1986 19.561C24.3561 20.0217 24.4348 20.3921 24.4348 20.6721C24.4348 21.0804 24.324 21.442 24.1024 21.7569C23.8866 22.0661 23.5774 22.3081 23.175 22.4831C22.895 22.6056 22.6092 22.6668 22.3176 22.6668C21.9035 22.6668 21.5185 22.5356 21.1627 22.2731C20.8128 22.0107 20.5532 21.6461 20.3841 21.1795L20.1829 20.5846H15.8347L15.6159 21.1795C15.4584 21.6345 15.2018 21.9961 14.846 22.2644C14.4961 22.5327 14.1082 22.6668 13.6824 22.6668C13.3908 22.6668 13.105 22.6056 12.825 22.4831ZM17.0333 16.98H18.9668L17.9956 13.5067L17.0333 16.98Z" fill="white"/>
      <path d="M18.433 34.3999C18.2405 34.7332 17.7594 34.7332 17.5669 34.3999L15.7699 31.2874C15.5775 30.9541 15.818 30.5374 16.2029 30.5374L19.797 30.5374C20.1819 30.5374 20.4224 30.9541 20.23 31.2874L18.433 34.3999Z" fill="#00C2B3"/>
      <g opacity="0.12" filter="url(#filter0_f_2023_1828)">
        <ellipse cx="18" cy="38.1499" rx="16" ry="1" fill="#424242"/>
      </g>
      <defs>
        <filter id="filter0_f_2023_1828" x="0" y="35.1499" width="36" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2023_1828"/>
        </filter>
      </defs>
    </svg>
    ${text && text !== "none" ? text : ""}
  </div>`;
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
