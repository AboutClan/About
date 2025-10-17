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

export const getPlaceCountIcon = (cnt?: number) => {
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

export const getPlaceBasicIcon = (color: "orange" | "mint", text?: string, isBig?: boolean) => {
  return `
  <div style="display:flex; flex-direction:column; align-items:center;">
  ${
    text
      ? `<div  style= "overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis; padding:4px 8px; padding-right:${
            isBig ? "8px" : "4px"
          }; margin-bottom:4px; text-align:center; line-height:12px; font-weight:600;font-size:10px;color:#424242; background:white; border:1px solid #eeeeee; border-radius:4px; height:20px; width:${
          isBig ? "72px" : "60px"
        };" >
    ${text} </div>`
      : ``
  }
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="36" viewBox="0 0 32 36" fill="none">
    <rect width="32" height="32" rx="16" fill="${color === "orange" ? "#FFA501" : "#00C2B3"}"/>
    <path d="M10.825 22.4831C10.4226 22.3081 10.1105 22.0661 9.8889 21.7569C9.67309 21.442 9.56519 21.0804 9.56519 20.6721C9.56519 20.3688 9.64393 19.9984 9.80141 19.561L12.881 11.6082C13.1668 10.8791 13.5809 10.3192 14.1234 9.92842C14.6716 9.5318 15.2957 9.3335 15.9956 9.3335C16.7014 9.3335 17.3255 9.5318 17.8679 9.92842C18.4162 10.3192 18.8332 10.8791 19.119 11.6082L22.1986 19.561C22.3561 20.0217 22.4348 20.3921 22.4348 20.6721C22.4348 21.0804 22.324 21.442 22.1024 21.7569C21.8866 22.0661 21.5774 22.3081 21.175 22.4831C20.895 22.6056 20.6092 22.6668 20.3176 22.6668C19.9035 22.6668 19.5185 22.5356 19.1627 22.2731C18.8128 22.0107 18.5532 21.6461 18.3841 21.1795L18.1829 20.5846H13.8347L13.6159 21.1795C13.4584 21.6345 13.2018 21.9961 12.846 22.2644C12.4961 22.5327 12.1082 22.6668 11.6824 22.6668C11.3908 22.6668 11.105 22.6056 10.825 22.4831ZM15.0333 16.98H16.9668L15.9956 13.5067L15.0333 16.98Z" fill="white"/>
    <path d="M16.433 34.3999C16.2406 34.7332 15.7594 34.7332 15.567 34.3999L13.77 31.2874C13.5775 30.9541 13.8181 30.5374 14.203 30.5374L17.797 30.5374C18.1819 30.5374 18.4225 30.9541 18.23 31.2874L16.433 34.3999Z" fill="${
      color === "orange" ? "#FFA501" : "#00C2B3"
    }"/>
  </svg></div>`;
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
