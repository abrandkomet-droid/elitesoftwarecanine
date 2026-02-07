import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Dog, 
  Dna, 
  Calendar, 
  Activity, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Dog, label: "Registry", href: "/dogs" },
    { icon: Dna, label: "Genetics", href: "/genetics" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: Activity, label: "Health", href: "/health" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-white/5 h-screen sticky top-0">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ELITE CANINE
        </h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
          Registry & Genetics
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
