import React, { useState, useEffect, useMemo } from 'react';
import Map, { type Cafe } from '@/components/Map';
import CafeList from '@/components/CafeList';
import SearchAndFilter from '@/components/SearchAndFilter';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, MapPin, Loader2, Zap, Users, Clock } from 'lucide-react';
import { getCafesByDistance, filterCafes } from '@/utils/distance';
import cafesData from '@/data/cafes.json';

const Index = () => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const cafes = useMemo(() => cafesData as Cafe[], []);

  const processedCafes = useMemo(() => {
    let filtered = filterCafes(cafes, searchTerm, filterType);
    return getCafesByDistance(filtered, userLocation);
  }, [cafes, searchTerm, filterType, userLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCafeSelect = (cafe: Cafe) => {
    setSelectedCafe(cafe);
  };

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
  };

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="mb-6 w-20 h-20 bg-gradient-to-br from-coffee-brown to-coffee-accent rounded-full flex items-center justify-center mx-auto animate-bounce-gentle shadow-lg shadow-coffee-brown/30">
            <Coffee className="w-10 h-10 text-coffee-cream" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-coffee-accent" />
          <h2 className="text-xl font-bold text-coffee-brown mb-2">Loading your cafe map...</h2>
          <p className="text-muted-foreground animate-pulse-soft">Brewing the perfect experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-coffee-light/30 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-slide-in">
              <div className="w-12 h-12 bg-gradient-to-br from-coffee-brown to-coffee-accent rounded-xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                <Coffee className="w-7 h-7 text-coffee-cream" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-coffee-brown to-coffee-accent bg-clip-text text-transparent">
                  Cafe Finder
                </h1>
                <p className="text-sm text-muted-foreground">Discover great coffee spots near you</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {processedCafes.length !== cafes.length && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-coffee-accent hover:bg-coffee-accent/10"
                >
                  Clear Filters
                </Button>
              )}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{userLocation ? 'Your Location' : 'Pune, India'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-md shadow-xl shadow-coffee-brown/10 animate-fade-in">
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
                totalCafes={cafes.length}
                filteredCount={processedCafes.length}
                userLocation={userLocation}
              />
              
              <CafeList
                cafes={processedCafes}
                selectedCafe={selectedCafe}
                onCafeSelect={handleCafeSelect}
                userLocation={userLocation}
              />
            </Card>
          </div>

          {/* Enhanced Map */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="p-0 overflow-hidden shadow-2xl shadow-coffee-brown/20 animate-scale-in">
              <div className="h-[500px] lg:h-[700px] relative">
                <Map
                  cafes={processedCafes}
                  selectedCafe={selectedCafe}
                  onCafeSelect={handleCafeSelect}
                  mapboxToken={mapboxToken}
                  onUserLocationChange={setUserLocation}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/5 rounded-lg" />
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Stats Footer */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="inline-flex items-center justify-center space-x-8 bg-white/80 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl shadow-coffee-brown/10">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-accent to-coffee-accent rounded-full animate-pulse-soft"></div>
              <span className="text-sm font-medium text-coffee-brown">Your Location</span>
            </div>
            <div className="h-6 w-px bg-coffee-light/50"></div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-coffee-brown to-coffee-accent rounded-full"></div>
              <span className="text-sm font-medium text-coffee-brown">{processedCafes.length} Cafes Found</span>
            </div>
            <div className="h-6 w-px bg-coffee-light/50"></div>
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-coffee-accent" />
              <span className="text-sm font-medium text-coffee-brown">Live Updates</span>
            </div>
          </div>
          
          {userLocation && (
            <p className="mt-4 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
              Showing cafes sorted by distance from your location
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;