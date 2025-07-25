"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./sign-out-button";
import { NavigateToSignInButton } from "./sign-in-button";
import { User, Settings } from "lucide-react";
import { getAvatarComponent } from "@/components/avatars/ice-cream-avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const getAvatarDisplay = (
  avatarSelection?: number | null,
  userImage?: string | null
) => {
  // Priority: 1. Ice cream avatar selection, 2. User profile image, 3. Tchoup Sundae fallback
  if (avatarSelection !== null && avatarSelection !== undefined) {
    const avatarData = getAvatarComponent(avatarSelection);
    const Avatar = avatarData.component;
    return <Avatar size={32} />;
  }

  if (userImage) {
    return (
      <Image
        src={userImage}
        alt="User Avatar"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
    );
  }

  // Tchoup Sundae fallback
  return (
    <Image
      src="/Tchoup-Sundae-128x128.png"
      alt="User Avatar"
      width={32}
      height={32}
      className="w-8 h-8 rounded-full object-cover bg-background"
    />
  );
};

export function UserAvatar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>;
  }

  if (!session) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full p-0 overflow-visible"
          >
            {getAvatarDisplay(null, null)}
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

  const user = session.user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 overflow-visible"
        >
          {getAvatarDisplay(user?.avatarSelection, user?.image)}
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
              {user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
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
