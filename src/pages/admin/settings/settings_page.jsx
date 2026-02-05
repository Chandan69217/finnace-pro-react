import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Settings,
  DollarSign,
  Shield,
  Bell,
  Save,
  CheckCircle,
} from "lucide-react";
import { getSettings, updateSettings } from "../../../lib/store";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "FinancePro",
    supportEmail: "support@financepro.com",
    supportPhone: "+1-800-123-4567",
    minDeposit: 50,
    maxDeposit: 100000,
    minWithdrawal: 10,
    maxWithdrawal: 50000,
    referralBonus: 5,
    withdrawalFee: 2,
    maintenanceMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const storedSettings = getSettings();
    setSettings(storedSettings);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    updateSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      setSavedMessage("Settings saved successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Configure platform settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">
                  <Settings className="w-4 h-4" />
                </span>
                Saving...
              </>
            ) : savedMessage ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {savedMessage && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {savedMessage}
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      placeholder="Your platform name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, supportEmail: e.target.value })
                      }
                      placeholder="support@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      value={settings.supportPhone}
                      onChange={(e) =>
                        setSettings({ ...settings, supportPhone: e.target.value })
                      }
                      placeholder="+1-800-123-4567"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, users will see a maintenance page
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Settings
                </CardTitle>
                <CardDescription>
                  Configure deposit, withdrawal, and referral settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minDeposit">Minimum Deposit ($)</Label>
                    <Input
                      id="minDeposit"
                      type="number"
                      value={settings.minDeposit}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minDeposit: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDeposit">Maximum Deposit ($)</Label>
                    <Input
                      id="maxDeposit"
                      type="number"
                      value={settings.maxDeposit}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxDeposit: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minWithdrawal">Minimum Withdrawal ($)</Label>
                    <Input
                      id="minWithdrawal"
                      type="number"
                      value={settings.minWithdrawal}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minWithdrawal: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxWithdrawal">Maximum Withdrawal ($)</Label>
                    <Input
                      id="maxWithdrawal"
                      type="number"
                      value={settings.maxWithdrawal}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxWithdrawal: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="referralBonus">Referral Bonus (%)</Label>
                    <Input
                      id="referralBonus"
                      type="number"
                      value={settings.referralBonus}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          referralBonus: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Percentage of referred user investments
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                    <Input
                      id="withdrawalFee"
                      type="number"
                      value={settings.withdrawalFee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          withdrawalFee: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Fee deducted from withdrawals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and verification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Require KYC for Withdrawals</Label>
                      <p className="text-sm text-muted-foreground">
                        Users must complete KYC before withdrawing
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require email verification for new users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>IP Whitelisting</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict admin access to specific IPs
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure email and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Admin Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>New User Registration</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a new user signs up
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Withdrawal Requests</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified for new withdrawal requests
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>KYC Submissions</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when users submit KYC documents
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Large Deposits</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified for deposits over $10,000
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-medium">User Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Investment Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Daily earning notifications for users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users for all transactions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Promotional Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Send promotional and marketing emails
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
