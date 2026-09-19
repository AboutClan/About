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
  return `<div style="display:flex; justify-content:center; align-items:center; width:120px;
  "> <svg xmlns="http://www.w3.org/2000/svg" width="56" height="60" viewBox="0 0 56 60" fill="none">
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
    right: 40px;
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
</svg></div>`;
};

export const getPlaceBasicIcon = (
  color: "orange" | "mint",
  text?: string,
  isBig?: boolean,
  rating?: number,
) => {
  const StarIcon = () => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--color-yellow)"
    >
      <path d="M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z" />
    </svg>
  `;

  // ✅ rating 안전 처리 (undefined, NaN 방지 / 0도 허용)
  const formattedRating =
    typeof rating === "number" && !Number.isNaN(rating) ? rating.toFixed(1) : "3.0";

  return `
  <div style="width:120px; height:60px; display:flex; justify-content:flex-end;  flex-direction:column; align-items:center;" >
  ${
    text
      ? `<div  style="display:flex; align-items:center;
           padding:4px 8px; padding-right:${
             isBig ? "8px" : "4px"
           }; margin-bottom:4px; text-align:center; line-height:12px; font-weight:600;font-size:10px;color:#424242; background:white; border:1px solid #eeeeee; border-radius:4px; height:20px; " >
    <div style="max-width:${
      isBig ? "72px" : "80px"
    }; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"> ${text}</div>
    <span style="margin:0 2px;">${StarIcon()}</span>
    ${formattedRating}</div>`
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

// ─── 카공지도 마커 ───────────────────────────────────────────────
// 로고 원본: 로고.svg (viewBox 0 0 67.71 85.65, 핀 끝이 하단 중앙).
// 원본의 핀 몸통은 속이 빈 고리라 지도가 비쳐 보이므로, 뒤에 채워진 핀 실루엣을 깔고 테두리를 둘러 윤곽을 살린다.

export interface CafeMapLogoPalette {
  body: string;
  outline: string;
  ring: string;
  frame: string;
  base: string;
  screen: string;
  notch: string;
  cup: string;
  steam: string;
}

export const CAFE_MAP_LOGO_DEFAULT: CafeMapLogoPalette = {
  body: "#ffffff",
  outline: "#2EB6AA",
  ring: "#ffffff", // 원본 연한 고리는 흰 몸통 위에서 이중 테두리처럼 보여 몸통색으로 채운다.
  frame: "#2eb6aa",
  base: "#7ac8c4",
  screen: "#ffffff",
  notch: "#ffffff",
  cup: "#2eb6aa",
  steam: "#2eb6aa",
};

// 선택 시 반전: 민트 몸통 + 흰 노트북.
const CAFE_MAP_LOGO_SELECTED: CafeMapLogoPalette = {
  body: "#2EB6AA",
  outline: "#ffffff",
  ring: "rgba(255, 255, 255, 0.35)",
  frame: "#ffffff",
  base: "#ffffff",
  screen: "#ffffff",
  notch: "#2EB6AA",
  cup: "#2EB6AA",
  steam: "#ffffff",
};

// 원(중심 33.86, 반지름 33.86) + 원이 y=57.99 에서 끊기는 지점부터 핀 끝까지의 삼각형.
const CAFE_MAP_PIN_SILHOUETTE =
  "M33.86,0A33.86,33.86,0,0,1,57.61,57.99L33.86,85.65L10.11,57.99A33.86,33.86,0,0,1,33.86,0Z";

const CAFE_MAP_LOGO_RATIO = 85.65 / 67.71;

export const getCafeMapLogo = (width: number, p: CafeMapLogoPalette) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(
  width * CAFE_MAP_LOGO_RATIO,
)}" viewBox="0 0 67.71 85.65" overflow="visible" style="display:block; filter:drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));">
  <path fill="${p.body}" stroke="${p.outline}" stroke-width="3.5" stroke-linejoin="round" d="${CAFE_MAP_PIN_SILHOUETTE}"/>
  <path fill="${p.ring}" d="M27.73,79.63c.48.49.95.96,1.39,1.41-.44-.44-.9-.91-1.39-1.41ZM67.32,28.71c0-.06-.01-.13-.03-.19C64.73,12.36,50.74,0,33.86,0S2.98,12.36.42,28.52c-.01.06-.02.13-.03.19-.26,1.68-.39,3.4-.39,5.15,0,3.34.48,6.58,1.39,9.62,1.28,3.5,3.25,7.19,5.58,10.87l2.83-4.8c-2.96-4.51-4.67-9.9-4.67-15.7,0-12.43,7.89-23.02,18.95-27.01,0,0,0-.02,0-.02.04-.38.09-.72.25-1.09.3-.72.99-2.02,1.73-2.32.47-.19,1.01.03,1.2.43.24.49.06.96-.36,1.27-.32.24-.45.65-.64.99-.01.02-.02.04-.03.06,2.04-.57,4.18-.91,6.38-1,.28-.55.63-1.05,1.06-1.48.28-.28.63-.4.99-.32.34.08.64.35.7.71.09.62-.15.71-.49,1.08,1.87.06,3.69.3,5.46.71.18-.56.49-1.05.8-1.55.16-.26.39-.46.6-.66.42-.41,1.03-.41,1.39-.04.42.43.34,1.05-.11,1.44-.4.35-.64.82-.84,1.31,11.81,3.56,20.4,14.53,20.4,27.49,0,5.79-1.71,11.19-4.67,15.69l2.84,4.8c2.34-3.68,4.3-7.37,5.59-10.87.9-3.05,1.39-6.28,1.39-9.62,0-1.75-.13-3.47-.39-5.15Z"/>
  <path fill="${p.ring}" d="M58.31,57.99c-3.05,4.37-6.5,8.63-9.82,12.45-.47.54-.93,1.07-1.39,1.59-.23.26-.46.51-.69.77s-.45.51-.68.75c-1.78,1.96-3.47,3.76-4.99,5.33-4.04,4.16-6.88,6.77-6.88,6.77,0,0-1.87-1.72-4.74-4.61-.44-.44-.9-.91-1.39-1.41-.12-.13-.25-.25-.37-.38-.13-.13-.25-.26-.38-.39-1.52-1.57-3.21-3.36-4.99-5.32-.23-.25-.45-.5-.68-.75-.68-.76-1.38-1.55-2.09-2.36-3.32-3.82-6.77-8.08-9.83-12.45h8.89c4.49,2.9,9.84,4.58,15.58,4.58s11.08-1.68,15.57-4.58h8.88Z"/>
  <polygon fill="${p.notch}" points="40.96 55.3 26.75 55.3 27.86 52.66 39.85 52.66 40.96 55.3"/>
  <path fill="${p.screen}" d="M54.15,22.24v22.57c0,.13-.1.23-.23.23H13.79c-.13,0-.23-.11-.23-.23v-22.57c0-.13.1-.23.23-.23h40.14c.13,0,.23.1.23.23Z"/>
  <path fill="${p.frame}" d="M55.69,19.46H12.02c-.58,0-1.04.47-1.04,1.04v27.07h45.75v-27.07c0-.58-.47-1.04-1.04-1.04ZM54.15,44.8c0,.13-.1.23-.23.23H13.79c-.13,0-.23-.11-.23-.23v-22.57c0-.13.1-.23.23-.23h40.14c.13,0,.23.1.23.23v22.57Z"/>
  <path fill="${p.screen}" d="M54.15,22.24v22.57c0,.13-.1.23-.23.23H13.79c-.13,0-.23-.11-.23-.23v-22.57c0-.13.1-.23.23-.23h40.14c.13,0,.23.1.23.23Z"/>
  <polygon fill="${p.base}" points="61.29 55.3 40.96 55.3 39.85 52.66 27.86 52.66 26.75 55.3 6.42 55.3 6.97 54.36 9.81 49.56 10.98 47.57 56.73 47.57 57.9 49.55 60.74 54.36 61.29 55.3"/>
  <polygon fill="${p.notch}" points="40.96 55.3 26.75 55.3 27.86 52.66 39.85 52.66 40.96 55.3"/>
  <path fill="${p.frame}" d="M61.29,55.3v1.87c0,.45-.37.82-.82.82H7.24c-.45,0-.82-.37-.82-.82v-1.87h54.88Z"/>
  <path fill="${p.screen}" d="M54.15,22.24v22.57c0,.13-.1.23-.23.23H13.79c-.13,0-.23-.11-.23-.23v-22.57c0-.13.1-.23.23-.23h40.14c.13,0,.23.1.23.23Z"/>
  <polygon fill="${p.notch}" points="40.96 55.3 26.75 55.3 27.86 52.66 39.85 52.66 40.96 55.3"/>
  <path fill="${p.cup}" d="M49.54,29.65c-.18-1.07-.89-1.81-1.99-1.93-.31-.04-.62-.03-.94,0-.5.04-.96.21-1.44.35-.06.02-.15.02-.15-.06v-1.39c-.02-.44-.09-.76-.57-.86h-21.59c-.32.08-.52.28-.53.6-.02.62-.05,1.23,0,1.85l.04.48c.01.18,0,.36.03.54l.08.64c.22,1.81.77,3.77,1.55,5.42.71,1.53,1.57,2.82,2.74,4.03.64.66,1.32,1.23,2.1,1.71.09.05.18.07.24.19-.1.06-.19.05-.32.05h-8.38c-.16,0-.21.19-.21.29,0,.12.08.21.2.26l1.14.42c.5.19,1.68.44,2.22.5l1.4.16c.23.02.43-.04.66.03h15.7c.56-.01,1.09-.06,1.63-.13l.72-.11c1.09-.16,2.14-.47,3.16-.93.14-.06.13-.26.09-.36-.04-.11-.16-.15-.3-.15h-8.55s-.09-.03-.1-.05c-.02-.02.02-.07.05-.09,2.08-1.3,3.59-3.09,4.74-5.25.08-.15.19-.24.36-.21.12.02.61-.06.76-.09l.64-.11c.14-.02.26-.05.4-.09,1.93-.47,3.78-1.49,4.33-3.54.19-.72.22-1.47.1-2.2ZM47.63,32.74c-.82.92-2.07,1.37-3.26,1.59-.17.03-.59.13-.64.09-.02-.02-.06-.07-.04-.12.6-1.51,1-3.08,1.18-4.69,0-.09.06-.17.14-.21.6-.26,1.82-.64,2.45-.51.75.17.95.74.96,1.46,0,.91-.17,1.69-.79,2.38Z"/>
  <path fill="${p.steam}" d="M28.22,14.17c-.21,1.25-.54,2.48-1.53,3.32-.39.33-.94.37-1.32.02-.33-.3-.46-.92-.08-1.29.45-.44.77-.91.9-1.52.13-.6.28-1.38.23-1.99-.08-.92-.41-1.5-.84-2.15-.15-.22-.3-.44-.47-.69-.6-.92-1.13-1.91-1.02-3.03,0,0,0-.02,0-.02.04-.38.09-.72.25-1.09.3-.72.99-2.02,1.73-2.32.47-.19,1.01.03,1.2.43.24.49.06.96-.36,1.27-.32.24-.45.65-.64.99-.01.02-.02.04-.03.06-.71,1.37.34,2.39,1.2,3.81.21.35.41.73.57,1.14.1.26.14.49.19.74.17.77.15,1.52.03,2.31Z"/>
  <path fill="${p.steam}" d="M43.8,15.9c-.24.65-.62,1.22-1.18,1.65-.45.34-1.07.23-1.36-.19-.3-.43-.2-.96.21-1.32.45-.37.66-.95.77-1.52.36-1.72.27-2.63-.73-4.08-.03-.04-.05-.08-.08-.12-.47-.68-.93-1.33-1.17-2.14-.27-.9-.23-1.26-.01-2.09.02-.08.04-.15.06-.23.18-.56.49-1.05.8-1.55.16-.26.39-.46.6-.66.42-.41,1.03-.41,1.39-.04.42.43.34,1.05-.11,1.44-.4.35-.64.82-.84,1.31-.01.04-.03.07-.04.11-.4,1.08.37,2.03.96,2.92.28.43.52.84.75,1.29.11.21.19.43.26.67.43,1.44.19,3.21-.3,4.55Z"/>
  <path fill="${p.steam}" d="M36.32,13.34c-.18,1.58-.43,3.23-1.75,4.22-.41.31-.95.22-1.27-.13-.3-.32-.32-.94.04-1.25.52-.45.77-1.02.91-1.69.16-.77.21-1.56.1-2.36-.26-.79-.66-1.46-1.14-2.12-.2-.28-.38-.56-.54-.85-.59-1.07-.83-2.19-.31-3.48.07-.18.15-.35.24-.52.28-.55.63-1.05,1.06-1.48.28-.28.63-.4.99-.32.34.08.64.35.7.71.09.62-.15.71-.49,1.08-.24.26-.51.64-.78,1.41-.3.89.22,1.68.83,2.59.55.82,1.17,1.73,1.32,2.91.06.43.14.82.09,1.27Z"/>
</svg>`;

const getCountBadge = (cnt: number) => `
<div style="
    position:absolute;
    top:-6px;
    right:-10px;
    min-width:18px;
    height:18px;
    padding:0 4px;
    box-sizing:border-box;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:11px;
    font-weight:700;
    line-height:1;
    color:white;
    background-color:#2EB6AA;
    border:2px solid white;
    border-radius:9px;
    box-shadow:0 1px 2px rgba(0, 0, 0, 0.2);
  ">${cnt > 99 ? "99+" : cnt}</div>`;

// 박스 대신 흰 외곽선 글자 — 겹쳐도 뒤 라벨/핀을 가리는 면적이 작다.
const LABEL_HALO =
  "text-shadow:-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 3px #fff;";

// 네이버 지도 자체 POI 라벨(검정 글자)과 구분되도록 이름은 브랜드 민트 계열로.
const CAFE_MAP_LABEL_COLOR = "#1E8C83";
// 별점은 흰 외곽선 글자로는 지도에 묻혀서, 흰 알약 + 연노랑 테두리로 분리한다 (채운 노랑은 너무 강함).
const CAFE_MAP_RATING_BORDER = "#FFC94D";
const CAFE_MAP_RATING_STAR = "#FFA800";

// CSS ellipsis 는 글자 단위로 잘리며 "…" 뒤에 빈틈이 남아서, 글자 수로 미리 자른다.
const CAFE_MAP_LABEL_MAX_CHARS = 9;

// 이름 + 점수 한 줄. 이름만 말줄임되고 점수는 항상 보인다.
const CAFE_MAP_LABEL_WIDTH = 150;

const getCafeMapLabel = (text: string, top: number, rating?: number, isSelected?: boolean) => {
  const name =
    text.length > CAFE_MAP_LABEL_MAX_CHARS
      ? `${text.slice(0, CAFE_MAP_LABEL_MAX_CHARS).trimEnd()}…`
      : text;
  const hasRating = typeof rating === "number" && !Number.isNaN(rating) && rating > 0;
  return `
  <div style="position:absolute; top:${top}px; left:50%; transform:translateX(-50%); width:${CAFE_MAP_LABEL_WIDTH}px; display:flex; justify-content:center; line-height:16px; pointer-events:none; ${LABEL_HALO}">
    <div style="pointer-events:auto; display:flex; align-items:center; max-width:100%; font-size:${
      isSelected ? 12 : 11
    }px; font-weight:${isSelected ? 800 : 700}; color:${CAFE_MAP_LABEL_COLOR};">
      <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</span>
      ${
        hasRating
          ? `<span style="flex-shrink:0; margin-left:3px; display:inline-flex; align-items:center; height:15px; padding:0 5px; box-sizing:border-box; border-radius:8px; background:#ffffff; border:1px solid ${CAFE_MAP_RATING_BORDER}; font-size:10px; font-weight:700; color:#424242; text-shadow:none;"><span style="color:${CAFE_MAP_RATING_STAR};">★</span>${rating.toFixed(
              1,
            )}</span>`
          : ""
      }
    </div>
  </div>`;
};

// 마커 박스는 핀 크기와 똑같이 잡는다 — 네이버는 이 박스 전체를 터치 영역으로 쓰므로,
// 박스가 크면 축소 화면에서 핀 주변 빈 곳을 눌러도 마커가 눌린다.
// 핀 끝이 박스 하단 중앙이라 anchor 는 (width / 2, height). 배지·라벨은 박스 밖으로 삐져나오게 둔다.
const getCafeMapPinWidth = (isSelected: boolean, isEmphasized: boolean) =>
  isSelected ? 42 : isEmphasized ? 38 : 34;

export const getCafeMapPinSize = ({
  isSelected = false,
  isEmphasized = false,
}: {
  isSelected?: boolean;
  isEmphasized?: boolean;
}) => {
  const width = getCafeMapPinWidth(isSelected, isEmphasized);
  return { width, height: Math.round(width * CAFE_MAP_LOGO_RATIO) };
};

export const getCafeMapPlaceIcon = ({
  text,
  rating,
  count = 1,
  isSelected = false,
  isEmphasized = false,
}: {
  text?: string;
  rating?: number;
  count?: number;
  isSelected?: boolean;
  /** 기본 위치 카페처럼 눈에 띄어야 하지만 선택 상태는 아닌 마커 — 색은 기본, 크기만 키운다. */
  isEmphasized?: boolean;
}) => {
  const { width, height } = getCafeMapPinSize({ isSelected, isEmphasized });
  return `
  <div style="position:relative; width:${width}px; height:${height}px;">
    ${getCafeMapLogo(width, isSelected ? CAFE_MAP_LOGO_SELECTED : CAFE_MAP_LOGO_DEFAULT)}
    ${count > 1 ? getCountBadge(count) : ""}
    ${text ? getCafeMapLabel(text, height + 2, rating, isSelected) : ""}
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
