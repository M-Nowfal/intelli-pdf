import { APP_NAME, ICON } from "@/utils/constants";
import Image from "next/image";

type LogoParams = {
  onlyLogo?: boolean;
};

export function Logo({ onlyLogo = false }: LogoParams) {

  return (
    <figure className="flex items-center gap-2">
      <Image
        src={ICON}
        alt={APP_NAME}
        width={35}
        height={35}
      />
      <figcaption className="text-lg md:text-xl font-semibold">
        {!onlyLogo && <span>{APP_NAME}</span>}
      </figcaption>
    </figure>
  );
}