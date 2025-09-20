import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeader } from "@/contexts/header.context";
import { useRole } from "@/contexts/role.context";
import { OrderHistoryTab } from "@/features/Profile/components/OrderHistoryTab";
import { PersonalInfoTab } from "@/features/Profile/components/PersonalInfoTab";
import { SkinPreferencesTab } from "@/features/Profile/components/SkinPreferencesTab";
import { useProfilePageLogic } from "@/features/Profile/hooks/useProfilePageLogic";

const ProfileStaffPage = () => {
  const { setHeaderName } = useHeader();
  const { setRole } = useRole();
  useEffect(() => {
    setHeaderName("Hồ sơ");
    setRole("staff");
  }, []);
  const {
    user,
    isAuthLoadingGlobal,
    isEditing,
    isSubmittingActions,
    form,
    onSubmitProfileUpdate,
    handleVerifyEmail,
    displayName,
    isUserVerified,
    memberSinceDate,
    avatarFallbackChar,
    watchedAvatar,
    toggleEditMode,

    isFormDirty,
    isSubmitting,
  } = useProfilePageLogic();
  const navigate = useNavigate();
  if (isAuthLoadingGlobal || !user) {
    if (!user) {
      navigate("/auth/login", { replace: true });
    }
    return (
      <div className="flex min-h-[calc(100vh-var(--topbar-height,64px))] items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        {/* <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div> */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <Avatar className="ring-primary/50 h-20 w-20 ring-2 ring-offset-2 sm:h-24 sm:w-24">
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={isEditing ? watchedAvatar : user.avatar}
                  alt={displayName}
                />
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
                    className={`flex items-center gap-1 px-2 py-0.5 text-xs ${isUserVerified ? "border-green-300 bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" : "border-yellow-300 bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"}`}
                  >
                    {isUserVerified ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Unverified
                      </>
                    )}
                  </Badge>
                  {!isUserVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleVerifyEmail}
                      disabled={isSubmittingActions || form.formState.isSubmitting}
                    >
                      {isSubmittingActions && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                      <Mail className="mr-1.5 h-3 w-3" /> Verify Email
                    </Button>
                  )}
                </div>
              </div>
              <Button
                onClick={toggleEditMode}
                disabled={form.formState.isSubmitting || isSubmittingActions}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            {/* <TabsTrigger value="preferences">Skin Preferences</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger> */}
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
      </div>
    </div>
  );
};

export default ProfileStaffPage;
