import { useState, useEffect } from "react";
import ShopCard from "@/components/ShopCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Flame, Search, Clock, MapPin, Filter, Wrench } from "lucide-react";
import { canteenAPI } from "../services/api";

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanteens();
  }, []);

  const fetchCanteens = async () => {
    try {
      setLoading(true);
      const response = await canteenAPI.getAllCanteens();
      console.log('🔍 Index: Canteens API response:', response);
      
      if (response.success) {
        console.log('🔍 Index: Canteens data:', response.data.canteens);
        
        // Transform canteen data to match the shop card format
        const transformedShops = response.data.canteens.map(canteen => {
          console.log('🔍 Index: Processing canteen:', canteen.name, 'status:', canteen.status);
          
          return {
            _id: canteen._id,
            name: canteen.name,
            description: canteen.description,
            image: canteen.image,
            location: `${canteen.address?.street || 'N/A'}, ${canteen.address?.city || 'N/A'}`,
            rating: canteen.rating || 4.5,
            status: canteen.status === 'active' ? 'open' : canteen.status === 'maintenance' ? 'maintenance' : 'closed',
            originalStatus: canteen.status, // Keep original status for display
            operatingHours: canteen.operatingHours,
            contact: canteen.contact,
            assignedShopOwner: canteen.assignedShopOwner
          };
        });
        
        console.log('🔍 Index: Transformed shops:', transformedShops);
        setShops(transformedShops);
      }
    } catch (error) {
      console.error('Error fetching canteens:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "open") return matchesSearch && shop.status === "open";
    if (filter === "closed") return matchesSearch && shop.status === "closed";
    if (filter === "maintenance") return matchesSearch && shop.status === "maintenance";
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading canteens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              SLIIT<span className="text-primary">Eats</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover campus canteens and order your favorite meals
          </p>
        </header>

        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                All Canteens
                <Badge variant="secondary" className="ml-1">
                  {shops.length}
                </Badge>
              </Button>
              <Button
                variant={filter === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("open")}
                className="flex items-center gap-2"
              >
                <Flame className="h-4 w-4" />
                Open Now
                <Badge variant="secondary" className="ml-1">
                  {shops.filter(s => s.status === 'open').length}
                </Badge>
              </Button>
              <Button
                variant={filter === "closed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("closed")}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Closed
                <Badge variant="secondary" className="ml-1">
                  {shops.filter(s => s.status === 'closed').length}
                </Badge>
              </Button>
              <Button
                variant={filter === "maintenance" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("maintenance")}
                className="flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                Under Maintenance
                <Badge variant="secondary" className="ml-1">
                  {shops.filter(s => s.status === 'maintenance').length}
                </Badge>
              </Button>
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search canteens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>
          
          {/* Status Summary */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{shops.filter(s => s.status === 'open').length} Open Now</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{shops.filter(s => s.status === 'closed').length} Closed</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{shops.length} Total Canteens</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No canteens found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
