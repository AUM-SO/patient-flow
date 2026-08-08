"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/form/button";
import { Input } from "@/components/ui/form/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/form/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert";
import { signIn } from "@/features/auth/services/signIn";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
  redirectTo,
  className,
  ...props
}: React.ComponentProps<"form"> & { redirectTo: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signIn(values.email, values.password);
      router.push(redirectTo);
      router.refresh();
    } catch {
      setFormError("Invalid email or password.");
    }
  });

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} noValidate {...props}>
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Staff Login</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign in to monitor patient sessions
          </p>
        </div>

        {formError && (
          <Alert variant="destructive">
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            size="lg"
            placeholder="staff@example.com"
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              size="lg"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full text-white">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
