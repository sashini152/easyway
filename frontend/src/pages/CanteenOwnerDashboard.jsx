import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, TrendingUp, DollarSign, Package, Settings, BarChart } from "lucide-react";

const CanteenOwnerDashboard = () => {
  // Mock data for canteen owner stats
  const stats = {
    totalRevenue: 125750,
    totalOrders: 1247,
    activeCanteens: 3,
    totalStaff: 15,
    monthlyGrowth: 12.5,
    customerSatisfaction: 4.8
  };

  const canteens = [
    {
      id: "1",
      name: "Main Canteen",
      revenue: 45230,
      orders: 423,
      status: "active",
      manager: "John Doe"
    },
    {
      id: "2",
      name: "Engineering Canteen",
      revenue: 38900,
      orders: 367,
      status: "active",
      manager: "Jane Smith"
    },
    {
      id: "3",
      name: "Business School Canteen",
      revenue: 41620,
      orders: 457,
      status: "active",
      manager: "Mike Johnson"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Canteen Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all your canteen operations and performance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
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
              <p className="text-sm text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Canteens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCanteens}</div>
              <p className="text-sm text-muted-foreground">Operating canteens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
              <p className="text-sm text-muted-foreground">Employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
              <p className="text-sm text-muted-foreground">Monthly growth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
              <p className="text-sm text-muted-foreground">Customer rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Canteen Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {canteens.map((canteen) => (
                  <div key={canteen.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{canteen.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Manager: {canteen.manager}</span>
                        <span>•</span>
                        <span>{canteen.orders} orders</span>
                        <span>•</span>
                        <span>Rs. {canteen.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={canteen.status === "active" ? "default" : "secondary"}>
                        {canteen.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart className="h-4 w-4" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                          Settings
                        </Button>
                      </div>
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

export default CanteenOwnerDashboard;
