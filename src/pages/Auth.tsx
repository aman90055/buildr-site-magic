import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Mail } from "lucide-react";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user && !loading) navigate("/");
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({
          title: "Google sign-in failed",
          description: result.error.message || "Please try again.",
          variant: "destructive",
        });
        setIsGoogleLoading(false);
      }
      // On redirect, browser navigates away — no further action needed.
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not start Google sign-in.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      form.setError("email", { message: "Enter a valid email to reset password" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent a password reset link to your inbox.",
      });
      setMode("login");
    }
  };

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message.includes("Invalid login credentials")
              ? "Invalid email or password."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Welcome back!", description: "Logged in successfully." });
          navigate("/");
        }
      } else if (mode === "signup") {
        const { error } = await signUp(values.email, values.password);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message.includes("already registered")
              ? "Email already registered. Please log in."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Account created!", description: "Check your email to verify." });
          navigate("/");
        }
      }
    } catch {
      toast({ title: "Error", description: "Unexpected error. Try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const titleMap = {
    login: { title: "Welcome back", desc: "Sign in to access your dashboard and saved jobs" },
    signup: { title: "Create an account", desc: "Sign up to save jobs and unlock more features" },
    forgot: { title: "Reset your password", desc: "We'll email you a secure link to reset it" },
  };

  return (
    <>
      <Helmet>
        <title>{mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Reset Password"} | PDF Tools</title>
        <meta name="description" content="Sign in with Google or email to save your PDF jobs and access cloud features." />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">PDF Tools</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{titleMap[mode].title}</CardTitle>
            <CardDescription>{titleMap[mode].desc}</CardDescription>
          </CardHeader>
          <CardContent>
            {mode !== "forgot" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isSubmitting}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
              </>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mode !== "forgot" && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          {mode === "login" && (
                            <button
                              type="button"
                              onClick={() => setMode("forgot")}
                              className="text-xs text-primary hover:underline"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {mode === "forgot" ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={handleForgotPassword}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link...</>
                    ) : (
                      <><Mail className="mr-2 h-4 w-4" /> Send reset link</>
                    )}
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
                    ) : (
                      mode === "login" ? "Sign In" : "Sign Up"
                    )}
                  </Button>
                )}
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              {mode === "forgot" ? (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Back to sign in
                </button>
              ) : (
                <>
                  <span className="text-muted-foreground">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      form.reset();
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground text-center max-w-md">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
};

export default Auth;
