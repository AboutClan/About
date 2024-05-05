export const getStudyVoteIcon = (type: "default" | "main" | "sub", text: string) => {
  const getBasicIcon = () => {
    switch (type) {
      case "default":
        return `<button style="width: 48px; height: 48px; padding: 8px; border-radius: 50%; background-color: rgba(0, 194, 179, 0.1);">
        <div style="width: 100%; height: 100%; background-color: #00c2b3; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700; padding: 4px;">
            <div style="width: 100%; height: 100%; border-radius: 50%; background-color: white;"></div>
        </div></button>`;
      case "main":
        return ` <button style="width: 48px; height: 48px; padding: 8px; border-radius: 50%; background-color: rgba(0, 194, 179, 0.1);">
        <div style="width: 100%; height: 100%; background-color: #00c2b3; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700;">
            A
        </div>
    </button>`;
      case "sub":
        return `<button style="width: 48px; height: 48px; padding: 8px; border-radius: 50%; background-color: rgba(255, 107, 107, 0.1);">
  <div style="width: 100%; height: 100%; background-color: rgb(255,107,107); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700;">
      B
  </div>
</button>`;
    }
  };
  return `<div style=" width:72px; height:72px; justify-content:center; display: flex; flex-direction: column; align-items:center;">
  <div style="padding:0px 4px; text-align:center; border:1px solid #cbd5e0;  background-color:#f7fafc; font-weight:600; font-size:12px; white-space: nowrap;">${text}</div>
    ${getBasicIcon()}</div>`;
};
