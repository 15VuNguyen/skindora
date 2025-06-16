import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { type RegisterFormData, registerSchema } from "@/schemas/authSchemas";

import GoogleButton from "../GoogleButton";
import Splitter from "../Splitter";

export function RegisterForm() {
  const { handleGoogleLogin, actions } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: RegisterFormData) {
    await actions.register(values);
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                          placeholder="John"
                          className="pl-9 placeholder:text-gray-500"
                          {...field}
                          disabled={actions.isRegistering}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                          placeholder="Doe"
                          className="pl-9 placeholder:text-gray-500"
                          {...field}
                          disabled={actions.isRegistering}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        placeholder="you@example.com"
                        className="pl-9 placeholder:text-gray-500"
                        {...field}
                        disabled={actions.isRegistering}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 placeholder:text-gray-500"
                        {...field}
                        disabled={actions.isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 placeholder:text-gray-500"
                        {...field}
                        disabled={actions.isRegistering}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={actions.isRegistering}>
              {actions.isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Splitter />
        <GoogleButton handleGoogleLogin={handleGoogleLogin} isAuthLoading={actions.isRegistering} />
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
