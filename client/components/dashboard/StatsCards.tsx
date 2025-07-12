import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: "up" | "down" | "neutral";
}

function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  const trendColor = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }[trend];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor} flex items-center gap-1`}>
          <TrendingUp className="h-3 w-3" />
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  dashboardStats?: any;
  loading?: boolean;
}

export function StatsCards({ dashboardStats, loading }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Students",
      value: loading
        ? "Loading..."
        : dashboardStats?.totalStudents?.toString() || "0",
      change: "+12.5%",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Total Classes",
      value: loading
        ? "Loading..."
        : dashboardStats?.totalClasses?.toString() || "0",
      change: "+8.2%",
      icon: FileText,
      trend: "up" as const,
    },
    {
      title: "Average Class Size",
      value: loading
        ? "Loading..."
        : dashboardStats?.averageClassSize?.toString() || "0",
      change: "-15.3%",
      icon: Clock,
      trend: "down" as const,
    },
    {
      title: "Academic Year",
      value: "2024-25",
      change: "Current",
      icon: TrendingUp,
      trend: "neutral" as const,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
