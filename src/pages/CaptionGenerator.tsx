import { useState } from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CaptionGenerator = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleImageSelect = (f: File, prev: string) => {
    setFile(f);
    setPreview(prev);
    setCaptions([]);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setCaptions([]);
  };

  const generate = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setCaptions([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-captions", {
        body: { imageBase64: preview },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const generatedCaptions = data.captions || [];
      setCaptions(generatedCaptions);

      // Save to database
      await supabase.from("caption_generations").insert({
        image_name: file.name,
        captions: generatedCaptions,
      });
    } catch (err: any) {
      console.error("Caption generation error:", err);
      toast.error(err.message || "Failed to generate captions");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-2">Caption Generator</h1>
        <p className="text-muted-foreground mb-8">
          Upload an image and the AI-powered CNN+LSTM pipeline will generate descriptive captions for your specific image.
        </p>

        <ImageUploader onImageSelect={handleImageSelect} preview={preview} onClear={handleClear} />

        {preview && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors glow-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing image with AI…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Captions
                </>
              )}
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-8 card-gradient border border-border/60 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-heading font-semibold text-sm">AI Processing Pipeline</span>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                Extracting visual features via CNN encoder…
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
                Generating context-aware captions via LSTM decoder…
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-glow" style={{ animationDelay: "1s" }} />
                Beam search for optimal descriptions…
              </div>
            </div>
          </div>
        )}

        {captions.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="font-heading font-semibold text-lg">Generated Captions</h3>
            {captions.map((cap, i) => (
              <div
                key={i}
                className="card-gradient border border-border/60 rounded-xl p-4 flex items-start justify-between gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div>
                  <span className="text-xs font-medium text-accent mr-2">#{i + 1}</span>
                  <span className="text-foreground">{cap}</span>
                </div>
                <button
                  onClick={() => copyCaption(cap, i)}
                  className="shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  {copied === i ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionGenerator;
