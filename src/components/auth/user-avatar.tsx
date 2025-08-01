"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./sign-out-button";
import { NavigateToSignInButton } from "./sign-in-button";
import { User as UserIcon, Settings } from "lucide-react";
import { getAvatarComponent } from "@/components/avatars/ice-cream-avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarSkeleton } from "@/components/ui/avatar-skeleton";
import Link from "next/link";
import { useUserProfile } from "@/contexts/user-profile-context";

const getAvatarDisplay = ({
  avatarSelection,
  userImage,
}: {
  avatarSelection: number | null;
  userImage: string | null;
}) => {
  // Priority: 1. Ice cream avatar selection, 2. User profile image, 3. Tchoup Sundae fallback
  if (avatarSelection !== null && avatarSelection !== undefined) {
    const avatarData = getAvatarComponent(avatarSelection);
    const Avatar = avatarData.component;
    return <Avatar size={40} />;
  }

  return (
    <Image
      src={userImage ?? "/Tchoup-Sundae-128x128.png"}
      alt="User Avatar"
      width={40}
      height={40}
      className={`w-10 h-10 rounded-full ${userImage && "object-cover bg-background"}`}
    />
  );
};

export function UserAvatar() {
  const { data: session, status } = useSession();
  const { profileData } = useUserProfile();

  // Note: Loading state now handled by Suspense boundary in parent components
  // Keeping this as fallback for cases where Suspense isn't used
  if (status === "loading") {
    return <AvatarSkeleton size={40} />;
  }

  if (!session) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 overflow-visible"
          >
            {getAvatarDisplay({ avatarSelection: null, userImage: null })}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          forceMount
          sideOffset={4}
        >
          <DropdownMenuItem className="p-0">
            <NavigateToSignInButton
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 overflow-visible"
        >
          {getAvatarDisplay({
            avatarSelection: profileData?.avatarSelection ?? null,
            userImage: profileData?.image ?? null,
          })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        sideOffset={4}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profileData?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profileData?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
