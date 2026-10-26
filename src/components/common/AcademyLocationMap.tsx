import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Bus, School, Phone, Clock, Compass } from 'lucide-react';

interface CampusLocation {
  id: string;
  name: string;
  type: 'main' | 'branch' | 'pickup';
  address: string;
  coords: { lat: number; lng: number };
  description: string;
  timings?: string;
  phone?: string;
}

const LOCATIONS: CampusLocation[] = [
  {
    id: 'campus-main',
    name: 'VidyaSetu Academy - Head Office & Main Campus',
    type: 'main',
    address: 'Plot 42, Vidya Vihar Road, Deccan Gymkhana, Pune, Maharashtra 411004',
    coords: { lat: 18.5167, lng: 73.8415 },
    description: 'Classes 8 to 12 Science & Commerce batches, Computer Lab, Doubt Clearing Hall',
    timings: '06:30 AM - 09:30 PM (Mon-Sun)',
    phone: '+91 98220 12345',
  },
  {
    id: 'campus-kothrud',
    name: 'VidyaSetu Kothrud Junior Wing',
    type: 'branch',
    address: 'Near Ideal Colony Ground, Paud Road, Kothrud, Pune 411038',
    coords: { lat: 18.5074, lng: 73.8077 },
    description: 'Classes 1 to 7 Foundation & Olympiad coaching center',
    timings: '07:00 AM - 08:00 PM',
    phone: '+91 98220 12346',
  },
  {
    id: 'campus-fcroad',
    name: 'VidyaSetu Model Colony Faculty Center',
    type: 'branch',
    address: 'Opposite Fergusson College Gate 3, FC Road, Pune 411005',
    coords: { lat: 18.5236, lng: 73.8402 },
    description: 'Faculty Research, Test Evaluation & Parent Counseling Wing',
    timings: '08:00 AM - 08:30 PM',
    phone: '+91 98220 12347',
  },
  {
    id: 'pickup-swargate',
    name: 'Academy Bus Pickup Point 1 (Swargate)',
    type: 'pickup',
    address: 'Swargate Flyover Junction, Pune',
    coords: { lat: 18.5018, lng: 73.8586 },
    description: 'Morning pickup 06:45 AM | Evening drop 06:30 PM',
  },
  {
    id: 'pickup-shivajinagar',
    name: 'Academy Bus Pickup Point 2 (Shivajinagar)',
    type: 'pickup',
    address: 'Near Shivajinagar Railway Station East Gate, Pune',
    coords: { lat: 18.5314, lng: 73.8446 },
    description: 'Morning pickup 07:05 AM | Evening drop 06:45 PM',
  },
];

interface AcademyLocationMapProps {
  heightClass?: string;
  showSelector?: boolean;
}

export const AcademyLocationMap: React.FC<AcademyLocationMapProps> = ({
  heightClass = 'h-[440px]',
  showSelector = true,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(LOCATIONS[0]);
  const [activeType, setActiveType] = useState<'all' | 'campuses' | 'pickups'>('all');

  const apiKey = 'AIzaSyB66YM849Fwu-FaEDru13g5_-jcDDyF23g';

  const filteredLocations = LOCATIONS.filter((loc) => {
    if (activeType === 'campuses') return loc.type === 'main' || loc.type === 'branch';
    if (activeType === 'pickups') return loc.type === 'pickup';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <School className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Institute Campus & Student Commute Map</h3>
            <p className="text-xs text-slate-500">Live Google Maps Platform with campus pins and student pickup routes</p>
          </div>
        </div>

        {showSelector && (
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveType('all')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Locations ({LOCATIONS.length})
            </button>
            <button
              onClick={() => setActiveType('campuses')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeType === 'campuses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campuses (3)
            </button>
            <button
              onClick={() => setActiveType('pickups')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeType === 'pickups' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bus Pickup Points (2)
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Location Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Container */}
        <div className={`lg:col-span-8 relative ${heightClass}`}>
          <APIProvider
            apiKey={apiKey}
            {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
          >
            <Map
              defaultCenter={{ lat: 18.5167, lng: 73.8415 }}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              gestureHandling="cooperative"
              className="w-full h-full"
            >
              {filteredLocations.map((loc) => {
                const isMain = loc.type === 'main';
                const isPickup = loc.type === 'pickup';

                return (
                  <AdvancedMarker
                    key={loc.id}
                    position={loc.coords}
                    onClick={() => setSelectedLocation(loc)}
                    title={loc.name}
                  >
                    <Pin
                      background={isMain ? '#0284c7' : isPickup ? '#f59e0b' : '#059669'}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedLocation && (
                <InfoWindow
                  position={selectedLocation.coords}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2 max-w-xs text-xs">
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-900">
                      {selectedLocation.type === 'main' ? (
                        <School className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      ) : selectedLocation.type === 'pickup' ? (
                        <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span>{selectedLocation.name}</span>
                    </div>
                    <p className="text-slate-600 mb-2 leading-relaxed">{selectedLocation.address}</p>
                    <div className="text-[11px] text-slate-500 mb-2">{selectedLocation.description}</div>
                    {selectedLocation.timings && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{selectedLocation.timings}</span>
                      </div>
                    )}
                    {selectedLocation.phone && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{selectedLocation.phone}</span>
                      </div>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.coords.lat},${selectedLocation.coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 text-white rounded text-[11px] font-medium hover:bg-sky-700 transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Directory Sidebar */}
        <div className="lg:col-span-4 p-4 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto max-h-[440px] bg-slate-50/50 space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Locations & Stops</span>
            <Compass className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2 justify-between">
                  <div className="font-semibold text-xs text-slate-900">{loc.name}</div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      loc.type === 'main'
                        ? 'bg-sky-100 text-sky-700'
                        : loc.type === 'pickup'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {loc.type === 'main' ? 'Main' : loc.type === 'pickup' ? 'Van Route' : 'Branch'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{loc.address}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{loc.timings || 'Daily pickup'}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coords.lat},${loc.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
