"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Bot, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ADMIN_EMAIL } from "@/lib/constants";
import { redirect } from "next/navigation";

type AIModel = "gemini" | "mistral";

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const models: ModelOption[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Gemini 2.0 Flash - Fast & accurate vision model",
    icon: Sparkles,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Pixtral 12B - Powerful multimodal model",
    icon: Bot,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeModel, setActiveModel] = useState<AIModel>("mistral");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      redirect("/dashboard");
    }
  }, [isLoaded, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (response.ok) {
        setActiveModel(data.aiModel || "mistral");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = async (modelId: AIModel) => {
    if (modelId === activeModel) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiModel: modelId }),
      });

      if (response.ok) {
        setActiveModel(modelId);
        const modelName = models.find((m) => m.id === modelId)?.name;
        toast.success(`Switched to ${modelName}`);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your AI model preferences.</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Access Denied</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your AI model preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Model</CardTitle>
          <CardDescription>
            Pilih model AI untuk generate deskripsi produk. Hanya satu model yang bisa aktif.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.map((model) => {
            const Icon = model.icon;
            const isActive = activeModel === model.id;

            return (
              <div
                key={model.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 transition-colors",
                  isActive && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("rounded-lg p-2", model.bgColor)}>
                    <Icon className={cn("h-5 w-5", model.color)} />
                  </div>
                  <div>
                    <Label htmlFor={model.id} className="text-base font-medium cursor-pointer">
                      {model.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSaving && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    id={model.id}
                    checked={isActive}
                    onCheckedChange={() => handleModelChange(model.id)}
                    disabled={isSaving}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted-foreground mt-4">
            Note: Pastikan API key untuk model yang dipilih sudah dikonfigurasi di environment variables.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
