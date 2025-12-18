"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";
import { supabase } from "@/lib/supabase";

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
}

export function ImageDropzone({ value, onChange, disabled }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProgress(0);

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      setIsUploading(false);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      setIsUploading(false);
      return;
    }

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      const { data, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      setProgress(100);
      onChange(urlData.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [disabled, isUploading]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!value) return;

    // Extract filename from URL
    const urlParts = value.split("/");
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage.from("product-images").remove([fileName]);
    onChange(undefined);
  };

  if (value) {
    return (
      <div className="relative rounded-lg border bg-muted/30 p-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <img
            src={value}
            alt="Product preview"
            className="h-full w-full object-contain"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !isUploading) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragging && "border-primary bg-primary/5",
        !isDragging && "border-muted-foreground/25 hover:border-muted-foreground/50",
        (disabled || isUploading) && "cursor-not-allowed opacity-60"
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="w-48">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">Mengupload... {progress}%</p>
        </div>
      ) : (
        <>
          <div className="rounded-full bg-muted p-4">
            {isDragging ? (
              <Upload className="h-8 w-8 text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium">
              {isDragging ? "Lepaskan untuk upload" : "Drag & drop gambar di sini"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              atau klik untuk memilih file
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG, WebP (maks. 5MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </>
      )}
      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
