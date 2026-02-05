import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
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
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { getStore} from "../../../lib/store";

export default function AdminPackagesPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minInvestment: "",
    maxInvestment: "",
    dailyReturn: "",
    duration: "",
    totalReturn: "",
    status: "active",
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      const store = getStore();
      setPackages(store.packages);
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      minInvestment: "",
      maxInvestment: "",
      dailyReturn: "",
      duration: "",
      totalReturn: "",
      status: "active",
    });
    setEditingPackage(null);
  };

  const handleAddPackage = () => {
    const store = getStore();
    const newPackage = {
      id: `pkg_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      minInvestment: parseFloat(formData.minInvestment),
      maxInvestment: parseFloat(formData.maxInvestment),
      dailyReturn: parseFloat(formData.dailyReturn),
      duration: parseInt(formData.duration),
      totalReturn: parseFloat(formData.totalReturn),
      status: formData.status,
      createdAt: new Date().toISOString(),
    };

    store.packages.push(newPackage);
    localStorage.setItem("packages", JSON.stringify(store.packages));
    setPackages([...store.packages]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditPackage = () => {
    if (!editingPackage) return;

    const store = getStore();
    const index = store.packages.findIndex((p) => p.id === editingPackage.id);
    if (index !== -1) {
      store.packages[index] = {
        ...editingPackage,
        name: formData.name,
        description: formData.description,
        minInvestment: parseFloat(formData.minInvestment),
        maxInvestment: parseFloat(formData.maxInvestment),
        dailyReturn: parseFloat(formData.dailyReturn),
        duration: parseInt(formData.duration),
        totalReturn: parseFloat(formData.totalReturn),
        status: formData.status,
      };
      localStorage.setItem("packages", JSON.stringify(store.packages));
      setPackages([...store.packages]);
    }
    setShowAddDialog(false);
    resetForm();
  };

  const handleDeletePackage = (packageId) => {
    const store = getStore();
    const updatedPackages = store.packages.filter((p) => p.id !== packageId);
    localStorage.setItem("packages", JSON.stringify(updatedPackages));
    setPackages(updatedPackages);
  };

  const openEditDialog = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      minInvestment: pkg.minInvestment.toString(),
      maxInvestment: pkg.maxInvestment.toString(),
      dailyReturn: pkg.dailyReturn.toString(),
      duration: pkg.duration.toString(),
      totalReturn: pkg.totalReturn.toString(),
      status: pkg.status,
    });
    setShowAddDialog(true);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Package Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage investment packages
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPackage ? "Edit Package" : "Add New Package"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Gold Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Package description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Investment ($)</Label>
                    <Input
                      type="number"
                      value={formData.minInvestment}
                      onChange={(e) =>
                        setFormData({ ...formData, minInvestment: e.target.value })
                      }
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Investment ($)</Label>
                    <Input
                      type="number"
                      value={formData.maxInvestment}
                      onChange={(e) =>
                        setFormData({ ...formData, maxInvestment: e.target.value })
                      }
                      placeholder="10000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Daily Return (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.dailyReturn}
                      onChange={(e) =>
                        setFormData({ ...formData, dailyReturn: e.target.value })
                      }
                      placeholder="1.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Return (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.totalReturn}
                    onChange={(e) =>
                      setFormData({ ...formData, totalReturn: e.target.value })
                    }
                    placeholder="15"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active Status</Label>
                  <Switch
                    checked={formData.status === "active"}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status: checked ? "active" : "inactive" })
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={editingPackage ? handleEditPackage : handleAddPackage}
                >
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Packages ({packages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Investment Range</TableHead>
                    <TableHead>Daily Return</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pkg.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {pkg.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${pkg.minInvestment?.toLocaleString() ?? 0} - $
                        {pkg.maxInvestment?.toLocaleString() ?? 0}
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {pkg.dailyReturn}% / {pkg.totalReturn}% total
                      </TableCell>
                      <TableCell>{pkg.duration} days</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            pkg.status === "active"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                        >
                          {pkg.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  );
}
