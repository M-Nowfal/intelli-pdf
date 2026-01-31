import { getColorFromName, getFirstLetter } from "@/helpers/name.helper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getOptimizedAvatar } from "@/helpers/cloudinary.helper";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ size = "sm" }: UserAvatarProps) {
  const { name, avatar } = useCurrentUser();

  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12 text-xl",
    lg: "w-18 h-18 text-3xl",
    xl: "w-25 h-25 text-5xl",
  };

  const fallbackBgColors = ["bg-sky-500", "bg-emerald-600", "bg-amber-500", "bg-pink-500", "bg-purple-500"];

  return (
    <Avatar className={`${sizes[size]} text-white font-semibold border cursor-pointer`}>
      <AvatarImage
        className="object-cover object-center"
        src={getOptimizedAvatar(avatar)}
        alt={name || ""}
      />
      <AvatarFallback
        className={fallbackBgColors[getColorFromName(name || "")]}
      >
        {getFirstLetter(name)}
      </AvatarFallback>
    </Avatar>
  );
}