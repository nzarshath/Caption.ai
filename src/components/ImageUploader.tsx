import { Upload, X, ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  onImageSelect: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
}

const ImageUploader = ({ onImageSelect, preview, onClear }: Props) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onImageSelect(file, reader.result as string);
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border/60 card-gradient">
        <img src={preview} alt="Uploaded" className="w-full max-h-80 object-contain bg-background/50" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-background/80 backdrop-blur border border-border hover:bg-destructive/20 transition-colors"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all ${
        dragOver
          ? "border-primary bg-primary/5 glow-primary"
          : "border-border/60 hover:border-primary/50 hover:bg-secondary/30"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Upload className="h-7 w-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-heading font-semibold text-foreground">Drop image here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG, WEBP</p>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </label>
  );
};

export default ImageUploader;
