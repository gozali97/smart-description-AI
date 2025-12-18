import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Target, Globe } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Smart Description</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              AI-Powered Product Descriptions
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Turn Product Photos into{" "}
              <span className="text-primary">Compelling Copy</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your product image and let AI generate persuasive marketing
              descriptions for Marketplace, Instagram, and Website in seconds.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  <Zap className="mr-2 h-4 w-4" />
                  Start Creating
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/examples">See Examples</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Choose ProductCopy?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Generate professional product descriptions in under 10 seconds
                  with our AI engine.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-green-500/10 p-3">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Platform Optimized</h3>
                <p className="text-muted-foreground">
                  Tailored copy for Shopee, Tokopedia, Instagram, and SEO-friendly
                  website content.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3">
                  <Globe className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Multiple Tones</h3>
                <p className="text-muted-foreground">
                  Choose from Casual, Professional, Persuasive, or Gen-Z tone to
                  match your brand.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 ProductCopy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
