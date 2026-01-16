export function getFirstLetter(name: string | undefined | null): string {
  if (!name)
    return "U";
  return name[0];
}

export function getTwoLetters(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

export const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 5;
};

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatChatListTitle(title: string): string {
  const cleanTitle = title.replace(/\(\d+\)|\d+|\.pdf/gi, "").trim();
  return capitalize(cleanTitle);
}