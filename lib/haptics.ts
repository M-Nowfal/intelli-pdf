export function vibrate(duration: number = 60): void {

  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate?.(duration);
  }
}
