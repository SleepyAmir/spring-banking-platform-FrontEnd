export function numberToWords(num: number | string): string {
    if (num === null || num === undefined || num === '') return '';

    // تبدیل به عدد صحیح (بدون اعشار) و رشته کردن
    const numStr = Math.floor(Number(num.toString().replace(/,/g, ''))).toString();
    if (isNaN(Number(numStr))) return '';
    if (numStr === '0') return 'صفر';

    const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const dah = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const bases = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون'];

    function getPart(n: string): string {
        let partStr = '';
        const number = parseInt(n, 10);
        if (number === 0) return '';

        const s = Math.floor(number / 100);
        const d = Math.floor((number % 100) / 10);
        const y = number % 10;

        if (s > 0) partStr += sadgan[s] + ' و ';

        if (d === 1) {
            partStr += dah[y] + ' و ';
        } else {
            if (d > 1) partStr += dahgan[d] + ' و ';
            if (y > 0) partStr += yekan[y] + ' و ';
        }

        return partStr.slice(0, -3);
    }

    const parts = [];
    let n = numStr;
    while (n.length > 0) {
        parts.push(n.slice(-3));
        n = n.slice(0, -3);
    }

    let words = '';
    for (let i = parts.length - 1; i >= 0; i--) {
        const p = getPart(parts[i]);
        if (p) {
            words += p + ' ' + bases[i] + ' و ';
        }
    }

    // پاکسازی فاصله‌های اضافی و حرف « و » از انتهای رشته
    return words.replace(/ و $/, '').trim();
}