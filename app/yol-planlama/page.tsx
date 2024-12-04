'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, Navigation2, Search, MapPin } from "lucide-react";
import type { User } from '../types/user';
import type { VehicleModel } from '../types/vehicle';
import type { LocationFeature, LocationResponse } from '../types/location';
import { cn } from "@/lib/utils";

export default function RoutePlanning() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [startLocation, setStartLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
    const [endLocation, setEndLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
    const [primaryVehicle, setPrimaryVehicle] = useState<VehicleModel | null>(null);
    const [startCharge, setStartCharge] = useState(100);
    const [endCharge, setEndCharge] = useState(20);
    const [startResults, setStartResults] = useState<LocationFeature[]>([]);
    const [endResults, setEndResults] = useState<LocationFeature[]>([]);
    const [showStartResults, setShowStartResults] = useState(false);
    const [showEndResults, setShowEndResults] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    // Adres formatlamak için yardımcı fonksiyon
    const formatAddress = (feature: LocationFeature) => {
        const props = feature.properties;
        const parts = [
            props.name,
            props.street,
            props.city,
            props.state,
            props.country
        ].filter(Boolean);
        return parts.join(', ');
    };

    // Başlangıç konumu için arama
    const handleStartLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStartLocation({ name: value, lat: 0, lng: 0 });

        if (!value.trim()) {
            setStartResults([]);
            setShowStartResults(false);
            return;
        }

        try {
            const response = await fetch(
                `/api/search-location?q=${encodeURIComponent(value)}`
            );
            const data: LocationResponse = await response.json();
            setStartResults(data.features);
            setShowStartResults(true);
        } catch (error) {
            console.error('Arama hatası:', error);
        }
    };

    // Bitiş konumu için arama
    const handleEndLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEndLocation({ name: value, lat: 0, lng: 0 });

        if (!value.trim()) {
            setEndResults([]);
            setShowEndResults(false);
            return;
        }

        try {
            const response = await fetch(
                `/api/search-location?q=${encodeURIComponent(value)}`
            );
            const data: LocationResponse = await response.json();
            setEndResults(data.features);
            setShowEndResults(true);
        } catch (error) {
            console.error('Arama hatası:', error);
        }
    };

    // Başlangıç konumu seçimi
    const handleStartLocationSelect = (feature: LocationFeature) => {
        setStartLocation({
            name: formatAddress(feature),
            lat: feature.geometry.coordinates[1], // API'den gelen koordinatlar [lng, lat] şeklinde
            lng: feature.geometry.coordinates[0]
        });
        setShowStartResults(false);
    };

    // Bitiş konumu seçimi
    const handleEndLocationSelect = (feature: LocationFeature) => {
        setEndLocation({
            name: formatAddress(feature),
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0]
        });
        setShowEndResults(false);
    };

    // Kullanıcı bilgilerini çek
    useEffect(() => {
        const checkAuth = async () => {
            const guid = localStorage.getItem('guid');
            if (!guid) {
                router.push('/login');
                return;
            }
            try {
                await fetchUserProfile(guid);
            } catch (error) {
                console.error('Kullanıcı bilgileri alınamadı:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const fetchUserProfile = async (guid: string) => {
        try {
            const response = await fetch('https://instatistik.com/lixhium/getuserprofile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `guid=${guid}`,
            });

            if (response.ok) {
                const data = await response.json();
                const vehicles = data.vehiclemodels?.[0] || [];

                const userData = {
                    ...data,
                    vehiclemodels: Array.isArray(vehicles) ? vehicles : []
                };

                setUser(userData);

                // Birincil aracı bul
                if (Array.isArray(vehicles) && vehicles.length > 0) {
                    const primary = vehicles.find((v: VehicleModel) => v.primary === "1");
                    if (primary) {
                        setPrimaryVehicle(primary);
                    } else {
                        setPrimaryVehicle(vehicles[0]);
                    }
                }
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            throw error;
        }
    };

    const handleVehicleSelect = (vehicle: VehicleModel) => {
        setPrimaryVehicle(vehicle);
    };

    // Minimum varış şarjını 50 ile sınırla
    const handleEndChargeChange = (value: number[]) => {
        setEndCharge(Math.min(value[0], 50));
    };

    const handleRouteCalculate = () => {
        if (!startLocation || !endLocation || !primaryVehicle) return;

        // URL'leri oluştur
        const startPoint = `${startLocation.lng},${startLocation.lat}`;
        const endPoint = `${endLocation.lng},${endLocation.lat}`;

        // Route parametrelerini oluştur
        const routeParams = {
            startPoint,
            endPoint,
            startCharge,
            endCharge,
            vehicleId: primaryVehicle.id,
            vehicleRange: primaryVehicle.WLTP_menzil
        };

        // Parametreleri URL'e ekle
        const queryString = new URLSearchParams(routeParams as any).toString();

        // Yeni sayfaya yönlendir
        router.push(`/route-map?${queryString}`);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Tarayıcınız konum özelliğini desteklemiyor.');
            return;
        }

        setGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Koordinatları adrese çevir
                    const response = await fetch(
                        `/api/reverse-geocode?lat=${latitude}&lng=${longitude}`
                    );
                    const data = await response.json();

                    if (data.features && data.features.length > 0) {
                        const location = data.features[0];
                        setStartLocation({
                            name: formatAddress(location),
                            lat: latitude,
                            lng: longitude
                        });
                    }
                } catch (error) {
                    console.error('Konum çözümleme hatası:', error);
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                console.error('Konum alma hatası:', error);
                setGettingLocation(false);
                alert('Konumunuz alınamadı. Lütfen konum izinlerini kontrol edin.');
            }
        );
    };

    return (
        <div className="container mx-auto p-4 space-y-6 max-w-4xl">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.close()}
                            className="hover:bg-accent"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Yol Planlama</h1>
                    </div>
                    <p className="text-muted-foreground">Rotanızı planlayın ve şarj noktalarını görün</p>
                </div>
            </div>

            {/* Ana Kart */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Konum Girişleri */}
                    <div className="space-y-4">
                        {/* Başlangıç Konumu */}
                        <div className="space-y-2 relative">
                            <Label htmlFor="start">Başlangıç Konumu</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="start"
                                    placeholder="Nereden?"
                                    value={startLocation?.name || ''}
                                    onChange={handleStartLocationChange}
                                    onFocus={() => setShowStartResults(true)}
                                    className="h-12"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 shrink-0"
                                    onClick={getCurrentLocation}
                                    disabled={gettingLocation}
                                >
                                    <MapPin className={cn(
                                        "h-5 w-5",
                                        gettingLocation && "animate-pulse"
                                    )} />
                                </Button>
                            </div>
                            {/* Başlangıç Konumu Sonuçları */}
                            {showStartResults && startResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                                    <div className="py-1">
                                        {startResults.map((result, index) => (
                                            <div
                                                key={`start-${index}`}
                                                className="px-4 py-2 hover:bg-accent cursor-pointer"
                                                onClick={() => handleStartLocationSelect(result)}
                                            >
                                                <p className="font-medium">{result.properties.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatAddress(result)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bitiş Konumu */}
                        <div className="space-y-2 relative">
                            <Label htmlFor="end">Bitiş Konumu</Label>
                            <Input
                                id="end"
                                placeholder="Nereye?"
                                value={endLocation?.name || ''}
                                onChange={handleEndLocationChange}
                                onFocus={() => setShowEndResults(true)}
                                className="h-12"
                            />
                            {/* Bitiş Konumu Sonuçları */}
                            {showEndResults && endResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                                    <div className="py-1">
                                        {endResults.map((result, index) => (
                                            <div
                                                key={`end-${index}`}
                                                className="px-4 py-2 hover:bg-accent cursor-pointer"
                                                onClick={() => handleEndLocationSelect(result)}
                                            >
                                                <p className="font-medium">{result.properties.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatAddress(result)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Araç Seçimi ve Şarj Durumu */}
                    {primaryVehicle && user?.vehiclemodels && (
                        <div className="bg-accent/50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Seçili Araç</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            Araç Değiştir
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[300px]">
                                        {user.vehiclemodels.map((vehicle, index) => (
                                            <DropdownMenuItem
                                                key={`${vehicle.id}-${index}`}
                                                onClick={() => handleVehicleSelect(vehicle)}
                                                className="flex items-center gap-3 p-3"
                                            >
                                                {vehicle.image && (
                                                    <img
                                                        src={`https://instatistik.com/lixhium/${vehicle.image}`}
                                                        alt={vehicle.name}
                                                        className="w-10 h-10 object-contain bg-white rounded-md"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {vehicle.brandname} {vehicle.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {vehicle.plate}
                                                    </p>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Araç Detayları */}
                            <div className="flex items-center gap-4">
                                {primaryVehicle.image && (
                                    <img
                                        src={`https://instatistik.com/lixhium/${primaryVehicle.image}`}
                                        alt={`${primaryVehicle.brandname} ${primaryVehicle.name}`}
                                        className="w-16 h-16 object-contain rounded-md bg-white"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {primaryVehicle.brandname} {primaryVehicle.name}
                                    </p>
                                    {primaryVehicle.plate && (
                                        <p className="text-sm text-muted-foreground">
                                            {primaryVehicle.plate}
                                        </p>
                                    )}
                                    {primaryVehicle.WLTP_menzil && (
                                        <p className="text-sm text-muted-foreground">
                                            Menzil: {primaryVehicle.WLTP_menzil} km
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Şarj Seviyeleri */}
                            <div className="space-y-6 pt-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Başlangıç Şarj Seviyesi</Label>
                                        <span className="text-sm font-medium">%{startCharge}</span>
                                    </div>
                                    <Slider
                                        value={[startCharge]}
                                        onValueChange={(value) => setStartCharge(value[0])}
                                        max={100}
                                        min={0}
                                        step={1}
                                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Minimum Varış Şarjı</Label>
                                        <span className="text-sm font-medium">%{endCharge}</span>
                                    </div>
                                    <Slider
                                        value={[endCharge]}
                                        onValueChange={handleEndChargeChange}
                                        max={100}
                                        min={0}
                                        step={1}
                                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Maximum %50 seçilebilir
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rota Hesapla Butonu */}
                    <Button
                        className="w-full h-12 text-lg gap-2"
                        disabled={!startLocation || !endLocation || !primaryVehicle}
                        onClick={handleRouteCalculate}
                    >
                        <Navigation2 className="h-5 w-5" />
                        Rota Hesapla
                    </Button>
                </CardContent>
            </Card>
        </div >
    );
} 