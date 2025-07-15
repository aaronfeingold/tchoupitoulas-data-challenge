"use client";

import { useState } from "react";
import { iceCreamAvatars } from "./ice-cream-avatars";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AvatarSelectorProps {
  selectedAvatar?: number;
  onAvatarSelect: (avatarIndex: number) => void;
  className?: string;
}

export function AvatarSelector({ 
  selectedAvatar = 0, 
  onAvatarSelect,
  className 
}: AvatarSelectorProps) {
  const [previewAvatar, setPreviewAvatar] = useState(selectedAvatar);

  const handleAvatarClick = (index: number) => {
    setPreviewAvatar(index);
    onAvatarSelect(index);
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Choose Your Ice Cream Avatar</CardTitle>
        <CardDescription>
          Select your favorite ice cream themed avatar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Preview Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3">
            {(() => {
              const Avatar = iceCreamAvatars[previewAvatar].component;
              return <Avatar size={80} />;
            })()}
          </div>
          <p className="text-sm font-medium text-center">
            {iceCreamAvatars[previewAvatar].name}
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-4 gap-3">
          {iceCreamAvatars.map((avatar, index) => {
            const Avatar = avatar.component;
            const isSelected = index === previewAvatar;
            
            return (
              <button
                key={index}
                onClick={() => handleAvatarClick(index)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                  ${isSelected 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                title={avatar.name}
              >
                <Avatar size={40} />
              </button>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={() => onAvatarSelect(previewAvatar)}
            disabled={previewAvatar === selectedAvatar}
          >
            {previewAvatar === selectedAvatar ? 'Current Selection' : 'Save Avatar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}