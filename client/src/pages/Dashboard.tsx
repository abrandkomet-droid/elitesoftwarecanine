import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { useAuth } from "@/hooks/use-auth";
import { Dog, Activity, Award, Users } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

const data = [
  { name: 'Jan', registrations: 4 },
  { name: 'Feb', registrations: 7 },
  { name: 'Mar', registrations: 5 },
  { name: 'Apr', registrations: 12 },
  { name: 'May', registrations: 9 },
  { name: 'Jun', registrations: 15 },
  { name: 'Jul', registrations: 22 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white mb-2">
          Welcome back, {user?.firstName || 'Breeder'}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your kennel today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Dogs" 
          value="24" 
          icon={Dog} 
          trend="+2 this month" 
          trendUp={true}
          delay={0.1}
        />
        <StatCard 
          title="Health Tested" 
          value="85%" 
          icon={Activity} 
          trend="+5%" 
          trendUp={true}
          delay={0.2}
        />
        <StatCard 
          title="Show Points" 
          value="1,250" 
          icon={Award} 
          trend="Top 5% Nationwide" 
          trendUp={true}
          delay={0.3}
        />
        <StatCard 
          title="Total Litters" 
          value="3" 
          icon={Users} 
          trend="Planning needed" 
          trendUp={false}
          className="border-primary/20 bg-primary/5"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Registration Activity</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorReg)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div className="bg-primary/20 text-primary p-3 rounded-lg text-center min-w-[60px]">
                  <div className="text-xs font-bold uppercase">OCT</div>
                  <div className="text-xl font-bold font-display">{12 + i}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-white">National Specialty</h4>
                  <p className="text-sm text-muted-foreground mt-1">Austin, TX</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
