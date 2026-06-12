import { useEffect, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { isMock } from '@/api/client';

export function useNotificationStream() {
    const { toast } = useToast();
    const ctrlRef = useRef<AbortController | null>(null);

    // برای جلوگیری از نشان دادن نوتیفیکیشن‌های تکراری در کسری از ثانیه
    const lastNotificationRef = useRef<{ title: string; time: number } | null>(null);

    useEffect(() => {
        if (isMock()) return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        ctrlRef.current = new AbortController();

        const connect = async () => {
            try {
                await fetchEventSource('/api/notifications/stream', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'text/event-stream',
                    },
                    signal: ctrlRef.current?.signal,
                    async onopen(response: Response) {
                        if (response.ok) {
                            console.log('[SSE] Connected to real-time notifications');
                        } else {
                            console.error('[SSE] Failed to connect', response.status);
                            throw new Error('Connection failed');
                        }
                    },
                    onmessage(msg: any) {
                        if (msg.event === 'notification') {
                            try {
                                const data = JSON.parse(msg.data);

                                // فیلتر کردن پیام‌های کاملاً تکراری که در کمتر از 2 ثانیه از سرور میان
                                const now = Date.now();
                                const last = lastNotificationRef.current;
                                if (last && last.title === data.title && (now - last.time) < 2000) {
                                    return; // نادیده گرفتن پیام تکراری
                                }
                                lastNotificationRef.current = { title: data.title, time: now };

                                console.log('[SSE] Notification received:', data);

                                let type: 'info' | 'success' | 'error' = 'info';
                                if (data.type === 'TRANSACTION_DONE') type = 'success';
                                if (data.type === 'LOAN_REJECTED' || data.type === 'FRAUD_ALERT' || data.type === 'TRANSACTION_BLOCKED') type = 'error';

                                toast(`${data.title}: ${data.message}`, type);
                            } catch (err) {
                                console.error('[SSE] Error parsing notification:', err);
                            }
                        }
                    },
                    onclose() {
                        throw new Error('Server closed connection');
                    },
                    onerror(err: any) {
                        return 5000;
                    }
                });
            } catch (e) {
                // Retry logic inside fetchEventSource handles it
            }
        };

        connect();

        return () => {
            if (ctrlRef.current) {
                ctrlRef.current.abort();
                ctrlRef.current = null;
            }
        };
    }, [toast]);
}