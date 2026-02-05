import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Check,
  Trash2,
} from "lucide-react";
import { getStore } from "../../../lib/store";

export default function AdminNotificationsPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate.push("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      const store = getStore();
      const userNotifications = store.notifications
        .filter((n) => n.userId === user.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setNotifications(userNotifications);
    }
  }, [user]);

  const markAsRead = (notificationId) => {
    const store = getStore();
    const index = store.notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      store.notifications[index].read = true;
      localStorage.setItem("financeAppStore", JSON.stringify(store));
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    }
  };

  const markAllAsRead = () => {
    const store = getStore();
    store.notifications = store.notifications.map((n) =>
      n.userId === user?.id ? { ...n, read: true } : n
    );
    localStorage.setItem("financeAppStore", JSON.stringify(store));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId) => {
    const store = getStore();
    store.notifications = store.notifications.filter(
      (n) => n.id !== notificationId
    );
    localStorage.setItem("financeAppStore", JSON.stringify(store));
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your account activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              {unreadCount > 0 && (
                <Badge className="bg-primary/10 text-primary">
                  {unreadCount} unread
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No notifications
                </h3>
                <p className="text-muted-foreground">
                  You are all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      notification.read
                        ? "bg-background"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`font-medium ${
                            notification.read
                              ? "text-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
