import axios from 'axios';

/**
 * کلاینت axios.
 * در توسعه، درخواست‌ها به /api می‌روند که Vite آن را به api-gateway (پورت 8090) پروکسی می‌کند.
 * توکن JWT به‌صورت خودکار به هدر اضافه می‌شود.
 */
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    // برای مسیرهای احراز هویت (login/register/refresh) توکن قدیمی فرستاده نشود
    // تا یک توکن منقضی/خراب باعث رفتار غیرمنتظره (مثل 403) نشود.
    const url = config.url || '';
    const isAuthPath = url.includes('/api/auth/');
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthPath) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        // اگر توکن منقضی شد، به صفحه‌ی ورود برگرد
        if (error.response?.status === 401 && !location.pathname.includes('/login')) {
            localStorage.removeItem('accessToken');
            // نرم: فقط در صورتی که قبلاً لاگین بوده
            if (localStorage.getItem('hadSession')) {
                localStorage.removeItem('hadSession');
                location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

/** آیا حالت Mock فعال است؟ (وقتی بک‌اند در دسترس نیست) */
export const isMock = () => localStorage.getItem('mockMode') === 'true';
export const setMock = (on: boolean) => localStorage.setItem('mockMode', String(on));

/** استخراج پیام خطای خوانا از پاسخ بک‌اند. */
export function extractError(error: unknown, fallback = 'خطایی رخ داد'): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;
    return e?.response?.data?.message || e?.message || fallback;
}
