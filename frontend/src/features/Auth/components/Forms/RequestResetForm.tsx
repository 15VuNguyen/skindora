import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormData = z.infer<typeof formSchema>;

export function RequestResetForm() {
  const { actions } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormData) => {
    actions.forgotPassword(values);
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Quên mật khẩu</CardTitle>
        <CardDescription>Nhập email để nhận liên kết đặt lại mật khẩu.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        disabled={actions.isRequestingReset}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={actions.isRequestingReset}>
              {actions.isRequestingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gửi liên kết đặt lại
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="mx-auto" asChild>
          <Link to="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
