import { ArrowLeft, CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/types";

import { OrderHistoryTab } from "./components/OrderHistoryTab";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { SkinPreferencesTab } from "./components/SkinPreferencesTab";
import { useProfilePageLogic } from "./hooks/useProfilePageLogic";

const ProfileHeader = () => (
  <div className="mb-6">
    <Link to="/">
      <Button variant="ghost" className="text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
    </Link>
  </div>
);

interface UserCardProps {
  user: User;
  isEditing: boolean;
  isSubmittingActions: boolean;
  isSubmittingForm: boolean;
  watchedAvatar: string | undefined;
  displayName: string;
  avatarFallbackChar: string;
  memberSinceDate: string | null;
  isUserVerified: boolean;
  handleVerifyEmail: () => void;
  toggleEditMode: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isEditing,
  isSubmittingActions,
  isSubmittingForm,
  watchedAvatar,
  displayName,
  avatarFallbackChar,
  memberSinceDate,
  isUserVerified,
  handleVerifyEmail,
  toggleEditMode,
}) => (
  <Card className="mb-6 overflow-hidden">
    <CardContent className="pt-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <Avatar className="ring-primary/50 h-20 w-20 ring-2 ring-offset-2 sm:h-24 sm:w-24">
          <AvatarImage referrerPolicy="no-referrer" src={isEditing ? watchedAvatar : user.avatar} alt={displayName} />
          <AvatarFallback>{avatarFallbackChar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="mb-1 text-xl font-bold sm:text-2xl">{displayName}</h2>
          {memberSinceDate && (
            <p className="text-muted-foreground text-sm">
              Member since:{" "}
              {new Date(memberSinceDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
            <Badge
              variant={isUserVerified ? "default" : "destructive"}
              className={`flex items-center gap-1 px-2 py-0.5 text-xs ${isUserVerified ? "border-green-300 bg-green-100 text-green-700" : "border-yellow-300 bg-yellow-100 text-yellow-700"}`}
            >
              {isUserVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {isUserVerified ? "Verified" : "Unverified"}
            </Badge>
            {!isUserVerified && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerifyEmail}
                disabled={isSubmittingActions || isSubmittingForm}
              >
                {isSubmittingActions && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                <Mail className="mr-1.5 h-3 w-3" /> Verify Email
              </Button>
            )}
          </div>
        </div>
        <Button
          onClick={toggleEditMode}
          disabled={isSubmittingForm || isSubmittingActions}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ProfileTabs: React.FC<Pick<UserCardProps, "user" | "isEditing">> = ({ user, isEditing }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "personal";

  const { form, onSubmitProfileUpdate, isFormDirty, isSubmitting } = useProfilePageLogic();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-2 sm:grid-cols-3">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="preferences">Skin Preferences</TabsTrigger>
        <TabsTrigger value="orders">Order History</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-6">
        <PersonalInfoTab
          form={form}
          isEditing={isEditing}
          currentUser={user}
          onSubmitHandler={onSubmitProfileUpdate}
          isDirty={isFormDirty}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
      <TabsContent value="preferences" className="mt-6">
        <SkinPreferencesTab />
      </TabsContent>
      <TabsContent value="orders" className="mt-6">
        <OrderHistoryTab />
      </TabsContent>
    </Tabs>
  );
};

const ProfilePage = () => {
  const {
    user,
    isSubmittingActions,
    isEditing,
    handleVerifyEmail,
    displayName,
    isUserVerified,
    memberSinceDate,
    avatarFallbackChar,
    watchedAvatar,
    toggleEditMode,
  } = useProfilePageLogic();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <ProfileHeader />
        <UserCard
          user={user}
          isEditing={isEditing}
          isSubmittingActions={isSubmittingActions}
          isSubmittingForm={false} 
          watchedAvatar={watchedAvatar}
          displayName={displayName}
          avatarFallbackChar={avatarFallbackChar}
          memberSinceDate={memberSinceDate}
          isUserVerified={isUserVerified}
          handleVerifyEmail={handleVerifyEmail}
          toggleEditMode={toggleEditMode}
        />
        <ProfileTabs user={user} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default ProfilePage;
