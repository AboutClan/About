import { ALPHABET_COLLECTION } from "@/constants/settingValue/collection";

export const getRandomAlphabet = (percent: number) => {
  const randomValue = Math.random();

  if (randomValue <= percent / 100) {
    const randomIdx = Math.floor(Math.random() * 5);

    const alphabet = ALPHABET_COLLECTION[randomIdx];
    return alphabet;
  }
  return null;
};
