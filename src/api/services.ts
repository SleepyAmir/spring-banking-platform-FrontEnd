import { apiClient, isMock } from './client';
import { sleep } from '@/lib/utils';
import * as mock from './mockData';
import type {
    Account, AmlAlert, ApiResponse, Card, FraudAlert, KycVerification,
    Loan, LoanInstallment, NotificationItem, SpendingSnapshot, TokenResponse,
    Transaction, User,
} from '@/types';

/** کمک‌کننده: باز کردن ApiResponse بک‌اند. */
function unwrap<T>(res: { data: ApiResponse<T> }): T {
    return res.data.data;
}

// ============================ AUTH ============================

export interface LoginResult {
    tokens: TokenResponse;
    user: User;
    role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
}

export const authApi = {
    async login(username: string, password: string): Promise<LoginResult> {
        if (isMock()) {
            await sleep(500);
            const entry = mock.mockUsers[username];
            if (!entry || entry.password !== password) {
                throw { response: { data: { message: 'نام کاربری یا رمز عبور اشتباه است.' } } };
            }
            const tokens: TokenResponse = { accessToken: `mock.${username}.token`, refreshToken: 'mock.refresh', tokenType: 'Bearer', expiresIn: 3600 };
            return { tokens, user: entry.user, role: entry.role };
        }
        const res = await apiClient.post<ApiResponse<TokenResponse>>('/api/auth/login', { username, password });
        const tokens = unwrap(res);
        localStorage.setItem('accessToken', tokens.accessToken);
        const role = decodeRole(tokens.accessToken);

        // گرفتن id واقعی کاربر از /api/users/me (توکن فقط username دارد)
        let user: User;
        try {
            user = await authApi.me();
        } catch {
            user = decodeUser(tokens.accessToken, username);
        }
        return { tokens, user, role };
    },

    /** گرفتن کاربر فعلی (برای دریافت id واقعی پس از ورود به بک‌اند واقعی). */
    async me(): Promise<User> {
        const res = await apiClient.get<ApiResponse<User>>('/api/users/me');
        return unwrap(res);
    },

    async register(payload: {
        username: string; password: string; email: string;
        firstName?: string; lastName?: string; phoneNumber?: string;
    }): Promise<User> {
        if (isMock()) {
            await sleep(500);
            return { id: 99, ...payload, roles: ['CUSTOMER'] };
        }
        const res = await apiClient.post<ApiResponse<User>>('/api/auth/register', payload);
        return unwrap(res);
    },
};

/** نقش را از claim «auth» داخل JWT استخراج می‌کند. */
function decodeRole(token: string): 'CUSTOMER' | 'ADMIN' | 'MANAGER' {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const auth: string = payload.auth || '';
        if (auth.includes('ROLE_ADMIN')) return 'ADMIN';
        if (auth.includes('ROLE_MANAGER')) return 'MANAGER';
        return 'CUSTOMER';
    } catch {
        return 'CUSTOMER';
    }
}

function decodeUser(token: string, fallbackUsername: string): User {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { id: 0, username: payload.sub || fallbackUsername, email: '', roles: [] };
    } catch {
        return { id: 0, username: fallbackUsername, email: '', roles: [] };
    }
}

// ============================ ACCOUNTS ============================

export const accountApi = {
    async byUser(userId: number): Promise<Account[]> {
        if (isMock()) { await sleep(300); return mock.mockAccounts; }
        const res = await apiClient.get<ApiResponse<Account[]>>(`/api/accounts/user/${userId}`);
        return unwrap(res);
    },
    async all(): Promise<Account[]> {
        if (isMock()) { await sleep(300); return mock.mockAccounts; }
        const res = await apiClient.get<ApiResponse<Account[]>>('/api/accounts');
        return unwrap(res);
    },
    /** یافتن حساب مقصد با شماره‌ی حساب (IR...) یا شماره‌ی کارت ۱۶ رقمی. */
    async lookup(identifier: string): Promise<{ id: number; accountNumber: string; ownerName: string; status: string }> {
        const value = identifier.trim().replace(/[\s-]/g, '');
        if (isMock()) {
            await sleep(200);
            let acc = mock.mockAccounts.find((a) => a.accountNumber === value);
            if (!acc && /^\d{16}$/.test(value)) {
                const card = mock.mockCards.find((c) => c.cardNumber === value);
                if (card) acc = mock.mockAccounts.find((a) => a.id === card.accountId);
            }
            if (!acc) throw { response: { data: { message: 'حساب/کارت مقصد یافت نشد' } } };
            return { id: acc.id, accountNumber: acc.accountNumber, ownerName: 'کاربر نمونه', status: acc.status };
        }
        const res = await apiClient.get<ApiResponse<{ id: number; accountNumber: string; ownerName: string; status: string }>>(
            `/api/accounts/lookup?accountNumber=${encodeURIComponent(value)}`);
        return unwrap(res);
    },

    async open(payload: { userId: number; type: string; branchCode: string; alias?: string }) {
        if (isMock()) {
            await sleep(600);
            return {
                account: { id: 9, accountNumber: 'IR' + Math.random().toString().slice(2, 26), type: payload.type, balance: 0, status: 'ACTIVE', alias: payload.alias, userId: payload.userId } as Account,
                card: { id: 9, cardNumber: '6274' + Math.floor(100000000000 + Math.random() * 800000000000), cvv2: '321', pin: '4582', type: 'DEBIT', status: 'ACTIVE', expiryDate: '2030-06-30', accountId: 9 } as Card,
            };
        }
        const res = await apiClient.post<ApiResponse<{ account: Account; card: Card }>>('/api/accounts/open', payload);
        return unwrap(res);
    },
};

// ============================ CARDS ============================

export const cardApi = {
    async byAccount(accountId: number): Promise<Card[]> {
        if (isMock()) { await sleep(200); return mock.mockCards.filter((c) => c.accountId === accountId); }
        const res = await apiClient.get<ApiResponse<Card[]>>(`/api/cards/account/${accountId}`);
        return unwrap(res);
    },
    async all(): Promise<Card[]> {
        if (isMock()) { await sleep(200); return mock.mockCards; }
        const res = await apiClient.get<ApiResponse<Card[]>>('/api/cards');
        return unwrap(res);
    },
};

// ============================ TRANSACTIONS ============================

export const txApi = {
    async create(payload: {
        type: string; amount: number; fee?: number; fromAccountId?: number | null; toAccountId?: number | null;
        userId: number; spendingCategory?: string; description?: string;
    }): Promise<Transaction> {
        if (isMock()) {
            await sleep(700);
            return {
                trackingCode: 'TXN' + Math.random().toString(36).slice(2, 22).toUpperCase(),
                amount: payload.amount, type: payload.type, status: 'COMPLETED',
                fromAccountId: payload.fromAccountId, toAccountId: payload.toAccountId,
                userId: payload.userId, createdAt: new Date().toISOString(),
            };
        }
        const res = await apiClient.post<ApiResponse<Transaction>>('/api/transactions', { currency: 'IRR', ...payload });
        return unwrap(res);
    },
    /** تراکنش‌های یک حساب (هم به‌عنوان مبدأ و هم مقصد). */
    async byAccount(accountId: number): Promise<Transaction[]> {
        if (isMock()) {
            await sleep(150);
            return mock.mockTransactions.filter((t) => t.fromAccountId === accountId || t.toAccountId === accountId);
        }
        const res = await apiClient.get<ApiResponse<Transaction[]>>(`/api/transactions/account/${accountId}`);
        return unwrap(res);
    },

    /**
     * تراکنش‌های یک کاربر (پنل مشتری). شامل:
     *  - تراکنش‌هایی که userId روی آن‌هاست (فرستنده)
     *  - + تراکنش‌های همه‌ی حساب‌های کاربر (تا انتقال‌های دریافتی هم دیده شوند)
     * نتایج بر اساس trackingCode دی‌داپلیکیت و بر اساس زمان مرتب می‌شوند.
     */
    async byUser(userId: number): Promise<Transaction[]> {
        if (isMock()) { await sleep(300); return mock.mockTransactions; }

        // تراکنش‌های مستقیم کاربر
        const own = await apiClient.get<ApiResponse<Transaction[]>>(`/api/transactions/user/${userId}`)
            .then(unwrap).catch(() => [] as Transaction[]);

        // تراکنش‌های حساب‌های کاربر (برای دیدن انتقال‌های دریافتی)
        let fromAccounts: Transaction[] = [];
        try {
            const accounts = await accountApi.byUser(userId);
            const lists = await Promise.all(accounts.map((a) => this.byAccount(a.id).catch(() => [])));
            fromAccounts = lists.flat();
        } catch { /* اگر حساب‌ها در دسترس نبود، فقط own */ }

        // ادغام + حذف تکراری بر اساس trackingCode
        const map = new Map<string, Transaction>();
        [...own, ...fromAccounts].forEach((t) => { if (t.trackingCode) map.set(t.trackingCode, t); });
        return Array.from(map.values()).sort((a, b) =>
            (b.createdAt || '').localeCompare(a.createdAt || ''));
    },

    /** همه‌ی تراکنش‌های اخیر (فقط برای ادمین/مدیر). */
    async recent(): Promise<Transaction[]> {
        if (isMock()) { await sleep(300); return mock.mockTransactions; }
        const res = await apiClient.get<ApiResponse<Transaction[]>>('/api/transactions/recent');
        return unwrap(res);
    },
};

// ============================ LOANS ============================

export const loanApi = {
    async byUser(userId: number): Promise<Loan[]> {
        if (isMock()) { await sleep(300); return mock.mockLoans; }
        const res = await apiClient.get<ApiResponse<Loan[]>>(`/api/loans/user/${userId}`);
        return unwrap(res);
    },
    async all(): Promise<Loan[]> {
        if (isMock()) { await sleep(300); return mock.mockLoans; }
        const res = await apiClient.get<ApiResponse<Loan[]>>('/api/loans');
        return unwrap(res);
    },
    async apply(payload: { userId: number; accountId: number; amount: number; durationMonths: number; purpose?: string }) {
        if (isMock()) { await sleep(600); return { ...mock.mockLoans[1], ...payload, id: 99, status: 'PENDING' } as Loan; }
        const res = await apiClient.post<ApiResponse<Loan>>('/api/loans', payload);
        return unwrap(res);
    },
    async approve(id: number) {
        if (isMock()) { await sleep(400); return { ...mock.mockLoans[0], id, status: 'ACTIVE' } as Loan; }
        const res = await apiClient.post<ApiResponse<Loan>>(`/api/loans/${id}/approve`);
        return unwrap(res);
    },
    async reject(id: number, reason: string) {
        if (isMock()) { await sleep(400); return { ...mock.mockLoans[1], id, status: 'REJECTED' } as Loan; }
        const res = await apiClient.post<ApiResponse<Loan>>(`/api/loans/${id}/reject?reason=${encodeURIComponent(reason)}`);
        return unwrap(res);
    },
    async installments(loanId: number): Promise<LoanInstallment[]> {
        if (isMock()) { await sleep(300); return mock.mockInstallments.filter((i) => i.loanId === loanId); }
        const res = await apiClient.get<ApiResponse<LoanInstallment[]>>(`/api/loans/${loanId}/installments`);
        return unwrap(res);
    },
    async payInstallment(installmentId: number) {
        if (isMock()) { await sleep(500); return { ...mock.mockInstallments[1], id: installmentId, status: 'PAID' } as LoanInstallment; }
        const res = await apiClient.post<ApiResponse<LoanInstallment>>(`/api/loans/installments/${installmentId}/pay`);
        return unwrap(res);
    },
};

// ============================ KYC ============================

export const kycApi = {
    async byUser(userId: number): Promise<KycVerification | null> {
        if (isMock()) { await sleep(300); return mock.mockKyc.find((k) => k.userId === userId) ?? null; }
        try {
            const res = await apiClient.get<ApiResponse<KycVerification>>(`/api/kyc/user/${userId}`);
            return unwrap(res);
        } catch { return null; }
    },
    async list(status?: string): Promise<KycVerification[]> {
        if (isMock()) { await sleep(300); return status ? mock.mockKyc.filter((k) => k.status === status) : mock.mockKyc; }
        const res = await apiClient.get<ApiResponse<KycVerification[]>>(`/api/kyc${status ? `?status=${status}` : ''}`);
        return unwrap(res);
    },
    async uploadDocuments(userId: number, data: { nationalId: File; selfie: File, nationalCode?: string, birthDate?: string, address?: string, postalCode?: string }, level?: string) {
        if (isMock()) { await sleep(800); return { ...mock.mockKyc[0], userId, status: 'DOCUMENT_UPLOADED' } as KycVerification; }
        const form = new FormData();
        form.append('nationalId', data.nationalId);
        form.append('selfie', data.selfie);
        
        let url = `/api/kyc/${userId}/documents?`;
        if (level) url += `level=${level}&`;
        if (data.nationalCode) url += `nationalCode=${encodeURIComponent(data.nationalCode)}&`;
        if (data.birthDate) url += `birthDate=${encodeURIComponent(data.birthDate)}&`;
        if (data.address) url += `address=${encodeURIComponent(data.address)}&`;
        if (data.postalCode) url += `postalCode=${encodeURIComponent(data.postalCode)}&`;
        
        const res = await apiClient.post<ApiResponse<KycVerification>>(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return unwrap(res);
    },
    async review(id: number, payload: { status: string; approvedLevel?: string; rejectionReason?: string }) {
        if (isMock()) { await sleep(400); return { ...mock.mockKyc[0], id, status: payload.status } as KycVerification; }
        const res = await apiClient.post<ApiResponse<KycVerification>>(`/api/kyc/${id}/review`, payload);
        return unwrap(res);
    },
    async startReview(id: number) {
        if (isMock()) { await sleep(300); return { ...mock.mockKyc[0], id, status: 'UNDER_REVIEW' } as KycVerification; }
        const res = await apiClient.post<ApiResponse<KycVerification>>(`/api/kyc/${id}/start-review`);
        return unwrap(res);
    },

    /** دریافت فایل مدرک به‌صورت blob URL (با هدر Authorization). docType: national | selfie | address */
    async documentObjectUrl(id: number, docType: 'national' | 'selfie' | 'address'): Promise<string | null> {
        if (isMock()) {
            // در حالت دمو یک تصویر نمونه‌ی SVG برمی‌گردانیم
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#1e293b'/><text x='50%' y='50%' fill='#94a3b8' font-size='16' text-anchor='middle'>${docType.toUpperCase()} (demo)</text></svg>`;
            return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        }
        try {
            const res = await apiClient.get(`/api/kyc/${id}/document/${docType}`, { responseType: 'blob' });
            return URL.createObjectURL(res.data as Blob);
        } catch {
            return null;
        }
    },
};

// ============================ NOTIFICATIONS ============================

export const notificationApi = {
    async byUser(userId: number): Promise<NotificationItem[]> {
        if (isMock()) { await sleep(200); return mock.mockNotifications; }
        const res = await apiClient.get<ApiResponse<NotificationItem[]>>(`/api/notifications/user/${userId}`);
        return unwrap(res);
    },
};

// ============================ FRAUD / AML ============================

export const fraudApi = {
    async all(): Promise<FraudAlert[]> {
        if (isMock()) { await sleep(300); return mock.mockFraud; }
        const res = await apiClient.get<ApiResponse<FraudAlert[]>>('/api/fraud/alerts');
        return unwrap(res);
    },
    async blocked(): Promise<FraudAlert[]> {
        if (isMock()) { await sleep(300); return mock.mockFraud.filter((f) => f.riskLevel === 'BLOCK'); }
        const res = await apiClient.get<ApiResponse<FraudAlert[]>>('/api/fraud/alerts/blocked');
        return unwrap(res);
    },
    async amlByUser(userId: number): Promise<AmlAlert[]> {
        if (isMock()) { await sleep(300); return mock.mockAml; }
        const res = await apiClient.get<ApiResponse<AmlAlert[]>>(`/api/fraud/aml/user/${userId}`);
        return unwrap(res);
    },
};

// ============================ ANALYTICS ============================

export const analyticsApi = {
    async byUser(userId: number): Promise<SpendingSnapshot[]> {
        if (isMock()) { await sleep(300); return mock.mockSnapshots; }
        const res = await apiClient.get<ApiResponse<SpendingSnapshot[]>>(`/api/analytics/user/${userId}`);
        return unwrap(res);
    },
};

// ============================ ADMIN USERS ============================

export const adminApi = {
    async users(): Promise<User[]> {
        if (isMock()) { await sleep(300); return mock.mockAdminUsers; }
        const res = await apiClient.get<ApiResponse<User[]>>('/api/users');
        return unwrap(res);
    },
    async toggleStatus(id: number, enabled: boolean): Promise<User> {
        if (isMock()) { await sleep(300); return mock.mockAdminUsers.find(u => u.id === id)!; }
        const res = await apiClient.post<ApiResponse<User>>(`/api/users/${id}/status?enabled=${enabled}`);
        return unwrap(res);
    }
};
