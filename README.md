# 🏦 SpringBank — Frontend (React + Vite + TypeScript)

رابط کاربری مدرن و حرفه‌ای برای پلتفرم بانکی **SpringBank**، با دو پنل جداگانه:

- 👤 **پنل کاربر (User Panel)** — داشبورد، حساب‌ها، کارت‌ها، انتقال وجه، تراکنش‌ها، وام و اقساط، احراز هویت (KYC)، اعلان‌ها.
- 🛡️ **پنل مدیر/کارمند (Admin/Manager Panel)** — نمای کلی، مدیریت کاربران، بررسی KYC، مدیریت وام، هشدارهای تقلب و AML، تراکنش‌های مسدود.

ساخته‌شده با: **React 18 · Vite · TypeScript · Tailwind CSS · React Router · Recharts · Axios** — دوزبانه (فارسی RTL / انگلیسی LTR) با تم تیره‌ی شیشه‌ای.

---

## 🚀 اجرای سریع (در WebStorm یا ترمینال)

```bash
# ۱) نصب وابستگی‌ها
npm install

# ۲) اجرای حالت توسعه
npm run dev
# باز کنید: http://localhost:5173
```

### اجرا در WebStorm
1. `File → Open` و پوشه‌ی `banking-frontend` را باز کنید.
2. WebStorm به‌صورت خودکار `package.json` را می‌شناسد.
3. در پنل **npm** (سمت راست) روی `dev` دابل‌کلیک کنید، یا یک **Run Configuration** از نوع *npm → script: dev* بسازید.

---

## 🎭 حالت دمو (بدون نیاز به بک‌اند)

در صفحه‌ی **ورود**، گزینه‌ی **«حالت دمو»** را روشن کنید تا برنامه با **داده‌ی نمونه** کار کند (نیازی به اجرای بک‌اند نیست). کاربران آماده:

| نقش | نام کاربری | رمز |
|------|-----------|-----|
| کاربر | `customer` | `customer123` |
| مدیر شعبه | `manager` | `manager123` |
| ادمین | `admin` | `admin123` |

> با خاموش‌کردن حالت دمو، همین حساب‌ها به **بک‌اند واقعی** وصل می‌شوند (در حالت `!prod` بک‌اند نیز همین کاربران را seed می‌کند).

---

## 🔌 اتصال به بک‌اند واقعی (اجرای جداگانه و همزمان)

فرانت‌اند و بک‌اند **جدا** اجرا می‌شوند و با هم کار می‌کنند:

1. **بک‌اند را بالا بیاورید** (در پروژه‌ی `spring-banking-platform`):
   ```bash
   # ساده‌ترین راه: Docker Compose (Postgres + RabbitMQ + Redis + سرویس‌ها)
   docker compose up -d
   # یا اجرای دستی هر سرویس با Maven
   ```
   مطمئن شوید **api-gateway** روی پورت `8090` بالاست.

2. **فرانت را اجرا کنید** (`npm run dev`). درخواست‌های `/api/*` به‌صورت خودکار توسط **پروکسی Vite** به `http://localhost:8090` ارسال می‌شوند (تنظیم در `vite.config.ts`) — بدون مشکل CORS.

3. اگر آدرس بک‌اند متفاوت است، فایل `.env` بسازید (از روی `.env.example`):
   ```
   VITE_API_TARGET=http://localhost:8090
   ```

> **نکته‌ی RTL:** اپلیکیشن به‌صورت پیش‌فرض فارسی/RTL است و با دکمه‌ی زبان در بالای صفحه به انگلیسی/LTR سوییچ می‌شود.

---

## 🗺️ نگاشت مسیرها به API بک‌اند

| بخش فرانت | Endpoint بک‌اند (از طریق gateway :8090) |
|-----------|------------------------------------------|
| ورود/ثبت‌نام | `POST /api/auth/login` · `POST /api/auth/register` |
| حساب‌ها | `GET /api/accounts/user/{id}` · `POST /api/accounts/open` |
| کارت‌ها | `GET /api/cards/account/{id}` |
| انتقال/شارژ | `POST /api/transactions` (transaction-write) |
| تراکنش‌ها | `GET /api/transactions` (transaction-read) |
| وام/اقساط | `GET/POST /api/loans...` · `POST /api/loans/installments/{id}/pay` |
| KYC | `POST /api/kyc/{userId}/documents` · `/review` · `/start-review` |
| اعلان‌ها | `GET /api/notifications/user/{id}` |
| تقلب/AML | `GET /api/fraud/alerts...` · `/api/fraud/aml/user/{id}` |
| تحلیل مالی | `GET /api/analytics/user/{id}` |

---

## 📁 ساختار پروژه

```
src/
├── api/            # axios client + لایه‌ی سرویس‌ها + داده‌ی mock
├── components/
│   ├── layout/     # Sidebar + Topbar + نویگیشن
│   └── ui/         # کامپوننت‌های پایه (Card, Badge, Modal, DataTable, ...)
├── context/        # Auth, i18n, Toast
├── hooks/          # useFetch
├── i18n/           # ترجمه‌های فارسی/انگلیسی
├── pages/
│   ├── auth/       # Login, Register
│   ├── user/       # داشبورد و صفحات کاربر
│   └── admin/      # صفحات پنل مدیر
└── types/          # تایپ‌های مشترک با بک‌اند
```

---

## 🛠️ اسکریپت‌ها
```bash
npm run dev       # سرور توسعه (HMR)
npm run build     # build تولیدی در dist/
npm run preview   # پیش‌نمایش build
```

---

ساخته‌شده برای پروژه‌ی **SpringBank Hybrid Architecture** 💙
