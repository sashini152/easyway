import { useState, useEffect } from "react";
import { shops as seedShops } from "@/data/mockData";
import ShopCard from "@/components/ShopCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { UtensilsCrossed, Flame, Search } from "lucide-react";

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState(() => storage.get(STORAGE_KEYS.SHOPS, seedShops));

  const filtered = shops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "open") return matchesSearch && shop.status === "open";
    if (filter === "closed") return matchesSearch && shop.status === "closed";
    return matchesSearch;
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.SHOPS, shops);
  }, [shops]);

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

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "hero" : "ghost"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "open" ? "hero" : "ghost"}
              onClick={() => setFilter("open")}
            >
              <Flame className="mr-2 h-4 w-4" />
              Open Now
            </Button>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search canteens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
