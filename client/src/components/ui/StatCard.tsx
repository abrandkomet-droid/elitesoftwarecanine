import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("glass-card p-6 rounded-2xl relative overflow-hidden group", className)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        </div>
        
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold font-display text-white">{value}</span>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trendUp ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
            )}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
