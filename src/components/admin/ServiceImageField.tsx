"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, Link as LinkIcon, X } from "lucide-react";

import { uploadServiceImage } from "@/lib/actions/admin/services";

interface ServiceImageFieldProps {
  defaultValue?: string;
}

export function ServiceImageField({ defaultValue = "" }: ServiceImageFieldProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadServiceImage(fd);
      setImageUrl(url);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Image</label>

      {/* Tab toggle */}
      <div className="flex w-fit overflow-hidden rounded-md border border-input text-sm">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="size-3.5" aria-hidden="true" />
          Upload from device
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 border-l border-input px-3 py-1.5 transition-colors ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="size-3.5" aria-hidden="true" />
          Enter URL
        </button>
      </div>

      {/* Hidden field — always holds the resolved URL that gets submitted */}
      <input type="hidden" name="image_url" value={imageUrl} />

      {mode === "upload" ? (
        <div className="space-y-2">
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="size-4" aria-hidden="true" />
                Choose an image file
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          {uploadError ? (
            <p className="text-xs text-destructive">{uploadError}</p>
          ) : null}
        </div>
      ) : (
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
      )}

      {/* Preview — shown regardless of mode when a URL is set */}
      {imageUrl ? (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Image preview"
            className="h-24 rounded-md border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
