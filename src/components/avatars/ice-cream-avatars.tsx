import { SVGProps } from "react";

interface AvatarProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// Avatar 0: Classic Vanilla Cone
export function VanillaAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FEF3C7" />
      <path
        d="M11 8c0-2.8 2.2-5 5-5s5 2.2 5 5v4c0 2.8-2.2 5-5 5s-5-2.2-5-5V8z"
        fill="#FBBF24"
      />
      <ellipse cx="16" cy="9.5" rx="3.5" ry="2.5" fill="#FFFFFF" />
      <path
        d="M14.5 17L16 24L17.5 17"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Avatar 1: Chocolate Scoop
export function ChocolateAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FCD34D" />
      <circle cx="16" cy="11" r="7" fill="#92400E" />
      <circle cx="13.5" cy="9" r="1.5" fill="#451A03" />
      <circle cx="18.5" cy="10.5" r="1.5" fill="#451A03" />
      <path
        d="M14.5 18L16 26L17.5 18"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Avatar 2: Strawberry Sundae
export function StrawberryAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FECACA" />
      <circle cx="16" cy="11" r="7" fill="#F87171" />
      <path
        d="M12 7L14 5L16 7L18 5L20 7"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="11" r="1.5" fill="#FFFFFF" />
      <rect x="12.5" y="18" width="7" height="9" rx="1.5" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 3: Mint Chip
export function MintAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#D1FAE5" />
      <circle cx="16" cy="11" r="7" fill="#34D399" />
      <rect x="13" y="9" width="2" height="2" rx="0.5" fill="#059669" />
      <rect x="17" y="8" width="2" height="2" rx="0.5" fill="#059669" />
      <rect x="14.5" y="12.5" width="2" height="2" rx="0.5" fill="#059669" />
      <path
        d="M14.5 18L16 26L17.5 18"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Avatar 4: Rainbow Sherbet
export function RainbowAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FDE68A" />
      <path d="M9 11h14v5c0 3.9-3.1 7-7 7s-7-3.1-7-7v-5z" fill="#F87171" />
      <path d="M9 11h14v2.5c0 3.9-3.1 7-7 7s-7-3.1-7-7v-2.5z" fill="#FBBF24" />
      <path d="M9 11h14c0-3.9-3.1-7-7-7s-7 3.1-7 7z" fill="#34D399" />
      <rect x="12.5" y="23" width="7" height="7" rx="1.5" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 5: Cookies & Cream
export function CookiesAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#E5E7EB" />
      <circle cx="16" cy="11" r="7" fill="#FFFFFF" />
      <circle cx="13.5" cy="9" r="1.5" fill="#1F2937" />
      <circle cx="18.5" cy="10" r="1.5" fill="#1F2937" />
      <circle cx="16" cy="13" r="1.5" fill="#1F2937" />
      <path
        d="M14.5 18L16 26L17.5 18"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Avatar 6: Blue Moon
export function BlueMoonAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#DBEAFE" />
      <circle cx="16" cy="11" r="7" fill="#3B82F6" />
      <path
        d="M12 9c1.5-1 3-1 4 0s3 1 4 0"
        stroke="#1E40AF"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="16" cy="11" r="1.5" fill="#FFFFFF" />
      <rect x="12.5" y="18" width="7" height="9" rx="1.5" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 7: Caramel Swirl
export function CaramelAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FEF3C7" />
      <circle cx="16" cy="11" r="7" fill="#FBBF24" />
      <path
        d="M12 8c2.5 1 5 1 8 0M12 11c2.5-1 5-1 8 0M12 14c2.5 1 5 1 8 0"
        stroke="#92400E"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14.5 18L16 26L17.5 18"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const iceCreamAvatars = [
  { component: VanillaAvatar, name: "Vanilla Cone", color: "#FEF3C7" },
  { component: ChocolateAvatar, name: "Chocolate Scoop", color: "#FCD34D" },
  { component: StrawberryAvatar, name: "Strawberry Sundae", color: "#FECACA" },
  { component: MintAvatar, name: "Mint Chip", color: "#D1FAE5" },
  { component: RainbowAvatar, name: "Rainbow Sherbet", color: "#FDE68A" },
  { component: CookiesAvatar, name: "Cookies & Cream", color: "#E5E7EB" },
  { component: BlueMoonAvatar, name: "Blue Moon", color: "#DBEAFE" },
  { component: CaramelAvatar, name: "Caramel Swirl", color: "#FEF3C7" },
];

export function getAvatarComponent(index: number) {
  const avatarIndex = Math.max(
    0,
    Math.min(index || 0, iceCreamAvatars.length - 1),
  );
  return iceCreamAvatars[avatarIndex];
}
