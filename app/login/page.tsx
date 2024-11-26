'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, KeyRound } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function Login() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    // Telefon numarasını formatla (505 123 4567 şeklinde)
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '').substring(0, 10);
        const formatted = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        return formatted;
    };

    // API için telefon numarasını hazırla (5051234567 şeklinde)
    const preparePhoneForApi = (phoneNumber: string) => {
        return phoneNumber.replace(/\D/g, '');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const setAuthCookieAndStorage = (guid: string) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        document.cookie = `guid=${guid}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Strict`;
        localStorage.setItem('guid', guid);
        localStorage.setItem('guidExpires', expirationDate.toISOString());
    };

    const handleLogin = async () => {
        try {
            const phoneForApi = preparePhoneForApi(phone);
            if (phoneForApi.length !== 10) {
                setError('Geçerli bir telefon numarası giriniz');
                return;
            }

            const response = await fetch('https://instatistik.com/lixhium/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `telno=${phoneForApi}`,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log('Login response:', data);

            if (data !== "0") {
                setShowOtp(true);
                setError('');
            } else {
                setError('Giriş yapılırken bir hata oluştu');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Bir hata oluştu');
        }
    };

    const handleOtpSubmit = async () => {
        try {
            const phoneForApi = preparePhoneForApi(phone);
            const response = await fetch('https://instatistik.com/lixhium/otp.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `telno=${phoneForApi}&kod=${otp}`,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            console.log('OTP response:', data);

            if (data !== "0") {
                setAuthCookieAndStorage(data);
                router.push('/map');
            } else {
                setError('OTP doğrulaması başarısız');
            }
        } catch (err) {
            console.error('OTP error:', err);
            setError('Bir hata oluştu');
        }
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Giriş Yap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!showOtp ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon Numarası</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="505 123 4567"
                                    className="text-lg"
                                />
                            </div>
                            <Button
                                className="w-full gap-2"
                                onClick={handleLogin}
                            >
                                <LogIn className="h-4 w-4" />
                                Giri�� Yap
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Label>Doğrulama Kodu</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {phone} numarasına gönderilen kodu giriniz
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={4}
                                        value={otp}
                                        onChange={setOtp}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot className="w-14 h-14 text-2xl" index={0} />
                                            <InputOTPSlot className="w-14 h-14 text-2xl" index={1} />
                                            <InputOTPSlot className="w-14 h-14 text-2xl" index={2} />
                                            <InputOTPSlot className="w-14 h-14 text-2xl" index={3} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    className="w-full gap-2"
                                    onClick={handleOtpSubmit}
                                >
                                    <KeyRound className="h-4 w-4" />
                                    Doğrula
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => {
                                        setShowOtp(false);
                                        setOtp('');
                                        setError('');
                                    }}
                                >
                                    Geri Dön
                                </Button>
                            </div>
                        </>
                    )}
                    {error && (
                        <p className="text-destructive text-sm text-center">{error}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 