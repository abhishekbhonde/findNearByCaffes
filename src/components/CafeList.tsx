import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Navigation, Clock } from 'lucide-react';
import { formatDistance } from '@/utils/distance';
import type { Cafe } from './Map';

interface CafeListProps {
  cafes: (Cafe & { distance?: number })[];
  selectedCafe?: Cafe | null;
  onCafeSelect: (cafe: Cafe) => void;
  userLocation: [number, number] | null;
}

const CafeList: React.FC<CafeListProps> = ({ 
  cafes, 
  selectedCafe, 
  onCafeSelect, 
  userLocation 
}) => {
  const handleDirections = (cafe: Cafe, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.coordinates[1]},${cafe.coordinates[0]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-coffee-brown mb-2">Nearby Cafes</h2>
        <p className="text-muted-foreground">
          {userLocation ? 'Sorted by distance from your location' : 'Click on any cafe to view it on the map'}
        </p>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-coffee-light scrollbar-track-transparent">
        {cafes.map((cafe, index) => (
          <Card
            key={cafe.id}
            className={`cursor-pointer group transition-all duration-300 hover:shadow-lg hover:shadow-coffee-brown/20 hover:-translate-y-1 animate-fade-in ${
              selectedCafe?.id === cafe.id 
                ? 'ring-2 ring-coffee-accent shadow-lg shadow-coffee-accent/20 bg-coffee-cream/50' 
                : 'hover:bg-coffee-cream/30'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onCafeSelect(cafe)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-coffee-brown group-hover:text-coffee-accent transition-colors">
                    {cafe.name}
                  </CardTitle>
                  {cafe.distance && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="bg-accent/20 text-accent text-xs px-2 py-0.5"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        {formatDistance(cafe.distance)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{Math.ceil(cafe.distance || 0 * 12)} min walk
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs font-medium text-yellow-700">{cafe.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{cafe.address}</span>
              </div>
              
              <p className="text-sm text-foreground/80 line-clamp-2">{cafe.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="bg-coffee-light/50 text-coffee-brown hover:bg-coffee-light/70 transition-colors"
                >
                  {cafe.type}
                </Badge>
                
                {userLocation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDirections(cafe, e)}
                    className="text-coffee-accent hover:text-coffee-brown hover:bg-coffee-accent/10 transition-all duration-200"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CafeList;