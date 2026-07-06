import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useVendorsMap } from '@/hooks/useVendorsMap';

// Fix icônes Leaflet par défaut (bug Vite)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const partnerIcon = new L.DivIcon({
  className: 'custom-partner-marker',
  html: '<div style="background:#B8935B;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const defaultIcon = new L.DivIcon({
  className: 'custom-default-marker',
  html: '<div style="background:#63745A;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.25);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Props {
  category: string;
  region: string | null;
  search: string;
}

const VendorsMap = ({ category, region, search }: Props) => {
  const navigate = useNavigate();
  const { data: vendors = [], isLoading } = useVendorsMap({ category, region, search });

  // Invalider la carte après montage (fix layout)
  useEffect(() => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-editorial-noir/70">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#B8935B] border-2 border-white shadow" />
          Club Mariable
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-wedding-olive border-2 border-white shadow" />
          Prestataire
        </span>
        <span className="ml-auto italic">{vendors.length} prestataires géolocalisés</span>
      </div>
      <div className="h-[600px] w-full rounded-lg overflow-hidden border border-editorial-noir/10">
        <MapContainer
          center={[46.6, 2.5]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vendors.map((v) => (
            <Marker
              key={v.id}
              position={[Number(v.latitude), Number(v.longitude)]}
              icon={v.partner || v.featured ? partnerIcon : defaultIcon}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h4 className="font-serif text-base mb-1">{v.nom}</h4>
                  {v.categorie && (
                    <p className="text-xs text-gray-600 mb-1">{v.categorie}</p>
                  )}
                  {v.ville && <p className="text-xs text-gray-500 mb-2">{v.ville}</p>}
                  <button
                    onClick={() => navigate(`/prestataire/${v.slug || v.id}`)}
                    className="text-xs font-medium text-wedding-olive hover:underline"
                  >
                    Voir la fiche →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default VendorsMap;
