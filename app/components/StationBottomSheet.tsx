'use client';
import Image from 'next/image';
import Link from 'next/link';

interface Station {
    id: string;
    name: string;
    description: string;
    description2: string;
    status: string;
    address: string;
    accessTime: string;
    ac: string;
    dcgreaterthan50: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    station: Station | null;
    parseSocketInfo: (description: string) => { power: number, count: number }[];
}

export default function StationBottomSheet({ isOpen, onClose, station, parseSocketInfo }: Props) {
    if (!station) return null;

    const sockets = parseSocketInfo(station.description);

    const combinedSockets = sockets.reduce((acc, socket) => {
        if (socket.power <= 22) {
            const existingAC = acc.find(s => s.type === 'AC');
            if (existingAC) {
                existingAC.sockets.push({ power: socket.power, count: socket.count });
            } else {
                acc.push({ type: 'AC', sockets: [{ power: socket.power, count: socket.count }] });
            }
        } else {
            acc.push({ type: 'DC', sockets: [{ power: socket.power, count: socket.count }] });
        }
        return acc;
    }, [] as Array<{ type: 'AC' | 'DC', sockets: Array<{ power: number, count: number }> }>);

    const getPricePerKwh = (type: 'AC' | 'DC') => {
        return type === 'AC' ? station.ac : station.dcgreaterthan50;
    };

    const formatSockets = (sockets: Array<{ power: number, count: number }>) => {
        const totalCount = sockets.reduce((sum, socket) => sum + socket.count, 0);
        const powers = sockets.map(socket => `${socket.power} kW`).join(' • ');
        return {
            totalCount,
            powers
        };
    };

    return (
        <div
            className={`fixed inset-0 flex items-end justify-center pb-4 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ display: isOpen ? 'flex' : 'none' }}
        >
            <div
                className="w-full sm:w-[50%] max-w-md mx-4 sm:mx-0 bg-white rounded-[24px] shadow-lg pointer-events-auto"
                style={{
                    transform: `translateY(${isOpen ? '0' : '100%'})`,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[18px] sm:text-[22px] text-black font-semibold mb-1">{station.name}</h2>
                            <p className="text-[13px] sm:text-[15px] text-gray-500">{station.address}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className='p-2'></div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-[#F2F2F7] rounded-2xl p-3 sm:p-4">
                            {combinedSockets.map((socketGroup, index) => {
                                const { totalCount, powers } = formatSockets(socketGroup.sockets);
                                return (
                                    <div key={index} className="flex items-center justify-between mb-3 last:mb-0">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-[#34C759]/10 rounded-full flex items-center justify-center">
                                                <Image
                                                    src={socketGroup.type === 'AC' ? '/assets/AC_PLUG.svg' : '/assets/DC_PLUG.svg'}
                                                    alt={`${socketGroup.type} Plug`}
                                                    width={20}
                                                    height={20}
                                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[15px] sm:text-[17px] text-black">
                                                    <span className="font-semibold">{totalCount}/{totalCount}</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-normal">{powers}</span>
                                                </p>
                                                <p className="text-[12px] sm:text-[13px] text-[#3C3C43]">
                                                    {station.status === 'Available' ? 'Soket Durumu Müsait' : 'Soket Meşgul'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-[13px] sm:text-[15px] text-[#3C3C43]">
                                            {getPricePerKwh(socketGroup.type)} / kWh
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Link
                        href={`/istasyon/${station.id}`}
                        target="_blank"
                        className="block w-full"
                    >
                        <button className="w-full mt-4 py-2.5 sm:py-3 bg-blue-500 text-white text-[15px] sm:text-base rounded-[24px] hover:bg-blue-600 transition-colors">
                            İstasyon Detayları
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 