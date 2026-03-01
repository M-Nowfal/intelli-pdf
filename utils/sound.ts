import { SUCCESS_SOUND } from "./constants";

export function playSuccessSound() {
  const sound = new Audio(SUCCESS_SOUND);
  sound.play();
}