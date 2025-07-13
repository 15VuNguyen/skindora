// [Filename: src/features/Auth/components/Forms/ResetPasswordForm.tsx]
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import type { ResetPasswordFormData } from "@/schemas/authSchemas";
import { resetPasswordSchema } from "@/schemas/authSchemas";

export const ResetPasswordForm = () => {
  const { actions } = useAuth();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("Invalid or missing password reset token. Please request a new link.");
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordFormData) {
    if (!token) {
      setError("Cannot reset password without a valid token.");
      return;
    }
    actions.resetPassword(token, values);
  }

  if (error) {
    return (
      <Card className="w-full max-w-md border-0 shadow-none sm:shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-destructive text-2xl">Invalid Link</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <AlertTriangle className="text-destructive mb-4 h-12 w-12" />
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full" asChild>
            <Link to="/auth/forgot-password">Request a new reset link</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className="flex h-64 w-full max-w-md items-center justify-center border-0 shadow-none sm:shadow-lg">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription> 
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                        disabled={actions.isResettingPassword}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                        disabled={actions.isResettingPassword}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={actions.isResettingPassword}>
              {actions.isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center">
        <div className="text-muted-foreground text-sm">
          Remember your password?
          <Link
            to="/auth/login"
            className="text-primary hover:text-primary/80 font-medium transition-all duration-200 hover:underline"
          >
            Sign in 
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
