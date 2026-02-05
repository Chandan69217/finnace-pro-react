import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getStore, getAdminStats } from "../../../lib/store";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    activeInvestments: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    pendingKYC: 0,
    totalBalance: 0,
  });
  const [timeRange, setTimeRange] = useState("7d");
  const [revenueData, setRevenueData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = () => {
    const adminStats = getAdminStats();
    setStats(adminStats);

    const store = getStore();

    // Generate mock revenue data based on time range
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const revenue = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTransactions = store.transactions.filter((t) => {
        const tDate = new Date(t.createdAt);
        return tDate.toDateString() === date.toDateString();
      });

      revenue.push({
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        deposits: dayTransactions
          .filter((t) => t.type === "deposit" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        withdrawals: dayTransactions
          .filter((t) => t.type === "withdrawal" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
      });
    }
    setRevenueData(revenue);

    // Package distribution
    const packageCounts = store.investments.reduce(
      (acc, inv) => {
        const pkg = store.packages.find((p) => p.id === inv.packageId);
        if (pkg) {
          acc[pkg.name] = (acc[pkg.name] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    setPackageData(
      Object.entries(packageCounts).map(([name, value]) => ({ name, value }))
    );

    // User growth data
    const userGrowth = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const usersUntilDate = store.users.filter((u) => {
        const uDate = new Date(u.createdAt);
        return uDate <= date && u.role === "user";
      }).length;

      userGrowth.push({
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        users: usersUntilDate,
      });
    }
    setUserGrowthData(userGrowth);
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: "+12%",
      positive: true,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total Deposits",
      value: `$${stats.totalDeposits.toLocaleString()}`,
      icon: DollarSign,
      change: "+8%",
      positive: true,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Total Withdrawals",
      value: `$${stats.totalWithdrawals.toLocaleString()}`,
      icon: Wallet,
      change: "+5%",
      positive: false,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "Active Investments",
      value: stats.activeInvestments,
      icon: TrendingUp,
      change: "+15%",
      positive: true,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Total Invested",
      value: `$${stats.totalInvestments.toLocaleString()}`,
      icon: Package,
      change: "+20%",
      positive: true,
      color: "bg-indigo-500/10 text-indigo-600",
    },
    {
      title: "Platform Balance",
      value: `$${stats.totalBalance.toLocaleString()}`,
      icon: Activity,
      change: "+10%",
      positive: true,
      color: "bg-teal-500/10 text-teal-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Platform performance and insights
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex items-center text-sm ${stat.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorDeposits"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorWithdrawals"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-5))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-5))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="deposits"
                      stroke="hsl(var(--chart-2))"
                      fillOpacity={1}
                      fill="url(#colorDeposits)"
                      name="Deposits"
                    />
                    <Area
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="hsl(var(--chart-5))"
                      fillOpacity={1}
                      fill="url(#colorWithdrawals)"
                      name="Withdrawals"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                      name="Total Users"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Package Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {packageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {packageData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No investment data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.pendingWithdrawals}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ${stats.pendingWithdrawalAmount.toLocaleString()} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Pending KYC</p>
                <span className="text-2xl font-bold text-orange-600">
                  {stats.pendingKYC}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Net Flow</p>
                <span
                  className={`text-2xl font-bold ${stats.totalDeposits - stats.totalWithdrawals >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${(stats.totalDeposits - stats.totalWithdrawals).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Deposits - Withdrawals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Avg Investment</p>
                <span className="text-2xl font-bold text-primary">
                  $
                  {stats.activeInvestments > 0
                    ? Math.round(
                        stats.totalInvestments / stats.activeInvestments
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Per user</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
