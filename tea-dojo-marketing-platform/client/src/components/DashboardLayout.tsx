/**
 * Dashboard Layout - BrewLab Marketing Platform
 * Sidebar navigation with main content area
 */

import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", external: false },
  { href: "/dashboard/generate", icon: Sparkles, label: "Generate", external: false },
  { href: "https://teacalendar-2agrwlqk.manus.space/", icon: Calendar, label: "Calendar", external: true },
  { href: "/dashboard/campaigns", icon: Megaphone, label: "Campaigns", external: false },
];

const bottomNavItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/help", icon: HelpCircle, label: "Help & Support" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === "/dashboard";
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col z-40">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">B</span>
              </div>
              <span className="font-display font-semibold text-xl text-foreground">BrewLab</span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = !item.external && isActive(item.href);
            
            const navContent = (
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.label === "Generate" && (
                  <Badge className="ml-auto bg-accent text-accent-foreground text-xs">AI</Badge>
                )}
                {item.external && (
                  <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
                )}
              </motion.div>
            );
            
            if (item.external) {
              return (
                <a 
                  key={item.href} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {navContent}
                </a>
              );
            }
            
            return (
              <Link key={item.href} href={item.href}>
                {navContent}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-border space-y-1">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    active 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
          
          <Separator className="my-2" />
          
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
