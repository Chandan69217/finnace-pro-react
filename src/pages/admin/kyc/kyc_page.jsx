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
  Shield,
  FileText,
  User as UserIcon,
} from "lucide-react";
import {
  getStore,
  updateUser,
  createNotification,
} from "../../../lib/store";

export default function AdminKYCPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const store = getStore();
    setUsers(store.users.filter((u) => u.role === "user"));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.kycStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = () => {
    if (!selectedUser) return;
    setIsProcessing(true);

    updateUser(selectedUser.id, { kycStatus: "verified" });

    createNotification({
      userId: selectedUser.id,
      title: "KYC Approved",
      message:
        "Your KYC verification has been approved. You now have full access to all features.",
      type: "success",
    });

    loadData();
    setIsProcessing(false);
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    if (!selectedUser || !rejectReason.trim()) return;
    setIsProcessing(true);

    updateUser(selectedUser.id, { kycStatus: "rejected" });

    createNotification({
      userId: selectedUser.id,
      title: "KYC Rejected",
      message: `Your KYC verification has been rejected. Reason: ${rejectReason}. Please resubmit with valid documents.`,
      type: "error",
    });

    loadData();
    setIsProcessing(false);
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setRejectReason("");
  };

  const pendingCount = users.filter((u) => u.kycStatus === "submitted").length;
  const verifiedCount = users.filter((u) => u.kycStatus === "verified").length;
  const rejectedCount = users.filter((u) => u.kycStatus === "rejected").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-600 border-gray-500/20"
          >
            <Clock className="w-3 h-3 mr-1" />
            Not Submitted
          </Badge>
        );
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-500/20"
          >
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
          <h1 className="text-2xl font-bold text-foreground">KYC Management</h1>
          <p className="text-muted-foreground">
            Review and manage user KYC verification requests
          </p>
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
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
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
                  <p className="text-sm text-muted-foreground">Verified Users</p>
                  <p className="text-2xl font-bold">{verifiedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "submitted", "verified", "rejected", "pending"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status === "pending" ? "Not Submitted" : status}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No KYC requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.kycDocuments?.submittedAt
                            ? new Date(
                                user.kycDocuments.submittedAt
                              ).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {user.kycDocuments?.idType || "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.kycStatus)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>KYC Verification Details</DialogTitle>
              <DialogDescription>
                Review the user submitted documents and verify identity
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.kycStatus)}
                    </div>
                  </div>
                </div>

                {selectedUser.kycDocuments ? (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Submitted Documents
                    </h4>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">ID Type</Label>
                        <p className="font-medium">
                          {selectedUser.kycDocuments.idType}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">ID Number</Label>
                        <p className="font-medium">
                          {selectedUser.kycDocuments.idNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Submitted At
                        </Label>
                        <p className="font-medium">
                          {new Date(
                            selectedUser.kycDocuments.submittedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {selectedUser.kycDocuments.frontImage && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">
                            ID Front
                          </Label>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                            <Shield className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      {selectedUser.kycDocuments.backImage && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">ID Back</Label>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                            <Shield className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      {selectedUser.kycDocuments.selfie && (
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Selfie</Label>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                            <UserIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="p-4 bg-gray-500/10 rounded-lg flex items-center gap-2 text-gray-600">
                      <FileText className="w-5 h-5" />
                      <span>User has not submitted KYC documents yet</span>
                    </div>
                  </div>
                )}

                {selectedUser.kycStatus === "submitted" && (
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
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Approve KYC"}
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
              <DialogTitle>Reject KYC</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this KYC verification
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Document is blurry, ID expired, Name mismatch..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
              >
                {isProcessing ? "Processing..." : "Reject KYC"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
