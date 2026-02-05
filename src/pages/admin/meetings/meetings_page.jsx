import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Users,
  User as UserIcon,
  Video,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import {
  getStore,
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  createNotification,
} from "../../../lib/store";

import { useAuth } from "../../../lib/auth-context";

export default function AdminMeetingsPage() {
  const { user: currentUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: "30",
    type: "all",
    targetUserId: "",
    meetingLink: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMeetings = getMeetings();
    setMeetings(allMeetings);
    const store = getStore();
    setUsers(store.users.filter((u) => u.role === "user"));
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      scheduledAt: "",
      duration: "30",
      type: "all",
      targetUserId: "",
      meetingLink: "",
    });
    setEditingMeeting(null);
  };

  const handleSubmit = () => {
    if (!currentUser) return;

    if (editingMeeting) {
      updateMeeting(editingMeeting.id, {
        title: formData.title,
        description: formData.description,
        scheduledAt: formData.scheduledAt,
        duration: parseInt(formData.duration),
        type: formData.type,
        targetUserId: formData.type === "individual" ? formData.targetUserId : undefined,
        meetingLink: formData.meetingLink,
      });

      // Notify affected users about updated meeting
      if (formData.type === "all") {
        users.forEach((user) => {
          createNotification({
            userId: user.id,
            title: "Meeting Updated",
            message: `The meeting "${formData.title}" has been updated. New time: ${new Date(formData.scheduledAt).toLocaleString()}`,
            type: "info",
          });
        });
      } else if (formData.targetUserId) {
        createNotification({
          userId: formData.targetUserId,
          title: "Meeting Updated",
          message: `Your meeting "${formData.title}" has been updated. New time: ${new Date(formData.scheduledAt).toLocaleString()}`,
          type: "info",
        });
      }
    } else {
      createMeeting({
        title: formData.title,
        description: formData.description,
        scheduledAt: formData.scheduledAt,
        duration: parseInt(formData.duration),
        type: formData.type,
        targetUserId: formData.type === "individual" ? formData.targetUserId : undefined,
        meetingLink: formData.meetingLink,
        status: "scheduled",
        createdBy: currentUser.id,
      });

      // Notify affected users about new meeting
      if (formData.type === "all") {
        users.forEach((user) => {
          createNotification({
            userId: user.id,
            title: "New Meeting Scheduled",
            message: `A new meeting "${formData.title}" has been scheduled for ${new Date(formData.scheduledAt).toLocaleString()}`,
            type: "info",
          });
        });
      } else if (formData.targetUserId) {
        createNotification({
          userId: formData.targetUserId,
          title: "New Meeting Scheduled",
          message: `You have a new meeting "${formData.title}" scheduled for ${new Date(formData.scheduledAt).toLocaleString()}`,
          type: "info",
        });
      }
    }

    loadData();
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      scheduledAt: meeting.scheduledAt.slice(0, 16),
      duration: meeting.duration.toString(),
      type: meeting.type,
      targetUserId: meeting.targetUserId || "",
      meetingLink: meeting.meetingLink || "",
    });
    setShowAddDialog(true);
  };

  const handleDelete = (meetingId) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;

    deleteMeeting(meetingId);

    // Notify affected users about cancelled meeting
    if (meeting.type === "all") {
      users.forEach((user) => {
        createNotification({
          userId: user.id,
          title: "Meeting Cancelled",
          message: `The meeting "${meeting.title}" scheduled for ${new Date(meeting.scheduledAt).toLocaleString()} has been cancelled.`,
          type: "warning",
        });
      });
    } else if (meeting.targetUserId) {
      createNotification({
        userId: meeting.targetUserId,
        title: "Meeting Cancelled",
        message: `Your meeting "${meeting.title}" scheduled for ${new Date(meeting.scheduledAt).toLocaleString()} has been cancelled.`,
        type: "warning",
      });
    }

    loadData();
  };

  const handleStatusChange = (meetingId, status) => {
    updateMeeting(meetingId, { status });
    loadData();
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "scheduled" && new Date(m.scheduledAt) > new Date()
  );
  const pastMeetings = meetings.filter(
    (m) => m.status !== "scheduled" || new Date(m.scheduledAt) <= new Date()
  );

  const getStatusBadge = (meeting) => {
    if (meeting.status === "completed") {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (meeting.status === "cancelled") {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    }
    if (new Date(meeting.scheduledAt) <= new Date()) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
        <Calendar className="w-3 h-3 mr-1" />
        Scheduled
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meetings</h1>
            <p className="text-muted-foreground">
              Schedule and manage meetings with users
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {meetings.filter((m) => m.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMeetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming meetings scheduled</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingMeetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {meeting.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(meeting.scheduledAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{meeting.duration} mins</TableCell>
                        <TableCell>
                          {meeting.type === "all" ? (
                            <Badge variant="outline">
                              <Users className="w-3 h-3 mr-1" />
                              All Users
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <UserIcon className="w-3 h-3 mr-1" />
                              {getUserName(meeting.targetUserId || "")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(meeting)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {meeting.meetingLink && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(meeting.meetingLink, "_blank")
                                }
                              >
                                <Video className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(meeting)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(meeting.id, "completed")
                              }
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(meeting.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastMeetings.slice(0, 10).map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>
                          <p className="font-medium">{meeting.title}</p>
                        </TableCell>
                        <TableCell>
                          {new Date(meeting.scheduledAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{meeting.duration} mins</TableCell>
                        <TableCell>
                          {meeting.type === "all" ? (
                            <span className="text-sm">All Users</span>
                          ) : (
                            <span className="text-sm">
                              {getUserName(meeting.targetUserId || "")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(meeting)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Meeting Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
              </DialogTitle>
              <DialogDescription>
                {editingMeeting
                  ? "Update the meeting details"
                  : "Create a new meeting for all users or a specific user"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Meeting Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Monthly Update Call"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What will be discussed in this meeting?"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) =>
                      setFormData({ ...formData, duration: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Meeting Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value, targetUserId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="individual">Individual User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "individual" && (
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <Select
                    value={formData.targetUserId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetUserId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Meeting Link (optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    value={formData.meetingLink}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingLink: e.target.value })
                    }
                    placeholder="https://zoom.us/j/..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.title ||
                  !formData.scheduledAt ||
                  (formData.type === "individual" && !formData.targetUserId)
                }
              >
                {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
