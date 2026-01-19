<p align="center">
  <img src="logos/hisabkitab.png" alt="HisabKitab Logo" width="180"/>
</p>

<h1 align="center">HisabKitab</h1>

<p align="center">
  <strong>A modern, open-source multi-platform expense management system</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#contributing">Contributing</a>
</p>

---

**HisabKitab** is a modern, open-source expense management platform designed for **web and mobile** users. It helps users record, categorize, and analyze daily expenses with intelligent automation powered by AI.

Built using **Next.js**, **FastAPI**, and **Flutter**, HisabKitab provides a seamless experience across devices.

The project is designed for students, individuals living independently, and households who want better control over their day-to-day spending.

---

## Key Highlights

- **Multi-Platform** — Web, Mobile (iOS/Android), and Admin Dashboard
- **AI-Powered** — Auto-categorization, smart insights, and AI chat assistant
- **Voice Input** — Add expenses using natural language voice commands
- **Receipt Scanning** — OCR-powered expense extraction from receipts
- **Real-time Analytics** — Interactive charts and spending insights
- **Budget Tracking** — Set limits and get alerts when approaching budget
- **Secure** — JWT authentication, rate limiting, and security headers
- **Open Source** — Public, extensible, and community-driven

---

## Features

### Expense Management
- Add, edit, and delete expenses with bulk operations
- Category-based tracking (Food, Rent, Travel, Utilities, Misc + custom categories)
- Optional notes and tags for each expense
- Date-based expense history with advanced filtering
- Export to CSV and PDF formats

### Voice Input
- Add expenses using voice commands (OpenAI Whisper integration)
- Natural language parsing (e.g., "250 for groceries")
- User confirmation before saving
- Mobile-first optimization

### AI & Smart Features
- **Auto Categorization** — AI-powered expense categorization using Google Gemini
- **Monthly Summaries** — AI-generated spending insights
- **Chat Assistant** — Interactive AI for financial advice
- **OCR Receipt Scanning** — Extract expense data from receipts automatically

### Analytics & Insights
- Daily, weekly, and monthly summaries
- Category-wise breakdown with visualizations
- Spending trends and comparisons
- 3D expense visualizations
- Interactive charts powered by Recharts

### Budget Management
- Set budget limits per category
- Track spending against budgets
- Budget alerts and notifications

### Financial Goals
- Create and track financial goals
- Progress monitoring with milestones

### User Experience
- JWT-based secure authentication
- Responsive web dashboard
- Cross-platform mobile app
- Dark mode support
- Real-time notifications

### Admin Dashboard
- User management and analytics
- System activity monitoring
- Event logging and audit trails
- Platform health monitoring

---

## Tech Stack

### Frontend (Web)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.1.0 | React framework (App Router) |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.3.0 | Styling |
| React Hook Form | 7.50.1 | Form handling |
| Zod | - | Schema validation |
| Recharts | 2.11.0 | Charts & analytics |
| Three.js | 0.161.0 | 3D visualizations |
| Framer Motion | 11.0.3 | Animations |
| Firebase | 12.8.0 | Authentication |
| Axios | 1.6.7 | HTTP client |
| Sentry | 10.34.0 | Error tracking |

### Mobile App
| Technology | Version | Purpose |
|------------|---------|---------|
| Flutter | Latest | Cross-platform framework |
| Dart | >=3.0.0 <4.0.0 | Programming language |
| Provider | - | State management |
| FL Chart | - | Analytics visualization |
| Flutter Secure Storage | - | Credential storage |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.109.0 | Web framework |
| Python | 3.10+ | Programming language |
| SQLAlchemy | 2.0.45 | ORM (async support) |
| PostgreSQL | - | Primary database |
| Alembic | 1.13.1 | Database migrations |
| Celery | 5.6.2 | Task queue |
| Redis | 7.1.0 | Caching & message broker |
| JWT (python-jose) | 3.3.0 | Authentication |
| Pydantic | 2.12.5 | Data validation |

### AI & ML Services
| Service | Purpose |
|---------|---------|
| Google Gemini | Auto-categorization & insights |
| OpenAI Whisper | Voice transcription |
| Tesseract OCR | Receipt scanning |

### Third-Party Integrations
| Service | Purpose |
|---------|---------|
| Firebase | Authentication |
| AWS S3 | Profile picture storage |
| Resend | Email notifications |
| Prometheus | Metrics & monitoring |
| Sentry | Error tracking |

### Admin Panel
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.3 | React framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Recharts | 3.6.0 | Analytics charts |
| Firebase | 12.8.0 | Authentication |

---

## Project Structure

```
HisabKitab/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/   # API route handlers
│   │   ├── core/               # Config, security, exceptions
│   │   ├── db/                 # Database setup
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Custom middleware
│   │   ├── utils/              # Utilities
│   │   └── main.py             # Application entry
│   ├── alembic/                # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # Next.js web application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API clients
│   │   ├── lib/                # Utilities
│   │   ├── styles/             # Global styles
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   ├── package.json
│   └── .env.example
│
├── Admin_panel/                # Next.js admin dashboard
│   ├── src/
│   │   ├── app/                # Admin pages
│   │   ├── components/         # Admin UI components
│   │   ├── services/           # Admin API services
│   │   └── context/            # Auth context
│   ├── package.json
│   └── .env.example
│
├── mobile/                     # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── services/           # API services
│   │   ├── ui/screens/         # App screens
│   │   ├── core/theme/         # App theming
│   │   └── models/             # Data models
│   └── pubspec.yaml
│
├── docs/                       # Documentation
│   ├── HisabKitab_PRD.md       # Product requirements
│   ├── System_Architecture.md  # Architecture guide
│   └── OPEN_SOURCE.md          # Open source guide
│
├── logos/                      # Brand assets
├── reference/                  # Reference materials
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Flutter SDK (for mobile development)
- PostgreSQL database
- Redis (for Celery tasks)
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`
API documentation at: `http://localhost:8000/docs`

### Frontend (Web) Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Admin Panel Setup

```bash
# Navigate to Admin panel
cd Admin_panel

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Admin panel will be available at: `http://localhost:3001`

### Mobile (Flutter) Setup

```bash
# Navigate to mobile
cd mobile

# Get dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build APK (Android)
flutter build apk

# Build IPA (iOS)
flutter build ios
```

---

## Environment Variables

### Backend (.env)

```env
# Application
APP_NAME=HisabKitab
APP_ENV=development
DEBUG=True

# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/hisabkitab

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# Celery & Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxx

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Feature Flags
ENABLE_AI_FEATURES=True
ENABLE_VOICE_INPUT=True
ENABLE_OCR=True

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## API Documentation

### Base URL
`http://localhost:8000/api/v1`

### Main Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| Auth | `/auth` | Login, register, refresh tokens |
| Users | `/users` | User management |
| Expenses | `/expenses` | Expense CRUD operations |
| Categories | `/categories` | Category management |
| Budgets | `/budgets` | Budget management |
| Analytics | `/analytics` | Data analytics & summaries |
| Voice | `/voice` | Voice input processing |
| OCR | `/ocr` | Receipt scanning |
| AI | `/ai` | AI-powered features |
| Goals | `/goals` | Financial goals |
| Notifications | `/notifications` | User notifications |
| Admin | `/admin` | Admin dashboard endpoints |

### Authentication
All endpoints (except auth) require JWT bearer token:
```
Authorization: Bearer <token>
```

Interactive API documentation available at `/docs` (Swagger UI) or `/redoc` (ReDoc).

---

## Database

### Supported Databases
- PostgreSQL (recommended, with async support)
- MySQL

### Migrations
Database migrations are managed with Alembic:

```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

---

## Production Deployment

### Backend
```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend
```bash
npm run build
npm start
```

### Infrastructure Requirements
- PostgreSQL database server
- Redis server for Celery
- Firebase project setup
- AWS S3 bucket (for profile pictures)
- Email service account (Resend)

---

## Roadmap

- [ ] Budget limit enforcements
- [ ] Enhanced CSV/PDF export
- [ ] Shared expense splitting UI
- [ ] Receipt upload improvements
- [ ] Progressive Web App (PWA)
- [ ] Multi-currency support
- [ ] Mobile app deployment (App Store & Play Store)
- [ ] Advanced reporting & analytics

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read the [OPEN_SOURCE.md](docs/OPEN_SOURCE.md) guide for more details.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Name Origin

**HisabKitab** — A commonly used Nepali phrase meaning *accounts and records*.

---

## Author

**Niranjan Sah**
GitHub: [https://github.com/niranjansah87](https://github.com/niranjansah87)
