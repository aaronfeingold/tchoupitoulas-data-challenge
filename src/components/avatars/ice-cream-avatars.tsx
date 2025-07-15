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
        d="M12 8c0-2.2 1.8-4 4-4s4 1.8 4 4v4c0 2.2-1.8 4-4 4s-4-1.8-4-4V8z"
        fill="#FBBF24"
      />
      <ellipse cx="16" cy="10" rx="3" ry="2" fill="#FFFFFF" />
      <path
        d="M15 16L16 22L17 16"
        stroke="#D97706"
        strokeWidth="2"
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
      <circle cx="16" cy="12" r="6" fill="#92400E" />
      <circle cx="14" cy="10" r="1" fill="#451A03" />
      <circle cx="18" cy="11" r="1" fill="#451A03" />
      <path
        d="M15 20L16 26L17 20"
        stroke="#D97706"
        strokeWidth="2"
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
      <circle cx="16" cy="12" r="6" fill="#F87171" />
      <path
        d="M13 8L15 6L17 8L19 6L21 8"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="12" r="1" fill="#FFFFFF" />
      <rect x="13" y="18" width="6" height="8" rx="1" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 3: Mint Chip
export function MintAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#D1FAE5" />
      <circle cx="16" cy="12" r="6" fill="#34D399" />
      <rect x="14" y="10" width="1" height="1" fill="#059669" />
      <rect x="17" y="9" width="1" height="1" fill="#059669" />
      <rect x="15" y="13" width="1" height="1" fill="#059669" />
      <path
        d="M15 18L16 24L17 18"
        stroke="#D97706"
        strokeWidth="2"
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
      <path d="M10 12h12v4c0 3.3-2.7 6-6 6s-6-2.7-6-6v-4z" fill="#F87171" />
      <path d="M10 12h12v2c0 3.3-2.7 6-6 6s-6-2.7-6-6v-2z" fill="#FBBF24" />
      <path d="M10 12h12c0-3.3-2.7-6-6-6s-6 2.7-6 6z" fill="#34D399" />
      <rect x="13" y="22" width="6" height="6" rx="1" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 5: Cookies & Cream
export function CookiesAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#E5E7EB" />
      <circle cx="16" cy="12" r="6" fill="#FFFFFF" />
      <circle cx="14" cy="10" r="1" fill="#1F2937" />
      <circle cx="18" cy="11" r="1" fill="#1F2937" />
      <circle cx="16" cy="14" r="1" fill="#1F2937" />
      <path
        d="M15 18L16 24L17 18"
        stroke="#D97706"
        strokeWidth="2"
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
      <circle cx="16" cy="12" r="6" fill="#3B82F6" />
      <path
        d="M13 10c1-1 2-1 3 0s2 1 3 0"
        stroke="#1E40AF"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="16" cy="12" r="1" fill="#FFFFFF" />
      <rect x="13" y="18" width="6" height="8" rx="1" fill="#A3A3A3" />
    </svg>
  );
}

// Avatar 7: Caramel Swirl
export function CaramelAvatar({ size = 32, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="16" fill="#FEF3C7" />
      <circle cx="16" cy="12" r="6" fill="#FBBF24" />
      <path
        d="M13 9c2 1 4 1 6 0M13 12c2-1 4-1 6 0M13 15c2 1 4 1 6 0"
        stroke="#92400E"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M15 18L16 24L17 18"
        stroke="#D97706"
        strokeWidth="2"
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
