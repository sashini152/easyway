import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Tag, Percent } from "lucide-react";

const Offers = () => {
  // Mock data for offers
  const offers = [
    {
      id: "1",
      title: "Student Special - 20% Off",
      description: "Get 20% off on all meals with valid student ID",
      discount: "20%",
      shopName: "Main Canteen",
      validUntil: "2024-12-31",
      category: "student",
      image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE"
    },
    {
      id: "2",
      title: "Combo Meal Deal",
      description: "Rice + Curry + Drink for only Rs. 350",
      discount: "Rs. 350",
      shopName: "Engineering Canteen",
      validUntil: "2024-11-30",
      category: "combo",
      image: "https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE"
    },
    {
      id: "3",
      title: "Happy Hour - 15% Off",
      description: "15% off on all items between 2-4 PM",
      discount: "15%",
      shopName: "Business School Canteen",
      validUntil: "2024-12-15",
      category: "time",
      image: "https://images.unsplash.com/photo-1555939594-58d6cb832d44?ixlib=rb-4.0.3&ixid=MnW0hc8hhE"
    },
    {
      id: "4",
      title: "Weekend Special",
      description: "Buy 1 Get 1 Free on selected items",
      discount: "BOGO",
      shopName: "Main Canteen",
      validUntil: "2024-12-25",
      category: "special",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnW0hc8hhE"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Canteens
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Special Offers</h1>
              <p className="text-muted-foreground">
                Current deals and discounts from all campus canteens
              </p>
            </div>
            <Badge className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {offers.length} Active Offers
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
                    <Percent className="h-3 w-3" />
                    {offer.discount}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {offer.shopName}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  Valid until {new Date(offer.validUntil).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {offer.description}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    Claim Offer
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No special offers available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
