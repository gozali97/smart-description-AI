"use client";

import { useEffect, useState } from "react";
import { History, Trash2, Eye, Loader2, Copy, Check, ShoppingBag, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Generation {
  id: string;
  platform: string;
  tone_of_voice: string;
  result_text: string;
  created_at: string;
}

interface Product {
  id: string;
  image_url: string;
  product_name: string;
  category: string;
  key_features: string;
  created_at: string;
  generations: Generation[];
}

const platformIcons: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  marketplace: { icon: ShoppingBag, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  instagram: { icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  website: { icon: Globe, color: "text-blue-500", bgColor: "bg-blue-500/10" },
};

const categoryLabels: Record<string, string> = {
  fashion: "Fashion",
  electronics: "Electronics",
  home: "Home & Living",
  food: "Food & Beverage",
  beauty: "Beauty & Health",
  sports: "Sports & Outdoor",
  other: "Other",
};

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="aspect-video w-full rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      if (response.ok) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Gagal memuat riwayat");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async () => {
    if (!deleteProduct) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/history/${deleteProduct.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
        toast.success("Produk berhasil dihapus");
      } else {
        toast.error("Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setIsDeleting(false);
      setDeleteProduct(null);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Disalin ke clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground">
            Lihat semua deskripsi yang pernah dibuat.
          </p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Lihat semua deskripsi yang pernah dibuat.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Belum ada riwayat</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Deskripsi yang kamu generate akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => setDeleteProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="line-clamp-1 text-base">
                  {product.product_name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {categoryLabels[product.category] || product.category}
                </CardDescription>
                <div className="mt-2 flex items-center gap-1">
                  {product.generations.map((gen) => {
                    const platform = platformIcons[gen.platform];
                    if (!platform) return null;
                    const Icon = platform.icon;
                    return (
                      <div
                        key={gen.id}
                        className={cn("rounded p-1", platform.bgColor)}
                      >
                        <Icon className={cn("h-3 w-3", platform.color)} />
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(product.created_at)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.product_name}</DialogTitle>
            <DialogDescription>
              {categoryLabels[selectedProduct?.category || ""] || selectedProduct?.category}
              {" • "}
              {selectedProduct && formatDate(selectedProduct.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.product_name}
                  className="h-full w-full object-contain bg-muted"
                />
              </div>

              <Tabs defaultValue={selectedProduct.generations[0]?.platform || "marketplace"}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  <TabsTrigger value="instagram">Instagram</TabsTrigger>
                  <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                {selectedProduct.generations.map((gen) => (
                  <TabsContent key={gen.id} value={gen.platform} className="mt-4">
                    <div className="relative rounded-lg border bg-muted/30 p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => handleCopy(gen.result_text, gen.id)}
                      >
                        {copiedId === gen.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <p className="whitespace-pre-wrap pr-10 text-sm">
                        {gen.result_text}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Produk &quot;{deleteProduct?.product_name}&quot; dan semua deskripsi yang terkait akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
