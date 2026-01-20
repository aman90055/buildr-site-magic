import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "How do I merge PDFs?",
    "Best compression settings?",
    "Extract text from scanned PDF",
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl shadow-ai z-50 bg-gradient-ai hover:opacity-90 transition-opacity pulse-glow"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 glass-card border-l-0 rounded-l-3xl">
        <SheetHeader className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-display font-semibold">AI Assistant</span>
                <span className="block text-xs text-muted-foreground font-normal">Powered by Gemini</span>
              </div>
            </SheetTitle>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearMessages} className="rounded-xl">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-5" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-ai-subtle flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-brand-ai" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                How can I help you?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Ask me anything about PDFs or our tools!
              </p>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(action);
                      sendMessage(action);
                      setInput("");
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm text-foreground transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-xl bg-gradient-ai flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-gradient-ai text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-ai flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border/50 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about PDFs..."
              disabled={isLoading}
              className="flex-1 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-gradient-ai hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIChatWidget;
