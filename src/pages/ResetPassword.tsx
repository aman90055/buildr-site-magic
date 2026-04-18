import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, KeyRound } from "lucide-react";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirm: z.string().min(6),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type Values = z.infer<typeof schema>;

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  useEffect(() => {
    // Supabase puts recovery tokens in the URL hash; once parsed, a session exists.
    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (values: Values) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You can now sign in with your new password." });
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | PDF Tools</title>
        <meta name="description" content="Set a new password for your PDF Tools account." />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">PDF Tools</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> Set new password
            </CardTitle>
            <CardDescription>
              {hasRecoverySession
                ? "Enter your new password below."
                : "Open this page from the email link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting || !hasRecoverySession}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <Link to="/auth" className="text-primary hover:underline font-medium">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
