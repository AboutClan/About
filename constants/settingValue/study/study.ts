//장소당 최대 인원
export const MAX_USER_PER_PLACE = 8;
//스터디 시간
export const STUDY_VOTE_START_HOUR = 16;
export const VOTER_DATE_END = 18;
export const STUDY_VOTE_END_HOUR = 23;

export const TODAY_START_HOUR = 9;

export const STUDY_START_VOTETIME_HOUR = 10;
export const STUDY_TIME_TABLE = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export const STUDY_VOTE_ICON = {
  default: `<button style="width: 34px; height: 34px; padding: 6px; border-radius: 50%; background-color: rgba(0, 194, 179, 0.1);">
        <div style="width: 100%; height: 100%; background-color: #00c2b3; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700; padding: 4px;">
            <div style="width: 100%; height: 100%; border-radius: 50%; background-color: white;"></div>
        </div></button>
  `,
  main: ` <button style="width: 34px; height: 34px; padding: 4px; border-radius: 50%; background-color: rgba(0, 194, 179, 0.1);">
        <div style="width: 100%; height: 100%; background-color: #00c2b3; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700;">
            A
        </div>
    </button>`,
  sub: `<button style="width: 34px; height: 34px; padding: 4px; border-radius: 50%; background-color: rgba(255, 107, 107, 0.1);">
  <div style="width: 100%; height: 100%; background-color: rgb(255,107,107); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: 700;">
      B
  </div>
</button>`,
};
