import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Settings } from "lucide-react";

const AdminCanteenManagement = () => {
  // Mock data for canteens
  const canteens = [
    {
      id: "1",
      name: "Main Canteen",
      location: "Main Building",
      status: "active",
      manager: "John Doe",
      orders: 234,
      revenue: 45230
    },
    {
      id: "2",
      name: "Engineering Canteen", 
      location: "Engineering Faculty",
      status: "active",
      manager: "Jane Smith",
      orders: 156,
      revenue: 28900
    },
    {
      id: "3",
      name: "Business School Canteen",
      location: "Business Faculty",
      status: "inactive",
      manager: "Mike Johnson",
      orders: 89,
      revenue: 15600
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Canteen Management</h1>
            <p className="text-muted-foreground">
              Manage all campus canteens and their operations
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Canteen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Canteens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {canteens.map((canteen) => (
                <div key={canteen.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{canteen.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{canteen.location}</p>
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
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                        Delete
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
  );
};

export default AdminCanteenManagement;
