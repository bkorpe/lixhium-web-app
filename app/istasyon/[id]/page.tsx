'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
    price: string;
    brandImage: string;
    image: string;
    rating: string;
    amenitiesid: string;
}

interface Checkin {
    id: string;
    createddate: string;
    rate: string;
    comment: string;
    name: string;
    evtype: string;
    carphoto: string;
    photo: string;
    hiddenname: string;
    powerlevel: string;
}

export default function StationDetails() {
    const params = useParams();
    const router = useRouter();

    // Tüm state'leri en üstte tanımlayalım
    const [station, setStation] = useState<Station | null>(null);
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // useEffect'leri sıralı bir şekilde tanımlayalım
    useEffect(() => {
        const fetchStationDetails = async () => {
            try {
                const guid = localStorage.getItem('guid');
                if (!guid) {
                    router.push('/profil');
                    return;
                }

                // İstasyon bilgilerini al
                const stationResponse = await fetch('https://instatistik.com/lixhium/istasyon_by_id.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `guid=${guid}&stationId=${params.id}`,
                });
                const stationData = await stationResponse.json();
                setStation(stationData[0]);

                // İstasyon yorumlarını al
                const checkinsResponse = await fetch('https://instatistik.com/lixhium/getstationcheckins.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `stationid=${params.id}`,
                });
                const checkinsData = await checkinsResponse.json();
                setCheckins(checkinsData);
            } catch (error) {
                console.error('Veri alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStationDetails();
        }
    }, [params.id, router]);

    // Klavye kontrolü için useEffect
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showImageViewer) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') setShowImageViewer(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showImageViewer]);

    // Yardımcı fonksiyonları tanımlayalım
    const nextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === selectedImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? selectedImages.length - 1 : prev - 1
        );
    };

    const handleImageClick = (images: string[], startIndex: number) => {
        setSelectedImages(images);
        setSelectedImageIndex(startIndex);
        setShowImageViewer(true);
    };

    // Loading ve error durumlarını kontrol edelim
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="p-4">
                <h1>İstasyon bulunamadı</h1>
            </div>
        );
    }

    // İstasyon görsellerini parse et
    const stationImages = station?.image ? station.image.split(',').filter(Boolean) : [];

    // 10 üzerinden puanı 5 üzerine çeviren fonksiyon
    const convertToFiveStars = (rating: string) => {
        return (parseInt(rating) / 10) * 5;
    };

    // Yıldızları render eden komponent
    const RatingStars = ({ rating }: { rating: number }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <svg
                        key={`full-${i}`}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#E5E7EB" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#half)"
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg
                        key={`empty-${i}`}
                        className="w-4 h-4 text-gray-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => {
                    router.back(); // Geri dön
                    window.close(); // Sekmeyi kapat
                }}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri Dön
            </Button>

            <div className="space-y-6">
                {/* İstasyon Başlık ve Marka */}
                <div className="flex items-center gap-4">
                    {station.brandImage && (
                        <img
                            src={`https://instatistik.com/lixhium/${station.brandImage}`}
                            alt="Marka"
                            className="w-16 h-16 object-contain"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{station.name}</h1>
                        <p className="text-gray-500">{station.address}</p>
                    </div>
                </div>

                {/* İstasyon Görseli Slider */}
                {stationImages.length > 0 && (
                    <div
                        className="rounded-lg overflow-hidden h-64 relative cursor-pointer"
                        onClick={() => handleImageClick(stationImages, currentImageIndex)}
                    >
                        <img
                            src={`https://cdn.lixhium.app/images/${stationImages[currentImageIndex]}`}
                            alt={`${station.name} - Görsel ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Slider Kontrolleri */}
                        {stationImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>

                                {/* Görsel İndikatörleri */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {stationImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(index);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex
                                                ? 'bg-white'
                                                : 'bg-white/50 hover:bg-white/75'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Resim Sayacı */}
                                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {stationImages.length}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* İstasyon Detayları */}
                <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                        <h2 className="font-semibold mb-2">Şarj Noktaları</h2>
                        <p>{station.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Toplam {station.plugCount} Soket
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h2 className="font-semibold mb-2">Çalışma Saatleri</h2>
                        <p>{station.accessTime}</p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h2 className="font-semibold mb-2">Ek Bilgiler</h2>
                        <p>{station.info}</p>
                    </div>
                </div>

                {/* Yorumlar Bölümü */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Yorumlar ve Deneyimler</h2>
                    <div className="space-y-4">
                        {checkins.map((checkin) => (
                            <div key={checkin.id} className="border rounded-lg p-4 relative">
                                {/* Yıldızlar sağ üstte */}
                                <div className="absolute top-4 right-4">
                                    <RatingStars rating={convertToFiveStars(checkin.rate)} />
                                </div>

                                {/* Kullanıcı bilgileri */}
                                <div className="flex items-center gap-4">
                                    {checkin.carphoto && (
                                        <img
                                            src={`https://cdn.lixhium.app/${checkin.carphoto}`}
                                            alt={checkin.evtype}
                                            className="w-12 h-12 rounded-full object-contain bg-gray-100"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {checkin.hiddenname === "1"
                                                ? (checkin.name?.split(' ').map((part, index, array) => {
                                                    if (index === array.length - 1 && array.length > 1 && part.length > 0) {
                                                        return part.charAt(0) + '*'.repeat(Math.max(part.length - 1, 1));
                                                    }
                                                    return part;
                                                }).join(' ') || 'Lixhium Kullanıcısı')
                                                : (checkin.name || 'Lixhium Kullanıcısı')
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500">{checkin.evtype}</p>
                                        {checkin.powerlevel && (
                                            <p className="text-sm text-gray-500">
                                                Alınan güç:{checkin.powerlevel} kW
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Yorum metni */}
                                {checkin.comment && (
                                    <p className="mt-4 mb-6">{checkin.comment}</p>
                                )}

                                {/* Kullanıcının yüklediği fotoğraflar */}
                                {checkin.photo && (
                                    <div className="mt-3 mb-6 flex gap-2 overflow-x-auto">
                                        {checkin.photo.split(',').filter(Boolean).map((photo, index) => (
                                            <img
                                                key={index}
                                                src={`https://cdn.lixhium.app/images/${photo}`}
                                                alt={`img ${index + 1}`}
                                                className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageClick(
                                                    checkin.photo.split(',').filter(Boolean),
                                                    index
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Tarih bilgisi sağ altta */}
                                <div className="absolute bottom-4 right-4">
                                    <p className="text-xs text-gray-400">
                                        {new Date(checkin.createddate.split('|')[0]).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resim Görüntüleyici Dialog */}
            <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
                <DialogContent className="max-w-[80vw] max-h-[80vh] p-0">
                    <VisuallyHidden>
                        <DialogTitle>Resim Görüntüleyici</DialogTitle>
                    </VisuallyHidden>
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                        {/* Kapat butonu */}
                        <button
                            onClick={() => setShowImageViewer(false)}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Önceki resim butonu */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        {/* Resim */}
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                                src={`https://cdn.lixhium.app/images/${selectedImages[selectedImageIndex]}`}
                                alt="Büyük görüntü"
                                className="max-w-full max-h-[70vh] object-contain"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>

                        {/* Sonraki resim butonu */}
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Resim sayacı */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {selectedImages.length}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 