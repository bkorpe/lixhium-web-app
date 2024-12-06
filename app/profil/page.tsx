'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, LogOut, LogIn, KeyRound, ChevronLeft, MapIcon, FileText, Navigation, Edit, Menu, Plus, Trash2, User as UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import Link from 'next/link';
import type { User } from '../types/user';
import type { VehicleModel } from '../types/vehicle';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function Profil() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
    const [editForm, setEditForm] = useState({
        name: '',
        mail: ''
    });
    const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
    const [brands, setBrands] = useState<Array<{ id: string, name: string, image: string }>>([]);
    const [selectedBrand, setSelectedBrand] = useState<{ id: string, name: string, image: string } | null>(null);
    const [models, setModels] = useState<Array<{ id: string, name: string, image: string }>>([]);
    const [selectedModel, setSelectedModel] = useState<{ id: string, name: string, image: string } | null>(null);
    const [plate, setPlate] = useState('');
    const [step, setStep] = useState(1); // 1: Marka, 2: Model, 3: Plaka

    const handleVehicleSelect = (index: number) => {
        setSelectedVehicleIndex(index);
    };

    const setAuthCookieAndStorage = (guid: string) => {
        // 30 günlük süre
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        // Cookie'yi ayarla
        document.cookie = `guid=${guid}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Strict`;

        // localStorage'a guid ve süre bilgisini kaydet
        localStorage.setItem('guid', guid);
        localStorage.setItem('guidExpires', expirationDate.toISOString());
    };

    const checkAuthExpiration = () => {
        const guid = localStorage.getItem('guid');
        const expirationDate = localStorage.getItem('guidExpires');

        if (guid && expirationDate) {
            // Süre dolmuş mu kontrol et
            if (new Date(expirationDate) < new Date()) {
                // Süresi dolmuşsa çıkış yap
                handleLogout();
                return false;
            }
            return true;
        }
        return false;
    };

    useEffect(() => {
        const checkAuth = async () => {
            // Oturum süresi kontrolü
            if (!checkAuthExpiration()) {
                router.push('/login');
                return;
            }

            const guid = localStorage.getItem('guid');
            if (!guid) {
                router.push('/login');
                return;
            }

            try {
                await fetchUserProfile(guid);
            } catch (error) {
                console.error('Kullanıcı bilgileri alınamadı:', error);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (user && user.vehiclemodels && user.vehiclemodels.length > 0) {
            const primaryIndex = user.vehiclemodels.findIndex(v => v.primary === "1");
            setSelectedVehicleIndex(primaryIndex !== -1 ? primaryIndex : 0);
        }
    }, [user]);

    useEffect(() => {
        if (user && isDialogOpen) {
            setEditForm({
                name: user.name,
                mail: user.mail
            });
        }
    }, [isDialogOpen, user]);

    const fetchUserProfile = async (guid: string) => {
        const response = await fetch('https://instatistik.com/lixhium/getuserprofile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `guid=${guid}`,
        });

        if (response.ok) {
            const data = await response.json();
            const processedVehicles = data.vehiclemodels?.[0] || [];

            const userData = {
                ...data,
                vehiclemodels: Array.isArray(processedVehicles) ? processedVehicles : [],
                billingAddres: data.billingAddres?.[0] || []
            };

            setUser(userData);
        } else {
            throw new Error('Kullanıcı bilgileri alınamadı');
        }
    };

    const handleUpdateUser = async () => {
        try {
            const guid = localStorage.getItem('guid');
            if (!guid || !user) return;

            const response = await fetch('https://instatistik.com/lixhium/updateuser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userguid: guid,
                    name: editForm.name,
                    phonecode: user.phonecode,
                    phone: user.phone,
                    mail: editForm.mail,
                }).toString()
            });

            if (response.ok) {
                await fetchUserProfile(guid);
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error('Güncelleme hatası:', error);
        }
    };

    const handleLogout = () => {
        // Cookie'yi sil
        document.cookie = 'guid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // localStorage'ı temizle
        localStorage.removeItem('guid');
        localStorage.removeItem('guidExpires');

        router.push('/login');
    };

    const handleDeleteVehicle = async (uvmid: string) => {
        try {
            const response = await fetch('https://instatistik.com/lixhium/deletevehicle.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${uvmid}`,
            });

            if (response.ok) {
                // Silme başarılı olduğunda kullanıcı bilgilerini yeniden yükle
                const guid = localStorage.getItem('guid');
                if (guid) {
                    await fetchUserProfile(guid);
                }

                // Eğer silinen araç seçili araçsa ve başka araçlar varsa, ilk aracı seç
                if (selectedVehicle?.uvmid === uvmid && Array.isArray(user?.vehiclemodels) && user.vehiclemodels.length > 1) {
                    setSelectedVehicleIndex(0);
                }
            } else {
                throw new Error('Araç silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Araç silme hatası:', error);
        }
    };

    // Markaları getiren fonksiyon
    const fetchBrands = async () => {
        try {
            const response = await fetch('https://instatistik.com/lixhium/getvehiclebrands.php');
            if (response.ok) {
                const data = await response.json();
                setBrands(data);
            }
        } catch (error) {
            console.error('Markalar yüklenirken hata:', error);
        }
    };

    // Modelleri getiren fonksiyon
    const fetchModels = async (brandId: string) => {
        try {
            const response = await fetch(`https://instatistik.com/lixhium/getvehiclemodels.php?vehiclebrandsid=${brandId}`);
            if (response.ok) {
                const data = await response.json();
                setModels(data);
            }
        } catch (error) {
            console.error('Modeller yüklenirken hata:', error);
        }
    };

    // Araç ekleme fonksiyonu
    const handleAddVehicle = async () => {
        if (!selectedModel || !plate) return;

        const guid = localStorage.getItem('guid');
        if (!guid) return;

        try {
            const response = await fetch('https://instatistik.com/lixhium/adduservehicle.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `userguid=${guid}&vehiclemodelsid=${selectedModel.id}&plate=${plate}`,
            });

            if (response.ok) {
                // Araç ekleme başarılı
                await fetchUserProfile(guid);
                handleCloseAddVehicle();
            }
        } catch (error) {
            console.error('Araç eklenirken hata:', error);
        }
    };

    // Dialog'u kapatma ve state'leri sıfırlama
    const handleCloseAddVehicle = () => {
        setIsAddVehicleOpen(false);
        setSelectedBrand(null);
        setSelectedModel(null);
        setPlate('');
        setStep(1);
    };

    // Dialog açıldığında markaları yükle
    useEffect(() => {
        if (isAddVehicleOpen && step === 1) {
            fetchBrands();
        }
    }, [isAddVehicleOpen]);

    // Marka seçildiğinde modelleri yükle
    useEffect(() => {
        if (selectedBrand) {
            fetchModels(selectedBrand.id);
        }
    }, [selectedBrand]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-12 w-[250px]" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const selectedVehicle = user.vehiclemodels[selectedVehicleIndex];

    return (
        <div className="container mx-auto p-4 space-y-6 max-w-4xl">
            {/* Başlık ve Geri Butonu */}
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
                        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
                    </div>
                    <p className="text-muted-foreground">Hesap bilgilerinizi görüntüleyin ve yönetin</p>
                </div>

            </div>

            {/* Profil Bilgileri */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Bilgilerim</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Profil Bilgilerini Düzenle</DialogTitle>
                                <DialogDescription>
                                    İsim ve e-posta bilgilerinizi güncelleyebilirsiniz.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">İsim</Label>
                                    <Input
                                        id="name"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mail">E-posta</Label>
                                    <Input
                                        id="mail"
                                        type="email"
                                        value={editForm.mail}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            mail: e.target.value
                                        }))}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    İptal
                                </Button>
                                <Button onClick={handleUpdateUser}>
                                    Kaydet
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>İsim</Label>
                            <p className="text-lg font-medium">{user.name}</p>
                        </div>
                        <div>
                            <Label>Telefon</Label>
                            <p className="text-lg font-medium">{user.phonecode} {user.phone}</p>
                        </div>
                        <div>
                            <Label>E-posta</Label>
                            <p className="text-lg font-medium">{user.mail}</p>
                        </div>
                        {/* <div className='flex flex-row items-center'>
                            <Label>Üyelik Durumu</Label>
                            <div className='pl-2'>
                                <Badge
                                    variant={user.lixhium_pro === '1' ? "default" : "secondary"}
                                    className="mt-1"
                                >
                                    {user.lixhium_pro === '1' ? 'Lixhium Pro' : 'Standart Üye'}
                                </Badge>
                            </div>

                        </div> */}
                    </div>
                </CardContent>
            </Card>

            {/* Araç Bilgileri */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Araçlarım</CardTitle>
                    {user.vehiclemodels.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsAddVehicleOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[300px]">
                                    {user.vehiclemodels.map((vehicle, index) => (
                                        <DropdownMenuItem
                                            key={`${vehicle.id}-${index}`}
                                            className="flex items-center space-x-3 p-3"
                                        >
                                            <div
                                                className="flex-1 flex items-center space-x-3 cursor-pointer"
                                                onClick={() => handleVehicleSelect(index)}
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={vehicle.image ? `https://instatistik.com/lixhium/${vehicle.image}` : ''}
                                                        alt={vehicle.name}
                                                        className="object-contain"
                                                    />
                                                    <AvatarFallback>{vehicle.brandname[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-medium">{vehicle.brandname} {vehicle.name}</p>
                                                    <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                                                </div>
                                                {vehicle.primary === "1" && (
                                                    <Badge variant="secondary">Birincil</Badge>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteVehicle(vehicle.uvmid);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setIsAddVehicleOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Araç Ekle
                        </Button>
                    )}
                </CardHeader>
                {selectedVehicle ? (
                    <CardContent>
                        <div className="flex items-start space-x-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={selectedVehicle.image ?
                                        `https://instatistik.com/lixhium/${selectedVehicle.image}` : ''
                                    }
                                    alt={selectedVehicle.name}
                                    className="object-contain"
                                />
                                <AvatarFallback className="text-2xl">
                                    {selectedVehicle.brandname[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                        {selectedVehicle.brandname} {selectedVehicle.name}
                                    </h3>
                                    {selectedVehicle.primary === "1" && (
                                        <Badge>Birincil Araç</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground">{selectedVehicle.plate}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {selectedVehicle.bataryakapasitesi && (
                                        <div>
                                            <Label>Batarya Kapasitesi</Label>
                                            <p className="text-lg font-medium">
                                                {selectedVehicle.bataryakapasitesi} kWh
                                            </p>
                                        </div>
                                    )}
                                    {selectedVehicle.maxsarjhizi && (
                                        <div>
                                            <Label>Max Şarj Hızı</Label>
                                            <p className="text-lg font-medium">
                                                {selectedVehicle.maxsarjhizi} kW
                                            </p>
                                        </div>
                                    )}
                                    {selectedVehicle.WLTP_menzil && (
                                        <div>
                                            <Label>WLTP Menzil</Label>
                                            <p className="text-lg font-medium">
                                                {selectedVehicle.WLTP_menzil} km
                                            </p>
                                        </div>
                                    )}
                                    {selectedVehicle.menzil100 && (
                                        <div>
                                            <Label>100 km Tüketim</Label>
                                            <p className="text-lg font-medium">
                                                {selectedVehicle.menzil100} kWh
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="text-center py-8 text-muted-foreground">
                        Henüz araç eklenmemiş.
                    </CardContent>
                )}
            </Card>

            <div className="flex justify-end">
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                </Button>
            </div>

            {/* Araç Ekleme Dialog'u */}
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogContent className="max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>
                            {step === 1 ? 'Marka Seçin' :
                                step === 2 ? 'Model Seçin' :
                                    'Plaka Girin'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                {brands.map((brand) => (
                                    <Button
                                        key={brand.id}
                                        variant="outline"
                                        className={`min-h-[100px] p-3 flex flex-col items-center gap-2 ${selectedBrand?.id === brand.id ? 'border-primary' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedBrand(brand);
                                            setStep(2);
                                        }}
                                    >
                                        <img
                                            src={`https://instatistik.com/lixhium/${brand.image}`}
                                            alt={brand.name}
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span className="text-sm font-medium text-center">
                                            {brand.name}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                {models.map((model) => (
                                    <Button
                                        key={model.id}
                                        variant="outline"
                                        className={`min-h-[120px] p-3 flex flex-col items-center ${selectedModel?.id === model.id ? 'border-primary' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedModel(model);
                                            setStep(3);
                                        }}
                                    >
                                        <div className="flex-1 flex flex-col items-center justify-between h-full">
                                            <img
                                                src={`https://instatistik.com/lixhium/${model.image}`}
                                                alt={model.name}
                                                className="h-16 w-16 object-contain mb-2"
                                            />
                                            <div className="w-full">
                                                <span
                                                    className="text-sm font-medium text-center block overflow-hidden text-ellipsis whitespace-normal"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2, // Maksimum 2 satır gösterir
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {model.name}
                                                </span>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-2">
                                <Label htmlFor="plate">Plaka</Label>
                                <Input
                                    id="plate"
                                    placeholder="34ABC123"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                            >
                                Geri
                            </Button>
                        )}
                        {step === 3 && (
                            <Button
                                onClick={handleAddVehicle}
                                disabled={!plate.trim()}
                            >
                                Ekle
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>



        </div>
    );
} 