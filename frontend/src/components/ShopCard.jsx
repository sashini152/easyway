import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Phone, User, Utensils } from "lucide-react";

const ShopCard = ({ shop }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-48 w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(shop.name) + '&background=random&size=400x200';
          }}
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
          {shop.location || shop.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {shop.description}
        </p>
        
        {/* Additional Details */}
        <div className="space-y-3 mb-4">
          {/* Operating Hours */}
          {shop.operatingHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {shop.operatingHours.open} - {shop.operatingHours.close}
              </span>
            </div>
          )}
          
          {/* Contact Info */}
          {shop.contact?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{shop.contact.phone}</span>
            </div>
          )}
          
          {/* Shop Owner */}
          {shop.assignedShopOwner && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Manager: {shop.assignedShopOwner.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Utensils className="h-4 w-4" />
            {shop.status === "open" ? "Serving now" : "Currently closed"}
          </div>
          <Link to={`/shop/${shop._id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              View Menu
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
