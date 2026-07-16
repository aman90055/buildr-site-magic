import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Consumes sessionStorage `auth_next` after social sign-in completes.
 * OAuth `redirect_uri` must be same-origin (window.location.origin), so we
 * stash the intended destination (e.g. /.lovable/oauth/consent?...) before
 * starting Google/Apple sign-in and navigate to it once the session hydrates.
 */
const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const consume = () => {
      const next = sessionStorage.getItem("auth_next");
      if (!next || !next.startsWith("/") || next === "/") return;
      sessionStorage.removeItem("auth_next");
      navigate(next, { replace: true });
    };

    // Check any existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) consume();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") consume();
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return null;
};

export default AuthRedirect;
