import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/hooks/use-toast';

export interface Cafe {
  id: number;
  name: string;
  coordinates: [number, number];
  address: string;
  description: string;
  rating: number;
  type: string;
}

interface MapProps {
  cafes: Cafe[];
  selectedCafe?: Cafe | null;
  onCafeSelect: (cafe: Cafe) => void;
  mapboxToken: string;
  onUserLocationChange?: (location: [number, number] | null) => void;
}

const Map: React.FC<MapProps> = ({
  cafes,
  selectedCafe,
  onCafeSelect,
  mapboxToken,
  onUserLocationChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const cafeMarkers = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Default: Pune
  const defaultLocation: [number, number] = [73.8567, 18.5204];

  /** Initialize map ONCE */
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: defaultLocation,
      zoom: 12,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
          setUserLocation(coords);
          onUserLocationChange?.(coords);

          if (map.current) {
            map.current.setCenter(coords);

            const el = document.createElement('div');
            el.className = 'user-location-marker';
            el.style.cssText = `
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: hsl(var(--accent));
              border: 3px solid white;
              box-shadow: var(--shadow-marker);
            `;

            userMarker.current = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  '<div class="font-medium">Your Location</div>'
                )
              )
              .addTo(map.current);
          }

          toast({
            title: 'Location Found',
            description: 'Map centered on your current location',
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
          toast({
            title: 'Location Access Denied',
            description: 'Using Pune as default location',
          });
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onUserLocationChange]);

  /** Update cafe markers when cafes change */
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    cafeMarkers.current.forEach((m) => m.remove());
    cafeMarkers.current = [];

    cafes.forEach((cafe) => {
      const el = document.createElement('div');
      el.className = 'cafe-marker';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: hsl(var(--coffee-brown));
        border: 2px solid white;
        box-shadow: var(--shadow-marker);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.3s ease;
      `;
      el.innerHTML = '☕';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.background = 'hsl(var(--coffee-accent))';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.background = 'hsl(var(--coffee-brown))';
      });

      const popupContent = `
        <div class="p-2 min-w-48">
          <h3 class="font-bold text-coffee-brown mb-1">${cafe.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">${cafe.address}</p>
          <p class="text-xs mb-2">${cafe.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs bg-coffee-light px-2 py-1 rounded">${cafe.type}</span>
            <div class="flex items-center">
              <span class="text-yellow-500">★</span>
              <span class="text-xs ml-1">${cafe.rating}</span>
            </div>
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(cafe.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current);

      el.addEventListener('click', () => onCafeSelect(cafe));

      cafeMarkers.current.push(marker);
    });
  }, [cafes, onCafeSelect]);

  /** Fly to selected cafe */
  useEffect(() => {
    if (selectedCafe && map.current) {
      map.current.flyTo({
        center: selectedCafe.coordinates,
        zoom: 15,
        duration: 1000,
      });
    }
  }, [selectedCafe]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
};

export default Map;
