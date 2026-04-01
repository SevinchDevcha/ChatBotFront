# 🎓 EduBot AI — Oliy ta'lim vazirligi Chatbot

Oliy ta'lim, fan va innovatsiyalar vazirligi uchun AI chatbot tizimi.
Muammo №3 yechimine: Vazirlikka turli onlayn platformalar orqali bo'ladigan murojaatlarga avtomatik javob berish.

---

## 📁 Loyiha tuzilmasi

```
edu-chatbot/
├── backend/
│   ├── models/index.js         # Chat va Knowledge modellari
│   ├── routes/
│   │   ├── admin.js            # CEO panel endpointlari
│   │   └── chat.js             # Chat va AI javob endpointlari
│   ├── server.js               # Express server
│   ├── .env.example            # Muhit o'zgaruvchilari namunasi
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx         # Chat tarixi sidebar
    │   │   ├── MessageBubble.jsx   # Xabar pufakchasi
    │   │   └── TypingIndicator.jsx # AI yozmoqda animatsiyasi
    │   ├── pages/
    │   │   ├── ChatPage.jsx        # Asosiy chat sahifasi
    │   │   └── AdminPage.jsx       # CEO admin paneli
    │   ├── services/api.js         # API chaqiruv funksiyalari
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css              # To'liq styling
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Ishga tushirish

### 1. Backend o'rnatish

```bash
cd backend
npm install

# .env fayl yarating
cp .env.example .env
# .env faylga OPENAI_API_KEY kiriting

npm run dev
# Server: http://localhost:8080
```

### 2. Frontend o'rnatish

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

---

## 🔑 .env fayl (backend)

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/edu_chatbot
OPENAI_API_KEY=sk-...sizning_openai_kalitingiz...
```

> MongoDB o'rnatilmagan bo'lsa: https://www.mongodb.com/try/download/community

---

## 🌐 API Endpointlari

| Method | Endpoint                   | Tavsif                                |
|--------|----------------------------|---------------------------------------|
| POST   | /api/chat                  | Foydalanuvchi xabari yuborish         |
| GET    | /api/history/:chatId       | Chat tarixi                           |
| GET    | /api/chats/:userId         | Foydalanuvchi barcha chatlari         |
| POST   | /api/admin/upload          | CEO ma'lumot yuklashi                 |
| GET    | /api/admin/knowledge       | Barcha bilim bazasi yozuvlari         |
| DELETE | /api/admin/knowledge/:id   | Bilim bazasidan yozuv o'chirish       |

---

## 👥 Rollar

- **User** — `http://localhost:3000` — oddiy foydalanuvchi chat interfeysi
- **CEO/Admin** — `http://localhost:3000/admin` — bilim bazasini boshqarish

---

## 🤖 AI qanday ishlaydi?

1. CEO admin paneldan vazirlik hujjatlari, tartiblar, qoidalar kiritadi
2. Foydalanuvchi savol beradi
3. Tizim barcha saqlangan bilimlarni Context sifatida OpenAI ga yuboradi
4. AI faqat yuklangan ma'lumotlar asosida javob qaytaradi
5. Chat tarixi MongoDB da saqlanadi
