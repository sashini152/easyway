import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Clock, ShoppingCart, MapPin, Phone, User, Utensils } from "lucide-react";
import { canteenAPI } from "@/services/api";

const ShopDetail = () => {
  const { id } = useParams();
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchCanteenDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch canteen details
        const canteenResponse = await canteenAPI.getCanteenById(id);
        if (canteenResponse.success) {
          setCanteen(canteenResponse.data);
        }
        
        // TODO: Fetch menu items for this canteen
        // For now, we'll show a placeholder menu
        setMenuItems([
          {
            _id: '1',
            name: 'Rice and Curry',
            description: 'Traditional Sri Lankan rice with mixed curries',
            price: 250,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300'
          },
          {
            _id: '2', 
            name: 'Kottu',
            description: 'Spicy chopped roti with vegetables and meat',
            price: 300,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'
          },
          {
            _id: '3',
            name: 'Short Eats',
            description: 'Assorted pastries and snacks',
            price: 150,
            category: 'Snacks',
            image: 'https://images.unsplash.com/photo-1528207776546-365bb2b05355?w=300'
          },
          {
            _id: '4',
            name: 'Fresh Juice',
            description: 'Freshly squeezed fruit juice',
            price: 120,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1600271886742-f049be45f956?w=300'
          }
        ]);
      } catch (error) {
        console.error('Error fetching canteen details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteenDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading canteen details...</p>
        </div>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Canteen Not Found</h1>
          <p className="text-muted-foreground mb-4">The canteen you're looking for doesn't exist.</p>
          <Link to="/canteens">
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
          src={canteen.image}
          alt={canteen.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(canteen.name) + '&background=random&size=800x400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge className={canteen.status === "active" ? "status-open" : "status-closed"}>
            {canteen.status === "active" ? "● Open Now" : "● Closed"}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link to="/canteens" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Canteens
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canteen Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {canteen.name}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm">{canteen.rating || 4.5}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  {canteen.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {canteen.address?.street || 'N/A'}, {canteen.address?.city || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {canteen.operatingHours?.open} - {canteen.operatingHours?.close}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                {canteen.contact?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">{canteen.contact.phone}</p>
                      {canteen.contact.email && (
                        <p className="text-sm text-muted-foreground">{canteen.contact.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Manager */}
                {canteen.assignedShopOwner && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Manager</p>
                      <p className="text-sm text-muted-foreground">{canteen.assignedShopOwner.name}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link to={`/reserve/${id}`} className="block">
                    <Button className="w-full" size="lg" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Reserve Table
                    </Button>
                  </Link>
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Menu</h2>
              <p className="text-muted-foreground">Browse our delicious offerings</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {menuItems.map((item) => (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">Rs. {item.price}</span>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
