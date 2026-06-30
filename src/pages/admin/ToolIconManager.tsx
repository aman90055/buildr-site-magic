import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cropper, { Area } from "react-easy-crop";
import { supabase } from "@/integrations/supabase/client";
import { TOOL_REGISTRY, getToolMeta, ToolMeta } from "@/lib/toolRegistry";
import { fetchToolIcons, invalidateToolIcons, useToolIcons } from "@/lib/toolIcons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ArrowLeft, Image as ImageIcon, Search, Upload, Trash2, Loader2, ShieldAlert } from "lucide-react";

// Build full tool list from registry + NAME_MAP fallback
function useAllTools(): ToolMeta[] {
  return useMemo(() => {
    const fromRegistry = Object.values(TOOL_REGISTRY);
    // include NAME_MAP entries via getToolMeta
    const slugs = new Set(fromRegistry.map((t) => t.slug));
    // Get every slug we know about by trying common ones via getToolMeta is hard; just expose registry + we'll union with icons table
    return fromRegistry
      .concat(
        // pull missing slugs that have an icon already so admin can re-edit
        []
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
}

async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function cropToDataURL(
  imageSrc: string,
  area: Area,
  outputSize = 256
): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    outputSize,
    outputSize
  );
  // Try webp for smaller files, fallback to png if transparent
  return canvas.toDataURL("image/webp", 0.9);
}

export default function ToolIconManager() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [query, setQuery] = useState("");
  const tools = useAllTools();
  const icons = useToolIcons();
  const [editing, setEditing] = useState<ToolMeta | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && !!data);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [tools, query]);

  const withIconCount = useMemo(
    () => tools.filter((t) => icons[t.slug]).length,
    [tools, icons]
  );

  async function handleDelete(slug: string) {
    const { error } = await supabase.from("tool_icons").delete().eq("tool_slug", slug);
    if (error) {
      toast.error("Delete failed: " + error.message);
      return;
    }
    invalidateToolIcons();
    await fetchToolIcons(true);
    toast.success("Icon removed");
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Card className="p-8 text-center max-w-md">
            <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h1 className="text-xl font-semibold mb-2">Admins only</h1>
            <p className="text-muted-foreground text-sm">
              You don't have permission to manage tool icons.
            </p>
            <Link to="/" className="inline-block mt-4">
              <Button variant="outline">Back home</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-primary" /> Tool Icon Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  {withIconCount} of {tools.length} tools have custom icons
                </p>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tool name or slug…"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((tool) => {
              const icon = icons[tool.slug];
              return (
                <Card
                  key={tool.slug}
                  className="p-4 flex flex-col items-center text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden mb-3">
                    {icon ? (
                      <img src={icon} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="font-medium text-sm truncate w-full" title={tool.name}>
                    {tool.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3">
                    {tool.category}
                  </div>
                  <div className="flex gap-1 w-full">
                    <Button
                      size="sm"
                      variant={icon ? "outline" : "default"}
                      className="flex-1"
                      onClick={() => setEditing(tool)}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      {icon ? "Replace" : "Upload"}
                    </Button>
                    {icon && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(tool.slug)}
                        aria-label="Remove icon"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No tools match "{query}"
            </div>
          )}
        </div>
      </main>
      <Footer />

      {editing && (
        <CropDialog
          tool={editing}
          existing={icons[editing.slug]}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            invalidateToolIcons();
            await fetchToolIcons(true);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function CropDialog({
  tool,
  existing,
  onClose,
  onSaved,
}: {
  tool: ToolMeta;
  existing?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(existing ?? null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Max 8 MB — pick a smaller image");
      return;
    }
    const dataUrl = await readFileAsDataURL(file);
    setImageSrc(dataUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function save() {
    if (!imageSrc || !croppedArea) {
      toast.error("Pick and crop an image first");
      return;
    }
    setSaving(true);
    try {
      const outDataUrl = await cropToDataURL(imageSrc, croppedArea, 256);
      // Rough size guard — base64 data URLs ~33% larger than bytes
      if (outDataUrl.length > 400_000) {
        toast.warning("Icon is large; will still save");
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("tool_icons").upsert({
        tool_slug: tool.slug,
        icon_data_url: outDataUrl,
        updated_by: user?.id ?? null,
      });
      if (error) throw error;
      toast.success(`Icon assigned to ${tool.name}`);
      onSaved();
    } catch (e: any) {
      toast.error("Save failed: " + (e?.message || String(e)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Icon for <span className="text-primary">{tool.name}</span>
          </DialogTitle>
        </DialogHeader>

        {!imageSrc ? (
          <label className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium">Click to choose image</span>
            <span className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WebP or SVG — up to 8 MB
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        ) : (
          <>
            <div className="relative w-full h-72 bg-muted rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-muted-foreground w-12">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={4}
                step={0.05}
                onValueChange={(v) => setZoom(v[0])}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImageSrc(null);
                  setCroppedArea(null);
                }}
              >
                Replace
              </Button>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!imageSrc || !croppedArea || saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving…
              </>
            ) : (
              "Save icon"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
