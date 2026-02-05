import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Users,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";

import { getStore} from "../../lib/store";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeInvestments: 0,
    pendingKyc: 0,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      const store = getStore();
      setUsers(store.users.filter((u) => u.role === "user"));

      const allTransactions = store.users.flatMap((u) =>
        store.transactions
          .filter((t) => t.userId === u.id)
          .map((t) => ({ ...t, userName: u.name, userEmail: u.email }))
      );

      setPendingWithdrawals(
        allTransactions.filter(
          (t) => t.type === "withdrawal" && t.status === "pending"
        )
      );

      const totalDeposits = allTransactions
        .filter((t) => t.type === "deposit" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = allTransactions
        .filter((t) => t.type === "withdrawal" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      const activeInvestments = store.investments.filter(
        (i) => i.status === "active"
      ).length;

      const pendingKyc = store.users.filter(
        (u) => u.kycStatus === "pending"
      ).length;

      setStats({
        totalUsers: store.users.filter((u) => u.role === "user").length,
        totalDeposits,
        totalWithdrawals,
        activeInvestments,
        pendingKyc,
      });
    }
  }, [user]);

  const handleApproveWithdrawal = (transactionId) => {
    const store = getStore();
    const txIndex = store.transactions.findIndex((t) => t.id === transactionId);
    if (txIndex !== -1) {
      store.transactions[txIndex].status = "completed";
      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setPendingWithdrawals((prev) =>
        prev.filter((t) => t.id !== transactionId)
      );
    }
  };

  const handleRejectWithdrawal = (transactionId) => {
    const store = getStore();
    const tx = store.transactions.find((t) => t.id === transactionId);
    if (tx) {
      tx.status = "failed";
      const userIndex = store.users.findIndex((u) => u.id === tx.userId);
      if (userIndex !== -1) {
        store.users[userIndex].walletBalance =
          (store.users[userIndex].walletBalance ?? 0) + tx.amount
      }

      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setPendingWithdrawals((prev) =>
        prev.filter((t) => t.id !== transactionId)
      );
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, transactions, and platform settings
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Investments
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeInvestments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending KYC
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingKyc}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="withdrawals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="withdrawals">
              Pending Withdrawals ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingWithdrawals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No pending withdrawal requests
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingWithdrawals.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {tx.userName || "Unknown"}
                          </TableCell>
                          <TableCell>${tx.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            >
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveWithdrawal(tx.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectWithdrawal(tx.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>${u.walletBalance?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              u.kycStatus === "verified"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : u.kycStatus === "pending"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                            }
                          >
                            {u.kycStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/users/${u.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
