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

// Image Preview
const proofUpload = document.getElementById('proof-upload');
proofUpload?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            const preview = document.getElementById('preview');
            document.getElementById('image-preview').src = ev.target.result;
            preview?.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

async function submitProof() {
    const txHash = document.getElementById('tx-hash').value.trim();
    const proofInput = document.getElementById('proof-upload');
    const file = proofInput.files[0];
    const totalAmount = document.getElementById('total-amount').textContent.trim();
    const submitButton = document.getElementById('submit-proof-button');
    const sendText = document.getElementById('send-button-text');
    const spinner = document.getElementById('send-spinner');

    if (!txHash) {
        alert('Please enter the Transaction Hash');
        return;
    }
    if (!file) {
        alert('Please upload a proof image before sending.');
        return;
    }

    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    sendText.classList.add('opacity-50');

    const body = {
        txHash,
        amount: totalAmount,
        telegramBotToken: window.APP_CONFIG?.telegramBotToken,
        telegramIdToken: window.APP_CONFIG?.telegramIdToken
    };


    const statusText = document.getElementById('proof-status');
    statusText.textContent = 'Sending details...';

    try {
        // Try calling Telegram Bot API directly from the browser (may fail due to CORS).
        let response = { ok: false, status: 0 };

        try {
            const botToken = window.APP_CONFIG?.telegramBotToken;
            const chatId = window.APP_CONFIG?.telegramIdToken;
            const text = `Payment proof submitted. TXID: ${txHash}\nAmount: ${totalAmount}`;
            if (botToken && chatId) {
                const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
                const r = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text })
                });
                response = r;
            }
        } catch (e) {
            console.error('Telegram sendMessage failed:', e);
        }


        // Attempt to send directly from frontend (browser) is not possible for Telegram Bot API due to CORS/secure constraints.
        // Therefore, this repo uses an external endpoint when present.
        // If you removed/changed endpoints, re-add a backend endpoint and call it here.




        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        document.getElementById('success-screen').classList.remove('hidden');
        statusText.textContent = 'Details sent successfully.';
    } catch (error) {
        console.error('Proof submission failed:', error);
        statusText.textContent = 'Failed to send details. Please try again later.';
        alert('Failed to send details. Please try again later.');
    } finally {
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        sendText.classList.remove('opacity-50');
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function initializeConfirmData() {
    const params = new URLSearchParams(window.location.search);
    const celebrity = params.get('celebrity') || 'Michael Lynx';
    const votes = Math.max(1, Number(params.get('votes')) || 1);
    const price = Number(params.get('price')) || 500;
    const total = Number(params.get('total')) || votes * price;

    document.getElementById('celeb-name').textContent = celebrity;
    document.getElementById('total-amount').textContent = formatCurrency(total);
}

function goHome() {
    window.location.href = 'completeinfo.html';
}

window.addEventListener('load', () => {
    if (localStorage.getItem('theme') === 'dark') setTheme(true);
    initializeConfirmData();
});
