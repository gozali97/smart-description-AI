"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ImageIcon, FileText, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  image_url: string;
  product_name: string;
  category: string;
  created_at: string;
}

interface DashboardStats {
  totalProducts: number;
  totalGenerations: number;
  thisMonthProducts: number;
  recentProducts: Product[];
}

const categoryLabels: Record<string, string> = {
  fashion: "Fashion",
  electronics: "Electronics",
  home: "Home & Living",
  food: "Food & Beverage",
  beauty: "Beauty & Health",
  sports: "Sports & Outdoor",
  other: "Other",
};

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentProductsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Generate AI-powered product descriptions in seconds.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Generations</p>
                  <p className="text-2xl font-bold">{stats?.totalGenerations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-500/10 p-3">
                  <ImageIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products Uploaded</p>
                  <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{stats?.thisMonthProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Products</h2>
          {stats && stats.recentProducts.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/history">View All</Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <RecentProductsSkeleton />
        ) : stats && stats.recentProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.recentProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    asChild
                  >
                    <Link href="/dashboard/history">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-base">
                    {product.product_name}
                  </CardTitle>
                  <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{categoryLabels[product.category] || product.category}</span>
                    <span>{formatDate(product.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a product image and let AI generate compelling copy for you.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Description
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
