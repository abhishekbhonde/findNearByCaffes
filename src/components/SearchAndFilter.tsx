import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  totalCafes: number;
  filteredCount: number;
  userLocation: [number, number] | null;
}

const cafeTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'specialty', label: 'Specialty Coffee' },
  { value: 'irani', label: 'Irani Cafe' },
  { value: 'bakery', label: 'Bakery Cafe' },
  { value: 'chain', label: 'Chain Cafe' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'continental', label: 'Continental' },
  { value: 'art', label: 'Art Cafe' }
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  totalCafes,
  filteredCount,
  userLocation
}) => {
  return (
    <div className="space-y-4 mb-6 animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search cafes by name, description, or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-coffee-light/30 focus:border-coffee-accent transition-all duration-300"
        />
      </div>

      {/* Filter and Stats */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-coffee-light/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cafeTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {userLocation && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Location detected</span>
            </div>
          )}
          <Badge 
            variant="secondary" 
            className="bg-coffee-light/50 text-coffee-brown border-coffee-light/50"
          >
            {filteredCount} of {totalCafes} cafes
          </Badge>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || filterType !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge 
              variant="outline" 
              className="bg-coffee-accent/10 text-coffee-accent border-coffee-accent/30"
            >
              Search: "{searchTerm}"
            </Badge>
          )}
          {filterType !== 'all' && (
            <Badge 
              variant="outline" 
              className="bg-coffee-accent/10 text-coffee-accent border-coffee-accent/30"
            >
              Type: {cafeTypes.find(t => t.value === filterType)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;