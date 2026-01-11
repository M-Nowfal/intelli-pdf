import { getColorFromName, getFirstLetter } from "@/helpers/name.helper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  src: string | undefined | null;
  alt?: string;
  fallback: string | undefined | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ src, alt, fallback, size = "sm" }: UserAvatarProps) {
  
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-18 h-18",
    xl: "w-25 h-25",
  };

  const fallbackBgColors = ["bg-sky-500", "bg-emerald-600", "bg-amber-500", "bg-pink-500", "bg-purple-500"];

  return (
    <Avatar className={`${sizes[size]} text-white font-semibold border cursor-pointer`}>
      <AvatarImage src={src || ""} alt={alt} />
      <AvatarFallback
        className={fallbackBgColors[getColorFromName(fallback || "UN")]}
      >{getFirstLetter(fallback)}</AvatarFallback>
    </Avatar>
  );
}