import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Mail, Phone, KeyRound } from "lucide-react";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(6).max(100);
// E.164 phone (e.g., +919876543210)
const phoneSchema = z.string().trim().regex(/^\+[1-9]\d{6,14}$/, "Use international format e.g. +919876543210");

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();

  const nextPath = useMemo(() => {
    const raw = params.get("next") || "/";
    return raw.startsWith("/") ? raw : "/";
  }, [params]);

  const [tab, setTab] = useState<"password" | "email-otp" | "phone-otp">("password");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
 const [isGoogleLoading, setIsGoogleLoading] = useState(false);
 const [isAppleLoading, setIsAppleLoading] = useState(false);

  // password form state
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);

  // email otp state
  const [otpEmail, setOtpEmail] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");

  // phone otp state
  const [otpPhone, setOtpPhone] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState("");

  useEffect(() => {
    if (user && !loading) navigate(nextPath, { replace: true });
  }, [user, loading, navigate, nextPath]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // store intended next path so we can redirect after session is set
      sessionStorage.setItem("auth_next", nextPath);
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
    } catch {
      toast({ title: "Error", description: "Could not start Google sign-in.", variant: "destructive" });
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      sessionStorage.setItem("auth_next", nextPath);
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({
          title: "Apple sign-in failed",
          description: result.error.message || "Please try again.",
          variant: "destructive",
        });
        setIsAppleLoading(false);
      }
    } catch {
      toast({ title: "Error", description: "Could not start Apple sign-in.", variant: "destructive" });
      setIsAppleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const parsed = emailSchema.safeParse(pwEmail);
    if (!parsed.success) {
      setPwError("Enter a valid email to reset password");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(pwEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We've sent a password reset link." });
      setMode("login");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    const emailOk = emailSchema.safeParse(pwEmail);
    const passOk = passwordSchema.safeParse(pwPassword);
    if (!emailOk.success) return setPwError("Please enter a valid email.");
    if (!passOk.success) return setPwError("Password must be at least 6 characters.");

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(pwEmail, pwPassword);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message.includes("Invalid login credentials")
              ? "Invalid email or password."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Welcome back!" });
          navigate(nextPath, { replace: true });
        }
      } else {
        const { error } = await signUp(pwEmail, pwPassword);
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
          navigate(nextPath, { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email OTP
  const sendEmailOtp = async () => {
    const parsed = emailSchema.safeParse(otpEmail);
    if (!parsed.success) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}${nextPath}` },
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Could not send code", description: error.message, variant: "destructive" });
    } else {
      setEmailOtpSent(true);
      toast({ title: "Code sent", description: "Check your email for the 6-digit code." });
    }
  };

  const verifyEmailOtp = async () => {
    if (emailOtpCode.length < 6) return;
    setIsSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      email: otpEmail,
      token: emailOtpCode,
      type: "email",
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed in!" });
      navigate(nextPath, { replace: true });
    }
  };

  // Phone OTP
  const sendPhoneOtp = async () => {
    const parsed = phoneSchema.safeParse(otpPhone);
    if (!parsed.success) {
      toast({ title: "Invalid phone", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: otpPhone,
      options: { shouldCreateUser: true },
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Could not send SMS", description: error.message, variant: "destructive" });
    } else {
      setPhoneOtpSent(true);
      toast({ title: "Code sent", description: "Check your phone for the 6-digit code." });
    }
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtpCode.length < 6) return;
    setIsSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: otpPhone,
      token: phoneOtpCode,
      type: "sms",
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed in!" });
      navigate(nextPath, { replace: true });
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
    login: { title: "Welcome back", desc: "Sign in to continue" },
    signup: { title: "Create your account", desc: "Sign up free — no credit card required" },
    forgot: { title: "Reset your password", desc: "We'll email you a secure link" },
  };

  return (
    <>
      <Helmet>
        <title>{mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Reset Password"} | The Docunova AI Suite</title>
        <meta name="description" content="Sign in with Google, email OTP, phone OTP, or password to access free PDF, AI & productivity tools." />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">The Docunova AI Suite</span>
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

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4"
                  onClick={handleAppleSignIn}
                  disabled={isAppleLoading || isGoogleLoading || isSubmitting}
                >
                  {isAppleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  Continue with Apple
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="password"><KeyRound className="h-4 w-4 mr-1" />Password</TabsTrigger>
                    <TabsTrigger value="email-otp"><Mail className="h-4 w-4 mr-1" />Email OTP</TabsTrigger>
                    <TabsTrigger value="phone-otp"><Phone className="h-4 w-4 mr-1" />Phone OTP</TabsTrigger>
                  </TabsList>

                  {/* Password tab */}
                  <TabsContent value="password" className="mt-4">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pw-email">Email</Label>
                        <Input id="pw-email" type="email" placeholder="you@example.com" value={pwEmail} onChange={(e) => setPwEmail(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pw-password">Password</Label>
                          {mode === "login" && (
                            <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <Input id="pw-password" type="password" placeholder="••••••••" value={pwPassword} onChange={(e) => setPwPassword(e.target.value)} required />
                      </div>
                      {pwError && <p className="text-sm text-destructive">{pwError}</p>}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating..."}</> : (mode === "login" ? "Sign In" : "Sign Up")}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Email OTP tab */}
                  <TabsContent value="email-otp" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-email">Email</Label>
                      <Input id="otp-email" type="email" placeholder="you@example.com" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} disabled={emailOtpSent} />
                    </div>
                    {!emailOtpSent ? (
                      <Button className="w-full" onClick={sendEmailOtp} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                        Send code
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Enter 6-digit code</Label>
                          <InputOTP maxLength={6} value={emailOtpCode} onChange={setEmailOtpCode}>
                            <InputOTPGroup>
                              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <Button className="w-full" onClick={verifyEmailOtp} disabled={isSubmitting || emailOtpCode.length < 6}>
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Verify & continue
                        </Button>
                        <button type="button" onClick={() => { setEmailOtpSent(false); setEmailOtpCode(""); }} className="text-sm text-primary hover:underline w-full text-center">
                          Use a different email
                        </button>
                      </>
                    )}
                  </TabsContent>

                  {/* Phone OTP tab */}
                  <TabsContent value="phone-otp" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-phone">Phone (with country code)</Label>
                      <Input id="otp-phone" type="tel" placeholder="+919876543210" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} disabled={phoneOtpSent} />
                      <p className="text-xs text-muted-foreground">Use international format starting with +.</p>
                    </div>
                    {!phoneOtpSent ? (
                      <Button className="w-full" onClick={sendPhoneOtp} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
                        Send SMS code
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Enter 6-digit code</Label>
                          <InputOTP maxLength={6} value={phoneOtpCode} onChange={setPhoneOtpCode}>
                            <InputOTPGroup>
                              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <Button className="w-full" onClick={verifyPhoneOtp} disabled={isSubmitting || phoneOtpCode.length < 6}>
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Verify & continue
                        </Button>
                        <button type="button" onClick={() => { setPhoneOtpSent(false); setPhoneOtpCode(""); }} className="text-sm text-primary hover:underline w-full text-center">
                          Use a different phone
                        </button>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}

            {mode === "forgot" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" placeholder="you@example.com" value={pwEmail} onChange={(e) => setPwEmail(e.target.value)} />
                </div>
                {pwError && <p className="text-sm text-destructive">{pwError}</p>}
                <Button className="w-full" onClick={handleForgotPassword} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Mail className="mr-2 h-4 w-4" /> Send reset link</>}
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              {mode === "forgot" ? (
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                  Back to sign in
                </button>
              ) : (
                <>
                  <span className="text-muted-foreground">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
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
