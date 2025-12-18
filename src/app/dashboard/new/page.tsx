"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, Sparkles, ShoppingBag, Instagram, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = [
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Living" },
  { value: "food", label: "Food & Beverage" },
  { value: "beauty", label: "Beauty & Health" },
  { value: "sports", label: "Sports & Outdoor" },
  { value: "other", label: "Other" },
];

const tones = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "persuasive", label: "Persuasive" },
  { value: "genz", label: "Gen-Z" },
];

interface GenerationResult {
  marketplace: string;
  instagram: string;
  website: string;
}

const resultCards = [
  {
    key: "marketplace" as const,
    title: "Marketplace",
    description: "Shopee / Tokopedia",
    icon: ShoppingBag,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    key: "instagram" as const,
    title: "Instagram",
    description: "Caption & Hashtags",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    key: "website" as const,
    title: "Website",
    description: "Landing Page",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">AI sedang membuat deskripsi produk...</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  content,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(`${title} disalin ke clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all hover:shadow-md",
        copied && "ring-2 ring-green-500"
      )}
      onClick={handleCopy}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("rounded-lg p-2", bgColor)}>
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-6 whitespace-pre-wrap text-sm text-muted-foreground">
          {content}
        </p>
        <p className="mt-3 text-xs text-muted-foreground/60">
          Klik untuk menyalin
        </p>
      </CardContent>
    </Card>
  );
}

export default function NewGenerationPage() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const isFormValid = imageUrl && productName && category && keyFeatures && tone;

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          productName,
          category,
          keyFeatures,
          platform: "all",
          toneOfVoice: tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResult(data.data);
      toast.success("Deskripsi berhasil dibuat dan disimpan!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Gagal membuat deskripsi. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImageUrl(undefined);
    setProductName("");
    setCategory("");
    setKeyFeatures("");
    setTone("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Description</h1>
            <p className="text-muted-foreground">
              Upload gambar dan isi detail produk untuk generate deskripsi.
            </p>
          </div>
        </div>
        {result && (
          <Button variant="outline" onClick={handleReset}>
            Buat Baru
          </Button>
        )}
      </div>

      {!result && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Produk</CardTitle>
              <CardDescription>
                Upload foto produk dengan kualitas baik untuk hasil terbaik.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageDropzone value={imageUrl} onChange={setImageUrl} disabled={isGenerating} />
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
              <CardDescription>
                Isi informasi produk untuk menghasilkan deskripsi yang relevan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nama Produk</Label>
                <Input
                  id="productName"
                  placeholder="contoh: Tas Ransel Anti Air Premium"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyFeatures">Fitur Utama</Label>
                <Textarea
                  id="keyFeatures"
                  placeholder="Tuliskan fitur-fitur utama produk, pisahkan dengan enter atau koma..."
                  rows={4}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Gaya Bahasa</Label>
                <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gaya bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!isFormValid || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Deskripsi
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && <LoadingSkeleton />}

      {/* Results */}
      {result && !isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Hasil Generate</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Klik pada card untuk menyalin teks ke clipboard.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {resultCards.map((card) => (
              <ResultCard
                key={card.key}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
                bgColor={card.bgColor}
                content={result[card.key]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
