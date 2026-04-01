import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, TrendingUp, DollarSign, Settings, Database, Shield } from "lucide-react";

const SuperAdminDashboard = () => {
  // Mock data for admin stats
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalCanteens: 12,
    activeCanteens: 8,
    totalOrders: 3421,
    revenue: 125750,
    systemHealth: "Good",
    uptime: "99.9%"
  };

  const recentActivity = [
    {
      id: "1",
      action: "New user registration",
      user: "john.doe@sliit.lk",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "success"
    },
    {
      id: "2", 
      action: "Canteen status updated",
      user: "admin@sliit.lk",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "success"
    },
    {
      id: "3",
      action: "New order placed",
      user: "jane.smith@sliit.lk",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "success"
    },
    {
      id: "4",
      action: "System backup completed",
      user: "system@sliit.lk",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "success"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System administration and overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">{stats.systemHealth}</div>
                <p className="text-sm text-muted-foreground">System status</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stats.uptime}%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  System Settings
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Management
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.user}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                        {activity.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
