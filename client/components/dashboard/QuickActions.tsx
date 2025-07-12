import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, FileText, Upload, Download } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: Plus,
      href: "/students/add",
      variant: "default" as const,
    },
    {
      title: "Enter Marks",
      description: "Input exam marks",
      icon: FileText,
      href: "/marks-entry",
      variant: "secondary" as const,
    },
    {
      title: "Generate Marksheet",
      description: "Create student marksheet",
      icon: Download,
      href: "/marksheets/generate",
      variant: "secondary" as const,
    },
    {
      title: "Import Data",
      description: "Upload student data",
      icon: Upload,
      href: "/import",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button
                variant={action.variant}
                className="w-full justify-start h-auto p-4"
              >
                <div className="flex items-center space-x-3">
                  <action.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
