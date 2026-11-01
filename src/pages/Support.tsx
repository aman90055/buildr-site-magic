import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { LifeBuoy, Plus, Trash2, UserRound, Mail } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Tool, ToolContent, ToolHeader, ToolOutput } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";

interface Thread { id: string; title: string; status: string; updated_at: string }

const TOOL_LABELS: Record<string, string> = {
  "tool-searchHelpDocs": "Checked help articles",
  "tool-getMyAccount": "Looked up your account",
  "tool-handOffToHuman": "Passed to a person",
};

function ChatWindow({ threadId, initial, handedOff, onActivity }: {
  threadId: string; initial: UIMessage[]; handedOff: boolean; onActivity: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`,
    headers: async () => {
      const { data } = await supabase.auth.getSession();
      return {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${data.session?.access_token ?? ""}`,
      };
    },
    prepareSendMessagesRequest: ({ messages, headers }) => ({
      headers, body: { threadId, message: messages[messages.length - 1] },
    }),
  }), [threadId]);

  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId, messages: initial, transport,
    onError: (e) => toast.error(e.message?.includes("{") ? safeErr(e.message) : e.message || "Network error"),
    onFinish: () => { onActivity(); textareaRef.current?.focus(); },
  });

  useEffect(() => { textareaRef.current?.focus(); }, []);
  const busy = status === "submitted" || status === "streaming";
  const showHandoff = handedOff || messages.some((m) => m.parts.some((p) => p.type === "tool-handOffToHuman"));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<LifeBuoy className="size-10 text-primary" />}
              title="How can we help?"
              description="Ask about any tool, your plan, a payment you submitted or a recent job. If Nova isn't sure, it emails the team for you."
            />
          ) : messages.map((m) => (
            <Message from={m.role} key={m.id}>
              <MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : ""}>
                {m.parts.map((part, i) => {
                  if (part.type === "text") return <MessageResponse key={i}>{part.text}</MessageResponse>;
                  if (part.type.startsWith("tool-")) {
                    const tp = part as any;
                    return (
                      <Tool key={i} defaultOpen={false}>
                        <ToolHeader type={tp.type} state={tp.state} title={TOOL_LABELS[tp.type] ?? "Tool"} />
                        <ToolContent>
                          <ToolOutput output={tp.output} errorText={tp.errorText} />
                        </ToolContent>
                      </Tool>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Message from="assistant"><MessageContent><Shimmer>Nova is checking…</Shimmer></MessageContent></Message>
          )}
          {error && <p className="text-sm text-destructive">Message failed. You can try sending it again.</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-3 pb-4">
        {showHandoff && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            <UserRound className="size-4 shrink-0" />
            A person from the team has been notified and will reply to your account email.
          </div>
        )}
        <PromptInput onSubmit={({ text }) => {
          if (!text?.trim() || busy) return;
          sendMessage({ text: text.trim() });
        }}>
          <PromptInputBody>
            <PromptInputTextarea ref={textareaRef} placeholder="Type your question…" maxLength={4000} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <a href="mailto:documentai999@gmail.com" className="flex items-center gap-1 px-2 text-xs text-muted-foreground hover:text-foreground">
                <Mail className="size-3.5" /> Email us instead
              </a>
            </PromptInputTools>
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function safeErr(raw: string) {
  try { return JSON.parse(raw).error ?? "Something went wrong"; } catch { return "Something went wrong"; }
}

export default function Support() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const creating = useRef(false);

  const loadThreads = useCallback(async () => {
    const { data, error } = await supabase.from("support_threads")
      .select("id,title,status,updated_at").order("updated_at", { ascending: false });
    if (error) { toast.error("Could not load conversations"); return []; }
    setThreads(data ?? []);
    return data ?? [];
  }, []);

  const createThread = useCallback(async () => {
    if (!user || creating.current) return;
    creating.current = true;
    const { data, error } = await supabase.from("support_threads").insert({ user_id: user.id }).select("id").single();
    creating.current = false;
    if (error || !data) { toast.error("Could not start a conversation"); return; }
    await loadThreads();
    navigate(`/support/${data.id}`);
  }, [user, loadThreads, navigate]);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    loadThreads().then((list) => {
      if (!threadId) {
        if (list.length) navigate(`/support/${list[0].id}`, { replace: true });
        else createThread();
      }
    });
  }, [user, threadId, loadThreads, navigate, createThread]);

  useEffect(() => {
    if (!user || !threadId) return;
    setInitial(null);
    supabase.from("support_messages").select("message").eq("thread_id", threadId).order("created_at")
      .then(({ data, error }) => {
        if (error) { toast.error("Could not load messages"); setInitial([]); return; }
        setInitial((data ?? []).map((r) => r.message as unknown as UIMessage));
      });
  }, [user, threadId]);

  const deleteThread = async (id: string) => {
    const { error } = await supabase.from("support_threads").delete().eq("id", id);
    if (error) { toast.error("Could not delete"); return; }
    const list = await loadThreads();
    if (id === threadId) navigate(list.length ? `/support/${list[0].id}` : "/support");
  };

  const active = threads.find((t) => t.id === threadId);

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <Helmet>
        <title>Support chat | Docunova</title>
        <meta name="description" content="Get help with Docunova PDF tools, your plan and payments. Our assistant answers from our help docs and hands off to a person when needed." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <div className="flex min-h-0 flex-1 pt-16">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border md:flex">
          <div className="p-3">
            <Button onClick={createThread} className="w-full gap-2"><Plus className="size-4" /> New conversation</Button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
            {threads.map((t) => (
              <div key={t.id} className={cn("group flex items-center rounded-md text-sm", t.id === threadId ? "bg-muted" : "hover:bg-muted/60")}>
                <Link to={`/support/${t.id}`} className="min-w-0 flex-1 truncate px-3 py-2">
                  {t.title}
                  {t.status === "handed_off" && <span className="ml-1 text-xs text-primary">· with team</span>}
                </Link>
                <button aria-label="Delete conversation" onClick={() => deleteThread(t.id)}
                  className="p-2 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </nav>
          <p className="border-t border-border p-3 text-xs text-muted-foreground">
            Answers come from our <Link to="/help" className="underline">help docs</Link> and your account.
          </p>
        </aside>
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 md:hidden">
            <span className="truncate text-sm font-medium">{active?.title ?? "Support"}</span>
            <Button size="sm" variant="outline" onClick={createThread}><Plus className="size-4" /></Button>
          </div>
          {threadId && initial ? (
            <ChatWindow key={threadId} threadId={threadId} initial={initial}
              handedOff={active?.status === "handed_off"} onActivity={loadThreads} />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading…</div>
          )}
        </main>
      </div>
    </div>
  );
}
