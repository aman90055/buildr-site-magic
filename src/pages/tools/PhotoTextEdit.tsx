import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Type, Download, Trash2, Plus, Move, Save, FolderOpen } from "lucide-react";
import SmartFileInput from "@/components/SmartFileInput";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  bold: boolean;
  font: string;
}

const FONTS = ["Inter", "Arial", "Georgia", "Times New Roman", "Courier New", "Impact"];

const PhotoTextEdit = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f || !f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
        setImgSrc(src);
        setLayers([]);
      };
      img.src = src;
    };
    reader.readAsDataURL(f);
  };

  const selected = layers.find((l) => l.id === selectedId) || null;

  const updateSelected = (patch: Partial<TextLayer>) => {
    if (!selectedId) return;
    setLayers((ls) => ls.map((l) => (l.id === selectedId ? { ...l, ...patch } : l)));
  };

  const addLayer = () => {
    const id = crypto.randomUUID();
    const newLayer: TextLayer = {
      id,
      text: "Your text here",
      x: imgSize.w / 2,
      y: imgSize.h / 2,
      size: Math.max(24, Math.round(imgSize.w / 20)),
      color: "#ffffff",
      bold: true,
      font: "Inter",
    };
    setLayers((ls) => [...ls, newLayer]);
    setSelectedId(id);
  };

  const removeLayer = (id: string) => {
    setLayers((ls) => ls.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgSrc) return;
    canvas.width = imgSize.w;
    canvas.height = imgSize.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    layers.forEach((l) => {
      ctx.font = `${l.bold ? "bold " : ""}${l.size}px ${l.font}`;
      ctx.fillStyle = l.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(l.text, l.x, l.y);
      ctx.shadowBlur = 0;
    });
  }, [layers, imgSrc, imgSize]);

  const canvasToImageCoords = (clientX: number, clientY: number) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    const { x, y } = canvasToImageCoords(e.clientX, e.clientY);
    // hit-test (simple: within size box)
    const hit = [...layers].reverse().find((l) => {
      const half = l.size * l.text.length * 0.3;
      return Math.abs(x - l.x) < half && Math.abs(y - l.y) < l.size;
    });
    if (hit) {
      setSelectedId(hit.id);
      setDragging(hit.id);
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const { x, y } = canvasToImageCoords(e.clientX, e.clientY);
    setLayers((ls) => ls.map((l) => (l.id === dragging ? { ...l, x, y } : l)));
  };

  const onCanvasPointerUp = () => setDragging(null);

  const handleDownload = (type: "png" | "jpeg") => {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edited.${type === "jpeg" ? "jpg" : "png"}`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded!" });
      },
      type === "jpeg" ? "image/jpeg" : "image/png",
      0.95
    );
  };

  const projectFileRef = useRef<HTMLInputElement>(null);

  const handleSaveProject = () => {
    if (!imgSrc) return;
    const project = {
      _type: "docunova.photo-text-edit",
      version: 1,
      savedAt: new Date().toISOString(),
      image: { src: imgSrc, w: imgSize.w, h: imgSize.h },
      layers,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `photo-text-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Project saved", description: "Re-open this .json file anytime to continue editing." });
  };

  const handleLoadProject = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data?._type !== "docunova.photo-text-edit" || !data?.image?.src) {
          throw new Error("Not a valid project file");
        }
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
          setImgSize({ w: data.image.w || img.naturalWidth, h: data.image.h || img.naturalHeight });
          setImgSrc(data.image.src);
          setLayers(Array.isArray(data.layers) ? data.layers : []);
          setSelectedId(null);
          toast({ title: "Project loaded", description: `${data.layers?.length || 0} text layer(s) restored.` });
        };
        img.onerror = () => toast({ title: "Load failed", description: "Image data is corrupt.", variant: "destructive" });
        img.src = data.image.src;
      } catch (e) {
        toast({ title: "Invalid project file", description: "Please choose a valid .json saved from this tool.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Helmet>
        <title>Photo Text Editor - Add & Edit Text on Images | Free</title>
        <meta name="description" content="Add, move and edit text on any photo. Free online photo text editor with fonts, colors, and instant download." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/photo-text-edit" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Type className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Photo Text Editor</h1>
              <p className="text-muted-foreground">Add and edit text on any image. Drag to reposition, style freely, download instantly.</p>
            </div>

            {!imgSrc ? (
              <div className="max-w-2xl mx-auto">
                <SmartFileInput
                  onFilesAdded={handleFiles}
                  accept="image/*"
                  title="Drop photo or use camera"
                  subtitle="JPG, PNG, WEBP supported"
                  formats={["JPG", "PNG", "WEBP"]}
                />
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                <div ref={containerRef} className="rounded-xl border border-border/50 bg-card/50 p-3 overflow-auto">
                  <canvas
                    ref={canvasRef}
                    onPointerDown={onCanvasPointerDown}
                    onPointerMove={onCanvasPointerMove}
                    onPointerUp={onCanvasPointerUp}
                    className="max-w-full h-auto rounded-lg cursor-move touch-none"
                    style={{ display: "block" }}
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Move className="w-3 h-3" /> Click a text layer, then drag to move.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={addLayer} className="flex-1">
                      <Plus className="w-4 h-4 mr-1" /> Add Text
                    </Button>
                    <Button variant="outline" onClick={() => { setImgSrc(null); setLayers([]); }}>
                      New Photo
                    </Button>
                  </div>

                  {layers.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto rounded-lg border border-border/50 p-2">
                      {layers.map((l) => (
                        <div
                          key={l.id}
                          onClick={() => setSelectedId(l.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm ${
                            selectedId === l.id ? "bg-primary/15 text-primary" : "hover:bg-muted"
                          }`}
                        >
                          <Type className="w-3 h-3 shrink-0" />
                          <span className="truncate flex-1">{l.text || "Empty"}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeLayer(l.id); }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete layer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected && (
                    <div className="space-y-3 rounded-lg border border-border/50 p-3">
                      <div>
                        <Label className="text-xs">Text</Label>
                        <Input value={selected.text} onChange={(e) => updateSelected({ text: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs">Font Size ({selected.size}px)</Label>
                        <Slider
                          value={[selected.size]}
                          min={10}
                          max={Math.max(200, Math.round(imgSize.w / 4))}
                          step={1}
                          onValueChange={([v]) => updateSelected({ size: v })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Color</Label>
                          <Input type="color" value={selected.color} onChange={(e) => updateSelected({ color: e.target.value })} className="h-10 p-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Font</Label>
                          <select
                            value={selected.font}
                            onChange={(e) => updateSelected({ font: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm"
                          >
                            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selected.bold} onChange={(e) => updateSelected({ bold: e.target.checked })} />
                        Bold
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => handleDownload("png")} variant="default">
                      <Download className="w-4 h-4 mr-1" /> PNG
                    </Button>
                    <Button onClick={() => handleDownload("jpeg")} variant="outline">
                      <Download className="w-4 h-4 mr-1" /> JPG
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PhotoTextEdit;
