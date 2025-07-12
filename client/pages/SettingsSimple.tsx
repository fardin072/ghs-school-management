import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings as SettingsIcon, Save, School, User } from "lucide-react";
import { useState } from "react";

export default function SettingsSimple() {
  const [settings, setSettings] = useState({
    schoolName: "GUZIA HIGH SCHOOL",
    schoolCode: "GHS001",
    principalName: "Dr. Academic Head",
    academicYear: "2024-25",
    theme: "wine",
  });

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Settings"
        subtitle="Configure system settings and preferences"
      >
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="w-5 h-5" />
              School Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolCode">School Code</Label>
                <Input
                  id="schoolCode"
                  value={settings.schoolCode}
                  onChange={(e) =>
                    handleInputChange("schoolCode", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="principalName">Principal Name</Label>
              <Input
                id="principalName"
                value={settings.principalName}
                onChange={(e) =>
                  handleInputChange("principalName", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Academic Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={settings.academicYear}
                  onValueChange={(value) =>
                    handleInputChange("academicYear", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                    <SelectItem value="2026-27">2026-27</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleInputChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wine">Wine Theme</SelectItem>
                    <SelectItem value="blue">Blue Theme</SelectItem>
                    <SelectItem value="green">Green Theme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>School:</strong> {settings.schoolName} (
                {settings.schoolCode})
              </div>
              <div>
                <strong>Principal:</strong> {settings.principalName}
              </div>
              <div>
                <strong>Academic Year:</strong> {settings.academicYear}
              </div>
              <div>
                <strong>Theme:</strong>{" "}
                <span className="capitalize">{settings.theme}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
