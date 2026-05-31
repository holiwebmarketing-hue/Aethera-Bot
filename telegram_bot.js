require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🟢 Aethera Engine System is running...');

// 1. أمر الترحيب العام /start
bot.onText(/\/start/, (msg) => {
    const welcome = `<b>مرحباً بك في نظام Aethera الرقمي 🌐</b>\n\n` +
                    `نحن هنا لنقدم لك أدوات تحليل السوق اللحظية.\n` +
                    `استخدم الأمر /price لعرض البيانات.`;
    bot.sendMessage(msg.chat.id, welcome, { parse_mode: 'HTML' });
});

// 2. أمر استعراض السعر مع الأزرار التفاعلية
bot.onText(/\/price/, async (msg) => {
    const chatId = msg.chat.id;
    const priceMessage = `<b>📊 مـؤشـر الـسـوق الـرقـمـي | AETH</b>\n\n` +
                         `💵 <b>السعر:</b> <code>$0.075 USDT</code>\n` +
                         `💧 <b>السيولة:</b> <code>$150,000 USD</code>\n\n` +
                         `<i>نظام المحاكاة نشط - Aethera System</i>`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: "🔄 تحديث السعر", callback_data: 'update_price' },
                { text: "🌐 الموقع الرسمي", url: 'https://aethera.com' }
            ],
            [
                { text: "📈 شراء AETH", url: 'https://pancakeswap.finance' }
            ]
        ]
    };

    bot.sendMessage(chatId, priceMessage, { 
        parse_mode: 'HTML', 
        reply_markup: keyboard 
    });
});

// معالجة ضغط الأزرار
bot.on('callback_query', (query) => {
    if (query.data === 'update_price') {
        bot.answerCallbackQuery(query.id, { text: "تم التحديث بنجاح: $0.075 USDT" });
    }
});

// 3. الترحيب التلقائي بالأعضاء الجدد
bot.on('new_chat_members', (msg) => {
    msg.new_chat_members.forEach((member) => {
        const welcomeText = `<b>أهلاً بك يا ${member.first_name} في مجتمع Aethera! 🌐</b>\n\n` +
                            `سعداء بانضمامك إلينا! نرجو منك اتباع الخطوات التالية لضمان تجربة مميزة:\n\n` +
                            `1️⃣ <b>تابع قناتنا الرسمية:</b> @AetheraSystem\n` +
                            `2️⃣ <b>استعرض السعر:</b> اكتب <code>/price</code>\n` +
                            `3️⃣ <b>الخصوصية:</b> يرجى الالتزام بقوانين النقاش.\n\n` +
                            `<i>مشروع Aethera ينمو بوجودكم!</i>`;
        
        bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
    });
});