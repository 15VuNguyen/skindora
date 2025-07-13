import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { type LoginFormData, loginSchema } from "@/schemas/authSchemas";
import { logger } from "@/utils";

import { useHandleOAuthCallback } from "../../hooks/useHandleOAuthCallback";
import GoogleButton from "../GoogleButton";
import Splitter from "../Splitter";

export function LoginForm() {
  const navigate = useNavigate();
  const { actions, handleGoogleLogin, isAuthenticated, user } = useAuth();
  const { isProcessingOAuth } = useHandleOAuthCallback();
  useEffect(() => {
    if (isAuthenticated && user) {
      logger.info("User redirecting la role:", user.role);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "STAFF":
          navigate("/staff", { replace: true });
          break;
        case "USER":
        default:
          navigate("/", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  if (isProcessingOAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }
  async function onSubmit(values: LoginFormData) {
    actions.login(values);
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin để truy cập tài khoản của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="pl-10 placeholder:text-gray-500"
                        {...field}
                        disabled={actions.isLoggingIn}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pl-10 placeholder:text-gray-500"
                        {...field}
                        disabled={actions.isLoggingIn}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={actions.isLoggingIn} />
                    </FormControl>
                    <div className="grid gap-1.5 leading-none">
                      <FormLabel className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Ghi nhớ đăng nhập
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Link to="/auth/forgot-password" className="text-primary text-sm hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={actions.isLoggingIn}>
              {actions.isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Splitter />
        <GoogleButton handleGoogleLogin={handleGoogleLogin} isAuthLoading={actions.isLoggingIn} />
        <p className="text-muted-foreground text-sm">
          Bạn chưa có tài khoản?{" "}
          <Link to="/auth/register" className="text-primary font-medium hover:underline">
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
