"use client";

import { getAvatarComponent } from "@/components/avatars/ice-cream-avatars";
import { Button } from "@/components/ui/button";

interface AvatarSectionProps {
  selectedAvatar: number;
  onAvatarChange: (avatar: number) => void;
}

export function AvatarSection({ selectedAvatar, onAvatarChange }: AvatarSectionProps) {
  // Get all 8 ice cream avatars
  const avatars = Array.from({ length: 8 }, (_, i) => getAvatarComponent(i));

  return (
    <div className="space-y-4">
      {/* Current Selection */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mint to-pink p-3 flex items-center justify-center mb-2">
          {(() => {
            const Avatar = avatars[selectedAvatar].component;
            return <Avatar size={56} />;
          })()}
        </div>
        <p className="text-sm text-muted-foreground">
          {avatars[selectedAvatar].name}
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar, index) => {
          const Avatar = avatar.component;
          const isSelected = selectedAvatar === index;

          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className={`aspect-square p-2 h-auto ${
                isSelected
                  ? "ring-2 ring-mint shadow-lg"
                  : "hover:ring-1 hover:ring-mint/50"
              }`}
              onClick={() => onAvatarChange(index)}
              type="button"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Avatar size={32} />
              </div>
            </Button>
          );
        })}
      </div>

      {/* Description */}
      <p className="text-xs text-center text-muted-foreground">
        Choose your ice cream themed avatar to represent you in the Hall of Fame community!
      </p>
    </div>
  );
}
