import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Wallet,
} from "lucide-react";
import { getStore, } from "../../../lib/store";

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [showPayDialog, setShowPayDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate.push("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      const store = getStore();
      const allUsers = store.users.filter((u) => u.role === "user");
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    }
  }, [user]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (kycFilter !== "all") {
      filtered = filtered.filter((u) => u.kycStatus === kycFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, kycFilter, users]);

  const handleApproveKyc = (userId) => {
    const store = getStore();
    const userIndex = store.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      store.users[userIndex].kycStatus = "verified";
      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setUsers(store.users.filter((u) => u.role === "user"));
    }
  };

  const handleRejectKyc = (userId) => {
    const store = getStore();
    const userIndex = store.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      store.users[userIndex].kycStatus = "rejected";
      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setUsers(store.users.filter((u) => u.role === "user"));
    }
  };

  const handlePayUser = () => {
    if (!selectedUser || !payAmount) return;

    const store = getStore();
    const userIndex = store.users.findIndex((u) => u.id === selectedUser.id);
    if (userIndex !== -1) {
      const amount = parseFloat(payAmount);
     ( store.users[userIndex].walletBalance??0) + amount;

      store.transactions.push({
        id: `tx_${Date.now()}`,
        userId: selectedUser.id,
        type: "deposit",
        amount,
        status: "completed",
        description: "Admin payment",
        createdAt: new Date().toISOString(),
      });

      store.notifications.push({
        id: `notif_${Date.now()}`,
        userId: selectedUser.id,
        title: "Payment Received",
        message: `You received $${amount.toLocaleString()} from admin.`,
        type: "success",
        read: false,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setUsers(store.users.filter((u) => u.role === "user"));
      setShowPayDialog(false);
      setPayAmount("");
      setSelectedUser(null);
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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="KYC Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {u.id.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{u.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {u.phone || "No phone"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          ${(u.walletBalance??0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            u.kycStatus === "verified"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : u.kycStatus === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : u.kycStatus === "rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                        >
                          {u.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.bankDetails ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Wallet className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Bank Details - {u.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-muted-foreground">
                                    Bank Name
                                  </label>
                                  <p className="font-medium">
                                    {u.bankDetails.bankName}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground">
                                    Account Holder
                                  </label>
                                  <p className="font-medium">
                                    {u.bankDetails.accountHolder}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground">
                                    Account Number
                                  </label>
                                  <p className="font-medium">
                                    {u.bankDetails.accountNumber}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-muted-foreground">
                                    IFSC Code
                                  </label>
                                  <p className="font-medium">
                                    {u.bankDetails.ifscCode}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Not added
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {u.kycStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveKyc(u.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectKyc(u.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(u);
                              setShowPayDialog(true);
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate.push(`/admin/users/${u.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pay User - {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Current Balance
                </label>
                <p className="font-semibold text-lg">
                  ${(selectedUser?.walletBalance??0).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Payment Amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  min="1"
                />
              </div>
              <Button onClick={handlePayUser} className="w-full">
                Send Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
