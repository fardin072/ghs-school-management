import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardApi, classSectionsApi } from "@/lib/api";
import { ClassSection } from "@shared/types";

export default function Index() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [classStats, setClassStats] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResult, classSectionsResult] = await Promise.all([
        dashboardApi.getStats(),
        classSectionsApi.getAll(),
      ]);

      if (statsResult.success) {
        setDashboardStats(statsResult.data);
      }

      if (classSectionsResult.success) {
        setClassStats(classSectionsResult.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back! Today is ${currentDate}`}
      >
        <Button>
          <CalendarDays className="w-4 h-4 mr-2" />
          Academic Calendar
        </Button>
      </DashboardHeader>

      <div className="p-8 space-y-8">
        {/* Stats Overview */}
        <StatsCards dashboardStats={dashboardStats} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivities />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <QuickActions />

            {/* Academic Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Half-yearly Exams</span>
                      <span className="text-success font-medium">95%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Final Exams</span>
                      <span className="text-warning font-medium">65%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Marksheets Generated</span>
                      <span className="text-info font-medium">80%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-info h-2 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-muted-foreground">
                    Loading class data...
                  </div>
                ) : (
                  classStats.slice(0, 6).map((classSection) => (
                    <div
                      key={`${classSection.class}-${classSection.section}`}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          Class {classSection.class}-{classSection.section}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {classSection.classTeacher}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-success">
                        {classSection.studentCount} students
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mathematics</span>
                  <span className="text-sm font-medium text-success">
                    88.3%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Science</span>
                  <span className="text-sm font-medium text-success">
                    84.7%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">English</span>
                  <span className="text-sm font-medium text-info">79.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hindi</span>
                  <span className="text-sm font-medium text-warning">
                    75.6%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>School Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center text-muted-foreground">
                    Loading overview...
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Students Enrolled</span>
                      <span className="text-sm font-medium">
                        {dashboardStats?.totalStudents || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Classes</span>
                      <span className="text-sm font-medium">
                        {dashboardStats?.totalClasses || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Class Size</span>
                      <span className="text-sm font-medium">
                        {dashboardStats?.averageClassSize || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Academic Year</span>
                      <span className="text-sm font-medium">2024-25</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
