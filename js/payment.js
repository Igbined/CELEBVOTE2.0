lucide.createIcons();

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        themeIcon?.setAttribute('data-lucide', 'sun');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon?.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
});

if (localStorage.getItem('theme') === 'dark') setTheme(true);

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function initializePaymentData() {

    const params = new URLSearchParams(window.location.search);
    const celebrity = params.get('celebrity') || 'Michael Lynx';
    const votes = Math.max(1, Number(params.get('votes')) || 1);
    const price = Number(params.get('price')) || 500;
    const total = Number(params.get('total')) || votes * price;

    document.getElementById('celeb-name').textContent = celebrity;
    document.getElementById('vote-qty').textContent = String(votes);
    document.getElementById('total-amount').textContent = formatCurrency(total);
    document.getElementById('modal-celeb').textContent = celebrity;
    document.getElementById('btc-amount').textContent = `${(total / 68000).toFixed(6)} BTC`;
}

function copyAddress(event) {
    const address = document.getElementById('btc-address').textContent.trim();
    navigator.clipboard.writeText(address).then(() => {
        const btn = event.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Copied!`;
        lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = original;
            lucide.createIcons();
        }, 2000);
    });
}

function confirmPayment() {
    window.location.href = 'confirmpayment.html' + window.location.search;
}

function goToDashboard() {
    window.location.href = 'index.html';
}

window.addEventListener('load', () => {
    if (localStorage.getItem('theme') === 'dark') setTheme(true);
    initializePaymentData();
});
