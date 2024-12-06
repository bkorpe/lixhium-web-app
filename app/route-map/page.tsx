'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Loader } from "@googlemaps/js-api-loader";
import type { Station } from '../types/station'; // Station tipini map sayfasından alın
import StationBottomSheet from '../components/StationBottomSheet';

// Google Maps API anahtarınızı buraya ekleyin
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

// Polyline decoder fonksiyonu
function decodePolyline(str: string, precision = 5) {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision);

    while (index < str.length) {
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push({
            lat: lat / factor,
            lng: lng / factor
        });
    }

    return coordinates;
}

// Ana bileşeni Suspense ile sarmalayacağımız için ayrı bir bileşen oluşturalım
function RouteMapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mapRef = useRef<HTMLDivElement>(null);
    const [route, setRoute] = useState<any>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [stations, setStations] = useState<Station[]>([]);
    const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
    const [markerIcons, setMarkerIcons] = useState<any>(null);
    const [isStationsLoaded, setIsStationsLoaded] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const initMapRef = useRef<boolean>(false); // Harita başlatma durumunu takip etmek için
    const initAttemptedRef = useRef<boolean>(false);
    const [isSearchingStations, setIsSearchingStations] = useState(false);

    // Tüm bağımlılıkları kontrol eden ve haritayı başlatan useEffect
    useEffect(() => {
        if (!mapsLoaded || !mapRef.current || !isStationsLoaded || initMapRef.current || initAttemptedRef.current) {
            return;
        }

        console.log('All dependencies ready, attempting to initialize map...');
        console.log({
            mapsLoaded,
            hasMapRef: !!mapRef.current,
            isStationsLoaded,
            isInitialized: initMapRef.current
        });

        initAttemptedRef.current = true;
        initMap();
    }, [mapsLoaded, isStationsLoaded]);

    // Google Maps API'yi yükle
    useEffect(() => {
        if (initMapRef.current) return; // Zaten başlatılmışsa çık

        console.log('Loading Google Maps...');
        const loader = new Loader({
            apiKey: GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["geometry"]
        });

        loader.load()
            .then(() => {
                console.log('Google Maps loaded successfully');
                setMapsLoaded(true);
            })
            .catch((error) => {
                console.error("Google Maps yükleme hatası:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // İstasyonları yükle
    useEffect(() => {
        if (isStationsLoaded) return; // Zaten yüklenmişse çık

        console.log('Fetching stations...');
        fetch('https://instatistik.com/lixhium/tum_istasyonlar.php')
            .then(response => response.json())
            .then(data => {
                console.log('Loaded stations:', data.length);
                const processedData = data.map((station: Station) => ({
                    ...station,
                    lat: parseFloat(station.coordslatitude),
                    lng: parseFloat(station.coordslongitude)
                }));
                setStations(processedData);
                setIsStationsLoaded(true);
                console.log('Processed stations:', processedData.length);
            })
            .catch(error => {
                console.error('Error loading stations:', error);
            });
    }, []);

    const initMap = () => {
        if (!mapRef.current || initMapRef.current) {
            console.log('Map initialization skipped:', {
                hasMapRef: !!mapRef.current,
                isInitialized: initMapRef.current
            });
            return;
        }

        console.log('Initializing map...');
        try {
            const mapOptions: google.maps.MapOptions = {
                zoom: 7,
                center: { lat: 39.9334, lng: 32.8597 },
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
            };

            const newMap = new google.maps.Map(mapRef.current, mapOptions);
            console.log('Map initialized successfully');
            setMap(newMap);
            initMapRef.current = true;
        } catch (error) {
            console.error('Error initializing map:', error);
            initMapRef.current = false; // Hata durumunda tekrar denenmesine izin ver
        }
    };

    // Rotayı çek ve çiz - istasyonlar yüklendiğinde
    useEffect(() => {
        if (!map || !isStationsLoaded) return;
        console.log('Map and stations ready, fetching route...');
        fetchRoute();
    }, [map, isStationsLoaded]);

    const fetchRoute = async () => {
        console.log('Fetching route...');

        const startPoint = searchParams.get('startPoint');
        const endPoint = searchParams.get('endPoint');

        if (!startPoint || !endPoint) return;

        try {
            const response = await fetch(
                `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startPoint};${endPoint}?overview=full&geometries=polyline&steps=true`
            );
            const data = await response.json();
            console.log('Rota verisi:', data);

            if (data.routes && data.routes.length > 0) {
                setRoute(data.routes[0]);
                drawRoute(data.routes[0]);

                // Başlangıç ve bitiş noktalarını işaretle
                const startCoords = {
                    lat: parseFloat(startPoint.split(',')[1]),
                    lng: parseFloat(startPoint.split(',')[0])
                };
                const endCoords = {
                    lat: parseFloat(endPoint.split(',')[1]),
                    lng: parseFloat(endPoint.split(',')[0])
                };

                // Başlangıç noktası
                addMarker(startCoords, 'Başlangıç', {
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    }
                });

                // Bitiş noktası
                addMarker(endCoords, 'Bitiş', {
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    }
                });
            }
        } catch (error) {
            console.error('Rota çizme hatası:', error);
        }
    };

    const addMarker = (position: google.maps.LatLngLiteral, title: string, options: google.maps.MarkerOptions = {}) => {
        if (!map) return;

        return new google.maps.Marker({
            position,
            map,
            title,

            ...options
        });
    };

    // Marker ikonlarını yükle
    useEffect(() => {
        if (!mapsLoaded || !map) return;

        setMarkerIcons({
            AC_MUSAIT_SELECTED: {
                url: '/assets/AC_MUSAIT_SELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            AC_MUSAIT_UNSELECTED: {
                url: '/assets/AC_MUSAIT_UNSELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            DC_MUSAIT_SELECTED: {
                url: '/assets/DC_MUSAIT_SELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            DC_MUSAIT_UNSELECTED: {
                url: '/assets/DC_MUSAIT_UNSELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            AC_SELECTED: {
                url: '/assets/AC_SELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            AC_UNSELECTED: {
                url: '/assets/AC_UNSELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            DC_SELECTED: {
                url: '/assets/DC_SELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            },
            DC_UNSELECTED: {
                url: '/assets/DC_UNSELECTED.svg',
                scaledSize: new google.maps.Size(38, 45),
                anchor: new google.maps.Point(19, 45),
            }
        });
    }, [mapsLoaded, map]);

    // Rota üzerindeki ve yakınındaki istasyonları bul
    const findNearbyStations = async (path: google.maps.LatLngLiteral[]) => {
        if (!stations.length) {
            console.log('No stations available');
            return;
        }

        console.log('Finding nearby stations...');
        setIsSearchingStations(true);

        // Küçük bir gecikme ekleyelim ki overlay görünsün
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const nearbyStations = stations.filter(station => {
                const stationLatLng = new google.maps.LatLng(
                    parseFloat(station.coordslatitude),
                    parseFloat(station.coordslongitude)
                );

                return path.some(point => {
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(
                        stationLatLng,
                        new google.maps.LatLng(point.lat, point.lng)
                    );
                    return distance <= 500;
                });
            });

            console.log('Found nearby stations:', nearbyStations.length);
            setNearbyStations(nearbyStations);
        } finally {
            setIsSearchingStations(false);
        }
    };

    const getMarkerIcon = (station: Station) => {
        if (!markerIcons) return null;

        const type = station.description2;
        const isAvailable = station.status === 'Available';
        const isSelected = selectedStation?.id === station.id;

        if (type === 'DC') {
            if (isAvailable) {
                return isSelected ? markerIcons.DC_MUSAIT_SELECTED : markerIcons.DC_MUSAIT_UNSELECTED;
            } else {
                return isSelected ? markerIcons.DC_SELECTED : markerIcons.DC_UNSELECTED;
            }
        } else {
            if (isAvailable) {
                return isSelected ? markerIcons.AC_MUSAIT_SELECTED : markerIcons.AC_MUSAIT_UNSELECTED;
            } else {
                return isSelected ? markerIcons.AC_SELECTED : markerIcons.AC_UNSELECTED;
            }
        }
    };

    // Marker'ları ve referanslarını tutmak için bir Map kullanalım
    const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

    // Marker'ları temizleme fonksiyonu
    const clearMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current.clear();
    };

    // Tek bir marker'ın ikonunu güncelle
    const updateMarkerIcon = (stationId: string) => {
        const marker = markersRef.current.get(stationId);
        if (marker) {
            const station = nearbyStations.find(s => s.id === stationId);
            if (station) {
                marker.setIcon(getMarkerIcon(station));
            }
        }
    };

    // nearbyStations değiştiğinde marker'ları güncelle
    useEffect(() => {
        if (!map || !markerIcons || !nearbyStations.length) return;

        console.log('Creating markers for nearby stations:', nearbyStations.length);

        // Önceki marker'ları temizle
        clearMarkers();

        // Yeni marker'ları oluştur
        nearbyStations.forEach(station => {
            const marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(station.coordslatitude),
                    lng: parseFloat(station.coordslongitude)
                },
                map: map,
                icon: getMarkerIcon(station),
                title: station.name,
                clickable: true
            });

            // Marker'a tıklama olayı ekle
            marker.addListener('click', () => {
                // Önceki seçili marker'ı güncelle
                if (selectedStation) {
                    updateMarkerIcon(selectedStation.id);
                }

                setSelectedStation(station);
                setIsBottomSheetOpen(true);

                // Yeni seçili marker'ı güncelle
                updateMarkerIcon(station.id);
            });

            // Marker'ı referansa ekle
            markersRef.current.set(station.id, marker);
        });
    }, [map, markerIcons, nearbyStations]); // selectedStation'ı dependency array'den çıkardık

    // Seçili istasyon değiştiğinde sadece ilgili marker'ları güncelle
    useEffect(() => {
        if (!selectedStation || !markersRef.current.size) return;

        // Önceki seçili marker'ı güncelle (varsa)
        const previousSelectedId = selectedStation.id;
        if (previousSelectedId) {
            updateMarkerIcon(previousSelectedId);
        }
    }, [selectedStation]);

    // drawRoute fonksiyonunu güncelle
    const drawRoute = (routeData: any) => {
        if (!map) return;

        // Mevcut rotayı temizle
        map.data.forEach((feature: google.maps.Data.Feature) => {
            map.data.remove(feature);
        });

        // Marker'ları temizle
        clearMarkers();

        // Polyline'ı decode et
        const decodedPath = decodePolyline(routeData.geometry);

        // Rotayı çiz
        const polyline = new google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: '#4A90E2',
            strokeOpacity: 1.0,
            strokeWeight: 6,
            map: map
        });

        // Yakındaki istasyonları bul
        findNearbyStations(decodedPath);

        // Haritayı rota sınırlarına göre ayarla
        const bounds = new google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);
    };

    // parseSocketInfo fonksiyonunu ekle
    const parseSocketInfo = (description: string) => {
        if (!description) return [];
        const sockets = description.trim().replace(/,+$/, '').split(',').filter(Boolean);
        const socketPowerMap = new Map<number, number>();

        sockets.forEach(socket => {
            const match = socket.trim().match(/(\d+)x(\d+)\s*kW/i);
            if (match) {
                const count = parseInt(match[1]);
                const power = parseInt(match[2]);
                const currentCount = socketPowerMap.get(power) || 0;
                socketPowerMap.set(power, currentCount + count);
            }
        });

        return Array.from(socketPowerMap.entries())
            .map(([power, count]) => ({
                power,
                count
            }))
            .sort((a, b) => b.power - a.power);
    };

    if (loading || !isStationsLoaded) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">
                        {!isStationsLoaded ? 'İstasyonlar yükleniyor...' : 'Harita yükleniyor...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="p-4 flex items-center gap-4 bg-white shadow-sm z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-semibold">Rota Detayları</h1>
            </div>
            <main className="flex-1 relative">
                <div
                    ref={mapRef}
                    id="map"
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "#f0f0f0"
                    }}
                />

                {isSearchingStations && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white/90 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                            <p className="text-sm font-medium">Yakındaki istasyonlar aranıyor</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Sheet ekle */}
            <StationBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setIsBottomSheetOpen(false);
                    setSelectedStation(null);
                }}
                station={selectedStation}
                parseSocketInfo={parseSocketInfo}
            />
        </div>
    );
}

// Ana bileşen
export default function RouteMap() {
    return (
        <Suspense
            fallback={
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4">Yükleniyor...</p>
                    </div>
                </div>
            }
        >
            <RouteMapContent />
        </Suspense>
    );
} 