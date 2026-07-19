Telegram wiring update (frontend).

- js/config.js now includes:
  - telegramBotToken
  - telegramIdToken

- js/confirmpayment.js now sends telegramBotToken + telegramIdToken in the POST body to window.APP_CONFIG.apiEndpoint.

- payment.html and confirmpayment.html attempt to embed telegram creds, but confirmpayment.html needs to be corrected (bot token block got corrupted).

Fix required:
- Restore confirmpayment.html to valid HTML and include the telegram script block before js/confirmpayment.js.

