"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarSection } from "./avatar-section";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions";
import { User } from "@/lib/schema";

interface ProfileFormProps {
  onSave: () => void;
  initialData?: User | null;
}

export function ProfileForm({ onSave, initialData }: ProfileFormProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || session?.user?.name || "",
    location: initialData?.location || "",
    favoriteIceCreamFlavor: initialData?.favoriteIceCreamFlavor || "",
    favoriteTopping: initialData?.favoriteTopping || "",
    favoriteBrand: initialData?.favoriteBrand || "",
    favoritePlace: initialData?.favoritePlace || "",
    avatarSelection: initialData?.avatarSelection || 0,
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || session?.user?.name || "",
        location: initialData.location || "",
        favoriteIceCreamFlavor: initialData.favoriteIceCreamFlavor || "",
        favoriteTopping: initialData.favoriteTopping || "",
        favoriteBrand: initialData.favoriteBrand || "",
        favoritePlace: initialData.favoritePlace || "",
        avatarSelection: initialData.avatarSelection || 0,
      });
    }
  }, [initialData, session?.user?.name]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert object to FormData
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });

      await updateUserProfile(form);

      toast.success("Profile updated successfully!");
      onSave();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Selection */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Choose Your Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarSection
            selectedAvatar={formData.avatarSelection}
            onAvatarChange={(avatar) =>
              handleInputChange("avatarSelection", avatar)
            }
          />
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your display name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Where are you from?"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ice Cream Preferences */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Ice Cream Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Favorite Flavor</label>
            <Input
              value={formData.favoriteIceCreamFlavor}
              onChange={(e) =>
                handleInputChange("favoriteIceCreamFlavor", e.target.value)
              }
              placeholder="e.g., Vanilla, Chocolate, Strawberry"
              className="mt-1"
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Favorite Topping</label>
            <Input
              value={formData.favoriteTopping}
              onChange={(e) =>
                handleInputChange("favoriteTopping", e.target.value)
              }
              placeholder="e.g., Sprinkles, Hot Fudge, Nuts"
              className="mt-1"
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Favorite Brand</label>
            <Input
              value={formData.favoriteBrand}
              onChange={(e) =>
                handleInputChange("favoriteBrand", e.target.value)
              }
              placeholder="e.g., Ben & Jerry's, Haagen-Dazs"
              className="mt-1"
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Favorite Place</label>
            <Input
              value={formData.favoritePlace}
              onChange={(e) =>
                handleInputChange("favoritePlace", e.target.value)
              }
              placeholder="e.g., Local shop, Beach, Home"
              className="mt-1"
              maxLength={100}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-32">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
