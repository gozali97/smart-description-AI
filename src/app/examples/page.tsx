import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingBag, Instagram, Globe, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const examples = [
  {
    id: 1,
    productName: "Tas Ransel Anti Air Premium",
    category: "Fashion",
    image: "https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg",
    tone: "Professional",
    results: {
      marketplace: `🎒 Tas Ransel Anti Air Premium - Solusi Tepat untuk Mobilitas Tinggi!

Tampil stylish sekaligus fungsional dengan tas ransel premium kami yang dirancang khusus untuk Anda yang aktif dan dinamis.

✨ Keunggulan Produk:
• Material waterproof berkualitas tinggi - aman dari hujan dan cipratan air
• Kompartemen laptop hingga 15.6 inch dengan bantalan empuk
• Desain ergonomis dengan tali bahu empuk anti pegal
• Banyak kantong organizer untuk menyimpan barang dengan rapi
• Resleting YKK anti macet dan tahan lama

Cocok untuk kerja, kuliah, atau traveling. Investasi terbaik untuk gaya hidup modern Anda!

📦 Order sekarang dan rasakan perbedaannya!`,
      instagram: `Level up your daily carry game! 🎒✨

Tas ransel yang nggak cuma keren, tapi juga super fungsional. Anti air, laptop-friendly, dan nyaman dipakai seharian.

Perfect untuk kamu yang selalu on-the-go! 💼

Swipe untuk lihat detail ➡️

#TasRansel #BackpackPremium #TasAntiAir #OOTD #StreetStyle #TasKerja #TasKuliah`,
      website: `Elevate Your Everyday Journey

Perkenalkan tas ransel yang mengubah cara Anda membawa dunia. Dibuat dengan material waterproof premium dan desain yang telah dipikirkan matang, tas ini adalah perpaduan sempurna antara gaya dan fungsi.

Setiap detail dirancang untuk kenyamanan maksimal - dari tali bahu ergonomis hingga kompartemen laptop yang aman. Tidak perlu lagi khawatir dengan cuaca atau keamanan barang bawaan Anda.

Untuk profesional muda yang menghargai kualitas dan tidak mau kompromi dengan penampilan.`,
    },
  },
  {
    id: 2,
    productName: "Wireless Earbuds Pro",
    category: "Electronics",
    image: "https://images.pexels.com/photos/3250815/pexels-photo-3250815.jpeg",
    tone: "Gen-Z",
    results: {
      marketplace: `🎧 Wireless Earbuds Pro - Audio Next Level yang Bikin Kamu Nggak Mau Lepas!

Bro, sis! Udah saatnya upgrade pengalaman dengerin musik kamu ke level yang lebih tinggi! 🔥

✨ Fitur Kece:
• Active Noise Cancellation - bye bye suara bising!
• Bass yang nendang tapi tetep jernih
• Battery tahan 8 jam + case charging 32 jam total
• Touch control yang responsive banget
• IPX5 water resistant - aman buat workout

Mau commuting, WFH, atau gym session, earbuds ini bakal jadi bestie kamu!

🛒 Checkout sekarang, stok terbatas!`,
      instagram: `POV: Kamu akhirnya nemuin earbuds yang worth the hype 🎧🔥

No cap, ANC-nya beneran bikin fokus 100%. Bass-nya? *chef's kiss* 

Battery life-nya juga gila sih, seharian nonstop masih aman bestie!

Yang suka overthinking playlist, this is your sign ✨

#WirelessEarbuds #TechReview #GadgetKekinian #SpotifyPlaylist #AestheticTech #GenZApproved #MusicIsLife`,
      website: `Sound That Moves With You

Rasakan kebebasan audio tanpa batas dengan Wireless Earbuds Pro. Teknologi Active Noise Cancellation canggih memastikan Anda tetap fokus di tengah hiruk pikuk dunia.

Didesain untuk generasi yang tidak pernah berhenti bergerak. Dari meeting virtual hingga workout session, nikmati kualitas suara premium yang mengikuti ritme hidup Anda.

Dengan battery life hingga 32 jam dan ketahanan air IPX5, ini bukan sekadar earbuds - ini adalah lifestyle upgrade yang Anda butuhkan.`,
    },
  },
  {
    id: 3,
    productName: "Organic Green Tea Matcha",
    category: "Food & Beverage",
    image: "https://images.pexels.com/photos/8951773/pexels-photo-8951773.jpeg",
    tone: "Casual",
    results: {
      marketplace: `🍵 Organic Green Tea Matcha - Segarnya Alami, Sehatnya Nyata!

Hai tea lovers! Yuk kenalan sama matcha organik premium yang bakal jadi teman sehat kamu sehari-hari~

☘️ Kenapa Harus Matcha Ini?
• 100% organik dari perkebunan Jepang
• Kaya antioksidan untuk kesehatan tubuh
• Rasa smooth, nggak pahit sama sekali
• Bisa dibuat latte, smoothie, atau diminum langsung
• Kemasan kedap udara, freshness terjaga

Satu sendok matcha di pagi hari = energi sepanjang hari tanpa crash kayak kopi! ☀️

Yuk mulai hidup sehat dari sekarang! 🌿`,
      instagram: `Morning ritual yang bikin hari lebih mindful 🍵💚

Matcha latte homemade hits different when it's organic~ Smooth, creamy, dan bikin mood langsung naik!

Plus antioksidannya 137x lebih banyak dari green tea biasa. Your body will thank you! 🙏

Drop 💚 kalau kamu juga tim matcha!

#MatchaLover #OrganicMatcha #HealthyLifestyle #MorningRitual #MatchaLatte #WellnessJourney #SelfCareSunday`,
      website: `Discover the Art of Wellness

Setiap tegukan Organic Green Tea Matcha kami membawa Anda lebih dekat dengan tradisi kesehatan Jepang yang telah berusia ratusan tahun.

Dipetik langsung dari perkebunan organik bersertifikat, matcha kami menawarkan pengalaman rasa yang autentik - earthy, sedikit manis, dengan aftertaste yang menyegarkan.

Lebih dari sekadar minuman, ini adalah ritual self-care yang bisa Anda nikmati setiap hari. Tingkatkan fokus, boost energi secara alami, dan rasakan manfaat antioksidan yang luar biasa.`,
    },
  },
];

export default function ExamplesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Smart Description</span>
            </div>
          </div>
          <Button asChild>
            <Link href="/sign-up">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            See What AI Can Create
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Contoh hasil generate deskripsi produk untuk berbagai kategori dan tone.
          </p>
        </section>

        {/* Examples */}
        <section className="container mx-auto px-4 pb-16">
          <div className="space-y-12">
            {examples.map((example, index) => (
              <Card key={example.id} className="overflow-hidden">
                <div className="grid lg:grid-cols-3">
                  {/* Product Info */}
                  <div className="border-b lg:border-b-0 lg:border-r">
                    <div className="aspect-video lg:aspect-square overflow-hidden">
                      <img
                        src={example.image}
                        alt={example.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {example.category}
                        </span>
                        <span>•</span>
                        <span>Tone: {example.tone}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{example.productName}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Contoh #{index + 1} - Lihat bagaimana AI menghasilkan deskripsi yang berbeda untuk setiap platform.
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="lg:col-span-2 p-6">
                    <Tabs defaultValue="marketplace">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="marketplace" className="gap-2">
                          <ShoppingBag className="h-4 w-4 hidden sm:block" />
                          Marketplace
                        </TabsTrigger>
                        <TabsTrigger value="instagram" className="gap-2">
                          <Instagram className="h-4 w-4 hidden sm:block" />
                          Instagram
                        </TabsTrigger>
                        <TabsTrigger value="website" className="gap-2">
                          <Globe className="h-4 w-4 hidden sm:block" />
                          Website
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="marketplace" className="mt-4">
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <p className="whitespace-pre-wrap text-sm">{example.results.marketplace}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="instagram" className="mt-4">
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <p className="whitespace-pre-wrap text-sm">{example.results.instagram}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="website" className="mt-4">
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <p className="whitespace-pre-wrap text-sm">{example.results.website}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold">Ready to Create Your Own?</h2>
            <p className="mt-2 text-muted-foreground">
              Daftar gratis dan mulai generate deskripsi produk dalam hitungan detik.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/sign-up">
                <Sparkles className="mr-2 h-4 w-4" />
                Start Creating Now
              </Link>
            </Button>
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
