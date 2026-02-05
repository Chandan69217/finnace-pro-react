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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  getStore,
  updateTransaction,
  updateWallet,
  createNotification,
} from "../../../lib/store";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const store = getStore();
    const allWithdrawals = store.transactions.filter((t) => t.type === "withdrawal");
    setWithdrawals(allWithdrawals);
    setUsers(store.users);
    setBankDetails(store.bankDetails);
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "Unknown";
  };

  const getUserBankDetails = (userId) => {
    return bankDetails.find((b) => b.userId === userId);
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesSearch =
      getUserName(w.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(w.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || w.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (withdrawal) => {
    setIsProcessing(true);
    
    // Update transaction status
    updateTransaction(withdrawal.id, { status: "completed" });
    
    // Create notification for user
    createNotification({
      userId: withdrawal.userId,
      title: "Withdrawal Approved",
      message: `Your withdrawal request of $${withdrawal.amount.toLocaleString()} has been approved and processed.`,
      type: "success",
    });
    
    loadData();
    setIsProcessing(false);
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    if (!selectedWithdrawal || !rejectReason.trim()) return;
    
    setIsProcessing(true);
    
    // Update transaction status
    updateTransaction(selectedWithdrawal.id, { status: "failed" });
    
    // Refund the amount to user wallet
    const store = getStore();
    const wallet = store.wallets.find((w) => w.userId === selectedWithdrawal.userId);
    if (wallet) {
      updateWallet(selectedWithdrawal.userId, {
        balance: wallet.balance + selectedWithdrawal.amount,
      });
    }
    
    // Create notification for user
    createNotification({
      userId: selectedWithdrawal.userId,
      title: "Withdrawal Rejected",
      message: `Your withdrawal request of $${selectedWithdrawal.amount.toLocaleString()} has been rejected. Reason: ${rejectReason}. The amount has been refunded to your wallet.`,
      type: "error",
    });
    
    loadData();
    setIsProcessing(false);
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setRejectReason("");
  };

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;
  const pendingAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
  const approvedToday = withdrawals.filter(
    (w) =>
      w.status === "completed" &&
      new Date(w.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawal Requests</h1>
          <p className="text-muted-foreground">Manage and process user withdrawal requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold">{approvedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>All Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by user name, email or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "completed", "failed"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
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
                  {filteredWithdrawals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No withdrawal requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getUserName(withdrawal.userId)}</p>
                            <p className="text-sm text-muted-foreground">
                              {getUserEmail(withdrawal.userId)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${withdrawal.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Withdrawal Request Details</DialogTitle>
              <DialogDescription>
                Review the withdrawal request and user bank details
              </DialogDescription>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">User</Label>
                    <p className="font-medium">{getUserName(selectedWithdrawal.userId)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{getUserEmail(selectedWithdrawal.userId)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-medium text-lg">
                      ${selectedWithdrawal.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Request Date</Label>
                    <p className="font-medium">
                      {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Bank Details</h4>
                  {getUserBankDetails(selectedWithdrawal.userId) ? (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">Bank Name</Label>
                        <p className="font-medium">
                          {getUserBankDetails(selectedWithdrawal.userId)?.bankName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Account Holder</Label>
                        <p className="font-medium">
                          {getUserBankDetails(selectedWithdrawal.userId)?.accountHolder}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Account Number</Label>
                        <p className="font-medium">
                          {getUserBankDetails(selectedWithdrawal.userId)?.accountNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">IFSC Code</Label>
                        <p className="font-medium">
                          {getUserBankDetails(selectedWithdrawal.userId)?.ifscCode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 rounded-lg flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="w-5 h-5" />
                      <span>User has not added bank details</span>
                    </div>
                  )}
                </div>

                {selectedWithdrawal.status === "pending" && (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedWithdrawal)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Approve & Pay"}
                    </Button>
                  </DialogFooter>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Withdrawal</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this withdrawal request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejection..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
              >
                {isProcessing ? "Processing..." : "Reject Withdrawal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
