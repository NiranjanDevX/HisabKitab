# HisabKitab Backend

High-performance, async REST API for the HisabKitab personal finance platform. Built with **FastAPI**, **PostgreSQL**, and **Redis**.

## 🚀 Key Features
-   **FastAPI**: Modern, fast (high-performance) web framework.
-   **PostgreSQL**: Robust relational database storage.
-   **Redis & Celery**: Background task processing (Email sending) and Caching (AI insights).
-   **AI Powered**: Gemini Pro integration for:
    -   Natural Language Expense Parsing ("Spent 500 on lunch").
    -   Financial Advice Chatbot with Memory.
    -   Spending Insights & Categorization.
-   **OCR Receipt Scanning**: Extract expense details from images using Tesseract.
-   **Financial Goals**: Track savings targets.
-   **Monitoring**: Prometheus metrics exposed at `/metrics`.

## 🛠 Tech Stack
-   **Language**: Python 3.10+
-   **Framework**: FastAPI
-   **ORM**: SQLAlchemy 2.0 (Async) + Alembic (Migrations)
-   **Auth**: Firebase Admin SDK
-   **Task Queue**: Celery + Redis
-   **OCR**: pytesseract

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/hisabkitab.git
    cd hisabkitab/backend
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in the details:
    ```env
    DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname
    CELERY_BROKER_URL=redis://localhost:6379/0
    GEMINI_API_KEY=your_key
    ...
    ```

3.  **Install Dependencies**
    Using `uv` (recommended) or pip:
    ```bash
    uv sync
    # OR
    pip install -r requirements.txt
    ```

4.  **Run Database Migrations**
    ```bash
    alembic upgrade head
    ```

5.  **Start the Server**
    ```bash
    uv run uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

6.  **Start Background Worker** (Required for Emails)
    ```bash
    celery -A app.core.celery_app worker --loglevel=info
    ```

## 📚 API Documentation
Visit `http://localhost:8000/docs` for the interactive Swagger UI.
