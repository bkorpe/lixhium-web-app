'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EVChargeModel {
    id: string;
    startTime: string;
    endTime: string;
    userId: string;
    name: string;
    address: string;
    paymentProcessGuid: string;
    paymentRequestId: string;
    price: string;
    LXH_amount: string;
    station_type: string;
    tuketilenKwh: string;
    time: string;
    paymentStatus: string;
    start_percentage?: string;
    end_percentage?: string;
    isLxhTransaction?: boolean;
}

interface Price {
    id: string;
    name: string;
    ac: string;
    dcgreaterthan50: string;
    image: string;
    paraBirimi: string;
    inTurkey: string;
}

interface Cpo {
    merchantName: string;
    actualName: string;
    imageUrl: string;
}

const cpoList = [
    {
        merchantName: 'IYZICO /tesla.com',
        actualName: 'Tesla',
        imageUrl: '/assets/cpoList/Tesla Logo.png'
    },
    {
        merchantName: 'ZES DIGITAL',
        actualName: 'ZES',
        imageUrl: '/assets/cpoList/ZES Logo.png'
    },
    {
        merchantName: 'E/MOKA /ESARJ ELEKTRIKL',
        actualName: 'Eşarj',
        imageUrl: '/assets/cpoList/images.jpeg'
    },
    {
        merchantName: 'VOLTRUN',
        actualName: 'Voltrun',
        imageUrl: '/assets/cpoList/Voltrun Logo.png'
    },
    {
        merchantName: 'S/VOLTRUN ENERJI',
        actualName: 'Voltrun',
        imageUrl: '/assets/cpoList/Voltrun Logo.png'
    },
    {
        merchantName: 'PAYTR /GREENSARJISTASY',
        actualName: 'Green Şarj',
        imageUrl: ''
    },
    {
        merchantName: 'PAYCELL/T R U G O',
        actualName: 'Trugo',
        imageUrl: '/assets/cpoList/Trugo Logo.png'
    },
    {
        merchantName: 'PAYTR/ADZESARJ',
        actualName: 'ADZE Charge',
        imageUrl: '/assets/cpoList/adze.png'
    },
    {
        merchantName: 'PARATI /borenco.com.tr',
        actualName: 'Borenco',
        imageUrl: '/assets/cpoList/Borenco.png'
    },
    {
        merchantName: 'IYZICO /astorsarj.com',
        actualName: 'Astor Şarj',
        imageUrl: '/assets/cpoList/Astor.png'
    },
    {
        merchantName: 'ONCHARGE SARJ ISTASY',
        actualName: 'ONCHARGE',
        imageUrl: '/assets/cpoList/ONCHARGE.png'
    },
    {
        merchantName: 'IYZICO /beefull.com',
        actualName: 'Beefull',
        imageUrl: '/assets/cpoList/Beefull.png'
    },
    {
        merchantName: 'PARATIKA/antkemsarj.com',
        actualName: 'Antkem Şarj',
        imageUrl: '/assets/cpoList/antkem.png'
    },
    {
        merchantName: 'PAYNET/PAYNET',
        actualName: 'AutoŞarj',
        imageUrl: '/assets/cpoList/autosarj.png'
    },
    {
        merchantName: 'RONESANS SARJ ISTASYON YA',
        actualName: 'Rönesans ChargeR',
        imageUrl: '/assets/cpoList/ronesans.png'
    },
    {
        merchantName: 'PARAM/ /TUNCMATIK SARJ',
        actualName: 'Tunçmatik',
        imageUrl: '/assets/cpoList/tuncmatik.png'
    },
    {
        merchantName: 'LIDIO  /EKOSARJ',
        actualName: 'Ekoşarj',
        imageUrl: '/assets/cpoList/ekosarj.png'
    },
    {
        merchantName: 'FILOPORT ARAC KIRALAMA VE',
        actualName: 'ONLIFE CHARGE',
        imageUrl: '/assets/cpoList/image 21.png'
    },
    {
        merchantName: 'PAYNET/ATAY GUC VE E',
        actualName: 'Ecobox',
        imageUrl: '/assets/cpoList/ecobox.webp'
    },
    {
        merchantName: 'PAYCELL/DCHARGE',
        actualName: 'D-Charge',
        imageUrl: '/assets/cpoList/dcharge.png'
    },
    {
        merchantName: 'SIPAY. /Gioev',
        actualName: 'GioEV',
        imageUrl: '/assets/cpoList/gioev.png'
    },
    {
        merchantName: 'S/WWW.ENYAKIT.COM.TR',
        actualName: 'EnYakıt',
        imageUrl: '/assets/cpoList/enyakıt.png'
    }
] as const;

// Fiyat bulma fonksiyonu
const findPrice = (prices: Price[], name: string, type: string) => {
    const price = prices.find(price =>
        price.name.toUpperCase().includes(name.toUpperCase())
    );

    if (!price) return 1;

    if (type === 'DC') {
        return parseFloat(price.dcgreaterthan50
            .replace('TL', '')
            .replace(/\s/g, '')
            .replace(',', '.'));
    } else {
        return parseFloat(price.ac
            .replace('TL', '')
            .replace(/\s/g, '')
            .replace(',', '.'));
    }
};

export default function ChargingHistory() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [chargingHistory, setChargingHistory] = useState<EVChargeModel[]>([]);

    // fetchAllChargingHistory'i useCallback ile saralım
    const fetchAllChargingHistory = useCallback(async () => {
        try {
            const guid = localStorage.getItem('guid');
            if (!guid) {
                router.push('/profil');
                return;
            }

            // Tüm API istekleri
            const [historyResponse, lxhResponse, pricesResponse] = await Promise.all([
                fetch('https://instatistik.com/lixhium/getChargingHistory.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `guid=${guid}`,
                }),
                fetch('https://api.lixhium.com/getLXHtransactions.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `guid=${guid}`,
                }),
                fetch('https://instatistik.com/lixhium/getprices.php')
            ]);

            const [historyData, lxhData, prices] = await Promise.all([
                historyResponse.json().catch(() => []),
                lxhResponse.json().catch(() => []),
                pricesResponse.json().catch(() => [])
            ]);

            // Normal şarj geçmişini dönüştür
            const historyCharges = Array.isArray(historyData) ? historyData.map((charge: any) => ({
                id: charge.id,
                startTime: charge.start_time,
                endTime: charge.end_time,
                userId: charge.user_id,
                name: charge.name,
                address: charge.address,
                paymentProcessGuid: charge.payment_processGuid,
                paymentRequestId: charge.payment_requestId,
                price: charge.price,
                LXH_amount: charge.LXH_amount,
                station_type: '-', // Varsayılan olarak DC
                tuketilenKwh: charge.tuketilen_kwh,
                time: charge.time,
                paymentStatus: charge.payment_status,
                start_percentage: charge.start_percentage,
                end_percentage: charge.end_percentage
            })) : [];

            // LXH işlemlerini dönüştür
            const lxhCharges = Array.isArray(lxhData) ? lxhData.map((charge: any) => {
                // CPO'yu bul
                const cpo = cpoList.find(c =>
                    charge.merchantName?.toString().trim() === c.merchantName
                ) || {
                    merchantName: charge.merchantName?.toString() || '',
                    actualName: charge.merchantName?.toString() || '',
                    imageUrl: ''
                };

                // Fiyatı hesapla
                const brandPrice = findPrice(
                    prices,
                    cpo.actualName,
                    charge.station_type?.toString() || ''
                );

                // kWh hesapla
                const tuketilenKwh = charge.station_type?.toString() !== 'null'
                    ? (parseFloat(charge.amount) / brandPrice).toString()
                    : '0';

                return {
                    id: charge.id,
                    startTime: charge.created_at,
                    endTime: charge.created_at,
                    userId: charge.user_id,
                    name: charge.merchantName,
                    address: charge.address,
                    paymentProcessGuid: charge.payment_processGuid,
                    paymentRequestId: charge.payment_requestId,
                    price: charge.amount,
                    LXH_amount: charge.LXH_amount,
                    station_type: charge.station_type,
                    tuketilenKwh,
                    time: charge.time,
                    paymentStatus: charge.payment_status,
                    start_percentage: charge.start_percentage,
                    end_percentage: charge.end_percentage,
                    isLxhTransaction: true
                } as EVChargeModel;
            }) : [];

            // Tüm verileri birleştir ve tarihe göre sırala
            const allCharges = [...historyCharges, ...lxhCharges].sort((a, b) => {
                const dateA = new Date(a.startTime).getTime();
                const dateB = new Date(b.startTime).getTime();
                return dateB - dateA;
            });

            setChargingHistory(allCharges);
        } catch (error) {
            console.error('Şarj geçmişi alınamadı:', error);
            setChargingHistory([]);
        } finally {
            setLoading(false);
        }
    }, [router]); // router'ı dependency olarak ekleyelim

    // İlk yükleme için useEffect
    useEffect(() => {
        fetchAllChargingHistory();
    }, [fetchAllChargingHistory]);

    // CPO eşleştirme fonksiyonunu güvenli hale getirelim
    const findCpo = (name: string | undefined) => {
        if (!name) return null;

        return cpoList.find(cpo => {
            const normalizedName = name.toLowerCase().trim();
            const normalizedMerchant = cpo.merchantName.toLowerCase().trim();
            const normalizedActual = cpo.actualName.toLowerCase().trim();

            return normalizedName.includes(normalizedMerchant) ||
                normalizedMerchant.includes(normalizedName) ||
                normalizedName.includes(normalizedActual) ||
                normalizedActual.includes(normalizedName);
        });
    };

    // Şarj tipini güncelleme fonksiyonu
    const updateStationType = async (id: string, type: string) => {
        try {
            const response = await fetch('https://api.lixhium.com/bora/updateLxhRecords.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${id}&type=${type}`,

            });

        } catch (error) {
            console.error('Şarj tipi güncellenirken hata:', error);
        }
        const guid = localStorage.getItem('guid');
        if (guid) {
            fetchAllChargingHistory();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Başlık ve Geri Butonu */}
            <div className="flex items-center justify-between mb-6">
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
                        <h1 className="text-3xl font-bold tracking-tight">Şarj İşlemlerim</h1>
                    </div>
                    <p className="text-muted-foreground">Geçmiş şarj işlemlerinizi görüntüleyin</p>
                </div>
            </div>

            {/* Şarj İşlemleri Listesi */}
            <div className="space-y-4">
                {chargingHistory.length === 0 ? (
                    <Card className="p-6 text-center text-muted-foreground">
                        Henüz şarj işleminiz bulunmuyor.
                    </Card>
                ) : (
                    chargingHistory.map((charge, index) => {
                        const cpo = findCpo(charge.name);
                        // Benzersiz key oluştur: id + isLxhTransaction + index
                        const uniqueKey = `${charge.id}-${charge.isLxhTransaction ? 'lxh' : 'normal'}-${index}`;

                        return (
                            <Card key={uniqueKey} className="p-4">
                                {/* Başlık ve Tarih */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-xl font-semibold">
                                        {new Date(charge.startTime).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} {new Date(charge.startTime).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    {charge.isLxhTransaction ? (
                                        <Select
                                            value={charge.station_type || ''}
                                            onValueChange={(value) => updateStationType(charge.id, value)}
                                        >
                                            <SelectTrigger className="w-24">
                                                <SelectValue placeholder="Tip Seç" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AC">AC</SelectItem>
                                                <SelectItem value="DC">DC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className={`text-sm font-medium bg-gray-100 px-3 py-1 rounded-full ${charge.station_type == '-' ? 'hidden' : ''}`}>
                                            {charge.station_type != '-' ? charge.station_type : 'DC'}
                                        </div>
                                    )}
                                </div>

                                {/* CPO Bilgileri */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden  flex items-center justify-center">
                                        {!charge.isLxhTransaction ? (
                                            <img
                                                src="/assets/cpoList/powersarj.png"
                                                alt="Powersarj"
                                                className="w-10 h-10 object-contain"
                                            />
                                        ) : cpo?.imageUrl ? (
                                            <img
                                                src={cpo.imageUrl}
                                                alt={charge.name}
                                                className="w-10 h-10 object-contain"
                                            />
                                        ) : (
                                            <div className=" bg-white " />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {charge.isLxhTransaction ? charge.name : (cpo?.actualName || charge.name)}
                                        </h3>
                                        {charge.isLxhTransaction && (
                                            <p className="text-sm text-blue-500">
                                                Lix Kart ile ödemesi yapılan şarj işlemi
                                            </p>
                                        )}
                                        {!charge.isLxhTransaction && <h2 className="text-sm text-gray-500">
                                            {charge.address}
                                        </h2>}
                                    </div>
                                </div>

                                {/* Şarj Detayları */}
                                <div className="flex items-center justify-between">
                                    <div className="grid grid-cols-3 w-full gap-4">
                                        {/* Şarj Süresi/Yüzdesi */}
                                        <div className="flex items-center justify-start gap-2">

                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {charge.start_percentage && charge.end_percentage ? (
                                                        `${charge.start_percentage}% - ${charge.end_percentage}%`
                                                    ) : (
                                                        charge.time || '-'
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {charge.start_percentage ? 'Şarj Yüzdesi' : 'Şarj Süresi'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Aktarılan Enerji */}
                                        <div className="flex items-center justify-center gap-2">

                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {parseFloat(charge.tuketilenKwh || '0').toFixed(2)} kWs
                                                </p>
                                                <p className="text-sm text-gray-500">Aktarılan Enerji</p>
                                            </div>
                                        </div>

                                        {/* CO2 Kazanımı */}
                                        <div className="flex items-center justify-end gap-2">

                                            <div>
                                                <p className="text-lg font-semibold">
                                                    {(parseFloat(charge.tuketilenKwh || '0') * 0.675).toFixed(2)} kg
                                                </p>
                                                <p className="text-sm text-gray-500">CO2 Kazanımı</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Durum, LXH ve Fiyat Bilgileri */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="grid grid-cols-3 w-full gap-4">
                                        {/* Durum */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Tamamlandı</span>
                                        </div>

                                        {/* LXH */}
                                        <div className="flex items-center justify-center">
                                            {charge.LXH_amount && (
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="/assets/simsek.svg"
                                                        alt="LXH"
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="font-medium text-lg">+{charge.LXH_amount} LXH</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fiyat */}
                                        <div className="flex items-center justify-end gap-2">
                                            <img
                                                src="/assets/odeme.svg"
                                                alt="Ödeme"
                                                className="w-5 h-5"
                                            />
                                            <span className="font-medium text-lg">{charge.price} TL</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}