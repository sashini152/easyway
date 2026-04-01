import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, TrendingUp, DollarSign, Package, Clock } from "lucide-react";

const CanteenAdminDashboard = () => {
  // Mock data for canteen admin stats
  const stats = {
    totalOrders: 89,
    revenue: 15230,
    activeItems: 24,
    rating: 4.7,
    todayOrders: 12,
    pendingOrders: 3
  };

  const recentOrders = [
    {
      id: "1",
      customer: "Student A",
      items: ["Rice and Curry", "Vegetable Rice"],
      total: 450,
      status: "completed",
      time: "10:30 AM"
    },
    {
      id: "2", 
      customer: "Student B",
      items: ["Chicken Submarine"],
      total: 280,
      status: "preparing",
      time: "11:45 AM"
    },
    {
      id: "3",
      customer: "Student C",
      items: ["Mixed Rice", "Samosa"],
      total: 320,
      status: "ready",
      time: "12:15 PM"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Canteen Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your canteen operations and orders
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-sm text-muted-foreground">+12% from last week</p>
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
              <p className="text-sm text-muted-foreground">+8% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Menu Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeItems}</div>
              <p className="text-sm text-muted-foreground">Active items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating}</div>
              <p className="text-sm text-muted-foreground">Customer rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-sm text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Today's Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
              <p className="text-sm text-muted-foreground">Orders today</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.join(", ")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.time} • Rs. {order.total}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === "completed" ? "default" : order.status === "preparing" ? "secondary" : "outline"}>
                        {order.status}
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

export default CanteenAdminDashboard;
