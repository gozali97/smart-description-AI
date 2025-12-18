"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Copy, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { toast } from "sonner";

const categories = [
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "home", label: "Home & Living" },
  { value: "food", label: "Food & Beverage" },
  { value: "beauty", label: "Beauty & Health" },
  { value: "sports", label: "Sports & Outdoor" },
  { value: "other", label: "Other" },
];

const platforms = [
  { value: "marketplace", label: "Shopee / Tokopedia" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website SEO" },
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

export default function GeneratePage() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const isFormValid = imageUrl && productName && category && keyFeatures && platform && tone;

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
          platform,
          toneOfVoice: tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResult(data.data);
      toast.success("Deskripsi berhasil dibuat!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Gagal membuat deskripsi. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    toast.success("Disalin ke clipboard!");
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Description</h1>
          <p className="text-muted-foreground">
            Upload product image and fill in the details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageDropzone value={imageUrl} onChange={setImageUrl} disabled={isGenerating} />
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g. Wireless Bluetooth Headphones"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Label htmlFor="keyFeatures">Key Features</Label>
              <Textarea
                id="keyFeatures"
                placeholder="List the main features of your product..."
                rows={4}
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone of Voice</Label>
                <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
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
                  Generate Description
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="marketplace">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
                <TabsTrigger value="website">Website</TabsTrigger>
              </TabsList>

              {(["marketplace", "instagram", "website"] as const).map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="relative rounded-lg border bg-muted/30 p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleCopy(result[tab], tab)}
                    >
                      {copiedTab === tab ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="whitespace-pre-wrap pr-10 text-sm">
                      {result[tab]}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
