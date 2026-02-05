import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getStore, } from "../../../lib/store";

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEarnings: 0,
    totalInvested: 0,
    netProfit: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      const store = getStore();
      const userTransactions = store.transactions
        .filter((t) => t.userId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      const userInvestments = store.investments.filter(
        (i) => i.userId === user.id
      );

      setTransactions(userTransactions);
      setInvestments(userInvestments);

      const totalDeposits = userTransactions
        .filter((t) => t.type === "deposit" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = userTransactions
        .filter((t) => t.type === "withdrawal" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalEarnings = userTransactions
        .filter((t) => t.type === "earning" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalInvested = userInvestments.reduce(
        (sum, i) => sum + i.amount,
        0
      );

      setStats({
        totalDeposits,
        totalWithdrawals,
        totalEarnings,
        totalInvested,
        netProfit: totalEarnings - totalWithdrawals,
      });
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const monthlyData = [
    { month: "Jan", deposits: 2400, withdrawals: 1200, earnings: 800 },
    { month: "Feb", deposits: 1398, withdrawals: 800, earnings: 600 },
    { month: "Mar", deposits: 9800, withdrawals: 2000, earnings: 1200 },
    { month: "Apr", deposits: 3908, withdrawals: 1500, earnings: 900 },
    { month: "May", deposits: 4800, withdrawals: 2200, earnings: 1100 },
    { month: "Jun", deposits: 3800, withdrawals: 1800, earnings: 950 },
  ];

  const investmentDistribution = [
    { name: "Starter Plan", value: 1500, color: "#3b82f6" },
    { name: "Growth Plan", value: 3000, color: "#10b981" },
    { name: "Premium Plan", value: 5500, color: "#f59e0b" },
  ];

  const earningsData = [
    { day: "Mon", earnings: 120 },
    { day: "Tue", earnings: 145 },
    { day: "Wed", earnings: 132 },
    { day: "Thu", earnings: 168 },
    { day: "Fri", earnings: 155 },
    { day: "Sat", earnings: 142 },
    { day: "Sun", earnings: 138 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your financial performance and investment growth
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deposits
              </CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalDeposits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time deposits
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawals
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${stats.totalWithdrawals.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time withdrawals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${stats.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From investments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${stats.netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Earnings - Withdrawals
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="deposits"
                        name="Deposits"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="withdrawals"
                        name="Withdrawals"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="earnings"
                        name="Earnings"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={investmentDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {investmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            `$${value.toLocaleString()}`
                          }
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Invested
                        </p>
                        <p className="text-2xl font-bold">
                          ${stats.totalInvested.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Investments
                        </p>
                        <p className="text-2xl font-bold">
                          {investments.filter((i) => i.status === "active").length}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Completed Investments
                        </p>
                        <p className="text-2xl font-bold">
                          {
                            investments.filter((i) => i.status === "completed")
                              .length
                          }
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
