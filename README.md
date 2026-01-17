

<p align="center">
  <img src="logos/hisabkitab.png" alt="HisabKitab Logo" width="180"/>
</p>

**HisabKitab** is a modern, open-source expense management platform designed for **web and mobile** users.  
It helps users record, categorize, and analyze daily expenses in a simple, clear, and structured way.

Built using **Next.js**, **FastAPI**, and **Flutter**, HisabKitab provides a seamless experience across devices.

The project is designed for students, individuals living independently, and households who want better control over their day-to-day spending.

---

## 🌟 Key Highlights

- Web + Mobile support
- Clean and minimal UI
- Fast and secure backend APIs
- Voice-based expense entry
- Insightful expense summaries
- Mobile-first & cross-platform
- Public, open-source, and extensible

---

## ✨ Features

### Expense Management
- Add, edit, and delete expenses
- Category-based tracking (Food, Rent, Travel, Utilities, Misc)
- Optional notes for each expense
- Date-based expense history

### Voice Input
- Add expenses using voice commands
- Natural language parsing (e.g. “250 for groceries”)
- Optimized for mobile usage

### Insights & Analytics
- Daily, weekly, and monthly summaries
- Category-wise breakdown
- Spending trends and comparisons

### User Experience
- JWT-based authentication
- Secure API access
- Responsive web dashboard
- Cross-platform mobile app
- Dark mode support

---

## 🧱 Tech Stack

### Frontend (Web)
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Mobile App
- Flutter
- Dart
- REST API integration

### Backend
- FastAPI
- PostgreSQL / MySQL
- SQLAlchemy
- JWT Authentication

---

## 📁 Project Structure

```
hisabkitab/
│
├── frontend/ # Next.js web app
│ ├── app/
│ ├── components/
│ ├── hooks/
│ ├── lib/
│ ├── services/
│ ├── styles/
│ ├── types/
│ └── public/
│
├── mobile/ # Flutter mobile app
│ ├── lib/
│ │ ├── screens/
│ │ ├── widgets/
│ │ ├── services/
│ │ └── models/
│ └── pubspec.yaml
│
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── api/
│ │ ├── core/
│ │ ├── db/
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── services/
│ │ └── main.py
│ ├── tests/
│ └── requirements.txt
│
├── logos/
│ └── hisabkitab.png
│
├── docs/
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Flutter SDK
- PostgreSQL or MySQL
---

### Web App (Frontend)

```bash
cd frontend
npm install
npm run dev
```
### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🔐 Environment Variables

```env
DATABASE_URL=
SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

---

## 🛣️ Roadmap

- Budget limits per category
- Export expenses (CSV / PDF)
- Shared expenses (roommates)
- Receipt upload
- Progressive Web App
- Multi-currency support

---

## 🤝 Contributing

Contributions are welcome.  
Fork the repo, create a branch, and submit a pull request.

---

## 📄 License

MIT License

---

## 📌 Name Origin

**HisabKitab** — A commonly used Nepali phrase meaning *accounts and records*.

---

## 👤 Author

**Niranjan Sah**  
GitHub: https://github.com/niranjansah87
