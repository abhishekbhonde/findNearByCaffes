import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, Map } from 'lucide-react';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-coffee-brown rounded-full flex items-center justify-center">
            <Map className="w-8 h-8 text-coffee-cream" />
          </div>
          <CardTitle className="text-2xl text-coffee-brown">Find Nearby Cafes</CardTitle>
          <p className="text-muted-foreground">Enter your Mapbox token to get started</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Mapbox Public Token</Label>
              <Input
                id="token"
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-coffee-brown hover:bg-coffee-brown/90"
              disabled={!token.trim()}
            >
              Launch Map
            </Button>
          </form>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have a Mapbox token?
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Free Token from Mapbox
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxTokenInput;