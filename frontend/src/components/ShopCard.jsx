import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin } from "lucide-react";

const ShopCard = ({ shop }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={shop.status === "open" ? "status-open" : "status-closed"}>
            {shop.status === "open" ? "● Open" : "● Closed"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {shop.name}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">{shop.rating}</span>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {shop.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {shop.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {shop.status === "open" ? "Open now" : "Closed"}
          </div>
          <Link to={`/shop/${shop.id}`}>
            <Button size="sm">
              View Menu
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
