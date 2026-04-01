import { useParams } from "react-router-dom";
import { shops, foodItems } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Clock, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ShopDetail = () => {
  const { id } = useParams();
  const shop = shops.find(s => s.id === id);
  const shopFoodItems = foodItems.filter(item => item.shopId === id);

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Canteens
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge className={shop.status === "open" ? "status-open" : "status-closed"}>
            {shop.status === "open" ? "● Open" : "● Closed"}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Canteens
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
              <p className="text-muted-foreground mb-4">{shop.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {shop.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {shop.address}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Menu Items</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shopFoodItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="font-bold text-primary">Rs. {item.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <Button className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge className={shop.status === "open" ? "status-open" : "status-closed"}>
                    {shop.status === "open" ? "Currently Open" : "Currently Closed"}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">{shop.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rating</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{shop.rating} / 5.0</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: contact@sliit.lk<br />
                    Phone: +94 11 123 4567
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Opening Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8:00 AM - 8:00 PM<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
