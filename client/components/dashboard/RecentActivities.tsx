import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, UserPlus, Edit, Check } from "lucide-react";

interface Activity {
  id: string;
  type: "marksheet" | "student" | "entry" | "approval";
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: "completed" | "pending" | "in_progress";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "marksheet",
    title: "Marksheet Generated",
    description: "Half-yearly marksheet for Class 10-A",
    timestamp: "2 hours ago",
    user: "IT Manager",
    status: "completed",
  },
  {
    id: "2",
    type: "entry",
    title: "Marks Entry",
    description: "Mathematics marks entered for Class 9-B",
    timestamp: "4 hours ago",
    user: "IT Manager",
    status: "completed",
  },
  {
    id: "3",
    type: "student",
    title: "New Student Added",
    description: "Rahul Kumar added to Class 8-C",
    timestamp: "1 day ago",
    user: "IT Manager",
    status: "completed",
  },
  {
    id: "4",
    type: "entry",
    title: "Pending Review",
    description: "Science marks for Class 7-A pending approval",
    timestamp: "2 days ago",
    user: "IT Manager",
    status: "pending",
  },
  {
    id: "5",
    type: "marksheet",
    title: "Marksheet Generated",
    description: "Final marksheet for Class 12-A",
    timestamp: "3 days ago",
    user: "IT Manager",
    status: "completed",
  },
];

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "marksheet":
      return FileText;
    case "student":
      return UserPlus;
    case "entry":
      return Edit;
    case "approval":
      return Check;
    default:
      return FileText;
  }
}

function getStatusBadge(status: Activity["status"]) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-success text-success-foreground">
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="default" className="bg-warning text-warning-foreground">
          Pending
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="default" className="bg-info text-info-foreground">
          In Progress
        </Badge>
      );
    default:
      return null;
  }
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    {activity.status && getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        AM
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {activity.user} • {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
