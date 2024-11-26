'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface MapContextType {
    isBottomSheetOpen: boolean;
    setIsBottomSheetOpen: (value: boolean) => void;
    selectedStation: any | null;
    setSelectedStation: (station: any | null) => void;
    center: { lat: number; lng: number };
    setCenter: (center: { lat: number; lng: number }) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<any | null>(null);
    const [center, setCenter] = useState({ lat: 41.0082, lng: 28.9784 });
    const [zoom, setZoom] = useState(10);

    return (
        <MapContext.Provider value={{
            isBottomSheetOpen,
            setIsBottomSheetOpen,
            selectedStation,
            setSelectedStation,
            center,
            setCenter,
            zoom,
            setZoom
        }}>
            {children}
        </MapContext.Provider>
    );
}

export function useMapContext() {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
} 