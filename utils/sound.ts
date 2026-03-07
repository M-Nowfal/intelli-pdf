import { SOUND } from "./constants";

export function playSuccessSound(s: number = 1) {
  const { success1, success2 } = SOUND;
  const sound = new Audio(s === 1 ? success1 : success2);
  sound.play();
}