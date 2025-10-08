import * as z from "zod";

const vietnamesePhoneNumberRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "First name is required." })
      .max(30, "First name cannot exceed 30 characters."),
    last_name: z
      .string()
      .min(1, { message: "Last name is required." })
      .max(30, "Last name cannot exceed 30 characters."),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(30, "Password cannot exceed 30 characters."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(30, "Password cannot exceed 30 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export const profileUpdateSchema = z.object({
  first_name: z.string().max(50, "First name cannot exceed 50 characters.").optional().or(z.literal("")),
  last_name: z.string().max(50, "Last name cannot exceed 50 characters.").optional().or(z.literal("")),
  phone_number: z
    .string()
    .regex(vietnamesePhoneNumberRegex, "Vui lòng nhập số điện thoại Việt Nam hợp lệ.")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.")
    .optional()
    .or(z.literal("")),
  location: z.string().max(200, "Location cannot exceed 200 characters.").optional().or(z.literal("")),
  avatar: z.string().url({ message: "Please enter a valid URL for the avatar." }).optional().or(z.literal("")),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
