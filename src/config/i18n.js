const path = require('path');
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fa'],
  directory: path.join(__dirname, '/locales'), // مسیر فایل‌های زبان
  defaultLocale: 'fa',
});

module.exports = i18n;
