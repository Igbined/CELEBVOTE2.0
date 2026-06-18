lucide.createIcons();

const themeToggle = document.getElementById('theme-toggle');
const moonIcon = themeToggle?.querySelector('.theme-icon-moon');
const sunIcon = themeToggle?.querySelector('.theme-icon-sun');

function updateThemeIcon(isDark) {
    moonIcon?.classList.toggle('hidden', isDark);
    sunIcon?.classList.toggle('hidden', !isDark);
}

function setTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initializeTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || saved === 'light') {
        setTheme(saved === 'dark');
    } else {
        setTheme(prefersDark);
    }
}

function startPayment(event) {
    const button = event.currentTarget;
    const card = button.closest('[data-celeb][data-price]');
    if (!card) return;

    const celeb = card.dataset.celeb || card.querySelector('h3')?.textContent.trim();
    const price = Number(card.dataset.price || 0);
    const input = card.querySelector('input[type="number"]');
    const votes = Math.max(1, Number(input?.value || 1));
    const total = votes * price;

    const params = new URLSearchParams({
        celebrity: celeb,
        votes: String(votes),
        price: String(price),
        total: String(total)
    });

    window.location.href = `payment.html?${params.toString()}`;
}

document.querySelectorAll('.confirm-purchase').forEach((button) => {
    button.addEventListener('click', startPayment);
});

themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
});

window.addEventListener('load', initializeTheme);
