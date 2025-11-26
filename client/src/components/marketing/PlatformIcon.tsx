import { SiInstagram, SiTiktok, SiYoutube, SiX, SiSnapchat, SiFacebook, SiTelegram } from "react-icons/si";
import { Globe } from "lucide-react";

type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "x" | "snapchat" | "facebook" | "telegram" | "other";

interface PlatformIconProps {
  platform: Platform;
  className?: string;
}

export function PlatformIcon({ platform, className = "h-4 w-4" }: PlatformIconProps) {
  const icons = {
    instagram: SiInstagram,
    tiktok: SiTiktok,
    youtube: SiYoutube,
    twitter: SiX,
    x: SiX,
    snapchat: SiSnapchat,
    facebook: SiFacebook,
    telegram: SiTelegram,
    other: Globe,
  };

  const Icon = icons[platform] || Globe;

  return <Icon className={className} />;
}
