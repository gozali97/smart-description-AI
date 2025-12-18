"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, History, Settings, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ADMIN_EMAIL } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/history", label: "History", icon: History },
    ...(isAdmin ? [{ href: "/dashboard/settings", label: "Settings", icon: Settings }] : []),
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <span className="text-xl font-bold">Smart Description</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
