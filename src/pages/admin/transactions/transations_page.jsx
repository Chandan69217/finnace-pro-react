import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Gift,
  Download,
} from "lucide-react";
import {
  getStore,
} from "../../../lib/store";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const store = getStore();
    setTransactions(
      store.transactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setUsers(store.users);
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "Unknown";
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      getUserName(t.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(t.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = transactions
    .filter((t) => t.type === "investment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const getTypeIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case "investment":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "earning":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "referral":
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      deposit: "bg-green-500/10 text-green-600 border-green-500/20",
      withdrawal: "bg-red-500/10 text-red-600 border-red-500/20",
      investment: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      earning: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      referral: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };

    return (
      <Badge variant="outline" className={colors[type] || ""}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      completed: "bg-green-500/10 text-green-600 border-green-500/20",
      failed: "bg-red-500/10 text-red-600 border-red-500/20",
      cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };

    return (
      <Badge variant="outline" className={colors[status] || ""}>
        {status}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ["ID", "User", "Email", "Type", "Amount", "Status", "Date", "Description"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      getUserName(t.userId),
      getUserEmail(t.userId),
      t.type,
      t.amount,
      t.status,
      new Date(t.createdAt).toLocaleString(),
      t.description,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all platform transactions
            </p>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <ArrowDownLeft className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold">
                    ${totalDeposits.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                  <p className="text-2xl font-bold">
                    ${totalWithdrawals.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Investments</p>
                  <p className="text-2xl font-bold">
                    ${totalInvestments.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by user, ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="earning">Earning</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {getUserName(transaction.userId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getUserEmail(transaction.userId)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                        <TableCell
                          className={`font-semibold ${
                            transaction.type === "withdrawal"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}$
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {transaction.description}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
