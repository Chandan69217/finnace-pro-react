import React from "react"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Shield,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";
import { getStore } from "../../../lib/store";

export default function KYCPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    frontImage: "",
    backImage: "",
    selfieImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleFileChange = (field) => {
    setFormData({ ...formData, [field]: `uploaded_${Date.now()}.jpg` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const store = getStore();
    const userIndex = store.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      store.users[userIndex].kycStatus = "pending";
      store.users[userIndex].kycDocuments = {
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        frontImage: formData.frontImage,
        backImage: formData.backImage,
        selfieImage: formData.selfieImage,
        submittedAt: new Date().toISOString(),
      };

      store.notifications({
        id: `notif_${Date.now()}`,
        userId: user.id,
        title: "KYC Submitted",
        message:
          "Your KYC documents have been submitted for verification. This usually takes 1-2 business days.",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("financeAppStore", JSON.stringify(store));
      refreshUser();
    }

    setIsSubmitting(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (user.kycStatus) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Submitted
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYC Verification
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete identity verification to unlock all features
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {user.kycStatus === "verified" ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Verification Complete
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Your identity has been verified successfully. You now have full
                access to all platform features including withdrawals.
              </p>
            </CardContent>
          </Card>
        ) : user.kycStatus === "pending" ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Verification In Progress
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Your documents are being reviewed by our team. This process
                typically takes 1-2 business days. We will notify you once the
                verification is complete.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Submit Documents
                  </CardTitle>
                  <CardDescription>
                    Please provide your identification documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Document Type</Label>
                        <Select
                          value={formData.documentType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, documentType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="national_id">
                              National ID Card
                            </SelectItem>
                            <SelectItem value="drivers_license">
                              Drivers License
                            </SelectItem>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Document Number</Label>
                        <Input
                          value={formData.documentNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documentNumber: e.target.value,
                            })
                          }
                          placeholder="Enter document number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Document Images</Label>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            formData.frontImage
                              ? "border-green-500 bg-green-500/5"
                              : "border-border hover:border-primary"
                          }`}
                          onClick={() => handleFileChange("frontImage")}
                        >
                          {formData.frontImage ? (
                            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          ) : (
                            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          )}
                          <p className="text-sm font-medium">Front Side</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.frontImage
                              ? "Uploaded"
                              : "Click to upload"}
                          </p>
                        </div>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            formData.backImage
                              ? "border-green-500 bg-green-500/5"
                              : "border-border hover:border-primary"
                          }`}
                          onClick={() => handleFileChange("backImage")}
                        >
                          {formData.backImage ? (
                            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          ) : (
                            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          )}
                          <p className="text-sm font-medium">Back Side</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.backImage ? "Uploaded" : "Click to upload"}
                          </p>
                        </div>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            formData.selfieImage
                              ? "border-green-500 bg-green-500/5"
                              : "border-border hover:border-primary"
                          }`}
                          onClick={() => handleFileChange("selfieImage")}
                        >
                          {formData.selfieImage ? (
                            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          ) : (
                            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          )}
                          <p className="text-sm font-medium">Selfie</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formData.selfieImage
                              ? "Uploaded"
                              : "Click to upload"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isSubmitting ||
                        !formData.documentType ||
                        !formData.documentNumber ||
                        !formData.frontImage ||
                        !formData.backImage ||
                        !formData.selfieImage
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit for Verification
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why KYC?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Security</p>
                      <p className="text-xs text-muted-foreground">
                        Protects your account from unauthorized access
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Full Access</p>
                      <p className="text-xs text-muted-foreground">
                        Unlock withdrawals and higher limits
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Compliance</p>
                      <p className="text-xs text-muted-foreground">
                        Meet regulatory requirements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accepted Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Passport
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      National ID Card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Drivers License
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Aadhar Card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      PAN Card
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
