import { CreditCard, Wifi } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { accountApi, cardApi } from '@/api/services';
import { formatMoney, formatDate } from '@/lib/utils';
import { Badge, statusVariant } from '@/components/ui/Badge';
import { Spinner, EmptyState } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';
import type { Card as CardType } from '@/types';

export default function CardsPage() {
    const { t } = useI18n();
    const { user } = useAuth();
    const uid = user?.id ?? 2;

    const cards = useFetch(async () => {
        const accs = await accountApi.byUser(uid);
        const lists = await Promise.all(accs.map((a) => cardApi.byAccount(a.id).catch(() => [])));
        return lists.flat();
    }, [uid]);

    return (
        <div>
            <PageHeader title={t('cards')} subtitle={t('issueCardNote')} />
            {cards.loading ? (
                <Spinner />
            ) : !(cards.data ?? []).length ? (
                <EmptyState />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger">
                    {(cards.data ?? []).map((c) => <BankCard key={c.id} card={c} />)}
                </div>
            )}
        </div>
    );
}

function BankCard({ card }: { card: CardType }) {
    const { t } = useI18n();
    return (
        <div className="group relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-brand-800 to-brand-600 p-6 shadow-glow transition hover:scale-[1.02]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff2, transparent 40%)' }} />
            <div className="relative flex h-full flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                    <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-90" />
                    <Wifi className="h-5 w-5 rotate-90 opacity-80" />
                </div>
                <p className="font-mono text-lg tracking-widest" dir="ltr">{card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</p>
                <div className="flex items-end justify-between">
                    <div className="flex gap-5">
                        <div>
                            <p className="text-[10px] uppercase opacity-70">{t('expiry')}</p>
                            <p className="font-mono text-sm" dir="ltr">{formatExpiry(card.expiryDate)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase opacity-70">CVV2</p>
                            <p className="font-mono text-sm" dir="ltr">{card.cvv2 ?? '•••'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={statusVariant(card.status)}>{card.status}</Badge>
                        <CreditCard className="h-7 w-7 opacity-80" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** فرمت تاریخ انقضا به صورت MM/YY (کارت‌مانند). ورودی: "2030-06-30" → "06/30" */
function formatExpiry(date?: string): string {
    if (!date) return '••/••';
    const parts = date.split('-');
    if (parts.length < 2) return date;
    const yy = parts[0].slice(2);
    const mm = parts[1];
    return `${mm}/${yy}`;
}
