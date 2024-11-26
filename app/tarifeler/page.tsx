'use client';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ChevronLeft } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Price {
    id: string;
    name: string;
    ac: string;
    dcgreaterthan50: string;
    image: string;
    paraBirimi: string;
    inTurkey: string;
}

type SortConfig = {
    key: keyof Price;
    direction: 'asc' | 'desc';
};

export default function Tarifeler() {
    const router = useRouter();
    const [prices, setPrices] = useState<Price[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    const [loading, setLoading] = useState(true);
    const [showInternational, setShowInternational] = useState(false);

    useEffect(() => {
        const guid = localStorage.getItem('guid');
        if (!guid) {
            router.push('/profil');
        }
    }, [router]);

    useEffect(() => {
        fetch('https://instatistik.com/lixhium/getprices.php')
            .then(response => response.json())
            .then(data => {
                setPrices(data);
                setLoading(false);
            });
    }, []);

    const handleSort = (key: keyof Price) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const formatPrice = (price: string, paraBirimi: string, inTurkey: string) => {
        if (price === "0" || price === "0 TL" || price === "" || price === "0,00 TL" || price === "0,00" || !price) return "-";
        if (inTurkey === "0") return `${price} ${paraBirimi}`;
        return price;
    };

    const sortedPrices = [...prices].sort((a, b) => {
        if (sortConfig.key === 'ac' || sortConfig.key === 'dcgreaterthan50') {
            const aValue = parseFloat(a[sortConfig.key].replace(' TL', '').replace(',', '.'));
            const bValue = parseFloat(b[sortConfig.key].replace(' TL', '').replace(',', '.'));
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    const filteredPrices = sortedPrices
        .filter(price => price.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(price => showInternational ? price.inTurkey === "0" : price.inTurkey === "1");

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-10 space-y-6">
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
                            <h1 className="text-3xl font-bold tracking-tight">Şarj Operatörleri ve Tarifeleri</h1>
                        </div>
                        <p className="text-muted-foreground">Tüm operatörlerin güncel fiyatlandırmaları</p>
                    </div>
                </div>

                {/* Arama ve Filtre */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Şarj operatörü ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={showInternational}
                            onCheckedChange={setShowInternational}
                        />
                        <label className="text-sm text-muted-foreground">
                            Uluslararası Operatörler
                        </label>
                    </div>
                </div>

                {/* Tablo */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Logo</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-primary"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Operatör
                                        {sortConfig.key === 'name' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-primary"
                                    onClick={() => handleSort('ac')}
                                >
                                    <div className="flex items-center gap-2">
                                        AC Fiyat
                                        {sortConfig.key === 'ac' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:text-primary"
                                    onClick={() => handleSort('dcgreaterthan50')}
                                >
                                    <div className="flex items-center gap-2">
                                        DC Fiyat
                                        {sortConfig.key === 'dcgreaterthan50' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10">
                                        <div className="flex justify-center">
                                            <div className="loader"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrices.map((price) => (
                                    <TableRow key={price.id}>
                                        <TableCell>
                                            <div className="w-10 h-10 relative">
                                                <img
                                                    src={`https://instatistik.com/lixhium/${price.image}`}
                                                    alt={price.name}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{price.name}</TableCell>
                                        <TableCell>
                                            {formatPrice(price.ac, price.paraBirimi, price.inTurkey)}
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(price.dcgreaterthan50, price.paraBirimi, price.inTurkey)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
} 