import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  Users,
  ExternalLink,
} from "lucide-react";
import { getMeetings } from "../../../lib/store";
import { useAuth } from "../../../lib/auth-context";

export default function UserMeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (user) {
      const userMeetings = getMeetings(user.id);
      setMeetings(userMeetings);
    }
  }, [user]);

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
    const meetingTime = new Date(meeting.scheduledAt);
    const now = new Date();
    const endTime = new Date(meetingTime.getTime() + meeting.duration * 60000);
    
    if (now >= meetingTime && now <= endTime) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
          <Video className="w-3 h-3 mr-1" />
          Live Now
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

  const isLive = (meeting) => {
    const meetingTime = new Date(meeting.scheduledAt);
    const now = new Date();
    const endTime = new Date(meetingTime.getTime() + meeting.duration * 60000);
    return meeting.status === "scheduled" && now >= meetingTime && now <= endTime;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Meetings</h1>
          <p className="text-muted-foreground">
            View your scheduled meetings and join calls
          </p>
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
                  <p className="text-sm text-muted-foreground">Attended</p>
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
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
                  <p className="text-2xl font-bold">{meetings.length}</p>
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
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No upcoming meetings</p>
                <p className="text-sm">You will be notified when a meeting is scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`p-4 border rounded-lg ${
                      isLive(meeting) ? "border-green-500 bg-green-500/5" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          {getStatusBadge(meeting)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {meeting.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(meeting.scheduledAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {new Date(meeting.scheduledAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{meeting.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {meeting.type === "all" ? (
                              <>
                                <Users className="w-4 h-4" />
                                <span>All Users</span>
                              </>
                            ) : (
                              <>
                                <Video className="w-4 h-4" />
                                <span>Individual</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {meeting.meetingLink && (
                        <Button
                          onClick={() => window.open(meeting.meetingLink, "_blank")}
                          className={isLive(meeting) ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {isLive(meeting) ? "Join Now" : "Join Meeting"}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
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
              <div className="space-y-3">
                {pastMeetings.slice(0, 5).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meeting.scheduledAt).toLocaleDateString()} at{" "}
                        {new Date(meeting.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {getStatusBadge(meeting)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
