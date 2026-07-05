import {
  Share2,
  Linkedin,
  Link2,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
}

const ShareButtons = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "The Docunova AI Suite — 100+ Free PDF, AI & Document Tools",
  description = "Edit, convert, summarize and sign documents with 100+ free tools.",
  image,
  hashtags = ["DocumentEditPro", "PDFTools", "AI"],
  className,
}: ShareButtonsProps) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const d = encodeURIComponent(description);
  const tags = encodeURIComponent(hashtags.join(","));
  const tagText = hashtags.map((h) => `#${h}`).join(" ");
  const img = encodeURIComponent(image || "");

  const links: Record<string, string> = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`,
    twitter: `https://x.com/intent/tweet?url=${u}&text=${t}&hashtags=${tags}`,
    threads: `https://www.threads.net/intent/post?text=${t}%20${u}`,
    reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}${
      image ? `&media=${img}` : ""
    }`,
    email: `mailto:?subject=${t}&body=${d}%0A%0A${u}`,
  };

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=720,height=640");

  const copy = async (text: string, label = "Link copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Copy failed");
    }
  };

  const copyForInstagram = () =>
    copy(
      `${title}\n\n${description}\n\n${url}\n\n${tagText}`,
      "Caption copied — paste into Instagram",
    );

  const copyForDiscord = () =>
    copy(
      `**${title}**\n${description}\n${url}`,
      "Discord message copied — paste in your server",
    );

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {}
    } else {
      copy(url);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Share to</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => open(links.linkedin)}>
          <Linkedin className="w-4 h-4 mr-2 text-[#0A66C2]" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.facebook)}>
          <Facebook className="w-4 h-4 mr-2 text-[#1877F2]" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.twitter)}>
          <span className="inline-block w-4 h-4 mr-2 text-foreground font-bold text-center leading-4">
            𝕏
          </span>
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.threads)}>
          <span className="inline-block w-4 h-4 mr-2 text-foreground font-bold text-center leading-4">
            @
          </span>
          Threads
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.reddit)}>
          <span className="inline-block w-4 h-4 mr-2 text-[#FF4500] font-bold text-center leading-4">
            ▲
          </span>
          Reddit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.pinterest)}>
          <span className="inline-block w-4 h-4 mr-2 text-[#E60023] font-bold text-center leading-4">
            P
          </span>
          Pinterest
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Messaging</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => open(links.whatsapp)}>
          <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(links.telegram)}>
          <Send className="w-4 h-4 mr-2 text-[#26A5E4]" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyForDiscord}>
          <span className="inline-block w-4 h-4 mr-2 text-[#5865F2] font-bold text-center leading-4">
            D
          </span>
          Discord (copy)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyForInstagram}>
          <Instagram className="w-4 h-4 mr-2 text-[#E4405F]" />
          Instagram (copy)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => open(links.email)}>
          <Send className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copy(url)}>
          <Link2 className="w-4 h-4 mr-2" />
          Copy link
        </DropdownMenuItem>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <DropdownMenuItem onClick={native}>
            <Share2 className="w-4 h-4 mr-2" />
            More options…
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButtons;
