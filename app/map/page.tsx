'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api';
import StationBottomSheet from '../components/StationBottomSheet';
import mapTheme from '../styles/mapTheme.json';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapIcon, FileText, Navigation, User } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

interface Station {
    id: string;
    name: string;
    description: string;
    description2: string;
    coordslatitude: string;
    coordslongitude: string;
    address: string;
    status: string;
    accessTime: string;
    info: string;
    plugCount: string;
    ac: string;
    dcgreaterthan50: string;
}

// Çok daha agresif cluster ayarları
const clusterOptions = {
    gridSize: 150,
    maxZoom: 11,
    minimumClusterSize: 2,
    zoomOnClick: false,
    averageCenter: true,
    imagePath: '/assets/cluster.svg',
    calculator: (markers: google.maps.Marker[], numStyles: number) => {
        const count = markers.length;
        let index = 0;

        if (count < 10) index = 0;
        else if (count < 50) index = 1;
        else if (count < 100) index = 2;
        else index = 3;

        return {
            text: count.toString(),
            index: index,
            title: `${count} istasyon`
        };
    },
    styles: [
        {
            url: '/assets/cluster.svg',
            height: 48,
            width: 48,
            textColor: '#ffffff',
            textSize: 14,
            anchor: [24, 24],
        },
        {
            url: '/assets/cluster.svg',
            height: 56,
            width: 56,
            textColor: '#ffffff',
            textSize: 16,
            anchor: [28, 28],
        },
        {
            url: '/assets/cluster.svg',
            height: 64,
            width: 64,
            textColor: '#ffffff',
            textSize: 18,
            anchor: [32, 32],
        },
        {
            url: '/assets/cluster.svg',
            height: 72,
            width: 72,
            textColor: '#ffffff',
            textSize: 20,
            anchor: [36, 36],
        }
    ]
};

export default function MapPage() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    });

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [stations, setStations] = useState<Station[]>([]);
    const [visibleStations, setVisibleStations] = useState<Station[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 });
    const [zoom, setZoom] = useState(14);
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [markerIcons, setMarkerIcons] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Station[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [loading, setLoading] = useState(true); // Yüklenme durumu
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    // Marker ikonlarını API yüklendikten sonra oluştur
    useEffect(() => {
        if (!isLoaded || !google) return;

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
    }, [isLoaded]);

    // Görünür istasyonları güncelle - daha az istasyon göster
    const updateVisibleStations = useCallback(() => {
        if (!map || !bounds || !stations.length) return;

        const zoom = map.getZoom();
        const maxStations = zoom ? Math.min(200, Math.pow(2, zoom)) : 100;

        const filtered = stations.filter(station => {
            const lat = parseFloat(station.coordslatitude);
            const lng = parseFloat(station.coordslongitude);
            return bounds.contains({ lat, lng });
        });

        // Zoom seviyesine göre maksimum istasyon sayısını sınırla
        setVisibleStations(filtered.slice(0, maxStations));
    }, [map, bounds, stations]);

    // Harita sınırları değiştiğinde
    const onBoundsChanged = useCallback(() => {
        if (!map) return;
        setBounds(map.getBounds() || null);
    }, [map]);

    useEffect(() => {
        if (!bounds) return;
        updateVisibleStations();
    }, [bounds, updateVisibleStations]);

    // Kullanıcı konumu ve istasyonları yükle
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);
                    setCenter(location);
                }
            );
        }

        fetch('https://instatistik.com/lixhium/tum_istasyonlar.php')
            .then(response => response.json())
            .then(data => {
                const processedData = data.map((station: Station) => ({
                    ...station,
                    lat: parseFloat(station.coordslatitude),
                    lng: parseFloat(station.coordslongitude)
                }));
                setStations(processedData);
                setLoading(false); // Yükleme tamamlandığında durumu güncelle
            });
    }, []);

    const getMarkerIcon = useCallback((station: Station) => {
        if (!markerIcons) return null;

        const isSelected = selectedStation?.id === station.id;
        const type = station.description2;
        const isAvailable = station.status === 'Available';

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
    }, [selectedStation, markerIcons]);

    const parseSocketInfo = useCallback((description: string) => {
        const sockets = description.split(',').filter(s => s);
        const socketPowerMap = new Map<number, number>();

        sockets.forEach(socket => {
            const match = socket.match(/(\d+)x(\d+)kW/);
            if (match) {
                const count = parseInt(match[1]);
                const power = parseInt(match[2]);

                const currentCount = socketPowerMap.get(power) || 0;
                socketPowerMap.set(power, currentCount + count);
            }
        });

        return Array.from(socketPowerMap.entries()).map(([power, count]) => ({
            power,
            count
        })).sort((a, b) => b.power - a.power);
    }, []);

    // Arama sonuçlarını filtrele
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const filtered = stations.filter(station =>
            station.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5)); // En fazla 5 sonuç göster
    }, [searchQuery, stations]);

    // Seçilen istasyona git
    const handleStationSelect = (station: Station) => {
        const lat = parseFloat(station.coordslatitude);
        const lng = parseFloat(station.coordslongitude);

        if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
        }

        setSelectedStation(station);
        setIsBottomSheetOpen(true);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    // Dışarı tıklandığında arama sonuçlarını kapat
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const guid = localStorage.getItem('guid');
        if (!guid) {
            router.push('/profil');
        }
    }, [router]);

    useEffect(() => {
        const guid = localStorage.getItem('guid');
        if (guid) {
            fetch('https://instatistik.com/lixhium/getuserprofile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `guid=${guid}`,
            })
                .then(response => response.json())
                .then(data => {
                    const processedData = {
                        ...data,
                        vehiclemodels: Array.isArray(data.vehiclemodels?.[0]) ? data.vehiclemodels[0] : []
                    };
                    console.log('Processed User Data:', processedData); // Debug için
                    setUser(processedData);
                })
                .catch(error => {
                    console.error('Kullanıcı bilgileri alınamadı:', error);
                });
        }
    }, []);

    return (
        <>
            {/* Yüklenme animasyonu */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Google Map */}
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                    options={{
                        styles: mapTheme,
                        zoomControl: true,
                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: false,
                        maxZoom: 20,
                        minZoom: 6,
                        gestureHandling: 'greedy'
                    }}
                    onLoad={setMap}
                    onBoundsChanged={onBoundsChanged}
                    onClick={() => {
                        setIsBottomSheetOpen(false);
                        setSelectedStation(null);
                    }}
                >
                    {map && markerIcons && (
                        <MarkerClusterer options={clusterOptions}>
                            {(clusterer) => (
                                <>
                                    {visibleStations.map((station) => (
                                        <Marker
                                            key={station.id}
                                            position={{
                                                lat: parseFloat(station.coordslatitude),
                                                lng: parseFloat(station.coordslongitude)
                                            }}
                                            icon={getMarkerIcon(station)}
                                            clusterer={clusterer}
                                            onClick={() => {
                                                setSelectedStation(station);
                                                setIsBottomSheetOpen(true);
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </MarkerClusterer>
                    )}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                url: '/assets/user-location.svg',
                                scaledSize: new google.maps.Size(24, 24),
                            }}
                        />
                    )}
                </GoogleMap>
            )}

            <StationBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => {
                    setIsBottomSheetOpen(false);
                    setSelectedStation(null);
                }}
                station={selectedStation}
                parseSocketInfo={parseSocketInfo}
            />

            {/* Üst bar - Drawer ve arama */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-4">
                {/* Drawer Trigger ve Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-12 w-12">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[25vw]" side="left">
                        <SheetHeader>
                            <SheetTitle>
                                <img
                                    src="/assets/Lix Button Circular.png"
                                    alt="Lix"
                                    className="h-12 w-12"
                                />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-8">
                            <Button variant="ghost" className="flex items-center gap-3 justify-start h-12" asChild>
                                <Link href="/map">
                                    <img src="/assets/kesfet_icon.svg" alt="Keşfet" className="h-5 w-5" />
                                    <span>Keşfet</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-3 justify-start h-12" asChild>
                                <Link href="/tarifeler" target="_blank">
                                    <img src="/assets/tarifeler_icon.svg" alt="Tarifeler" className="h-5 w-5" />
                                    <span>Tarifeler</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-3 justify-start h-12" asChild>
                                <Link href="/yol-planlama" target="_blank">
                                    <img src="/assets/planner_icon.svg" alt="Planla" className="h-5 w-5" />
                                    <span>Planla</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-3 justify-start h-12" asChild>
                                <Link href="/profil" target="_blank">
                                    <img src="/assets/profil_icon.svg" alt="Profil" className="h-5 w-5" />
                                    <span>Profil</span>
                                </Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Kullanıcı bilgileri */}
                <Card
                    className="flex items-center gap-3 p-0 cursor-pointer hover:bg-accent transition-colors h-12"
                    onClick={() => router.push('/profil')}
                >
                    <div className="flex items-center gap-3 px-3 h-full">
                        <Avatar className="h-7 w-7">
                            <AvatarImage
                                src={user?.vehiclemodels?.[0]?.image ?
                                    `https://instatistik.com/lixhium/${user.vehiclemodels[0].image}` :
                                    ''}
                                alt="Araç"
                                className="object-contain"
                            />
                            <AvatarFallback>
                                {user?.vehiclemodels?.[0]?.brandname?.[0] || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-medium leading-none">
                                {user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground leading-none mt-1">
                                {user?.vehiclemodels?.[0]?.brandname} {user?.vehiclemodels?.[0]?.name}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Arama çubuğu ve konum butonu */}
                <div ref={searchRef} className="flex items-center w-[40%]">
                    <div className="relative flex-grow">
                        <Card className="p-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="İstasyon ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className="pl-10 rounded-lg border-none h-12 text-lg bg-white"
                                />
                            </div>
                        </Card>
                        {/* Arama sonuçları dropdown'u */}
                        {isSearchFocused && searchResults.length > 0 && (
                            <Card className="absolute top-full left-0 right-0 mt-1 max-h-[300px] overflow-y-auto border-t z-50">
                                {searchResults.map((station) => (
                                    <Button
                                        key={station.id}
                                        variant="ghost"
                                        className="w-full justify-start px-4 py-3 hover:bg-accent"
                                        onClick={() => handleStationSelect(station)}
                                    >
                                        <div className="text-left">
                                            <p className="font-medium">{station.name}</p>
                                            <p className="text-sm text-muted-foreground">{station.address}</p>
                                        </div>
                                    </Button>
                                ))}
                            </Card>
                        )}
                    </div>

                    {/* Konum butonu */}
                    <Button
                        onClick={() => {
                            if (userLocation && map) {
                                map.panTo(userLocation);
                                map.setZoom(15);
                            } else {
                                navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                        const location = {
                                            lat: position.coords.latitude,
                                            lng: position.coords.longitude
                                        };
                                        setUserLocation(location);
                                        if (map) {
                                            map.panTo(location);
                                            map.setZoom(15);
                                        }
                                    },
                                    (error) => {
                                        console.error("Konum alınamadı:", error);
                                    },
                                    {
                                        enableHighAccuracy: true,
                                        timeout: 5000,
                                        maximumAge: 0
                                    }
                                );
                            }
                        }}
                        className="h-12 w-12 rounded-full shadow-lg ml-2 bg-white"
                        variant="secondary"
                    >
                        <Navigation className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </>
    );
} 