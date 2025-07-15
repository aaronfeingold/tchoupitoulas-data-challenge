"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./sign-out-button";
import { SignInButton } from "./sign-in-button";
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

const getAvatarDisplay = (avatarSelection?: number | null, userImage?: string | null) => {
  if (userImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={userImage} 
        alt="User Avatar" 
        className="w-8 h-8 rounded-full"
      />
    );
  }
  
  // Use ice cream themed avatar
  const avatarData = getAvatarComponent(avatarSelection || 0);
  const Avatar = avatarData.component;
  return <Avatar size={32} />;
};

export function UserAvatar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
    );
  }

  if (!session) {
    return <SignInButton variant="outline" size="sm" />;
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {getAvatarDisplay(null, user?.image)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
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
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton variant="ghost" size="sm" className="w-full justify-start" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}